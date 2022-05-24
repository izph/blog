---
title: React+Mobx6.0
date: 2022-05-15 18:05:10
permalink: /前端/React/react-mobx
categories:
  - 前端
  - React
tags:
  - 前端
  - React
---
# React + Mobx6从入门到实践

- 在 Mobx 6中不推荐使用装饰器语法，因为它不是 ES 标准
- MobX 可以运行在任何支持 ES5 的环境中，包含浏览器和 Node

## mobx入门

- mobx：MobX 核心库
- mobx-react-lite：仅支持函数组件
- mobx-react：既支持函数组件也支持类组件
- 下载 `npm install mobx@6.5.0 mobx-react-lite@3.3.0`

## mobx核心概念

- observable state：被 MobX 跟踪的状态。
- action：允许修改状态的方法，在严格模式下只有 action 方法被允许修改状态。
- computed：根据应用程序状态派生的新值，计算值。

- mobx 每次都是修改的同一个状态对象，基于响应式代理，也就是 Object.defineProperty 代理 get、set 的处理，get 时把依赖收集起来，set 修改时通知所有的依赖做更新。

- mobx 会在对象上添加一个 Symbol($mobx) 的隐藏属性，用来放 ObservableObjectAdministration 对象，它是用于管理属性和它的依赖的，在 get 的 时候收集依赖，然后 set 的时候就可以通知所有收集到的依赖（Reaction）做更新。


更新mobx使用参考：

[Mobx官方文档](https://zh.mobx.js.org/observable-state.html)

[React+Mobx6从入门到实践](https://juejin.cn/post/7063329425948934180)

## 查看mobx的proxy对象的数据
```js
import { toJS } from "mobx";
console.log(toJS(user.token));
```

## 持久化存储mobx-persist-store
解决页面刷新的时候数据会丢失的情况

[mobx-persist-store文档](https://github.com/quarrant/mobx-persist-store)

### makePersistable例子（Persist：维持和保持）
```js
import { makeAutoObservable, action, toJS } from "mobx";
import { makePersistable, isHydrated } from "mobx-persist-store"; // 引入相关api

// import localForage from "localforage";  // localforage前端数据存储

class User {
  token: string;
  constructor() {
    // 自动将已经存在的对象属性并且使得它们可观察，makeAutoObservable 不能被用于带有super的类或子类。
    makeAutoObservable(this, {}, { autoBind: true });
    // 数据持久化存储，在构造函数内使用 makePersistable
    makePersistable(this, {
      // 保存的name，用于在storage中的名称标识，只要不和storage中其他名称重复就可以
      name: "userInfo",

      // 注意：不写在这里面的字段将不会被保存，刷新页面也将丢失：get字段例外。get数据会在数据返回后再自动计算
      properties: ["token"],

      // 保存的位置：看自己的业务情况选择，可以是localStorage，sessionstorage
      // localForage, window.localStorage
      storage: window.localStorage,
      // 还有一些其他配置参数，例如数据过期时间
      expireIn: 86400000, // 以毫秒为单位，一天过期
      removeOnExpiration: true, // 到期删除
      stringify: false, // 是否转化成json字符串

    }).then(action((persistStore) => {
      // persist完成的回调，在这里可以执行一些拿到数据后需要执行的操作，如果在页面上要判断是否成persist，使用isHydrated
      console.log(persistStore.isHydrated);
    }))
  }
  // 注意这个字段的使用：在页面useEffect的时候，如果你没有添加依赖数组（初始化执行）
  // 那么你可能拿不到computed计算的数据（原因是这时候还没有persist结束）所以这个属性还是比较重要的
  // 因为它可以在页面上做判断，当页面load完成，get数据计算完成之后，isHydrated会置为true
  get isHydrated() {
      return isHydrated(this);
  }

  /**
   * computed
   */
  get token() {
    return this.token;
  }
  /**
   * action
   */
  setToken(val) {
    this.token = val || "";
  }
}

export default new User();
```
### 使用持久数据
```js

useEffect(() => {
  if (user.isHydrated) {
    // ... 这个时候就可以拿到user里缓存的值
  }
  return () => {
    // ... 
  }
  // eslint-disable-next-line 
}, [user.isHydrated])
```

## React和Mobx

- Mobx是单向数据流，利用action改变state ，进而更新所有受影响的view，而Redux是基于Flux的单向数据流实现。

- Redux中数据是只读的；Mobx中的数据可读可写，并且 action 非必须，可直接改变。

- Mobx 能少写很多代码，而 Redux 要通过 action, reducer 等等的编写才能实现整个流程。
[Redux和Mobx的区别](https://juejin.cn/post/7087338460129787941)

## localforage前端本地存储

- 可以解决 localStorage/sessionStorage 大小限制的问题
- 完美避开 indexDB 的语法，上手比较容易
- localforage.getItem 返回的是 promise
- 不会因为关闭浏览器就消失，需要手动清理哦 localforage.removeItem(key), localforage.clear()

[localforage库](https://www.npmjs.com/package/localforage)

[localforage前端数据存储](https://juejin.cn/post/7024119821365149709)

