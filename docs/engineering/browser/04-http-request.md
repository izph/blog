---
title: 前后端联调
date: 2021-01-10 15:11:19
permalink: /engineering/browser/http-request
categories:
  - 浏览器
tags:
  - 浏览器
---
# 前后端联调方法

## 原生XMLHttpRequest

```js
const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://www.example.com/test');
xhr.responseType = 'json';

xhr.onload = () => {
    console.log(xhr.responseText);
}

xhr.error = () => {
    console.log('error!!!');
}
xhr.send();
```

## jquery的ajax

```js
$.ajax({
    type: "POST",
    url: "http://www.example.com/test",
    data: {},
    dataType: "json",
    success: function (){},
    error: function (){}
})
```

## Fetch

#### Fetch缺点

- 只对网络请求报错，对400、500都当做成功的请求
- 默认不会带cookie
- 不支持超时控制，不支持终止
- 没有办法原生检测请求的进度

```js
fetch("http://www.example.com/test").then(function(response){
    return response.json();
}).then(function(data){
    console.log(data);
}).catch(function(e){
    console.log("error!!!")
})

// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

postData('https://example.com/answer', { answer: 42 })
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
  });

```

## axios

参考官方文档：[axios中文文档](http://www.axios-js.com/zh-cn/docs/index.html)

### 传统表单上传二进制文件(伪代码)

```tsx
import React from 'react';
import axios from 'axios';

const Upload: React.FC = () => {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const flies = e.target.flies;
        if(flies){
            const uploadedFile = files[0];
            const formData = new FormData();
            // name, file
            formData.append(uploadedFile.name, uploadedFile);
            axios.post("url", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then((res) => {
                console.log(res);
            })
        }
    }

    return (
        <div>
            <input type="file" name="filename" onChange={handleFileUpload}/>
        </div>
    )
}
```
