---
layout: post
title: "[알고리즘] 링크드리스트에서, 마지막에서 k번째 노드 찾기"
tags: [Linkedlist, Node, complexity]
date: 2020-02-19 16:29
---

### 링크드리스트가 주어졌을 때, 마지막에서 k번째 노드 찾기 

정수 ```k```와 단순 링크드리스트의 시작 노드 ```head_node```를 받아 리스트의 마지막에서 k번째 노드를 반환해주는 ```kth_to_last_node()```함수를 작성해보자. 

예를 들어, :

```python
class LinkedListNode:
    
    def __init__(self, value):
        self.value = value
        self.next = None
        
a = LinkedListNode("Angel Food")
b = LinkedListNode("Bundt")
c = LinkedListNode("Cheese")
d = LinkedListNode("Devil's Food")
e = LinkedListNode("Eccles")

a.next = b
b.next = c
c.next = d
d.next = e

# "Devil's Food" 값을 가진 노드를 반환한다.  (마지막에서 두 번째 노드)
kth_to_last_node(2, a)
```

 

#### Gotchas
------

*O(n)* 시간으로 할 수 있다. 

*O(1)* 공간으로 할 수 있다. 만약 재귀를 이용하면, 콜 스택에 O(n) 공간을 차지할 것이다! 



#### Breakdown
------

리스트의 마지막에 도달할 때까지 이터레이션을 돌고 k 노드만큼 거꾸로 돌아오는 방법을 떠올릴 수도 있다. 

하지만 우린 *단순* 링크드리스트를 가지고 있다! 따라서 거꾸로 돌아갈 수가 없다. 어떤 다른 방법을 사용해야 할까? 

만약 리스트의 *길이*를 가지고 있다면 어떨까? 

 그렇다면 시작노드부터 마지막에서 k번째 노드에 도달할 때까지 얼마나 가야할지를 알 수 있을 것이다. 

만약 리스트가 n개의 노드를 가지고 있다면, :

![](https://user-images.githubusercontent.com/44194800/74803080-0919d180-531f-11ea-89f5-a991a82af92c.PNG)

타겟인 마지막에서 k번째 노드는 다음과 같다. : 

![kthToLast](https://user-images.githubusercontent.com/44194800/74803143-38304300-531f-11ea-8e51-9012ec588af0.PNG)

시작 노드에서 타겟 노드까지의 거리는 n - k 가 된다. :

![distanceToTarget](https://user-images.githubusercontent.com/44194800/74803188-5f871000-531f-11ea-9e32-074a02554cc2.PNG)

그런데, 우리는 list (n) 의 길이를 모른다. 길이를 알아낼 수 있을까? 

그렇다, 시작부터 끝까지 돌면서 노드의 수를 세면 된다! 

이 접근방법을 코딩으로 구현해보자.  

```python
def kth_to_last_node(k, head):
    # 1단계: 리스트의 길이를 구한다
    # 시작 노드를 카운트해주기 위해 0이 아닌 1부터 시작
    list_length = 1
    current_node = head
    
    # 전체 리스트를 돌며, 모든 노드를 카운트한다
    while current_node.next:
        current_node = current_node.next
        list_length += 1
        
    # 2단계: 타겟 노드까지 간다
    # 시작 노드에서 마지막에서 k번째 노드에 도달할 때까지 얼마나 가야 할지 계산한다
    how_far_to_go = list_length - k
    current_node = head
    for i in range(how_far_to_go):
        current_node = current_node.next 
        
    return current_node
```

시간과 공간 비용이 어떻게 되는가?

리스트의 길이가 n이라 할 때, O(n) 시간과 O(1) 공간이 소요된다. 

더 정확하게는, 리스트의 길이를 구하기 위해 n 단계가 소요되고, 타겟 노드에 도달하기 위해 또다른 n-k단계가 소요된다. k = 1인 최악의 경우에서, 타겟 노드에 도달하기 위해 시작 노드부터 마지막 노드까지 또다시 다 돌아야 한다. 이것이 총 2n 단계가 되어서, 결국 O(n)이 소요된다. 

이를 더 개선할 수 있을까? 

아.........마도...??!

리스트의 길이만을 구하기위해 전체 리스트를 한 번 돌고, 마지막에서 k번째 노드에 도달하기 위해 리스트를 다시 돈다는 것은, 너무 많은 일인 것 같다. 아마도 이를 오직 한 번만 돌고 할 수 있지 않을까? 

k 노드 길이만큼의 "막대"가 있다면 어떨까? 리스트의 시작점에서 시작하면, 막대의 왼쪽 끝은 시작노드에, 오른쪽 끝은 k번째 노드에 있게될 것이다. 

![stickWithKlength](https://user-images.githubusercontent.com/44194800/74803698-43846e00-5321-11ea-813f-74382ca7920b.PNG)

그리고 스틱을 리스트 내에서 이동시킨다.  

![slideStick](https://user-images.githubusercontent.com/44194800/74803753-79c1ed80-5321-11ea-8637-632b88f0cb88.PNG)

이것을 어떻게 구현할 수 있을까? 아마도 이것이 *2개*의 포인터를 저장하도록 해주지 않을까? 

"막대"의 왼쪽 끝과 오른쪽 끝의 노드에 대한 참조값이 될 두 변수를 할당한다. 

```python
def kth_to_last_node(k, head):
    left_node = head
    right_node = head
    
    # 오른쪽 노드를 k만큼 이동시킨다
    for _ in range(k - 1):
        right_node = right_node.next
        
    # 왼쪽 노드를 시작 노드에서부터 시작해, 
    # 왼쪽 노드와 오른쪽 노드 사이의 거리를 k로 유지하면서 
    # 오른쪽 노드가 리스트의 끝에 닿을 때까지 리스트를 따라 이동한다
    while right_node.next:
        left_node = left_node.next
        right_node = right_node.next
        
    # 왼쪽 노드는 오른쪽 노드보다 k만큼 뒤에 있을 것이므로
    # 왼쪽 노드가 마지막에서 k번째 노드가 된다 
    return left_node
```

이 방법 또한 정답이긴 하지만, **이것이 정말 시간을 절약해주고 있을까?**



#### 정답
------

우리는 이 문제를 두 가지 방법으로 생각해볼 수 있다. 

##### 첫 번째 방법: 리스트의 길이 이용하기

1. 전체 리스트를 돌며 노드를 카운트해  ```list_length```를 구한다. 
2. ```list_length```에서 ```k```를 빼 시작 노드에서부터 타겟 노드(마지막에서 k번째 노드)까지의 거리를 구한다.
3. 시작 노드에서부터 타겟 노드까지 리스트를 돈다. 

```python
def kth_to_last_node(k, head):
    if k < 1:
        raise ValueError(
        	'Impossible to find less than first to last node: %s' % k
        )
        
    list_length = 1
    current_node = head
    
    while current_node.next:
        current_node = current_node.next
        list_length += 1
        
    if k > list_length:
        raise ValueError(
        	'k is larger than the length of the linked list %s' % k
        )
        
    how_far_to_go = list_length - k
    current_node = head
    for _ in range(how_far_to_go):
        current_node = current_node.next
        
    return current_node
```



##### 두 번째 방법: k길이 만큼의 "막대"를 유지하며 리스트를 한 번 이동한다. 

1. 시작 노드에서부터 k만큼 포인터를 이동시킨다. 이를 ```right_node```라 부른다.
2. 시작 노드에 또다른 포인터를 위치시킨다. 이를 ```left_node```라 부른다. 
3. 두 포인터를 같은 속도로 마지막 노드를 향해 이동시킨다. 따라서 두 노드 사이 거리는 k를 유지한다.
4. ```right_node```가 마지막 노드에 닿으면, ```left_node```가 타겟 노드에 위치하게 된다. (왜냐하면 마지막에서 k만큼 떨어진 지점일 것이기 때문이다.)

```python
def kth_to_last_node(k, head):
    if k < 1:
        raise ValueError(
        	'Impossible to find less than first to last node: %s' % k
        )
        
    left_node = head
    right_node = head
    
    for _ in range(k - 1):
        if not right_node.next:
            raise ValueError(
            	'k is larger than the length of the linked list: %s' % k
            )
        right_node = right_node.next
        
    while right_node.next:
        left_node = left_node.next
        right_node = right_node.next
        
    return left_node
```

두 방법 모두, k가 링크드리스트의 길이보다 크진 않은지 반드시 확인해야 한다! 그것은 잘못된 인풋이기 때문에, 에러 처리를 해주어야 한다. 



#### 복잡도
------

두 방법 모두 O(n) 시간과 O(1) 공간이 소요된다. 

**하지만 두 번째 방법은 "한 번에" 정답을 구하기 때문에 더 적은 단계가 걸리지 않을까? *아니다!!***

첫 번째 방법에서, 우리는 하나의 포인터를 시작 노드에서부터 마지막 노드까지 이동시키고(리스트의 길이를 구하기 위해), 또다른 포인터를 시작노드에서부터 타겟 노드(마지막에서 k번째 노드)까지 이동시킨다. 

두 번째 방법에서, ```right_node```는 마찬가지로 시작 노드에서 마지막 노드까지 이동하고, ```left_node```는 또한 마찬가지로 시작 노드에서부터 타겟 노드까지 이동한다. 

따라서 두 방법 모두에서, 두 포인터는 리스트 내에서 같은 단계를 거치게 된다. 유일한 차이첨은 단계를 거치는 *순서*뿐이다. 단계 수는 두 방법 모두 동일하다.

**하지만, 최신 프로세서와 메모리가 가지고 있는 캐싱이나 다른 최적화로 인해 두 번째 방법이 조금은 더 빠를 수도 있다.**

캐싱에 초점을 맞춰보자. 보통 메모리로부터 데이터를 가져올 때(예를 들어, 링크드리스트 노드에 대한 정보), 그 데이터를 프로세서 옆에 있는 작은 캐시에도 저장해둔다. 만약 바로 직후에 같은 데이터를 또다시 사용해야 한다면, 데이터를 캐시로부터 빠르게 가져올 수 있다. 하지만 그 데이터를 한동안 사용하지 않는다면, 더 최근에 사용한 다른 것들로 그 데이터를 교체할 것이다. (이를 "Least Recently Used(LRU)" 교체 정책이라 부른다.)

위의 두가지 알고리즘은 리스트에 있는 많은 노드들에 두 번씩 접근하고, 따라서 이 캐싱을 이용할 수도 있다. 하지만 우리의 두 번째 알고리즘에서는 첫 번째와 두 번째 시간 사이에 주어진 노드에 접근하는 시간이 훨씬 짧다는 것을 주목해야 한다. (이것을 때때로 "참조 지역성(Locality of reference) - 동일한 값 또는 해당 값에 관계된 스토리지 위치가 자주 액세스되는 특징"라고 한다.) 따라서 두 번째 알고리즘이 프로세서의 캐시를 사용함으로써 시간을 절약해줄 수 있을 것 같다! 하지만 이것은 프로세서의 캐시가 "Least Recently Used(LRU)"  교체 정책 같은 것을 사용한다고 가정한 것이다. - 아마 다른 것을 사용하고 있을 수도 있다. 궁극적으로 어떤 알고리즘이 더 빠른지 진짜로 알아내는 *가장 좋은* 방법은 둘 다 구현하고 몇 가지 다른 인풋에 대해 실행 시간을 재보는 것이다! 



#### 보너스
------

이것을 더 개선할 수 있을까? n이 아주 크고 k가 아주 작은 경우는 어떨까? 이 경우에 타겟 노드는 리스트의 끝부분에 가깝게 될 것이고, 따라서 시작 노드에서부터 리스트를 *두 번* 도는 것은 낭비같아 보인다. 

"두 번째" 돌 때 단계 수를 확 줄일 수 있을까? 리스트의 길이를 구하기 위해서는 확실히 하나의 포인터가 시작 노드에서부터 마지막 노드까지 쭉 돌아야만 한다. 하지만 돌면서 "체크포인트"를 저장해두어 두 번째 포인터가 시작 노드에서부터 쭉 돌 필요가 없게끔 할 수 있을까? 이러한 "체크포인트"들을 일정한 공간(constant space)에 저장할 수 있을까? 

Note: 이 접근방식은 타겟 노드가 리스트의 끝부분에 있다는 것을 아는 경우에만 시간을 절약해준다 (즉, n이 k보다 훨씬 큰 경우이다).



#### 결론
------

두 가지 좋은 풀이로 문제를 풀어보았다. 하나의 풀이가 두 번 도는 반면에 나머지 하나는 한 번만 돌아서 문제를 해결하였다. 하지만 한 번만 도는 접근방법은 많은 단계들을 절반으로 줄인 것이 아니라, 단지 *같은* 단계를 다른 *순서*로 돈 것 뿐이다. 

그러니 속지 말자!! 

 "한 번" 도는 것이 "두 번" 도는 것보다 항상 적은 단계 수를 거치는 것은 아니다. 항상 "실제로 얼마만큼의 단계 수가 바뀌었는가"를 스스로에게 물어보도록 하자! 





