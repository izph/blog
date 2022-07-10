---
title: 【webpack】手写loader和plugin 
date: 2021-03-24 12:10:21
categories:
  - 工程化
tags:
  - Webpack
toc: true # 是否启用内容索引
comments: true
copyright: false
---
# loader

- loader的作用：loader可以看成为一个转换器，将非js/json的文件转化为可执行的JS字符串。
- loader本质上是一个函数，上一个loader处理完source之后会把处理结果传给下一个loader来处理。
- loader执行的顺序是在use数组内从右到左（从后往前）
- Compose(webpack采用的函数组合)：`compose = (f, g) => (...args) => f(g(...args))`

# 手写清除console的loader
参考文档: [手写清除console的loader](https://juejin.cn/post/7039258932845477925)

- 手写loader源码
```js
// 路径 /loaders/console-loader/index.js

/** 
 * 手写清除console的loader
 * 参考：https://juejin.cn/post/7038413043084034062
 * loader实际上就是一个函数，但他不能是一个箭头函数，因为它需要继承webpack的this。
 * 多个loader是从右向左调用，上一个loader将结果返回给下一个loader使用
 * 输入输出都是字符串或者二进制数据，在loader函数中直接返回数字类型，会报错
 */


// webpack5 已经可以通过this.query直接获取loader的options配置，所以不需要利用loader-utils工具获取
// webpack5 内置了terser-webpack-plugin，如果使用的是webpack5，同时需要自定义配置，那么仍需要安装terser-webpack-plugin
// uglifyjs-webpack-plugin只支持ES5，terser-webpack-plugin支持ES6，压缩js，清除console前缀的语句

// source：表示当前要处理的内容
const reg = /(console.log()(.*)())/g;

// Webpack5在loader的上下文中，会带有内置的this.getOptions方法
function ConsoleLoader(source) {
    const { data } = this.query;
    console.log('data', data)
    // 通过正则表达式将当前处理内容中的console替换为空字符串
    source = source.replace(reg, "")
    // 再把处理好的内容return出去，坚守输入输出都是字符串的原则，并可达到链式调用的目的供下一个loader处理
    return source;
}

module.exports = ConsoleLoader;
```
- 在webpack.config.js中使用该loader
```js
const path = require('path');
module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    // path.resolve(__dirname, 'loaders/console-loader/index.js')
                    loader: 'console-loader',
                    options: {
                        data: "console-loader"
                    }
                }
            }
        ]
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'loaders')]
    }
}
```
# plugin

plugins是增强webpack功能，打包输出js文件（bundle）的一个优化，作用于整个构建过程。可以理解为任何loader没办法做的事情，都可以用plugins去完成。

# 手写一个md转成html的plugin

## 如何创建 Plugin

参考：[手把手带你入门WebpackPlugin](https://juejin.cn/post/6968988552075952141)

```js
const pluginName = 'md-to-html-plugin';

class MdToHtmlPlugin {
    apply(compiler) {
        // 代表开始读取 records 之前执行
        compiler.hooks.emit.tap(pluginName, (compilation) => {
            console.log("webpack 构建过程开始！");

            // _assets 打包的资源详情
            const _assets = compilation.assets;
        });
    }
}
```

- compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；
- webpack会提供一个apply方法，接受一个编译器compiler，编译的时候都是在apply里执行，是执行具体的插件方法。
- apply 方法的入参注入了一个 compiler 实例，compiler 实例是 Webpack 的支柱引擎，代表了 CLI 和 Node API 传递的所有配置项。
- compiler会有钩子hooks，钩子hooks会有一个发布器emit（类似node的EmitterEvent发布订阅）
  tap第一个参数是插件的名字，第二个参数是回调函数，回调函数的参数是一个compilation。
- compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 compilation 将被创建。compilation 对象也提供了很多事件回调供插件做扩展。通过 compilation 也能读取到 Compiler 对象。Compilation 上的assets可以用于文件写入，可以将资源设置到compilation.assets对象上。
- Hook 上还暴露了 3 个方法供使用，分别是 tap、tapAsync 和 tapPromise。这三个方法用于定义如何执行 Hook，比如 tap 表示注册同步 Hook，tapAsync 代表 callback 方式注册异步 hook，而 tapPromise 代表 Promise 方式注册异步 Hook。

## 常见Complier Hooks

参考: [webpack](https://www.webpackjs.com/api/compiler-hooks/?fileGuid=3tGHdrykRgwCyTP8)

|  Hook  |      type      |                调用                |
| :-----: | :-------------: | :---------------------------------: |
|   run   | AsyncSeriesHook |        开始读取 records 之前        |
| compile |    SyncHook    | 一个新的编译 (compilation) 创建之后 |
|  emit  | AsyncSeriesHook |     生成资源到 output 目录之前     |
|  done  |    SyncHook    |       编译 (compilation) 完成       |

## 实现MdToHtmlPlugin

### 1、创建MdToHtmlPlugin

在根目录下创建plugin文件夹，在plugin下新建md-to-html-plugin文件夹，并在该文件夹下新建index.js入口文件，compiler.js文件，constant.js声明常量文件，util.js公共方法文件，template.html模板文件

#### index.js文件

```js
const { readFileSync } = require('fs');
const { resolve, dirname, join } = require('path');
const { compileHTML } = require('./compiler');
const { TEMPLATE_MARK, PLUGIN_NAME } = require('./constant');

class MdToHtmlPlugin {
  constructor({ template, filename }) {
    // 没传template
    if (!template) {
      throw new Error('Please input the markdown template file');
    }
    this.template = template;
    // 没传filename 默认为 index.html
    this.filename = filename ? filename : 'index.html';
  }
  apply(compiler) {
    // tap第一个参数是插件的名字，第二个参数是回调函数，回调函数的参数是一个compilation
    compiler.hooks.emit.tap(PLUGIN_NAME, (compilation) => {

      // _assets 打包的资源详情
      const _assets = compilation.assets;

      // fs的api readFileSync 同步读取文件 readFile是异步的
      const templateContent = readFileSync(this.template, 'utf-8'); // 目录文件，编码方式

      // 将templateContent（md文件的内容） 变为数组
      const templateContentArr = templateContent.split('\n');

      // 核心方法： 将数组内容 编译为 html标签   
      const { htmlStr, staticSource } = compileHTML(templateContentArr);

      // 找到当前目录下的template.html
      const templateHtml = readFileSync(resolve(__dirname, "template.html"), 'utf-8');

      // 将template.html的模板字符串替换
      const fileHtml = templateHtml.replace(TEMPLATE_MARK, htmlStr);

      // _assets增加资源，this.filename 就是_assets的一个属性
      _assets[this.filename] = {
        //  source不是一个普通的函数，它会把放到_assets[this.filename]对象中
        //  将资源放到我们定义filename的html文件中
        source() {
          return fileHtml;
        },
        // 资源的长度  
        size() {
          return fileHtml.length;
        }
      }

      // 处理静态文件
      if (staticSource && staticSource.length > 0) {
        // 获取md文件所在的目录
        const tplDirName = dirname(this.template);
        staticSource.map((staticItem) => {
          const { filename, staticPath } = staticItem;
          // 拼接md文件引用的静态资源路径
          const staticsourcepath = join(tplDirName, staticPath);
          // 读取静态资源
          const statics = readFileSync(staticsourcepath);
          // _assets增加资源
          _assets[`${filename}`] = {
            source() {
              return statics;
            },
            size() {
              return statics.length;
            }
          }
        })
      }

    })
  }
}

module.exports = MdToHtmlPlugin;
```

#### index.js中做了哪些事件？

- 读取md文件，用到了node内置模块fs的方法，将md内容存到为数组中；
- 将数组传入编译文件compiler的compileHTML中进行编译，返回html字符串和静态资源的路径，htmlStr如下：
  ![htmlStr](images/engineering/mdtohtml009.png)
- 读取template模板html文件，将文件内的模板替换为htmlStr
- 最后把html文件和静态资源放到_assets中，交由webpack处理

### 2、compiler模板编译文件

```js
// compiler.js
const { guid } = require('./util');
const { basename } = require('path');
const {
  REG_MARK,
  REG_TITLE,
  REG_ORDER,
  REG_DISORDER,
  REG_LINK,
  REG_IMG,
  TAGTYPE_SIMPLE,
  TAGTYPE_NESTING,
  REG_LINK_STYLE
} = require('./constant');

function createTree(tplArr) {
  // 存放结果
  let htmlTree = {};

  // 上一个标识符
  let lastMark = '';

  let uid = 0;

  // 字符串相关的东西最好不要做封装，老老实实的写最好，不同的标签有不同的处理方法
  tplArr.forEach((tplItem) => {
    // 去掉\r回车的影响
    tplItem = tplItem.replace(/\r/, '');

    // 正则
    const matched_mark = tplItem.match(REG_MARK);
    const matched_link = tplItem.match(REG_LINK);
    const matched_img = tplItem.match(REG_IMG);

    // 匹配到md语法，不为空
    if (matched_mark) {
      // matched_mark[1]就是去掉空格的 md标识
      const mark = matched_mark[1];

      // input就是匹配到的md语法，input: '# h1标题\r'
      const input = matched_mark['input'];

      // 匹配到#号的
      if (REG_TITLE.test(mark)) {

        // 根据#号的个数  判断是h几
        const tag = `h${mark.length}`;

        //将'# h1标题\r'中的'# '干掉，最终得到'h1标题\r'
        const tagContent = input.replace(REG_MARK, '')

        // REG_TITLE.test(lastMark)
        if ((lastMark === mark)) {
          htmlTree[tag].children = [...htmlTree[`${tag}-${uid}`], `<${tag}>${tagContent}</${tag}>`]
        } else {
          lastMark = mark;
          uid = guid();
          htmlTree[`${tag}-${uid}`] = {
            type: TAGTYPE_SIMPLE,
            children: [`<${tag}>${tagContent}</${tag}>`]
          }
        }
      }

      // 无序列表
      if (REG_DISORDER.test(mark)) {
        //将'- ul第一项\r'中的'- '干掉，最终得到'ul第一项\r'
        const tagContent = input.replace(REG_MARK, '');
        const tag = `li`;
        // 上一个是不是`-`
        if (REG_DISORDER.test(lastMark)) {
          // '- ul第i项\r' 放到一起
          htmlTree[`ul-${uid}`].children = [...htmlTree[`ul-${uid}`].children, `<${tag}>${tagContent}</${tag}>`]
        } else {
          uid = guid();
          lastMark = mark;
          // 加一个随机后缀key
          htmlTree[`ul-${uid}`] = {
            type: TAGTYPE_NESTING, // 外层需要一个ul
            children: [`<${tag}>${tagContent}</${tag}>`]
          }
        }
      }

      // 有序列表  是不是以数字开头的，如果是数字开头，没有.呢？
      if (REG_ORDER.test(mark)) {
        const tagContent = input.replace(REG_MARK, '');
        const tag = `li`;
        if (REG_ORDER.test(lastMark)) {
          htmlTree[`ol-${uid}`].children = [...htmlTree[`ol-${uid}`].children, `<${tag}>${tagContent}</${tag}>`]
        } else {
          lastMark = mark;
          uid = guid();
          htmlTree[`ol-${uid}`] = {
            type: TAGTYPE_NESTING,
            children: [`<${tag}>${tagContent}</${tag}>`]
          }
        }
      }
    } else if (matched_link) { // 超链接的处理
      // '百度'
      const link_title = matched_link[1];
      // 'http://www.baidu.com'
      const link_href = matched_link[2];
      // '[百度](http://www.baidu.com)'
      const input = matched_link['input'];
      const tag = `a`;
      uid = guid();
      htmlTree[`${tag}-${uid}`] = {
        type: TAGTYPE_SIMPLE,
        children: [`<${tag} href="${link_href}" target="_blank" style="${REG_LINK_STYLE}">${link_title}</${tag}>`]
      }
    } else if (matched_img) { // 图片的处理
      const tag = `img`;
      // '图片'
      const img_title = matched_img[1];
      // 'public/testimages.png'
      const img_src = matched_img[2];
      // 'testimages'
      const img_file = basename(img_src);
      uid = guid();
      htmlTree[`${tag}-${uid}`] = {
        type: TAGTYPE_SIMPLE,
        staticResources: {
          filename: img_file,
          staticPath: img_src
        },
        children: [`<${tag} src="./${img_file}"  alt="${img_title}"></${tag}>`]
      }
    }
  })

  return htmlTree;
}

// 转成树形结构 或者AST
function compileHTML(templateContentArr) { // templateContentArr数组内容
  // 转成树形结构
  const htmlTree = createTree(templateContentArr)

  // static资源
  const staticSource = [];

  // 拼接结果
  let htmlStr = '';

  // 保存当前遍历到的 key
  let currItem;
  for (let key in htmlTree) {
    currItem = htmlTree[key];
    htmlTree[key]?.staticResources && staticSource.push(htmlTree[key]?.staticResources)
    // 等于single，直接拼接
    if (currItem.type === TAGTYPE_SIMPLE) {
      currItem.children.forEach(tag => {
        htmlStr += tag;
      });
    } else if (currItem.type === TAGTYPE_NESTING) { // 外层要套一个标签的，不能直接拼接
      // 获取外层的标签，就是htmlTree的key
      const outerTag_Start = `<${key.split('-')[0]}>`;
      const outerTag_End = `</${key.split('-')[0]}>`;
      let currStr = "" + outerTag_Start;
      currItem.children.forEach(tag => {
        currStr += tag;
      })
      // 结束标签
      currStr += outerTag_End;

      htmlStr += currStr;
    }

  }

  return { htmlStr, staticSource };
}

module.exports = {
  compileHTML
}
```

#### compiler做了什么？

1. compileHTML方法中，调用createTree方法将数组转化为树形结构，htmlTree如下：
   ![htmlTree](images/engineering/mdtohtml008.png)
2. createTree的作用

- 遍历数组，匹配不同的md标识符，如 `#`号代表标题，`(num.)`代表有序列表，`(-)`代表无序列表，`![]()`代表图片标识等，对不同的标识做不同的处理，如果是列表，需要在外层嵌套ul、ol。匹配md标识，用到了正则表达式。
- 如果是超链接，则设置a标签，设置a标签默认样式，href属性。
- 如果是图片，则设置img标签，获取图片的路径，设置src、alt等属性。
- 最后返回htmlTree

3. 遍历htmlTree的所有value，如果是simple类型，则直接拼接结果，如果是nesting类型，则需要在外面嵌套ol、ul
4. 最后返回处理结果htmlStr、staticSource。

### 3、其他文件说明

#### constant.js

```js
// 以空字符串开头，以空格结尾，找到里边的所有字符
const REG_MARK = /^(.+?)\s/;
// 以#号开头的，最终转化成h标签，有可能是1个、2个、3个。。。
const REG_TITLE = /^\#/;

// 以数字开头 有序列表
const REG_ORDER = /^\d/;

// 以-开头的  最终转化成li
const REG_DISORDER = /^\-/;

// 匹配 []() 超链接
const REG_LINK = /^\[(.+?)\]\((.+?)\)$/;

// 匹配 []() 超链接
const REG_IMG = /^\!\[(.+?)\]\((.+?)\)$/;

// 简单类型
const TAGTYPE_SIMPLE = 'simple';

// 需要嵌套包裹
const TAGTYPE_NESTING = 'nesting';

// 超链接默认样式
const REG_LINK_STYLE = `color: #3489fd;font-weight: 500;text-decoration: none;`

// 需要替换 模板html文件里的字符串
const TEMPLATE_MARK = '<!--templateString-->';

// 插件名称
const PLUGIN_NAME = 'md-to-html-plugin';

module.exports = {
    REG_MARK,
    REG_TITLE,
    REG_ORDER,
    REG_DISORDER,
    REG_LINK,
    REG_IMG,
    TAGTYPE_SIMPLE,
    TAGTYPE_NESTING,
    REG_LINK_STYLE,
    TEMPLATE_MARK,
    PLUGIN_NAME
}
```

#### template.html

![template.html](images/engineering/mdtohtml010.png)

#### util.js

```js
// 生成uid
function guid() {
    let res = "";
    for (let i = 1; i <= 8; i++) {
        let n = Math.floor(Math.random() * 16.0).toString(16);
        res += n;
    }
    return res;
}
module.exports = {
    guid
}
```

### 4、创建webpack.config.js文件

在根目录下新建notebook.md，并写入简单的md标记，引入MdToHtmlPlugin插件，
配置MdToHtmlPlugin的template和filename

```js
const { resolve } = require('path')
const MdToHtmlPlugin = require('./plugins/md-to-html-plugin');

const config = {
    // 模式
    mode: "development",
    // 入口文件
    entry: resolve(__dirname, 'src/app.js'),
    output: {
        path: resolve(__dirname, 'dist'),
        filename: "app.js"
    },
    // 配置自定义插件
    plugins: [
        new MdToHtmlPlugin({
            template: resolve(__dirname, 'notebook.md'), // 我们需要解析的文件
            filename: 'notebook.html' // 解析后的文件名
        })
    ]
}

module.exports = config;
```

notebook.md文件内容如下：
![notebook.png](images/engineering/mdtohtml011.png)

### 5、调试和运行

- 执行 `npm run build`
- 在dist文件夹下输出打包后文件
- 打开notebook.html看结果
  ![notebook.html](images/engineering/mdtphtml012.png)



