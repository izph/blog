module.exports = {
  // 文档标题
  title: "iZph",
  // 文档说明
  base: "/blog/",
  description: 'Stick to your original intention and become a better self',
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
          { text: 'HTML', link: '/docs/front-end/html/01-html-note-01.md' },
          { text: 'CSS', link: '/docs/front-end/css/01-css-note-01.md' },
          {
            text: 'JavaScript',
            items: [
              { text: 'ECMAScript', link: '/docs/front-end/javascript/02-high-quality-code.md' },
              { text: 'DOM', link: '/docs/front-end/javascript/dom/01-dom-note-01.md' },
              { text: 'BOM', link: '/docs/front-end/javascript/bom/01-bom-note-01.md' },
            ]
          },
          { text: 'React', link: '/docs/front-end/react/01-react-bascis.md' },
          { text: 'TypeScript', link: '/docs/front-end/typescript/01-ts-basics.md' },
        ]
      },
      {
        text: "Node",
        icon: "reco-blog",
        items: [
          { text: 'Node', link: '/docs/node/node/01-observer-mode.md' },
          { text: 'Koa', link: '/docs/node/koa/01-koa-basics.md' },
        ]
      },
      {
        text: "工程化",
        icon: "reco-api",
        items: [
          { text: '计算机网络', link: '/docs/engineering/computer-network/01-http.md' },
          { text: '计算机基础', link: '/docs/engineering/computer-basics/01-computer-operating-system.md' },
          { text: '浏览器', link: '/docs/engineering/browser/01-fe-browser-cache.md' },
          { text: 'webpack', link: '/docs/engineering/webpack/01-webpack-notes-01.md' },
          { text: 'git', link: '/docs/engineering/git/01-git-usage.md' },
          { text: 'SQL', link: '/docs/engineering/sql/01-sql-basics.md' },
          { text: '性能优化', link: '/docs/engineering/performance/01-performance-optimization.md' },
          { text: '其他', link: '/docs/engineering/other/01-vscode-shortcutkey.md' },
        ]
      },
      {
        text: "算法",
        icon: "reco-document",
        items: [
          { text: 'DataStructure', link: '/docs/algorithm/data-structure/01-complexity.md' },
          { text: 'LeetCode', link: '/docs/algorithm/leetcode/02-string.md' },
        ]
      },
      {
        text: "项目",
        icon: "reco-coding",
        items: [
          { text: 'yolo-ui', link: '/docs/project/yolo-ui/01-yolo-preface.md' },
          { text: 'md-to-html', link: '/docs/project/md-to-html/01-handwritten-md-to-html.md' },
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
      // title: {
      //   mode: "titlecase",
      //   map: {
      //     "/前端/React/": "React",
      //     "/前端/HTML/": "HTMLNotes",
      //   }
      // }
    },

  }
}