---
title: 【JavaScript】Object对象常用方法
date: 2020-11-10 10:22:34
categories:
  - 前端
tags:
  - JavaScript
toc: true # 是否启用内容索引
comments: true
copyright: false
---
# Object.defineProperty

作用：劫持或者修改对象的属性

```javascript
Object.defineProperty(obj, attr, { options });
```

options参数包含如下属性：

- value：就是属性的值。
- writable：`<boolean>`，决定属性能否被赋值。
- enumerable：`<boolean>`，决定 for in 能否枚举该属性。
- configurable：`<boolean>`，决定该属性能否被删除或者改变特征值(key)。

# Object.hasOwnProperty

检测一个对象是否含有attr的属性，不会去原型查找，不包括原型链上的属性

```javascript
// 封装深拷贝时常用该方法
obj.hasOwnProperty(attr);
```

# Object.assgin

Object.assign只拷贝源对象的自身属性，不拷贝继承属性，也不拷贝不可枚举的属性(enumerable: false)。属性名为Symbol值的属性也会被Object.assign拷贝

```js
Object.assgin(target, obj1, obj2, ...);
```

- Object.assign方法的第一个参数是目标对象，后面的参数都是源对象。注意，如果目标对象与源对象有同名属性，或多个源对象有同名属性，后面的属性就会覆盖前面的属性。
- 单层是深拷贝，会开辟一个新的内存空间和地址；多层是浅拷贝，会引用原来的地址。
- 如果只有一个参数，Object.assign会直接返回该参数。如果该参数不是对象，就会先转成对象，然后返回。
- 由于undefined和 null无法转成对象，因此如果它们作为参数，就会报错。如果undefined和null不在首参数，就不会报错。

```js
object.assign(undefined)    //报错
object.assign(null) //报错

object.assign(obj, undefined)   //不报错
object.assign(obj, null)    // 不报错
```

- 其他类型的值（数值、字符串和布尔值）不在首参数，也不会报错。但是，除了字符串会以数组形式拷贝入目标对象外，其他值都不会产生效果。
  vl、v2、v3分别是字符串、布尔值和数值，结果只有字符串可以合并到目标对象中(以字符数组的形式)，数值和布尔值都会被忽略。

```js
let vl = 'abc';
let v2 = true;
let v3 = 10;
const obj = object.assign ({}, vl, v2, v3);
console.log(obj); // {"0": "a"，"l":"b"，"2": "c"}
```

## Object.assagin方法很多的用处

- 为对象添加属性

```js
// 1
class Point{
    constructor(x, y){
        Object.assign(this, x, y);
    }
}

// 2
Object.assign(someClass.prototype, {
    someMethod(arg1, arg2){},
    anotherMethod(arg1, arg2){},
    attr: 'hello'
})

// 2的等同于
someClass.prototype.someMethod = function(arg1, arg2){}
someClass.prototype.anotherMethod = function(arg1, arg2){}
someClass.prototype.attr = 'hello';
```

- 克隆对象

```js
function clone(origin){
    return Object.assign({}, origin);
}
// 采用这种方法克隆只能克隆原始对象自身的值，不能克隆它继承的值。

// 如果想要保持继承链，可以采用下面的代码。
function clone(origin){
    let originProto = Object.getPrototypeof(origin);
    return Object.assign(0bjObjectect.create(originProto), origin);
}
```

- 合并多个对象，将多个对象合并到某个对象。

```js
const merge = (target, ...sources) => 0bject.assign(target, ...sources);

// 如果希望合并后返回一个新对象，可以改写上面的函数，对一个空对象合并
const merge = (...sources) => Object.assign({}, ...sources);
```

# Object.keys

获取对象的key值，以数组存放返回

```javascript
// 使用
Object.keys(obj)

// 原理
function keys(object) {
    const result = [];
    for (let key in object){
        object.hasOwnProperty(key) && result.push(key);
    }
    return result;
}
```

# Object.values

获取对象的value值，以数组存放返回（不会遍历继承的属性，并且会过滤属性名为Symbol值的属性）

- 如果Object.values方法的参数是一个字符串，就会返回各个字符组成的一个数组。object.values('foo') => ['f', 'o', 'o']
- 如果参数不是对象，Object.values就会先将其转为对象。由于数值和布尔值的包装对象都不会为实例添加非继承的属性，因此Object.values会返回空数组。

```js
// 使用
Object.values(obj)

Object.values(42) //  []
Object.values(true) // []
```

# Object.entries

获取对象可枚举的[key, value]键值对，以数组存放返回

```js
for(let [key, value] in Object.entries(obj)){
    // 
}
```

## 实现entries

```js
function entries(obj){
    let arr = [];
    for(let key of Object.keys(obj)){
        arr.push([key, obj[key]]);
    }
    return arr;
}
```

# Object.getOwnPropertyNames

获取对象所有属性的key值，包括不可枚举属性，但是不包括Symbol属性

```js
const obj = {
  a: 1,
  b: 2
}
Object.getOwnPropertyNames(obj) // ['a', 'b']
```

# Object.getOwnPropertySymbols

获取一个对象所有Symbol属性

# Object.getOwnPropertyDescriptor

获取对象的数据属性描述

```javascript
const obj = { a: 1 };
obj.b = 2;
// a和b皆为数据属性
Object.getOwnPropertyDescriptor(obj, "a") 
// {value: 1, writable: true, enumerable: true, configurable: true}

Object.getOwnPropertyDescriptor(obj, "b") 
// {value: 2, writable: true, enumerable: true, configurable: true}
```

# Object.create

根据指定的原型创建实例对象，实例完全继承原型对象，原型可以是null。

```js
// 原型对象
const obj1 = {};

// 实例对象
const obj2 = Object.create(obj1);

obj2.__proto__ === obj1 // true
// Object.getPrototypeOf(obj2) === obj1
```

## 动手实现Object.create

```javascript
Object.create = function(prototype){
    function F(){};
    F.prototype = prototype;
    F.prototype.constructor = F;
    return new F();
}
```

# Object.getPrototypeOf

获取一个对象的原型

```javascript
// Object.getPrototypeOf(obj)
function F() {};
const f = new F();
Object.getPrototypeOf(f) === F.prototype // true
```

# Object.setPrototypeOf

为第一个参数对象设置原型，第二个参数是原型对象，

```js
Object.setPrototypeOf(obj, prototype);
```

# Object.isPrototypeOf

判断该对象是否为参数对象的原型

```js
function F(){};
const f = new F();
F.prototype.isPrototypeOf(f) // true
```

# Object.freeze

冻结的对象是只读的，不能修改、不能添加新的属性。

```js
Object.freeze(obj)
```

# 属性的可枚举性

对象的每个属性都有一个描述对象(Descriptor)，用来控制该属性的行为。Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。

```js
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
// { value: 123, writable: true, enumerable: true, configurable: true}
```

会忽略enumerable为false的属性的操作

- for...in循环: 只遍历对象自身的和继承的可枚举的属性。
- Object.keys(): 返回对象自身的所有可枚举的属性的键名。
- JSON.stringify(): 只串行化对象自身的可枚举的属性。
- Object.assign()，会忽略enumerable为 false的属性，只拷贝对象自身可枚举的属性。

只有for...in 会返回继承的属性。实际上，引入enumerable的最初目的就是让某些属性可以规避掉for..in操作。比如，对象原型的toString方法以及数组的length属性就通过这种手段避免被for...in遍历到。

```js
object.getOwnPropertyDescriptor(Object.prototype, 'toString').enumerablel //  false
object.getOwnPropertyDescriptor([], 'length').enumerable // false
```

另外，ES6规定，所有Class的原型的方法都是不可枚举的。

```js
0bject.getOwnPropertyDescriptor(class{ foo(){} }.prototype, 'foo').enumerable // false
// class中声明的发法是 挂载到prototype上的
```

尽量不要用for...in循环，而用Object.keys()代替。

# 属性的遍历

ES6一共有5种方法可以遍历对象的属性。

- (1) for...in
  for...in循环遍历对象自身的和继承的可枚举属性(不含Symbol属性)。
- (2)Object.keys(obj)
  Object.keys返回一个数组，包括对象自身的(不含继承的)所有可枚举属性(不含Symbol属性)。
- (3)Object.getOwnPropertyNames(obj)
  Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含Symbol属性，但是包括不可枚举属性)。
- (4)Object.getOwnPropertySymbols(obj)
  Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有Symbol属性。
- (5)Reflect.ownKeys(obj)
  Reflect.ownKeys返回一个数组，包含对象自身的所有属性，不管属性名是Symbol或字符串，也不管是否可枚举。

以上的5种方法遍历对象的属性遵守同样的属性遍历的次序规则:

- 首先遍历所有属性名为数值的属性，按照数字排序。
- 其次遍历所有属性名为字符串的属性，按照生成时间排序。
- 最后遍历所有属性名为Symbol值的属性，按照生成时间排序。

# 参考

- [MDN-Object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 《Node.js12 实战》
