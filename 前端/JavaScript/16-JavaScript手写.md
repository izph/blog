---
title: JavaScript手写（二）
date: 2022-01-27 20:53:16
permalink: /前端/JavaScript/JavaScript手写题2
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
## 1、封装typeof

```javascript
function myTypeof(val) {
    // 正常来说typeof null => 'object'
    if(val === null){
        return 'null';
    }
    var type = typeof(val);
    var map = {
        '[object Array]': 'array',
        '[object Object]': 'object',
        '[object Number]': 'object number',
        '[object String]': 'object string',
        '[object Boolean]': 'object boolean',
    };
    if(type === 'object'){
        var key = Object.prototype.toString.call(val);
        return map[key];
    }else{
        return type;
    }
};

// 测试
console.log(myTypeof({})); // 'object'
console.log(myTypeof([])); // 'array'
console.log(myTypeof(null)); // 'null'
console.log(myTypeof(new Number(1))); // 'object number'
console.log(myTypeof(new String(1))); // 'object string'
console.log(myTypeof(new Boolean(1)));// 'object boolean'
```

## 2、插件的写法

立即执行函数是一个非常好写插件的函数，模板如下：

```javascript
// 独立开辟一个作用域，防止作用域污染
;(function(){
  	function Test(){ // 构造函数
    	// 插件的逻辑
    }
  	Test.prototype = { ... }
  	window.Test = Test;
})()
var test = new Test();
```

### 写一个计算加减乘除的小插件

任意传两个数字，调用插件内部方法可进行加减乘除的功能

```javascript
;(function(){
  	function Compute(options){
        this.x = options.x;
        this.y = options.y;
    }
    Compute.prototype = {
        // 加
        add: function () {
            return this.x + this.y;
        }, 
        // 减
        sub: function () {
            return this.x - this.y;
        },
        // 乘
        mul: function () {
            return this.x * this.y;
        }, 
        // 除
        div: function () {
            if(this.y != 0){
                return this.x / this.y;
            }else {
                throw new Error(`除数不能为0`)
            }
        }
    }
    window.Compute = Compute;
})()

// 测试
var compute = new Compute({x: 1, y: 2});
console.log(compute.add()); // 3
console.log(compute.sub()); // -1
console.log(compute.mul()); // 2
console.log(compute.div()); // 0.5
```
## 3、伪随机码的生成
随机生成由32个字符组成的随机码（32位Guid字符串）
```javascript
function guid(){
   var res = "";
   for (var i = 1; i <= 32; i++) {
     var n = Math.floor(Math.random() * 16.0).toString(16);
     res += n;
     // 8-4-4-4-12
     if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
       	res += "-";
   }
   return res;
}

// 测试
guid(); // '5c93b0e0-549b-24d7-9a03-576227bfb6c1'
```