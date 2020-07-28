---
layout: post
title: "[기본개념] Boolean 쉬운 설명"
---

## Boolean



Boolean은 두 가지 값(true와 false)만을 가지는 데이터 타입이다. 



각각의 bit 또한 오직 두 가지 값(0 또는 1)만을 가지기 때문에, boolean이 단지 1bit로 저장될 것이라고 생각하기 쉽다. 하지만 실제로는, boolean은 보통 전체 byte(8bit)를 차지한다. 왜냐하면 byte가 컴퓨터의 **기본 저장 단위**이기 때문이다. 

즉, 컴퓨터는 보통 메모리의 *개별* 비트를 잡는 것이 아니라 한 번에 8 bit 단위(chunk) 혹은 그 이상을 잡는다. 

가끔 boolean은 정수만큼의 공간을 차지하는데, 현대 컴퓨터에서는 종종 32 혹은 64 bit이다. 실제로, Python같은 몇몇 언어에서, boolean은 정수의 *하위 클래스*이다. 























 

