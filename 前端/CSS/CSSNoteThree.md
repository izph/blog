---
title: CSSNote-Three
date: 2020-12-26 11:38:51
permalink: /前端/CSS/cssnote03
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
// 第一个字母。首字母变大并向左浮动是一个非常常见的排版方式
```
### link 标签
引入外部资源到文档，并且会下载这些资源，不会在页面中显示。
link 标签能够被**搜索引擎**和一些**浏览器插件识别**，从而产生关键性作用。
比如，到页面 RSS 的 link 标签，能够被浏览器的 RSS 订阅插件识别，提示用户当前页面是可以 RSS 订阅的。
#### alternate 型 link
这个标签提示页面它的变形形式，这个所谓的变形可能是当前页面内容的不同格式、不同语言或者为不同的设备设计的版本，这种 link 通常也是提供给搜索引擎来使用的。alternate 型的 link 的一个典型应用场景是，页面提供 rss 订阅时，可以用这样的 link 来引入：
```html

<link rel="alternate" type="application/rss+xml" title="RSS" href="...">
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

### @charset
@charset 用于提示 CSS 文件使用的字符编码方式，它如果被使用，必须出现在最前面。这个规则只在给出语法解析阶段前使用，并不影响页面上的展示效果。
```css
@charset "utf-8";
```
### @import
@import 用于引入一个 CSS 文件，除了 @charset 规则不会被引入，@import 可以引入另一个文件的全部内容。
```css
@import "mystyle.css";
@import url("mystyle.css");

@import [ <url> | <string> ]
        [ supports( [ <supports-condition> | <declaration> ] ) ]?
        <media-query-list>? ;
```
通过代码，我们可以看出，import 还支持 supports 和 media query 形式。
### @media
media 就是大名鼎鼎的 media query 使用的规则了，它能够对设备的类型进行一些判断。在 media 的区块内，是普通规则列表。
```css
@media print {  
  body { 
    font-size: 10pt 
  }
}
```
### @page
page用于分页媒体访问网页时的表现设置，页面是一种特殊的盒模型结构，除了页面本身，还可以设置它周围的盒。
```css
@page {  
  size: 8.5in 11in;  
  margin: 10%;  
  
  @top-left {    
    content: "Hamlet";  
  }  
  
  @top-right {    
    content: "Page " counter(page);  
  }
}
```
### @ counter-style
counter-style 产生一种数据，用于定义列表项的表现。
```css
@counter-style triangle {  
  system: cyclic;  
  symbols: ‣;  
  suffix: " ";
}
```
### @ key-frames
keyframes 产生一种数据，用于定义动画关键帧。
```css
@keyframes diagonal-slide {  
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
### @ fontface
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
### @ support
support 检查环境的特性，它与 media 比较类似。
### @ namespace
用于跟 XML 命名空间配合的一个规则，表示内部的 CSS 选择器全都带上特定命名空间。
### @ viewport
用于设置视口的一些特性，不过兼容性目前不是很好，多数时候被 HTML 的 meta 代替。

### meta标签
```html
<meta charset="UTF-8">

相当于添加了 content-type 这个 http 头，并且指定了 http 编码方式。
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
```
width：页面宽度，可以取值具体的数字，也可以是 device-width，表示跟设备宽度相等。
height：页面高度，可以取值具体的数字，也可以是 device-height，表示跟设备高度相等。
initial-scale：初始缩放比例。
minimum-scale：最小缩放比例。
maximum-scale：最大缩放比例。
user-scalable：是否允许用户缩放。

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
### CSS 支持一批特定的计算型函数：
calc()
max()
min()
clamp()
toggle()
attr()

**calc() **函数是基本的表达式计算，它支持加减乘除四则运算。在针对维度进行计算时，calc() 函数允许不同单位混合运算，这非常的有用。
```css
section {
  float: left;
  margin: 1em; 
  border: solid 1px;
  width: calc(100%/3 - 2*1em - 2*1px);
}
```
**max()**、**min()** 和**clamp()**则是一些比较大小的函数，max() 表示取两数中较大的一个，min() 表示取两数之中较小的一个，clamp() 则是给一个值限定一个范围，超出范围外则使用范围的最大或者最小值。

**toggle()**函数在规则选中多于一个元素时生效，它会在几个值之间来回切换，比如我们要让一个列表项的样式圆点和方点间隔出现，可以使用下面代码：
```css
ul { 
  list-style-type: toggle(circle, square); 
}
```
**attr()**函数允许CSS接受属性值的控制。

# CSS function

1. ### Common CSS Functions

   1. #### `url()`

   2. #### `attr()`

   3. #### `calc()`

   4. #### `lang()`

   5. #### `:not()`

2. ### CSS Custom Properties

   1. `var()`

3. ### Color Functions

   1. #### `rgb()` and `rgba()`

   2. #### `hsl()` and `hsla()`

4. ### Pseudo Class Selector Functions

   1. #### `:nth-child()`

   2. #### `:nth-last-child()`

   3. #### `:nth-of-type()`

   4. #### `:nth-last-of-type()`

5. ### Animation Functions

   1. #### `cubic-bezier()`

   2. #### `path()`

   3. #### `steps()`

6. ### Sizing & Scaling Functions

   1. #### `scaleX()`, `scaleY()`, `scaleZ()`, `scale3d()`, and `scale()`

   2. #### `translateX()`, `translateY()`, `translateZ()`, `translate3d()`, and `translate()`

   3. #### `perspective()`

   4. #### `rotateX()`, `rotateY()`, `rotateZ()`, `rotate3d()`, and `rotate()`

   5. #### `skewX()`, `skewY()`, and `skew()`

7. ### Filter Functions

   1. #### `brightness()`

   2. #### `blur()`

   3. #### `contrast()`

   4. #### `grayscale()`

   5. #### `invert()`

   6. #### **`opacity()`**

   7. #### **`saturate()`**

   8. #### **`sepia()`**

   9. #### **`drop-shadow()`**

   10. #### **`hue-rotate()`**

   11. #### **SVG filters**

8. ### Gradient Functions

   1. #### `linear-gradient()` and `repeating-linear-gradient()`

   2. #### `radial-gradient()` and `repeating-radial-gradient()`

   3. #### `conic-gradient()` and `repeating-conical-gradi

9. ### Gradient Functions

   1. #### `linear-gradient()` and `repeating-linear-gradient()`

   2. #### `radial-gradient()` and `repeating-radial-gradient()`

   3. #### `conic-gradient()` and `repeating-conical-gradient`

10. ### Grid Functions

    1. #### `fit-content()`

    2. #### `minmax()`

    3. #### `repeat()`

11. ### Shape Functions

    1. #### `circle()`

    2. #### `ellipse()`

    3. #### **`polygon()`**

    4. **`inset()`**

12. ### Miscellaneous Functions

    1. `element()`

    2. `image-set()`

    3. `::slotted()`
