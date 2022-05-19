---
title: CSS笔记（三）
date: 2020-11-20 09:08:11
permalink: /front-end/css/css-note-03
categories:
  - 前端
  - CSS
tags:
  - CSS
---
# CSS修改滚动条的样式

- 滚动条整体的样式，如宽度和高度
  `target::-webkit-scrollbar {}`
- 内滚动条部分，也就是滚动条里面滚动的小方块
  `target::-webkit-scrollbar-thumb{}`
- 滚动条轨道
  `target::-webkit-scrollbar-track{}`
- 滚动条两端的按钮
  `target::-webkit-scrollbar-button`
- -webkit-scrollbar-track-piece 内层轨道，滚动条中间部分
- -webkit-scrollbar-corner 边角，即两个滚动条的交汇处
- -webkit-resizer 两个滚动条的交汇处上用于通过拖动调整元素大小的小控件

```css
.box {
   overflow: auto;
}

/* 滚动轨道 底层*/
.box::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
    border-left: 1px solid rgba(0, 0, 0, 0);
}
/* 滚动条 */
.box::-webkit-scrollbar {
    /* 分别对应纵向和横向滚动条宽高 */
    width: 10px;  /* 纵向滚动条宽 */
    height: 10px; /* 横向滚动条高 */
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
}
/* 滚动条 上层*/
.box::-webkit-scrollbar-thumb {
    background-color: #7f7f7f;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
}

/* hover滚动条 */
.box::-webkit-scrollbar-thumb:hover {
    background-color: #272626;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
}
```

# 去掉button按钮点击时的黑色边框
```css
.btn:focus {
    outline: 0;
}
```

# linear-gradient
linear-gradient 是一种实现线性渐变的属性，它的特点的是线性的控制渐变。

[CSS渐变linear-gradient](https://juejin.cn/post/6931206551466475528)

[线性渐变linear-gradient](https://juejin.cn/post/7080435731025362981)

- 默认是从上到下渐变，`red, yellow, blue`

```css
background-image: linear-gradient(red, yellow, blue);
```
- to direction的意思是向哪个方向渐变
- to left颜色的顺序是向左，从右到左渐变颜色。分别是`blue, yellow, red`

```css
background-image: linear-gradient(to left, red, yellow, blue);
```

- to left top左上开始，从左上角到右下角的渐变颜色分别是`blue, yellow, red`

```css
background-image: linear-gradient(to left top, red, yellow, blue);
```

- 颜色可以指定百分比，蓝色指定50%，则渐变从60% 的位置开始，也就是其余的40% 的区域进行渐变

```css
background-image: linear-gradient(red 60%, yellow, blue);
```

- 渐变部位从 70%~85% 之间，由红变黄

```css
background-image: linear-gradient(red 60%, yellow 80%);
```

### background-color和background-image优先级
- background-color和background-image同时存在，background-image优先级大于background-color
- 重新设置background: color时会把background-image覆盖，此时background-color可以显示出来
