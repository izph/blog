---
title: Promise
date: 2022-01-27 20:53:16
permalink: /前端/JavaScript/Promise
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# Promise
new Promise(callback)，callback回调是同步执行的
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