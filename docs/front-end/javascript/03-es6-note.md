---
title: ES6速记
date: 2020-09-29 17:09:12
permalink: /front-end/javascript/es6-note
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# ES6

更多参考阮一峰老师的ES6教程
[ES6 入门教程](https://es6.ruanyifeng.com/)

## 1.let 关键字

let 关键字用来声明变量，使用 let 声明的变量有几个特点：

- 1) 不允许重复声明
- 2) 块儿级作用域
- 3) 不存在变量提升
- 4) 不影响作用域链

## 2. const 关键字

const 关键字用来声明常量，const 声明有以下特点

- 1) 声明必须赋初始值
- 2) 标识符一般为大写
- 3) 不允许重复声明
- 4) 值不允许修改
- 5) 块儿级作用域

对象属性修改和数组元素变化不会错误

## 3.变量的解构赋值

频繁使用对象方法、数组元素，就可以使用解构赋值形式

```js
const { a, b } = props;
const [c, d] = [1, 2];
```

## 4.模板字符串

模板字符串（template string）是增强版的字符串，用反引号（`）标识，特点：

- 字符串中可以出现换行符
- 可以使用 \`${xxx}\` 形式输出变量

## 5.简化对象写法

ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法。这
样的书写更加简洁。

## 6.箭头函数

箭头函数的注意点:

- 1) 如果形参只有一个，则小括号可以省略
- 2) 函数体如果只有一条语句，则花括号可以省略，函数的返回值为该条语句的执行结果
- 3) 箭头函数 this 指向声明时所在作用域下 this 的值
- 4) 箭头函数不能作为构造函数实例化
- 5) 不能使用 arguments
- 6) 注意：箭头函数不会更改 this 指向，用来指定回调函数会非常合适

![image.png](images/ES6/es6001.png)
![image.png](images/ES6/es6002.png)

## 7. rest 参数（剩余参数）

ES6 引入 rest 参数，用于获取函数的实参，用来代替 arguments，rest 参数必须是最后一个形参
注意：rest 参数非常适合不定个数参数函数的场景

## 8. spread 扩展运算符

扩展运算符（spread）也是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列，对数组进行解包。

## 9.Symbol 基本使用

ES6 引入了一种新的原始数据类型 Symbol，表示独一无二的值。它是
JavaScript 语言的第七种数据类型，是一种类似于字符串的数据类型。
Symbol 特点

1) Symbol 的值是唯一的，用来解决命名冲突的问题
2) Symbol 值不能与其他数据进行运算

![image.png](images/ES6/es6003.png)

3) Symbol 定义 的 对象属 性 不能 使 用 for…in 循 环遍 历 ，但 是可 以 使 用 Reflect.ownKeys 来获取对象的所有键名

```javascript
//创建 Symbol
let s1 = Symbol();
console.log(s1, typeof s1); // Symbol() "symbol"

//添加标识的 Symbol
let s2 = Symbol('yolo');
let s3 = Symbol('yolo');

console.log(s2 === s3); // false

//使用 Symbol for 定义
let s4 = Symbol.for('yolo');
let s5 = Symbol.for('yolo');
console.log(s4 === s5); // true
```

**注: 遇到唯一性的场景时要想到 Symbol，不能与其他数据进行运算**

**Symbol.iterator** : 对象进行 `for...of`循环时，会调用 `Symbol.iterator`方法， 返回该对象的默认遍历器

- Symbol创建对象属性

```javascript
//向对象中添加方法 up down
let game = {
    name: '俄罗斯方块',
    up: function () { },
    down: function () { }
};

//声明一个对象
let methods = {
    up: Symbol(),
    down: Symbol()
};

game[methods.up] = function () {
    console.log("up");
}

game[methods.down] = function () {
    console.log("down");
}

console.log(game);
console.log(game[methods.up]);
console.log(game[methods.down]);
```

![image.png](images/ES6/es6004.png)
![image.png](images/ES6/es6005.png)

```javascript
let eat = Symbol('eat')
let sleep = Symbol('sleep')
let person = {
    name: "yolo",
    [eat]: function () {
        console.log("吃饭")
    },
    [sleep]: function () {
        console.log('睡觉');
    }
}
console.log(person)
```

![image.png](images/ES6/es6006.png)

- Symbol定义的对象属性不能使用 `for…in`循环遍历

![image.png](images/ES6/es6007.png)

- 可以使用 `Reflect.ownKeys`来获取对象的所有键名

![image.png](images/ES6/es6008.png)

```javascript
console.log(person[sleep])
console.log(person[eat])
```

![image.png](images/ES6/es6009.png)

```javascript
let person = {
    name: "yolo",
    [Symbol.for('eat')]: function () {
        console.log("吃饭")
    },
    [Symbol.for('sleep')]: function () {
        console.log('睡觉');
    }
}
console.log(person)
console.log(person[Symbol.for('eat')])
console.log(person[Symbol.for('sleep')])
```

## 10. 迭代器

遍历器（Iterator）就是一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署**Iterator 接口(Iterator 接口其实就是对象的一个属性，属性的名字就是Symbol.iterator)**，就可以完成遍历操作。(c语言，java，php，python都有迭代器)

1) ES6 创造了一种新的遍历命令 for...of 循环，**Iterator 接口主要供 for...of 消费**
2) **原生具备 iterator 接口的数据(可用 for...of 遍历) 含有Symbol（Symbol.iterator）属性，**
   **Symbol（Symbol.iterator）: fun(){}函数**
3) `Array`
4) `Arguments`
5) `Set`
6) `Map`
7) `String`
8) `TypedArray`
9) `NodeList`
10) 工作原理
    a) 创建一个指针对象，指向当前数据结构的起始位置
    b) 第一次调用对象的 next 方法，指针自动指向数据结构的第一个成员
    c) 接下来不断调用 next 方法，指针一直往后移动，直到指向最后一个成员
    d) 每调用 next 方法返回一个包含 value 和 done 属性的对象

```javascript
const word = ['A','B','C','D'];
// 创建一个指针对象
let iterator = word[Symbol.iterator]();
```

`console.log(word)`

![image.png](images/ES6/es6010.png)

`console.log(iterator)`

![image.png](images/ES6/es6011.png)

```javascript
// 调用对象的next方法
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

![image.png](images/ES6/es6012.png)

需要自定义遍历数据的时候，要想到迭代器

### 10(1) 怎么让 for ... of能遍历对象( Object是不用使用迭代器的)

只要向 Object的原型上写一个 Symbol.iterator 就行了(具体加到某个对象上也可以)

```javascript
// obj[Symbol.iterator] = function(){...}
Object.prototype[Symbol.iterator] = function() {
    //  var keys = Object.keys(this);
    const keys = Reflect.ownKeys(this)
    let count = 0
    // 返回遍历器对象
    return {
        next: function(){
        		if(count < keys.length){
          			return { value: this[keys[count++]],done: false }
          	} else {
            		return { value: undefined, done: true }
        },
        return: function(){
        	return { value: undefined, done: true }
        }
        }
    }
}

Object.prototype[Symbol.iterator] = function () {
    const self = this;
    const keys = Object.keys(this);
    let index = 0;

    return {
        next () {
            if (index < keys.length) {
            			return { value: self[keys[index++]], done: false };
            }
            return {value: undefined, done: true};
        }
    }

}
```

- Reflect.ownKeys 获取对象的所有属性(包括 Symbol), Object.keys()不能获取到Symbol
- 要通过this获取实例对象，所以用 function 而没有使用箭头函数
- 定义了一个 count 指针, 每次 for ... of 遍历时, next函数都会执行, 返回目标值, 由于我们自定义了遍历器, 所以可以返回任何你想要的值（我这里返回了对象的键值）
- 遍历器返回的对象 next 函数是必须的, 不断调用该方法，依次指向数据结构中的每个成员，每次调用之后，对指针加一，向后移动一位，直至完成便遍历操作
- return函数在遍历结束会触发 ，return()方法的使用场合是，如果for...of循环提前退出（通常是因为出错，或者有break语句），就会调用return()方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署return()方法。

### 10(2) 遍历对象方法

```javascript
const obj = {
    a: 1,
    b: 2,
    c: 3
}
console.log(Object.entries(obj));
console.log(Object.keys(obj));
console.log(Object.values(obj));
for (let [k, v] of Object.entries(obj)) {
    console.log(k, v);
}
```

![image.png](images/ES6/es6013.png)

## 11. 生成器

生成器函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同
**yield函数代码的分隔符、3个yield其实就把 gen函数分成 4个代码块**

```javascript
// 生成器其实就是一个特殊的函数
// 异步编程:回调函数/node fs/ajax/mongodb
// yield函数代码的分隔符
function *gen(){
    console.log(111);    第1部分代码
    yield '分割线111';
    console.log(222);		 第2部分代码
    yield '分割线222';
    console.log(333);		 第3部分代码
    yield '分割线333';
    console.log(444);		 第4部分代码
}
// 直接调用gen()没有输出，必须调用next()才输出
let iterator = gen();
// iterator.next() 111   执行第1部分代码
// iterator.next() 222	 执行第2部分代码
// iterator.next() 333	 执行第3部分代码
// iterator.next() 444   执行第4部分代码

console.log(iterator.next()); // {value: "分割线111", done: false}
console.log(iterator.next()); // {value: "分割线222", done: false}
console.log(iterator.next()); // {value: "分割线333", done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```

```javascript
for (let v of gen()) {
   console.log(v);
}
```

结果如右：![image.png](images/ES6/es6014.png)

**生成器传参**
**next也是可以传参，参数将作为上一个yield语句的返回结果**
**next第二次调用的参数，将作为第一次yield的返回结果**

```javascript
 function * gen(arg){
     console.log(arg);
     let one = yield 111;
     console.log(one);
     let two = yield 222;
     console.log(two);
     let three = yield 333;
     console.log(three);
 }

 //执行获取迭代器对象
 let iterator = gen('AAA');
 console.log(iterator.next());
 //next方法可以传入实参
 console.log(iterator.next('BBB'));
 console.log(iterator.next('CCC'));
 console.log(iterator.next('DDD'));
```

![image.png](images/ES6/es6015.png)

1s 后控制台输出 111 ，然后2s后输出 222，然后3s后输出 333 ，一共需要6s。

```javascript
1、回调地狱实现
setTimeout(() => {
    console.log(111);
    setTimeout(() => {
        console.log(222);
        setTimeout(() => {
            console.log(333);
        }, 3000);
    }, 2000);
}, 1000);
```

```javascript
2、生成器实现
function one(){
    setTimeout(()=>{
        console.log(111);
        iterator.next();
    },1000)
}

function two(){
    setTimeout(()=>{
        console.log(222);
        iterator.next();
    },2000)
}

function three(){
    setTimeout(()=>{
        console.log(333);
        iterator.next();
    },3000)
}

function * gen(){
    yield one();
    yield two();
    yield three();
}

//调用生成器函数
let iterator = gen();
iterator.next();
```

模拟获取，先获取用户数据，再获取订单数据，最后获取商品数据

```javascript
function getUsers(){
    setTimeout(()=>{
        let data = '用户数据';
        //调用 next 方法, 并且将数据传入
        iterator.next(data);
    }, 1000);
}

function getOrders(){
    setTimeout(()=>{
        let data = '订单数据';
        iterator.next(data);
    }, 1000)
}

function getGoods(){
    setTimeout(()=>{
        let data = '商品数据';
        iterator.next(data);
    }, 1000)
}

function * gen(){
    let users = yield getUsers();
     console.log(users);
     let orders = yield getOrders();
     console.log(orders);
     let goods = yield getGoods();
     console.log(goods);
}

//调用生成器函数
let iterator = gen();
iterator.next();
```

![image.png](images/ES6/es6016.png)

## 12.Promise

### promise读取文件

```javascript
const fs = require('fs')
const p = new Promise(function(resolve, reject){
    fs.readFile("./resources/为学.mda", (err, data)=>{
        //判断如果失败
        if(err) reject(err);
        //如果成功
        resolve(data);
    });
});

p.then(function(value){
    console.log(value.toString());
}, function(reason){
    console.log("读取失败!!");
});
```

### promise封装AJAX

AJAX的open方法的第三个参数是boolean值   布尔值，默认是true 异步，设置为false是同步。

- boolean 取值为“true” 的时候，服务器的请求是异步的，也就是脚本执行send()方法后不等待服务器的执行结果，继续执行脚本代码 ；
- beelean取值为“false”的时候，服务器的请求是同步的 ， 也就是脚本执行send() 后等待服务器的执行结果，若在等待过程中超时，则不再等待，继续执行后面的脚本代码
- 0：请求未初始化(还没有调用open())
- 1：请求已经建立，但是还没有发送(还没有调用send())
- 2：请求已经发送
- 3：请求正在处理中，通常响应中已经有部分数据可以用了
- 4：响应已经完成，可以获取并使用服务器的响应了

```javascript
// 接口地址: http://localhost:8888/getuser
const p = new Promise((resolve, reject) => {
    //1. 创建对象
    const xhr = new XMLHttpRequest();
    //2. 初始化
    xhr.open("GET", "http://localhost:8888/getuser", true); // 默认是true, 异步代码
    //3. 发送
    xhr.send();
    //4. 绑定事件, 处理响应结果
    xhr.onreadystatechange = function () {
        //判断
        if (xhr.readyState === 4) {
            		//判断响应状态码 200-299
            if (xhr.status >= 200 && xhr.status < 300) {
                //表示成功
                resolve(xhr.response);
            } else {
                //如果失败
                reject(xhr.status);
            }
        }
    }
})
//指定回调
p.then(function (value) {
    console.log(value);
}, function (reason) {
    console.error(reason);
});
```

### promise读取多个文件

```javascript
//使用 promise 实现
const p = new Promise((resolve, reject) => {
    fs.readFile("./resources/为学.md", (err, data) => {
        resolve(data);
    });
});

p.then(value => {
    return new Promise((resolve, reject) => {
        fs.readFile("./resources/插秧诗.md", (err, data) => {
            resolve([value, data]);
        });
    });
}).then(value => {
    return new Promise((resolve, reject) => {
        fs.readFile("./resources/观书有感.md", (err, data) => {
            //压入
            value.push(data);
            resolve(value);
        });
    })
}).then(value => {
    console.log(value.join('\r\n'));
});
```

```javascript
//声明两个promise对象
const p1 = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve('商品数据 - 1');
    },1000)
});

const p2 = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve('商品数据 - 2');
        // reject('出错啦!');
    },1000)
});

// 调用 allsettled 方法 一直返回成功态的promise  返回value为一个数组，数组里面的元素是一个对象
// 每个对象有status 和value 描述 p1，p2
const result = Promise.allSettled([p1, p2]);
console.log(result);
// 全部成功才会返回 成功态的promise  只要一个失败，就返回失败的promise
// const res = Promise.all([p1, p2]);  


```

![image.png](images/ES6/es6017.png)

## 13.Set集合

ES6 提供了新的数据结构 Set（集合）。它类似于数组，但成员的值都是唯一的，不存在重复的元素，Set集合实现了 iterator 接口，所以可以使用『扩展运算符』和『for…of』进行遍历，集合的属性和方法：

1) size 返回集合的元素个数
2) add 增加一个新元素，返回当前集合
3) delete 删除元素，返回 boolean 值
4) has 检测集合中是否包含某个元素，返回 boolean 值
5) clear 清空集合，返回 undefined

```javascript
//声明一个 set
let s = new Set();
let s2 = new Set(['one','two','three','one','two']);

//元素个数
console.log(s2.size); // 3
```

```javascript
//添加新的元素
console.log(s2.add('four'));
```

![image.png](images/ES6/es6018.png)

```javascript
//删除元素
s2.delete('one');

// 判断s2是否包含某个元素
s2.has('two')  // true

// 清空 s2
s2.clear();

// 遍历
for(let v of s2){
    console.log(v);
}
```

```javascript
let arr = [1,2,3,4,5,4,3,2,1];

// 1. 数组去重
let result = [...new Set(arr)];
console.log(result);

//2. 交集
let arr2 = [4,5,6,5,6];
let result = [...new Set(arr)].filter(item => {
		 let s2 = new Set(arr2);  // 4 5 6
     if(s2.has(item)){
         return true;
     }else{
         return false;
     }
});

// 交集简写
let result = [...new Set(arr)].filter(item => new Set(arr2).has(item));
console.log(result);

//3. 并集
let union = [...new Set([...arr, ...arr2])];
console.log(union);

//4. 差集
let diff = [...new Set(arr)].filter(item => !(new Set(arr2).has(item)));
console.log(diff);
```
### WeakSet
WeakSet 对象中只能存放对象引用，不能存放值，而 Set 对象都可以。
WeakSet 对象中存储的对象值都是被弱引用的，如果没有其他的变量或属性引用这个对象值，则这个对象值会被当成垃圾回收掉。正因为这样，WeakSet 对象是无法被枚举的，没有办法拿到它包含的所有元素。
```js
const ws = new WeakSet()
const obj = {}
const foo = {}

ws.add(window)
ws.add(obj)

ws.has(window)  // true
ws.has(foo)  // false, 对象 foo 并没有被添加进 ws 中 

ws.delete(window)  // 从集合中删除 window 对象
ws.has(window)  // false, window 对象已经被删除了

ws.clear()  // 清空整个 WeakSet 对象
```
## 14.Map集合

ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合。但是键的范围不限于字符串，各种类型的值（包括对象）都可以当作键，甚至可以使用 NaN 来作为键值。Map也实现了iterator 接口，所以可以使用『扩展运算符』和『for…of』进行遍历。Map 的属性和方法：

1) map.size  返回 Map 的元素个数
2) map.set(key,value)   增加一个新元素，返回当前 Map
3) map.get(key)   返回键名对象的键值
4) map.has()   检测 Map 中是否包含某个元素，返回 boolean 值
5) map.clear()  清空集合，返回 undefined
6) map.delete(key)  删除集合元素
7) map遍历     for(let v of m){ console.log(v)}

```javascript
//创建 Map  
// const m = new Map(Object.entries(obj));
```
### WeakMap
WeakMap 对象是一组键 / 值对的集合，其中的键是弱引用的。其键必须是对象，而值可以是任意的。
```js
const o1 = {};
const o2 = function(){};
const o3 = window;

const wm1 = new WeakMap();
wm1.set(o1, 37);
wm1.has(o1);  // true
wm1.delete(o1);
wm1.has(o1);  // false

wm1.set(o2, "azerty");
wm1.get(o2);  // "azerty"
wm1.has(o2);  // true

const wm2 = new WeakMap();
wm2.set(o1, o2);  // value可以是任意值,包括一个对象
wm2.get(o2);  // undefined,wm2中没有o2这个键
wm2.has(o2);  // false

wm2.set(o3, undefined);
wm2.get(o3);  // undefined,值就是undefined
wm2.has(o3);  // true (即使值是undefined)

wm2.set(wm1, wm2);  // 键和值可以是任意对象,甚至另外一个WeakMap对象
 
const wm3 = new WeakMap();
wm3.set(o1, 37);
wm3.get(o1);  // 37
wm3.clear();
wm3.get(o1);  // undefined,wm3已被清空
```
## 15.JS的Class

ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念，作为对
象的模板。通过 class 关键字，可以定义类。基本上，ES6 的 class 可以看作只是
一个语法糖，它的绝大部分功能，ES5 都可以做到，新的 class 写法只是让对象
原型的写法更加清晰、更像面向对象编程的语法而已。
知识点：

1) class 声明类
2) constructor 定义构造函数初始化
3) extends 继承父类
4) super 调用父级构造方法
5) static 定义静态方法和属性,实例不能调用父类的静态成员、静态方法
6) 父类方法可以重写

```js
class U {
    a = 1
    b = 2
}
var u new U();
console.log(u)

// 可以直接修改属性值
u.a = 3;
// u: { a: 3, b: 2}
```

![image.png](images/ES6/es6021.png)

### Class中的get、set  但是修改name属性后，打印的还是yolo，set 返回的就是yolo

```javascript
class Person {
    get name() {
        console.log("名字属性被读取了");
        return 'yolo';
    }

    set name(newVal) {
        console.log('名字属性被修改了');
    }
}
//实例化对象
let p = new Person();
console.log(p.name);
// 名字属性被读取了  yolo

p.name = 'zph';  // 名字属性被修改了
console.log(p.name)  // 名字属性被读取了 yolo
```

```javascript
class Person{
    //公有属性
    name;
    //私有属性
    #age;
    #weight;
    //构造方法
    constructor(name, age, weight){
        this.name = name;
        this.#age = age;
        this.#weight = weight;
    }

    intro(){
        console.log(this.name);
        console.log(this.#age);
        console.log(this.#weight);
    }
}

//实例化
const girl = new Person('晓红', 18, '45kg');

// console.log(girl.name);
// console.log(girl.#age);  // 类的私有属性 无法在 类的外面获取  报错！！！！！
// console.log(girl.#weight); // 类的私有属性 无法在 类的外面获取  报错！！！！！

girl.intro(); //可以输出！！！  通过定义类的方法  在内部获取  最后出去
```

## 16.Number

**Number.EPSILON** 是 JavaScript 表示的最小精(espilon)

```javascript
// Number.EPSILON 是 JavaScript 表示的最小精度
// EPSILON 属性的值接近于 2.2204460492503130808472633361816E-16
function equal(a, b){
     if(Math.abs(a-b) < Number.EPSILON){
         return true;
     }else{
         return false;
     }
 }
 console.log(0.1 + 0.2 === 0.3);    false
 console.log(equal(0.1 + 0.2, 0.3))  true

//1. 二进制和八进制
 let b = 0b1010;  // 二进制 10   0b
 let o = 0o777;   // 八进制 511  0o
 let d = 100;  
 let x = 0xff;    // 16进制 255  0x

//2. Number.isFinite  检测一个数值是否为有限数
 console.log(Number.isFinite(100));   true
 console.log(Number.isFinite(100/0));  false
 console.log(Number.isFinite(Infinity)); false

//3. Number.isNaN 检测一个数值是否为 NaN 
 console.log(Number.isNaN(123));  false

//4. Number.parseInt Number.parseFloat字符串转整数
 console.log(Number.parseInt('5201314love'));  5201314
 console.log(Number.parseFloat('3.1415926神奇'));  3.1415926

//5. Number.isInteger 判断一个数是否为整数
 console.log(Number.isInteger(5));  true
 console.log(Number.isInteger(2.5));  false

//6. Math.trunc 将数字的小数部分抹掉  
 console.log(Math.trunc(3.5));  // 3

//7. Math.sign 判断一个数到底为正数 负数 还是零
console.log(Math.sign(100));  1
console.log(Math.sign(0));  0 
console.log(Math.sign(-20000)); -1

// toFixed
(2.55555).toFixed(1)  保留1位有效数字
```

```javascript
// 1. Object.is 判断两个值是否完全相等 
console.log(Object.is(120, 120));// 类似于 === 
console.log(Object.is(NaN, NaN));// true 
console.log(NaN === NaN);// false 

// 2. Object.assign 对象的合并
const config1 = {
    host: 'localhost',
    port: 8000,
    name: 'root',
    pass: 'root',
};
const config2 = {
    host: 'http://127.0.0.1',
    port: 3000,
    name: 'yolo',
    pass: 'yolo',
    test: 'test'
}
// 同名属性，后边的会把前面的覆盖，如config2会覆盖config1的同名属性
console.log(Object.assign(config1, config2));

// 3. Object.setPrototypeOf 设置原型对象  Object.getPrototypeof
const school = {
    name: 'hqu'
}
const cities = {
    xiaoqu: ['北京','上海','深圳']
}
Object.setPrototypeOf(school, cities); // 设置school的原型位cities
console.log(Object.getPrototypeOf(school));
console.log(school);

对象属性的描述对象
console.log(Object.getOwnPropertyDescriptors(school));
```

## 17.babel转换ES6语法，并打包

```javascript
<!-- 
   1. 安装工具 npm i babel-cli babel-preset-env browserify(webpack) -D   (开发依赖)

		// 将 src/js 文件夹下的所有js文件 转化为ES5语法  输出到dist/js 文件夹下
   2. 编译 npx babel src/js -d dist/js --presets=babel-preset-env
		// 将app.js进行打包
   3. 打包 npx browserify dist/js/app.js -o dist/bundle.js
-->
```

## 18.ES8 async/await

### async 函数

1. async 函数的返回值为 promise 对象
2. promise 对象的结果由 async 函数执行的返回值决定

### await 表达式

1. await 必须写在 async 函数中
2. await 右侧的表达式一般为 promise 对象
3. await 返回的是 promise 成功的值
4. await 的 promise 失败了, 就会抛出异常, 需要通过 try...catch 捕获处理

## 19.正则扩展-命名捕获分组

?`<name>` 问号，尖括号，属性名

```javascript
//声明一个字符串
let str = '<a href="http://www.baidu.com">百度</a>';
// //提取 url 与 『标签文本』
const reg = /<a href="(.*)">(.*)<\/a>/;
// //执行
const result = reg.exec(str);
console.log(result);
```

![image.png](images/ES6/es6019.png)

```javascript
//声明一个字符串
let str = '<a href="http://www.baidu.com">百度</a>';
// //提取 url 与 『标签文本』
const reg = /<a href="(?<url>.*)">(?<text>.*)<\/a>/;
// //执行
const result = reg.exec(str);
console.log(result);
console.log(result.groups.url);
console.log(result.groups.text);
```

![image.png](images/ES6/es6020.png)

### 正向断言和反向断言

```javascript
        //声明字符串
        let str = 'JS5211314你知道么555啦啦啦';
        //正向断言  判断后面是不是 啦  是的话匹配啦 前面的数字555
        const reg = /\d+(?=啦)/;  
        const result = reg.exec(str);
        console.log(result);
        //反向断言  判断前面是不是 么  是的话匹配 么后面的数字555
        const reg = /(?<=么)\d+/; // 根据前面去判断
        const result = reg.exec(str);
        console.log(result);
```

## 20.可选链操作符

```javascript
//可选链操作符  ?.
  function main(config) {
      // const dbHost = config && config.db && config.db.host;  
      const dbHost = config?.db?.host; // 等价上面的一句

      console.log(dbHost);
  }

  main({
      db: {
          host: '192.168.1.100',
          username: 'root'
      },
      cache: {
          host: '192.168.1.200',
          username: 'admin'
      }
  })
// 192.168.1.100
```

### 20.忽略环境的全局对象globalThis(在node、浏览器环境都指向全局对象)
