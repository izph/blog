---
title: CSSTransition笔记
date: 2022-04-16 20:33:30
permalink: /project/yolo-ui/css-transition-note
categories:
  - 项目
tags:
---
# react-transition-group

## CSSTransition 的使用

### css动画属性
|动画属性|说明|
|---|---|
|.xxx-enter|进入（入场）前的CSS样式|
|.xxx-enter-active|进入动画直到完成时之前的CSS样式|
|.xxx-enter-done|进入完成时保留的CSS样式|
|.xxx-exit|退出（出场）前的CSS样式|
|.xxx-exit-active|退出动画知道完成时之前的的CSS样式|
|.xxx-exit-done|退出完成时保留的CSS样式|

### CSSTransition 组件属性

| 组件属性       | 说明 |
| -------------- | ----------------------- |
| in             | 动画状态，in值的变化决定了动画是enter还是exit，in值的变化是触发动画的扳机|
| timeout        |动画持续时间（ms）|
| classNames     | css类名   |
| unmountOnExit | 在元素退场时，自动把DOM也删除，这是以前用CSS动画没办法做到的|
|appear         |意思是想让组件出现时就有动画效果|
| onEnter        | 在应用`enter`或出现类后立即触发回调 |
| onEntering     | 在应用`enter-active`或出现-活动类后立即触发回调 |
| onEntered      | 在`enter`或出现类之后立即触发回调移除而done类添加到DOM节点 |
| onExit         | 在应用`exit`类后立即触发回调 |
| onExiting      | 在应用`exit-active`之后立即触发回调 |
| onExited       | 在`退出`类之后立即触发回调。移除而exit-done类添加到DOM节点|

参考：
[react-transition-group动画组件详解](https://blog.csdn.net/qq_37279880/article/details/106120490)

[react-transition-group](https://juejin.cn/post/7030727850357424165)