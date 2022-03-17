---
title: ReactHook笔记
date: 2022-01-13 21:57:42
permalink: /前端/React/ReactHook笔记
categories:
  - 前端
  - React
tags:
  -
---
```javascript
// 高阶组件
const withWindowSize = Component => { 
// 产生一个高阶组件 WrappedComponent，只包含监听窗口大小的逻辑 
    class WrappedComponent extends React.PureComponent {}
    return WrappedComponent;
};
```

Hooks 带来的最大好处：简化了逻辑复用，替代了高阶组件的负担吧

useState：让函数组件具有维持状态的能力，类组件中的 state 只能有一个，而函数组件中用 useState 则可以很容易地创建多个 state

1、state 中永远不要保存可以通过计算得到的值。比如说：

（1）从 props 传递过来的值。有时候 props 传递过来的值无法直接使用，而是要通过一定的计算后再在 UI 上展示，比如说排序。那么我们要做的就是每次用的时候，都重新排序一下，或者利用某些 cache 机制，而不是将结果直接放到 state 里。

（2）从 URL 中读到的值。比如有时需要读取 URL 中的参数，把它作为组件的一部分状态。那么我们可以在每次需要用的时候从 URL 中读取，而不是读出来直接放到 state 里。

（3）从 cookie、localStorage 中读取的值。通常来说，也是每次要用的时候直接去读取，而不是读出来后放到 state 里。

2、useEffect：执行副作用，什么是副作用呢？通常来说，副作用是指一段和当前执行结果无关的代码。

useEffect 接收的返回值是一个回调函数，这个回调函数不只是会在组件销毁时执行，而且是每次 Effect 重新执行之前都会执行，用于清理上一次 Effect 的执行结果。当组件销毁时，运行最后一次Effect返回的函数。每个 Effect 必然在渲染之后执行，因此不会阻塞渲染，提高了性能

useEffect 是每次组件 render 完后判断依赖并执行。

useEffect 还有两个特殊的用法：没有依赖项，以及依赖项作为空数组。

2（1）没有依赖项，则每次 render 后都会重新执行

2（2）空数组作为依赖项，则只在首次执行时触发，对应到 Class 组件就是 componentDidMount

2（3）useEffect 还允许你返回一个函数，用于在组件销毁的时候做一些清理的操作。比如移除事件的监听。这个机制就几乎等价于class类组件中的 componentWillUnmount。

2(4)总结一下，useEffect 让我们能够在下面四种时机去执行一个回调函数产生副作用：

2.4.1每次 render 后执行：不提供第二个依赖项参数。比如useEffect(() => {})。

2.4.2仅第一次 render 后执行：提供一个空数组作为依赖项。比如useEffect(() => {}, [])。

2.4.3第一次以及依赖项发生变化后执行：提供依赖项数组。比如useEffect(() => {}, [deps])。

2.4.4组件 卸载 后执行：返回一个回调函数。比如useEffect() => { return () => {} }, [])。

2(5)那么在定义依赖项时，我们需要注意以下三点：

2.5.1依赖项中定义的变量一定是会在回调函数中用到的，否则声明依赖项其实是没有意义的。

2.5.2依赖项一般是一个常量数组，而不是一个变量。因为一般在创建 callback 的时候，你其实非常清楚其中要用到哪些依赖项了。(依赖项数组好不添加或者删除元素，一开始就定义好需要监听哪些常量)

2.5.3React 会使用浅比较来对比依赖项是否发生了变化，所以要特别注意数组或者对象类型。如果你是每次创建一个新对象，即使和之前的值是等价的，也会被认为是依赖项发生了变化。这是一个刚开始使用 Hooks 时很容易导致 Bug 的地方。例如下面的代码：

```javascript
function Sample() {
  // 这里在每次组件执行时创建了一个新数组
  const todos = [{ text: 'Learn hooks.'}];
  useEffect(() => {
    console.log('Todos changed.');
  }, [todos]);
}
```

代码的原意可能是在 todos 变化的时候去产生一些副作用，但是这里的 todos 变量是在函数内创建的，实际上每次都产生了一个新数组。所以在作为依赖项的时候进行引用的比较，实际上被认为是发生了变化的。

`deps` 数组在判断元素是否发生改变时同样也使用了 `Object.is` 进行比较。因此一个隐患便是，当 `deps` 中某一元素为非原始类型时（例如函数、对象等）， **每次渲染都会发生改变** ，从而失去了 `deps` 本身的意义（条件式地触发 Effect）

有的时候，不经意间把 Effect 写成一个 async 函数

```
useEffect(async () => {
  const response = await fetch('...');
  // ...
}, []);
```

这样可以吗？ **强烈建议你不要这样做** 。`useEffect` 约定 Effect 函数要么没有返回值，要么返回一个 Cleanup 函数。而这里 async 函数会隐式地返回一个 Promise，直接违反了这一约定，会造成不可预测的结果。

2(6)Hooks 的使用规则包括以下两个：只能在函数组件的顶级作用域使用；只能在函数组件或者其他 Hooks 中使用。

所谓顶层作用域，就是 Hooks 不能在循环、条件判断或者嵌套函数内执行，而必须是在顶层。同时 Hooks 在组件的多次渲染之间，必须按顺序被执行。(第一，所有 Hook 必须要被执行到。第二，必须按顺序执行。)

useCallback：缓存回调函数在 React 函数组件中，每一次 UI 的变化，都是通过重新执行整个函数来完成的，这和传统的 Class 组件有很大区别：函数组件中并没有一个直接的方式在多次渲染之间维持一个状态。

每次组件状态发生变化的时候，函数组件实际上都会重新执行一遍。在每次执行的时候，实际上都会创建一个新的事件处理函数 handleIncrement。这个事件处理函数中呢，包含了 count 这个变量的闭包，以确保每次能够得到正确的结果

```javascript

function Counter() {
  const [count, setCount] = useState(0);
  const handleIncrement = () => setCount(count + 1);
  // ...
  return <button onClick={handleIncrement}>+</button>
}
```

即使 count 没有发生变化，但是函数组件因为其它状态发生变化而重新渲染时，这种写法也会每次创建一个新的函数。创建一个新的事件处理函数，虽然不影响结果的正确性，但其实是没必要的。因为这样做不仅增加了系统的开销，更重要的是：每次创建新函数的方式会让接收事件处理函数的组件，需要重新渲染。

我们需要做到的是：只有当 count 发生变化时，我们才需要重新定一个回调函数。而这正是 useCallback 这个 Hook 的作用。

```javascript
const handleIncrement = useCallback(() => setCount(count + 1), [count])
```

这样，只有 count 发生变化的时候，才需要重新创建一个回调函数，这样就保证了组件不会创建重复的回调函数。而接收这个回调函数作为属性的组件，也不会频繁地需要重新渲染

useMemo：缓存计算的结果，避免重复计算

useCallback 的功能其实是可以用 useMemo 来实现的：

```javascript
const myEventHandler = useMemo(() => {
   // 返回一个函数作为缓存结果
   return () => {
     // 在这里进行事件处理
   }
 }, [dep1, dep2]);
```

useRef：在多次渲染之间共享数据

我们可以把 useRef 看作是在函数组件之外创建的一个容器空间。在这个容器上，我们可以通过唯一的 current 属设置一个值，从而在函数组件的多次渲染之间共享这个值。

使用 useRef 保存的数据一般是和 UI 的渲染无关的，因此当 ref 的值发生变化时，是不会触发组件的重新渲染的，这也是 useRef 区别于 useState 的地方。（我们可以将定时器的timer放到Ref.current中，需求清除定时器时，直接从current取timer）

useRef 还有一个重要的功能，就是保存某个 DOM 节点的引用。

```javascript
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // current 属性指向了真实的 input 这个 DOM 节点，从而可以调用 focus 方法
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

useContext：定义全局状态

Context 看上去就是一个全局的数据，为什么要设计这样一个复杂的机制，而不是直接用一个全局的变量去保存数据呢？答案其实很简单，就是为了能够进行数据的绑定。当这个 Context 的数据发生变化时，使用这个数据的组件就能够自动刷新。(还可以在函数组件中监听Context的value值的变化)

Context 相当于提供了一个定义 React 世界中全局变量的机制，而全局变量则意味着两点：

会让调试变得困难，因为你很难跟踪某个 Context 的变化究竟是如何产生的。

让组件的复用变得困难，因为一个组件如果使用了某个 Context，它就必须确保被用到的地方一定有这个 Context 的 Provider 在其父组件的路径上。

所以在 React 的开发中，除了像 Theme(主题)、Language (多语)等一目了然的需要全局设置的变量外，我们很少会使用 Context 来做太多数据的共享。需要再三强调的是，Context 更多的是提供了一个强大的机制，让 React 应用具备定义全局的响应式数据的能力。
