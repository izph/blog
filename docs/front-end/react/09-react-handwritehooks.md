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
