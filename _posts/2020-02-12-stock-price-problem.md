---
layout: post
title: "[알고리즘] 주식거래에서 최대 이익 계산하기 문제!(feat.그리디 방식)"
tags: [Greedy, Algorithm]
date: 2020-02-12 17:23:17
---

#### Apple 주식을 사고 팔 때 최대의 이익을 얻을 수 있는 경우 찾기 
------

먼저, 만약 어제 하루종일 애플 주식을 거래했다면 *얼마를 벌 수 있었는지*를 알고자 한다. 

따라서 어제의 애플 주식 가격을 가져와서 ```stock_prices``` 리스트에 담는다:

- **인덱스**는 9:30분의 장 오픈 시간으로부터 얼마나 지났는지를 의미하며 분 단위 시간을 나타낸다. 
- **엘리먼트 값**은 해당 시간에 애플 주식 한 주의 가격을 US 달러 기준으로 나타낸다. 

따라서 만약 주식 가격이 10:30am에 $500이였다면, ```stock_prices[60] = 500```이 될 것이다. 

```stock_prices```를 입력으로 받아 **어제 애플 주식 한 주를 한 번 매수하고 한 번 매도함으로써 얻을 수 있었던 최대 이익**을 반환하해주는 효율적인 함수를 작성해보자. 

예를 들면:

```python
stock_prices = [10, 7, 5, 8, 11, 9]

get_max_profit(stock_prices)
# return 6 ($5에 사서 $11에 판다)
```

단, 팔려면 먼저 사야한다. 또한, 사고 파는 것을 동시에 할 수 없다. 즉, 팔기 위해서는 산 이후로 적어도 1분이 지나야 한다. 



#### Gotchas
------

단순히 가장 높은 가격과 가장 낮은 가격의 차이로 구할 수는 없을 것이다. 왜냐하면 가장 높은 가격은 가장 낮은 가격의 앞에 있어야 할 것이기 때문이다. 그리고 팔기 전에는 먼저 사야 한다. 만약 가격이 *하루종일 내려가면* 어떻게 될까? 이 경우, 최대 이익은 **음수**가 될 것이다.

이것은 *O(n)* 시간과 *O(1)* 공간으로 풀 수 있다! 

#### Breakdown
------

먼저, ```stock_prices```에 임의로 몇 개의 값을 넣어서 최대 이익을 찾는 것을 "손으로" 풀어보자. 최대 이익을 알아내기 위한 과정이 어떻게 될까? 

brute force 방식은 각 시간의 모든 쌍에 대해 값을 구하고 어떤 값이 더 높은지 찾는 방법이다. (더 이른 시간을 매수(구매) 시간으로, 더 늦은 시간을 매도(판매)시간으로 한다)

```python
def get_max_profit(stock_prices):
    max_profit = 0
    
    # 모든 시간에 대해 조사한다
    for outer_time in range(len(stock_prices)):
        
        # 매 시간에 대해, 모든 다른 시간을 조사한다
        for inner_time in range(len(stock_prices)):
            # 각 쌍에 대해, 이른 시간과 늦은 시간을 찾는다
            earlier_time = min(outer_time, inner_time)
            later_time = max(outer_time, inner_time)
            
            # 그리고 그것으로 주식 가격의 시간순서를 구분한다
            earlier_price = stock_prices[earlier_time]
            later_price = stock_prices[later_time]
            
            # 만약 이전가격에 사서 이후가격에 팔았을 때의 이익을 계산한다
            potential_profit = later_price - earlier_price 
            
            # 이익이 더 크다면 max_profit을 갱신한다
            max_profit = max(max_profit, potential_profit)
   
	return max_profit
            
```

하지만 이것은 이중 loop를 돌아야하기 때문에, *O(n^2)* 시간이 걸릴 것이다. (각 모든 시간에 대해, 우리는 모든 다른 시간을 조사해야 한다) 

또한, **정답이 올바르지도 않다**: 음수 이익에 대해서는 고려하지 않았기 때문이다! 그렇다면 이것을 개선할 수 있을까?

일단, 우리는 많은 추가 작업을 하고 있다. 우리는 모든 쌍을 *두 번씩* 확인하고 있다. 주식을 팔기 전에 우선 구매해야 한다는 것을 알기 때문에, 안쪽 루프에서는 바깥쪽 루프의 가격 **이후**의 가격만 확인하면 될 것이다.  

이는 다음과 같을 것이다:

```python
def get_max_profit(stock_prices):
    max_profit = 0
    
    # 모든 가격을 조사한다 (시간을 의미하는 인덱스도 조사한다)
    for earlier_time, earlier_price in enumerate(stock_prices):
        
        # 그리고 모든 "이후의" 가격을 조사한다
        for later_time in range(earlier_time + 1, len(stock_prices)):
            later_price = stock_prices[later_time]
            
            # 만약 이전 가격에 구매해서 이후 가격에 되팔았을 때의 이익을 계산한다
            potential_profit = later_price - earlier_price 
            
            # 이익이 더 크다면 max_profit을 갱신한다
            max_profit = max(max_profit, potential profit)
            
	return max_profit
```

**이제 실행시간이 어떻게 될까?** 

살펴보면, 바깥쪽 for문은 모든 시간과 가격에 대해 돌지만, 안쪽 for문은 매 시간에 대해 *하나 더 적은* 가격을 조사하게 된다.  따라서 총 단계 수는, 
$$
n + (n-1) + (n-2) + ... + 2 + 1
$$
이 될 것이고, 결국 여전히 O(n^2) 시간이 걸린다. 

> 왜냐하면, 1~ *n* 까지의 합은 *n^2*/2에 수렴하기 때문이다. (즉, O(n^2)) 
>
> 빅 오 표기법에서, 항상 상수는 무시한다.

더 개선해보자!

만약 O(n^2)를 개선하려면, 아마도 O(nlogn) 혹은 O(n)으로 할 수 있을 것이다.  

O(nlogn)은 리스트를 절반으로 재귀적으로 잘라나가는 정렬과 탐색 알고리즘에 나타난다. 여기서는 리스트를 절반으로 자름으로써 시간을 절약할 수 있을지 분명하지가 않다. 그럼 for문을 *오직 한 번만* 돌면서 얼마나 개선할 수 있는지 한 번 보자. 

리스트를 한 번만 돌려고 하고 있으므로, 그리디(greedy) 방식을 사용해보자. 그리디를 사용하면 ```max_proft```을 끝까지 계속 계산해야 한다. ```max_profit```은 0부터 시작할 것이다. for문을 돌면서, 만약 새로운 ```max_profit```값을 찾으면, 그것을 어떻게 알아낼 수 있을까? 

각 이터레이션에서, ```max_profit```은 둘 중 하나일 것이다:

1. 마지막 시간 단계에서의 ```max_profit```과 같거나
2. ```current_price```에서 매도함으로써 얻게된다. 

2번의 경우는 어떻게 알아낼 수 있을까? 

```current_price```에서 매도함으로써 얻게되는 최대 이익은 단순히 ```current_price```와 더 이른 시간에서의 ```min_price```의 차이값이 될 것이다. 만약 이 차이값이 현재 ```max_profit```보다 크면, 우리는 새로운 ```max_profit```을 얻게 된다. 

따라서 모든 가격에 대해 우리는, 

- 이제까지 봤던 가격 중 가장 낮은 가격을 계속 추적한다.
- 더 나은 이익을 얻을 수 있는지 확인한다. 

다음이 가능한 풀이 중 하나가 될 것이다:

```python
def get_max_profit(stock_prices):
    min_price = stock_prices[0]
    max_profit = 0
    
    for current_price in stock_prices:
        # min_price는 이제까지 본 가격 중 가장 낮은 가격이다
        min_price - min(min_price, current_price)
        
        # min_price에서 사고 current_price에서 팔았을 때의 이익을 계산한다
        potential_profit = current_price - min_price
        
        # 이익이 더 크다면 max_profit을 갱신한다.
        max_profit = max(max_profit, potential_profit)
        
    return max_profit
```

이제 최대 이익을 한 번의 for문으로 찾을 수 있다! 

**끝난걸까?** 경계 조건(edge case)를 한 번 생각해보자. 만약 가격이 항상 일정하면 어떻게 될까? 만약 가격이 하루종일 떨어지면 어떻게 될까?

만약 가격이 달라지지 않는다면, 가능한 최대 이익은 0이다. 우리의 함수는 정확히 0을 반환한다. 따라서 이 경우는 괜찮다. 

하지만 만약 가격이 하루종일 떨어진다면, 이제 문제가 발생한다. 우리의 함수는 0을 반환하겠지만, 가격이 계속 하락하더라도 이것을 깨뜨릴 수 있는 방법이 없다. 

**이것을 어떻게 처리해야 할까?**

글쎄, 가능한 옵션이 무엇이 있을까? 함수를 그대로 두고 0을 반환하도록 하는 것은 합리적인 옵션이 아니다. 최대 이익이 음수였는지 혹은 실제로 0이였는지 알 수 없기 때문에, 정보를 잃게 되기 때문이다. 

두 가지 가능한 옵션은 다음과 같을 것이다:

1. **음수값의 이익을 반환한다.** "최소의 손해가 얼마였는가?"
2. **예외처리를 한다.** "어제 주식을 사지 말았어야 했다!(raise an exception)"

이 경우, 1번 옵션을 선택하는 것이 가장 좋을 것이다. 음수값의 이익을 반환함으로써 얻게 되는 이점은 다음과 같은데, 

- **문제에 대해 답을 더 정확히 할 수 있다.** 만약 이익이 "이익에서 비용을 뺀 것"이라면, 우리가 얻을 수 있는 *최선*의 값을 반환해야 한다. 
- 이것이 **덜 독단적**이다. 의사결정은 기능을 사용하는 사용자에게 맡겨야 한다. 주식을 매입할 가치가 있었는지를 판단하기 위한 헬퍼 함수 내에 우리의 함수를 말아넣는 것이 더 쉬울 것이다. 
- **더 나은 데이터를 수집할 수 있다**.  만약 돈을 잃었다면, 얼마나 잃었는지도 중요하다. 만약 부자가 되고자 한다면, 이러한 값에도 신경을 써야할 것이다. 



**만약 돈을 잃을 수 밖에 없는 경우 음수값의 이익을 반환하려면 함수를 어떻게 수정해야 할까?**

```max_profit```의 초기값을 0으로 설정하면 안될 것이다...

글쎄,  ```min_price```를 제일 첫 가격으로 시작했기 때문에, ```max_profit```을 우리가 얻게 될 제일 첫 이익으로 시작해보자. (즉, 첫 번째 시간에 구매해서 두 번째 시간에 팔았을 때의 이익)

```python
min_price = stock_prices[0]
max_profit = stock_prices[1] - stock_prices[0]
```

하지만 여기서는 ```stock_prices ```가 2개 이하의 가격을 갖는 경우 ```index out of bounds error```의 가능성이 있다.

이익을 계산하기 위해서는 사고 파는 것이 필요한데, 가격이 2개 미만일 때는 이를 계산할 수가 없으므로 이 경우에 대해 우리는 예외처리를 해준다. 따라서 이 경우를 명시적으로(explicitly) 확인하고 처리해준다.

```python
if len(stock_prices) < 2:
    raise ValueError('Getting a profit requires at least 2 prices')
 
min_price = stock_prices[0]
max_profit = stock_prices[1] - stock_prices[0]
```

자, 그럼 이제 제대로 동작하는가? 

아니다! **```max_profit```이 아직도 항상 0이다.** 무슨 일이 일어난걸까?

만약 가격이 계속 떨어진다면, ```min_price```는 항상 ```current_price```로 설정될 것이다. 따라서 ```current_price - min_price```는 0이 될 것이고, 당연히 이것은 음수값의 이익보다 클 것이다. 

```max_profit```을 계산할 때, ```current_price```에서 동시에 사고 팔지 않도록 해줄 필요가 있다.

```current_price```가 아닌 더 이전의 가격에서 사도록 보장하기 위해서, ```min_price```를 *갱신하기 전*에 ```max_profit```을 계산하도록 순서를 바꿔보자.  

또한 0 시점에 대해서도 각별한 주의가 필요할 것이다. 0 시점에서 동시에 사고 팔지 않도록 보장해야 한다. 

#### Solution
------

최대 이익과 현재까지의 최저가를 추적하기 위해 그리디하게 리스트를 탐색할 것이다. 

모든 가격에 대해, 다음 사항을 확인한다.

- ```min_price```에서 사고 ```current_price```에서 파는 것이 더 높은 이익을 가져오는지 
- 새로운 ```min_price```가 있는지

시작하기 위해, 다음의 값을 초기화한다.

1. ```min_price```: 첫 가격
2. ```max_profit```: 얻을 수 있는 첫 이익

가격이 하루종일 떨어지고 아무런 돈을 벌지 못했을 때 음수값의 이익을 반환하기로 했다. 예외처리를 해줄 수도 있었지만, 음수값을 반환하는 것이 더 깔끔하고 함수를 덜 독단적으로 만들며 정보를 잃지 않는 것을 보장해줄 수 있다. 

```python
def get_max_profit(stock_prices):
    if len(stock_prices) < 2:
        raise ValueError('Getting a profit requires at least 2 prices')
        
    min_price = stock_prices[0]
    max_profit = stock_prices[1] - stock_prices[0]
    
    # 두 번째 시점(index=1)부터 시작한다
    # 첫 번째 시점에서는 팔수는 없고 무조건 사야한다
    # 그리고 사면서 동시에 팔 수 없다 
    # 만약 0번째 인덱스부터 시작한다면, 0시점에서 구매와 동시에 팔게 될 수가 있다
    # 이렇게 되면 이익은 0이 될 것이고, 음수값의 이익이 나오는 상황에서 0이 반환되어버린다
    for current_time in range(1, len(stock_prices)):
        current_price = stock_prices[current_time]
        
        # min_price에서 구매해 current_price에서 팔았을 때의 이익을 계산한다
        potential_profit = current_price - min_price
        
        # 만약 이익이 더 크다면 max_proft을 갱신한다
        max_profit = max(max_profit, potential_profit)
        
        # min_price값이 현재까지의 제일 작은 값이 되도록 갱신한다
        min_price = min(min_price, current_price)
        
	return max_profit
```



#### 복잡도
------

*O(n)* 시간, *O(1)* 공간 복잡도. 리스트를 단 한 번만 순회한다. 



#### 정리
------

이 예제는 실제로 그리디 접근방식을 사용해보는 좋은 예제이다. 그리디 방식은 *빨라서* 좋다.(보통 입력값에 대해 한 번만 순회한다) 하지만 이것이 모든 문제를 해결해주지는 않는다. 

문제를 그리디 방식으로 풀어야 하는지 아닌지를 어떻게 알 수 있을까? 가장 좋은 방법은 직접 해보고 되는지 확인하는 것이다. 새로운 문제를 푸는 첫 번째 방법들 중 하나는 그리디 방법을 시도해보는 것이다. 

새로운 문제를 그리디 방식으로 시도해보고자 한다면, 다음의 물음을 스스로 던져보자:

"우리가 단순히 '현재까지 가장 좋은 답'을 업데이트하기만 하면, 입력값에 대해 한 번에 답에 도달할 수 있다고 가정해보자. constant time에 '**현재까지 가장 좋은 답**'을 업데이트하도록 하기 위해, 입력값의 각 원소를 살펴보며 계속 업데이트 해줘야 할 **추가적인 변수**는 무엇인가?"

위의 문제에서는:

"**현재까지 가장 좋은 답**"은, 당연히, 현재까지의 값들을 바탕으로 얻을 수 있는 최대의 이익값이다. 

"**추가적인 변수**"는 현재까지의 값 중 최저가격이다. 만약 이 값을 계속 업데이트해준다면, 이를 사용해 constant time에 새로운 최대 이익을 계산할 수 있다. 최대 이익은 다음의 값들 보다 크다:

1. 이전의 최대 이익
2. 지금 팔아버림으로써 얻을 수 있는 최대 이익(현재가에서 현재까지의 최저가를 뺀 값)





