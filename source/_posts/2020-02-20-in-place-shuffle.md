### 리스트의 내부적으로 섞는 함수를 작성해라. 



셔플은 "유니폼"해야만 하는데, 이는 원본 리스트에 있는 각 원소가 최종 리스트 내 각 위치에서 있을 확률이 같아야만 한다는 것을 의미한다. 

```floor```보다 크거나 같고 ```ceiling```보다 작거나 같은 임의의 정수를 구하기 위한 ```get_random(floor, ceiling)```함수가 있다고 가정해보자.



#### Gotchas

------

 일반적인 첫 번째 아이디어는 리스트를 돌면서 각 원소를 임의의 다른 원소와 바꾸는 것이다. 

그 코드는 아래와 같다. :

```python
import random

def get_random(floor, ceiling):
    return random.randrange(floor, ceiling + 1)

def naive_shuffle(the_list):
    # 리스트의 각 인덱스에 대해
    for first_index in range(0, len(the_list) - 1):
        # 임의의 다른 인덱스를 뽑는다
        second_index = get_random(0, len(the_list) - 1)
        # 값을 서로 바꾼다
        if second_index != first_index:
            the_list[first_index], the_list[second_index] = \
            	the_list[second_index], the_list[first_index]
            
```

**하지만, 이것은 균등분포가 아니다.** 

왜일까?  이를 보이기 위해 두 결과의 정확한 확률값을 계산할 수도 있다. 하지만 수학으로 접근하면 조금 까다로울 수가 있다. 대신에, 이렇게 생각해보자 : 

리스트에 세 원소가 있다고 해보자 [a, b, c]. 이는   







