---
title: JavaScript中常见的错误类型
date: 2020-09-26 20:23:56
permalink: /front-end/javascript/js-error-type
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# JavaScript中常见的错误类型

## 1、SyntaxError

Uncaught SyntaxError是语法错误，所有的代码都不会执行，Uncaught SyntaxError：Invalid or unexpected token 表示无效或者意外的标记。

JSON.parse()中的参数不允许是空的字符串，否则会出现SyntaxError错误

## 2、ReferenceError

Uncaught ReferenceError是引用错误，如Uncaught ReferenceError：a is not defined，错误之前的代码会执行，遇到引用错误，会中断代码的执行。

## 3、RangeError

Uncaught RangeError是超出范围的错误，如无效的数组长度，var arr = [1, 2, 3];  arr.length = -1;

报错：Uncaught RangeError: Invalid array length。

## 4、TypeError

Uncaught Type Error 是类型错误，如123()。

Uncaught TypeError：123 is not a function。

## 5、URIError

Uncaught URIError是URI错误，如decodeURI('%fdsdf%');

decodeURI方法并不能解码字符串'%fdsdf%'，报错：Uncaught URIError: URI malformed at decodeURI。

## 6、自定义错误

```javascript
// 自定义错误
var err01 = new Error('代码错误了');
var err02 = new SyntaxError('语法错误了'); 
var err03 = new ReferenceError('引用错误了'); 
var err04 = new RangeError('范围越界'); 
var err05 = new TypeError('类型错误了');  
```

## 7、throw '抛出错误信息'

throw就是抛出一些信息，不一定是抛出错误，我们可以抛出一些信息，这个信息可以自定义。

throw '自定义信息'，但是为了保证语义清晰，不建议用 throw 表达任何非异常信息。

## 8、try catch

try 部分用于标识捕获异常的代码段，catch 部分则用于捕获异常后做一些处理，而 finally 则是用于执行后做一些必须执行的清理工作。即使在 try 中出现了 return，finally 中的语句也一定要被执行。

```javascript
try{
    console.log(a);
}catch(e){
    console.log(e.name + ' : ' + e.message)
}finally {
    console.log("finally");
}
```

捕获到的错误信息，ReferenceError : a is not defined，并且会打印"finally"

e.name就是错误的类型(ReferenceError)，e.message是错误信息(a is not defined)，e就是一个错误对象

## 处理错误的方法
- try catch
- Promise.catch()
- unhandledrejection
- window.onerror
- window.addEventListener

## 总结
在具体到实际工作中，我们要处理的异常分为以下几种：
1. 语法错误及代码异常：对可疑区域增加 try-catch，全局增加 window.onerror;
2. 数据请求异常：使用 promise-catch 处理 Promise 异常，使用 unhandledrejection 处理未捕获的Promise异常，使用 try-catch 处理 async/await 异常;
3. 静态资源加载异常：在元素上添加 onerror，全局增加 window.addEventListener；

