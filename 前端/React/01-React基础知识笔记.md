---
title: React基础知识笔记
date: 2021-12-26 17:12:16
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
  - this.setState((state) => { return { count: state.count + 1 } });

### props

#### constructor方法中super，传递的参数props是否有必要写？

在类中写了constructor方法，就必须使用super()，这样组件才有自己的this，在组件的全局中都可以使用this关键字，否则如果只是constructor而不执行super()那么之后的this都是错的。

#### super中的参数必须写参数props吗？

在constructor中使用this.props的时候，super需要加入props。

#### 如果constructor中不通过super来接收props，在其他生命周期中能直接使用this.props吗？

可以的，react在除了constructor之外的生命周期已经传入了this.props了，完全不受super(props)的影响。

#### 对标签属性进行类型、必要性的限制(propTypes 来自prop-types )

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
- <input ref="input1" type="text"/>

#### 回调函数ref

- 获取ref：const { input2 } = this;
- <input ref={ c => { this.input2 = c }} type="text"/>

#### React.createRef创建ref

- 创建，myRef = React.createRef()，使用this.myRef.current.value
- <input ref={this.myRef} type="text" />

## 5、事件处理

- 更好的兼容性：React使用的是自定义(合成)事件, 而不是使用的原生DOM事件
- 高效：React中的事件是通过事件委托方式处理的(委托给组件最外层的元素)
- 事件绑定：在constructor中使用bind(this)、箭头函数、行内的箭头函数(不推荐)

## 6、受控组件与非受控组件

- 受控组件：组件的展示完全由传入的属性决定。比如说，如果一个输入框中的值完全由传入的 value 属性决定，而不是由用户输入决定，那么就是受控组件，写法是：
  ```< input value={value} onChange={handleChange} />```
  这也是为什么只给 < input/> 传了一个 value 值但是没有传 onChange 事件，那么键盘怎么输入都没有反应。
- 非受控组件：表单组件可以有自己的内部状态，而且它的展示值是不受控的。比如 input 在非受控状态下的写法是：
  ```< input onChange={handleChange}/>```
  也就是说，父组件不会把 value 直接传递给 input 组件。在日常开发中，大部分的表单元素其实都是受控组件，我们会通过外部的状态完全控制当前组件的行为。

## 7、高阶函数

高阶函数：参数的回调函数或者返回值是一个函数

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

## 8、类组件的生命周期
[React生命周期](./02-ReactLifeCycle.md)
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
- 跨组件通信：redux、mobx、pubsub、context

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

懒加载原理就是利用es6 import()函数，当Webpack解析到该语法时，它会自动地开始进行代码分割(Code Splitting)，分割成一个文件，当使用到这个文件的时候会这段代码才会被异步加载。

```javascript
//使用React.lazy导入OtherComponent组件
const OtherComponent = React.lazy(() => import('./OtherComponent'));
// 但是这样页面会报错。这个报错提示我们，在React使用了lazy之后，会存在一个加载中的空档期，React不知道在这个空档
// 期中该显示什么内容，所以需要我们指定。接下来就要使用到Suspense

// 在 App 渲染完成后，包含 OtherComponent 的模块还没有被加载完成，可以使用加载指示器为此组件做优雅降级。
// 使用 Suspense 组件来解决
<Suspense fallback={<div>Loading...</div>}>
  { this.state.visible ? <OtherComponent /> : null }
</Suspense>
// 我们指定了空档期使用Loading展示在界面上面，等OtherComponent组件异步加载完毕，
// 把OtherComponent组件的内容替换掉Loading上
```

## 13、React Router
[React-Router](./04-React-Router.md)

## 14、react-create-app脚手架配置代理
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
