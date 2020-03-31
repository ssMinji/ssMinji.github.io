---
layout: post
title: "[기본개념] Mutable / Immutable 차이점"
tags: [mutable, immutable, in-place]
date: 2020-03-31 17:41
---

### Mutable / Immutable 

mutable한 객체는 생성된 이후 변경될 수 있지만, immutable한 객체는 불가능하다. 

예를 들어, 파이썬에서 list는 mutable하다. 

```python
int_list = [4, 9]

int_list[0] = 1
# int_list는 이제 [1, 9] 이다. 
```

그리고 튜플은 immutable하다. 

```python
int_tuple = (4, 9)

int_tuple[0] = 1
# Raises: TypeError: 'tuple' object does not support item assignment
```

문자열(String)은 언어에 때라 mutable 혹은 immutable하다. 

파이썬에서 string은 immutable하다. 

```python
test_string = "mutable?"

test_string[7] = "!"
# Raises: TypeError: 'str' object does not support item assignment
```

하지만 Ruby같은 다른 몇몇 언어에서 string은 mutable하다. 

```ruby
test_string = "mutable?"

test_string[7] = "!"
# test_string은 이제 "mutable!" 이다. 
```

Mutable한 객체는 새로운 객체를 할당하지 않고 내부적으로(**in-place**) 바꿀 수 있기 때문에 유용하다. 하지만 주의할 점은, 객체에 대해 in-place하게 변경할 때마다 해당 객체에 대한 *모든* 참조가 그 변화를 반영하게 될 것이다. 
