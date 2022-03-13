---
title: BOM笔记（一）
date: 2022-01-23 20:53:16
permalink: /前端/JavaScript/BOM/BOM笔记01
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
  - BOM
---
```javascript
// 记录浏览历史，所以可以实现后退功能
location.assign('http://www.baidu.com');

// 不记录浏览历史，所以不可以实现后退功能
location.replace('http://www.baidu.com');

// 刷新浏览器
location.reload(true);
```