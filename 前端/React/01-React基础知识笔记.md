---
title: React基础知识笔记
date: 2021-07-06 17:12:16
permalink: /前端/React/React基础知识
categories:
  - 前端
  - React
tags:
  - 前端
  - React
---
## React基础

条件渲染、JSX里写表达式、状态提升、把jsx放到数组中

## 1、虚拟DOM（VDOM）

本质上是一个对象，不是字符串

## 2、ReactDOM.render

渲染虚拟DOM到页面，ReactDOM来自react-dom（用于支持react操作DOM）
ReactDOM.render(VDOM, document.getElementById('root'))

## 3、虚拟DOM创建方式

1. JSX（小写html标签，大写组件，可写表达式）
2. React.createElement('标签', 属性, 标签里面的内容)

## 4、React三大属性

### state

- 在react的合成事件中，是异步执行的。多次执行setState，会合并。
- 在原生事件、setTimeout，Promise.then等事件中，setState是同步的。
- 状态不可直接更改
  - this.state.conut = this.state.conut + 1，状态(state)不可直接更改，是错误的写法
  - this.setState((state) => { return { count: state.count + 1 } });（依赖于原状态）

#### setState更新状态的2种写法

1. setState(stateObject, [callback])————对象式的setState

- stateObject为状态改变对象(该对象可以体现出状态的更改)；
- callback是可选的回调函数, 它在状态更新完毕、界面也更新后(render调用后)才被调用，setState引起react后续动作是异步更新的；

2. setState(stateFunction, [callback])————函数式的setState

- stateFunction为返回stateObject对象的函数；
- stateFunction可以接收到state和props；
- callback是可选的回调函数, 它在状态更新、界面也更新后(render调用后)才被调用；

3. 总结：对象式的setState是函数式的setState的简写方式(语法糖)

- 如果新状态不依赖于原状态 ===> 使用对象方式
- 如果新状态依赖于原状态 ===> 使用函数方式
- 如果需要在setState()执行后获取最新的状态数据，要在第二个callback函数中读取

### props

#### constructor方法中super，传递的参数props是否有必要写？

在类中写了constructor方法，就必须使用super()，这样组件才有自己的this，在组件的全局中都可以使用this关键字，否则如果只是constructor而不执行super()那么之后的this都是错的。

#### super中的参数必须写参数props吗？

在constructor中使用this.props的时候，super需要加入props。

#### 如果constructor中不通过super来接收props，在其他生命周期中能直接使用this.props吗？

可以的，react在除了constructor之外的生命周期已经传入了this.props了，完全不受super(props)的影响。

#### 对标签属性进行类型、必要性的限制(propTypes 来自prop-types )

PropTypes可以检验props

```javascript
import propTypes from 'prop-types';
//  ...
Person.propTypes = {
	name:PropTypes.string.isRequired,  //限制name必传，且为字符串
	sex:PropTypes.string,  //限制sex为字符串
	age:PropTypes.number, //限制age为数值
	getData:PropTypes.func, //限制getData为函数
}
// 指定默认标签属性值
Person.defaultProps = {
	sex:'男', //sex默认值为男
	age:18  //age默认值为18
}
// 另外写法：static 声明静态成员变量，只能通过Person类直接调用
在Person类中直接用 static propTypes = {...} and static defaultProps = {...}
```

### ref

#### 字符串ref

- 获取ref：const { input1 } = this.refs;
- ``<input ref="input1" type="text"/>``

#### 回调函数ref

- 获取ref：const { input2 } = this;
- ``<input ref={ c => { this.input2 = c }} type="text"/>``

#### React.createRef创建ref

- React通过ref，获取组件对应的DOM元素
- 创建，myRef = React.createRef()，使用this.myRef.current.value
- ``<input ref={this.myRef} type="text" />``

## 5、事件处理

- 更好的兼容性：React使用的是自定义(合成)事件, 而不是使用的原生DOM事件
- 高效：React中的事件是通过事件委托方式处理的(委托给组件最外层的元素)，React并不是将click事件绑定到了div的真实DOM上，而是在document处监听了所有的事件，17版本后就是在根组件APP容器上监听了所有事件。
- 事件绑定：在constructor中使用bind(this)、箭头函数、行内的箭头函数(不推荐)

## 6、受控组件与非受控组件

- 受控组件：组件的展示完全由传入的属性决定。比如说，如果一个输入框中的值完全由传入的 value 属性决定，而不是由用户输入决定，那么就是受控组件，写法是：
  ``< input value={value} onChange={handleChange} />``
  这也是为什么只给 < input/> 传了一个 value 值但是没有传 onChange 事件，那么键盘怎么输入都没有反应。
- 非受控组件：表单组件可以有自己的内部状态，而且它的展示值是不受控的。比如 input 在非受控状态下的写法是：
  ``< input onChange={handleChange}/>``
  也就是说，父组件不会把 value 直接传递给 input 组件。在日常开发中，大部分的表单元素其实都是受控组件，我们会通过外部的状态完全控制当前组件的行为。

## 7、高阶函数

### 高阶函数

参数的回调函数或者返回值是一个函数

```javascript
// 表单提交例子
handleSubmit=(event)=>{
    event.preventDefault();
    let {username, password}  = this.state;
}
saveFormData = (dataType) =>{
	// 返回一个回调函数
	return (event)=>{
		this.setState({[dataType]:event.target.value});
	}
}
render(){
  return (
    <form onSubmit={this.handleSubmit}>
       用户名:<input onChange={this.saveFormData('username')} type="text" name="username"/>
       密码: <input onChange={this.saveFormData('password')} type="password" name="password" />
       <button>登录</button>
    </form>
  )
}

// 不用函数柯理化
handleSubmit = (event)=>{
	event.preventDefault(); //阻止表单提交
	const {username, password} = this.state
}
// 保存表单数据到状态中
saveFormData = (dataType, event)=>{
	this.setState({[dataType]:event.target.value})
}
// onChangeFun = (event)=>{
// 	this.saveFormData('username', event);
// }
render(){
	return(
		<form onSubmit={this.handleSubmit}>
			用户名：<input onChange={event => this.saveFormData('username', event) } type="text" name="username"/>
			密码：<input onChange={event => this.saveFormData('password', event) } type="password" name="password"/>
			<button>登录</button>
		</form>
	)
}
```

### 函数作为子组件

children 是 React 组件的一个特殊内置属性，``<Comp>xxx</Comp>`` 里的 xxx 部分会作为 children 传递给 Comp 组件，如果 xxx 是函数，那么 Comp 里主动调用它去得到结果。

```js
class MyComponent extends React.Component{
		render(){
    		<div>
        		{this.props.children("yoyo")}
        </div>
    }
}

// 使用
<MyComponent>
    {(name) => (<div>{ name }</div>)}
</MyComponent>
```

## 8、类组件的生命周期

[React生命周期](02-ReactLifeCycle.md)

## 9、key的作用

1. key是新、旧虚拟DOM对象的标识，diff算法比较中发挥着重要作用
2. diff算法比较规则如下：

- 旧虚拟DOM中找到了与新虚拟DOM相同的key：
  - 若虚拟DOM中内容没变, 直接使用之前的真实DOM
  - 若虚拟DOM中内容变了, 则生成新的真实DOM，随后替换掉页面中之前的真实DOM
- 旧虚拟DOM中未找到与新虚拟DOM相同的key
  - 根据数据创建新的真实DOM，随后渲染到到页面
- 用index作为key可能会引发的问题：
  若逆序添加元素，相同的key，diff对比内容发生变化，需要更新所有的虚拟DOM，低效率。

## 10、组件通信

- 父 -> 子通信：props
- 子 -> 父通信：父组件将自己的某个方法传递给子组件，通过props拿到方法后修改（状态提升）
- 跨组件通信：Redux、mobx、pubsub、Context

### PubSubJS的基本使用

#### 什么是 pubsub?

一个利用JavaScript进行发布/订阅的库

#### 发布

```javascript
import Pubsub from 'pubsub-js';
export const pubsubID = 'd806a360-21aa-406e-9e5f-7f375087514f';  // pubsub token
Pubsub.publish(StationStatisticsID, data);
// 或
PubSub.publishSync(StationStatisticsID, data);
```

#### 订阅

```javascript
import Pubsub from 'pubsub-js';
import {pubsubID} from 'xxx';
componentDidMount() {
	// 订阅
	pubsub = Pubsub.subscribe(pubsubID, (msg, data) => {
		console.log(msg); // 这里将会输出对应设置的 pubsubID
		console.log(data); // 这里将会输出对应设置的参数
	})
}
componentWillUnmount() {
	// 取消指定的订阅
	Pubsub.unsubscribe(pubsub);
	// 取消全部订阅
	PubSub.clearAllSubscriptions();
}
```

## 11、HOC(高阶组件)

高阶组件：接受组件作为参数，对已有组件的一个封装，返回新的组件。新的组件会有它的应用逻辑，产生新的状态，将新的状态传给 参数组件，以便让该 参数组件使用。实现一些通用的逻辑，被不同的组件所使用，它本身并不存在任何UI的展现

```javascript
// 高阶组件
const withWindowSize = Component => { 
// 产生一个高阶组件 WrappedComponent，只包含监听窗口大小的逻辑 
    class WrappedComponent extends React.PureComponent {}
    return WrappedComponent;
};
```

```javascript
const NewComponent = higherOrderComponent(YourComponent)

// 比如，我们想要我们的组件通过自动注入一些信息。
// withCopyright.js 定义一个高阶组件
import React, { Component, Fragment } from 'react'
const withCopyright = (WrappedComponent) => {
  return class NewComponent extends Component {
    render() {
      return (
        <Fragment>
          <WrappedComponent />
          <div>© XXXXXXX信息 </div>
        </Fragment>
      )
    }
  }
}
export default withCopyright;

// 使用方式
import withCopyright from './withCopyright'

class App extends Component {
  render () {
    return (
  		<div>
        <h1>Awesome React</h1>
        <p>React.js是一个构建用户界面的库</p>
      </div>
  	)
  }
}
const CopyrightApp = withCopyright(App)
// 这样只要我们有需要用到XXXX信息的组件，都可以直接使用withCopyright这个高阶组件包裹即可。
```

## 12、React.lazy

懒加载原理就是Webpack 利用es6动态 import()函数，当Webpack解析到该语法时，它会自动地开始进行代码分割(Code Splitting)，分割成一个文件，当使用到这个文件的时候会这段代码才会被异步加载。

### 使用React.lazy实现懒加载

```javascript
//使用React.lazy导入OtherComponent组件
 import React from 'react';
 // import 是作为一个函数动态运行的，这个 import() 函数会返回一个 Promise
 // import() 这个语句完全是由 Webpack 进行处理的
 // Webpack 会将以OtherComponent模块为起点的所有依赖模块，单独打成一个包。并且，Webpack // 还会生成代码，用于按需加载这个模块。
const OtherComponent = React.lazy(() => import('./OtherComponent'));
// 但是这样页面会报错。这个报错提示我们，在React使用了lazy之后，会存在一个加载中的空档期，React不知道在这个空档
// 期中该显示什么内容，所以需要我们指定。接下来就要使用到Suspense

// 在 App 渲染完成后，包含 OtherComponent 的模块还没有被加载完成，可以使用加载指示器为此组件做优雅降级。
// 使用 Suspense 组件来解决
<Suspense fallback={<div style={{backgroundColor:'gray',color:'orange'}}>Loading...</div>}>
  { this.state.visible ? <OtherComponent /> : null }
</Suspense>
// 我们指定了空档期使用Loading展示在界面上面，等OtherComponent组件异步加载完毕，
// 把OtherComponent组件的内容替换掉Loading上
```

### react-lodable

使用 react-lodable，实现组件的异步加载

1. 定义一个加载器组件，在使用的地方依赖于这个加载器组件而不是原组件；
2. 在加载器组件的执行过程中，使用 import 去动态加载真实的实现代码；
3. 处理加载过程，和加载出错的场景，确保用户体验。
   react-loadable，正是这样一个开源的 npm 模块，专门用于 React 组件的按需加载。在实际的项目开发中，我们一般都会直接使用 react-loadable 来完成按需加载，而不用自己去实现。

```js
import Loadable from "react-loadable";

// 创建一个显示加载状态的组件
function Loading({ error }) {
  return error ? 'Failed' : 'Loading';
}
// 创建加载器组件
const HelloLazyLoad = Loadable({
  loader: () => import("./RealHelloLazyLoad"),
  loading: Loading,
});
```

react-lodable 本身是通过高阶组件来实现的，这个高阶组件实现了模块加载、loading 状态以及错误处理的功能。你只要通过它提供的简单 API，就可以很容易实现组件的动态加载。

在代码中，我们可以看到 Loadable 这个高阶组件主要就是两个 API。
loader：用于传入一个加载器回调，在组件渲染到页面时被执行。在这个回调函数中，我们只需要直接使用 import 语句去加载需要的模块就可以了。
loading：表示用于显示加载状态的组件。在模块加载完成之前，加载器就会渲染这个组件。如果模块加载失败，那么 react-loadable 会将 errors 属性传递给 Loading 组件，方便你根据错误状态来显示不同的信息给用户。

## 13、ReactRouter

[React-Router](04-React-Router.md)

## 14、create-react-app脚手架配置代理

### 在package.json中追加如下配置

"proxy":"http://localhost:8888"

1. 优点：配置简单，前端请求资源时可以不加任何前缀。
2. 缺点：不能配置多个代理。
3. 工作方式：上述方式配置代理，当请求了3000不存在的资源时，那么该请求会转发给5000(优先匹配前端资源)

### 创建代理配置文件setupProxy

1. 优点：可以配置多个代理，可以灵活的控制请求是否走代理。
2. 缺点：配置繁琐，前端请求资源时必须加前缀。

```javascript
// 在src下创建配置文件：src/setupProxy.js
const proxy = require('http-proxy-middleware')
module.exports = function(app) {
  app.use(
    proxy('/api1', {  //api1是需要转发的请求(所有带有/api1前缀的请求都会转发给5000)
      target: 'http://localhost:5000', //配置转发目标地址(能返回数据的服务器地址)
      changeOrigin: true, //控制服务器接收到的请求头中host字段的值
      /*
      	changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
      	changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:3000
      	changeOrigin默认值为false，但我们一般将changeOrigin值设为true
      */
      pathRewrite: {'^/api1': ''} //去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
    }),
    proxy('/api2', { 
      target: 'http://localhost:5001',
      changeOrigin: true,
      pathRewrite: {'^/api2': ''}
    })
  )
}
```

## 15、Fragment

放在最外层，包裹其他标签

```javascript
import React, { Component, Fragment } from 'react'
<Fragment key={1}>
	<input type="text" />
	<input type="text" />
</Fragment>
```

## 16、Context

Context可以实现组件通信，但是在应用开发中，一般不用Context通信传递数据,  一般用它来实现换肤功能、多语功能、封装react插件。

## 17、类组件优化

Component的2个问题

- 只要执行setState()，即使不改变状态数据，组件也会重新render()  ==> 效率低
- 当前组件重新render()，就会自动更新子组件的render，即使子组件没有用到父组件的任何数据 ==> 效率低
  那如何才能使得只有当组件的state或props数据发生改变时才重新render()
- 办法1: 重写shouldComponentUpdate()方法，比较新旧state或props数据, 如果有变化才返回true，如果没有返回false
- 办法2: 使用PureComponent，PureComponent重写了shouldComponentUpdate(), 只有state或props数据有变化才返回true。
  只是进行state和props数据的浅比较, 如果只是数据对象内部数据变了, 返回false。不要直接修改state数据, 而是要产生新数据。项目中一般使用PureComponent来优化

## 18、render props

[React组件逻辑复用](https://juejin.cn/post/6844904162472247304#heading-12)

## 19、Portal

## 20、Immutable.js

## 21、对React-Fiber的理解

Fiber是React16 对 React 一些核心算法的一次重写吧，主要是使用Fiber有助于性能优化。
React V15 在渲染时，会递归比对 VirtualDOM 树，找出需要变动的节点，然后同步更新它们， 一气呵成。
整个过程， React 会占据浏览器资源，这会导致用户触发的事件得不到响应，并且会导致掉帧，导致用户感觉到卡顿。React 通过Fiber 架构，让这个执行过程变成可被中断，让CPU 能在这段时间执行其他的操作。渲染的过程可以被中断，可以将控制权交回浏览器，执行优先级高的任务，浏览器空闲后再恢复渲染。
分批延时对DOM进行操作，避免一次性操作大量 DOM 节点，进而避免同步渲染带来的卡顿，打断渲染线程的“一次大量的同步渲染”。

## 22、类组件和函数组件的区别

### 类组件（有状态组件）

- 内部使用state，维护自身状态的变化
- 可以使用this
- 可以使用react的生命周期

### 函数组件

- 没有自己的state
- 没有this关键字
- 不能使用生命周期钩子

## 23、 useState 为什么要使用数组而不是对象解构

数组的话可以直接根据顺序解构，而对象解构是根据属性的key

## 24、React 中的高阶组件运用了什么设计模式？

使用了装饰模式，装饰模式的特点是不需要改变 被装饰对象 本身，而只是在外面套一个外壳接口。用法如下：

```js
@testable
   class MyTestableClass {
}
```
