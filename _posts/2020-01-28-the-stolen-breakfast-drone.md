---
layout: post
title: "[알고리즘] 문제)도둑맞은 아침 배달 드론"
---

### 도둑맞은 아침 배달 드론!

------

#### Description

------

회사에 아침식사를 배달해주는 드론이 있다.  각 아침 배달은 유니크한 양수의 ID가 할당되어있다. 

100대의 드론이 배달을 위해 이륙하면, 배달ID는 delivery_id_confirmations라는 리스트에 추가된다. 

드론이 배달을 끝내고 돌아와 착륙한다면, ID는 다시 같은 리스트에 추가된다. 

오늘 아침, 배달을 끝내고 오직 99대의 드론만이 다시 돌아왔다. 

하나의 드론은 돌아오지 못했는데, Amazon의 스파이가 주문을 한 뒤 드론 한개를 훔쳐갔을 것이라고 의심하고 있다. 

이를 추적하기 위해, 우리는 그들의 배달ID를 알아내야 한다. 

ID리스트가 주어졌을 때, 중복된 정수들이 포함되어 있을 것이고, 단 하나의 유니크한 정수가 존재할텐데,  그 유니크한 정수값을 찾아라. 

> 제약사항: ID들은 정렬된다고 보장할 수 없다. 
>
> 주문이 들어온 순서대로 이행되는 것은 아니며, 어떤 주문들은 이륙 전에 취소되기도 한다. 

#### Gotcha

------

O(n)으로 해결할 수 있다. 

input list에 얼마나 많은 정수들이 있든지간에, 우리는 O(1) space로 unique ID를 찾을 수 있다

#### Breakdown

------

Brute Force 접근방식은 모든 ID를 확인하고 중복이 있는지 확인하기 위해 모든 다른 ID를 확인하기 위해 

두 개의 nested loop(중첩 루프) 를 이용하게 될 것이다. 

이것은 O(n^2) time과 O(1) space가 걸릴 것이다. 이 runtime을 줄일 수 있을까?

하나를 제외한 모든 정수가 2번씩 등장하는 것을 안다. 

그렇다면, 그냥 각 정수가 몇번씩 등장하는지 추적하면 되지 않을까?

우리는 list를 돌며 각 정수를 dictionary에 저장한다. 

이 때, key는 정수값이고, value는 그 정수값이 이제까지 등장한 횟수가 된다. 

마지막에는, 한 번만 관찰된 정수값을 뱉어주기만 하면 된다. 

```python
def find_unique_delivery_id(delivery_ids):
    ids_to_occurences = {}
    for delivery_id in delivery_ids:
        if delivery_id in ids_to_occurences:
            ids_to_occurences[delivery_id] += 1
        else:
            ids_to_occurences[delivery_id] = 1

    for delivery_id, occurences in ids_to_occurences.items():
        if occurences == 1:
            return delivery_id
```

자 이제, runtime 을 O(n)으로 줄였다. 

아마 이것이 최적의 runtime이 될 것이다. 

최악의 경우 하나의 unique한 정수를 찾기 위해 모든 정수를 확인해야한다. 

그런데 이제 dictionary에 대해 O(n) space를 가지게 되었다. 

이걸 줄일 수 있을까? 



....최적화는 다음 포스팅에 계속)

