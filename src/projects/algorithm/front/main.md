---
title: 前端主要页面编写
---
## 注册页面编写

### 页面结构

```vue
<div style="text-align: center;margin: 0 20px">
    <div style="font-size: 25px; font-weight: bold;margin-top: 150px">
      注册账号
    </div>
    <div style="font-size: 14px; color: gray;margin-top: 10px">请在下方填写相关信息</div>
    <div style="margin-top: 20px">
      <el-form :model="form" :rules="rule">
        <el-form-item prop="username">
          <el-input v-model="form.username" maxlength="13" type="text" placeholder="用户名">
            <template #prefix>
              <el-icon>
                <User/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.email" maxlength="30" type="text" placeholder="电子邮箱地址">
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
              <el-input v-model="form.code" maxlength="6" type="text" placeholder="请输入验证码">
                <template #prefix>
                  <el-icon>
                    <ChatLineRound/>
                  </el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="5" style="margin-left: 10px">
              <el-button type="success" plain v-if="sendCooling <= 0" @click="getCode()">获取验证码</el-button>
              <el-button type="primary" v-else loading> {{ sendCooling }} S</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码">
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password_repeat">
          <el-input v-model="form.password_repeat" type="password" placeholder="重复密码">
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-row justify="space-around">
        <el-button type="primary" style="width: 200px;margin-top: 10px" @click="register()">立即注册</el-button>
      </el-row>
      <el-row justify="space-around" style="margin-top: 10px">
        <el-button type="text" @click="router.push('/login')">回到登录页</el-button>
      </el-row>
    </div>
  </div>
```

### 验证码计时器

```js
function startCountdown(startValue) {
  sendCooling.value = startValue;
  const intervalId = setInterval(() => {
    sendCooling.value--;
    localStorage.setItem("codeCooling", sendCooling.value)
    if (sendCooling.value <= 0) {
      localStorage.removeItem("codeCooling")
      clearInterval(intervalId);
    }
  }, 1000); // 1000毫秒 = 1秒
}

let sendCooling = ref(0)

onMounted(() => {
  let cool = localStorage.getItem("codeCooling")
  if (cool) {
    sendCooling.value = cool
    startCountdown(cool)
  } else {
    sendCooling.value = 0
  }
})
```

### 验证码发送

```js
function getCode() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let result = emailRegex.test(form.value.email);
  if (result) {
    easyPost('/user/login/sendCode', {email: form.value.email}).then(() => {
      startCountdown(60)
      ElMessage.success('邮件发送成功')
    })
  } else {
    ElMessage.error('请先输入正确的邮件地址')
  }
}
```



### 配置输入框规则

```js
let form = ref({
  username: '',
  password: '',
  password_repeat: '',
  email: '',
  code: ''
})

function username_validate(rule, value, callback) {
  const regex = /^[a-zA-Z0-9.@]*$/;
  if (!regex.test(value)) {
    callback(new Error('用户名只能由数字和字母构成'))
  } else if (value == '') {
    callback(new Error('用户名不能为空'))
  } else {
    callback()
  }
}

function password_repeat_validate(rule, value, callback) {
  if (value !== form.value.password) {
    callback(new Error('请保证两次密码输入一致'))
  } else {
    callback()
  }
}

function email_validate(rule, value, callback) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let result = emailRegex.test(form.value.email);
  if (value == null || !result) {
    callback(new Error('请保证邮件地址格式正确'))
  } else {
    callback()
  }
}

function code_validate(rule, value, callback) {
  if (form.value.email === '') {
    callback(new Error('请先输入邮件地址'))
  } else {
    callback()
  }
}

const rule = {
  username: [
    {validator: username_validate, trigger: 'blur'},
    {min: 6, max: 15, message: '用户名长度应在6-15位', trigger: 'blur'},
  ], password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 15, message: '密码长度应在6-20位', trigger: 'blur'},
  ], password_repeat: [
    {validator: password_repeat_validate, trigger: 'blur'},
  ], email: [
    {validator: email_validate, trigger: 'blur'},
    {min: 6, max: 30, message: '邮件地址长度应在6-30位', trigger: 'blur'},
  ], code: [
    {validator: code_validate, trigger: 'blur'},
    {min: 6, max: 6, message: '请输入六位数的验证码', trigger: 'blur'},
  ]
}
```

### 向后端发送请求

```js
function register() {
  easyPost('/user/login/register', {
    username: form.value.username,
    password: form.value.password,
    email: form.value.email,
    code: form.value.code
  }, () => {
    ElMessage.success("注册成功")
    router.push("/login")
  })
}
```

## 忘记密码页编写

### 页面结构

```vue
<div style="text-align: center;margin: 0 20px">
    <div style="font-size: 25px; font-weight: bold;margin-top: 150px">
      忘记密码
    </div>
    <div style="font-size: 14px; color: gray;margin-top: 10px">请在下方填写相关信息</div>
    <div style="margin-top: 20px">
      <el-form :model="form" :rules="rule">
        <el-form-item prop="username">
          <el-input v-model="form.username" maxlength="13" type="text" placeholder="用户名">
            <template #prefix>
              <el-icon>
                <User/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.email" maxlength="30" type="text" placeholder="注册时的电子邮箱地址">
            <template #prefix>
              <el-icon>
                <Message/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码">
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password_repeat">
          <el-input v-model="form.password_repeat" type="password" placeholder="重复密码">
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
              <el-input v-model="form.code" maxlength="6" type="text" placeholder="请输入验证码">
                <template #prefix>
                  <el-icon>
                    <ChatLineRound/>
                  </el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="5" style="margin-left: 10px">
              <el-button type="success" plain v-if="sendCooling <= 0" @click="getCode()">获取验证码</el-button>
              <el-button type="primary" v-else loading> {{ sendCooling }} S</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-row justify="space-around">
        <el-button type="primary" style="width: 200px;margin-top: 10px" @click="changePassword()">修改密码</el-button>
      </el-row>
      <el-row justify="space-around" style="margin-top: 10px">
        <el-button type="text" @click="router.push('/login')">回到登录页</el-button>
      </el-row>
    </div>
  </div>
```

### 验证码计时器

```js
function startCountdown(startValue) {
  sendCooling.value = startValue;
  const intervalId = setInterval(() => {
    sendCooling.value--;
    localStorage.setItem("codeCooling", sendCooling.value)
    if (sendCooling.value <= 0) {
      localStorage.removeItem("codeCooling")
      clearInterval(intervalId);
    }
  }, 1000); // 1000毫秒 = 1秒
}

let sendCooling = ref(0)

onMounted(() => {
  let cool = localStorage.getItem("codeCooling")
  if (cool) {
    sendCooling.value = cool
    startCountdown(cool)
  } else {
    sendCooling.value = 0
  }
})
```

### 验证码发送

```js
function getCode() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let result = emailRegex.test(form.value.email);
  if (result) {
    easyPost('/user/login/sendCode', {email: form.value.email}).then(() => {
      startCountdown(60)
      ElMessage.success('邮件发送成功')
    })
  } else {
    ElMessage.error('请先输入正确的邮件地址')
  }
}
```

### 配置输入框规则

```js
let form = ref({
  username: '',
  password: '',
  password_repeat: '',
  email: '',
  code: ''
})

function username_validate(rule, value, callback) {
  const regex = /^[a-zA-Z0-9.@]*$/;
  if (!regex.test(value)) {
    callback(new Error('用户名只能由数字和字母构成'))
  } else if (value == '') {
    callback(new Error('用户名不能为空'))
  } else {
    callback()
  }
}

function email_validate(rule, value, callback) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let result = emailRegex.test(form.value.email);
  if (value == null || !result) {
    callback(new Error('请保证邮件地址格式正确'))
  } else {
    callback()
  }
}

function password_repeat_validate(rule, value, callback) {
  if (value !== form.value.password) {
    callback(new Error('请保证两次密码输入一致'))
  } else {
    callback()
  }
}

function code_validate(rule, value, callback) {
  if (form.value.email === '') {
    callback(new Error('请先输入邮件地址'))
  } else {
    callback()
  }
}

let rule = {
  username: [
    {validator: username_validate, trigger: 'blur'},
    {min: 6, max: 15, message: '用户名长度应在6-15位', trigger: 'blur'},
  ], email: [
    {validator: email_validate, trigger: 'blur'},
    {min: 6, max: 30, message: '邮件地址长度应在6-30位', trigger: 'blur'},
  ], password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 15, message: '密码长度应在6-20位', trigger: 'blur'},
  ], password_repeat: [
    {validator: password_repeat_validate, trigger: 'blur'},
  ], code: [
    {validator: code_validate, trigger: 'blur'},
    {min: 6, max: 6, message: '请输入六位数的验证码', trigger: 'blur'},
  ]
}
```

### 向后端发送请求

```js
function changePassword(){
  easyPost('/user/login/forget', {
    username: form.value.username,
    password: form.value.password,
    email: form.value.email,
    code: form.value.code
  }, () => {
    ElMessage.success("修改成功")
    router.push("/login")
  })
}
```

## idex页layout布局

* 在`router.js`文件下添加路由:

  ```js
  routes: [
          {
              path: '/login',
              name: 'loginLayout',
              component: () => import('@/views/welcome/WelcomeView.vue'),
              children: [
                  {
                      path: '',
                      name: 'login',
                      component: () => import('@/views/welcome/LoginView/LoginPage.vue')
                  }, {
                      path: 'register',
                      name: 'register',
                      component: () => import('@/views/welcome/LoginView/RegisterPage.vue')
                  }, {
                      path: 'forget',
                      name: 'forget',
                      component: () => import('@/views/welcome/LoginView/ForgetView.vue')
                  }
              ]
          }, {
              path: '/',
              name: 'baseLayout',
              component: () => import('@/views/MainPage/LayoutView.vue'),
              children: [
                  {
                      path: 'home',
                      name: 'home',
                      component: () => import('@/views/MainPage/Main/HomeView.vue')
                  },{
                      path: 'problem',
                      name: 'problem',
                      component: ()=> import('@/views/MainPage/Main/ProblemView.vue')
                  },{
                      path: 'problemlist',
                      name: 'problemlist',
                      component: ()=> import('@/views/MainPage/Main/ProblemListView.vue')
                  },{
                      path: 'rank',
                      name: 'rank',
                      component: ()=> import('@/views/MainPage/Main/RankView.vue')
                  },{
                      path: 'about',
                      name: 'about',
                      component: ()=> import('@/views/MainPage/Main/AboutView.vue')
                  },{
                      path: 'mine',
                      name: 'mine',
                      component: ()=> import('@/views/MainPage/Main/MineView.vue')
                  }
              ]
          }
      ]
  ```

  

### 注册所有图标组件

* 安装:

  ```cmd
  npm install @element-plus/icons-vue
  ```

* 注册所有图标组件

  ```js
  // main.ts
  
  // 如果您正在使用CDN引入，请删除下面一行。
  import * as ElementPlusIconsVue from '@element-plus/icons-vue'
  
  const app = createApp(App)
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  ```

### 写一个大体框架

```js
<el-container>
  <el-header>
  </el-header>
  <el-main style="height: auto">
    <div style="margin: 0 30px;background-color: aquamarine">
      <router-view/>
    </div>
  </el-main>
  <el-footer style="">
    <div style="margin: 0 30px; background-color: aqua;height: 50px">
    </div>
  </el-footer>
</el-container>
```

### 写一个header

* 把头像,logo文件导入到`assets`文件夹下

* ```js
  <el-menu active-text-color="#013d4d"
               :default-active="$route.path"
               mode="horizontal"
               text-color="#141b1a"
               collapse:false
               router>
        <router-link to="/home">
          <div class="logo">
            <el-row>
              <img src="@/assets/logo.png" alt="logo图片" style="height: 60px;margin-left: 30px">
            </el-row>
          </div>
        </router-link>
        <el-menu-item index="/home" style=" margin-left: 50px; width:125px">
          <el-icon>
            <el-icon>
              <HomeFilled/>
            </el-icon>
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/problem" style="width:125px">
          <el-icon>
            <Grid/>
          </el-icon>
          <span style="text-align: center">题目</span>
        </el-menu-item>
        <el-menu-item index="/problemlist" style="width:125px">
          <el-icon>
            <Promotion/>
          </el-icon>
          <span style="text-align: center">题单</span>
        </el-menu-item>
        <el-menu-item index="/rank" style="width:125px">
          <el-icon>
            <Histogram/>
          </el-icon>
          <span style="text-align: center">排名</span>
        </el-menu-item>
        <el-menu-item index="/about" style="width:125px">
          <el-icon>
            <InfoFilled/>
          </el-icon>
          <span style="text-align: center">关于</span>
        </el-menu-item>
        <el-sub-menu style="margin-left: 620px;" index="0">
          <template #title>
            <img src="@/assets/avatar.jpg" alt="用户头像" style="height: 30px; border-radius: 50%">
            用户昵称
          </template>
          <el-menu-item index="/mine">个人信息</el-menu-item>
          <el-menu-item @click="logout()">退出登录</el-menu-item>
        </el-sub-menu>
      </el-menu>
  ```

### 写一个footer

```js
<el-footer style=" background-color: #ffffff;height: auto">
  <div style="margin: 0 30px">
    <el-row justify="center">
      <el-col :span="4" style="text-align: center;margin-top: 10px">
        <div>
          power by <el-link
            style="font-size: medium;vertical-align: text-bottom"
            href="https://www.codelong.top"
            target="_blank"
        >codelong
        </el-link>
        </div>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="3" style="text-align: center; margin:10px 0">
        <router-link to="/about" class="aboutUs">
          关于我们
        </router-link>
      </el-col>
    </el-row>
  </div>
</el-footer>
```

相关的css样式:

```css
a{
  text-decoration: none;
  color: #1EB4FF;
}
a:hover {
  color: #00293b;
}

a:active {
  color: #01555d;
}

a:visited {

}
```

### main的简单样式

```js
<el-main style="height: auto;background-color: #EFF3F5;">
  <div>
    <router-view/>
  </div>
</el-main>
```

## home页的编写

### 安装echarts

```cmd
npm install echarts --save
```

### 安装naive

```cmd
npm i -D naive-ui
```

### 编写home的静态结构

```vue
<template>
  <div>
    <el-row justify="space-around">
      <el-col :span="12" id="left-col">
        <div class="left" id="left-box">
          <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15)">
            <div
                style="font-size: large;font-weight: 700;
                color: #409EFF;padding-top: 20px;
                text-align: center;font-style: italic">
              欢迎使用算法队OnlineJudge
            </div>
            <el-image src="src/assets/preview.png" style="margin: 10px 20px"></el-image>
          </div>

          <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);margin-top: 30px;padding: 10px">
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
                  <n-collapse-item title="小葵花妈妈课堂开课了" name="1">
                    <div style="padding-left: 30px;border-left:2px solid #00a4ff">快来上课啦</div>
                  </n-collapse-item>
                  <n-collapse-item title="孩子咳嗽老不好" name="2">
                    <div style="padding-left: 30px;border-left:2px solid #00a4ff">那该怎么办呢</div>
                  </n-collapse-item>
                  <n-collapse-item title="多半是废了" name="3">
                    <div style="padding-left: 30px;border-left:2px solid #00a4ff">真棒</div>
                  </n-collapse-item>
                </n-collapse>
              </el-row>
            </div>
          </div>

          <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);margin-top: 30px;padding: 10px">
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
          <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);margin-top: 30px;padding: 10px">
            <div class="newProblem">
              <el-row style="margin: 20px 0 20px 20px">
                <div class="top"
                     style="font-size: 18px;display: flex; align-items: center;vertical-align: top;height: 18px;color:#00a4ff">
                  <el-icon style="margin-right: 5px" color="#409EFF" size="25px">
                    <Tickets/>
                  </el-icon>
                  最新题目
                </div>
              </el-row>
              <el-row style="margin: 10px 20px 20px 20px;">
                <el-table :data="newProblem" stripe style="width: 100%;">
                  <el-table-column prop="problemId" label="题目ID" width="150"/>
                  <el-table-column prop="title" label="标题" width="210"/>
                  <el-table-column prop="updateTime" label="更新时间"/>
                </el-table>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="10" id="right-col">

        <div class="right" id="right-box">
          <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 10px">
            <div>
              <el-row style="margin: 20px 0 20px 20px">
                <div class="top"
                     style="font-size: 18px;display: flex; align-items: center;vertical-align: top;height: 18px;color:#00a4ff">
                  <el-icon style="margin-right: 5px" color="#409EFF" size="25px">
                    <TrophyBase/>
                  </el-icon>
                  近期比赛
                </div>
              </el-row>
              <div>
                <el-row
                    style="margin: 10px 20px 0 20px;padding: 10px 10px;background-color: #E7F5E7;border:1px dashed #1EB4FF;"
                    justify="space-around">
                  <el-col :span="8" style="font-size:20px;color:#19BE6B">
                    算法队招新
                  </el-col>
                  <el-col :span="4">
                    <el-tag type="success" color="#19BE6B" size="large" style="color: black;font-size: 15px">
                      <el-icon><Select/></el-icon>
                      <span class="contest">进行中</span>
                    </el-tag>
                  </el-col>
                </el-row>
                <el-row style="margin: 0 20px 20px 20px;padding: 10px 10px;border:1px dashed #1EB4FF;display: block"
                        justify="center">
                  <el-row justify="center" gutter="2" style="margin-bottom: 5px">
                    <el-col :span="3" style="font-size:15px;color:#19BE6B">
                      <el-tag type="success" size="large" effect="dark" style="margin-left: 5px">公开赛</el-tag>
                    </el-col>
                    <el-col :span="3" style="font-size:15px;line-height: 32px;color:#19BE6B;vertical-align: top">
                      <el-tag color="#FFFFFF" size="large" round effect="dark">
                        <el-icon>
                          <UserFilled style="color:#409EFF"/>
                        </el-icon>
                        <span style="color: black">×5</span>
                      </el-tag>
                    </el-col>
                  </el-row>
                  <el-row justify="center" gutter="2">
                    <el-col :span="5" style="font-size:15px;color:#19BE6B">
                      <el-tag type="primary" size="large" round effect="dark" style="margin-left: 5px">
                        <el-icon>
                          <Calendar/>
                        </el-icon>
                        10-02 15:31
                      </el-tag>
                    </el-col>
                    <el-col :span="5" style="font-size:15px;color:#19BE6B">
                      <el-tag type="primary" size="large" round effect="light" style="margin-left: 5px;color: black">
                        <el-icon>
                          <Timer/>
                        </el-icon>
                        20天
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-row>
              </div>

              <div>
                <el-row
                    style="margin: 10px 20px 0 20px;padding: 10px 10px;background-color: #E7F5E7;border:1px dashed #1EB4FF;"
                    justify="space-around">
                  <el-col :span="8" style="font-size:20px;color:#19BE6B">
                    山带算法赛
                  </el-col>
                  <el-col :span="4">
                    <el-tag type="success" color="#F56C6C" size="large" style="color: black;font-size: 15px">
                      <el-icon>
                        <CloseBold/>
                      </el-icon>
                      <span class="contest">已结束</span>
                    </el-tag>
                  </el-col>
                </el-row>
                <el-row style="margin: 0 20px 20px 20px;padding: 10px 10px;border:1px dashed #1EB4FF;display: block"
                        justify="center">
                  <el-row justify="center" gutter="2" style="margin-bottom: 5px">
                    <el-col :span="3" style="font-size:15px;color:#19BE6B">
                      <el-tag type="warning" size="large" effect="dark" style="margin-left: 5px">私有赛</el-tag>
                    </el-col>
                    <el-col :span="3" style="font-size:15px;line-height: 32px;color:#19BE6B;vertical-align: top">
                      <el-tag color="#FFFFFF" size="large" round effect="dark">
                        <el-icon>
                          <UserFilled style="color:#409EFF"/>
                        </el-icon>
                        <span style="color: black">×81</span>
                      </el-tag>
                    </el-col>
                  </el-row>
                  <el-row justify="center" gutter="2">
                    <el-col :span="5" style="font-size:15px;color:#19BE6B">
                      <el-tag type="primary" size="large" round effect="dark" style="margin-left: 5px">
                        <el-icon>
                          <Calendar/>
                        </el-icon>
                        10-11 21:16
                      </el-tag>
                    </el-col>
                    <el-col :span="5" style="font-size:15px;color:#19BE6B">
                      <el-tag type="primary" size="large" round effect="light" style="margin-left: 5px;color: black">
                        <el-icon>
                          <Timer/>
                        </el-icon>
                        5天
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-row>
              </div>
            </div>
          </div>

          <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 10px;margin-top: 30px">
            <div>
              <el-row style="margin: 20px 0 20px 20px">
                <div class="top"
                     style="font-size: 18px;display: flex; align-items: center;vertical-align: top;height: 18px;color:#00a4ff">
                  <el-icon style="margin-right: 5px" color="#409EFF" size="25px">
                    <Histogram />
                  </el-icon>
                  最近一周做题榜单
                </div>
              </el-row>
              <el-row style="margin: 10px 20px 20px 20px;">
                <el-table :data="rankList"  style="width: 100%;">
                  <el-table-column prop="rankNumber" label="#" width="150"/>
                  <el-table-column prop="nickname" label="用户名" width="210"/>
                  <el-table-column prop="number" label="通过数"/>
                </el-table>
              </el-row>
            </div>
          </div>
        </div>

      </el-col>
    </el-row>
  </div>
</template>
```

### 为静态结构添加测试数据

> 这些数据将来会向后端请求

```js
const newProblem = [
  {
    problemId: '1',
    title: 'A+B',
    updateTime: '2024-10-20 19:58',
  },
  {
    problemId: '2',
    title: 'B+A',
    updateTime: '2024-10-22 9:58',
  },
  {
    problemId: '3',
    title: '小龙很帅',
    updateTime: '2024-10-19 15:20',
  },
  {
    problemId: '4',
    title: '小昊也很帅',
    updateTime: '2024-10-25 06:21',
  },
]

const rankList = [
  {
    rankNumber: '1',
    nickname: '张三',
    number: '9',
  },
  {
    rankNumber: '2',
    nickname: '李四',
    number: '9',
  },
  {
    rankNumber: '3',
    nickname: '王五',
    number: '8',
  },
  {
    rankNumber: '4',
    nickname: '小龙',
    number: '7',
  },
  {
    rankNumber: '5',
    nickname: '小昊',
    number: '7',
  },
  {
    rankNumber: '6',
    nickname: 'niko',
    number: '6',
  },
  {
    rankNumber: '7',
    nickname: 'monesy',
    number: '5',
  },
  {
    rankNumber: '8',
    nickname: 'simple',
    number: '4',
  },
  {
    rankNumber: '9',
    nickname: 'malbsmd',
    number: '3',
  },
  {
    rankNumber: '10',
    nickname: 'donk',
    number: '1',
  },
]
```

### 添加图表元素绑定

```js
const chartContainer = ref(null);
let myChart = null;

// 初始化 ECharts
const initChart = () => {
  if (chartContainer.value) {
    myChart = echarts.init(chartContainer.value);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#409EFF'
          }
        }
      },
      legend: {
        data: ['提交数', 'ac数']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['10-20', '10-21', '10-22', '10-23', '10-24', '10-25', '10-26']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '提交数',
          type: 'line',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: 'ac数',
          type: 'line',
          areaStyle: {
            color: 'rgba(0, 0, 255, 0.3)'
          },
          emphasis: {
            focus: 'series'
          },
          data: [220, 182, 191, 234, 290, 330, 310]
        }
      ]
    };
    myChart.setOption(option);
  } else {
    console.error('Chart container not found');
  }
};

// 处理窗口大小变化
const handleResize = () => {
  if (myChart) {
    myChart.resize();
  }
};

// 在组件挂载时初始化图表
onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

// 在组件卸载前移除事件监听器
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
```

### 优化登录方法(使用pinia存放用户信息)

> 用pinia存放用户名,昵称,用户id,头像url地址,以及做过的题目

```js

```

### 向后端发送请求获取数据

1. ***原始数据:***

   ```js
   const newProblem = [
     {
       id: '1',
       title: 'A+B',
       updateTime: '2024-10-20 19:58',
     },
     {
       problemId: '2',
       title: 'B+A',
       updateTime: '2024-10-22 9:58',
     },
     {
       problemId: '3',
       title: '小龙很帅',
       updateTime: '2024-10-19 15:20',
     },
     {
       problemId: '4',
       title: '小昊也很帅',
       updateTime: '2024-10-25 06:21',
     },
   ]
   ```

   ***配置post请求***

   ```js
   const problems = ref([]);
   const fetchProblems = async () => {
     const data = await easyPost('/user/problem/newProblemList');
     if (data) {
       problems.value = data; // 更新问题列表
     }
   }
   onMounted(() => {
     fetchProblems()
   });
   ```

2. ***原始数据***

   ```js
   
   ```

   ***配置post请求***

   ```js
   
   ```

3. ***原始数据***

   ```js
   
   ```

   ***配置post请求***

   ```js
   
   ```

   

### 最终效果


![Clip_2024-10-22_12-53-57](https://s2.loli.net/2024/10/22/NCk2tEmpfnAZOra.png)

## 添加吸顶导航

* 使用 :class 绑定动态类

  ```vue
  <el-header :class="{'sticky-header': isSticky}">
  ```

* 添加相关js代码

  ```js
  //使用 ref 创建响应式变量 isSticky
  const isSticky = ref(false);
  
  //定义 handleScroll 函数
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    isSticky.value = scrollTop > 0;
  };
  
  //在组件挂载时添加滚动事件监听器
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });
  
  //在组件卸载前移除滚动事件监听器
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  ```

* 添加css效果

  ```css
  .el-header.sticky-header {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    z-index: 1000; /* 确保导航栏位于其他内容之上 */
    background-color: #ffffff; /* 可以根据需要调整背景颜色 */
    transition: all 0.3s ease; /* 添加过渡效果 */
  }
  ```

## 题目页面的编写

### 编写基础结构

```vue
<template>
  <div>
    <el-row justify="space-around">
      <el-col :span="16" id="left-col">
        <div class="left" id="left-box">
          <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px">
            <el-row class="problemHeader" align="middle">
              <el-col :span="4" style="vertical-align: top;font-size: 30px;color: #409EFF;font-weight: 700">
                题目列表
              </el-col>
              <el-col :span="6" :offset="1">
                <div>
                  <el-input @keyup.enter="fetchProblems" v-model="search" maxlength="13" type="text"
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
              <el-col :span="3" style="font-size: 20px;font-weight: 700">
                难度
              </el-col>
              <el-col :span="10">
                <div>
                  <el-button type="primary" :plain="hardSelect!==0" @click="changeHard(0)">全部</el-button>
                  <el-button type="primary" :plain="hardSelect!==1" @click="changeHard(1)">简单</el-button>
                  <el-button type="primary" :plain="hardSelect!==2" @click="changeHard(2)">中等</el-button>
                  <el-button type="primary" :plain="hardSelect!==3" @click="changeHard(3)">困难</el-button>
                </div>
              </el-col>
              <el-col>
                <el-row style="margin-top: 10px">
                  <el-table :data="problems.list" style="width: 100%" stripe size="large">
                    <el-table-column label="题目ID" width="150">
                      <template #default="scope">
                        <div style="display: flex; align-items: center;padding-left: 7px;font-weight: 700">
                          <span>{{ scope.row.id }}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="题目" width="200">
                      <template #default="scope">
                        <RouterLink :to="{path:'/problemDetail',query:{id:scope.row.id}}" class="detailPush">
                          <div style="display: flex; align-items: center">
                            <span>{{ scope.row.title }}</span>
                          </div>
                        </RouterLink>
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
          <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px">
            <el-row justify="center">
              <el-col :span="8" style="font-size: 30px;color: #409EFF;font-weight: 700;text-align: center">
                标签列表
              </el-col>
            </el-row>
            <div style="display: flex">
              <div>
                <el-tag style="margin:3px;color: #ECE4FB;font-size: 15px" size="large" effect="dark" v-for="tag in tags"
                        :key="tag.id" :color="tag.color">{{ tag.name }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
```

### 编写基础样式

```vue
<style scoped>
.detailPush{
  color: inherit;
  text-decoration: none;
}
.detailPush:hover{
  text-decoration: underline;
}

>>> .el-table {
  --el-table-header-bg-color: #EFF3F5;
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
  background-color: #EFF3F5;
}
</style>
```

### 编写请求和分页功能

```vue
<script setup lang="js">

import {onMounted, ref, watch} from "vue";
import {easyPost} from "@/net";

let search = ref('')
let hardSelect = ref(0)
let pageNumber = ref(1)
let pageSize = ref(30) //默认查询数量

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
```

## 题目详情页面

### md文档显示

1. 安装`markdown-it`

   ```cmd
   npm install markdown-it
   ```

2. 配置`markdown-it`

   > 用useRoute方法来获取上一个路由传递的参数(题目ID),将向后端请求返回的题目详情内容放入响应式变量detail里

   

   ```js
   import {useRoute} from 'vue-router'
   import {onMounted, ref} from "vue";
   import {easyPost} from "@/net/index.js";
   import markdownIt from 'markdown-it';
   
   const route = useRoute()
   
   const detail = ref([])
   const fetchProblems = async () => {
     const data = await easyPost('/problem/detail', route.query)
     if (data) {
       detail.value = data
     }
     renderMarkdown();
   }
   
   // 初始化 Markdown 文本
   
   // 存储渲染后的 HTML 字符串
   const renderedMarkdown = ref('');
   
   // 创建 markdown-it 实例并渲染 Markdown
   function renderMarkdown() {
     const mdRenderer = markdownIt();
     renderedMarkdown.value = mdRenderer.render(detail.value.detail);
   }
   ```

3. 使用`markdown-it`

   * 在onMounted钩子配置请求

     ```js
     onMounted(() => {
       fetchProblems()
     })
     ```

   * 在页面上显示内容

     ```vue
     <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px">
                 <el-scrollbar style="height: 650px">
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
                   <div id="content">
                     <div v-html="renderedMarkdown"/>
                   </div>
                 </el-scrollbar>
               </div>
     ```

     > 因为题目太长而代码编辑器长度时固定的,所以使用el-scrollbar标签来让题目页实现固定高度的滚动效果

### 数学公式显示

1. 安装`mathjax`

   ```cmd
   npm install mathjax
   ```

2. 配置`mathjax`

   * 在main.js文件夹下添加引入:

     ```js
     import "@/utils/mathjax"; // 必须在引入mathjax前引入mathjax的配置文件
     import "mathjax/es5/tex-mml-chtml"; // 使用 tex-mml-chtml
     ```

   * 新建utils目录,添加mathjax的工具类

     ```js
     window.MathJax = {
         tex: {
             inlineMath: [
                 ["$", "$"],
                 ["\\(", "\\)"],
             ], // 行内公式选择符
             displayMath: [
                 ["$$", "$$"],
                 ["\\[", "\\]"],
             ], // 段内公式选择符
         },
         startup: {
             ready() {
                 MathJax.startup.defaultReady();
             },
         },
     };
     ```

3. 使用`mathjax`

```js
onMounted(() => {
  fetchProblems()
  setTimeout(() => {
    MathJax.typeset();
  }, 150);
})
```

### 代码编辑框

1. 安装`Codemirror`

   ```cmd
   npm install codemirror-editor-vue3 codemirror@^5 -S
   ```

2. 配置`Codemirror`

   ```js
   import Codemirror from 'codemirror-editor-vue3';
   import 'codemirror/addon/edit/closebrackets.js'; // 自动闭合括号插件
   import 'codemirror/addon/edit/matchbrackets'; // 匹配括号高亮插件
   import 'codemirror/mode/clike/clike'; // C/C++ 模式
   
   const code = ref('');
   const cmOptions = {
     mode: 'text/x-java',
     matchBrackets: true,
     theme: 'default',
     lineNumbers: true,
     autoCloseBrackets: true,
   }
   
   const cmRef = ref()
   ```

3. 使用`Codemirror`

   * 在页面结构使用

     ```vue
     <Codemirror
         v-model:value="code"
         :options="cmOptions"
         border
         ref="cmRef"
         height="600"
         :autofocus="true"
     />
     ```

### 编写题目详情页面结构

```vue
<template>
  <div>
    <el-row justify="space-around">
      <el-col :span="11" id="left-col">
        <div class="left" id="left-box">
          <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px">
            <el-scrollbar style="height: 650px">
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
              <div id="content">
                <div v-html="renderedMarkdown"/>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </el-col>

      <el-col :span="12" id="right-col">
        <div class="right" id="right-box">
          <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px">
            <el-row align="middle">
              <el-col :span="8">
                <el-select
                    placeholder="Select"
                    size="large"
                    v-model="languageChoice"
                    style="width: 240px"
                >
                  <el-option
                      v-for="item in language"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" @click="sendCode()">提交代码</el-button>
              </el-col>
              <el-col :span="1">
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="language[languageChoice-1].description"
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
                    height="600"
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
```

* 修改代码编辑器字号和md文档样式

  ```vue
  <style scoped>
  #content >>> pre {
    padding: 10px;
    background-color: #F8F8F8;
  }
  >>> .CodeMirror-code{
    font-size: 20px;
  }
  </style>
  ```

### 配置请求发送

### 最终结果

![Clip_2024-10-30_23-31-24](https://s2.loli.net/2024/10/30/vMzZafBVwTrymGp.png)

![Clip_2024-10-30_23-32-12](https://s2.loli.net/2024/10/30/EKLCjT7a3rpVQwv.png)

## 题单页面的编写

### 配置pinia并配置持久化插件

> 因为在创建项目时已经配置了pinia,所以将不在重复配置

在`src/stores/user.js`添加代码

```js
import {easyPost} from "@/net/index.js";
import {defineStore} from "pinia";

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        userInfo: {
            avatar: '',
            userId: -1,
            userName: '',
            nickName: '',
            email: ''
        },
        isPassed: []
    }),
    actions: {
        async fetchUserInfo() {
            const data = await easyPost('/problem/isPassed')
            if (data) {
                this.isPassed = data
            }
        },
        login(data) {
            this.userInfo.avatar=data.avatar
            this.userInfo.userId=data.id
            this.userInfo.userName=data.userName
            this.userInfo.nickName=data.nickName
            this.userInfo.email=data.email
        }
    },
    persist: true
})
```

配置持久化插件

```cmd
npm i pinia-plugin-persistedstate
```

将插件添加到pinia示例上

```js
app.use(createPinia().use(piniaPluginPersistence))//在main.js配置

export const useUserStore = defineStore({//在src/stores/user.js下使用persist: true来配置
    id: 'user',
    state: () => ({
       
    }),
    actions: {
      
    },
    persist: true
})
```

### 编写题单页面

```vue
<script setup lang="js">

import {onMounted, ref, watch} from "vue";
import {easyPost} from "@/net/index.js";
import router from "@/router/index.js";

let search = ref('')
let isCompleted = ref([])

watch(search, (newValue) => {
  if (newValue === '') {
    fetchProblemList()
  }
}, {deep: true})

onMounted(() => {
  fetchProblemList();
})

const problemList = ref([])
const fetchProblemList = async () => {
  const data = await easyPost('/problemList', {
    search: search.value === '' ? '' : search.value,
  })
  if (data) {
    problemList.value = data
  }
}

</script>

<template>
  <div>
    <el-row justify="space-around">
      <el-col :span="20" id="left-col">
        <div class="left" id="left-box">
          <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px">
            <el-row class="problemHeader" align="middle">
              <el-col :span="4" style="vertical-align: top;font-size: 30px;color: #409EFF;font-weight: 700">
                题单列表
              </el-col>
              <el-col :span="6" :offset="1">
                <div>
                  <el-input @keyup.enter="fetchProblemList" v-model="search" maxlength="13" type="text"
                            placeholder="输入题单关键词" clearable>
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
            <el-row class="difficultySelection" align="middle" style="margin: 10px 0 0 20px">
              <el-col>
                <el-row style="margin-top: 10px">
                  <el-table :data="problemList" style="width: 100%" stripe size="large"
                            @row-click="(row)=>{router.push({name:'problemListDetail',query:{id: row.id}})}">
                    <el-table-column label="题单ID" width="200">
                      <template #default="scope">
                        <div style="display: flex; align-items: center;padding-left: 7px;font-weight: 700">
                          <span>{{ scope.row.id }}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="标题" width="300">
                      <template #default="scope">
                        <div style="display: flex; align-items: center">
                          <span>{{ scope.row.name }}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="题目数" width="400">
                      <template #default="scope">
                        <div style="display: flex; align-items: center;font-weight: 600">
                          <span>{{ scope.row.number }}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="最近更新时间">
                      <template #default="scope">
                        <div style="display: flex; align-items: center;font-weight: 600">
                          <span>{{ scope.row.updateTime }}</span>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
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
  --el-table-header-bg-color: #EFF3F5;
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
  background-color: #EFF3F5;
}
</style>
```

### 已做题目判断

在pinia中useUserStore添加方法:

```js
isPassedMatch(target){
            let arr = this.isPassed

            let left = 0;
            let right = arr.length - 1;

            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                if (arr[mid] === target) {
                    return true; // 找到目标值
                } else if (arr[mid] < target) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
            return false; // 没有找到目标值
        }
```

> 判断基于二分查找算法

## 题单详情页面的编写

* 题单详情页面的结构

```vue
<template>
  <div>
    <el-row justify="center" class="top">
      <el-col :span="15">
        <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px;background-color: #fff">
          <el-row justify="center">
            <div style="color:#409EFF;font-size: 30px">
              {{ detail.title }}
            </div>
          </el-row>
          <el-row justify="center" style="margin-top: 20px">
            <el-progress style="width: 800px" :text-inside="true" :stroke-width="26" :percentage="isCompletedNumberRate"/>
          </el-row>
          <el-row justify="center" style="font-size: 18px;font-weight: 700;margin-top: 10px">
            {{ isCompletedNumber }}/{{ detail.problemNumber }}
          </el-row>
          <el-row justify="center" style="margin-top: 20px">
            {{detail.more}}
          </el-row>
        </div>

        <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);margin-top: 30px;padding: 10px;background-color: #fff;">
          <el-row style="margin-top: 10px">
            <el-table :data="detail.list" style="width: 100%" stripe size="large"
                      @row-click="(row)=>{router.push({name:'problemDetail',query:{id: row.id}})}">
              <el-table-column label="状态" width="60">
                <template #default="scope">
                  <el-icon v-if="useUserStore().isPassedMatch(scope.row.id)"><Select style="color: #5CC272"/>
                  </el-icon>
                  <el-icon v-else>
                    <SemiSelect/>
                  </el-icon>
                </template>
              </el-table-column>
              <el-table-column label="题目ID" width="150">
                <template #default="scope">
                  <div style="display: flex; align-items: center;padding-left: 25px;font-weight: 700">
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
        </div>
      </el-col>
    </el-row>
  </div>
</template>
```

* 增加请求发送和已做题目判断

  ```vue
  <script setup lang="js">
  import {useRoute} from "vue-router";
  import {ref, onMounted} from "vue";
  import {easyPost} from "@/net/index.js";
  import router from "@/router/index.js";
  import {useUserStore} from "@/stores/user.js";
  
  const route = useRoute()
  
  let isCompletedNumber = ref(0)
  let isCompletedNumberRate = ref(0.0)
  
  onMounted(() => {
    fetchProblemListDetail()
  })
  
  const detail = ref([])
  const fetchProblemListDetail = async () => {
    const data = await easyPost('/problemList/detail', route.query)
    if (data) {
      detail.value = data
      detail.value.list.map(problem => {
        if (useUserStore().isPassedMatch(problem.id)) {
          isCompletedNumber.value++
        }
      })
      isCompletedNumberRate.value=Math.round((isCompletedNumber.value *1.0 / detail.value.problemNumber)*100)
    }
  }
  </script>
  ```

* 修改样式

  ```vue
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
  </style>
  ```

## 个人页面的编写

### 个人信息展示

```vue
<div>
    <el-row justify="center" class="top">
      <el-col :span="15">
        <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px;background-color: #fff;height: 550px">
          <el-row style="vertical-align: top;font-size: 30px;color: #409EFF;font-weight: 700">
            个人信息
          </el-row>
          <el-divider/>
          <el-row align="middle" style="color: #555692;margin: 20px;">
            用户昵称: <span style="margin-left: 10px">{{ userInfo.nickname }}</span>
          </el-row>
          <el-row align="middle" style="color: #555692;margin: 20px">
            邮件地址 : <span style="margin-left: 10px">{{ userInfo.email }}</span>
          </el-row>
          <el-row align="middle" style="color: #555692;margin: 20px">
            名字 : <span style="margin-left: 10px">{{ userInfo.name }}</span>
          </el-row>
          <el-row justify="center" style="margin: 40px 0 20px 0">
            <el-button type="primary" plain round @click="show=true">修改用户信息</el-button>
          </el-row>
          <el-row justify="center">
            <el-upload
                :action="url"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :on-error="handleError"
                :headers="headers"
                :file-list="fileList"
                :limit="1"
                :auto-upload="true">
              <el-row justify="center">
                <el-button type="primary">修改头像</el-button>
              </el-row>
            </el-upload>
          </el-row>
          <el-row justify="center">
            <div style="color: #75627A">只能上传不能超过1MB的图片</div>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
```

### 个人信息修改

```vue
<el-dialog v-model="show" title="修改用户信息" width="500">
    <div style="margin-bottom: 10px">填写需要修改的内容 其他内容留空</div>
    <el-form :model="form" :rules="rule">
      <el-form-item prop="nickname">
        <el-input v-model="form.nickname" maxlength="15" type="text" placeholder="昵称">
          <template #prefix>
            <el-icon>
              <User/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="form.name" maxlength="20" type="text" placeholder="名字">
          <template #prefix>
            <el-icon>
              <User/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" placeholder="密码">
          <template #prefix>
            <el-icon>
              <Lock/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="passwordRepeat">
        <el-input v-model="form.passwordRepeat" type="password" placeholder="重复密码">
          <template #prefix>
            <el-icon>
              <Lock/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click="show = false;update()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
```


由于上传文件后会有显示bug,所以添加样式:

```vue
<style scoped>
>>> .el-upload {
  display: block;
}
</style>
```


### JS代码

表单验证和请求发送以及文件上传

```js
<script setup lang="js">
import {storeToRefs} from "pinia";
import {useUserStore} from "@/stores/user";
import {ref} from 'vue'
import axios from "axios";
import {ElMessage} from "element-plus";
import {deleteAccessToken, easyPost, logout} from "@/net/index.js";
import {Lock, User} from "@element-plus/icons-vue";
import router from "@/router/index.js";

let {userInfo} = storeToRefs(useUserStore())

let show = ref(false)
let form = ref({
  nickname: '',
  name: '',
  password: '',
  passwordRepeat: '',
})

function passwordRepeat_validate(rule, value, callback) {
  if (value !== form.value.password) {
    callback(new Error('请保证两次密码输入一致'))
  } else {
    callback()
  }
}

let rule = {
  nickname: [
    {min: 0, max: 15, message: '昵称长度不得大于15位', trigger: 'blur'},
  ], name: [
    {min: 0, max: 20, message: '名字长度不得大于20位', trigger: 'blur'},
  ], password: [
    {min: 0, max: 20, message: '密码长度不得大于20位', trigger: 'blur'},
  ], passwordRepeat: [
    {validator: passwordRepeat_validate, trigger: 'blur'},
  ]
}

function update() {
  easyPost('/user/update', {
    nickname: form.value.nickname === '' ? null : form.value.nickname,
    name: form.value.name === '' ? null : form.value.name,
    password: form.value.passwordRepeat === '' ? null : form.value.passwordRepeat,
  }, () => {
    ElMessage.success('修改成功!')
    deleteAccessToken()
    router.push('/login')
  })
}

const token = localStorage.getItem('Authorization') || sessionStorage.getItem('Authorization')
const headers = ref({
  Authorization: JSON.parse(token).token,
});

let url = axios.getUri() + '/avatarUpload'
const fileList = ref([]);
const beforeUpload = (file) => {
  const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt500K = file.size / 1024 < 1000;
  if (!isJPGorPNG) {
    ElMessage.error('上传图片只能是 JPG/PNG 格式!');
    return false;
  }
  if (!isLt500K) {
    ElMessage.error('上传图片大小不能超过 1MB!');
    return false;
  }
  return true;
};

const handleSuccess = (response, file, fileList) => {
  ElMessage.success('头像修改成功 将在下一次登录生效');
};
const handleError = (error, file, fileList) => {
  ElMessage.error('图片上传失败!');
};
</script>
```

## 比赛页面的编写

还是很简单的,直接给出了

```vue
<script setup lang="js">
import {useRoute} from "vue-router";
import {ref, onMounted} from "vue";
import {easyPost} from "@/net/index.js";
import {useUserStore} from "@/stores/user.js";
import router from "@/router/index.js";

const route = useRoute()

let isCompletedNumber = ref(0)
let isCompletedNumberRate = ref(0.0)

onMounted(() => {
  fetchProblemListDetail()
  window.scrollTo(0, 0)
})

const detail = ref([])
const fetchProblemListDetail = async () => {
  const data = await easyPost('/problemList/detail', route.query)
  if (data) {
    detail.value = data
    detail.value.list.map(problem => {
      if (useUserStore().isPassedMatch(problem.id)) {
        isCompletedNumber.value++
      }
    })
    isCompletedNumberRate.value=Math.round((isCompletedNumber.value *1.0 / detail.value.problemNumber)*100)
  }
}

</script>

<template>
  <div>
    <el-row justify="center" class="top">
      <el-col :span="15">
        <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px;background-color: #fff">
          <el-row justify="center">
            <div style="color:#409EFF;font-size: 30px">
              {{ detail.title }}
            </div>
          </el-row>
          <el-row justify="center" style="margin-top: 20px">
            <el-progress style="width: 800px" :text-inside="true" :stroke-width="26" :percentage="isCompletedNumberRate"/>
          </el-row>
          <el-row justify="center" style="font-size: 18px;font-weight: 700;margin-top: 10px">
            {{ isCompletedNumber }}/{{ detail.problemNumber }}
          </el-row>
          <el-row justify="center" style="margin-top: 20px">
            {{detail.more}}
          </el-row>
        </div>

        <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);margin-top: 30px;padding: 10px;background-color: #fff;">
          <el-row style="margin-top: 10px">
            <el-table :data="detail.list" style="width: 100%" stripe size="large"
                      @row-click="(row)=>{router.push({name:'problemDetail',query:{id: row.id}})}">
              <el-table-column label="状态" width="60">
                <template #default="scope">
                  <el-icon v-if="useUserStore().isPassedMatch(scope.row.id)"><Select style="color: #5CC272"/>
                  </el-icon>
                  <el-icon v-else>
                    <SemiSelect/>
                  </el-icon>
                </template>
              </el-table-column>
              <el-table-column label="题目ID" width="150">
                <template #default="scope">
                  <div style="display: flex; align-items: center;padding-left: 25px;font-weight: 700">
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
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>

</style>

```

## 比赛详情页面的编写

```vue
<script setup lang="js">
import {useRoute} from "vue-router";
import {ref, onMounted,} from "vue";
import {easyPost} from "@/net/index.js";
import {useUserStore} from "@/stores/user.js";
import router from "@/router/index.js";

const route = useRoute()

let isCompletedNumber = ref(0)
let isCompletedNumberRate = ref(0.0)
let problemNumber = ref(0)
let isShowProblems = ref(true)
let pageSize = ref(20)
let pageNumber = ref(1)

onMounted(() => {
  fetchContestDetail()
  fetchRank()
  window.scrollTo(0, 0)
})

function alphabetLabels(num){
  const startCharCode = 'A'.charCodeAt(0);
  return String.fromCharCode(startCharCode + num)
}

const detail = ref([])
const fetchContestDetail = async () => {
  const data = await easyPost('/contest/detail', route.query)
  if (data) {
    detail.value = data
    data.problemList.map(problem => {
      if (useUserStore().isPassedMatch(problem.id)) {
        isCompletedNumber.value++
      }
    })
    isCompletedNumberRate.value = Math.round((isCompletedNumber.value * 1.0 / data.problemList.length) * 100)
    problemNumber.value = data.problemList.length
  }
}

const rank = ref([])
const fetchRank = async () => {
  const data = await easyPost('/contest/rank', {
    id: route.query.id,
    pageNumber: pageNumber.value,
    pageSize: pageSize.value
  })
  if (data) {
    rank.value = data
  }
}

</script>

<template>
  <div>
    <el-row justify="center" class="top">
      <el-col :span="15">
        <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px;background-color: #fff">
          <el-row justify="center">
            <div style="color:#409EFF;font-size: 30px">
              {{ detail.name }}
            </div>
          </el-row>
          <el-row justify="space-around" align="middle" style="margin-top: 20px">
            <el-col :span="7">
              <span style="vertical-align: middle;color: #409EFF"><el-icon><List/></el-icon></span>
              开始时间: <span style="color: #409EFF">{{ detail.startTime }}</span>
            </el-col>
            <el-col :span="2">
              <el-tag size="large" type="primary" effect="dark" v-if="new Date(detail.startTime) > new Date()">
                未开始
              </el-tag>
              <el-tag size="large" type="success" effect="dark"
                      v-if="new Date(detail.startTime) < new Date()&&new Date(detail.endTime) > new Date()">
                进行中
              </el-tag>
              <el-tag size="large" type="danger" effect="dark" v-if="new Date(detail.endTime) < new Date()">
                已结束
              </el-tag>
            </el-col>
            <el-col :span="7">
              <span style="vertical-align: middle;color: #409EFF"><el-icon><Checked/></el-icon></span>
              结束时间: <span style="color: #409EFF">{{ detail.endTime }}</span>
            </el-col>
          </el-row>
          <el-row justify="center" style="margin-top: 20px">
            <el-progress style="width: 800px" :text-inside="true" :stroke-width="26"
                         :percentage="isCompletedNumberRate"/>
          </el-row>
          <el-row justify="center" style="font-size: 18px;font-weight: 700;margin-top: 10px">
            {{ isCompletedNumber }}/{{ problemNumber }}
          </el-row>
          <el-row justify="center" style="margin-top: 20px">
            {{ detail.more }}
          </el-row>
        </div>

        <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);margin-top: 30px;padding: 10px;background-color: #fff;"
             v-if="new Date(detail.startTime) < new Date()">
          <el-row justify="center">
            <el-button type="primary" plain v-show="isShowProblems" @click="isShowProblems=!isShowProblems"
                       style="margin: 0">
              显示排名
            </el-button>
            <el-button type="primary" plain v-show="!isShowProblems" @click="isShowProblems=!isShowProblems"
                       style="margin: 0">
              显示题目
            </el-button>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-table :data="detail.problemList" style="width: 100%" stripe size="large"
                      v-show="isShowProblems&&new Date(detail.startTime) < new Date()"
                      @row-click="(row)=>{router.push({name:'problemDetail',query:{id: row.id}})}">
              <el-table-column label="状态" width="60">
                <template #default="scope">
                  <el-icon v-if="useUserStore().isPassedMatch(scope.row.id)"><Select style="color: #5CC272"/>
                  </el-icon>
                  <el-icon v-else>
                    <SemiSelect/>
                  </el-icon>
                </template>
              </el-table-column>
              <el-table-column label="题目ID" width="150">
                <template #default="scope">
                  <div style="display: flex; align-items: center;padding-left: 25px;font-weight: 700">
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
            <div v-show="!isShowProblems">
              <el-table :data="rank" style="width: 1000px" stripe border>
                <el-table-column fixed prop="rank" label="排名" width="70"/>
                <el-table-column fixed label="用户" width="250">
                  <template #default="scope">
                    <el-row align="middle">
                      <img
                          :src="scope.row.avatar||'https://1973034392.obs.cn-north-4.myhuaweicloud.com/defaultAvatar.png' "
                          alt="用户头像"
                          style="height: 35px; border-radius: 50%;margin-right: 5px">
                      {{ scope.row.nickname }}
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column fixed label="AC数" width="70">
                  <template #default="scope">
                    <el-row align="middle" justify="center">
                      {{ scope.row.acNumber }}
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column fixed label="比赛得分" width="100">
                  <template #default="scope">
                    <el-row align="middle" justify="center">
                      {{ scope.row.score }}
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column :label="alphabetLabels(problem-1)" width="80" v-for="problem in problemNumber">
                  <template #default="scope">
                    <div v-if="scope.row.isPassed[problem-1]===100"
                         style="width: 100%;height: 100%;margin: 0;background-color: #60E760">
                      <el-row align="middle" justify="center" style="font-weight: 700">
                        {{ scope.row.isPassed[problem - 1] }}
                      </el-row>
                      <el-row align="middle" justify="center" style="font-size: 12px">
                        {{ scope.row.tryNumber[problem - 1] }} try
                      </el-row>
                    </div>
                    <div v-if="scope.row.isPassed[problem-1]>0&&scope.row.isPassed[problem-1]<100"
                         style="width: 100%;height: 100%;margin: 0;background-color: #D64D5B">
                      <el-row align="middle" justify="center" style="font-weight: 700">
                        {{ scope.row.isPassed[problem - 1] }}
                      </el-row>
                      <el-row align="middle" justify="center" style="font-size: 12px">
                        {{ scope.row.tryNumber[problem - 1] }} try
                      </el-row>
                    </div>
                    <div v-if="scope.row.isPassed[problem-1]===0" style="width: 100%;height: 100%;margin: 0">
                      <el-row align="middle" justify="center" style="font-weight: 700">
                        {{ scope.row.isPassed[problem - 1] }}
                      </el-row>
                      <el-row align="middle" justify="center" style="font-size: 12px">
                        {{ scope.row.tryNumber[problem - 1] }} try
                      </el-row>
                    </div>
                  </template>
                </el-table-column>
              </el-table>

            </div>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
>>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: rgba(64, 158, 255, 0.2);
}

>>> .cell {
  text-align: center;
  padding: 0;
}
</style>

```

## 提交记录页

```vue
<script setup lang="js">
import {ref, onMounted, watch} from "vue";
import {easyPost} from "@/net/index.js";

let pageSize = ref(10)
let pageNumber = ref(1)
let problemId = ref("")
let resultType = ref(100)
let count = ref(0)

onMounted(() => {
  fetchRecord()
  fetchCount()
})

watch(resultType, () => {
  fetchRecord()
}, {deep: true})

const record = ref([])
const fetchRecord = async () => {
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
  const data = await easyPost('/record/problemRecordNumber', {})
  if (data) {
    count.value = data
  }
}
</script>

<template>
  <el-row justify="center">
    <el-col :span="20">
      <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px;background-color: #fff">
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
              <el-col :span="6">
                记录状态
              </el-col>
              <el-col :span="18">
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
                      :key="1"
                      label="已通过"
                      :value="1"
                  />
                  <el-option
                      :key="0"
                      label="未通过"
                      :value="0"
                  />
                  <el-option
                      :key="2"
                      label="编译失败"
                      :value="2"
                  />
                </el-select>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div style="box-shadow: 0 2px 15px 0 rgba(0,0,0,.15);padding: 20px;background-color: #fff;margin-top: 20px"
           v-if="record.length!==0">
        <el-row v-for="domain in record" justify="space-around" align="middle">
          <el-col :span="3">
            <router-link :to="{name:'problemResult',query:{submissionId: domain.submissionId}}">
              {{ domain.subTime }}
            </router-link>
          </el-col>
          <el-col :span="2">
            <router-link :to="{name:'problemResult',query:{submissionId: domain.submissionId}}">
              <el-row justify="center">
                <div>
                  <el-tag size="large" type="success" v-show="domain.subResult===1" effect="dark">Accepted</el-tag>
                  <el-tag size="large" type="warning" v-show="domain.subResult===2" effect="dark">Compile Error</el-tag>
                  <el-tag size="large" type="danger" v-show="domain.subResult===0" effect="dark">Unaccepted</el-tag>
                </div>
              </el-row>
              <el-row justify="center">
                <div style="color: #67C23A" v-show="domain.subResult===1">{{ domain.score }}</div>
                <div style="color: #F56C6C;" v-show="domain.subResult===0">{{ domain.score }}</div>
              </el-row>
            </router-link>
          </el-col>
          <el-col :span="7">
            <router-link :to="{name:'problemDetail',query:{id: domain.problemId}}">
              <div style="font-size: large;color: #409EFF">
                {{ domain.problemTitle }}
              </div>
            </router-link>
          </el-col>
          <el-col :span="4">
            <router-link :to="{name:'problemResult',query:{submissionId: domain.submissionId}}">
              <el-row align="middle">
                <el-icon>
                  <Timer/>
                </el-icon>
                {{ domain.judgeTime }}ms / {{ domain.codeLanguage }}
              </el-row>
            </router-link>
          </el-col>
          <el-divider/>
        </el-row>
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
</style>
```

## 提交记录详情页

```vue
<script setup lang="js">
import {ref, onMounted} from "vue";
import {easyPost} from "@/net/index.js";
import {useRoute} from "vue-router";
import router from "@/router/index.js"

const route = useRoute()

const detail = ref([])
const fetchDetail = async () => {
  const data = await easyPost('/record/problemRecordDetail', route.query)
  if (data) {
    detail.value = data
    window.scrollTo(0, 0)
  }
}

function resultType(a) {
  if (a === 'Accepted') {
    return 'testcase passed'
  } else if (a === 'Compilation Error') {
    return 'testcase compilationError'
  } else {
    return 'testcase error'
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<template>
  <div class="result-card">
    <div class="header">
      <h2>提交详情 #S{{ route.query.submissionId }}</h2>
      <span class="status accepted" v-if="detail.judgeResult===1">通过 (Accepted)</span>
      <span class="status accepted" v-if="detail.judgeResult===0">未通过 (Unaccepted)</span>
      <span class="status accepted" v-if="detail.judgeResult===2">编译失败 (Compile Error)</span>
    </div>

    <div class="details">
      <div class="detail-item">
        <div class="detail-label">题目</div>
        <div class="detail-value">{{ detail.problemTitle }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">得分</div>
        <div class="detail-value">{{ detail.score }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">语言</div>
        <div class="detail-value">{{ detail.codeLanguage }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">运行时间</div>
        <div class="detail-value">{{ detail.judgeTime }} ms</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">内存</div>
        <div class="detail-value">{{ detail.judgeMemory }} KB</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">提交时间</div>
        <div class="detail-value">{{ detail.subTime }}</div>
      </div>
    </div>

    <h3>代码</h3>
    <div class="code-section">
      <pre><code>{{ detail.code }}</code></pre>
    </div>

    <h3>测试点</h3>
    <div class="testcase-grid">
      <div :class="resultType(result.status)" v-for="(result,index) in detail.judgeResults"
           :key="index">
        <div>测试点 #{{ index + 1 }}</div>
        <div>{{ result.status }}</div>
      </div>
    </div>
  </div>

</template>

<style scoped>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #f5f5f5;
  margin: 0;
  padding: 20px;
}

.result-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
}

.status.accepted {
  background: #e3f9e5;
  color: #1b873f;
}

.details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.detail-item {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
}

.detail-label {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 4px;
}

.detail-value {
  font-weight: 500;
  color: #333;
}

.code-section {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 15px;
  border-radius: 6px;
  font-size: 18px;
  overflow-x: auto;
}

.testcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 20px;
}

.testcase {
  background: #f0f0f0;
  padding: 8px;
  border-radius: 4px;
  text-align: center;
}

.testcase.passed {
  background: #e3f9e5;
  color: #1b873f;
}

.testcase.compilationError{
  background: #eabc77;
  color: #1E1F22;
}

.testcase.error{
  background: #F56C6C;
  color: #1E1F22;
}
</style>
```

## 代码编写页的修改与完善

> 具备了代码的发送和判题以及自动跳转功能

```vue
<script lang="js" setup>
import {useRoute} from 'vue-router'
import {onMounted, ref} from "vue";
import {easyPost} from "@/net/index.js";
import router from "@/router/index.js";
import markdownIt from 'markdown-it';

const route = useRoute()

onMounted(() => {
  fetchProblems()
  window.scrollTo(0, 0)
  setTimeout(() => {
    MathJax.typeset();
  }, 150);
})

const detail = ref([])
const fetchProblems = async () => {
  const data = await easyPost('/problem/detail', route.query)
  if (data) {
    detail.value = data
  }
  renderMarkdown();
}

// 初始化 Markdown 文本

// 存储渲染后的 HTML 字符串
const renderedMarkdown = ref('');

// 创建 markdown-it 实例并渲染 Markdown
function renderMarkdown() {
  const mdRenderer = markdownIt();
  renderedMarkdown.value = mdRenderer.render(detail.value.detail);
}

const language = [{
  select:0,
  id: 75,
  name: 'C',
  description: '这是c'
}, {
  select:1,
  id: 76,
  name: 'C++',
  description: '这是c++'
}, {
  select:2,
  id: 62,
  name: 'Java',
  description: '这是java'
}, {
  select:3,
  id: 63,
  name: 'JavaScript',
  description: '这是java'
}, {
  select:4,
  id: 71,
  name: 'Python',
  description: '这是python'
}]

let languageChoice = ref(0)


import Codemirror from 'codemirror-editor-vue3';
import 'codemirror/addon/edit/closebrackets.js'; // 自动闭合括号插件
import 'codemirror/addon/edit/matchbrackets'; // 匹配括号高亮插件
import 'codemirror/mode/clike/clike'; // C/C++ 模式

const code = ref('');
const cmOptions = {
  mode: 'text/x-java',
  matchBrackets: true,
  theme: 'default',
  lineNumbers: true,
  autoCloseBrackets: true,
}

const cmRef = ref()

async function sendCode() {
  const data = await easyPost('/judge', {
    problemId: route.query.id,
    language: language.find(lang => lang.select === languageChoice.value).id,
    code: code.value
  })
  if (data) {
    router.push({name:'problemResult',query:{submissionId: data}})
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
              <div id="content">
                <div v-html="renderedMarkdown"/>
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
              <el-col :span="8">
                <el-select
                    placeholder="Select"
                    size="large"
                    v-model="languageChoice"
                    style="width: 240px"
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
                <el-button type="primary" @click="sendCode()">提交代码</el-button>
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

@media (max-width: 1400px) {
  #right-col {
    display: none; /* 隐藏右侧列 */
  }

  #left-col {
    flex-basis: calc(100% / 24 * 22); /* 左侧列占22个栅格 */
    max-width: calc(100% / 24 * 20);
  }
}
</style>

```

## 特别说明

> **下面的代码修改了特别特别特别多的东西,如果有哪里看不懂,可以找2025.1.17日的提交记录**

## 代码发送的完善

```js
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
```

## home页接口完善

```vue
<script setup lang="js">
import {onMounted, ref, onBeforeUnmount} from "vue";
import {NCollapse, NCollapseItem} from "naive-ui";
import * as echarts from 'echarts';
import {easyPost} from "@/net";
import router from "@/router/index.js";

const chartContainer = ref(null);
let myChart = null;

const number = ref({
  subNumber: [],
  acNumber: [],
  date: [],
})
const fetchNumbers = async () => {
  const data = await easyPost('/problem/lastWeek')
  if (data) {
    number.value.date = data.date
    number.value.subNumber = data.subNumber
    number.value.acNumber = data.acNumber
    initChart()
  }
}

// 初始化 ECharts
const initChart = () => {
  if (chartContainer.value) {
    myChart = echarts.init(chartContainer.value);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#00A4FF'
          }
        }
      },
      legend: {
        data: ['提交数', 'AC数']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: number.value.date
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '提交数',
          type: 'line',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: number.value.subNumber
        },
        {
          name: 'AC数',
          type: 'line',
          areaStyle: {
            color: '#42B883'
          },
          emphasis: {
            focus: 'series'
          },
          data: number.value.acNumber
        }
      ]
    };
    myChart.setOption(option);
  } else {
    console.error('Chart container not found')
  }
};

// 处理窗口大小变化
const handleResize = () => {
  if (myChart) {
    myChart.resize()
  }
}


onMounted(() => {
  window.addEventListener('resize', handleResize)
  fetchNumbers()
  fetchProblems()
  fetchAnnouncement()
  fetchRankList()
});

// 在组件卸载前移除事件监听器
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
});


const problems = ref([])
const fetchProblems = async () => {
  const data = await easyPost('/problem/newProblemList')
  if (data) {
    problems.value = data
  }
}

const announcements = ref([])
const fetchAnnouncement = async () => {
  const data = await easyPost('/queryAnnouncement')
  if (data) {
    announcements.value = data
  }
}


const rankList = ref([])
const fetchRankList = async () => {
  const data = await easyPost('/monthRank')
  if (data) {
    rankList.value = data
  }
}
</script>
```

## 代码即时保存和语言选择保存

我将这些封装到了pinia里并配合了持久化

```js
import {defineStore} from 'pinia'

export const useReplyStore = defineStore('questions', {
    state: () => ({
        questions: [],
        language: 0
    }),
    getters: {
        getReplyById(state) {
            return (id) => {
                let codeObj = state.questions.find(question => question.id === id)
                if (codeObj == null) {
                    return ''
                }
                return codeObj.code
            }
        },
        getLanguage(state) {
            return state.language
        }
    },
    actions: {
        updateReply(updatedQuestion) {
            const index = this.questions.findIndex(q => q.id === updatedQuestion.id);
            if (index !== -1) {
                this.questions[index] = updatedQuestion;
            } else {
                this.questions.push(updatedQuestion);
            }
        },
        updateLanguage(select) {
            this.language = select;
        }
    },
    persist: true
});
```

