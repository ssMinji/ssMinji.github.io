#### 스키마

------

쿼리 퍼포먼스, 조인, SQL 삽입(injection) 같은 주제를 다루는 6가지 문제를 풀어볼 것이다. bakery에 있는 cakes, customers, orders 데이터베이스를 참조할 것이다. 스키마는 다음과 같다. 

```mysql
CREATE TABLE cakes (
	cake_id INT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
    flavor VARCHAR(100) NOT NULL 
);

CREATE TABLE customers (
	customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    street_address VARCHAR(255),
    city VARCHAR(255), 
    zip_code VARCHAR(5),
    referrer_id INT,
    FOREIGN KEY (referrer_id) REFERENCES customers (customer_id)
);

CREATE TABLE orders (
	order_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cake_id INT NOT NULL,
    customer_id INT,
    pickup_date DATE NOT NULL,
    FOREIGN KEY (cake_id) REFERENCES cakes (cake_id),
    FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
);
```

우리는 일관성을 위해 MySQL을 이용할 것이다. 

샘플 데이터를 구축해보자! 

4개 종류의 케이크와 백만명의 고객, 그리고 백만개의 주문의 데이터를 가져오는 방법이다. 

터미널에 스크립트를 다운받고 MySQL을 실행시켜보자:

```shell
$ curl -O https://static.interviewcake.com/bakery_schema_and_data.sql && mysql.server start && mysql -u root
```

그리고 스크립트를 실행시켜 ```BAKERY``` 데이터베이스를 구축하고 데이터를 넣어보자:

```shell
> source bakery_schema_and_data.sql;
```

> 이미 스크립트를 다운로드해 실행한 경우 데이터로 다시 돌아오고자 한다면:
>
> 1. 터미널에서 MySQL을 실행하자: ```mysql.server start && mysql -u root```
> 2. MySQL 쉘에서, bakery 데이터베이스를 사용하자: ```USE BAKERY;```

자, 이제 구축했으니 시작해보자! 

###  1)어떻게 쿼리를 더 빠르게 만들 수 있을까?

------

2017년 1월에서 2월 사이의 모든 주문의 주문ID를 얻고자 한다. 아래에 해당 쿼리가 있다.

```mysql
SELECT order_id FROM orders WHERE DATEDIFF(orders.pickup_date, '2017-03-01') < 0;
-- 161314 rows in set(0.25 sec)
```

####  정답

------

먼저, ```pickup_date```에 인덱스를 추가하는 것을 고려해볼 수 있다. 이것은 *삽입(insert)*을 덜 효율적으로 만들겠지만 이 쿼리를 훨씬 빠르게 할 수 있다. 

> 질문의 **트레이드 오프**를 고려하는 것은 면접관을 감동시킬 수 있다. 훌륭한 답변은 언제나 큰 그림을 고려한다. (부작용 혹은 단점(downside), 그리고 대안책 등)

그럼 한 번 해보자!

```mysql
ALTER TABLE orders ADD INDEX (pickup_date);

SELECT order_id FROM orders WHERE DATEDIFF(orders.pickup_date, '2017-03-01') < 0;
-- 161314 rows in set (0.24 sec)
```

와! 이게 무슨 일인가? 인덱스를 추가했음에도 개선되지 않았다. 

그 이유는 바로 ```WHERE```절에서 ```DATEDIFF``` 함수를 사용했기 때문이다. ***함수*는 인덱스를 사용하지 않고 테이블의 모든 행(row)에 대해 동작하기 때문이다!** 

간단한 수정 방법은 - 단순히 pickup date와 3월 1일을 직접 비교할 수 있다. 

```mysql
SELECT order_id FROM orders WHERE orders.pickup_date < '2017-03-01';
-- 161314 rows in set (0.07 sec)
```

오예! 약 0.25초가 약 0.07초로 줄었다. 

 

### 2) 어떻게 하면 고객의 주문 건수 중 n번째로 높은 수를 찾을 수 있을까? 

------

뷰를 만든다. 

참고) SQL에서 **View**는 가상 테이블의 역할을 하는 저장된 쿼리(stored query)이다. 

​		간단한 예로, 만약 아래처럼 뷰를 만든다고 해보자:

```mysql
CREATE VIEW order_flavors AS
SELECT order_id, customer_id, pickup_date, flavor
FROM orders 
INNER JOIN cakes
ON orders.cake_id = cakes.cake_id;
```

그러면 ```order_flavors```를 마치 테이블처럼 사용해서 쿼리를 날릴 수 있다:

```mysql
SELECT last_name, flavor, pickup_date
FROM order_flavors 
INNER JOIN customers
ON order_flavors.customer_id = customers.customer_id;
```



자, 그럼 다시 문제로 돌아와서, 각 고객이 보유한 주문 건수에 대한 뷰를 만들어보자.

```mysql
CREATE VIEW customer_order_counts AS
SELECT customers.customer_id, first_name, count(orders.customer_id) AS order_count 
FROM customers
LEFT OUTER JOIN orders
ON (customers.customer_id = orders.customer_id)
GROUP BY customers.customer_id;
```

따라서 예를 들면, Nancy는 3개의 주문 건수를 보유하고 있다:

```mysql
SELECT * FROM customer_order_counts ORDER BY RAND() LIMIT 1;


/*
    +-------------+------------+-------------+
    | customer_id | first_name | order_count |
    +-------------+------------+-------------+
    |        9118 | Nancy      |           3 |
    +-------------+------------+-------------+
*/
```

#### 정답

------

좀 더 간단한 문제를 풀어보는 것에서 시작해보자 - 단지 **가장 많은** 주문 건수를 찾으려면 어떻게 해야 할까?

내장 함수가 있기 때문에 꽤 간단할 것이다:

```mysql
SELECT MAX(order_count) FROM customer_order_counts;
--- 1 row in set (1.89 sec)
```

그럼 이제 이걸 이용해서 **2번째로 많은** 주문 건수를 찾을 수 있을까?

생각해보면, 가장 높은 주문 건수를 얻었다면, "가장 높은 주문 건수가 아니면서 가장 높은 주문 건수"도 얻을 수 있을 것이다:

```mysql
SELECT MAX(order_count) 
FROM customer_order_counts 
WHERE order_count NOT IN (
	SELECT MAX(order_count) FROM customer_order_counts
);
-- 1 row in set (3.89 sec)
```

이것은 제대로 동작하지만, 꽤 느리다. 쿼리를 더 빠르게 하는 방법이 없을까? 

```order_counts```를 정렬할 수도 있을 것이다. 그럼 우리는 전체 테이블을 *두 번* 스캔할 필요가 없어진다. 그냥 두 번째 행을 찾으면 된다. :

```mysql
SELECT order_count 
FROM customer_order_counts 
ORDER BY order_count DESC 
LIMIT 1, 1;
-- 1 row in set (1.93 sec)
```

> 만약 ```LIMIT```이 하나의 인수(argument)만 가지고 있다면, 그 인수는 첫 번째 행에서부터 시작해서 카운트된 행의 개수가 된다.  2개의 인자가 있으면, 첫 번째 인자는 행의 offset(기준이 되는 첫 번째 행에서부터의 위치 값)이 되고 두 번째 인자는 리턴될 행의 개수가 된다. 
>
> 따라서 위의 쿼리에서 "1, 1"이란, "맨위에서부터 한 행 아래에서 시작해서, 하나의 행을 가져와라"라는 의미가 된다. 

그럼, 주문 건수의 **n번째 높은** 수는 어떻게 가져오면 될까? 

간단하다 - 그냥 ```LIMIT```절에 있는 오프셋 값(row offset)만 바꿔주면 된다:

```mysql
SELECT order_count 
FROM customer_order_counts 
ORDER BY order_count DESC
LIMIT N-1, 1;
```

 더 나아가서, MySQL의 간편한 ```LIMIT```절 없이 순수 SQL문만으로 어떻게 할 수 있을까? 그건 조금 까다롭다! 



### 3) ```LIKE```절에서 와일드카드 문자를 어떻게 사용할 수 있을까? 

------

#### 정답

------

```LIKE```에서는 두 가지 와일드 카드 문자, "%"와 "_"를 사용할 수 있다. 

"%"는 0개 이상의 문자에 매치된다. 따라서 만약 성이 "A"로 시작하는 고객을 찾고 싶다면, 다음과 같은 쿼리를 작성하면 된다.:

```mysql
SELECT customer_id, last_name 
FROM customers
WHERE last_name 
LIKE 'a%';
```

(대소문자를 구분해 찾고 싶다면 ```BINARY``` 키워드를 사용할 수도 있다. 우리가 비교하고자 하는 문자열을 바이너리 문자열로 처리해서, 문자(character) 대신 바이트(byte)로 비교하게 된다.)

"_"는 정확히 한 문자에 매치된다. 만약 Dover에 있는 Flatley Avenue의 200번대 블록에 거주하고 있는 모든 고객에 대해 찾고 싶다면, 다음과 같이 쿼리를 작성하면 된다:

```mysql
SELECT first_name, street_address 
FROM customers
WHERE street_address
LIKE '2__ Flatley Avenue' AND city = 'Dover';
```

그리고 몇몇 데이터베이스(SQL서버와 같은, 그러나 MySQL이나 PostgreSQL은 아니다) 문자의 집합이나 범위를 지원해준다. 따라서 도시 이름이 "m" 또는 "d"로 시작하는 도시에 살고 있는 모든 고객을 가져오려면 다음과 같은 쿼리를 작성하면 된다:

```sql
SELECT customer_id
FROM customers
WHERE city
LIKE '[md]%';
```

혹은 "a"에서 "m" 사이의 어떤 문자(“a”, “b”, “c”...“k”, “l”, “m”)로 시작하는 성을 가진 고객을 찾기 위해서는 다음과 같은 쿼리를 작성하면 된다: 

```sql
SELECT customer_id
FROM customer
WHERE last_name
LIKE '[a-m]%'
```



### 4) 다음의 쿼리를 어떻게 더 빠르게 만들 수 있을까?

------

Dover에 사는 Sam이라는 이름의 모든 고객에게 홍보 메일을 보내고 있다. 어떤 고객은 Samuel이나 Sammy처럼 정확히 Sam은 아닐 것이기 때문에 Sam과 비슷한 이름을 사용한다.

주어진 쿼리는 다음과 같다. :

```mysql
SELECT first_name, last_name, street_address, city, zip_code 
FROM cutomers
WHERE first_name
LIKE '%sam%' AND city = 'Dover';
-- 1072 rows in set (0.42 sec)
```

이것은 꽤 느리다. 속도를 더 빠르게 할 수 있을까?

#### 정답

------

먼저, 모든 고객으로부터 도시이름과 우편번호를 받아올 필요가 있을까? 검색은 Dover라는 이름의 도시를 이용해 이뤄졌고, 따라서 우리는 도시이름을 알고 있다. 그리고 Dover의 우편번호가 33220이라는 것을 알고 있다. 만약 우리가 코드의 다른 어딘가에서 효율적으로 주소를 완성할 수 있다면, 모든 결과에 대해 데이터베이스로부터 정보를 가져올 필요가 없다. 

```mysql
SELECT first_name, last_name, street_address 
FROM customers
WHERE first_name
LIKE '%sam%' AND city = 'Dover';
-- 1072 rows in set (0.40 sec)
```

조금은 나아졌지만, 너무 조금이다. 

"sam" 앞에 있는 와일드카드 "%"를 살펴보자. 제일 앞에 있는 와일드카드는 성능을 떨어뜨릴 수 있다. 왜냐하면 단순히 "sam"으로 시작하는 이름을 찾는 대신에 쿼리는 *모든*  이름에서 *모든 * 문자를 찾게 되기 때문이다. 

"sam" 앞에 반드시 % 와일드카드가 와야만 할까? Rosamond처럼 이름에 "sam"이 들어있긴 하지만 "sam"으로 시작하지는 않는 이름도 "Sam 프로모션"에 포함시켜야 할까? 

아마 아닐 것이다. 앞부분에 있는 %를 지우고 ```first_name```에 인덱스를 추가해보자:

```mysql
ALTER TABLE customers ADD INDEX (first_name);

SELECT first_name, last_name, street_address 
FROM customers
WHERE first_name
LIKE 'sam%' AND city = 'Dover';
-- 1065 rows in set (0.02 sec)
```

0.42초에서 0.02초로 줄어들었다! 

이것은 굉장한 개선이다. **하지만 - 우리가 기능을 바꾸고 있기 때문에 이런 변경은 큰 작업이다.** 이것은 빨라지기만 한 것이 아니라, *달라졌다.* 몇몇 고객들은 이제 홍보 메일을 더 이상 받지 않게될 것이다. 누가 프로모션 대상에 포함될 것인지 여부는 데이터베이스 성능과는 독립적으로 결정되어야 할 것이다.  하지만 패턴의 시작부분에 있는 와일드카드 문자를 주의하는 것은 항상 좋은 방법이다. 