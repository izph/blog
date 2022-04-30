---
title: CSS笔记（二）
date: 2020-10-09 22:40:51
permalink: /前端/CSS/cssnote02
categories:
  - 前端
  - CSS
tags:
  - CSS
---
### CSS伪元素

- ::first-line，表示元素的第一行
- ::first-letter，表示元素的第一个字母
- ::before
- ::after
- ::selector，光标选中时的样式

```html
p::first-line { 
    text-transform: uppercase; 
}

p::first-letter { 
    text-transform: uppercase;
    font-size:2em;
    float:left; 
}
<!-- 第一个字母, 首字母变大并向左浮动是一个非常常见的排版方式 -->
```

#### 预处理类 link

预处理类 link 标签就是允许我们控制浏览器，提前针对一些资源去做这些操作，以提高性能。

- dns-prefetch 型 link 提前对一个域名做 dns 查询，这样的 link 里面的 href 实际上只有域名有意义。
- preconnect 型 link 提前对一个服务器建立 tcp 连接。
- prefetch 型 link 提前取 href 指定的 url 的内容。
- preload 型 link 提前加载 href 指定的 url。
- prerender 型 link 提前渲染 href 指定的 url。

#### modulepreload 型的 link

modulepreload 型 link 的作用是预先加载一个 JavaScript 的模块。这可以保证 JS 模块不必等到执行时才加载。这里的所谓加载，是指完成下载并放入内存，并不会执行对应的 JavaScript。

```html
<link rel="modulepreload" href="app.js">
<link rel="modulepreload" href="helpers.js">
<link rel="modulepreload" href="irc.js">
<link rel="modulepreload" href="fog-machine.js">
<script type="module" src="app.js">
```

#### stylesheet 型 link

```html
<link rel="stylesheet" href="xxx.css" type="text/css">
```

### @import

@import 用于引入一个 CSS 文件内容。

```css
@import "mystyle.css";
@import url("mystyle.css");

@import [ <url> | <string> ];
```

### @media

media就是大名鼎鼎的媒体查询，它能够对设备的类型进行一些判断。在 media 的区块内，是普通css层叠样式。

```css
@media print {  
  body { 
    font-size: 10pt;
  }
}

/* Demo */
@media screen and (max-width: 950px){}
```

### @key-frames

keyframes用于定义动画关键帧。

```css
@keyframes animation-name {  
  from {  
    left: 0;  
    top: 0;  
  }  
  to {  
    left: 100px;  
    top: 100px;  
  }
}

```

### @fontface

fontface 用于定义一种字体，icon font 技术就是利用这个特性来实现的。

```css
@font-face {  
  font-family: Gentium;  
  src: url(http://example.com/fonts/Gentium.woff);
}

p { 
  font-family: Gentium, serif; 
}
```

### CSS 支持的计算型函数

#### calc()

calc()函数是基本的表达式计算，它支持加减乘除四则运算。在针对维度进行计算时，calc() 函数允许不同单位混合运算，这非常的有用。

```css
section {
  float: left;
  margin: 1em; 
  border: solid 1px;
  width: calc(100%/3 - 2*1em - 2*1px);
}
```

#### max()

max() 表示取两数中较大的一个

#### min()

min() 表示取两数之中较小的一个

#### clamp()

clamp() 则是给一个值限定一个范围，超出范围外则使用范围的最大或者最小值。

#### toggle()

toggle()函数在规则选中多于一个元素时生效，它会在几个值之间来回切换，比如我们要让一个列表项的样式圆点和方点间隔出现，可以使用下面代码：

```css
ul { 
  list-style-type: toggle(circle, square); 
}
```

#### attr()

attr()函数允许CSS接受属性值的控制。

#### var()

CSS自定义的属性
