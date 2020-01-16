---
layout: post
title: "Docker Basic Command"
---

1. hello-world 이미지 가져오기

    ```$ docker pull hello-world```

*output*

```powershell
Using default tag: latestlatest: Pulling from library/hello-world1b930d010525: Pull completeDigest: sha256:6540fc08ee6e6b7b63468dc3317e3303aae178cb8a45ed3123180328bcc1d20fStatus: Downloaded newer image for hello-world:latestdocker.io/library/hello-world:latest
```

2. 가져온 이미지 확인하기

```$ docker images```

*output*

```powershell
hello-world          latest              fce289e99eb9        7 months ago        1.84kB
```

3. 도커 컨테이너 생성하기

```$ docker run -it --name hell-world hello-world```

> -i : 컨테이너와 interactive하게 주고받겠다.(입력에 대한 출력을 사용자에게 보여주겠다.)-t : tty를 사용하겠다(콘솔, 터미널)—name : 컨테이너 이름 설정

*output*

    Hello from Docker!This message shows that your installation appears to be working correctly.

4. 컨테이너 목록 확인하기

```$ docker ps -a```

*output*

    CONTAINER ID  IMAGE      COMMAND     CREATED     STATUS      PORTS               NAMES459acf19e69a  hello-world  "/hello"  12 seconds ago  Exited (0) 11 seconds ago  hell-world

5. 도커 컨테이너 제거하기

```$ docker rm hell-world```

*output*

    hell-world

6. 도커 이미지 제거하기

```$ docker rmi hello-world```

*output*

    Untagged: hello-world:latestUntagged: hello-world@sha256:6540fc08ee6e6b7b63468dc3317e3303aae178cb8a45ed3123180328bcc1d20fDeleted: sha256:fce289e99eb9bca977dae136fbe2a82b6b7d4c372474c9235adc1741675f587eDeleted: sha256:af0b15c8625bb1938f1d7b17081031f649fd14e6b233688eea3c5483994a66a3

### 배포 Review

### 로컬 컴퓨터에서 도커 이미지 생성 및 푸시

    $ docker build . -t spam-dash:latest

> 현재 디렉터리에 있는 모든 파일로 도커 이미지 생성-t : 도커 이미지 이름과 태그 지정 (태그 default: latest)dockerfile에 정의한 내용 한 줄 한 줄 실행되며 이미지 생성됨

*output*

    Sending build context to Docker daemon  25.06MBStep 1/23 : FROM base.registry.navercorp.com/centos:centos7.4.1708---> 8dcf36e61db3Step 2/23 : ENV HOME_PATH=/home1/irteam---> Using cache---> f3b73209f4b7Step 3/23 : ENV TARGET_PATH=${HOME_PATH}/www...Successfully built 811a7e6e0666Successfully tagged spam-dash:latest
    
    $ docker tag spam-dash:latest registry.navercorp.com/vincent-docker/spam-dash:latest

> docker push 명령으로 docker Hub나 개인 저장소에 이미지를 올릴 때는 태그 설정해야 함<이미지이름>:<태그> <저장소주소>/<타겟이미지이름>:<태그>

    $ docker push registry.navercorp.com/vincent-docker/spam-dash

> docker registry에 이미지 전송

*output*

    The push refers to repository [registry.navercorp.com/vincent-docker/spam-dash]1ca463639709: Pushed2b981432e2ad: Pushed75f4dc6abd0b: Pushed9571d7f26a25: Pushedf117a9c4a943: Layer already exists34121f3cf702: Layer already exists04cecde68d0e: Layer already existsa768ad799331: Layer already exists75d2e55a54a4: Layer already exists6d21ad042002: Layer already exists129b697f70e9: Layer already existslatest: digest: sha256:0ca605776bab7764b08edb706ea695757cb3c0996cbac473fa6d1fca5f92bc87 size: 2639

### 서버 컴퓨터 접속 및 배포

    $ ssh ssminji@dgw01.nhnsystem.com

> 서버 접속

*output*

    Last login: Tue Aug  6 17:09:42 2019 from 10.66.89.63==========================================================================================================================[DEV] NEW Linux Gateway dgw01.nhnsystem.com(10.118.226.8)[ Warning ]You are entering into a secured area!This service is allowed to authorized users only.Your IP, Login Time and Username had been recorded.[ Precaution ]All users would be effected by your heavy batches or scripts.Keep in mind that the gateway server is shared by many users.[ Policy ]Password must be repeatedly changed every 90 days.If your password expired, go to NTree Web page to renew the password.Q&A : https://oss.navercorp.com/SystemOperation/Linux-authentication-system/issues=========================================================================================================================
    
    [cdgw01.infra:/home1/ssminji] $ kinit

> 사용자 ssminji가 자신의 시스템에 Kerberos 티켓 생성password 입력 필요

    $ r spam-dashboard001-bizai-jp2v-dev.lineinfra-dev.com

> 서버 접속

*output*

    This rlogin session is encrypting all data transmissions.Last login: Tue Aug  6 17:10:36 from 10.113.130.44[irteamsu@spam-dashboard001-bizai-jp2v-dev ~]
    
    $ docker run -dit -p 5000:5000 -p 8080:8080 --name spam-dash registry.navercorp.com/vincent-docker/spam-dash

> docker 컨테이너 생성docker run <옵션> <이미지이름>-d : detached 모드(데몬 모드). 컨테이너가 백그라운드로 실행됨-p : 호스트에 연결된 컨테이너의 특정 포트를 외부에 노출. <호스트포트>:<컨테이너포트>—name : 컨테이너 이름 설정만약 이미지가 local에 존재하지 않으면 url을 통해 down받아서 컨테이너 생성

*output*

    Unable to find image 'registry.navercorp.com/vincent-docker/spam-dash:latest' locallylatest: Pulling from vincent-docker/spam-dash6fd64836e300: Pull completebce8a8f7e139: Pull completefbd3116780c8: Pull complete8869a245aed8: Pull complete248b84109614: Pull complete7da7ddcba3a5: Pull complete2c1d43dfae33: Pull complete0f9b989ba2cc: Pull completeba2b46c744aa: Pull complete591c5755fde3: Pull complete6159ed7352b6: Pull completeDigest: sha256:0ca605776bab7764b08edb706ea695757cb3c0996cbac473fa6d1fca5f92bc87Status: Downloaded newer image for registry.navercorp.com/vincent-docker/spam-dash:latest5a6171fc7bd5e697c910415fcbb4821fc4a89edb90d642ec310c5eb7b1266e88
    
    $ docker exec -it spam-dash /bin/bash

> spam-dash 컨테이너 내부의 /bin/bash 실행. 해당 컨테이너의 shell 에 접속

*output*

    [irteam@5a6171fc7bd5 www]

> 5a6171fc7bd5 : Container id irteam: User

    $ cd frontend/$ nohup npm run serve &

> nohup : 프로세스가 중단되지 않는 백그라운드 작업 수행

*output*

    [1] 39[irteam@5a6171fc7bd5 frontend]$ nohup: ignoring input and appending output to ‘nohup.out’

## 끝~~~~~~~~~