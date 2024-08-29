---
title: mybatis Interceptor 적용
date: 2021-07-04 19:07:00 +09:00
categories: [JAVA, Spring]
tags:
  [
    java,
    spring,
    Interceptor,
	mybatis
  ]
---
## mybatis Interceptor 사용하여 실행 쿼리 로깅하기
mybatis Interceptor를 등록하면 DB 쿼리 실행 전/후로 등록한 Interceptor를 수행하여 특정 작업을 할 수 있다. 내 경우에는 실행된 쿼리문을 로깅하는데 사용했다.  

## 설정 방법
### mybatis-config.xml 생성
아래와 같은 설정 파일을 생성하고, plugins 밑에 interceptor 클래스를 등록해준다. 
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <settings>
        <setting name="mapUnderscoreToCamelCase" value="true" />
        <setting name="callSettersOnNulls" value="true" />
        <setting name="jdbcTypeForNull" value="NULL" />
    </settings>
    <typeAliases>
        <typeAlias alias="sql" type="java.util.HashMap"/>
    </typeAliases>
    <typeHandlers>
        <typeHandler javaType="java.lang.String" jdbcType="CLOB" handler="org.apache.ibatis.type.ClobTypeHandler" />
    </typeHandlers>
    <plugins>
        <plugin interceptor="com.sdp.common.interceptor.MybatisExecuteInterceptor"/>
    </plugins>
</configuration>
```
### Interceptor 정의
Interceptor 인터페이스를 구현하고 @Intercepts, @Signature 어노테이션을 붙여준다. 
- @Intercepts: Executor 실행 과정 중 가로챌 대상을 정의한다. 
- @Signature: mybatis에서 제공하는 Executor와 Intercept 하고자 하는 메서드명을 명시한다. 
	- type: Executor라는 인터페이스는 mybatis의 xml 파일에 작성된 SQL을 실행 
	- method: insert/update/delete가 실행되면 Executor의 update 메서드를 호출하며 select는 query메서드를 호출한다. 아래 코드에서는 update와 query를 모두 지정하였기 때문에 모든 쿼리에서 작동하는 것을 알 수 있다. 
	- args: 공통적으로 MapperStatement 객체가 Object[] 타입의 인덱스 0번에 필수로 저장된다. 여기에 xml 메타정보가 담겨있다. 

Interceptor Class 생성 시 Override 되는 메서드에서 주의할 점은 아래와 같이 proceed() 와 Object.wrap()을 반드시 선언해주어야 한다. 
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

	@Override
    public Object plugin(Object target) {
    
    	// 아래와 같이 plugin에 등록
        return Plugin.wrap(target, this);
    }
}
```

추가로 위처럼 config파일을 따로 작성했다면 SqlSessionFactory에서 setConfigLocation으로 해당 파일 위치를 등록해주어야 한다. 

```java
@Configuration
@MapperScan(basePackages = {"com.sdp.common", "com.sdp.mapper"}, sqlSessionFactoryRef="sdpSqlSessionFactory" )
public class SdpDataSourceConfig {

   @Value("${spring.mybatis.common.config}")
   private String mybatisConfig;

   @Value("${spring.mybatis.common.mapper}")
   private String mybatisMapper;

   @Autowired
   ApplicationContext applicationContext;

   @Bean(name="dataSource", destroyMethod="close")
   @Primary
   @ConfigurationProperties(prefix="spring.sdp.datasource")
   public DataSource sdpDataSource() {
      return DataSourceBuilder.create().build();
   }

   @Bean(name="sdpSqlSessionFactory")
   @Primary
   public SqlSessionFactory sdpSqlSessionFacotry(@Qualifier("dataSource") DataSource sdpDataSource) throws Exception {
      SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
      sqlSessionFactoryBean.setDataSource(sdpDataSource);
      sqlSessionFactoryBean.setConfigLocation(applicationContext.getResource(mybatisConfig));
      sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources(mybatisMapper));

      return sqlSessionFactoryBean.getObject();
   }

   @Bean
   @Primary
   public SqlSessionTemplate sdpSqlSessionTemplate(SqlSessionFactory sdpSqlSessionFactory) throws Exception {
      SqlSessionTemplate sqlSessionTemplate = new SqlSessionTemplate(sdpSqlSessionFactory);
      sqlSessionTemplate.getConfiguration().setMapUnderscoreToCamelCase(true);

      return sqlSessionTemplate;
   }
}
```
