import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "CodeLong",
  description: "CodeLong 的项目文档",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
