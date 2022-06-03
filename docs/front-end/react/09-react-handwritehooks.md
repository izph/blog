---
title: 手写hooks
date: 2021-09-26 19:27:10
permalink: /front-end/react/handwritten-hooks
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

## useDebounce

```tsx
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

[react-hooks-use-debounce](https://github.com/sophister/2bugua5/blob/master/category/react/react-hooks-use-debounce/react-hooks-use-debounce.md)

## useClickOutside

```tsx
import { RefObject, useEffect } from 'react';

function useClickOutside(ref: RefObject<HTMLElement>, handler: Function) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const isClickOutside = !ref.current?.contains?.(event.target as HTMLElement);
      if (isClickOutside && ref.current) {
        handler(event);
      }
    };

    document.addEventListener('click', listener);

    return () => {
      document.removeEventListener('click', listener);
    };
  }, [ref, handler]);
}

export default useClickOutside;

```
## useDrop
[参考](https://github.com/MyNewGH/study/blob/main/react/src/hooks/useDrop.ts)

```ts
import React, {useLayoutEffect, useRef, useState} from "react";
type positionType = {
    x:number,
    y:number
}
function useDrop<T>(initValue?:positionType):[positionType, React.RefObject<T extends HTMLElement ? T : HTMLElement>]{
    const positionRef = useRef({
        currentX:initValue?initValue.x:0,
        currentY:initValue?initValue.y:0,
        lastX:0,
        lastY:0
    })
    const elementRef = useRef<T extends HTMLElement ?T:HTMLElement>(null);
    const [,forceUpdate] = useState({})
    const elementMove = ()=>{
        let startX=0,startY=0;

        const start = function (event:TouchEvent) {
            const {clientX,clientY} = event.targetTouches[0];
            startX = clientX;
            startY =clientY;
            elementRef.current?.addEventListener('touchmove',move);
            elementRef.current?.addEventListener("touchend",end)
        }
        const move = (event:TouchEvent)=>{
            const {clientX,clientY} = event.targetTouches[0];
            positionRef.current.currentX = positionRef.current.lastX+(clientX-startX);
            positionRef.current.currentY = positionRef.current.lastY+(clientY-startY);
            forceUpdate({})
        }
        const end = (event:TouchEvent) => {
            positionRef.current.lastX = positionRef.current.currentX;
            positionRef.current.lastY=positionRef.current.currentY;
            elementRef.current?.removeEventListener("touchmove",move);
            elementRef.current?.removeEventListener("touchend",end)
        }
        elementRef.current?.addEventListener('touchstart',start)
    }
    useLayoutEffect(elementMove,[])
    let style = {
        x :positionRef.current.currentX,
        y:positionRef.current.currentY
    }
    return [
        style,
        elementRef
    ]
}
export default useDrop
```

## useRequest
```ts
import {useEffect,useState} from 'react';
type Options={
    pageSize: number,
    currentPage: number
}
interface RequestBack<T>{
    data:T,
    options:Options,
    setOptions:(val:Options)=>void
}
function useRequest<T extends object>(url:string,defaultData:Partial<T>):RequestBack<T>{
    const [options,setOptions] = useState<Options>({
        pageSize:5,
        currentPage:1
    })
    const [data,setData] = useState<T>(defaultData as T)
    const getData = ()=>{
        let {currentPage,pageSize} = options;
        fetch(`${url}?currentPage=${currentPage}&pageSize=${pageSize}`).then(res=>res.json()).then(res=>{
            setData(res)
        })
    }
    useEffect(getData,[options,url])
    return {
        data:data as T,
        options,
        setOptions
    }
}
export default useRequest
```
