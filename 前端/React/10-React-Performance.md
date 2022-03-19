---
title: React性能优化笔记
date: 2021-12-26 17:12:16
permalink: /前端/React/React性能优化
categories:
  - 前端
  - React
tags:
  - 前端
  - React
---
# React性能优化笔记

## 避免组件的重复渲染

哪些方法会触发 React 重新渲染：**setState**、**父组件重新渲染  或者 props改变**

1. 保证组件纯粹性PureComponent。即控制组件的副作用，如果组件有副作用则无法安全地缓存渲染结果。PureComponent会进行浅比较来判断组件是否应该重新渲染，对于传入的基本类型props，只要值相同，浅比较就会认为相同，对于传入的引用类型props，浅比较只会认为传入的props是不是同一个引用，如果不是，哪怕这两个对象中的内容完全一样，也会被认为是不同的props。
2. 通过shouldComponentUpdate生命周期函数来比对 state 和 props, 确定是否要重新渲染。

```javascript
// 第一种优化: React.PureComponen
class AnotherComponent extends React.PureComponent {
  render() {
    return <div>{this.props.someOtherProp}</div>   
  }
}

// 第二种优化: shouldComponentUpdate
class AnotherComponent extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps;
  }
  render() {
    return <div>{this.props.someOtherProp}</div>   
  }
}
```

## 函数组件可以使用React.memo进行优化

```javascript
// 1、避免重新渲染
useMemo(()=>{
    return <Card data={data}>
}, [data])
```

```javascript
// 2、使用React.Memo来缓存组件
// 父组件的每次状态更新，都会导致子组件重新渲染，即使传入子组件的状态没有变化，为了
// 减少重复渲染，我们可以使用React.memo来缓存组件，这样只有当传入组件的状态值发生变化时才会重新渲染。如果传入相同的值，则返回缓存的组件。
export default React.memo((props) => {
  return (
    <div>{props.value}</div>  
  )
});
  
 // 或者用useMemo 来缓存组件
const MyCard = useMemo(()=>{
		return (<Card data={data} />)
})
```

```javascript
// 3、使用useMemo缓存大量的计算
// 只有 `props.item` 改变时someProp的值才会被重新计算
function Component(props) {
  const someProp = useMemo(() => heavyCalculation(props.item), [props.item]);
  return <AnotherComponent someProp={someProp} /> 
}
```

## 避免使用箭头函数形式的事件处理

使用箭头函数，其实每次渲染时都会创建一个新的事件处理函数，这会导致MyComponent始终会被重新渲染

```javascript
// 避免以下做法
<MyComponent onClick={ e => onClick(e.value)}/>

// 推荐
class HelloComponent extends Component { 
  handleClick = () => {     /*...*/   }; 
  render() {   
    <MyComponent onClick={this.handleClick}/>;   
  }   
} 
```

## 函数组件，使用useCallback包装合成事件

避免每一次渲染都需要重新创建handleClick，进而使得MyComponent重新渲染

```javascript
const handleClick = useCallback(() => {
  /*...*/
}, [xxx]);

return <MyComponent onClick={handleClick}/>;

// useCallback依赖于很多状态时，[a, b, c, d, e...]
function useRefProps<T>(props: T) {
  const ref = useRef <T> props;
  // 每次渲染更新props
  useEffect(() => {
    ref.current = props;
  });
}

function MyComp(props) {
  // 每次渲染更新props，交由useRefProps处理和保存
  const propsRef = useRefProps(props);

  // 现在handleClick是始终不变的
  const handleClick = useCallback(() => {
    const { a, b, c, d, e } = propsRef.current;
    // do something
  }, []);
}
```

## 不要滥用 Context

Context 是可以穿透React.memo或者shouldComponentUpdate的比对的，也就是说，一旦 Context 的 Value 变动，所有依赖该 Context 的组件会全部强制更新。
Context 一般是全局换肤功能、多语功能才会用到。

## 简化 state 和 props

- 不是所有状态都应该放在组件的 state 中，例如缓存数据。如果需要组件响应它的变动,，或者需要渲染到视图中的数据才应该放到 state 中。这样可以避免不必要的数据变动导致组件重新渲染。
- 如果一个组件的 props 太复杂，意味着这个组件已经违背了‘单一职责’，首先应该尝试对组件进行拆解。

## 避免使用内联对象

使用内联对象时，react会在每次渲染时重新创建对此对象的引用，这会导致接收此对象的组件将其视为不同的对象。因此，该组件对于prop的浅层比较始终返回false，导致组件一直重新渲染。
使用的内联样式的间接引用，就会使组件重新渲染，可能会导致性能问题。为了解决这个问题，我们可以保证该对象只初始化一次，指向相同引用。另外一种情况是传递一个对象，同样会在渲染时创建不同的引用，也有可能导致性能问题，我们可以利用ES6扩展运算符将传递的对象解构。这样组件接收到的便是基本类型的props，组件通过浅层比较发现接受的prop没有变化，则不会重新渲染。示例如下：

```js
// 不推荐
function Component(props) {
  const aProp = { someProp: 'someValue' }
  return <AnotherComponent style={{ margin: 0 }} aProp={aProp} />  
}

// 推荐，styles定义在函数组件之外
const styles = { margin: 0 };
function Component(props) {
  const aProp = { someProp: 'someValue' }
  return <AnotherComponent style={styles} {...aProp} />  
}
```

## 组件的懒加载

延迟加载不是立即需要的组件，React加载的组件越少，加载组件的速度就越快。

```js
// 延迟加载不是立即需要的组件
const MUITooltip = React.lazy(() => import('@material-ui/core/Tooltip'));
function Tooltip({ children, title }) {
  return (
    <React.Suspense fallback={children}>
      <MUITooltip title={title}>
        {children}
      </MUITooltip>
    </React.Suspense>
  );
}

function Component(props) {
  return (
    <Tooltip title={props.title}>
      <AnotherComponent />
    </Tooltip>
  )
}


<Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
    <LazyComponent1 />
</Suspense>
```

## 使用React.Fragment避免添加额外的DOM

可以使React.Fragment来避免创建不必要的元素

## 调整CSS可见度而不是强制组件加载和卸载

在项目中，可能想要卸载不可见的组件，并在它变得可见时将其重新加载。如果加载和卸载的组件“很重”，则此操作可能非常消耗性能并可能导致延迟。在这些情况下，最好通过CSS隐藏它，同时将内容保存到DOM。

```js
// 避免对大型的组件频繁对加载和卸载
function Component(props) {
  const [view, setView] = useState('view1');
  return view === 'view1' ? <SomeComponent /> : <AnotherComponent />  
}

// 使用该方式提升性能和速度
const visibleStyles = { opacity: 1 };
const hiddenStyles = { opacity: 0 };
function Component(props) {
  const [view, setView] = useState('view1');
  return (
    <React.Fragment>
      <SomeComponent style={view === 'view1' ? visibleStyles : hiddenStyles}>
      <AnotherComponent style={view !== 'view1' ? visibleStyles : hiddenStyles}>
    </React.Fragment>
  )
}
```

## 学会使用缓存

- 在class声明组件中，我们可以直接把数据绑定给this上，来作为数据缓存，但是我们要确定这个数据的属性名称在当前组件上是唯一的。

```js
class Demo extends React.Component{
    componentDidMount(){
        const { a } = this.props
        /* 数据直接保存在text上 */
        this.customText = a;
    }
}
```

## 函数组件不能往问this，可以用useRef来缓存数据

```js
function Demo ({ a }){
    const customText = useRef(0);
    useEffect(()=>{
        customText.current = a;
    }, [])
}
```

## 海量数据优化-时间分片

### 时间分片

时间分片的概念，就是一次性渲染大量数据，初始化的时候会出现卡顿等现象。对于大量的数据，一次性渲染，容易造成卡顿，卡死的情况。
为了解决一次性加载大量数据的问题。我们引出了时间分片的概念，就是用setTimeout把任务分割，分成若干次来渲染。假如一共有十万个数据，我们可以每次渲染100个， 分次1000渲染。

```javascript
class Index extends React.Component<any,any>{
    state={
       list: []
    }
    handerClick=()=>{
       this.sliceTime(new Array(100000).fill(0), 0)
    }
    sliceTime=(list,times)=>{
        if(times === 1000){
         	return;
        }
        setTimeout(() => {
          /* 每次截取 100 个 */
            const newList = list.slice( times , (times + 1) * 100 ) 
            this.setState({
                list: this.state.list.concat(newList)
            })
            this.sliceTime( list ,times + 1 )
        }, 0)
    }
    render(){
        const { list } = this.state
        return <div>
            <button onClick={ this.handerClick } >点击</button>
            {
                list.map((item,index)=><li className="list"  key={index} >
                    { item  + '' + index } Item
                </li>)
            }
        </div>
    }
}

```

setTimeout 可以用 window.requestAnimationFrame() 代替，会有更好的渲染效果。我们demo使用列表做的，实际对于列表来说，最佳方案是虚拟列表。而时间分片，更适合热力图，地图点位比较多的情况。

#### 参考

[React性能优化的8种方式](https://juejin.cn/post/6844903924302888973)
