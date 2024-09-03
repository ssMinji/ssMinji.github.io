---
title: Ubuntu "no space left on device" 해결
date: 2024-07-24 09:33:00 +09:00
categories: [Trouble Shooting, Ubuntu]
tags:
  [
    os,
    linux,
    ubuntu,
    docker,
    issue
  ]
---
## Ubuntu 20.04 "no space left on device"
Ubuntu에서 작업을 하다보면 `"no space left on device"` 라는 팝업이 뜨며 파일 수정 등 작업이 불가한 상황이 발생할 수 있다. 이 경우 아래와 같이 해결 가능하다.  

## 1. 저장 공간을 많이 쓰고 있는 곳 찾기
```bash
du -sh *

# 해당 경로에서 바로 용량 확인
du -h --max-depth=1

#폴더별 용량 sort하여 많은 순으로 5개 조회
du -hs * | sort -rh | head -5
```
폴더별 용량 사용량을 조회해보니 `/snap` 폴더의 사용량이 많았다. 
![img](/assets/img/blog/blog-2024-09-03.jpg)*/snap 폴더의 사용량이 136M로 확인*

## 2. Ubuntu에서 스냅(snap) 제거
### 1. 현재 snap으로 설치된 패키지 확인
`snap list`: snap으로 관리되는 패키지 리스트
### 2. 패키지 삭제
```bash
snap remove --purge snap-store
snap remove --purge gtk-common-themes
snap remove --purge gnome-3-38-2004
snap remove --purge core20
snap remove --purge bare
```
core20 삭제가 snapd에서 사용 중으로 실패한다면 우선 건너뛰고 다음 단계로 진행한다. 
### 3. snap core에서 사용 중인 마운트 해제
```bash
umount /snap/
```
### 4. snapd 삭제
```bash
apt autoremove --purge snapd
```
### 5. 남아있는 snap 폴더들 삭제
```bash
rm -rf ~/snap/

# 패키지 삭제 시 삭제되었을 폴더들 삭제 재확인
rm -rf /snap
rm -rf /var/snap
rm -rf /var/lib/snapd
```
### 6. snapd 설치 안되게 마킹 
크롬 브라우저 등 설치 시 snapd 를 추가 설치할 수 있는데, 그렇게 자동 설치 되지 않도록 업데이트를 방지한다. 
```bash
apt-mark hold snapd
```

## 3. Docker에서 많은 용량 사용하고 있는 경우
Docker를 이용해 작업을 하다보면 위 snap 삭제 과정을 진행했음에도 또다시 용량이 없다는 경고창이 뜰 수 있다. 이는 Docker 기본 경로(`/var/lib/docker`) 내 다양한 임시파일이나 이미지 컨테이너 관련 파일들이 누적되면서 과도한 용량을 잡아먹고 있는 상황으로, `prune` 을 이용해 사용하지 않는 도커 오브젝트를 정리하여 서버 용량을 확보할 수 있다. 
```bash
docker system prune -a -f
```