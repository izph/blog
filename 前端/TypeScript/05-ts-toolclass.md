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

## Partial
Partial<T> 将类型的属性变成可选，只支持处理第一层的属性
```tsx
type Partial<T> = {
		[key in keyof T]?: T[key]
}
```
## DeepPartial
DeepPartial<T> 将类型的属性变成可选，只支持**多**层的属性
```tsx
type DeepPartial<T> = {
		[key in keyof T]?: T[key] extends object
  ? DeepPartial<T[key]> 
  : T[key]
}
```
## Required
Required将类型的属性变成必选
```tsx
type Required<T> = {
		[key in keyof T]-?: T[key]
}
```
## Readonly
Readonly<T> 的作用是将某个类型所有属性变为只读属性，也就意味着这些属性不能被重新赋值。
```tsx
type Readonly<T> = {
	readonly	[key in keyof T]: T[key]
}
```
## Pick（挑选）
Pick 从某个类型中挑出一些属性出来
```tsx
type Pick<T, K extends keyof T> = {
	[key in K]: T[key]
}
```
## Record（转化）
Record<K extends keyof any, T> 的作用是将 K 中所有的属性的值转化为 T 类型。
```tsx
type Record<K extends keyof any, T> = {
		[key in K]: T
}

interface PageInfo {
  title: string;
}

type Page = "home" | "about" | "contact";

const x: Record<Page, PageInfo> = {
  about: { title: "about" },
  contact: { title: "contact" },
  home: { title: "home" },
};
```
## Exclude（移除）
Exclude<T, U> 的作用是将某个类型中属于另一个的类型移除掉。
如果 T 能赋值给 U 类型的话，那么就会返回 never 类型，否则返回 T 类型。最终实现的效果就是将 T 中某些属于 U 的类型移除掉。
```tsx
type Exclude<T, U> = T extends U ? never : T;

// 例子
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | number

```
## Extract（公共）
Extract<T, U> 的作用是从 T 中提取出 U。提取公共部分
```tsx
type Extract<T, U> = T extends U ? T : never;

type T0 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T1 = Extract<string | number | (() => void), Function>; // () =>void

```
## Omit（差集）
Omit<T, K extends keyof any> 的作用是使用 T 类型中除了 K 类型的所有属性，来构造一个新的类型。
```tsx
type Omit<T, K extends keyof any> = 
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

## ReturnType
获取函数的返回值的类型
```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

type E = ReturnType<() => string> // E的类型是string
```
