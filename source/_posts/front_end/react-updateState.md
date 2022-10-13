---
title: 【React源码】React状态更新
date: 2022-08-11 21:55:32
categories:
  - 前端
tags:
  - React
toc: true # 是否启用内容索引
comments: true
copyright: false
---

# 状态更新的整个流程

## 更新

1. 产生更新：调用
2. 决定需要更新什么组件：协调 （render）
3. 将更新的组件渲染到页面：渲染 （commit阶段）
- before mutation阶段：渲染前 
- mutation阶段：渲染中
- layout阶段：渲染后

## 几个关键节点

状态更新的整个流程：我们需要一个机制，触发状态更新，并且经过一些流程，进入render阶段，在render中执行reconcile（也就是diff算法），diff的结果会交给commit阶段，去执行视图的更新。

### render阶段的开始

`render阶段`开始于`performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`方法的调用。这取决于本次更新是同步更新（同步模式）还是异步更新（并发模式Concurrent）。

开启并发模式Concurrent，更新会获得不同程度的优先级，不同的优先级会以异步的方式调度执行，当进入render阶段时，调用的是`performConcurrentWorkOnRoot`。而当前使用的ReactDOM.render渲染的页面（legacy模式）是同步的模式，也就是所有的更新是同步进行的。

开启并发模式Concurrent：ReactDOM.createRoot(rootNode).render(<App />)

[严格模式](https://react.docschina.org/docs/strict-mode.html)

### commit阶段的开始

`commit阶段`开始于`commitRoot`方法的调用。其中`rootFiber`会作为传参。`render阶段`完成后会进入`commit阶段`。接下来讲解从`触发状态更新`到`render阶段`的路径。



```sh
触发状态更新（根据场景调用不同方法）

    |
    |
    v

    ？

    |
    |
    v

render阶段（`performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot`）

    |
    |
    v

commit阶段（`commitRoot`）
```

### 创建Update对象

在`React`中，有如下方法可以触发状态更新（排除`SSR`相关）：

- ReactDOM.render（首屏渲染）

- this.setState（ClassComponent）

- this.forceUpdate（ClassComponent）

- useState（FunctionComponent）

- useReducer（FunctionComponent）

这些方法调用的场景各不相同，他们是如何接入同一套**状态更新机制**呢？

答案是：每次`状态更新`都会创建一个保存**更新状态相关内容**的对象，我们叫它`Update`。在`render阶段`的`beginWork`中会根据`Update`计算新的`state`。

### 触发更新的流程
在FunctionComponent中有一个按钮，点击按钮，在onClick事件中触发useState的setState方法，setState触发后会调用dispatchAction。
- dispatchAction方法
```js
function dispatchAction<S, A>(
  fiber: Fiber, // 触发更新的FunctionComponent 对应的 fiber节点
  queue: UpdateQueue<S, A>,
  action: A,
) {
  
  const eventTime = requestEventTime();
  const lane = requestUpdateLane(fiber);

    // 创建Update对象，包含本次更新的一些数据，update会被保存在一条环状链表，pending中
  const update: Update<S, A> = {
    lane,
    action, // useState的setState触发后的传参
    eagerReducer: null,
    eagerState: null,
    next: (null: any),
  };

  // Append the update to the end of the list.
  const pending = queue.pending;
  if (pending === null) {
    // This is the first update. Create a circular list.
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  queue.pending = update;

  const alternate = fiber.alternate;
  if (
    fiber === currentlyRenderingFiber ||
    (alternate !== null && alternate === currentlyRenderingFiber)
  ) {
    // This is a render phase update. Stash it in a lazily-created map of
    // queue -> linked list of updates. After this render pass, we'll restart
    // and apply the stashed updates on top of the work-in-progress hook.
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
  } else {
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
      // The queue is currently empty, which means we can eagerly compute the
      // next state before entering the render phase. If the new state is the
      // same as the current state, we may be able to bail out entirely.
      const lastRenderedReducer = queue.lastRenderedReducer;
      if (lastRenderedReducer !== null) {
        let prevDispatcher;

        try {
          const currentState: S = (queue.lastRenderedState: any);
          const eagerState = lastRenderedReducer(currentState, action);
          // Stash the eagerly computed state, and the reducer used to compute
          // it, on the update object. If the reducer hasn't changed by the
          // time we enter the render phase, then the eager state can be used
          // without calling the reducer again.
          update.eagerReducer = lastRenderedReducer;
          update.eagerState = eagerState;
          if (is(eagerState, currentState)) {
            return;
          }
        } catch (error) {
          // Suppress the error. It will throw again in the render phase.
        } finally {
          if (__DEV__) {
            ReactCurrentDispatcher.current = prevDispatcher;
          }
        }
      }
    }
    }

    // 最终调用：在 这个fiber中调度update更新
    scheduleUpdateOnFiber(fiber, lane, eventTime);
  }

  if (enableSchedulingProfiler) {
    markStateUpdateScheduled(fiber, lane);
  }
}
```
- scheduleUpdateOnFiber
```js
export function scheduleUpdateOnFiber(
	fiber: Fiber,
	lane: Lane,
	eventTime: number
) {
	checkForNestedUpdates();
	warnAboutRenderPhaseUpdatesInDEV(fiber);

    // 由当前触发更新的fiber，一直向上遍历到根节点
	const root = markUpdateLaneFromFiberToRoot(fiber, lane);
	if (root === null) {
		warnAboutUpdateOnUnmountedFiberInDEV(fiber);
		return null;
	}

	// Mark that the root has a pending update.
	markRootUpdated(root, lane, eventTime);

	if (root === workInProgressRoot) {
		
		if (
			deferRenderPhaseUpdateToNextBatch ||
			(executionContext & RenderContext) === NoContext
		) {
			workInProgressRootUpdatedLanes = mergeLanes(
				workInProgressRootUpdatedLanes,
				lane
			);
		}
		if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
			markRootSuspended(root, workInProgressRootRenderLanes);
		}
	}

	// TODO: requestUpdateLanePriority also reads the priority. Pass the
	// priority as an argument to that function and this one.
	const priorityLevel = getCurrentPriorityLevel();

    // 判断当前的优先级是否是 同步的
	if (lane === SyncLane) { // legacy模式
		if (
			// Check if we're inside unbatchedUpdates
			(executionContext & LegacyUnbatchedContext) !== NoContext &&
			// Check if we're not already rendering
			(executionContext & (RenderContext | CommitContext)) === NoContext
		) {
			// Register pending interactions on the root to avoid losing traced interaction data.
			schedulePendingInteractions(root, lane);

			performSyncWorkOnRoot(root);
		} else {
			ensureRootIsScheduled(root, eventTime);
			schedulePendingInteractions(root, lane);
			if (executionContext === NoContext) {
	
				resetRenderTimer();
				flushSyncCallbackQueue();
			}
		}
	} else {
        //  Concurrent模式
		// Schedule a discrete update but only if it's not Sync.
		if (
			(executionContext & DiscreteEventContext) !== NoContext &&
			// Only updates at user-blocking priority or greater are considered
			// discrete, even inside a discrete event.
			(priorityLevel === UserBlockingSchedulerPriority ||
				priorityLevel === ImmediateSchedulerPriority)
		) {
			// This is the result of a discrete event. Track the lowest priority
			// discrete update per root so we can flush them early, if needed.
			if (rootsWithPendingDiscreteUpdates === null) {
				rootsWithPendingDiscreteUpdates = new Set([root]);
			} else {
				rootsWithPendingDiscreteUpdates.add(root);
			}
		}
		// Schedule other updates after in case the callback is sync.

        // 确保当前整个应用 的根节点被调度。
		ensureRootIsScheduled(root, eventTime);

		schedulePendingInteractions(root, lane);
	}

	mostRecentlyUpdatedRoot = root;
}
```
- ensureRootIsScheduled
```js
function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
	const existingCallbackNode = root.callbackNode;

	// 给过期未执行的 lanes 标记为 过期
	markStarvedLanesAsExpired(root, currentTime);

	// Determine the next lanes to work on, and their priority.
	const nextLanes = getNextLanes(
		root,
		root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes
	);
	// 获取当前优先级最高的lanes
	const newCallbackPriority = returnNextLanesPriority();

	if (nextLanes === NoLanes) {
		// Special case: There's nothing to work on.
		if (existingCallbackNode !== null) {
			cancelCallback(existingCallbackNode);
			root.callbackNode = null;
			root.callbackPriority = NoLanePriority;
		}
		return;
	}

	// Check if there's an existing task. We may be able to reuse it.
	if (existingCallbackNode !== null) {
		const existingCallbackPriority = root.callbackPriority;
		if (existingCallbackPriority === newCallbackPriority) {
			// The priority hasn't changed. We can reuse the existing task. Exit.
			return;
		}
		// The priority changed. Cancel the existing callback. We'll schedule a new
		// one below.
		cancelCallback(existingCallbackNode);
	}

	// Schedule a new callback.
	let newCallbackNode;
    // 同步的优先级
	if (newCallbackPriority === SyncLanePriority) {
		// Special case: Sync React callbacks are scheduled on a special
		// internal queue
		newCallbackNode = scheduleSyncCallback(
			performSyncWorkOnRoot.bind(null, root)
		);
	} else if (newCallbackPriority === SyncBatchedLanePriority) {
		newCallbackNode = scheduleCallback(
			ImmediateSchedulerPriority,
			performSyncWorkOnRoot.bind(null, root)
		);
	} else {
        // 调度的逻辑，将 lanePriority转化为 SchedulerPriority
		const schedulerPriorityLevel = lanePriorityToSchedulerPriority(newCallbackPriority);
        // 调度优先级 
		newCallbackNode = scheduleCallback(
			schedulerPriorityLevel,
			performConcurrentWorkOnRoot.bind(null, root)
		);
	}

	root.callbackPriority = newCallbackPriority;
	root.callbackNode = newCallbackNode;
}
```

### 从fiber到root

现在`触发状态更新的fiber`上已经包含`Update`对象。

我们知道，`render阶段`是从`rootFiber`开始向下遍历。那么如何从`触发状态更新的fiber`得到`rootFiber`呢？

答案是：调用`markUpdateLaneFromFiberToRoot`方法。

```js
function markUpdateLaneFromFiberToRoot(
	sourceFiber: Fiber,
	lane: Lane
): FiberRoot | null {
	// Update the source fiber's lanes
	sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane);
	let alternate = sourceFiber.alternate;
	if (alternate !== null) {
		alternate.lanes = mergeLanes(alternate.lanes, lane);
	}

	// Walk the parent path to the root and update the child expiration time.
	let node = sourceFiber;
    // 将sourceFiber的父级赋值给 parent
	let parent = sourceFiber.return;
	while (parent !== null) {
		parent.childLanes = mergeLanes(parent.childLanes, lane);
		alternate = parent.alternate;
		if (alternate !== null) {
			alternate.childLanes = mergeLanes(alternate.childLanes, lane);
		} 
		node = parent;

        // 一直循环，将 parent.return 赋值给 parent
		parent = parent.return;
	}
    // 最终 当 tag为 当前应用的根节点HostRoot时，返回根节点 对应的DOM（div#root）
	if (node.tag === HostRoot) {
		const root: FiberRoot = node.stateNode;
        // 返回div#root
		return root;
	} else {
		return null;
	}
}
```

该方法做的工作可以概括为：从`触发状态更新的fiber`一直向上遍历到`rootFiber`，并返回`rootFiber`。

由于不同更新优先级不尽相同，所以过程中还会更新遍历到的`fiber`的优先级。这对于我们当前属于超纲内容。

### 调度更新

现在我们拥有一个`rootFiber`，该`rootFiber`对应的`Fiber树`中某个`Fiber节点`包含一个`Update`。

接下来通知`Scheduler`根据**更新**的优先级，决定以**同步**还是**异步**的方式调度本次更新。

这里调用的方法是`ensureRootIsScheduled`。

以下是`ensureRootIsScheduled`最核心的一段代码：

```js
if (newCallbackPriority === SyncLanePriority) {
  // 任务已经过期，需要同步执行render阶段
  newCallbackNode = scheduleSyncCallback(
    performSyncWorkOnRoot.bind(null, root)
  );
} else {
  // 根据任务优先级异步执行render阶段
  var schedulerPriorityLevel = lanePriorityToSchedulerPriority(
    newCallbackPriority
  );
  newCallbackNode = scheduleCallback(
    schedulerPriorityLevel,
    performConcurrentWorkOnRoot.bind(null, root)
  );
}
```

> 你可以从[这里](https://github.com/facebook/react/blob/b6df4417c79c11cfb44f965fab55b573882b1d54/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L602)看到`ensureRootIsScheduled`的源码

其中，`scheduleCallback`和`scheduleSyncCallback`会调用`Scheduler`提供的调度方法根据`优先级`调度回调函数执行。

可以看到，这里调度的回调函数为：

```js
performSyncWorkOnRoot.bind(null, root);
performConcurrentWorkOnRoot.bind(null, root);
```

即`render阶段`的入口函数。

至此，`状态更新`就和我们所熟知的`render阶段`连接上了。

## 总结

让我们梳理下`状态更新`的整个调用路径的关键节点：

```sh
触发状态更新（根据场景调用不同方法）

    |
    |
    v

创建Update对象

    |
    |
    v

从fiber到root（`markUpdateLaneFromFiberToRoot`）

    |
    |
    v

调度更新（`ensureRootIsScheduled`）

    |
    |
    v

render阶段（`performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot`）

    |
    |
    v

commit阶段（`commitRoot`）
```

## 总结

本节我们了解了**状态更新**的整个流程。

在接下来三节中，我们会花大量篇幅讲解`Update`的工作机制，因为他是构成`React concurrent mode`的核心机制之一。

# 更新的优先级
优先级是一个全局的概念，legacy模式没有优先级的概念，是同步执行，后面高优先级的更新不能中断前面低优先级的更新。
```js
export type PriorityLevel = 0 | 1 | 2 | 3 | 4 | 5;

// TODO: Use symbols?
export const NoPriority = 0; // 初始化的无优先级
export const ImmediatePriority = 1; // 立即执行的优先级，也就是同步的优先级（React中最高优先级）
export const UserBlockingPriority = 2; // 用户触发的更新 优先级（如事件，触发setState）
export const NormalPriority = 3; // 一般的优先级，最常见的优先级，比如请求数据完之后再更新，它的优先级低于 用户触发的UserBlockingPriority
export const LowPriority = 4; // 低优先级，Suspense就是使用这个优先级。
export const IdlePriority = 5; // 空闲的优先级
```


# 更新机制的心智模型

update的计算参考了git代码版本控制的理念

## 同步更新的React

我们可以将`更新机制`类比`代码版本控制`。

在没有`代码版本控制`前，我们在代码中逐步叠加功能。一切看起来井然有序，直到我们遇到了一个紧急线上bug（红色节点）。

<img src="/images/front_end/react/git1.png">

为了修复这个bug，我们需要首先将之前的代码提交。

在`React`中，所有通过`ReactDOM.render`创建的应用（其他创建应用的方式参考[ReactDOM.render一节](./reactdom.html#react的其他入口函数)）都是通过类似的方式`更新状态`。

即没有`优先级`概念，`高优更新`（红色节点）需要排在其他`更新`后面执行。

## 并发更新的React

当有了`代码版本控制`，有紧急线上bug需要修复时，我们暂存当前分支的修改，在`master分支`修复bug并紧急上线。

<img src="/images/front_end/react/git2.png">

bug修复上线后通过`git rebase`命令和`开发分支`连接上。`开发分支`基于`修复bug的版本`继续开发。

<img src="/images/front_end/react/git3.png">


在`React`中，通过`ReactDOM.createBlockingRoot`和`ReactDOM.createRoot`创建的应用会采用`并发`的方式`更新状态`。

`高优更新`（红色节点）中断正在进行中的`低优更新`（蓝色节点），先完成`render - commit流程`。

待`高优更新`完成后，`低优更新`基于`高优更新`的结果`重新更新`。

接下来两节我们会从源码角度讲解这套`并发更新`是如何实现的。

## 参考资料

[`外网` `英文` React Core Team Dan介绍React未来发展方向](https://www.youtube.com/watch?v=v6iR3Zk4oDY)

# Update

## Update的分类

触发更新的方法所隶属的组件分类：

- ReactDOM.render —— HostRoot

- this.setState —— ClassComponent

- this.forceUpdate —— ClassComponent

- useState —— FunctionComponent

- useReducer —— FunctionComponent

可以看到，一共三种组件（`HostRoot` | `ClassComponent` | `FunctionComponent`）可以触发更新。

由于不同类型组件工作方式不同，所以存在两种不同结构的`Update`，其中`ClassComponent`与`HostRoot`共用一套`Update`结构，`FunctionComponent`单独使用一种`Update`结构。

虽然他们的结构不同，但是他们工作机制与工作流程大体相同。在本节我们介绍前一种`Update`，`FunctionComponent`对应的`Update`在`Hooks`章节介绍。

## Update的结构

`ClassComponent`与`HostRoot`（即`rootFiber.tag`对应类型）共用同一种`Update结构`。

对应的结构如下：

```js
const update: Update<*> = {
  eventTime,
  lane,
  suspenseConfig,
  tag: UpdateState,
  payload: null,
  callback: null,

  next: null,
};
```

> `Update`由`createUpdate`方法返回，你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactUpdateQueue.old.js#L189)看到`createUpdate`的源码

字段意义如下：

- eventTime：任务时间，通过`performance.now()`获取的毫秒数。由于该字段在未来会重构，当前我们不需要理解它。

- lane：优先级相关字段。本次update所属的优先级，通过不同的方式触发的更新，它的优先级是不一样的。不同的优先级通过lane展示，只需要知道不同`Update`优先级可能是不同的。

> 你可以将`lane`类比`心智模型`中`需求的紧急程度`。

- suspenseConfig：`Suspense`相关。

- tag：更新的类型，包括`UpdateState` | `ReplaceState` | `ForceUpdate` | `CaptureUpdate`。

- payload：更新挂载的数据，不同类型组件挂载的数据不同。对于`ClassComponent`，`payload`为`this.setState`的第一个传参。对于`HostRoot`，`payload`为`ReactDOM.render`的第一个传参。

- callback：更新的回调函数。this.setState第二个参数中的回调函数、RenderDOM.render第三个参数的回调函数。

- next：与其他`Update`连接形成链表。如下，会创建4个update，每个update之间通过next指针连接

```js
const onClick = () => {
	updateCount((count) => count + 2);
	updateCount((count) => count + 2);
	updateCount((count) => count + 2);
	updateCount((count) => count + 2);
}
```

## Update与Fiber的联系
Update这种数据结构如何保存在fiber中的呢？

我们发现，`Update`存在一个连接其他`Update`形成链表的字段`next`。联系`React`中另一种以链表形式组成的结构`Fiber`，他们之间有什么关联么？

答案是肯定的。

从[双缓存机制一节](../process/doubleBuffer.html)我们知道，`Fiber节点`组成`Fiber树`，页面中最多同时存在两棵`Fiber树`：

- 代表当前页面状态的`current Fiber树`

- 代表正在`render阶段`的`workInProgress Fiber树`

类似`Fiber节点`组成`Fiber树`，`Fiber节点`上的多个`Update`会组成链表并被包含在`fiber.updateQueue`中。

::: warning 什么情况下一个Fiber节点会存在多个Update？

你可能疑惑为什么一个`Fiber节点`会存在多个`Update`。这其实是很常见的情况。

在这里介绍一种最简单的情况：

```js
onClick() {
  this.setState({
    a: 1
  })

  this.setState({
    b: 2
  })
}
```

在一个`ClassComponent`中触发`this.onClick`方法，方法内部调用了两次`this.setState`。这会在该`fiber`中产生两个`Update`。

:::

`Fiber节点`最多同时存在两个`updateQueue`：

- `current fiber`保存的`updateQueue`即`current updateQueue`

- `workInProgress fiber`保存的`updateQueue`即`workInProgress updateQueue`

在`commit阶段`完成页面渲染后，`workInProgress Fiber树`变为`current Fiber树`，`workInProgress Fiber树`内`Fiber节点`的`updateQueue`就变成`current updateQueue`。

## updateQueue
fiber节点上有一个updateQueue字段，update就是保存在updateQueue中的。

`updateQueue`有三种类型，`HostComponent、ClassComponent、FunctionComponent`的类型


`ClassComponent`与`HostRoot`使用的`UpdateQueue`结构如下：

```js
const queue: UpdateQueue<State> = {
    baseState: fiber.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
    },
    effects: null,
  };
```

> `UpdateQueue`由`initializeUpdateQueue`方法返回，你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactUpdateQueue.new.js#L157)看到`initializeUpdateQueue`的源码

字段说明如下：

- baseState：本次更新前该`Fiber节点`的`state`，`Update`基于该`state`计算更新后的`state`。

> 你可以将`baseState`类比`心智模型`中的`master分支`。

- `firstBaseUpdate`与`lastBaseUpdate`：本次更新前该`Fiber节点`已保存的`Update`。以链表形式存在，链表头为`firstBaseUpdate`，链表尾为`lastBaseUpdate`。之所以在更新产生前该`Fiber节点`内就存在`Update`，是由于某些`Update`优先级较低所以在上次`render阶段`由`Update`计算`state`时被跳过。

> 你可以将`baseUpdate`类比`心智模型`中执行`git rebase`基于的`commit`（节点D）。

- `shared.pending`：触发更新时，产生的`Update`会保存在`shared.pending`中形成单向环状链表。当由`Update`计算`state`时这个环会被剪开并连接在`lastBaseUpdate`后面。

> 你可以将`shared.pending`类比`心智模型`中本次需要提交的`commit`（节点ABC）。

- effects：数组。保存`update.callback !== null`的`Update`。保存update的回调函数

- createUpdate：创建update，并返回update数据结构。
```js
export function createUpdate(eventTime: number, lane: Lane): Update<*> {
  const update: Update<*> = {
    eventTime,
    lane,

    tag: UpdateState,
    payload: null,
    callback: null,

    next: null,
  };
  return update;
}
```
- enqueueUpdate：为fiber的update的链表增加 新的update。
```js
export function enqueueUpdate<State>(fiber: Fiber, update: Update<State>) {
  const updateQueue = fiber.updateQueue;
  if (updateQueue === null) {
    // Only occurs if the fiber has been unmounted.
    return;
  }

  const sharedQueue: SharedQueue<State> = (updateQueue: any).shared;
  const pending = sharedQueue.pending;
  // 执行链表的操作
  if (pending === null) {
    // This is the first update. Create a circular list.
    update.next = update;
  } else {
	// 已经存在的update，会用next指针指向新的update，这些update的会头尾相连，形成一个链表。
    update.next = pending.next;
    pending.next = update;
  }
  sharedQueue.pending = update;
}
``` 

## 例子

`updateQueue`相关代码逻辑涉及到大量链表操作，比较难懂。在此我们举例对`updateQueue`的工作流程讲解下。

假设有一个`fiber`刚经历`commit阶段`完成渲染。

该`fiber`上有两个由于优先级过低所以在上次的`render阶段`并没有处理的`Update`。他们会成为下次更新的`baseUpdate`。

我们称其为`u1`和`u2`，其中`u1.next === u2`。

```js
fiber.updateQueue.firstBaseUpdate === u1;
fiber.updateQueue.lastBaseUpdate === u2;
u1.next === u2;
```

我们用`-->`表示链表的指向：

```js
fiber.updateQueue.baseUpdate: u1 --> u2
```

现在我们在`fiber`上触发两次状态更新，这会先后产生两个新的`Update`，我们称为`u3`和`u4`。

每个 `update` 都会通过 `enqueueUpdate` 方法插入到 `updateQueue` 队列上

当插入`u3`后：

```js
fiber.updateQueue.shared.pending === u3;
u3.next === u3;
```

`shared.pending`的环状链表，用图表示为：

```js
fiber.updateQueue.shared.pending:   u3 ─────┐ 
                                     ^      |                                    
                                     └──────┘
```

接着插入`u4`之后：

```js
fiber.updateQueue.shared.pending === u4;
u4.next === u3;
u3.next === u4;
```

`shared.pending`是环状链表，用图表示为：

```js
fiber.updateQueue.shared.pending:   u4 ──> u3
                                     ^      |                                    
                                     └──────┘
```

`shared.pending` 会保证始终指向最后一个插入的`update`，你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactUpdateQueue.new.js#L208)看到`enqueueUpdate`的源码

更新调度完成后进入`render阶段`。

此时`shared.pending`的环被剪开并连接在`updateQueue.lastBaseUpdate`后面：

```js
fiber.updateQueue.baseUpdate: u1 --> u2 --> u3 --> u4
```

接下来遍历`updateQueue.baseUpdate`链表，以`fiber.updateQueue.baseState`为`初始state`，依次与遍历到的每个`Update`计算并产生新的`state`（该操作类比`Array.prototype.reduce`）。

在遍历时如果有优先级低的`Update`会被跳过。

当遍历完成后获得的`state`，就是该`Fiber节点`在本次更新的`state`（源码中叫做`memoizedState`）。

> `render阶段`的`Update操作`由`processUpdateQueue`完成，你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactUpdateQueue.new.js#L405)看到`processUpdateQueue`的源码

`state`的变化在`render阶段`产生与上次更新不同的`JSX`对象，通过`Diff算法`产生`effectTag`，在`commit阶段`渲染在页面上。

渲染完成后`workInProgress Fiber树`变为`current Fiber树`，整个更新流程结束。


## 什么是优先级

在[React理念一节](../preparation/idea.html#理解-响应自然)我们聊到`React`将人机交互研究的结果整合到真实的`UI`中。具体到`React`运行上这是什么意思呢？

`状态更新`由`用户交互`产生，用户心里对`交互`执行顺序有个预期。`React`根据`人机交互研究的结果`中用户对`交互`的预期顺序为`交互`产生的`状态更新`赋予不同优先级。

具体如下：

- 生命周期方法：同步执行。

- 受控的用户输入：比如输入框内输入文字，同步执行。

- 交互事件：比如动画，高优先级执行。

- 其他：比如数据请求，低优先级执行。

## 如何调度优先级

我们在[新的React结构一节](../preparation/newConstructure.html)讲到，`React`通过`Scheduler`调度任务。

具体到代码，每当需要调度任务时，`React`会调用`Scheduler`提供的方法`runWithPriority`。

该方法接收一个`优先级`常量与一个`回调函数`作为参数。`回调函数`会以`优先级`高低为顺序排列在一个`定时器`中并在合适的时间触发。

对于更新来讲，传递的`回调函数`一般为[状态更新流程概览一节](./prepare.html#render阶段的开始)讲到的`render阶段的入口函数`。

> 你可以在[==unstable_runWithPriority== 这里](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/scheduler/src/Scheduler.js#L217)看到`runWithPriority`方法的定义。在[这里](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/scheduler/src/SchedulerPriorities.js)看到`Scheduler`对优先级常量的定义。

## 例子

优先级最终会反映到`update.lane`变量上。当前我们只需要知道这个变量能够区分`Update`的优先级。

接下来我们通过一个例子结合上一节介绍的`Update`相关字段讲解优先级如何决定更新的顺序。

> 该例子来自[React Core Team Andrew向网友讲解Update工作流程的推文](https://twitter.com/acdlite/status/978412930973687808)

<img :src="$withBase('/img/update-process.png')" alt="优先级如何决定更新的顺序">

在这个例子中，有两个`Update`。我们将“关闭黑夜模式”产生的`Update`称为`u1`，输入字母“I”产生的`Update`称为`u2`。

其中`u1`先触发并进入`render阶段`。其优先级较低，执行时间较长。此时：

```js
fiber.updateQueue = {
  baseState: {
    blackTheme: true,
    text: 'H'
  },
  firstBaseUpdate: null,
  lastBaseUpdate: null
  shared: {
    pending: u1
  },
  effects: null
};
```

在`u1`完成`render阶段`前用户通过键盘输入字母“I”，产生了`u2`。`u2`属于**受控的用户输入**，优先级高于`u1`，于是中断`u1`产生的`render阶段`。

此时：

```js
fiber.updateQueue.shared.pending === u2 ----> u1
                                     ^        |
                                     |________|
// 即
u2.next === u1;
u1.next === u2;
```

其中`u2`优先级高于`u1`。

接下来进入`u2`产生的`render阶段`。

在`processUpdateQueue`方法中，`shared.pending`环状链表会被剪开并拼接在`baseUpdate`后面。

需要明确一点，`shared.pending`指向最后一个`pending`的`update`，所以实际执行时`update`的顺序为：

```js
u1 -- u2
```

接下来遍历`baseUpdate`，处理优先级合适的`Update`（这一次处理的是更高优的`u2`）。

由于`u2`不是`baseUpdate`中的第一个`update`，在其之前的`u1`由于优先级不够被跳过。

`update`之间可能有依赖关系，所以被跳过的`update`及其后面所有`update`会成为下次更新的`baseUpdate`。（即`u1 -- u2`）。

最终`u2`完成`render - commit阶段`。

此时：

```js
fiber.updateQueue = {
  baseState: {
    blackTheme: true,
    text: 'HI'
  },
  firstBaseUpdate: u1,
  lastBaseUpdate: u2
  shared: {
    pending: null
  },
  effects: null
};
```

在`commit`阶段结尾会再调度一次更新。在该次更新中会基于`baseState`中`firstBaseUpdate`保存的`u1`，开启一次新的`render阶段`。

最终两次`Update`都完成后的结果如下：

```js
fiber.updateQueue = {
  baseState: {
    blackTheme: false,
    text: 'HI'
  },
  firstBaseUpdate: null,
  lastBaseUpdate: null
  shared: {
    pending: null
  },
  effects: null
};
```

我们可以看见，`u2`对应的更新执行了两次，相应的`render阶段`的生命周期勾子`componentWillXXX`也会触发两次。这也是为什么这些勾子会被标记为`unsafe_`。

## 如何保证状态正确

现在我们基本掌握了`updateQueue`的工作流程。还有两个疑问：

- `render阶段`可能被中断。如何保证`updateQueue`中保存的`Update`不丢失？

- 有时候当前`状态`需要依赖前一个`状态`。如何在支持跳过`低优先级状态`的同时保证**状态依赖的连续性**？

我们分别讲解下。

### 如何保证`Update`不丢失

在[上一节例子](./update.html#例子)中我们讲到，在`render阶段`，`shared.pending`的环被剪开并连接在`updateQueue.lastBaseUpdate`后面。

实际上`shared.pending`会被同时连接在`workInProgress updateQueue.lastBaseUpdate`与`current updateQueue.lastBaseUpdate`后面。

> 具体代码见[这里](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactUpdateQueue.new.js#L424)

当`render阶段`被中断后重新开始时，会基于`current updateQueue`克隆出`workInProgress updateQueue`。由于`current updateQueue.lastBaseUpdate`已经保存了上一次的`Update`，所以不会丢失。

当`commit阶段`完成渲染，由于`workInProgress updateQueue.lastBaseUpdate`中保存了上一次的`Update`，所以 `workInProgress Fiber树`变成`current Fiber树`后也不会造成`Update`丢失。

### 如何保证状态依赖的连续性

当某个`Update`由于优先级低而被跳过时，保存在`baseUpdate`中的不仅是该`Update`，还包括链表中该`Update`之后的所有`Update`。

考虑如下例子：

```js
baseState: ''
shared.pending: A1 --> B2 --> C1 --> D2
```

其中`字母`代表该`Update`要在页面插入的字母，`数字`代表`优先级`，值越低`优先级`越高。

第一次`render`，`优先级`为1。

```js
baseState: ''
baseUpdate: null
render阶段使用的Update: [A1, C1]
memoizedState: 'AC'
```

其中`B2`由于优先级为2，低于当前优先级，所以他及其后面的所有`Update`会被保存在`baseUpdate`中作为下次更新的`Update`（即`B2 C1 D2`）。

这么做是为了保持`状态`的前后依赖顺序。

第二次`render`，`优先级`为2。

```js
baseState: 'A'
baseUpdate: B2 --> C1 --> D2
render阶段使用的Update: [B2, C1, D2]
memoizedState: 'ABCD'
```

注意这里`baseState`并不是上一次更新的`memoizedState`。这是由于`B2`被跳过了。

即当有`Update`被跳过时，`下次更新的baseState !== 上次更新的memoizedState`。

> 跳过`B2`的逻辑见[这里](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactUpdateQueue.new.js#L479)

通过以上例子我们可以发现，`React`保证最终的状态一定和用户触发的`交互`一致，但是中间过程`状态`可能由于设备不同而不同。

:::details 高优先级任务打断低优先级任务Demo

[关注公众号](../me.html)，后台回复**815**获得在线Demo地址

:::

## 参考资料

[深入源码剖析componentWillXXX为什么UNSAFE](https://juejin.im/post/5f05a3e25188252e5c576cdb)

[React源码中讲解Update工作流程及优先级的注释](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactUpdateQueue.new.js#L10)

[React Core Team Andrew向网友讲解Update工作流程的推文](https://twitter.com/acdlite/status/978412930973687808)

<!-- beginWork getStateFromUpdate -->

# ReactDOM.render
ReactDOM.render完成页面渲染的整个流程？

## 创建fiber

首次执行`ReactDOM.render`会创建`fiberRootNode`和`rootFiber`。其中`fiberRootNode`是整个应用的根节点，`rootFiber`是要渲染组件所在组件树的`根节点`。

这一步发生在调用`ReactDOM.render`后进入的`legacyRenderSubtreeIntoContainer`方法中。

- render方法
```js
function render(element, container, callback) {

  if (!isValidContainerLegacy(container)) {
    throw new Error('Target container is not a DOM element.');
  }

  {
    var isModernRoot = isContainerMarkedAsRoot(container) && container._reactRootContainer === undefined;
    if (isModernRoot) {
      error('You are calling ReactDOM.render() on a container that was previously ' + 'passed to ReactDOM.createRoot(). This is not supported. ' + 'Did you mean to call root.render(element)?');
    }
  }

  return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
}
```
- legacyRenderSubtreeIntoContainer和legacyCreateRootFromDOMContainer
```js
function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  {
    topLevelUpdateWarnings(container);
    warnOnInvalidCallback$1(callback === undefined ? null : callback, 'render');
  }
  var root = container._reactRootContainer;
  var fiberRoot;
  // 根节点不存在，则会先创建整个根节点
  if (!root) {
    // Initial mount  root是整个应用的根节点，fiberRootNode
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
    fiberRoot = root;
	// ReactDOM.render的第三个参数是否存在
    if (typeof callback === 'function') {
      var originalCallback = callback;
      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    } // Initial mount should not be batched.
    flushSync(function () {
		// 调用updateContainer
      updateContainer(children, fiberRoot, parentComponent, callback);
    });

  } else {
    fiberRoot = root;
    if (typeof callback === 'function') {
      var _originalCallback = callback;
      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);
        _originalCallback.call(instance);
      };
    } // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);
}


function legacyCreateRootFromDOMContainer(
  container: Container,
  forceHydrate: boolean,
): RootType {
  const shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  // First clear any existing content.
  if (!shouldHydrate) { // 不是服务端渲染情况
    let warned = false;
    let rootSibling;
    while ((rootSibling = container.lastChild)) {
		// 如果容器下存在其他的DOM元素，需要先将这些DOM元素删除
      container.removeChild(rootSibling);
    }
  }
  return createLegacyRoot(
    container,
    shouldHydrate
      ? {
          hydrate: true,
        }
      : undefined,
  );
}

export function createBlockingRoot(
  container: Container,
  options?: RootOptions,
): RootType {
  warnIfReactDOMContainerInDEV(container);
  return new ReactDOMBlockingRoot(container, BlockingRoot, options);
}

// ReactRootTags.js————开始
// Legacy和Concurrent的区别是优先级lane的不同
export type RootTag = 0 | 1 | 2;
export const LegacyRoot = 0;  // ReactDOM.render
export const BlockingRoot = 1;
export const ConcurrentRoot = 2; // ReactDOM.createRoot(rootNode).render(<App />)
// ReactRootTags.js————结束

export function createLegacyRoot(
  container: Container,
  options?: RootOptions,
): RootType {
  return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}


function ReactDOMBlockingRoot(
  container: Container,
  tag: RootTag,
  options: void | RootOptions,
) {
  this._internalRoot = createRootImpl(container, tag, options);
}

function createRootImpl(
  container: Container,
  tag: RootTag, // tag为 0/1/2，从ReactDOMBlockingRoot的LegacyRoot传入
  options: void | RootOptions,
) {
  // Tag is either LegacyRoot or Concurrent Root
  const hydrate = options != null && options.hydrate === true;
  const hydrationCallbacks =
    (options != null && options.hydrationOptions) || null;
  const mutableSources =
    (options != null &&
      options.hydrationOptions != null &&
      options.hydrationOptions.mutableSources) ||
    null;
  // fiberRootNode整个应用的根节点
  const root = createContainer(container, tag, hydrate, hydrationCallbacks);

  markContainerAsRoot(root.current, container);
  const containerNodeType = container.nodeType;

  if (enableEagerRootListeners) {
    const rootContainerElement =
      container.nodeType === COMMENT_NODE ? container.parentNode : container;
    listenToAllSupportedEvents(rootContainerElement);
  } else {
    if (hydrate && tag !== LegacyRoot) {
      const doc =
        containerNodeType === DOCUMENT_NODE
          ? container
          : container.ownerDocument;
      eagerlyTrapReplayableEvents(container, ((doc: any): Document));
    } else if (
      containerNodeType !== DOCUMENT_FRAGMENT_NODE &&
      containerNodeType !== DOCUMENT_NODE
    ) {
      ensureListeningTo(container, 'onMouseEnter', null);
    }
  }

  if (mutableSources) {
    for (let i = 0; i < mutableSources.length; i++) {
      const mutableSource = mutableSources[i];
      registerMutableSourceForHydration(root, mutableSource);
    }
  }

  return root;
}
```
```js
// container指ReactDOM.render的第二个参数（即应用挂载的DOM节点）
root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
  container,
  forceHydrate,
);
fiberRoot = root._internalRoot;
```

> 你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-dom/src/client/ReactDOMLegacy.js#L193)看到这一步的代码

`legacyCreateRootFromDOMContainer`方法内部会调用`createFiberRoot`方法完成`fiberRootNode`和`rootFiber`的创建以及关联。并初始化`updateQueue`。

```js
export function createFiberRoot(
  containerInfo: any,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): FiberRoot {
  // 创建fiberRootNode
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);
  
  // 创建rootFiber
  const uninitializedFiber = createHostRootFiber(tag);

  // 连接rootFiber与fiberRootNode
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  // 初始化updateQueue
  initializeUpdateQueue(uninitializedFiber);

  return root;
}
```

根据以上代码，现在我们可以在[双缓存机制一节](../process/doubleBuffer.html#mount时)基础上补充上`rootFiber`到`fiberRootNode`的引用。

<img src="/images/front_end/react/fiberroot.png">

> 你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberRoot.new.js#L97)看到这一步的代码

## 创建update

我们已经做好了组件的初始化工作，接下来就等待创建`Update`来开启一次更新。

这一步发生在`updateContainer`方法中。

```js
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): Lane {
  // ...省略与逻辑不相关代码

  // 创建update
  const update = createUpdate(eventTime, lane, suspenseConfig);
  
  // update.payload为需要挂载在根节点的组件
  update.payload = {element};

  // callback为ReactDOM.render的第三个参数 —— 回调函数
  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    update.callback = callback;
  }

  // 将生成的update加入updateQueue
  enqueueUpdate(current, update);
  // 调度更新
  scheduleUpdateOnFiber(current, lane, eventTime);

  // ...省略与逻辑不相关代码
}
```

> 你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberReconciler.new.js#L255)看到`updateContainer`的代码

值得注意的是其中`update.payload = {element};`

这就是我们在[Update一节](./update.html#update的结构)介绍的，对于`HostRoot`，`payload`为`ReactDOM.render`的第一个传参。

## 流程概览

至此，`ReactDOM.render`的流程就和我们已知的流程连接上了。

整个流程如下：

```sh
创建fiberRootNode、rootFiber、updateQueue（`legacyCreateRootFromDOMContainer`）

    |
    |
    v

创建Update对象（`updateContainer`）

    |
    |
    v

从fiber到root（`markUpdateLaneFromFiberToRoot`）

    |
    |
    v

调度更新（`ensureRootIsScheduled`）

    |
    |
    v

render阶段（`performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot`）

    |
    |
    v

commit阶段（`commitRoot`）
```

## React的其他入口函数

当前`React`共有三种模式：

- `legacy`，这是当前`React`使用的方式。当前没有计划删除本模式，但是这个模式可能不支持一些新功能。

- `blocking`，开启部分`concurrent`模式特性的中间模式。目前正在实验中。作为迁移到`concurrent`模式的第一个步骤。

- `concurrent`，面向未来的开发模式。我们之前讲的`任务中断/任务优先级`都是针对`concurrent`模式。

你可以从下表看出各种模式对特性的支持：

|   | legacy 模式  | blocking 模式  | concurrent 模式  |
|---  |---  |---  |---  |
|[String Refs](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)  |✅  |🚫**  |🚫**  |
|[Legacy Context](https://zh-hans.reactjs.org/docs/legacy-context.html) |✅  |🚫**  |🚫**  |
|[findDOMNode](https://zh-hans.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)  |✅  |🚫**  |🚫**  |
|[Suspense](https://zh-hans.reactjs.org/docs/concurrent-mode-suspense.html#what-is-suspense-exactly) |✅  |✅  |✅  |
|[SuspenseList](https://zh-hans.reactjs.org/docs/concurrent-mode-patterns.html#suspenselist) |🚫  |✅  |✅  |
|Suspense SSR + Hydration |🚫  |✅  |✅  |
|Progressive Hydration  |🚫  |✅  |✅  |
|Selective Hydration  |🚫  |🚫  |✅  |
|Cooperative Multitasking |🚫  |🚫  |✅  |
|Automatic batching of multiple setStates     |🚫* |✅  |✅  |
|[Priority-based Rendering](https://zh-hans.reactjs.org/docs/concurrent-mode-patterns.html#splitting-high-and-low-priority-state) |🚫  |🚫  |✅  |
|[Interruptible Prerendering](https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html#interruptible-rendering) |🚫  |🚫  |✅  |
|[useTransition](https://zh-hans.reactjs.org/docs/concurrent-mode-patterns.html#transitions)  |🚫  |🚫  |✅  |
|[useDeferredValue](https://zh-hans.reactjs.org/docs/concurrent-mode-patterns.html#deferring-a-value) |🚫  |🚫  |✅  |
|[Suspense Reveal "Train"](https://zh-hans.reactjs.org/docs/concurrent-mode-patterns.html#suspense-reveal-train)  |🚫  |🚫  |✅  |

*：`legacy`模式在合成事件中有自动批处理的功能，但仅限于一个浏览器任务。非`React`事件想使用这个功能必须使用 `unstable_batchedUpdates`。在`blocking`模式和`concurrent`模式下，所有的`setState`在默认情况下都是批处理的。

**：会在开发中发出警告。

模式的变化影响整个应用的工作方式，所以无法只针对某个组件开启不同模式。

基于此原因，可以通过不同的`入口函数`开启不同模式：

- `legacy` -- `ReactDOM.render(<App />, rootNode)`
- `blocking` -- `ReactDOM.createBlockingRoot(rootNode).render(<App />)`
- `concurrent` -- `ReactDOM.createRoot(rootNode).render(<App />)`

> 你可以在[这里](https://zh-hans.reactjs.org/docs/concurrent-mode-adoption.html#why-so-many-modes)看到`React`团队解释为什么会有这么多模式

虽然不同模式的`入口函数`不同，但是他们仅对`fiber.mode`变量产生影响，对我们在[流程概览](./reactdom.html#流程概览)中描述的流程并无影响。

# this.setState流程

## 流程概览

`this.setState`内会调用`this.updater.enqueueSetState`方法。

```js
Component.prototype.setState = function (partialState, callback) {
  if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
    {
      throw Error( "setState(...): takes an object of state variables to update or a function which returns an object of state variables." );
    }
  }
  /** 
   *  this: ClassComponent的实例
   *  partialState: 需要传递的state，state会变为 update.playload
   *  callback: setState函数的callback
   * 
   * */ 
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

// updater对象
const classComponentUpdater = {
  isMounted,
  // this.setState相关
  enqueueSetState(inst, payload, callback) {
	// 获取当前的fiber
    const fiber = getInstance(inst);
	// 获取当前事件的时间
    const eventTime = requestEventTime();
	// 获取优先级lane
    const lane = requestUpdateLane(fiber);
	// 创建 update
    const update = createUpdate(eventTime, lane);
    update.payload = payload;
    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleUpdateOnFiber(fiber, lane, eventTime);

    if (enableSchedulingProfiler) {
      markStateUpdateScheduled(fiber, lane);
    }
  },
  enqueueReplaceState(inst, payload, callback) {
    const fiber = getInstance(inst);
    const eventTime = requestEventTime();
    const lane = requestUpdateLane(fiber);

    const update = createUpdate(eventTime, lane);
    update.tag = ReplaceState;
    update.payload = payload;

    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleUpdateOnFiber(fiber, lane, eventTime);

    if (enableSchedulingProfiler) {
      markStateUpdateScheduled(fiber, lane);
    }
  },
  // this.forceUpdate相关
  enqueueForceUpdate(inst, callback) {
    const fiber = getInstance(inst);
    const eventTime = requestEventTime();
    const lane = requestUpdateLane(fiber);

    const update = createUpdate(eventTime, lane);
    update.tag = ForceUpdate;

    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleUpdateOnFiber(fiber, lane, eventTime);

    if (enableSchedulingProfiler) {
      markForceUpdateScheduled(fiber, lane);
    }
  },
};
```

在`enqueueSetState`方法中就是我们熟悉的从`创建update`到`调度update`的流程了。

```js
enqueueSetState(inst, payload, callback) {
  // 通过组件实例获取对应fiber
  const fiber = getInstance(inst);

  const eventTime = requestEventTime();
  const suspenseConfig = requestCurrentSuspenseConfig();

  // 获取优先级
  const lane = requestUpdateLane(fiber, suspenseConfig);

  // 创建update
  const update = createUpdate(eventTime, lane, suspenseConfig);

  update.payload = payload;

  // 赋值回调函数
  if (callback !== undefined && callback !== null) {
    update.callback = callback;
  }

  // 将update插入updateQueue
  enqueueUpdate(fiber, update);
  // 调度update
  scheduleUpdateOnFiber(fiber, lane, eventTime);
}
```
对于`ClassComponent`，`update.payload`为`this.setState`的第一个传参（即要改变的`state`）。

## this.forceUpdate

在`this.updater`上，除了`enqueueSetState`外，还存在`enqueueForceUpdate`，当我们调用`this.forceUpdate`时会调用他。

可以看到，除了赋值`update.tag = ForceUpdate;`以及没有`payload`外，其他逻辑与`this.setState`一致。

```js
enqueueForceUpdate(inst, callback) {
    const fiber = getInstance(inst);
    const eventTime = requestEventTime();
    const suspenseConfig = requestCurrentSuspenseConfig();
    const lane = requestUpdateLane(fiber, suspenseConfig);

    const update = createUpdate(eventTime, lane, suspenseConfig);

    // 赋值tag为ForceUpdate
    update.tag = ForceUpdate;

    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleUpdateOnFiber(fiber, lane, eventTime);
  },
};
```

那么赋值`update.tag = ForceUpdate;`有何作用呢？

在判断`ClassComponent`是否需要更新时有两个条件需要满足：

```js
 const shouldUpdate =
  checkHasForceUpdateAfterProcessing() ||
  checkShouldComponentUpdate(
    workInProgress,
    ctor,
    oldProps,
    newProps,
    oldState,
    newState,
    nextContext,
  );
```

> 你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberClassComponent.old.js#L1137)看到这段代码

- checkHasForceUpdateAfterProcessing：内部会判断本次更新的`Update`是否为`ForceUpdate`。即如果本次更新的`Update`中存在`tag`为`ForceUpdate`，则返回`true`。

- checkShouldComponentUpdate：内部会调用`shouldComponentUpdate`方法。以及当该`ClassComponent`为`PureComponent`时会浅比较`state`与`props`。

> 你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberClassComponent.old.js#L294)看到`checkShouldComponentUpdate`代码

所以，当某次更新含有`tag`为`ForceUpdate`的`Update`，那么当前`ClassComponent`不会受其他`性能优化手段`（`shouldComponentUpdate`|`PureComponent`）影响，一定会更新。
