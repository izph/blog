---
title: 实现loader和plugin
date: 2021-06-20 16:12:53
permalink: /工程化/webpack/webpack-loaderandplugin
categories:
  - 工程化
  - webpack
tags:
  - 工程化
  - webpack
---

## loader的链式调用与执行顺序
- loader执行的顺序是在use数组内从右到左（从后往前），loader本质上是一个函数。
- 多个loader是串行执行，上一个loader处理完source之后会把处理结果传给下一个loader来处理。
- Compose(webpack采用的函数组合)：`compose = (f, g) => (...args) => f(g(...args))`
```js
module.exports = function(source){
    return newSource;
}
```

### loader-runner
loader-runner运行你在不安装webpack的情况下运行loaders，进行loader的开发和调试，其实像是提供了一个loader运行的环境。