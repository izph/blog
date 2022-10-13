---
title: 【React源码】React的设计理念 
date: 2022-05-14 08:15:20
categories:
  - 前端
tags:
  - React
toc: true # 是否启用内容索引
comments: true
copyright: false
---
# React简介

- React 是用 JavaScript 构建`快速响应`的大型 Web 应用程序的前端框架，其设计理念就是快速响应。

- React 吸收了函数式编程中代数效应的思想。从数据结构来讲，React 大量使用了链表，在调度阶段使用了小顶堆，并且使用了许多的闭包。

## 什么因素制约了 React 快速响应？什么因素导致应用不流畅呢？
可能是因为进行了大量的计算，或者是因为当前网络状况不佳，正在等待请求的返回才能进一步操作导致不能快速响应等，可以说是计算能力和网络延迟的原因，制约了React快速响应，最终可归结为CPU的瓶颈和IO的瓶颈。

## Reeact 为了践行快速响应的设计理念，是如何解决CPU和IO的瓶颈？
1. 主流的浏览器刷新频率为60Hz，也就是说每16.6ms（`1000ms/60Hz=16.6ms`）浏览器刷新一次。在这16.6ms过程中，会依次执行JS脚本、样式布局、样式绘制。如果JS脚本的执行时间超过了16.6ms，那么这一帧就没有时间留给样式布局、样式绘制。浏览器就会掉帧，表现形式就是浏览器的滚动不流畅、在输入框输入的字符不能及时的响应在页面上。对于这种情况，一般采用防抖（一段输入只会触发一次更新）和节流（限制触发更新的频率）来优化，本质上来说，这两个都是限制我们触发更新的频率，来减少掉帧的可能性，但是这是治标不治本的办法。随着我们输入的字符越来越多，我们每一次更新所需要的时间，都超过了浏览器一帧的时间时，那么使用防抖和节流也会造成浏览器的掉帧，那么有没有解决的办法呢？React给出的办法是将同步的更新改为异步更新。

2. 简单来说，React 和浏览器做了一个约定，将自己一帧的时间预留给 React，React 利用这一部分时间来完成自己的工作，如果某个工作需要的时间特别长，超出了这个预留时间，React 会中断自己的工作，并将控制权交给浏览器，等到下一帧，浏览器给到自己预留的那部分时间到来之后，再继续之前被中断的工作，这样浏览器在每一帧都会有时间执行`样式布局`与`样式绘制`，这样就有可能减少掉帧的可能性。

3. 所以，当采用了`异步更新`的形式，即使是更新了大量的节点，这样 CPU 密集型操作，React 也能有效的减少掉帧的可能性。

## React是如何解决IO的瓶颈呢？
1. 比如需要等待数据请求的结果返回，才能做出进一步的响应的场景下，用户才能感知到快速响应呢？将人机交互的研究结果整合到真实的UI中，研究表明，在屏幕之间切换时显示过多的中间加载状态会使切换的速度变慢。对于UI交互来说，延迟显示中间加载的状态能让用户感觉更流畅。

React为了解决IO的瓶颈，以实现快速响应的理念，React更逐步在框架的层面实现异步可中断的更新机制，不管是CPU的瓶颈，还是IO的瓶颈，最重要的是实现一套异步的更新机制。

## React设计理念的总结
React设计理念是快速响应，制约`快速响应`的因素是CPU瓶颈与IO瓶颈，解决办法是实现`异步可中断更新`。

# React架构
React 从 v15 升级到 v16 后重构了整个架构。

## React15 老架构
React15架构分为两部分，分别是决定渲染什么组件（Reconciler 协调器）、将组件渲染到视图中（Renderer 渲染器）。对应于 Reconciler 协调器和 Renderer 渲染器，老的架构无法实现`中断更新`，需要新的 React16 架构，才能实现`异步可中断更新`。

### Reconciler（协调器）
1. 在 React 中可以通过`this.setState`、`this.forceUpdate`、`ReactDOM.render`等API触发更新。

2. 每当有更新发生时，Reconciler会做如下工作：

- 直接调用函数组件或 class 组件的 render 方法，将返回的 JSX 转化为虚拟 DOM
- 将虚拟 DOM 和上次更新时的虚拟 DOM 对比
- 通过对比找出本次更新中变化的虚拟 DOM
- 通知 Renderer（渲染器）将变化的虚拟 DOM 渲染到页面上

3. 协调器负责决定本次更新有什么组件需要渲染，diff 算法就是发生在协调器中。在 diff 算法中，会将上一次更新的虚拟 DOM 与本次更新的 DOM 做一个对比，最终只有变化的部分会被渲染到视图中，diff 算法的官方名称是 reconcile，就是协调的意思，这也是协调器的由来。经过 diff 算法判定为本次需要更新的 虚拟DOM，会交给渲染器，渲染到视图中，不同的渲染器会将组件渲染到不同的宿主环境视图中。

### Render（渲染器）
在每次更新发生时，Renderer（渲染器）接到 Reconciler（协调器）通知，将变化的组件渲染在当前宿主环境。
- ReactDOM 渲染器，渲染到浏览器；
- ReactNative 渲染器，渲染App原生组件；
- ReactTest 渲染器，渲染出纯JS对象用于测试；
- ReactArt 渲染器，渲染出Canvas、SVG。

### React15架构的缺点
采用递归执行更新，更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过了浏览器间隔刷新一帧的时间（16.6ms），页面的交互就会出现卡顿。

## React16 新架构（新的React架构）
1. 由于更新是异步可中断的，在新的架构中，新增了一个模块来管理这些异步更新，每一个更新会被赋予一个优先级，高优先级的更新会被更快的调度。这个模块的被称为Scheduler（调度器）。

2. React16新的架构：
- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

### Scheduler（调度器）

#### Scheduler（调度器）工作原理
对于老的架构，更新会直接被 `Reconciler（协调器）`处理。在新的架构中，更新首先会被 `Scheduler（调度器）`处理，`调度器`会调度这些更新的优先级，更高优先级的更新会优先进入 Reconciler（协调器），在`协调器`正在执行 diff 算法时，如果此时产生了一个更高优先级的更新，那么正在`协调器`的`协调的更新`会被中断，由于`调度器`与`协调器`都是在内存中工作，不会执行具体的视图操作。即使有中断发生，用户也不会看到更新不完全的视图。当某次更新中，完成了在协调器的工作时，`协调器`会通知`渲染器`，本次更新有哪些组件，需要执行对应的视图操作，由`渲染器`来分别执行这些视图操作。对应我们常见的ReactDOM来说，这些视图操作包含了 DOM 节点的增删改查操作。当高优先级的更新最终完成了渲染，协调器又会调度新一轮的调度。

diff 算法的目的是创建一颗虚拟 DOM 树，每一个视图上存在的节点，都有一个虚拟 DOM 节点与其对应，被更新的节点会被打上`Update`标记（flags），最终`协调器`会将打了标记的虚拟 DOM 交给`渲染器`。 `渲染器`接收到通知后，会查看有哪些被打记号的虚拟DOM，被标记为`Update`的虚拟 DOM 节点对应的`真实DOM`会被`渲染器`执行`更新DOM`的操作。通过调度器、协调器、渲染器互相配合，React新的架构实现了异步可中断的更新。

### Reconciler（协调器）
当我们开启了Concurrent模式后（React18），更新工作中会调用`workLoopConcurrent`方法，从递归变成了可以中断的循环过程，每次循环都会调用shouldYield判断当前是否有剩余时间。
```js
function workLoopConcurrent() {
  // workInProgress是当前fiber节点
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

# React 协调器（Reconciler）的新架构Fiber
React 践行`代数效应`，那`代数效应`与`Fiber架构`有什么联系吗？`代数效应`是函数式编程中的概念，用于将`副作用`从`函数`调用中分离，使得函数的关注点保持纯粹。
- 为了演示代数效应，虚构的语法 perform、handle、resume。执行 getTotalPicNum 函数，perform 语法会被 try handle 捕获，在 handle 处理 case。
- `resume with num`会回到 getPicNum 函数调用栈，再中断执行完任务，回到之前的`getTotalPicNum`调用栈后，会继续执行接下来`return num1 + num2`的工作。
- 参考[代数效应](https://react.iamkasong.com/process/fiber-mental.htm)
```js
// 异步可中断更新原理
function getTotalPicNum(user1, user2) {
    const num1 = getPicNum(user1);
    const num2 = getPicNum(user2);
    return num1 + num2;
}
function getPicNum(name){
    const picNum = perform name;
    return picNum;
}
function run(){
    try {
        getTotalPicNum('SouthStar', 'Nanxing');
    } handle (who) {
        switch (who) {
            case 'SouthStar':
                resume with 123;
            case 'Nanxing':
                resume with 12;
            default:
                resume with 0;
        }
    }
}
run()
```
1. `代数效应`与`React`关系：Hooks。比如`useState`的值如何保存在函数组件，我们不太需要关注，这个由 React 处理。还有就是请求数据的写法如果是同步的，至于如何异步的请求数据，中间的加载状态是如何展示的，这完全是交由 React 来处理。

2. Fiber 就是利用了代数效应的中断、恢复，来完成了`异步可中断的更新`。

3. Fiber 的中文名是纤程，与进程(Process)、线程(Thread)、协程(Coroutine)同为操作系统的程序的执行过程，纤程可以理解为协程的一种实现，在JS中协程已经有了一种实现，就是 generator。

4. React团队为什么不直接使用generator来实现异步的更新，而是自己去实现一套 Fiber 纤程呢？
- generator和async/await一样，具有传染性，当一个函数成为generator函数后，这个函数调用链上的其他函数也会受到影响。
- 设计Fiber架构的目的是：更新可以中断并继续，更新可以拥有不同的优先级，高优先级的更新可以打断低优先级的更新
- 使用generator可以达到更新可以中断并继续的目的，但是不能实现不同的优先级的更新，所有React团队决定重头实现一套Fiber架构。

# Fiber架构

## Fiber的含义
`Fiber`和`JSX`都可以理解为一种数据结构，在`React16新架构`中，`Fiber节点`就是`虚拟DOM`。`Fiber`包含三层含义：

1. 作为架构来说，之前`React15`的`Reconciler`采用递归的方式执行，数据保存在递归调用栈中，所以被称为`stack Reconciler`，stack就是调用栈。`React16`的协调器`Reconciler`是基于`Fiber节点`实现，被称为`Fiber Reconciler`。

2. 作为静态的数据结构来说，每个`Fiber节点`对应一个`React element`（React组件），保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息，这是的`Fiber节点`也就是我们所说的`虚拟DOM`。举个例子，有一个 App 组件，当首次调用`ReactDOM.render`时，会创建整个应用的根节点`FiberRootNode`，我们是可以多次调用`ReactDOM.render`，将不同的应用挂载到不同的应用节点下，每个应用都有自己的`根RootFiber节点`。在一个页面中，可以有多个`RootFiber`，但是只能有一个`FiberRootNode`来管理这些`RootFiber`。

## Fiber的结构
```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag; // 组件的类型，如function组件、class组件、DOM对应的Fiber节点（原生）
  this.key = key; // 我们常用的key属性
  // 大部分情况elementType与type是一致的。在某些情况下，FunctionComponent被React.memo包裹时，它的elementType与type不同。
  this.elementType = null;
  // 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
  this.type = null;
  // Fiber对应的真实DOM节点，对于HostComponent，指真实的DOM节点，
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  // 对于多个同级Fiber节点，代表它们插入DOM的位置索引
  this.index = 0; 

  this.ref = null; // 常用的ref属性

  // 作为动态的工作单元的属性，保存本次更新造成的状态改变相关信息
  this.pendingProps = pendingProps;
  this.memoizedProps = null;

  // 存放属性的 增删改 
  // 存在updateQueue时，会调用markUpdate，为workInProgress的flags 标记为Update
  this.updateQueue = null;

  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  // HostComponent的副作用是增删查改，对应FunctionComponent使用了useEffect、useLayoutEffect
  this.flags = NoEffect;

  // 带有effect与副作用相关，标记flag的 fiber节点与fiber节点之间的 通过链表连接
  this.nextEffect = null;
  this.firstEffect = null;
  this.lastEffect = null;

  // lanes属性与调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

## Fiber节点的连接

1. 每个Fiber节点有个对应的`React element`，多个`Fiber节点`是如何连接形成树呢？靠如下三个属性：

```js
// 指向父级Fiber节点
this.return = null;
// 指向第一个子Fiber节点
this.child = null;
// 指向右边第一个兄弟Fiber节点
this.sibling = null;
```

2. 组件结构如下：

```js
function App() {
  return (
    <div>
      title
      <span>标题</span>
    </div>
  )
}
```
- 对应的`Fiber树`结构：
<img src="/images/front_end/react/fiber.png">

- 为什么父级指针叫做`return`而不是`parent`或者`father`呢？
这是因为React15的`stack Reconciler`以递归的形式工作，当从根节点执行递归操作时，首先会从根节点递归向下到子节点，再从子节点一路向上归到根节点，所以在这个递归阶段，函数处理完子节点后，会返回它的父节点。在`Fiber Reconciler`使用遍历的形式使用可中断的递归，也复用了这种思想。这就是为什么采用return指向父节点。

- RootFiber采用stateNode指向FiberRootNode
<img src="/images/front_end/react/rootfiber.png">


3. 作为动态的工作单元来说，每个`Fiber节点`保存了本次更新中该组件改变的状态、要执行的工作、要执行的副作用（需要被删除/被插入页面中/被更新...）。

## Fiber架构的工作原理

### React如何更新页面？
当首次调用ReactDOM.render时，会创建整个应用的根节点FiberRootNode（源码中叫fiberRoot），每次调用ReactDOM.render，都会常见当前应用的根节点rootFiber，其中FiberRootNode.current指向rootFiber（fiberRootNode.current = rootFiber;），由于在首次渲染页面之前，页面是空白的，所以rootFiber没有子节点（页面中还没有挂载任何DOM，所以fiberRootNode.current指向的rootFiber没有任何子Fiber节点，即current Fiber树为空）。接下来进入首屏渲染的逻辑，不管是首屏渲染还是调用this.setState，或者是useState的setXXX方法创建的更新，都会从根节点rootFiber创建一颗fiber树，首先创建根节点的rootFiber节点，这两棵树中都存在着rootFiber节点，会用alternate属性连接，方便两个fiber直接共用一些属性，接下来采用深度优先遍历模拟递归的方式创建整颗fiber树.

<img src="/images/front_end/react/rootfiber-2cache.png">

现在我们拥有两颗Fiber树，左边代表页面内容的fiber树，称为current Fiber树。右侧由于触发了更新，在内存中构建的fiber树，称为workInProgress Fiber树，它是根据组件返回的JSX在内存中依次创建Fiber节点并连接在一起构建Fiber树。

<img src="/images/front_end/react/rootfiber-update.png">

当workInProgress Fiber树完成了渲染（即当workInProgress Fiber树构建完成交给Renderer渲染在页面上后），此时FiberRootNode.current指向了workInProgress Fiber树的根节点rootFiber，于是workInProgress Fiber树的根节点rootFiber就变成了current Fiber树，FiberRootNode.current指向更新后的rootFiber。

<img src="/images/front_end/react/rootfiber-afterupdate.png">

接下来，我们点击p标签，触发一次更新，每次触发更新都会重新创建一颗workInProgress Fiber树。 可以将 current Fiber树的节点称为 current节点，此时 current 的 rootFiber的alternate属性已经指向了一个 rootFiber，所以在创建 workInProgress Fiber树 时会基于这个 rootFiber来创建。在本次更新中，除了rootFiber，APP 与 p 都有对应的current Fiber 存在（alternate指向该fiber在另一次更新时对应的fiber），这种将current Fiber 与本次更新返回的 JSX结构做对比，生成 workInProgress Fiber的过程，就是diff算法。所有首屏渲染与更新最大的区别在于：在创建Fiber树的过程中 是否有diff算法。
```js
current Fiber树中的Fiber节点被称为current fiber，workInProgress Fiber树中的Fiber节点被称为workInProgress fiber，他们通过alternate属性连接。

currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```
<img src="/images/front_end/react/rootfiber-update01.png">

当workInProgress Fiber树最终完成了渲染，FiberRootNode.current指向了workInProgress Fiber树的根节点，此时它就变成了current Fiber树。
<img src="/images/front_end/react/rootfiber-update02.png">

# React首屏渲染具体执行流程
1. 调度阶段
当首次调用ReactDOM.render时，会创建整个应用的根节点FiberRootNode，`FiberRootNode`方法就是创建整个FiberRootNode
<img src="/images/front_end/react/first-render001.png">
- createHostRootFiber

- createFiber，它的参数tag为3由 createHostRootFiber中调用createFiber传入
<img src="/images/front_end/react/first-render002.png">

2. 协调阶段

<img src="/images/front_end/react/first-render003.png">

- scheduleUpdateOnFiber，调度这次更新，当调度成功后，我们会执行这次更新performSyncWorkOnRoot，也就是说从根节点开始这次更新
- 创建 workInProgress Fiber树 可以类比为递归的流程，beginWork为`递`过程，completeWork为`归`过程。
<img src="/images/front_end/react/first-render004.png">

- renderRootSync就是协调器的执行（render阶段），与它同级的commitRoot代表了这次渲染器的工作入口（commit阶段）
<img src="/images/front_end/react/first-render005.png">

- 渲染器的工作入流程：将变化的节点渲染到视图上，before mutation阶段（渲染前），mutation阶段（渲染中），layout阶段（渲染后）
<img src="/images/front_end/react/first-render006.png">

## JSX
JSX用来描述React组件的内容，JSX的本质：JavsScript的语法扩展。
- JSX和Fiber节点是同一个东西么，它们的关系？
- React Component、React Element是同一个东西么，他们和JSX有什么关系？

### babel
JSX语法是如何在JavaScript（或者浏览器）中生效的？JSX会被编译为 React.createElement()，React.createElement()将返回一个叫作“React Element”的JS对象。

@babel/plugin-transform-react-jsx 将jsx 进行编译
```jsx
// <div>1</div> 编译后
React.createElement("div", null, "1");
```
### React.createElement

既然JSX会被编译为React.createElement，让我们看看他做了什么：
```js
// type节点类型，config组件的属性
export function createElement(type, config, children) {
  // 用于存储后面需要用到的元素属性
  let propName;
  // 用于存储元素属性的键值对集合
  const props = {};
  // 定义一些字段，key、ref是我们经常使用的
  let key = null; // 作为保留属性传递
  let ref = null; // 作为保留属性传递
  let self = null; // __self作为保留属性传递
  let source = null; // __source作为保留属性传递

  if (config != null) {
    // 将 config 处理后赋值给 props
    // ...省略
  }

  const childrenLength = arguments.length - 2;
  // 处理 children，会被赋值给props.children
  // ...省略

  // ...省略
  // 处理 defaultProps  Resolve default props
  // defaultProps来自于React.createElement第一次参数type
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}

const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // 标记这是个 React Element
    $$typeof: REACT_ELEMENT_TYPE,

    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner,
  };

  return element;
};
```
React.createElement最终会调用ReactElement方法返回一个包含组件数据的对象，该对象有个参数$$typeof: REACT_ELEMENT_TYPE标记了该对象是个React Element。

所以调用React.createElement返回的对象就是React Element么？

React提供了验证合法React Element的全局API React.isValidElement (opens new window)，我们看下他的实现：
```js
export function isValidElement(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```
可以看到，`$$typeof === REACT_ELEMENT_TYPE`的非null对象就是一个合法的React Element。换言之，在React中，所有JSX在运行时的返回结果（即React.createElement()的返回值/调用结果）都是React Element。


JSX与 Fiber的关系：创建Fiber节点的依据就是 组件返回的JSX对象，JSX是一种描述当前组件内容的数据结构。在更新时，依据存在了一颗current Fiber树，所以在生成 workInProgress Fiber树 时，将组件返回的JSX对象，与这个组件对应的 current Fiber节点做对比，根据对比的结果生成workInProgress Fiber树。这就是JSX与 Fiber的关系，JSX最终会被编译为 React.createElement方法的执行。理论上来说，只要改变React.createElement的方法，就能改变页面最终的渲染结果。


### __REACT_DEVTOOLS_GLOBAL_HOOK__

__REACT_DEVTOOLS_GLOBAL_HOOK__对象含有一个renderers，渲染器，急速`React-DOM`。
<img src="/images/front_end/react/react-jsx001.png">


# 参考
- [React理念](https://react.iamkasong.com/preparation/idea.html)
- [React15架构](https://react.iamkasong.com/preparation/oldConstructure.html)
- [React16架构](https://react.iamkasong.com/preparation/newConstructure.html)
- [Fiber架构的实现原理](https://react.iamkasong.com/process/fiber.html)
- [Fiber架构的工作原理](https://react.iamkasong.com/process/doubleBuffer.html)

