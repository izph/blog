---
title: 数字问题
date: 2021-01-17 11:32:21
permalink: /algorithm/leetcode/digital-problem
categories:
  - LeetCode
tags:
  - 算法
  - 数字问题
---
# 数字问题

### 1、斐波那契数

斐波那契数 （通常用 F(n) 表示）形成的序列称为 斐波那契数列 。该数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和

```javascript
F(0) = 0，F(1) = 1
F(n) = F(n - 1) + F(n - 2)，其中 n > 1
给定 n ，请计算 F(n) 。

输入：n = 2，输出：1
解释：F(2) = F(1) + F(0) = 1 + 0 = 1

输入：n = 3，输出：2
解释：F(3) = F(2) + F(1) = 1 + 1 = 2
```

#### 题解：

```javascript
var fib = function(n) {
    if(n === 0){
        return 0
    }
    if(n === 1){
        return 1
    }
    return fib(n - 1) + fib(n -2);
};

var fib = (n) => {
    if (n <= 1) return n;
    const dp = [0, 1];
    for (let i = 2; i <= n; i++) {
        //自底向上计算每个状态
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
};

var fib = function(n){
    if(n < 2){
        return n;
    }
    let dp = [0, 1];
    for(let i = 2; i <= n; i++){
        dp[i] = dp[i - 1] + dp[i - 2]
    }
    return dp[n];
}
```
