---
title: React+Mobx6.0 
date: 2022-04-16 18:05:10
categories:
  - 前端
tags:
  - React
toc: true # 是否启用内容索引
comments: true
copyright: false
---
# mobx入门

- 在 Mobx6 中不推荐使用装饰器语法，因为它不是 ES 标准
- mobx：mobx 核心库
- mobx-react-lite：仅支持函数组件
- mobx-react：既支持函数组件也支持类组件
- 下载 `npm install mobx@6.5.0 mobx-react-lite@3.3.0`

# mobx核心概念

- observable state：被 Mobx 跟踪的状态。
- action：允许修改状态的方法，在严格模式下只有 action 方法被允许修改状态。
- computed：根据应用程序状态派生的新值，计算值。
- mobx 每次都是修改的同一个状态对象，基于响应式代理，也就是 Object.defineProperty 代理 get、set 的处理，get 时把依赖收集起来，set 修改时通知所有的依赖做更新。

# mobx基础实践

- [Mobx官方文档](https://zh.mobx.js.org/observable-state.html)

- [React+Mobx6从入门到实践](https://juejin.cn/post/7063329425948934180)

# 查看mobx的proxy对象的数据

```js
import { toJS } from "mobx";
console.log(toJS(user.name));
```

# 持久化存储mobx-persist-store

解决页面刷新的时候数据会丢失的情况

[mobx-persist-store文档](https://github.com/quarrant/mobx-persist-store)

## makePersistable实践

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

## 使用持久数据

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

# Redux和Mobx的区别

- Mobx是学习成本低，比较简单，自由度更高（可直接修改状态）；Redux写起来有点繁琐，创建store，编写reducer，触发action等等。
- Mobx比较推荐面向对象编程的写法；Redux则是推荐函数式编程，如reducer就是一个纯函数。
- Mobx中的数据可读可写，并且不一定需要 action 修改状态，可直接修改状态；Redux是单一数据源，State 是只读的。
- 参考：[Redux和Mobx的区别](https://juejin.cn/post/6844903562095362056)
