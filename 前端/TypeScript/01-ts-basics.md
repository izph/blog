---
title: TS基础语法（笔记）
date: 2021-12-26 17:12:16
permalink: /前端/TypeScript/tsbasics
categories:
  - 前端
  - TypeScript
tags:
  - 前端
  - TypeScript
---

### 1.ts基础
```javascript
// npm install -g typescript
// 将ts文件转化为js文件：tsc hello.ts => hello.js
// npm install -g ts-node 
// 直接运行ts文件: ts-node hello.ts
// 运行ts-node hello.ts报错：consol.log(add(1,2))  
// 解决: npm install -g tslib @types/node


// 错误提示：找不到模块 “xxx” 或其相应的类型声明
// 在项目中 npm i @types/node --D

// 确定的类型 方法提示
let firstName: string = 'yolo'
let age: number = 18
let isDone: boolean = false
let u: undefined = undefined
let n: null = null
// 默认情况下 null 和 undefined 是所有类型的子类型。 就是说你可以把 null 和 undefined 赋值给其他类型。
// 在tsconfig.json指定了 "strictNullChecks":true ，null 和 undefined 只能赋值给 void 和它们各自的类型。
let num1: number = undefined
let num2: number = null
console.log(num1, num2) // undefined null

// 任意类型 没有方法提示
let anyValue: any = 4

// 混合类型  用中竖线 | 隔开
let numberOrString: number | string = 'numberOrString';

// 数组: 数组存储的类型 []
let numOfArr: number[] = [1, 2, 3, 4]  // 只能存储数组
let arr2: Array<string> = ['1','2','3']

// 数组联合类型
let arr3: (number|string)[] = [1, 2, 'str', 'hello']

// interface是接口  数组里面存储对象
interface Arrobj{
    name:string,
    age:number
}
let arr3:Arrobj[]=[{name:'jimmy',age:22}]


// 数组: 任意类型 []
let anyOfArr: any[] = [1, 'yolo', false]  // 只能存储数组
// ts函数中的argument 不能使用数组的方法
// 变量其他类型 如HTML、NodeList也支持

// 元组 一定数据类型的数组，前后要一一对应，把类型写在数组中
let numAndArr: [number, string] = [18, 'yolo']  // 第一个必须是数字，第二个是字符串，前后相对应
let x: [string, number]; 
// 类型必须匹配且个数必须为2

x = ['hello', 10]; // OK 
x = ['hello', 10,10]; // Error 
x = [10, 'hello']; // Error
// 注意，元组类型只能表示一个已知元素数量和类型的数组，长度已指定，越界访问会提示错误。如果一个数组中可能有多种类型，数量和类型都不确定，那就直接any[]

// 元组也是支持解构赋值的 let x: [string, number]= ['hello', 10]; 
const [str, num] = x; 
// 在解构赋值时，如果解构数组元素的个数是不能超过元组中元素的个数，否则也会出现错误
const [str, num, id] = x;  // 报错

// 元组类型的可选元素，通过 ? 号来声明元组类型的可选元素，具体的示例如下：
let optionalTuple: [string, boolean?];
// 只读元组，修改会发生报错
const point: readonly [number, number] = [10, 20];

// Interface:定义对象的类型，对类（class）进行抽象
interface Person {  // 属性之间用分号(;)结束
    name: string;
    age: number;
    sex?: string; // ? 问号表示可选属性
    readonly id: number; // 只读属性，不能在修改
}
let yolo: Person = { // 属性要和Person一一对应
    id: 888,
    name: 'yolo',
    age: 18,
    sex: '男'
}

//  函数   注意点：可选参数后面不允许再出现必需参数
//  z? 表示可选参数   
function add(x: number, y: number, z?: number): number {
    return typeof z === "number" ? x + y + z : x + y;
}
add(1, 2)

// 函数表达式
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};

// 用接口定义函数类型   只能定义一个函数？
interface SearchFunc{
  (source: string, subString: string): boolean;
}


// z: number=10 也表示可选参数，你不传z，z默认为10
// function sum(x: number, y: number, z: number = 10): number{...}

// y? 表示可选参数, 后面参数不能加上确定参数，以下报错
// function sum(x: number, y?: number, z: number): number{}

// => number 表示函数的返回值为number
const add2: (x: number, y: number, z?: number) => number = add;

// 剩余参数
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}
let a = [];
push(a, 1, 2, 3);

// 联合类型
type combination = number|string|boolean;
```
### 2.ts-class和interface
```javascript
class Animal {
    name: string;
    // 默认是public name: string;
    // private 只能在该类访问，它的子类也不能访问
    // protected和private类似，但是它允许子类访问属性
    // readonly 只能读的属性，不能重新赋值
    // static静态属性 只能该类Animal直接调用 子类不能调用
    // 类中的定义和实例中的状态没有太大关系的时候，可以使用静态修饰符
    // 静态属性
    static categoies: string[] = ['mammal', 'bird']
    // 静态方法
    static isAnimal(a) {
        return a instanceof Animal
    }
    constructor(name: string) {
        this.name = name
    }
    run() {
        return `${this.name} is running`
    }
}
console.log(Animal.categoies)
const snake = new Animal('lily')
console.log(Animal.isAnimal(snake))


class Dog extends Animal {
    bark() {
        return `${this.name} is barking`
    }
}
const xiaobao = new Dog('xiaobao')
xiaobao.bark()


class Cat extends Animal {
    constructor(name) {
        super(name)
        console.log(this.name)
    }
    run() {
        // 调用父类方法  直接 用super.方法名  调用
        return 'Meow, ' + super.run()
    }
}
const maomao = new Cat('maomao')

// 接口interface ：当父类的方法不能满足于多个子类的时候，不同的子类可以有相同的特性
// 这时候把特性 抽出来封装为接口，并用implements继承接口

// Car和Cellphone需要调用共同方法switchRadio，所以将switchRadio方法定义在Radio接口中

interface Radio {
    switchRadio(): void; // switchRadio(参数可填):void  表示没有返回值
}

interface Battery {
    checkBatteryStatus();
}
interface RadioWithBattery extends Radio {
    // RadioWithBattery 继承了 Radio，就有了Radio上的属性和方法
    checkBatteryStatus();
}
class Car implements Radio {
    switchRadio() {

    }
}

class Cellphone implements Radio {
    switchRadio() {

    }
}
// MyCellphone 实现 RadioWithBattery
class MyCellphone implements RadioWithBattery {
    switchRadio() {

    }
    checkBatteryStatus() {

    }
}
```
### 3.枚举enum
```javascript
// 枚举的类型有两种：
// 一种是常量类型 用const number
// 一种是计算类型 compute number
const enum Word {  // 常量枚举用const修饰  
  A,
  B,
  C,
  D,
}
// 枚举值默认从0开始 
// 如 Word.A 为 0, Word.B 为1, Word.C 为2, Word.D 为3。
// 也可以把 枚举看成一个数组：Word[0] => A  Word[1] => B
// 也可以手动赋值 A=10，则B会为11，C为12

// 字符串枚举
const enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
const value = 'UP'
// ts编译成js后：Direction.Up会被直接编译成'UP'显示出来
if (value === Direction.Up) {
  console.log('go up!')
}
```
### 4.泛型generics
```javascript
// 泛型：generics定义函数、接口、类的时候，我们先不指定类型，而再使用的时候在指定类型 的一种特征
// 泛型很奇妙，它就像一个占位符，变量。
// <T> T可以换成其他的单词
// 解决了方法重载的问题
function echo<T>(arg: T): T {
    return arg
}
const resstr = echo('str') // <string>
const result = echo(true) // <boolean>

// tuple是一个元组
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]]
}
const result2 = swap(['string', 123]) // [number,string]

// 约束泛型  约束T[] 为一个数组
function echoWithArr<T>(arg: T[]): T[] {
    // 如果参数为(arg: T) 则arg.length报错，因为传入的arg不一定含有length
    console.log(arg.length)
    return arg
}
const arrs = echoWithArr([1, 2, 3])

interface IWithLength {
    length: number
}
// T extends IWithLength 约束传入的arg必须要有length属性
function echoWithLength<T extends IWithLength>(arg: T): T {
    console.log(arg.length)
    return arg
}

const str = echoWithLength('str') // str 含有length属性
const obj = echoWithLength({ length: 10, width: 10 }) // obj 含有length属性
const arr2 = echoWithLength([1, 2, 3]) // arr2 含有length属性
// const num = echoWithLength(12) 报错！！！

// 泛型在类中使用
class Queue<T> {
    private data = [];
    push(item: T) {
        return this.data.push(item)
    }
    pop(): T {
        return this.data.shift()
    }
}

const queue = new Queue<number>()
queue.push(1)
queue.push(2)
console.log(queue.pop().toFixed())
console.log(queue.pop().toFixed())

const queue2 = new Queue<string>()
queue2.push('str')
console.log(queue2.pop().length)

// 泛型在接口中使用
interface KeyPair<T, U> {
    key: T;
    value: U;
}
let kp1: KeyPair<number, string> = { key: 123, value: "str" }
let kp2: KeyPair<string, number> = { key: 'test', value: 123 }

// 泛型在数组也可以使用
let arr: number[] = [1, 2, 3]
// typescript 定义了一个 Array 接口interface
let arrTwo: Array<number> = [1, 2, 3]

// interface来描述一个 函数的类型
interface IPlus<T> {
    (a: T, b: T): T
}
function plus(a: number, b: number): number {
    return a + b;
}
function connect(a: string, b: string): string {
    return a + b
}
const a: IPlus<number> = plus
const b: IPlus<string> = connect
```
### 5.类型别名和类型断言
```javascript
// type aliases 类型别名
// 类型别名常用场景： 联合类型应用
type PlusType = (x: number, y: number) => number
function sum(x: number, y: number): number {
    return x + y
}
const sum2: PlusType = sum

type NameResolver = () => string  // 返回一个string
type NameOrResolver = string | NameResolver
// 传入的n是一个字符串或者函数类型，而且函数的返回结果是string
function getName(n: NameOrResolver): string {
    if (typeof n === 'string') {
        return n
    } else {
        return n()
    }
}

// type assertion 类型断言 不是类型的强制转化
// 只能断言成 传入的参数类型：string | number
function getLength(input: string | number): number {
    // const str = input as String  // String是一个interface
    // if (str.length) {
    //   return str.length
    // } else {
    //   const number = input as Number  // Number是一个interface
    //   return number.toString().length
    // }
    if ((<string>input).length) {
        return (<string>input).length
    } else {
        return input.toString().length
    }
}
```
### 6.declare:声明文件
```javascript
// declare声明文件必须以：name.d.ts （.d.ts）为后缀的

// 新建tsconfig.json，写入以下
//  作用：告诉编译器，编译当前文件夹下的所有文件
{
    "include": [
        "**/*"
    ]
}

// 安装第三方库 @types/***  @types/jquery  
// 就可以直接在ts文件中使用
```
