---
title: HTML笔记（一）
date: 2020-09-03 11:20:11
permalink: /front-end/html/html-note-01
categories:
  - 前端
  - HTML
tags:
  - HTML
---
### 1. HTML

### 2. 行内元素的margin、padding

行内元素的margin、padding在水平方向有效，垂直方向是无效的。

### 3. link和@import

加载html页面时，link 标签引入的 CSS 被同时加载；@import 引入的 CSS 将在页面加载完毕后被加载。

### 4. 渲染引擎和JS引擎

浏览器的渲染引擎和JS引擎，渲染引擎可以显示 html文档及图片，JS 引擎：解析和执行 javascript代码来实现网页的动态效果，这两者是互斥的，遇到script标签后由JS引擎处理，阻塞了页面的渲染。

### 5. defer和async

JS会阻塞浏览器的解析，想首屏渲染的越快，就越不应该在首屏就加载大量 JS 文件，将 script 标签放在 body 标签底部的、给 script 标签添加 defer 或者 async 属性都可以减缓阻塞。async 和 defer 的作用是什么：

- defer：表示延迟执行引入的 JavaScript，即这段 JavaScript 加载时 HTML 并未停止解析，这两个过程是并行的，当整个 document 解析完毕后再执行脚本文件，在 DOMContentLoaded 事件触发之前完成，多个脚本按顺序执行。
- async ：异步执行 JavaScript，js如果已经加载好，就会开始执行js代码，这时候会阻塞文档的解析，只是js加载过程不会阻塞，多个js脚本的无法保证执行顺序。

### 6. 重排（回流）和重绘

重排（回流）必定会发生重绘，重绘不一定会引发重排（回流），重排是指一些元素的宽高、位置大小的变化、元素的添加、删除等。重绘则是指dom元素的颜色、背景发生变化等。

### 7. cookies，sessionStorage 和 localStorage 的区别

- cookie 数据大小不能超过4 k，sessionStorage 和 localStorage 大小为5 M
- localStorage存储持久数据，浏览器关闭后数据不丢失、除非主动删除数据。只能被同源的页面访问共享。
- sessionStorage 关闭浏览器时会被清除，刷新页面不会清除。只能被同一个窗口的同源 页面所访问共享。
- cookie是可以设置有效期，只能被同源的页面访问共享

### 8. 常用的 meta 标签

- 声明文档使用的字符编码：``<meta charset='utf-8'>``
- 为移动设备添加 viewport 不允许缩放：user-scalable=no

```html
<meta charset="UTF-8">
<meta name='viewport'  content='initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no'>

<!-- 
    width：页面宽度，可以取值具体的数字，也可以是 device-width，表示跟设备宽度相等。
    height：页面高度，可以取值具体的数字，也可以是 device-height，表示跟设备高度相等。
    initial-scale：初始缩放比例。
    minimum-scale：最小缩放比例。
    maximum-scale：最大缩放比例。
    user-scalable：是否允许用户缩放 
-->
```

- http-equiv属性，设置页面不缓存：

```html
<meta http-equiv='pragma' content='no-cache'> 
<meta http-equiv='cache-control' content='no-cache'> 
<meta http-equiv='expires' content='0'>
```

- Set-Cooike:

```html
<meta http-equiv="Set-Cookie" content="cookievalue=xxx;expires=Friday,12-Jan-200118:18:18GMT；path=/">
<meta http-equiv="content-Type" content="text/html;charset=gb2312">
```

- 设置content-type，并且指定了 http 编码方式。

```html
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
```

- 其他

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<!-- 默认使用最新浏览器 -->

<meta http-equiv="Cache-Control" content="no-siteapp">
<!-- 不被网页(加速)转码 -->

<meta name="robots" content="index,follow">
<!-- 搜索引擎抓取 -->

<meta name="renderer" content="webkit">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui">
<meta name="apple-mobile-web-app-capable" content="yes">
<!-- 删除苹果默认的工具栏和菜单栏 -->

<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<!-- 设置苹果工具栏颜色 -->

<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<!-- 添加到主屏后的标题 -->

<meta name="apple-mobile-web-app-title" content="标题" />
<!-- 忽略数字自动识别为电话号码 -->

<meta content="telephone=no" name="format-detection" />
<!-- 忽略识别邮箱 -->

<meta content="email=no" name="format-detection" />
<meta name="apple-itunes-app" content="app-id=myAppStoreID,
affiliate-data=myAffiliateData, app-argument=myURL" />
```
