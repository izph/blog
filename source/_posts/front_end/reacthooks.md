---
title: React Hooks 总结
date: 2021-07-14 12:02:11
categories:
  - 前端
tags:
  - React
toc: true # 是否启用内容索引
comments: true
copyright: false
---
## 为什么要设计Hooks，Hooks有什么优势？

- 解决了 Class 组件存在的一些代码冗余、难以逻辑复用的问题，替代了高阶组件的负担，能够让代码更加容易理解和维护。
- 让函数组件拥有类组件的一些特性，内部状态（useState）和类似 class 组件的生命周期（useEffect）。

## 函数组件和类组件本质的区别是？

- Class组件，底层只需要实例化一次，实例中保存了组件的 state 状态。对于每一次更新只需要调用 render 方法以及对应的生命周期就可以了。
- Function组件，每一次更新都是一次新的函数执行，一次函数组件的更新，里面的变量会重新声明。React 对函数组件的调用，是采用直接执行函数的方式，而不是通过new的方式。

## 使用Hooks需要注意的地方

- 只在 function 组件和自定义 hooks 中使用 hooks。
- 不能将 hooks 放在循环、条件语句或者嵌套方法内执行，原因是 react 是根据 hooks 出现顺序来记录对应状态的。

## useState

### useState基本使用

useState的参数可以是任意的值，也可以是一个函数，函数的返回值作为其初始值。

```js
const [count, setCount] = useState(initialState)

const [state, setState] = useState(() => {
    // 初始化initialState
    return initialState;
})
```

useState 返回值为一个数组，数组的第一个参数为我们需要使用的 state，第二个参数为更新state的函数

```js
setCount(0)

// 需要获取上一个state的值
setCount(prevCount => prevCount + 1)  

// state为对象时
setState(prevState => ({
    ...prevState,
    attr: 'value'
}))

// state为数组时
setArr((arr) => {
    arr.push(5)
    return [...arr]
})
```

### useState为什么返回的是一个数组而不是一个对象？

简单来说，数组解构是有顺序的，开发者可自定义名称，对象解构是根据对象的key解构。

### useState的实现原理

- 第一次渲染时候，根据 useState 顺序，逐个声明 state 并且将其放入全局 Array 中。每次声明 state，都要将 count 增加 1。
- 更新 state，触发再次渲染的时候，count 被重置为 0。按照 useState 的声明顺序，依次拿出最新的 state 的值，视图更新。

```js
const stateArr = []; // 多个状态，保存在一个全局容器 Array 中
let count = 0;

function useState(initialState) {
  const curCount = count;
  stateArr[curCount] = stateArr[curCount] || initialState; // 检查是否渲染过

  function dispatch(newState) {
    stateArr[curCount] = newState;
    render();  // 调用函数组件的render方法
  }

  ++count; // update: count
  return [stateArr[curCount], dispatch];
}
```

## useEffect

```js
useEffect(effect, deps);
```

- 第一个参数为 effect 副作用函数，副作用函数返回值是一个回调函数returnFunction，这个回调函数不只是会在组件销毁时执行，而且是每次 Effect 重新执行之前都会先执行returnFunction，用于清理上一次 effect 的执行结果。
- 每次组件 render 完成后，会根据deps里的依赖，是否要执行 effect
- 第二个参数 deps 依赖的不同情况
  - 没有依赖项，则每次 render 后都会重新执行，如果存在returnFunction则先执行returnFunction，再触发 effect（componentDidUpdate）
  - 空数组作为依赖项，则只在第一次 render 后执行，对应到 Class 组件就是 componentDidMount
  - returnFunction 用于在组件销毁的时候做一些清理的操作，比如移除事件的监听、定时器的清除（componentWillUnmount）
- 依赖项中定义的变量一般是会在回调函数中用到的，否则声明依赖项其实是没有意义的。
- React 会使用浅比较来对比依赖项是否发生了变化，所以要特别注意数组或者对象类型。如果你是每次创建一个新对象，即使和之前的值是等价的，也会被认为是依赖项发生了变化。（deps为非原始类型时，每次渲染都会发生改变）
- 不要把 effect 写成一个 async 函数，useEffect 中约定 Effect 函数要么没有返回值，要么返回一个函数， async 函数会隐式地返回一个 Promise，直接违反了这一约定，会造成不可预测的结果。

### useEffect的实现原理

在 useEffect 的第二个参数中，我们可以指定一个数组，如果下次渲染时，数组中的元素没变，那么就不会触发这个副作用

```javascript
// 利用 Array + Count 的思路，不包括销毁副作用功能的 useEffect 的实现
const allDeps = [];
let effectCount = 0;

function useEffect(callback, deps) {
  if (!allDeps[effectCount]) {
    // 初次渲染：赋值 + 调用回调函数
    allDeps[effectCount] = deps;
    ++effectCount;
    callback();
    return;
  }

  const currEffectCount = effectCount;
  const rawDeps = allDeps[currEffectCount];
  // 检测依赖项是否发生变化，发生变化需要重新render
  const isChanged = rawDeps.some(
    (dep, index) => dep !== deps[index]
  );
  if (isChanged) {
    callback();
  }
  ++effectCount;
}

function render() {
  ReactDOM.render(<App />, document.getElementById("root"));
  effectCount = 0; // 注意将 effectCount 重置为0
}
```

## useLayoutEffect

```js
useLayoutEffect(effect, deps);
```

useLayoutEffect 与 useEffect 使用方法一样，只是执行回调函数的时机不同。useLayoutEffect在浏览器执行绘制之前执行（会阻碍浏览器 paint，慎用），只有当我们需要进行DOM的操作时才使用该函数。

```js
useLayoutEffect(() => {
    console.log('useLayoutEffect————2')
    return () => {
        console.log('组件卸载了：useLayoutEffect————1')
    }
}, [deps])
useEffect(() => {
    console.log('useEffect————4')
    return () => {
        console.log('组件卸载了：useEffect————3')
    }
}, [deps])
// 监听的状态发生改变时： useLayoutEffect返回的函数（1） ——> useLayoutEffect（2） ——> useEffect返回的函数（3） ——> useEffect（4）
```

## useMemo

- 第一个参数为一个回调函数，该函数返回一个缓存的值
- 第一个参数为依赖项，依赖的值发生变化时，回调函数才会重新计算缓存数据
- 这样避免在每次重新渲染时都进行复杂的数据计算

```js
function Counter({ countA,  countB}) {
  const sum = useMemo(() => {
    // ... 只有当countA 或 countB变化时才重新计算count
    return countA + countB;
  }, [countA, countB]);
  
  return (
    <div>{sum}</div>
  )
}
```

### useMemo的实现原理

```js
function useMemo(fn, deps){
   return useCallback(fn(), deps)
}
```

## momo

上个例子中，只要父组件render方法执行，Counter函数依旧会触发重新渲染，要让函数不执行，在最外层加上memo

```js
const Counter = memo(({ countA,  countB}) => {
  const sum = useMemo(() => {
    // ... 只有当countA 或 countB变化时才重新计算count
    return countA + countB;
  }, [countA, countB]);
  
  return (
    <div>{sum}</div>
  )
})
```

## useCallback

- useCallback 的用法和 useMemo 类似，只有依赖项发生变化的时候，才需要重新创建一个回调函数，这样就保证了组件不会创建重复的回调函数。
- 接收这个回调函数作为属性的组件，也不会频繁地需要重新渲染。
- `useCallback(fn, deps) 等同于 useMemo(() => fn, deps)`

```js
// 这样，
function Counter() {
  const [count, setCount] = useState(0);
  const handleIncrement = useCallback(() => setCount(count + 1), [count]);
  // ...
  return <button onClick={handleIncrement}>+</button>
}
```

### useCallback实现原理

```js
let memoizedState = null
function useCallback(callback, deps) {
  const nextDeps = (deps !== undefined ) && (deps !== null) ? deps : [callback]
  const prevState = memoizedState;
  if (prevState !== null) {
    const prevDeps = prevState[1]
    if (areHookdepsEqual(nextDeps, prevDeps)) {
      return prevState[0]
    }
  }
  memoizedState = [callback, nextDeps]
  return callback
}
```

## useRef

- 组件的引用：返回一个可变的 ref 对象，该对象下面有一个 current 属性指向被引用对象的实例，当做 ref 正常使用时，和 createRef 效果一样。
- useRef 返回的 ref 对象在组件的整个生命周期内保持不变，useRef 每次都会返回相同的引用，createRef 每次渲染都会重新创建 ref

```js
import { React, useRef, createRef} from 'react'

const App = () => {
  const inputElement = createRef()
  const flieElement = useRef();

  if (!inputElement.current) {
    console.log('inputElement') // 函数重新执行时，每一次都打印
  }

  if (!flieElement.current) {
    console.log('flieElement') // 只打印第一次
  }

  // flieElement.current.click() 上传文件
  // inputElement.current.focus() 聚焦
  return (
    <>
      <input type='text' ref={inputElement} />
      <input type='flie' ref={flieElement} />
    </>
  )
}
```

- useRef 可以拿到最新的值， current 指向初始化为传入的参数，可以存放任何变量

```js
const refVal = useRef(value);
// refVal.current => value

const [count, setCount] = useState(value)
const newCount = useRef()
new.current = count
```

## useImperativeHandle

- useImperativeHandle 一般和 forwardRef 一起使用的，减少暴露给父组件的属性
- forwardRef的作用是：引用父组件的 ref 实例，成为子组件的一个参数，可以引用父组件的 ref 绑定到子组件自身的节点上。它有两个参数，第一个是父组件传递的 props，第二个就是 ref 的引用

```js
forwardRef((props, ref) => {
  // 父组件传来的 ref
  return (
   <input ref={ref}></input>
  )
})
```

useImperativeHandle 有三个参数：

- 第一个参数，接收一个通过 forwardRef 引用父组件的 ref 实例。
- 第二个参数一个回调函数，返回一个对象，对象里面存储需要暴露给父组件的属性或方法。
- 第三个参数为一个可选参数，该参数是一个依赖项数组deps。

```js
function Example(props, ref) {
    const inputRef = useRef()
    useImperativeHandle(ref, () => ({
        // 父组件可以通过this.xxx.current.focus的方式使用子组件传递出去的focus方法
        focus: () => {
            inputRef.current.focus()
        }
    }))
    return <input ref={inputRef} />
}

export default forwardRef(Example)
```

```js
// 父组件
class App extends Component {
  constructor(props){
      super(props)
      this.inputRef = createRef()
  }
  
  render() {
    return (
        <>
          <Example ref={this.inputRef}/>
          <button onClick={() => {this.inputRef.current.focus()}}>Click</button>
        </>
    )
  }

```

## useReducer

- useReducer是useState 的一种替代方案，它接收三个参数，第一个参数为一个 reducer 函数，第二个参数是reducer的初始值，第三个参数为可选参数，值为一个函数，可以用来惰性提供初始状态。
- reducer 函数接受两个参数一个是 state 另一个是 action ，用法原理和 redux 中的 reducer

```js
const [state, dispatch] = useReducer(reducer, initialArg, init)
```

```js
function init(initialCount) { 
    return {count: initialCount}; 
} 

function reducer(state, action) { 
    switch (action.type) { 
        case 'increment': 
            return {count: state.count + 1}; 
        case 'decrement': 
            return {count: state.count - 1}; 
        case 'reset': 
            return init(action.payload); 
        default: 
            throw new Error(); 
    } 
} 

function Counter({initialCount}) { 
    const [state, dispatch] = useReducer(reducer, initialCount, init); 
    return ( 
     <> 
        Count: {state.count} 
        <button 
            onClick={() => dispatch({type: 'reset', payload: initialCount})}
        > 
          Reset
        </button> 
        <button onClick={() => dispatch({type: 'increment'})}>+</button> 
        <button onClick={() => dispatch({type: 'decrement'})}>-</button> 
     </> 
	); 
} 

function render () { 
    ReactDOM.render(<Counter initialCount={0} />, document.getElementById('root')); 
}
```

## useContext

- 定义全局状态，当这个 Context 的数据发生变化时，使用这个数据的组件就能够自动刷新
- React 的开发中，我们很少会使用 Context 来做太多数据的共享，Context 更多的是提供了一个强大的机制，让 React 应用具备定义全局的响应式数据的能力。主要是用来实现 Theme(主题)、Language (多语)等功能

```jsx
const globalContext = React.createContext()

function App(){
  return (
    <globalContext.Provider value={'light'}>
        <Count />
    </globalContext.Provider>
  )
}

function Count(props) {
  const context = useContext(globalContext)
  return (
    <div>
      {context} // light
    </div>
  )
}
```

## 参考

- [React Hooks 使用总结](https://juejin.cn/post/6850037283535880205)
- [useEffect 完整指南](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/)
- [React Hooks 原理](https://github.com/brickspert/blog/issues/26)
