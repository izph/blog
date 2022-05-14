---
title: JavaScript字符串（笔记）
date: 2020-09-15 12:33:16
permalink: /front-end/javascript/js-string
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# 字符串

## 1、split

split使用正则表达式实现拆分多个分隔符

```javascript
let str = '12,34.56;78'
console.log(str.split(/[,.;]/))
//结果 ['12', '34', '56', '78']
```

## 2、repeat

字符串的多次复制，string.repeat(n)

## 3、search和includes

- serach(string | 正则)：返回字符串首字符下标，如果没有匹配到，则返回 -1。
- includes(string，start)，可以指定从start下标处开始查找，返回true或false。

## 4、padStart和padEnd

n为字符串的总长度

- string.padStart(n, '补充内容') 从字符串前添加补充内容。
- string.padEnd(n, '补充内容')   从字符串后添加补充内容。

## 5、substr、slice和substring

1. substr()：

- 参数一（必须）：一个整数，要开始截取字符的下标，如为负则代表从尾部开始截取。
- 参数二（可选）：一个整数，要截取字符的数量。如果省略该参数，则默认为string.length，即当前字符串的长度。

2. slice() ：

- 参数一（必须）：一个整数，要开始截取字符的下标，如为负则代表从尾部开始截取。
- 参数二（可选）：一个整数，要结束截取字符的下标，如为负则代表从尾部截取多少个字符。如果省略该参数，则默认为string.length，即当前字符串的长度。

3. substring() ：

- 参数一（必须）：一个非负的整数，要开始截取字符的下标。
- 参数二（可选）：一个非负的整数，要结束截取字符的下标。如果省略该参数，则默认为string.length，即当前字符串的长度。

```javascript
let str = '0123456789';
let result1 = str.substr(2,5); // 从下标2开始截取，截取5位
let result2 = str.slice(2,5);  // 从下标2开始截取，截取到下标5（不含下标5）
let result3 = str.substring(2,5); // 从下标2开始截取，截取到下标5（不含下标5）

console.log(result1) // 控制台打印：23456
console.log(result2) // 控制台打印：234
console.log(result3) // 控制台打印：234
```
