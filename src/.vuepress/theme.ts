import {hopeTheme} from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

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

    sidebar: [
        {
            // 必填，分组标题
            text: "山西大学算法队OnlineJudge",
            collapsible: true,
            // 可选，表达分可折叠侧边栏组的原始状态，默认为 false
            expanded: true,
            link: "/projects/algorithm/README.md",
            // 必填，分组链接列表
            children: [{
                // 必填，分组标题
                text: "后端开发",
                // 可选，默认为 false
                collapsible: true,
                // 可选，表达分可折叠侧边栏组的原始状态，默认为 false
                expanded: true,
                // 必填，分组链接列表
                children: [{
                    // 必填，分组标题
                    text: "前期阶段",
                    // 可选，默认为 false
                    collapsible: true,
                    // 可选，表达分可折叠侧边栏组的原始状态，默认为 false
                    expanded: true,
                    // 必填，分组链接列表
                    children: [
                        "/projects/algorithm/back/pre/项目搭建.md",
                        "/projects/algorithm/back/pre/配置邮件发送.md",
                        "/projects/algorithm/back/pre/华为云OBS配置.md",
                        "/projects/algorithm/back/pre/接口编写.md",
                    ]
                }, {
                    // 必填，分组标题
                    text: "核心服务",
                    // 可选，默认为 false
                    collapsible: true,
                    // 可选，表达分可折叠侧边栏组的原始状态，默认为 false
                    expanded: true,
                    // 必填，分组链接列表
                    children: [
                        "/projects/algorithm/back/core/判题模块.md",
                        "/projects/algorithm/back/core/判题服务优化.md",
                        "/projects/algorithm/back/core/其他.md",
                    ]
                },
                    "/projects/algorithm/back/split.md",
                ]
            }, {
                // 必填，分组标题
                text: "前端开发",
                // 可选，默认为 false
                collapsible: true,
                // 可选，表达分可折叠侧边栏组的原始状态，默认为 false
                expanded: true,
                // 必填，分组链接列表
                children: [
                    "/projects/algorithm/front/pre.md",
                    "/projects/algorithm/front/main.md",
                    "/projects/algorithm/front/reconstruction.md",
                ]
            }, {
                // 必填，分组标题
                text: "数据库表设计",
                // 可选，默认为 false
                collapsible: true,
                // 可选，表达分可折叠侧边栏组的原始状态，默认为 false
                expanded: true,
                // 必填，分组链接列表
                children: [
                    "/projects/algorithm/sql/design.md",
                ]
            }
            ],
        }],

    // 页脚
    displayFooter: true,

    // 加密配置
    encrypt:
        {
            config: {
                "/demo/encrypt.html":
                    {
                        hint: "Password: 1234",
                        password:
                            "1234",
                    }
                ,
            }
            ,
        }
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
