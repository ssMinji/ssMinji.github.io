# 모바일 청첩장 만들기

https://ssminji.github.io

## 📚 내용 및 기능

- 결혼식 날짜, 위치, 인사말 출력
- 사진첩
- 축의금을 보내실 곳 (계좌번호 클립보드 복사 기능 지원)
- 카카오톡 공유 기능 및 링크 공유 기능

## 🚘 시작하기

1. `$ npm install` - 디펜던시 설치
2. `$ npm start` - 로컬로 실행
3. `$ npm deploy` - github 페이지로 배포

## 🛠 커스터마이징

`./config.js`를 수정하여 사용합니다.

```javascript
export const WEDDING_INVITATION_URL = "http://localhost:8000/";
export const KAKAOTALK_API_TOKEN = "JavaScript 키 입력";
export const KAKAOTALK_SHARE_IMAGE =
  "https://cdn.pixabay.com/photo/2014/11/13/17/04/heart-529607_960_720.jpg";

export const WEDDING_DATE = "1970년 01월 01일, 목요일 오전 12시 00분";
export const WEDDING_LOCATION = "○○○웨딩, ○층 ○○홀";

export const GROOM_NAME = "○○○";
export const GROOM_ACCOUNT_NUMBER = "○○은행 ***-***-******";
export const GROOM_FATHER_NAME = "○○○";
export const GROOM_FATHER_ACCOUNT_NUMBER = "○○은행 ***-***-******";
export const GROOM_MOTHER_NAME = "○○○";
export const GROOM_MOTHER_ACCOUNT_NUMBER = "○○은행 ***-***-******";

export const BRIDE_NAME = "○○○";
export const BRIDE_ACCOUNT_NUMBER = "○○은행 ***-***-******";
export const BRIDE_FATHER_NAME = "○○○";
export const BRIDE_FATHER_ACCOUNT_NUMBER = "○○은행 ***-***-******";
export const BRIDE_MOTHER_NAME = "○○○";
export const BRIDE_MOTHER_ACCOUNT_NUMBER = "○○은행 ***-***-******";
```

