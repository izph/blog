---
title: 手写TS工具类
date: 2021-12-26 17:12:16
permalink: /前端/TypeScript/tstoolclass
categories:
  - 前端
  - TypeScript
tags:
  - 前端
  - TypeScript
---

## myPartial
myPartial<T> 将类型的属性变成可选，只支持处理第一层的属性
```tsx
type myPartial<T> = {
		[key in keyof T]?: T[key]
}
```
## myDeepPartial
myDeepPartial<T> 将类型的属性变成可选，只支持**多**层的属性
```tsx
type myDeepPartial<T> = {
		[key in keyof T]?: T[key] extends object
  ? myDeepPartial<T[key]> 
  : T[key]
}
```
## myRequired
myRequired将类型的属性变成必选
```tsx
type myRequired<T> = {
		[key in keyof T]-?: T[key]
}
```
## myReadonly
myReadonly<T> 的作用是将某个类型所有属性变为只读属性，也就意味着这些属性不能被重新赋值。
```tsx
type myReadonly<T> = {
	readonly	[key in keyof T]: T[key]
}
```
## myPick（挑选）
myPick 从某个类型中挑出一些属性出来
```tsx
type myPick<T, K extends keyof T> = {
	[key in K]: T[key]
}
```
## myRecord（转化）
myRecord<K extends keyof any, T> 的作用是将 K 中所有的属性的值转化为 T 类型。
```tsx
type myRecord<K extends keyof any, T> = {
		[key in K]: T
}

interface PageInfo {
  title: string;
}

type Page = "home" | "about" | "contact";

const x: myRecord<Page, PageInfo> = {
  about: { title: "about" },
  contact: { title: "contact" },
  home: { title: "home" },
};
```
## myExclude（移除）
myExclude<T, U> 的作用是将某个类型中属于另一个的类型移除掉。
如果 T 能赋值给 U 类型的话，那么就会返回 never 类型，否则返回 T 类型。最终实现的效果就是将 T 中某些属于 U 的类型移除掉。
```tsx
type myExclude<T, U> = T extends U ? never : T;

// 例子
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | number

```
## myExtract（公共）
Extract<T, U> 的作用是从 T 中提取出 U。提取公共部分
```tsx
type myExtract<T, U> = T extends U ? T : never;

type T0 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T1 = Extract<string | number | (() => void), Function>; // () =>void

```
## myOmit（差集）
Omit<T, K extends keyof any> 的作用是使用 T 类型中除了 K 类型的所有属性，来构造一个新的类型。
```tsx
type myOmit<T, K extends keyof any> = 
  Pick<T, Exclude<keyof T, K>>;
```
```tsx
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```
## NonNullable
NonNullable<T> 的作用是用来过滤类型中的 null 及 undefined 类型。
```tsx
type NonNullable<T> = T extends null|undefined ? never : T
```
```tsx
type T0 = NonNullable<string | number | undefined>; // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```
## Parameters
Parameters<T> 的作用是用于获得函数的参数类型组成的元组类型。
```tsx
type Parameters<T extends (...args: any) => any> = 
  T extends (...args: infer P) => any ? P : never;

type A = Parameters<() =>void>; // []
type B = Parameters<typeof Array.isArray>; // [any]
type C = Parameters<typeof parseInt>; // [string, (number | undefined)?]
type D = Parameters<typeof Math.max>; // number[]

```
