---
title: npm安装命令的区别
date: 2021-03-15 22:13:16
permalink: /前端/JavaScript/npminstall
categories:
  - node
tags:
  - node
---
# npm安装命令的区别

## npm i xxx -g

- 是npm install xxx --global的简写，对模块进行全局安装。
- 全局安装，是指把模块安装到操作系统上，全局是指操作系统，全局安装完成后，一般会安装到AppDataAppData\Roaming\npm目录下。如：npm install webpack -g，就是全局安装webpack，在操作系统的任何一个目录下都可以使用webpack所提供的指令。

node安装教程和更改全局模块的安装路径可参考：[Node.js的安装及环境配置](https://blog.csdn.net/weixin_42881768/article/details/105028164)

## npm i xxx -s

是npm install xxx --save的简写，对模块进行局部安装，模块写入到package.json的 dependencies对象。

- 模块一般安装到项目文件夹下的node_modules文件夹下。
- dependencies对象，这个与devDependencies不同，是需要发布到生产环境中的，就比如你要跑一个基于react的项目，所以需要react来支持，react模块就需要跟随项目到最终的生产环境。npm i react -s即可将react模块安装到项目的依赖中，并一同发布到生产环境。

## npm i xxx -d

是npm install xxx --save-dev的简写，对模块进行局部安装，模块写入到 devDependencies 对象

- 模块一般安装到项目文件夹下的node_modules文件夹下
- devDependencies对象，是我们开发的时候需要用到的一些包，只用于开发阶段，真正打包上线的时候并不需要这些包，因为这些工具只是你用来打包代码的，是用来识别特定文件以及代码，帮助我们生产最终文件的。
