---
title: Yolo UI前言
date: 2021-12-26 17:12:16
permalink: /项目/yolo-ui/yolo-preface
categories:
  - 项目

tags:
  - 项目
---
# Yolo UI
## 代码结构

## 样式解决方案
### 1. Inline CSS：快速写一些简单的样式
性能较差，不如直接使用CSS类名，再定义样式的性能好
```jsx
const divStyle = {
  color: 'blue',
};

function Hello() {
  return <div style={divStyle}>Hello</div>;
}
```
### 2. CSS in JS（styled Component）
不在是把css样式独立的写在css文件中，而是将css抽象到了js代码中。
不太喜欢在js中书写css样式，增加了成本和复杂度，强行把两者混在一起比较奇怪。
```js
const Button = styled.button`
color: red;
font-size: 1em;
`
```
### Less和Sass（预处理器）
提供了变量、函数、运算和继承等等，扩展性和复用性都有了很大的提升。
```
styles/
    _variables.less(各种预设变量以及可配置的设置，色彩、字体、字号)
    _mixins.less(全局的 mixins，任何预处理器的基础特性，重用各种css属性，比如添加
    box-shadow、transform)
    _functions.less(全局的 functions，用来计算，并且返回一个值，mixins没有返回。比如定义functions根据字体大小，返回它需要的margin、padding的值)
Button/
    style/
        index.less(组件单独的样式)
```
### 创建自己组件库的色彩体系
#### 系统色板
- 基础色板 + 中性色板
[中国色](http://zhongguose.com/)

#### 产品色板
- 品牌色板（primary） + 功能色板（成功success、失败danger、警告warning）
功能色彩尽量保持一致

#### Yolo组件库的色彩体系
#0069fe（primary）、#606a73（）、#15bd02（success）、#ffd300（warning）、#eb1e3d（danger）、#009bb0(info、辅助颜色)
![Yolo色彩体系](images/yolo002.png)

#### 组件库样式变量分类
- 基础色彩系统
- 字体系统
font-family、font-size、line-height、font-weight、h1-h6、超链接样式、body大小。用户通过文本来理解工作，科学的字体系统将大大提升用户的阅读体验和工作效率
- 表单
- 按钮
- 边框和阴影
- 可配置开关
- normalize.css初始化默认样式
- babel-plugin-import 是一款babel插件，它会在编译过程中将import的写法自动转换为按需引入的方式
- classnames、@types/classnames 处理类名的一个工具

## 组件的需求分析和代码

### Button组件需求分析

#### 不同的Button Type
![ButtonType](images/yolo-button-001.png)

#### 不同的Button Size
![ButtonSize](images/yolo-button-002.png)

#### Button的禁用状态
![ButtonDisabled](images/yolo-button-002.png)

#### Button大致的使用方法
```js
<Button
  size="lg"
  type="primary"
  disabled
  href=""
  className=""
  autoFocus=""
  ...
>
primary
</Button>
```

## 组件测试用例分析和编码

## 代码打包输出和发布

## CI/CD，文档的生成