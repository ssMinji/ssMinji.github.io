---
layout: post
title: "[알고리즘] 중복 하위문제(Overlapping Subproblem)"
tags: [algorithm, fibonacci, subproblem]
date: 2020-02-07 17:13:23
---

### 중복 하위 문제(Overlapping Subproblems )
------

문제를 푸는데 *같은* 하위 문제를 여러번 풀게된다면, 그 문제는 **중복 하위 문제**를 가지고 있다고 할 수 있다. 

예를 들어, 피보나치 수열을 살펴보자.(각 숫자가 이전의 두 수들의 합으로 나타나는 수들의 나열 - 0, 1, 1, 2, 3, 5, 8,...)

만약, *n*번째 피보나치 수를 계산하고자 한다면, 우리는 다음의 간단한 재귀 알고리즘을 이용할 수 있을 것이다. 

```python
def fib(n):
    if n == 0 or n == 1:
        return n
    return fib(n-1) + fib(n-2)
```

여기서 ```fib(n-1)``` 과 ```fib(n-2)```를 ```fib(n)```의 **하위문제**라고 부른다. 

이제 ```fib(5)```를 호출하면 어떤 일이 발생하는지 알아보자.

<img width="410" alt="recursionTree" src="https://user-images.githubusercontent.com/44194800/74012065-b9f1a980-49cc-11ea-98d6-15f3c83b7411.PNG">

이 함수는 재귀적으로 ```fib(2)```를 **3번** 호출한다. 따라서 *n*번째 피보나치 수를 찾는 문제는 중복 하위 문제를 가지고 있다고 할 수 있다. 





