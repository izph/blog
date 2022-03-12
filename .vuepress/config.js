module.exports = {
  // 文档标题
  title: "iZph",
  // 文档说明
  base: "/blog/",
  description: 'Stick to your original intention and become a better self.',
  dest: "public",
  head: [
    ['link', { rel: 'shortcut icon', type: "image/x-icon", href: `/favicon.ico` }],
    ["meta", {name: "viewport",  content: "width=device-width,initial-scale=1,user-scalable=no"}]
  ],
  port: '8888',
  theme: "reco",
  themeConfig: {
    nav: [
      {
        text: "主页",
        link: "/",
        icon: "reco-home"
      },
      {
        text: "前端",
        // link: "/前端",
        icon: "reco-home",
        items:[
          { text: 'HTML', link: '/前端/HTML/HTMLNoteOne.md' },
          { text: 'CSS', link: '/前端/CSS/CSSNoteOne.md' },
          { text: 'JavaScript', link: '/前端/JavaScript/01-初识V8底层.md' },
          { text: 'TypeScript', link: '/前端/TypeScript' },
          { text: 'React', link: '/前端/React/01-React常用生命周期.md' },
        ]
      },
      {
        text: "后端",
        // link: "/前端",
        icon: "reco-home",
        items:[
          { text: 'Node', link: '/后端/Node/观察者模式.md' },
          { text: 'Koa', link: '/后端/Koa' },
        ]
      },
      {
        text: "其他",
        // link: "/前端",
        icon: "reco-home",
        items:[
          { text: '计网', link: '/其他/计网' },
          { text: '浏览器', link: '/其他/浏览器' },
          { text: 'webpack', link: '/其他/webpack' },
          { text: 'git', link: '/其他/git' },
          { text: 'git', link: '/其他/性能优化/01-性能优化.md' },
        ]
      },
      {
        text: "算法",
        // link: "/前端",
        icon: "reco-home",
        items:[
          { text: '数据结构与算法', link: '/算法/数据结构与算法' },
          { text: 'LeetCode', link: '/算法/LeetCode/回溯算法.md' },
        ]
      },
      {
        text: "联系",
        icon: "reco-message",
        items: [
          {
            text: "GitHub",
            link: "https://github.com/izph",
            icon: "reco-github"
          }
        ]
      },
      {
        text: "TimeLine",
        link: "/timeline/",
        icon: "reco-date"
      },
    ],
    // sidebar: {
    //   "/前端/React": [
    //     {
    //       text: "React常用生命周期",
    //       link: "/前端/React/React常用生命周期",
    //     },
    //     {
    //       text: "ReactHook笔记",
    //       link: "/前端/React/ReactHook笔记",
    //     }
    //     ,
    //     "",
    //     "theme",
    //     "plugin",
    //     "api"
    //   ]
    // },
    type: "blog",
    // 导航栏的分类和标签
    blogConfig: {
      category: {
        location: 6,
        text: "分类"
      },
      tag: {
        location: 7,
        text: "标签"
      }
    },
    friendLink: [
      {
        title: "午后南杂",
        desc: "Enjoy when you can, and endure when you must.",
        email: "1156743527@qq.com",
        link: "https://www.recoluan.com"
      },
      {
        title: "vuepress-theme-reco",
        desc: "A simple and beautiful vuepress Blog & Doc theme.",
        avatar: "/z.jpg",
        link: "https://vuepress-theme-reco.recoluan.com"
      }
    ],
    // "logo": "/logo.png",
    logo: "/z.jpg",
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "Last Updated",
    // 名字
    author: "iZph",
    // 头像
    authorAvatar: "/z.jpg",
    "record": "xxxx",
    startYear: "2020",
    subSidebar: 'auto'//在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容
  },
  // md设置
  markdown: {
    // ......
    lineNumbers: true, // 代码行号
    extendMarkdown: md => {
      md.use(require("markdown-it-disable-url-encode"));
    }
  },
  plugins: {
    // 自动生成侧边栏
    "vuepress-plugin-auto-sidebar": {
      title: {
        mode: "titlecase",
        map: {
          "/前端/React/": "React",
          "/前端/HTML/": "HTMLNotes",
        }
      }
    },
    
  }
}