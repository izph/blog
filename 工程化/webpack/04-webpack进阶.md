---
title: webpack进阶用法
date: 2021-05-06 21:51:19
permalink: /工程化/webpack/webpack-advanced
categories:
  - 工程化
  - webpack
tags:
  - 工程化
  - webpack
---

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
- lib-flexible：页面渲染时计算根元素的 font-size 值(可以使用手淘的 lib-flexible 库https://github.com/amfe/lib-flexible)
- 将 node_modules -> lib-flexible -> flexible.js 文件全部代码手动引入到 模板html 文件中

## 静态资源的内联

```bash
# raw-loader的版本是0.5.1
npm i raw-loader@0.5.1 -d
```
1. raw-loader 内联 html
```html
${require('raw-loader!./meta.html')}
```
2. raw-loader 内联JS
```html
<script>${require('raw-loader!babel-loader!../node_modules/lib-flexible/flexible.js')}</script$>
```
3. css 内联
- 方案一：借助style-loader
```js
module.exports = {
    modules: {
        rules:[
            {
                test: /\.css$/,
                /**
                 * css-loader用于处理加载.css文件，并且转换成commonjs对象
                 * style-loader将样式通过<style>标签插入到head中
                */
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            insertAt: 'top', // 样式插入到<head>
                            singleton: true, // 将所有的style标签合并成一个
                        }
                    },
                    'css-loader'
                ]
            },
        ]
    }
};
```
- 方案二：html-inline-css-webpack-plugin
```js
module.exports = {
    plugins: [
        new HTMLInlineCSSWebpackPlugin()  
    ]
};
```

## 多页面应用(PWA)
1. 页面有多个入口，多页面应用每个应用都是解耦的，多页面应用对SEO更加友好。
2. 每个页面对应一个entry，一个html-webpack-plugin，缺点是每次新增或者删除页面需要修改webpack配置
3. 解决方案：动态获取entry和设置html-webpack-plugin的数量
- 约定js入口文件放置格式为`./src/xxx/index.js`，xxx为某个特定模块的名称，html模板为index.html
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

## sourcemap


