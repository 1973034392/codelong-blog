import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",
    "/portfolio",
    {
        text: "我的项目",
        icon: "book",
        prefix: "/projects",
        children: [
            {
                text: "百万级网关系统",
                icon: "lightbulb",
                link: "foo"
            },
            {
                text: "畅购通购票系统",
                icon: "lightbulb",
                link: "foo"
            }
            , {
                text: "山西大学算法队Online Judge系统",
                icon: "lightbulb",
                link: "foo"
            },
            {
                text: "Markdown 渲染",
                icon: "lightbulb",
                link: "foo"
            },
        ],
    }
]);
