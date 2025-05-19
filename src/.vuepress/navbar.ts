import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",
    "/technologyStack/index",
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
        text: "山西大学算法队OJ系统",
        icon: "lightbulb",
        link: "/projects/algorithm/README.md",
    },
    {
        text: "Markdown 渲染",
        icon: "lightbulb",
        link: "/projects/markdown/README.md",
    },
]);
