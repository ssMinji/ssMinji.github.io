---
layout: post
title: "Mybatis 개념 정리"
---

- [Spring] mapper 이용한 XML을 이용한 쿼리 실행

VO클래스 생성 → DAO 클래스 생성 → XML 파일 생성 

설정파일에 sqlSession 추가(sqlSessionTemplate 설정)

- [MyBatis] MyBatis란?

기존 JDBC를 이용하여 프로그래밍 하는 방식에 비해 MyBatis는 개바자의 부담을 줄여주고 생산성 향상에도 도움이 된다. 기존 JDBC를 이용하던 방식은 자바 소스 안에 sql문을 작성하는 방식이였지만, MyBatis에서는 sql을 xml파일에 작성하기 때문에 sql의 변환이 자유롭고, 가독성이 좋다 

개발자가 지정한 sql, 저장프로시저, 몇가지 고급 매핑을 지원하는 퍼시스턴스 프레임워크

- [MyBatis] 반복되는 쿼리묶기 위한 sql, include

ex) <sql id="a"></sql> 

<include refid="a" />

- DAO 는 인터페이스로 필요한 서비스들의 목록을 나열한다. 인터페이스는 내부에 메소드 본체를 가질 수 없다. 필요한 메소드 헤더만 저의하고 이를 구현하는 클래스(Service)에서 본체를 구현할 수 있다.
- [Autowired] new로 객체 생성없이 하기 위해 @Autowired써줌. 자동적으로 객체를 만들어주고 사용할 수 있게 해주는 것을 의존성 주입이라고 함. xml파일에서 beans에 DAO와 Service 등록해줘야 @Autowired 가능

    즉, 객체 생성없이 바로 testDAO.methodName()으로 이용 가능 

