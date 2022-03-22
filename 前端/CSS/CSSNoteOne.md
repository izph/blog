---
title: CSS笔记（一）
date: 2020-12-26 11:38:51
permalink: /前端/CSS/cssnote01
categories:
  - 前端
  - CSS
tags:
  - CSS
---
1. CSS盒模型

- IE盒模型，box-sizing: border-box; 宽高包括了边框、内边距、content内容。
- 标准盒模型，box-sizing: content-box; 宽高只包括content内容，设置border、padding盒子变大。

2. CSS可以继承的属性

   字体属性、文本属性、鼠标光标属性、可见属性(visibility)等
3. CSS选择器优先级计算（important！优先级最高）

   - （1）行内样式 1,0,0,0
   - （2）ID选择器 0,1,0,0
   - （3）class选择器、属性选择符、伪类选择符 0,0,1,0
   - （4）元素和伪元素选择符 0,0,0,1
4. width: 100% 和 width: auto 的区别

   - width: 100% 会使元素box的宽度等于父元素的content box（标准盒子）的宽度。
   - width: auto 会使元素撑满整个父元素，margin、border、padding、content区域会自动分配水平空间。
5. 高度塌陷：浮动引起的，浮动的盒子，没有撑开父盒子

   - 空的div元素，设置style为clear: both;
   - 父级元素设置为BFC
   - 伪元素清除浮动

     ```css
     .clear::after{ 
       content: ''; 
       display: block;
       height: 0;
       visibility: hidden;
       clear: both; 
     }
     ```
6. BFC（块级格式化上下文）：独立的容器，容器内外的元素互不会影响

   - 浮动元素float为left、right
   - 绝对定位元素position为absolute、fixed(固定定位)
   - display: inline-block、table-cell、table-caption、flex等
   - overflow: hidden、auto、scroll等
7. 外边距重合margin

   计算方式：两个正数取最大的数、两个负数取绝对值最大的数、一正一负取两者之和
8. 响应式设计的基本原理是什么？

   基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理, 页面头部必须有meta声明的viewport。实现：``@media screen and (max-width: 950px){}``
9. 实现小于12px 的文字

   用css3的transform 的缩放属性scale: transfor: scale(0.x);
10. 移动端如何画一条0.5px的线

    - meta标签的最大缩放、最新缩放都设置为0.5
      ```html
      <meta name="viewport" content="width=device-width,initial-scale=0.5,minimum-scale=0.5,maximum-scale=0.5"/>
      ```
    - CSS3的transform: scale(0.5,0.5);
11. 为什么有时候设置 height:100% 会无效？

    百分比高度是根据父元素的高度计算的，父元素没有显式设置高度，则为height: auto，所以子元素设置高度也会无效。
12. min-width、max-width的覆盖规则

    max-width会覆盖width，即使width是行内样式或者设置了!important。
    在min-width和max-width冲突的时候，min-width会覆盖max-width。
13. 常见的元素隐藏方式

    - display: none;
    - visibility: hidden;
    - opacity: 0; 可见度为0，但是可以响应绑定的事件
    - 通过 z-index 负值，用其他元素挡住该元素，适用于定位元素
    - transform: scale(0,0)，将元素缩放为 0
14. CSS选择器中出现特殊字符怎么办？ 使用属性选择器

    id选择器: #aim_equip_card|equip_code  最终显示获取的是 #aim_equip_card
    中竖线|是特殊字符，需要使用属性选择器[id="aim_equip_card|equip_code"]，方能获取
15. CSS 中不同属性设置为百分比 % 时 ，是以什么为参照基准的呢？

    - 元素的 width、height的百分比，是基于父元素的宽高
    - 元素的 margin 和 padding 设置为百分比时，基准为 父元素的宽度 width（易错）
      margin padding 四个方向的参照的都是父元素的宽度
    - 元素的 border-width，不支持百分比
    - 元素的 translateX、translateY，基准为分别为自身的 height、width
16. 伪类和伪元素的区别

- 伪类：基于DOM，不产生新的对象，用来修改元素的某种状态、对DOM进行修饰
- 伪元素：产生一个不存在与DOM的新对象，可以对这个对象进行添加样式
