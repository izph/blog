---
title: 【React源码】React Hooks
date: 2022-08-25 20:12:49
categories:
  - 前端
tags:
  - React
toc: true # 是否启用内容索引
comments: true
copyright: false
---
# React Hooks

functionComponent有自己对应的fiber，fiber对象包含多个属性。如memoizedState保存该functionComponent的hook。stateNode保存的是对应的function。

在React中，通过判断 current是否存在，来确认是mount还是update。

render阶段会触发执行function函数，函数返回jsx

useState包含两部分，state和setState，state是基于baseState、以及拥有足够优先级的update实现的。 update的产生是由于调用setState方法。

调用useState方法会执行state的计算过程，返回的setState方法会执行update的创建过程。

memoizedState如何保存多个hook？会使用链表这种数据结构保存hook

例子中，全局变量workInProgressHook表示当前正在执行的hook。

render阶段会从 fiber.memoizedState取出第一个hook（hook的初始化）

在mount时，首先需要创建hook，hook数据结构是用来保存update的

update在ClassComponent和HostRoot中，会保存在updateQueue，hook的数据结构和updateQueue类似


多个hook可以通过next指针连接，形成单项链表。
```js
let hook = {
    queue: {
        pending: null, // 保存了最后一个update
    }
    // mount阶段的 memoizedState就是 useState的 初始值 initialState
    memoizedState: null, // 保存了hook对应的state属性
    next: null, // next指针 用于指向下一个 hook
}
```

# Hooks的数据结构

在`Hooks`中，组件`mount`时的`hook`与`update`时的`hook`来源于不同的对象，这类对象在React源码中被称为`dispatcher`。

```js
// mount时的Dispatcher
const HooksDispatcherOnMount: Dispatcher = {
  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
  // ...省略
};

// update时的Dispatcher
const HooksDispatcherOnUpdate: Dispatcher = {
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
  // ...省略
};
```

可见，`mount`时调用的`hook`和`update`时调用的`hook`其实是两个不同的函数。

在`FunctionComponent` `render`之前，会根据`FunctionComponent`对应`fiber`的以下条件区分`mount`与`update`。

```js
current === null || current.memoizedState === null
```

并将不同情况对应的`dispatcher`赋值给全局变量`ReactCurrentDispatcher`的`current`属性。
 
```js
ReactCurrentDispatcher.current =
      current === null || current.memoizedState === null
        ? HooksDispatcherOnMount
        : HooksDispatcherOnUpdate;  
```

```js
export function renderWithHooks<Props, SecondArg>(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: (p: Props, arg: SecondArg) => any,
  props: Props,
  secondArg: SecondArg,
  nextRenderLanes: Lanes,
): any {
  renderLanes = nextRenderLanes;
  currentlyRenderingFiber = workInProgress;

  workInProgress.memoizedState = null;
  workInProgress.updateQueue = null;
  workInProgress.lanes = NoLanes;

  
  if (__DEV__) {
    if (current !== null && current.memoizedState !== null) {
      ReactCurrentDispatcher.current = HooksDispatcherOnUpdateInDEV;
    } else if (hookTypesDev !== null) {
      ReactCurrentDispatcher.current = HooksDispatcherOnMountWithHookTypesInDEV;
    } else {
        // mount
      ReactCurrentDispatcher.current = HooksDispatcherOnMountInDEV;
    }
  } else {
    ReactCurrentDispatcher.current =
      current === null || current.memoizedState === null
        ? HooksDispatcherOnMount
        : HooksDispatcherOnUpdate;
  }

    // 调用FunctionComponent，内部会触发hook
  let children = Component(props, secondArg);

  // 省略

  return children;
}
```

在`FunctionComponent` `render`时，会从`ReactCurrentDispatcher.current`（即当前`dispatcher`）中寻找需要的`hook`。

换言之，不同的调用栈上下文为`ReactCurrentDispatcher.current`赋值不同的`dispatcher`，则`FunctionComponent` `render`时调用的`hook`也是不同的函数。

useState在上下文的中对应着不同的函数，在mount阶段，使用`HooksDispatcherOnMount`中的Dispatcher，useState是mountState。在update阶段，使用`HooksDispatcherOnUpdate`，  useState是updateState。不同的上下文，使用不同的Dispatcher，不同的Dispatcher中的hook指向不同的实现，这样可能根据不同的上下文，对hook的具体实现做一些区别的对待。

## dispatcher在源码中的定义
```js
export const ContextOnlyDispatcher: Dispatcher = {
  readContext,

  useCallback: throwInvalidHookError,
  useContext: throwInvalidHookError,
  useEffect: throwInvalidHookError,
  useImperativeHandle: throwInvalidHookError,
  useLayoutEffect: throwInvalidHookError,
  useMemo: throwInvalidHookError,
  useReducer: throwInvalidHookError,
  useRef: throwInvalidHookError,
  useState: throwInvalidHookError,
  useDebugValue: throwInvalidHookError,
  useResponder: throwInvalidHookError,
  useDeferredValue: throwInvalidHookError,
  useTransition: throwInvalidHookError,
  useMutableSource: throwInvalidHookError,
  useOpaqueIdentifier: throwInvalidHookError,

  unstable_isNewReconciler: enableNewReconciler,
};

const HooksDispatcherOnMount: Dispatcher = {
  readContext,

  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
  useDebugValue: mountDebugValue,
  useResponder: createDeprecatedResponderListener,
  useDeferredValue: mountDeferredValue,
  useTransition: mountTransition,
  useMutableSource: mountMutableSource,
  useOpaqueIdentifier: mountOpaqueIdentifier,

  unstable_isNewReconciler: enableNewReconciler,
};

const HooksDispatcherOnUpdate: Dispatcher = {
  readContext,

  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
  useDebugValue: updateDebugValue,
  useResponder: createDeprecatedResponderListener,
  useDeferredValue: updateDeferredValue,
  useTransition: updateTransition,
  useMutableSource: updateMutableSource,
  useOpaqueIdentifier: updateOpaqueIdentifier,

  unstable_isNewReconciler: enableNewReconciler,
};

const HooksDispatcherOnRerender: Dispatcher = {
  readContext,

  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: rerenderReducer,
  useRef: updateRef,
  useState: rerenderState,
  useDebugValue: updateDebugValue,
  useResponder: createDeprecatedResponderListener,
  useDeferredValue: rerenderDeferredValue,
  useTransition: rerenderTransition,
  useMutableSource: updateMutableSource,
  useOpaqueIdentifier: rerenderOpaqueIdentifier,

  unstable_isNewReconciler: enableNewReconciler,
};
```
### mountState
```js
function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
    // mount时为该useState生成hook
  const hook = mountWorkInProgressHook(); 
  if (typeof initialState === 'function') {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }
  // 赋值initialState
  hook.memoizedState = hook.baseState = initialState;
  const queue = hook.queue = {
    pending: null,
    dispatch: null, // 绑定当前的fiber
    // 处理特定下的优化
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState), // initialState: any
  };
  
  
  const dispatch: Dispatch<BasicStateAction<S>,
  > = (queue.dispatch = (dispatchAction.bind(
    null,
    currentlyRenderingFiber, // 当前的fiber
    queue,
  ): any));

  return [hook.memoizedState, dispatch];
}

// 创建mount时的hook
function mountWorkInProgressHook(): Hook {
  // 创建一个对象hook
  const hook: Hook = {
    memoizedState: null,

    baseState: null, // 优先级相关
    baseQueue: null, // 优先级相关
    queue: null,

    next: null,
  };

  if (workInProgressHook === null) { // workInProgressHook可能是一个全局变量？
    // This is the first hook in the list
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    // 把 hook挂载到上一个hook的next下
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}


// 和mountState基本一致
function mountReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  const hook = mountWorkInProgressHook();
  let initialState;
  if (init !== undefined) {
    initialState = init(initialArg);
  } else {
    initialState = ((initialArg: any): S);
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: (initialState: any),
  });
  const dispatch: Dispatch<A> = (queue.dispatch = (dispatchAction.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ): any));
  return [hook.memoizedState, dispatch];
}
```
### updateState
useState是预制了reducer的useReducer
```js
function updateState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  return updateReducer(basicStateReducer, (initialState: any));
}

type BasicStateAction<S> = (S => S) | S;
function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  // $FlowFixMe: Flow doesn't like mixed types
  return typeof action === 'function' ? action(state) : action;
}


function updateReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
    // 获取当前的hook
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;
  
  queue.lastRenderedReducer = reducer;

  const current: Hook = (currentHook: any);

  // The last rebase update that is NOT part of the base state.
  let baseQueue = current.baseQueue;

  // The last pending update that hasn't been processed yet.
  const pendingQueue = queue.pending;
  if (pendingQueue !== null) {
    // We have new updates that haven't been processed yet.
    // We'll add them to the base queue.
    if (baseQueue !== null) {
      // Merge the pending queue and the base queue.
      const baseFirst = baseQueue.next;
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }
    current.baseQueue = baseQueue = pendingQueue;
    queue.pending = null;
  }

  if (baseQueue !== null) {
    // We have a queue to process.
    const first = baseQueue.next;
    let newState = current.baseState;

    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;
    let update = first;
    do {
      const updateLane = update.lane;
      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        
        const clone: Update<S, A> = {
          lane: updateLane,
          action: update.action,
          eagerReducer: update.eagerReducer,
          eagerState: update.eagerState,
          next: (null: any),
        };
        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }

        currentlyRenderingFiber.lanes = mergeLanes(
          currentlyRenderingFiber.lanes,
          updateLane,
        );
        markSkippedUpdateLanes(updateLane);
      } else {
        // This update does have sufficient priority.

        if (newBaseQueueLast !== null) {
          const clone: Update<S, A> = {

            lane: NoLane,
            action: update.action,
            eagerReducer: update.eagerReducer,
            eagerState: update.eagerState,
            next: (null: any),
          };
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }

        // Process this update.
        if (update.eagerReducer === reducer) {

          newState = ((update.eagerState: any): S);
        } else {
          const action = update.action;
          newState = reducer(newState, action);
        }
      }
      update = update.next;
    } while (update !== null && update !== first);

    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = (newBaseQueueFirst: any);
    }

    // Mark that the fiber performed work, but only if the new state is
    // different from the current state.
    if (!is(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }
    // 最终计算完成
    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;

    queue.lastRenderedState = newState;
  }

  const dispatch: Dispatch<A> = (queue.dispatch: any);
  return [hook.memoizedState, dispatch];
}

// 处理render阶段、update阶段的更新的hook，并返回这个hook
function updateWorkInProgressHook(): Hook {

  let nextCurrentHook: null | Hook;
  if (currentHook === null) {
    const current = currentlyRenderingFiber.alternate;
    if (current !== null) {
      nextCurrentHook = current.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    nextCurrentHook = currentHook.next;
  }

  let nextWorkInProgressHook: null | Hook;
  if (workInProgressHook === null) {
    nextWorkInProgressHook = currentlyRenderingFiber.memoizedState;
  } else {
    nextWorkInProgressHook = workInProgressHook.next;
  }

  if (nextWorkInProgressHook !== null) {
    // There's already a work-in-progress. Reuse it.
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;

    currentHook = nextCurrentHook;
  } else {

    currentHook = nextCurrentHook;

    const newHook: Hook = {
      memoizedState: currentHook.memoizedState,

      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,

      next: null,
    };

    if (workInProgressHook === null) {
      // This is the first hook in the list.
      currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
    } else {
      // Append to the end of the list.
      workInProgressHook = workInProgressHook.next = newHook;
    }
  }
  return workInProgressHook;
}
```
### dispatchAction
```js
function dispatchAction<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A,
) {
  // 获取当前事件的时间
  const eventTime = requestEventTime();
  // 获取当前fiber的优先级
  const lane = requestUpdateLane(fiber);

  // 创建update对象
  const update: Update<S, A> = {
    lane,
    action,
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
  // 将 update保存在pending上
  queue.pending = update;

  const alternate = fiber.alternate;

  // 是否是render阶段的更新
  if (
    fiber === currentlyRenderingFiber ||
    (alternate !== null && alternate === currentlyRenderingFiber)
  ) {
    // render阶段的更新：标记一个变量
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
  } else {
    // 不是 render阶段的更新
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {

      const lastRenderedReducer = queue.lastRenderedReducer;
      if (lastRenderedReducer !== null) {

        try {
          const currentState: S = (queue.lastRenderedState: any);
          const eagerState = lastRenderedReducer(currentState, action);

            // 优化逻辑
          update.eagerReducer = lastRenderedReducer;
          update.eagerState = eagerState;
          if (is(eagerState, currentState)) {

            return;
          }
        } catch (error) {
          // Suppress the error. It will throw again in the render phase.
        } finally {

        }
      }
    }
    
    scheduleUpdateOnFiber(fiber, lane, eventTime);
  }

  if (enableSchedulingProfiler) {
    markStateUpdateScheduled(fiber, lane);
  }
}
```

## 一个dispatcher使用场景

 当错误的书写了嵌套形式的`hook`，如：

```js
useEffect(() => {
  useState(0);
})
```

此时`ReactCurrentDispatcher.current`已经指向`ContextOnlyDispatcher`，所以调用`useState`实际会调用`throwInvalidHookError`，直接抛出异常。

```js
export const ContextOnlyDispatcher: Dispatcher = {
  useCallback: throwInvalidHookError,
  useContext: throwInvalidHookError,
  useEffect: throwInvalidHookError,
  useImperativeHandle: throwInvalidHookError,
  useLayoutEffect: throwInvalidHookError,
  // ...省略
```

## Hook的数据结构

```js
const hook: Hook = {
  memoizedState: null,

  baseState: null,
  baseQueue: null,
  queue: null,

  next: null,
};


// 源码中的声明
function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null, // 保存hook对应的state

    baseState: null,
    baseQueue: null,
    queue: null, // 保存update的queue

    next: null, // 与下一个Hook连接形成单向无环链表
  };

  if (workInProgressHook === null) {
    // This is the first hook in the list
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
```
## memoizedState

::: warning 注意
`hook`与`FunctionComponent fiber`都存在`memoizedState`属性，不要混淆他们的概念。

- `fiber.memoizedState`：`FunctionComponent`对应`fiber`保存的`Hooks`链表。

- `hook.memoizedState`：`Hooks`链表中保存的单一`hook`对应的数据。
:::

不同类型`hook`的`memoizedState`保存不同类型数据，具体如下：

- useState：对于`const [state, updateState] = useState(initialState)`，`memoizedState`保存`state`的值

- useReducer：对于`const [state, dispatch] = useReducer(reducer, {});`，`memoizedState`保存`state`的值

- useEffect：`memoizedState`保存包含`useEffect回调函数`、`依赖项`等的链表数据结构`effect`，你可以在[这里](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L1181)看到`effect`的创建过程。`effect`链表同时会保存在`fiber.updateQueue`中

- useRef：对于`useRef(1)`，`memoizedState`保存`{current: 1}`

- useMemo：对于`useMemo(callback, [depA])`，`memoizedState`保存`[callback(), depA]`

- useCallback：对于`useCallback(callback, [depA])`，`memoizedState`保存`[callback, depA]`。与`useMemo`的区别是，`useCallback`保存的是`callback`函数本身，而`useMemo`保存的是`callback`函数的执行结果

有些`hook`是没有`memoizedState`的，比如：useContext

# useState和useReducer的实现
## 流程概览

我们将这两个`Hook`的工作流程分为`声明阶段`和`调用阶段`，对于：

```js
function App() {
  const [state, dispatch] = useReducer(reducer, {a: 1});

  const [num, updateNum] = useState(0);
  
  return (
    <div>
      <button onClick={() => dispatch({type: 'a'})}>{state.a}</button>  
      <button onClick={() => updateNum(num => num + 1)}>{num}</button>  
    </div>
  )
}
```

`声明阶段`即`App`调用时，会依次执行`useReducer`与`useState`方法。

`调用阶段`即点击按钮后，`dispatch`或`updateNum`被调用时。

## 声明阶段

当`FunctionComponent`进入`render阶段`的`beginWork`时，会调用[renderWithHooks](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L1419)方法。

该方法内部会执行`FunctionComponent`对应函数（即`fiber.type`）。

> 你可以在[这里](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L415)看到这段逻辑

对于这两个`Hook`，他们的源码如下：

```js
function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
```

正如上一节[dispatcher](./structure.html#dispatcher)所说，在不同场景下，同一个`Hook`会调用不同处理函数。

我们分别讲解`mount`与`update`两个场景。

### mount时

`mount`时，`useReducer`会调用[mountReducer](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L638)，`useState`会调用[mountState](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L1143)。

我们来简单对比这这两个方法：

```js
function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  // 创建并返回当前的hook
  const hook = mountWorkInProgressHook();

  // ...赋值初始state

  // 创建queue
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  });

  // ...创建dispatch
  return [hook.memoizedState, dispatch];
}

function mountReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  // 创建并返回当前的hook
  const hook = mountWorkInProgressHook();

  // ...赋值初始state

  // 创建queue
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: (initialState: any),
  });

  // ...创建dispatch
  return [hook.memoizedState, dispatch];
}
```

其中`mountWorkInProgressHook`方法会创建并返回对应`hook`，对应`极简Hooks实现`中`useState`方法的`isMount`逻辑部分。

可以看到，`mount`时这两个`Hook`的唯一区别为`queue`参数的`lastRenderedReducer`字段。

`queue`的数据结构如下：

```js
const queue = (hook.queue = {
  // 与极简实现中的同名字段意义相同，保存update对象
  pending: null,
  // 保存dispatchAction.bind()的值
  dispatch: null,
  // 上一次render时使用的reducer
  lastRenderedReducer: reducer,
  // 上一次render时的state
  lastRenderedState: (initialState: any),
});
```

其中，`useReducer`的`lastRenderedReducer`为传入的`reducer`参数。`useState`的`lastRenderedReducer`为`basicStateReducer`。

`basicStateReducer`方法如下：

```js
function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  return typeof action === 'function' ? action(state) : action;
}
```

可见，`useState`即`reducer`参数为`basicStateReducer`的`useReducer`。

`mount`时的整体运行逻辑与`极简实现`的`isMount`逻辑类似，你可以对照着看。

### update时

如果说`mount`时这两者还有区别，那`update`时，`useReducer`与`useState`调用的则是同一个函数[updateReducer](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L665)。

```js
function updateReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  // 获取当前hook
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;
  
  queue.lastRenderedReducer = reducer;

  // ...同update与updateQueue类似的更新逻辑

  const dispatch: Dispatch<A> = (queue.dispatch: any);
  return [hook.memoizedState, dispatch];
}
```

整个流程可以概括为一句话：

> 找到对应的`hook`，根据`update`计算该`hook`的新`state`并返回。

`mount`时获取当前`hook`使用的是`mountWorkInProgressHook`，而`update`时使用的是`updateWorkInProgressHook`，这里的原因是： 

- `mount`时可以确定是调用`ReactDOM.render`或相关初始化`API`产生的`更新`，只会执行一次。

- `update`可能是在事件回调或副作用中触发的`更新`或者是`render阶段`触发的`更新`，为了避免组件无限循环`更新`，后者需要区别对待。

举个`render阶段`触发的`更新`的例子：

```js
function App() {
  const [num, updateNum] = useState(0);
  
  updateNum(num + 1);

  return (
    <button onClick={() => updateNum(num => num + 1)}>{num}</button>  
  )
}
```

在这个例子中，`App`调用时，代表已经进入`render阶段`执行`renderWithHooks`。

在`App`内部，调用`updateNum`会触发一次`更新`。如果不对这种情况下触发的更新作出限制，那么这次`更新`会开启一次新的`render阶段`，最终会无限循环更新。

基于这个原因，`React`用一个标记变量`didScheduleRenderPhaseUpdate`判断是否是`render阶段`触发的更新。

`updateWorkInProgressHook`方法也会区分这两种情况来获取对应`hook`。

获取对应`hook`，接下来会根据`hook`中保存的`state`计算新的`state`，这个步骤同[Update一节](../state/update.html)一致。

## 调用阶段

调用阶段会执行[dispatchAction](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L1662)，此时该`FunctionComponent`对应的`fiber`以及`hook.queue`已经通过调用`bind`方法预先作为参数传入。

```js
function dispatchAction(fiber, queue, action) {

  // ...创建update
  var update = {
    eventTime: eventTime,
    lane: lane,
    suspenseConfig: suspenseConfig,
    action: action,
    eagerReducer: null,
    eagerState: null,
    next: null
  }; 

  // ...将update加入queue.pending
  
  var alternate = fiber.alternate;

  if (fiber === currentlyRenderingFiber$1 || alternate !== null && alternate === currentlyRenderingFiber$1) {
    // render阶段触发的更新
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
  } else {
    if (fiber.lanes === NoLanes && (alternate === null || alternate.lanes === NoLanes)) {
      // ...fiber的updateQueue为空，优化路径
    }

    scheduleUpdateOnFiber(fiber, lane, eventTime);
  }
}
```

整个过程可以概括为：

> 创建`update`，将`update`加入`queue.pending`中，并开启调度。

这里值得注意的是`if...else...`逻辑，其中：

```js
if (fiber === currentlyRenderingFiber$1 || alternate !== null && alternate === currentlyRenderingFiber$1)
```

`currentlyRenderingFiber`即`workInProgress`，`workInProgress`存在代表当前处于`render阶段`。

触发`更新`时通过`bind`预先保存的`fiber`与`workInProgress`全等，代表本次`更新`发生于`FunctionComponent`对应`fiber`的`render阶段`。

所以这是一个`render阶段`触发的`更新`，需要标记变量`didScheduleRenderPhaseUpdate`，后续单独处理。

再来关注：

```js
if (fiber.lanes === NoLanes && (alternate === null || alternate.lanes === NoLanes))
```

`fiber.lanes`保存`fiber`上存在的`update`的`优先级`。

`fiber.lanes === NoLanes`意味着`fiber`上不存在`update`。

我们已经知道，通过`update`计算`state`发生在`声明阶段`，这是因为该`hook`上可能存在多个不同`优先级`的`update`，最终`state`的值由多个`update`共同决定。

但是当`fiber`上不存在`update`，则`调用阶段`创建的`update`为该`hook`上第一个`update`，在`声明阶段`计算`state`时也只依赖于该`update`，完全不需要进入`声明阶段`再计算`state`。

这样做的好处是：如果计算出的`state`与该`hook`之前保存的`state`一致，那么完全不需要开启一次调度。即使计算出的`state`与该`hook`之前保存的`state`不一致，在`声明阶段`也可以直接使用`调用阶段`已经计算出的`state`。

> 你可以在[这里](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L1727)看到这段提前计算`state`的逻辑

## 小Tip

我们通常认为，`useReducer(reducer, initialState)`的传参为初始化参数，在以后的调用中都不可变。

但是在`updateReducer`方法中，可以看到`lastRenderedReducer`在每次调用时都会重新赋值。

```js
function updateReducer(reducer, initialArg, init) {
  // ...

  queue.lastRenderedReducer = reducer;

  // ...
```

也就是说，`reducer`参数是随时可变的。

每秒`useReducer`使用的`reducer`会改变一次

点击按钮后会随时间不同会出现`+1`或`-1`的效果

# useEffect
FunctionComponent中，所有的hook是保存在`fiber.memoizedState`上的，并且它们会形成一条单项链表。这些hooks的调用顺序是不变的。

在一个FunctionComponent中，多个useEffect的effect是通过链表连接，形成环状链表。

在mount阶段时，会调用mountEffectImpl；在update阶段，调用updateEffectImpl。
```js
// mount阶段的useEffect
function mountEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  return mountEffectImpl(
    UpdateEffect | PassiveEffect,
    HookPassive, // flags的标记
    create,
    deps,
  );
}
// update阶段的useEffect
function updateEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  return updateEffectImpl(
    UpdateEffect | PassiveEffect,
    HookPassive, // flags的标记
    create,
    deps,
  );
}


function mountEffectImpl(fiberFlags, hookFlags, create, deps): void {
  // 获取当前hook对应的数据
  const hook = mountWorkInProgressHook();
  // 依赖项
  const nextDeps = deps === undefined ? null : deps;
  // 设置当前fiber阶段 的flags
  currentlyRenderingFiber.flags |= fiberFlags;
   // pushEffect 返回effect
   // 保存当前hook上最后一个effect数据，它是一条环状链表
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    undefined,
    nextDeps,
  );
}

export type Hook = {|
  memoizedState: any,
  baseState: any,
  baseQueue: Update<any, any> | null,
  queue: UpdateQueue<any, any> | null,
  next: Hook | null,
|};

let currentHook: Hook | null = null;

// 在update中才能取到上一个effect的destroy
function updateEffectImpl(fiberFlags, hookFlags, create, deps): void {
  // 获取当前hook对应的数据
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  let destroy = undefined;

  if (currentHook !== null) {
    // 取出上一次更新的effect
    const prevEffect = currentHook.memoizedState;
    // 从 上一次effect中取出销毁函数，等到create执行之后才有destroy
    destroy = prevEffect.destroy;
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;
      // 浅比较 前后的deps是否相等

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 进入这里，则依赖项没有改变，执行pushEffect，并return终止向下执行
        pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }
    }
  }

  // 依赖项改变的逻辑
  currentlyRenderingFiber.flags |= fiberFlags;
  // pushEffect 返回effect
  // 存在HookHasEffect | hookFlags 情况才本次的effect才会被执行
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags, // HookHasEffect = /* */ 0b001;
    create,
    destroy,
    nextDeps,
  );
}

//  deps浅比较
function areHookInputsEqual(
  nextDeps: Array<mixed>,
  prevDeps: Array<mixed> | null,
) {
  // deps浅比较的原理
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (is(nextDeps[i], prevDeps[i])) { // is是Object.is
      continue;
    }
    return false;
  }
  return true;
}

function createFunctionComponentUpdateQueue(): FunctionComponentUpdateQueue {
  return {
    lastEffect: null,
  };
}

// currentlyRenderingFiber即workInProgress  当前函数组件的fiber
function pushEffect(tag, create, destroy, deps) {
  const effect: Effect = {
    tag,
    create,  // useEffect的回调函数 
    destroy, // useEffect的销毁函数
    deps, // 依赖项
    // Circular
    next: null,  // 指向下一个effect
  };
  // 创建updateQueue
  let componentUpdateQueue: null | FunctionComponentUpdateQueue = (currentlyRenderingFiber.updateQueue: any);
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber.updateQueue = (componentUpdateQueue: any);
    // 将创建的effect挂载到 UpdateQueue.lastEffect，并让 effect 形成一条环状链表
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    const lastEffect = componentUpdateQueue.lastEffect;
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      // 在环状链表中插入effect
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }
  // 返回effect
  return effect;
}
```

commit阶段流程中，在`flushPassiveEffects`方法内部会从全局变量`rootWithPendingPassiveEffects`获取`effectList`。

通过`flushPassiveEffects`方法内部探索`useEffect`的工作原理。

## flushPassiveEffectsImpl

`flushPassiveEffects`内部会设置`优先级`，并执行`flushPassiveEffectsImpl`。

> 你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L2458)看到`flushPassiveEffects`的代码

`flushPassiveEffectsImpl`主要做三件事：

- 调用该`useEffect`在上一次`render`时的销毁函数

- 调用该`useEffect`在本次`render`时的回调函数

- 如果存在同步任务，不需要等待下次`事件循环`的`宏任务`，提前执行他

本节我们关注前两步。

在`v16`中第一步是同步执行的，在[官方博客](https://zh-hans.reactjs.org/blog/2020/08/10/react-v17-rc.html#effect-cleanup-timing)中提到：

> 副作用清理函数（如果存在）在 React 16 中同步运行。我们发现，对于大型应用程序来说，这不是理想选择，因为同步会减缓屏幕的过渡（例如，切换标签）。

基于这个原因，在`v17.0.0`中，`useEffect`的两个阶段会在页面渲染后（`layout`阶段后）异步执行。

> 事实上，从代码中看，`v16.13.1`中已经是异步执行了

接下来我们详细讲解这两个步骤。

## 阶段一：销毁函数的执行

`useEffect`的执行需要保证所有组件`useEffect`的`销毁函数`必须都执行完后才能执行任意一个组件的`useEffect`的`回调函数`。

这是因为多个`组件`间可能共用同一个`ref`。

如果不是按照“全部销毁”再“全部执行”的顺序，那么在某个组件`useEffect`的`销毁函数`中修改的`ref.current`可能影响另一个组件`useEffect`的`回调函数`中的同一个`ref`的`current`属性。

在`useLayoutEffect`中也有同样的问题，所以他们都遵循“全部销毁”再“全部执行”的顺序。

在阶段一，会遍历并执行所有`useEffect`的`销毁函数`。

```js
// pendingPassiveHookEffectsUnmount中保存了所有需要执行销毁的useEffect
const unmountEffects = pendingPassiveHookEffectsUnmount;
  pendingPassiveHookEffectsUnmount = [];
  for (let i = 0; i < unmountEffects.length; i += 2) {
    const effect = ((unmountEffects[i]: any): HookEffect);
    const fiber = ((unmountEffects[i + 1]: any): Fiber);
    const destroy = effect.destroy;
    effect.destroy = undefined;

    if (typeof destroy === 'function') {
      // 销毁函数存在则执行
      try {
        destroy();
      } catch (error) {
        captureCommitPhaseError(fiber, error);
      }
    }
  }
```

其中`pendingPassiveHookEffectsUnmount`数组的索引`i`保存需要销毁的`effect`，`i+1`保存该`effect`对应的`fiber`。

向`pendingPassiveHookEffectsUnmount`数组内`push`数据的操作发生在`layout阶段` `commitLayoutEffectOnFiber`方法内部的`schedulePassiveEffects`方法中。

> `commitLayoutEffectOnFiber`方法我们在[Layout阶段](../renderer/layout.html#commitlayouteffectonfiber)已经介绍

```js
function schedulePassiveEffects(finishedWork: Fiber) {
  const updateQueue: FunctionComponentUpdateQueue | null = (finishedWork.updateQueue: any);
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      const {next, tag} = effect;
      if (
        (tag & HookPassive) !== NoHookEffect &&
        (tag & HookHasEffect) !== NoHookEffect
      ) {
        // 向`pendingPassiveHookEffectsUnmount`数组内`push`要销毁的effect
        enqueuePendingPassiveHookEffectUnmount(finishedWork, effect);
        // 向`pendingPassiveHookEffectsMount`数组内`push`要执行回调的effect
        enqueuePendingPassiveHookEffectMount(finishedWork, effect);
      }
      effect = next;
    } while (effect !== firstEffect);
  }
}
```

## 阶段二：回调函数的执行

与阶段一类似，同样遍历数组，执行对应`effect`的`回调函数`。

其中向`pendingPassiveHookEffectsMount`中`push`数据的操作同样发生在`schedulePassiveEffects`中。

```js
// pendingPassiveHookEffectsMount中保存了所有需要执行回调的useEffect
const mountEffects = pendingPassiveHookEffectsMount;
pendingPassiveHookEffectsMount = [];
for (let i = 0; i < mountEffects.length; i += 2) {
  const effect = ((mountEffects[i]: any): HookEffect);
  const fiber = ((mountEffects[i + 1]: any): Fiber);
  
  try {
    const create = effect.create;
   effect.destroy = create();
  } catch (error) {
    captureCommitPhaseError(fiber, error);
  }
}
```


# useRef
`ref`是`reference`（引用）的缩写。在`React`中，我们习惯用`ref`保存`DOM`。

事实上，任何需要被"引用"的数据都可以保存在`ref`中，`useRef`的出现将这种思想进一步发扬光大。

在[Hooks数据结构一节](./structure.html#memoizedstate)我们讲到：

> 对于`useRef(1)`，`memoizedState`保存`{current: 1}`

本节我们会介绍`useRef`的实现，以及`ref`的工作流程。

由于`string`类型的`ref`已不推荐使用，所以本节针对`function | {current: any}`类型的`ref`。

## useRef

与其他`Hook`一样，对于`mount`与`update`，`useRef`对应两个不同`dispatcher`。

```js
function mountRef<T>(initialValue: T): {|current: T|} {
  // 获取当前useRef hook
  const hook = mountWorkInProgressHook();
  // 创建ref
  const ref = {current: initialValue};
  hook.memoizedState = ref;
  return ref;
}

function updateRef<T>(initialValue: T): {|current: T|} {
  // 获取当前useRef hook
  const hook = updateWorkInProgressHook();
  // 返回保存的数据
  return hook.memoizedState;
}
```

> 你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.old.js#L1208-L1221)看到这段代码

可见，`useRef`仅仅是返回一个包含`current`属性的对象。

为了验证这个观点，我们再看下`React.createRef`方法的实现：

```js
export function createRef(): RefObject {
  const refObject = {
    current: null,
  };
  return refObject;
}
```

> 你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react/src/ReactCreateRef.js)看到这段代码

了解了`ref`的数据结构后，我们再来看看`ref`的工作流程。

## ref的工作流程

在`React`中，`HostComponent`、`ClassComponent`、`ForwardRef`可以赋值`ref`属性。

```js
// HostComponent
<div ref={domRef}></div>
// ClassComponent / ForwardRef
<App ref={cpnRef} />
```

其中，`ForwardRef`只是将`ref`作为第二个参数传递下去，不会进入`ref`的工作流程。

所以接下来讨论`ref`的工作流程时会排除`ForwardRef`。

```js
// 对于ForwardRef，secondArg为传递下去的ref
let children = Component(props, secondArg);
```

> 你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.old.js#L415)看到这段代码

我们知道`HostComponent`在`commit阶段`的`mutation阶段`执行`DOM`操作。

所以，对应`ref`的更新也是发生在`mutation阶段`。

再进一步，`mutation阶段`执行`DOM`操作的依据为`effectTag`。

所以，对于`HostComponent`、`ClassComponent`如果包含`ref`操作，那么也会赋值相应的`effectTag`。

```js
// ...
export const Placement = /*                    */ 0b0000000000000010;
export const Update = /*                       */ 0b0000000000000100;
export const Deletion = /*                     */ 0b0000000000001000;
export const Ref = /*                          */ 0b0000000010000000;
// ...
```

> 你可以在[ReactSideEffectTags文件](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js#L24)中看到`ref`对应的`effectTag`

所以，`ref`的工作流程可以分为两部分：

- `render阶段`为含有`ref`属性的`fiber`添加`Ref effectTag`

- `commit阶段`为包含`Ref effectTag`的`fiber`执行对应操作

## render阶段

在`render阶段`的`beginWork`与`completeWork`中有个同名方法`markRef`用于为含有`ref`属性的`fiber`增加`Ref effectTag`。

```js
// beginWork的markRef
function markRef(current: Fiber | null, workInProgress: Fiber) {
  const ref = workInProgress.ref;
  if (
    (current === null && ref !== null) ||
    (current !== null && current.ref !== ref)
  ) {
    // Schedule a Ref effect
    workInProgress.effectTag |= Ref;
  }
}
// completeWork的markRef
function markRef(workInProgress: Fiber) {
  workInProgress.effectTag |= Ref;
}
```

> 你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.old.js#L693)看到`beginWork`的`markRef`、[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCompleteWork.old.js#L153)看到`completeWork`的`markRef`

在`beginWork`中，如下两处调用了`markRef`：

- `updateClassComponent`内的[finishClassComponent](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.old.js#L958)，对应`ClassComponent`

注意`ClassComponent`即使`shouldComponentUpdate`为`false`该组件也会调用`markRef`

- [updateHostComponent](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.old.js#L1156)，对应`HostComponent`

在`completeWork`中，如下两处调用了`markRef`：

- `completeWork`中的[HostComponent](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCompleteWork.old.js#L728)类型

- `completeWork`中的[ScopeComponent](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCompleteWork.old.js#L1278)类型

> `ScopeComponent`是一种用于管理`focus`的测试特性，详见[PR](https://github.com/facebook/react/pull/16587)

总结下`组件`对应`fiber`被赋值`Ref effectTag`需要满足的条件：

- `fiber`类型为`HostComponent`、`ClassComponent`、`ScopeComponent`（这种情况我们不讨论）

- 对于`mount`，`workInProgress.ref !== null`，即存在`ref`属性

- 对于`update`，`current.ref !== workInProgress.ref`，即`ref`属性改变



## commit阶段

在`commit阶段`的`mutation阶段`中，对于`ref`属性改变的情况，需要先移除之前的`ref`。

```js
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  while (nextEffect !== null) {

    const effectTag = nextEffect.effectTag;
    // ...

    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        // 移除之前的ref
        commitDetachRef(current);
      }
    }
    // ...
  }
  // ...
```

> 你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L2342)看到这段代码

```js
function commitDetachRef(current: Fiber) {
  const currentRef = current.ref;
  if (currentRef !== null) {
    if (typeof currentRef === 'function') {
      // function类型ref，调用他，传参为null
      currentRef(null);
    } else {
      // 对象类型ref，current赋值为null
      currentRef.current = null;
    }
  }
}
```

接下来，在`mutation阶段`，对于`Deletion effectTag`的`fiber`（对应需要删除的`DOM节点`），需要递归他的子树，对子孙`fiber`的`ref`执行类似`commitDetachRef`的操作。

在[mutation阶段一节](renderer/mutation.html#commitmutationeffects)我们讲到

> 对于`Deletion effectTag`的`fiber`，会执行`commitDeletion`。

在`commitDeletion`——`unmountHostComponents`——`commitUnmount`——`ClassComponent | HostComponent`类型`case`中调用的`safelyDetachRef`方法负责执行类似`commitDetachRef`的操作。

```js
function safelyDetachRef(current: Fiber) {
  const ref = current.ref;
  if (ref !== null) {
    if (typeof ref === 'function') {
      try {
        ref(null);
      } catch (refError) {
        captureCommitPhaseError(current, refError);
      }
    } else {
      ref.current = null;
    }
  }
}
```

> 你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L183)看到这段代码

接下来进入`ref`的赋值阶段。我们在[Layout阶段一节](../renderer/layout.html#commitlayouteffects)讲到

> `commitLayoutEffect`会执行`commitAttachRef`（赋值`ref`）

```js
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    // 获取ref属性对应的Component实例
    const instance = finishedWork.stateNode;
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostComponent:
        // 原生DOM
        instanceToUse = getPublicInstance(instance);
        break;
      default:
        instanceToUse = instance;
    }

    // 赋值ref
    if (typeof ref === 'function') {
      ref(instanceToUse);
    } else {
      ref.current = instanceToUse;
    }
  }
}
```

至此，`ref`的工作流程完毕。

## 总结

本节我们学习了`ref`的工作流程。

- 对于`FunctionComponent`，`useRef`负责创建并返回对应的`ref`。

- 对于赋值了`ref`属性的`HostComponent`与`ClassComponent`，会在`render阶段`经历赋值`Ref effectTag`，在`commit阶段`执行对应`ref`操作。

# useMemo和useCallback

在了解其他`hook`的实现后，理解`useMemo`与`useCallback`的实现非常容易。

本节我们以`mount`与`update`两种情况分别讨论这两个`hook`。

## mount

```js
function mountMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null,
): T {
  // 创建并返回当前hook
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  // 计算value
  const nextValue = nextCreate();
  // 将value与deps保存在hook.memoizedState
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

// 省略了 像mountMemo 执行 nextCreate()的这一步
function mountCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  // 创建并返回当前hook
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  // 将value与deps保存在hook.memoizedState
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
```

可以看到，与`mountCallback`这两个唯一的区别是

- `mountMemo`会将`回调函数`(nextCreate)的执行结果作为`value`保存

- `mountCallback`会将`回调函数`作为`value`保存

## update

```js
function updateMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null,
): T {
  // 返回当前hook
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;

  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps: Array<mixed> | null = prevState[1];
      // 判断update前后value是否变化
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 未变化
        return prevState[0];
      }
    }
  }
  // 变化，重新计算value
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function updateCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  // 返回当前hook
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;

  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps: Array<mixed> | null = prevState[1];
      // 判断update前后value是否变化
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 未变化
        return prevState[0];
      }
    }
  }

  // 变化，将新的callback作为value
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
```

可见，对于`update`，这两个`hook`的唯一区别也是**是回调函数本身还是回调函数的执行结果作为value**。


