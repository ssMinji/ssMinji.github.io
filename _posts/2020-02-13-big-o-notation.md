---
layout: post
title: "[알고리즘] 빅 오 표기법(Big O notation)"
tags: [Algorithm, BigO, optimization, complexity] 
date: 2020-02-13 15:37
---

### 빅 오 표기법(Big O Notation)

##### 지루하지 않은 수학을 이용해 코드의 효율성을 측정해보자
------

#### 빅 오 표기법의 아이디어 

빅 오 표기법은 알고리즘이 실행되는데 걸리는 시간을 이야기하기 위한 언어이다. 문제를 푸는 여러 다른 접근 방법들 간의 효율성을 비교하기 위한 방법이다. 

이것은 수학같지만 멋있고, 지루하지 않은 종류의 수학이다. 디테일한 내용은 넘어가고 그냥 기본적인 내용에만 집중하면 된다. 

빅 오 표기법을 사용해 우리는 *인풋이 커짐에 따라 상대적으로  인풋 대비 런타임이 얼마나 빨리 증가하는지* 나타낼 수 있다. 

이것이 무슨 말인지 알아보자:

1. **런타임이 얼마나 빨리 증가하는지** : 알고리즘의 정확한 런타임을 계산하는 것은 어렵다. 이것은 프로세서의 속도, 컴퓨터가 어떤 다른 작업을 수행하고 있는지 등에 의해 달라진다. 따라서 런타임에 대해 직접적으로 이야기하는 것 대신, 빅 오 표기법을 이용해 런타임이 얼마나 빨리 증가하는지에 대해 이야기하는 것이다.  
2. **인풋 대비**: 만약 런타임을 직접적으로 측정할 수 있다면, 속도를 초 단위로 표현할 수 있을 것이다. 우리는 런타임이 얼마나 빨리 증가하는지를 측정하고 있기 때문에, 속도를 다른 무언가...로 표현할 필요가 있다. 빅 오 표기법에서는, 인풋의 크기를 "*n*"으로 나타낸다.  따라서 "런타임이 인풋 사이즈에 비례해 증가한다(*O(n)*)" 혹은 "런타임이 인풋 사이즈의 제곱의 크기로 증가한다(*O(n^2)*)" 와 같이 표현할 수 있다. 
3. 인풋이 커짐에 따라: 알고리즘은 n이 작을 때는 비용이 크지만  n이 커짐에 따라 결국 다른 단계들에 의해 가려지는 단계들을 가지고 있을 수 있다. 빅 오 관점에서, 인풋이 증가함에 따라 가장 빠르게 커지는 부분에 초점을 맞추는데, 왜냐하면 다른 모든 것들은 n이 아주 커짐에 따라 빠르게 가려지기 때문이다. (만약 점근선이 무엇인지 알고 있다면, "빅 오 표기법"이 왜 가끔 "점근 표기법"이라고 불리는지 알 것이다.)

여기까지의 설명이 조금 추상적이라고 느껴진다면, 실제로 이것이 추상적이기 때문이다. 

이제 몇가지 예제를 들여다보자.

#### 예제
------

```python
def print_first_item(items):
    print(items[0])
```

**이 함수는 인풋 대비 O(1) 시간(혹은 "상수 시간")으로 실행된다.** 인풋 리스트는 1개 혹은 1000개의 원소를 가지고 있을 수 있지만, 이 함수는 여전히 단 한 "단계"만을 필요로 한다.

```python
def print_all_items(items):
    for item in items:
        print(item)
```

**이 함수는 리스트의 원소 개수가 n일 때, O(n) 시간(혹은 "선형 시간")으로 실행된다.** 만약 리스트가 10개의 원소를 가지고 있다면, 10번 출력해야 할 것이다. 만약 1000개의 원소를 가지고 있다면, 1000번 출력해야 할 것이다. 

```python
def print_all_possible_ordered_pairs(items):
    for first_item in items:
        for second_item in items:
            print(first_item, second_itme)
```

여기서는 이중 for문이 들어있다. 만약 리스트가 n개의 원소를 가지고 있다면, 바깥 루프는 n번 돌 것이고, 바깥 루프의 각 이터레이션에 대해 안쪽 루프가 n번 돌게 될 것이다. 즉, 총 n^2번 출력해야 할 것이다. 따라서 **이 함수는 O(n^2) 시간 (혹은 "2차 시간")으로 실행된다.** 만약 리스트가 10개의 원소를 가지고 있다면, 100번 프린트해야 할 것이다. 만약 1000개의 원소가 있다면, 1,000,000번 출력해야 할 것이다. 

#### N은 *실제*  인풋일 수도, 혹은 인풋의 *크기*일 수도 있다. 

아래의 두 함수는, 하나는 정수를 인풋으로 받고 다른 하나는 리스트를 인풋으로 받고 있지만,  둘 다 *O(n)* 실행시간을 갖는다. 

```python
def say_hi_n_times(n):
    for time in range(n):
        print("hi")
        
        
def print_all_items(items):
    for item in items:
        print(item)
```

따라서 *n*은 함수의 인풋으로 들어오는 실제 숫자일 수도 있고, 인풋 리스트 (혹은 맵, 오브젝트 등...)의 원소의 개수일 수도 있다.

#### 상수는 버린다
------

이것이 빅 오 표기법이 사용되는 이유이다. 빅 오 복잡도를 계산할 때, 상수는 그냥 버리면 된다. 

예를 들면:

```python
def print_all_items_twice(items):
    for item in items:
        print(item)
    
    # 한 번 더 같은 작업을 수행한다. 
    for item in items:
        print(item)
```

위 함수는 *O(2n)*을 갖지만, 그냥 *O(n)*이라 한다. 

```python
def print_first_item_then_first_half_then_say_hi_100_times(items):
    print(items[0])
    
    middle_index = len(itmes) / 2
    index = 0
    while index < middle_index:
        print(items[index])
        index += 1
        
    for time in range(100):
        print("hi")
```

위 함수는 O(1 + n/2 + 100)을 갖지만, 그냥 O(n)이라 한다. 

상수는 왜 그냥 없애버릴 수 있을까? 빅 오 표기법은 **n이 굉장히 커질 때** 어떻게 되는지 보기 위한 것이라는 사실을 기억하자. n이 굉장히 커짐에 따라, 100을 더하는 것이나 2로 나누는 것은 영향을 주지 않는다. 

#### 낮은 차수의 항은 버린다
------

예를 들어보자:

```python
def print_all_numbers_then_all_pair_sums(numbers):
    print("these are the numbers:")
    for number in numbers:
        print(number)
        
    print("and these are their sums:")
    for first_number in numbers:
        for second_number in numbers:
            print(first_number + second_number)
```

위의 함수는 O(n + n^2)의 런타임을 갖지만, 그냥 O(n^2)이라 한다. 만약 이것이 O(n^2/2 + 100n)이였다고 해도, 여전히 O(n^2)이다. 

동일하게:

- O(n^3 + 50n^2 + 10000)은 O(n^3)이다
- O((n + 30) * (n + 5))는 O(n^2)이다

다시 한 번 말하지만, 이것을 빼버릴 수 있는 이유는 n이 커짐에 따라 낮은 차수의 항들은 영향이 미미해지기 때문이다. 

#### 일반적으로 "최악의 경우"를 이야기한다
------

보통 이 "최악의 경우" 법칙이 암시되어 있다. 하지만 때때로 명확하게 얘기해 면접관을 감동시킬 수도 있다. 

때때로 최악의 경우의 런타임은 최선의 경우의 런타임보다 현저히 떨어진다. :

```python
def contains(haystack, needle):
    
    # 건초더미에서 바늘을 찾았는가?
    for item in haystack:
        if item == needle:
            return True
    
    return False
```

만약 haystack에 100개의 원소가 있다고 했을 때, 1번째 원소가 needle일 수도 있을 것이다. 이 경우 반복문은 단 한 번만 돌게 될 것이다. 

일반적으로 이것을 O(n) 시간이라 이야기하는데, 이것이 "최악의 경우" 법칙을 암시하고 있는 것이다. 하지만 좀 더 명확하게는 최악의 경우 O(n), 최선의 경우 O(1) 시간이 걸린다고 이야기할 수 있을 것이다. 어떤 알고리즘에서는 "평균의 경우" 런타임에 대해 엄밀하게 말할 수도 있다. 

#### 공간 복잡도
------

때때로 시간이 덜 걸리는 것보다(혹은 시간이 덜 걸리면서) 메모리를 덜 사용하도록 최적화하고자 할 때가 있다. 메모리 비용(혹은 "공간 복잡도")에 대해 이야기하는 것은 시간 비용에 대해 이야기 하는 것과 매우 흡사하다. 단순히 할당하고 있는 새로운 변수들의 총 크기(인풋 사이즈와 비교해서)를 살펴보면 된다. 

아래의 함수는 O(1) 공간을 갖는다. (고정된 개수의 변수를 사용한다):

```python
def say_hi_n_times(n):
    for time in range(n):
        print("hi")
```

아래의 함수는 O(n)공간을 갖는다. (```hi_list```의 크기는 인풋의 크기에 따라 달라진다)

```python
def list_of_hi_n_times(n):
    hi_list = []
    for time in range(n):
        hi_list.append("hi")
   	return hi_list
```

**보통 공간 복잡도에 대해 이야기 할때 *추가 공간*에 대해 이야기하기 때문에,** 즉 인풋이 차지하는 공간은 고려하지 않는다. 예를 들어, 아래의 함수는 인풋이 n개의 원소를 가진다 하더라도 상수 공간을 갖는다. :

```python
def get_largest_item(items):
    largest = float('-inf')
    for item in items:
        if item > largest:
            largest = item
    return largest
```

때때로 시간을 절약하는 것과 공간을 절약하는 것 사이에는 트레이드 오프가 존재하기 때문에, 둘 중 어떤 것을 최적화할지 결정해야 한다. 

#### 

알고리즘을 *설계할 때* 시간과 공간 복잡도에 대해 생각하는 습관을 길러야 한다. 머지않아 이것은 자연스러워질 것이고, 최적화와 잠재적 성능 이슈 문제를 즉시 파악할 수 있게 된다. 

점근 분석은 강력한 도구이지만, 현명하게 사용해야 한다. 

빅 오 표기법은 상수를 무시하지만, 때때로 **상수가 중요해지기도 한다.** 만약 5시간이 소요되는 코드가 있다고 할 때, 런타임을 5로 나누는 최적화는 빅 오에는 영향을 미치지 않겠지만, 여전히 4시간의 기다림을 절약해 줄 것이다. 

**조기 최적화에 주의하자.** 때때로 시간 or 공간을 최적화하는 것은 코딩 시간과 가독성에 부정적인 영향을 미친다. 작은 스타트업의 경우 비록 시간과 공간 효율성이 낮더라도, 빨리 적용하기 쉽거나 나중에 이해하기 쉬운 코드를 작성하는 것이 더 중요할 수 있다. 

> 조기 최적화란?
>
> 실제로 필요하지 않은 것에 많은 시간을 허비하는 것
>
> *“The real problem is that programmers have spent far too much time worrying about efficiency in the wrong places and at the wrong times; premature optimization is the root of all evil (or at least most of it) in programming.”* - Donald Knuth, The Art of Computer Programming

하지만 스타드업이 빅 오 분석을 신경쓰지 않는다는 말은 아니다. 훌륭한 개발자는(스타트업이나 혹은 다른 곳의) 런타임과, 메모리와, 실행 시간과, 유지보수와 가독성 사이의 적절한 균형을 잡을 줄 안다. 

**개발자는 시간, 공간 최적화를 볼 수 있는 *기술*과 그러한 최적화가 가치 있는지 판단하는 *지혜*를 길러야 한다.** 