---
title: 数组方法的封装
date: 2020-11-30 21:43:11
permalink: /front-end/javascript/array-method-encapsulation
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# 数组方法的封装（笔记）

## myFindIndex

```js
Array.prototype.myFindIndex = function (func) {
    for (let i = 0; i < this.length; i++) {
        if (func(this[i])) {
            return i;
        }
    }
    return -1
}
let arr = [1, 3, 5, 7]
console.log(arr.myFindIndex((item) => item>= 5)) // 2
```

## myIndexOf

```js
Array.prototype.myIndexOf = function (el) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === el) {
            return i
        }
    }
    return -1
}
let arr = [1, 3, 5, 7]
console.log(arr.myIndexOf(5)) // 2
```

## push

```js
Array.prototype.myPush = function () {
  for (var i = 0; i < arguments.length; i++) {
    this[this.length] = arguments[i];
  }
  return this.length;
}
Array.prototype.myPush = function () {
  for (var i = 0; i < arguments.length; i++) {
    this.splice(this.length, 0, arguments[i]);
  }
  return this.length;
}
```
