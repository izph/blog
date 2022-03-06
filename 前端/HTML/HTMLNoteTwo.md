---
title: HTMLNote-Two
date: 2021-12-28 11:38:51
permalink: /前端/HTML/htmlnote02
categories:
  - 前端
  - HTML
tags:
  -
---
1. HTML不是一种编程语言，而是一种超文本标记语言，是用来描述网页的标记语言。
2. 行内元素的margin、padding在水平方向有效，垂直方向是无效的。
3. 加载html页面时，link 标签引入的 CSS 被同时加载；@import 引入的 CSS 将在页面加载完毕后被加载。
4. 浏览器的渲染引擎和JS引擎，渲染引擎可以显示 html文档及图片，JS 引擎：解析和执行 javascript代码来实现网页的动态效果，这两者是互斥的，遇到script标签后由JS引擎处理，阻塞了页面的渲染。
5. JS会阻塞浏览器的解析，想首屏渲染的越快，就越不应该在首屏就加载大量 JS 文件，将 script 标签放在 body 标签底部的、给 script 标签添加 defer 或者 async 属性都可以减缓阻塞。async 和 defer 的作用是什么：

   - defer：表示延迟执行引入的 JavaScript，即这段 JavaScript 加载时 HTML 并未停止解析，这两个过程是并行的，当整个 document 解析完毕后再执行脚本文件，在 DOMContentLoaded 事件触发之前完成，多个脚本按顺序执行。
   - async ：异步执行 JavaScript，js如果已经加载好，就会开始执行js代码，这时候会阻塞文档的解析，只是js加载过程不会阻塞，多个js脚本的无法保证执行顺序。
6. 重排（回流）必定会发生重绘，重绘不一定会引发重排（回流），重排是指一些元素的宽高、位置大小的变化、元素的添加、删除等。重绘则是指dom元素的颜色、背景发生变化等。
7. cookies，sessionStorage 和 localStorage 的区别

   - cookie 数据大小不能超过4 k，sessionStorage 和 localStorage 大小为5 M
   - localStorage存储持久数据，浏览器关闭后数据不丢失、除非主动删除数据。只能被同源的页面访问共享。
   - sessionStorage 关闭浏览器时会被清除，刷新页面不会清除。只能被同一个窗口的同源 页面所访问共享。
   - cookie是可以设置有效期，只能被同源的页面访问共享
8. 常用的 meta 标签

   - 声明文档使用的字符编码：``<meta charset='utf-8'>``
   - 为移动设备添加 viewport 不允许缩放：

     ```html
     <meta name='viewport'  content='initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no'>
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
