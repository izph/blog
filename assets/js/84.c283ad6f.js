(window.webpackJsonp=window.webpackJsonp||[]).push([[84],{760:function(t,a,s){"use strict";s.r(a);var r=s(13),n=Object(r.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"javascript中常见的错误类型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#javascript中常见的错误类型"}},[t._v("#")]),t._v(" JavaScript中常见的错误类型")]),t._v(" "),s("h2",{attrs:{id:"_1、syntaxerror"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1、syntaxerror"}},[t._v("#")]),t._v(" 1、SyntaxError")]),t._v(" "),s("p",[t._v("Uncaught SyntaxError是语法错误，所有的代码都不会执行，Uncaught SyntaxError：Invalid or unexpected token 表示无效或者意外的标记。")]),t._v(" "),s("p",[t._v("JSON.parse()中的参数不允许是空的字符串，否则会出现SyntaxError错误")]),t._v(" "),s("h2",{attrs:{id:"_2、referenceerror"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2、referenceerror"}},[t._v("#")]),t._v(" 2、ReferenceError")]),t._v(" "),s("p",[t._v("Uncaught ReferenceError是引用错误，如Uncaught ReferenceError：a is not defined，错误之前的代码会执行，遇到引用错误，会中断代码的执行。")]),t._v(" "),s("h2",{attrs:{id:"_3、rangeerror"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3、rangeerror"}},[t._v("#")]),t._v(" 3、RangeError")]),t._v(" "),s("p",[t._v("Uncaught RangeError是超出范围的错误，如无效的数组长度，var arr = [1, 2, 3];  arr.length = -1;")]),t._v(" "),s("p",[t._v("报错：Uncaught RangeError: Invalid array length。")]),t._v(" "),s("h2",{attrs:{id:"_4、typeerror"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4、typeerror"}},[t._v("#")]),t._v(" 4、TypeError")]),t._v(" "),s("p",[t._v("Uncaught Type Error 是类型错误，如123()。")]),t._v(" "),s("p",[t._v("Uncaught TypeError：123 is not a function。")]),t._v(" "),s("h2",{attrs:{id:"_5、urierror"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_5、urierror"}},[t._v("#")]),t._v(" 5、URIError")]),t._v(" "),s("p",[t._v("Uncaught URIError是URI错误，如decodeURI('%fdsdf%');")]),t._v(" "),s("p",[t._v("decodeURI方法并不能解码字符串'%fdsdf%'，报错：Uncaught URIError: URI malformed at decodeURI。")]),t._v(" "),s("h2",{attrs:{id:"_6、自定义错误"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_6、自定义错误"}},[t._v("#")]),t._v(" 6、自定义错误")]),t._v(" "),s("div",{staticClass:"language-javascript line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 自定义错误")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" err01 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Error")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'代码错误了'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" err02 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SyntaxError")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'语法错误了'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" \n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" err03 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ReferenceError")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'引用错误了'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" \n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" err04 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("RangeError")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'范围越界'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" \n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" err05 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TypeError")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'类型错误了'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  \n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br")])]),s("h2",{attrs:{id:"_7、throw-抛出错误信息"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_7、throw-抛出错误信息"}},[t._v("#")]),t._v(" 7、throw '抛出错误信息'")]),t._v(" "),s("p",[t._v("throw就是抛出一些信息，不一定是抛出错误，我们可以抛出一些信息，这个信息可以自定义。")]),t._v(" "),s("p",[t._v("throw '自定义信息'，但是为了保证语义清晰，不建议用 throw 表达任何非异常信息。")]),t._v(" "),s("h2",{attrs:{id:"_8、try-catch"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_8、try-catch"}},[t._v("#")]),t._v(" 8、try catch")]),t._v(" "),s("p",[t._v("try 部分用于标识捕获异常的代码段，catch 部分则用于捕获异常后做一些处理，而 finally 则是用于执行后做一些必须执行的清理工作。即使在 try 中出现了 return，finally 中的语句也一定要被执行。")]),t._v(" "),s("div",{staticClass:"language-javascript line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("try")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("a"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("catch")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("e"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("e"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("' : '")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" e"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("message"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("finally")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"finally"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br")])]),s("p",[t._v('捕获到的错误信息，ReferenceError : a is not defined，并且会打印"finally"')]),t._v(" "),s("p",[t._v("e.name就是错误的类型(ReferenceError)，e.message是错误信息(a is not defined)，e就是一个错误对象")]),t._v(" "),s("h2",{attrs:{id:"处理错误的方法"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#处理错误的方法"}},[t._v("#")]),t._v(" 处理错误的方法")]),t._v(" "),s("ul",[s("li",[t._v("try catch")]),t._v(" "),s("li",[t._v("Promise.catch()")]),t._v(" "),s("li",[t._v("unhandledrejection")]),t._v(" "),s("li",[t._v("window.onerror")]),t._v(" "),s("li",[t._v("window.addEventListener")])]),t._v(" "),s("h2",{attrs:{id:"总结"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[t._v("#")]),t._v(" 总结")]),t._v(" "),s("p",[t._v("在具体到实际工作中，我们要处理的异常分为以下几种：")]),t._v(" "),s("ol",[s("li",[t._v("语法错误及代码异常：对可疑区域增加 try-catch，全局增加 window.onerror;")]),t._v(" "),s("li",[t._v("数据请求异常：使用 promise-catch 处理 Promise 异常，使用 unhandledrejection 处理未捕获的Promise异常，使用 try-catch 处理 async/await 异常;")]),t._v(" "),s("li",[t._v("静态资源加载异常：在元素上添加 onerror，全局增加 window.addEventListener；")])])])}),[],!1,null,null,null);a.default=n.exports}}]);