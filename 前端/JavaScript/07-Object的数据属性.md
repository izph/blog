---
title: Object的数据属性
date: 2022-01-18 20:53:16
permalink: /前端/JavaScript/Object的数据属性
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# Object的数据属性

## 一、数据属性

- value：就是属性的值。
- writable：决定属性能否被赋值。
- enumerable：决定 for in 能否枚举该属性。
- configurable：决定该属性能否被删除或者改变特征值(key)。

```javascript
Object.defineProperty(obj, attr, {})
```

## 二、访问器（getter/setter）属性

- getter：函数或 undefined，在取属性值时被调用。
- setter：函数或 undefined，在设置属性值时被调用。
- enumerable：决定 for in 能否枚举该属性。
- configurable：决定该属性能否被删除或者改变特征值

## Object.defineProperty

```javascript
Object.defineProperty =  function(target, key, descriptor) {
    if (descriptor.value){
        target[key] = descriptor.value;
    }else {
        descriptor.get && target.__defineGetter__(key, descriptor.get);
        descriptor.set && target.__defineSetter__(key, descriptor.set);
    }
    return target;
}
```
## Object.assgin
Object.assgin({}, obj) 和 扩展运算符(...)一样是单层深拷贝, 多层浅拷贝。
单层是深拷贝，会开辟一个新的内存空间和地址。
多层是浅拷贝，会引用原来的地址。
## Object.keys
获取对象的key值，以数组存放返回

```javascript
function keys(object) {
    var result = [];
    for (key in object){
        object.hasOwnProperty(key) && result.push(key);
    }
    return result;
}
```
## Object.values
获取对象的value值，以数组存放返回
## Object.entries
获取对象的[key, value]值，以数组存放返回
## Object.getOwnPropertyDescriptor
获取对象的数据属性描述
```javascript
var o = { a: 1 };
o.b = 2;
//a和b皆为数据属性
Object.getOwnPropertyDescriptor(o,"a") 
// {value: 1, writable: true, enumerable: true, configurable: true}
Object.getOwnPropertyDescriptor(o,"b") 
// {value: 2, writable: true, enumerable: true, configurable: true}
```
## Object.create
根据指定的原型创建新对象，原型可以是null
### 手动实现Object.create
```javascript
Object.create = function(prototype){
    var cls = function(){};
    cls.prototype = prototype;
    cls.prototype.constructor = cls;
    return new cls();
}
```
## Object.getPrototypeOf
获取一个对象的原型
## Object.setPrototypeOf
设置一个对象的原型
## Object.freeze
Object.freeze(obj)，冻结的对象是只读的。不能修改、不能添加新的属性。