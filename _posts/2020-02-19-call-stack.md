---
layout: post
title: "[기본개념] 콜 스택(Call Stack) 꿀이해"
tags: [stack, function call]
date: 2020-02-19 16:27
---

### 콜 스택(Call Stack) 개념정리

#### Overview
------

**콜 스택(call stack)**은 프로그램이 함수 호출(Function call)을 추적할 때 사용하는 것이다. 콜 스택은 각 function call 당 하나씩의 스택들로 이루어져 있다. 

예를 들어, 두 개의 주사위를 굴려 숫자들의 합을 출력하는 함수를 호출했다고 해보자. 

```python
def roll_die():
    return random.randint(1, 6)

def roll_two_and_sum():
    total = 0
    total += roll_die()
    total += roll_die()
    print(total)
    
roll_two_and_sum()
```

먼저, 프로그램은 ```roll_two_and_sum()```을 호출하고, 이것은 콜 스택으로 가게 된다. :

```mysql
roll_two_and_sum()
```

이 함수는 ```roll_die()```를 호출하고, 콜 스택 위에 쌓이게 된다. 

```mysql
roll_die()
```

```mysql
roll_two_and_sum()
```

```roll_die()```내에서, ```random.randint()```를 호출한다. 여기까지 콜 스택의 형태는 다음과 같다. :

```mysql
random.randint()
```

```mysql
roll_die()
```

```mysql
roll_two_and_sum()
```

```random.randint()```의 실행이 끝났을 때, ```random.randint()``` 의 스택을 제거함으로써(popping) 이 값을 ```roll_die()```에게 반환해준다. 

```mysql
roll_die()
```

```mysql
roll_two_and_sum()
```

```roll_die()```가 리턴했을 때도 마찬가지이다. : 

```mysql
roll_two_and_sum()
```

아직 끝나지 않았다! ```roll_two_and_sum()```은 ```roll_die()```를 다시 한 번 호출한다. : 

```mysql
roll_die()
```

```mysql
roll_two_and_sum()
```

그리고 이 것은 또 ```random.randint()```를 다시 호출한다. :

```mysql
random.randint()
```

```mysql
roll_die()
```

```mysql
roll_two_and_sum()
```

```random.randint()```가 리턴하고, ```roll_die()```가 리턴을 하고나면, 다시 ```roll_two_and_sum()```으로 돌아오게 된다. :

```mysql
roll_two_and_sum()
```

그리고 이제 print()()가 호출된다. :

```mysql
print()()
```

```mysql
roll_two_and_sum()
```



#### 스택에는 무엇이 저장될까?
------

함수의 스택에는 *정확히* 무엇이 들어갈까? 

스택은 보통 다음의 것들을 저장한다. :

- 지역 변수
- 함수로 들어온 인수(Arguments)
- 호출한 함수(caller)의 스택에 대한 정보
- 반환값 주소(return address) - 함수가 반환하고 난 뒤에 해야하는 것이다.(즉, 반환해야 할 위치) 이것은 보통 호출한 함수(calller)의 코드 중간 어디쯤에 존재한다. 

> 위 사항들 중 몇몇은 프로세서 아키텍처에 따라 달라질 수 있다. AMD64(64bit x86) 프로세서는 몇몇 인수들을 레지스터에 넘기고 몇몇은 콜 스택에 넘긴다. 그리고, ARM 프로세서(주로 핸드폰에서 사용하는)는 반환값 주소(return address)를 콜 스택에 담는 것이 아니라 특별한 레지스터에 저장한다. 



#### 스택의 공간 비용(Space cost)
------

각 function call은 고유한 스택을 생성해 콜 스택의 공간을 차지하게 된다. 이것은 알고리즘의 *공간 복잡도*에 영향을 줄 수 있기 때문에 중요하다. 특히 **재귀**를 사용하는 경우에 말이다. 

예를 들어, 1과 *n* 사이에 있는 모든 수를 곱하고자 한다면, 다음의 재귀적 접근을 이용할 수 있다. :

```python
def product_1_to_n(n):
    return 1 if n <= 1 else n * product_1_to_n(n-1)
```

n = 10 일 때 콜 스택은 어떻게 될까? 

먼저, n = 10에서 ```product_1_to_n()```이 호출된다. 

```mysql
product_1_to_n()    n = 10
```

이것은 n = 9에서 ```product_1_to_n()```를 호출한다. 

```mysql
product_1_to_n()    n = 9
```

```mysql
product_1_to_n()    n = 10
```

그리고 이것은 n = 8에서 ```product_1_to_n() ```를 호출한다.

```mysql
product_1_to_n()    n = 8
```

```mysql
product_1_to_n()    n = 9
```

```mysql
product_1_to_n()    n = 10
```

이것은 n = 1에 도달할 때까지 계속된다. 

```mysql
product_1_to_n()    n = 1
```

```mysql
product_1_to_n()    n = 2
```

```mysql
product_1_to_n()    n = 3
```

```mysql
product_1_to_n()    n = 4
```

```mysql
product_1_to_n()    n = 5
```

```mysql
product_1_to_n()    n = 6
```

```mysql
product_1_to_n()    n = 7
```

```mysql
product_1_to_n()    n = 8
```

```mysql
product_1_to_n()    n = 9
```

```mysql
product_1_to_n()    n = 10
```

이 모든 스택의 크기를 보자! 전체 콜 스택은 *O(n)* 공간을 차지한다. 그렇다 - 함수가 아무런 자료구조도 생성하지 않는다하더라도 *O(n)* 공간 비용이 발생한다. 

만약 재귀적 방법 대신 반복(iterative) 방법을 사용하면 어떨까? 

```python
def product_1_to_n(n):
    # n >= 1이라고 가정한다
    result = 1
    for num in range(1, n+1):
        result *= num
        
    return result
```

위의 경우는 일정한 양의 공간을 차지한다. 반복문이 시작될 때, 콜 스택의 형태는 다음과 같다. :

```mysql
product_1_to_n()    n = 10, result = 1, num = 1
```

반복문을 돌며, 지역 변수가 바뀌게되지만, 다른 함수를 호출하고 있지 않기 때문에 여전히 같은 스택에 머무르게 된다. 

```mysql
product_1_to_n()    n = 10, result = 2, num = 2
```

```mysql
product_1_to_n()    n = 10, result = 6, num = 3
```

```mysql
product_1_to_n()    n = 10, result = 24, num = 4
```

일반적으로, 컴파일러나 인터프리터가 알아서 콜 스택을 관리해준다해도, 알고리즘의 공간 복잡도를 분석할 때 콜 스택의 depth를 고려하는 것은 중요하다. 

**재귀 함수는 특히 조심하자!** 재귀는 엄청난 콜 스택을 만들어버릴 수 있다. 

> 만약 공간을 다 써버리면 어떤 일이 발생할까? 바로 **stack overflow**이다! Pyhon 3.6에서는, ```RecursionError```를 띄울 것이다. 

> 함수가 *가장 마지막으로* 실행하는 것이 다른 함수를 호출하는 것이라면, 그 함수의 스택은 아마 더이상 필요치 않을 것이다. 그 함수는 마지막 호출을 하기 전에 스택을 비워 공간을 절약할 수 있다. 
>
> 이것은 **Tail Call Optimization(TCO)**라 불린다. 만약 재귀함수가 TCO로 최적화되었다면, 아마 거대한 콜 스택을 만들지 않게될 것이다.
>
> 일반적으로, 대부분의 언어는 TCO를 제공하지 *않는다.* Scheme은 TCO를 보장해주는 몇 안되는 언어 중 하나이다.  몇몇 Ruby, C, 그리고 자바스크립트는 TCO를 해 주지만, Pyhon과 Java는 절대 아니다. 