---
title: 二分查找法
date: 2021-01-07 13:12:32
permalink: /algorithm/leetcode/binary-search-method
categories:
  - LeetCode
tags:
  - 算法
  - 二分查找法
---
给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。

```javascript
输入: nums = [-1,0,3,5,9,12], target = 9, 输出: 4
解释: 9 出现在 nums 中并且下标为 4

输入: nums = [-1,0,3,5,9,12], target = 2, 输出: -1
解释: 2 不存在 nums 中因此返回 -1
```

### 题解

```javascript
var search = function(nums, target) {
    let left = 0;
    let right = nums.length-1;
    while(left <= right){
       let mid = Math.floor((left + right)/2);
       if(target == nums[mid]){
          return mid;
       }else if(nums[mid] < target){
          left = mid + 1;
       }else if(nums[mid] > target){
          right = mid - 1;
       }
    }
    return -1;
};
```
