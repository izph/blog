---
title: 【webpack】如何成为一名webpack配置工程师
date: 2021-02-09 20:33:11
categories:
  - 工程化
tags:
  - Webpack
toc: true # 是否启用内容索引
comments: true
copyright: false
---
# Webpack基础

## 为什么需要构建工具，它有什么作用？

- **转换ES6语法**：ES6语法在前端领域广泛使用，然而很多浏览器对ES6没有提供全面的兼容和支持，所以需要构建工具来对ES6语法进行编译。
- **转换JSX、vue指令**：前端框架React的JSX，VUE指令都是浏览器无法识别的，需要编译转换。
- **CSS前缀补全，预处理器**：经常使用less、sass等预编译语法写样式，需要构建工具做编译转化为CSS。
- **多媒体资源压缩**：经常使用的图片、字体、图标等多媒体资源，需要构建工具对它们进行压缩，减少体积大小。
- **压缩混淆代码**：当前的前端开发都是模块开发，也引入了大量的依赖包，为了让浏览器对代码的加载更快，需要构建工具对代码进行压缩和混淆。

## Webpack基础知识

- loader作用：webpack仅支持js和json文件，想对其他类型的文件打包需要使用loader，转化成为有效的模块。loader本身是一个函数，接受源文件作为参数，返回转换的结果，loader的执行顺序是从右往左。
- plugins作用：plugins是增强webpack功能，是 bundle 的一个优化，干预输出的结果，作用于整个构建过程。可以简单理解为任何loader没办法做的事情，都可以用plugins去完成。
- chunk和bundle：chunk是webpack打包过程中依赖，bundle是输出的产物。
- 基本的配置文件如下：
```js
// 为JSON模块使用具名导出，可能需要使用 package.json 中的一些字段
// package.json的 homepage 属性会告诉 webpack 项目的路径需要打包到哪个路径下，如github路径、CDN路径
import pkg from './package.json'; // console.log(pkg.version);

const path = require('path');
module.exports = {
  mode: 'development', // 模式：development、production、none
  entry: './src/index.js', // 打包入口地址
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.join(__dirname, 'dist') // 输出文件目录
  }
  module: {
    rules: [

    ]
  },
  plugin: []
}
```
### mode模式

| 名称  | 描述 |
| :---: | :---: |
| development | 开发模式，打包更加快速 |
| production  | 生产模式，打包比较慢，会开启 tree-shaking、压缩代码和清除无用代码 |
| none        | 不开启任何优化选项|
- development：更快的构建速度、热更新(hot)、快速定位问题(sourcemap )
- production: 生产环境下会自动压缩js代码，构建体积小（代码压缩 + tree-shaking）、代码分割、压缩images。

## webpack常用指令

- webpack默认配置文件是根目录下的webpack.config.js，自定义配置打包文件的命令：`webpack --config filename`
- 监听变动并自动打包（文件监听是在发现源码发生变化时，自动重新构建出新的输出文件）：
  - 方式一：在package.json的script命令添加：`webpack --watch`
  - 方式二：在webpack.config.js中设置`watch: true`
- 压缩混淆代码：`webpack -p`
- 方便出错时能查阅更详尽的信息：`webpack --display-error-details`
- 让编译的输出内容带有进度和颜色：`webpack --progress --colors`
- 模块热替换，在前端代码变动的时候无需整个刷新页面，只把变化的部分替换掉：`webpack-dev-server --hot`
- inline选项会为入口页面添加热加载功能，即代码改变后重新加载页面（刷新浏览器）：`webpack-dev-server --inline`

## Webpack的整个生命周期
Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：
- `初始化参数` 从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
- `开始编译` 用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
- `确定入口` 根据配置中的 entry 找出所有的入口文件
- `编译模块` 从入口文件出发，调用所有配置的 Loader 对模块进行编译，再找出该模块被编译后的最终内容以及它们之间的依赖关系
- `完成模块编译` 在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
- `输出资源` 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
- `输出完成` 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

在以上过程中，在webpack运行的生命周期中会广播出许多事件，plugin可以监听这些事件，并且plugin可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

## 常见的loaders

| 名称          | 描述                                                                  |
| ------------- | --------------------------------------------------------------------- |
| babel-loader  | 转换ES6、ES7等JS新特性语法                                            |
| css-loader    | 加载和解析.css文件，不会将样式加载到页面上                          |
| style-loader   | 将处理好的css以style标签形式添加到页面上                           |
| postcss-loader | 添加CSS3部分属性的浏览器前缀（先添加前缀，再使用css-loader）        |
| less-loader   | 将less文件转换成css                                                   |
| ts-loader     | 将TS转换成JS                                                          |
| vue-loader    | 支持 Vue          |
| thread-loader | 正常情况下webpack开一个进程打包，thread-loader作用是多进程打包JS和CSS  |
| file-loader   | 解决图片、字体、媒体等资源引入问题，并将资源copy到指定目录，默认为 dist |
| url-loader    | url-loader内部使用了file-loader，可以设置较小的资源自动base64，多了一个limit的配置|
| raw-loader    | raw-loader可以将文件转化成字符串的形式导入                       |

**注意**：webpack5内置了资源处理模块，file-loader、url-loader和raw-loader都可以不用安装

## 常见的plugins

| 名称 | 描述  |
| --- | --- |
| HtmlWebpackPlugin       | 将打包好的bundle如js、css 文件可以自动引入到html中 |
| mini-css-extract-plugin | 将CSS从 bunlde文件里提取成一个独立的CSS文件(MiniCssExtractPlugin.loader) |
| TerserPlugin | 压缩JS，支持ES6，清除console（webpack5内置）|
| splitchunksplugin       | 将chunks相同的模块代码提取成公共js   |
| CleanWebpackPlugin      | 自动清空打包目录  |
| copyWebpackPlugin       | 将文件或者文件夹拷贝到构建的输出目录（webpack5内置）   |
| UglifyjsWebpackPlugin   | 压缩JS    |
| ZipWebpackPlugin        | 将打包出的资源生成一个zip包   |

## 基本的webpack配置

```js

const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html模板
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 将css单独提取
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 打包输出前清空文件夹
const path = require('path');
// 通过 process.env.NODE_ENV 获取当前环境

module.exports = {
  mode: 'development', // production or development or none
  /**
   * 单入口entry: './src/js/index.js'
   * 多入口entry: { key: 'value' }
   * key可自定义，value是入口文件路径
  */
  entry: {
    // 定义应用的入口点 src/app.js，并命名为 main
    main: path.resolve(__dirname, './src/app.js'), 
    index: './src/js/index.js', // 输出index
    test: './src/js/test.js', // 输出test
  },
  /**
   * filename, path
   * [name].[hash:8].bundle.js、[name].[chunkhash:8].bundle.js
   * hash字段是根据每次编译compilation的内容计算所得、chunkhash是根据模块内容计算出的hash值
  */
  output: {
    // 打包输出的文件名
    // name是一个占位符，通过占位符确保文件名称的唯一，一般entry多入口使用占位符区分
    filename: 'js/[name].[contenthash:10].js', // 10位hash值, name取原来的文件名 
    // 定义打包结果的输出位置build目录
    path: path.resolve(__dirname, 'build'),
    // publicPath表示的是打包生成的index.html文件里面引用资源的前缀

    // webpack5清除输出目录可用，无需安装clean-webpack-plugin
    clean: true
  },
  /**
   * test指定匹配规则
   * use指定使用的loader名称
  */
  module: {
    // 定义处理源文件的规则，rules 下会按顺序使用匹配的规则
    rules: [
      {
        // 遇到 .js 结尾的文件则使用这个规则
        test: /\.js$/,
        // 忽略 node_modules 目录下的 js 文件

        // 在配置 loader 的时候，我们需要更精确的去指定 loader 的作用目录或者需要排除的目录，
        // 通过使用 include 和 exclude 两个配置项
        include: path.join(__dirname, 'src'), // 符合条件的模块进行解析
        exclude: /node_modules/, // 排除符合条件的模块，不解析
        use: [
          /* 
              开启多线程打包。 
              进程启动大概为600ms，进程通信也有开销。
              只有工作消耗时间比较长，才需要多线程打包
          */
          {
            loader: 'thread-loader',
            options: {
              workers: 2 // 进程2个
            }
          },
          {
            // 使用 babel-loader 处理 js
            loader: 'babel-loader',
            // babel-loader 的一些选项
            options: {
              presets: [
                '@babel/preset-env', // 确保 Babel 能够处理 JSX 语法
                {
                    // 按需加载
                    useBuiltIns: 'usage',
                    // 指定core-js版本
                    corejs: {
                      version: 3
                    },
                    // 指定兼容性做到哪个版本浏览器
                    targets: {
                      chrome: '60',
                      firefox: '60',
                      ie: '9',
                      safari: '10',
                      edge: '17'
                    }
                  }
              
              ], 
              // babel 在转译 js 过程中时间开销比价大，将 babel-loader 的执行结果缓存起来，重新打包的时候，直接读取缓存
              // 开启babel缓存, 第二次构建时，会读取之前的缓存, 速度会更快一点
              cacheDirectory: true // 启用缓存，缓存位置： node_modules/.cache/babel-loader
            },
          },
        ]
      },
      {
        test: /\.css$/,
        /**
         * css-loader用于处理加载.css文件，并且转换成commonjs对象
         * style-loader将样式通过<style>标签插入到head中
        */
        use: [
          // 'style-loader', // 以 style标签 添加到head
          MiniCssExtractPlugin.loader, // 将js中的css单独提取出来
          'css-loader', // 将css文件整合到js文件中
        ]
      },
      {  
        // 检测 less 文件  
        test: /\.less$/,  
        // 使用了三个 loader，注意执行顺序是数组的倒序  
        // 也就是先执行 less-loader ，将less转换成css   
        use: [
          // 'style-loader', 
          MiniCssExtractPlugin.loader,
          // 缓存一些性能开销比较大的 loader 的处理结果，缓存位置：node_modules/.cache/cache-loader
          'cache-loader', 
          'css-loader', 
          // 'less-loader'
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              // 替换某个属性值，如修改antd默认主题色@primary-color，入口文件样式引入@import '~antd/dist/antd.less';
              modifyVars: {
                '@primary-color': '#13c2c2',　　
              }
            }
        ],  
      },
      {
        // webpack 默认处理不了html中img图片
        // 匹配 图片资源
        test: /\.(jpg|png|gif|jpeg)$/,
        // 通过 url-loader 或者 file-loader 处理图片资源
        // url-loader内部使用了file-loader，可以设置较小的资源自动base64
        // base64格式的图片  可打包在js中直接使用
        loader: 'url-loader', 
        options: {
          // 图片大小小于8kb，就会被base64处理
          // 优点: 减少请求数量（减轻服务器压力）
          // 缺点：图片体积会更大（文件请求速度更慢）
          limit: 8 * 1024,
          // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
          // 解析时会出问题：[object Module]
          // 解决：关闭url-loader的es6模块化，使用commonjs解析
          esModule: false,
          // 给图片进行重命名
          // [hash:10]取图片的hash的前10位
          // [ext]取文件原来扩展名
          name: '[contenthash:10].[ext]',
          outputPath: 'imgs',
        }
      },
      {
        test: /\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        loader: 'html-loader'
      },
      // 打包其他资源(除了html/js/css资源以外的资源)
      {
        // file-loader处理字体文件
        // 排除css/js/html资源
        test: /\.(woff|woff2|ttf|eot|otf)$/,
        exclude: /\.(css|js|html|less)$/,
        loader: 'file-loader',
        options: {
          name: '[contenthash:10].[ext]',
          outputPath: 'media'
        }
      },
    ],
  },
  plugins: [
    // 功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（JS/CSS），并配置了页面的 title
    new HtmlWebpackPlugin({
      title: 'Webpack Output',
       // 复制 './src/index.html' 文件，并自动引入打包输出的所有资源（JS/CSS）
      template: './src/index.html',
      // 压缩html代码
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
    }),
    // 提取js中的css成单独文件
    new MiniCssExtractPlugin({ 
      // 对输出的css文件进行重命名，如filename: 'css/built.css'，放到输出目录的css文件夹下
      filename: '[name].[hash:8].css'
    }),
    // 打包输出前清空文件夹clean-webpack-plugin（webpack5不需要）
    new CleanWebpackPlugin(),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
  ],
   /*
    1. 可以将node_modules中代码单独打包一个chunk最终输出（单入口）
    2. 自动分析多入口文件的chunk中，有没有公共的文件。如果有会打包成单独一个chunk
  */
  optimization: {
    splitChunks: { // 解决代码引入的复用问题，不会重复打包多次
      chunks: 'all'
    }
  },
  // 开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）
  // 特点：只会在内存中编译打包，不会有任何输出    devServer只能在 开发环境使用，生产环境不需要
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 8888,
    // 自动打开浏览器
    open: true,

    // 开启HMR功能(webpack优化配置)
    // 当修改了webpack配置，新配置要想生效，必须重新webpack服务
    hot: true // HMR只能在 开发环境使用，生产环境不需要
  },
  // 拒绝XXX包 被打包进来，再用cdn 引进来(在html中手动通过srcipt标签引入、link引入)
  // CDN内容分发网络，分布式存放静态资源，缓解服务器压力，就近获取资源，加快访问速度
  // 某些包需要用cdn引入进来，就可以使用externals
  externals: {
    // 拒绝jQuery被打包进来
    jquery: 'jQuery'
    // jquery: '$'
  },
  devtool: 'eval-source-map' //  source-map
};
```

## babel（解析ES6、处理jsx）

- 解析ES6，需要在rules里面匹配js文件，并use: 'babel-loader'。babel-loader是依赖babel的，需要在根目录创建babel的配置文件.babelrc。
- 需要安装@babel/core、@babel/preset-env、babel-loader

- babel-loader 使用 Babel 加载 ES2015+ 代码并将其转换为 ES5
- @babel/core Babel 编译的核心包
- @babel/preset-env Babel 编译的预设，可以理解为 Babel 插件的超集

```json
// .babelrc
{
  // 一系列plugins的集合
  "presets": [
    "@babel/preset-env", // 增加ES6的babel preset配置，解析ES6
    "@babel/preset-react", // 安装该依赖，并增加react的babel preset配置，解析react相关的语法，jsx
    // @babel/preset-typescript
  ],
  // 一个plugins对应一个功能
  "plugins": [
    // 处理 装饰器的使用
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ]
}
```
### babel-plugin vs babel-preset（预设）
[Babel polyfill 常见配置对比](https://juejin.cn/post/6975556168752037919)

babel存在太多的plugin，实现某种功能，比如ES2015语法兼容时需要用到众多的插件。preset是plugin的集合，将多个plugin合并在一起（预设是插件的集合）

1. 插件plugin和预设preset的执行顺序
- plugin先执行，preset后执行
- plugin集从前往后执行
- preset集从后往前执行

@babel/preset-env（官方提供），作用是根据 targets 的配置引入对应插件来实现编译和 polyfill，自动根据 targets 来引入需要的插件

所谓Polyfill就是这样解决API的兼容问题的，抹平差异化

2. 官方给出了两种 polyfill 方案：
- babel-polyfill：会污染全局适合在业务项目中使用。（Babel7.4.0版本开始，babel/polyfill 已经被废弃，推荐直接使用core-js）
- babel-runtime：不污染全局适合在组件或类库项目中使用。

开启 polyfill 功能要指定它的引入方式，也就是 useBuiltIns。设置为 usage 是在每个模块引入用到的，设置为 entry 是统一在入口处引入 targets 需要的。

polyfill 的实现就是 core-js，需要再指定下 corejs 版本，一般是指定 3

@babel/preset-env 会导致多个模块重复注入同样的代码，会污染全局环境。解决这个问题就要使用 @babel/plugin-transform-runtime 插件

这样就不会多个模块重复注入同样的实现代码了，而且 core-js 的 api 也不是全局引入了，变成了模块化引入。

这样就解决了 corejs 的重复注入和全局引入 polyfill 的两个问题

@babel/plugin-transform-runtime 的功能，把注入的代码和 core-js 全局引入的代码转换成从 @babel/runtime-corejs3 中引入的形式

@babel/runtime-corejs3 就包含了 helpers、core-js、regenerator 这 3 部分
```js
{
    presets: [
        ['@babel/preset-env', {
            targets: 'chrome 30',
            debug: true,
            useBuiltIns: 'usage',
            corejs: 3
        }]
    ],
    plugins: [
        ['@babel/plugin-transform-runtime', {
            corejs: 3 // 插件也是处理 polyfill ，也就同样需要指定 corejs 的版本
        }]
    ]
}

```
### babel的原理
babel是一个JS、JSX、TS 的编译器，能把新语法写的代码转换成目标环境支持的语法的代码

#### babel工作的三个步骤
1. 解析：将源码解析为AST（词法解析和语法解析）
2. 转换：旧AST转换成为新的AST（应用插件/预设中，对AST节点增删改查的操作）
3. 生成：根据AST生成源码（深度优先遍历AST生成转译后的源码）



#### @bable/core
- 内核@bable/core类似一个调度器，并不直接实现功能细节，而是调度各模块插件去实现相关功能
- @babel/core的功能可以简单概况为 向外读取配置 => 向内调度插件模块协同工作 => 向外输出转译后的源码。详细版本如下：

加载配置文件，读取所需使用的插件、预处理器等等
- 调用@babel/parser进行词法分析、语法分析后转换为AST
- 调用@babel/traverse对AST进行遍历，并采用visitor模式应用配置项中的插件对AST进行转换
- 调用@babel/generator生成源码和源码对应的sourceMap

#### 解析（parse）
解析的核心是：词法分析将源码分词、语法分析将分词后的源码按照JS语法逻辑转换为AST（抽象语法树）。

- 词法分析：简单理解为：将源码分割为不同种类，保留关键词（如function）、条件判断词（if/else）、运算符、数字、字符串、空格等
- 语法分析：将词法分析生成的分词，组合为各类型的语法短语（抽象语法树AST）
#### 转换（Traverser）
转换器会遍历AST树，然后按照配置的插件对其中需要转换的节点进行操作

#### 生成（generator）
调度器调用generator插件将AST转译成源码

#### babel-cli
babel官方提供的脚手架，允许你以命令行的方式运行babel
```js
$ npm install babel-cli -g
​
# 将示例js输出到编译后的js中
$ babel example.js -o compiled.js

```

## webpack文件监听的原理

轮询判断文件的最后编辑时间是否变化，
某个文件发生变化了，并不会立刻告诉监听者，而是先缓存起来，等aggregateTimeout.

[watch 和 watchOptions](https://www.webpackjs.com/configuration/watch/#watch)

```js
module.exports = {
  // 默认是false，不开起监听
  watch: true,
  watchOptions: {
    // 默认为空，不监听的文件或者文件夹，支持正则匹配
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行，默认300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒检查1次变化
    // 间隔xxx秒检查一次变化
    poll: 1000
  }
}
```
## 文件指纹

打包后输出的文件名的后缀，如 `index_0a4dfa7c33787eec103e.chunk.js`中的0a4dfa7c33787eec103e

- hash：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
- chunkhash：对于 JS 文件，和 webpack 打包的 chunk 相关，不同的entry会生成不同的 chunkhash 值
- contenthash：将根据资源内容创建出唯一 hash。当资源内容发生变化时，[contenthash] 也会发生变化。

1. JS 的文件指纹设置，在output 的 filename，使用 [chunkhash]
2. CSS 的文件指纹设置，可以在MiniCssExtractPlugin使用[contenthash]

使用hash的场景还应该结合mode来考虑，如果mode是development的时候，在使用hmr的情况下，尽量避免使用chunkhash和contenthash，应该使用hash。而在mode是production的时候，就是不用hmr的情况下，这时候就适合使用chunkhash了。hmr只在development开发阶段使用。

js使用chunkhash是便于寻找资源，js的资源的关联度更高；而css采用contenthash是因为css一般是根据不同的页面书写的，css资源之前的关联度不高，也就不用在其他资源修改，而css部分没有修改的时候重新更新css。

MiniCssExtractPlugin作用

- 将 CSS 提取到单独的文件中
- 为每个包含 CSS 的 JS 文件创建一个 CSS 文件
- 支持按需加载 CSS 和 SourceMaps
- 下载

```bash
npm i mini-css-extract-plugin -D
```

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    output: {
        path: path.resolve(__dirname, '/dist'),
        filename: '[name][chunkhash:8].js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name][contenthash:8].css'
        })
    ]
}

```

### 图片的文件指纹设置

在 file-loader或者url-loader 的options参数中设置name，使用[contenthash]

当 webpack 配置中使用了 `[hash]` 占位符时，请考虑将它改为 `[contenthash]`

| 占位符名称    | 含义                                                      |
| ------------- | --------------------------------------------------------- |
| [ext]         | 资源后缀名                                                |
| [name]        | 文件名称                                                  |
| [path]        | 文件的相对路径                                            |
| [folder]      | 文件所在的文件夹                                          |
| [hash]        | 每次构建生成的唯一 hash 值，默认是 md5 生成               |
| [chunkhash]   | 根据chunk生成hash值 |
| [contenthash] | 根据文件内容生成hash 值，默认是md5生成，默认有32位，一般取前8位|
| [emoji]       | 一个随机的指代文件内容的 emoji                            |

- hash：任何一个文件改动，整个项目的构建 hash 值都会改变；
- chunkhash：文件的改动只会影响其所在 chunk 的 hash 值；
- contenthash：每个文件都有单独的 hash 值，文件的改动只会影响自身的 hash 值；

```js
const path = require('path');
module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name][hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    }
}

```

## sourcemap

- sourcemap是一种提供源代码到构建后代码映射技术（如果构建后代码出错了，通过映射可以追踪源代码错误）
- sourcemap一般在开发环境使用，生产环境关闭

| 关键字     | 说明                                      |
| ---------- | ----------------------------------------- |
| eval       | 使用eval包裹模块代码                      |
| source-map | 产生.map文件                              |
| cheap      | 只需要定位到行信息，不需要列信息           |
| inline     | 将.map作为DataURI嵌入，不单独生成.map文件 |
| module     | 包含loader的sourcemap，展示源代码中的错误位置|

### sourcemap的类型

<img src="/images/engineering/webpack-source-map001.png">

- 不开起source-map调试是打包之后的内容，不方便调试
- 开启source-map调试看到的是源代码，方面调试

```js
module.exports = {
    devtool: 'source-map'
}
```

### sourcemap的类型总结

```js
[inline-、hidden-、eval-][nosources-][cheap-[module-]]source-map
```

说明：外部则是生成xxx.js.map文件，内联则是将.map内嵌，不生成.map文件，内联构建速度更快，但是体积比外部大

1. source-map：外部，能显示出错误代码准确信息和源代码的错误位置
2. inline-source-map：内联，只生成一个内联source-map，能显示错误代码准确信息和源代码的错误位置
3. eval-source-map：内联，每一个文件都生成对应的source-map，都在eval中，能显示错误代码准确信息和源代码的错误位置(文件后面会多一个hash值，print.js?8d3a)
4. hidden-source-map：外部，为了隐藏源代码而诞生的，错误代码能显示错误原因，但是没有源代码的错误位置，不能追踪源代码错误，只能提示到构建后代码的错误位置
5. nosources-source-map：外部，为了隐藏源代码而诞生的，错误代码准确信息，但是没有任何源代码信息(找不到任何代码信息)
6. cheap-source-map：外部，能显示错误代码准确信息和源代码的错误位置，**只能精确的行的错误，不能精确到列**（比如第四行只是后面的一个代码错误，但是是整行报错，**而source-map可以准确提示哪一行的那一列出错了**，同一行没错误的分号(;) 不提示错误）
7. cheap-module-source-map：外部，能错误代码准确信息和源代码的错误位置，有module，会将loader的source map加入。
8. 开发环境：速度快，调试更友好
- 速度快慢，eval>inline>cheap>...
  - eval-cheap-souce-map (有cheap只精确到行)
  - eval-source-map
- 调试更友好
  - souce-map
  - cheap-module-souce-map(module会将loader的source map加入)
  - cheap-souce-map
- eval-source-map(调试最友好) 、eval-cheap-module-souce-map(调试性能最友好)、react脚手架（cra）默认使用的是eval-source-map
- 本地开发推荐eval-cheap-souce-map
  - 本地开发首次打包慢点没关系，因为eval缓存的原因，rebuild会很快
  - 开发中，我们每行代码不会写的太长，只需要定位到行就行，所以加上cheap
  - 我们希望能够找到源代码的错误，而不是打包后的，所以需要加上module

9. 生产环境：源代码要不要隐藏? 调试要不要更友好

- 内联会让代码体积变大，所以在生产环境不用内联，我们要让体积变小，就不要内联，而采用外部的方式。
- nosources-source-map 全部隐藏（源码和构建后的代码都会隐藏）
- hidden-source-map 只隐藏源代码，会提示构建后代码错误信息
- source-map(调试友好)
- cheap-module-souce-map（cheap的速度会快一点）
- 推荐none：不想别人看到我的源代码

# webpack进阶

## 自动清理构建产物

- 通过 npm scripts 清理构建目录

```bash
rm -rf ./dist && webpack
rimraf ./dist && webpack
```

- 避免构建前每次都需要手动删除 dist，使用 clean-webpack-plugin，默认会删除 output 指定的输出目录

```js
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    entry: {
        index: './src/index.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name][chunkhash:8].js'
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
}

```

## webpack之PostCSS插件autoprefixer自动补齐CSS3前缀

为了实现 CSS3 前缀的自动补齐，使用autoprefixer 插件：对代码打包完成后的 CSS 进行后置处理，与 postcss-loader 结合使用
[Can I Use 插件](https://caniuse.com/) 查看兼容性

```bash
npm i autoprefixer postcss-loader -d
```

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        index: './src/index.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    // 有单行注释代码的时候，需要把less loader放到后面，不然会报错的
    module: {
        rules: [
            {
                test: /.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')({
                                    // browsers 指定 autoprefixer 所需要兼容的浏览器版本
                                    // 最近两个版本，浏览器使用量大于1%
                                    browsers: ['last 2 version', '>1%', 'ios 7']
                                    // browsers改成overrideBrowserslist
                                })
                            ]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        })
    ]
}

```

## 移动端CSS px自动转换成rem

px2rem-loader：将 px 自动转换成 rem

```js
const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    // 移动端CSS px自动转换成rem
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75,  // 1rem = 75px
                            remPrecision: 8  // px 转换为 rem 时小数点后的位数
                        }
                    }
                ]
            }
        ]
    }
}

```

- lib-flexible：页面渲染时计算根元素的 font-size 值(可以使用手淘的 lib-flexible 库`https://github.com/amfe/lib-flexible`)
- 将 node_modules -> lib-flexible -> flexible.js 文件全部代码手动引入到 模板html 文件中

## 多页面应用(PWA)

1. 页面有多个入口，多页面应用每个应用都是解耦的，多页面应用对SEO更加友好。

- 多页面跳转需要刷新所有资源，每个公共资源(js、css等)需选择性重新加载;
- 页面跳转：使用window.location.href = "./index.html"进行页面间的跳转；
- 数据传递：可以使用path?account=123&password=456 路径携带数据传递的方式，或者localstorage、cookie等存储方式;

2. 每个页面对应一个entry，一个html-webpack-plugin，缺点是每次新增或者删除页面需要修改webpack配置
3. 解决方案：动态获取entry和设置html-webpack-plugin的数量

- 约定js入口文件放置格式为 `./src/xxx/index.js`，xxx为某个特定模块的名称，html模板为index.html
- 利用glob.sync读取文件：[glob](https://github.com/isaacs/node-glob)

```js
// npm i glob -d
glob.sync(path.join(__dirname, './src/*/index.js'))
```

```js
// webpack.config.js
const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));

    Object.keys(entryFiles)
        .map((index) => {
            const entryFile = entryFiles[index];
            const match = entryFile.match(/src\/(.*)\/index\.js/);
            const pageName = match && match[1];

            entry[pageName] = entryFile;
            htmlWebpackPlugins.push(
                new HtmlWebpackPlugin({
                    inlineSource: '.css$',
                    template: path.join(__dirname, `src/${pageName}/index.html`),
                    filename: `${pageName}.html`,
                    chunks: ['vendors', pageName],
                    inject: true,
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: false,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: false
                    }
                })
            );
        });

    return {
        entry,
        htmlWebpackPlugins
    }
}

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    mode: 'production',
    // module: {......},
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new CleanWebpackPlugin(), 
        new HTMLInlineCSSWebpackPlugin() 
    ].concat(htmlWebpackPlugins)
};
```

## 热更新（HMR）

1、使用 webpack-dev-server

- 自动编译并运行，不需要手动刷新浏览器，每次修改代码都需要重新执行 webpack 命令，可以使用 webpack-dev-server 自动打包运行
- 不输出文件，而是放在内存中，watch是放在磁盘里
- 与 HotModuleReplacementPlugin 插件配合使用

```bash
npm i webpack-dev-server -d
```

- webpack.config.js

```js
const path = require('path');
const webpack = require('webpack');
module.exports = {
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    // 热更新一般只在开发模式使用
    mode: 'development',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        // 告诉服务器从哪里提供静态资源（只有想提供静态文件时才需要）
        contentBase: path.resolve(__dirname, 'public'), // 静态资源所在的路径，默认为项目根目录
        hot: true // 开启热更新
	      port: 8888, // 端口号
        compress: true, //是否启动压缩 gzip
	      open:true  // 是否自动打开浏览器
        // devServer里面的publicPath表示的是打包生成的静态文件所在的位置
        //（若是devServer里面的publicPath没有设置，则会认为是output里面设置的publicPath的值）
    }
}

```

- package.json，--open打开浏览器

```json
{
  "scripts": {
    "dev": "webpack-dev-server --open"
  }
}
```

### 热更新原理分析

<img src="/images/engineering/webpack-hot001.png">

- 首次编译：① -> ② -> A -> B
- 修改代码后的热更新：① -> ② -> ③ -> ④
- HMR Server -> HMR Runtime 以json形式传递

| 概念                            | 描述                                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Webpack Compiler(webpack编译器) | 将JS编译成 Bundle                                                                                    |
| HMR Server                      | 将热更新的文件传输给 HMR Runtime                                                                     |
| Bundle Server                   | 提供文件在浏览器的访问，提供类似的服务器环境访问，如localhost:3003/bundle.js，服务器和浏览器是ws链接 |
| HMR Runtime                     | 会被注入到浏览器，更新文件的变化                                                                     |
| bundle.js                       | 构建输出的文件                                                                                       |



## webpack之JS、css和html文件的压缩

webpack4 内置了uglifyjs-webpack-plugin 插件（mode为production），默认打包出的 JS 文件已压缩过， webpack5 内置了terser-webpack-plugin 插件

1. CSS 文件的压缩

```bash
# 安装依赖，使用 optimize-css-assets-webpack-plugin 插件，同时使用预处理器 cssnano
npm i optimize-css-assets-webpack-plugin cssnano -D
```

2. html文件的压缩

```js
const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    entry: {
        index: './src/index.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name][chunkhash:8].js'
    },
    plugins: [
        // 添加 css 压缩配置
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        // 通常是一个html页面对应一个HtmlWebpackPlugin，多个html就使用多个HtmlWebpackPlugin
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html'),  // html 模板所在的位置
            filename: 'index.html',  // 指定打包出 html 的文件名称
            chunks: ['index'],  // 指定生成的 html 要 使用哪些 chunk
            inject: true,  // 将指定的chunks（js、css）引入到 html中
            minify: {
                html5: true,
                // 移除空格
                collapseWhitespace: true,
                // 当标记之间的空格包含换行符时，始终折叠为1换行符(不完全删除它)，必须与collapseWhitespace=true一起使用
                preserveLineBreaks: false,
                minifyCSS: true, // 压缩文内css
                minifyJS: true,  // 压缩文内js
                // 移除注释
                removeComments: false
            }
        })
    ],
    optimization: {
      minimize: true,
      minimizer: [
        // 添加 css 压缩配置
        new OptimizeCssAssetsPlugin({}),
        // 压缩 JS
        new TerserPlugin({})
      ]
  },
}
```


## 提取页面的公共资源

### 基础库的分离

- 思路:将react、react-dom 基础包通过cdn 引入，不打入bundle 中
- 方法:使用html-webpack-externals-plugin
- entry: 可以是本地文件、cdn引入等
  <img src="/images/engineering/webpack-001.png">

### externals
externals 配置选项提供了「从输出的 bundle 中排除依赖」的方法

例如，从CDN引入React，而不是把它打包
```html
 <!-- anonymous：CORS请求将不设置凭据标志 -->
<script
  src="https://unpkg.com/react@16/umd/react.development.js"
  crossorigin="anonymous" 
></script>
```
配置externals
```js
const config = {
  //...
  externals: {
    react: 'React',
  },
};

```
使用React
```js
import React from 'react';
```
### CDN
CDN用来托管静态资源，就近获取，加快访问速度，缓解服务器压力，还可以防止一些网络的攻击

CDN的原理是：本地DNS系统解析的时候，发现该URL对应的是一个CDN专用的DNS服务器，将解析权利交给了 专门处理CDN的DNS服务处理

### 使用SplitChunksPlugin进行公共脚本分离

optimization.splitChunks 是基于 SplitChunksPlugin 插件实现的，webpack内置的。

[splitChunks 分包配置](https://juejin.cn/post/7023242274876162084#heading-52)

```js
module.exports = {
    //...
    optimization: {
      splitChunks: {
        // async：异步引入的库进行分离（默认），  initial： 同步引入的库进行分离， all：所有引入的库进行分离（推荐）
        chunks: 'async', 
        minSize: 30000, // 抽离的公共包最小的大小，单位字节 30k   如果minSize: 0,只要有引用，就会抽离
        minRemainingSize: 0, // 确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
        maxSize: 0, // 最大的大小
        minChunks: 1, // 资源使用的次数(在多个页面使用到)， 大于1， 最小使用次数
        maxAsyncRequests: 5,  // 并发请求的资源数量
        maxInitialRequests: 30, // 入口文件做代码分割最多能分成30个js文件
        automaticNameDelimiter: '~', // 文件生成时的连接符
        automaticNameMaxLength: 30, // 自动自动命名最大长度
        name: true, // 让cacheGroups里设置的名字有效
        cacheGroups: { //当打包同步代码时，上面的参数生效，配置提取模块的方案
          vendors: {
            test: /[\\/]node_modules[\\/]/,  //检测引入的库是否在node_modlues目录下的
            priority: -10, //值越大,优先级越高.模块先打包到优先级高的组里
            filename: 'vendors.js'//把所有的库都打包到一个叫vendors.js的文件里
          },
          default: {
            minChunks: 2, // 上面有
            priority: -20,  // 上面有
            reuseExistingChunk: true //如果一个模块已经被打包过了,那么再打包时就忽略这个上模块
          },
          commons: {
              test: /(react|react-dom)/,
              // 分离处理的名称，可将vendors这个chunk添加到html-webpack-plugin中的chunks数组里使用，chunks: ['vendors', pageName]
              name: 'vendors', 
              chunks: 'all'
          }
        }
      }
    }
};
```

## Tree Shaking的使用和原理分析

- webpack默认支持，模式为production默认开启，必须是es module的模块规范，cjs不支持
- Tree Shaking就是把模块中使用到的代码打入bundle，引入了但是没有使用，也不会被打包进入bundle。
- **Tree Shaking原理**：Tree Shaking会对模块的代码进行静态的分析，在编译的阶段已经确定了哪些代码需要使用的，不需要的代码会被Tree Shaking进行注释标记，最终在uglify阶段删除无用的代码。
- DCE
  dead code elimination，消除死代码，通常在编译阶段由编译器进行判断某些代码是否可达从而删除那些不可能执行的代码
- 代码不会被执行，不可到达

```js
if(false){
    console.log("1") // 这段代码永远不会执行
}
```

- 代码的执行结果不会被用到
- 代码只会影响死变量（只写不读）
- 常规的死代码消除一般来说包含上面这几种类型的无用代码，会在打包阶段，一般是uglify.js分析并删除无用代码。
- 副作用的代码不能treeshking，如在window对象挂载属性值，但是没有使用；export封装成对象导出，没有使用的方法不能被treeshking，原因是treeshking只能做到export级别，编译期间的静态分析只能对es module的相关语法做分析，是不会真正去执行代码的。

## Scope Hoisting（作用域提升）

Scope Hoisting 是 webpack3 的新功能，它可以让 webpack 打包出来的代码文件更小，运行更快。原理是将多个模块放在同一个作用域下，并重命名防止命名冲突，通过这种方式可以减少函数声明和内存开销。

当前现状：webpack构建后的代码存在大量的闭包代码，导致什么问题？

- 大量函数闭包包裹代码，导致包体积增大（模块越多越明显）
- 代码在运行时因为创建的函数作用域更多，内存开销变大。

### 模块转换分析

- 模块转化为模块初始化函数，转换后的模块会带上一层包裹
- import会被转换成__webpack_require，__webpack_require的参数有moduleId，exprot也会发生转换

### webpack模块机制

<img src="/images/engineering/webpack-module001.png">

- webpack 打包输出打是一个 IIFE（匿名闭包）；
- modules 是一个数组，每一项是一个模块初始化函数，modules会传入IIFE函数中；
- IIFE函数最核心的是使用 __webpack_require() 来加载和处理模块，返回 module.exports；
- __webpack_require()根据moduleId来查看installModules里是否存在，不存在会创建一个新的module存放到installModules；
- 通过 __webpack_require__(__webpack_require__.s = 0)，entry入口依赖，启动程序。

## Scope Hoisting原理（从rollup借鉴）

- 原理：将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突，消除包裹
- Scope Hoisting的使用：webpack4以上，模式为production默认开启，必须是ESM，不支持cjs
- ModuleConcatenationPlugin() 插件
  [参考Scope Hoisting](https://juejin.cn/post/6844904003109650445)

1. 没有 Scope Hoisting 时用 webpack 打包下面两个文件

```js
// main.js
export default "hello";

// index.js
import str from "./main.js";
console.log(str);
```

2. 使用 webpack 打包后输出文件内容如下：

```js
// module指代源代码，__webpack_exports__就是export、__webpack_require__是import
/* harmony import 是ES6语法的标识 */
/* harmony exports 是ES6语法的标识 */
[  (function (module, __webpack_exports__, __webpack_require__) {    
        var __WEBPACK_IMPORTED_MODULE_0__main_js__ = __webpack_require__(1);    
        console.log(__WEBPACK_IMPORTED_MODULE_0__main_js__["a"]);  
    }),  
    (function (module, __webpack_exports__, __webpack_require__) {    
        __webpack_exports__["a"] = ('hello');  
    })
]
```

3. 再开启 Scope Hoisting 后，相同源码打包输出结果变为：

```js
[  (function (module, __webpack_exports__, __webpack_require__) {    
        var main = ('hello');    
        console.log(main);  
    })
]
```

对比两种打包方式输出的代码，我们可以看出，启用 Scope Hoisting 后，函数声明变成一个， main.js 中定义的内容被直接注入到 main.js 对应模块中，这样做的好处：

- 代码体积更小，因为函数申明语句会产生大量代码，导致包体积增大（模块越多越明显）；
- 代码在运行时因为创建的函数作用域更少，内存开销也随之变小。
- 对比结果: 通过scope hoisting 可以减少函数声明代码和内存开销

scope hoisting理解为是把每个模块被webpack处理成的模块初始化函数整理到一个统一的包裹函数里，也就是把多个作用域用一个作用域取代，以减少内存消耗并减少包裹块代码，从每个模块有一个包裹函数变成只有一个包裹函数包裹所有的模块，但是有一个前提就是，当模块的引用次数大于1时，比如被引用了两次或以上，那么这个效果会无效，也就是被引用多次的模块在被webpack处理后，会被独立的包裹函数所包裹

Scope housting对模块的引用次数大于1次是不产生效果的，这个其实也很好理解，如果一个模块引用次数大于1次，那么这个模块的代码会被内联多次，从而增加了打包出来的js bundle的体积。

## 代码分割和动态import

代码分割场景

1. 抽离相同代码到一个共享模块
2. 脚本懒加载，使得初始下载的代码更小，懒加载方式：

- cjs：require.ensure
- esm：动态import（目前还没有原生支持，需要babel转换）
  - 静态分析（在模块的头部import xxx from 'xxx'）
  - 动态引入（在if...else{ import('xxx')}），按需加载

3. 动态import的js代码在打包时，会被抽离出来，用到的时候才会加载这个被抽离出来的js文件，通过webpackJsonp的一个请求加载。
   （典型的通过jsonp的形式往html插入script标签），动态import（懒加载）必定会分割代码，生成新的chunk。
- prefetch (预获取)：浏览器空闲的时候进行资源的拉取
```js
import( /* webpackPrefetch: true */ './src/xxx').then(() => {})
```
- preload (预加载)：提前加载后面会用到的关键资源（谨慎使用）
```js
import(/* webpackPreload: true */ 'ChartingLibrary');
```

- preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
- preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
- preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。

### 如何动态import

- 使用@babel/plugin-syntax-dynamic-import插件，下载该插件，并在.babelrc的plugins配置插件

```js
/*
  通过js代码，让某个文件被单独打包成一个chunk
  import动态导入语法：能将某个文件单独打包
*/

// 魔法注释当注解用了，标注打包后的文件名为test
/* webpackChunkName: 'test' */  

import(/* webpackChunkName: 'test' */'./test')
  .then(({ add }) => {
    // 文件加载成功~
    // eslint-disable-next-line
    console.log(add(1, 2));
  })
  .catch(() => {
    // eslint-disable-next-line
    console.log('文件加载失败~');
  });
```

## 在webpack中使用ESLint

制定ESLint规范，检查JS

- 不重复造轮子，基于eslint:recommend配置并改进
- 能够帮助发现代码错误的规则，全部开启

<img src="/images/engineering/webpack-eslint001.png">

### ESLint如何执行落地

- 和CI/CD系统集成
- 和webpack集成
- 本地开发阶段增加precommit钩子
- 安装husky，`npm i husky -d`
- 增加npm script，通过lint-staged增量检查修改的文件

```json
{
  "scripts": {
    "precommit": "lint-staged",
  },
  "lint-staged": {
    "linters": {
        "*.{js, less}": [
            "eslint --fix", "git add"
        ],
    }
  },
}
```

- 使用eslint-webpack-plugin，构建时检查js规范

### eslint-config-airbnb的使用

- eslint-config-airbnb(react项目使用)、eslint-config-airbnb-base(其他项目)
  [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)
- 下载 `npm install eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y -d`
- 下载 `npm install babel-eslint eslint-config-airbnb -d`
  [eslint官网](http://eslint.cn/docs/user-guide/getting-started)
- eslint配置文件：.eslint.*(.eslint.js/.eslint.json/.eslint.yml)

```js
// .eslint.js
module.exports = {
    "parser": "babel-eslint", // 使用的parser是babel-eslint，需要下载安装babel-eslint
    "extends": "airbnb",  // 继承airbnb，需要安装
    "env": {   // 识别browser和node环境的一些全局变量
        "browser": true,
        "node": true
    },
    // 定义规则
    "rules": {
        "indent": ["error", 4] //indent空格， "error"错误级别、4是控制的空格数量
    }
};
```

## 优化 resolve 配置
### alias
alias 用的创建 import 或 require 的别名，用来简化模块引用，项目中基本都需要进行配置。

[优化 resolve 配置](https://juejin.cn/post/7023242274876162084#heading-25)

```js
const path = require('path')
...
// 路径处理方法
function resolve(dir){
  return path.join(__dirname, dir);
}

 const config  = {
  ...
  resolve:{
    // 配置别名
    alias: {
      '~': resolve('src'),
      '@': resolve('src'),
      'components': resolve('src/components'),
    }
  }
};

```
配置完成之后，我们在项目中就可以
```js
// 使用 src 别名 ~ 
import '~/fonts/iconfont.css'

// 使用 src 别名 @ 
import '@/fonts/iconfont.css'

// 使用 components 别名
import footer from "components/footer";
```

### extensions和modules
- 如果用户引入模块时不带扩展名，那么 webpack 就会按照 extensions 配置的数组从左到右的顺序去尝试解析模块，高频文件后缀名放前面。
- modules，告诉 webpack 解析模块时应该搜索的目录，
```js
const config = {
  //...
  resolve: {
    extensions: ['.js', '.json', '.wasm'], // webpack 默认配置
    // 手动配置后，默认配置会被覆盖，如果想保留默认配置，可以用 ... 扩展运算符代表默认配置
    // extensions: ['.ts', '...'],
    modules: [resolve('src'), 'node_modules']
  },
};

```
### resolveLoader
用于解析 webpack 的 loader 包，有自定义的 Loader 就需要配置一下，手写loader时可以用
```js
const path = require('path');
const config = {
  //...
  resolveLoader: {
    modules: ['node_modules', path.join(__dirname,'loader')]
  },
};
```
## webpack构建速度和优化体积

### 使用webpack内置的stats分析

```json
{
    "srcipts":{
        "build:stats": "webpack --env production --json > stats.json"
    }
}
```

### 速度分析：使用speed-measure-webpack-plugin

- 分析整个打包的总耗时
- 每个插件和loader的耗时情况
- 和一些Loader或者Plugin新版本会不兼容，需要进行降级处理，如mini-css-extract-plugin、html-webpack-plugin

```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasureWebpackPlugin();
module.exports = smp.wrap({
    ......
})
```

### 体积分析：使用webpack-bundle-analyzer
可以直观的看到打包结果中，文件的体积大小、各模块依赖关系、文件是够重复等问题，极大的方便我们在进行项目优化的时候，进行问题诊断

- 构建完成后会在8888端口展示大小
  <img src="/images/engineering/webpack-bundle-analyzer-001.png">
- 依赖的第三方模块文件大小
- 业务里面的组件代码大小

```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
module.exports = {
    plugins: [
      // 配置插件
      new BundleAnalyzerPlugin({
        // analyzerMode: 'disabled',  // 不启动展示打包报告的http服务器
        // generateStatsFile: true, // 是否生成stats.json文件
      })
    ]
}
```

### webpack4

webpack4: 优化原因

- V8带来的优化(for of替代 forEach、Map和Set替代 Object、includes替代indexOf)
- 默认使用更快的md4 hash 算法
- webpacks AST可以直接从loader传递给AST，减少解析时间
- 使用字符串方法替代正则表达式

### 多进程/多实例构建：资源并行解析可选方案

thread-loader

- parallel-webpack
- HappyPack（同样为开启多进程打包的工具，webpack5 已弃用）

### 多进程/多实例：并行压缩

```js
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                cache: true
            })
        ],
	minimize: true,
    },
}
```

### 优化构建速度，缩小构建目标

目的：尽可能的少构建模块，比如babel-loader不解析node_modules、减少文件搜索范围

```js
{
    test: /\.js$/,
    exclude: /node_modules/,
    // 同时使用多个loader  用use数组，多个可以直接配置
    use: [
      /* 
          开启多线程打包。 
          进程启动大概为600ms，进程通信也有开销。
          只有工作消耗时间比较长，才需要多线程打包
      */
      {
        loader: 'thread-loader',
        options: {
          workers: 2 // 进程2个
        }
      },
      {
        loader: 'babel-loader',
        options: {
          // 预设：指示babel做怎么样的兼容性处理
          presets: [
            [
              '@babel/preset-env',
              {
                // 按需加载
                useBuiltIns: 'usage',
                // 指定core-js版本
                corejs: {
                  version: 3
                },
                // 指定兼容性做到哪个版本浏览器
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17'
                }
              }
            ]
          ],
          // 开启babel缓存
          // 第二次构建时，会读取之前的缓存, 速度会更快一点
          cacheDirectory: true
        }
      }
    ],
}
```

## 无用的CSS如何删除

- PurifyCSS:遍历代码，识别已经用到的CSS class

使用purgecss-webpack-plugin，必须和mini-css-extract-plugin搭配使用

```js
const PurgecssPlugin = require('purgecss-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');
const PATHS = {
    src: path.join(__dirname, 'src')
};
module.exports = {
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new PurgecssPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
        })
    ]
}
```

- uncss: HTML需要通过jsdom加载，所有的样式通过PostCSS解析，通过document.querySelector来识别在html文件里面不存在的选择器

## prefetch 与 preload

### prefetch
prefetch (预获取)：等其他资源加载完毕，浏览器空闲了，会在使用之前，提前加载js文件
```js
/*
  通过js代码，让某个文件被单独打包成一个chunk
  import动态导入语法：能将某个文件单独打包
*/
/* webpackChunkName: 'test' */  // 魔法注释当注解用了,标注打包后的文件名为test
// 类似路由的懒加载
import(/* webpackChunkName: 'test' */'./test')

// 按需加载  必定会分割代码，生成新的chunk
img.addEventListener('click', () => {
  import( /* webpackPrefetch: true */ './desc').then(({ default: element }) => {
    console.log(element)
    document.body.appendChild(element)
  })
})
```
### preload
preload (预加载)：提前加载后面会用到的关键资源，因为会提前拉取资源，如果不是特殊需要，谨慎使用
```js
import(/* webpackPreload: true */ 'ChartingLibrary');
```
## 全局环境变量
通过 webpack 内置插件 DefinePlugin 定义 DEV 环境变量。
```js
const webpack = require("webpack");

module.exports = {
  mode: "development",
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify("dev"), // 推荐使用JSON.tringify，不仅可以处理字符串，还可以处理Object中的字符串和Array
      HELLO: 'hello world',
    }),
  ],
};

```
# 可维护的webpack构建配置

## 构建配置抽离成npm包的意义

1. 通用性

- 业务开发者无需关注构建配置
- 统一团队构建脚本

2. 可维护性

- 构建配置合理的拆分
- README文档、ChangeLog文档等

3. 质量

- 冒烟测试、单元测试、测试覆盖率
- 持续集成

## 构建配置管理的可选方案

1. 通过多个配置文件管理不同环境的构建，webpack --config 参数进行控制
2. 将构建配置设计成一个库，比如: hjs-webpack、Neutrino、webpack-blocks
3. 抽成一个工具进行管理，比如: create-react-app, kyt, nwb（团队规模大抽成一个cli）
4. 将所有的配置放在一个文件，通过--env参数控制分支选择

## 构建配置包设计

### 通过多个配置文件管理不同环境的webpack构建

- 基础配置:webpack.base.js
- 开发环境:webpack.dev.js
- 生产环境:webpack.prod.js
- SSR环境:webpack.ssr.js
- ...

### 抽离成一个npm包统一管理

- 规范: git commit日志、README、ESLint规范、Semver规范

### 通过webpack-merge组合配置

合并配置

```js
const merge = require('webpack-merge')
module.exports = merge(baseConfig, devConfig)
```

### 功能模块设计

<img src="/images/engineering/webpack-config-001.png">

### 目录结构设计

```bash
-/test # 测试代码
-/lib # 源代码
  - webpack.dev.js
  - webpack.prod.js
  - webpack.ssr.js
  - webpack.base.js
index.js
README.md
CHANGELOG.md
.eslinrc.js
package.json
```
# webpack5

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

# 参考 
- [玩转 webpack](https://time.geekbang.org/course/intro/100028901)
- [webpack知识体系](https://juejin.cn/post/7023242274876162084)
- [从v4升级到v5](https://webpack.docschina.org/migrate/5/#update-outdated-options)
- [webpack5资源模块](https://webpack.docschina.org/guides/asset-modules/)
- [webpack5资源模块的使用](https://juejin.cn/post/7023242274876162084)
- [构建webpack5知识体系](https://juejin.cn/post/7062899360995999780)