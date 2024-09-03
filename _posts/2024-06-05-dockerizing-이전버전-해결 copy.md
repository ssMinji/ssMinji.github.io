---
title: 도커라이징(Dockerizing) 시 이전 버전의 java class 소스로 build되는 이슈 해결
date: 2024-06-05 14:43:00 +09:00
categories: [Trouble Shooting, Docker]
tags:
  [
    docker,
    issue
  ]
---
## 현상 확인
아래와 같이 Dockerfile을 작성한 후 소스를 Dockerizing 했을 때 소스 최신화가 안되는 이슈가 발생하였다. 
```bash
FROM bellsoft/liberica-openjdk-alpine:17

CMD ["./gradlew", "clean", "build"]

VOLUME /tmp

ARG JAR_FILE=build/libs/app.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
```
Dockerizing 이 완료된 이미지를 실행시켜 컨테이너 안으로 들어가서 확인해보니 신규 버전의 소스로 새롭게 빌드된 jar 파일이 아닌 이전 버전의 jar 파일이 `COPY` 되어 Dockerizing 된 것을 알 수 있었다. 

## 원인 분석
### 1. CMD vs RUN
### RUN 명령어
`RUN`은 Docker 이미지를 빌드하는 과정에서 명령어를 실행할 때 사용된다. 예를 들어 시스템 패키지를 설치하거나, 애플리케이션을 빌드하는 등의 작업을 수행하며, 이 작업 결과는 이미지에 저장된다. 
### CMD 명령어
`CMD`는 컨테이너가 시작될 떄 기본적으로 실행할 명령어를 지정하며, 이미지를 빌드하는 단계에서는 아무런 영향을 미치지 않는다. 
### 요약
위 Dockerfile에서 `COPY`된 것은 기존에 로컬에 빌드되어 있던 jar 파일이지 신규 소스를 새롭게 빌드하여 생성한 jar 파일이 아니다. `CMD ["./gradlew", "clean", "build"]` 로 소스를 빌드한 후 결과물을 `COPY`한다고 생각했지만, 사실은 빌드과정에서 `COPY`가 실행되며 기존 Old 버전의 로컬 jar 파일이 COPY 된 것이고 컨테이너 실행 시점에 수행된 `CMD`는 아무 영향을 주지 못했던 것이다. 
### 2. 멀티스테이지
그렇다고 위의 Dockerfile에서 `CMD` 부분만 `RUN`으로 바꿔주면 되느냐? 아니다. 바꿔서 실행했을 때 여전히 기존에 로컬에 빌드되어 있던 jar 파일이 `COPY`되는 것을 알 수 있다.  
우리가 원하는 것은 이미지 내에서 빌드가 수행 및 완료되고 그 결과물이 `COPY`되는 것을 원하는 것이다.  
그러기 위해서는 빌드와 실행 환경을 명확히 분리할 필요가 있으며 이를 위해 사용하는 것이 멀티스테이지이다. 
Dockerfile에서 멀티스테이지는 `FROM ... AS build`로 **멀티스테이지 빌드**를 구현할 수 있으며, `AS build`에서 지정한 `build`는 현재 스테이지의 이름을 지정하는 것이다. 이 이름은 나중에 다른 스테이지에서 참조할 수 있다. 
아래 Dockerfile 내 작성된 주석을 보면 사용 방법이 이해될 것이다. 
```bash
# 첫 번째 스테이지: 빌드 스테이지
FROM gradle:7.5-jdk17 AS build

# 소스 코드를 복사하고 Gradle로 빌드
COPY . .
RUN ./gradlew clean build

VOLUME /tmp

# 두 번째 스테이지: 최종 실행 이미지
FROM bellsoft/liberica-openjdk-alpine:17
# 첫 번째 스테이지에서 생성된 빌드 결과물을 복사
COPY --from=build /build/libs/app.jar /app.jar

# 컨테이너가 실행될 때 JAR 파일을 실행
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```
### 3. WORKDIR 
그럼 멀티스테이지까지 적용했으니 이제 잘 되느냐? 아니다. 위 Dockerfile을 사용해 이미지 빌드 시 `"/build/libs/app.jar": not found` 에러가 발생할 것이다. 왜 빌드 결과물을 찾지 못하는걸까? 이는 docker의 공식 문서를 살펴보면 알 수 있다. 
![img](/assets/img/blog/blog-2024-06-05.jpg)*[Docker 공식 문서 발췌](https://docs.docker.com/reference/dockerfile/#workdir)*
요약하자면, `WORKDIR`은 따로 지정하지 않을 때 디폴트로 `/`로 설정이 되나, 사용하고 있는 베이스 이미지에 따라 세팅이 될 수 있기 때문에 `WORKDIR`을 명시적으로 지정하라고 가이드하고 있다. 
즉, 우리가 `WORKDIR`을 명시하지 않았던 것이 우리가 jar파일이 있을 것이라고 예상한 위치에서 `not found` 에러가 났던 이유라고 추론할 수 있다. 따라서 `WORKDIR`을 `/`로 명시적으로 추가해주면 되고, 최종 파일은 아래와 같다. 
## 최종 Dockerfile
```bash
FROM gradle:7.5-jdk17 AS build
WORKDIR /
COPY . .
RUN ./gradlew clean build

VOLUME /tmp

FROM bellsoft/liberica-openjdk-alpine:17
WORKDIR /
COPY --from=build /build/libs/app.jar /app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

## 회고
Dockerfile 작성에 대한 가이드 문서를 읽기에 앞서 Dockerfile이 작성된 순서대로 line-by-line으로 실행될 것이라고 예상한 것이 잘못이었다. 공식 문서(*및 chatGPT*)를 통해 각 커맨드에 대한 사용법과 멀티스테이지가 왜 필요하고, 어떻게 사용하는지에 대해 알 수 있었다. **정답은 늘 공식 문서에...**