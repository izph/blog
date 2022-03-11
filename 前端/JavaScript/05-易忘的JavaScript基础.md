---
title: 易忘的JavaScript基础
date: 2022-01-14 20:53:16
permalink: /前端/JavaScript/易忘的JavaScript基础
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# 易忘的JavaScript基础

1、一个html文件中，多个script标签之间的（多个代码块）错误是不会相互影响的，比如上一个script标签出现了语法错误或者引用错误，不会影响下一个srcipt标签的代码执行。

2、script标签如果有src属性，就只会加载src路径的 JS文件，srcipt里的代码就不会加载和执行。

3、原始数据类型的重复赋值是会开辟新的内存空间的，比如 var num = 3; num=1；会重新开辟一个num的命名空间，而且保存3的变量名会变为原来的地址名。

内存空间的演化：一个1008地址对应一个空间，1008—空间  -> num—3  -> 1008—3 和 num —1。也就是说，当我们重新给num赋值为1时，1008地址存储的是3，而num—1是存储在了另外的内存空间。

4、大部分的原始数据类型的值 + 字符串都是字符串（symbol类型不能运算）。

5、利用 !!a，将变量a 转化为布尔值

6、typeof a即使a是未定义，typeof a 的结果是“undefined”。typeof(+)  => Uncaught SyntaxError是语法错误，加号不属于任何类型。只要typeof获取的不是特殊字符的类型，typeof的返回值一定是字符串。

7、switch括号中的结果和case之间的比较是用，全等符号=== 比较的

8、只要有声明，就会有变量提升，不看if括号中是真是假

```javascript
if(false){
    var b = 3;
}
console.log(b); // undefined 
```

9、(1, 2, 3)的返回是3，括号()最终返回的最后一个元素的结果

10、编程：高内聚，低耦合 -> 模块单一责任制（独立的模块）

低耦合：其实就是降低重复的代码，高内聚：某个模块只负责某个功能，降低各模块的依赖

11、new Function(str) 同样可以执行JavaScript字符串

```javascript
let func = new Function(`console.log(1)`);
func();  // 输出1，new Function(str)中的str是可以执行JavaScript字符串
```

12、null是一个表示"无"的对象（空对象指针），转为数值时为0；undefined是一个表示"无"的原始值，转为数值时为NaN。

13、

```javascript
[] + {} // "[object Object]"
{} + [] // 0
```

- 先看第一个表达式，[ ] + { } , 因为[]会被强制转换为"", 然后+运算符 链接一个{ }, { }强制转换为字符串就是

  "[object Object]"。 最终结果就是后者。
- 在看第二个表达式，表达式第一个就是{ }，这时候编译器只会把这个{ } 当作一个空代码块。（es6之前还没有块级作用，只有函数作用域和全局作用域，可以就理解为全局作用域下面一个多余的{ } 符号而已），{ } + [ ] 就可以当作是+ [ ], 而 + [ ]是强制将[ ]转换为number ，转换的过程是 + [ ] -->  +"" --> 0最终的结果就是0。

14、原生JS触发按钮的点击事件：document.querySelector('.btn').click();
