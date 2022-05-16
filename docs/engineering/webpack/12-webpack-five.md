---
title: webpack5
date: 2021-7-20 21:32:23
permalink: /engineering/webpack/webpack-five
categories:
  - 工程化
  - webpack
tags:
  - 工程化
  - webpack
---
## webpack5

- node版本大于10.13.0

## 功能清除：清理弃用功能

- 所有在webpack4里面被废弃的能力都被清除，因此需要确保webpack4没有打印警告。
- require.includes语法已被废弃，可以通过 Rule.parser.requirelnclude 将行为改为允许、废弃或禁用。预加载一些模块，并不会马上执行
- 不再为Node.js模块引入polyfill，之前的版本是：如果某个模块依赖Node.js里面的核心模块，那么这个模块被引入的时候会把Node.js整个polyfill顺带引入。

## 长期缓存

确定的模块ld、chunk和导出名称。在生产模式下，默认的chunklds:"deterministic", modulelds:"deterministic"。设置成deterministic时默认最小3位数会被使用，不会因为某一个文件发生了变化，其他的会产生变化。

### chunklds

| 选项值        | 描述                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| natural       | 按使用顺序的数字id。                                                   |
| named         | 对调试更友好的可读的id。                                               |
| deterministic | 在不同的编译中不变的短数字id。有益于长期缓存。在生产模式中会默认开启。 |
| size          | 专注于让初始下载包大小更小的数字id。                                   |
| total-size    | 专注于让总下载包大小更小的数字id。                                     |

### modulelds

| 选荐值        | 描述                                 |
| ------------- | ------------------------------------ |
| natural       | 按使用顺序的数字id。                 |
| named         | 对调试更友好的可读的id。             |
| deterministic | 被哈希转化成的小位数值模块名。       |
| size          | 专注于让初始下载包大小更小的数字id。 |

## cache持久化缓存

在webpack4里面，可以使用cache-loader将编译结果写入硬盘缓存，还可以使用babel-loader，设置option.cacheDirectory将babel-loader编译的结果写进磁盘。

### webpack5缓存策略

- 默认开启缓存，缓存默认是在内存里。可以对cache进行设置。
- 缓存淘汰策略︰文件缓存存储在node_modules/.cache/webpack，最大500MB，缓存时常两个星期，旧的缓存先淘汰
- 后面打包可以直接利用它原生缓存的打包的能力

```js
module.exports= {
    cache: {
        // 将缓存类型设置为文件系统
        type: 'filesystem',
        buildDependencies: {
            // 将你的 config添加为 buildDependency，以便在改变config时获得缓存无效
            config: [__filename],

            // 如果你有其他的东西被构建依赖，你可以在这里添加它们
            // 注意 webpack、加载器和所有从你的配置中引用的模块都会被自动添加
        }
    }
}
```

## 构建优化：TreeShaking

- 支持嵌套的TreeShaking
- 可以分析这个模块直接的一个依赖关系

## 代码生成：支持生成ES6代码

- webpack 4之前只生成ES5的代码。webpack 5则现在既可以生成ES5又可以生成ES6/ES2015代码。
- 两种设置方式:`5 =<ecmaVersion <= 11或2009 =< ecmaVersion <= 2020`

```js
module.exports = {
    output:{
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        ecmaVersion: 6, // 输出ES6代码
    }
}
```

## 开创性的特性：模块联邦

基本解释: 使一个JavaScript 应用在运行过程中可以动态加载另一个应用的代码，并支持共享依赖(CDN)。不再需要本地安装Npm包。
通过CDN加载，应用A通过一个CDN，它去加载应用B，然后这两个应用分别在不同的端口。使用组件或者模块的分享更加方便了

- Remote: 被依赖方，被Host消费的 Webpack构建，提供一些组件或者依赖出来，给其他的依赖方去用，相当于服务提供方。
- Host: 依赖方，消费其他 Remote 的 Webpack 构建，使用其他Remote提供的模块，
- 一个应用可以是Host，也可以是Remote，也可以同时是Host和Remote

### 开创性的特性: ModuleFederationPlugin介绍

Webpack内部通过ModuleFederationPlugin 插件将多个应用结合起来。

- name: 必须，唯一ID，作为输出的模块名，使用的时通过 `${name}/${expose}`的方式使用;
- library: 必须，其中这里的name为作为umd的name;
- remotes: 可选，表示作为Host时，去消费哪些Remote;
- shared: 可选，优先用Host的依赖，如果Host没有，再用自己的;
- main.js: 应用主文件
- remoteEntry.js: 作为remote 时被引的文件

## bundle和bundless

### bundle和bundless资源加载差异

- bundle：浏览器加载的是构建好的文件，最开始会加载一个bundle.js；
- bundless: 直接加载原文件，不是加载构建好的文件；

### bundle和bundless打包速度对比

- bundless的冷启动时间大大缩短（使用esbuild）
- bundless的HMR速度不受整个项目体积影响，HMR效率高
- bundless的单文件粒度的缓存更优
- bundless在开发阶段的体验是更优的

### vite构建速度快的原因

预构建使用ESBuild（冷启动快的原因），ESBuild使用golang进行打包
