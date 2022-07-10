---
title: localStorage、sessionStorage和cookie的区别
date: 2021-01-15 10:22:49
categories:
  - 前端
tags:
  - 浏览器
toc: true # 是否启用内容索引
comments: true
copyright: false
---
# localStorage 和 sessionStorage

- localStorage 和 sessionStorage 是 HTML5 新增的浏览器本地缓存API，localstorage，sessionstorage在浏览器无痕模式下会存在丢失问题
- 只有相同域名的页面才能互相读取 localStorage
- 浏览器同时打开两个相同域名的tab页面，localstorage是共享的，sessionstorage是不共享的
- localStorage 和 sessionStorage的存取操作都是同步的

## 主要用途

1. localStorage

- 项目状态管理的持久化，例如redux的持久化、mobx的持久化、vuex的持久化等
- 项目全局风格状态的切换（页面的默认定制配置），例如主题颜色、语言标识
- token的存储
- 项目通用参数的存储，来记录一些不敏感的信息

2. sessionStorage

- sessionStorage 适合一次性临时数据保存

## localStorage、sessionStorage和cookie的异同点

|      分类      |                                  生命周期                                  | 存储容量 |
| :------------: | :------------------------------------------------------------------------: | :------: |
|     cookie     | 默认保存在内存中，随浏览器关闭失效（如果设置过期时间，在到过期时间后失效） |   4KB   |
|  localStorage  |                         永久有效的，除非主动清除。                         |  5M左右  |
| sessionStorage |          仅在当前tab页会话下有效，关闭tab页面或浏览器后会被清除。          |  5M左右  |

## 基本使用

```js
// 以 localStorage 为例
localStorage.setItem(key, value);	// 存储

localStorage.getItem(key);	//  获取

localStorage.removeItem(key);	// 删除

localStorage.clear();	// 清空
```

## localStorage 数据过期（脏数据）

localstorage本身是没有过期机制的，可以通过手动实现。具体的做法是：

- 存入数据时，顺便存一个过期时间 maxAge 和 当前存值时间戳 time
- 获取数据时，通过（time + maxAge 和 Date.now()的关系）来判断当前数据是否过期，过期则删除当前数据; 否则正常返回数据
- 参考：[如何实现localStorage的过期机制？](https://juejin.cn/post/7068533397911502879)

没有手动封装localStorage过期的token登录例子：假如前端用localStorage永久存储token（token由过期时间、其他信息组成），发送请求时，后端拿到token检验是否过期，token过期后，后端会返回401状态码，前台统一捕获这个状态码后跳转到登录页面（过期重定向）。一般都是这么个做法，但是这个做法有一个小弊端：需要依靠请求才能感知是否已过期。

# cookie

cookie是客户端保存用户信息的一种机制，用来记录用户的一些信息。

## cookie的组成

服务器一般是通过在http响应消息头增加Set-Cookie，将Cookie信息种在浏览器中，浏览器发送http请求时，会自动带上同源的Cookie请求头字段，传给服务器。

```js
// 其中name=value是必选项，其它都是可选项
Set-Cookie: "name=value;domain=.domain.com;path=/;expires=<date>, 11 Jun 2019 11:29:42 GMT;HttpOnly;secure"
```

- expires: 设置cookie的有效期，如果cookie 超过 date 所表示的日期时，cookie将失效。 如果没有设置这个选项，那么cookie将在浏览器关闭时失效。
  另外，浏览器根据本地时间，决定 Cookie 是否过期，由于本地时间是不精确的，所以没有办法保证 Cookie 一定会在服务器指定的时间过期。
- Max-Age：指定从现在开始 Cookie 存在的秒数，比如60 * 60 * 24 * 365（即一年）。过了这个时间以后，浏览器就不再保留这个 Cookie。
  如果同时指定了Expires和Max-Age，那么Max-Age的值将优先生效。
  如果Set-Cookie字段没有指定Expires或Max-Age属性，那么这个 Cookie 就是 Session Cookie，即它只在本次对话存在，一旦用户关闭浏览器，浏览器就不会再保留这个 Cookie。
- domain=<domain_name> : .taobao.com(a.taobao.com和b.taobao.com都可以访问)，但是不能设置成taobao.com，这样是不允许的携带cookies
- path=<some_path>: 一般是 / (注：临时cookie，没有expires参数的cookie，不能带有domain选项)，当客户端发送一个http请求时，会将有效的cookie一起发送给服务器，如果一个cookie的domain和path参数和URL匹配，那么这个cookie就是有效的。
- secure: secure属性指定浏览器只有在加密协议 HTTPS 下，才能将这个 Cookie 发送到服务器。该属性只是一个开关，不需要指定值。
- httponly : 表示cookie不能被客户端脚本获取到。HttpOnly属性指定该 Cookie 无法通过 JavaScript 脚本拿到，主要是Document.cookie属性、XMLHttpRequest对象和 Request API 都拿不到该属性。这样就防止了该 Cookie 被脚本读到，只有浏览器发出 HTTP 请求时，才会带上该 Cookie。
  （但还是能通过 Application 中手动修改 cookie，所以只是在一定程度上可以防止 XSS 攻击，不是绝对的安全）有助于避免 XSS 攻击。（防止通过srcipt标签里面的代码获取cookie）

# localforage前端本地存储

- 可以解决 localStorage/sessionStorage 大小限制的问题
- localforage.getItem 返回的是 promise
- 不会因为关闭浏览器就消失，需要手动清理哦 localforage.removeItem(key), localforage.clear()
- [localforage库](https://www.npmjs.com/package/localforage)
- [localforage前端数据存储](https://juejin.cn/post/7024119821365149709)

# 参考

- [localStorage、sessionStorage、cookie、session几种web数据存储方式对比总结](https://juejin.cn/post/6844903989096497159)
- [理解cookie、session、localStorage、sessionStorage的关系与区别](https://juejin.cn/post/6844903975800537096)
- [傻傻分不清之 Cookie、Session、Token、JWT](https://juejin.cn/post/6844904034181070861)
