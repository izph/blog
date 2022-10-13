---
title: 【React源码】React commit阶段
date: 2022-06-30 22:33:45
categories:
  - 前端
tags:
  - React
toc: true # 是否启用内容索引
comments: true
copyright: false
---

# commit阶段

`commitRoot`方法是`commit阶段`工作的起点。`fiberRootNode`会作为传参。

```js
commitRoot(root);

// commitRoot实际要执行的方法是 commitRootImpl
function commitRoot(root) {
	const renderPriorityLevel = getCurrentPriorityLevel();
    // 是由调度器Schduler 提供的
    // 参数一：调度的优先级； 参数二：调度的回调函数
	runWithPriority(
		ImmediateSchedulerPriority, 
        // 该函数触发的任何调度，都会以第一个参数ImmediateSchedulerPriority 作为优先级
		commitRootImpl.bind(null, root, renderPriorityLevel)
	);
	return null;
}
```
在rootFiber.firstEffect上保存了一条需要执行副作用的Fiber节点的单向链表effectList，这些Fiber节点的updateQueue中保存了变化的props。

这些副作用对应的DOM操作在commit阶段执行。

除此之外，一些生命周期钩子（比如componentDidXXX）、hook（比如useEffect）需要在commit阶段执行。

commit阶段的主要工作（即Renderer的工作流程）分为三部分：

- before mutation阶段（执行DOM操作前）

- mutation阶段（执行DOM操作）

- layout阶段（执行DOM操作后）


在before mutation阶段之前和layout阶段之后还有一些额外工作，涉及到比如useEffect的触发、优先级相关的重置、ref的绑定/解绑。

## before mutation之前（重置变量）
commitRootImpl方法中直到第一句if (firstEffect !== null)之前属于before mutation之前。
```js
// 整个commit阶段最重要的是发生在commitRootImpl方法里面的3个 do...while循环，分别处理commit的3个阶段工作
function commitRootImpl(root, renderPriorityLevel) {

    // =======  before mutation  =======
   //  开始本次commit阶段之前，看一下还有没有需要执行的useEffect，如果有则执行它们，
  do {
    // 触发useEffect回调与其他同步任务。由于这些任务可能触发新的渲染，所以这里要一直遍历执行直到没有任务
    // 目的：执行useEffect在上一次更新的销毁函数，和本次更新的useEffect回调函数
    flushPassiveEffects();

    // 直到没有 遗留的回调函数 没有被处理时，跳出循环
    // rootWithPendingPassiveEffects为true，则表示有useEffect回调函数需要执行。
  } while (rootWithPendingPassiveEffects !== null);

  // root指 fiberRootNode
  // root.finishedWork指当前应用的rootFiber
  const finishedWork = root.finishedWork;

  // 凡是变量名带lane的都是优先级相关
  const lanes = root.finishedLanes;
  if (finishedWork === null) {
    return null;
  }
  root.finishedWork = null;
  root.finishedLanes = NoLanes;

  // 重置Scheduler绑定的回调函数
  root.callbackNode = null;
  root.callbackId = NoLanes;

  let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  // 重置优先级相关变量
  markRootFinished(root, remainingLanes);

  // 清除已完成的discrete updates，例如：用户鼠标点击触发的更新。
  // DiscreteUpdates指离散的更新
  if (rootsWithPendingDiscreteUpdates !== null) {
    if (
      !hasDiscreteLanes(remainingLanes) &&
      rootsWithPendingDiscreteUpdates.has(root)
    ) {
      rootsWithPendingDiscreteUpdates.delete(root);
    }
  }

  // 重置一些render阶段使用的 全局变量
  if (root === workInProgressRoot) {
    workInProgressRoot = null;
    workInProgress = null;
    workInProgressRootRenderLanes = NoLanes;
  } else {
  }

  // 将effectList赋值给firstEffect
  // 由于每个fiber的effectList只包含他的子孙节点
  // 所以根节点如果有flags则不会被包含进来
  // 所以这里将有flags的根节点插入到effectList尾部
  // 这样才能保证有effect的fiber都在effectList中
  let firstEffect; // 处理包含flags的fiber节点的链表
  if (finishedWork.flags > PerformedWork) {
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    // 根节点没有flags
    firstEffect = finishedWork.firstEffect;
  }

  // =======  before mutation  =======


  if (firstEffect !== null){
    // 省略...
  }else{
    // 省略...
  }

// 省略...
}
```
可以看到，before mutation之前主要做一些变量赋值，状态重置的工作。

这一长串代码我们只需要关注最后赋值的firstEffect，在commit的三个子阶段都会用到他。


```js
if (firstEffect !== null) {
		let previousLanePriority;
		if (decoupleUpdatePriorityFromScheduler) {
            // 保存之前的优先级，以同步优先级执行，执行完毕后恢复之前优先级
			previousLanePriority = getCurrentUpdateLanePriority();
			setCurrentUpdateLanePriority(SyncLanePriority);
		}

        // 将当前上下文标记为CommitContext，作为commit阶段的标志
		const prevExecutionContext = executionContext;
		executionContext |= CommitContext;
		const prevInteractions = pushInteractions(root);

		// Reset this to null before calling lifecycles
		ReactCurrentOwner.current = null;

		// 处理focus状态
		focusedInstanceHandle = prepareForCommit(root.containerInfo);
		shouldFireAfterActiveInstanceBlur = false;

        //循环： commit before mutation 执行的工作——开始
		nextEffect = firstEffect;
		do {
			if (__DEV__) {
				invokeGuardedCallback(null, commitBeforeMutationEffects, null);
				if (hasCaughtError()) {
					invariant(nextEffect !== null, "Should be working on an effect.");
					const error = clearCaughtError();
					captureCommitPhaseError(nextEffect, error);
					nextEffect = nextEffect.nextEffect;
				}
			} else {
				try {
                    //  before mutation 主要的执行方法
					commitBeforeMutationEffects();
                    // beforeMutation阶段的主函数
				} catch (error) {
					invariant(nextEffect !== null, "Should be working on an effect.");
					captureCommitPhaseError(nextEffect, error);
					nextEffect = nextEffect.nextEffect;
				}
			}
		} while (nextEffect !== null);
        // commit before mutation 执行的工作——结束


		// We no longer need to track the active instance fiber
		focusedInstanceHandle = null;

		if (enableProfilerTimer) {
			// Mark the current commit time to be shared by all Profilers in this
			// batch. This enables them to be grouped later.
			recordCommitTime();
		}

        //循环工作： commit mutation 阶段执行的工作——开始
		// The next phase is the mutation phase, where we mutate the host tree.
		nextEffect = firstEffect;
		do {
			if (__DEV__) {
				invokeGuardedCallback(
					null,
					commitMutationEffects,
					null,
					root,
					renderPriorityLevel
				);
				if (hasCaughtError()) {
					invariant(nextEffect !== null, "Should be working on an effect.");
					const error = clearCaughtError();
					captureCommitPhaseError(nextEffect, error);
					nextEffect = nextEffect.nextEffect;
				}
			} else {
				try {
          //   mutation 主要的执行方法
					commitMutationEffects(root, renderPriorityLevel);
				} catch (error) {
					invariant(nextEffect !== null, "Should be working on an effect.");
					captureCommitPhaseError(nextEffect, error);
					nextEffect = nextEffect.nextEffect;
				}
			}
		} while (nextEffect !== null);
        //循环工作： commit mutation 阶段执行的工作——结束

		if (shouldFireAfterActiveInstanceBlur) {
			afterActiveInstanceBlur();
		}
		resetAfterCommit(root.containerInfo);

		// 将root.current执行 workInProgress fiber树，为什么是在commit mutation阶段完成之后，layout阶段之前执行呢？这是因为在mutation阶段会执行componentWillUnmount这个生命周期，这个钩子中，current还指向之前的fiber树，而在layout阶段，会调用componentDidMount/Update钩子，此时 current已经指向了当前workInProgress fiber树
		root.current = finishedWork;

		
		nextEffect = firstEffect;

      //循环工作： commit layout 阶段执行的工作——开始
		do {
			if (__DEV__) {
				invokeGuardedCallback(null, commitLayoutEffects, null, root, lanes);
				if (hasCaughtError()) {
					invariant(nextEffect !== null, "Should be working on an effect.");
					const error = clearCaughtError();
					captureCommitPhaseError(nextEffect, error);
					nextEffect = nextEffect.nextEffect;
				}
			} else {
				try {
                    //  layout阶段 主要的执行方法
					commitLayoutEffects(root, lanes);
				} catch (error) {
					invariant(nextEffect !== null, "Should be working on an effect.");
					captureCommitPhaseError(nextEffect, error);
					nextEffect = nextEffect.nextEffect;
				}
			}
		} while (nextEffect !== null);
        // 循环工作： commit layout 阶段执行的工作——结束

		nextEffect = null;

		// Tell Scheduler to yield at the end of the frame, so the browser has an
		// opportunity to paint.
		requestPaint();

		if (enableSchedulerTracing) {
			popInteractions(((prevInteractions: any): Set<Interaction>));
		}
		executionContext = prevExecutionContext;

		if (decoupleUpdatePriorityFromScheduler && previousLanePriority != null) {
			// Reset the priority to the previous non-sync value.
			setCurrentUpdateLanePriority(previousLanePriority);
		}
	} else {
		// No effects.
		root.current = finishedWork;
		// Measure these anyway so the flamegraph explicitly shows that there were
		// no effects.
		// TODO: Maybe there's a better way to report this.
		if (enableProfilerTimer) {
			recordCommitTime();
		}
	}

	const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

    // 这里面的逻辑  跟本次useEffect的执行有关
    // 本次更新存在 useEffect的调用
	if (rootDoesHavePassiveEffects) { 
	
		rootDoesHavePassiveEffects = false;
		rootWithPendingPassiveEffects = root;
		pendingPassiveEffectsLanes = lanes;
		pendingPassiveEffectsRenderPriority = renderPriorityLevel;
	} else {
		 // 本次更新不存在 useEffect的调用
		nextEffect = firstEffect;
        // 遍历包含flags的fiber节点的链表
		while (nextEffect !== null) {
            // 将相应的变量置空，方便垃圾回收
			const nextNextEffect = nextEffect.nextEffect;
			nextEffect.nextEffect = null;
			if (nextEffect.flags & Deletion) {
				detachFiberAfterEffects(nextEffect);
			}
			nextEffect = nextNextEffect;
		}
	}

	// Read this again, since an effect might have updated it
	remainingLanes = root.pendingLanes;

	// Check if there's remaining work on this root
	if (remainingLanes !== NoLanes) {
		if (enableSchedulerTracing) {
			if (spawnedWorkDuringRender !== null) {
				const expirationTimes = spawnedWorkDuringRender;
				spawnedWorkDuringRender = null;
				for (let i = 0; i < expirationTimes.length; i++) {
                    // Interactions跟react的性能追踪有关
					scheduleInteractions(
						root,
						expirationTimes[i],
						root.memoizedInteractions
					);
				}
			}
			schedulePendingInteractions(root, remainingLanes);
		}
	} else {
		// If there's no remaining work, we can clear the set of already failed
		// error boundaries.
		legacyErrorBoundariesThatAlreadyFailed = null;
	}

	if (enableSchedulerTracing) {
		if (!rootDidHavePassiveEffects) {
			// If there are no passive effects, then we can complete the pending interactions.
			// Otherwise, we'll wait until after the passive effects are flushed.
			// Wait to do this until after remaining work has been scheduled,
			// so that we don't prematurely signal complete for interactions when there's e.g. hidden work.
			finishPendingInteractions(root, lanes);
		}
	}

	if (remainingLanes === SyncLane) {
		// 判断更新是否是一个无限循环的更新，如果是无限循环的更新会抛出错误
		if (root === rootWithNestedUpdates) {
			nestedUpdateCount++;
		} else {
			nestedUpdateCount = 0;
			rootWithNestedUpdates = root;
		}
	} else {
		nestedUpdateCount = 0;
	}

	onCommitRootDevTools(finishedWork.stateNode, renderPriorityLevel);

	if (__DEV__) {
		onCommitRootTestSelector();
	}

    // 代码执行到这里，已经完成了commit阶段，页面已经更新

    // 由于commit阶段可能产生新的更新，在commit阶段的结尾，会将整个应用的节点重新调度一次
	ensureRootIsScheduled(root, now());

	if (hasUncaughtError) {
		hasUncaughtError = false;
		const error = firstUncaughtError;
		firstUncaughtError = null;
		throw error;
	}

	if ((executionContext & LegacyUnbatchedContext) !== NoContext) {
		if (__DEV__) {
			if (enableDebugTracing) {
				logCommitStopped();
			}
		}

		if (enableSchedulingProfiler) {
			markCommitStopped();
		}

		// This is a legacy edge case. We just committed the initial mount of
		// a ReactDOM.render-ed root inside of batchedUpdates. The commit fired
		// synchronously, but layout updates should be deferred until the end
		// of the batch.
		return null;
	}

	// If layout work was scheduled, flush it now.
    // react会将一些同步的更新，放在一个SyncCallbackQueue的队列中
    // 每次执行flushSyncCallbackQueue，就会执行 这个队列中的同步任务
	flushSyncCallbackQueue();
    //FunctionComponent 在useLayoutEffect里面 重新setState，setState触发的更新是一个同步的更新，就会被flushSyncCallbackQueue这个逻辑中同步的执行。

	// 省略...

	return null;
}
```
三种模式：
- legacy模式: ReactDOM.render(`<App/>`, rootNode)。这是当前React app使用的方式。在这个模式下，所有的更新都会以同步的执行，很多更优先级的功能是无法使用的，
- blocking模式: ReactDOM.createBlockingRoot(rootNode).render(<App />)。
- concurrent模式（并发模式）: ReactDOM.createRoot(rootNode).render(<App />)。未来作为React的默认开发模式，这个模式开启了所有的新功能。出现不同优先级的更新。

## before mutation阶段

Renderer工作的阶段被称为commit阶段。commit阶段可以分为三个子阶段：

- before mutation阶段（执行DOM操作前）

- mutation阶段（执行DOM操作）

- layout阶段（执行DOM操作后）


### commitBeforeMutationEffects
before mutation阶段的整个过程就是遍历effectList并调用commitBeforeMutationEffects函数处理。

整体可以分为三部分：

- 处理DOM节点渲染/删除后的 autoFocus、blur 逻辑。
- 调用getSnapshotBeforeUpdate生命周期钩子。
- 调度useEffect。

```js
function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    const current = nextEffect.alternate;

    // 处理...focus blur相关 不太需要关注（第一件事情）
    if (!shouldFireAfterActiveInstanceBlur && focusedInstanceHandle !== null) {
      // ...
    }else{
       // ... 
    }

    const flags = nextEffect.flags;

    // 在commitBeforeMutationEffectOnFiber方法中 调用getSnapshotBeforeUpdate（第二件事情）
    if ((flags & Snapshot) !== NoEffect) {
      commitBeforeMutationEffectOnFiber(current, nextEffect);
      // commitBeforeMutationEffectOnFiber是commitBeforeMutationLifeCycles的别名
    }

    // 第三件事情：如果当前fiber节点的flags，包含了Passive（Passive是FunctionComponent中useEffect对应flags）
    // 调度useEffect的回调函数
    if ((flags & Passive) !== NoEffect) {
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        // scheduleCallback方法由Scheduler模块提供，用于以某个优先级异步调度一个回调函数。
        // 并没有直接执行flushPassiveEffects，而且将它放到了scheduleCallback的回调？会以一个优先级来异步执行一个回调函数，如果一个FunctionComponent存在useEffect，并且它的回调函数需要触发，那么它的回调会在 before mutation阶段 先被以 NormalSchedulerPriority的优先级调度，而整个commit阶段是同步执行的，所有useEffect的回调的执行是在 commit完成以后，再异步执行的。
        scheduleCallback(NormalSchedulerPriority, () => {
          // 触发useEffect的回调函数
          // 被异步调度的回调函数就是触发useEffect的方法flushPassiveEffects
          flushPassiveEffects();
          return null;
        });
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```
### 调用getSnapshotBeforeUpdate
commitBeforeMutationEffectOnFiber是commitBeforeMutationLifeCycles的别名。在该方法内会调用getSnapshotBeforeUpdate。

从Reactv16开始，componentWillXXX钩子前增加了UNSAFE_前缀。究其原因，是因为Stack Reconciler重构为Fiber Reconciler后，render阶段的任务可能中断/重新开始，对应的组件在render阶段的生命周期钩子（即componentWillXXX）可能触发多次。这种行为和Reactv15不一致，所以标记为UNSAFE_。

为此，React提供了替代的生命周期钩子getSnapshotBeforeUpdate。getSnapshotBeforeUpdate是在commit阶段内的before mutation阶段调用的，此时还没有见到页面的更新，由于commit阶段是同步的，所以不会遇到多次调用的问题。

- commitBeforeMutationLifeCycles(commitBeforeMutationEffectOnFiber)
```js
function commitBeforeMutationLifeCycles(
  current: Fiber | null,
  finishedWork: Fiber,
): void {
    // 判断 fiber节点的tag类型
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block: {
      return;
    }
    case ClassComponent: {
        // ...


        // fiber节点的flags 包含 Snapshot
        // getSnapshotBeforeUpdate生命周期对应的flags
      if (finishedWork.flags & Snapshot) {
        if (current !== null) {
          const prevProps = current.memoizedProps;
          const prevState = current.memoizedState;
          // 通过fiber节点的stateNode取到 对应的 React.Component实例
          const instance = finishedWork.stateNode;
          
          // 调用class组件实例的getSnapshotBeforeUpdate方法
          const snapshot = instance.getSnapshotBeforeUpdate(
            finishedWork.elementType === finishedWork.type
              ? prevProps
              : resolveDefaultProps(finishedWork.type, prevProps),
            prevState,
          );
          // ...
          instance.__reactInternalSnapshotBeforeUpdate = snapshot;
        }
      }
      return;
    }
    case HostRoot: {
      if (supportsMutation) {
        if (finishedWork.flags & Snapshot) {
          const root = finishedWork.stateNode;
          clearContainer(root.containerInfo);
        }
      }
      return;
    }
    case HostComponent:
    case HostText:
    case HostPortal:
    case IncompleteClassComponent:
      // Nothing to do for these component types
      return;
  }
}
```
### 如何异步调度

在`flushPassiveEffects`方法内部会从全局变量`rootWithPendingPassiveEffects`获取`effectList`。

`effectList`中保存了需要执行副作用的`Fiber节点`。其中副作用包括

- 插入`DOM节点`（Placement）
- 更新`DOM节点`（Update）
- 删除`DOM节点`（Deletion）

除此外，当一个`FunctionComponent`含有`useEffect`或`useLayoutEffect`，他对应的`Fiber节点`也会被赋值`flags`。useEffect是Passive。


在`flushPassiveEffects`方法内部会遍历`rootWithPendingPassiveEffects`（即`effectList`）执行`effect`回调函数。

如果在此时直接执行，`rootWithPendingPassiveEffects === null`。

那么`rootWithPendingPassiveEffects`会在何时赋值呢？

在`layout之后`的代码片段中会根据`rootDoesHavePassiveEffects === true?`决定是否赋值`rootWithPendingPassiveEffects`。

```js
const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;
if (rootDoesHavePassiveEffects) {
  rootDoesHavePassiveEffects = false;
  rootWithPendingPassiveEffects = root;
  pendingPassiveEffectsLanes = lanes;
  pendingPassiveEffectsRenderPriority = renderPriorityLevel;
}
```

所以整个`useEffect`异步调用分为三步：

1. `before mutation阶段`在`scheduleCallback`中调度`flushPassiveEffects`
2. `layout阶段`之后将`effectList`赋值给`rootWithPendingPassiveEffects`
3. `scheduleCallback`触发`flushPassiveEffects`，`flushPassiveEffects`内部遍历`rootWithPendingPassiveEffects`

### 为什么需要异步调用

摘录自`React`文档[effect 的执行时机](https://zh-hans.reactjs.org/docs/hooks-reference.html#timing-of-effects)：

与 componentDidMount、componentDidUpdate 不同的是，在浏览器完成布局与绘制之后，传给 useEffect 的函数会延迟调用。这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因此不应在函数中执行阻塞浏览器更新屏幕的操作。

可见，`useEffect`异步执行的原因主要是防止同步执行时阻塞浏览器渲染。

## 总结

在`before mutation阶段`，会遍历`effectList`，依次执行：

1. 处理`DOM节点`渲染/删除后的 `autoFocus`、`blur`逻辑

2. 调用`getSnapshotBeforeUpdate`生命周期钩子

3. 调度`useEffect`

# mutation阶段

mutation阶段也是遍历effectList，执行函数。这里执行的是commitMutationEffects。

```js
nextEffect = firstEffect;
do {
  try {
      commitMutationEffects(root, renderPriorityLevel);
    } catch (error) {
      invariant(nextEffect !== null, 'Should be working on an effect.');
      captureCommitPhaseError(nextEffect, error);
      nextEffect = nextEffect.nextEffect;
    }
} while (nextEffect !== null);
```

## commitMutationEffects

```js
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  // 遍历effectList 链表上的节点
  while (nextEffect !== null) {

    const flags = nextEffect.flags;

    // 根据 ContentReset flags重置文字节点
    if (flags & ContentReset) { // 是否重置文本节点
      commitResetTextContent(nextEffect);
    }

    // 是否有 ref的更新
    if (flags & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }

    // mutation阶段最重要的工作
    // 判断flags是否有以下情况， 根据 flags 分别处理
    const primaryflags =
      flags & (Placement | Update | Deletion | Hydrating);
    switch (primaryflags) {
      // 插入DOM
      case Placement: {
        // 执行完commitPlacement方法后，DOM节点已经插入到页面中
        commitPlacement(nextEffect); // 插入DOM
        // 为当前fiber节点删除flags
        nextEffect.flags &= ~Placement;
        break;
      }
      // 插入DOM 并 更新DOM
      case PlacementAndUpdate: { // 同时存在Placement和Update情况
        // 插入
        commitPlacement(nextEffect);

        nextEffect.flags &= ~Placement;

        // 更新
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // SSR
      case Hydrating: {
        nextEffect.flags &= ~Hydrating;
        break;
      }
      // SSR
      case HydratingAndUpdate: {
        nextEffect.flags &= ~Hydrating;

        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 更新DOM
      case Update: {
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 删除DOM
      // 对应FunctionComponent的fiber节点销毁，会执行useEffect返回的销毁函数
      // classComponent节点销毁，会执行componentWillUnmount生命周期钩子。
      // 如果是HostComponent，会解绑它的ref属性
      case Deletion: {
        commitDeletion(root, nextEffect, renderPriorityLevel);
        break;
      }
    }

    nextEffect = nextEffect.nextEffect;
  }
}


function commitWork(current: Fiber | null, finishedWork: Fiber): void {
  // 是否支持Mutation环境
  if (!supportsMutation) {
    switch (finishedWork.tag) {
      case FunctionComponent:
      case ForwardRef:
      case MemoComponent:
      case SimpleMemoComponent:
      case Block: {
        if (
          enableProfilerTimer &&
          enableProfilerCommitHooks &&
          finishedWork.mode & ProfileMode
        ) {
          try {
            startLayoutEffectTimer();
            commitHookEffectListUnmount(
              HookLayout | HookHasEffect,
              finishedWork,
            );
          } finally {
            recordLayoutEffectDuration(finishedWork);
          }
        } else {
          commitHookEffectListUnmount(HookLayout | HookHasEffect, finishedWork);
        }
        return;
      }
      case Profiler: {
        return;
      }
      case SuspenseComponent: {
        commitSuspenseComponent(finishedWork);
        attachSuspenseRetryListeners(finishedWork);
        return;
      }
      case SuspenseListComponent: {
        attachSuspenseRetryListeners(finishedWork);
        return;
      }
      case HostRoot: {
        if (supportsHydration) {
          const root: FiberRoot = finishedWork.stateNode;
          if (root.hydrate) {
            // We've just hydrated. No need to hydrate again.
            root.hydrate = false;
            commitHydratedContainer(root.containerInfo);
          }
        }
        break;
      }
      case OffscreenComponent:
      case LegacyHiddenComponent: {
        return;
      }
    }

    commitContainer(finishedWork);
    return;
  }

// 判断fiber节点的tag，做不同的处理
  switch (finishedWork.tag) {
    // FunctionComponent相关的类型——start
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent:
    case Block: {
      if (
        enableProfilerTimer &&
        enableProfilerCommitHooks &&
        finishedWork.mode & ProfileMode
      ) {
        try {
          startLayoutEffectTimer();
          // 调用useLayoutEffect的销毁函数
          commitHookEffectListUnmount(HookLayout | HookHasEffect, finishedWork);
        } finally {
          recordLayoutEffectDuration(finishedWork);
        }
      } else {
        commitHookEffectListUnmount(HookLayout | HookHasEffect, finishedWork);
      }
      return;
    }
    // FunctionComponent相关的类型——结束
    case ClassComponent: {
      return;
    }
    // DOM节点对应的fiber节点
    case HostComponent: {
      const instance: Instance = finishedWork.stateNode;
      if (instance != null) {
        // Commit the work prepared earlier.
        const newProps = finishedWork.memoizedProps;
        // For hydration we reuse the update path but we treat the oldProps
        // as the newProps. The updatePayload will contain the real change in
        // this case.
        const oldProps = current !== null ? current.memoizedProps : newProps;
        const type = finishedWork.type;
        // TODO: Type the updateQueue to be specific to host components.
        const updatePayload: null | UpdatePayload = (finishedWork.updateQueue: any);
        finishedWork.updateQueue = null;
        if (updatePayload !== null) {
          commitUpdate(
            instance,
            updatePayload, // 是当前fiber节点的updateQueue属性
            type,
            oldProps,
            newProps,
            finishedWork,
          );
        }
      }
      return;
    }
    case HostText: {
      const textInstance: TextInstance = finishedWork.stateNode;
      const newText: string = finishedWork.memoizedProps;
      // For hydration we reuse the update path but we treat the oldProps
      // as the newProps. The updatePayload will contain the real change in
      // this case.
      const oldText: string =
        current !== null ? current.memoizedProps : newText;
      commitTextUpdate(textInstance, oldText, newText);
      return;
    }
    case HostRoot: {
      if (supportsHydration) {
        const root: FiberRoot = finishedWork.stateNode;
        if (root.hydrate) {
          // We've just hydrated. No need to hydrate again.
          root.hydrate = false;
          commitHydratedContainer(root.containerInfo);
        }
      }
      return;
    }
    case Profiler: {
      return;
    }
    case SuspenseComponent: {
      commitSuspenseComponent(finishedWork);
      attachSuspenseRetryListeners(finishedWork);
      return;
    }
    case SuspenseListComponent: {
      attachSuspenseRetryListeners(finishedWork);
      return;
    }
    case IncompleteClassComponent: {
      return;
    }
    case FundamentalComponent: {
      if (enableFundamentalAPI) {
        const fundamentalInstance = finishedWork.stateNode;
        updateFundamentalComponent(fundamentalInstance);
        return;
      }
      break;
    }
    case ScopeComponent: {
      if (enableScopeAPI) {
        const scopeInstance = finishedWork.stateNode;
        prepareScopeUpdate(scopeInstance, finishedWork);
        return;
      }
      break;
    }
    case OffscreenComponent:
    case LegacyHiddenComponent: {
      const newState: OffscreenState | null = finishedWork.memoizedState;
      const isHidden = newState !== null;
      hideOrUnhideAllChildren(finishedWork, isHidden);
      return;
    }
  }
}

// ReactDOMHostConfig.js
export function commitUpdate(
  domElement: Instance,
  updatePayload: Array<mixed>,
  type: string,
  oldProps: Props,
  newProps: Props,
  internalInstanceHandle: Object,
): void {

  updateFiberProps(domElement, newProps);
  //  更新DOM的属性
  updateProperties(domElement, updatePayload, type, oldProps, newProps);
}
```

`commitMutationEffects`会遍历`effectList`，对每个`Fiber节点`执行如下三个操作：

1. 根据`ContentReset flags`重置文字节点
2. 更新`ref`
3. 根据`flags`分别处理，其中`flags`包括(`Placement` | `Update` | `Deletion` | `Hydrating`)

我们关注步骤三中的`Placement` | `Update` | `Deletion`。`Hydrating`作为服务端渲染相关，我们先不关注。

- commitPlacement方法的逻辑
```js
function commitPlacement(finishedWork: Fiber): void {
  // 如果当前环境不支持Mutation，直接返回（ReactDOM环境支持Mutation）
  if (!supportsMutation) {
    return;
  }

  // Recursively insert all host nodes into the parent.
  // 根据fiber节点 找到离它最近的HostComponent 节点
  const parentFiber = getHostParentFiber(finishedWork);

  // Note: these two variables *must* always be updated together.
  let parent;
  let isContainer;
  const parentStateNode = parentFiber.stateNode;
  switch (parentFiber.tag) {
    case HostComponent:
      parent = parentStateNode;
      isContainer = false;
      break;
    case HostRoot:
      parent = parentStateNode.containerInfo;
      isContainer = true;
      break;
    case HostPortal:
      parent = parentStateNode.containerInfo;
      isContainer = true;
      break;
    case FundamentalComponent:
      if (enableFundamentalAPI) {
        parent = parentStateNode.instance;
        isContainer = false;
      }
    // eslint-disable-next-line-no-fallthrough
    default:
      // 省略...
  }
  if (parentFiber.flags & ContentReset) {
    // Reset the text content of the parent before doing any insertions
    resetTextContent(parent);
    // Clear ContentReset from the effect tag
    parentFiber.flags &= ~ContentReset;
  }

// 找到当前fiber节点 对应 Host类型的兄弟节点
  const before = getHostSibling(finishedWork);
  // We only have the top Fiber that was inserted but we need to recurse down its
  // children to find all the terminal nodes.
  // if else里面两个方法执行的逻辑类似
  if (isContainer) {
    insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
  } else {
    insertOrAppendPlacementNode(finishedWork, before, parent);
  }
}

function insertOrAppendPlacementNodeIntoContainer(
  node: Fiber,
  before: ?Instance,
  parent: Container,
): void {
  const {tag} = node;
  const isHost = tag === HostComponent || tag === HostText;
  if (isHost || (enableFundamentalAPI && tag === FundamentalComponent)) {
    const stateNode = isHost ? node.stateNode : node.stateNode.instance;
    // 如果当前fiber节点的 兄弟节点存在，就会执行insertInContainerBefore
    if (before) {
      insertInContainerBefore(parent, stateNode, before);
      // insertInContainerBefore方法最终调用的就是 insertBefore
    } else {
      // before不存在 执行
      appendChildToContainer(parent, stateNode);
    }
  } else if (tag === HostPortal) {
    // If the insertion itself is a portal, then we don't want to traverse
    // down its children. Instead, we'll get insertions from each child in
    // the portal directly.
  } else {
    const child = node.child;
    if (child !== null) {
      insertOrAppendPlacementNodeIntoContainer(child, before, parent);
      let sibling = child.sibling;
      while (sibling !== null) {
        insertOrAppendPlacementNodeIntoContainer(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}

function insertOrAppendPlacementNode(
  node: Fiber,
  before: ?Instance,
  parent: Instance,
): void {
  const {tag} = node;
  const isHost = tag === HostComponent || tag === HostText;
  if (isHost || (enableFundamentalAPI && tag === FundamentalComponent)) {
    const stateNode = isHost ? node.stateNode : node.stateNode.instance;
    if (before) {
      insertBefore(parent, stateNode, before);
    } else {
      appendChild(parent, stateNode);
    }
  } else if (tag === HostPortal) {
    // If the insertion itself is a portal, then we don't want to traverse
    // down its children. Instead, we'll get insertions from each child in
    // the portal directly.
  } else {
    const child = node.child;
    if (child !== null) {
      insertOrAppendPlacementNode(child, before, parent);
      let sibling = child.sibling;
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}

// 一直递归向上查找，一直找到为止
function getHostParentFiber(fiber: Fiber): Fiber {
  let parent = fiber.return;
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }
    parent = parent.return;
  }
}

// 这个方法复杂，双层循环
function getHostSibling(fiber: Fiber): ?Instance {
  let node: Fiber = fiber;
  siblings: while (true) {
    // If we didn't find anything, let's try the next sibling.
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        // If we pop out of the root or hit the parent the fiber we are the
        // last sibling.
        return null;
      }
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
    while (
      node.tag !== HostComponent &&
      node.tag !== HostText &&
      node.tag !== DehydratedFragment
    ) {
      // If it is not host node and, we might have a host node inside it.
      // Try to search down until we find one.
      if (node.flags & Placement) {
        // If we don't have a child, try the siblings instead.
        continue siblings;
      }
      // If we don't have a child, try the siblings instead.
      // We also skip portals because they are not part of this host tree.
      if (node.child === null || node.tag === HostPortal) {
        continue siblings;
      } else {
        node.child.return = node;
        node = node.child;
      }
    }
    // Check if this host node is stable or about to be placed.
    if (!(node.flags & Placement)) {
      // Found it!
      return node.stateNode;
    }
  }
}
```
- insertInContainerBefore、appendChild、appendChildToContainer和insertBefore方法逻辑
```js
// ReactDOMHostConfig.js
export function insertInContainerBefore(
  container: Container,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance | SuspenseInstance,
): void {
  if (container.nodeType === COMMENT_NODE) {
    (container.parentNode: any).insertBefore(child, beforeChild);
  } else {
    container.insertBefore(child, beforeChild);
  }
}

export function appendChild(
  parentInstance: Instance,
  child: Instance | TextInstance,
): void {
  // parent节点对应 DOM 的appendChild方法
  parentInstance.appendChild(child);
}

export function appendChildToContainer(
  container: Container,
  child: Instance | TextInstance,
): void {
  let parentNode;
  if (container.nodeType === COMMENT_NODE) {
    parentNode = (container.parentNode: any);
    parentNode.insertBefore(child, container);
  } else {
    parentNode = container;
    parentNode.appendChild(child);
  }
  const reactRootContainer = container._reactRootContainer;
  if (
    (reactRootContainer === null || reactRootContainer === undefined) &&
    parentNode.onclick === null
  ) {
    // TODO: This cast may not be sound for SVG, MathML or custom elements.
    trapClickOnNonInteractiveElement(((parentNode: any): HTMLElement));
  }
}

export function insertBefore(
  parentInstance: Instance,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance | SuspenseInstance,
): void {
  parentInstance.insertBefore(child, beforeChild);
}
```

## Placement effect

当`Fiber节点`含有`Placement flags`，意味着该`Fiber节点`对应的`DOM节点`需要插入到页面中。调用的方法为`commitPlacement`。

该方法所做的工作分为三步：

1. 获取父级`DOM节点`。其中`finishedWork`为传入的`Fiber节点`。

```js
const parentFiber = getHostParentFiber(finishedWork);
// 父级DOM节点
const parentStateNode = parentFiber.stateNode;
```

2. 获取`Fiber节点`的`DOM`兄弟节点

```js
const before = getHostSibling(finishedWork);
```

3. 根据`DOM`兄弟节点是否存在决定调用`parentNode.insertBefore`或`parentNode.appendChild`执行`DOM`插入操作。

```js
// parentStateNode是否是rootFiber
if (isContainer) {
  insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
} else {
  insertOrAppendPlacementNode(finishedWork, before, parent);
}
```

值得注意的是，`getHostSibling`（获取兄弟`DOM节点`）的执行很耗时，当在同一个父`Fiber节点`下依次执行多个插入操作，`getHostSibling`算法的复杂度为指数级。

这是由于`Fiber节点`不只包括`HostComponent`，所以`Fiber树`和渲染的`DOM树`节点并不是一一对应的。要从`Fiber节点`找到`DOM节点`很可能跨层级遍历。在DOM树中，li的父级是div，在fiber树中，li的fiber节点对应的 fiber 父节点是Item。Item的父级fiber节点才是div。

考虑如下例子：

```jsx

function Item() {
  return <li><li>;
}

function App() {
  return (
    <div>
      <Item/>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));
```

对应的`Fiber树`和`DOM树`结构为：

```js
// Fiber树
          child      child      child       child
rootFiber -----> App -----> div -----> Item -----> li

// DOM树
#root ---> div ---> li
```

当在`div`的子节点`Item`前插入一个新节点`p`，即`App`变为：

```jsx
function App() {
  return (
    <div>
      <p></p>
      <Item/>
    </div>
  )
}
```

对应的`Fiber树`和`DOM树`结构为：

```js
// Fiber树
          child      child      child
rootFiber -----> App -----> div -----> p 
                                       | sibling       child
                                       | -------> Item -----> li 
// DOM树
#root ---> div ---> p
             |
               ---> li
```

此时`DOM节点` `p`的兄弟节点为`li`，而`Fiber节点` `p`对应的兄弟`DOM节点`为：

```js
fiberP.sibling.child
```
即`fiber p`的`兄弟fiber` `Item`的`子fiber` `li`

## Update effect

当`Fiber节点`含有`Update flags`，意味着该`Fiber节点`需要更新。调用的方法为`commitWork`，他会根据`Fiber.tag`分别处理。

> 你可以在[这里](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L1441)看到`commitWork`源码

这里我们主要关注`FunctionComponent`和`HostComponent`。

### FunctionComponent mutation

当`fiber.tag`为`FunctionComponent`，会调用`commitHookEffectListUnmount`。该方法会遍历`effectList`，执行所有`useLayoutEffect hook`的销毁函数。

> 你可以在[这里](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L314)看到`commitHookEffectListUnmount`源码

所谓“销毁函数”，见如下例子：

```js
useLayoutEffect(() => {
  // ...一些副作用逻辑

  return () => {
    // ...这就是销毁函数
  }
})
```

你不需要很了解`useLayoutEffect`，我们会在下一节详细介绍。你只需要知道在`mutation阶段`会执行`useLayoutEffect`的销毁函数。

### HostComponent mutation

当`fiber.tag`为`HostComponent`，会调用`commitUpdate`。

> 你可以在[这里](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-dom/src/client/ReactDOMHostConfig.js#L423)看到`commitUpdate`源码

最终会在[`updateDOMProperties`](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-dom/src/client/ReactDOMComponent.js#L378)中将[`render阶段 completeWork`](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L229)中为`Fiber节点`赋值的`updateQueue`对应的内容渲染在页面上。

```js
for (let i = 0; i < updatePayload.length; i += 2) {
  const propKey = updatePayload[i];
  const propValue = updatePayload[i + 1];

  // 处理 style
  if (propKey === STYLE) {
    setValueForStyles(domElement, propValue);
  // 处理 DANGEROUSLY_SET_INNER_HTML
  } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    setInnerHTML(domElement, propValue);
  // 处理 children
  } else if (propKey === CHILDREN) {
    setTextContent(domElement, propValue);
  } else {
  // 处理剩余 props
    setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
  }
}
```

## Deletion effect

当`Fiber节点`含有`Deletion flags`，意味着该`Fiber节点`对应的`DOM节点`需要从页面中删除。调用的方法为`commitDeletion`。

> 你可以在[这里](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L1421)看到`commitDeletion`源码

该方法会执行如下操作：

1. 递归调用`Fiber节点`及其子孙`Fiber节点`中`fiber.tag`为`ClassComponent`的[`componentWillUnmount`](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L920)生命周期钩子，从页面移除`Fiber节点`对应`DOM节点`
2. 解绑`ref`
3. 调度`useEffect`的销毁函数

## 总结

从这节我们学到，`mutation阶段`会遍历`effectList`，依次执行`commitMutationEffects`。该方法的主要工作为“根据`flags`调用不同的处理函数处理`Fiber`。

# layout阶段

该阶段之所以称为`layout`，因为该阶段的代码都是在`DOM`渲染完成（`mutation阶段`完成）后执行的。

该阶段触发的生命周期钩子和`hook`可以直接访问到已经改变后的`DOM`，即该阶段是可以参与`DOM layout`的阶段。

## 概览

与前两个阶段类似，`layout阶段`也是遍历`effectList`，执行函数。

具体执行的函数是`commitLayoutEffects`。

```js
root.current = finishedWork;

nextEffect = firstEffect;
do {
  try {
    commitLayoutEffects(root, lanes);
  } catch (error) {
    invariant(nextEffect !== null, "Should be working on an effect.");
    captureCommitPhaseError(nextEffect, error);
    nextEffect = nextEffect.nextEffect;
  }
} while (nextEffect !== null);

nextEffect = null;
```

## commitLayoutEffects

代码如下：

> 你可以在[这里](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2302)看到`commitLayoutEffects`源码

```js
function commitLayoutEffects(root: FiberRoot, committedLanes: Lanes) {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;

    // 调用生命周期钩子和hook
    if (effectTag & (Update | Callback)) {
      const current = nextEffect.alternate;
      // 最重要的是调用这个方法
      commitLayoutEffectOnFiber(root, current, nextEffect, committedLanes);
    }

    // 处理赋值ref
    if (effectTag & Ref) {
      commitAttachRef(nextEffect);
    }

    nextEffect = nextEffect.nextEffect;
  }
}
```

`commitLayoutEffects`一共做了两件事：

1. commitLayoutEffectOnFiber（调用`生命周期钩子`和`hook`相关操作）

2. commitAttachRef（赋值 ref）

## commitLayoutEffectOnFiber

`commitLayoutEffectOnFiber`方法会根据`fiber.tag`对不同类型的节点分别处理。

`commitLayoutEffectOnFiber`源码（`commitLayoutEffectOnFiber`为别名，方法原名为`commitLifeCycles`）

componentDidMount和componentDidUpdate是在layout阶段同步执行的。

```js
function commitLifeCycles(
  finishedRoot: FiberRoot,
  current: Fiber | null,
  finishedWork: Fiber,
  committedLanes: Lanes,
): void {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block: {
      // At this point layout effects have already been destroyed (during mutation phase).
      // This is done to prevent sibling component effects from interfering with each other,
      // e.g. a destroy function in one component should never override a ref set
      // by a create function in another component during the same commit.
      if (
        enableProfilerTimer &&
        enableProfilerCommitHooks &&
        finishedWork.mode & ProfileMode
      ) {
        try {
          startLayoutEffectTimer();
          // HookLayout是useLayoutEffect对应的flags
          commitHookEffectListMount(HookLayout | HookHasEffect, finishedWork);
        } finally {
          recordLayoutEffectDuration(finishedWork);
        }
      } else {
        // HookLayout是useLayoutEffect对应的flags
        commitHookEffectListMount(HookLayout | HookHasEffect, finishedWork);
      }

      schedulePassiveEffects(finishedWork);
      return;
    }
    case ClassComponent: {
      // 获取 ClassComponent的实例
      const instance = finishedWork.stateNode;
      if (finishedWork.flags & Update) {
        // current为空
        if (current === null) {
          if (
            enableProfilerTimer &&
            enableProfilerCommitHooks &&
            finishedWork.mode & ProfileMode
          ) {
            try {
              startLayoutEffectTimer();
              // 执行ClassComponent实例的钩子componentDidMount
              instance.componentDidMount();
            } finally {
              recordLayoutEffectDuration(finishedWork);
            }
          } else {
            // 执行ClassComponent实例的钩子componentDidMount
            instance.componentDidMount();
          }
        } else {
          // current存在的情况
          const prevProps =
            finishedWork.elementType === finishedWork.type
              ? current.memoizedProps
              : resolveDefaultProps(finishedWork.type, current.memoizedProps);
          const prevState = current.memoizedState;
          
          if (
            enableProfilerTimer &&
            enableProfilerCommitHooks &&
            finishedWork.mode & ProfileMode
          ) {
            try {
              startLayoutEffectTimer();
              // 执行ClassComponent实例的钩子componentDidUpdate
              instance.componentDidUpdate(
                prevProps,
                prevState,
                instance.__reactInternalSnapshotBeforeUpdate,
              );
            } finally {
              recordLayoutEffectDuration(finishedWork);
            }
          } else {
            // 执行ClassComponent实例的钩子componentDidUpdate
            instance.componentDidUpdate(
              prevProps,
              prevState,
              instance.__reactInternalSnapshotBeforeUpdate,
            );
          }
        }
      }

      // TODO: I think this is now always non-null by the time it reaches the
      // commit phase. Consider removing the type check.
      const updateQueue: UpdateQueue<
        *,
      > | null = (finishedWork.updateQueue: any);
      if (updateQueue !== null) {
        // ClassComponent
        commitUpdateQueue(finishedWork, updateQueue, instance);
      }
      return;
    }
    case HostRoot: {
      // TODO: I think this is now always non-null by the time it reaches the
      // commit phase. Consider removing the type check.
      const updateQueue: UpdateQueue<
        *,
      > | null = (finishedWork.updateQueue: any);
      if (updateQueue !== null) {
        let instance = null;
        if (finishedWork.child !== null) {
          switch (finishedWork.child.tag) {
            case HostComponent:
              instance = getPublicInstance(finishedWork.child.stateNode);
              break;
            case ClassComponent:
              instance = finishedWork.child.stateNode;
              break;
          }
        }
        // HostRoot
        commitUpdateQueue(finishedWork, updateQueue, instance);
      }
      return;
    }
    case HostComponent: {
      const instance: Instance = finishedWork.stateNode;

      // Renderers may schedule work to be done after host components are mounted
      // (eg DOM renderer may schedule auto-focus for inputs and form controls).
      // These effects should only be committed when components are first mounted,
      // aka when there is no current/alternate.
      if (current === null && finishedWork.flags & Update) {
        const type = finishedWork.type;
        const props = finishedWork.memoizedProps;
        commitMount(instance, type, props, finishedWork);
      }

      return;
    }
    case HostText: {
      // We have no life-cycles associated with text.
      return;
    }
    case HostPortal: {
      // We have no life-cycles associated with portals.
      return;
    }
    case Profiler: {
      if (enableProfilerTimer) {
        const {onCommit, onRender} = finishedWork.memoizedProps;
        const {effectDuration} = finishedWork.stateNode;

        const commitTime = getCommitTime();

        if (typeof onRender === 'function') {
          if (enableSchedulerTracing) {
            onRender(
              finishedWork.memoizedProps.id,
              current === null ? 'mount' : 'update',
              finishedWork.actualDuration,
              finishedWork.treeBaseDuration,
              finishedWork.actualStartTime,
              commitTime,
              finishedRoot.memoizedInteractions,
            );
          } else {
            onRender(
              finishedWork.memoizedProps.id,
              current === null ? 'mount' : 'update',
              finishedWork.actualDuration,
              finishedWork.treeBaseDuration,
              finishedWork.actualStartTime,
              commitTime,
            );
          }
        }

        if (enableProfilerCommitHooks) {
          if (typeof onCommit === 'function') {
            if (enableSchedulerTracing) {
              onCommit(
                finishedWork.memoizedProps.id,
                current === null ? 'mount' : 'update',
                effectDuration,
                commitTime,
                finishedRoot.memoizedInteractions,
              );
            } else {
              onCommit(
                finishedWork.memoizedProps.id,
                current === null ? 'mount' : 'update',
                effectDuration,
                commitTime,
              );
            }
          }

          // Schedule a passive effect for this Profiler to call onPostCommit hooks.
          // This effect should be scheduled even if there is no onPostCommit callback for this Profiler,
          // because the effect is also where times bubble to parent Profilers.
          enqueuePendingPassiveProfilerEffect(finishedWork);

          // Propagate layout effect durations to the next nearest Profiler ancestor.
          // Do not reset these values until the next render so DevTools has a chance to read them first.
          let parentFiber = finishedWork.return;
          while (parentFiber !== null) {
            if (parentFiber.tag === Profiler) {
              const parentStateNode = parentFiber.stateNode;
              parentStateNode.effectDuration += effectDuration;
              break;
            }
            parentFiber = parentFiber.return;
          }
        }
      }
      return;
    }
    case SuspenseComponent: {
      commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
      return;
    }
    case SuspenseListComponent:
    case IncompleteClassComponent:
    case FundamentalComponent:
    case ScopeComponent:
    case OffscreenComponent:
    case LegacyHiddenComponent:
      return;
  }
  
}
```
- commitHookEffectListMount
遍历所有useLayoutEffect，依次执行它的回调函数。在mutation阶段会执行useLayoutEffect的销毁函数，在layout阶段会依次遍历useLayoutEffect的create()方法，也就是它的回调函数。所有useLayoutEffect在commmit阶段，先执行所有的销毁函数，再依次执行所有的回调函数，这整个步骤都是同步执行的。
```js
// tag是HookLayout，是useLayoutEffect对应的flags
function commitHookEffectListMount(tag: number, finishedWork: Fiber) {
  const updateQueue: FunctionComponentUpdateQueue | null = (finishedWork.updateQueue: any);
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      if ((effect.tag & tag) === tag) {
        // Mount
        const create = effect.create;
        effect.destroy = create();
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
```
- schedulePassiveEffects
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
        enqueuePendingPassiveHookEffectUnmount(finishedWork, effect);
        enqueuePendingPassiveHookEffectMount(finishedWork, effect);
      }
      effect = next;
    } while (effect !== firstEffect);
  }
}
```
- commitUpdateQueue
在commitLifeCycles方法中，finishedWork.tag为ClassComponent和HostRoot都会执行commitUpdateQueue。对应ClassComponent，调用this.setState的第二个参数，也就是传入给this.setState回调函数时，this.setState回调函数会在layout阶段执行。对于HostRoot，我们执行`ReactDOM.render(<App />, document.getElementById('root'), function)`的第三个参数，回调函数function。当我们首屏渲染时，页面完成了渲染，第三个参数回调函数会在layout阶段执行。

```js
// ReactUpdateQueue.old.js
export function commitUpdateQueue<State>(
  finishedWork: Fiber,
  finishedQueue: UpdateQueue<State>,
  instance: any,
): void {
  // Commit the effects
  const effects = finishedQueue.effects;
  finishedQueue.effects = null;
  if (effects !== null) {
    // 遍历effects，并执行effects下的callback
    for (let i = 0; i < effects.length; i++) {
      const effect = effects[i];
      const callback = effect.callback;
      if (callback !== null) {
        effect.callback = null;
        callCallback(callback, instance);
      }
    }
  }
}
```

- 对于`ClassComponent`，他会通过`current === null?`区分是`mount`还是`update`，调用[`componentDidMount`](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L538)或[`componentDidUpdate`](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L592)。

触发`状态更新`的`this.setState`如果赋值了第二个参数`回调函数`，也会在此时调用。

```js
this.setState({ xxx: 1 }, () => {
  console.log("i am update~");
});
```

- 对于`FunctionComponent`及相关类型，他会调用`useLayoutEffect hook`的`回调函数`，调度`useEffect`的`销毁`与`回调`函数

> `相关类型`指特殊处理后的`FunctionComponent`，比如`ForwardRef`、`React.memo`包裹的`FunctionComponent`

```js
  switch (finishedWork.tag) {
    // 以下都是FunctionComponent及相关类型
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block: {
      // 执行useLayoutEffect的回调函数
      commitHookEffectListMount(HookLayout | HookHasEffect, finishedWork);
      // 调度useEffect的销毁函数与回调函数
      schedulePassiveEffects(finishedWork);
      return;
    }
```

> 你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L465-L491)看到这段代码

在上一节介绍[Update effect](./mutation.html#update-effect)时介绍过，`mutation阶段`会执行`useLayoutEffect hook`的`销毁函数`。

结合这里我们可以发现，`useLayoutEffect hook`从上一次更新的`销毁函数`调用到本次更新的`回调函数`调用是同步执行的。

而`useEffect`则需要先调度，在`Layout阶段`完成后再异步执行。

这就是`useLayoutEffect`与`useEffect`的区别。

- 对于`HostRoot`，即`rootFiber`，如果赋值了第三个参数`回调函数`，也会在此时调用。

```js
ReactDOM.render(<App />, document.querySelector("#root"), function() {
  console.log("i am mount~");
});
```

## commitAttachRef

`commitLayoutEffects`会做的第二件事是`commitAttachRef`。

> 你可以在[这里](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L823)看到`commitAttachRef`源码

```js
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    const instance = finishedWork.stateNode;

    // 获取DOM实例
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;
      default:
        instanceToUse = instance;
    }

    if (typeof ref === "function") {
      // 如果ref是函数形式，调用回调函数
      ref(instanceToUse);
    } else {
      // 如果ref是ref实例形式，赋值ref.current
      ref.current = instanceToUse;
    }
  }
}
```

代码逻辑很简单：获取`DOM`实例，更新`ref`。

## current Fiber树切换

至此，整个`layout阶段`就结束了。

在结束本节的学习前，我们关注下这行代码：

```js
root.current = finishedWork;
```

> 你可以在[这里](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2022)看到这行代码

在[双缓存机制一节](../process/doubleBuffer.html#什么是-双缓存)我们介绍过，`workInProgress Fiber树`在`commit阶段`完成渲染后会变为`current Fiber树`。这行代码的作用就是切换`fiberRootNode`指向的`current Fiber树`。

那么这行代码为什么在这里呢？（在`mutation阶段`结束后，`layout阶段`开始前。）

我们知道`componentWillUnmount`会在`mutation阶段`执行。此时`current Fiber树`还指向前一次更新的`Fiber树`，在生命周期钩子内获取的`DOM`还是更新前的。

`componentDidMount`和`componentDidUpdate`会在`layout阶段`执行。此时`current Fiber树`已经指向更新后的`Fiber树`，在生命周期钩子内获取的`DOM`就是更新后的。

## 总结

从这节我们学到，`layout阶段`会遍历`effectList`，依次执行`commitLayoutEffects`。该方法的主要工作为“根据`effectTag`调用不同的处理函数处理`Fiber`并更新`ref`。

# useEffect 和 useLayoutEffect的区别
useLayoutEffect依赖某个state变化而触发时，是同步执行的，在useLayoutEffect中setsState是同步的，需要添加条件判断特定state，执行特定的逻辑
**（useLayoutEffect可以拿到最新的state）**

useEffect 和 useLayoutEffect的区别, useEffect的回调是异步更新的

<img src="/images/front_end/react/useeffect001.png">

<!-- ![useEffect 和 useLayoutEffect的区别](./images/useeffect001.png) -->
