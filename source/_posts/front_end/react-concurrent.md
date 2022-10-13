---
title: 【React源码】React Concurrent模式
date: 2022-09-10 22:32:08
categories:
  - 前端
tags:
  - React
toc: true # 是否启用内容索引
comments: true
copyright: false
---
# React Concurrent模式

日常开发主要使用的是Legacy Mode（通过ReactDOM.render创建）

React v17.0没有包含新特性。究其原因，v17.0主要的工作在于源码内部对Concurrent Mode的支持。所以v17版本也被称为“垫脚石”版本。

实现Concurrent Mode，最关键的一点是：实现异步可中断的更新。

# 架构的驱动力 —— Scheduler
如果我们同步运行Fiber架构（通过ReactDOM.render），则Fiber架构与重构前并无区别。

但是当我们配合时间切片，就能根据宿主环境性能，为每个工作单元分配一个可运行时间，实现“异步可中断的更新”。于是，scheduler (opens new window)（调度器）产生了。

# 架构运行策略 —— lane模型

React可以控制更新在Fiber架构中运行/中断/继续运行。

基于当前的架构，当一次更新在运行过程中被中断，过段时间再继续运行，这就是“异步可中断的更新”。

当一次更新在运行过程中被中断，转而重新开始一次新的更新，我们可以说：后一次更新打断了前一次更新。

这就是优先级的概念：后一次更新的优先级更高，他打断了正在进行的前一次更新。

多个优先级之间如何互相打断？优先级能否升降？本次更新应该赋予什么优先级？

这就需要一个模型控制不同优先级之间的关系与行为，于是lane模型诞生了。

## 上层实现

现在，我们可以说：

> 从源码层面讲，Concurrent Mode是一套可控的“多优先级更新架构”。

那么基于该架构之上可以实现哪些有意思的功能？我们举几个例子：

### batchedUpdates

如果我们在一次事件回调中触发多次`更新`，他们会被合并为一次`更新`进行处理。

如下代码执行只会触发一次`更新`：

```js
onClick() {
  this.setState({stateA: 1});
  this.setState({stateB: false});
  this.setState({stateA: 2});
}
```

这种合并多个`更新`的优化方式被称为`batchedUpdates`。

`batchedUpdates`在很早的版本就存在了，不过之前的实现局限很多（脱离当前上下文环境的`更新`不会被合并）。

在`Concurrent Mode`中，是以`优先级`为依据对更新进行合并的，使用范围更广。

### Suspense

[Suspense](https://zh-hans.reactjs.org/docs/concurrent-mode-suspense.html)可以在组件请求数据时展示一个`pending`状态。请求成功后渲染数据。

本质上讲`Suspense`内的组件子树比组件树的其他部分拥有更低的`优先级`。

### useDeferredValue

[useDeferredValue](https://zh-hans.reactjs.org/docs/concurrent-mode-reference.html#usedeferredvalue)返回一个延迟响应的值，该值可能“延后”的最长时间为`timeoutMs`。

例子：

```js
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

在`useDeferredValue`内部会调用`useState`并触发一次`更新`。

这次`更新`的`优先级`很低，所以当前如果有正在进行中的`更新`，不会受`useDeferredValue`产生的`更新`影响。所以`useDeferredValue`能够返回延迟的值。

当超过`timeoutMs`后`useDeferredValue`产生的`更新`还没进行（由于`优先级`太低一直被打断），则会再触发一次高优先级`更新`。

## 总结

除了以上介绍的实现，相信未来`React`还会开发更多基于`Concurrent Mode`的玩法。

`Fiber`架构在之前的章节已经学习了。所以，在本章接下来的部分，我们会按照上文的脉络，自底向上，从架构到实现讲解`Concurrent Mode`。

# 1. 时间切片

# 2. 优先级调度

本节我们学习这个两个功能是如何在`Scheduler`中实现的。

## 时间切片原理

`时间切片`的本质是模拟实现[requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)。

除去“浏览器重排/重绘”，下图是浏览器一帧中可以用于执行`JS`的时机。

```js
一个task(宏任务) -- 队列中全部job(微任务) -- requestAnimationFrame -- 浏览器重排/重绘 -- requestIdleCallback
```

`requestIdleCallback`是在“浏览器重排/重绘”后如果当前帧还有空余时间时被调用的。

浏览器并没有提供其他`API`能够在同样的时机（浏览器重排/重绘后）调用以模拟其实现。

唯一能精准控制调用时机的`API`是`requestAnimationFrame`，他能让我们在“浏览器重排/重绘”之前执行`JS`。

这也是为什么我们通常用这个`API`实现`JS`动画 —— 这是浏览器渲染前的最后时机，所以动画能快速被渲染。

所以，退而求其次，`Scheduler`的`时间切片`功能是通过`task`（宏任务）实现的。

最常见的`task`当属`setTimeout`了。但是有个`task`比`setTimeout`执行时机更靠前，那就是[MessageChannel](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel)。

所以`Scheduler`将需要被执行的回调函数作为`MessageChannel`的回调执行。如果当前宿主环境不支持`MessageChannel`，则使用`setTimeout`。

> 你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L228-L234)看到`MessageChannel`的实现。[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L47-L55)看到`setTimeout`的实现

在`React`的`render`阶段，开启`Concurrent Mode`时，每次遍历前，都会通过`Scheduler`提供的`shouldYield`方法判断是否需要中断遍历，使浏览器有时间渲染：

```js
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

是否中断的依据，最重要的一点便是每个任务的剩余时间是否用完。

在`Schdeduler`中，为任务分配的初始剩余时间为`5ms`。

> 你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L119)看到初始剩余时间的定义

随着应用运行，会通过`fps`动态调整分配给任务的可执行时间。

> 你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L172-L187)看到动态分配任务时间

这也解释了为什么[设计理念](../preparation/idea.html#cpu的瓶颈)一节启用`Concurrent Mode`后每个任务的执行时间大体都是多于5ms的一小段时间 —— 每个时间切片被设定为5ms，任务本身再执行一小段时间，所以整体时间是多于5ms的时间

<img :src="$withBase('/img/time-slice.png')" alt="长任务">

那么当`shouldYield`为`true`，以至于`performUnitOfWork`被中断后是如何重新启动的呢？我们会在介绍完"优先级调度"后解答。

## 优先级调度

首先我们来了解`优先级`的来源。需要明确的一点是，`Scheduler`是独立于`React`的包，所以他的`优先级`也是独立于`React`的`优先级`的。

`Scheduler`对外暴露了一个方法[unstable_runWithPriority](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/Scheduler.js#L217-L237)。

这个方法接受一个`优先级`与一个`回调函数`，在`回调函数`内部调用获取`优先级`的方法都会取得第一个参数对应的`优先级`：

```js
function unstable_runWithPriority(priorityLevel, eventHandler) {
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;
    default:
      priorityLevel = NormalPriority;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}
```

可以看到，`Scheduler`内部存在5种优先级。

在`React`内部凡是涉及到`优先级`调度的地方，都会使用`unstable_runWithPriority`。

比如，我们知道`commit`阶段是同步执行的。可以看到，`commit`阶段的起点`commitRoot`方法的优先级为`ImmediateSchedulerPriority`。

`ImmediateSchedulerPriority`即`ImmediatePriority`的别名，为最高优先级，会立即执行。

```js
function commitRoot(root) {
  const renderPriorityLevel = getCurrentPriorityLevel();
  runWithPriority(
    ImmediateSchedulerPriority,
    commitRootImpl.bind(null, root, renderPriorityLevel),
  );
  return null;
}
```

## 优先级的意义

`Scheduler`对外暴露最重要的方法便是[unstable_scheduleCallback](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/Scheduler.js#L279-L359)。该方法用于以某个`优先级`注册回调函数。

比如在`React`中，之前讲过在`commit`阶段的`beforeMutation`阶段会调度`useEffect`的回调：

```js
if (!rootDoesHavePassiveEffects) {
  rootDoesHavePassiveEffects = true;
  scheduleCallback(NormalSchedulerPriority, () => {
    flushPassiveEffects();
    return null;
  });
}
```

这里的回调便是通过`scheduleCallback`调度的，优先级为`NormalSchedulerPriority`，即`NormalPriority`。

不同`优先级`意味着什么？不同`优先级`意味着不同时长的任务过期时间：

```js
var timeout;
switch (priorityLevel) {
  case ImmediatePriority:
    timeout = IMMEDIATE_PRIORITY_TIMEOUT;
    break;
  case UserBlockingPriority:
    timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
    break;
  case IdlePriority:
    timeout = IDLE_PRIORITY_TIMEOUT;
    break;
  case LowPriority:
    timeout = LOW_PRIORITY_TIMEOUT;
    break;
  case NormalPriority:
  default:
    timeout = NORMAL_PRIORITY_TIMEOUT;
    break;
}

var expirationTime = startTime + timeout;
```

其中：

```js
// Times out immediately
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
// Eventually times out
var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000;
// Never times out
var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt;
```

可以看到，如果一个任务的`优先级`是`ImmediatePriority`，对应`IMMEDIATE_PRIORITY_TIMEOUT`为`-1`，那么

```js
var expirationTime = startTime - 1;
```

则该任务的过期时间比当前时间还短，表示他已经过期了，需要立即被执行。

## 不同优先级任务的排序

我们已经知道`优先级`意味着任务的过期时间。设想一个大型`React`项目，在某一刻，存在很多不同`优先级`的`任务`，对应不同的过期时间。

同时，又因为任务可以被延迟，所以我们可以将这些任务按是否被延迟分为：

- 已就绪任务

- 未就绪任务

```js
  if (typeof options === 'object' && options !== null) {
    var delay = options.delay;
    if (typeof delay === 'number' && delay > 0) {
      // 任务被延迟
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }
```

所以，`Scheduler`存在两个队列：

- timerQueue：保存未就绪任务

- taskQueue：保存已就绪任务

每当有新的未就绪的任务被注册，我们将其插入`timerQueue`并根据开始时间重新排列`timerQueue`中任务的顺序。

当`timerQueue`中有任务就绪，即`startTime <= currentTime `，我们将其取出并加入`taskQueue`。

取出`taskQueue`中最早过期的任务并执行他。

为了能在O(1)复杂度找到两个队列中时间最早的那个任务，`Scheduler`使用[小顶堆](https://www.cnblogs.com/lanhaicode/p/10546257.html)实现了`优先级队列`。

> 你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/SchedulerMinHeap.js)看到`优先级队列`的实现

至此，我们了解了`Scheduler`的实现。现在可以回答介绍`时间切片`时提到的问题：

> 那么当shouldYield为true，以至于performUnitOfWork被中断后是如何重新启动的呢？

在“取出`taskQueue`中最早过期的任务并执行他”这一步中有如下关键步骤：

```js
const continuationCallback = callback(didUserCallbackTimeout);
currentTime = getCurrentTime();
if (typeof continuationCallback === 'function') {
  // continuationCallback是函数
  currentTask.callback = continuationCallback;
  markTaskYield(currentTask, currentTime);
} else {
  if (enableProfiling) {
    markTaskCompleted(currentTask, currentTime);
    currentTask.isQueued = false;
  }
  if (currentTask === peek(taskQueue)) {
    // 将当前任务清除
    pop(taskQueue);
  }
}
advanceTimers(currentTime);
```

当注册的回调函数执行后的返回值`continuationCallback`为`function`，会将`continuationCallback`作为当前任务的回调函数。

如果返回值不是`function`，则将当前被执行的任务清除出`taskQueue`。

`render`阶段被调度的函数为`performConcurrentWorkOnRoot`，在该函数末尾有这样一段代码：

```js
if (root.callbackNode === originalCallbackNode) {
  // The task node scheduled for this root is the same one that's
  // currently executed. Need to return a continuation.
  return performConcurrentWorkOnRoot.bind(null, root);
}
```

可以看到，在满足一定条件时，该函数会将自己作为返回值。

> 你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L850-L854)看到这段代码

## 总结

刚才我们讲到，`Scheduler`与`React`是两套`优先级`机制。那么`React`中的`优先级`是如何运转的？我们会在下一节介绍。