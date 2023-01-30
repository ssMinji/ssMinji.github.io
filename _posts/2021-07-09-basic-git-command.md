---
layout: post
title: "[Git] git command 정리"
tags: [git, version control, git command]
date: 2021-07-09 10:37
---

#### [Git] git command 정리
---

뒤돌아서면 까먹는 나를 위해 정리한 Git Command. 

### 1. 기초 Git 명령어

- ``git init``: 현재 디렉토리를 Git이 관리하는 프로젝트 디렉토리(=working directory)로 설정하고 그 안에 레포지토리(.git 디렉토리)를 생성한다. 
- ``git config user.name 'ssminji'``: 현재 사용자의 아이디를 'ssminji'로 설정한다.(커밋할 때 필요한 정보)
- ``git config user.email 'ssong758@gmail.com'``: 현재 사용자의 이메일 주소를 설정한다.(커밋할 때 필요한 정보)
- ``git add [파일 이름]``: 수정 사항이 있는 특정 파일을 staging area 에 올린다.
- ``git add [디렉토리 이름]``: 해당 디렉토리 내에서 수정사항이 있는 모든 파일들을 staging area에 올린다. 
- ``git add . ``: working directory 내의 수정사항이 있는 모든 파일들을 staging area 에 올린다. 
- ``git reset [파일 이름]``: staging area에 올렸던 파일을 다시 내린다. 
- ``git status``: 현재 Git이 인식하고 있는 프로젝트 관련 내용들을 출력한다.(문제 상황이 발생했을 때 현재 상태를 파악하기 위해 활용하면 좋다)
- ``git commit -m "커밋 메시지"``: 현재 staging area에 있는 것들을 커밋으로 남긴다. 
- ``git help [커맨드 이름]``: 사용법이 궁금한 Git 커맨드의 공식 메뉴얼 내용을 출력한다. 

### 2. Github 사용하기 

- ``git push -u(or --set-upstream) origin master``: 로컬 레포지토리의 내용을 처음으로 리모트 레포지토리에 올릴 때 사용한다.
- ``git push``: 위처럼 upstream을 한 번 설정하고 난 후에는 git push라고만 쳐도 로컬 레포지토리의 내용을 리모트 레포지토리에 올릴 수 있다. 
- ``git pull``: 리모트 레포지토리의 내용을 로컬 레포지토리로 가져온다. 
- ``git clone [프로젝트의 github 상 주소]``: Github에 있는 프로젝트를 내 컴퓨터로 가져온다. 

### 3. Git에서 커밋 다루기

- ``git log``: 커밋 히스토리를 출력한다. 
- ``git log --pretty=online``: --pretty 옵션을 사용하면 커밋 히스토리를 다양한 방식으로 출력할 수 있다. --pretty 옵션에 oneline이라는 값을 주면 커밋 하나당 한 줄씩 출력해준다. --pretty 옵션에 대해 더 자세한 설명은 [링크](https://git-scm.com/docs/pretty-formats) 를 따라가면 된다.
- ``git show [커밋 아이디]``: 특정 커밋에서 어떤 변경사항이 있었는지 확인할 수 있다. 
- ``git commit -ammend``: 최신 커밋을 다시 수정해서 새로운 커밋으로 만든다. 
- ``git config alias.[별칭][커맨드]``: 길이가 긴 커맨드에 별칭을 붙여서 이후로는 alias로도 해당 커맨드를 실행할 수 있게 설정한다. 
- ``git diff [커밋 A의 아이디][커밋 B의 아이디]``: 두 커밋 간의 차이 비교
- ``git reset [옵션][커밋 아이디]``: 옵션에 따라 하는 작업이 달라진다.(옵션을 생략하면 ``--mixed`` 옵션이 적용된다)
    - HEAD가 특정 커밋을 가리키도록 이동시킴(``--soft``는 여기까지 수행)
    - staging area도 특정 커밋처럼 리셋(``--mixed``는 여기까지 수행)
    - working directory도 특정 커밋처럼 리셋(``--hard``는 여기까지 수행)  
  그리고 이때 커밋 아이디 대신 HEAD의 위치를 기준으로 한 표기법(ex. HEAD^, HEAD~2)을 사용해도 된다.
- ``git tag [태그 이름][커밋 아이디]``: 특정 커밋에 태그를 붙임

### 4. Git에서 브랜치 사용하기

- ``git branch [새 브랜치 이름]``: 새로운 브랜치를 생성한다.
- ``git checkout -b [새 브랜치 이름]``: 새로운 브랜치를 생성하고 그 브랜치로 바로 이동한다.
- ``git branch -d [기존 브랜치 이름]``: 브랜치를 삭제한다.
- ``git checkout [기존 브랜치 이름]``: 해당 브랜치로 이동한다. 
- ``git merge [기존 브랜치 이름]``: 현재 브랜치에 다른 브랜치를 머지한다.
- ``git merge --abort``: 머지를 하다가 conflict가 발생했을 때, 일단 머지 작업을 취소하고 이전 상태로 돌아간다.

### 5. Git 활용하기

- ``git fetch``: 로컬 레포지토리에서 현재 HEAD가 가리키는 브랜치의 업스트림(upsteam) 브랜치로부터 최신 커밋들을 가져온다.(가져오기만 한다는 점에서, 가져와서 머지까지 하는 git pull과는 차이가 있다)
- ``git blame``: 특정 파일의 내용 한줄한줄이 어떤 커밋에 의해 생긴 것인지 출력한다. ~~공개처형 가능,,~~
- ``git revert``: 특정 커밋에서 이루어진 작업을 되돌리는(취소하는) 커밋을 새로 생성한다. 
- ``git reflog``: HEAD가 그동안 가리켜왔던 커밋들의 기록을 출력한다. 
- ``git log --all --graph``: 모든 브랜치의 커밋 히스토리를 커밋 간의 관계가 잘 드러나도록 그래프 형식으로 출력한다. 
- ``git rebase [브랜치 이름]``: A, B 브랜치가 있는 상태에서 지금 HEAD가 A 브랜치를 가리킬 때, ``git rebase B`` 를 실행하면 A, B 브랜치가 분기하는 시작점이 된 공통 커밋 이후로부터 존재하는 A 브랜치 상의 커밋들이 그대로 B 브랜치의 최신 커밋 이후로 이어붙여진다.(``git merge``와 같은 효과를 가지지만 커밋 히스토리가 한 줄로 깔끔하게 된다는 차이점이 있다)
- ``git stash``: 현재 작업 내용을 스택 영역에 저장한다. 
- ``git stash apply [커밋 아이디]``: 스택 영역에 저장된 가장 최근의(혹은 특정) 작업 내용을 working directory에 적용한다.
- ``git stash list``: stash한 내용의 목록을 보여준다. 
- ``git stash pop [커밋 아이디]``: 스택 영역에 저장된 가장 최근의(혹은 특정) 작업 내용을 working directory에 적용하면서 스택에서 삭제한다. 
- ``git cherry-pick [커밋 아이디]``: 특정 커밋의 내용을 현재 커밋에 반영한다. 














