---
title: Spring Interceptor & Filter & AOP
date: 2021-07-03 20:15:00 +09:00
categories: [JAVA, Spring]
tags:
  [
    java,
    spring,
    Interceptor,
    Filter,
    AOP
  ]
---

## Interceptor 동작 방식
![img](/assets/img/blog/blog-2021-12-07.jpg)*[이미지 출처](https://livenow14.tistory.com/61)*

### DispatcherServlet
- Spring MVC 구조의 핵심 객체
- HttpServlet을 상속받아 Servlet으로 동작
- Spring Boot는 DispatcherServlet을 Servlet으로 자동 등록하면서 모든 경로에 대해서 매핑
- doDispatch()를 호출함으로써 클라이언트의 요청을 처리

### HandlerMapping
- Handler에 대한 매핑 정보를 가지고 있는 객체
- 요청에 알맞은 Handler를 찾아 반환

### HandlerAdapter
- HandlerMapping에서 받아온 Handler를 처리해주는 객체

Spring Container가 동작하는 흐름을 살펴보면, Spring Interceptor는 Handler Mapping 이후 Handler Adaptor 전/후 과정에서 수행된다. 
Interceptor는 이름에서 알 수 있듯이, Handler Mapping이 결정한 Handler(컨트롤러)를 Handler Adapter 수행 전/후로 가로채서 추가적인 작업을 할 때 사용된다. 인터셉터는 스프링의 모든 Bean 객체에 접근할 수 있고, 여러 개를 사용할 수 있으며 로그인 체크, 권한체크, 프로그램 실행시간 계산작업, 로그확인 등의 업무처리에 사용돤다. 
따라서 Handler(컨트롤러)의 수정없이 Handler 수행 전/후 처리 동작을 정의하여 컨트롤러 내 **반복적인 코드를 제거**하고 **공통적인 프로세스를 처리**할 수 있다.

1. preHandler()&rarr;컨트롤러 메서드가 실행되기 전
2. postHandler()&rarr;컨트롤러 메서드 실행 직 후 view 페이지 렌더링 되기 전
3. afterCompletion()&rarr;view페이지가 렌더링 되고 난 후


## Filter, Interceptor, AOP 
Interceptor 와 유사한 기능을 하는 것으로 Filter와 AOP가 있는데, 각각의 차이에 대해 알아보려고 한다.
위 그림에서 알 수 있 듯, Interceptor와 Filter는 Servlet 단위에서 실행된다. 반면 AOP는 메소드 앞에 Proxy 패턴의 형태로 실행된다. 실행 순서를 보면 Filter가 가장 바깥에 있고, 그 뒤에 Interceptor와 AOP가 있다. (Filter&rarr;Interceptor&rarr;AOP&rarr;Interceptor&rarr;Filter)
1. 서버를 실행시켜 Servlet이 올라오는 동안에 init이 실행되고, 그 후 doFilter가 실행
2. 컨트롤러에 들어가기 전 preHandler가 실행
3. 컨트롤러에서 나와 postHandler, afterCompletion, doFilter 순으로 진행
4. Servlet 종료 시 destroy 실행 

## Filter
Filter는 요청과 응답을 거른 뒤 정제하는 역할을 한다. Servlet Filter는 DispatcherServlet 이전에 실행이 되는데 필터가 동작하도록 지정된 자원의 앞단에서 요청 내용을 변경하거나, 여러가지 체크를 수행한다. 또한 자원의 처리가 끝난 후 응답 내용에 대해서도 변경하는 처리를 할 수 있다. 일반적으로는 인코딩 변환 처리, XSS 방어 등의 요청에 대한 처리로 사용된다. 

1. init()&rarr;필터 인스턴스 초기화
2. doFilter()&rarr;전/후 처리
3. destroy()&rarr;필터 인스턴스 종료

## AOP(Aspect Oriented Programming)
AOP는 OOP를 보완하기 위해 나온 개념으로, 객체 지향 프로그래밍을 했을 때 중복을 줄일 수 없는 부분을 보완하기 위해 종단면(관점)에서 바라보고 처리한다. 
주로 '로깅', '트랜젝션', '에러 처리' 등 비즈니스 단의 메서드에서 조금 더 세밀하게 조정하고 싶을 때 사용한다. Interceptor나 Filter와 달리 메서드 전/후의 지점에 자유롭게 설정이 가능하다. Interceptor와 Filter는 주소로 대상을 구분해서 걸러내야 하는 반면, AOP는 주소, 파라미터, 어노테이션 등 다양한 방법으로 대상을 지정할 수 있다. 
AOP의 Advice와 HandlerInterceptor의 가장 큰 차이는 파라미터의 차이인데, Advice(부가 기능)의 경우 JoinPoint나 ProceedingJoinPoint 등을 활용해서 호출하는 반면 HandlerInterceptor는 Filter와 유사하게 HttpServletRequest, HttpServletResponse를 파라미터로 사용한다.

AOP의 포인트컷(Advice를 어디에 적용할지, 적용하지 않을 지 위치를 판단하기 위해 필터링 하는 기능)
1. @Before&rarr;대상 메서드 수행 전
2. @After&rarr;대상 메서드 수행 후
3. @After-returning&rarr;대상 메서드의 정상 수행 후
4. @After-throwing&rarr;예외발생 후
5. @Around&rarr;대상 메서드의 수행 전/후

### 사용 예시
아래는 Spring Batch 에서 배치가 실행될 때마다 특정 작업을 해주기 위해 작성한 AOP이다. Spring Batch에서 모든 Job은 JobLauncher.run 에 의해 실행되기 때문에, @Around 포인트컷을 이용해 해당 메서드 실행 전/후 작업을 해주도록 설정했다. 
스프링 AOP는 스프링 컨테이너에 @Aspect 어노테이션을 적용해야 한다. 그러면 AnnotationAwareAspectJAutoProxyCreator라는 자동 프록시 생성기가 @Aspect 어노테이션이 붙은 클래스를 Advisor(어드바이저)로 변환하여 저장하고, Advisor(어드바이저)를 자동으로 찾아 프록시를 생성하고 포인트컷을 보고 프록시가 필요한 곳에 Advice를 적용해준다. 
@Around 를 사용할 경우 메서드의 파라미터로 ProceedingJoinPoint를 반드시 넣어주어야 한다. ProceedingJoinPoint의 proceed()는 다음 어드바이스나 타겟을 호출하는 것으로, 어드바이스를 사용하기 위해서는 반드시 proceed() 메서드를 호출해야 한다. 

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

### 다음 글
[Mybatis Interceptor 적용]()

### 참고
- [https://jaehee1007.tistory.com/3](https://jaehee1007.tistory.com/3)
- [https://goddaehee.tistory.com/154](https://goddaehee.tistory.com/154)




