---
title: JavaScript手写（一）
date: 2021-01-25 20:53:16
permalink: /front-end/javascript/js-handwritten-01
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
## 1、实现一个深拷贝

浅拷贝可以使用 Object.assign 和展开运算符（...）来实现
深拷贝实现方式：手写、第三方库(loadsh)、JSON.parse(JSON.stringfy(data))

```javascript
const target = {
    a: 1,
    b: undefined,
    c: {
        child: 'child'
    },
    d: [2, 4, 6]
};
// 出现循环引用，爆栈问题，递归进入死循环导致栈内存溢出
target.target = target;
```

解决循环引用问题，我们可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话继续拷贝，这样就巧妙化解的循环引用的问题。
这个存储空间，需要可以存储key-value形式的数据，且key可以是一个引用类型，我们可以选择Map这种数据结构。

### 深拷贝的实现(简易版, 不考虑其他复杂情况~)

```javascript
function clone(target, map = new WeakMap()) {
    if (typeof target === 'object') {
        let cloneTarget = Array.isArray(target) ? [] : {};
        if (map.get(target)) {
            return map.get(target);
        }
        map.set(target, cloneTarget);
        for (const key in target) {
            cloneTarget[key] = clone(target[key], map);
        }
        return cloneTarget;
    } else {
        return target;
    }
};
```

### 深拷贝的实现

```js
// 深拷贝  考虑到复制 Symbol 类型: Reflect.ownKeys(obj)
function clone(target, map = new WeakMap()) {
  if (target instanceof Date) return new Date(target);
  if (target instanceof RegExp) return new RegExp(target);
  if (typeof target === 'function') return new Function(target);
  if (typeof target === 'object') {
    let cloneTarget = Array.isArray(target) ? [] : {};
    // start 解决循环引用爆栈问题
    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, cloneTarget);
    // end
    for (const key in target) {
      if (Object.hasOwnProperty(key)) {
        cloneTarget[key] = typeof target[key] === 'object' ? clone(target[key], map) : target[key];
      }
    }
    return cloneTarget;
  } else {
    return target;
  }
};
```

## 2、函数柯理化

```js
// 实现柯里化    fn是一个函数
    let curry = (fn) => {
      if (typeof fn !== 'function') {
        return;  //throw Error('No function provided')
      }
      return function curriedFn(...args) {
        if (args.length < fn.length) {
          return function (...nextArgs) {
            return curriedFn.apply(this, [...args, ...nextArgs]);
          }
        }
        return fn.apply(this, args)
      }
    }
    function multiFn1(a, b, c) {
      return a * b * c
    }
    function multiFn2(a, b, c) {
      return a + b + c
    }
    // 参数的长度是固定的
    var multi1 = curry(multiFn1);
    var multi2 = curry(multiFn2);
    console.log(multi1(2)(3)(4)); // multi1 就是curriedFn
    console.log(multi1(2, 3, 4))
    console.log(multi1(2)(3, 4))
    console.log(multi1(2, 3)(4))
  
    console.log(multi2(2)(3)(4)); // multi2 就是curryfn
    console.log(multi2(2, 3, 4))
    console.log(multi2(2)(3, 4))
    console.log(multi2(2, 3)(4))
```

## 3、数组扁平化

```js
// 数组扁平化
// 这一种方法通过递归来实现，当元素为数组时递归调用，兼容性好 
function fun(array) {
  if (!Array.isArray(array)) return;
  let result = [];
  result = array.reduce(function (pre, cur) {
    // 判断元素是否为数组，如果为数组则递归调用，如果不是则加入结果数组中 
    return pre.concat(Array.isArray(cur) ? fun(cur) : cur);
  }, []);
  return result;
}

// 数组的扁平化    递归
function spinArr(arr) {
  // write code here
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      // res = res.concat(spinArr(arr[i]))
      res = res.push(...spinArr(arr[i]))
    } else {
      res.push(arr[i])
    }
  }
  return res;
}
let arr = [[1, 2, 3, 4, 5, 6], [18, 19, 20, 21, 22, 7], [17, 28, 29, 30, 23, 8], [16, 27, 26, 25, 24, 9], [15, 14, 13, 12, 11, 10]];
console.log(spinArr(arr))

// 数组的扁平化    递归
function flatten(arr) {
  while (arr.some(item => (Array.isArray(item)))) {
    arr = [].concat(...arr);
  }
  return arr;
}

// arr.flat(Infinity)
```

## 4、数组去重

- 双重for循环 + splice删除相等的
- 创建新数组 includes indexof 去重, 返回新数组
- Array.from(new Set(arr))

## 5、手写通用累加函数

### 了解前置知识

一般来说，在浏览器控制台打印一个函数，会调用该函数的toString方法，而函数的toString方法默认是以字符串的形式返回该函数

```js
function override() {
    function test(){
      const num = 1;
    }
    test.toString = function () {
        return "重写test的toString方法";
    }
    return test;
}
alert(override())
// 在浏览器中弹出 "重写test的toString方法"
```

### 核心代码实现

```js
function add(...addRest) {
    var args = [...addRest];
    function sum(...sumRest) {
        args.push(...sumRest);
        return sum;
    }
    sum.toString = function () {
        return args.reduce( (prev, curr) =>  prev + curr , 0);
    }
    return sum;
}
alert(add(1, 2, 3)(4, 5, 6)(7, 8, 9))
// 45
```

```js
// 另一种方式实现
const add = (...args) => {
  const addFn = (args) => {
    return args.reduce((p, c) => p + c, 0);
  };
  const fn = function (...addition) {
    let concatArgs = args.concat(addition);
    return add(...concatArgs);
  }
  fn.sumOf = function () {
    console.log(addFn(args));
  }
  return fn;
}
add(1, 2, 3)(4, 6).sumOf();
add(1)(2)(3).sumOf();
add(1, 2)(3).sumOf();
add(4, 5)(1)(2, 3).sumOf();
add(1, 1)(3)(6).sumOf();
```

## 6、封装一个队列Queue

```js
/**
     * 请基于JS中Array对象的push/pop/shift/unshift，实现一个容量为N的整数队列Queue
     *
     *要求：
    * 1. 当队列容量满时，队列内元素的淘汰算法为“先进先出FIFO”
    * 2. 提供max()方法，获取队列中的最大的元素，要求时间复杂度为O(1)
    * 3. 实现队列的入列add、获取头部元素peek、出列remove方法等基本的队列操作
    *
    * @function Queue
    * @param  {number} N {容量}
*/
class Queue {
    constructor(N) {
        this.N = N || 0;  // 数组最大长度
        this.count = 0; // 数组元素个数
        this.arr = [];
    }
    max = function () {
        return Math.max(...this.arr);
    }
    add = function (value) {
        let len = this.arr.length;
        if (len == this.N) {
            this.arr.pop();
            this.count--
        }
        this.arr.unshift(value);
        this.count++
    }
    peek = function () {
        return this.arr[0];
    }
    remove = function () {
        this.count--;
        return this.arr.pop();
    }
}
let q1 = new Queue(3);
q1.add(1)
q1.add(2)
q1.add(3)
q1.add(4)
q1.max();
console.log(q1.max());
console.log(q1.peek());
console.log(q1.remove());
```

## 7、封装一个队列Stack

```js
function Stack() {
    //栈的属性：数组
    this.items = [];
}
Stack.prototype = {
    constructor: Stack,
    //将元素压入栈
    push: function (element) {
        this.items.push(element);
    },
    //将元素压出栈
    pop: function () {
        return this.items.pop();
    },
    //读取栈顶元素peek
    peek: function () {
        return this.items[this.items.length - 1]
    },
    //读取是否为空栈isEmpty,返回布尔值
    isEmpty: function () {
        return this.items.length == 0;
    },
    //获取元素个数size
    size: function () {
        return this.items.length;
    }
}
var stack = new Stack();
```

## 8、实现myCall

修改上下文方向，会立即执行函数

```js
Function.prototype.myCall = function (context, ...args) {
    if (typeof this !== "function") {
        throw new TypeError("Error");
    }
    // context = null情况
    // Web Worker中，只有self为全局变量
    // globalThis是ES2020提出  node 12+   chrome 71+
    // context其实是一个{}   this是 调用myCall的function
    context = context || globalThis;
    context.func = this;
    const result = context.func(...args);
    delete context.func;
    return result;
}

Function.prototype.myCall = function (context, ...args) {
  if (!context || context === null) {
    context = window;
  }
  // 创造唯一的key值  作为我们构造的context内部方法名
  let fn = Symbol();
  context[fn] = this; //this指向调用call的函数
  // 执行函数并返回结果 相当于把自身作为传入的context的方法进行调用了
  return context[fn](...args);
};
```

## 9、实现myApply

修改上下文方向，会立即执行函数，第二个参数以数组形式传入

```js
// apply原理一致  只是第二个参数是传入的数组
Function.prototype.myApply = function (context, args) {
  if (!context || context === null) {
    context = window;
  }
  // 创造唯一的key值  作为我们构造的context内部方法名
  let fn = Symbol();
  context[fn] = this;
  // 执行函数并返回结果
  return context[fn](...args);
};

Function.prototype.myApply = function (context, args = []) {
    if (args && !Array.isArray(args)) {
        throw ('异常');
    }
    context = context || window;
    context.func = this;
    const result = context.func(...args);
    //delete context.func;
    return result;
}
console.log(Math.max.myApply(null, [1, 2, 4, 8]))
// 结果是8

//求最大值
var res = [1, 2, 3, 4, 5].reduce((pre, curr) => {
  return curr > pre ? curr : pre;
  //return Math.max(pre,curr);
});
```

## 10、实现bind

```js
function bind(context, ...args) {
    context = context || window;
    let fn = Symbol();
    context[fn] = this;
    let _this = this;
    const result = (...nextArgs) => {
        if (this instanceof _this) {
            this[fn] = _this;
            this[fn](...[...args, ...nextArgs])
        } else {
            context[fn](...[...args, ...nextArgs]);
        }
    }
    result.prototype = Object.create(this.prototype)
    return result
}

Function.prototype.myBind = function (context, ...args) {
  // if (!context || context === null) {
  //   context = window;
  // }
  context = context || window;
  // 创造唯一的key值  作为我们构造的context内部方法名
  let fn = Symbol();
  context[fn] = this;
  let _this = this;
  //  bind情况要复杂一点
  const result = function (...innerArgs) {
    // 第一种情况 :若是将 bind 绑定之后的函数当作构造函数，通过 new 操作符使用，则不绑定传入的 this，而是将 this 指向实例化出来的对象
    // 此时由于new操作符作用  this指向result实例对象  而result又继承自传入的_this 根据原型链知识可得出以下结论
    // this.__proto__ === result.prototype   //this instanceof result =>true
    // this.__proto__.__proto__ === result.prototype.__proto__ === _this.prototype; //this instanceof _this =>true
    if (this instanceof _this === true) {
      // 此时this指向指向result的实例  这时候不需要改变this指向
      this[fn] = _this;
      this[fn](...[...args, ...innerArgs]); //这里使用es6的方法让bind支持参数合并
    } else {
      // 如果只是作为普通函数调用  那就很简单了 直接改变this指向为传入的context
      context[fn](...[...args, ...innerArgs]);
    }
  };
  // 如果绑定的是构造函数 那么需要继承构造函数原型属性和方法
  // 实现继承的方式: 使用Object.create
  result.prototype = Object.create(this.prototype);
  return result;
};

// 其实不管bind几次，this的指向永远是第一次的bind决定；
// 构造函数.bind(obj, ...args) 返回的函数  Xxxxx     new Xxxxx();
Function.prototype.myBind_0 = function (context, ...args) {
  context = context || window;
  let fn = Symbol();
  context[fn] = this;
  let _this = this;
  const result = function (...newArgs) {
    // 如果绑定的是构造函数 那么需要继承构造函数原型属性和方法
    if (this instanceof _this) {
      this[fn] = _this;
      this[fn](...[...args, ...newArgs]);
    } else {
      context[fn](...[...args, ...newArgs]);
    }
  }
  result.prototype = Object.create(this.prototype);
  return result;
}
```

## 11、函数防抖

在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。

#### 防抖的应用

浏览器窗口缩放resize、scroll事件滚动触发、表单的验证、按钮提交事件.
典型的案例就是搜索框输入查询（auto-component）：输入结束后n秒才进行搜索请求，n秒内又输入的内容，就重新计时。

```js
function debounce(fn, wait = 300) {
  // 利用闭包保存定时器
  let timer = null;
  return function (...args) {
    //获取 this 和 参数
    // let [context, args] = [this, [...arguments]]
    let context = this;  // let that = this;
    // 在规定时间内再次触发会先清除定时器后再重设定时器
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    // 重新设置一个新的延时器
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, wait);
  }
}
```

## 12、函数节流

在事件被触发，在一个单位时间内，只有一次生效，在规定的时间内又被触发，不生效。过了这个时间再触发，才会生效。

#### 防抖的应用

文章的点赞、抢购某个商品。
典型的案例就是鼠标(键盘)不断点击触发，规定在n秒内多次点击只有一次生效，防止鼠标或者键盘的连点。

```js
function throttle(fn, wait) {
  // 时间戳   第一次事件肯定触发，最后一次不会触发
  let pretime = 0;
  return function (...args) {
    //获取 this 和 参数
    let context = this;
    // 记录当前函数触发的时间  获取当前时间戳
    let nowtime = Date.now();
    if (nowtime - pretime >= wait) {
      // 更新上一次点的时间
      pretime = nowtime;
      // 绑定this 指向
      fn.apply(context, args);
    }
  }
}


function throttle(fn, wait) {
  // 定时器   第一次不会触发 最后一次会触发函数
  let timer = null;
  return function (...args) {
    let context = this;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(context, args);
      }, wait)
    }
  }
}

// 定时器和时间戳的结合版，也相当于节流和防抖的结合版，第一次和最后一次都会触发
function throttle(fn, wait) {
  // 
  let [pre, timer] = [0, null]
  return function (...args) {
    //获取 this 和 参数
    let context = this;
    if (Date.now() - pre > wait) {
      clearTimeout(timer);
      timer = null;
      pre = Date.now();
      fn.apply(context, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, wait);
    }
  }
}
```
