---
title: ES6速记
date: 2021-02-26 17:09:12
permalink: /前端/JavaScript/ES6速记
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
### 1.let 关键字

let 关键字用来声明变量，使用 let 声明的变量有几个特点： `<br />`1) 不允许重复声明 `<br />`2) 块儿级作用域 `<br />`3) 不存在变量提升 `<br />`4) 不影响作用域链 `<br />`**应用场景：以后声明变量使用 let 就对了 **

### 2.2. const 关键字

const 关键字用来声明常量，const 声明有以下特点 `<br />`1) 声明必须赋初始值 `<br />`2) 标识符一般为大写 `<br />`3) 不允许重复声明 `<br />`4) 值不允许修改 `<br />`5) 块儿级作用域 `<br />`**注意: 对象属性修改和数组元素变化不会出发 const 错误 **`<br />`**应用场景：声明对象类型使用 const，非对象类型声明选择 let** `<br /><br />`

### 3.变量的解构赋值

**注意：频繁使用对象方法、数组元素，就可以使用解构赋值形式** `<br /><br />`

### 4.模板字符串

模板字符串（template string）是增强版的字符串，用反引号（`）标识，特点： `<br />```1) 字符串中可以出现换行符 <br />``2) 可以使用 ${xxx} 形式输出变量`<br />```<br />``

### 5.简化对象写法

ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法。这 `<br />`样的书写更加简洁。`<br /><br />`

### 6.箭头函数

箭头函数的注意点: `<br />`1) 如果形参只有一个，则小括号可以省略 `<br />`2) 函数体如果只有一条语句，则花括号可以省略，函数的返回值为该条语句的执行结果 `<br />`3) 箭头函数 this 指向声明时所在作用域下 this 的值 `<br />`4) 箭头函数不能作为构造函数实例化 `<br />`5) 不能使用 arguments `<br />`![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1640411395606-19c7280a-2786-47bd-bc60-b770e24ae348.png#clientId=ud9951a62-944d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=107&id=u7f84fd97&margin=%5Bobject%20Object%5D&name=image.png&originHeight=107&originWidth=395&originalType=binary&ratio=1&rotation=0&showTitle=false&size=5492&status=done&style=stroke&taskId=uf2ad38d9-7fff-421b-969a-1e23148cf40&title=&width=395) `<br />`![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1640411474686-cfdd16f6-5bb8-461a-b87f-68b02963c4f8.png#clientId=ud9951a62-944d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=348&id=u4d6b9bd0&margin=%5Bobject%20Object%5D&name=image.png&originHeight=348&originWidth=391&originalType=binary&ratio=1&rotation=0&showTitle=false&size=27185&status=done&style=stroke&taskId=u3285a844-acdb-4679-8c30-14e5433d968&title=&width=391) `<br />`**注意：箭头函数不会更改 this 指向，用来指定回调函数会非常合适** `<br /><br />`

### 7. rest 参数

ES6 引入 rest 参数，用于获取函数的实参，用来代替 arguments_，rest 参数必须是最后一个形参_`<br />`**注意：rest 参数非常适合不定个数参数函数的场景** `<br /><br />`

### 8. spread 扩展运算符

扩展运算符（spread）也是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列，对数组进行解包。`<br /><br />`

### 9.Symbol 基本使用

ES6 引入了一种新的原始数据类型 Symbol，表示独一无二的值。它是 `<br />`JavaScript 语言的第七种数据类型，是一种类似于字符串的数据类型。 `<br />`Symbol 特点 `<br />`1) Symbol 的值是唯一的，用来解决命名冲突的问题 `<br />`2) Symbol 值不能与其他数据进行运算 `<br />`![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1640411874313-92a94550-6522-4e78-96c3-e19ec260a3a1.png#clientId=ud9951a62-944d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=94&id=ub8a9a650&margin=%5Bobject%20Object%5D&name=image.png&originHeight=94&originWidth=473&originalType=binary&ratio=1&rotation=0&showTitle=false&size=6204&status=done&style=stroke&taskId=u039d1f15-9cf6-4431-a8fc-c4bc3e6059a&title=&width=473) `<br />`3) Symbol 定义 的 对象属 性 不能 使 用 for…in 循 环遍 历 ，但 是可 以 使 用 Reflect.ownKeys 来获取对象的所有键名

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

**注: 遇到唯一性的场景时要想到 Symbol，不能与其他数据进行运算** `<br />`

**Symbol.iterator** : 对象进行 for...of 循环时，会调用 Symbol.iterator 方法， 返回该对象的默认遍历器 `<br />`**Symbol创建对象属性**

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

![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630505523157-cc32a773-e5e1-47e0-82a2-750872a05a0d.png#clientId=u85c6cba4-56a1-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=158&id=u34e98e55&margin=%5Bobject%20Object%5D&name=image.png&originHeight=118&originWidth=221&originalType=binary&ratio=1&rotation=0&showTitle=false&size=4535&status=done&style=none&taskId=ue0802415-7db2-44a3-b01a-3c1a1659e72&title=&width=296) `<br />`![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630506272914-89a020c6-c338-49c1-854b-f05ddfb6593e.png#clientId=u8e3c4041-cb43-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=99&id=ud84b8ac0&margin=%5Bobject%20Object%5D&name=image.png&originHeight=99&originWidth=307&originalType=binary&ratio=1&rotation=0&showTitle=false&size=3155&status=done&style=none&taskId=u325f1624-cbad-4ed1-a813-d91cd6964bc&title=&width=307)

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

![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630505695673-6b551c8b-6d02-4d13-bae7-345ab24b0920.png#clientId=ueb902c9e-325f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=69&id=u2d2b2081&margin=%5Bobject%20Object%5D&name=image.png&originHeight=69&originWidth=390&originalType=binary&ratio=1&rotation=0&showTitle=false&size=4705&status=done&style=stroke&taskId=u3f04d7ad-ccfb-47f4-b8f4-ae4a7b115da&title=&width=390) `<br />`![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1640412452898-db70c6a9-1806-49b3-a4b1-9b70f5ef22b6.png#clientId=ud9951a62-944d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=231&id=u8e59a657&margin=%5Bobject%20Object%5D&name=image.png&originHeight=231&originWidth=232&originalType=binary&ratio=1&rotation=0&showTitle=false&size=10875&status=done&style=stroke&taskId=u2bf1e7c2-0e02-47d9-a60f-690fbb18842&title=&width=232)Symbol 定义 的 对象属 性 不能 使 用 for…in 循 环遍 历 `<br />`![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1640412591054-16f48404-932d-4ac6-9319-b54e10a3a9e0.png#clientId=ud9951a62-944d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=271&id=u52497eef&margin=%5Bobject%20Object%5D&name=image.png&originHeight=271&originWidth=340&originalType=binary&ratio=1&rotation=0&showTitle=false&size=16571&status=done&style=stroke&taskId=u284c9a12-84e1-4397-9c5d-786927844e6&title=&width=340)可 以 使 用 Reflect.ownKeys 来获取对象的所有键名

```javascript
console.log(person[sleep])
console.log(person[eat])
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630506185259-bbcce470-bbe0-4b4f-aa6d-2d99b9df4bae.png#clientId=u8e3c4041-cb43-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=105&id=ude9b7e7c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=105&originWidth=313&originalType=binary&ratio=1&rotation=0&showTitle=false&size=3348&status=done&style=none&taskId=u0a94a066-219c-461f-90f3-9ea30d568d4&title=&width=313)

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

### 10. 迭代器

遍历器（Iterator）就是一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署**Iterator 接口(Iterator 接口其实就是对象的一个属性，属性的名字就是Symbol.iterator)**，就可以完成遍历操作。(c语言，java，php，python都有迭代器)`<br />`1) ES6 创造了一种新的遍历命令 for...of 循环，**Iterator 接口主要供 for...of 消费** `<br />`2) **原生具备 iterator 接口的数据(可用 for...of 遍历) 含有Symbol（Symbol.iterator）属性，**`<br />`**Symbol（Symbol.iterator）: fun(){}函数** `<br />`1) Array `<br />`2) Arguments `<br />`3) Set `<br />`4) Map `<br />`5) String `<br />`6) TypedArray `<br />`7) NodeList `<br />`3) 工作原理 `<br />`a) 创建一个指针对象，指向当前数据结构的起始位置 `<br />`b) 第一次调用对象的 next 方法，指针自动指向数据结构的第一个成员 `<br />`c) 接下来不断调用 next 方法，指针一直往后移动，直到指向最后一个成员 `<br />`d) 每调用 next 方法返回一个包含 value 和 done 属性的对象

```javascript
const word = ['A','B','C','D'];
// 创建一个指针对象
let iterator = word[Symbol.iterator]();
```

console.log(word)`<br />`![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630507721115-a918cc51-07ec-4aad-b734-2d64fd088fa0.png#clientId=u2c2003a0-bdd4-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=157&id=uc43c63ac&margin=%5Bobject%20Object%5D&name=image.png&originHeight=157&originWidth=290&originalType=binary&ratio=1&rotation=0&showTitle=false&size=8497&status=done&style=none&taskId=u64c50dea-9de9-40c2-9d74-e02937b02b4&title=&width=290) `<br />`console.log(iterator)`<br />`![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630507642192-8deb1c65-50d6-4370-a4b8-0ea5250177e8.png#clientId=u2c2003a0-bdd4-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=79&id=ud5caac38&margin=%5Bobject%20Object%5D&name=image.png&originHeight=79&originWidth=349&originalType=binary&ratio=1&rotation=0&showTitle=false&size=5952&status=done&style=stroke&taskId=u267f64fd-cb1a-4ea7-ac33-9a61af210b0&title=&width=349)

```javascript
// 调用对象的next方法
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630507549256-634f2d06-a13a-4cbd-ace2-5de933f29e07.png#clientId=u2c2003a0-bdd4-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=350&id=u58250623&margin=%5Bobject%20Object%5D&name=image.png&originHeight=350&originWidth=219&originalType=binary&ratio=1&rotation=0&showTitle=false&size=12962&status=done&style=stroke&taskId=uc0c81d7e-94bf-45af-828c-da7bb2d97eb&title=&width=219) `<br />`**注: 需要自定义遍历数据的时候，要想到迭代器。**`<br /><br />`

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

![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630511275446-56919eb7-fba6-4c6b-89ba-7795aaed0da8.png#clientId=u1ae0b70b-f716-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=209&id=ud861a8f4&margin=%5Bobject%20Object%5D&name=image.png&originHeight=209&originWidth=364&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7792&status=done&style=stroke&taskId=u99befca2-b693-4a2b-bb06-06f23ffc413&title=&width=364) `<br /><br />`

### 11. 生成器——其实是一个迭代器对象   generator    async/await不是ES6提出的

生成器函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同 `<br />`**yield函数代码的分隔符、3个yield其实就把 gen函数分成 4个代码块**

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

结果如右：![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630512471923-3397bbe3-76d0-4de1-a846-cce3f64b11d0.png#clientId=uce3e2db1-3549-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=144&id=u6abc4442&margin=%5Bobject%20Object%5D&name=image.png&originHeight=144&originWidth=157&originalType=binary&ratio=1&rotation=0&showTitle=false&size=2714&status=done&style=stroke&taskId=u474fc429-a8b1-453a-940c-ebac97db185&title=&width=157) `<br />`
`<br />`**生成器传参** `<br />`**next也是可以传参，参数将作为上一个yield语句的返回结果** `<br />`**next第二次调用的参数，将作为第一次yield的返回结果**

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

![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630512976128-906d4ec6-3852-4e0b-b588-db0c22b20b8b.png#clientId=uce3e2db1-3549-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=175&id=uf6956004&margin=%5Bobject%20Object%5D&name=image.png&originHeight=175&originWidth=267&originalType=binary&ratio=1&rotation=0&showTitle=false&size=6965&status=done&style=stroke&taskId=u83cd5901-0cc0-4969-bc2b-beead7745e1&title=&width=267) `<br />`1s 后控制台输出 111 ，然后2s后输出 222，然后3s后输出 333 ，一共需要6s。

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

![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630513585135-f0013853-c86d-42fa-a3e4-36edc638badf.png#clientId=u39edf212-8cf1-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=67&id=u04867bbd&margin=%5Bobject%20Object%5D&name=image.png&originHeight=67&originWidth=89&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1118&status=done&style=stroke&taskId=ubddae811-95e0-4efa-88c6-1bd53f2830a&title=&width=89)

### 12.Promise

##### promise读取文件

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

##### promise封装AJAX

AJAX的open方法的第三个参数是boolean值   布尔值，默认是true 异步，设置为false是同步。

- boolean 取值为“true” 的时候，服务器的请求是异步的，也就是脚本执行send()方法后不等待服务器的执行结果，继续执行脚本代码 ；
- beelean取值为“false”的时候，服务器的请求是同步的 ， 也就是脚本执行send() 后等待服务器的执行结果，若在等待过程中超时，则不再等待，继续执行后面的脚本代码

0：请求未初始化(还没有调用open())`<br />`1：请求已经建立，但是还没有发送(还没有调用send())`<br />`2：请求已经发送 `<br />`3：请求正在处理中，通常响应中已经有部分数据可以用了 `<br />`4：响应已经完成，可以获取并使用服务器的响应了

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

##### promise读取多个文件

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

![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630680060541-ff90fac2-a0ef-4ca7-b61e-d0bb4cee59e7.png#clientId=u6f36a8bb-6522-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=135&id=ub8714b91&margin=%5Bobject%20Object%5D&name=image.png&originHeight=135&originWidth=394&originalType=binary&ratio=1&rotation=0&showTitle=false&size=8982&status=done&style=none&taskId=u64a891a8-e58b-403d-abee-c8bdbcdd2e8&title=&width=394)

### 13.Set集合

ES6 提供了新的数据结构 Set（集合）。它类似于数组，**但成员的值都是唯 **`<br />`**一的，不存在重复的元素，**集合实现了 iterator 接口，所以可以使用『扩展运算符』和『for…of…』进行遍历，集合的属性和方法： `<br />`1) size 返回集合的元素个数 `<br />`2) add 增加一个新元素，返回当前集合 `<br />`3) delete 删除元素，返回 boolean 值 `<br />`4) has 检测集合中是否包含某个元素，返回 boolean 值 `<br />`5) clear 清空集合，返回 undefined

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

![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630593337262-e37ebd92-f13b-4b44-8bfe-7ca5e30f3d0b.png#clientId=u124a6be4-9701-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=135&id=u3705712f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=135&originWidth=334&originalType=binary&ratio=1&rotation=0&showTitle=false&size=5892&status=done&style=none&taskId=ub3cacf36-b649-4b04-ba6f-9ca4da28628&title=&width=334)

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

### 13.Map集合

```
    ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合。**但是“键” **<br />**的范围不限于字符串，各种类型的值（包括对象）都可以当作键。**Map 也实现了 <br />iterator 接口，所以可以使用『扩展运算符』和『for…of…』进行遍历。Map 的属 <br />性和方法： <br />1) map.size  返回 Map 的元素个数 <br />2) map.set(key,value)   增加一个新元素，返回当前 Map <br />3) map.get(key)   返回键名对象的键值 <br />4) map.has()   检测 Map 中是否包含某个元素，返回 boolean 值 <br />5) map.clear()  清空集合，返回 undefined<br />6) map.delete(key)  删除集合元素<br />7) map遍历     for(let v of m){ console.log(v)}
```

```javascript
//创建 Map  
// const m = new Map(Object.entries(obj));
```

### 14.JS的Class

ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念，作为对 `<br />`象的模板。通过 class 关键字，可以定义类。基本上，ES6 的 class 可以看作只是 `<br />`一个语法糖，它的绝大部分功能，ES5 都可以做到，新的 class 写法只是让对象 `<br />`原型的写法更加清晰、更像面向对象编程的语法而已。 `<br />`知识点： `<br />`1) class 声明类 `<br />`2) constructor 定义构造函数初始化 `<br />`3) extends 继承父类 `<br />`4) super 调用父级构造方法 `<br />`**5) static 定义静态方法和属性 **`<br />`**实例不能调用父类的静态成员、静态方法** `<br />`6) 父类方法可以重写

#### Class中的get、set  但是修改name属性后，打印的还是yolo，set 返回的就是yolo

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

### 15.Number

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

### 16.babel转换ES6语法，并打包

```javascript
<!-- 
   1. 安装工具 npm i babel-cli babel-preset-env browserify(webpack) -D   (开发依赖)

		// 将 src/js 文件夹下的所有js文件 转化为ES5语法  输出到dist/js 文件夹下
   2. 编译 npx babel src/js -d dist/js --presets=babel-preset-env
		// 将app.js进行打包
   3. 打包 npx browserify dist/js/app.js -o dist/bundle.js
-->
```

### 17.ES8 async/await

**17.1.async 函数 **`<br />`1. async 函数的返回值为 promise 对象， `<br />`2. promise 对象的结果由 async 函数执行的返回值决定 `<br />`**17.2.await 表达式 **`<br />`**1. await 必须写在 async 函数中** `<br />`**2. await 右侧的表达式一般为 promise 对象 **`<br />`**3. await 返回的是 promise 成功的值 **`<br />`**4. await 的 promise 失败了, 就会抛出异常, 需要通过 try...catch 捕获处理**

### 18.正则扩展-命名捕获分组   ?`<name>`   问号，尖括号，属性名

```javascript
//声明一个字符串
let str = '<a href="http://www.yonyou.com">用友网络科技</a>';
// //提取 url 与 『标签文本』
const reg = /<a href="(.*)">(.*)<\/a>/;
// //执行
const result = reg.exec(str);
console.log(result);
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630678376701-ba8c372f-071c-41e8-b76c-e1c448d50683.png#clientId=u642ccf32-0942-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=153&id=ubda1d1f1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=153&originWidth=446&originalType=binary&ratio=1&rotation=0&showTitle=false&size=11755&status=done&style=none&taskId=ub997c17d-43ad-4830-a61d-051068a8afe&title=&width=446)

```javascript
//声明一个字符串
let str = '<a href="http://www.yonyou.com">用友网络科技</a>';
// //提取 url 与 『标签文本』
const reg = /<a href="(?<url>.*)">(?<text>.*)<\/a>/;
// //执行
const result = reg.exec(str);
console.log(result);
console.log(result.groups.url);
console.log(result.groups.text);
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/12755606/1630678553490-aafa5290-b2ca-4248-a1e4-51e0eed02c59.png#clientId=u642ccf32-0942-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=184&id=udfb5e891&margin=%5Bobject%20Object%5D&name=image.png&originHeight=184&originWidth=445&originalType=binary&ratio=1&rotation=0&showTitle=false&size=13785&status=done&style=none&taskId=ue823c9ad-b253-4921-a9ad-c577c7fa966&title=&width=445)

#### 正向断言和反向断言

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

### 19.可选链操作符

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

### 20.忽略环境的全局对象globalThis(在node，浏览器环境都指向全局对象)
