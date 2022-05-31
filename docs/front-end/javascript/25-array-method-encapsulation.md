---
title: 数组方法
date: 2020-11-30 21:43:11
permalink: /front-end/javascript/array-method-encapsulation
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# 数组方法
## 数组方法的封装（笔记）

### myFindIndex

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

### myIndexOf

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

### push

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

### Array.from
用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。
```js
Array.from('foo')  //  ["f", "o", "o"]

// 扩展运算符（...）也可以将某些数据结构转为数组
[ ...document.querySelectorAll('div') ]  //  NodeList对象

Array.from({ length: 3 })  //  [ undefined, undefined, undefined ]

Array.from([1, 2, 3], x => x + x)  //  [2, 4, 6]
```
Array.of()：用于将一组值，转换为数组
```js
Array.of()  //  []
Array.of(3, 11, 8)  //  [3,11,8]
Array.of(3)  //  [3]
Array.of(3).length  //  1

// 这个方法的主要目的，是弥补数组构造函数Array()的不足。因为参数个数的不同，会导致Array()的行为有差异。
Array()  //  []
Array(7)  //  [empty, empty, empty, empty, empty, empty]
Array(3, 11, 8)  //  [3, 11, 8]
```
### padStart()
padStart(字符个数，填充内容)，从前面开始填充
```js
const str1 = '5'
console.log(str1.padStart(4, '0'))  //  "0005"

// 若无第二个参数，用空格填充
console.log(str1.padStart(4))  //  "   5"
```

### padEnd()
padEnd(字符个数，填充内容)，从后面开始填充
```js
const str1 = 'Breaded Mushrooms'
console.log(str1.padEnd(25, '.'))  //  "Breaded Mushrooms........"

const str2 = '200'
console.log(str2.padEnd(5))  //  "200  "
```
