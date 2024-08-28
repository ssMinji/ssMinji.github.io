---
title: MDC를 활용하여 배치 Thread에 로깅하기
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

### 요건

배치 job을 실행시킬 때, requestBody 로 batId만을 넘겨주는데, 배치가 실행되는 모든 과정에서 배치job명을 sql쿼리와 함께 로깅하고자 함

### 문제상황

배치가 내부적으로 run 된 이후에 배치 job명이 로깅되지 않음. [joblauncher.run](http://joblauncher.run) 시 별도 thread 생성됨(SimpleAsyncTaskExecutor). 따라서 최초 start 요청 시 들어온 requestBody 상실

sql interceptor 내에서 traceId 생성하여 redis 에 저장한 후 batId를 키 값으로 하여 조회하여 로깅하는 방법을 시도했으나, 별도 Thread 내에서 batch db 커넥션을 맺고 있을 때는 동일한 traceId를 공유하나 untd db 커넥션 시 별도 traceId 가 채번되었음. 

따라서 CommonJobListener 내 beforeJob에서 insertBatExecPtcDtl 등이 수행되는 과정에서는 최초 채번된 traceId와 동일한 traceId를 가지고 배치job명이 tracking되지만, tasklet이 수행되며 untd db 와 커넥션을 맺어 쿼리가 수행되면 별도 traceId가 채번되므로 배치job명 tracking 불가.

다른 방안으로 sql mapper 명(jobMapper를 suffix로 붙이도록 naming rule 정의됨)으로 Job명 추출하고자 했으나, 하나의 job에서 여러 sql mapper(다른 job에서 사용하는) 을 호출할 수 있기 때문에 불가능.

### Batch 모듈의 SQL 에 JobName 함께 로깅하기

[MDC를 이용한 batch 모듈의 SQL에 jobName 함께 로깅하기] 

MDC(Mapped Diagnostic Context) 는 자바 로깅 프레임워크(slf4j 등)에서 지원하는, 현재 실행 중인 쓰레드 단위에 메타 정보를 넣고 관리하는 공간이다. 

MDC라는 이름처럼 Map 형태라 (key, value) 형태로 값을 저장한다.

또한 각 스레드는 자체 MDC를 가지기 위해 threadLocal로 구현되어 있다. 동일한 logger를 사용하더라도 로깅한 메시지는 스레드마다 다른 context(MDC) 정보를 가지게 된다. 

### 1단계. BatchAOP를 통해 MDC에 진입점 정보 추가

```java
@Aspect
@Component
public class HShopLogAop {
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

배치가 별도 스레드에서 실행하는 SimpleAsyncTaskExecutor 를 사용하고 있기 때문에, 스레드 전환 시 MDC의 정보복제가 필요하다. 스레드가 전환될 때 기본적으로 MDC 정보가 자동으로 복제되지 않기 때문이다. 이 때, 스레드풀 내에서는 taskDecorator 를 사용할 수 있다. 해당 taskDecorator 는 Spring의 ThreadpoolTaskExecutor 에서 제공해주는 기능으로, 스레드풀에서 실행되는 각 테스크를 래핑하는데 사용된다. 따라서 실행되는 테스크에 대해 threadLocal 내 정보를 복제하는 등의 커스텀 로직을 적용할 수 있다. 

따라서, 신규 HShopMDCCopyTaskDecorator 클래스를 생성한다.

```java
package hshop.core.log;

import java.util.Map;
import org.slf4j.MDC;
import org.springframework.core.task.TaskDecorator;

public class HShopMDCCopyTaskDecorator implements TaskDecorator {
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

```jsx
@Override
public JobLauncher createJobLauncher() throws Exception {
	SimpleJobLauncher jobLauncher = new SimpleJobLauncher();
	jobLaucher.setJobRepository(jobRepository);
	SimpleAsyncTaskExecutor taskExecutor = new SimpleAsyncTaskExecutor(); // laucher를 async로 호출
	taskExecutor.setTaskDecorator(new HShopMDCCopyTaskDecorator()); //여기서 복제가 이루어짐 
	jobLauncher.setTaskExecutor(taskExecutor);
	jobLauncher.afterPropertiesSet();
	return jobLauncher;
}
```

### 3단계. 전환된 스레드에서 MDC 정보 사용

```jsx
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
public class HShopSqlLogInterceptor implements Interceptor {
	private final HShopBatchLogger hShopLogger = HShopBatchLogManager.getLogger(this.getClass());
	private static final String BATCH_MDC_KEY = "batch";

	@Override
	public Object intercept(Invocation invocation) throws Throwable {
		if(HShopBeanUtil.IsLog()) {
			AtomicReference<String> requestBody = new AtomicReference<>(HShopHttpServletUtil.getRequestBody());
			AtomicReference<String> batId = new AtomicReference<>("");
			JSONParser jsonParser = new JSONParser();
			String batchJobMDC = MDC.get(BATCH_MDC_KEY); // MDC 정보 가져옴 
			String batJobNm = "";

			if(batchJobMDC != null) {
				batJobNm = batchJobMDC;
			} 
			// ... 중략
			hShopLogger.batchCo(LogLevel.INFO, batJobNm, sql); // 로깅 
		}
		return invocation.proceed();

	}
}
```