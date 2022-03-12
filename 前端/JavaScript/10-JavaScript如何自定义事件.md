---
title: JavaScript自定义事件
date: 2022-01-17 20:53:16
permalink: /前端/JavaScript/JavaScript自定义事件
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# JavaScript自定义事件

JavaScript自定义事件，是基于观察者模式的实现。

## 1、CustomEvent

向事件对象添加更多数据，可以使用 CustomEvent 接口，detail 属性可用于传递自定义数据

```javascript
/**
 * type(String): 事件的类型名称
 * bubbles(Boolean): 表明该事件是否会冒泡
 * cancelable(Boolean): 表明该事件是否可以被取消
 * detail(any): 事件初始化时传递的数据
 * ......
 * **/
CustomEvent(type, {
    bubbles: false,
    cancelable: true,
    detail: null
})

// 创建事件对象
let customEvent = new CustomEvent("eventName", {
  bubbles: true, // 允许冒泡
  detail: {
    a: 1, 
  }
})

// 监听事件 document & window
window.addEventListener('eventName', function(e){
    console.log(e)
    console.log(e.detail.a) // 1
})

// 触发事件 document & dom元素
document.dispatchEvent(customEvent)
// 事件可以在任何dom元素触发，不仅仅是document
// dom.dispatchEvent(customEvent);
```

## 2、Event

```javascript
// MDN官网例子
var event = new Event('build');

// Listen for the event.
elem.addEventListener('build', function (e) { ... }, false);

// Dispatch the event.
elem.dispatchEvent(event);
```

## 3、Event 与 CustomEvent 区别

Event适合创建简单的自定义事件，而CustomEvent支持参数传递的自定义事件，它支持 detail 参数，作为事件中需要被传递的数据，并在 EventListener 获取。
注意:  当一个事件触发时，若相应的元素及其上级元素没有进行事件监听，则不会有回调操作执行。
当需要对于子元素进行监听，可以在其父元素进行事件托管，让事件在事件冒泡阶段被监听器捕获并执行。此时可以使用 e.target 获取到具体触发事件的元素。

## 4、document.createEvent

创建一个新的事件（Event），随之必须调用自身的 init 方法进行初始化

```javascript
// createEvent创建事件
let myEvent = document.createEvent('Event');

// 定义事件名为'buildEvent'
myEvent.initEvent('buildEvent', true, true, {data: 1});
// initEvent(eventType, canBubble, cancelable, detail)
// eventType: 事件名称
// canBubble: 是否支持冒泡
// cancelable: 是否可以用 preventDefault()方法取消事件
// detail: 初始化参数

myEvent.name = "document.createEvent创建的自定义事件"
// 如果需要监听事件

document.addEventListener('buildEvent', function (e) {
    // e.target matches elem
    alert(e.name)
    console.log(e)
    console.log(e.target)
    console.log(e.detail.data)
}, false);

// 触发对象可以是任何元素或其他事件目标
document.dispatchEvent(myEvent);
```
