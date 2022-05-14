---
title: 动态规划
date: 2021-02-04 15:22:12
permalink: /algorithm/leetcode/dynamic-programming
categories:
  - LeetCode
tags:
  - 算法
  - 动态规划
---
# 动态规划

斐波那契数列、跳台阶、背包问题、打家劫舍、股票题目、子序列(最长递增子序列、最长递增连续子系列、非常经典的编辑距离问题)

#### 动态规划大致的解题步骤：

1. 动态规划: 做状态转移，需要做dp数组，需要非常的了解dp的含义和下标
2. 递推公式非常重要
3. dp数组如何初始化
4. 遍历顺序
5. 打印 dp 数组

#### 状态转移的过程如下（简单示例）：

* 初始情况：dp[0] = nums[0];
* 若 nums[i] > 0，那么 dp[i] = nums[i] + dp[i - 1];
* 若 nums[i] <= 0，那么 dp[i] = nums[i];

## 1、爬楼梯

假设你正在爬楼梯。需要 `n` 阶你才能到达楼顶。每次你可以爬 `1` 或 `2` 个台阶，你有多少种不同的方法可以爬到楼顶呢？

```javascript
输入：n = 2
输出：2
解释：有两种方法可以爬到楼顶。
1. 1 阶 + 1 阶
2. 2 阶

输入：n = 3
输出：3
解释：有三种方法可以爬到楼顶。
1. 1 阶 + 1 阶 + 1 阶
2. 1 阶 + 2 阶
3. 2 阶 + 1 阶
```

### 题解：

```javascript
var climbStairs = function(n) {
    const dp = [];
    dp[0] = 1;
    dp[1] = 1;
    for(let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
};

var climbStairs = (n) => {
  let prev = 1;
  let cur = 1;
  for (let i = 2; i < n + 1; i++) {
    let temp = cur;     // 暂存上一次的cur
    cur = prev + cur;   // 当前的cur = 上上次cur + 上一次cur
    prev = temp;        // prev 更新为 上一次的cur
  }
  return cur;
}
```

## 2、最长递增子序列

给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。

```javascript
输入：nums = [10,9,2,5,3,7,101,18]
输出：4
解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。

输入：nums = [0,1,0,3,2,3]
输出：4
```

### 题解：

```javascript
// dp[i]含义：从 0 到下标为i的序列的 最长递增子序列长度
// 递推公式：遍历到i的时候，再用j从0遍历到i，如果nums[i]>nums[j]，则dp[i] = max(dp[i], dp[j] + 1)
// 遍历dp[i]的时候，更新子序列的最大长度
// dp数组初始化：都初始化为dp[i] = 1
var lengthOfLIS = function(nums) {
    const dp = [1];
    for (let i = 1; i < nums.length; i++){
        dp[i] = 1;
        for (let j = 0; j < i; j++) {
            // nums[i] > nums[j] && (dp[i] = Math.max(dp[i], dp[j] + 1));
            if(nums[i] > nums[j]){
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    return Math.max(...dp);
}
var lengthOfLIS = (nums) => {
    let dp = Array(nums.length).fill(1);
    let result = 1;

    for(let i = 1; i < nums.length; i++) {
        for(let j = 0; j < i; j++) {
            if(nums[i] > nums[j]) {  // 当nums[i] > nums[j]，则构成一个上升对
                dp[i] = Math.max(dp[i], dp[j]+1);  // 更新dp[i]
            }
        }
        result = Math.max(result, dp[i]); // 更新结果
    }
    return result;
}
```

## 3、打家劫舍

你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

```javascript
输入：[1,2,3,1], 输出：4
解释：偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)，偷窃到的最高金额 = 1 + 3 = 4 。

输入：[2,7,9,3,1], 输出：12
解释：偷窃 1 号房屋 (金额 = 2), 偷窃 3 号房屋 (金额 = 9)，接着偷窃 5 号房屋 (金额 = 1)。
     偷窃到的最高金额 = 2 + 9 + 1 = 12 。
```

### 题解：

```javascript
// 思路
// 动态规划方程：dp[n] = MAX( dp[n-1], dp[n-2] + num )
// 由于不可以在相邻的房屋闯入，所以在当前位置 n 房屋可盗窃的最大值，要么就是 n-1 房屋可盗窃的最大值，
// 要么就是 n-2 房屋可盗窃的最大值加上当前房屋的值，二者之间取最大值
// 举例来说：1 号房间可盗窃最大值为 33 即为 dp[1]=3，2 号房间可盗窃最大值为 44 
// 即为 dp[2]=4，3 号房间自身的值为 22 即为 num=2，
// 那么 dp[3] = MAX( dp[2], dp[1] + num ) = MAX(4, 3+2) = 5，3 号房间可盗窃最大值为 55

var rob = function(nums){
    if(nums.length === 0){
        return 0;
    }
    if(nums.length === 1){
        return nums[0];
    }
    let dp = [];
    dp[0] = nums[0];
    dp[1] = Math.max(nums[1], nums[0]);
    for(let i = 2; i < nums.length; i++){
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
    }
    return dp[nums.length - 1];
}
// 优化空间复杂度
var rob = function(nums){
    if(nums.length === 0){
        return 0;
    }
    if(nums.length === 1){
        return nums[0];
    }
    let prev2 = nums[0];
    let prev1 = Math.max(nums[0], nums[1]);
    for(let i = 2; i < nums.length; i++){
        let temp = Math.max(prev1, prev2 + nums[i])
        prev2 = prev1;
        prev1 = temp;
    }
    return prev1;
}
```

## 4、零钱兑换

给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。

计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。
你可以认为每种硬币的数量是无限的。

```javascript
输入：coins = [1, 2, 5], amount = 11
输出：3 
解释：11 = 5 + 5 + 1
```

### 题解：

```javascript
var coinChange = function (coins, amount) {
    let dp = new Array(amount + 1).fill(Infinity);//初始化dp数组
    dp[0] = 0;//面额0只需要0个硬币兑换

    for (let i = 1; i <= amount; i++) {//循环面额
        for (let coin of coins) {//循环硬币数组
            if (i - coin >= 0) {//当面额大于硬币价值时
                //dp[i - coin]： 当前面额i减当前硬币价值所需要的最少硬币
                //dp[i] 可由 dp[i - coin] + 1 转换而来
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    //如果dp[amount] === Infinity，则无法兑换
    return dp[amount] === Infinity ? -1 : dp[amount];
};
```
