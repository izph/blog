module.exports = {
  // 文档标题
  title: "iZph",
  // 文档说明
  base: "/blog/",
  description: 'Stick to your original intention and become a better self.',
  dest: "public",
  head: [
    ['link', { rel: 'shortcut icon', type: "image/x-icon", href: `/favicon.ico` }],
    ["meta", { name: "viewport", content: "width=device-width, initial-scale=1, user-scalable=no" }]
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
        icon: "reco-blog",
        items: [
          { text: 'HTML', link: '/前端/HTML/HTMLNoteOne.md' },
          { text: 'CSS', link: '/前端/CSS/CSSNoteOne.md' },
          {
            text: 'JavaScript',
            link: '/前端/JavaScript/01-初识V8底层.md',
            items: [
              { text: 'ECMAScript', link: '/前端/JavaScript/02-高质量的JS代码.md' },
              { text: 'DOM', link: '/前端/JavaScript/DOM/01-dom笔记.md' },
              { text: 'BOM', link: '/前端/JavaScript/BOM/01-bom笔记.md' },
            ]
          },
          { text: 'React', link: '/前端/React/01-React基础知识笔记.md' },
          { text: 'TypeScript', link: '/前端/TypeScript/01-ts-basics.md' },
        ]
      },
      {
        text: "后端",
        icon: "reco-blog",
        items: [
          { text: 'Node', link: '/后端/Node/01-观察者模式.md' },
          { text: 'Koa', link: '/后端/Koa/01-koa-basics.md' },
        ]
      },
      {
        text: "工程化",
        icon: "reco-api",
        items: [
          { text: '计网', link: '/工程化/计网/http.md' },
          { text: '计算机基础', link: '/工程化/计算机基础/01-计算机操作系统.md' },
          { text: '浏览器', link: '/工程化/浏览器/01-febrowsercache.md' },
          { text: 'webpack', link: '/工程化/webpack/01-webpacknotes01.md' },
          { text: 'git', link: '/工程化/git/01-gitbase-use.md' },
          { text: 'SQL', link: '/工程化/SQL/01-sqlbasics.md' },
          { text: '性能优化', link: '/工程化/性能优化/01-性能优化.md' },
          { text: '其他', link: '/工程化/其他/lerna.md' },
        ]
      },
      {
        text: "算法",
        icon: "reco-document",
        items: [
          { text: 'DataStructure', link: '/算法/数据结构/01-复杂度.md' },
          { text: 'LeetCode', link: '/算法/LeetCode/02-字符串.md' },
        ]
      },
      {
        text: "项目",
        icon: "reco-coding",
        items: [
          { text: 'yolo-ui', link: '/项目/yolo-ui/01-yolo-preface.md' },
          { text: 'md-to-html', link: '/项目/md-to-html/01-handwritten-md-to-html.md' },
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
    type: "blog",
    // 导航栏的分类和标签
    blogConfig: {
      category: {
        location: 7,
        text: "分类"
      },
      tag: {
        location: 8,
        text: "标签"
      }
    },
    friendLink: [
      {
        title: "vuepress-theme-reco",
        desc: "A simple and beautiful vuepress Blog & Doc theme.",
        email: "",
        link: "https://vuepress-theme-reco.recoluan.com"
      }
    ],
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
    subSidebar: 'auto' //在所有页面中启用自动生成子侧边栏，原sidebar仍然兼容
  },
  // md设置
  markdown: {
    lineNumbers: true,  // 代码行号
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