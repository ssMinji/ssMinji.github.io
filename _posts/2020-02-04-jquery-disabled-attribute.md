---
layout: post
title: "[jQuery] disabled 속성 설정, 해제, 체크"
tags: [jQuery, css]
date: 2020-02-04 13:36
---

### [jQuery] disabled 속성 설정, 해제, 체크
------

```html
<input type="text" class="className" placeholder="" id="inputId" value="" disabled />
```

input 태그에 disabled 가 걸려있으면, 입력창이 비활성화되며 입력이 제한된다.  

1. disabled 속성 설정 or 해제

    ```javascript
    $("#inputId").attr("disabled", true); //설정
    $("#inputId").attr("disabled", false); //해제
    ```

2. disabled 속성 확인 

    1. attr로 확인
    
        ```javascript
         console.log($("#inputId").attr("disabled"));	
        ```
    
        만약, disabled 설정이 되어있다면, "disabled" 가 찍힐 것이고, disabled 설정이 해제되어있다면, "undefined"가 찍힌다.
    
    2. boolean으로 확인
    
        ```javascript
        console.log($("#inputCommoncode").is(":disabled"));
        ```
    
        만약, disabled 설정이 되어있다면, "true", 해제되어있다면, "false"가 찍힌다. 





