---
title: webpack笔记（一）
date: 2021-12-26 17:12:16
permalink: /工程化/webpack/webpacknotes01
categories:
  - 工程化
  - webpack
tags:
  - 工程化
  - webpack
---
# webpack笔记（一
## 为什么需要了解 Webpack？
个人认为，每个前端开发者不一定要精通 Webpack，但有必要进行了解，至少要能看得懂一个 Webpack 的配置文件，以及遇到问题时能知道是 Webpack 的问题，还是自己代码的问题。

通常来说，我们都是通过脚手架工具创建一个应用，或者加入到一个已有的项目开发中。这个时候，我们并不需要知道该怎么配置 Webpack ，只要能开发业务逻辑就可以了。我们不太需要关注源代码是通过什么编译器如何打包成最后的应用程序的，因为IDE已经帮我们把这些事情做好了。

Webpack 不仅是用于打包最终发布出去的应用程序，而且还能在开发时，为我们提供开发时服务器。它可以通过监测源代码的变化并实时编译，让我们能在代码发生变化时，及时看到运行的效果。webpack可以编译ES6语法、JSX语法，整合图片、css/less等资源，优化代码的体积。

Webpack 的配置会分为下面三个部分。
- 输入输出配置：定义你的应用程序的入口，以及打包结果输出的文件夹位置。
- 配置对于每一类资源文件的处理器：比如说，对 JavaScript 是用 babel-loader 去编译；对 less 文件则是用 less-loader 去编译；图片则用 file-loader 去处理。你在项目中能使用哪些技术或者资源，完全取决于配置了哪些 loader。
- 插件配置：除了核心的源代码编译和打包流程，Webpack 还支持插件扩展功能，可以通过插件生成额外的打包结果，或者进行一些其它的处理。比如打包过程生成 index.html，源代码分析报表，提取 CSS 到独立文件，代码压缩，等等。
```js
// 获取当前环境：process.env.NODE_ENV
// package.json的 homepage 属性会告诉 webpack 项目的路径需要打包到哪个路径下，如github路径、CDN路径
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    // 定义应用的入口点 src/app.js，并命名为 main
    main: path.resolve(__dirname, './src/app.js'),
  },
  output: {
    // 打包输出的文件名，这里将生成 main.bundle.js
    filename: '[name].bundle.js',
    // 定义打包结果的输出位置
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    // 定义处理源文件的规则，rules 下会按顺序使用匹配的规则
    rules: [
      {
        // 遇到 .js 结尾的文件则使用这个规则
        test: /\.js$/,
        // 忽略 node_modules 目录下的 js 文件
        exclude: /node_modules/,
        use: {
          // 使用 babel-loader 处理 js
          loader: 'babel-loader',
          // babel-loader 的一些选项
          options: {
            presets: ['@babel/preset-env'], //确保 Babel 能够处理 JSX 语法
          },
        },
      },
      {        
        // 检测 less 文件        
        test: /\.less$/,        
        // 使用了三个 loader，注意执行顺序是数组的倒序        
        // 也就是先执行 less-loader        
        use: ['style-loader', 'css-loader', 'less-loader'],      
      },
    ],
  },
  plugins: [
    // 使用 HtmlWebpackPlugin 生成一个 index.html，其中自动引入 js
    // 并配置了页面的 title
    new HtmlWebpackPlugin({
      title: 'Webpack Output',
    }),
  ],
};
```
代码中其实已经很直观了，我们不仅定义了输入输出，还配置了 babel-loader，用于编译 JavaScript 文件到兼容主流浏览器的代码。同时，还为 babel-loader 设置了参数 presets，例子中这个参数的值 @babel/preset-env 可以确保 Babel 能够处理 JSX 等语法。最后，我们通过一个 HtmlWebpackPlugin，来自动生成 index.html。

## 理解 loader 和 plugin
要让一个 Less 文件最终打包到目标文件中，并被浏览器运行，那么首先需要把 Less 代码转换成 Css，再通过 style 标记插入到浏览器中。
这个过程涉及到三个 loader，如下：
- less-loader：用于将 Less 代码转换成 Css。
- css-loader：用于处理 Css 中的 import、url 等语句，以便能分析出图片等静态资源打包到最终结果。
- style-loader：会自动生成代码，并将打包后的 Css 插入到页面 style 标签。这个 loader 会将 Css 打包到 js 文件中，在应用运行时，自动生成的代码再把这些 css 应用到页面上。
在 module.rules 配置项中我们增加了一条规则，用于 Less 文件的处理。并使用了三个 loader ，用于将 less 代码最终打包到 JavaScript 文件中。

为什么 CSS 代码会进入到 JavaScript 文件中呢？最终它是怎么应用到页面的呢？其实背后的过程主要是，生成的 CSS 代码会以字符串的形式作为一个模块打包到最终结果，然后在运行时由 style-loader 提供的一个函数 injectStylesIntoStyleTag ，来将这个模块加入到页面的 style 标签中，从而最终生效。

比如如下代码，就展示了 injectStylesIntoStyleTag 这个函数的核心部分：创建 style 标签。这里你不需要完全理解代码的内容，只需要知道它是用来动态使用 CSS 代码就可以了。
```js
function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });


  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }
  return st
```
通过上面的例子，你应该已经能明白 loader 的工作原理了。想要在我们的项目中使用不同的语言，只需增加相应的 loader 就行了。比如要支持 typescript，就是配置 ts-loader，要支持 Vue 就是配置 vue-loader。

在这里，我们也看到 CSS 代码之所以能进入到最终的 JavaScript 包，是因为 style-loader 做了这个事情。那么如果我们想让生成的 CSS 文件和 JavaScript 文件分开，应该如何做呢？
这就需要使用到 plugin 了。同时呢，我们还要从 rules 中去掉 style-loader 这个配置，以避免 CSS 进入到 JavaScript 文件中。

实现提取 CSS 模块到单独 CSS 文件的 plugin 是 mini-css-extract-plugin，下面的代码就展示了这个 plugin 的用法：
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.less$/,
        // 去掉 style-loader
        use: ['css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    // ...
    // 引入提取 CSS 的插件以及参数
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
    }),
  ],
};
```
这样，你只需要简单地引入 mini-css-extract-plugin 这个 plugin，就能识别到所有的 CSS 模块，完成 CSS 文件的生成了。
plugin 和 loader 的一个区别，就是 loader 主要用于处理不同类型的资源，将它们转换成模块；而 plugin 通常用于生成一些除了 JavaScript bundle 之外的一些打包结果，比如例子中的 index.html 和 css 文件。