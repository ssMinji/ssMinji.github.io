---
layout: post
title: "[알고리즘] 해설)도둑맞은 아침 배달 드론"
tags: [algorithm, beatOperation]
date: 2020-01-29 17:00
---

### 도둑맞은 아침 배달 드론! -- 해설

------

먼저, value로 정수 대신에 boolean을 사용할 수도 있다. 만약 정수를 확인하면dictionary에서 그것을 key로 하고 value를 True로 설정한다. 그리고 다시 그 정수를 봤을 때, value값을 False로 바꾼다. 그렇게되면 마지막에, 중복되지 않는 주문ID는 value값으로 True를 갖게될 것이다. 

이것이 우리에게 얼마만큼의 space를 절약해줄까? 그것은 사용하는 언어가 boolean과 integer를 어떻게 저장하느냐에 달려있다. 가끔 boolean은 integer만큼의 space를 차지하게 된다. 실제로, Python에서 boolean은 integer의 *하위타입(subtype)*이다. 

그리고 만약 각 boolean이 단 1bit에 불과하더라도, 전체적으로는 여전히 O(n) space일 것이다. 



**그렇다면 Boolean을 사용한다고 해서 space가 그렇게 줄지는 않을 것이다.  그럼 다른 방법이 있을까?**

조금 물러서서 우리가  무엇을 하고 있는지 생각해보자. 우리가 가진 유일한 데이터는 정수이다. 정수는 어떻게 저장되는가? 

컴퓨터는 정수를 bit를 이용해 이진수로 저장한다. 만약 우리가 이 문제를 각 bit 수준에서의 문제로 생각해보면 어떻게될까? 

AND, OR, XOR, NOT 그리고 bit shift의 **비트연산**에 대해 생각해보자. 

이 연산들 중 하나가 우리의 unique한 정수를 찾는데 도움이 될까?

우리는 모든 정수 중 하나의 정수만 제외하고 두 번씩 마주치게 된다.  비트 연산 중 **정수의 두 번째 발생이 첫 번째 발생을 취소해버리게** 할 수 있을까?

어떤 비트연산이 그것을 가능하게 할까?



### Solution

------

우리는 리스트에 있는 모든 정수에 대해 XOR연산을 한다. 우선 unique_delivery_id라는 변수를 0으로 설정한다. 우리가 새로운 ID에 대해 XOR연산을 할 때마다, 비트가 바뀔 것이다. 만약 같은 ID에 대해 XOR 연산을 한다면, 이건은 이전에 바뀌었던 변화를 취소시킬 것이다. 

그렇게되면 마지막에는, 한 번만 나타난 ID만이 남게될 것이다! 

```python
def find_unique_delivery_id(delivery_ids):
    unique_delivery_id = 0
    
    for delivery_id in delivery_ids:
        unique_delivery_id ^= delivery_id
       
    return unique_delivery_id
```



### Complexity(복잡도)

------

O(n) 시간복잡도, O(1) 공간복잡도



### 결론

------

이 문제는 "비트 연산"을 아는 것의 위력을 느끼게 해준다. 

비트 연산이 문제를 푸는 열쇠가 되는 것을 어떻게 알 수 있을까? 다음이 몇가지 힌트가 될 수 있다:

1. 2로 곱하거나 나누어야 하는 상황(2로 곱해야한다면 left shift를, 2로 나누어야한다면 right shift를 사용해라)
2. 같은 숫자를 "없애버려야" 하는 상황(XOR연산을 사용해라)















 











