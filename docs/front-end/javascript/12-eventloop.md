---
title: EventLoop事件循环(长话短说)
date: 2021-01-25 22:23:16
permalink: /front-end/javascript/eventLoop
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# EventLoop

Event Loop即事件循环，是指浏览器或Node的一种解决javaScript单线程运行时不会阻塞的一种机制，也就是我们经常使用异步的原理。

浏览器中的EventLoop是由 主线程、执行栈和任务队列共同构成。其中执行栈中的代码是提供给主线程调用的，而队列里面的代码是等待放入执行栈中的。将队列中的代码放到执行栈再被主线程执行的过程就是Event Loop。
任务执行的过程当然是有先后顺序的，主要分为两种：宏任务、微任务。

## MacroTask（宏任务）

script脚本的执行、setTimeout、setInterval、I/O操作（网络IO和文件IO）、UI交互事件、postMessage、
setImmediate（浏览器暂时不支持，Node.js 环境支持）

简而言之，浏览器的api就是宏任务

## MicroTask（微任务）

Promise的then、async/await、Process.nextTick（Node.js 环境）、对Dom变化监听的MutationObserver

简而言之，js的api就是微任务

![images.png](images/eventloop/eventloop01.png)

## js的事件循环
我们都知道 js是单线程的，只有当上一个任务完成之后才会继续完成下一个任务，如果前一个任务耗时很长，后一个任务就不得不一直等着，于是，所有任务可以分成两种：同步任务和 异步任务。主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为事件循环。

Javascript 有一个 main thread 主线程和 call-stack 调用栈(执行栈)，所有的任务都会被放到调用栈等待主线程执行。运行代码的过程中，将一些同步的方法放到 调用栈里等待主线程的执行，遇到异步的API，会将异步的API挂起，交由指定的异步模块处理，然后继续执行同步代码。在异步任务有了结果后（到达触发条件），根据异步模块的类型，压入指定任务队列。等待主线程空闲的时候（调用栈被清空时），主线程从 任务队列 读取这些回调（任务），放到 调用栈 等待主线程 来执行。

- 任务队列里有多个宏任务队列，微任务队列只有一个。

执行栈在执行完同步任务后，查看执行栈是否为空，如果执行栈为空，就会去执行Task（宏任务），每次宏任务执行完毕后，检查微任务(microTask)队列是否为空，如果不为空的话，会按照先进先出的规则全部执行完微任务(microTask)后，设置微任务(microTask)队列为null，然后再执行宏任务，如此循环。

- 堆栈溢出问题：递归函数没有结束判断
- 优化堆栈溢出问题：使用事件循环和异步回调

- 如果当前浏览器标签页里的JS执行出现了溢出，其他标签回受影响吗？
不会，浏览器的每个标签页是不同进程。
