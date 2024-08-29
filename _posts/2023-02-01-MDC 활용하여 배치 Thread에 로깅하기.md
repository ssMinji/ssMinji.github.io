---
title: MDC를 활용하여 배치 Job의 SQL 쿼리와 배치 정보 함께 로깅하기
date: 2023-02-01 21:05:00 +09:00
categories: [JAVA, Spring batch]
tags:
  [
    java,
    spring batch,
    jobLauncher,
    MDC
  ]
---
# MDC

## 요건

배치 job을 실행시킬 때, requestBody 로 batId만을 넘겨주는데, 배치가 실행되는 모든 과정에서 배치job명을 sql쿼리와 함께 로깅하고자 함

## 문제상황

배치가 내부적으로 run 된 이후에 배치 job명이 로깅되지 않는 문제가 발생했다. SimpleAsyncTaskExecutor로 잡을 실행하며 [joblauncher.run](http://joblauncher.run) 시 별도 thread가 생성되면서. 최초 start 요청 시 들어온 requestBody 정보가 상실되는 것이였다.

### 최초 시도
처음에는 가장 쉽고 간단한 방안을 떠올렸다. sql mapper 파일명이 jobMapper명을 suffix로 붙이도록 내부 naming rule이 정의되어 있었기 때문에, 해당 mapper 파일명을 정제하여 Job명을 추출한 뒤 해당 정보를 로깅하고자 했다. (예를 들면, SimpleJobMapper.xml -> SimpleJob 추출) 하지만 하나의 job에서 여러 sql mapper(다른 job에서 사용하는) 을 호출할 경우 잘못된 Job명으로 로깅될 가능성이 있고, Naming rule을 준수하지 않은 경우가 발생할 수 있기 때문에 다른 해결 방안을 찾아야 했다.

### 2번째 시도
sql interceptor 내에서 임의의 traceId를 uuid로 생성하여 redis 에 저장한 후 batId를 키 값으로 하여 조회하여 로깅하는 방법을 시도했다. 이 방법이 가능할 것이라고 생각했던 이유는 최초 request가 들어왔을 때 Interceptor에서 배치 정보를 redis에 저장하고 나면, 이후에 쿼리가 수행되며 Interceptor를 통하게 되면 redis에 저장된 값을 조회해서 사용할 수 있을 것이라고 생각했다. 
하지만 동일한 db 커넥션을 맺고 있을 때는 동일한 traceId를 공유하나 별도 db 커넥션 시 별도 traceId 가 채번되는 문제가 있었다.. (눙물)

따라서 CommonJobListener 내 beforeJob에서 insertBatExecPtcDtl 등이 수행되는 과정에서는 최초 채번된 traceId와 동일한 traceId를 가지고 배치job명이 tracking되지만, tasklet이 수행되며 untd db 와 커넥션을 맺어 쿼리가 수행되면 별도 traceId가 채번되므로 배치job명 tracking 불가하게 되어, 이또한 해결 방안이 되지 못했다. 

SQL Interceptor 동작 방식에 대해 궁금하다면? &rarr;  

### 해결방안_최최종
자바에서 제공하는 MDC 를 사용하여 문제를 최종적으로 해결할 수 있었다. 상세 해결방안은 아래 내용을 참고 바란다. 

우선, Spring Batch 가 Job을 실행하는 내부 과정에 대해 모른다면, 이 글을 우선 읽어보길 바란다. <br>
&rarr; [Spring Batch Job의 생명 주기와 실행 과정](https://ssminji.github.io/posts/Spring-Batch-%EC%8B%A4%ED%96%89-%EA%B3%BC%EC%A0%95/)

## Batch 모듈의 SQL 에 JobName 함께 로깅하기
MDC 개념에 대해 먼저 알아보도록 하자.
MDC(Mapped Diagnostic Context) 는 자바 로깅 프레임워크(slf4j 등)에서 지원하는, 현재 실행 중인 쓰레드 단위에 메타 정보를 넣고 관리하는 공간이다. 
MDC라는 이름처럼 Map 형태라 (key, value) 형태로 값을 저장한다.
또한 각 스레드는 자체 MDC를 가지기 위해 threadLocal로 구현되어 있다. 동일한 logger를 사용하더라도 로깅한 메시지는 스레드마다 다른 context(MDC) 정보를 가지게 된다. 

### 1단계. BatchAOP를 통해 MDC에 진입점 정보 추가
Spring Batch에서 모든 Job은 JobLauncher.run 에 의해 실행되기 때문에, @Around 포인트컷을 이용해 해당 메서드 실행 전/후로 MDC에 배치 정보를 넣어주도록 개발했다. 
```java
@Aspect
@Component
public class LogAop {
	private static final String BATCH_MDC_KEY = "batch";
	
	@Around("execution(* org.springframework.batch.core.launch.JobLauncher.run(..))")
	public Object putMDC(ProceedingJoinPoint joinPoint) throws Throwable {
		final Object[] args = joinPoint.getArgs();
		final Job job = (Job) args[0]; // 메소드의 첫번째 인자는 job의 인스턴스
		MDC.put(BATCH_MDC_KEY, job.getName());
		return joinPoint.proceed();
	}
}
```

### 2단계. MDC 정보 복제
배치를 별도 Thread에서 실행하는 SimpleAsyncTaskExecutor 를 사용하고 있기 때문에, Thread 전환 시 MDC의 정보 복제가 필요하다. 스레드가 전환될 때 기본적으로는 MDC 정보가 자동으로 복제되지 않기 때문이다. 이 때, 스레드풀 내에서는 taskDecorator 를 사용할 수 있다. 해당 taskDecorator 는 Spring의 ThreadpoolTaskExecutor 에서 제공해주는 기능으로, 스레드풀에서 실행되는 각 테스크를 래핑하는데 사용된다. 따라서 실행되는 테스크에 대해 threadLocal 내 정보를 복제하는 등의 커스텀 로직을 적용할 수 있다. 

따라서, 신규 MDCCopyTaskDecorator 클래스를 생성한다.

```java

import java.util.Map;
import org.slf4j.MDC;
import org.springframework.core.task.TaskDecorator;

public class MDCCopyTaskDecorator implements TaskDecorator {
	@Override
	public Runnable decorate(Runnable runnable) {
		Map<String, String> contextMap = MDC.getCopyOfContextMap();
		return () -> {
			try{
				if(contextMap != null) {
					MDC.setContextMap(contextMap);
				}
				runnable.run();
			} finally {
				MDC.clear();
			}
		}
	}
}
```

decorate 메소드는 말그대로 데코레이터 패턴이 사용된다. MDC.getCopyOfContextMap() 으로 이전 스레드의 MDC Map 정보를 가져오고, 전환된 스레드에 해당 Map정보를 그대로 세팅해준다. 

해당 taskDecorator 를 jobLauncher의 taskExecutor에 적용해준다. 

```java
@Override
public JobLauncher createJobLauncher() throws Exception {
	SimpleJobLauncher jobLauncher = new SimpleJobLauncher();
	jobLaucher.setJobRepository(jobRepository);
	SimpleAsyncTaskExecutor taskExecutor = new SimpleAsyncTaskExecutor(); // laucher를 async로 호출
	taskExecutor.setTaskDecorator(new MDCCopyTaskDecorator()); //여기서 복제가 이루어짐 
	jobLauncher.setTaskExecutor(taskExecutor);
	jobLauncher.afterPropertiesSet();
	return jobLauncher;
}
```

### 3단계. 전환된 스레드에서 MDC 정보 사용

```java
@Intercepts(
	{
		@Signature(
			type = Executor.class, methos = "update", args = {MappedStatement.class, Object.class}
		), 
		@Signature(
			type = Executor.class, methos = "query", args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class}
		)
	}
)
public class SqlLogInterceptor implements Interceptor {
	private final BatchLogger logger = BatchLogManager.getLogger(this.getClass());
	private static final String BATCH_MDC_KEY = "batch";

	@Override
	public Object intercept(Invocation invocation) throws Throwable {
		if(BeanUtil.IsLog()) {
			AtomicReference<String> requestBody = new AtomicReference<>(HttpServletUtil.getRequestBody());
			AtomicReference<String> batId = new AtomicReference<>("");
			JSONParser jsonParser = new JSONParser();
			String batchJobMDC = MDC.get(BATCH_MDC_KEY); // MDC 정보 가져옴 
			String batJobNm = "";

			if(batchJobMDC != null) {
				batJobNm = batchJobMDC;
			} 

			// ... 중략

			logger.batchCo(LogLevel.INFO, batJobNm, sql); // 로깅 
		}
		return invocation.proceed();
	}
}
```

## 회고
분명 해결 방법이 있을 것 같았지만, 어떤 키워드로 구글링을 해야할지조차 몰랐기 때문에 해결방법에 도달하는데 많은 시간이 걸렸다. 디버깅을 하는데 최초 request가 들고있는 requestBody가 Job이 실행되며 사라지는 현상 때문에 미쳐도라방스 상황에 마주할 수 밖에 없었다. 하지만 덕분에 Spring Batch의 Job이 실행되는 내부 과정과 Interceptor의 동작 과정을 심도있게 공부할 수 있었다. 
Job이 실행되며 별도 Thread가 생성되고, Thread 간 정보를 공유할 수 있으면 해결될 것 같은데..? 라는 결론에 도달하고 [우아한 형제들 기술 블로그](https://techblog.woowahan.com/13429/) 를 발견했을 때 감격의 눈물이 앞을 가렸다. 나도 블로그를 운영하며 기록을 남기고, 다른 사람들과 공유해야겠다.. 라는 생각을 하게 된 가장 큰 계기가 되었다. 

## 참고
- [우아한형제들 기술 블로그 - 로그 및 SQL 진입점 정보 추가 여정](https://techblog.woowahan.com/13429/)