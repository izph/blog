---
title: Koa 基础开发 
date: 2022-02-20 19:35:10
categories:
  - 前端
tags:
  - Node
  - Koa
toc: true # 是否启用内容索引
comments: true
copyright: false
---
[koa官网文档](https://koa.bootcss.com/#)

koa是一个基于http模块进行封装的框架，koa本身没有内置任何中间件，需要手动下载中间件（约定了中间件的写法），可以用来做服务端接口，也可以做接口的转发和聚合，RPC服务组装、SSR。

koa导出的是一个类，需要通过new 来实例化，koa也是继承了Events模块，性能非常好，代码量少，易于定制，很多框架都是基于koa进行定制开发（egg，thinkjs、midway都是基于koa2）。

# 基于koa框架的web开发要点

ES6语法、异步流程控制、数据库操作、API接口转发、HTTP集成、Koa中间件

# koa与express的区别

- koa中间件可以对请求和响应同时进行拦截，express只能对请求进行拦截，而且是有顺序的，不能对响应进行拦截。
- koa和express都内置了cookies模块、http模块，此外，express还内置了路由、视图模块。相对于express，koa还是比较轻量的。

# koa中间件写法

- 中间件可以分为全局中间件和局部中间件，局部中间件在对应的路由里生效，比如静态资源服务，在特定的路由才执行
- 中间件是框架的扩展机制，对请求响应过程中加入中间件，应对处理复杂的业务逻辑。挂载在入口文件的中间件，会按照顺序执行。
- koa中间件是洋葱模型，跳转的信号是next()，通过compose实现，最终的返回值是一个 function(context, next)。
```js
compose([fl, f2,..,fn])转化为了f1(..f(n-1)(fn(noop()))
```
- 在koa引入的中间件，需要使用app.use将中间件挂载到app上
```js
app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(2)
})

app.use(async (ctx, next) => {
  console.log(3)
  await next()
  console.log(4)
})

// 输出的结果是1342
```
## koa中间件的工作过程
中间件类似一个过滤器，koa中间件的工作大致过程可以分为三部分：
- 处理请求前先完成一些准备工作。
- 进行业务逻辑处理或通过next将业务交由下一个中间件处理。
- 后面的中间件完成处理后会进行回溯，执行处理后的操作。

# ctx 参数

## ctx头部信息

- 设置头部信息：`ctx.header(ctx.headers)`
- 获取头部信息：`ctx.get('key')`
- ctx.method，获取请求方法
- ctx.status或者ctx.response.status，获取状态码和设置状态码
- ctx.type，设置Content-Type
- ctx.response.header = ctx.request.header = ctx.header
- ctx.req = ctx.res = ctx.request = ctx.response

## ctx地址参数

koa解析`http://127.0.0.1:3000/api/v1/getUser?a=1&b=2#abc`地址后，会将返回的结果赋值给ctx对象。

|       API       |                       示例值                       |
| :-------------: | :------------------------------------------------: |
|    ctx.href（不包括hash） | `http://127.0.0.1:3000/api/v1/getUser?a=1&b=2` |
|    ctx.path    |               /api/v1/getUser               |
|     ctx.url     |           /api/v1/getUser?a=1&b=2           |
|   ctx.search   |                      ?a=1&b=2                      |
| ctx.querystring |                      a=1&b=2                      |
|    ctx.query    |                 `{"a": "1","b": "2"} `             |
|   ctx.origin   |               `http://127.0.0.1:3000`               |
|    ctx.host    |                   127.0.0.1:3000                   |
|  ctx.hostname  |                     127.0.0.1                     |
|  ctx.protocol  |                        http                        |
|   ctx.secure（https为true）   |          false                       |

## 获取不同的参数

| 参数名称 |                          描述                          | Express获取方法 | Koa获取方法 |                                依赖模块                                |
| :------: | :----------------------------------: | :-----------------: | :--------------: | :--------------------------------------------------------------------: |
|  params  |                具名参数，比如`/users/:id`                |     req.params     |    ctx.params    | Koa需要依赖koa-router内置的ctx.params，而Express中有内置路由，无须依赖 |
|  query  |                   查询字符串`?a=1&b=2`                   |      req.query      |    ctx.query    |                             内置，无须依赖                             |
|   body   | 带有body请求的POST类方法，请求体body内容 |      req.body      | ctx.request.body |          Express依赖bodyparser模块，Koa依赖koa-bodyparser模块          |

## koa写入cookie

cookie的value默认是不能中文，可以使用buffer将中文转化后使用（通用的方法）

```js
// 设置signed: true  必须要app.keys = ['xxx'] 设置加密秘钥
// app.keys = ['xxx'] 

ctx.cookies.set('name', 'value', { 
    // signed: true,
    httpOnly: true,
    maxAge: 1000 * 30, // 30秒过期
});
// maxAge: 一个数字, 表示从 Date.now() 得到的毫秒数.
// expires: 一个 Date 对象, 表示 cookie 的到期日期 (默认情况下在会话结束时过期).
// path: 一个字符串, 表示 cookie 的路径 (默认是/).
// domain: 一个字符串, 指示 cookie 的域 (无默认值).
// secure: 一个布尔值, 表示 cookie 是否仅通过 HTTPS 发送 (HTTP 下默认为 false, HTTPS 下默认为 true).
// httpOnly: 一个布尔值,  客户端无法操作cookie (默认为 true).
// sameSite: 一个布尔值或字符串, 表示该 cookie 是否为 "相同站点" cookie (默认为 false). 可以设置为 'strict', 'lax', 'none', 或 true (映射为 'strict').
// signed: 一个布尔值, 表示是否要对 cookie 进行签名 (默认为 false).  此签名密钥用于检测下次接收 cookie 时的篡改.
// overwrite: 一个布尔值, 表示是否覆盖以前设置的同名的 cookie (默认是 false). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie（无论路径或域）是否在设置此Cookie 时从 Set-Cookie 消息头中过滤掉.
```

# koa-router中间件
```js
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')()

// 指定路由前缀
// router.prefix('/users')

router.get('/', async (ctx, next) => {
    ctx.body = '<h1>koa-router</h1>' // 返回HTML
    // ctx.body = 'koa-router' // 返回 文本
    // ctx.body = { a: 1, b: 2} // 返回json
    // await ctx.render('index', { title: 'hello koa2'})
})

// 将路由挂载到app上
app.use(router.routes()).(router.allowedMethods());

app.listen(8888);
```
## ctx.body的工作原理
根据body的类型设置对应的Content-Type，根据Content-Type调用res.write，将数据写入浏览器。可以知道，赋予ctx.body不同类型的值时会返回不同的结果：
- 为ctx.body赋值JSON对象时，服务器会返回JSON接口；
- 为ctx.body赋值字符串时，服务器会返回 HTML文本；
- ctx.render是因为添加了koa-views 中间件而绑定到ctx上的，原本的ctx上是没有render函数的。也就是说，我们可以通过中间件在ctx上绑定我们要使用的功能对象方法。

## koa-router路由实现原理

- 本质上就是对ctx.path进行封装。定义路由，路由的路径会被转义成正则表达式，匹配请求，使用中间件进行处理。
- koa-router的核心是路由的解析，使用的是path-to-regexp模块（express也使用了该模块），express路由和koa-router路由的区别是中间件的写法不同
- 匹配请求时，只和路径有关。qureyString参数是不会考虑在内的。比如

```js
router.get('/v1') // GET /v1?name=zhongph  也会匹配上
```
- 具名参数，:xxx会被从正则表达式提前处理，具名参数通过ctx.params.xxx获取

```js
router.get('/user/:id', (ctx, next) => {
    console.log(ctx.params.id)
}) 
```

- 路由也是中间件，可以定义多个中间件，在这个例子里，第一个中间件根据ID查询到的用户，先被绑定到了ctx对象上，然后交给了下一个中间件进行处理。接着，第二个中间件根据第一个中间件产生的ctx.user完成某些内容，最终决定返回何值。

```js
router.get('/users/:id', 
    function (ctx, next){
        return User.find0ne (ctx.params.id).then(function (user) {
            ctx.user = user;
            return next();
        })
    },
    function (ctx){
        console.log(ctx.user);
        //  { id: '001', name:"zhongph" }
    }
)  
```
# koa-static静态服务
静态服务器是通过静态HTTP服务器来提供HTML、JavaScript、CSS文件及图片的托管服务的.Node.js世界里的 koa-static、http-server等模块和常见的Apache、Nginx功能类似。线上通用做法是将静态资源放到CDN上，利用CDN就近访问来提高访问效率。实际开发环境，通过koa-static等模块能快速实现静态服务器功能。

koa-static的做法是：
- 判断请求的文件是否存在，如果存在读取文件返回；如果请求的文件不存在，默认返回当前路径下的index.html
- 不要把static中间件放到Koa的全局中间件上（如果对于每个请求都要判断一次是不是静态资源，会影响QPS)，最好结合koa-router来处理，按需挂载
- （QPS：每秒查询率QPS是对一个特定的查询服务器在规定时间内所处理流量多少的衡量标准）
```js
const staticServer = require('koa-static');
const router = require('koa-router')();
router.get('/public/*', async (ctx, next) => {
    ctx.url = path.basename(ctx.url)
    await next()
}, staticServer(resolve('./public'), { gzip: true})
)
```
## koa-static的底层实现
koa-static的底层使用的是koa-send
### koa-send原理
- 根据文件后缀名，进行设置 Content-Type。
- 以 stream 的形式为 ctx.body 赋值，这种方式比 fs.readFileSync 更高效。
```js
if (!ctx.type) {
    ctx.type = type(path, encodingExt);
}
ctx.body = fs.createReadStream(path);
```
其中 ctx.type是根据文件后缀来设置Content-Type的便捷方法，代码如下。
```js
// extname 和 basename 是path模块的方法
function type(file, ext){
    return ext !== '' ? extname(basename(file, ext)) : extname(file);
}
```

## 静态服务原理
根目录下有static文件夹和index.js，static目录下有index.html文件、image和css文件夹，分别放置对应文件。
```js
const Koa = require('koa')
const fs = require('fs')
const path = require('path')

// 设置一个mime map，设计三种测试类型
const MIMES_MAP = {
  'css': 'text/css',
  'html': 'text/html',
  'jpg': 'image/jpeg'
}

const app = new Koa()

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static'

// 解析资源类型
function parseMime(url) {
  let extName = path.extname(url)
  extName = extName ? extName.slice(1) : 'unknown'
  return MIMES_MAP[extName]
}

app.use(async (ctx) => {
  // 静态资源目录在本地的绝对路径
  let fullStaticPath = path.join(__dirname, staticPath)

  // 获取静态资源内容，有可能是文件内容，目录，或404
  let content = fs.readFileSync(path.join(fullStaticPath, ctx.url), 'binary')

  // 解析请求内容的类型
  let mime = parseMime(ctx.url)

  // 如果有对应的文件类型，就配置上下文的类型
  if (mime) {
    ctx.type = mime
  }

  // 输出静态资源内容
  if (mime && mime.indexOf('image/') >= 0) {
    // 如果是图片，则用node原生res，输出二进制数据
    ctx.res.writeHead(200)
    ctx.res.write(content, 'binary')
    ctx.res.end()
  } else {
    // 其他则输出文本
    ctx.body = content
  }
})

app.listen(4000, () => {
  console.log('server is running, port is 4000')
})
```
# koa-mount
koa-static不能用来设置请求前缀，如果想实现这个功能，就需要用到koa-mount，koa-mount是一个将中间件挂载到指定路径的Koa中间件，它可以挂载任意koa中间件。koa-mount和koa-static结合，就可以实现和Express一样的静态服务器带有请求前缀的功能，代码如下。

```js
const Koa = require('koa');
const koaStatic = require('koa-static');
const mount = require('koa-mount');
const app = new Koa();
// app.use(koaStatic('.'))

// 设置请求前缀
app.use(mount('/static', koaStatic('.'))
app.listen (3000);

// 访问 http:/127.0.0.1:3000/static/package.json
```
# koa-views

- koa-views是一个koa的动态模板引擎渲染中间件，主要用于简单的前后端不分离的项目。通过控制路由的方式，返回不同的页面。以前的服务端渲染页面，如JSP/PHP，就是指模板引擎。

- 模板引擎采取了一种复用思想，通过定义模板，在使用时和数据一起编译，生成HTML页面，以便浏览器渲染。`编译(模板＋数据) = HTML`，模板是不可变的，可变的是数据，然而数据是从哪里来的呢? 可以从数据库读取，可以访问接口获得，甚至可以模拟，具体取决于业务场景。

- 模板推荐：ejs、pug（jade）

```js
const views = require('koa-views');

// 通过app.use绑定到app上，实际上是给app对象增加ctx.render方法的绑定
app.use(views(__dirname + '/views', { 
    extension: 'pug'
}))

// 模板文件：views/index，相对位置在views目录下
router.get('/', async (ctx, next) => {
    await ctx.render('index', { title: 'hello koa2'}) // ctx.render渲染模板
})
```

1. 这里的ctx.render就是用于渲染模板的方法，它有两个参数。

- index: 模板，采用相对路径，对应的是views目录下的index.pug。
- JSON对象: 需要传入到模板内的数据。

2. ctx.render 执行的操作：

- 通过文件读取 index.pug 模板。
- 使用 pug 模板引擎编译器将数据和模板内容编译为 HTML 字符串。
- 将 Content-Type 设置为 text/html。
- 将 statusCode 状态码设置为200。
- 通过 http模块 底层的 res.write 和 res.end 方法将 HTML 字符串写入浏览器

## 模板引擎

模板引擎的用途：用于动态渲染页面，与cli结合，作为模板使用

### ejs

- 语句的需要有 <%  %> （尖括号和百分号）
- 如果需要填入变量，需要在<%添加一个等号，<%=

```ejs
<ul>
    <% user.forEach(function(user){ %>
        <li> <%= user.name %></li>
    <% }) %>
</ul>
```
### pug

- （安装`npm i -s pug`）pug的基本使用：在这段模板定义代码里，if语句首先判断user对象是否存在，如果存在就显示`<h2>`标签，并把user.name作为变量嵌入`<h2>`标签的显示内容里。
```pug
//- user.pug
if user
    h2= user.name
```
- pug的编译：使用 pug-cli 或 pug-server 可以自动将模板文件编译为HTML文件，并提供HTTP静态服务。此外，在线转化工具 html2jade，它可以将已有的HTML 代码转换为pug模板，非常的使用。

- 使用模板引擎（pug）时要注意：
    - 引用公共模块时使用include。实现父子布局继承时使用extends。
    - 定义布局模板时使用Layout，布局留空时使用block。缩进时使用Tab键而非空格。
    - 不管有没有属性，标签和value之间都要有空格。
    - 可以通过预编译来提高模板执行效率。


- 编译pug

```js
const pug = require('pug');
const fs = require('fs');

// 通过fs.readFileSync读取模板文件
// 当读取到的内容通过 toString 转化为字符串
const user_pug_str = fs.readFileSync('./user.pug').toString();

// pug.render方法进行编译，编译后的结果是HTML代码
var user_html = pug.render(user_pug_str, {
    user: {
        name: 'yolo'
    }
})

console.log(user_html) // 编译结果 <h2>yolo</h2>
```

- for循环显示列表

```pug
//- list.pug
ul
    each item in users
        li= item.name
```

### pug模板引擎规则

1. 标签属性

```pug
p#root.container
//- 等价于
p(id='root', class='container')
//- <p id='root' class='container'></p>
```

2. 标签内容value，标签与内容之间有空格

```pug
p this is a tag
//- <p>this is a tag</p>
```

3. 层级嵌套
   原理：利用缩进来判断包含关系。缩进方式有两种：使用空格和使用Tab建（推荐Tab键）

```pug
<ul class="parent">
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>

//- pug写法
ul.parent
    li 1
    li 2
    li 3
```

4. 变量

```pug
//- 代码里等号，表示后面接的是变量，子类extends继承该布局时，name变量在子页面里也可以使用
p= name 

//- 插写法
p #{ name }

//- 不转义代码 !{ html }
!{ "<script></script>" }
```

5. if和each

```pug
//- user.pug
if user
    h2= user.name

//- list.pug  index是下标
ul
    each item, index in users
        li= item.name
```

6. 布局

```pug
//- extends指明了当前pug页面需要继承哪个layout布局
extends ../layout

//- 实现block模块，名字必须和layout里一致
block left_content

block main_content
```

7. 内嵌sctipt代码，script后面的点 `.`必须要有

```pug
script.
    function test(){}
```

# koa-compose

可以将多个中间件合并成一个中间件

```js
const compose= require('koa-compose')

module.exports = (ctx, next) => {
return compose([
    (ctx,next) => {
        //中间件
        return next()
    }
    (ctx, next) => {
        //中间件
        return next()
    }
])(ctx, next)
}
```
# koa-bodyparser

koa-bodyparser中默认只支持JSON、form两种格式的解析，其他类型的解析需要在enableTypes中配置，如`'text/plain'`配置为text。

```js
const bodyparser = require('koa-bodyparser')
// 将bodyparser挂载到app上
app.use(bodyparser(
    // 配置更多的类型
    enableTypes: ['json', 'form', 'text']
))
// 访问 body参数
ctx.request.body
// 如果post请求后面拼接了参数， 也可以通过ctx.query获取
```

# @koa/cors
跨域问题
```js
// 安装 @koa/cors 或者 koa2-cors（很久没有更新）
// npm i koa2-cors
const cors = require('@koa/cors') //  https://www.npmjs.com/package/@koa/cors

// 这里cors中间件一定要写在路由之前
app.use(cors());
app.use(router.routes(), router.allowedMethods())
```
# @koa-multer（文件上传模块）
文件上传有两种方式:
- 调用CDN的 SDK将文件直接从前端上传到CDN上；
- 采用常规上传方式，先将文件上传到Node.js服务器，再由 Node.js服务器转存到CDN；
- 二者的差别在于是否需要通过服务器对文件进行定制，如果没有这样的需求，直接上传就是很不错的方式。

@koa-multer是一个非常便于使用的文件上传模块，使用@koa-multer可以解析body中的流，并将其保存成文件。@koa-multer不会处理multipart/form-data以外的任何表单

- [@koa/multer文件上传](https://blog.csdn.net/qq_42778001/article/details/104442163)

```js
const Koa = require('koa')
const Router = require('koa-router')
const route = new Router()
const multer = require('@koa/multer')
const path = require('path')
//上传⽂件存放路径、及⽂件命名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname ,'/public'))
    },
    filename: function (req, file, cb) {
        let type = file.originalname.split('.')[1]
        cb(null, `${file.fieldname}-${Date.now().toString(16)}.${type}`)
    }
})
//⽂件上传限制
const limits = {
    fields: 10,  // ⾮⽂件字段的数量
    fileSize: 500 * 1024,  //⽂件⼤⼩单位 b
    files: 1 // ⽂件数量
}
const upload = multer({storage,limits})

// 在路由中，可通过 ctx.file 获取上传完毕的⽂件信息，多⽂件上传可通过 ctx.files 获取
route.post('/user/file', async (ctx,next)=>{
  // file名字前后端要一致
    let err = await upload.single('file')(ctx, next)
                .then(res=>res)
                .catch(err=>err)
    if(err){
        ctx.body = {
            code:0,
            msg : err.message
        }
    }else{
        ctx.body = {
            code:1,
            data:ctx.file
        }
    }
  })
})
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000)
  
```
# 在koa中发起请求（node-fetch和axios）
## node-fetch
- [node-fetch](https://www.npmjs.com/package/node-fetch)
```js
// npm i --save-dev node-fetch
const fetch = require('node-fetch')
fetch('http://127.0.0.1:3000/users/post',
    {   
        method: 'POST',
        body: JSON.stringify({
            username: 'yourUsername',
            password: 'yourPassword'
        }),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(function(res) {
        return res.json();
    }.then(function (json){
        console.log(json)
    }
```
# API访问鉴权：JSON Web Tokens(JWT)

## 直接使用原始的JWT进行鉴权

- 客户端申请令牌时，使用jwt.sign进行签名，并将签名结果返回客户端；
- 签名体(payload）会包含用户的必要信息，以便通过 jwt.verify进行校验时能获得该信息，作为后面的查询依据；
- 当API请求携带令牌时，需要先使用jwt.verify进行校验，成功后才能根据用户信息查询并返回数据。

```js
const jwt = require('jsonwebtoken');
const secret = 'secretxxx';
var token = jwti.sign({
    data: {
        user_id: 100000,
        username: 'yolo',
        user_email:'yolo.com'
    }, secret, { expiresIn: '1h'});
})

// 获取令牌信息
// 检查PoST的信息、URL查询参数、头部信息
const token = ctx.request.body.token || ctx.query.token || ctx.headers['x-access-token']


// 验证
try{
    var decoded = jwt.verify(token, secret)
    console.log(decoded);
}catch (err) {

}
```

## 使用koa-jwt模块

```js
const jwt = require('koa-jwt');

router.get('/api', jwt({ secret: 'secretXXX'}), (ctx, next) => {

})
```

# koa-etag（ETag处理）

ETag 是前端缓存优化的重要部分。ETag 在服务器端生成后，客户端将通过If-Match或If-None-Match条件判断请求来验证资源是否被修改，其中比较常用的是If-None-Match。如果资源没有被修改则返回304状态码，如果被修改则返回正常值。
一般的静态 HTTP服务器都会根据文件内容来判断文件是否被修改，进而决定是否需要给客户端返回新内容。
在Koa里，我们需要使用koa-conditional-get和 koa-etag插件来提供ETag 功能，示例如下。

- 这里定义的变量etag就是在Koa中用于生成ETag 的中间件。
- ETag缓存是通过conditional-get拦截才能生效的。
- koa-conditional-get 一定要放在koa-etag 前面。

```js
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
 t机市用
// etag模块 通常和 conditional-get 模块一起使用
app.use(conditional());
app.use(etag());
```

### koa-session(会话session)

1. koa-session + ioredis
2. koa-generic-session + koa-redis(基于redis存储)

- 依赖Redis，因此需要先启动Redis服务器。
- 通过ctx.session进行会话信息处理。
- TTL是Session Store的超时时间，这个值一般是30min。

```js
const Koa = require('koa')
const session = require('koa-generic-session')
const RedisStore = require('koa-redis')
const app = new Koa()

app.keys = ['keys', 'keykeys'];
//加入全局中间件
app.use(session({   
    store: new RedisStore(),
    ttl: 30 * 60 * 1000  // 半小时
}))
// Session Store其实就是将会话存储在不同持久化存储中以后抽象出来的通用层，其基本的存、取和销毁操作如下。
// - get(sid): 根据sid来获取会话信息。
// - set(sid, sess, ttl): 通过sid设置会话信息，ttl指的是会话可存活时间(ms
// - destroy(sid): 根据sid销毁会话。

// 在路由中可以直接通过ctx.session对后面的中间件进行操作
app.use (ctx => {
switch (ctx, path){
    case '/get':
        ctx.session.user = { name: 'yolo' }
        ctx.body = ctx.session.user
        break;
    case '/remove':
        ctx.session =null
        ctx.body = "removed"
        break
}
app.listen (8080)
```
# log4js(日志处理)

- [log4js](https://www.npmjs.com/package/log4js)

```js
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
logger.debug("Some debug messages");
```

# 参考
- [koa官网文档](https://koa.bootcss.com/#)
- 《Koa开发 入门、进阶与实战》
- 《Node.js12 实战》
- 《狼叔卷2》