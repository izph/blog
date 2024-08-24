(window.webpackJsonp=window.webpackJsonp||[]).push([[74],{745:function(t,s,a){"use strict";a.r(s);var e=a(13),n=Object(e.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"webpack5"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#webpack5"}},[t._v("#")]),t._v(" webpack5")]),t._v(" "),a("ul",[a("li",[t._v("node版本大于10.13.0")])]),t._v(" "),a("h2",{attrs:{id:"功能清除-清理弃用功能"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#功能清除-清理弃用功能"}},[t._v("#")]),t._v(" 功能清除：清理弃用功能")]),t._v(" "),a("ul",[a("li",[t._v("所有在webpack4里面被废弃的能力都被清除，因此需要确保webpack4没有打印警告。")]),t._v(" "),a("li",[t._v("require.includes语法已被废弃，可以通过 Rule.parser.requirelnclude 将行为改为允许、废弃或禁用。预加载一些模块，并不会马上执行")]),t._v(" "),a("li",[t._v("不再为Node.js模块引入polyfill，之前的版本是：如果某个模块依赖Node.js里面的核心模块，那么这个模块被引入的时候会把Node.js整个polyfill顺带引入。")])]),t._v(" "),a("h2",{attrs:{id:"长期缓存"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#长期缓存"}},[t._v("#")]),t._v(" 长期缓存")]),t._v(" "),a("p",[t._v('确定的模块ld、chunk和导出名称。在生产模式下，默认的chunklds:"deterministic", modulelds:"deterministic"。设置成deterministic时默认最小3位数会被使用，不会因为某一个文件发生了变化，其他的会产生变化。')]),t._v(" "),a("h3",{attrs:{id:"chunklds"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#chunklds"}},[t._v("#")]),t._v(" chunklds")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("选项值")]),t._v(" "),a("th",[t._v("描述")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[t._v("natural")]),t._v(" "),a("td",[t._v("按使用顺序的数字id。")])]),t._v(" "),a("tr",[a("td",[t._v("named")]),t._v(" "),a("td",[t._v("对调试更友好的可读的id。")])]),t._v(" "),a("tr",[a("td",[t._v("deterministic")]),t._v(" "),a("td",[t._v("在不同的编译中不变的短数字id。有益于长期缓存。在生产模式中会默认开启。")])]),t._v(" "),a("tr",[a("td",[t._v("size")]),t._v(" "),a("td",[t._v("专注于让初始下载包大小更小的数字id。")])]),t._v(" "),a("tr",[a("td",[t._v("total-size")]),t._v(" "),a("td",[t._v("专注于让总下载包大小更小的数字id。")])])])]),t._v(" "),a("h3",{attrs:{id:"modulelds"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#modulelds"}},[t._v("#")]),t._v(" modulelds")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("选荐值")]),t._v(" "),a("th",[t._v("描述")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[t._v("natural")]),t._v(" "),a("td",[t._v("按使用顺序的数字id。")])]),t._v(" "),a("tr",[a("td",[t._v("named")]),t._v(" "),a("td",[t._v("对调试更友好的可读的id。")])]),t._v(" "),a("tr",[a("td",[t._v("deterministic")]),t._v(" "),a("td",[t._v("被哈希转化成的小位数值模块名。")])]),t._v(" "),a("tr",[a("td",[t._v("size")]),t._v(" "),a("td",[t._v("专注于让初始下载包大小更小的数字id。")])])])]),t._v(" "),a("h2",{attrs:{id:"cache持久化缓存"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#cache持久化缓存"}},[t._v("#")]),t._v(" cache持久化缓存")]),t._v(" "),a("p",[t._v("在webpack4里面，可以使用cache-loader将编译结果写入硬盘缓存，还可以使用babel-loader，设置option.cacheDirectory将babel-loader编译的结果写进磁盘。")]),t._v(" "),a("h3",{attrs:{id:"webpack5缓存策略"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#webpack5缓存策略"}},[t._v("#")]),t._v(" webpack5缓存策略")]),t._v(" "),a("ul",[a("li",[t._v("默认开启缓存，缓存默认是在内存里。可以对cache进行设置。")]),t._v(" "),a("li",[t._v("缓存淘汰策略︰文件缓存存储在node_modules/.cache/webpack，最大500MB，缓存时常两个星期，旧的缓存先淘汰")]),t._v(" "),a("li",[t._v("后面打包可以直接利用它原生缓存的打包的能力")])]),t._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("module"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("cache")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 将缓存类型设置为文件系统")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("type")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'filesystem'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("buildDependencies")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 将你的 config添加为 buildDependency，以便在改变config时获得缓存无效")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("config")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("__filename"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\n            "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 如果你有其他的东西被构建依赖，你可以在这里添加它们")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 注意 webpack、加载器和所有从你的配置中引用的模块都会被自动添加")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br"),a("span",{staticClass:"line-number"},[t._v("11")]),a("br"),a("span",{staticClass:"line-number"},[t._v("12")]),a("br"),a("span",{staticClass:"line-number"},[t._v("13")]),a("br")])]),a("h2",{attrs:{id:"构建优化-treeshaking"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#构建优化-treeshaking"}},[t._v("#")]),t._v(" 构建优化：TreeShaking")]),t._v(" "),a("ul",[a("li",[t._v("支持嵌套的TreeShaking")]),t._v(" "),a("li",[t._v("可以分析这个模块直接的一个依赖关系")])]),t._v(" "),a("h2",{attrs:{id:"代码生成-支持生成es6代码"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#代码生成-支持生成es6代码"}},[t._v("#")]),t._v(" 代码生成：支持生成ES6代码")]),t._v(" "),a("ul",[a("li",[t._v("webpack 4之前只生成ES5的代码。webpack 5则现在既可以生成ES5又可以生成ES6/ES2015代码。")]),t._v(" "),a("li",[t._v("两种设置方式:"),a("code",[t._v("5 =<ecmaVersion <= 11或2009 =< ecmaVersion <= 2020")])])]),t._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("module"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("output")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("path")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" path"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("join")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("__dirname"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'dist'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("filename")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'bundle.js'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("ecmaVersion")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("6")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 输出ES6代码")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br")])]),a("h2",{attrs:{id:"开创性的特性-模块联邦"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#开创性的特性-模块联邦"}},[t._v("#")]),t._v(" 开创性的特性：模块联邦")]),t._v(" "),a("p",[t._v("基本解释: 使一个JavaScript 应用在运行过程中可以动态加载另一个应用的代码，并支持共享依赖(CDN)。不再需要本地安装Npm包。\n通过CDN加载，应用A通过一个CDN，它去加载应用B，然后这两个应用分别在不同的端口。使用组件或者模块的分享更加方便了")]),t._v(" "),a("ul",[a("li",[t._v("Remote: 被依赖方，被Host消费的 Webpack构建，提供一些组件或者依赖出来，给其他的依赖方去用，相当于服务提供方。")]),t._v(" "),a("li",[t._v("Host: 依赖方，消费其他 Remote 的 Webpack 构建，使用其他Remote提供的模块，")]),t._v(" "),a("li",[t._v("一个应用可以是Host，也可以是Remote，也可以同时是Host和Remote")])]),t._v(" "),a("h3",{attrs:{id:"开创性的特性-modulefederationplugin介绍"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#开创性的特性-modulefederationplugin介绍"}},[t._v("#")]),t._v(" 开创性的特性: ModuleFederationPlugin介绍")]),t._v(" "),a("p",[t._v("Webpack内部通过ModuleFederationPlugin 插件将多个应用结合起来。")]),t._v(" "),a("ul",[a("li",[t._v("name: 必须，唯一ID，作为输出的模块名，使用的时通过 "),a("code",[t._v("${name}/${expose}")]),t._v("的方式使用;")]),t._v(" "),a("li",[t._v("library: 必须，其中这里的name为作为umd的name;")]),t._v(" "),a("li",[t._v("remotes: 可选，表示作为Host时，去消费哪些Remote;")]),t._v(" "),a("li",[t._v("shared: 可选，优先用Host的依赖，如果Host没有，再用自己的;")]),t._v(" "),a("li",[t._v("main.js: 应用主文件")]),t._v(" "),a("li",[t._v("remoteEntry.js: 作为remote 时被引的文件")])]),t._v(" "),a("h2",{attrs:{id:"bundle和bundless"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#bundle和bundless"}},[t._v("#")]),t._v(" bundle和bundless")]),t._v(" "),a("h3",{attrs:{id:"bundle和bundless资源加载差异"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#bundle和bundless资源加载差异"}},[t._v("#")]),t._v(" bundle和bundless资源加载差异")]),t._v(" "),a("ul",[a("li",[t._v("bundle：浏览器加载的是构建好的文件，最开始会加载一个bundle.js；")]),t._v(" "),a("li",[t._v("bundless: 直接加载原文件，不是加载构建好的文件；")])]),t._v(" "),a("h3",{attrs:{id:"bundle和bundless打包速度对比"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#bundle和bundless打包速度对比"}},[t._v("#")]),t._v(" bundle和bundless打包速度对比")]),t._v(" "),a("ul",[a("li",[t._v("bundless的冷启动时间大大缩短（使用esbuild）")]),t._v(" "),a("li",[t._v("bundless的HMR速度不受整个项目体积影响，HMR效率高")]),t._v(" "),a("li",[t._v("bundless的单文件粒度的缓存更优")]),t._v(" "),a("li",[t._v("bundless在开发阶段的体验是更优的")])]),t._v(" "),a("h3",{attrs:{id:"vite构建速度快的原因"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#vite构建速度快的原因"}},[t._v("#")]),t._v(" vite构建速度快的原因")]),t._v(" "),a("p",[t._v("预构建使用ESBuild（冷启动快的原因），ESBuild使用golang进行打包")])])}),[],!1,null,null,null);s.default=n.exports}}]);