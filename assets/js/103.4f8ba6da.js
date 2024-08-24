(window.webpackJsonp=window.webpackJsonp||[]).push([[103],{786:function(s,t,a){"use strict";a.r(t);var e=a(13),n=Object(e.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h2",{attrs:{id:"usesearchparams"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#usesearchparams"}},[s._v("#")]),s._v(" useSearchParams")]),s._v(" "),a("p",[s._v("用于获取 URL 中的查询字符串：")]),s._v(" "),a("div",{staticClass:"language-jsx line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-jsx"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" searchKey "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("useSearchParam")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"key"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("这样，你就能获得 key 这个参数的值，并且在值发生变化时触发组件的刷新。")]),s._v(" "),a("h2",{attrs:{id:"useevent"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#useevent"}},[s._v("#")]),s._v(" useEvent")]),s._v(" "),a("p",[s._v("如果用 DOM 的原生 API 去绑定事件，通常我们需要在组件创建时去监听，再在组件销毁时取消监听，比较繁琐。而 useEvent 这个 Hook 封装了这部分逻辑，让我们使用起来非常方便。")]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("useEvent")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'keydown'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" onKeyDown"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("这样的话，我们就可以在页面上监听键盘按键的事件，而无需关心该在何时绑定监听，以及何时取消监听。")]),s._v(" "),a("h2",{attrs:{id:"usecookie"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#usecookie"}},[s._v("#")]),s._v(" useCookie")]),s._v(" "),a("p",[s._v("Cookie 也是常用的数据源之一，但浏览器自带的 Cookie API 使用起来很不方便，需要自己去解析 Cookie 的值，而 useCookie 则可以让你很方便地去读取、更新或者删除某个 Cookie。")]),s._v(" "),a("div",{staticClass:"language-jsx line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-jsx"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("value"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" updateCookie"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" deleteCookie"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("useCookie")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"my-cookie"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("h2",{attrs:{id:"useprevious"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#useprevious"}},[s._v("#")]),s._v(" usePrevious")]),s._v(" "),a("p",[s._v("这个 Hook 可以让你获取某个 State 的上一个值，有时我们需要比较前后值的变化，这时我们就能感受到 usePrevious 这个 Hook 的好用了。")]),s._v(" "),a("div",{staticClass:"language-jsx line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-jsx"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("count"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" setCount"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" React"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("useState")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 获取 cound 的上一个值")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" prevCount "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("usePrevious")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("count"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])])])}),[],!1,null,null,null);t.default=n.exports}}]);