import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",
    {
        text: "八股",
        icon: "calendar",
        link: "/8gu/README.md",
    },
    {
        text: "🐉🐉一百面",
        link: "/interviews/index.md",
    },
    {
        text: "百万级网关系统",
        icon: "lightbulb",
        link: "/projects/gateway/README.md",
    },
    {
        text: "畅购通购票系统",
        icon: "lightbulb",
        link: "/projects/easypass/README.md",
    },
    {
        text: "Markdown 渲染",
        icon: "lightbulb",
        link: "/projects/markdown/README.md",
    },
    {
        text: "山西大学算法队OJ系统",
        icon: "lightbulb",
        link: "/projects/algorithm/README.md",
    },
]);
