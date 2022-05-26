---
title: Nginx配置多个域名(windows)
date: 2022-05-25 23:30:22
permalink: /engineering/other/nginx-domain
categories:
  - 其他
tags:
  - 其他
  - 静态服务器
---

# nginx开启静态服务，并配置二级域名访问

## 一、安装nginx（windows版）

- 进入nginx官网下载安装包: [nginx下载](http://nginx.org/en/download.html)
- 解压下载完成的nginx压缩包
- 打开`cmd`，进入nginx安装包根路径
- 输入命令`nginx -t`：检查nginx是否配置成功
- 输入命令`start nginx`：启动nginx服务

## nginx其他常用命令

- 修改了配置文件，如nginx.conf，要使修改生效，重启Nginx服务
```bash
nginx -s reload
```

- 关闭nginx服务
```bash
nginx -s quit
```

- 强制关闭Nginx服务
```bash
nginx -s stop
```

## nginx.conf配置文件

- nginx的配置在根目录conf文件夹下的nginx.conf文件中
- server：代理服务器，可以设定多个代理服务器（每一个server就是一个虚拟服务器），请求进来之后由server的server_name决定该请求访问哪一个服务。

- 以下是在阿里云服务器nginx配置不同域名，访问不同的静态资源的例子，比如访问home和detial，我们只需要把静态文件分别放到`C:/v1/home`和`C:/v1/detial`目录下，即可通过`http://home.xxxxx.com`和`http://detial.xxxxx.com`分别访问对应的静态资源。

- 与此同时，需要在云服务器官网添加记录，二级域名的`home`和`detial`的解析设置
```conf
server {
    # 设置监听端口
    listen      80;
    server_name  home.xxxxx.com;
    
    # 设置url编码格式，解决参数中文乱码问题
    charset utf-8;
		
    location / {
        root C:/v1/home;  # 设置 root-指定请求资源在服务器上的真实路径，可以写相对路径（相对于nginx安装目录）也可写绝对路径；
        index index.html index.htm;  # 指定访问主页，会在root设定目录下去找，后面可跟多个页面，依次查找，找到一个即返回；
    } 
}

server {
    # 设置监听端口
    listen      80;
    server_name  detial.xxxxx.com;
    
    # 设置url编码格式，解决参数中文乱码问题
    charset utf-8;
		
    location / {
        root C:/v1/detial;  
        index index.html index.htm;  
    } 
}
```

## 参考
[Nginx在windows下的安装、运行，以及配置文件讲解](https://blog.csdn.net/zorro_jin/article/details/84927408?spm=1001.2014.3001.5506)