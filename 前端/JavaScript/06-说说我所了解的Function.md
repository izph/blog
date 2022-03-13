---
title: 记录我所了解的JS函数
date: 2022-01-14 20:53:16
permalink: /前端/JavaScript/记录我所了解的JS函数
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# 记录我所了解的JS函数

1. JavaScript函数内置了一部分属性，如name为函数名，length为函数参数长度，caller则表示调用函数的对象，即函数的执行环境，如果函数的执行环境为window，则返回null。
2. 函数的声明(function a(){}) 和 函数表达式，普通函数没有写返回值，默认返回undefined

```javascript
// 这是一个匿名函数，内部可以调用test_inner()
var test = function test_inner(){
		console.log(1);
  	test_inner();
}
// 外部调用，引用报错Uncaught ReferenceError：test_inner is not define
test_inner(); 

// 函数字面量，匿名函数表达式，一个匿名函数
var test = function(){} // test是一个变量名
  
// 箭头函数也是一个匿名函数，test是一个变量名
var test = () => {}
```

3. 函数表达式变量提升 和 普通变量声明一样(var)

```javascript
helper(); // 报错
var helper = function () {
    console.log(1);
}
// GO & AO 作用域
// var helper; 
// helper(); // 此时的 helper 是undefined  所以报错
// helper = function() {
//     console.log(1);
//}
```

4. 同名的两个函数声明，后面覆盖前面，同名的函数和变量声明，函数声明优先

```javascript
console.log(a) // 最后的声明为函数声明， 因此a此时为函数体，打印函数a
a(); // 执行 a 函数，输出10
var a = 3; // 3 赋给a
function a() {  
    console.log(10)
};
console.log(a) // 3
a = 6; // 6赋给a，不是一个函数，故下方执行throw error
a(); // throw error


function foo() {
    console.log('foo1');
}
foo();  // foo2

function foo() {
    console.log('foo2');
}
foo(); // foo2
// 打印的结果却是两个 foo2，同名的两个函数声明，后面覆盖前面
// foo()调用了两次
```

```javascript
function test(a) {
    console.log(a);
    var a = 1;
    console.log(a);
    function a(){}
    console.log(a);
    var b = function(){}
    console.log(b);
} 
test(2);

// 结果解释
f a(){} // 传入2给参数a，但是由于函数和变量的提升，改变了参数a的值，函数和变量提升同名时，函数优先
1
1
f (){}  // 为什么是匿名函数？ var b = function(){}，函数字面量就是一个匿名函数
```
## 记录函数被调用的次数
给函数定义一个count属性，用来跟踪函数的调用次数
```javascript
// 1、 函数属性计数
function test() {
  console.log("Hi");
  // 计算调用次数
  test.count++;
}
test.count = 0;  // 初始值
test(); // Hi
test(); // Hi
test(); // Hi
console.log(test.count); // 3


// 2、 闭包
function makeCounter() {
  function counter() {
    counter.count++;
  };
  counter.count = 0;

  return counter;
}
let counter = makeCounter();
counter();
counter();
counter();
console.log(counter.count) // 3


// 属性是绑定到函数的，很容易访问到这个属性
counter.count = 10;       // 将 count 设置为 10
console.log(counter());   // 输出10  加完之后就是11

```
## 构造函数
### 1、new构造函数时会发生下面这几步
1. 首先创建一个新对象，这个新对象的__proto__属性指向构造函数的prototype属性
2. 此时构造函数执行环境的this指向这个新对象
3. 执行构造函数中的代码，一般是通过this给新对象添加新的成员属性或方法。
4. 最后返回这个新对象。
```javascript
function Test() {
  console.log(JSON.stringify(this));
  console.log(this.__proto__.constructor === Test);
  this.name = 'izph';
  this.age = 18;
  console.log(JSON.stringify(this));
}
var a = new Test();
// Chrome控制台会输出以下内容
// {}
// true
// {"name": "izph","age": 18}
```
### 2、实现一个new
实现一个new也就意味着不能用new关键字，那么要完成这么一系列步骤，当然是通过函数实现了
```javascript
// func是构造函数，...args是需要传给构造函数的参数
function myNew(func, ...args) {
  	// 创建一个空对象，并且指定原型为func.prototype
    var obj = {};
    obj.__proto__ = func.prototype;
  	// new构造函数时要执行函数，同时指定this
    func.call(obj, ...args);
   // 最后return这个对象
    return obj;
}

// func是构造函数，...args是需要传给构造函数的参数
function myNew(func, ...args) {
  // 创建一个空对象，并且指定原型为func.prototype
  var obj = Object.create(func.prototype);
  // new构造函数时要执行函数，同时指定this
  func.call(obj, ...args);
  // 最后return这个对象
  return obj;
}

// 验证myNew
function Test(name, age) {
  this.name = name;
  this.age = age;
}
myNew(Test, '小明', 18);
// Chrome控制台会输出以下内容
// Test {name: "小明", age: 18}
```
```javascript
//  new 构造函数版
function Car(color, brand){
  	// new 的时候, 
  	// this:{
		// 		__proto__: Car.prototype
		// }
		this.color = color;
  	this.brand = brand;
  	this.value = 100;
  	// return this;
    // 当我们return一个普通类型数据时，不会影响结果，依然会返回new出来的这个新对象。返回原始类型不生效
  	// return的是引用类型的时候，会返回这个引用类型，如{}, [], function(){}
}
Car.prototype.value = 200;
var car = new Car("red", "宝马");
console.log(car.value) // 100, car实例查找的顺序是 构造函数 -> 构造函数的原型, 
// 如果构造函数没有，则通过car.__proto__属性(Car.prototype)去原型对象查找！！！
// __proto__只是一个属性，用来指向原型对象，只在浏览器中使用
console.log(car.__proto__.value) // 200， car.__proto__指向 Car.prototype

delete car.value;  // 只能删除实例 构造函数Car的value，Car.prototype原型对象上的无法删除
car.value = 300; // 只能修改构造函数Car的value，Car.prototype原型对象上的无法修改
Car.prototype = {
		constructor: Car,
  	...
}

// 如果是 实例化car2 之后 再 修改 Car.prototype
// 此时 car2的__proto__属性存的是没修改之前的:{ time: 3}
Car.prototype.time = 3;
var car2 = new Car("black", "奥迪");
Car.prototype = {  // 重写
		time: 4
}
console.log(car2.time) // 3, 也就是说 new实例化对象的时候  就指定了
// __proto__:{
// 	time: 3,
//   constructor: Car
// }, 之后修改不受影响

```
## 构造函数的继承
```javascript
// 原型继承
// 说明：将子类的原型挂载到父类上；
// 优点： 父类构造函数和原型上的 方法可以复用
// 缺点：1. 子类 new 出来的实例，父类的所有引用属性会被所有子类共享，更改一个子类的引用属性，其他子类会受影响.
//      父类的基本数据类型 也会被共享， 但是 更改一个子类的基本数据属性，其他子类  不受影响
//  2.子类型实例不能给父类型构造函数传参
function Parent() {
    this.isShow = true
    this.info = {
        name: "yhd",
        age: 18,
    };
}
Parent.prototype.getInfo = function () {
    console.log(this.info);
    console.log(this.isShow); // true
}
function Child() { };
Child.prototype = new Parent();
let Child1 = new Child();
Child1.info.gender = "男";
Child1.getInfo();  // {name: "yhd", age: 18, gender: "男"}
let child2 = new Child();
child2.getInfo();  // {name: "yhd", age: 18, gender: "男"}
child2.isShow = false;
console.log(child1.isShow); // true
console.log(child2.isShow); // false
// 构造函数继承（call&apply）
// 说明：直接利用call或者apply方法将父类构造函数的this绑定为子类构造函数的this就可以；
// 优点： 可以在子类构造函数中向父类传参数， 父类的引用属性不会被共享。修改子类的引用属性，其他子类不影响
// 缺点：无法继承  父类 原型链上的属性与方法（不能访问Parent2.prototype上定义的方法）；只能继承父类构函数的属性
function Parent2() {
    this.name = 'parent2'
}
Parent2.prototype.say = function () {
    console.log(this.name)
}
function Child2() {
    Parent2.call(this)  // 构造函数继承核心代码
}
let c2 = new Child2();
console.log(c2)
// 父类的方法可以复用
// 可以在Child构造函数中向Parent构造函数中传参
// 父类构造函数中的引用属性不会被共享

// 组合继承
// 父类的方法可以复用
// 可以在Child构造函数中向Parent构造函数中传参
// 父类构造函数中的引用属性不会被共享
function Parent3() {
  this.name = 'parent3'
}
Parent3.prototype.say = function () {
  console.log(this.name)
}

function Child3() {
  Parent3.call(this)
}
Child3.prototype = new Parent3();
Child3.prototype.constructor = Child3;


// 4 寄生组合继承
// 说明：解决组合继承重复属性的问题，直接将子类的原型等于父类的原型，或者是用Object.create继承原型但不执行父类构造函数；
// 注意处理子类实例的 constructor 指向问题，new Parent1()也有这个问题；

// 优点：

// 只调用一次父类构造函数
// Child可以向Parent传参
// 父类方法可以复用
// 父类的引用属性不会被共享
// 寄生式组合继承可以算是引用类型继承的最佳模式
function Parent4() {
  this.name = 'parent4'
}
Parent4.prototype.say = function () {
  console.log(this.name)
}
function Child4() {
  Parent4.call(this)
}
//父类的显示原型  赋值给 子类的显示原型
// 或 Child4.prototype = Object.create(Parent4.prototype)
Child4.prototype = Parent4.prototype;
// Child4.prototype.test = 'test'; //缺陷： Parent4.prototype 也会被修改
// 解决: 定义一个中间的构造函数，将这个 构造函数的实例 赋值给 Child4.prototype

//修复重写子类原型导致子类constructor属性被修改
Child4.prototype.constructor = Child4;
let child4_1 = new Child4();
let child4_2 = new Child4();

// ES6
class Parent5 {
  constructor() {
    this.name = 'Parent5'
  }
  say() {
    console.log(this.name)
  }
}
class Child5 extends Parent5 {
  constructor() {
    //通过super()调用父类构造函数
    super()
    this.type = "Child5";
  }
}
```