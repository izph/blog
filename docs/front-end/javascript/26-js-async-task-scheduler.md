---
title: JavaScript异步任务调度器
date: 2021-08-12 09:40:16
permalink: /front-end/javascript/js-async-task-scheduler
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
## 1、实现异步调度器Scheduler

JS 实现一个带并发限制的异步调度器Scheduler，保证同时运行的任务最多有两个。完善下面代码中的 Scheduler类，使得以下程序能正确输出。

```javascript
class Scheduler {
    constructor() {
    }
    add() {}
}
const timeout = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time)
    })
}
const scheduler = new Scheduler(2);
const addTask = (time, content) => {
    scheduler.add(() => timeout(time)).then(() => console.log(content))
}
addTask(1000, '1');
addTask(2000, '2');
addTask(1000, '3');
addTask(1000, '4');
```

### 实现代码如下

```javascript
class Scheduler {
    constructor(maxNum) {
        this.taskList = [];
        this.count = 0;
        this.maxNum = maxNum;
    }
    async add(promiseCreator) {
        if (this.count >= this.maxNum) {
            await new Promise((resolve) => {
                this.taskList.push(resolve);
            })
        }
        this.count++;
        const result = await promiseCreator();
        this.count--;
        if (this.taskList.length > 0) {
            this.taskList.shift()();
        }
        return result;
    }
}
const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
})
const scheduler = new Scheduler(2);
const addTask = (time, val) => {
    scheduler.add(() => {
        return timeout(time).then(() => {
            console.log(val)
        })
    })
}
addTask(1000, '1');  // 1s后输出'1'
addTask(2000, '2');  // 2s后输出'2'
addTask(1000, '3');  // 2s后输出'3'
addTask(1000, '4');  // 3s后输出'4'
```

## 2、实现一个CodingMan

```javascript
-  实现一个CodingMan ，可以按照以下方式调用:
    -  CodingMan("Hank")
    -  输出: Hi! This is Hank!

    -  CodingMan("Hank").sleep(10).eat("dinner")
    -  输出: Hi! This is Hank!
    -  // 等待10秒.
    -  Wake up after 10
    -  Eat dinner~

    -  CodingMan("Hank").eat("dinner").eat("supper") 
    -  输出 Hi This is Hank!
    -  Eat dinner~
    -  Eat supper~

    -  CodingMan("Hank").sleepFirst(5).eat("supper")
    -  //等待5秒
    -  Wake up after 5
    -  Hi This is Hank!
    -  Eat supper
    -  以此类推。
```

### 实现代码如下

```javascript
class CodingMan {
  constructor(name) {
        this.name = name;
        this.time = 0;
        this.tasks = [];
        this.isSleepFirst = false;
        this.run();
    }
    run() {
        new Promise((resolve, reject) => {
            resolve();
        }).then(() => {
            this.tasks.unshift(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        console.log(`Hi! This is ${this.name}`)
                        resolve();
                    }, 0);
                })
            })
            if (this.isSleepFirst) {
                const target = () => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            console.log(`Wake up after ${this.time}`)
                            //console.log(`Hi! This is ${this.name}`)
                            resolve();
                        }, this.time * 1000);
                    })
                }
                // 入队列
                this.tasks.unshift(target)
            }

            this.next()
        })
    }
    next() {
        let fn = this.tasks.shift()
        if (typeof fn === 'function') {
            fn().then(() => {
                this.next()
            })
        }
    }
    eat(data) {
        // 添加任务
        const target = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(`Eat ${data}~`)
                    resolve();
                }, 0);
            })
        }
        // 入队列
        this.tasks.push(target)
        return this;
    }

    sleep(time) {
        // 添加任务
        this.time = time
        const target = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(`Wake up after ${this.time}`)
                    resolve();
                }, this.time * 1000);
            })
        }
        // 入队列
        this.tasks.push(target)
        return this
    }

    sleepFirst(time) {
        this.time = time
        this.isSleepFirst = true;
        return this
    }
}
function CodingMan(name) {
    return new TaskMan(name)
}
// CodingMan("Hank").sleep(5).eat("dinner")
// CodingMan("Hank").eat("dinner").eat("supper")
CodingMan("Hank").sleepFirst(5).eat("supper")
}
```

```javascript
class CodingMan {
  constructor(name) {
    this.name = name;
    setTimeout(() => {
      console.log("Hi! This is " + name);
    }, 0);
  }

  sleep(seconds) {
    const delay = seconds * 1000;
    const time = Date.now();
    while (Date.now() - time < delay) {
      // hu lu lu ~~
    }
    setTimeout(() => {
      console.log("wake up after " + seconds);
    }, 0);
    return this;
  }

  eat(something) {
    setTimeout(() => {
      console.log("eat " + something);
    }, 0);
    return this;
  }

  sleepFirst(seconds) {
    new Promise((resolve) => {
      const delay = seconds * 1000;
      const time = Date.now();
      while (Date.now() - time < delay) {
        // hu lu lu ~~
      }
      resolve();
    }).then(() => {
      console.log("wake up after " + seconds);
    });
    return this;
  }
}

function CodingMan(name) {
  return new CodingMan(name);
}

CodingMan("Hank").sleep(2).eat("dinner").sleepFirst(3);
```

## 3、实现一个T

t.console('breakfast').setTimeout(3000).console('lunch').setTimeout(3000).console('dinner');

```javascript
class T {
    constructor() {
        this.promise = Promise.resolve();
    }   
    console(val) {
        this.promise = this.promise.then(() => {
           console.log(val); 
        });
        return this;
    }   
    setTimeout(wait) {
        this.promise = this.promise.then(() => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve()
                }, wait);
            });
        })
        return this;
    }
}
const t = new T();
t.console('breakfast').setTimeout(3000).console('lunch').setTimeout(3000).console('dinner')
```
