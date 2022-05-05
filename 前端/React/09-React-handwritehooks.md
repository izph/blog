---
title: 手写hooks
date: 2021-09-26 19:27:10
permalink: /前端/React/handwrittenhooks
categories:
  - 前端
  - React
tags:
  - 前端
  - React
---
# 手写Hooks（笔记）

## useInterval

```js
function useInterval(callback, delay) {
    const memorizeCallback = useRef();
    useEffect(() => {
        memorizeCallback.current = callback;
    }, [callback]);
    useEffect(() => {
        if (delay !== null) {
            const timer = setInterval(() => {
                memorizeCallback.current();
            }, delay);
            return () => {
                clearInterval(timer);
            };
        }
    }, [delay]);
};
```
