---
title: Node 知识梳理（一） 
date: 2022-01-05 22:15:33
categories:
  - 前端
tags:
  - Node
toc: true # 是否启用内容索引
comments: true
copyright: false
---
- Node 是一个基于谷歌V8引擎的一个JavaScript运行环境（runtime运行时），是服务端的运行环境。
- Node 的特点是事件驱动、非阻塞式 I/O（input/output）、单线程。触发一次事件，执行回调，是事件驱动的一种体现。

# Node的使用场景

- I/O 密集型场景
- 提供http接口，组装数据
- RPC服务，RPC（Remote Procedure Call远程过程调用），RPC服务也是采用的TCP，出名的RPC服务有Google的gRPC、阿里的Dubble
- 基础工具：构建工具（webpack、vite）、搭建脚手架（cra、vue-cli、umi）等
- BFF：接口聚合、转发
- Serverless（无服务器架构）：函数即服务，写一个函数就可以实现一个 API 接口给到前端
- Microservices（微服务）：小型服务、以独立进程运行、可以使用不同语言

# Node.js 架构（node底层原理）

1. Node.js内置模块（标准库）： http、fs、buffer、path、stream。
2. Node bindings（桥梁）：是JavaScript与 C++ 连接的桥梁，对底层模块进行封装，为内置模块的提供 API 接口。
3. Node底层模块
- V8：Google开源的高性能JavaScript引擎，使用 C++ 开发，并且应用于谷歌浏览器
- Libuv：提供Event Loop 事件循环和线程池，提供事件驱动的 I/O 库。它是使用 C 和 C++ 语言为 Node.js 所开发的，同时也是 I/O 操作的核心部分，例如读取文件和 OS 交互（几乎所有和操作系统打交道的部分离不开libuv的支持）
- C-ares（异步 DNS 解析库）
- Low-Level Components：提供了http 解析、OpenSSL、数据压缩（zlib）等功能。

# Node EventLoop（事件循环）

node中的事件循环的顺序：
外部输入数据(incoming) --> 轮询阶段(poll) --> 检查阶段(check)--> 关闭事件回调阶段(close callbacks) --> 定时器检测阶段(timers) --> I/O事件回调阶段(I/O callbacks) --> 闲置阶段(idle, prepare) --> 轮询阶段(按照该顺序反复运行)

每个阶段都有一个先入先出的队列，这个队列存有要执行的回调函数

```js
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     I/O callbacks         │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```
## Node事件循环各阶段概述

绝大部分异步任务都是在timers、poll、check这3个阶段处理的。
1. timers 这个阶段执行 setTimeout() 和 setInterval() 的回调，并且是由 poll 阶段控制的。 在 Node 中定时器指定的时间也不是准确时间，只能是尽快执行，如果操作系统很忙，那么计时器的回调函数就会被推迟执行
2. I/O callbacks 处理一些上一轮循环中的少数未执行的 I/O 回调（执行一些系统操作的回调函数）
3. 闲置阶段：idle（空闲），prepare 仅在内部使用。
4. poll（轮询阶段）：处理大部分的事件，如看看有没有文件可以读，有没有请求可以处理，检查一下最近的计时器，看看有没有需要过会儿去执行的 callback。poll 是一个至关重要的阶段，这一阶段中，系统会做两件事情
  - 回到 timer 阶段执行回调
  - 执行 I/O 回调

并且在进入该阶段时如果没有设定了 timer 的话，会发生以下两件事情

- 如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
- 如果 poll 队列为空时，会有两件事发生

  - 如果有 setImmediate 回调需要执行，poll 阶段会停止并且进入到 check 阶段执行回调
  - 如果没有 setImmediate 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去
5. check（检查） 执行 setImmediate() 的回调
6. close callbacks 执行 socket 的 close 事件回调，例如：`socket.on('close', ...)`，如果队列是空的，则跳过

Node 不会一直循环循环，如果发现没什么事儿做，就会停留在 poll（轮询）阶段，大部分事件都在 poll 阶段被处理，如文件、网络请求等

# 进程和线程

1. 进程

- 进程可以说是计算机系统进行资源分配和调度的基本单位，启动一个服务、运行一个应用，就是开一个进程，进程是线程的容器。
- 例如 Java 里的 JVM 本身就是一个进程，Node.js 里通过 node app.js 开启一个服务进程。在任务管理器查看任务进程，Nodejs JavaScript Runtime
<img src="/images/front_end/nodejs-runtime001.png" >
- 一个进程无法访问另外一个进程里定义的变量、数据结构，只有建立了 IPC 通信，进程之间才可数据共享。
- 同一块代码，可以根据系统CPU核心数启动多个进程，每个进程都有属于自己的独立运行空间，进程之间是不相互影响的。

2. 线程

- 线程是属于进程的，进程可以调用线程去执行一些子任务，一个进程是可以拥有多个线程的。
- 同一进程中的多条线程可以共享该进程中的全部系统资源。
- 同一进程中的多个线程有各自的调用栈（call stack），本地存储（thread-local storage)等。
- 线程可以分为单线程（JavaScript）和多线程（Java）。

3. 单线程

- 单线程就是一个进程只开一个线程，Javascript 就是属于单线程，程序顺序执行，前面一个执行完之后，后面才可以执行。
- 在使用单线程编码时不要有过多耗时的同步操作，否则线程会造成阻塞，导致后续响应无法处理，适当地使用异步操作。

4. 多线程

- 多线程就是，一个进程可以开启多线程，Java 就是多线程编程语言的一种，可以有效避免代码阻塞导致的后续请求无法处理。
- 多线程创建新的线程来切换开销，由于每创建一个线程就会占用一定的内存，当应用程序并发大了之后，内存将会很快耗尽。

# Node模块机制
1. Node.js 模块采用Commonjs规范，Node.js的系统模块采用了延迟加载的策略，只有在用到的情况下，系统模块才会被加载，加载完成后会放到 binding_cache缓存中。
2. 在 Node.js 中模块加载一般会经历 3 个步骤，路径分析、文件定位、编译执行。按照模块的分类，按照以下顺序进行优先加载：
- 如果有 `./`从当前目录查找，相对路径文件模块
- 如果没有 `./`，先从系统模块，再从node_modules下查找 （[nodejs模块系统](https://blog.csdn.net/gongch0604/article/details/111748684)）
- 系统缓存：模块被执行之后会进行缓存，首先是先进行缓存加载，判断缓存中是否有值（require.cache查看已缓存的模块，返回值为对象）。因为 Node.js 默认先从缓存中加载模块，一个模块被加载一次之后，就会在缓存中维持一个副本，如果遇到重复加载的模块会直接提取缓存中的副本，也就是说在任何时候每个模块都只在缓存中有一个实例。
- 系统模块：也就是原生模块，这个优先级仅次于缓存加载，部分核心模块已经被编译成二进制，省略了 路径分析、文件定位，直接加载到了内存中，系统模块定义在 Node.js 源码的 lib 目录下，可以去查看。
- 文件模块（开发者自己编写的模块）：优先加载 `.`、`..`、`/` 开头的，如果文件没有加上扩展名，会依次按照 `.js`、`.json`、`.node` 进行扩展名补足尝试，那么在尝试的过程中也是以同步阻塞模式来判断文件是否存在，从性能优化的角度来看待，`.json`、`.node`最好还是加上文件的扩展名。
- 目录做为模块：这种情况发生在文件模块加载过程中，也没有找到，但是发现是一个目录的情况，这个时候会将这个目录当作一个包来处理，Node 这块采用了 Commonjs 规范，先会在项目根目录查找 package.json 文件，取出文件中定义的 main 属性 `("main": "lib/index.js")` 描述的入口文件进行加载，也没加载到，则会抛出默认错误: `Error: Cannot find module 'lib/index.js'`
- node_modules 目录加载：对于系统模块、路径文件模块都找不到，Node.js 会从当前模块的父目录进行查找，直到系统的根目录

# Node常用模块

|模块名称 | 功能描述|
|:-:|:-:|
| buffer | 实现数据缓冲区，Buffer一般用于处理二进制数据，也可以处理字符编码|
| child_process| （实现多进程任务）创建子进程，实现子进程和主进程之间的通信|
| cluster | 可以简化`多进程`、`并行化`程序的开发难度，利用多核CPU 实现并行，轻松构建一个用于负载均衡的集群。著名的pm2模块就使用了cluster实现|
| console| 和浏览里的用法一样，比如console.log、console.dir等
|crypto|对OpenSSL里的 HMAC、Cipher、Decipher等算法进行加解密封装，一般用户在进行密码处理时都会用到该模块|
|dns|域名解析，主要API是 lookup和 resolve|
| events| 事件处理，EventEmitter的核心功能就是对事件触发和事件监听器功能进行封装|
| fs|文件系统模块，主要针对目录、文件进行操作，开发中使用极其广泛| 
| http | Node.js里使用多的模块，可以非常构建Web应用服务，搭建HTTP服务端和客户端，是Web框架的底层核心库| 
| http2| 下一代HTTP协议，在Node.js 8里是需要通过flag开启的体验功能|
| https| HTTPS实现，是HTTP的安全加强版| HTTPS的安全基础是SSL，在架构选择上，可以通过Nginx实现，也可以在 Node.js应用层上实现|

## process全局对象

Node.js 中的进程 process 是一个全局对象，无需 require 直接使用（global.process = process），process对象是EventEmitter的实例

- process.title：终端上显示的标题
- process.version：nodejs的版本号
- process.versions：nodejs依赖模块的版本信息
- process.env：环境变量，例如通过 `process.env.NODE_ENV` 获取不同环境项目配置信息，还可以往`process.env`上挂载其他常量。
- process.nextTick：表示在事件循环（EventLoop）的下一次循环中调用 callback 回调函数，要注意的是它总会在I/O操作（比如查询数据）之前先执行
- process.pid：获取当前进程id
- process.ppid：当前进程对应的父进程
- process.cwd()：获取当前进程工作目录
- process.argv: 返回当前命令行指令参数，是一个数组，`process.argv[2]`
- process.execPath：获取当前进程的这个可执行文件的绝对路径
- process.exit([code])：终止当前进程并返回给定的 code，默认是0
- process.exitCode：可以自定义退出进程时node shell捕获到的状态码（可以自定义退出进程时node shell捕获到的状态码）
- process.chdir(directory)：改变进程的当前进程的工作目录（该目录必须已存在），若操作失败则抛出异常
- process.platform：获取当前进程运行的操作系统平台
- process.uptime()：当前进程已运行时间，例如：pm2 守护进程的 uptime 值
- process.moduleLoadList：当前进程已加载的模块列表，nodejs模块系统。NativeModule原生模块
- process.config：当前nodejs构建时使用的配置信息，可以辅助定位
- `process.on('exit', callback)`：当进程将要退出时触发。 'exit'的回调结束后，主进程将不再运行
- `process.on('SIGINT', callback)`：捕获当前进程接收到的信号
- process.abort()：触发node的abort事件，退出当前进程，执行该函数后，后面的代码不执行。
- `process.kill(pid, [signal])`：结束对应某pid的进程并发送一个信号
- 进程事件：`process.on('uncaughtException', cb)` 捕获异常信息、`process.on('exit', cb)`进程推出监听
- 三个标准流：process.stdout 标准输出、process.stdin 标准输入、process.stderr 标准错误输出

### process.env

process.env属性返回一个包含用户环境信息的对象。在node环境中，当我们打印process.env时，发现它并没有NODE_ENV这一个属性。实际上，process.env.NODE_ENV是在package.json的scripts命令中注入的，也就是NODE_ENV并不是node自带的，而是由用户定义的，至于为什么叫NODE_ENV，应该是约定成俗的吧。



## child_process（创建子进程）
Node.js 提供了 child_process 内置模块，用于创建子进程

- child_process.spawn()：适用于返回大量数据，例如图像处理，二进制数据处理。
- child_process.exec()：适用于小量数据，maxBuffer 默认值为 200 * 1024 超出这个默认值将会导致程序崩溃，数据量过大可采用 spawn。
- child_process.execFile()：类似 child_process.exec()，区别是不能通过 shell 来执行，不支持像 I/O 重定向和文件查找这样的行为
- child_process.fork()：衍生新的进程，进程之间是相互独立的，每个进程都有自己的 V8 实例、内存，系统资源是有限的，不建议衍生太多的子进程出来，通长根据系统 CPU 核心数设置。

## path

主要作用就是处理文件的目录和路径，在前端项目webpack配置文件中经常用到。

### path.join()

拼接多个路径片段，还原成完整可用路径

```js
path.join('a/b', 'c', 'index.html'); // a/b/c/index.html
path.join('/a/b', 'c', 'index.html'); // /a/b/c/index.html
path.join('a/b', 'c', '../', 'index.html'); // a/b/index.html
```
### path.resove()
返回一个绝对路径
```js
path.resove(); // 获取绝对路径
path.resove(__dirname, 'c', 'index.html');
```
### basename()
获取路径中基础名称
```js
path.basename(__filename); // test.js
// 传入第二个参数如果匹配会省略后缀，不匹配仍旧返回真实的后缀
path.basename(__filename, '.js'); // test
path.basename('/a/b/c'); // c
path.basename('/a/b/c/'); // c
```
### path.extname()
获取路径中的扩展名称
```js
path.extname('/src/index.html'); // .html
```
### path.parse()
解析路径
```js
const obj = path.parse('/src/index.html');
/**
* root: /
* dir: /src
* base: index.html
* ext: .html
* name: index
*/
```
## fs(读取文件)

## events（事件模块）
- 在 Node.js 中一个很重要的模块 Events（EventEmitter 事件触发器），EventEmitter 本质上就是观察者模式的实现。net、http、fs、stream、process 等模块，express、koa 框架都依赖了Events。
- EventEmitter 对象的事件触发 emit 和监听 on 是同步的，事件的回调是异步的。
- 在 Node.js 的事件机制中主要有三类角色: 事件(Event)、事件发射器(EventEmitter)、事件监听器(Event Listener)。

### Event

- EventEmitter 提供了 `on()`、`once()`、`removeListener()` 等方法来对事件进行监听移除，可同时注册多个同名的事件。其中`once()`: 当触发多次相同名称事件，通过 once 添加的侦听器只会执行一次。

- EventEmitter 会按照监听器注册的顺序**同步**地调用所有监听器，所以必须确保事件的排序正确。提前触发未监听的事件，不会报错，并且不会执行监听的回调函数。

```js
// 基本使用
const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();
emitter.on("起床", function(time) {
    console.log(`早上 ${time} 开始起床，新的一天加油！`)
});
emitter.emit("起床", "6:00");

// 在 Koa 中 new 一个 app 对象，通过 app.emit() 触发一个事件，实现在整个系统中进行传递。
const Koa = require('koa');
const app = new Koa();
app.on("koa", function() {
    console.log("在 Koa 中使用 EventEmitter");
});
app.emit("koa");

// 通过Object.setPrototypeOf() 来实现的继承
function MyEmitter(){
    EventEmitter.call(this);
}
Object.setPrototypeOf(MyEmitter.prototype, EventEmitter.prototype);
Object.setPrototypeOf(MyEmitter, EventEmitter);
```
- 默认情况下，如果为特定事件添加了超过 10 个监听器，则 EventEmitter 会打印一个警告。 但是，并不是所有的事件都要限制 10 个监听器。 `emitter.setMaxListeners()` 方法可以为指定的 EventEmitter 实例修改限制。

```js
// 操作最大事件监听个数
// 设置同类型事件监听最大个数
EventEmitter.prototype.setMaxListeners = function (count) {
    this._count = count;
}

// 获取同类型事件监听最大个数
EventEmitter.prototype.getMaxListeners = function () {
    return this._count || EventEmitter.defaultMaxListeners;
}
```
### error事件

当EventEmitter 实例出错时，应该触发error事件。如果没有为error事件注册监听器，则当error事件触发时，会抛出错误、打印堆栈跟踪，并退出Node.js进程。

```js
const EventEmitter = require ('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter ();
// 模拟触发error事件
myEmitter.emit('error', new Error('错误信息')); // 抛出错误

myEmitter.emit('error', (err) => {
	console.log(err))
}); 

```
## Buffer（缓冲区）
- Buffer 用于读取或操作二进制数据流，将数据缓冲起来，它是临时性的，对于流式数据，会采用缓冲区将数据临时存储起来。
- 如用于操作网络协议、数据库、图片和文件I/O 等一些需要大量二进制数据的场景，专门存放二进制数据的缓存区。
- Buffer 作为存在于全局对象上，使用时无需 require 引入模块即可使用。
- Buffer 在创建时大小已经被确定且是无法调整的，在内存分配这块 Buffer 是由 C++ 层面提供而不是 V8。

### Buffer应用场景

Buffer的应用场景有以下几种。

- 在使用net或 http模块来接收网络数据时，可用 Buffer作为数据结构进行传输，即 data事件的参数。
- 用于大文件的读取和写入。以前fs读取的内容是string，后来都改用Buffer，在大文件读取上，性能和内存有明显优势。
- 用于字符转码、进制转换。Unicode 编码虽然能满足绝大部分场景，但有时候还是不够的，由于Node.js内置的转换编码并不支持GBK，因此如果要处理编码为GBK的文档，就需要iconv和 iconv-lite来补充一部分，string decoder模块提供了一个 API，用于把 Buffer对象解码成字符串，但会保留编码过的多字节UTF-8与UTF-16字符。
- 用作数据结构，处理二进制数据，也可以处理字符编码。

## Buffer与字符串的传输速度

buffer比string快。在 HTTP 传输中传输的是二进制数据，上面例子中的 /string 接口直接返回的字符串，这时候 HTTP 在传输之前会先将字符串转换为 Buffer 类型，以二进制数据传输，通过流（Stream）的方式一点点返回到客户端。但是直接返回 Buffer 类型，则少了每次的转换操作，对于性能也是有提升的。在一些 Web 应用中，对于静态数据可以预先转为 Buffer 进行传输，可以有效减少 CPU 的重复使用（重复的字符串转 Buffer 操作）。

## buffer模块与Buffer的关系

Buffer是全局global上的一个引用，指向的其实是buffer.Buffer

```js
const buffer = require('buffer');
console.log(buffer.Buffer === Buffer); //true
```

### 创建Buffer
- Buffer.from()，第一个参数是内容，第二个是按什么格式转。Buffer.from不支持传入数字，传入数字可以采用传入数组的，存入的一组数据最好是：全部落在0到255区间  或者全部落在-128到127，这是因为不同的数字读取时应该调用不同的方法。
```js
Buffer.from(1234); // throw new errors.TypeError

const buf = Buffer.from([1, 2, 3, 4]);
console.log(buf); //  <Buffer 01 02 03 04>  显示的是16进制的
```
- Buffer.alloc()，第一个参数是长度，第二个具体buffer内容
```js
const b2 = Buffer.alloc(10);  // 创建一个大小为 10 个字节的缓冲区
console.log(b2); // <Buffer 00 00 00 00 00 00 00 00 00 00>

// 尝试分配一个大小为 2048 的 Buffer 对象
Buffer.alloc(2 * 1024)

// 打印buffer，将每个字符串对应的ASCII码的十进制，转化为16进制的，比如 H
'H'.charCodeAt()// ASCII码：'72'
'H'.charCodeAt().toString(16) // '72'的16进制 '48'
```
#### Buffer 字符编码
通过使用字符编码，可实现 Buffer 实例与 JavaScript 字符串之间的相互转换。如果不传递 encoding 默认按照 UTF-8 格式转换存储
- `'ascii'`仅适用于 7 位 ASCII 数据，此编码速度很快，如果设置则会剥离高位。
- `'utf8'`多字节编码的 Unicode 字符，许多网页和其他文档格式都使用 UTF-8。
- `'base64'`Base64 编码。。
- `'binary'`一种将 Buffer 编码成单字节编码字符串的方法。
- `'hex'`将每个字节编码成两个十六进制的字符。
```js
const buf = Buffer.from('hello world', 'utf8');
console.log(buf.toString('hex')); // 68656c6c6f20776f726c64
console.log(buf.toString('utf8')); // hello world
```
### 字符串与 Buffer 类型互转

#### 字符串转 Buffer（将字符串数据写入缓冲区）
```js
const b3 = Buffer.from('123456789', 'utf8');
console.log(b3) // <Buffer 31 32 33 34 35 36 37 38 39>
console.log(b3.length) // 9
```
#### Buffer 转换为字符串（从缓冲区读取string数据）
使用 buf.toString([encoding], [start], [end]) 方法，默认编码仍为 UTF-8
```js
const b3 = Buffer.from('123456789', 'utf8');

console.log(b3.toString()) // 123456789
console.log(b3.toString('utf8', 0, 5)) // 1234
```
### 将buffer转换成JSON对象
buf.toJSON()，返回一个JSON对象。当字符串化一个buffer实例是，JSON.stringify()会隐式地调用该toJSON()。
```js
const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

// 输出: { "type": "Buffer", "data": [ 1,2,3,4,5] }
console.log(json);

const copy = JSON.parse(json,(key, value) =>{
  return value && value.type === 'Buffer' ? Buffer.from(value.data) :value;
});

// 输出:<Buffer 01 02 03 04 05>
console.log(copy);
```
### buffer缓冲区的合并
Buffer.concat(list[, totalLength])
- list <Buffer[]> 要连接的 Buffer。
- totalLength `<integer>` 连接时list中Buffer 实例的总长度，如果未提供 totalLength，则从 list 中的 Buffer 实例通过相加其长度来计算
- 返回: `<Buffer>`

```js
const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;
console.log(totalLength);
// 打印: 42
const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);
console.log(bufA);
// 打印: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// 打印: 42
```
### 缓冲区的拷贝
Buffer.copy(buf)
### 缓冲区的比较
Buffer.compare(buf1, buf2)
### 缓冲区的裁剪
- buf.slice([start[, end]])
- 返回一个新的缓冲区，它和旧缓冲区指向同一块内存，但是从索引 start 到 end 的位置剪切
### 转换过程中为什么出现乱码？
字符串中有中文，一个中文在UTF-8下占用3个字节。转成buffer后，再从buffer转成字符串时，如果字符被截断则容易出现乱码。
```js
const buf = Buffer.from('前端开发');
console.log(buf);  // <Buffer e5 89 8d e7 ab af e5 bc 80 e5 8f 91>
console.log(buf.length); // 12，一个中文在UTF-8下占用3个字节
console.log(buf.toString('UTF-8', 0, 8)); // 前端�
```
## Stream（流）

Stream在 Node.js 中继承自EventEmitter，它有4种基本流类型。
- Readable: 可读操作类型，可以产出数据，这些数据可以被传送到其他流中，只需要调用pipe方法即可。
- Writable: 可写操作类型，只能流进不能流出。
- Duplex: 可读可写操作类型（net.Socket）。
- Transform: 转换类型，可以写入数据，然后读出结果。

node.js创建的流都是运作在字符串和buffer上的。
Stream作为读写方法是最好的。可写流和可读流都会在内部的缓冲区中存储数据，可以分别使用 writable.writableBuffer 或 readable.readableBuffer 来获取。

### 流中的缓冲区
- 可写流和可读流都会在内部的缓冲区中存储数据，可以 writable.writableBuffer 或 readable.readableBuffer 来获取。

- 可缓冲的数据大小取决于传入流构造函数的 highWaterMark 选项。对于普通的流，highWaterMark 指定了字节的总数。对于对象模式的流，highWaterMark 指定了对象的总数。

- 当调用 stream.push(chunk) 时，数据会缓冲在可读流中。如果流的消费者没有调用 stream.read()，则数据会保留在内部队列中直到被消费。

- 一旦内部的可读缓冲的总大小达到 highWaterMark 指定的或值时，流会停止从底层资源读取数据，直到当前缓冲的数据被消贺（也就是说，流会停止调用内部的用于填充可读缓冲的 readable._read())。

- 当调用 writable.write(chunk）时，数据会被缓冲在可写流中。当内部的缓冲区的总大小小于 highWaterMark 设置的阈值时，调用 writable.write() 会返回true。一旦内部缓冲的大小达到或超过 highWaterMark 时，则会返回false。

因为双工流和转换流都是可读又可写的，所以它们各自维护着两个相互独立的内部缓冲区用于读取和写入，这使得它们在维护数据流时，读取和写入两边可以各自独立地运作。例如，net.Socket实例是双工流，它的可读端可以消费从socket接收的数据，而可写端则可以将数据写入到socket。因为数据写入到socket的速度可能比接收数据的速度快或慢，所以在读写两端独立地进行操作（或缓冲）就显得很重要了。


```js
const fs = require('fs');
var source = fs.readFileSync('/path/to/source', (encoding: 'utf8'));
fs.writeFileSync('/path/to/dest', source);

// 等价于
// pipe是用来传递  上一个流的输出  并将其作为  下一个流的输入的链式方法。
fs.createReadstream('/path/to/source').pipe(fs.createWriteStream('/path/to/dest'));
```
### 可读流
Node. js可读流是对提供数据的来源的一种抽象。所有可读流都实现了stream.Readable类定义的接口。可读流常见的例子包括客户端的HTTP响应、服务器的HTTP请求、fs的读取流、zlib流、crypto流、TCP socket、子进程 stdout 与 stderr、process.stdin。

### stream.Readable类事件
1. close 事件
close 事件在流被关闭时触发。表明不会再触发其他事件，也不会再发生操作。不是所有可读流都会触发close事件。如果使用 emitClose 选项创建可读流，则它将始终发出close事件。

2. data 事件
data事件是在流将数据块传送给`消费者`后触发。对于非对象模式的流，数据块可以是字符串或 Buffer。对于对象模式的流，数据块可以是除了 null 的任何 JavaScript 值。
当调用 readable.pipe()、readable.resume() 或绑定监听器到 data 事件时，流会转换到流动模式。当调用 readable.read() 且有数据块返回时，也会触发data 事件。
如果使用 readable.setEncoding() 为流指定了默认的字符编码，则监听器回调传入的数据为字符串，否则传入的数据为 Buffer。

3. end 事件
end 事件只有在数据被完全消费掉后才会触发。要想触发该事件，可以将流转换到流动模式，或反复调用 stream.read() 直到数据被消费完。

4. error 事件
error事件通常是在当流因底层内部出错而不能产生数据，或推送无效的数据块时触发，监听器回调将传递一个 Error对象。

5. pause 事件
调用 stream.pause() 并且 readsFlowing 不为 false 时，会发出 pause 事件。

6. readable 事件
readable 事件在当流中有数据可供读取时触发。
```js
const readable = getReadableStreamSomehow();

readable.on('readable', function(){
    let data; // 有数据可读

    while(data = this.read()){
        console.log(data);
    }
})
```
当到达流数据的尽头时，readable 事件也会触发，但是在 end 事件之前触发。readable 事件表明流有新的动态，要么有新的数据，要么到达流的尽头。对于前者，stream.read() 会返回可用的数据。对于后者，stream.read() 会返回null。

### stream.Readable类方法
1.destroy
readable.destroy([error])方法用于销毁流，并触发error事件和close事件。调用后，可读流将释放所有的内部资源，且忽视后续的 push() 调用。实现流时不应该重写这个方法，而是重写 readable._destroy()。

2.isPaused
readable.isPaused() 方法用于返回可读流当前的操作状态。主要用于 readable.pipe() 底层的机制，大多数情况下无须直接使用该方法。

3. pause 与 resume
readable.pause() 方法使流动模式的流**停止触发data事件**，并切换到流动模式。任何可用的数据都会保留在内部缓存中。
相对的，readable.resume() 将被暂停的可读流**恢复触发data事件**，并将流切换到流动模式，在readable事件使用不生效。

4. pipe
readable.pipe(destination[, options])方法用于绑定可写流到可读流，将可读流自动切换到流动模式，并将可读流的所有数据推送到绑定的可写流。数据流会被自动管理，所以即使可读流更快，目标可写流也不会超负荷。

- 将可读流的所有数据通过管道推送到write-data.txt文件：
```js
const fs = require('fs');

const readable = fs.createReadStream('data.txt');

const writable = fs.createWriteStream('write-data.txt');

// readable的所有数据都推送到'write-data.txt'
readable.pipe(writable);
```
- 可以在单个可读流上绑定多个可写流
```js
readable.pipe(writable1).pipe(writable2);
```
- 默认情况下，当来源可读流触发end事件时，目标可写流也会调用stream.end()结束写入。若要禁用这种默认行为，end选项应设为 false，这样目标流就会保持打开。
```js
reader.pipe (writer, { end: false });
reader.on ('end', () => {
    writer.end ('结束');
}
```
如果可读流发生错误，目标可写流不会自动关闭，需要手动关闭所有流以避免内存泄漏。process.stderr 和 process.stdout 可写的流在 Node.js 进程退出之前永远不会关闭。

5. read
- readable.read([size])方法用于从内部缓冲拉取并返回数据。其中，size指定要读取的数据的字节数。如果没有指定size参数，则返回内部缓冲中的所有数据。该方法如果没有可读的数据，则返回null。默认情况下，readable.read()返回的数据是Buffer对象，除非使用readable.setEncoding()指定字符编码或流处于对象模式。如果可读的数据不足size个字节，则返回内部缓冲剩余的数据，如果流已经结束则返回null。

- readable.read()应该只对处于暂停模式的可读流调用。在流动模式中，readable.read()会自动调用直到内部缓冲的数据完全耗尽。

- 如果readable.read()返回一个数据块，则data事件也会触发。

- end事件触发后再调用stream.read([size])会返回null，不会抛出错误。
```js
const fs = require('fs');

const readable = fs.createReadStream('data.txt');

// 设置字符编码
readable.setEncoding('utf-8');

// 读取数据
readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read(10))) {
    console.log(`接收到 ${chunk.length} 字节的数据`);
    console.log(`接收到的数据是： ${chunk}`);
  }
});

readable.on('end', () => {
  console.log('结束');
});
```
上述示例中，使用readable.read()处理数据时，while循环是必需的。只有在readable.read()返回null之后，才会发出readable事件;

readable.setEncoding()用于设置字符编码。默认情况下没有设置字符编码，流数据返回的是 Buffer对象。如果设置了字符编码，则流数据返回指定编码的字符串。例如，本例中调用`readable.setEncoding('utf-8')`会将数据解析为UTF-8数据，并返回字符串。如果调用`readable.setEncoding(hex)`则会将数据编码成十六进制字符串。

6. readable.unpipe([destination])
解绑之前使用 stream.pipe() 绑定的可写流。如果没有指定目标可写流，则解绑所有管道，如果指定了目标可写流但它没有建立管道，则不起作用。
```js
const fs = require('fs');

const readable = fs.createReadStream('data.txt');

const writable = fs.createWriteStream('write-data.txt');

// readable的所有数据都推送到'write-data.txt'
readable.pipe(writable);

setTimeout(() => {
  console.log('停止写入数据');
  readable.unpipe(writable);
  console.log('手动关闭文件流');
  writable.end();
}, 3);
```
### 两种读取模式
流动模式或者暂停模式

可读流运作于流动模式(flowing)或暂停模式(paused)两种模式之一。
- 在流动模式中，数据自动从底层系统读取，并通过EventEmitter 接口的事件尽口能快地被提供给应用程序。
- 在暂停模式中，必须显式调用stream.read()读取数据块。
所有可读流都开始于暂停模式，可以通过以下方式切换到流动模式。
- 添加data事件句柄。
- 调用stream.resume()。·调用stream.pipe()。
可读流可以通过以下方式切换回暂停模式。
- 如果没有管道目标，则调用stream.pause()。
- 如果有管道目标，则移除所有管道目标。调用stream.unpipe()可以移除多个管道目标。

只有提供了消费或忽略数据的机制后，可读流才会产生数据。如果消费的机制被禁用或移除，则可读流会停止产生数据。

为了向后兼容，移除data事件句柄不会自动地暂停流。如果有管道目标，一旦目标变为drain 状态并请求接收数据时，则调用 stream.pause() 也不能保证流会保持暂停模式。

如果可读流切换到流动模式，且没有可用的“消费者”来处理数据，则数据将会丢失。例如，当调用readable.resume() 时，没有监听data事件或data事件句柄已移除。

添加readable事件句柄会使流自动停止流动，并通过 readable.read() 消费数据。如果 readable 事件句柄被移除，且存在data事件句柄，则流会再次开始流动。

### 可写流
可写流是对数据要被写入的目的地的一种抽象。所有可写流都实现了stream.Writable类定义的接口。可写流常见的例子包括客户端的HTTP请求、服务器的HTTP响应、fs的写入流、zlib流、crypto流、TCP socket、子进程stdin、process.stdout、process.stderr。上面的一些例子事实上是实现了可写流接口的双工流。
#### stream.Writable类事件
stream.Writable类定义了如下事件。

1. close事件
当流及其任何底层资源（如文件描述符）已关闭时，将发出close事件。该事件表明不会发出更多事件，也不会进一步计算。
如果使用emitClose选项创建可写流，它将始终发出close事件。

2. drain事件
如果对stream.write(chunk)的调用返回false，则在适合继续将数据写入流时将发出drain事件。

3. error事件
如果在写入管道数据时发生错误，则会发出error事件。调用时，监听器回调会传递一个Error参数。
发出error事件时，流不会关闭。

4. finish事件
调用stream.end()方法后会发出finish事件，并且所有数据都已刷新到底层系统。
```js
const fs = require('fs');

const writable = fs.createWriteStream('write-data.txt');

for (let i = 0; i < 10; i++) {
  writable.write(`写入 #${i}!\n`);
}

writable.end('写入结尾\n');
writable.on('finish', () => {
  console.log('写入已完成');
})
```
5. pipe事件
在可读流上调用stream.pipe()方法时会发出pipe事件，并将此可写流添加到其目标集。

6. unpipe事件
当在可读流上调用stream.unpipe()时触发。当可读流通过管道流向可写流发生错误时，也会触发unpipe事件。

#### stream.Writable类方法

1. cork
writable.cork()方法用于强制把所有写入的数据都缓冲到内存中。当调用stream.uncork()或stream.end()时，缓冲的数据才会被输出。

当写入大量小块数据到流时，内部缓冲可能失效，从而导致性能下降，writable.cork()主要用于避免这种情况。对于这种情况，实现了writable._writev()的流可以用更优的方式对写入的数据进行缓冲。

2. destroy
writable.destroy([error])方法用于销毁流。在调用该方法之后，可写流已结束，随后对write()或end()的调用都将导致ERR_STREAM_DESTROYED错误。如果数据在关闭之前应该刷新，则应使用end()方法而不是destroy()方法，或者在销毁流之前等待drain事件。实现者不应该重写此方法，而是实现writable._destroy()。

3. end
调用writable.end([chunk][, encoding][, callback])方法表示不再将数据写入Writable。该方法的参数如下。

- `chunk<string>|<Buffer>|<Uint8Array>/<any>`:要 写入的可选数据。对于不在对象模式下运行的流，块必须是字符串、Buffer 或 Uint8Array。对于对象模式流，块可以是除null 之外的任何JavaScript 值。

- `encoding<string>`: 如果设置了编码，则 chunk 是一个字符串。
- `callback<Function>`: 流完成时的可选回调。

调用writable.end()方法表示不再将数据写入Writable。可选的块和编码参数允许在关闭流之前立即写入最后一个额外的数据块。如果提供，则附加可选回调函数作为finish事件的监听器。

调用stream.end()后调用stream.write()方法将引发错误。

4. setDefaultEncoding
writable.setDefaultEncoding(encoding)为可写流设置默认的编码。

5. uncork
writable.uncork()方法用于将调用stream.cork()后缓冲的所有数据输出到目标。当使用writable.cork() 和 writable.uncork() 来管理流的写入缓冲时，建议使用 process.nextTick() 来延迟调用 writable.uncork()。通过这种方式，可以对单个Node.js事件循环中调用的所有 writable.write() 进行批处理。
```js
stream.cork ();
stream.write ('一些');
stream.write('数据');
process.nextTick(()=> stream.uncork());
```
如果一个流上多次调用 writable.cork()，则必须调用同样次数的 writable.uncork() 才能输出缓冲的数据。
```js
stream.cork();
stream.write ('一些' );
stream.cork();
stream.write('数据');
process.nextTick(()=> {
    stream.uncork ();
    //数据不会被输出,直到第二次调用uncork()
    stream.uncork();
});
```
6. write
writable.write(chunk[, encoding][, callback]) 写入数据到流，并在数据被完全处理之后调用callback。如果发生错误，则callback可能被调用也可能不被调用。为了可靠地检测错误，可以为error事件添加监听器。该方法的参数如下。
- `chunk<string>|<Buffer>|<Uint8Array>|<any>`: 要写入的数据。对于非对象模式的流，chunk 必须是字符串、Buffer 或 Uint8Array。对于对象模式的流，chunk 可以除null外的是任何 JavaScript 值。
- `encoding<string>`: 如果chunk是字符串，则指定字符编码。
- `callback<Function>`: 当数据块被输出到目标后的回调函数。
- `writable.write()`: 写入数据到流，并在数据被完全处理之后调用callback。如果发生错误，则callback可能被调用也可能不被调用。为了可靠地检测错误，可以为error事件添加监听器。

在接收了chunk后，如果内部的缓冲小于创建流时配置的highWaterMark, 则返回true。如果返回false，则应该停止向流写入数据，直到drain事件被触发。

当流还未被排空时，调用write()会缓冲chunk，并返回false。一旦所有当前缓冲的数据块都被排空了(被操作系统接收并传输)，则触发drain事件。建议一旦write()返回false，则不再写入任何数据块，直到drain事件被触发。当流还未被排空时，也是可以调用write()， Node.js 会缓冲所有被写入的数据块，直到达到最大内存占用，这时它会无条件中止，甚至在它中止之前，高内存占用将会导致垃圾回收器的性能变差和RSS变高(即使内存不再需要，通常也不会被释放回系统)。如果远程的另一端没有读取数据，TCP的socket 可能永远也不会排空，所以写入到一一个不会排空的socket可能会导致产生远程可利用的漏洞。

对于Transform，写入数据到一一个不会排空的流尤其成问题，因为Transform流默认会被暂停，直到它们被pipe或者添加了 data 或readable 事件句柄。

如果要被写入的数据可以根据需要生成或取得，建议将逻辑封装为一一个可读流并且使用stream.pipe()。 如果要优先调用 write()，则可以使用 drain 事件来防止背压与避免内存问题。

### 双工流与转换流

双工流（Duplex）是同时实现了Readable和 Writable接口的流。双工括TCP socket、zlib流、crypto流。
转换流（Transform）是一种双工流，但它的输出与输入是相关联的。与双工流一样，转换流也同时实现了 Readable 和 Writable 接口。转换流的例子包括 zlib流和 crypto 流。

### 实现双工流
双工流同时实现了可读流和可写流，如TCP socket连接。因为JavaScript不支持多重继承，所以使用stream.Duplex类来实现双工流（而不是使用stream.Readable类和stream.Writable类)。
stream.Duplex类的原型继承自stream.Readable和寄生自stream.Writable，但是instanceof对这两个基础类都可用，因为重写了 stream.Writable 的Symbol.hasInstance。
自定义的双工流必须调用`new stream.Duplex([options])`构造函数并实现 readable._read() 和 writable._write() 方法。以下是示例。

```js
const { Duplex } = require('stream');

class MyDuplex extends Duplex {
  constructor(options){
    super(options);
    // ...
  }
}
```
### 双工流的例子
封装了一个可读可写的底层资源对象
```js
const { Duplex } = require('stream');
const kSource = Symbol('source');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this[kSource] = source;
  }

  _write(chunk, encoding, callback) {
    // 底层资源只处理字符串。
    if (Buffer.isBuffer(chunk)){
      chunk = chunk.toString();
    }
    this[kSource].writeSomeData(chunk);
    callback();
  }

  _read(size) {
    this[kSource].fetchSomeData(size, (data, encoding) => {
      this.push(Buffer.from(data, encoding));
    });
  }
}
```
## net模块
在nodejs中，net模块用于创建基于流的TCP或IPC的服务器与客户端。net主要包含两个部分：
- net.Server: TCP Server，内部通过socket来实现与客户端的通信。
- net.Socket: TCP/本地socket的Node版实现，它实现了全双工的stream接口，可以用来构建TCP客户端。

```js
const net = require('net');
```
### 创建TCP服务器
1. net.Server类创建TCP或IPC服务器
2. net.Server支持如下事件：
- listening事件: 当服务被绑定后调用server.listen()方法后触发。
- connection事件: 当一个新的connection建立的时候触发，回调参数为socket连接对象。
- close事件：当TCP服务器关闭的时候触发，回调函数没有参数。
- error事件: 当TCP服务器出现错误的时候触发，回调函数的参数为err对象。例如，监听了已经被占用的端口号。
### 创建TCP服务器示例
```js
const net = require('net');

const server = net.createServer((socket) => {
    socket.end('goodbye\n');
}).on('error', (err) => {
    // 处理错误
    throw err;
});

server.on('close', () => {
    console.log('服务器接收到close事件');
})

// socket对象，对象可以与客户端进行通信
server.on('connection', (socket) => {
    console.log('服务器接收到connection事件')
})

server.on('listening', () => {
    console.log('服务器接收到listening事件')
})

// 随机获取未绑定的端口
server.listen(() => {
    console.log('服务器启动，占用端口：', server.address());
});
```
当创建了一个TCP服务器后，可以通过 server.address()方法来查看这个TCP服务器监听的地址，并返回一个JSON对象。这个对象的属性有:
- port: TCP服务器监听的端口号。
- family: 说明TCP服务器监听的地址是IPv6还是IPv4。
- address: TCP服务器监听的地址。
```js
/**
 * 查看服务器监听的地址
 */

/* 引入net模块 */
var net = require("net");

/* 创建TCP服务器 */
var server = net.createServer(function (socket) {
   console.log('someone connects');
})

/* 获取地址信息 */
server.listen(8000, function () {
   /* 获取地址信息，得到的是一个json { address: '::', family: 'IPv6', port: 8000 } */
   var address = server.address();

   /* TCP服务器监听的端口号 */
   console.log("the port of server is" + address.port);

   /* TCP服务器监听的地址 */
   console.log("the address of server is" + address.address);

   /* 说明TCP服务器监听的地址是 IPv6 还是 IPv4 */
   console.log("the family of server is" + address.family);
})
```
创建一个TCP服务器后，可以通过server.getConnections()方法获取连接这个TCP服务器的客户端数量。除此之外，也可以通过maxConnections属性来设置这个服务器的最大连接数量，当连接数量超过最大值时，服务器将拒绝新的连接，例如:
```js
/**
 * 连接服务器的客户端数量
 */

/* 引入net模块 */
var net = require("net");

/* 创建TCP服务器 */
var server = net.createServer(function (socket) {
    console.log('someone connects');

    /* 设置最大连接数量 */
    server.maxConnections = 3;
    server.getConnections(function (err, count) {
        console.log("the count of client is " + count);
    })
})

/* 获取监听端口 */
server.listen(8000, function () {
    console.log("Creat server on http://127.0.0.1:8000/");
})
```
服务器和客户端之间的通信：socket对象可以用来获取客户端发出的流数据，每次接收到数据的时候触发data事件，通过监听这个事件就可以在回调函数中获取客户端发送的数据。
```js
/**
 * 连接服务器的客户端数量
 */

/* 引入net模块 */
var net = require("net");

/* 创建TCP服务器 */
var server = net.createServer(function(socket){
    /* 获取地址信息 */
    var address = server.address();
    var message = "the server address is"+JSON.stringify(address);

    /* 发送数据 */
    socket.write(message,function(){
        var writeSize = socket.bytesWritten;
        console.log(message + "has send");
        console.log("the size of message is"+writeSize);
    })

    /* 监听data事件，每次接收到数据的时候触发data事件 */ 
    socket.on('data',function(data){
        console.log(data.toString());
        var readSize = socket.bytesRead;
        console.log("the size of data is"+readSize);
    })
})

/* 获取地址信息 */
server.listen(8000,function(){
    console.log("Creat server on http://127.0.0.1:8000/");
})
```
### server.listen监听链接
listen()方法是异步的。当服务器开始监听时，会触发listening事件。最后一个参数callback将被添加为listening事件的监听器。

当且仅当在第一次调用server.listen()或调用server.close()期间出现错误时，才能再次调用server.listen()方法。

监听时最常见的错误之一是EADDRINUSE, 这说明该地址正被另一个服务器所使用。处理此问题的一种方法是在一段时间后重试。
```js
server.on('error', function(e){
    if(e.code === 'EADDRINUSE'){
        console.log('地址正被使用，重试中。。。')

        setTimeout(()=>{
            server.close();
            server.listen(PORT, HOST)
        }, 1000)
    }
})
```
server.listen(options[, callback])方法中的options参数支持如下属性
- `port<number>`: 端口号。
- `host<string>`: 主机。
- `path<string>`: 如果指定了port，将被忽略。
- `backlog<number>`。如果exclusive为 false，则集群将使用相同的底层句柄，从而允许共享连接处理。当exclusive为 true时，不共享句柄，并且尝试端口共享会导致错误。监听专用端口的示例如下。
- `exclusive<boolean>`: 默认值是false。
- `readableAll<boolean>`: 对于IPC服务器，使管道对所有用户都可读，默认值是false。
- `writableAll<boolean>`: 对于IPC服务器，管道可以为所有用户写入，默认值是false。

### 创建Socket对象发送和接受数据
```js
const net = require('net');
const server = net.createServer();

server.on('error', (err) => {
    // 处理错误
    throw err;
});

server.on('close', () => {
    console.log('服务器接收到close事件');
})

server.on('connection', (socket) => {
    console.log('服务器接收到connection事件');
    socket.setEncoding('utf8');
    socket.write('welcome!'); // 发送数据

    socket.on('data', (data) => {
        console.log('服务器接收到的数据为：' + data);

        // 如果收到c字符，就终止连接
        if (data == 'c') {
            socket.write('bye!');
            socket.end(); // 关闭socket
            // 如果收到k字符，就关闭服务器
        } else if (data == 'k') {
            socket.write('bye!');
            socket.end(); // 关闭socket
            server.close();// 关闭服务器
        } else {
            socket.write(data);
        }

    })
})

server.on('listening', () => {
    console.log('服务器接收到listening事件');
})

// 绑定到端口
server.listen(8888, () => {
    console.log('服务器启动，端口：8888');
});
```
在上述示例中，socket.write() 方法用于将数据写入 Socket发送; socket通过data事件，可以监听来自客户端写入的数据(接收)。在上述示例中，会将接收到的数据，再通过 socket.write() 方法发送回客户端。

关闭TCP服务器：TCP服务器通过 socket.end() 终止客户端的连接，也可以通过 server.close() 方法来将整个TCP服务器关闭。当TCP服务器关闭时，会监听到close事件。

### 构建TCP客户端
可以用net.Socket构建TCP客户端，实现TCP客户端和TCP服务器的通信。
```js
/**
 * 构建TCP客户端
 */

/* 引入net模块 */
var net = require("net");

/* 创建TCP客户端 */
var client = net.Socket();

/* 设置连接的服务器 创建完socket对象后，使用socket对象的connect方法就可以连接一个TCP服务器。*/
client.connect(8000, '127.0.0.1', function () {
  console.log("connect the server");

  /* 向服务器发送数据 */
  client.write("message from client");
})

/* 监听服务器传来的data数据 */
client.on("data", function (data) {
  console.log("the data of server is " + data.toString());
})

/* 监听end事件 */
client.on("end", function () {
  console.log("data end");
})
```
1. net.Socket连接相关的API有:
- socket.connect(): 有3种不同的参数，用于不同的场景。
- socket.setTimeout(): 用来进行连接超时设置。
- socket.setKeepAlive(): 用来设置长连接。
- socket.destroy( )、socket.destroyed: 当错误发生时，用来销毁socket，确保这个socket上不会再有其他的IO操作。
2. net.Socket涉及的事件:
- data: 当收到另一侧传来的数据时触发。
- connect: 当连接建立时触发。
- close: 当连接断开时触发。如果是因为传输错误导致的连接断开，参数就为error。
- end: 当连接另一侧发送了FIN包的时候触发。默认情况下(allowHalfOpen == false)，socket会完成自我销毁操作。但也可以把allowHalfOpen设置为true，这样就可以继续往socket里写数据。当然，最后需要手动调用socket.end()。
- error: 当有错误发生时就会触发，参数为error。
- timeout: 示用户socket已经超时，需要手动关闭连接。
- drain: 当写缓存空了的时候触发。
- lookup: 当域名解析完成时触发。

## http
http.Server类是继承自net.Server，有很多net.Server的方法和事件。

net、http、dgram模块分别用来实现TCP、HTTP、UDP的通信。http为应用层模块，主要按照特定协议编解码数据; net为传输层模块，主要负责传输编码后的应用层数据; https是一个综合模块（涵盖了http/tIs/crypto等)，主要用于确保数据安全性。
```js
const http = require('http');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n'); // 用于完成发送请求
});

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`);
});
```
### http.Server事件

1. close事件：服务器关闭时触发close事件
2. connection事件：建立新的TCP流是会发出connection事件
3. request事件：每次有请求时都会发出request事件。注意，在HTTP Keep-Alive连接的情况下每个连接可能会有多个请求。

### http.requset发送请求
```js
const http = require ('http');
const req = http.request({
    host: '127.0.0.1',
    port: 8080,
    method: 'POST' // 默认是GET，POST、PUT、DELETE
    }, (res) => {
    res.resume();
    res.on('end', () => {
    console.log ('请求完成!');});
});
```
### http请求对象和响应对象
HTTP请求对象和响应对象在 Node.js中是被定义在 http.ClientRequest和http.ServerResponse类中的。

#### http.ClientRequest
http.ClientRequest对象由http.request()内部创建并返回。它表示正在进行的请求，且其请求头已进入队列。请求头仍然可以使用

- getHeader(name) 返回请求头的值
- removeHeader(name) 改变。

实际的请求头将与第一个数据块一起发送，或者当调用request.end()时发送。

要获得响应，则为请求对象添加response事件监听器。当接收到响应头时，将会从请求对象触发response事件。response事件执行时有一个参数，该参数是http.IncomingMessage的实例。

在response事件期间，可以添加监听器到响应对象，如监听data事件。

如果没有添加response事件处理函数，则响应将被完全丢弃。如果添加了response事件处理函数，则必须消费完响应对象中的数据，每当有readable事件时，会调用response.read()，或添加 data事件处理函数，或调用.resume()方法。在消费完数据之前，不会触发end事件。此外，在读取数据之前，它将占用内存，最终可能导致进程内存不足的错误。

#### http.ServerResponse类
http.ServerResponse对象由HTTP服务器在内部创建，而不是由用户创建。它作为第二个参数传给request事件。ServerResponse继承自Stream。
- close事件：表示底层链接已经终止
- finish事件：在响应发送后触发。
- response.end()方法
`response.end([data][, encoding][, callback])`方法用于向服务器发出信号，表示已发送所有响应标头和正文，该服务器应该考虑此消息已完成。必须在每个响应上调用response.end() 方法。

如果指定了data，则它实际上类似于先调用response.write(data, encoding)方法，接着调用response.end()方法。如果指定了callback，则在响应流完成时将调用它。

- response.setHeader(name, value)：设置响应头。
- response.getHeaderNames()：返回已经设置的响应头属性数组。
- response.getHeaders()：返回已经设置的响应头，以key-vale表示。

#### REST ful风格
- 若要在服务器上创建资源，应该使用POST方法。
- 若要检索某个资源，应该使用GET方法。
- 若要更新或添加资源，应该使用PUT方法。
- 若要删除某个资源，应该使用DELETE方法。

# npm
npm全称node package manager即node包管理器。

查看当前项目的所有NPM脚本命令，可以使用不带任何参数的npm run命令:
```bash
npm run
```
npm 脚本的原理相对简单，每当执行npm run时，会自动新建一个Shell，在该Shell 中执行指定的脚本命令。

因此，只要是Shell (一般是Bash)可以运行的命令，就可以写在 NPM脚本里面。需要注意的是，npm run新建的 Shell 会将当前目录的node_modules.bin子目录加入PATH变量，命令执行结束后，再将PATH 变量恢复。也就是说，当前目录的node_modules/.bin子目录里面的所有脚本都可以直接用脚本名调用，而不必加上路径。例如，当前项目的依赖里面有Mocha，只需要直接写mocha test即可:
```json
"script": {
    "test" : "mocha test"
}
// 而不需要写成:
"script": {
    "test" :"./node_modules/.bin/mocha test"
}
```
由于NPM脚本的唯一要求是可以在Shell 中执行，因此它不一定是Node脚本，任何可执行文件都可以写在script中。

安装的局部开发依赖如果有命令，会在node_modules/.bin目录创建软连接，package.json是可以读取到依赖下.bin目录下的命令，可以在package.json直接使用该命令。

## package.json
package.json可以手动编写，也可以使用npm init命令自动生成，它描述了项目使用到的模块，项目名称（必填）、版本号（必填）、许可、关键词。

- Name: 包名。
- Version: 包的版本号，语义版本号分为X.Y.Z三位，分别代表主版本号、次版本号和补丁版本号。
- Description: 包的描述。
- Homepage: 包的官网地址。
- Author: 包的作者姓名。
- Contributors: 包的其他贡献者姓名。
- Dependencies: 依赖包列表，指定了项目运行所依赖的模块。如果依赖包没有安装，npm就会自动将依赖包安装在node_module目录下。
- devDependencies: 指定项目开发所需要的模块。
- repository: 包代码存放的地方的类型，可以是Git或Svn，Git可在GitHub 上。
- main: main字段指定了程序的主入口文件, require('moduleName')就会加载这个文件。这个字段的默认值是模块根目录下面的index.js。
- keywords: 关键字。
- scripts: 指定了运行脚本命令的npm命令行缩写，比如 start 指定了运行npm run start时所要执行的命令。
- bin: 用来指定各个内部命令对应的可执行文件的位置。
- config: 用于添加命令行的环境变量。

## npm命令
```bash
# 更新模块：
npm update module

# 查看安装的模块：
npm list -g # 查看全局安装的模块
npm list # 查看本地安装的模块

# 查看某个模块的信息
npm list koa

# 查看命令详细帮助
npm help

# 查看包的安装路径
npm root [-g]

# 清除npm本地缓存
npm cache clean
```

# WebSocket
WebSocket 提供了一个真正的全双工连接，它可用于客户机和服务器之间的双向通信，客户端和服务器可以随意向对方发送数据。

该方案的优点是属于HTML5标准，已经被大多数浏览器支持，而且是真正的全双工，性能比较好。其缺点是实现起来相对比较复杂，需要对ws协议专门处理。

## 使用ws创建WebSocket服务器
Node.js原生API并未提供 WebSocket的支持，因此，需要安装第三方包才能使用WebSocket 功能。
```js
// npm i ws
const WebSocket = require('ws');
const server = new WebSocket.Server({ 
    port: 8080
});

```
WebSocket.Server(options[, callback]）方法中的options对象支持如下参数。
- `host<String>`: 绑定服务器的主机名。
- `port<Number>`: 绑定服务器的端口。
- `backlog<Number>`: 挂起连接队列的最大长度。
- `server`: 预先创建的Node.js HTTP/S服务器。
- `verifyClient<Function>`: 可用于验证传入连接的函数。
- `handleProtocols<Function>`: 可用于处理WebSocket子协议的函数。
- `path<String>`: 仅接受与此路径匹配的连接。
- `noServer<Boolean>`: 不启用服务器模式。
- `clientTracking<Boolean>`: 指定是否跟踪客户端。
- `perMessageDeflate`: 启用/禁用消息压缩。
- `maxPayload<Number>`: 允许的最大消息大小(以字节为单位)。

## ws事件
- ws监听事件：connection。只要有WebSocket连接到该服务器，就能触发connection事件。
- 如果想获知所有的已连接的客户端信息，则可以使用server.clients数据集。该数据集存储了所有已连接的客户端。

## 发送和接收数据
ws通过websocket.send()方法发送数据，通过监听message事件来接受数据。

### 发送数据
`websocket.send(data[, options][, callback])`方法可以用来发送数据。data参数就是用来发送的数据。options对象的属性可以有以下几种。
- compress: 用于指定数据是否需要压缩。默认是true。
- binary: 用于指定数据是否通过二进制传送。默认是自动检测。
- mask: 用于指定是否应遮罩数据。当WebSocket不是服务器客户端时，默认认为true。
- fin: 用于指定数据是否为消息的最后一个片段，默认为true。

#### 发送ping和pong
在消息通信中, `ping-pong`是一种验证客户端和服务器是否正常连接的简单机制。当客户端给服务器发送`ping`消息时，如果服务器能够正常响应`pong`消息，则说明客户端和服务器之间的通信是正常的。反之亦然，如果服务器想验证客户端的连接是否正常，也可以给客户端发送`ping`消息。
ws提供了一种快捷的方式来发送`ping`消息和`pong`消息。
- websocket.ping([data[, mask]][, callback])
- websocket.pong([data[, mask]][, callback])

#### 接收数据
ws通过message事件来接收数据

### 准备状态
ws 中的 WebSocket类具有以下4种准备状态。
- CONNECTING: 值为0，表示连接还没有打开。
- OPEN: 值为1，表示连接已打开，可以通信了。
- CLOSING: 值为2，表示连接正在关闭。
- CLOSED: 值为2，表示连接已关闭。
需要注意的是，当通过 WebSocket对象进行通信时，状态必须是OPEN。

### 关闭WebSocket服务器
可以通过server.close()来关闭服务器，并通过close事件监听服务器的关闭。

### ws例子
- 服务端
```js
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({
  port: 3000
});

wss.on('connection', function (ws) {
  console.log(`[SERVER] connection()`);
  ws.on('message', function (message) {
    console.log(`[SERVER] Received: ${message}`);
    setTimeout(() => {
      ws.send(`What's your name?`, (err) => {
        if (err) {
          console.log(`[SERVER] error: ${err}`);
        }
      });
    }, 1000);
  })
});

console.log('ws server started at port 3000...');
```
- 客户端（浏览器）
```js
// client test:

let count = 0;

let ws = new WebSocket('ws://localhost:3000/ws/chat');

ws.on('open', function () {
  console.log(`[CLIENT] open()`);
  ws.send('Hello!');
});

ws.on('message', function (message) {
  console.log(`[CLIENT] Received: ${message}`);
  count++;
  if (count > 3) {
    ws.send('Goodbye!');
    ws.close();
  } else {
    setTimeout(() => {
      ws.send(`Hello, I'm Mr No.${count}!`);
    }, 1000);
  }
});
```
WebSocket 协议本身不要求同源策略（Same-Origin Policy)，也就是某个地址为 `http://a.com`的网页可以通过 WebSocket连接到`ws://b.com`。但是，浏览器会发送 Origin 的 HTTP 头给服务器，服务器可以根据 Origin 拒绝这个 WebSocket 请求。所以，是否要求同源要看服务器端如何检查。

# MySQL基本操作
```bash
# 显示已有的数据库
show databases;

# 创建数据库
CREATE DATABASES data_name; # nodejs_book

# 使用数据库
use data_name;

# 建表
mysql> CREATE TABLE t_user ( user_id BIGINT NOT NULL, username VARCHAR(20));

# 查看表
show TABLES;

# 显示表的结构
mysql> DESCRIBE t_user;

# 往表中加入记录
mysql> insert into t_user values(1, 'yolo');
```
## 使用node.js操作mysql
使用mysql或者mysql2模块

## 实现简单的查询
- mysql.createConnection()用于创建一个连接;
- connection.connect()方法用于建立连接; 
- connection.query()方法用于执行查询，第一个参数就是待执行的SQL语句; 
- connection.end()用于关闭连接。

```js
const mysql = require('mysql');

// 连接信息
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'nodejs_book'
});

// 建立连接
/// connection.connect();

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

// 执行查询
connection.query('SELECT * FROM t_user',
    function (error, results, fields) {
        if (error) {
            throw error;
        }

        // 打印查询结果
        console.log('SELECT result is: ', results);
    });


// 关闭连接
///connection.end();
///connection.destroy();

connection.end(function (err) {
    if (err) {
        console.error('error end: ' + err.stack);
        return;
    }

    console.log('end connection');
});
```
### mysql模块连接选项
|参数|描述|
|:---:|:---:|
|host|主机地址,默认是localhost|
|user|用户名|
|password|密码|
|port|端口号，默认是3306|
|database|数据库名|
|charset|连接字符集（默认:`'UTF8_GENERAL_CI'`，注意字符集的字母都要大写)|
|localA ddress|此IP用于TCP连接（可选)|
|socketPath|连接到unix域路径，当使用host和port时会被忽略|
|timezone|时区，默认是`'local'`|
|connectTimeout|连接超时，单位为毫秒。默认为不限制|
|stringifyObjects|是否序列化对象|
|typeCast|是否将列值转换为本地JavaScript类型值。默认为true|
|queryFormat|自定义query语句格式化方法|
|supportBigNumbers|数据库支持bigint或decimal类型列时，需要设此option为true。默认为false|
|bigNumberStrings|supportBigNumbers和bigNumberStrings启用，强制bigint或decimal列以JavaScript字符串类型返回。默认为false|
|dateStrings|强制timestamp、datetime、data类型以字符串类型返回，而不是JavaScript Date类型。默认为false|
|debug|开启调试。默认为false|
|multipleStatements|是否允许一个query中有多个MySQL语句。默认为false|
|flags|用于修改连接标志|
|ssl|使用ssl参数或一个包含ssl配置文件名称的字符串|

### mysql模块CRUD
```js
// 执行查询
connection.query('SELECT * FROM t_user',
    function (error, results, fields) {
        if (error) {
            throw error;
        }

        // 打印查询结果
        console.log('SELECT result is: ', results);
    });

// 插入数据 
// 其中，在SQL语句中，通过“?”占位符的方式将参数对象data进行传入。
var data = { user_id: 2, username: 'waylau' };
connection.query('INSERT INTO t_user SET ?', data,
    function (error, results, fields) {
        if (error) {
            throw error;
        }

        // 打印查询结果
        console.log('INSERT result is: ', results);
    });

// 更新数据
// 通过“?"占位符的方式将参数对象进行传入。所不同的是，参数对象是一个数组。
connection.query('UPDATE t_user SET username = ? WHERE user_id = ?', ['Way Lau', 2],
    function (error, results, fields) {
        if (error) {
            throw error;
        }

        // 打印查询结果
        console.log('UPDATE result is: ', results);
    });

// 执行查询
// 同样也是通过“?占位符的方式将参数对象进行传入。所不同的是，参数对象是一个数值（用户ID)。
connection.query('SELECT * FROM t_user',
    function (error, results, fields) {
        if (error) {
            throw error;
        }

        // 打印查询结果
        console.log('SELECT result is: ', results);
    });
```
## mysql连接池

建议将连接池的pool.getConnection封装一下，实现复用
```js
const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');//用于req.
const URL = '/api/users';
const mysql = require('mysql');

// 连接信息.
// 使用连接池
const pool = mysql.createPool({
    connectionLimit: 4, // 连接数限制
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'nodejs_book'
});

app.use(bodyParser.json());

// 获取所有用户列表API
app.get(URL + '/', function (req, res) {

    // 获取连接
    pool.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }

        // 从请求参数中获取用户ID
        let name = req.query.name;

        console.log('User name is: ', name);
        
        if (name == null) {
            // 执行查询
            connection.query('SELECT * FROM t_user',
                function (error, results) {
                    // 错误处理
                    if (error) {
                        throw error;
                    }

                    // 打印执行结果
                    console.log('The result is: ', results);

                    // 释放连接
                    connection.release();

                    // 转为JSON返回
                    res.json(results).end();
                });
        } else {
            // 执行查询
            connection.query('SELECT * FROM t_user where username = ?', name,
                function (error, results) {
                    // 错误处理
                    if (error) {
                        throw error;
                    }

                    // 打印查询结果
                    console.log('The result is: ', results);

                    // 释放连接
                    connection.release();

                    // 转为JSON返回
                    res.json(results).end();
                });
        }
    });

});


// 获取指定ID的用户API
app.get(URL + '/:id', function (req, res) {


    // 获取连接
    pool.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }

        // 从请求参数中获取用户ID
        let id = req.params.id;

        console.log('User id is: ', id);

        // 执行查询
        connection.query('SELECT * FROM t_user where user_id = ?', id,
            function (error, results) {
                // 错误处理
                if (error) {
                    throw error;
                }

                // 打印执行结果
                console.log('The result is: ', results);

                // 释放连接
                connection.release();

                // 取第一个，转为JSON返回
                res.json(results[0]).end();
            });
    });

});


// 创建用户信息API
app.post(URL + '/', (req, res) => {

    // 获取连接
    pool.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }

        // 从请求参数中获取用户信息
        let username = req.body.username;

        console.log('User is: ', username);

        // 执行查询
        connection.query('INSERT INTO t_user (username) VALUES (?)', username,
            function (error, results) {
                // 错误处理
                if (error) {
                    throw error;
                }

                // 打印执行结果
                console.log('The result is: ', results);

                // 释放连接
                connection.release();

                // 转为JSON返回
                res.json(results).end();
            });
    });

});

// 更新用户信息API
app.put(URL + '/', (req, res) => {
    // 获取连接
    pool.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }

        // 从请求参数中获取用户信息
        let user_id = req.body.user_id;
        let username = req.body.username;

        console.log('User id is: ', user_id);
        console.log('User name is: ', username);
        // 执行查询
        connection.query('UPDATE t_user SET username = ? WHERE user_id = ? ', [username, user_id],
            function (error, results) {
                // 错误处理
                if (error) {
                    throw error;
                }

                // 打印执行结果
                console.log('The result is: ', results);

                // 释放连接
                connection.release();

                // 转为JSON返回
                res.json(results).end();
            });
    });

});

// 删除指定ID的用户API
app.delete(URL + '/:id', (req, res) => {

    // 获取连接
    pool.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }

        // 从请求参数中获取用户ID
        let id = req.params.id;

        console.log('User id is: ', id);

        // 执行查询
        connection.query('DELETE FROM t_user WHERE user_id = ? ', id,
            function (error, results) {
                // 错误处理
                if (error) {
                    throw error;
                }

                // 打印执行结果
                console.log('The result is: ', results);

                // 释放连接
                connection.release();

                // 转为JSON返回
                res.json(results).end();
            });
    });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
```
# Redis

Redis是一个高性能的key-vale缓存数据库

Redis支持主从同步，可以从主服务器向任意数量的从服务器上同步数据，从服务器可以是关联其他从服务器的主服务器。这使得 Redis可执行单层树复制，存盘可以有意无意地对数据进行写操作。由于完全实现了发布/订阅机制，使得从数据库在任何地方进行数据同步时，可订阅一个频道并接收主服务器完整的消息发布记录。同步对读取操作的可扩展性和数据冗余很有帮助。

Redis不仅仅是简单的key-value存储，更是一个data strutures server（数据结构服务器)，用来支持不同的数值类型。在key-value中，value不仅仅局限于string类型，它可以是更复杂的数据结构。
- 二进制安全的string。
- List: 一个链表，链表中的元素按照插入顺序排列。
- Set: string 集合，集合中的元素是唯一的，没有排序。
- Sorted set: 与Set类似，但是每一个string 元素关联一个浮点数值，这个数值被称为Score。元素总是通过它们的Score进行排序，所以不像Set那样可以获取一段范围的元素（例如，获取前10个，或者后10个)。

- Hash: 指由关联值字段构成的 Map。字段和值都是string。
- Bit array（或者简单称为Bitmap): 像位数值一样通过特别的命令处理字符串，可以设置和清除单独的bit，统计所有bit集合中为1的数量，查找第一个设置或没有设置的bit等。
- HyperLogLogs: 这是一个概率统计用的数据结构，可以用来估计一个集合的基数。对于所有的例子，我们都使用redis-cli工具来演示。这是一个简单但非常有用的命令行工具，可以用来给Redis Server 发送命令。

## Redis超时
Redis超时是 Redis的一个特性之一，这个特性可以用在任何一种值类型中。可以给一个key设置一个超时时间，这个超时时间就是有限的生存时间。当生存时间过去，这个key就会自动被销毁。
- 在设置超时时间时，可以使用秒或毫秒。
- 超时时间一般总是1ms。
- 超时信息会被复制，并持久化到磁盘中。当Redis服务器停止时(这意味着Redis将保存key 的超时时间)。

## node.js操作redis
使用redis模块操作redis

- redis.createClient()用于创建客户端。
- client.set()方法设置单个值。
- client.hset()方法用于设置多个字段。
- client.hkeys()方法用于返回所有的字段。
- client.get()和client.hgetall()方法都用于获取key 所对应的值。
- client.quit()用于关闭连接。


```js
const redis = require("redis");

// 创建客户端
const client = redis.createClient(6379, '127.0.0.1');

// 如果没有密码，则不需要这一步
client.auth(123456) // 

// 错误处理
client.on("error", function (err) {
    console.log("Error " + err);
});

client.on('connect', function(){
    // 设值
    client.set("hello", "this is a value");
    // 把存储对象改成JSON对象 程序将会报错，因为Redis 中存储的是字符串对象
    client.set('test', { user_name: 'yolo', age: 18})
    // 重写toString 即可方法:
    // object.prototype.tostring = function (){
    //     return JSON.stringify(this);
    // };
})

// 设值
client.set("书名", "《Node.js企业级应用开发实战》", redis.print);

// 同个key不同的字段
client.hset("柳伟卫的Spring三剑客", "第一剑", "《Spring Boot 企业级应用开发实战》", redis.print);
client.hset("柳伟卫的Spring三剑客", "第二剑", "《Spring Cloud 微服务架构开发实战》", redis.print);
client.hset(["柳伟卫的Spring三剑客", "第三剑", "《Spring 5 开发大全》"], redis.print);

// 返回所有的字段
client.hkeys("柳伟卫的Spring三剑客", function (err, replies) {
    console.log("柳伟卫的Spring三剑客共" + replies.length + "本:");
    
    // 遍历所有的字段
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
});

// 获取key所对应的值
client.get("书名", function (err, reply) {
    console.log(reply); 
});


// 获取key所对应的值
client.hgetall("柳伟卫的Spring三剑客", function (err, reply) {
    console.log(reply); 

    // 退出
    client.quit();
});

// 清除数据
client.del('key')
```

# 异常处理

- 使用`process.on('uncaughtException', function(err){})`就不会造成接口崩溃了，可惜的是，很多应用在开发时都没有做这样的基本处理，因此都出现了问题，捕获那些咱没有 try-catch 的异常错误。
```js
// 相对于异常来说，内存泄漏也是一个不能忽视的严重问题，而process.on('uncaughtException')的做法很难保证不造成内存的泄漏。
// 所以当捕获到异常时，显式地手动杀掉进程并重启Node进程，既可以保证释放内存，又保证了服务后续的正常可用。
process.on ('uncaughtException', (e)=>{
    console.error('process error is:', e.message);
    process.exit(1);
    restartServer(); //重启服务
});

```
- try/catch/finally，当我们去读取文件遇到异常时，抛出的异常会被try/catch捕获，当前的线程就不会英文异常而意外结束了。
- async/await和promise是无法捕获异步代码的异常的，如下例子，无法捕获setTimeout异步代码里的异常
```js
new Promise((resolve, reject) =>{ 
    setTimeout(() => {
        throw new Error('error');
    }, 100);
}).then(() =>{
 // 一些逻辑代码

}).catch ((e) =>{
    console.log('能进来说明可以处理异常信息了');
    console.log(e);
});

```

```js
fs.readFile('test.txt', function(err, data){
    try{
        if(err) throw err;
        // ...
    }catch(e){
        console.log(e)
    }finally{

    }
})
```

1. nodejs里约定，同步的代码才能捕获异常，异步的代码不能直接使用try、catch
- 先看同步代码可以捕获的异常
```js
const testFunc = function() {
  return new Promise((resolve, reject) => {
    throw new Error('error');
  });
};

async function testAsync() {
  try {
    await testFunc();
  } catch (e) {
    console.log('能进来，说明异常能处理');
    console.log(e);
  }
}

testAsync();
```
- 异步代码无法捕获异常
```js
const testFunc = function() {
  setTimeout(() => {
    console.log(1111);
    return new Promise((resolve, reject) => {
      throw new Error('error');
    });
  }, 100);
};

async function testAsync() {
  try {
    await testFunc();
  } catch (e) {
    console.log('能进来，说明异常能处理');
    console.log(e);
  }
}

testAsync();
```
## 进程崩溃时重启

进程因异常退出是很常见的事，当遇到崩溃退出的时候，重启就可以了。负责进程崩溃应用自动重启的模块有：

- forever模块，forever处理crash事件，再开启新的node进程（很少用了，基本都用pm2模块）
- pm2模块，支持所有的forever的功能，功能强大，比如0秒切换。

```bash
npm i pm2 -g
pm2 start app.js
```

## 大集群：多台机器

为了应对大流量，需要多台机器进行集群处理，因此可以通过负载均衡策略将流量分发到各个机器上，通过消除单点故障提升应用系统的可用性。常见的集群处理方式是使用Nginx或HAProxy。

# 参考

- [Node.js的底层原理](https://juejin.cn/post/7008504029277847565)
- [Node.js 技术架构](https://juejin.cn/post/7081891057918558221)
- [.env 文件原理](https://juejin.cn/post/7045057475845816357)
- [Node.js子进程](https://juejin.cn/post/6844903592554397710)
- [NodeJS中的事件（EventEmitter](https://juejin.cn/post/6844903678227251213)
- [书栈网node.js教程](https://www.bookstack.cn/read/Nodejs-Roadmap/nodejs-base-what-is-nodejs.md)
- 《Node.js12 实战》
- 《Node.js 企业级应用开发实战》
- 《狼叔卷1》
- 《狼叔卷2》