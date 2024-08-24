(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{605:function(t,a,s){t.exports=s.p+"assets/img/computermode.395099e0.png"},723:function(t,a,s){"use strict";s.r(a);var r=s(13),_=Object(r.a)({},(function(){var t=this,a=t.$createElement,r=t._self._c||a;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h3",{attrs:{id:"计算机运行模式"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#计算机运行模式"}},[t._v("#")]),t._v(" 计算机运行模式")]),t._v(" "),r("p",[t._v("多数计算机有两种运行模式：内核态和用户态。\n软件中最基础的部分是操作系统，它运行在内核态。这内核态模式下，操作系统具有对所有硬件的完全\n访问权，可以执行机器能够运行的任何指令。软件的其余部分运行在用户态下，在用户态下，只能使用\n机器指令中的一个子集。")]),t._v(" "),r("p",[r("img",{attrs:{src:s(605),alt:"image.png"}})]),t._v(" "),r("h3",{attrs:{id:"用户与操作系统-内核态-的交互程序-shell"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#用户与操作系统-内核态-的交互程序-shell"}},[t._v("#")]),t._v(" 用户与操作系统（内核态）的交互程序：shell")]),t._v(" "),r("h3",{attrs:{id:"多路复用资源方式"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#多路复用资源方式"}},[t._v("#")]),t._v(" 多路复用资源方式")]),t._v(" "),r("p",[t._v("在时间上复用：当一种资源在时间上复用时，不同的程序或用户轮流使用它。\n在空间上复用：每个客户得到资源的一部分。")]),t._v(" "),r("h2",{attrs:{id:"第二章-进程与线程"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#第二章-进程与线程"}},[t._v("#")]),t._v(" 第二章 进程与线程")]),t._v(" "),r("h3",{attrs:{id:"一、进程"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#一、进程"}},[t._v("#")]),t._v(" 一、进程")]),t._v(" "),r("h4",{attrs:{id:"_1-进程模型"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_1-进程模型"}},[t._v("#")]),t._v(" 1. 进程模型")]),t._v(" "),r("p",[t._v("在进程模型中，计算机上所有可运行的软件（应用程序），通常也包括操作系统，被组织成若干顺序进程，简称"),r("strong",[t._v("进程")]),t._v("。一个进程就是一个正在执行程序的实例，包括程序计数器、寄存器和变量的当前值。")]),t._v(" "),r("h3",{attrs:{id:"二、线程"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#二、线程"}},[t._v("#")]),t._v(" 二、线程")]),t._v(" "),r("p",[t._v("人们需要多线程的主要原因是，在许多应用中同时发生着多种活动。其中某些活动随着时间的推移会被阻塞。通过将这些应用程序分解成可以准并行运行的多个顺序线程，程序设计模型会变得更简单。\n第二个关于需要多线程的理由是，由于线程比进程更轻量级，所以它们比进程更容易（即更快）创建， 也更容易撤销。在许多系统中，创建一个线程较创建一个进程要快10～100倍。需要多线程的第三个原因涉及性能方面的讨论。若多个线程都是 CPU 密集型的，那么并不能获得性能上的增强，但是如果存在着大量的计算和大量的 I/O 处理，拥有多个线程允许这些活动彼此重叠进行，从而会加快应用程序执行的速度。")]),t._v(" "),r("h4",{attrs:{id:"官方解释"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#官方解释"}},[t._v("#")]),t._v(" 官方解释")]),t._v(" "),r("p",[t._v("进程是CPU资源分配的最小单位\n线程是CPU调度的最小单位\n进程是程序的一次运行活动，也是操作系统在分配调度资源的一个独立单位，\n线程是进程的一个实体，一个进程至少有一个进程进程和线程是一对多的关系，\n进程和线程的主要区别在于：进程是有独立的地址间，而线程是没有的\n同一个进程下的线程是共享进程的地址空间的，切线程比切换进程的开销低，效率高")]),t._v(" "),r("p",[t._v("一个进程可以有很多线程，同一进程中的多个线程享该进程中的全部系统资源，同一进程中的多个线有各自的调用栈，线程本地存储。\n浏览器是有多进程的")]),t._v(" "),r("ol",[r("li",[t._v("Browser进程 负责浏览器界面显示，资源的管理")]),t._v(" "),r("li",[t._v("第三方插件进程 每种类型的插件对应一个进程仅当使用该插件时才创建")]),t._v(" "),r("li",[t._v("GPU进程 负责3D绘制")]),t._v(" "),r("li",[t._v("浏览器内核：Render进程，内部是多线程的\n"),r("ul",[r("li",[t._v("GUI渲染引擎 线程 负责渲染浏览器界面，解析HTML，CSS，构建DOM树和RenderObject树，布局和绘制等")]),t._v(" "),r("li",[t._v("JS引擎 单线程  解析和执行Javascript来实现网页特效")]),t._v(" "),r("li",[t._v("事件触发 线程")]),t._v(" "),r("li",[t._v("定时器 线程")]),t._v(" "),r("li",[t._v("异步http请求 线程")])])])])])}),[],!1,null,null,null);a.default=_.exports}}]);