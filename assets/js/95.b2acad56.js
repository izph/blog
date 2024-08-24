(window.webpackJsonp=window.webpackJsonp||[]).push([[95],{773:function(t,a,r){"use strict";r.r(a);var s=r(13),_=Object(s.a)({},(function(){var t=this,a=t.$createElement,r=t._self._c||a;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h2",{attrs:{id:"什么是垃圾回收"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#什么是垃圾回收"}},[t._v("#")]),t._v(" 什么是垃圾回收")]),t._v(" "),r("p",[t._v("垃圾回收是一种自动的内存管理机制。当计算机上的动态内存不再需要时，就应该予以释放，以让出内存。直白点讲，就是程序是运行在内存里的，当声明一个变量、定义一个函数时都会占用内存。内存的容量是有限的，如果变量、函数等只有产生没有消亡的过程，那迟早内存有被完全占用的时候。这个时候，不仅自己的程序无法正常运行，连其他程序也会受到影响。好比生物只有出生没有死亡，地球总有被撑爆的一天。所以，在计算机中，我们需要垃圾回收。需要注意的是，定义中的“自动”的意思是语言可以帮助我们回收内存垃圾，但并不代表我们不用关心内存管理，如果操作不当，JavaScript 中依旧会出现内存溢出的情况。")]),t._v(" "),r("h2",{attrs:{id:"垃圾回收机制原理"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#垃圾回收机制原理"}},[t._v("#")]),t._v(" 垃圾回收机制原理")]),t._v(" "),r("p",[t._v("垃圾回收基于两个原理：")]),t._v(" "),r("ul",[r("li",[t._v("1、考虑某个变量或对象在未来的程序运行中将不会被访问")]),t._v(" "),r("li",[t._v("2、向这些对象要求归还内存")])]),t._v(" "),r("p",[t._v("而这两个原理中，最主要的也是最艰难的部分就是找到“所分配的内存确实已经不再需要了”。")]),t._v(" "),r("h2",{attrs:{id:"垃圾回收方法"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#垃圾回收方法"}},[t._v("#")]),t._v(" 垃圾回收方法")]),t._v(" "),r("p",[t._v("现在各大浏览器通常用采用的垃圾回收有两种方法：标记清除、引用计数。")]),t._v(" "),r("h3",{attrs:{id:"_1-引用计数"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_1-引用计数"}},[t._v("#")]),t._v(" 1. 引用计数")]),t._v(" "),r("p",[t._v("这是最初级的垃圾回收算法（老牌浏览器使用：IE）。引用计数的策略是跟踪记录每个值被使用的次数。当声明了一个变量并将一个引用类型赋值给该变量时，这个值得引用次数就加一，如果该变量的值变成了另一个，则这个值得引用次数就减一，当这个值的引用次数为0的时候，说明没有变量在使用，这个值无法访问。由此可以将其占用的空间回收，这些垃圾回收器就会在运行时清理掉引用次数为0的值占用的空间，但这种方法容易引起内存泄漏，因为这种方式没有解决循环引用的问题，所以不建议使用！")]),t._v(" "),r("h3",{attrs:{id:"_2-标记清除"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_2-标记清除"}},[t._v("#")]),t._v(" 2. 标记清除")]),t._v(" "),r("p",[t._v("这是javascript中最常用的垃圾回收方式。当变量进入执行环境是，就标记这个变量为“进入环境”。从逻辑上讲，永远不能释放进入环境的变量所占用的内存，因为只要执行流进入相应的环境，就可能会用到他们。当变量离开环境时，则将其标记为“离开环境”。")]),t._v(" "),r("p",[t._v("垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记。然后，它会去掉环境中的变量以及被环境中的变量引用的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后。垃圾收集器完成内存清除工作，销毁那些带标记的值，并回收他们所占用的内存空间。")])])}),[],!1,null,null,null);a.default=_.exports}}]);