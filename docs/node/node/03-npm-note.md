---
title: npm笔记
date: 2021-03-15 22:13:16
permalink: /node/node/npm-note
categories:
  - 后端
tags:
  - npm
---
# npm

## npm安装命令的区别

### npm i xxx -g

- 是npm install xxx --global的简写，对模块进行全局安装。
- 全局安装，是指把模块安装到操作系统上，全局是指操作系统，全局安装完成后，一般会安装到AppDataAppData\Roaming\npm目录下。如：npm install webpack -g，就是全局安装webpack，在操作系统的任何一个目录下都可以使用webpack所提供的指令。

node安装教程和更改全局模块的安装路径可参考：[Node.js的安装及环境配置](https://blog.csdn.net/weixin_42881768/article/details/105028164)

### npm i xxx -s

是npm install xxx --save的简写，对模块进行局部安装，模块写入到package.json的 dependencies对象。

- 模块一般安装到项目文件夹下的node_modules文件夹下。
- dependencies对象，这个与devDependencies不同，是需要发布到生产环境中的，就比如你要跑一个基于react的项目，所以需要react来支持，react模块就需要跟随项目到最终的生产环境。npm i react -s即可将react模块安装到项目的依赖中，并一同发布到生产环境。

### npm i xxx -d

是npm install xxx --save-dev的简写，对模块进行局部安装，模块写入到 devDependencies 对象

- 模块一般安装到项目文件夹下的node_modules文件夹下
- devDependencies对象，是我们开发的时候需要用到的一些包，只用于开发阶段，真正打包上线的时候并不需要这些包，因为这些工具只是你用来打包代码的，是用来识别特定文件以及代码，帮助我们生产最终文件的。

## npm全局命令

有时候我们在开发依赖和生产依赖上都没有发现某个指令的安装包，如下例子的rimraf，删除文件的命令。
这时候需要在我们电脑上全局安装npm i rimraf -g，方可使用。（其他依赖亦如此）

```json
{
  "scripts": {
    "clean": "rimraf ./public",
    "bash": "npm run clean && bash deploy.sh"
  }
}
```

## 查看npm镜像源

- `npm config ls`
- `npm get registry`

## npm和cnpm的镜像源

- npm: `https://registry.npmjs.org/`
- cnpm: `https://registry.npm.taobao.org/`

## 切换npm的镜像源

`npm config set registry xxxUrl`

## .npmrc文件
[.npmrc文件](https://juejin.cn/post/6983522411647860766)


# cross-env

## 出现cross-env的大概原因

- 设置NODE_ENV =production环境变量时，大多数Windows命令提示将会阻塞(报错)，也就是说windows不支持NODE_ENV=development的设置方式。
- cross-env能够提供一个设置环境变量的scripts，然后在windows上也能兼容运行。

## 使用cross-env

安装cross-env: `npm install --save-dev cross-env`

```json
// NODE_ENV环境变量将由cross-env设置
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}
```

通过process.env.NODE_ENV可以去到设置的值

## cross-env的其他用法

- 简单理解为：cross-env Attr=value，可以在 process.env这个对象上挂载Attr属性，值为value，在项目中通过process.env.Attr拿到value。
- 在 scripts 中配置 `cross-env BABEL_ENV=test`，当前环境可通过 process.env.BABEL_ENV 来获得。
- `cross-env DEPLOY=server1`，通过process.env.DEPLOY获取DEPLOY的值

## 语义化版本(Semantic version) 规范格式

- 主版本号:当你做了不兼容的API修改；做一些总要特性的升级、前一个版本有很多不兼容的地方。
- 次版本号:当你做了向下兼容的功能性新增；新增一个功能feture。
- 修订号:当你做了向下兼容的问题修正。修复bug，修复问题

### 版本例子

X.Y.Z三位组成、版本是严格递增，发布重要的版本，可以发布先行版本号alpha（内部测试）、beta（外部小范围测试）、rc（公测）。
在版本修订好后面加上一个链接号(-)，如 `16.3.0-alpha.0`、`16.3.0-alpha.2`

### 遵守semver规范的优势

- 避免出现循环依赖
- 减少依赖冲突
