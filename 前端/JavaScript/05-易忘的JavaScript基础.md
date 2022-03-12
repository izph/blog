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

7、switch括号中的结果和case之间的比较是用，全等符号=== 比较的，如果当前的case里面没有break，则不会退出switch ，而是继续执行下一个case。

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

13、[] + {} 和 {} + [] 结果

```javascript
[] + {} // "[object Object]"
{} + [] // 0
```

- 先看第一个表达式，[ ] + { } , 因为[]会被强制转换为"", 然后+运算符 链接一个{ }, { }强制转换为字符串就是

  "[object Object]"。 最终结果就是后者。
- 在看第二个表达式，表达式第一个就是{ }，这时候编译器只会把这个{ } 当作一个空代码块。（es6之前还没有块级作用，只有函数作用域和全局作用域，可以就理解为全局作用域下面一个多余的{ } 符号而已），{ } + [ ] 就可以当作是+ [ ], 而 + [ ]是强制将[ ]转换为number ，转换的过程是 + [ ] -->  +"" --> 0最终的结果就是0。

14、原生JS触发按钮的点击事件：document.querySelector('.btn').click();

15、什么是缓存？缓存其实就是将一些临时的数据存储在数组、对象、Map、Set等数据结构中进行存储。浏览器的缓存：memory disk  内存   cache disk 硬盘缓存

16、同步和异步的区别
同步：执行js代码时，执行完某个方法或者函数，才继续向下执行。
异步：会将异步代码放到任务队列，继续执行同步代码，不会阻塞

17、Commonjs  和 Es Module区别
使用方式: Commonjs 引入是require，导出是exports、module.exports
         ES: 引入是import form，导出是export、export default
ES输出的是值的引用（其实就是拿到是对象、数组、函数在堆内存的地址），而CommonJS输出的是值的拷贝

18、如何判断当前脚本运行在浏览器还是 node 环境中？
this === window ? 'browser' : 'node';

19、JS如何判断一个对象是否为空对象:  是否还有属性

```javascript
function checkNullObj(obj) {
  return Object.keys(obj).length === 0;
}
```

20、函数内this指向问题
this的指向，是当我们调用函数的时候确定的，调用方式不同，决定了this指向不同

|   调用方式   |     this指向     |
| :----------: | :--------------: |
| 普通函数调用 |      window      |
| 构造函数调用 |     实例对象     |
| 对象方法调用 | 该方法所属的对象 |
| 事件绑定方法 |   绑定事件对象   |
|  定时器函数  |      window      |
| 立即执行函数 |      window      |

21、var a = b = c = 1; 等价于  var  a  = 1; b = 1; c = 1; b 和 c 直接赋值，没有var 声明，当 全局变量看。

22、预解析(预编译)，JS引擎会在正式执行代码之前进行一次预编译，预编译简单理解就是在内存中开辟一些空间，存放一些变量和函数，并检查的语法错误。

1. 我们js引擎运行js 分为两步：  预解析  代码执行
   (1) 预解析 js引擎会把js 里面所有的 var  还有 function 提升到当前作用域的最前面
   (2) 代码执行  按照代码书写的顺序从上往下执行，解释一行，执行一行
2. 预解析分为 变量预解析（变量提升） 和 函数预解析（函数提升）
   (1) 变量提升 就是把所有的变量声明提升到当前的作用域最前面  不提升赋值操作
   (2) 函数提升 就是把所有的函数声明提升到当前作用域的最前面  不调用函数
   函数提升 比 变量提升 要高(函数表达式除外)

23、严格模式

this 是 undefined、函数的参数不能重复、var a = b= 1会报错、callee不能使用

24、前端下载文件

- 本窗口下载
  window.location.href = "url";
- 新开窗口下载
  window.open(url, '_blank');
- 利用 a 标签下载，href为下载地址，download属性为文件名称
  `<a href="url" download="文件名">`点击下载`</a>`
