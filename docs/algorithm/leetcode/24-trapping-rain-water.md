---
title: 接雨水
date: 2021-02-12 12:30:31
permalink: /algorithm/leetcode/trapping-rain-water
categories:
  - LeetCode
tags:
  - 算法
  - 接雨水
---
# 接雨水

## 1、接雨水

给定 `n` 个非负整数表示每个宽度为 `1` 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

![img](./images/algorithm/42.png)

```javascript
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1], 输出：6
解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 
```

### 题解：双指针，暴力解法

```javascript
// 暴力解法，暴力遍历每个节点
var trap = function(height) {
    // 不满足条件，直接返回
    let len = height.length;
    if(len<=2) return 0;

    let maxLeft = []; // 第 i 根柱子左边最高柱子的高度
    let maxRight = []; // 第 i 根柱子右边最高柱子的高度

    // 记录每个柱子左边柱子最大高度
    maxLeft[0] = height[0];
    for(let i = 1; i < len; i++){
        maxLeft[i] = Math.max(height[i], maxLeft[i-1]) // 动态转移
    }

   // 记录每个柱子右边柱子最大高度
    maxRight[len-1] = height[len-1];
    for(let j=len-2; j>=0; j--){
        maxRight[j] = Math.max(height[j], maxRight[j+1]) // 动态转移
    }
		// 求和
    let sum=0;
    for(let i=0;i<len;i++) sum+=Math.min(maxLeft[i],maxRight[i])-height[i];

    return sum;
}
// 双指针
var trap = function(height){
    let left = 0;
    let right = height.length - 1;
    let maxLeft = 0;
    let maxRight = 0;
    let res = 0;
    while(left < right){
        maxLeft = Math.max(maxLeft, height[left]);
        maxRight = Math.max(maxRight, height[right]);
        if(maxLeft < maxRight){
            res = res + (maxLeft - height[left]);
            left++
        }else{
            res = res + (maxRight - height[right]);
            right--
        }
    }
    return res;
}
```

## 2、盛最多水的容器

给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。返回容器可以储存的最大水量。不能倾斜容器。
![img](./images/algorithm/11.png)

```javascript
输入：[1,8,6,2,5,4,8,3,7], 输出：49 
解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```

### 题解

```javascript
var maxArea = function(height) {
let res = 0, i = 0, j = height.length - 1;
  while (i < j) {
    res = Math.max(res, Math.min(height[i], height[j]) * (j - i));
    if (height[i] < height[j]) {
      i++;
    } else {
      j--;
    }
  }
  return res;
};
```
