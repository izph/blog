---
title: JavaScript面试
date: 2021-02-15 22:07:18
permalink: /前端/JavaScript/JavaScript面试
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
  - 面试
---
## ['1','2','3'].map(parseInt)的返回值是什么？

结果是[1, NaN, NaN]

1. map函数
   将数组的每个元素传递给指定的函数处理，并返回处理后的数组，所以 ['1','2','3'].map(parseInt) 就是将字符串1，2，3作为元素；0，1，2作为下标分别调用 parseInt 函数。即分别求出 parseInt('1',0), parseInt('2',1), parseInt('3',2)的结果。
2. parseInt函数
   parseInt(str, radix)  将字符串转化为整数
   radix参数为n将会把第一个参数str看作是一个数的n进制表示，而返回的值则是十进制。
   radix：解析字符串的基数，基数规则如下：

- 1) 区间范围介于2~36之间；
- 2) 当参数为 0，parseInt() 会把 str 看做一个十进制的数来解析，并返回这个数的十进制；
- 3) 如果忽略该参数，默认的基数规则：

```javascript
// 如果 string 以 "0x" 开头，parseInt() 会把 string 的其余部分解析为十六进制的整数
parseInt("0xf")   //15 
// 如果 string 以 0 开头，其后的字符解析为八进制或十六进制的数字
parseInt("08")   //8
// 如果 string 以 1 ~ 9 的数字开头，parseInt() 将把它解析为十进制的整数
parseInt("88.99f")   //88
// 只有字符串中的第一个数字会被返回。
parseInt("10.33")   //返回10；
// 开头和结尾的空格是允许的。
parseInt(" 69 10 ")   // 返回69
// 如果字符串的第一个字符不能被转换为数字，返回 NaN。
parseInt("f")  //返回NaN，而parseInt("f", 16)  //返回15
```

3. 再来分析一下结果

- parseInt('1',0);radix 为 0，parseInt() 会根据十进制来解析，所以结果为1
- parseInt('2',1);radix 为 1，超出区间范围，所以结果为 NaN
- parseInt('3',2);radix 为 2，用2进制来解析，应以 0 和 1 开头，所以结果为 NaN

4. parseInt方法解析的运算过程

```javascript
// 以十进制解析，运算过程：向上取整数(不做四舍五入，省略小数)，结果为 101
parseInt('101.55',10); 
// 以二进制解析，运算过程：1*2^2+0*2^1+1*2^0=4+0+1=5，结果为 5
parseInt('101',2);
// 以八进制解析，运算过程：1*8^2+0*8^1+1*8^0=64+0+1=65，结果为 65 
parseInt('101',8);
// 以十六进制解析，运算过程：1*16^2+0*16^1+1*16^0=256+0+1=257，结果为 257
parseInt('101',16); 
```

## 一个列表，假设有 100000 个数据，这个该怎么办？

需要思考的问题：该处理是否必须同步完成？数据是否必须按顺序完成？

- （1）将数据分页，利用分页的原理，每次服务器端只返回一定数目的数据，浏览器每次只对一部分进行加载。（分页）
- （2）使用懒加载的方法，每次加载一部分数据，其余数据当需要使用时再去加载。（其实就是虚拟列表）
- （3）使用数组分块技术，基本思路是为要处理的项目创建一个队列，然后设置定时器每过一段时间取出一部分数据，然后再使用定时器取出下一个要处理的项目进行处理，接着再设置另一个定时器。（时间切片）

## 简述jsonp的原理与实现（跨域）

1. 首先是利用script标签的src属性来实现跨域。
2. 通过将前端方法名作为参数传递到服务器端，然后由服务器端注入参数之后再返回，实现服务器端向客户端通信。（`<script src="http://aaa/bbb?callback=xxx"></script>`）
3. 由于使用script标签的src属性，因此只支持get方法

### jsonp简单实现

```javascript
/**
 * 前端代码实现
 * **/
function jsonp(options){
    // 创建srcipt标签
    var srciptLabel = document.createElement('script');
    // 拼接url
    var url = options.url + '?callback=' + options.callback;
    srciptLabel.src = url;
    // 将srcipt标签放到页面的head中
    document.getElementsByTagName('head')[0].appendChild(srciptLabel); 
}
// hello的声明要在 调用jsonp函数之前
function hello(res){
    alert('hello ' + res.data);
}
jsonp({
    url : 'url',
    callback: hello
});

/**
 * 后端代码实现
 * **/
var http = require('http');
var urllib = require('url');
var port = 8888;
var data = {'data':'world'};

http.createServer(function(req, res){
    var params = urllib.parse(req.url, true);
    if(params.query.callback){
        console.log(params.query.callback);
        // jsonp 返回一个字符串
        var str = params.query.callback + '(' + JSON.stringify(data) + ')';
        res.end(str);
    } else {
        res.end();
    }
}).listen(port);
```

## 事件委托（原理：冒泡）

把监听子节点的事件添加到父节点上，利用事件冒泡影响每一个子节点

```javascript
// 伪代码如下，ul 里有很多的小 li
ul.addEventListener('click', function(e) {
     // 我们给ul 绑定了事件  那么this 就指向ul  
     console.log(this);
     // e.target 指向我们点击的那个对象 谁触发了这个事件
  	 // 我们点击的是li e.target 指向的就是li
     console.log(e.target);
 })
```

## 数组的扁平化

- 数组方法，arr.flat(n)，n代表需要扁平n层
- 手写实现

```javascript
// reduce
function spinArr(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? spinA(cur) : cur);
  }, [])
}
  
function spinArr(arr) {
  let res = [];
  for(let i = 0; i < arr.length; i++){
  	if(Array.isArray(arr[i])){
    	res.concat(arr[i]);
    }else{
    	res.push(arr[i]);
    }
  }
  return res;
}
```

## 解析模板字符串(tpl)

```javascript
let template = `
    <div>
		<span >{{ name }}</span>
		<span >{{ age }}</span>
        <span >{{ profession }}</span>
	</div>
`
let templateObject = {
    name: 'iZph',
    age: 18, 
    profession: '前端开发'
}
function tplReplace(template, templateObject) {
  
  return template.replace(/\{\{(.*?)\}\}/g, (node, key) => {
    // node: {{ key }}  
    // key:  name | age | profession
    return templateObject[key.trim()];
  });
}
tplReplace(template, templateObject);
```

## 写一个函数sum

写一个函数sum，使得sum(a)(b)…(n) = a + b + … + n; 成立

- sum(1)(2) = 3;
- sum(1)(2)(3) = 6;
- sum(6)(-1)(-2)(-3) = 0;

### 实现原理：结合闭包，并重写函数的 toString 方法

```javascript
function sum(a) {

  let currentSum = a;

  function fn(b) {
    // 闭包 访问了另外一个作用域的变量
    currentSum = currentSum + b;
    //返回f
    return fn;
  }

  // 因为要输出，所以从写 toString()方法
  fn.toString = function() {
    return currentSum;
  };
  
  //返回的是函数fn
  return fn;

}
// 测试
console.log(sum(1)(2)); // 3
console.log(sum(5)(-1)(2)); // 6
console.log(sum(6)(-1)(-2)(-3)); // 0
console.log(sum(0)(1)(2)(3)(4)(5)); // 15
```

## 闭包

本质上是一个函数，指有权访问另外一个函数作用域中的变量

### 闭包的应用场景

- 事件节流与事件防抖
- 函数的柯里化
- 闭包模拟私有方法
