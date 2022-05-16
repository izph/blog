---
title: Window 笔记
date: 2021-07-10 20:23:45
permalink: /front-end/javascript/window-note
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
## Window.getComputedStyle()
获取element样式值
```js
window.getComputedStyle(element);  // element是一个dom元素

// element.style
```
## CSSStyleDeclaration.getPropertyValue()
返回某个CSS元素的属性值
```js
var declaration = document.styleSheets[0].cssRules[0].style;
var value = declaration.getPropertyValue('margin'); // "1px 2px"
```

## 获取元素的标签名称
```js
// 获取元素的标签名称
function getNodeName(ele) {
    return ele.nodeName.toUpperCase();
}
```

## 创建DOM元素

```js
const createDocument = (options, parentNode) => {
  const { tag, attrs, id } = options;
  let ele = document.getElementById(id);
  if (!ele) {
    ele = document.createElement(tag);
    for(let attrsKey in attrs) {
      if(attrsKey && attrs[attrsKey]) {
        ele[attrsKey] = attrs[attrsKey];
      }
    }
    ele.id = id;
    let _parentNode = parentNode;
    if(!parentNode) {
      _parentNode = document.getElementsByTagName('body')[0];
    }
    if(_parentNode) {
      _parentNode.appendChild(ele);
    }
  }
}

// 使用
createDocument({
	tag: 'div',
	id: `xxxx`,
	attrs: {
		class: 'container'
	}
})
```

## 获取当前屏幕尺寸
```js

export default class Screen {
    /**
     * 获取当前屏幕尺寸
     * @return [width, height]
     */
    size() {
        let pageW = window.innerWidth, pageH = window.innerHeight;
        if (!_.isNumber(pageW) || !_.isNumber(pageH)) {
            if (document.compatMode == "CSS1Compat") {//是否处于标准模式
                pageW = document.documentElement.clientWidth;
                pageH = document.documentElement.clientHeight;
            } else {
                pageW = document.body.clientWidth;
                pageH = document.body.clientHeight;
            }
        }
        return [pageW, pageH];
    }
};
```
