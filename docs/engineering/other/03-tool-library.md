---
title: 第三方工具库
date: 2022-03-10 21:22:30
permalink: /engineering/other/tool-library
categories:
  - 工程化
tags:
  - 工程化
---
## lerna

[lerna](https://github.com/lerna/lerna)

用于管理具有多个包的JavaScript项目的工具，将所有模块都放到同一个仓库里

1. 自动解决packages之间的依赖关系
2. 通过git 检测文件改动，自动发布
3. 根据git 提交记录，自动生成changelog

安装：`npm install -g lerna`
初始化Lerna仓库：`lerna init`


## shelljs
[shelljs](https://github.com/shelljs/shelljs)

## cpr

[cpr](https://github.com/davglass/cpr)

## glob

主要用于匹配文件路径
[glob](https://github.com/isaacs/node-glob)

## axios
[axios 中文说明](https://www.kancloud.cn/yunye/axios/234845)

- axios.CancelToken：取消发出去的请求
[axios.CancelToken](https://juejin.cn/post/6865909895913766926)

- 拦截请求和响应
