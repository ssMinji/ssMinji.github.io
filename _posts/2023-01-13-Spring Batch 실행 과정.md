---
title: Spring Batch Job의 생명 주기와 실행 과정
date: 2023-01-13 18:05:00 +09:00
categories: [JAVA, Spring batch]
tags:
  [
    java,
    spring batch,
    jobLauncher
  ]
---

### Job의 생명주기

배치 Job의 실행은 Job runner에서 시작된다. Job runner는 잡 이름과 여러 파라미터를 받아들여 잡을 실행시키는 역할을 한다. 

- CommandLineRunner: 스크립트를 이용하거나 명령행에서 직접 잡을 실행할 때 사용
- JobRegistryBackgroundJobRunner: 스프링을 부트스트랩에서 시동한 자바 프로세스 내에서 쿼츠가 jmx 후크와 같은 스케쥴러를 이용해 잡을 실행한다면, 스프링이 부트스트랩 될 때 실행가능한 잡을 가지고 있는 jobregistry를 생성함.
- JobLauncherCommandLineRunner: 스프링부트에서 제공하는 잡을 시작하는 또다른 방법. CommandLineRunner 구현체는 별도의 구성이 없다면 기본적으로 ApplicationContext에 정의된 Job 타입의 모든 빈을 기동시에 실행한다. 사용자가 spring batch를 실행할 때 잡 러너를 사용하긴 하지만, 잡 러너는 프레임워크가 제공하는 표준 모듈이 아님. 실제로는 프레임워크를 실행할 때 실제 진입점은 잡 러너가 아닌 jobLauncher 인터페이스의 구현체.

Spring Batch 는 SimpleJobLauncher라는 단일 JobLauncher만 제공함. CommandLineRunner와 JobLauncherCommandLineRunner 내부에서 사용하는 이 클래스는 요청된 잡을 실행할 때 코어 스프링의 TaskExecutor 인터페이스를 사용한다. 스프링에서 TaskExecutor를 구성하는 방법에 여러가지가 있는데, SyncTaskExecutor를 사용하면 잡은 JobLauncher와 동일한 스레드에서 실행된다.

```java
@Override
public JobLauncher createJobLauncher() throws Exception {
	SimpleJobLauncher jobLauncher = new SimpleJobLauncher();
	jobLauncher.setJobRepository(jobRepository);
	jobLauncher.setTaskExecutor(new SimpleAsyncTaskExecutor()); // launcher를 async로 호출(별도의 스레드에서 진행)
	jobLauncher.afterPropertiesSet();
	return jobLauncher;
}
```

### Job 실행 Step

1. 배치 job이 실행되면 job instance 가 생성됨. Job instance는 잡의 논리적 실행을 나타내며 두 가지 항목으로 식별됨. 하나는 잡 이름이고, 하나는 잡에 전달되어 실행 시에 사용되는 식별 파라미터.
    
    잡의 실행과 잡의 실행시도는 다른 개념인데, 예를 들어 매일 실행될 것으로 예상되는 잡이 있을 때 잡 구성은 한 번만 한다. 그리고, 날짜와 같은 매일 새로운 파라미터를 잡에게 전달해 실행함으로써 새로운 job instance를 얻는다. 이 때 각 job instance 는 성공적으로 완료된 jobExecution이 있다면 완료된 것으로 간주된다.
    
2. 잡 실행을 시도할 때 스프링 배치가 job instance의 상태를 어떻게 알아내는가?
    1. job repository가 사용하는 db의 BATCH_JOB_INSTANCE 테이블을 통해 확인한다. 나머지 테이블은 이 테이블을 기반으로 파생되는데, Job instance를 식별할 때 BATCH_JOB_INSTANCE와 BATCH_JOB_EXECUTION_PARAMS 테이블을 사용한다.
3. Job execution 은 잡 실행의 실제 시도를 의미. 잡이 처음부터 끝까지 단번에 실행 완료되었다면 해당 Job instance와 jobExecution은 단 한 번 씩만 존재하게 된다. 첫 번째 잡 실행 후 오류상태로 종료되었다면, 해당 job instance를 실행하려고 시도할 때마다 새로운 Job execution이 생성된다. 이때 job instance에는 동일한 식별 파라미터가 전달된다. 스프링배치가 잡을 실행할 때 생성하는 각 job execution은 BATCH_JOB_EXECUTION 테이블의 레코드로 저장된다. 또 job execution이 실행될 떄의 상태는 BATCH_JOB_EXECUTION_CONTEXT 에 저장된다. 잡에 오류가 발생하면 스프링배치는 이 정보를 이용해 올바를 지점에서부터 다시 잡 시작 가능하다
