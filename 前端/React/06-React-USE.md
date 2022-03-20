---
title: react-use
date: 2021-12-26 17:12:16
permalink: /前端/React/reactuse
categories:
  - 前端
  - React
tags:
  - 前端
  - React
---
## useSearchParams

用于获取 URL 中的查询字符串：

```jsx
const searchKey = useSearchParam("key")
```

这样，你就能获得 key 这个参数的值，并且在值发生变化时触发组件的刷新。

## useEvent

如果用 DOM 的原生 API 去绑定事件，通常我们需要在组件创建时去监听，再在组件销毁时取消监听，比较繁琐。而 useEvent 这个 Hook 封装了这部分逻辑，让我们使用起来非常方便。

```js
useEvent('keydown', onKeyDown);
```

这样的话，我们就可以在页面上监听键盘按键的事件，而无需关心该在何时绑定监听，以及何时取消监听。

## useCookie

Cookie 也是常用的数据源之一，但浏览器自带的 Cookie API 使用起来很不方便，需要自己去解析 Cookie 的值，而 useCookie 则可以让你很方便地去读取、更新或者删除某个 Cookie。

```jsx
const [value, updateCookie, deleteCookie] = useCookie("my-cookie");
```

## usePrevious

这个 Hook 可以让你获取某个 State 的上一个值，有时我们需要比较前后值的变化，这时我们就能感受到 usePrevious 这个 Hook 的好用了。

```jsx
const [count, setCount] = React.useState(0);
// 获取 cound 的上一个值
const prevCount = usePrevious(count);
```
