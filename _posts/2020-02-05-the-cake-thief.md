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

<img width="410" alt="recursionTree" src="https://user-images.githubusercontent.com/44194800/73815909-adcde680-482a-11ea-8674-6b09dccf324a.PNG">

이렇게 가지를 뻗어나감으로써 발생되는 반복 작업을 피하기 위해서는, 입력값을 출력값과 매핑해주는 ```memo``` 라는 속성을 가진 클래스로 함수를 감싸야한다. 

그렇다면 우리는 단순히

1. ```memo```를 체크함으로써 어떤 주어진 입력값에 대해 계산을 안 해도 되는지 확인할 수 있고, 
2. 계산 결과를 ```memo```에 저장할 수 있다. 

```python
class Fibber(object):
    
    def __init__(self):
        self.memo = {}
        
    def fib(self, n):
        if n < 0:
            raise IndexError(
                'Index was negative.'
                'No such thing as a negative index in a series.'
            )
        
        # Base cases    
        elif n in [0, 1]:
            return n
        
        # 이미 계산한 값인지 아닌지 확인한다. 
        elif n in self.memo:
            print ("grabbling memo[%i]" % n)
            return self.memo[n]
        
        print("computing fib(%i)" % n)
        result = self.fib(n - 1) + self.fib(n - 2)
    	
        # Memoize
        self.memo[n] = result
        
        return result
```

이제 우리의 재귀 트리에서, 노드는 두 번 이상 나타나지 않는다 .

<img width="410" alt="recursionTree2" src="https://user-images.githubusercontent.com/44194800/73816764-c8a15a80-482c-11ea-8636-182db7a66ccd.PNG">

Memoization(메모이제이션)은 **dynamic programming(동적 계획법)** 문제를 풀 때 흔히 쓰이는 방법이다. 동적 계획법이란 문제의 정답이, 입력값의 더 작은 부분에 대해 동일한 문제의 정답으로 구성되어 있는(마치 위에서 설명한 피보나치 같은 문제) 문제를 의미한다. 동적 계획법 문제를 풀기 위한 또다른 일반적인 방법은 **Bottom-up**이 있는데, 보통 이것이 더 깔끔하고 더 효율적이다. 



그렇다면, **Bottom-up**이란 무엇인가? 

다음 포스팅으로 넘어가자 ! 