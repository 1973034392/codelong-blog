---
title: UI重构
---
## 重构UI结构

### 重写菜单栏

这部分代码费了很大心思,但我是后端程序员,代码也不难懂,所以只贴一个代码

```vue
<script setup lang="js">
import {useUserStore} from "@/stores/user";
import {storeToRefs} from "pinia";
import router from "@/router/index.js";
import {logout} from "@/net/index.js";
import {onMounted} from "vue";

let {userInfo} = storeToRefs(useUserStore())

router.afterEach(() => {
  const links = document.querySelectorAll('.nav-links a')
  links.forEach(link=>{
    link.classList.remove('active')
  })

  //根据当前URL设置活动链接
  const currentPath = window.location.pathname;
  links.forEach(link => {
    let myLink = link.getAttribute('path')
    let detail = link.getAttribute('detail')
    if (myLink !== null) {
      if (myLink ===currentPath) {
        link.classList.add('active');
      }
    }
    if (detail !== null) {
      if (currentPath.endsWith(detail)) {
        link.classList.add('active');
      }
    }
  });
})

onMounted(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links,.submenu');
  const links = document.querySelectorAll('.nav-links a');
  const hasSubmenu = document.querySelector('.has-submenu');

  const currentPath = window.location.pathname;
  console.log(currentPath)
  links.forEach(link => {
    let myLink = link.getAttribute('path')
    let detail = link.getAttribute('detail')
    if (myLink !== null) {
      if (myLink ===currentPath) {
        link.classList.add('active');
      }
    }
    if (detail !== null) {
      console.log(detail)
      if (currentPath.endsWith(detail)) {
        link.classList.add('active');
      }
    }
  });

  //切换移动菜单
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  //当点击外部时关闭移动菜单
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });

  //在移动设备上切换子菜单
  if (window.innerWidth <= 768) {
    hasSubmenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.nextElementSibling) {
        e.preventDefault();
        hasSubmenu.classList.toggle('active');
      }
    });
  }

  //单击链接时关闭移动菜单
  links.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
})
</script>

<template>
  <el-container>
    <nav class="navbar">
      <router-link to="/home">
        <div class="logo">
          <el-row>
            <img src="@/assets/logo.png" alt="logo图片" style="height: 60px;margin-left: 30px">
          </el-row>
        </div>
      </router-link>
      <div class="menu-toggle">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
      <ul class="nav-links">
        <li><a path="/home" @click="router.push('/home')">首页</a></li>
        <li><a detail="problemDetail" path="/problem" @click="router.push('/problem')">题目</a></li>
        <li><a detail="problemListDetail" path="/problemList" @click="router.push('/problemList')">题单</a></li>
        <li><a detail="recordDetail" path="/record" @click="router.push('/record')">记录</a></li>
        <li><a detail="contestDetail" path="/contest" @click="router.push('/contest')">比赛</a></li>
        <li><a path="/mine" @click="router.push('/mine')" class="show">个人信息</a></li>
        <li><a path="/logout" @click="logout()" class="show">退出登录</a></li>
        <li class="has-submenu">
          <div style="display: flex;align-items: center">
            <img :src="userInfo.avatar || 'https://1973034392.obs.cn-north-4.myhuaweicloud.com/defaultAvatar.png'"
                 alt="用户头像"
                 style="height: 30px; border-radius: 50%; margin-right: 5px;">
            <span style="margin-left: 5px;">{{ userInfo.nickname }}</span>
          </div>
          <ul class="submenu">
            <li><a @click="router.push('/mine')">个人信息</a></li>
            <li><a @click="logout()">退出登录</a></li>
          </ul>
        </li>
      </ul>
    </nav>
    <el-main style="height: auto;background-color: #EFF3F5;z-index: 200">
      <router-view/>
    </el-main>
    <el-footer class="footer" style=" background-color: #ffffff;height: auto">
      <div style="margin: 0 30px">
        <el-row justify="center">
          <el-col :span="10" style="margin-top: 10px">
            <div style="display: flex;justify-content: center">
              <div style="font-size: 16px;margin-right: 5px">
                Powered by
              </div>
              <el-link
                  style="font-size: medium;vertical-align: text-bottom;color: #409EFF;"
                  target="_blank"
                  href="http://codelong.top/"
              >CodeLong
              </el-link>
            </div>
          </el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="3" style="text-align: center; margin:10px 0;font-size: large">
            <router-link to="/about" class="aboutUs" style="color: #409EFF;">
              关于我们
            </router-link>
          </el-col>
        </el-row>
      </div>
    </el-footer>
  </el-container>
</template>

<style scoped>
a {
  cursor: pointer;
}

.footer a:visited {
  color: inherit;
  text-decoration: none;
}

.navbar {
  background: #fff;
  padding: 0.5rem 2rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1000;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  align-items: center
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-size: 1rem;
  position: relative;
  padding-bottom: 5px;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #007bff;
  transition: width 0.3s ease;
}

.nav-links a.active::after,
.nav-links a:hover::after {
  width: 100%;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  position: relative;
  z-index: 1001;
}

.bar {
  width: 25px;
  height: 3px;
  background: #333;
  transition: all 0.3s ease;
}

/* 子菜单样式 */
.has-submenu {
  position: relative;
  vertical-align: center;
}

.submenu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  list-style: none;
  min-width: 100%;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 1000;
  padding-left: 0
}

.has-submenu:hover .submenu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.submenu li {
  padding: 0.5rem 1rem;
}

.submenu a {
  display: block;
  padding: 0.5rem 0;
}

@media (max-width: 1200px) {
  .footer {
    display: none;
  }
}

@media screen and (min-width: 768px) {
  .show {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .show {
    display: flex;
  }

  .nav-links {
    position: fixed;
    right: -100%;
    top: 0;
    height: 100vh;
    width: 70%;
    max-width: 300px;
    background: #fff;
    flex-direction: column;
    padding: 2rem;
    transition: right 0.3s ease;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  }

  .nav-links.active {
    right: 0;
  }

  .nav-links li {
    margin: 1rem 0;
  }

  /* 移动子菜单样式 */
  .submenu {
    position: relative;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    padding-left: 1rem;
    max-height: 0;
    z-index: 10001000;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .has-submenu.active .submenu {
    max-height: 500px;
  }

  /* Hamburger animation */
  .menu-toggle.active .bar:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .menu-toggle.active .bar:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle.active .bar:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }
}
</style>
```

### 重写home部分组件

```vue
<template>
  <div>
    <el-row justify="space-around">
      <el-col :span="12" id="left-col">
        <div class="left" id="left-box">
          <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);background-color: #fff;border-radius: 8px;">
            <div
                style="font-size: large;font-weight: 700;
                color: #409EFF;padding-top: 20px;
                text-align: center;font-style: italic">
              欢迎使用算法队OnlineJudge
            </div>
            <el-image src="https://1973034392.obs.cn-north-4.myhuaweicloud.com/preview.jpg"
                      style="margin: 10px 20px"></el-image>
          </div>

          <div
              style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);margin-top: 30px;padding: 10px;background-color: #fff;border-radius: 8px;">
            <div class="announcement-list">
              <el-row style="margin: 20px 0 20px 20px">
                <div class="top"
                     style="font-size: 18px;display: flex; align-items: center;vertical-align: top;height: 18px;color:#00a4ff">
                  <el-icon style="margin-right: 5px" color="#409EFF" size="25px">
                    <ChatDotRound/>
                  </el-icon>
                  公告
                </div>
              </el-row>
              <el-row style="margin: 10px 20px 20px 20px;">
                <n-collapse :trigger-areas="['main','extra','arrow']" :accordion="true" :default-expanded-names="['1']">
                  <n-collapse-item :title="announcement.title" :name="announcement.id.toString()"
                                   v-for="announcement in announcements" :key="announcement.id">
                    <div style="padding-left: 30px;border-left:2px solid #00a4ff">{{ announcement.text }}</div>
                  </n-collapse-item>
                </n-collapse>
              </el-row>
            </div>
          </div>

          <div
              style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);margin-top: 30px;padding: 10px;background-color: #fff;border-radius: 8px;">
            <div class="lastWeek">
              <el-row style="margin: 20px 0 20px 20px">
                <div class="top"
                     style="font-size: 18px;display: flex; align-items: center;vertical-align: top;height: 18px;color:#00a4ff">
                  <el-icon style="margin-right: 5px" color="#409EFF" size="25px">
                    <Stopwatch/>
                  </el-icon>
                  最近一周做题记录
                </div>
              </el-row>
              <el-row style="margin: 10px 20px 20px 20px;">
                <div ref="chartContainer" style="width: 760px; height: 500px; display: flex;"></div>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="10" id="right-col">

        <div class="right" id="right-box">
          <div
              style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);background-color: #fff;border-radius: 8px;">
            <div class="container">
              <h1>算法竞赛列表</h1>
              <div class="competition-list">
                <div class="competition-card">
                  <div class="competition-status in-progress">
                    <span class="status-dot"></span>
                    进行中
                  </div>
                  <div class="competition-info">
                    <h2>算法队招新</h2>
                    <div class="competition-meta">
                      <div class="meta-item">
                        <svg viewBox="0 0 24 24" class="icon">
                          <path d="M12,4C7.58,4,4,7.58,4,12s3.58,8,8,8s8-3.58,8-8S16.42,4,12,4z M13,14h-2V7h2V14z"
                                fill="currentColor"/>
                        </svg>
                        剩余20天
                      </div>
                      <div class="meta-item">
                        <svg viewBox="0 0 24 24" class="icon">
                          <path
                              d="M16,11c1.66,0,2.99-1.34,2.99-3S17.66,5,16,5c-1.66,0-3,1.34-3,3s1.34,3,3,3z M8,11c1.66,0,2.99-1.34,2.99-3S9.66,5,8,5C6.34,5,5,6.34,5,8s1.34,3,3,3z M8,13c-2.33,0-7,1.17-7,3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z M16,13c-0.29,0-0.62,0.02-0.97,0.05c1.16,0.84,1.97,1.97,1.97,3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                              fill="currentColor"/>
                        </svg>
                        5人参与
                      </div>
                    </div>
                  </div>
                </div>

                <div class="competition-card">
                  <div class="competition-status completed">
                    <span class="status-dot"></span>
                    已结束
                  </div>
                  <div class="competition-info">
                    <h2>山带算法赛</h2>
                    <div class="competition-meta">
                      <div class="meta-item">
                        <svg viewBox="0 0 24 24" class="icon">
                          <path
                              d="M11.99,2C6.47,2,2,6.48,2,12s4.47,10,9.99,10C17.52,22,22,17.52,22,12S17.52,2,11.99,2z M12,20c-4.42,0-8-3.58-8-8s3.58-8,8-8s8,3.58,8,8S16.42,20,12,20z M12.5,7H11v6l5.25,3.15l0.75-1.23l-4.5-2.67V7z"
                              fill="currentColor"/>
                        </svg>
                        2023/10/15 14:00
                      </div>
                      <div class="meta-item">
                        <svg viewBox="0 0 24 24" class="icon">
                          <path
                              d="M16,11c1.66,0,2.99-1.34,2.99-3S17.66,5,16,5c-1.66,0-3,1.34-3,3s1.34,3,3,3z M8,11c1.66,0,2.99-1.34,2.99-3S9.66,5,8,5C6.34,5,5,6.34,5,8s1.34,3,3,3z M8,13c-2.33,0-7,1.17-7,3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z M16,13c-0.29,0-0.62,0.02-0.97,0.05c1.16,0.84,1.97,1.97,1.97,3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                              fill="currentColor"/>
                        </svg>
                        81人参与
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
              style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);margin-top: 30px;background-color: #fff;border-radius: 8px;">
            <h1 style="padding-top: 20px">最近一月做题排名</h1>
            <table class="problem-table">
              <thead>
              <tr>
                <th>#</th>
                <th>用户名</th>
                <th>提交数</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="user in rankList">
                <td>{{ user.rankNumber }}</td>
                <td>{{ user.nickname }}</td>
                <td>{{ user.subNumber }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div
              style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding-top: 10px; margin-top: 30px;background-color: #fff;border-radius: 8px;">
            <h1>最新题目</h1>
            <table class="problem-table">
              <thead>
              <tr>
                <th>ID</th>
                <th>中文标题</th>
                <th>更新时间</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="problem in problems" @click="router.push({name:'problemDetail',query:{id: problem.id}})">
                <td>{{ problem.id }}</td>
                <td>{{ problem.title }}</td>
                <td>{{ problem.createTime }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
/* 默认情况下，左右两个盒子都显示 */
#left-col, #right-col {
  display: block;
}

/* 当屏幕宽度小于或等于1200px时 */
@media (max-width: 1200px) {
  #right-col {
    display: none; /* 隐藏右侧列 */
  }

  #left-col {
    flex-basis: calc(100%);
    max-width: calc(100%);
  }
}


.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 10px;
}

h1 {
  text-align: center;
  margin-bottom: 10px;
  color: #409EFF;
  font-size: 24px;
}

.competition-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px;
}

.competition-card {
  background: #f6f5f5;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s ease;
}

.competition-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.competition-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.in-progress {
  color: #00796b;
}

.in-progress .status-dot {
  background-color: #00796b;
  box-shadow: 0 0 0 2px rgba(0, 121, 107, 0.2);
}

.completed {
  color: #757575;
}

.completed .status-dot {
  background-color: #757575;
  box-shadow: 0 0 0 2px rgba(117, 117, 117, 0.2);
}

.competition-info h2 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
}

.competition-meta {
  display: flex;
  gap: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
}

.icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 480px) {
  .container {
    padding: 16px;
  }

  .competition-card {
    padding: 16px;
  }

  .competition-meta {
    flex-direction: column;
    gap: 8px;
  }
}


:root {
  --primary-color: #2196f3;
  --hover-color: #1976d2;
  --bg-color: #f5f5f5;
  --table-header-bg: #e3f2fd;
  --border-color: #e0e0e0;
}

.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

input, select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}

input {
  flex: 1;
}

select {
  width: 150px;
}

.problem-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 8px;
  overflow: hidden;
}

thead {
  background-color: var(--table-header-bg);
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  font-weight: 600;
  color: #1565c0;
}

tbody tr:hover {
  background-color: #f5f5f5;
  transition: background-color 0.2s ease;
}

tbody tr:last-child td {
  border-bottom: none;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }

  th, td {
    padding: 0.75rem 0.5rem;
  }

  .problem-table {
    font-size: 0.9rem;
  }
}

/* 添加一些动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.problem-table {
  animation: fadeIn 0.5s ease-out;
}

tbody tr {
  transition: transform 0.2s ease;
}

tbody tr:hover {
  transform: translateX(5px);
}
</style>
```

### 适配了移动端

主要代码:

```css
@media (max-width: 900px) {
.big-box{
  flex-basis: calc(100%);
  max-width: calc(100%);
}
}
```

### 提交结果页的重构

```vue
<script setup lang="js">
import {ref, onMounted, watch} from "vue";
import {easyPost} from "@/net/index.js";
import router from "@/router/index.js";

let pageSize = ref(10)
let pageNumber = ref(1)
let problemId = ref("")
let resultType = ref(100)
let count = ref(0)

onMounted(() => {
  fetchRecord()
})

watch(resultType, () => {
  fetchRecord()
}, {deep: true})

const record = ref([])
const fetchRecord = async () => {
  await fetchCount()
  const data = await easyPost('/record/problemRecord', {
    problemId: problemId.value === "" ? null : problemId.value,
    resultType: resultType.value,
    pageNumber: pageNumber.value,
    pageSize: pageSize.value
  })
  if (data) {
    record.value = data
    window.scrollTo(0, 0)
  }
}

const fetchCount = async () => {
  const data = await easyPost('/record/problemRecordNumber', {
    problemId: problemId.value === "" ? null : problemId.value,
    resultType: resultType.value,
  })
  if (data) {
    count.value = data
  }
}

function resultClass(a) {
  if (a === 1) {
    return 'result-card accepted'
  } else if (a === 0) {
    return 'result-card compile-error'
  } else {
    return 'result-card unaccepted'
  }
}
</script>

<template>
  <el-row justify="center">
    <el-col :span="20" class="large-box">
      <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px;border-radius: 8px;background-color: #FFFFFF;margin-top: 10px"
           v-if="record.length!==0">
        <el-row justify="space-around" align="middle">
          <el-col :span="5" style="color:#409EFF;font-size: 30px;font-weight: 700;margin-left: 30px">
            评测记录
          </el-col>
          <el-col :span="8">
            <el-row justify="space-around" align="middle">
              <el-col :span="18">
                <el-input placeholder="题目ID" v-model="problemId"/>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" plain @click="fetchRecord()">搜索</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <el-row justify="start" align="middle">
              <el-col class="show" :span="6">
                记录状态
              </el-col>
              <el-col class="show" :span="18">
                <el-select
                    placeholder="选择状态"
                    v-model="resultType"
                    style="width: 150px"
                >
                  <el-option
                      :key="100"
                      label="所有"
                      :value="100"
                  />
                  <el-option
                      :key="3"
                      label="已通过"
                      :value="3"
                  />
                  <el-option
                      :key="0"
                      label="未通过"
                      :value="0"
                  />
                  <el-option
                      :key="6"
                      label="编译失败"
                      :value="6"
                  />
                </el-select>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div class="container">
          <div class="judge-results">
            <div :class="resultClass(domain.subResult)" v-for="domain in record"
                 @click="router.push({name:'recordDetail',query:{submissionId: domain.submissionId}})">
              <div class="status-icon">✓</div>
              <div class="result-info">
                <div class="status" v-show="domain.subResult===1">Accepted</div>
                <div class="status" v-show="domain.subResult===2">Compile Error</div>
                <div class="status" v-show="domain.subResult===0">Unaccepted</div>
                <div class="score">得分: {{ domain.score }}/100</div>
                <el-button type="text" class="score" style="color: #409EFF" @click.stop="router.push({name:'problemDetail',query:{id: domain.problemId}})">
                  题目: {{ domain.problemTitle }}
                </el-button>
                <div class="details">
                  <span class="time" v-show="domain.subResult===2">执行时间: --</span>
                  <span class="time"
                        v-show="domain.subResult===0||domain.subResult===1">执行时间: {{ domain.judgeTime }} ms</span>
                  <span class="compiler">{{domain.codeLanguage}}</span>
                  <span class="timestamp">{{domain.subTime}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-row justify="center" style="margin-top: 20px">
          <el-pagination background layout="prev, pager, next" :total="count"
                         @current-change="(value)=>{pageNumber=value;fetchRecord()}" v-model="pageNumber"
                         :page-size="pageSize"/>
        </el-row>
      </div>
      <div
          style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px;background-color: #fff;margin-top: 20px;height: 500px"
          v-if="record.length===0">
        <el-row justify="center" align="middle">
          <el-empty description="暂无记录"/>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
a {
  text-decoration: none;
  color: black;
}

a:hover {
  color: #0056B3;
}

:root {
  --color-text: #333;
  --color-light: #f8f9fa;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.judge-results h1 {
  text-align: center;
  color: var(--color-text);
  margin-bottom: 2rem;
}

.result-card {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  border-radius: 25px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow);
  transition: transform 0.2s;
}

.result-card:hover {
  transform: translateY(-2px);
}

.status-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.accepted .status-icon {
  background: #28a745;
  color: white;
}

.compile-error .status-icon {
  background: #dc3545;
  color: white;
}

.unaccepted .status-icon {
  background: #ffc107;
  color: white;
}

.result-info {
  flex-grow: 1;
}

.status {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.accepted .status {
  color: #28a745;
}

.compile-error .status {
  color: #dc3545;
}

.unaccepted .status {
  color: #ffc107;
}

.score {
  font-size: 1rem;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.details span {
  display: inline-flex;
  align-items: center;
}

@media (max-width: 600px) {
  .details {
    flex-direction: column;
    gap: 0.5rem;
  }

  .result-card {
    flex-direction: column;
    text-align: center;
  }

  .status-icon {
    margin: 0 0 1rem 0;
  }
}

@media (max-width: 1000px) {
  .large-box{
    flex-basis: calc(100%);
    max-width: calc(100%);
  }
  .show{
    display: none;
  }
}
</style>
```

### 题单页的重构

```vue
<template>
  <div>
    <el-row justify="space-around">
      <el-col class="big-box" :span="20" id="left-col">
        <div class="left" id="left-box">
          <div
              style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px;background-color: #fff;border-radius: 8px;">
            <el-row class="problemHeader" align="middle">
              <el-col :span="4" style="vertical-align: top;font-size: 30px;color: #409EFF;font-weight: 700"
                      class="hide">
                题单列表
              </el-col>
              <el-col :span="6" :offset="1">
                <div>
                  <el-input @keyup.enter="fetchProblemList" v-model="search" maxlength="13" type="text"
                            placeholder="输入题单关键词"
                            style="width: 300px"
                            clearable>
                    <template #append>
                      <el-button @click="fetchProblemList()">
                        <el-icon>
                          <Search/>
                        </el-icon>
                      </el-button>
                    </template>
                  </el-input>
                </div>
              </el-col>
            </el-row>
            <el-row class="difficultySelection" align="middle">
              <el-col>
                <el-row style="margin-top: 10px">
                  <table class="problem-table">
                    <thead>
                    <tr>
                      <th>题单ID</th>
                      <th>标题</th>
                      <th>题目数</th>
                      <th>最近更新时间</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="problem in problemList"
                        @click="router.push({name:'problemListDetail',query:{id: problem.id}})">
                      <td>{{ problem.id }}</td>
                      <td>{{ problem.name }}</td>
                      <td>{{ problem.number }}</td>
                      <td>{{ problem.updateTime }}</td>
                    </tr>
                    </tbody>
                  </table>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
>>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: rgba(64, 158, 255, 0.2);
}

>>> .el-table {
  --el-table-header-bg-color: #fff;
}

>>> th.el-table_1_column_2.is-leaf.el-table__cell {
  padding-left: 15px;
}

>>> th.el-table_1_column_3.is-leaf.el-table__cell {
  padding-left: 5px;
}

>>> th.el-table_1_column_5.is-leaf.el-table__cell {
  padding-left: 20px;
}

>>> .el-table tr {
  background-color: #fff;
}

@media (max-width: 1200px) {
  .hide {
    display: none;
  }
}

:root {
  --primary-color: #2196f3;
  --hover-color: #1976d2;
  --bg-color: #f5f5f5;
  --table-header-bg: #e3f2fd;
  --border-color: #e0e0e0;
}

input, select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}

input {
  flex: 1;
}

select {
  width: 150px;
}

.problem-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 8px;
  overflow: hidden;
}

thead {
  background-color: var(--table-header-bg);
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  font-weight: 600;
  color: #1565c0;
}

tbody tr:hover {
  background-color: #f5f5f5;
  transition: background-color 0.2s ease;
}

tbody tr:last-child td {
  border-bottom: none;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }

  th, td {
    padding: 0.75rem 0.5rem;
  }

  .problem-table {
    font-size: 0.9rem;
  }
}

/* 添加一些动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.problem-table {
  animation: fadeIn 0.5s ease-out;
}

tbody tr {
  transition: transform 0.2s ease;
}

tbody tr:hover {
  transform: translateX(5px);
}

@media (max-width: 800px) {
  .big-box{
    flex-basis: calc(100%);
    max-width: calc(100%);
  }
}
</style>
```

### 题目页的重构

```vue
<script setup lang="js">

import {onMounted, ref, watch} from "vue";
import {easyPost} from "@/net/index.js";
import {useUserStore} from "@/stores/user.js";
import router from "@/router/index.js";

let search = ref('')
let hardSelect = ref(0)
let pageNumber = ref(1)
let pageSize = ref(30)

function changeHard(hard) {
  hardSelect.value = hard
  fetchProblems()
}

watch(search, (newValue, oldValue) => {
  if (newValue === '') {
    fetchProblems()
  }
}, {deep: true})

onMounted(() => {
  fetchProblems();
  fetchTags()
})

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFD93D', '#FF9F1C', '#6C5B7B', '#19647E', '#119DA4', '#7CB518', '#E07A5F', '#3D405B', '#81B29A', '#F2CC8F'];
function getRandomColor() {
  return this.colors[Math.floor(Math.random() * this.colors.length)];
}

const problems = ref([])
const fetchProblems = async () => {
  const data = await easyPost('/problem', {
    search: search.value === '' ? '' : search.value,
    hard: hardSelect.value,
    pageSize: pageSize.value,
    pageNumber: pageNumber.value
  })
  if (data) {
    problems.value = data
  }
}

const tags = ref([])
const fetchTags = async () => {
  const data = await easyPost('/tag/query')
  if (data) {
    tags.value = data
  }
}

</script>

<template>
  <div>
    <el-row justify="space-around">
      <el-col class="large-box" :span="16">
        <div class="left" id="left-box">
          <div
              style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px;background-color: #fff;border-radius: 8px;">
            <el-row class="problemHeader" align="middle">
              <el-col :span="4" style="vertical-align: top;font-size: 30px;color: #409EFF;font-weight: 700"
                      class="hide">
                题目列表
              </el-col>
              <el-col :span="6" :offset="1">
                <div>
                  <el-input style="width: 300px;" @keyup.enter="fetchProblems" v-model="search" maxlength="13" type="text"
                            placeholder="输入题目关键词" clearable>
                    <template #append>
                      <el-button @click="fetchProblems()">
                        <el-icon>
                          <Search/>
                        </el-icon>
                      </el-button>
                    </template>
                  </el-input>
                </div>
              </el-col>
            </el-row>
            <el-row class="difficultySelection" align="middle" style="margin: 10px 0 0 20px">
              <el-col :span="3" style="font-size: 20px;font-weight: 700" class="hide">
                难度
              </el-col>
              <el-col :span="20">
                <div>
                  <el-button type="primary" :plain="hardSelect!==0" @click="changeHard(0)">全部</el-button>
                  <el-button type="primary" :plain="hardSelect!==1" @click="changeHard(1)">简单</el-button>
                  <el-button type="primary" :plain="hardSelect!==2" @click="changeHard(2)">中等</el-button>
                  <el-button type="primary" :plain="hardSelect!==3" @click="changeHard(3)">困难</el-button>
                </div>
              </el-col>
              <el-col>
                <el-row style="margin-top: 10px">
                  <el-table :data="problems.list" style="width: 100%" stripe size="large"
                            @row-click="(row)=>{router.push({name:'problemDetail',query:{id: row.id}})}">
                    <el-table-column label="状态" width="60">
                      <template #default="scope">
                        <el-icon v-show="!useUserStore().isPassedMatch(scope.row.id)">
                          <SemiSelect/>
                        </el-icon>
                        <el-icon v-show="useUserStore().isPassedMatch(scope.row.id)"><Select style="color: #5CC272"/>
                        </el-icon>
                      </template>
                    </el-table-column>
                    <el-table-column label="题目ID" width="150">
                      <template #default="scope">
                        <div style="display: flex; align-items: center;padding-left: 7px;font-weight: 700">
                          <span>{{ scope.row.id }}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="题目" width="200">
                      <template #default="scope">
                        <div style="display: flex; align-items: center">
                          <span>{{ scope.row.title }}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="难度" width="200">
                      <template #default="scope">
                        <div style="display: flex; align-items: center">
                          <span>
                            <el-tag type="success" effect="dark" v-show="scope.row.hard===1">简单</el-tag>
                            <el-tag type="warning" effect="dark" v-show="scope.row.hard===2">中等</el-tag>
                            <el-tag type="danger" effect="dark" v-show="scope.row.hard===3">困难</el-tag>
                          </span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="总数" width="200">
                      <template #default="scope">
                        <div style="display: flex; align-items: center;font-weight: 600">
                          <span>{{ scope.row.total }}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="AC通过率">
                      <template #default="scope">
                        <div style="display: flex; align-items: center">
                          <el-progress status="warning" style="width: 200px" :text-inside="true" :stroke-width="26"
                                       :percentage="Math.round(scope.row.acRate * 100)"
                                       v-if="Number(scope.row.acRate) < 0.3"/>
                          <el-progress status="exception" style="width: 200px" :text-inside="true" :stroke-width="26"
                                       :percentage="Math.round(scope.row.acRate * 100)"
                                       v-else-if="Number(scope.row.acRate) >= 0.3 && Number(scope.row.acRate) < 0.5"/>
                          <el-progress style="width: 200px" :text-inside="true" :stroke-width="26"
                                       :percentage="Math.round(scope.row.acRate * 100)"
                                       v-else-if="Number(scope.row.acRate) >= 0.5 && Number(scope.row.acRate) < 1"/>
                          <el-progress status="success" style="width: 200px" :text-inside="true" :stroke-width="26"
                                       :percentage="Math.round(scope.row.acRate * 100)" v-else/>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-row>
              </el-col>
            </el-row>
            <el-row justify="center" style="margin-top: 20px">
              <el-pagination background layout="prev, pager, next" :total="problems.total"
                             @current-change="(value)=>{pageNumber=value;fetchProblems()}" v-model="pageNumber"
                             :page-size="pageSize"
                             hide-on-single-page/>
            </el-row>
          </div>
        </div>
      </el-col>

      <el-col :span="6" id="right-col">
        <div class="right" id="right-box">
          <div
              style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px;background-color: #fff;border-radius: 8px;">
            <el-row justify="center">
              <el-col :span="8" style="font-size: 30px;margin-bottom: 20px; color: #409EFF;font-weight: 700;text-align: center">
                标签列表
              </el-col>
            </el-row>
            <div class="tag-container">
              <span class="tag" :style="{ '--tag-color': getRandomColor() }" v-for="tag in tags" :key="tag.id">{{
                  tag.name
                }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
>>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: rgba(64, 158, 255, 0.2);
}

>>> .el-table {
  --el-table-header-bg-color: #fff;
}

>>> th.el-table_1_column_2.is-leaf.el-table__cell {
  padding-left: 15px;
}

>>> th.el-table_1_column_3.is-leaf.el-table__cell {
  padding-left: 5px;
}

>>> th.el-table_1_column_5.is-leaf.el-table__cell {
  padding-left: 20px;
}

>>> .el-table tr {
  background-color: #fff;
}

@media (max-width: 1200px) {
  #right-col {
    display: none; /* 隐藏右侧列 */
  }

  #left-col {
    flex-basis: calc(100% / 24 * 22); /* 左侧列占22个栅格 */
    max-width: calc(100% / 24 * 20);
  }

  .hide {
    display: none;
  }
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: var(--tag-color);
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  filter: brightness(1.1);
}

@media (max-width: 768px) {
  .tag {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .tag-container {
    gap: 0.8rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.5rem;
  }

  .tag-container {
    gap: 0.6rem;
  }
}

@media (max-width: 1000px) {
  .large-box{
    flex-basis: calc(100%);
    max-width: calc(100%);
  }
}
</style>
```

### 登录页

> 重构了登录页等页面的背景和效果

```vue
<script setup>

</script>

<template>
  <div class="body">
    <div class="container">
      <router-view v-slot="{ Component }">
        <transition name="el-fade-in-linear" mode="out-in">
          <Component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.body {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  padding: 20px;
  width: 100%;
  max-width: 440px;
}

@media (max-width: 480px) {
  .container {
    padding: 15px;
  }

  .login-header h2 {
    font-size: 24px;
  }
}

</style>
```



#### 登录页的重构

```vue
<template>
  <div class="login-box">
    <div class="login-header">
      <h2>算法队OnlineJudge</h2>
      <p>请登录你的账号</p>
    </div>
    <form class="login-form">
      <el-form :model="form" :rules="rule" ref="formRef">
        <el-form-item prop="username">
          <el-input v-model="form.username" maxlength="13" type="text" placeholder="用户名" size="large">
            <template #prefix>
              <el-icon>
                <User/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" size="large">
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12" style="text-align: left">
            <el-form-item prop="remember">
              <el-checkbox v-model="form.remember" label="记住我" style="margin-left: 15px; font-weight: bold"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button type="text" class="forgot-password" @click="router.push('/login/forget')">忘记密码</el-button>
          </el-col>
        </el-row>
      </el-form>
      <button type="submit" class="login-btn" @click="userLogin()">登录</button>
    </form>
    <div class="login-footer">
      <p>还没有账号? <a @click="router.push('/login/register')">立即注册</a></p>
    </div>
  </div>
</template>

<style scoped>
a{
  cursor: pointer;
}
.login-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 5px;
}

.login-header p {
  color: #666;
  font-size: 16px;
}

.form-group label {
  display: block;
  color: #555;
  margin-bottom: 5px;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #764ba2;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-footer a:hover {
  color: #764ba2;
}

</style>
```

#### 注册页的重构

```vue
<template>
  <div class="register-box">
    <div class="register-header">
      <h2>注册账号</h2>
      <p>请在下方填写相关信息</p>
    </div>
    <el-form :model="form" :rules="rule">
      <el-form-item prop="username">
        <el-input size="large" v-model="form.username" maxlength="13" type="text" placeholder="用户名">
          <template #prefix>
            <el-icon>
              <User/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input size="large" v-model="form.email" maxlength="30" type="text" placeholder="电子邮箱地址">
          <template #prefix>
            <el-icon>
              <Message/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="17">
            <el-input size="large" v-model="form.code" maxlength="6" type="text" placeholder="请输入验证码">
              <template #prefix>
                <el-icon>
                  <ChatLineRound/>
                </el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="5" style="margin-left: 10px">
            <el-button size="large" type="primary" plain v-if="sendCooling <= 0" @click="getCode()">获取验证码</el-button>
            <el-button size="large" type="primary" v-else loading> {{ sendCooling}} S</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="password">
        <el-input size="large" v-model="form.password" type="password" placeholder="密码">
          <template #prefix>
            <el-icon>
              <Lock/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password_repeat">
        <el-input size="large" v-model="form.password_repeat" type="password" placeholder="重复密码">
          <template #prefix>
            <el-icon>
              <Lock/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <button type="submit" class="register-btn" @click="register()">立即注册</button>
    <div class="register-footer">
      <p><a @click="router.push('/login')">回到登录页</a></p>
    </div>
  </div>
</template>

<style scoped>
a{
  cursor: pointer;
}
.register-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 5px;
}

.register-header p {
  color: #666;
  font-size: 16px;
}

.register-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.register-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.register-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-footer a:hover {
  color: #764ba2;
}
</style>
```



#### 找回密码页的重构

```vue
<template>
  <div class="signIn-box">
    <div class="signIn-header">
      <h2>忘记密码</h2>
    </div>
    <el-form :model="form" :rules="rule">
      <el-form-item prop="username">
        <el-input size="large" v-model="form.username" maxlength="13" type="text" placeholder="用户名">
          <template #prefix>
            <el-icon>
              <User/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input size="large" v-model="form.email" maxlength="30" type="text" placeholder="注册时的电子邮箱地址">
          <template #prefix>
            <el-icon>
              <Message/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input size="large" v-model="form.password" type="password" placeholder="密码">
          <template #prefix>
            <el-icon>
              <Lock/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password_repeat">
        <el-input size="large" v-model="form.password_repeat" type="password" placeholder="重复密码">
          <template #prefix>
            <el-icon>
              <Lock/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="17">
            <el-input size="large" v-model="form.code" maxlength="6" type="text" placeholder="请输入验证码">
              <template #prefix>
                <el-icon>
                  <ChatLineRound/>
                </el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="5" style="margin-left: 10px">
            <el-button size="large" type="primary" plain v-if="sendCooling <= 0" @click="getCode()">获取验证码
            </el-button>
            <el-button size="large" type="primary" v-else loading> {{ sendCooling }} S</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <button type="submit" class="change-btn" @click="changePassword()">修改密码</button>
    <div class="signIn-footer">
      <p><a @click="router.push('/login')">回到登录页</a></p>
    </div>
  </div>
</template>

<style scoped>
a {
  cursor: pointer;
}

.signIn-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.signIn-header {
  text-align: center;
  margin-bottom: 30px;
}

.signIn-header h2 {
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 5px;
}

.change-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.change-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.signIn-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.signIn-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signIn-footer a:hover {
  color: #764ba2;
}
</style>
```

### 比赛页

```vue
<template>
  <div>
    <el-row justify="space-around">
      <el-col :span="16" class="big-box">
        <div>
          <div
              style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px;background-color: #fff;border-radius: 8px;">
            <el-row class="problemHeader" align="middle" style="margin-bottom: 20px">
              <el-col class="hide" :span="6"
                      style="vertical-align: top;font-size: 30px;color: #409EFF;font-weight: 700">
                比赛列表
              </el-col>
              <el-col class="hide" :span="6">
                <div>
                  <el-input @keyup.enter="fetchContest()" v-model="search" maxlength="20" type="text"
                            placeholder="输入比赛关键词" clearable>
                    <template #append>
                      <el-button @click="fetchContest()">
                        <el-icon>
                          <Search/>
                        </el-icon>
                      </el-button>
                    </template>
                  </el-input>
                </div>
              </el-col>
              <el-col :span="4" :offset="1">
                <el-select
                    placeholder="Select"
                    v-model="status"
                    style="width: 150px"
                >
                  <el-option
                      :key="-1"
                      label="所有"
                      :value="-1"
                  />
                  <el-option
                      :key="0"
                      label="未开始"
                      :value="0"
                  />
                  <el-option
                      :key="1"
                      label="正在进行中"
                      :value="1"
                  />
                  <el-option
                      :key="2"
                      label="已结束"
                      :value="2"
                  />
                </el-select>
              </el-col>
            </el-row>
            <div style="margin-top: 10px">

              <div class="container">
                <div class="contest-list">
                  <div class="contest-item" v-for="domain in contest"
                       @click="router.push({name:'contestDetail',query:{id: domain.id}})">
                    <div class="contest-icon">
                      <svg t="1737259697150" class="icon" viewBox="0 0 1024 1024" version="1.1"
                           xmlns="http://www.w3.org/2000/svg" p-id="4501"
                           data-spm-anchor-id="a313x.search_index.0.i0.40193a81i80Kru" width="32" height="32">
                        <path
                            d="M387.289674 263.516696c-17.246803 0-31.221072 13.974269-31.221072 31.221072l0 31.220049c0 17.246803 13.974269 31.221072 31.221072 31.221072s31.220049-13.974269 31.220049-31.221072l0-31.220049C418.509722 277.490965 404.536476 263.516696 387.289674 263.516696z"
                            fill="#1296db" p-id="4502"></path>
                        <path
                            d="M637.054157 263.516696c-17.246803 0-31.221072 13.974269-31.221072 31.221072l0 31.220049c0 17.246803 13.974269 31.221072 31.221072 31.221072s31.221072-13.974269 31.221072-31.221072l0-31.220049C668.274206 277.490965 654.299937 263.516696 637.054157 263.516696z"
                            fill="#1296db" p-id="4503"></path>
                        <path
                            d="M588.933183 401.13296c-14.522762-9.28855-33.822316-5.081739-43.131333 9.451256-0.121773 0.193405-13.374612 19.441794-33.954323 19.441794-19.980054 0-32.410154-18.090007-33.253358-19.35993-9.166777-14.421454-28.243251-18.801205-42.816155-9.766434-14.644535 9.106402-19.147082 28.354791-10.050913 42.999326 11.209296 18.038842 41.952484 48.569182 86.120426 48.569182 43.934628 0 75.063603-30.296003 86.536912-48.202838C607.683223 429.751764 603.455945 410.432767 588.933183 401.13296z"
                            fill="#1296db" p-id="4504"></path>
                        <path
                            d="M866.426195 172.243923c-1.137916-0.020466-2.225691-0.020466-3.353374 0.010233l-66.181305 0L796.891516 110.066815c0-17.246803-13.974269-31.220049-31.220049-31.220049L375.210567 78.846766c-17.246803 0-31.220049 13.974269-31.220049 31.220049s13.974269 31.220049 31.220049 31.220049l359.239827 0 0 306.981626c0 122.463146-99.627045 222.100424-222.091214 222.100424s-222.091214-99.637278-222.091214-222.100424l0-338.202699c0-17.246803-13.974269-31.220049-31.220049-31.220049s-31.220049 13.974269-31.220049 31.220049l0 62.187341-66.567092 0c-1.14815-0.040932-2.347464-0.020466-3.882424 0-51.221592 0-92.889597 41.678238-92.889597 92.910063 0 24.695448 9.593496 47.918359 27.02347 65.459874l135.502114 145.919371c0.757247 0.816598 1.638313 1.429559 2.459005 2.145873 14.134929 132.37489 119.401414 237.868549 251.665787 252.374938l0 152.291498L337.659323 883.354749c-17.246803 0-31.220049 13.974269-31.220049 31.220049s13.974269 31.221072 31.220049 31.221072l349.401762 0c17.246803 0 31.220049-13.974269 31.220049-31.221072s-13.974269-31.220049-31.220049-31.220049L543.580253 883.354749 543.580253 731.063251c132.3841-14.520715 237.729379-120.18936 251.710812-252.734118 0.674359-0.610914 1.416256-1.107217 2.047636-1.786693L932.840814 330.62307c17.428951-17.541515 27.013237-40.753169 27.013237-65.459874C959.854051 213.932394 918.186046 172.254156 866.426195 172.243923zM136.869251 287.714817c-0.294712-0.315178-0.589424-0.620124-0.89437-0.925069-5.833869-5.792936-9.045003-13.465686-9.045003-21.626553 0-16.799618 13.659091-30.468942 30.448476-30.468942l1.564635-0.051165c0.568958 0.030699 1.14815 0.051165 1.717108 0.051165l67.166749 0 0 150.971433L136.869251 287.714817zM888.37816 286.789749c-0.304945 0.304945-0.599657 0.60989-0.89437 0.925069l-90.592274 97.556896L796.891516 234.695277l66.791196 0c0.568958 0 1.016143 0.020466 1.574868-0.020466l1.706875 0.020466c16.789385 0 30.448476 13.669324 30.448476 30.468942C897.41293 273.324062 894.201795 281.007045 888.37816 286.789749z"
                            fill="#1296db" p-id="4505"></path>
                      </svg>
                    </div>
                    <div class="contest-info">
                      <h3>{{ domain.name }}</h3>
                      <p class="contest-number">竞赛编号: {{ domain.id }}</p>
                    </div>
                    <div class="contest-status finished" v-show="domain.status===2">已结束</div>
                    <div class="contest-status active" v-show="domain.status===1">进行中</div>
                    <div class="contest-status upcoming" v-show="domain.status===0">未开始</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
a {
  color: inherit; /* 继承父元素的颜色 */
  text-decoration: none; /* 移除下划线 */
}

/* 鼠标悬停时的样式 */
a:hover {
  text-decoration: none; /* 添加下划线 */
}

/* 激活状态的样式 */
a:active {
  color: #00a4ff; /* 改变激活状态的颜色 */
}

@media (max-width: 1200px) {
  .hide {
    display: none;
  }
}

@media (max-width: 900px) {
  .big-box {
    flex-basis: calc(100%);
    max-width: calc(100%);
  }
}

:root {
  --primary-color: #1a73e8;
  --finished-color: #757575;
  --active-color: #34a853;
  --upcoming-color: #fbbc05;
  --background-color: #f8f9fa;
  --card-background: #ffffff;
  --text-color: #202124;
  --border-color: #e0e0e0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.5;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.contest-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contest-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.contest-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contest-icon {
  margin-right: 20px;
}

.contest-icon .icon {
  color: var(--primary-color);
}

.contest-info {
  flex: 1;
}

.contest-info h3 {
  font-size: 18px;
  margin-bottom: 4px;
}

.contest-number {
  color: #5f6368;
  font-size: 14px;
}

.contest-status {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.contest-status.finished {
  background-color: #f1f3f4;
  color: var(--finished-color);
}

.contest-status.active {
  background-color: #c9efd5;
  color: var(--active-color);
}

.contest-status.upcoming {
  background-color: #fef7e0;
  color: var(--upcoming-color);
}

@media (max-width: 600px) {
  .container {
    padding: 16px;
  }

  .contest-item {
    padding: 16px;
  }

  .contest-icon {
    margin-right: 16px;
  }

  .contest-icon i {
    font-size: 24px;
  }

  .contest-info h3 {
    font-size: 16px;
  }
}
</style>
```

## 比赛详情页

> 替换了原来的markdown文本显示工具,改变后的代码如下:

```vue
<script lang="js" setup>
import {useRoute} from 'vue-router'
import {onMounted, ref, watch} from "vue";
import {easyPost} from "@/net/index.js";
import router from "@/router/index.js";
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const route = useRoute()

onMounted(() => {
  fetchProblems()
})

const code = ref(useReplyStore().getReplyById(route.query.id)||'');
let languageChoice = ref(useReplyStore().getLanguage)

const languageWatch = watch(languageChoice,(newValue)=>{
  useReplyStore().updateLanguage(languageChoice.value)
})

const codeWatch = watch(code,(newValue)=>{
  useReplyStore().updateReply({
    id: route.query.id,
    code: newValue
  })
})

const detail = ref([])
const fetchProblems = async () => {
  const data = await easyPost('/problem/detail', route.query)
  if (data) {
    detail.value = data
  }
}

const language = [{
  select:0,
  id: 75,
  name: 'C',
  description: '判题机选用的是Clang 7.0.1'
}, {
  select:1,
  id: 76,
  name: 'C++',
  description: '判题机选用的是Clang 7.0.1'
}, {
  select:2,
  id: 62,
  name: 'Java',
  description: '判题机选用的是OpenJDK 13.0.1 , 类名必须为Main , 否则将编译失败'
}, {
  select:3,
  id: 63,
  name: 'JavaScript',
  description: '判题机选用的是Node.js 12.14.0'
}, {
  select:4,
  id: 71,
  name: 'Python',
  description: '判题机选用的版本是3.8.1'
}]

import Codemirror from 'codemirror-editor-vue3';
import 'codemirror/addon/edit/closebrackets.js'; // 自动闭合括号插件
import 'codemirror/addon/edit/matchbrackets'; // 匹配括号高亮插件
import 'codemirror/mode/clike/clike';
import {useReplyStore} from "@/stores/problem.js";
import {useUserStore} from "@/stores/user.js"; // C/C++ 模式

const cmOptions = {
  mode: 'text/x-java',
  matchBrackets: true,
  theme: 'default',
  line: true,
  lineNumbers: true,
  autoCloseBrackets: true,
}

const cmRef = ref()

const load = ref(false)

async function sendCode() {
  load.value=true
  const data = await easyPost('/judge', {
    problemId: route.query.id,
    language: language.find(lang => lang.select === languageChoice.value).id,
    code: code.value
  })
  load.value=false
  if (data) {
    await useUserStore().fetchUserInfo()
    await router.push({name: 'recordDetail', query: {submissionId: data}})
  }
}
</script>

<template>
  <div>
    <el-row justify="space-around">
      <el-col :span="11" id="left-col">
        <div class="left" id="left-box">
          <div
              style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px;background-color: #fff;border-radius: 8px;">
            <el-scrollbar style="height: 700px">
              <h1 style="font-size: 40px;color: #409EFF;text-align: center">{{ detail.title }}</h1>
              <el-row justify="space-around" align="middle">
                <el-col :span="8" style="vertical-align: bottom;font-weight: 700;color: #0d554c">
                  时空限制：{{ detail.timeLimit }}ms/{{ detail.memoryLimit }}mb
                </el-col>
                <el-col :span="8" style="vertical-align: bottom;font-weight: 700;color: #0d554c">
                  提交数:{{ detail.subNumber }} | AC数:{{ detail.acNumber }}
                </el-col>
                <el-col :span="3">
                  <div>
                    <el-tag type="primary" v-if="detail.difficulty===1" effect="dark"> 简单</el-tag>
                    <el-tag type="warning" v-if="detail.difficulty===2" effect="dark"> 中等</el-tag>
                    <el-tag type="danger" v-if="detail.difficulty===3" effect="dark"> 困难</el-tag>
                  </div>
                </el-col>
              </el-row>
              <div>
                <MdPreview :modelValue="detail.detail" />
              </div>
            </el-scrollbar>
          </div>
        </div>
      </el-col>

      <el-col :span="12" id="right-col">
        <div class="right" id="right-box">
          <div
              style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px;background-color: #fff;border-radius: 8px;">
            <el-row align="middle">
              <el-col :span="5">
                <el-select
                    placeholder="Select"
                    size="large"
                    v-model="languageChoice"
                    style="width: 150px"
                >
                  <el-option
                      v-for="item in language"
                      :key="item.select"
                      :label="item.name"
                      :value="item.select"
                  />
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" @click="sendCode()" element-loading-text="判题中..." v-loading.fullscreen.lock="load">提交代码</el-button>
              </el-col>
              <el-col :span="1">
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="language[languageChoice].description"
                    placement="bottom"
                >
                  <el-icon>
                    <WarningFilled/>
                  </el-icon>
                </el-tooltip>
              </el-col>
              <el-col>
                <Codemirror
                    v-model:value="code"
                    :options="cmOptions"
                    border
                    ref="cmRef"
                    height="650"
                    :autofocus="true"
                />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>

#content >>> pre {
  padding: 10px;
  background-color: #F8F8F8;
}

>>> .CodeMirror-code {
  font-size: 20px;
}

@media (max-width: 800px) {
  #right-col {
    display: none; /* 隐藏右侧列 */
  }

  #left-col {
    flex-basis: calc(100%);
    max-width: calc(100%);
  }
}
</style>
```

## 比赛密码页

```vue
<script setup lang="js">
import {easyPost} from "@/net/index.js";
import {ref} from 'vue'
import router from "@/router/index.js";
import {useRoute} from "vue-router";

const route = useRoute()

const password = ref('')
</script>

<template>
  <div style="height: 600px;display: flex;align-items: center;justify-content: center;">
    <div>
      <el-input v-model="password" placeholder="请输入密码"/>
    </div>
    <div>
      <el-button type="primary" plain @click="easyPost('/contest/password',{
        id: route.query.id,
        password: password
  },()=>{
    router.push({name:'contestDetail',query:{id: route.query.id}})
  })">确认密码
      </el-button>
    </div>
  </div>
</template>

<style scoped>

</style>
```

