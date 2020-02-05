---
layout: post
title: "[알고리즘] Memoization(메모이제이션) 꿀이해"
tags: [algorithm, memoization, dynamic-programming]
date: 2020-02-05 14:36:46
---

### Memoization(메모이제이션)
------



**Memoization**은 주어진 입력값에 대한 결과를 저장함으로써 같은 입력값에 대해 함수가 한 번만 실행되는 것을 보장한다(보통 딕셔너리에 저장한다). 

예를 들어보자. *n*번째 피보나치 수를 계산하는 간단한 재귀식을 보자:

```python
def fib(n):
    if n < 0:
        raise IndexError(
        	'Index was negative.'
            'No such thing as a negative index in a series.'
        )
    elif n in [0, 1]:
        # Base cases
        return n
    
    print("computing fib(%i)" % n)
    return fib(n - 1) + fib(n - 2)
```

이 것은 같은 입력값에 대해 여러번 실행하게 된다.

우리는 이 함수의 재귀호출을 트리 형태로 상상해볼 수 있다. 노드의 두 자식들이 노드가 만들어내는 두 재귀호출이 되는 것이다. 우리는 트리가 걷잡을 수 없이 빠르게 가지를 뻗어가는 것을 볼 수 있다. 

![image-20200205133951596]
(./assets/images/post/recursionTree.png)





