---
title: webpack笔记（二）
date: 2021-12-26 17:12:16
permalink: /工程化/webpack/webpacknotes02
categories:
  - 工程化
  - webpack
tags:
  - 工程化
  - webpack
---
# Webpack笔记
```js
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css

const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

// 每次执行npm run build 会发现dist文件夹里会残留上次打包的文件，
// 这里我们推荐一个plugin来帮我们在打包输出前清空文件夹clean-webpack-plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin')


/*
  PWA: 渐进式网络开发应用程序(离线可访问)
    workbox --> workbox-webpack-plugin
*/

// 一个入口文件index.js，它又引入了其他css、js依赖文件，这些依赖最终
// 和入口文件形成一个文件，我们叫这个为chunk，也叫代码块

/*
  缓存：
    babel缓存   开起babel缓存，不然每一次都需要babel转化
      cacheDirectory: true
      --> 让第二次打包构建速度更快
      
    文件资源缓存  hash
      hash: 每次wepack构建时会生成一个唯一的hash值。只要构建，都会发送变化
        问题: 因为js和css同时使用一个hash值。
          如果重新打包，会导致所有缓存失效。（可能我却只改动一个文件）
      chunkhash：根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样

        问题: js和css的hash值还是一样的
          因为css是在js中被引入的，所以同属于一个chunk

      contenthash: 根据文件的内容生成hash值。不同的文件hash值一定不一样 
      
      维护hsah值的变化，就能知道这个文件有没有更新（就是说有没有修改这个文件的代码）

      --> 让代码上线运行缓存更好使用
*/


/* tree shaking 树摇、树震
  tree shaking：去除无用代码（去除无用的js、cssdiam） 其实就是按需导入
    没有用到的资源 就不引用、不加载
    即使在文件里面引入了，但是没有使用，也不会加载
    没有用到的资源 也不会打包的压缩文件中！

    前提：1. 必须使用ES6模块化  2. 开启production环境
    （只要满足这个两个条件，默认开启tree shaking）
    作用: 减少代码体积

    在package.json中配置 
      "sideEffects": false 所有代码都没有副作用（都可以进行tree shaking）
        问题：可能会把css / @babel/polyfill （副作用）文件干掉

      "sideEffects": ["*.css", "*.less"]  标记css、less不使用tree shaking
*/


// 定义nodejs环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production';

// 复用loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    // 还需要在package.json中定义browserslist
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [require('postcss-preset-env')()]
    }
  }
];

module.exports = {
  // 单入口
  // entry: './src/js/index.js',

  // 现在多入口，代码分割 code split
  // 有多少个入口文件，就会输出多少个bundle
  entry: {
    index: './src/js/index.js', //输出index
    test: './src/js/test.js',// 输出test
    main: './src/js/tets2.js' // 输出main  在output的filename设置[name]
  },
  output: {
    // filename: 'js/built.[contenthash:10].js', // 10位hash值
    filename: 'js/[name].[contenthash:10].js', // 10位hash值, name取原来的文件名
    path: resolve(__dirname, 'build')
  },
  // loader
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', //添加到head
          'css-loader', // 将css添加到js中
        ]
      },

      // 以下loader只会匹配一个
      // 注意：不能有两个配置处理同一种类型文件
      // 在oneOf里面只会匹配一个 处理同种文件的loader，
      { oneOf: [] },

      {
        test: /\.css$/,
        use: [
          // 创建style标签，将样式放入
          // 'style-loader', 
          // 这个loader取代style-loader。作用：提取js中的css成单独文件
          MiniCssExtractPlugin.loader,
          // 将css文件整合到js文件中
          'css-loader',
          /*
      css兼容性处理：postcss --> postcss-loader postcss-preset-env
 
      帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式
 
      "browserslist": {
        // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
        "development": [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version"
        ],
        // 生产环境：默认是看生产环境
        "production": [
          ">0.2%",
          "not dead",
          "not op_mini all"
        ]
      }
    */
          // 使用loader的默认配置
          // 'postcss-loader',
          // 修改loader的配置
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                // postcss的插件
                require('postcss-preset-env')()
              ]
            }
          }
        ]
      }, {
        test: /\.less/,
        use: [...commonCssLoader, 'less-loader']
      },
      {
        // 问题：默认处理不了html中img图片
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        // 使用一个loader
        // 下载 url-loader file-loader
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
        // 排除css/js/html资源
        // 不是use
        exclude: /\.(css|js|html|less)$/,
        loader: 'file-loader',
        options: {
          name: '[contenthash:10].[ext]',
          outputPath: 'media'
        }
      },
      /*
      语法检查： eslint-loader  eslint
        注意：只检查自己写的源代码，第三方的库是不用检查的
        设置检查规则：
          package.json中eslintConfig中设置~
            "eslintConfig": {
              "extends": "airbnb-base"
            }
          airbnb --> eslint-config-airbnb-base  eslint-plugin-import eslint
    */

      /*
  正常来讲，一个文件只能被一个loader处理。
  当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
    先执行eslint 在执行babel
*/
      {
        test: /\.js$/,
        exclude: /node_modules/,

        // 优先执行
        enforce: 'pre',

        loader: 'eslint-loader',
        options: {
          // 自动修复eslint的错误
          fix: true
        }
      },
      /*
      js兼容性处理：babel-loader @babel/core 
        1. 基本js兼容性处理 --> @babel/preset-env
          问题：只能转换基本语法，如promise高级语法不能转换
        2. 全部js兼容性处理 --> @babel/polyfill  
          问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
        3. 需要做兼容性处理的就做：按需加载  --> core-js
    */
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
    ]
  },
  plugins: [
    // plugins的配置
    // html-webpack-plugin
    // 功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（JS/CSS）
    // 需求：需要有结构的HTML文件
    new HtmlWebpackPlugin({
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
    //提取js中的css成单独文件
    new MiniCssExtractPlugin({
      // 对输出的css文件进行重命名
      filename: 'css/built.css'
    }),
    // 打包输出前清空文件夹clean-webpack-plugin
    new CleanWebpackPlugin(),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    // 离线访问PWA
    new WorkboxWebpackPlugin.GenerateSW({
      /*
        1. 帮助serviceworker快速启动
        2. 删除旧的 serviceworker
 
        生成一个 serviceworker 配置文件~
      */
      clientsClaim: true,
      skipWaiting: true
    }),
    // 告诉webpack哪些库不参与打包，同时使用时的名称也得变~
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json')
    }),
    // 将某个文件打包输出去，并在html中自动引入该资源
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, 'dll/jquery.js')
    })
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

  mode: "development",
  // 生产环境下会自动压缩js代码
  //mode: 'production',


  // 开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器~~）
  // 特点：只会在内存中编译打包，不会有任何输出
  // 启动devServer指令为：npx webpack-dev-server
  // devServer只能在 开发环境使用，生产环境不需要
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true,

    // 开启HMR功能(webpack优化配置)
    // 当修改了webpack配置，新配置要想生效，必须重新webpack服务
    hot: true // HMR只能在 开发环境使用，生产环境不需要
  },
  // 拒绝XXX包 被打包进来，再用cdn 引进来(srcipt标签引入、link引入)
  // CDN内容分发网络，分布式存放静态资源，缓解服务器压力，
  // 就近获取资源，加快访问速度
  // 我们开发过程中，如果发现某些包需要用cdn引入进来，就可以使用externals
  externals: {
    // 拒绝jQuery被打包进来
    jquery: 'jQuery'
    // jquery: '$'
  },
  devtool: 'eval-source-map' //source-map(生成)
}

/*
  source-map: 一种 提供源代码到构建后代码映射 技术 （如果构建后代码出错了，通过映射可以追踪源代码错误）

    [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

    source-map：外部, 生成xxx.js.map文件
      显示出 错误代码准确信息 和 源代码的错误位置

    inline-source-map：内联
      只生成一个内联source-map

      错误代码准确信息 和 源代码的错误位置

    eval-source-map：内联
    每一个文件都生成对应的source-map，都在eval
    错误代码准确信息 和 源代码的错误位置(文件后面会多一个hash值，print.js?8d3a)

    hidden-source-map：外部    为了隐藏源代码而诞生的
      错误代码错误原因，但是没有源代码的错误位置
      不能追踪源代码错误，只能提示到构建后代码的错误位置

    nosources-source-map：外部    为了隐藏源代码而诞生的
      错误代码准确信息, 但是没有任何源代码信息(找不到任何代码信息)

    cheap-source-map：外部
      错误代码准确信息 和 源代码的错误位置 
      只能精确的行的错误，不能精确到列
      （比如第四行只是后面的一个代码错误，但是是整行报错，而source-map可以准确提示哪一行
        的那一列出错了，同一行没错误的分号(;) 不提示错误
      ）

    cheap-module-source-map：外部
      错误代码准确信息 和 源代码的错误位置 

      有module，会将loader的source map加入

    内联 和 外部的区别：1. 外部生成了文件，内联没有 2. 内联构建速度更快

    开发环境：速度快，调试更友好
      速度快(eval>inline>cheap>...)
        eval-cheap-souce-map  (有cheap 只精确到行)
        eval-source-map
      调试更友好  
        souce-map
        cheap-module-souce-map(module会将loader的source map加入)
        cheap-souce-map

      --> eval-source-map(调试最友好)  / eval-cheap-module-souce-map(调试性能最友好)
        react脚手架默认使用的是 eval-source-map

    生产环境：源代码要不要隐藏? 调试要不要更友好
      内联会让代码体积变大，所以在生产环境不用内联，
      我们要让体积变小，就不要内联，而采用外联的方式
      nosources-source-map 全部隐藏（源码和构建后的代码都会隐藏）
      hidden-source-map 只隐藏源代码，会提示构建后代码错误信息

      --> source-map(调试友好) / cheap-module-souce-map（cheap的速度会快一点）

      
*/





/*
  后端服务器代码
  启动服务器指令：
    npm i nodemon -g
    nodemon server.js

    node server.js
  访问服务器地址：
    http://localhost:3000

*/
const express = require('express');

const app = express();
// express.static向外暴露静态资源
// maxAge 资源缓存的最大时间，单位ms
app.use(express.static('build', { maxAge: 1000 * 3600 }));

app.listen(3000);



// ES10 通过JS代码 ，将某个文件单独打包成一个chunk
import('./test').then().catch(() => { console.log('加载失败') });

/*
  通过js代码，让某个文件被单独打包成一个chunk
  import动态导入语法：能将某个文件单独打包
*/
/* webpackChunkName: 'test' */  // 魔法注释当注解用了,标注打包后的文件名为test
// 类似路由的懒加载
import(/* webpackChunkName: 'test' */'./test')
  .then(({ mul, count }) => {
    // 文件加载成功~
    // eslint-disable-next-line
    console.log(mul(2, 5));
  })
  .catch(() => {
    // eslint-disable-next-line
    console.log('文件加载失败~');
  });

// eslint-disable-next-line
console.log(sum(1, 2, 3, 4));



// 懒加载~：当文件需要使用时才加载~  initator显示的 也是 (prefetch cache) 
// 预加载 prefetch：会在使用之前，提前加载js文件
// 正常加载可以认为是并行加载（同一时间加载多个文件）

// 预加载 prefetch：等其他资源加载完毕，浏览器空闲了，再偷偷加载资源
// 预加载是刷新的时候一上来就会加载，等我们触发的时候 会获取之前的(prefetch cache)，
// 制造出了一个重新加载的假象
// initator显示的是(prefetch cache)

//  将import('./test') 放到异步函数，就是懒加载.
//  懒加载必定会分割代码，生成新的chunk
import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({ mul }) => {
  console.log(mul(4, 5));
});


// CDN用来托管静态资源，就近获取，加快访问速度，缓解服务器压力
// 还可以防止一些网络的攻击
// cdn的原理是：
// 本地DNS系统解析的时候，发现该URL对应的是一个CDN专用的DNS服务器，
// 将解析权利交给了 专门处理CDN的DNS服务处理
```