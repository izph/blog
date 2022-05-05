---
title: 简述WebSocket的使用
date: 2021-07-06 21:23:15
permalink: /前端/JavaScript/websocket
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# 前端Websocket的使用

## 概念

Websocket是基于TCP通信的一种持久链接的协议，只需一次握手，客户端和服务器之间可以随时交换数据。

## 使用场景

最典型的场景就是聊天室，Websocket在解决这样的需求上非常方便。由于http协议只能由客户端发起通信，如果服务器有连续的状态变化，客户端要获知就非常麻烦。我们只能使用"轮询"：每隔一段时候，就发出一个询问，了解服务器有没有新的信息。

## WebSocket特点

- 建立在 TCP 协议之上，与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器
- 数据格式比较轻量，性能开销小，通信高效
- 可以发送文本，也可以发送二进制数据
- 没有同源限制，客户端可以与任意服务器通信
- 协议标识符是ws（如果加密，则为wss），服务器网址就是URL。

## API介绍

### WebSocket构造函数

新建WebSocket实例后，会创建客户端与服务端的WebSocket连接
let ws = new WebSocket(url);

### WebSocket实例的当前状态: ws.readyState

- 0: 'CONNECTING', 表示正在连接
- 1: 'OPEN', 表示连接成功，可以通信了
- 2: 'CLOSING', 表示连接正在关闭
- 3: 'CLOSED', 表示连接已经关闭，或者打开连接失败。

### WebSocket实例的事件

- 指定连接成功后的回调函数: ws.onopen = function(){}
- 指定连接关闭后的回调函数: ws.onclose = function(){}
- 指定收到服务器数据后的回调函数: ws.onmessage = function(){}
- 指定报错时的回调函数: ws.onerror = function(){}

### WebSocket实例向后台推送消息的方法

ws.send(message);

### WebSocket应用实例和封装

```javascript
/* WebSocket封装
● @param  url: WebSocket接口地址与携带参数必填 
● @param  onOpenFunc: WebSocket的onopen回调函数，如果不需要可传null 
● @param  onMessageFunc: WebSocket的onmessage回调函数，如果不需要可传null 
● @param  onCloseFunc: WebSocket的onclose回调函数，如果不需要可传null 
● @param  onErrorFunc: WebSocket的onerror回调函数，如果不需要可传null 
● @param  heartMessage: 发送后台的心跳包参数,必填 (给服务端的心跳包就是定期给服务端发送消息) 
● @param  timer: 给后台传送心跳包的间隔时间，不传时使用默认值3000毫秒 
● @param  isReconnect: 是否断掉立即重连，不传true时不重连 
*/
function useWebSocket(url, onOpenFunc, onMessageFunc, onCloseFunc, onErrorFunc, heartMessage, timer, isReconnect) {
    let isConnected = false; // 设定已链接webSocket标记
    // websocket对象
    let ws = null;
    // 创建并链接webSocket
    let connect = () => {
        // 如果未链接webSocket，则创建一个新的webSocket
        if (!isConnected) {
            ws = new WebSocket(url);
            isConnected = true;
        }
    }
    // 向后台发送心跳消息
    let heartCheck = () => {
        ws.send(JSON.stringify(heartMessage));
    }
    // 初始化事件回调函数
    let initEventHandle = () => {
        ws.addEventListener('open', (e) => {
            console.log('onopen', e);
            // 给后台发心跳请求，在onmessage中取得消息则说明链接正常
            heartCheck();
            // 如果传入了函数，执行onOpenFunc
            if (!onOpenFunc) {
                return false;
            } else {
                onOpenFunc(e);
            }
        })
        ws.addEventListener('message', (e) => {
            console.log('onmessage', e);
            // 接收到任何后台消息都说明当前连接是正常的
            if (!e) {
                console.log('get nothing from service');
                return false;
            } else {
                // 如果获取到后台消息，则timer毫秒后再次发起心跳请求给后台，检测是否断连
                setTimeout(() => {
                    heartCheck()
                }, !timer ? 3000 : timer);
            }
            // 如果传入了函数，执行onMessageFunc
            if (!onMessageFunc) {
                return false;
            } else {
                onMessageFunc(e);
            }
        })
        ws.addEventListener('close', (e) => {
            console.log('onclose', e);
            // 如果传入了函数，执行onCloseFunc
            if (!onCloseFunc) {
                return false
            } else {
                onCloseFunc(e);
            }
            if (isReconnect) { // 如果断开立即重连标志为true
                // 重新链接webSocket
                connect();
            }
        })
        ws.addEventListener('error', (e) => {
            console.log('onerror', e);
            // 如果传入了函数，执行onErrorFunc
            if (!onErrorFunc) {
                return false;
            } else {
                onErrorFunc(e);
            }
            if (isReconnect) { // 如果断开立即重连标志为true
                // 重新链接webSocket
                connect();
            }
        })
    }
    // 初始化webSocket
    (() => {
        // 1.创建并链接webSocket
        connect();
        // 2.初始化事件回调函数
        initEventHandle()
        // 3.返回是否已连接
        return ws;
    })()
}


// WebSocket函数使用实例
useWebSocket(url, // url
    null, // onopen回调
    (e) => { // onmessage回调
        let res = JSON.parse(e.data); // 后端返回的数据
        console.log(res);
    },
    null, // onclose回调
    null, // onerror回调
    { // 心跳包消息
        "action": "9999",
        "eventType": "100",
        "requestId": ""
    },
    null, // 传送心跳包的间隔时间
    true // 断掉立即重连
)
```
