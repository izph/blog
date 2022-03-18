---
title: React-Router笔记
date: 2021-12-26 17:12:16
permalink: /前端/React/react-router
categories:
  - 前端
  - React
tags:
  - 前端
  - React
---
# React-Router

- React Router甚至大部分的前端路由都是依赖于history.js的，它是一个独立的第三方js库。可以用来兼容在不同浏览器、不同环境下对历史记录的管理，拥有统一的API。
- 老浏览器的history: 通过hash来存储在不同状态下的history信息，对应createHashHistory，通过检测location.hash的值的变化，使用location.replace方法来实现url跳转。通过注册监听window对象上的hashChange事件来监听路由的变化，实现历史记录的回退。
- 高版本浏览器: 利用HTML5里面的history，对应createBrowserHistory, 使用包括pushState， replaceState方法来进行跳转。通过注册监听window对象上的popstate事件来监听路由的变化，实现历史记录的回退。

## 1、路由的基本使用

### 导航Link

```javascript
import { Link } from 'react-router-dom';
// 其中to后可以是String 也可以是object
// to: string——————需要跳转到的路径 home
// to: object——————需要跳转到的路径 pathname: '/home'
<Link to="/xxx">Demo</Link>
// 以下是object的例子，search参数
<Link 
    to={{
      pathname: '/home',
      search: '?ID=111',
      hash: 'hash',
      state: { noNeedLogin: true }
    }}
/>

//当replace为true时，点击链接后将使用home替换掉访问历史记录里面的原地址。
//当replace为false时，点击链接后将在原有访问历史记录的基础上添加/home。
<Link to="/home" replace /> //replace默认为 false。 
```

### NavLink与封装NavLink

1. NavLink可以实现路由链接的高亮，通过activeClassName指定样式名
2. 标签体内容是一个特殊的标签属性
3. 通过this.props.children可以获取标签体内容

```javascript
// 封装NavLink
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class MyNavLink extends Component {
	render() {
    // this.props传递to、children
    // activeClassName：设置选中样式
    // activeStyle：当元素被选中时，为此元素添加样式
    // activeStyle={{ color: 'green', fontWeight: 'bold' }}
    // exact(bool)：为true时，有当访问地址严格匹配时class和style才会应用
    // strict(bool)：为true时，在确定为位置是否与当前URL匹配时，将考虑位置pathname后的斜线
    // isActive(func)链接激活后做的回调处理
		return (
			<NavLink activeClassName="activexxx" className="xxx" {...this.props} />
		)
	}
}
```

### 注册路由Route

```javascript
// 引入React路由库
import { Route } from'react-router-dom';
<Route path='/xxx' component={ Demo }/>

// index.js文件
// 引入react核心库
import React from 'react';
// 引入ReactDOM
import ReactDOM from 'react-dom';
// BrowserRouter路由
import { BrowserRouter } from 'react-router-dom';
//引入App
import App from './App';
ReactDOM.render(
	<BrowserRouter>
		<App/>
	</BrowserRouter>,
	document.getElementById('root')
)
```

### Switch的使用

通常情况下，path和component是一一对应的关系，Switch可以提高路由匹配效率(单一匹配)

```javascript
<Switch>
	<Route path="/about" component={About}/>
	<Route path="/home" component={Home}/>
	<Route path="/home" component={Test}/>
</Switch>
```

### 解决多级路径刷新页面样式丢失的问题

1. public/index.html 中 引入样式时不写 ./ 写 / （常用）
2. public/index.html 中 引入样式时不写 ./ 写 %PUBLIC_URL% （常用）
3. 使用HashRouter

### 严格匹配

开启严格匹配：<Route exact={true} path="/about" component={About}/>

### Redirect的使用

一般写在所有路由注册的最下方，当所有路由都无法匹配时，跳转到Redirect指定的路由

```javascript
<Switch>
	<Route path="/about" component={ About } />
	<Route path="/home" component={ Home } />
	<Redirect to="/about" />
</Switch>
```

### 嵌套路由

1. 注册子路由时要写上父路由的path值
2. 路由的匹配是按照注册路由的顺序进行的
3. 路由的匹配都是由最开始的注册的路由开始匹配

### 向路由组件传递参数

1. params参数:直接在路由传参数，刷新页面参数还在，不丢失（用的多）
   - 路由链接(携带参数)：<Link to='/demo/test/tom/18'}>详情 `</Link>`
   - 注册路由(声明接收)：`<Route path="/demo/test/:name/:age" component={Test}/>`
   - 路由组件内接收参数：const{ name, age} = this.props.match.params;
     再用filter或者find找对应数据
2. search参数，有点类似 ajax的query参数，刷新页面参数还在，不丢失
   - 路由链接(携带参数)：<Link to='/demo/test?name=tom&age=18'}>详情 `</Link>`
   - 注册路由(无需声明，正常注册即可)：`<Route path="/demo/test" component={Test}/>`
   - 路由组件内接收参数：this.props.location.search
     备注：获取到的search是urlencoded编码字符串，需要借助querystring解析

```javascript
import qs from 'querystring';
// ?name=tom&age=18是 urlencoded 编码方式
1、let obj={name:'tom',age:'18'}
  qs.stringify(obj) //  字符串'name=tom&age=18'
2、let str='name=tom&age=18'
  qs.parse(str) //  对象{name:'tom',age:'18'}
```

3. state参数,属于路由组件的state属性，不同于状态state，不会把参数放在地址栏里，刷新页面参数还在，不丢失

- 路由链接(携带参数)：
  ``<Link to={{pathname:'/demo/test', state:{name:'tom', age:18}}}>详情</Link>``
- 注册路由(无需声明，正常注册即可)：
  ``<Route path="/demo/test" component={Test}/>``
- 组件内接收参数：this.props.location.state

4. query参数

- ``<Link to={{ pathname:'/demo/test', state, query:{data} }}>详情</Link>``
- 接收参数：``this.props.location.query.data``

### 编程式路由导航

编程式路由导航，借助this.prosp.history对象上的API对操作路由跳转、前进、后退
只有路由组件才会有这些history的API方法

- this.prosp.history.push()
- this.prosp.history.replace()
- this.prosp.history.goBack()
- this.prosp.history.goForward()
- this.prosp.history.go()

```javascript
replaceShow = (id,title)=>{
      //replace跳转+携带params参数
      //this.props.history.replace(`/home/message/detail/${id}/${title}`)

      //replace跳转+携带search参数
      // this.props.history.replace(`/home/message/detail?id=${id}&title=${title}`)

      //replace跳转+携带state参数
      this.props.history.replace(`/home/message/detail`,{id,title})
	}

	pushShow = (id,title)=>{
		//push跳转+携带params参数
		// this.props.history.push(`/home/message/detail/${id}/${title}`)

		//push跳转+携带search参数
		// this.props.history.push(`/home/message/detail?id=${id}&title=${title}`)

		//push跳转+携带state参数
		this.props.history.push(`/home/message/detail`,{id,title})

	}

	back = ()=>{
		this.props.history.goBack()
	}

	forward = ()=>{
		this.props.history.goForward()
	}

	go = ()=>{
		this.props.history.go(-2)
	}
```

### withRouter的适用场景

#### 1. 避免更新受阻

因为react-redux的connect高阶组件会为传入的参数组件实现shouldComponentUpdate这个钩子函数
导致只有prop发生变化时才触发更新相关的生命周期函数(含render)而很显然，我们的location对象并没有作为prop传入该参数组件

```javascript
// before
export default connect(mapStateToProps)(Something);
// after
import { withRouter } from 'react-router-dom';
export default withRouter(connect(mapStateToProps)(Something));

```

#### 2. 在组件中意图使用history来控制路由跳转

```javascript
import React from "react";
import {withRouter} from "react-router-dom";
class MyComponent extends React.Component {
  ...
  myFunction() {
    this.props.history.push("/some/Path");
  }
  ...
}
export default withRouter(MyComponent);
// 如果我们不使用withRouter来处理(MyComponent)，
// 那么我们这里的this.props就取不到history，会报hitstory is undefiend之类的错。
```

### BrowserRouter与HashRouter的区别

1. 底层原理不一样：写vue和react一般不写IE9及以下版本
   - BrowserRouter使用的是H5的history API，不兼容IE9及以下版本。
   - HashRouter使用的是URL的哈希值。
2. path表现形式不一样
   - BrowserRouter的路径中没有#,例如：localhost:3000/demo/test
   - HashRouter的路径包含#,例如：localhost:3000/#/demo/test
3. 刷新后对路由state参数的影响
   - BrowserRouter没有任何影响，因为state保存在history对象中。
   - HashRouter刷新后会导致路由state参数的丢失！！！vue的hash模式也是一样
4. 备注：HashRouter可以用于解决一些路径错误相关的问题。--解决样式丢失问题
