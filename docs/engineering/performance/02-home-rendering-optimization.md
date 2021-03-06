---
title: 首屏渲染优化
date: 2021-03-02 22:51:06
permalink: /engineering/performance/home-rendering-optimization
categories:
  - 前端
tags:
  - 前端
  - 其他
  - 性能优化
---
# 首屏渲染优化

## 首屏性能衡量的指标

- FPS：最能反映页面性能的指标FPS(frame per second)，一般系统设置屏幕的刷新率为60fps。小于24就会出现明显的卡顿
- DOMContentLoaded：DOM加载并解析完成会触发DOMContentLoaded事件，如果源码输出的内容太多，客户端解析DOM的时间也会变长，例如增加2000个嵌套层叠可能会相应增加50-200ms，尽量保证首屏输出即可，后续的内容只保留钩子，利用js渲染。
- 流畅度：FPS 值越高，视觉呈现越流畅，在等待的过程中可以加入一些视觉缓冲。
- 首屏加载时间：通过window.performance.timing来计算出来。

## 优化的思考角度

1. 首屏一定要快
2. 滚屏一定要流畅
3. 能不加载的先别加载
4. 能不执行的先别执行
5. 渐进展现、圆滑展现

## 为什么首屏会加载缓慢？

我先列一下目前我遇见影响加载的点：

1. 静态资源的加载未处理，资源加载过多
2. 调用的接口太多，接口的时间太久（此处前端也没有办法...）
3. 前端组件根据后端返回按需加载

### 懒加载

优先加载主要模块，让用户第一眼能看到最重要的信息。比如只有某种情况才会加载的模块使用require()，按需加载，这个方法在webpack打包的时候把导入的模块单独打一个包，不会加入到首屏加载的包中，优化体积大小。

### 懒执行

一些需要点击或者hover才会触发的模块，就等触发的时候再加载。

### 图片尺寸的控制和懒加载

尽量使用webp格式的照片，因为同样的视觉效果，其体积为其他的1/3大小。 使用雪碧图来处理首屏上所有的小icon，走cdn缓存等。

### 减小首屏渲染时间，还有一个途径就是，提取首屏的CSS样式，分离出来直接放进html，这样可以避免花太多时间渲染界面。

### 移动端性能优化

#### 预渲染模式

前端渲染领域，主要有以下几种方式选择：

- CSR：
  - 优点：不依赖数据FP 时间最快客户端用户体验好内存数据共享
  - 缺点：SEO 不友好FCP 、FMP 慢
- 预渲染：
  - 优点：不依赖数据FCP 时间比 CSR 快客户端用户体验好内存数据共享
  - 缺点：SEO 不友好FMP 慢
- SSR
  - 优点：SEO 友好首屏性能高，FMP 比 CSR 和预渲染快
  - 缺点：客户端数据共享成本高模板维护成本高
- 同构
  - 优点：SEO 友好首屏性能高，FMP 比 CSR 和预渲染快客户端用户体验好内存数据共享客户端与服务端代码公用，开发效率高
  - 缺点：Node 容易形成性能瓶颈
