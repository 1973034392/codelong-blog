---
title: Markdown渲染
sidebar: false
---

项目地址: [地址](https://markdown-3vc.pages.dev/)

我在大二学习Java时要看很多文档,但是手机端没有一个合适的编辑器,正好我手上有一台限制的服务器,所以___

```vue
<script setup>
import {ref, watch} from "vue";
import {MdPreview, MdCatalog} from "md-editor-v3";
import 'md-editor-v3/lib/style.css';

const contest = ref("")
const isShow = ref(true)
const id = 'preview'

const scrollElement = document.documentElement

const handleFileChange = (uploadFile) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    contest.value = event.target.result; // 将读取到的文件内容赋值给fileContent
  };
  reader.readAsText(uploadFile.raw); // 读取选中的文件为文本格式
  isShow.value = false
}
</script>

<template>
  <el-row justify="center" align="middle" v-show="isShow">
    <el-col :span="20">
      <el-input
          v-model="contest"
          :autosize="{ minRows: 10, maxRows: 10 }"
          type="textarea"
          placeholder="输入Markdown文档"
      />
    </el-col>
  </el-row>
  <br v-show="isShow">
  <br v-show="isShow">
  <el-row justify="center" align="middle" v-show="isShow">
    <el-button type="primary" plain @click="isShow=false">渲染文档</el-button>
  </el-row>
  <br>
  <el-row justify="center" align="middle" v-show="isShow">
    <el-upload
        action=""
        :auto-upload="false"
        :limit="1"
        :on-change="handleFileChange">
      <el-button type="primary">读取Md文件</el-button>
    </el-upload>
  </el-row>
  <el-row justify="center" align="middle" v-show="!isShow">
    <el-button type="primary" plain @click="isShow=true">重新编写</el-button>
  </el-row>
  <br>
  <el-row justify="space-around" align="top" v-show="!isShow" class="preview-container">
    <el-col :span="6" class="catalog-left">
      <MdCatalog
          :editorId="id"
          :scrollElement="scrollElement"
          style="margin-bottom: 30px;height: 90vh"
      />
    </el-col>
    <el-col :span="16" class="preview-right">
      <MdPreview :modelValue="contest" :showCodeRowNumber="true" :id="id" :codeFoldable="false"/>
    </el-col>
  </el-row>
</template>

<style scoped>
.preview-container {
  position: relative;
  min-height: 100vh;
}

.catalog-left {
  position: fixed;
  left: 20px;
  top: 20px;
  font-weight: 500;
  color: #292727;
  overflow-y: auto;
  z-index: 1000;
}

.preview-right {
  margin-left: 28%;
}

@media (max-width: 1000px) {
  .catalog-left {
    display: none;
  }

  .preview-right {
    margin-left: 0;
    flex-basis: calc(100%);
    max-width: calc(100%);
  }
}
</style>

```
