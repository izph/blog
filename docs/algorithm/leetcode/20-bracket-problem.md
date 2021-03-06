---
title: 括号问题
date: 2021-01-23 09:02:36
permalink: /algorithm/leetcode/bracket-problem
categories:
  - LeetCode
tags:
  - 算法
  - 括号问题
---
# 括号问题

## 1、有效的括号

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：左括号必须用相同类型的右括号闭合，左括号必须以正确的顺序闭合。

```javascript
输入：s = "()", 输出：true
输入：s = "()[]{}", 输出：true
输入：s = "([)]", 输出：false
输入：s = "{[]}", 输出：true
```

### 题解：

```javascript
var isValid = function (s) {
  // 不是偶数情况   偶数 & 1 为0   奇数 & 1 为 1
  if( s.length % 2 == 1){
      return false;
  }
  const stack = [];  // 把括号放在 栈里
  for (let i = 0; i < s.length; i++) {
    let item = s[i];
    switch (item) {
      case '(':
        stack.push(')');
        break;
      case '[':
        stack.push(']');
        break;
      case '{':
        stack.push('}');
        break;
      default:
        if (item !== stack.pop()) {
          return false;
        }
    }
  }
  return stack.length === 0;
};
```

## 2、括号生成

数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 **有效的**括号组合。

```javascript
输入：n = 3, 输出：["((()))","(()())","(())()","()(())","()()()"]
```

### 题解：

```javascript
var generateParenthesis = function (n) {
  const res = [];
  // 左右括号所剩的数量，str是当前构建的字符串
  const dfs = (leftRemain, rightRemain, str) => { 
    if (str.length == 2 * n) { // 字符串构建完成
      res.push(str);           // 加入解集
      return;                  // 结束当前递归分支
    }
    // 只要左括号有剩，就可以选它，然后继续做选择（递归）
    if (leftRemain > 0) {   
      dfs(leftRemain - 1, rightRemain, str + "(");
    }
     // 右括号比左括号剩的多，才能选右括号
    if (leftRemain < rightRemain) {  
        // 然后继续做选择（递归）
      dfs(leftRemain, rightRemain - 1, str + ")"); 
    }
  };
  // 递归的入口，剩余数量都是n，初始字符串是空串
  dfs(n, n, ""); 
  return res;
};
```
