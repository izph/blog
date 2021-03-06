---
title: JavaScript手写（二）
date: 2021-05-27 20:53:16
permalink: /front-end/javascript/js-handwritten-02
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

## 2、插件（第三方库）的写法

采用UMD模块，立即执行函数是一个非常好写插件的函数，模板如下：

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
   let res = "";
   const arr = [8, 12, 16, 20]
   for (let i = 1; i <= 32; i++) {
     let n = Math.floor(Math.random() * 16.0).toString(16);
     res += n;
      // 8-4-4-4-12
      //  if ((i == 8) || (i == 12) || (i == 16) || (i == 20)){
      //      	res += "-";
      //  }
      if (arr.includes(i)){
         	res += "-";
      }
   }
   return res;
}

// 测试
guid(); // '5c93b0e0-549b-24d7-9a03-576227bfb6c1'
```

## 4、用setTimeout 实现 setInterval

```javascript
function mySetInterval(fn, time) {
    timer = setTimeout(function () {
        fn();
        clearTimeout(timer);
        mySetInterval(fn, time);
    }, time)
		// 返回timer，用于取消
    return timer;
}
mySetInterval(function(){ console.log(1) }, 1000); 
```

## 5、手写 instanceof

- 作用：instanceof 用于判断对象 是否出现在 构造函数的prototype属性的原型链中
- 用法：(对象) instanceof (构造函数)

```javascript
//  Object.getPrototypeOf(obj) 方法用于获取obj的原型对象(obj.__proto__)
function myInstanceof(obj, func) { 
  // 获取对象的原型
  let objproto = Object.getPrototypeOf(obj), 
  // 获取构造函数的 prototype 对象
  prototype = func.prototype;  
  // 判断构造函数的 prototype 对象是否在对象的原型链上 
  while (true) { 
    if (!objproto) { 
      return false; 
    }
    if (objproto === prototype) { 
      return true;
    } 
    objproto = Object.getPrototypeOf(objproto); 
  } 
}
```

## 6、封装一个通用的javascript类型判断函数

```javascript
function getType(value) { 
  // 判断数据是 null 的情况 
  if (value === null) { 
    return value + ""; 
  }
  // 判断数据是引用类型的情况 
  if (typeof value === "object") { 
    return Object.prototype.toString.call(value).match(/^\[object ([a-zA-Z]*)\]$/)[1];
  } else { 
    // 判断数据是基本数据类型的情况和函数的情况 
    return typeof value; 
  } 
}
```

## 7、结合Promise封装Ajax

```javascript
function ajax(){
  return new Promise(function(resolve, reject){
   var req = new XMLHttpRequest();
   req.open("POST", "url", true);
   req.onload = function(){
     if(req.readyState === 4 && req.status === 200){
       resolve(req.response);
     } else {
       reject(req.statusText);
     }
   }
   req.onerror = function(){
     reject(Error("网络异常"));
   }
 });
}
```

## 8、对比两个JSON对象是否相等

```javascript
// notCompare: string [] 将不需要对比的属性放到数组中
function compareJsonEqual(obj1 = {}, obj2 = {}, notCompare) {
    var flag = true;
    // 排除 notCompare 的干扰
    for(let i = 0; i < notCompare.length; i++){
        delete obj1[`${notCompare[i]}`];
        delete obj2[`${notCompare[i]}`];
    }
    function compre(obj1, obj2) {
        if (Object.keys(obj1).length != Object.keys(obj2).length) {
            flag = false;
        } else {
            for (let key in obj1) {
                if (obj2.hasOwnProperty(key)) {
                    // 当前属性为 引用类型
                    if (obj1[key] !== obj2[key]) {
                        compre(obj1[key], obj2[key]);
                    }
                } else {
                    flag = false;
                }
            }
        }
        // if (flag === false) {
        //     return false;
        // } else {
        //     return true;
        // }
        return flag;
    }
    return compre(obj1, obj2);
```

## 9、解析模板字符串

```js
let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
let data = {
    name: 'yolo',
    age: 18
}
function render(template, data) {
    // replace 的第二个参数
    let computed = template.replace(/\{\{(\w+)\}\}/g, function (match, key) { 
      // match是模板  key是捕获的键
        // console.log(match, key)
        // {{name}} name
        // {{age}} age
        // {{sex}} sex
        return data[key];
    });
    return computed;
}
console.log(render(template, data));// 我是姓名，年龄18，性undefined


let str = "<div>{{$0}}({{$1}}){{$2}}</div>";
let arr = ["前端", "js", "开发"];
function tpl(templateStr, arr) {
      templateStr = templateStr.replace(/\{\{\$(\w)+\}\}/g, function (match, index) {
        // match, index
        // {{$i}} i
        return arr[index];
    })
    return templateStr;
}
console.log(tpl(str, arr))
// <div>前端(js)开发</div>
```

## 10、实现find函数，使下列的代码调用正确

```js
 var data = [
    { userId: 8, title: 'title1' },
    { userId: 11, title: 'other' },
    { userId: 15, title: null },
    { userId: 19, title: 'title2' },
];
// 简单实现
var find = function (origin) {
    const vm = {
        data: origin,
        wheredata: null,
        where: function (attr, reg) {
            this.wheredata = this.data.filter((item) => {
                return reg.test(item[attr])
            })
            return this;
        },
        orderBy: function (attr, type) {
            return this.wheredata.sort((a, b) => {
                if (type === 'desc') {
                    // 降序
                    return b[attr] - a[attr]
                } else {
                    // 升序
                    return a[attr] - b[attr]
                }
            })
        }
    }
    return vm;
};
//查找data中，符合条件的数据，并进行排序
var result = find(data).where('title', /\d$/).orderBy('userId','desc');
console.log(result); 
// [{ userId: 19, title: 'title2'}, { userId:8, title: 'title1' }];
```

## 11、list转成树结构

```js
let res = [
    {
        id: 100,
        title: '苹果产品',
    },
    {
        id: 200,
        title: '华为产品',
    },
    {
        pid: 100,
        title: 'Iphone 11 pro max',
    },
    {
        pid: 100,
        title: 'Iphone 12 pro max',
    },
    {
        pid: 200,
        title: '华为Mate 30',
    },
    {
        pid: 200,
        title: '华为Mate 40',
    },
];
function disThree(array) {
    let parentList = array.filter((item) => item.id);
    return (function (list) {
        parentList.forEach((item) => {
            item.children = list.filter((subItem) => item.id == subItem.pid);
        });
        return parentList;
    })(array);
}
console.log(disThree(res));
```

## 12、用js为选择器对应的所有元素添加类名

`dom.classList.add('test')`

```js
// 为所有的div添加
const doms = document.querySelectorAll('div')
const addClass =  (nodes, value) => {
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].classList.add(value);
    }
}
addClass(doms, 'test')
```

## 13、给全局对象window添加属性

```js
function getConst(key, val) {
    window[key] = val;
    Object.defineProperty(window, key, {
      //如果设置了 set 或 get, 就不能设置 writable 和 value 中的任何一个，否则报错
      get: function () { 
          return constVal;
      },
      configurable: false, //配置信息是否可修改
      enumerable: true, //是否可枚举
    })
};
getConst("age", 10)
age = 20;
console.log(age); // 10  未被修改
```

## 14、获取url的参数

地址栏 `?`及后面的参数就是search-string（search字符串）

### qs获取

```js
import qs from "qs";

var searchString = "a=1&b=2&c=3";

var query = qs.parse(searchString);

console.log(query); 
// {a: 1, b: 2, c: 3}

console.log(qs.stringify(query)); 
// a=1&b=2&c=3
```

### split分割法获取

```js
let URL = "http://www.yolo.com?name=zph&age=18&height=175&weight=130"
function queryURLParams(URL) {
  // 直接通过search参数获取url中"?"符后的字串
  // const url = window.location.search; 
  let url = URL.split("?")[1];
  let obj = {}; // 声明参数对象
  let arr = url.split("&"); // 以&符号分割为数组
  for (let i = 0; i < arr.length; i++) {
    let arrNew = arr[i].split("="); // 以"="分割为数组
    obj[arrNew[0]] = arrNew[1];
  }
  return obj;
}
console.log(queryURLParams(URL))
```

### URLSearchParams方法

存在兼容性问题

```js
let URL = "http://www.yolo.com?name=zph&age=18&height=175&weight=130"
function queryURLParams(URL) {
  let url = URL.split("?")[1];
  const urlSearchParams = new URLSearchParams(url);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params;
}
console.log(queryURLParams(URL))
```

参考：[获取URL参数](https://juejin.cn/post/7075305529903415304)

## 15、数字转成千分符

```js
function toThousands(num) {
  let result = '', counter = 0;
  // 数字转成字符串
  num = (num || 0).toString();
  for (let i = num.length - 1; i >= 0; i--) {
    counter++;
    result = num[i] + result;
    if (!(counter % 3) && i != 0) {
      result = ',' + result;
    }
  }
  return result;
}
toThousands(1234567890)
// '1,234,567,890'
```

## 16、实现一个repeat函数

这个函数能返回一个新函数，比如这样用 `var repeatedFun = repeat(console.log, 4, 1000)`
调用这个 repeatedFun("hellworld") 会console.log 4次 helloworld, 每次间隔1秒

```js
function repeat(func, times, wait) {
    return function (val) {
        let count = 0;
        //func(val);如果一开始就打印 就先执行一遍再使用计时器，后面次数减1
        let timer = setInterval(() => {
            count++;
            count < times ? '' : clearInterval(timer)
            func(val);
        }, wait)
    }
}
const repeatFunc = repeat(console.log, 4, 1000)
repeatFunc('helloworld')
```

## 17、转化为驼峰命名

```js
const str = "get-user-info";
function (s) {
  return s.replace(/-(\w)/g, function (match, key) {
    return key.toUpperCase()
    //return match.slice(1).toUpperCase();
  })
}
// getUserInfo
```

## 18、根据数组中对象的多个属性值排序

```js
const arr = [
  { id: 1, age: 12 }, 
  { id: 2, age: 14 }, 
  { id: 6, age: 10 }, 
  { id: 9, age: 16 }, 
  { id: 2, age: 18 }, 
  { id: 1, age: 19 }
];

arr.sort(function (a, b) {
  // 如果id相同，按照age的降序
  if (a.id === b.id) {
    return b.age - a.age
  } else {
    return a.id - b.id
  }
})
```

## 19、生成1-100的数字

```js
  // 生成1-100数字
  let arr1 = [...Array(100)].map((item, index) => index + 1);
  let arr2 = Array.from({ length: 100 }, (item, index) => index + 1);

  // 生成0-9数字
  let arr3 = [...Array(10).keys()];
```
