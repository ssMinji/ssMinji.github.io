---
title: Ubuntu v20.04 환경에 Gradle 설치
date: 2024-07-25 12:13:00 +09:00
categories: [OS, Ubuntu]
tags:
  [
    os,
    ubuntu,
    build,
    gradle,
    gradlew
  ]
---

## Ubuntu v20.04 환경에 Gradle 설치
Ubuntu v20.04 에 Gradle을 설치해보자. 

### 1. wget 설치하기
```bash
sudo apt install wget
```

apt를 이용해서 Gradle을 설치하는 방식은 우리가 원하는 버전의 Gradle을 설치 할 수 없으므로 wget을 이용할 것이다. wget이 설치되어 있지 않다면, 위 명령어를 이용해서 wget을 설치해주자. 이미 wget이 설치되어 있다면 생략 가능하다.

### 2. 설치할 버전의 Gradle zip파일 다운로드

```bash
wget https://services.gradle.org/distributions/gradle-7.5.1-bin.zip -P /tmp
```

내가 설치 할 버전에 맞게 gradle-7.5.1-bin.zip 부분의 숫자를 바꿔주면 된다.

### 3. 다운로드 한 zip파일 unzip

```bash
sudo unzip -d /opt/gradle /tmp/gradle-7.5.1-bin.zip
```

위에서 zip파일을 /tmp 디렉터리에 다운로드 받았으니, 거기에 있는 zip 파일을 opt/gradle 디렉터리에 unzip한다. unzip 명령어는 sudo로 실행해야 한다. 만약, unzip을 시도했는데

- `bash: unzip: command not found`

위와 같은 에러가 뜬다면 zip 관련 프로그램이 설치되어 있지 않은것이니, 아래 명령어를 이용해서 설치해주자!

```bash
sudo apt-get install unzip
```

opt/gradle 경로에 제대로 unzip 되어있는지 확인하기 위해 ls 명령어로 확인해본다.  

```bash
ls /opt/gradle/gradle-7.5.1
```
폴더 내 디렉토리 구조가 나열되면 성공적으로 unzip 된 것이다. 

### 4. 환경 변수 설정

우리가 사용 할 Gradle 버전이 4.4.1이 아닌, 7.5.1 버전이라는 것을 설정 해줘야한다. nano라는 텍스트 편집기를 이용해서 설정파일을 편집한다.

```bash
sudo nano /etc/profile.d/gradle.sh
```

만약, `-bash: unzip: command not found` 에러가 발생한다면 nano가 설치 되어 있지 않은 것이니 아래 명령어를 실행해서 nano를 설치하도록 하자.

```bash
sudo apt-get install nano
```

파일을 열었으면 아래 내용을 붙여 넣자.

```bash
export GRADLE_HOME=/opt/gradle/gradle-7.5.1
export PATH=${GRADLE_HOME}/bin:${PATH}
```

**본인이 설정한 버전에 맞게 1번째 라인의 버전 숫자를 고쳐주자!**

붙여넣고, `Ctrl+O`를 누르면 아래와 같이 파일명을 정하라고 한다.(Ctrl+O는 nano 편집기의 저장 커맨드이다.)

우리는 파일명을 바꾸지 않을 것이므로 그대로 엔터를 눌러주고 Ctrl+X를 눌러 nano 편집기를 빠져나온다.
이제 아래 명령어로 방금 작성한 스크립트를 실행시켜준다.

```bash
sudo chmod +x /etc/profile.d/gradle.sh
```

마지막으로 아래 명령어를 통해 환경 변수를 로드해준다.

```bash
source /etc/profile.d/gradle.sh
```

### 5. Gradle 버전 확인

```bash
gradle -v
```

## [번외] `gradlew`를 사용해 Gradle 빌드 시 'Permission Denied' 오류 처리
`gradlew`는 gradle wrapper를 실행하는 스크립터로, 로컬 환경에 gradle이 설치되어 있지 않아도 gradle을 다운로드하고 프로젝트에 지정된 버전의 gradle을 사용하여 빌드할 수 있다. 이렇게 하면 프로젝트를 빌드하는 데 필요한 gradle 버전을 모두 포함시킬 수 있으므로 프로젝트를 공유하거나 다른 환경에서 빌드할 때 일관된 결과를 얻을 수 있다는 장점이 있다. 
### 실행 명령어
`./gradlew build` 
만약, `gradlew: permission denied` 오류 발생한다면, 아래 방법을 시도해보자.

### 해결 방법:
1. **문제 원인 분석**: 'Permission Denied' 오류는 실행 파일에 실행 권한이 없어서 발생하는 것이다.
2. **권한 설정**:
    - **chmod 명령어**: `chmod +x ./gradlew`
        - `chmod`: 파일 권한 변경 명령어
        - `+x`: 실행 권한 추가 옵션
        - `./gradlew`: Gradle 실행 파일
    - `chmod +x ./gradlew` 명령어를 입력하여 `gradlew` 파일에 실행 권한을 부여한다.
3. **권한 부여 후 실행**:
    - `./gradlew build` 다시 실행
4. 이제 'Permission Denied' 오류가 해결되었기 때문에 Gradle 빌드가 정상적으로 진행된다.