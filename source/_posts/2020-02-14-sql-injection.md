---
layout: post
title: "[SQL] SQL 인젝션 꿀이해"
tags: [SQL, security, SQL injection]
date: 2020-02-14 16:44
---

### SQL 인젝션이란 무엇이고 어떻게 막을 수 있을까? 
------

**SQL 인젝션**이란 동적 SQL 쿼리를 생성하는 과정에서 해커들이 악의적인 인풋값을 넣어 우리의 데이터베이스에 접근하는 것을 말한다.  

만약 핸드폰 번호를 받아오는 인풋 필드가 있다고 하면, 우리는 그것을 다음과 같은 SQL 쿼리를 생성하는데 사용할 것이다:

```mysql
sql_text = "SELECT * FROM customers WHERE phone = '%s'" % phone_input
```

이 때, 입력값은 "8015550198"처럼 깔끔하게 SQL문을 생성해주는 값들을 예상할 것이다:

```sql
SELECT * FROM customers WHERE phone = '8015550198';
```

그런데 만약 사용자가 "1' OR 1=1;--"을 입력하면 어떻게 될까?

그럼 다음과 같은 쿼리가 만들어질 것이고,

```sql
SELECT * FROM customers WHERE phone = '1' OR 1=1;--';
```

이것은 ```WHERE```절이 *항상* 참으로 판단되기 때문에 모든 사용자에 대한 데이터를 반환해버릴 것이다! (1은 항상 1과 같고, "--"은 --뒤에 오는 줄을 주석으로 처리하기 때문이다.)

알맞은 인풋과 쿼리가 있다면, SQL 인젝션은 해커로 하여금 데이터를 생성하고, 읽고, 업데이트하고 파괴하는 것을 가능하게 한다. 

따라서 SQL 인젝션을 막기 위해서는, 어떻게 SQL 쿼리가 생성되고 실행되는지 볼 필요가 있다. 그러면 실제 개발에서 현명한 기술적 설계에 대해 생각해볼 수 있을 것이다. 

그렇다면 SQL 인젝션을 막기 위한 5가지 방법을 소개한다. 

#### 1. 저장 프로시저(Stored procedure) 혹은 프리페어드 스테이트먼트(prepared statement)를 이용해라. 

따라서, 동적 SQL 쿼리를 생성하지 *말아라.* 이것은 SQL 인젝션을 막기 위한 가장 효과적인 방법이다.

예를 들어, 다음의 프리페어드 스테이트먼트를 생성할 수 있다. :

```python
from mysql import connector

# 데이터베이스와 연결하고 커서를 인스턴스화한다. 
cnx = connector.connect(database='bakery')
cursor = cnx.cursor(prepared=True)

statement = "SELECT * FROM customers WHERE phone = ?"
cursor.execute(statement, (phone_input, ))
```

혹은 ```input_phone```이라는 스트링 파라미터를 받아오는 ```get_customer_from_phone()```이라는 저장 프로시저를 생성할 수도 있다.:

```mysql
DELIMITER //
CREATE PROCEDURE get_customer_from_phone
(IN input_phone VARCHAR(15))
BEGIN
	SELECT * FROM customers
	WHERE phone = input_phone;
END //
DELIMITER;
```

위 프로시저는 다음과 같이 호출할 수 있다:

```python
from mysql import connector

# 데이터베이스와 연결하고 커서를 인스턴스화한다.
cnx = connector.connect(database='bakery')
cursor = cnx.cursor()

cursor.callproc('get_customer_from_phone', args=(phone_input,))
```

#### 2. 인풋의 타입과 패턴을 검증해라. 

만약 ID, 이름, 혹은 이메일 주소와 같은 특정한 데이터를 찾고자 한다면, 타입, 길이 혹은 다른 기타 속성들에 대해 인풋을 검증해라. 

예를 들어, 다음은 핸드폰 번호를 검증하는 방법 중 하나이다.:

```python
import re

def is_valid_phone(phone_number):
    # None 혹은 빈 문자열인지 체크한다
    if phone_number is None or not len(phone_number):
        return False
    
   	# 정확히 10자리의 유효한 핸드폰 번호 문자들만을 포함한다
    phone_format = re.compile(r'^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$')
    return phone_format.match(phone_number) is not None
```

#### 3. 주석 표시같은 특수한 문자들을 피하라. 

이것은 SQL 인젝션이 발생할 가능성을 낮춰주는 빠르고 쉬운 방법이지만, 완전히 효과적이지는 않다. 

예를 들어, 역슬래쉬, 단일따옴표와 쌍따옴표, 개행문자(\n 과 \r), 그리고 null(\0)을 피하고자 한다고 해보자:

```python
def escape_input(input):
    char_replacements = [
        # 다른 특수 문자들에 있는 역슬래쉬를 거르지 않고 특수문자들을 거르기 위해 
        # 역슬래쉬를 먼저 걸러줘야 한다
        ('\\', '\\\\'),
        ('\0', '\\0'),
        ('\n', '\\n'),
        ('\'', '\\\''),
        ('"', '\\"'),
    ]
    
    for char_to_replace, replacement in char_replacements:
        if char_to_replace not in input:
            continue
        input = input.replace(char_to_replace, replacement)
        
    return input
```

[다음 링크](https://dev.mysql.com/doc/refman/5.7/en/string-literals.html)로 들어가보면, 특수 문자 escape sequence에 대한 리스트를 볼 수 있다. 

파이썬에서는, ```_mysql``` 모듈의 ```escape_string()``` 함수를 사용할 수도 있다. (추가적으로 SQL 와일드카드 문자인 "%"와 "_"도 걸러낼 수 있다.):

```python
import _mysql

phone_param = _mysql.escape_string(phone_input)
```

인풋을 걸러내면, 이제 우리의 쿼리는 다음과 같이 될 것이고, :

```mysql
SELECT * FROM customers WHERE phone = '1\' OR 1=1;--';
```

이는 유효한 쿼리가 아니다. 


#### 4. 데이터베이스 권한을 제한해라. 

데이터베이스에 연결된 어플리케이션 계정은 가능한 한 권한을 적게 가지고 있어야 한다. 예를 들어, 당신의 어플리케이션은 테이블을 삭제해야 할 일이 있지 않을 것이다. 따라서 그것을 허용하지 말아라. 


#### 5. 데이터베이스 에러 메시지를 사용자에게 보여주지 말아라. 

에러메시지는 데이터에 대해 많은 정보를 해커에게 이야기해줄 수 있는 정보를 담고 있다. 사용자에게는 일반적인 데이터베이스 에러 메시지를 제공하고, 개발자가 해당 오류에 접근할 수 있는 상세 에러를 로그로 남기는 것이 모범적인 방법이다. 