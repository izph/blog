---
title: 移动端点击事件延迟300ms的问题
date: 2021-02-21 22:33:15
permalink: /front-end/javascript/mobile-click-delay
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# 移动端点击事件延迟300ms的问题

在正常情况下，移动端在触发点击事件时，会有300ms的延迟。

## 为什么会有延迟？

简单来说，双击缩放和单击之间可能会存在冲突吧，当用户第一次点击屏幕之后，浏览器并不能立刻判断用户是单击还是双击。300ms之内没有再次点击，是单击；如果是300ms之内又点了一次，就是双击缩放。

## 解决方案

### 在html文档头部定义禁止缩放的meta标签内容

禁用缩放：`user-scalable=no`，浏览器禁用的双击缩放事件并且同时会去掉300ms点击延迟。但这个方案也有缺点，就是完全禁用了双击缩放，当我们需要放大文字或者图片时无法满足我们的需求。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no">

```

### fastclick插件

```js
// 安装：npm install fastclick
import FastClick from "./fastclick";
window.addEventListener(
  "load", // DOMContentLoaded
  function() {
    FastClick.attach(document.body);
  },
  false
);

document.documentElement.addEventListener(
  "touchmove",
  function(e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  },
  false
);
```

### 独自封装处理函数

```js
//封装函数,处理延迟300ms问题
function mobileTap(el, callback) {
    var isMove = false;
    var startTime = 0;
    // 触屏开始
    el.addEventListener('touchstart', function () {
        startTime += Date.now();
    })
    // 手指滑动
    el.addEventListener('touchmove', function () {
        isMove = true;
    })
    // 触屏结束
    el.addEventListener('touchend', function () {
        if (!isMove && (Date.now() - startTime) < 150) {
            callback && callback();
        }
        isMove = false;
        startTime = 0;
    })
}
mobileTap('DOM元素', () => {})
```

计算触摸开始到结束的时间，如果时间小于150ms，就执行回调函数。如果大于150ms，或者期间移动了屏幕，就表示不是点击事件，就不必执行回调函数，这个方法有一个弊端，一次只能给一个元素去解决问题。
