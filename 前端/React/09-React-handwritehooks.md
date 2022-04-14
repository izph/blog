---
title: 手写hooks
date: 2021-11-26 17:12:16
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