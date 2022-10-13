---
title: 【React源码】React的render阶段
date: 2022-06-19 19:25:33
categories:
  - 前端
tags:
  - React
toc: true # 是否启用内容索引
comments: true
copyright: false
---
# render阶段
`render阶段`开始于`performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`方法的调用，这取决于本次更新是同步更新还是异步更新。在这两个方法中会调用如下两个方法：
```js
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent() {
  // shouldYield()的返回值为true，代表需要中止循环   React18
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

可以看到，他们唯一的区别是是否调用`shouldYield`方法。如果当前浏览器帧没有剩余时间，`shouldYield`会中止循环，直到浏览器有空闲时间后再继续遍历。

`workInProgress`代表当前已创建的`workInProgress fiber`工作树。

`performUnitOfWork`方法会创建下一个`Fiber节点`并赋值给`workInProgress`，并将`workInProgress`与已创建的`Fiber节点`连接起来构成`Fiber树`。

`Fiber Reconciler（React16）`是从`Stack Reconciler（React15）`重构而来，通过遍历的方式实现可中断的递归，所以performUnitOfWork的工作可以分为两部分：“递”和“归”。

## “递”阶段

- 首先从rootFiber开始向下深度优先遍历。为遍历到的每个Fiber节点调用 beginWork 方法。

- beginWork作用：会根据传入的Fiber节点创建子Fiber节点，并将这两个Fiber节点连接起来。当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段。

## “归”阶段
在“归”阶段会调用 completeWork 处理Fiber节点。当某个Fiber节点执行完completeWork，如果其存在兄弟Fiber节点（即fiber.sibling !== null），会进入其兄弟Fiber的“递”阶段。如果不存在兄弟Fiber，会进入父级Fiber的“归”阶段。

“递”和“归”阶段会交错执行直到“归”到rootFiber。至此，render阶段的工作就结束了。

## 例子

以上一节的例子举例：

```js
function App() {
  return (
    <div>
      奔跑的
      <span>蜗牛</span>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"));
```

对应的`Fiber树`结构：
<img src="/images/front_end/react/fiber.png">

`render阶段`会依次执行：

```sh
1. rootFiber beginWork
2. App Fiber beginWork
3. div Fiber beginWork
4. "奔跑的" Fiber beginWork
5. "奔跑的" Fiber completeWork
6. span Fiber beginWork
7. span Fiber completeWork
8. div Fiber completeWork
9. App Fiber completeWork
10. rootFiber completeWork
```


之所以没有 “蜗牛” Fiber 的 beginWork/completeWork，是因为作为一种性能优化手段，针对只有单一文本子节点的`Fiber`，`React`会特殊处理。不会为唯一纯文本的子节点创建一个独立的fiber节点。

如果将`performUnitOfWork`转化为递归版本，大体代码如下：

```js
function performUnitOfWork(fiber) {
  // 执行beginWork

  if (fiber.child) {
    performUnitOfWork(fiber.child);
  }

  // 执行completeWork

  if (fiber.sibling) {
    performUnitOfWork(fiber.sibling);
  }
}
```
# beginWork

## 从传参看beginWork方法执行

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  // ...省略函数体
}
```
其中传参：
- current：当前组件对应的`Fiber节点`在上一次更新时的`Fiber节点`，即`workInProgress.alternate`
- workInProgress：当前组件对应的`Fiber节点`
- renderLanes：优先级相关，在讲解`Scheduler`时再讲解

除`rootFiber`以外， 组件`mount`时，由于是首次渲染，是不存在当前组件对应的`Fiber节点`在上一次更新时的`Fiber节点`，即`mount`时`current === null`。

组件`update`时，由于之前已经`mount`过，所以`current !== null`。

所以我们可以通过`current === null ?`来区分组件是处于`mount`还是`update`。

基于此原因，`beginWork`的工作可以分为两部分：

- `update`时：如果`current`存在，在满足一定条件时可以复用`current`节点，这样就能克隆`current.child`作为`workInProgress.child`，而不需要新建`workInProgress.child`。

- `mount`时：除`fiberRootNode`以外，`current === null`。会根据`fiber.tag`不同，创建不同类型的`子Fiber节点`

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {

  // update时：如果current存在可能存在优化路径，可以复用current（即上一次更新的Fiber节点）
  if (current !== null) {
    var oldProps = current.memoizedProps;
    var newProps = workInProgress.pendingProps;

    // 当前 fiber节点是否有变化，
    // 新旧props是否相等，是否有context的变化
    if (oldProps !== newProps || hasContextChanged() || ( 
          workInProgress.type !== current.type)) {  // type是否改变

          didReceiveUpdate = true;
        } else {
          // Neither props nor legacy context changes. Check if there's a pending
          // update or context change.
          var hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(current, renderLanes);

          if (!hasScheduledUpdateOrContext && // If this is the second pass of an error or suspense boundary, there
            // may not be work scheduled on `current`, so we check for this flag.
            (workInProgress.flags & DidCapture) === NoFlags) {
            // No pending updates or context. Bail out now.
            didReceiveUpdate = false;
            return attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress, renderLanes);
          }

          if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
            // This is a special case that only exists for legacy mode.
            // See https://github.com/facebook/react/pull/19216.
            didReceiveUpdate = true;
          } else {
            // An update was scheduled on this fiber, but there are no new props
            // nor legacy context. Set this to false. If an update queue or context
            // consumer produces a changed value, it will set this to true. Otherwise,
            // the component will assume the children have not changed and bail out.
            didReceiveUpdate = false;
          }
        }

    // 本次更新中： didReceiveUpdate代表当前fiber节点 是否有变化，
    didReceiveUpdate = true

    
  } else {
    didReceiveUpdate = false;

     // ...省略
  }

  // mount时：根据tag不同，创建不同的子Fiber节点
  switch (workInProgress.tag) {
    case IndeterminateComponent: 
      // ...省略
    case LazyComponent: 
      // ...省略
    case FunctionComponent: 
      // ...省略
    case ClassComponent: 
      // ...省略
    case HostRoot:
      // ...省略
    case HostComponent:
      // ...省略
    case HostText:
      // ...省略
    // ...省略其他类型
  }
}
```

## update时

我们可以看到，满足如下情况时`didReceiveUpdate === false`（即可以直接复用前一次更新的`子Fiber`，不需要新建`子Fiber`）

1. `oldProps === newProps && workInProgress.type === current.type`，即`props`与`fiber.type`不变
2. `!includesSomeLane(renderLanes, updateLanes)`，即当前`Fiber节点`优先级不够，会在讲解`Scheduler`时介绍

```js
if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps ||
      hasLegacyContextChanged() ||
      (__DEV__ ? workInProgress.type !== current.type : false)
    ) {
      didReceiveUpdate = true;
    } else if (!includesSomeLane(renderLanes, updateLanes)) {
      didReceiveUpdate = false;
      switch (workInProgress.tag) {
        // 省略处理
      }
      return bailoutOnAlreadyFinishedWork(
        current,
        workInProgress,
        renderLanes,
      );
    } else {
      didReceiveUpdate = false;
    }
  } else {
    didReceiveUpdate = false;
  }
```
## mount时

当不满足优化路径时，我们就进入第二部分，新建`子Fiber`。

我们可以看到，根据`fiber.tag`不同，进入不同类型`Fiber`的创建逻辑。

可以从ReactWorkTags.js看到`tag`对应的组件类型

```js
// mount时：根据tag不同，创建不同的Fiber节点
switch (workInProgress.tag) {
  case IndeterminateComponent: 
    // ...省略
  case LazyComponent: 
    // ...省略
  case FunctionComponent: 
    // ...省略
  case ClassComponent: 
    // ...省略
  case HostRoot:
    // ...省略
  case HostComponent:
    // ...省略
  case HostText:
    // ...省略
  // ...省略其他类型
}
```
对于我们常见的组件类型，如（`FunctionComponent`/`ClassComponent`/`HostComponent`），最终会进入[reconcileChildren](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L233)方法。

## reconcileChildren

从该函数名就能看出这是`Reconciler`模块的核心部分。那么他究竟做了什么呢？

- 对于`mount`的组件，他会创建新的`子Fiber节点`，并返回新的子fiber

- 对于`update`的组件，他会将当前组件与该组件在上次更新时对应的`Fiber节点`比较（也就是俗称的`Diff`算法），将比较的结果生成新`Fiber节点`

```js
// 当 某个节点 不存在对应 的current节点时，它是不会被标记 flags的，
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber, 
  nextChildren: any, // 子fiber 对应的JSX对象
  renderLanes: Lanes
) {
  if (current === null) {
    // 对于mount的组件
    // 不会为 `Fiber节点`带上`flags`属性
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes,
    );
  } else {
    // 对于update的组件
    // 为生成的`Fiber节点`带上`flags`属性  首屏渲染时，只有 页面的根节点走这里，为APP组件标记 flags
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes,
    );
  }
}

// 这两个方法在ReactChildFiber中实现如下：传入不同的布尔值
// export const reconcileChildFibers = ChildReconciler(true);
// export const mountChildFibers = ChildReconciler(false);

```

从代码可以看出，和`beginWork`一样，他也是通过`current === null ?`区分`mount`与`update`。

不论走哪个逻辑，最终他会生成新的子`Fiber节点`并赋值给`workInProgress.child`，作为本次`beginWork`[返回值](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L1158)，并作为下次`performUnitOfWork`执行时`workInProgress`的[传参](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1702)。

`mountChildFibers`与`reconcileChildFibers`这两个方法的逻辑基本一致。唯一的区别是：`reconcileChildFibers`会为生成的`Fiber节点`带上`flags`属性，而`mountChildFibers`不会。


- ChildReconciler方法
```js
// shouldTrackSideEffects是布尔值，是否追踪副作用，
function ChildReconciler(shouldTrackSideEffects) {
  // 删除一个child时
  function deleteChild(returnFiber: Fiber, childToDelete: Fiber): void {
    if (!shouldTrackSideEffects) {
      // 不追踪副作用直接return
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
    // 要追踪副作用，最终它会为需要删除的fiber节点的 flags赋值为Deletion
    childToDelete.flags = Deletion;
  }
  // 省略很多function...
  
  // 需要将当前fiber节点 对应的DOM节点插入到页面中
  function placeChild(
    newFiber: Fiber,
    lastPlacedIndex: number,
    newIndex: number,
  ): number {
    newFiber.index = newIndex;
    if (!shouldTrackSideEffects) {
      // 不需要追踪副作用，直接return
      return lastPlacedIndex;
    }
    const current = newFiber.alternate;
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
      // This is an insertion.
      newFiber.flags = Placement;
      return lastPlacedIndex;
    }
  }

  // 省略很多function...
}
```

## Flags

`render 阶段`（reconciler 协调阶段）的工作是在内存中进行，不会执行具体的DOM操作，当工作结束后会通知`Renderer`（commit 渲染阶段）需要执行的`DOM`操作。要执行`DOM`操作的具体类型就保存在`fiber.flags`中。

你可以从`ReactFiberFlags.js`看到`Flags`对应的`DOM`操作，该文件保存了所有的标记，fiber标记的，用到了二进制数据，位运算等

render 阶段需要做的就是为 需要执行DOM操作的fiber节点打上标记，比如一个fiber节点对应的DOM节点需要插入到页面中，为当前fiber节点打上`Placement`标记。

比如：

```js
// ReactFiberFlags.js
export type Flags = number;

// Don't change these two values. They're used by React Dev Tools.
export const NoFlags = /*                   */ 0b000000000000000000;
export const PerformedWork = /*            */ 0b000000000000000001;

// 当前 fiber节点 对应的DOM需要插入到页面中
export const Placement = /*                */ 0b00000000000010;
// 当前 fiber节点 对应的DOM需要更新
export const Update = /*                   */ 0b00000000000100;
// 当前 fiber节点 对应的DOM需要插入到页面中并更新
export const PlacementAndUpdate = /*       */ 0b00000000000110;
// 当前 fiber节点 对应的DOM需要删除
export const Deletion = /*                 */ 0b00000000001000;

// 为什么需要用二进制的形式表示Flags？
// 比如一个fiber节点对应的DOM需要  先Placement再Update
// 可以由 Flags 与 Placement、Update进行位运算，为fiber.flags切换标记
```

> 通过二进制表示`flags`，可以方便的使用位操作为`fiber.flags`赋值多个`effect`。

那么，如果要通知`Renderer`将`Fiber节点`对应的`DOM节点`插入页面中，需要满足两个条件：

1. `fiber.stateNode`存在，即`Fiber节点`中保存了对应的`DOM节点`

2. `(fiber.flags & Placement) !== 0`，即`Fiber节点`存在`Placement flags`

我们知道，`mount`时，`fiber.stateNode === null`，且在`reconcileChildren`中调用的`mountChildFibers`不会为`Fiber节点`赋值`flags`。那么首屏渲染如何完成呢？

针对第一个问题，`fiber.stateNode`会在`completeWork`中创建，我们会在下一节介绍。

第二个问题的答案十分巧妙：假设`mountChildFibers`也会赋值`flags`，那么可以预见`mount`时整棵`Fiber树`所有节点都会有`Placement flags`。那么`commit阶段`在执行`DOM`操作时每个节点都会执行一次插入操作，这样大量的`DOM`操作是极低效的。

为了解决这个问题，在`mount`时只有`rootFiber`会赋值`Placement flags`，在`commit阶段`只会执行一次插入操作。

3. 根Fiber节点 Demo
借用上一节的Demo，第一个进入`beginWork`方法的`Fiber节点`就是`rootFiber`，他的`alternate`指向`current rootFiber`（即他存在`current`）。

由于存在`current`，`rootFiber`在`reconcileChildren`时会走`reconcileChildFibers`逻辑。

而之后通过`beginWork`创建的`Fiber节点`是不存在`current`的（即 `fiber.alternate === null`），会走`mountChildFibers`逻辑

## beginWork流程图
<img src="/images/front_end/react/beginWork.png">

- reconcileChildFibers
```js
// reconcileChildFibers 会为fiber节点标记flags
function reconcileChildFibers(returnFiber, currentFirstChild, newChild, lanes) {
  // 判断当前child的类型，对不同的类型做不同的处理
        var isUnkeyedTopLevelFragment = typeof newChild === 'object' && newChild !== null && newChild.type === REACT_FRAGMENT_TYPE && newChild.key === null;

        if (isUnkeyedTopLevelFragment) {
          newChild = newChild.props.children;
        } // Handle object types


        if (typeof newChild === 'object' && newChild !== null) {
          switch (newChild.$$typeof) {
            // React.Element
            case REACT_ELEMENT_TYPE:
              return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, lanes));

            case REACT_PORTAL_TYPE:
              return placeSingleChild(reconcileSinglePortal(returnFiber, currentFirstChild, newChild, lanes));

            case REACT_LAZY_TYPE:
              {
                var payload = newChild._payload;
                var init = newChild._init; // TODO: This function is supposed to be non-recursive.

                return reconcileChildFibers(returnFiber, currentFirstChild, init(payload), lanes);
              }

          }
          // 当前newChild是一个数组，一个节点 包含多个子节点
          if (isArray(newChild)) {
            return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
          }

          if (getIteratorFn(newChild)) {
            return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, lanes);
          }

          throwOnInvalidObjectType(returnFiber, newChild);
        }
        // 文本节点  当做SingleTextNode处理
        if (typeof newChild === 'string' || typeof newChild === 'number') {
          return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, '' + newChild, lanes));
        }

        {
          if (typeof newChild === 'function') {
            warnOnFunctionType(returnFiber);
          }
        } // Remaining cases are all treated as empty.


        return deleteRemainingChildren(returnFiber, currentFirstChild);
      }
```

- reconcileSingleElement
```js
// reconcileSingleElement

function reconcileSingleElement(returnFiber, currentFirstChild, element, lanes) {
        var key = element.key;
        var child = currentFirstChild;

        // 在这个方法中，会判断它的child是否存在
        while (child !== null) {
          // TODO: If key === null and child.key === null, then this only applies to
          // the first item in the list.
          if (child.key === key) {
            var elementType = element.type;

            // 判断它的类型
            if (elementType === REACT_FRAGMENT_TYPE) {
              if (child.tag === Fragment) {
                deleteRemainingChildren(returnFiber, child.sibling);
                var existing = useFiber(child, element.props.children);
                existing.return = returnFiber;

                {
                  existing._debugSource = element._source;
                  existing._debugOwner = element._owner;
                }

                return existing;
              }
            } else {
              if (child.elementType === elementType || ( // Keep this check inline so it only runs on the false path:
                isCompatibleFamilyForHotReloading(child, element)) || // Lazy types should reconcile their resolved type.
                // We need to do this after the Hot Reloading check above,
                // because hot reloading has different semantics than prod because
                // it doesn't resuspend. So we can't let the call below suspend.
                typeof elementType === 'object' && elementType !== null && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === child.type) {
                deleteRemainingChildren(returnFiber, child.sibling);

                var _existing = useFiber(child, element.props);

                _existing.ref = coerceRef(returnFiber, child, element);
                _existing.return = returnFiber;

                {
                  _existing._debugSource = element._source;
                  _existing._debugOwner = element._owner;
                }

                return _existing;
              }
            } // Didn't match.


            deleteRemainingChildren(returnFiber, child);
            break;
          } else {
            deleteChild(returnFiber, child);
          }

          child = child.sibling;
        }

        if (element.type === REACT_FRAGMENT_TYPE) {
          var created = createFiberFromFragment(element.props.children, returnFiber.mode, lanes, element.key);
          created.return = returnFiber;
          return created;
        } else {
          /**
           * 最终进入createFiberFromElement方法，
           * 通过React.Element数据来创建一个fiber节点
          */
          var _created4 = createFiberFromElement(element, returnFiber.mode, lanes);

          _created4.ref = coerceRef(returnFiber, currentFirstChild, element);
          _created4.return = returnFiber;
          return _created4;
        }
      }
```
- createFiberFromElement
```js
function createFiberFromElement(element, mode, lanes) {
  var owner = null;
  {
    owner = element._owner;
  }
  var type = element.type;
  var key = element.key;
  var pendingProps = element.props;
  // createFiberFromTypeAndProps
  var fiber = createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes);
  {
    fiber._debugSource = element._source;
    fiber._debugOwner = element._owner;
  }
  return fiber;
}
```
- createFiberFromTypeAndProps
判断type的类型
```js
function createFiberFromTypeAndProps(type, // React$ElementType
      key, pendingProps, owner, mode, lanes) {
      var fiberTag = IndeterminateComponent; // The resolved type is set if we know what the final type will be. I.e. it's not lazy.

      var resolvedType = type;

      if (typeof type === 'function') {
        if (shouldConstruct$1(type)) {
          fiberTag = ClassComponent;

          {
            resolvedType = resolveClassForHotReloading(resolvedType);
          }
        } else {
          {
            resolvedType = resolveFunctionForHotReloading(resolvedType);
          }
        }
      } else if (typeof type === 'string') { // HostComponent
        fiberTag = HostComponent;
      } else {
        getTag: switch (type) {
          case REACT_FRAGMENT_TYPE:
            return createFiberFromFragment(pendingProps.children, mode, lanes, key);

          case REACT_DEBUG_TRACING_MODE_TYPE:
            fiberTag = Mode;
            mode |= DebugTracingMode;
            break;

          case REACT_STRICT_MODE_TYPE:
            fiberTag = Mode;
            mode |= StrictLegacyMode;

            if ((mode & ConcurrentMode) !== NoMode) {
              // Strict effects should never run on legacy roots
              mode |= StrictEffectsMode;
            }

            break;

          case REACT_PROFILER_TYPE:
            return createFiberFromProfiler(pendingProps, mode, lanes, key);

          case REACT_SUSPENSE_TYPE:
            return createFiberFromSuspense(pendingProps, mode, lanes, key);

          case REACT_SUSPENSE_LIST_TYPE:
            return createFiberFromSuspenseList(pendingProps, mode, lanes, key);

          case REACT_OFFSCREEN_TYPE:
            return createFiberFromOffscreen(pendingProps, mode, lanes, key);

          case REACT_LEGACY_HIDDEN_TYPE:
            return createFiberFromLegacyHidden(pendingProps, mode, lanes, key);

          case REACT_SCOPE_TYPE:

          // eslint-disable-next-line no-fallthrough

          case REACT_CACHE_TYPE:
            {
              return createFiberFromCache(pendingProps, mode, lanes, key);
            }

          // eslint-disable-next-line no-fallthrough

          default:
            {
              if (typeof type === 'object' && type !== null) {
                switch (type.$$typeof) {
                  case REACT_PROVIDER_TYPE:
                    fiberTag = ContextProvider;
                    break getTag;

                  case REACT_CONTEXT_TYPE:
                    // This is a consumer
                    fiberTag = ContextConsumer;
                    break getTag;

                  case REACT_FORWARD_REF_TYPE:
                    fiberTag = ForwardRef;

                    {
                      resolvedType = resolveForwardRefForHotReloading(resolvedType);
                    }

                    break getTag;

                  case REACT_MEMO_TYPE:
                    fiberTag = MemoComponent;
                    break getTag;

                  case REACT_LAZY_TYPE:
                    fiberTag = LazyComponent;
                    resolvedType = null;
                    break getTag;
                }
              }

              var info = '';

              {
                if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
                  info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and " + 'named imports.';
                }

                var ownerName = owner ? getComponentNameFromFiber(owner) : null;

                if (ownerName) {
                  info += '\n\nCheck the render method of `' + ownerName + '`.';
                }
              }

              throw new Error('Element type is invalid: expected a string (for built-in ' + 'components) or a class/function (for composite components) ' + ("but got: " + (type == null ? type : typeof type) + "." + info));
            }
        }
      }

      // 接下来回创建 对应的createFiber节点
      var fiber = createFiber(fiberTag, pendingProps, key, mode);
      fiber.elementType = type;
      fiber.type = resolvedType;
      fiber.lanes = lanes;

      {
        fiber._debugOwner = owner;
      }

      return fiber;
    }

// createFiber源码
const createFiber = function(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
): Fiber {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  return new FiberNode(tag, pendingProps, key, mode);
};

// FiberNode 描述fiber节点，上面有非常多的属性
```
## 总结
当某个节点进入beginWork时，它最终的目的是创建当前fiber节点的第一个子fiber节点。首先，它会在updateHostComponent判断当前节点的类型，进入不同update的逻辑，在update的逻辑里（reconcileChildern）中，判断当前WorkInProgerss Fiber 是否存在对应的current fiber，来决定是否标记flags，接着会进入 reconcile的逻辑（reconcileChildernFibers），判断当前fiber节点的childern是什么类型，来执行不同的创建操作。如果是hostComponent，最终会创建它的子fiber节点


# completeWork
在completeWork中，会根据workInProgress fiber节点的elementType，处理不同的case。h1、div等节点是HostComponent。以HostComponent为例讲解（即原生DOM元素对应的Fiber节点）

```js
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  const newProps = workInProgress.pendingProps;

  // 对于其他很多类型的 Component是不处理的，如FunctionComponent，没有completeWork的逻辑
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      return null;
    case ClassComponent: {
      // ...省略
      return null;
    }
    case HostRoot: {
      // ...省略
      updateHostContainer(workInProgress);
      return null;
    }
    case HostComponent: {
        popHostContext(workInProgress);
        var rootContainerInstance = getRootHostContainer();
        var type = workInProgress.type;
        // 首屏渲染时，current是不存在的
        // workInProgress.stateNode 是 该Fiber节点对应的DOM节点    判断是否存在
        if (current !== null && workInProgress.stateNode != null) {
          // update的情况
          updateHostComponent(current, workInProgress, type, newProps, rootContainerInstance);

          if (current.ref !== workInProgress.ref) {
            markRef(workInProgress);
          }
        } else { // 首屏渲染时，进入这里  mount的情况

          if (!newProps) {
            if (workInProgress.stateNode === null) {
              throw new Error('We must have new props for new mounts. This error is likely ' + 'caused by a bug in React. Please file an issue.');
            } // This can happen when we abort work.


            bubbleProperties(workInProgress);
            return null;
          }

          var currentHostContext = getHostContext(); 
          // 跟SSR相关
          var _wasHydrated = popHydrationState(workInProgress);

          if (_wasHydrated) {
          
            if (prepareToHydrateHostInstance(workInProgress, rootContainerInstance, currentHostContext)) {
            
              markUpdate(workInProgress);
            }
          } else {
            // 为 HostCoomponent  对应的fiber节点  创建对应的DOM节点，就是在 createInstance 里创建
            // 为fiber创建对应DOM节点
            var instance = createInstance(type, newProps, rootContainerInstance, currentHostContext, workInProgress);

            // 将创建好的 DOM节点， 插入到之前已经创建好的 DOM树中 appendAllChildren
            // // 将子孙DOM节点插入刚生成的DOM节点中
            appendAllChildren(instance, workInProgress, false, false);

            // 将 DOM节点 挂载到 对应的fiber节点的stateNode属性上
            workInProgress.stateNode = instance; 

            // 为DOM节点设置一些属性 finalizeInitialChildren，newProps就是 该DOM的元素属性集
            // 设置属性都是在 finalizeInitialChildren 方法中执行的
            if (finalizeInitialChildren(instance, type, newProps, rootContainerInstance)) {
              // 与update逻辑中的updateHostComponent类似的处理props的过程
              markUpdate(workInProgress);
            }
          }

          if (workInProgress.ref !== null) {
            // If there is a ref on a host node we need to schedule a callback
            markRef(workInProgress);
          }
        }

        bubbleProperties(workInProgress);
        return null;
      }
  // ...省略
```
- createInstance
```js
// 为对应的fiber节点  创建对应的DOM节点，就是在 createInstance 里创建
function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
      var parentNamespace;

      {
        // TODO: take namespace into account when validating.
        var hostContextDev = hostContext;
        validateDOMNesting(type, null, hostContextDev.ancestorInfo);

        if (typeof props.children === 'string' || typeof props.children === 'number') {
          var string = '' + props.children;
          var ownAncestorInfo = updatedAncestorInfo(hostContextDev.ancestorInfo, type);
          validateDOMNesting(null, string, ownAncestorInfo);
        }

        parentNamespace = hostContextDev.namespace;
      }
      // domElement 是DOM元素
      var domElement = createElement(type, props, rootContainerInstance, parentNamespace);
      precacheFiberNode(internalInstanceHandle, domElement);
      updateFiberProps(domElement, props);
      return domElement;
    }


    function finalizeInitialChildren(domElement, type, props, rootContainerInstance, hostContext) {
      setInitialProperties(domElement, type, props, rootContainerInstance);
      return shouldAutoFocusHostComponent(type, props);
    }


```
- finalizeInitialChildren中调用的setInitialProperties方法
```js
function setInitialProperties(domElement, tag, rawProps, rootContainerElement) {
      // 首先判断 是否是自定义的标签
      var isCustomComponentTag = isCustomComponent(tag, rawProps);

      {
        validatePropertiesInDevelopment(tag, rawProps);
      } // TODO: Make sure that we check isMounted before firing any of these events.


      var props;

      // 根据 HostComponent的 类型 进入不同的逻辑  
      switch (tag) {
        case 'dialog':
          listenToNonDelegatedEvent('cancel', domElement);
          listenToNonDelegatedEvent('close', domElement);
          props = rawProps;
          break;

        case 'iframe':
        case 'object':
        case 'embed':
          // We listen to this event in case to ensure emulated bubble
          // listeners still fire for the load event.
          listenToNonDelegatedEvent('load', domElement);
          props = rawProps;
          break;

        case 'video':
        case 'audio':
          // We listen to these events in case to ensure emulated bubble
          // listeners still fire for all the media events.
          for (var i = 0; i < mediaEventTypes.length; i++) {
            listenToNonDelegatedEvent(mediaEventTypes[i], domElement);
          }

          props = rawProps;
          break;

        case 'source':
          // We listen to this event in case to ensure emulated bubble
          // listeners still fire for the error event.
          listenToNonDelegatedEvent('error', domElement);
          props = rawProps;
          break;

        case 'img':
        case 'image':
        case 'link':
          // We listen to these events in case to ensure emulated bubble
          // listeners still fire for error and load events.
          listenToNonDelegatedEvent('error', domElement);
          listenToNonDelegatedEvent('load', domElement);
          props = rawProps;
          break;

        case 'details':
          // We listen to this event in case to ensure emulated bubble
          // listeners still fire for the toggle event.
          listenToNonDelegatedEvent('toggle', domElement);
          props = rawProps;
          break;

        case 'input':
          initWrapperState(domElement, rawProps);
          props = getHostProps(domElement, rawProps); // We listen to this event in case to ensure emulated bubble
          // listeners still fire for the invalid event.

          listenToNonDelegatedEvent('invalid', domElement);
          break;

        case 'option':
          validateProps(domElement, rawProps);
          props = rawProps;
          break;

        case 'select':
          initWrapperState$1(domElement, rawProps);
          props = getHostProps$1(domElement, rawProps); // We listen to this event in case to ensure emulated bubble
          // listeners still fire for the invalid event.

          listenToNonDelegatedEvent('invalid', domElement);
          break;

        case 'textarea':
          initWrapperState$2(domElement, rawProps);
          props = getHostProps$2(domElement, rawProps); // We listen to this event in case to ensure emulated bubble
          // listeners still fire for the invalid event.

          listenToNonDelegatedEvent('invalid', domElement);
          break;

        default:
          props = rawProps;
      }

      // 判断props 是否合法
      assertValidProps(tag, props);

      // 初始化DOM属性操作
      setInitialDOMProperties(tag, domElement, rootContainerElement, props, isCustomComponentTag);

      switch (tag) {
        case 'input':
          // TODO: Make sure we check if this is still unmounted or do any clean
          // up necessary since we never stop tracking anymore.
          track(domElement);
          postMountWrapper(domElement, rawProps, false);
          break;

        case 'textarea':
          // TODO: Make sure we check if this is still unmounted or do any clean
          // up necessary since we never stop tracking anymore.
          track(domElement);
          postMountWrapper$3(domElement);
          break;

        case 'option':
          postMountWrapper$1(domElement, rawProps);
          break;

        case 'select':
          postMountWrapper$2(domElement, rawProps);
          break;

        default:
          if (typeof props.onClick === 'function') {
            // TODO: This cast may not be sound for SVG, MathML or custom elements.
            trapClickOnNonInteractiveElement(domElement);
          }

          break;
      }
    } // Calculate the diff between the two objects.


    // 初始化DOM属性操作  setInitialDOMProperties源码
    function setInitialDOMProperties(tag, domElement, rootContainerElement, nextProps, isCustomComponentTag) {
      // 遍历 props上的属性
      for (var propKey in nextProps) {
        if (!nextProps.hasOwnProperty(propKey)) {
          continue;
        }

        var nextProp = nextProps[propKey];
        // 是否是 style属性
        if (propKey === STYLE) {
          {
            if (nextProp) {
              // 冻结对象
              Object.freeze(nextProp);
            }
          } // Relies on `updateStylesByID` not mutating `styleUpdates`.


          setValueForStyles(domElement, nextProp);
        } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
          var nextHtml = nextProp ? nextProp[HTML$1] : undefined;

          if (nextHtml != null) {
            setInnerHTML(domElement, nextHtml);
          }

        } else if (propKey === CHILDREN) {  // 是否是 children属性
          if (typeof nextProp === 'string') {
            // Avoid setting initial textContent when the text is empty. In IE11 setting
            // textContent on a <textarea> will cause the placeholder to not
            // show within the <textarea> until it has been focused and blurred again.
            // https://github.com/facebook/react/issues/6731#issuecomment-254874553
            var canSetTextContent = tag !== 'textarea' || nextProp !== '';

            if (canSetTextContent) {
              setTextContent(domElement, nextProp);
            }
          } else if (typeof nextProp === 'number') {
            setTextContent(domElement, '' + nextProp);
          }
        } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING); 
        else if (propKey === AUTOFOCUS); 
        else if (registrationNameDependencies.hasOwnProperty(propKey)) {
          if (nextProp != null) {
            if (typeof nextProp !== 'function') {
              warnForInvalidEventListener(propKey, nextProp);
            }

            if (propKey === 'onScroll') {
              listenToNonDelegatedEvent('scroll', domElement);
            }
          }
        } else if (nextProp != null) {
          // 最终进入这里：该函数 内部，使用setAttribute 为DOM设置属性， completeWork执行完成
          setValueForProperty(domElement, propKey, nextProp, isCustomComponentTag);
        }
      }
    }

```
- appendAllChildren的逻辑
```js
var appendAllChildren = function (parent, workInProgress, needsVisibilityToggle, isHidden) {
        // We only have the top Fiber that was created but we need recurse down its
        // children to find all the terminal nodes.
        var node = workInProgress.child;

        while (node !== null) {
          if (node.tag === HostComponent || node.tag === HostText) {
            appendInitialChild(parent, node.stateNode);
          } else if (node.tag === HostPortal); else if (node.child !== null) {
            node.child.return = node;
            node = node.child;
            continue;
          }

          if (node === workInProgress) {
            return;
          }

          while (node.sibling === null) {
            if (node.return === null || node.return === workInProgress) {
              return;
            }

            node = node.return;
          }

          node.sibling.return = node.return;
          node = node.sibling;
        }
      };
```

- createWorkInProgress：创建新的fiber节点 或者 基于current指向的 rootFiber 创建 WorkInProgress Fiber 树（复用）
```js
function createWorkInProgress(current, pendingProps) {
      var workInProgress = current.alternate;

      // workInProgress不存在情况，首屏渲染
      if (workInProgress === null) {
        // 创建新的 Fiber节点 
        workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode);
        // 基于current 为 workInProgress 设置同名参数
        workInProgress.elementType = current.elementType;
        workInProgress.type = current.type;
        workInProgress.stateNode = current.stateNode;

        {
          // DEV-only fields
          workInProgress._debugSource = current._debugSource;
          workInProgress._debugOwner = current._debugOwner;
          workInProgress._debugHookTypes = current._debugHookTypes;
        }

        workInProgress.alternate = current;
        current.alternate = workInProgress;
      } else {
        // workInProgress已存在
        workInProgress.pendingProps = pendingProps; // Needed because Blocks store data on type.

        workInProgress.type = current.type; // We already have an alternate.
        // Reset the effect tag.

        workInProgress.flags = NoFlags; // The effects are no longer valid.

        workInProgress.subtreeFlags = NoFlags;
        workInProgress.deletions = null;

        {
          // We intentionally reset, rather than copy, actualDuration & actualStartTime.
          // This prevents time from endlessly accumulating in new commits.
          // This has the downside of resetting values for different priority renders,
          // But works for yielding (the common case) and should support resuming.
          workInProgress.actualDuration = 0;
          workInProgress.actualStartTime = -1;
        }
      } // Reset all effects except static ones.
      // Static effects are not specific to a render.

      // 复用 同名参数
      workInProgress.flags = current.flags & StaticMask;
      workInProgress.childLanes = current.childLanes;
      workInProgress.lanes = current.lanes;
      workInProgress.child = current.child;
      workInProgress.memoizedProps = current.memoizedProps;
      workInProgress.memoizedState = current.memoizedState;
      workInProgress.updateQueue = current.updateQueue; // Clone the dependencies object. This is mutated during the render phase, so
      // it cannot be shared with the current fiber.

      var currentDependencies = current.dependencies;
      workInProgress.dependencies = currentDependencies === null ? null : {
        lanes: currentDependencies.lanes,
        firstContext: currentDependencies.firstContext
      }; // These will be overridden during the parent's reconciliation

      workInProgress.sibling = current.sibling;
      workInProgress.index = current.index;
      workInProgress.ref = current.ref;

      {
        workInProgress.selfBaseDuration = current.selfBaseDuration;
        workInProgress.treeBaseDuration = current.treeBaseDuration;
      }

      {
        workInProgress._debugNeedsRemount = current._debugNeedsRemount;

        switch (workInProgress.tag) {
          case IndeterminateComponent:
          case FunctionComponent:
          case SimpleMemoComponent:
            workInProgress.type = resolveFunctionForHotReloading(current.type);
            break;

          case ClassComponent:
            workInProgress.type = resolveClassForHotReloading(current.type);
            break;

          case ForwardRef:
            workInProgress.type = resolveForwardRefForHotReloading(current.type);
            break;
        }
      }

      return workInProgress;
    } // Used to reuse a Fiber for a second pass.
```
- root: 指向FiberRootFiber
- root.current: 指向是rootFiber
<img src="/images/front_end/react/create-work-progress001.png">

### update
update 归阶段 流程：completeWork。当update时，Fiber节点已经存在对应DOM节点，所以不需要生成DOM节点。需要做的主要是处理props，比如：

- onClick、onChange等回调函数的注册
- 处理style prop
- 处理DANGEROUSLY_SET_INNER_HTML prop
- 处理children prop
我们去掉一些当前不需要关注的功能（比如ref）。可以看到最主要的逻辑是调用updateHostComponent方法。
```js
// completeWork 的 updateHostComponent 和 beginWork中的不一样
if (current !== null && workInProgress.stateNode != null) {
  // update的情况
  updateHostComponent(
    current,
    workInProgress,
    type,
    newProps,
    rootContainerInstance,
  );
}
```
在updateHostComponent内部，被处理完的props会被赋值给workInProgress.updateQueue，并最终会在commit阶段被渲染在页面上。
其中updatePayload为数组形式，他的偶数索引的值为变化的prop key，奇数索引的值为变化的prop value。
```js
workInProgress.updateQueue = (updatePayload: any);
// props中的 childern 和 title属性
// updateQueue: ['childern', 5, 'title', 5]
```
### update流程结尾
render阶段全部工作完成。在performSyncWorkOnRoot函数中fiberRootNode被传递给commitRoot方法，开启commit阶段工作流程。
```js
commitRoot(root); // 开启commit阶段
```
### effectList（使用链表）
至此render阶段的绝大部分工作就完成了。

还有一个问题：作为DOM操作的依据，commit阶段需要找到所有有flags的Fiber节点并依次执行flags对应操作。难道需要在commit阶段再遍历一次Fiber树寻找flags !== null的Fiber节点么？

这显然是很低效的。

为了解决这个问题，在completeWork的上层函数completeUnitOfWork中，每个执行完completeWork且存在flags的Fiber节点会被保存在一条被称为effectList的单向链表中。**（是用链表来 连接  标记有flags的fiber节点， commit阶段直接使用链表）**

effectList中第一个Fiber节点保存在fiber.firstEffect，最后一个元素保存在fiber.lastEffect。

类似appendAllChildren，在“归”阶段，所有有flags的Fiber节点都会被追加在effectList中，最终形成一条以rootFiber.firstEffect为起点的单向链表。
```js
                       nextEffect         nextEffect
rootFiber.firstEffect -----------> fiber -----------> fiber
// 这样，在commit阶段只需要遍历effectList就能执行所有effect了。
```


### completeWork流程图

<img src="/images/front_end/react/completeWork.png">