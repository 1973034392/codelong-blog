import {hopeTheme} from "vuepress-theme-hope";

import navbar from "./navbar.js";

export default hopeTheme({
    hostname: "https://vuepress-theme-hope-docs-demo.netlify.app",

    author: {
        name: "CodeLong",
        url: "codelong.top",
    },

    logo: "/favicon.ico",

    repo: "1973034392/api-gateway-codelong",

    docsDir: "src",

    // 导航栏
    navbar,

    sidebar: {
        // 对特定目录进行结构优化
        "/8gu/": [
            {
                text: "八股知识分享",
                collapsible: true,
                expanded: true,
                link: "/8gu/README.md",
                children: [
                    {
                        text: "Java基础",
                        collapsible: true,
                        children: [
                            {
                                text: "五种IO模型",
                                link: "/8gu/5种IO模型.md"
                            },
                            {
                                text: "Hashmap,ConcurrentHashmap详解",
                                link: "/8gu/Hashmap,ConcurrentHashmap以及它们各个JDK下的差异.md"
                            },
                            {
                                text: "JDK动态代理和CGlib动态代理的区别",
                                link: "/8gu/JDK动态代理和CGlib动态代理的区别.md"
                            },
                            {
                                text: "SPI 机制详解",
                                link: "/8gu/SPI 机制详解.md"
                            },
                            {
                                text: "ThreadLocal 全面解析",
                                link: "/8gu/ThreadLocal 全面解析.md"
                            },
                            {
                                text: "🪄其他",
                                link: "/8gu/Java基础.md"
                            }
                        ]
                    },
                    {
                        text: "Mysql",
                        collapsible: true,
                        children: [
                            {
                                text: "MVCC原理与实现",
                                link: "/8gu/MVCC原理与实现.md"
                            },
                            {
                                text: "✨Mysql三种日志",
                                link: "https://resource.codelong.top/Mysql三种日志"
                            },
                            {
                                text: "BufferPool的缓存清除策略详解",
                                link: "/8gu/BufferPool的缓存清除策略详解.md"
                            },
                            {
                                text: "✨SQL优化",
                                link: "https://resource.codelong.top/sql优化"
                            },
                            {
                                text: "✨介绍一下MySql的各种锁",
                                link: "https://resource.codelong.top/介绍一下MySql的各种锁"
                            },
                            {
                                text: "🪄其他",
                                link: "/8gu/Mysql.md"
                            }
                        ]
                    },
                    {
                        text: "JUC",
                        collapsible: true,
                        children: [
                            {
                                text: "AQS原理深入解析",
                                link: "/8gu/AQS原理深入解析.md"
                            },
                            {
                                text: "JUC工具类",
                                link: "/8gu/JUC工具类.md"
                            },
                            {
                                text: "Synchronized详解",
                                link: "/8gu/Synchronized详解.md"
                            },
                            {
                                text: "线程池核心参数解析",
                                link: "/8gu/线程池核心参数解析.md"
                            },
                            {
                                text: "🪄其他",
                                link: "/8gu/JUC.md"
                            }
                        ]
                    },
                    {
                        text: "JVM",
                        collapsible: true,
                        children: [
                            {
                                text: "JIT优化及逃逸分析",
                                link: "/8gu/JIT优化及逃逸分析.md"
                            },
                            {
                                text: "JVM垃圾回收算法和回收器详解",
                                link: "/8gu/JVM垃圾回收算法和回收器详解.md"
                            },
                            {
                                text: "✨类的生命周期",
                                link: "https://resource.codelong.top/类的生命周期"
                            },
                            {
                                text: "什么是JMM",
                                link: "/8gu/什么是JMM.md"
                            },
                            {
                                text: "双亲委派机制",
                                link: "/8gu/双亲委派机制.md"
                            },
                            {
                                text: "不同JDK版本中字符串常量池的差异",
                                link: "/8gu/不同JDK版本中字符串常量池的演进.md"
                            },
                            {
                                text: "🪄其他",
                                link: "/8gu/JVM.md"
                            }
                        ]
                    },
                    {
                        text: "Redis",
                        collapsible: true,
                        children: [
                            {
                                text: "BitMap和流量统计",
                                link: "/8gu/BitMap和流量统计.md"
                            },
                            {
                                text: "✨Redis Stream",
                                link: "https://resource.codelong.top/Redis Stream"
                            },
                            {
                                text: "Redisson 分布式锁：全面解析",
                                link: "/8gu/Redisson 分布式锁：全面解析.md"
                            }
                        ]
                    },
                    {
                        text: "Spring",
                        collapsible: true,
                        children: [
                            {
                                text: "✨Bean的初始化流程和生命周期",
                                link: "https://resource.codelong.top/Bean的初始化流程和生命周期"
                            },
                            {
                                text: "✨SpringBoot自动配置",
                                link: "https://resource.codelong.top/SpringBoot自动配置"
                            },
                            {
                                text: "介绍一下IOC和AOP",
                                link: "/8gu/介绍一下IOC和AOP.md"
                            },
                            {
                                text: "循环依赖",
                                link: "/8gu/循环依赖.md"
                            },
                            {
                                text: "🪄其他",
                                link: "/8gu/Spring.md"
                            }
                        ]
                    },
                    {
                        text: "RocketMQ",
                        collapsible: true,
                        children: [
                            {
                                text: "✨RocketMQ事务消息",
                                link: "https://resource.codelong.top/Rocketmq事务消息"
                            },
                            {
                                text: "✨RocketMQ消息可靠性",
                                link: "https://resource.codelong.top/RocketMQ消息可靠性"
                            }
                        ]
                    },
                    {
                        text: "其他",
                        collapsible: true,
                        children: [
                            {
                                text: "✨ElasticSearch为什么快深度分页怎么解决",
                                link: "https://resource.codelong.top/ElasticSearch为什么快深度分页怎么解决"
                            },
                            {
                                text: "零拷贝详解",
                                link: "/8gu/零拷贝详解.md"
                            }
                        ]
                    }
                ]
            }
        ],
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
                        text: "三、压测结果",
                        collapsible: false,
                        expanded: true,
                        link: "/projects/gateway/压测结果.md",
                        children: []
                    },
                    {
                        text: "四、项目文档",
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
                                        text: "(5). 心跳续约机制",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/网关中心/5. 心跳续约机制.md",
                                        children: []
                                    },
                                    {
                                        text: "(6). NGINX配置刷新",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/网关中心/6. NGINX配置刷新.md",
                                        children: []
                                    },
                                    {
                                        text: "(7). 事件通知",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/网关中心/7. 事件通知.md",
                                        children: []
                                    },
                                    {
                                        text: "(8). Redis过期事件监听",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/网关中心/8. Redis过期事件监听.md",
                                        children: []
                                    },
                                ]
                            },
                            {
                                text: "3. 网关核心服务",
                                collapsible: false,
                                expanded: true,
                                children: [
                                    {
                                        text: "(0). 项目的结构是怎么样的",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/核心服务/0. 项目的结构是怎么样的.md",
                                        children: []
                                    },
                                    {
                                        text: "(1). 贯穿服务的全局配置",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/核心服务/1. 贯穿服务的全局配置.md",
                                        children: []
                                    },
                                    {
                                        text: "(2). 请求处理的整个流程",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/核心服务/2. 请求处理的整个流程.md",
                                        children: []
                                    },
                                    {
                                        text: "(3). 如何进行请求鉴权",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/核心服务/3. 如何进行请求鉴权.md",
                                        children: []
                                    },
                                    {
                                        text: "(4). 自定义熔断是怎么实现的",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/核心服务/4. 自定义熔断是怎么实现的.md",
                                        children: []
                                    },
                                    {
                                        text: "(5). 请求是怎么解析的",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/核心服务/5. 请求是怎么解析的.md",
                                        children: []
                                    },
                                    {
                                        text: "(6). 请求调用与结果包装",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/核心服务/6. 请求调用与结果包装.md",
                                        children: []
                                    },
                                    {
                                        text: "(7). 自定义连接源缓存池",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/核心服务/7. 自定义接口缓存池.md",
                                        children: []
                                    },
                                    {
                                        text: "(8). 基于SPI机制实现多执行器扩展",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/核心服务/8. 基于SPI机制实现多执行器扩展.md",
                                        children: []
                                    },
                                ]
                            },
                            {
                                text: "4. 服务发送SDK",
                                collapsible: false,
                                expanded: true,
                                children: [
                                    {
                                        text: "(1). 组件说明",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/服务发送SDK/1. 组件说明.md",
                                        children: []
                                    },
                                    {
                                        text: "(2). 如何使用",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/服务发送SDK/2. 如何使用.md",
                                        children: []
                                    },
                                    {
                                        text: "(3). 详情介绍",
                                        collapsible: false,
                                        expanded: true,
                                        link: "/projects/gateway/项目文档/服务发送SDK/3. 详情介绍.md",
                                        children: []
                                    },
                                ]
                            },
                        ],
                    },
                ],
            },
        ],
        "/projects/easypass/": [
            {
                text: "畅购通购票系统",
                collapsible: false,
                expanded: false,
                link: "/projects/easypass/README.md",
                children: [
                    {
                        text: "一、表结构设计",
                        collapsible: false,
                        link: "/projects/easypass/数据库表.md",
                    },
                    {
                        text: "二、核心业务功能",
                        collapsible: false,
                        children: [
                            {
                                text: "1. 系统分库分表详解",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/easypass/系统分库分表详解.md",
                            },
                            {
                                text: "2. 参数加解密",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/easypass/参数加解密.md",
                                children: []
                            },
                            {
                                text: "3. 订单服务详解",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/easypass/订单服务详解.md",
                                children: []
                            },
                            {
                                text: "4. 节目服务详解",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/easypass/节目服务详解.md",
                                children: []
                            },
                            {
                                text: "5. 用户服务详解",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/easypass/用户服务详解.md",
                                children: []
                            },
                            {
                                text: "6. 支付服务详解",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/easypass/支付服务详解.md",
                                children: []
                            },
                            {
                                text: "7. API接口定制化防刷与数据存储策略详解",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/easypass/API接口定制化防刷与数据存储策略详解.md",
                                children: []
                            },
                        ],
                    },
                    {
                        text: "三、核心组件设计",
                        collapsible: false,
                        children: [
                            {
                                text: "1. 分布式id组件",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/easypass/分布式id组件.md",
                            },
                            {
                                text: "2. 图形验证码组件",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/easypass/图形验证码.md",
                                children: []
                            },
                            {
                                text: "3. 限流组件设计",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/easypass/限流组件.md",
                                children: []
                            },
                            {
                                text: "4. 分布式锁组件",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/easypass/分布式锁.md",
                                children: []
                            },
                            {
                                text: "5. 幂等组件",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/easypass/用户服务详解.md",
                                children: []
                            },
                            {
                                text: "6. 高效线程池组件",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/easypass/线程池组件.md",
                                children: []
                            },
                        ],
                    },
                    {
                        text: "四、其他",
                        collapsible: false,
                        children: [
                            {
                                text: "1. 数据预加载",
                                collapsible: false,
                                expanded: true,
                                link: "/projects/easypass/ES预加载.md",
                            }
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
            components: ["Badge", "VPCard","PDF"],
        }
        ,

        icon: {
            prefix: "fa6-solid:",
        }
        ,
    }
    ,
})
;
