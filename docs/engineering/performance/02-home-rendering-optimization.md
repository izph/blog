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

# webpack首屏渲染优化
[webpack优化](https://juejin.cn/post/7071928099847274509)

## 生产环境关闭productionSourceMap、css sourceMap
```js
const isProduction = process.env.NODE_ENV === 'production' // 判断是否是生产环境
module.exports = {
    productionSourceMap: !isProduction, //关闭生产环境下的SourceMap映射文件
    css: {
        sourceMap: !isProduction, // css sourceMap 配置
        loaderOptions: {
           // ...其它代码
        }
    },
    // ...其它代码
}

```
## 分析大文件，改用CDN引入
- 先使用webpack-bundle-analyzer分析文件大小，分析下前端加载速度慢原因
- 在打包时排除这些第三方依赖，webpack的externals
- html模板中引入cdn（免费的cdn服务: BootCDN）

## moment.js的优化（使用day.js）

## 生产环境开启js、css压缩
提取css为单独文件并压缩:  mini-css-extract-plugin

## 使用懒加载组件
```js
{
    path: '/Login',
    name: 'Login',
    component: () = >import( /* webpackChunkName: "Login" */  '@/view/Login')
}
```
### 组件库的按需加载
## 开启gizp压缩(配置nginx优化)
gizp压缩是一种http请求优化方式，通过减少文件体积来提高加载速度。html、js、css文件甚至json数据都可以用它压缩，可以减小60%以上的体积。前端配置gzip压缩，并且服务端使用nginx开启gzip，用来减小网络传输的流量大小。

```js
// npm i compression-webpack-plugin -D

// dev开发配置文件
const CompressionWebpackPlugin = require('compression-webpack-plugin')

plugins: [
   new CompressionWebpackPlugin()
]
// 自动生成.gz为后缀的包
// 配置好之后，打开浏览器访问线上，F12查看控制台，如果该文件资源的响应头里显示有Content-Encoding: gzip，表示浏览器支持并且启用了Gzip压缩的资源
```
## 缩小文件搜索范围 减小不必要的编译工作
- Loader 时可以通过 test、include、 exclude三个配置项来命中 Loader
- resolve.alias 配置，路径别名
- 优化 resolve.extensions 配置，文件后缀名优先匹配