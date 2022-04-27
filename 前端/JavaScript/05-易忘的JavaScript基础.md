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

### 1、html文件中多个script标签
一个html文件中，多个script标签之间的（多个代码块）错误是不会相互影响的，比如上一个script标签出现了语法错误或者引用错误，不会影响下一个srcipt标签的代码执行。

### 2、script标签如果有src属性，就只会加载src路径的 JS文件，srcipt里的代码就不会加载和执行。

### 3、原始数据类型的重复赋值是会开辟新的内存空间的，比如 var num = 3; num=1；会重新开辟一个num的命名空间，而且保存3的变量名会变为原来的地址名。

内存空间的演化：一个1008地址对应一个空间，1008—空间  -> num—3  -> 1008—3 和 num —1。也就是说，当我们重新给num赋值为1时，1008地址存储的是3，而num—1是存储在了另外的内存空间。

### 4、大部分的原始数据类型的值 + 字符串都是字符串（symbol类型不能运算）。

### 5、利用 !!a，将变量a 转化为布尔值

### 6、typeof
typeof a即使a是未定义，typeof a 的结果是“undefined”。typeof(+)  => Uncaught SyntaxError是语法错误，加号不属于任何类型。只要typeof获取的不是特殊字符的类型，typeof的返回值一定是字符串。

### 7、switch
括号中的结果和case之间的比较是用，全等符号=== 比较的，如果当前的case里面没有break，则不会退出switch ，而是继续执行下一个case。

### 8、只要有声明，就会有变量提升，不看if括号中是真是假
```javascript
if(false){
    var b = 3;
}
console.log(b); // undefined 
```

### 9、()运算
(1, 2, 3)的返回是3，括号()最终返回的最后一个元素的结果

### 10、高内聚和低耦合
低耦合：其实就是降低重复的代码，高内聚：某个模块只负责某个功能，降低各模块的依赖

### 11、new Function(str) 同样可以执行JavaScript字符串
```javascript
let func = new Function(`console.log(1)`);
func();  // 输出1，new Function(str)中的str是可以执行JavaScript字符串
```

### 12、null是一个表示"无"的对象（空对象指针），转为数值时为0；undefined是一个表示"无"的原始值，转为数值时为NaN。

### 13、[] + {} 和 {} + [] 结果
```javascript
[] + {} // "[object Object]"
{} + [] // 0
```
- 先看第一个表达式，[ ] + { } , 因为[]会被强制转换为"", 然后+运算符 链接一个{ }, { }强制转换为字符串就是
  "[object Object]"。 最终结果就是后者。
- 在看第二个表达式，表达式第一个就是{ }，这时候编译器只会把这个{ } 当作一个空代码块。（es6之前还没有块级作用，只有函数作用域和全局作用域，可以就理解为全局作用域下面一个多余的{ } 符号而已），{ } + [ ] 就可以当作是+ [ ], 而 + [ ]是强制将[ ]转换为number ，转换的过程是 + [ ] -->  +"" --> 0最终的结果就是0。

### 14、原生JS触发按钮的点击事件：document.querySelector('.btn').click();

### 15、什么是缓存？缓存其实就是将一些临时的数据存储在数组、对象、Map、Set等数据结构中进行存储。浏览器的缓存：memory disk  内存   cache disk 硬盘缓存

### 16、同步和异步的区别
同步：执行js代码时，执行完某个方法或者函数，才继续向下执行。
异步：会将异步代码放到任务队列，继续执行同步代码，不会阻塞

### 17、Commonjs 和 ES Module区别
使用方式: Commonjs 引入是require，导出是exports、module.exports
         ES: 引入是import form，导出是export、export default
ES输出的是值的引用（其实就是拿到是对象、数组、函数在堆内存的地址），而CommonJS输出的是值的拷贝

### 18、如何判断当前脚本运行在浏览器还是 node 环境中？
this === window ? 'browser' : 'node';

### 19、JS如何判断一个对象是否为空对象:  是否还有属性
```javascript
function checkNullObj(obj) {
  return Object.keys(obj).length === 0;
}
```

### 20、函数内this指向问题
this的指向，是当我们调用函数的时候确定的，调用方式不同，决定了this指向不同
|   调用方式   |     this指向     |
| :----------: | :--------------: |
| 普通函数调用 |      window      |
| 构造函数调用 |     实例对象     |
| 对象方法调用 | 该方法所属的对象 |
| 事件绑定方法 |   绑定事件对象   |
|  定时器函数  |      window      |
| 立即执行函数 |      window      |

### 21、连续声明
var a = b = c = 1; 等价于  var  a  = 1; b = 1; c = 1; b 和 c 直接赋值，没有 var 声明，当全局变量看。

### 22、预解析(预编译)
JS引擎会在正式执行代码之前进行一次预编译，预编译简单理解就是在内存中开辟一些空间，存放一些变量和函数，并检查的语法错误。
1. 我们js引擎运行js 分为两步：  预解析  代码执行
   (1) 预解析 js引擎会把js 里面所有的 var  还有 function 提升到当前作用域的最前面
   (2) 代码执行  按照代码书写的顺序从上往下执行，解释一行，执行一行
2. 预解析分为 变量预解析（变量提升） 和 函数预解析（函数提升）
   (1) 变量提升 就是把所有的变量声明提升到当前的作用域最前面  不提升赋值操作
   (2) 函数提升 就是把所有的函数声明提升到当前作用域的最前面  不调用函数
   函数提升 比 变量提升 要高(函数表达式除外)

### 23、严格模式
this 是 undefined、函数的参数不能重复、var a = b= 1会报错、callee不能使用

### 24、前端下载文件
- 本窗口下载
  window.location.href = "url";
- 新开窗口下载
  window.open(url, '_blank');
- 利用 a 标签下载，href为下载地址，download属性为文件名称
  `<a href="url" download="文件名">`点击下载`</a>`

### 25、并行和串行
并行和串行指的是任务的执行方式。
-串行是指多个任务时，各个任务按顺序执行，完成一个之后才能进行下一个。
-并行指的是多个任务可以同时执行，异步是多个任务并行的前提条件。
```javascript
// p1, p2, p3分别是Promise对象，p1, p2, p3属于并行
const res = Promise.all[p1, p2, p3];
// 如果p4 依赖前面res的结果，res => p4 则可以看成是一个串行过程
```
### 26、JS进制转化
利用内置函数实现，toString可以把一个数转换为指定进制的数，parseInt是把数按照指定进制解析成十进制的数
```javascript
// toString用法，其中数前面加0默认为8进制，加0x默认为16进制。
var a = 10;
a.toString(2);	//输出 "1010"
(10).toString(2);	//输出 "1010"
(10).toString(16);	//输出 "A"
(010).toString(10);	//输出 "8"
(0x10).toString(10);	//输出 "16"

// parseInt用法: 把参数，按照指定进制解析成十进制的数。
parseInt("10", 2);	//返回 2   二进制的10转化为十进制
parseInt("10", 8);	//返回 8   八进制的10转化为十进制
parseInt("10", 10);	//返回 10
parseInt("AF", 16);	//返回 175
```
### 27、栈内存和堆内存
1. 栈内存
- 基本类型
- 按值访问
- 存储的值大小固定
- 系统会自动分配内存空间
- 空间小，运行效率高
- 先进后出

2. 堆内存：
- 引用类型
- 按照引用访问
- 存储大小不固定
- 内存分配：由代码进行分配
- 空间大，运行效率较低
- 无序存储（根据引用直接获取）

### 28、js 获取原型的方法（p为对象）
- p.__proto__ (浏览器才有的属性，node中没有这个属性)
- p.constructor.prototype
- Object.getPrototypeOf(p)

### 29、js 脚本延迟加载的方式有哪些？
- js 脚本放在文档的底部，来使 js 脚本尽可能的在最后来加载执行
- defer 属性、async 属性
- 动态创建 DOM方式、动态创建script标签
```javascript
var srcipt = document.createElement('script')
script.src = 'url'
scritp.type = 'type/javascript'
document.body.appendChild(script)
```
- 使用setTimeout延迟方法

### 30、documen.write 和 innerHTML 的区别？
- document.write的内容会替代整个document文档内容，会重写整个页面。
- innerHTML 的内容只是替代指定元素的内容

### 31、类数组转换为数组的方法
- Array.prototype.slice.call(arrayLike)
- Array.from(arrayLike)
- [...arrayLike]

### 32、哪些操作会造成内存泄漏？
- 未定义的全局变量（var a = b = c = 1，b和c都是全局变量）
- 设置的定时器没有清理
- 闭包（需要合理使用闭包）

如何避免内存泄漏？
- 尽可能少地创建全局变量,函数创建变量要声明
- 手动清除定时器
- 少用闭包
- 清除DOM引用
- ES6的WeakMap和WeakSet弱引用

### 33、0.1 + 0.2 为什么不等于0.3?
计算机是通过二进制的方式存储数据的，所以计算机计算0.1 + 0.2的时候，
实际上是计算的两个数的二进制的和。这两个数的二进制都是无限循环的数
JavaScript是处理无限循环的二进制小数是遵循了IEEE 754标准（某个标准），使用64位固定长度来表示。也就是标准的double双精度浮点数。
在二进制科学表示法中，最多保留53位有效数字，剩余的需要舍去，遵从“0舍1入”的原则。根据这个原则，0.1和0.2的二进制数相加，再转化为十进制数就是：0.30000000000000004

### 34、Content-Type常见类型
- 表单默认编码方式：application/x-www-form-urlencoded
- json字符串：application/json
- 二进制文件：multipart/form-data
- 图片image/webp、文本text/plain、text/html、text/css、text/xml XML格式

### 35、图片懒加载原理
- 利用自定义的属性(data-src，dataset获取)存储图片url，图片的真实src 为空或者用其他代替
监听 body 或者其他存放图片且滚动的元素的 scroll 事件
如果显示就将真实URL填到src属性中，加载图片 
- 当滚动的高度scrollTop + 可视区的高度clientHeight 大于需要懒加载图片距离顶部的高度 offsetTop 就把图片的src的替换为 真正的图片url

### 36、Map、Set、WeakMa和WeakSet
1. Set 和 WeakSet 结构
- ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。
- WeakSet 结构与 Set 类似，也是不重复的值的集合。但是 WeakSet 的成员只能是对象，而不能是其他类型的值。WeakSet 中的对象都是弱引用，并且这些弱引用的对象不可遍历（弱引用：如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存）

2. Map 和 WeakMap 结构
- Map 数据结构。它类似于对象，也是键值对的集合，但是"键"的范围不限于字符串，各种类型的值（包括对象）都可以当作键。
- WeakMap 结构与 Map 结构类似，但是 WeakMap 只接受对象作为键名（ null 除外），不接受其他类型的值作为键名。而且 WeakMap 的键名所指向的对象，不计入垃圾回收机制。

### 37、url中传递对象
```js
const params = { 
  name: "yolo", 
  age: "18"
}

let url = "http://www.xxx.com/getuser?params="+ JSON.stringify(params);
let newUrl = encodeURI(url);
// next 

```
### 38、window.open打开新页签，并修改新页签的title
```js
let win = window.open(url, "_blank");
win.onload = function(){
  win.document.title = "title text";
}
```
### 39、动态添加样式
```js
const cusStyle = `.box { background-color: red; }`;
loadStyle(cusStyle);
// insertRule(rule, [index])
// rule: 样式字符串
// index: 表示添加样式在样式表中的索引位置，默认为 -1，表示位于样式表的末尾。
function loadStyle(params){
    var headobj = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    headobj.appendChild(style);
    style.sheet.insertRule(params, 0);
  }
```
### 40、JS执行机制
1. 同步：上一个任务完成才能进入下一个任务
2. 异步：多个任务可以并行执行

执行机制：
- 先执行 执行栈中的同步任务
- 遇到异步任务会将异步任务挂起，等到异步任务有返回结果时，将异步函数的回调放入任务队列中，等待执行
- 当所有的同步任务执行完成后，主线程会检查任务队列，有任务就会把这些任务拿到执行栈中执行（微任务和宏任务）。

### 41、如何判断一个对象是不是空对象？
```js
Object.keys(obj).length === 0
```

### 42、检测浏览器版本版本有哪些方式？
```js
window.navigator.userAgent
```
 
### 43、使用 JS 实现获取文件扩展名？
```js
function getFileExtension(filename) {
  // 取最后一个元素即为扩展名
  return filename.split('.').pop();  
}
```
### 44、JS单线程机制
JS的主要用途是与用户交互以及操作DOM，那么这也决定了其作为单线程的本质，单线程意味着执行的代码必须按顺序执行，在同一时间只能处理一个任务。如果JS是多线程的，一个线程在删除DOM元素的同时，另一个线程对该元素进行修改操作，那么必然会导致复杂的同步问题。

### 45、一方包、二方包和三方包的区别
- 一方包：本项目中的各模块的依赖

- 二方包：公司内部的依赖库，一般指公司内部的其他项目发布的工具库

- 三方包：公司之外的开源库， 比如antd、lodash、react等发布的依赖

### 46、filter grayscale 将整个界面变为黑白灰色调
```css
html {
  filter: grayscale(1);
}
```

