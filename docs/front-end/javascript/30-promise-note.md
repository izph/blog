---
title: Promise
date: 2020-12-28 20:51:20
permalink: /front-end/javascript/promise-note
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# Promise
- Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。

- 有三种状态：Pending（进行中）、Resolved（已完成，又称 Fulfilled）和 Rejected（已失败）
- new Promise(callback)，callback回调是同步执行的
```js
new Promise(function(resolve, reject) {
  // ... some code
  if (/* 异步操作成功 */){
    // 若 resolve(value); 后面还有语句，也会同步执行。
    // 若为 return resolve(value); 则后面的语句不会执行
    resolve(value);
  } else {
    reject(error);
  }
})
```
1. Promise.all()：用于将多个 Promise 实例（如果不是，就会先调用 Promise.resolve 方法，将参数转为 Promise 实例），包装成一个新的 Promise 实例。
（1）只有这几个实例的状态都变成 resolved，p 的状态才会变成 resolved，此时传递给 p 的回调函数的参数为返回值组成的数组。
（2）只要实例中有一个被 rejected，p 的状态就变成 rejected，此时第一个被 reject 的实例的返回值，会传递给 p 的回调函数。如果 p2 没有自己的 catch 方法，就会调用 Promise.all() 的 catch方法。
2. Promise.allSettled()：接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数实例都返回结果，不管是 fulfilled 还是 rejected，包装实例才会结束。返回值 allSettledPromise，状态只可能变成 fulfilled。它的监听函数接收到的参数是数组 results（含 fulfilled 的结果 or rejected 的结果）。
3. Promise.race()：接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。var p = Promise.race([p1, p2, p3]) 只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 p 的回调函数。
4. Promise.any()：接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只要参数实例有一个变成 fulfilled 状态，包装实例就会变成 fulfilled 状态；如果所有参数实例都变成 rejected 状态，包装实例就会变成 rejected 状态，参数为成员错误结果数组。
5. Promise.resolve()：将现有对象转为 Promise 对象。Promise.resolve('foo') // 等价于 new Promise(resolve => resolve('foo')) 
6. Promise.reject()：将现有对象转为 Promise 对象，该实例的状态为 rejected。var p = Promise.reject('出错了'); // 等价于 var p = new Promise((resolve, reject) => reject('出错了')) 
7. done()：总是处于回调链的尾端，保证抛出任何可能出现的错误
8. finally()：用于指定不管 Promise 对象最后状态如何，都会执行的操作。它与 done 方法的最大区别，它接受一个普通的无参数的回调函数作为参数，该函数不管怎样都必须执行，与状态无关，不依赖于 Promise 的执行结果。
9 Promise.try()：让同步函数同步执行，异步函数异步执行，并且让它们具有统一的 API


```javascript
// 封装一个sleep方法
function sleep(duration) {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, duration);
    });
}
sleep(1000).then(()=> console.log("finished"));
```

## Promise的实现

```javascript
/**
  * promise
  * 1. 有状态 ： pending ｜ fullfilled ｜ rejected
  * 2. 有值： value
  */
// 总结：手写promise 要考虑的一些问题。
//   实现 promise 的基本结构
//   实现 executor 执行器。解决promise状态只能变更一次，判断 status 状态
//   通过 then 来接收 resolve reject
//      问题 then 的执行顺序，使用 异步，settimeout
//      问题 executor 中传入异步resolve，需要使用一个数组将 then 传入的参数暂存起来之后再map遍历出来使用。
//      问题 解决 then 中不传入function，通过判断 传入参数类型来避免bug
//      问题 解决then 为空的状态，通过 then 穿透来实现。
class MyPromise {
    static PENDING = 'PENDING'; // 开始状态
    static FULLFILLED = 'FULLFILLED'; // 成功状态
    static REJECTED = 'REJECTED'; // 失败状态
    /**
     * 执行回调方法 内部如下 （resolve, reject） => {}
     * @param {*} executor
     */
    constructor(executor) {
        this.status = MyPromise.PENDING;
        this.value = null;
        this.callbacks = [];
        executor(this.resolve.bind(this), this.reject.bind(this));
    }

    /**
     * 成功的回调   通知 promise 状态修改为 PENDING ->  FULLFILLED
     * @param {*} value
     */
    resolve(value) {
        // 保证状态一旦发生改变就不能再改变
        if (this.status === MyPromise.PENDING) {
            this.status = MyPromise.FULLFILLED;
            this.value = value;

            // 解决宏任务，微任务的执行问题
            setTimeout(() => {
                this.callbacks.map(callback => {
                    callback.onFullfilled(this.value);
                });
            });
        }
    }

    reject(reason) {
        if (this.status === MyPromise.PENDING) {
            this.status = MyPromise.REJECTED;
            this.value = reason;

            setTimeout(() => {
                this.callbacks.map(callback => {
                    callback.onRejected(this.value);
                });
            });
        }
    }

    then(onFullfilled, onRejected) {
        // 如果传入的onFullfilled / onRejected 为 null
        if (typeof onFullfilled !== 'function') {

            //r如果then 为空，通过 then穿透将value传给后面的then 去处理。
            onFullfilled = () => this.value;
        }

        if (typeof onRejected !== 'function') {
            onRejected = () => this.value;
        }

        return new MyPromise((mResolve, mReject) => {
            if (this.status === MyPromise.PENDING) {
                // pending 状态下操作
                // 当 status 为pending 状态的时候，即promise中resolve / reject 异步调用
                // promise.then()   的 链式调用
                this.callbacks.push({
                    onFullfilled: value => {
                        let result = onFullfilled(this.value);
                        mResolve(result);
                    },
                    onRejected: reason => {
                        let result = onRejected(this.value);
                        mReject(result);
                    },
                });
            }

            if (this.status === MyPromise.FULLFILLED) {
                // fullfilled 状态下操作
                // then方法调用的应该是微任务，也就是异步任务
                setTimeout(() => {
                    let result = onFullfilled(this.value);
                    mResolve(result);
                });
            }

            if (this.status === MyPromise.REJECTED) {
                // rejected 状态下操作
                setTimeout(() => {
                    let result = onRejected(this.value);
                    mReject(result);
                });
            }
        });
    }
}

// 测试
p = new MyPromise((resolve, reject) => {
    console.log('hi')
    if (Math.random() > 0.5) {
        resolve('成功啦');
    } else {
        reject('失败啦');
    }
});
p.then((data) => {
    console.log(data);
})
```

## Promise.all

```js
function all(arr) {
    return new Promise(function (resolve, reject) {
        // 参数判断
        if (!Array.isArray(arr)) return;
        let [count, res] = [0, []];
        arr.forEach((promise, index) => {
            promise.then((data) => {
                res[index] = data;
                count++
                if (count === arr.length) {
                    resolve(res)
                }
            }, (err) => {
                reject(err)
            })
        });
    })
}
```
