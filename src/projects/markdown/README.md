---
title: Markdown渲染
sidebar: false
---
# Markdown Pro: 一款功能丰富的网页版 Markdown 编辑器

我在大二学习Java时要看很多文档,但是手机端没有一个合适的编辑器,正好我手上有一台闲置的服务器,所以我自己编写了一个Markdown的渲染器

> **项目演示: [项目地址](https://markdown-3vc.pages.dev/)**

**Markdown Pro** 是一个强大、美观且功能齐全的在线 Markdown 编辑器，完全运行在您的浏览器中。它旨在提供一个无缝的、所见即所得的写作体验，灵感来源于 Typora 等优秀的桌面应用。

## ✨ 核心功能

这个项目集成了现代 Markdown 编辑器所需的大部分核心功能：

- **实时预览与同步滚动**: 编辑器和预览区左右分栏，内容会实时渲染，并且滚动时两侧会保持同步，提供流畅的对照写作体验。
- **双模式切换**:
    - **对照模式**: 经典的编辑/预览双栏布局。
    - **仅预览模式**: 隐藏编辑区，专注于阅读，并自动在左侧显示可交互的文档大纲。
- **专业的编辑器**: 使用 **CodeMirror** 作为核心编辑器，支持 Markdown 语法高亮，让您的源文本也清晰易读。
- **Typora 风格主题**: 预览区域的样式基于优雅的 `mdmdt-light` Typora 主题进行美化，提供出色的阅读观感。
- **丰富的语法支持**:
    - **LaTeX 数学公式**: 通过 **KaTeX** 库完美渲染行内 (`$...$`) 和块级 (`$$...$$`) 的数学公式。
    - **Mermaid 图表**: 支持使用 `mermaid` 语法创建流程图、序列图、甘特图等多种图表。
    - **代码高亮**: 使用 **highlight.js** 对各种编程语言的代码块进行语法高亮。
    - **任务列表**: 支持 `- [ ]` 和 `- [x]` 格式的任务清单。
- **高度可定制的界面**:
    - **可调宽度导航栏**: 在 PC 端，您可以通过拖动边缘自由调整目录导航栏的宽度。
    - **全屏模式**: 一键进入沉浸式写作和阅读环境。
- **便捷的文档处理**:
    - **本地文件上传**: 轻松打开并编辑本地的 `.md` 文件。
    - **导出为 PDF**: 将您渲染后的作品（包含目录的预览模式布局）导出为高质量的 PDF 文件。
- **全面的平台适配**:
    - **响应式设计**: 界面会自动适配手机、平板和桌面电脑，在移动端也能获得良好的使用体验。

## 🛠️ 技术栈

本项目完全由前端技术构建，无需任何后端支持。

- **基础**: HTML, CSS, JavaScript
- **UI 框架**: [Tailwind CSS](https://tailwindcss.com/) - 用于快速构建现代化、响应式的用户界面。
- **Markdown 解析**: [Marked.js](https://marked.js.org/) - 一个快速的 Markdown 解析和编译库。
- **核心编辑器**: [CodeMirror](https://codemirror.net/) - 提供语法高亮和强大编辑功能的文本编辑器。
- **代码块高亮**: [highlight.js](https://highlightjs.org/) - 自动检测并高亮代码块的语法。
- **数学公式**: [KaTeX](https://katex.org/) - 快速、易于使用的 JavaScript 数学排版库。
- **图表绘制**: [Mermaid.js](https://mermaid.js.org/) - 通过文本和代码生成图表和流程图。
- **PDF 导出**: [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/) - 协同工作，将 HTML 内容“截图”并生成 PDF 文件。

## 🚀 如何运行

不需要复杂的构建步骤，只需：

1. 将项目代码保存为一个 `.html` 文件（例如 `markdown-editor.html`）。
2. 直接在任何现代浏览器（如 Chrome, Firefox, Edge）中打开这个文件。

一切就绪！您可以立即开始使用。


## 项目代码:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown 编辑器 (Typora 风格)</title>
  <!-- 引入 Tailwind CSS 用于快速构建 UI -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- 引入 marked.js 用于将 Markdown 转换为 HTML -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

  <!-- 引入 KaTeX 和相关扩展 -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" xintegrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" xintegrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked-katex-extension/lib/index.umd.js"></script>

  <!-- 引入 highlight.js 用于代码语法高亮 -->
  <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>
  <!-- 引入 jsPDF 和 html2canvas 用于导出 PDF -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

  <!-- 引入 CodeMirror 编辑器库 -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/theme/base16-light.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/mode/markdown/markdown.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/mode/xml/xml.min.js"></script>

  <!-- 引入 Mermaid.js 用于图表渲染 -->
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>

  <style>
    /* 基础和颜色变量 (来自 mdmdt-light.css) */
    :root {
      --bg-color: rgb(250, 250, 252);
      --bg-color2: rgb(236, 236, 238);
      --text-color: #000;
      --text-grey: #666;
      --text-code: #2f479f;
      --title-color: #070909;
      --border-color: #d2d2d2;
      --color-1: #3e69d7;
      --color-1-0-a: rgba(62, 105, 215, 0.15);
      --color-1-0-b: rgba(62, 105, 215, 0.06);
      --color-2: #f59102;
    }

    html, body {
      margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; background-color: var(--bg-color);
    }
    #app-container {
      display: flex; flex-direction: column; height: 100vh;
    }
    #main-content {
      flex-grow: 1; display: flex; overflow: hidden;
    }
    #preview-wrapper, .CodeMirror, #toc-container {
      height: 100%; overflow-y: auto;
    }
    .CodeMirror {
      border-right: 1px solid var(--border-color); font-family: 'Menlo', 'Monaco', 'Courier New', monospace; font-size: 16px; line-height: 1.6;
    }
    /* 自定义滚动条样式 */
    ::-webkit-scrollbar { width: 8px !important; height: 8px !important; }
    ::-webkit-scrollbar-thumb { border-radius: 4px !important; background: var(--border-color) !important; }
    ::-webkit-scrollbar-track { background: var(--bg-color2) !important; }
    html, html * { scrollbar-color: var(--border-color) var(--bg-color2) !important; scrollbar-width: thin !important; }

    /* Typora 主题样式 */
    .markdown-body {
      box-sizing: border-box; max-width: 980px; margin: 0 auto; padding: 32px 80px; color: var(--text-color); line-height: 1.6; letter-spacing: 0.6px; font-family: "PingFang SC", "Microsoft YaHei UI", "Microsoft YaHei", Arial, "Helvetica Neue", Helvetica, sans-serif;
    }
    .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
      position: relative; line-height: 1.5; margin: 32px 0 18px; color: var(--title-color); letter-spacing: 2px; scroll-margin-top: 1rem;
    }
    .markdown-body h1 { font-size: 32px; border-bottom: 1px solid var(--border-color); font-weight: 700; }
    .markdown-body h2 { font-size: 28px; font-weight: 700; }
    .markdown-body h3 { font-size: 24px; font-weight: 600; }
    .markdown-body h4 { font-size: 20px; font-weight: 600; }
    .markdown-body h5 { font-size: 18px; font-weight: 600; }
    .markdown-body h6 { font-size: 16px; font-weight: 600; }
    .markdown-body a { color: var(--color-1); }
    .markdown-body a:hover { color: var(--color-2); }
    .markdown-body code { background: var(--color-1-0-a); color: var(--text-code); }
    .markdown-body pre {
      background: var(--bg-color2) !important;
      border-radius: 8px;
      padding: 1rem;
      margin-top: 16px;
      overflow-x: auto;
    }
    .markdown-body pre code { background: transparent !important; }
    .markdown-body blockquote { background: var(--color-1-0-b); border-left: 4px solid var(--color-1); padding: 16px; margin-top: 16px; }
    .markdown-body table { border: 1px solid var(--border-color) !important; border-radius: 8px; border-collapse: separate; border-spacing: 0; overflow: hidden; margin-top: 16px; }
    .markdown-body table thead tr th { background: var(--bg-color2); }
    .markdown-body table tbody tr:nth-child(even) td { background: var(--bg-color2); }
    .markdown-body table tr th, .markdown-body table tr td { padding: 12px 15px !important; line-height: 1.5; }
    .markdown-body ul.task-list-item { list-style-type: none; padding-left: 0; }
    .markdown-body .task-list-item input[type="checkbox"] { margin-right: 8px; }
    .markdown-body .mermaid { text-align: center; margin-top: 16px; }

    /* 目录样式 */
    #toc-container { background-color: #ffffff; padding: 1.5rem; transition: transform 0.3s ease-in-out; position: relative; }
    #toc-container ul { list-style-type: none; padding-left: 0; }
    #toc-container a { color: #4b5563; text-decoration: none; display: block; padding: 4px 0; transition: all 0.2s; border-left: 2px solid transparent; padding-left: 10px; }
    #toc-container a:hover { color: #111827; }
    #toc-container a.toc-active { color: var(--color-1); font-weight: 700; border-left-color: var(--color-1); }
    #toc-container .toc-h1 { font-weight: bold; }
    #toc-container .toc-h2 { padding-left: 1rem; }
    #toc-container .toc-h3 { padding-left: 2rem; }
    #toc-container .toc-h4 { padding-left: 3rem; }

    /* Resizer Handle */
    #resizer {
      position: absolute;
      top: 0;
      right: -5px; /* 将拖动条中心对准边缘 */
      width: 10px; /* 增加可点击区域的宽度 */
      height: 100%;
      cursor: col-resize;
      background-color: transparent; /* 保持拖动条本身不可见 */
      z-index: 20;
    }
    /* 鼠标悬停时显示一条细线作为视觉提示 */
    #resizer::after {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 100%;
      background-color: transparent;
      transition: background-color 0.2s ease;
    }
    #resizer:hover::after {
      background-color: var(--color-1);
    }


    /* CodeMirror 主题覆盖 */
    .cm-s-base16-light.CodeMirror { background: #fdfdfd; color: #202020; }
    .cm-s-base16-light .cm-header {color: #a0a0a0;}
    .cm-s-base16-light .cm-strong {font-weight: bold;}

    /* 桌面端模式切换 */
    @media (min-width: 769px) {
      .is-side-by-side #toc-container { display: none; }
      .is-preview-only #editor-wrapper { display: none; }
    }

    /* 移动端响应式布局 */
    @media (max-width: 768px) {
      #main-content { flex-direction: column; }
      #preview-wrapper, #editor-wrapper { width: 100% !important; height: 50%; }
      .CodeMirror { border-top: 1px solid var(--border-color); border-right: none; }
      #toc-container {
        position: absolute; top: 0; left: 0; height: 100%; width: 280px; transform: translateX(-100%); z-index: 40; border-right: 1px solid #e5e7eb;
      }
      #toc-container.is-open { transform: translateX(0); }
      .is-preview-only #editor-wrapper { display: none; }
      .is-preview-only #preview-wrapper { height: 100%; }
      .markdown-body { padding: 16px; }
      header { flex-direction: column; align-items: stretch; gap: 0.5rem; }
      #resizer { display: none; }
    }
  </style>
</head>
<body>

<div id="app-container">
  <!-- 顶部工具栏 -->
  <header class="flex-shrink-0 bg-white text-gray-800 p-2 flex items-center justify-between shadow-md z-10">
    <div class="flex items-center space-x-4">
      <button id="toc-toggle-btn" class="p-2 rounded-md md:hidden hover:bg-gray-200">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
      <h1 class="text-lg font-semibold text-gray-900">Markdown Pro</h1>
    </div>
    <div class="flex items-center space-x-2 md:space-x-4 flex-wrap justify-end">
      <button id="upload-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 md:px-4 rounded transition duration-300 text-sm">上传</button>
      <input type="file" id="file-input" accept=".md,.markdown" class="hidden">
      <button id="export-pdf-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 md:px-4 rounded transition duration-300 text-sm">导出PDF</button>
      <button id="mode-toggle-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 md:px-4 rounded transition duration-300 text-sm">仅预览</button>
      <button id="fullscreen-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 md:px-4 rounded transition duration-300 text-sm">全屏</button>
    </div>
  </header>

  <!-- 主内容区 -->
  <main id="main-content" class="main-content relative is-side-by-side">
    <!-- 目录 (移至左侧) -->
    <div id="toc-container" class="w-[24rem] flex-shrink-0">
      <h2 class="text-gray-900 font-bold text-xl mb-4">目录</h2>
      <div id="toc"></div>
      <div id="resizer"></div>
    </div>
    <!-- 预览区 -->
    <div id="preview-wrapper" class="flex-1 bg-gray-50">
      <div id="preview" class="markdown-body"></div>
    </div>
    <!-- 编辑器 -->
    <div id="editor-wrapper" class="flex-1">
      <textarea id="editor"></textarea>
    </div>
  </main>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
    const { jsPDF } = window.jspdf;

    // DOM 元素获取
    const mainContent = document.getElementById('main-content');
    const editorWrapper = document.getElementById('editor-wrapper');
    const editorTextarea = document.getElementById('editor');
    const previewWrapper = document.getElementById('preview-wrapper');
    const preview = document.getElementById('preview');
    const tocContainer = document.getElementById('toc-container');
    const tocDiv = document.getElementById('toc');
    const resizer = document.getElementById('resizer');
    const modeToggleBtn = document.getElementById('mode-toggle-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const appContainer = document.getElementById('app-container');
    const tocToggleBtn = document.getElementById('toc-toggle-btn');

    // 初始化 CodeMirror 编辑器
    const editor = CodeMirror.fromTextArea(editorTextarea, {
      mode: 'markdown', theme: 'base16-light', lineNumbers: true, lineWrapping: true,
    });
    editor.setSize('100%', '100%');
    const editorScroller = editor.getScrollerElement();

    let isSyncing = false;
    let intersectionObserver;
    let isClickScrolling = false;

    // 设置 marked.js 并集成 KaTeX
    marked.use(
            window.markedKatex({ throwOnError: false })
    );

    marked.setOptions({
      highlight: (code, lang) => {
        if (lang === 'mermaid') {
          return code;
        }
        try {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext';
          return hljs.highlight(code, { language, ignoreIllegals: true }).value;
        } catch (e) {
          return code; // return original code on error
        }
      },
      gfm: true,
      breaks: true,
    });

    const render = (markdownText) => {
      preview.innerHTML = marked.parse(markdownText);

      const codeBlocks = preview.querySelectorAll('pre code.language-mermaid');
      codeBlocks.forEach((codeBlock) => {
        const mermaidContainer = document.createElement('div');
        mermaidContainer.className = 'mermaid';
        mermaidContainer.textContent = codeBlock.textContent;
        codeBlock.parentElement.replaceWith(mermaidContainer);
      });

      generateTOC();
      setupIntersectionObserver();
      setTimeout(() => {
        try {
          const mermaidNodes = preview.querySelectorAll('.mermaid');
          if (mermaidNodes.length > 0) {
            mermaid.run({ nodes: mermaidNodes }).catch(e => console.error("Mermaid rendering error:", e));
          }
        } catch(e) { console.error("Mermaid rendering error:", e); }
      }, 100);
    };

    const generateTOC = () => {
      tocDiv.innerHTML = '';
      const headings = preview.querySelectorAll('h1, h2, h3, h4');
      if (headings.length === 0) {
        tocDiv.innerHTML = '<p class="text-gray-500">未找到标题</p>';
        return;
      }
      const tocList = document.createElement('ul');
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1), 10);
        const text = heading.textContent;
        const id = 'heading-' + text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-') + '-' + index;
        heading.id = id;
        const link = document.createElement('a');
        link.href = '#' + id;
        link.textContent = text;
        link.className = `toc-h${level}`;
        link.dataset.targetId = id;
        link.onclick = (e) => {
          e.preventDefault();
          isClickScrolling = true;
          document.querySelectorAll('#toc a').forEach(a => a.classList.remove('toc-active'));
          link.classList.add('toc-active');
          heading.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => { isClickScrolling = false; }, 1000);
          if (window.innerWidth <= 768) {
            tocContainer.classList.remove('is-open');
          }
        };
        const listItem = document.createElement('li');
        listItem.appendChild(link);
        tocList.appendChild(listItem);
      });
      tocDiv.appendChild(tocList);
    };

    const setupIntersectionObserver = () => {
      if (intersectionObserver) intersectionObserver.disconnect();
      const options = { root: previewWrapper, rootMargin: "0px 0px -80% 0px", threshold: 0 };
      intersectionObserver = new IntersectionObserver((entries) => {
        if (isClickScrolling) return;
        document.querySelectorAll('#toc a').forEach(a => a.classList.remove('toc-active'));
        const intersectingEntries = entries.filter(e => e.isIntersecting);
        if (intersectingEntries.length > 0) {
          const targetId = intersectingEntries[0].target.id;
          const activeLink = document.querySelector(`#toc a[data-target-id="${targetId}"]`);
          if (activeLink) activeLink.classList.add('toc-active');
        }
      }, options);
      preview.querySelectorAll('h1, h2, h3, h4').forEach(h => intersectionObserver.observe(h));
    };

    editor.on('change', () => render(editor.getValue()));

    const syncScroll = (source, target) => {
      if (isSyncing) return;
      isSyncing = true;
      const percent = source.scrollTop / (source.scrollHeight - source.clientHeight);
      target.scrollTop = (target.scrollHeight - target.clientHeight) * percent;
      setTimeout(() => { isSyncing = false; }, 50);
    };

    editorScroller.addEventListener('scroll', () => syncScroll(editorScroller, previewWrapper));
    previewWrapper.addEventListener('scroll', () => syncScroll(previewWrapper, editorScroller));

    modeToggleBtn.addEventListener('click', () => {
      if (mainContent.classList.contains('is-side-by-side')) {
        mainContent.classList.remove('is-side-by-side');
        mainContent.classList.add('is-preview-only');
        modeToggleBtn.textContent = '对照模式';
      } else {
        mainContent.classList.remove('is-preview-only');
        mainContent.classList.add('is-side-by-side');
        modeToggleBtn.textContent = '仅预览';
      }
    });

    tocToggleBtn.addEventListener('click', () => {
      tocContainer.classList.toggle('is-open');
    });

    // TOC Resizer Logic
    let isResizing = false;
    resizer.addEventListener('mousedown', (e) => {
      isResizing = true;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const tocWidth = e.clientX;
      if (tocWidth > 150 && tocWidth < 800) { // Set min/max width
        tocContainer.style.width = `${tocWidth}px`;
      }
    });

    window.addEventListener('mouseup', () => {
      isResizing = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    });

    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) appContainer.requestFullscreen().catch(err => alert(`全屏失败: ${err.message}`));
      else document.exitFullscreen();
    });
    document.addEventListener('fullscreenchange', () => {
      fullscreenBtn.textContent = document.fullscreenElement ? '退出全屏' : '全屏';
    });

    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => editor.setValue(event.target.result);
        reader.readAsText(file);
      }
      e.target.value = '';
    });

    exportPdfBtn.addEventListener('click', async () => {
      const originalText = exportPdfBtn.textContent;
      exportPdfBtn.textContent = '生成中...';
      exportPdfBtn.disabled = true;

      const printContainer = document.createElement('div');
      printContainer.style.position = 'absolute';
      printContainer.style.left = '-9999px';
      printContainer.style.width = '1280px';
      printContainer.style.display = 'flex';
      printContainer.style.backgroundColor = 'var(--bg-color)';

      const tocClone = document.createElement('div');
      tocClone.style.width = '25%';
      tocClone.style.backgroundColor = '#ffffff';
      tocClone.style.borderRight = '1px solid #e5e7eb';
      tocClone.style.padding = '1.5rem';
      tocClone.innerHTML = tocContainer.innerHTML;
      tocClone.querySelectorAll('a').forEach(a => a.onclick = null);

      const previewClone = document.createElement('div');
      previewClone.style.width = '75%';
      previewClone.style.backgroundColor = 'rgb(249 250 251)';
      previewClone.innerHTML = previewWrapper.innerHTML;

      printContainer.appendChild(tocClone);
      printContainer.appendChild(previewClone);
      document.body.appendChild(printContainer);

      try {
        const canvas = await html2canvas(printContainer, { scale: 1, useCORS: true, windowWidth: printContainer.scrollWidth, windowHeight: printContainer.scrollHeight });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        let heightLeft = pdfHeight, position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
        }
        pdf.save('markdown-export.pdf');
      } catch (error) {
        console.error("导出 PDF 失败:", error);
        alert("抱歉，导出 PDF 时发生错误。");
      } finally {
        document.body.removeChild(printContainer);
        exportPdfBtn.textContent = originalText;
        exportPdfBtn.disabled = false;
      }
    });

    const initialMarkdown = `# 欢迎使用 Markdown Pro!

这是一个功能强大的 Markdown 编辑器和阅读器。

## LaTeX 数学公式

**现在支持 KaTeX 渲染的数学公式！**

行内公式: $E=mc^2$

块级公式:
$$\\int_a^b f(x) \\, dx = F(b) - F(a)$$

## Mermaid 图表示例

\`\`\`mermaid
graph TD;
    A[开始] --> B{处理};
    B -->|条件1| C[结果1];
    B -->|条件2| D[结果2];
\`\`\`

## 代码块示例
\`\`\`javascript
function greet() {
  console.log("Hello, World!");
}
\`\`\`

> 现在，开始您的创作吧！`;

    editor.setValue(initialMarkdown);
    render(initialMarkdown);
  });
</script>

</body>
</html>

```
