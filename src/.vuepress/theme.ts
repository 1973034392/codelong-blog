import {hopeTheme} from "vuepress-theme-hope";

import navbar from "./navbar.js";

export default hopeTheme({
    hostname: "https://vuepress-theme-hope-docs-demo.netlify.app",

    author: {
        name: "CodeLong",
        url: "codelong.top",
    },

    logo: "/favicon.ico",

    repo: "vuepress-theme-hope/vuepress-theme-hope",

    docsDir: "src",

    // 导航栏
    navbar,

    sidebar: {
        // 对特定目录进行结构优化
        "/projects/algorithm/": [
            {
                text: "山西大学算法队OnlineJudge",
                collapsible: false,
                expanded: false,
                link: "/projects/algorithm/README.md",
                children: [
                    {
                        text: "一、后端开发",
                        collapsible: false,
                        expanded: true,
                        children: [
                            {
                                text: "前期阶段",
                                collapsible: false,
                                children: [
                                    "/projects/algorithm/back/pre/项目搭建.md",
                                    "/projects/algorithm/back/pre/配置邮件发送.md",
                                    "/projects/algorithm/back/pre/华为云OBS配置.md",
                                    "/projects/algorithm/back/pre/接口编写.md",
                                ],
                            },
                            {
                                text: "核心服务",
                                collapsible: false,
                                children: [
                                    "/projects/algorithm/back/core/判题模块.md",
                                    "/projects/algorithm/back/core/判题服务优化.md",
                                    "/projects/algorithm/back/core/其他.md",
                                ],
                            },
                            "/projects/algorithm/back/split.md",
                            "/projects/algorithm/back/判题机相关.md",
                        ],
                    },
                    {
                        text: "二、前端开发",
                        collapsible: false,
                        children: [
                            "/projects/algorithm/front/pre.md",
                            "/projects/algorithm/front/main.md",
                            "/projects/algorithm/front/reconstruction.md",
                        ],
                    },
                    {
                        text: "三、数据库表设计",
                        collapsible: false,
                        children: ["/projects/algorithm/sql/design.md"],
                    },
                ],
            },
        ],
        "/projects/gateway/": [
            {
                text: "百万级网关系统",
                collapsible: false,
                expanded: true,
                link: "/projects/gateway/README.md",
                children: [
                    {
                        text: "一、系统架构设计",
                        collapsible: false,
                        expanded: true,
                        link: "/projects/gateway/系统架构设计/系统架构设计.md",
                        children: []
                    },
                    {
                        text: "二、表结构设计",
                        collapsible: false,
                        children: [
                            {
                                text: "1. 新版",
                                collapsible: false,
                                expanded: true,
                                children: [
                                    {
                                        text: "(1). 表结构设计",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/数据库设计/新版/表结构设计.md",
                                        children: []
                                    },
                                    {
                                        text: "(2). 表关系图",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/数据库设计/新版/表关系图.md",
                                        children: []
                                    },
                                ]
                            },
                            {
                                text: "2. 旧版",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/gateway/数据库设计/旧版/表结构设计.md",
                                children: []
                            },
                        ],
                    },
                    {
                        text: "三、项目文档(建设中)",
                        collapsible: false,
                        children: [
                            {
                                text: "1. 服务注册SDK",
                                collapsible: false,
                                expanded: true,
                                children: [
                                    {
                                        text: "(1). 组件说明",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/服务注册SDK/1. 组件说明.md",
                                        children: []
                                    },
                                    {
                                        text: "(2). 如何使用",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/服务注册SDK/2. 如何使用.md",
                                        children: []
                                    },
                                    {
                                        text: "(3). 详情介绍",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/服务注册SDK/3. 详情介绍.md",
                                        children: []
                                    },
                                ]
                            },
                            {
                                text: "2. 网关中心",
                                collapsible: false,
                                expanded: true,
                                children: [
                                    {
                                        text: "(1). 项目初期配置",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/网关中心/1. 项目初期配置.md",
                                        children: []
                                    },
                                    {
                                        text: "(2). 雪花算法生成唯一id",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/网关中心/2. 雪花算法生成唯一id.md",
                                        children: []
                                    },
                                    {
                                        text: "(3). 基本CRUD接口编写",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/网关中心/3. 基本CRUD接口编写.md",
                                        children: []
                                    },
                                    {
                                        text: "(4). 接口和方法信息注册",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/网关中心/4. 接口和方法信息注册.md",
                                        children: []
                                    },
                                    {
                                        text: "(5). 接口信息同步",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/网关中心/5. 接口信息同步.md",
                                        children: []
                                    },
                                    {
                                        text: "(6). 心跳续约机制",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/网关中心/6. 心跳续约机制.md",
                                        children: []
                                    },
                                    {
                                        text: "(7). NGINX配置刷新",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/网关中心/7. NGINX配置刷新.md",
                                        children: []
                                    },
                                    {
                                        text: "(8). 事件通知",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/网关中心/8. 事件通知.md",
                                        children: []
                                    },
                                    {
                                        text: "(9). 自定义注册中心",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/网关中心/9. 自定义注册中心.md",
                                        children: []
                                    },
                                    {
                                        text: "(10). Redis过期事件监听",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/网关中心/10. Redis过期事件监听.md",
                                        children: []
                                    },
                                ]
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // 页脚
    displayFooter: true,

    // 加密配置
    encrypt:
        {}
    ,


// 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
// hotReload: true,

// 此处开启了很多功能用于演示，你应仅保留用到的功能。
    markdown: {
        align: true,
        attrs:
            true,
        codeTabs:
            true,
        component:
            true,
        demo:
            true,
        figure:
            true,
        gfm:
            true,
        imgLazyload:
            true,
        imgSize:
            true,
        include:
            true,
        mark:
            true,
        plantuml:
            true,
        spoiler:
            true,
        stylize:
            [
                {
                    matcher: "Recommended",
                    replacer: ({tag}) => {
                        if (tag === "em")
                            return {
                                tag: "Badge",
                                attrs: {type: "tip"},
                                content: "Recommended",
                            };
                    },
                },
            ],
        sub:
            true,
        sup:
            true,
        tabs:
            true,
        tasklist:
            true,
        vPre:
            true,

        // 取消注释它们如果你需要 TeX 支持
        // math: {
        //   // 启用前安装 katex
        //   type: "katex",
        //   // 或者安装 mathjax-full
        //   type: "mathjax",
        // },

        // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
        // revealjs: {
        //   plugins: ["highlight", "math", "search", "notes", "zoom"],
        // },

        // 在启用之前安装 chart.js
        // chartjs: true,

        // insert component easily

        // 在启用之前安装 echarts
        // echarts: true,

        // 在启用之前安装 flowchart.ts
        // flowchart: true,

        // 在启用之前安装 mermaid
        mermaid:
            true,

        // playground: {
        //   presets: ["ts", "vue"],
        // },

        // 在启用之前安装 @vue/repl
        // vuePlayground: true,

        // 在启用之前安装 sandpack-vue3
        // sandpack: true,
    }
    ,

// 在这里配置主题提供的插件
    plugins: {
        // 注意: 仅用于测试! 你必须自行生成并在生产环境中使用自己的评论服务
        // comment: {
        //     provider: "Giscus",
        //     repo: "vuepress-theme-hope/giscus-discussions",
        //     repoId: "R_kgDOG_Pt2A",
        //     categoryId: "DIC_kwDOG_Pt2M4COD69",
        // },

        components: {
            components: ["Badge", "VPCard"],
        }
        ,

        icon: {
            prefix: "fa6-solid:",
        }
        ,

        // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
        // pwa: {
        //   favicon: "/favicon.ico",
        //   cacheHTML: true,
        //   cacheImage: true,
        //   appendBase: true,
        //   apple: {
        //     icon: "/assets/icon/apple-icon-152.png",
        //     statusBarColor: "black",
        //   },
        //   msTile: {
        //     image: "/assets/icon/ms-icon-144.png",
        //     color: "#ffffff",
        //   },
        //   manifest: {
        //     icons: [
        //       {
        //         src: "/assets/icon/chrome-mask-512.png",
        //         sizes: "512x512",
        //         purpose: "maskable",
        //         type: "image/png",
        //       },
        //       {
        //         src: "/assets/icon/chrome-mask-192.png",
        //         sizes: "192x192",
        //         purpose: "maskable",
        //         type: "image/png",
        //       },
        //       {
        //         src: "/assets/icon/chrome-512.png",
        //         sizes: "512x512",
        //         type: "image/png",
        //       },
        //       {
        //         src: "/assets/icon/chrome-192.png",
        //         sizes: "192x192",
        //         type: "image/png",
        //       },
        //     ],
        //     shortcuts: [
        //       {
        //         name: "Demo",
        //         short_name: "Demo",
        //         url: "/demo/",
        //         icons: [
        //           {
        //             src: "/assets/icon/guide-maskable.png",
        //             sizes: "192x192",
        //             purpose: "maskable",
        //             type: "image/png",
        //           },
        //         ],
        //       },
        //     ],
        //   },
        // },
    }
    ,
})
;
