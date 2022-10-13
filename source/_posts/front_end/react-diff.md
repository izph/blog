---
title: 【React源码】React diff算法
date: 2022-07-22 20:02:15
categories:
  - 前端
tags:
  - React
toc: true # 是否启用内容索引
comments: true
copyright: false
---
# diff算法流程概览

一个`DOM节点`在某一时刻最多会有4个节点和他相关。

1. `current Fiber`。如果该`DOM节点`已在页面中，`current Fiber`代表该`DOM节点`对应的`Fiber节点`。

2. `workInProgress Fiber`。如果该`DOM节点`将在本次更新中渲染到页面中，`workInProgress Fiber`代表该`DOM节点`对应的`Fiber节点`。

3. `DOM节点`本身。

4. `JSX对象`。即`ClassComponent`的`render`方法的返回结果，或`FunctionComponent`的调用结果。`JSX对象`中包含描述`DOM节点`的信息。

`Diff算法`的本质是对比1和4，生成2。

## Diff的瓶颈以及React如何应对

由于`Diff`操作本身也会带来性能损耗，React文档中提到，即使在最前沿的算法中，将前后两棵树完全比对的算法的复杂程度为 O(n 3 )，其中`n`是树中元素的数量。

如果在`React`中使用了该算法，那么展示1000个元素所需要执行的计算量将在十亿的量级范围。这个开销实在是太过高昂。

为了降低算法复杂度，`React`的`diff`会预设三个限制：

1. 只对同级元素进行`Diff`。如果一个`DOM节点`在前后两次更新中跨越了层级，那么`React`不会尝试复用他。

2. 两个不同类型的元素会产生出不同的树。如果元素由`div`变为`p`，React会销毁`div`及其子孙节点，并新建`p`及其子孙节点。

3. 开发者可以通过 `key prop`来暗示哪些子元素在不同的渲染下能保持稳定。考虑如下例子：

```jsx
// 更新前
<div>
  <p key="ka">ka</p>
  <h3 key="song">song</h3>
</div>

// 更新后
<div>
  <h3 key="song">song</h3>
  <p key="ka">ka</p>
</div>

```
如果没有`key`，`React`会认为`div`的第一个子节点由`p`变为`h3`，第二个子节点由`h3`变为`p`。这符合限制2的设定，会销毁并新建。

但是当我们用`key`指明了节点前后对应关系后，`React`知道`key === "ka"`的`p`在更新后还存在，所以`DOM节点`可以复用，只是需要交换下顺序。

这就是`React`为了应对算法性能瓶颈做出的三条限制。

diff算法有key和没有key的区别，举个例子：页面上有两个相邻的元素需要调换位置，如果没有为这两个元素绑定key属性，React会销毁元素并新建元素。如果是指明了这两个元素的key，React就知道这两个元素是交换顺序，`DOM节点`可以复用。

## Diff是如何实现的
`Diff`的入口函数是`reconcileChildFibers`，该函数会根据`newChild`（即`JSX对象`）类型调用不同的处理函数。（render阶段）

```js
// 根据newChild类型选择不同diff函数处理
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
): Fiber | null {

    // 当前的newChild是否是 fragment类型
  const isUnkeyedTopLevelFragment =
      typeof newChild === 'object' &&
      newChild !== null &&
      newChild.type === REACT_FRAGMENT_TYPE &&
      newChild.key === null;
    if (isUnkeyedTopLevelFragment) {
      newChild = newChild.props.children;
    }

// 是否是一个object，
  const isObject = typeof newChild === 'object' && newChild !== null;

  if (isObject) {
    // object类型，可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE
    switch (newChild.$$typeof) {
        // 单一节点 由placeSingleChild处理
      case REACT_ELEMENT_TYPE:
        // 调用 reconcileSingleElement 处理
          return placeSingleChild(
            reconcileSingleElement(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes,
            ),
          );
        case REACT_PORTAL_TYPE:
          return placeSingleChild(
            reconcileSinglePortal(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes,
            ),
          );
        case REACT_LAZY_TYPE:
          if (enableLazyElements) {
            const payload = newChild._payload;
            const init = newChild._init;
            // TODO: This function is supposed to be non-recursive.
            return reconcileChildFibers(
              returnFiber,
              currentFirstChild,
              init(payload),
              lanes,
            );
          }

    }
  }
 
 // 当做文本节点处理
  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // 调用 reconcileSingleTextNode 处理
    // ...省略
  }
// 一个ul有多个li情况，这个newChild就是Array
  if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
    // ...省略
    return reconcileChildrenArray(
        returnFiber,
        currentFirstChild,
        newChild,
        lanes,
      );
  }

  // 一些其他情况调用处理函数
  // ...省略

  // 以上都没有命中，删除节点
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

我们可以从同级的节点数量将Diff分为两类：

1. 当`newChild`类型为`object`、`number`、`string`，代表同级只有一个节点

2. 当`newChild`类型为`Array`，同级有多个节点

# 单节点Diff
什么是单一节点？更新之后，这一级只存在一个节点。
对于单个节点，我们以类型`object`为例，会进入`reconcileSingleElement`

```javascript
  const isObject = typeof newChild === 'object' && newChild !== null;

  if (isObject) {
    // 对象类型，可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        // 调用 reconcileSingleElement 处理
      // ...其他case
    }
  }
```
这个函数会做如下事情：区别在于是重新生成workInProgress fiber节点，还是复用current fiber节点属性来生成workInProgress fiber。

<img src="/images/front_end/react/diff.png">


判断DOM节点是否可以复用的实现如下：reconcileSingleElement目的是比较currentFirstChild和element（对应JSX对象），最终生成workInProgress fiber。

```javascript
/**
 * returnFiber：current fiber 的 父级 fiber节点
 * currentFirstChild：当前的current fiber
 * element：对应JSX对象
 * lanes：优先级相关
*/
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement,
  lanes: Lanes,
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  
  // 首先判断是否存在对应DOM节点，mount时，child不存在
  while (child !== null) {
    // 上一次更新存在DOM节点，接下来判断是否可复用

    // 首先比较key是否相同
    if (child.key === key) {

      // key相同，接下来比较type是否相同

      switch (child.tag) {
        // ...省略case
        
        default: {
            // type相同则表示可以复用
          if (child.elementType === element.type) {
            // 删除已经存在的children，单一节点的更新，需要删除sibling
            deleteRemainingChildren(returnFiber, child.sibling);
             // useFiber是复用老的fiber
              const existing = useFiber(child, element.props);
              existing.ref = coerceRef(returnFiber, child, element);
              existing.return = returnFiber;
              if (__DEV__) {
                existing._debugSource = element._source;
                existing._debugOwner = element._owner;
              }
            // 返回复用的fiber
            return existing;
          }
          
          // type不同则跳出switch
          break;
        }
      }
      // 代码执行到这里代表：key相同但是type不同
      // 将该fiber及其兄弟fiber标记为删除
      deleteRemainingChildren(returnFiber, child);
      // 只有在key相同的情况才会 比较它的type
      break;
    } else {
     // 不能复用的情况，前后的key不相同
      // key不同，将该fiber标记为删除
      deleteChild(returnFiber, child);
    }

    child = child.sibling;
  }

  // mount阶段，currentFirstChild不存在。创建新Fiber，并返回
  if (element.type === REACT_FRAGMENT_TYPE) { // 有fragment
      const created = createFiberFromFragment(
        element.props.children,
        returnFiber.mode,
        lanes,
        element.key,
      );
      created.return = returnFiber;
      return created;
    } else {
        // 没有fragment，createFiberFromElement创建新Fiber，并返回
      const created = createFiberFromElement(element, returnFiber.mode, lanes);
      created.ref = coerceRef(returnFiber, currentFirstChild, element);
      created.return = returnFiber;
      return created;
    }
}


  function useFiber(fiber: Fiber, pendingProps: mixed): Fiber {
    // 通过current 克隆 WorkInProgress fiber
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }



function deleteRemainingChildren(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
  ): null {
    if (!shouldTrackSideEffects) {
      // Noop.
      return null;
    }

    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
}


  function deleteChild(returnFiber: Fiber, childToDelete: Fiber): void {
    if (!shouldTrackSideEffects) {
      // Noop.
      return;
    }
    const last = returnFiber.lastEffect;
    if (last !== null) {
      last.nextEffect = childToDelete;
      returnFiber.lastEffect = childToDelete;
    } else {
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
    }
    childToDelete.nextEffect = null;
    childToDelete.flags = Deletion;
  }
```

还记得我们刚才提到的，React预设的限制么，

从代码可以看出，React通过先判断`key`是否相同，如果`key`相同则判断`type`是否相同，只有都相同时一个`DOM节点`才能复用。（判断一个元素是否可以复用需要满足两个条件：更新前后元素的type是否相同，更新前后的`key`是否相同），也就是说，JSX对象上的props属性值的有变化，理论上它对应的fiber节点是可以复用的，需要调用方法更新props属性值的变化。

这里有个细节需要关注下：

- 当`child !== null`且`key相同`且`type不同`时执行`deleteRemainingChildren`将`child`及其兄弟`fiber`都标记删除。

- 当`child !== null`且`key不同`时仅将`child`标记删除。

考虑如下例子：

当前页面有3个`li`，我们要全部删除，再插入一个`p`。

```js
// 当前页面显示的
ul > li * 3

// 这次需要更新的
ul > p
```

由于本次更新时只有一个`p`，属于单一节点的`Diff`，会走上面介绍的代码逻辑。

在`reconcileSingleElement`中遍历之前的3个`fiber`（对应的`DOM`为3个`li`），寻找本次更新的`p`是否可以复用之前的3个`fiber`中某个的`DOM`。

当`key相同`且`type不同`时，代表我们已经找到本次更新的`p`对应的上次的`fiber`，但是`p`与`li` `type`不同，不能复用。既然唯一的可能性已经不能复用，则剩下的`fiber`都没有机会了，所以都需要标记删除。

当`key不同`时只代表遍历到的该`fiber`不能被`p`复用，后面还有兄弟`fiber`还没有遍历到。所以仅仅标记该`fiber`删除。


## 练习题
让我们来做几道习题巩固下吧：

请判断如下`JSX对象`对应的`DOM`元素是否可以复用：

```jsx
// 习题1 更新前
<div>ka song</div>
// 更新后
<p>ka song</p>

// 习题2 更新前
<div key="xxx">ka song</div>
// 更新后
<div key="ooo">ka song</div>

// 习题3 更新前
<div key="xxx">ka song</div>
// 更新后
<p key="ooo">ka song</p>

// 习题4 更新前
<div key="xxx">ka song</div>
// 更新后
<div key="xxx">xiao bei</div>

```

习题1: 未设置`key prop`默认 `key = null;`，所以更新前后key相同，都为`null`，但是更新前`type`为`div`，更新后为`p`，`type`改变则不能复用。

习题2: 更新前后`key`改变，不需要再判断`type`，不能复用。

习题3: 更新前后`key`改变，不需要再判断`type`，不能复用。

习题4: 更新前后`key`与`type`都未改变，可以复用。`children`变化，`DOM`的子元素需要更新。

# 多节点的Diff

```js
// 一个ul有多个li情况，这个newChild就是Array
// 一个div下有多个子元素
  if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
    // ...省略
    return reconcileChildrenArray(
        returnFiber,
        currentFirstChild,
        newChild, // 是一个数组，数组总包含 所有子元素的JSX对象 
        lanes,
      );
  }
```

现在考虑我们有一个`FunctionComponent`：

```jsx
function List () {
  return (
    <ul>
      <li key="0">0</li>
      <li key="1">1</li>
      <li key="2">2</li>
      <li key="3">3</li>
    </ul>
  )
}
```
他的返回值`JSX对象`的`children`属性不是单一节点，而是包含四个对象的数组

```js
{
  $$typeof: Symbol(react.element),
  key: null,
  props: {
    children: [
      {$$typeof: Symbol(react.element), type: "li", key: "0", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "1", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "2", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "3", ref: null, props: {…}, …}
    ]
  },
  ref: null,
  type: "ul"
}
```

这种情况下，`reconcileChildFibers`的`newChild`参数类型为`Array`，在`reconcileChildFibers`函数内部对应如下情况：


```js
  if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
    // ...省略
  }
```

这一节我们来看看，如何处理同级多个节点的`Diff`。

## 概览

首先归纳下我们需要处理的情况：

我们以**之前**代表更新前的`JSX对象`，**之后**代表更新后的`JSX对象`

### 情况1：节点更新（出现的情况非常多）

```jsx
// 之前
<ul>
  <li key="0" className="before">0<li>
  <li key="1">1<li>
</ul>

// 之后 情况1 —— 节点属性变化
<ul>
  <li key="0" className="after">0<li>
  <li key="1">1<li>
</ul>

// 之后 情况2 —— 节点类型更新
<ul>
  <div key="0">0</div>
  <li key="1">1<li>
</ul>
```

### 情况2：节点新增或减少

```jsx
// 之前
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
</ul>

// 之后 情况1 —— 新增节点
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
  <li key="2">2<li>
</ul>

// 之后 情况2 —— 删除节点
<ul>
  <li key="1">1<li>
</ul>
```

### 情况3：节点位置变化

```jsx
// 之前
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
</ul>

// 之后
<ul>
  <li key="1">1<li>
  <li key="0">0<li>
</ul>
```

同级多个节点的`Diff`，一定属于以上三种情况中的一种或多种。

## Diff的思路

该如何设计算法呢？如果让我设计一个`Diff算法`，我首先想到的方案是：

1. 判断当前节点的更新属于哪种情况
2. 如果是`新增`，执行新增逻辑
3. 如果是`删除`，执行删除逻辑
4. 如果是`更新`，执行更新逻辑

按这个方案，其实有个隐含的前提——**不同操作的优先级是相同的**

但是`React团队`发现，在日常开发中，相较于`新增`和`删除`，`更新`组件发生的频率更高。所以`Diff`会优先判断当前节点是否属于`更新`。

::: warning 注意
在我们做数组相关的算法题时，经常使用**双指针**从数组头和尾同时遍历以提高效率，但是这里却不行。

虽然本次更新的`JSX对象` `newChildren`为数组形式，但是和`newChildren`中每个组件进行比较的是`current fiber`，同级的`Fiber节点`是由`sibling`指针链接形成的单链表，即不支持双指针遍历。

即 `newChildren[0]`与`fiber`比较，`newChildren[1]`与`fiber.sibling`比较。

所以无法使用**双指针**优化。
:::

基于以上原因，`Diff算法`的整体逻辑会经历两轮遍历：

第一轮遍历：处理`更新`的节点。

第二轮遍历：处理剩下的不属于`更新`的节点。

## 第一轮遍历 

第一轮遍历步骤如下：

1. `let i = 0`，遍历`newChildren`，将`newChildren[i]`与`oldFiber`比较，判断`DOM节点`是否可复用。

2. 如果可复用，`i++`，继续比较`newChildren[i]`与`oldFiber.sibling`，可以复用则继续遍历。

3. 如果不可复用，分两种情况：

- `key`不同导致不可复用，立即跳出整个遍历（不属于第一种情况节点更新，属于了节点位置的变化）**第一轮遍历结束。**

- `key`相同`type`不同导致不可复用，会将`oldFiber`标记为`DELETION`，并继续遍历（jsx的type不一样，节点类型更新）

4. 如果`newChildren`遍历完（即`i === newChildren.length - 1`）或者`oldFiber`遍历完（即`oldFiber.sibling === null`），跳出遍历，**第一轮遍历结束。**

### reconcileChildrenArray遍历的源码

```js
function reconcileChildrenArray(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChildren: Array<*>,
    lanes: Lanes,
  ): Fiber | null {
    // 保存多节点diff 的 WorkInProgress fiber
    let resultingFirstChild: Fiber | null = null; //函数 最终返回这个变量
    // 中间变量 ，将生成的上一个节点 与生成的下一个节点，通过previousNewFiber.sibling指针连接
    let previousNewFiber: Fiber | null = null;

    // 当前正在diff的 current fiber
    let oldFiber = currentFirstChild;
    // 指代新创建的 fiber节点 对应的DOM节点 在页面中的索引位置
    // 处理情况3，也就是节点的位置变化
    let lastPlacedIndex = 0;
    // 遍历到当前 JSX对象的索引
    let newIdx = 0;
    // 代表 当前 oldFiber 的下一个 oldFiber
    let nextOldFiber = null;

    // 第一轮遍历————开始————
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }
      // 判断是否需要新建一个fiber、fiber节点是否可以复用
      const newFiber = updateSlot(
        returnFiber,
        oldFiber,
        newChildren[newIdx], // 传入的参数是需要更新的JSX对象
        lanes,
      );
      if (newFiber === null) {
        
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }
        // newFiber为空，退出第一轮遍历
        break;
      }
      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          // 将 current fiber 标记为 删除（oldFiber 就是 current fiber）
          deleteChild(returnFiber, oldFiber);
        }
      }
      // 将创建好的 fiber节点 标记flags 为 Placement 
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

      if (previousNewFiber === null) {
        
        resultingFirstChild = newFiber;
      } else {
        
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }
    // 第一轮遍历————结束————


    if (newIdx === newChildren.length) {
      // 删除所有没有遍历的 oldFiber
      // 如果 oldFiber 为null，则表示 oldFiber和 newFiber同时遍历完，所有节点可以复用
      deleteRemainingChildren(returnFiber, oldFiber);

      // 这种情况 直接返回 第一个创建的 newFiber 作为 WorkInProgress fiber
      return resultingFirstChild;
    }

    // oldFiber遍历完了，但是 newChildren还没有遍历完，说明 newChildren里有新增的节点
    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.

      // 遍历是从没有遍历到的newFiber的 newIdx索引开始 
      for (; newIdx < newChildren.length; newIdx++) {
        // 创建一个新的fiber节点
        const newFiber = createChild(returnFiber, newChildren[newIdx], lanes);

        if (newFiber === null) {
          continue;
        }
        // 将 它标记为 插入DOM中
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }

      // 返回
      return resultingFirstChild;
    }

    // Add all children to a key map for quick lookups.
    // 接下来需要处理节点位置变化的情况，不能使用前后index来比较，这时候需要使用节点前后的key 来比较，为了在O(1)复杂度找到 key对应的oldFiber，需要将oldFiber保存在 （以oldFiber 的 key为属性，以fiber节点作为value）map中，
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);

    // 继续遍历剩下的 newChildren（可能处理节点位置变化的情况）
    // Keep scanning and use the map to restore deleted items as moves.
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        newChildren[newIdx],
        lanes,
      );
      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          if (newFiber.alternate !== null) {
            // 在 map中复用完之后，需要将 对应的fiber节点去掉
            existingChildren.delete(
              newFiber.key === null ? newIdx : newFiber.key,
            );
          }
        }
        // 将新复用的 fiber节点 标记flags 为 插入（Placement）
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
    }

    if (shouldTrackSideEffects) {
      // map中含有 未被复用的 fiber，需要将未被复用的标记为删除。
      existingChildren.forEach(child => deleteChild(returnFiber, child));
    }

    // 最终返回 WorkInProgress fiber 节点
    return resultingFirstChild;
  }
```
- updateSlot方法的逻辑
```js
function updateSlot(
    returnFiber: Fiber,
    oldFiber: Fiber | null,
    newChild: any,
    lanes: Lanes,
): Fiber | null {
  // Update the fiber if the keys match, otherwise return null.
  const key = oldFiber !== null ? oldFiber.key : null;
  if (typeof newChild === 'string' || typeof newChild === 'number') {
    if (key !== null) {
      return null;
    }
    return updateTextNode(returnFiber, oldFiber, '' + newChild, lanes);
  }
  if (typeof newChild === 'object' && newChild !== null) {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE: {
        // 前后的key相同
        if (newChild.key === key) {
            // fragment 走这里的逻辑
          if (newChild.type === REACT_FRAGMENT_TYPE) {

            return updateFragment(
              returnFiber,
              oldFiber,
              newChild.props.children,
              lanes,
              key,
            );
          }
          // 其他
          return updateElement(returnFiber, oldFiber, newChild, lanes);
        } else {
         // 前后的key不相同   
        // 不能复用之前的fiber节点，直接返回null
          return null;
        }
      }
      case REACT_PORTAL_TYPE: {
        if (newChild.key === key) {
          return updatePortal(returnFiber, oldFiber, newChild, lanes);
        } else {
          return null;
        }
      }
      case REACT_LAZY_TYPE: {
        if (enableLazyElements) {
          const payload = newChild._payload;
          const init = newChild._init;
          return updateSlot(returnFiber, oldFiber, init(payload), lanes);
        }
      }
    }
    if (isArray(newChild) || getIteratorFn(newChild)) {
      if (key !== null) {
        return null;
      }
      return updateFragment(returnFiber, oldFiber, newChild, lanes, null);
    }
    throwOnInvalidObjectType(returnFiber, newChild);
  }
   return null;
}
```
- updateElement的逻辑
```js
function updateElement(
  returnFiber: Fiber,
  current: Fiber | null,
  element: ReactElement,
  lanes: Lanes,
): Fiber {


  if (current !== null) {
    // 判断 current fiber节点上的elementType 和 JSX对象的type 是否一致
    if (current.elementType === element.type ) {
      // 复用 currnet fiber 节点，传入JSX的 props
      const existing = useFiber(current, element.props);
      existing.ref = coerceRef(returnFiber, current, element);
      existing.return = returnFiber;
      
      // 将复用的 fiber 返回
      return existing;
    } else if (enableBlocksAPI && current.tag === Block) {
      // 省略...
    }
  }
  // current fiber节点上的elementType 和 JSX对象的type  不一致情况，没办法复用之前的 current fiber
  // 基于当前的JSX 对象 创建 新的fiber 节点
  const created = createFiberFromElement(element, returnFiber.mode, lanes);
  created.ref = coerceRef(returnFiber, current, element);
  created.return = returnFiber;
  return created;
}
```
- placeChild
```js
// 需要将当前fiber节点 对应的DOM节点插入到页面中
function placeChild(
  newFiber: Fiber,
  lastPlacedIndex: number,
  newIndex: number,
): number {
  // index表示fiber 节点 对应的 DOM节点 同级中的索引位置
  newFiber.index = newIndex;

  if (!shouldTrackSideEffects) {
    // 不需要追踪副作用，直接return
    return lastPlacedIndex;
  }

  // 新节点的 alternate是否存在
  const current = newFiber.alternate;

  // current 存在，代表当前 fiber节点是 复用之前的 alternate 节点 而创建的
  if (current !== null) {
    const oldIndex = current.index;
    if (oldIndex < lastPlacedIndex) {
      // This is a move.
      // 需要追踪，为flags 赋值为Placement
      // Placement作用在ReactFiberFlags查看
      newFiber.flags = Placement;
      return lastPlacedIndex;
    } else {
      // This item can stay in place.
      return oldIndex;
    }
  } else {
    // current 不存在，代表当前节点是新创建的节点，标记为 Placement
    // This is an insertion.
    newFiber.flags = Placement;

    // 返回
    return lastPlacedIndex;
  }
}
```
- mapRemainingChildren的逻辑
```js
  function mapRemainingChildren(
    returnFiber: Fiber,
    currentFirstChild: Fiber,
  ): Map<string | number, Fiber> {
    // 创建 map
    const existingChildren: Map<string | number, Fiber> = new Map();

    let existingChild = currentFirstChild;
    while (existingChild !== null) {
      if (existingChild.key !== null) {
        // key设置为 fiber节点的key，value为fiber节点
        existingChildren.set(existingChild.key, existingChild);
      } else {
        existingChildren.set(existingChild.index, existingChild);
      }
      existingChild = existingChild.sibling;
    }

    // 最终返回map
    return existingChildren;
  }
```
- updateFromMap
```js
function updateFromMap(
  existingChildren: Map<string | number, Fiber>,
  returnFiber: Fiber,
  newIdx: number,
  newChild: any,
  lanes: Lanes,
): Fiber | null {
  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // Text nodes don't have keys, so we neither have to check the old nor
    // new node for the key. If both are text nodes, they match.
    const matchedFiber = existingChildren.get(newIdx) || null;
    return updateTextNode(returnFiber, matchedFiber, '' + newChild, lanes);
  }
  if (typeof newChild === 'object' && newChild !== null) {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE: {
        const matchedFiber =
          existingChildren.get(
            newChild.key === null ? newIdx : newChild.key,
          ) || null;
        if (newChild.type === REACT_FRAGMENT_TYPE) {
          return updateFragment(
            returnFiber,
            matchedFiber,
            newChild.props.children,
            lanes,
            newChild.key,
          );
        }
        return updateElement(returnFiber, matchedFiber, newChild, lanes);
      }
      case REACT_PORTAL_TYPE: {
        const matchedFiber =
          existingChildren.get(
            newChild.key === null ? newIdx : newChild.key,
          ) || null;
        return updatePortal(returnFiber, matchedFiber, newChild, lanes);
      }
      case REACT_LAZY_TYPE:
        if (enableLazyElements) {
          const payload = newChild._payload;
          const init = newChild._init;
          return updateFromMap(
            existingChildren,
            returnFiber,
            newIdx,
            init(payload),
            lanes,
          );
        }
    }
    if (isArray(newChild) || getIteratorFn(newChild)) {
      const matchedFiber = existingChildren.get(newIdx) || null;
      return updateFragment(returnFiber, matchedFiber, newChild, lanes, null);
    }
    throwOnInvalidObjectType(returnFiber, newChild);
  }
  return null;
}
```

当遍历结束后，会有两种结果：

### 步骤3跳出的遍历

此时`newChildren`没有遍历完，`oldFiber`也没有遍历完。

举个例子，考虑如下代码：

```jsx
// 之前
<li key="0">0</li>
<li key="1">1</li>
<li key="2">2</li>
            
// 之后
<li key="0">0</li>
<li key="2">1</li>
<li key="1">2</li>
```

第一个节点可复用，遍历到`key === 2`的节点发现`key`改变，不可复用，跳出遍历，等待第二轮遍历处理。

此时`oldFiber`剩下`key === 1`、`key === 2`未遍历，`newChildren`剩下`key === 2`、`key === 1`未遍历。


### 步骤4跳出的遍历

可能`newChildren`遍历完，或`oldFiber`遍历完，或他们同时遍历完。

举个例子，考虑如下代码：

```jsx
// 之前
<li key="0" className="a">0</li>
<li key="1" className="b">1</li>
            
// 之后 情况1 —— newChildren与oldFiber都遍历完
<li key="0" className="aa">0</li>
<li key="1" className="bb">1</li>
            
// 之后 情况2 —— newChildren没遍历完，oldFiber遍历完
// newChildren剩下 key==="2" 未遍历
<li key="0" className="aa">0</li>
<li key="1" className="bb">1</li>
<li key="2" className="cc">2</li>
            
// 之后 情况3 —— newChildren遍历完，oldFiber没遍历完
// oldFiber剩下 key==="1" 未遍历
<li key="0" className="aa">0</li>
```

带着第一轮遍历的结果，我们开始第二轮遍历。

## 第二轮遍历

对于第一轮遍历的结果，我们分别讨论：

### `newChildren`与`oldFiber`同时遍历完

那就是最理想的情况：只需在第一轮遍历进行组件[`更新`](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L825)。此时`Diff`结束。

### `newChildren`没遍历完，`oldFiber`遍历完

已有的`DOM节点`都复用了，这时还有新加入的节点，意味着本次更新有新节点插入，我们只需要遍历剩下的`newChildren`为生成的`workInProgress fiber`依次标记`Placement`。

> 你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L869)看到这段源码逻辑

### `newChildren`遍历完，`oldFiber`没遍历完

意味着本次更新比之前的节点数量少，有节点被删除了。所以需要遍历剩下的`oldFiber`，依次标记`Deletion`。

> 你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L863)看到这段源码逻辑

### `newChildren`与`oldFiber`都没遍历完

这意味着有节点在这次更新中改变了位置。

这是`Diff算法`最精髓也是最难懂的部分。我们接下来会重点讲解。

> 你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L893)看到这段源码逻辑

## 处理移动的节点

由于有节点改变了位置，所以不能再用位置索引`i`对比前后的节点，那么如何才能将同一个节点在两次更新中对应上呢？

我们需要使用`key`。

为了快速的找到`key`对应的`oldFiber`，我们将所有还未处理的`oldFiber`存入以`key`为key，`oldFiber`为value的`Map`中。

```javascript
const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
```

> 你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L890)看到这段源码逻辑

接下来遍历剩余的`newChildren`，通过`newChildren[i].key`就能在`existingChildren`中找到`key`相同的`oldFiber`。

## 标记节点是否移动

既然我们的目标是寻找移动的节点，那么我们需要明确：节点是否移动是以什么为参照物？

我们的参照物是：最后一个可复用的节点在`oldFiber`中的位置索引（用变量`lastPlacedIndex`表示）。

由于本次更新中节点是按`newChildren`的顺序排列。在遍历`newChildren`过程中，每个`遍历到的可复用节点`一定是当前遍历到的`所有可复用节点`中**最靠右的那个**，即一定在`lastPlacedIndex`对应的`可复用的节点`在本次更新中位置的后面。

那么我们只需要比较`遍历到的可复用节点`在上次更新时是否也在`lastPlacedIndex`对应的`oldFiber`后面，就能知道两次更新中这两个节点的相对位置改变没有。

我们用变量`oldIndex`表示`遍历到的可复用节点`在`oldFiber`中的位置索引。如果`oldIndex < lastPlacedIndex`，代表本次更新该节点需要向右移动。

`lastPlacedIndex`初始为`0`，每遍历一个可复用的节点，如果`oldIndex >=  lastPlacedIndex`，则`lastPlacedIndex = oldIndex`。

单纯文字表达比较晦涩，这里我们提供两个Demo，你可以对照着理解。

## Demo1

在Demo中我们简化下书写，每个字母代表一个节点，字母的值代表节点的`key`
```jsx

// 之前
abcd

// 之后
acdb

===第一轮遍历开始===
a（之后）vs a（之前）  
key不变，可复用
此时 a 对应的oldFiber（之前的a）在之前的数组（abcd）中索引为0
所以 lastPlacedIndex = 0;

继续第一轮遍历...

c（之后）vs b（之前）  
key改变，不能复用，跳出第一轮遍历
此时 lastPlacedIndex === 0;
===第一轮遍历结束===

===第二轮遍历开始===
newChildren === cdb，没用完，不需要执行删除旧节点
oldFiber === bcd，没用完，不需要执行插入新节点

将剩余oldFiber（bcd）保存为map

// 当前oldFiber：bcd
// 当前newChildren：cdb

继续遍历剩余newChildren

key === c 在 oldFiber中存在
const oldIndex = c（之前）.index;
此时 oldIndex === 2;  // 之前节点为 abcd，所以c.index === 2
比较 oldIndex 与 lastPlacedIndex;

如果 oldIndex >= lastPlacedIndex 代表该可复用节点不需要移动
并将 lastPlacedIndex = oldIndex;
如果 oldIndex < lastplacedIndex 该可复用节点之前插入的位置索引小于这次更新需要插入的位置索引，代表该节点需要向右移动

在例子中，oldIndex 2 > lastPlacedIndex 0，
则 lastPlacedIndex = 2;
c节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：bd
// 当前newChildren：db

key === d 在 oldFiber中存在
const oldIndex = d（之前）.index;
oldIndex 3 > lastPlacedIndex 2 // 之前节点为 abcd，所以d.index === 3
则 lastPlacedIndex = 3;
d节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：b
// 当前newChildren：b

key === b 在 oldFiber中存在
const oldIndex = b（之前）.index;
oldIndex 1 < lastPlacedIndex 3 // 之前节点为 abcd，所以b.index === 1
则 b节点需要向右移动
===第二轮遍历结束===

最终acd 3个节点都没有移动，b节点被标记为移动

```

## Demo2

```jsx
// 之前
abcd

// 之后
dabc

===第一轮遍历开始===
d（之后）vs a（之前）  
key改变，不能复用，跳出遍历
===第一轮遍历结束===

===第二轮遍历开始===
newChildren === dabc，没用完，不需要执行删除旧节点
oldFiber === abcd，没用完，不需要执行插入新节点

将剩余oldFiber（abcd）保存为map

继续遍历剩余newChildren

// 当前oldFiber：abcd
// 当前newChildren dabc

key === d 在 oldFiber中存在
const oldIndex = d（之前）.index;
此时 oldIndex === 3; // 之前节点为 abcd，所以d.index === 3
比较 oldIndex 与 lastPlacedIndex;
oldIndex 3 > lastPlacedIndex 0
则 lastPlacedIndex = 3;
d节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：abc
// 当前newChildren abc

key === a 在 oldFiber中存在
const oldIndex = a（之前）.index; // 之前节点为 abcd，所以a.index === 0
此时 oldIndex === 0;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 0 < lastPlacedIndex 3
则 a节点需要向右移动

继续遍历剩余newChildren

// 当前oldFiber：bc
// 当前newChildren bc

key === b 在 oldFiber中存在
const oldIndex = b（之前）.index; // 之前节点为 abcd，所以b.index === 1
此时 oldIndex === 1;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 1 < lastPlacedIndex 3
则 b节点需要向右移动

继续遍历剩余newChildren

// 当前oldFiber：c
// 当前newChildren c

key === c 在 oldFiber中存在
const oldIndex = c（之前）.index; // 之前节点为 abcd，所以c.index === 2
此时 oldIndex === 2;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 2 < lastPlacedIndex 3
则 c节点需要向右移动

===第二轮遍历结束===

```

可以看到，我们以为从 `abcd` 变为 `dabc`，只需要将`d`移动到前面。

但实际上React保持`d`不变，将`abc`分别移动到了`d`的后面。

从这点可以看出，考虑性能，我们要尽量减少将节点从后面移动到前面的操作。