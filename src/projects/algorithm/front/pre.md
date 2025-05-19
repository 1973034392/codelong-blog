---
title: 前端准备阶段
---
## 写在前面

> 由于我是后端程序员,不是专业写前端的,所以这份文档编写的不够详细,但已给出主要代码

## 初始化项目

### 在cmd窗口输入

```cmd
npm create vue@latest
```

* 依次选择:
  ![Clip_2024-10-10_10-16-21](https://s2.loli.net/2024/10/10/2FXISvaQigLwUDc.png)

### 删除初始项目文件

 ![Clip_2024-10-10_10-18-56](https://s2.loli.net/2024/10/10/YTwAhdCK2Q7XpDW.png)

* 将项目路由和组件内容删除
  ![Clip_2024-10-10_10-24-02](https://s2.loli.net/2024/10/10/hjRw4Cb1M7oAVLD.png)![Clip_2024-10-10_10-24-15](https://s2.loli.net/2024/10/10/P2ye9qKwoUXlvmN.png)
* 删除assets文件夹下的内容

### 安装elementplus并配置按需导入

* 在终端输入:

```cmd
npm install element-plus --save
npm install -D unplugin-vue-components unplugin-auto-import
```

* 然后在vite配置文件配置:

  ```js
  // vite.config.ts
  import { defineConfig } from 'vite'
  import AutoImport from 'unplugin-auto-import/vite'
  import Components from 'unplugin-vue-components/vite'
  import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
  
  export default defineConfig({
    // ...
    plugins: [
      // ...
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  })
  ```

### 覆盖源文件

* 用新的logo替换`public`目录下的 [favicon.ico](favicon.ico) 文件
* 在`index.html`文件替换原来的`app vue`为算法队OJ平台

## 登录页面编写

### 登录页一级路由编写

```vue
<script setup>

</script>

<template>
  <div style="width: 100vw;height: 100vh; overflow: hidden; display: flex">
    <div style="flex: 1; background-color: black; background-image: url(https://www4.bing.com//th?id=OHR.HoodoosBryce_ZH-CN8398575172_UHD.jpg);background-size: cover">
    </div>
    <div class="welcome-title">
      <div style="font-size: 20px">
        欢迎访问山西大学算法队Online Judge平台
      </div>
    </div>
    <div class="right">
      <router-view/>
    </div>
  </div>
</template>

<style scoped>
.right{
  width: 400px;
  z-index: 1;
  background-color: white;
}
.welcome-title{
  position: absolute;
  bottom: 30px;
  left: 30px;
  color: white;
  text-shadow: 0 0 10px black;
}
</style>
```

### 在index.js添加路由

```js
import {createRouter, createWebHistory} from 'vue-router'
import WelcomeView from "@/views/WelcomeView.vue";
import LoginPage from "@/views/welcome/LoginPage.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: WelcomeView,
            children: [
                {
                    path: '',
                    name: 'login',
                    component: LoginPage
                }
            ]
        }
    ]
})

export default router
```

### 消除显示外边距

* 在`index.html`添加样式代码

```html
<style>
        body {
            margin: 0;
        }
    </style>
```



## 配置异步请求工具

### 安装axios

```cmd
npm i axios
```



### 添加net目录,创建index.js文件

```js
import axios from "axios";
import {ElMessage} from "element-plus";
import Router from "@/router/index.js";

/**
 * Token请求头key值
 * @type {string}
 */
const authItemName = 'Authorization'

/**
 * 请求头的获取 存储 删除
 */
function getAccessToken() {
    const str = localStorage.getItem(authItemName) || sessionStorage.getItem(authItemName)
    if (!str) {
        return null
    }
    const authObj = JSON.parse(str)
    if (authObj.expire <= new Date()) {
        deleteAccessToken()
        ElMessage.warning("登录状态已过期,请重新登录")
        return null
    }
    return authObj.token
}

function storeAccessToken(token, remember, expire) {
    const authObj = {token: token, expire: expire}
    const str = JSON.stringify(authObj)
    if (remember) {
        localStorage.setItem(authItemName, str)
    } else {
        sessionStorage.setItem(authItemName, str)
    }
}

function deleteAccessToken() {
    localStorage.removeItem(authItemName)
    sessionStorage.removeItem(authItemName)
}

/**
 * 返回两种请求方式的请求头
 * @returns {{Authorization: *, "Content-Type": string}}
 */
function postHeader() {
    let token = getAccessToken();
    if (token) {
        return {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    } else {
        return {
            'Content-Type': 'application/json'
        }
    }
}

function getHeader() {
    let token = getAccessToken();
    if (token) {
        return {
            'Authorization': token,
        }
    } else {
        return {}
    }
}

/**
 * 默认报错方法
 * @param error
 */
const defaultError = (error) => {
    if (error && error.response && error.response.status !== 401) {
        ElMessage.error('发生了一些错误,请联系管理员');
    }
};

/**
 * 配置响应拦截器
 */
axios.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response.status === 401) {
        deleteAccessToken()
        Router.push("/login").then(r => ElMessage.error("用户未登录"))
    }
    return error
})

/**
 * 单独封装的请求方法
 * get携带Token信息,
 * post携带Token和以json方式发送数据
 * @param url
 * @param data
 */
async function easyPost(url, data) {
    try {
        const response = await axios.post(url, data, {
            headers: postHeader()
        })

        if (response.data.code === 1) {
            return response.data.data
        } else {
            ElMessage.error(response.data.msg)
            return null
        }
    } catch (err) {
        defaultError(err)
        return null
    }
}

async function easyGet(url, data) {
    try {
        const response = await axios.get(url, {
            params: data,
            headers: getHeader()
        })

        if (response.data.code === 1) {
            return response.data.data
        } else {
            ElMessage.error(response.data.msg)
            return null
        }
    } catch (err) {
        defaultError(err)
        return null
    }
}

/**
 * 因为登录方法不能带Token请求头,所以单独封装
 * @param username
 * @param password
 * @param remember
 */
function login(username, password, remember) {
    axios.post('/user/login', {
        username: username,
        password: password
    }, {
        headers: {'Content-Type': 'application/json'}
    }).then(({data}) => {
        if (data.code === 1) {
            storeAccessToken(data.data.token, remember, data.data.expire)
            Router.push('/home').then(r => ElMessage.success('登录成功'))
        } else {
            ElMessage.error(data.msg)
        }
    }).catch(err => defaultError(err))
}

/**
 * 判断是否登录
 */
function isLogin() {
    return !!getAccessToken();
}

/**
 * 登出,删除存放的Token
 */
function logout(than) {
    deleteAccessToken()
    ElMessage.success("退出登录成功")
    than()
}

export {login, logout, easyGet, easyPost, getAccessToken, isLogin}
```

## 退出登录以及路由守卫

### 退出登录

* 在`router`目录下的`index.ts`文件下修改路由:

``` js
routes: [
        {
            path: '/login',
            name: 'loginLayout',
            component: () => import('@/views/welcome/WelcomeView.vue'),
            children: [
                {
                    path: '',
                    name: 'login',
                    component: () => import('@/views/welcome/LoginPage.vue')
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
                    component: () => import('@/views/MainPage/Home/HomeView.vue')
                }
            ]
        }
    ]
```

* 为了更好规划项目结构,更改`view`文件夹:

![Clip_2024-10-12_21-26-11](https://s2.loli.net/2024/10/12/olVnDs8YAbSIK72.png)

* 先设置一个按钮来实现退出登录功能:

```vue
<script setup lang="ts">

import {logout} from "@/net";
import router from "@/router";
</script>

<template>
  <el-button @click="logout(()=>router.push('/login'))" type="danger">退出登录</el-button>
</template>

<style scoped>

</style>
```

* 在`net.index.js`文件下添加退出登录功能:

```js
function logout(than) {
    deleteAccessToken()
    ElMessage.success("退出登录成功")
    than()
}
```



### 路由守卫

* 在`router.index.ts`文件下添加路由守卫配置项:

  

  ```js
  router.beforeEach((to, from, next) => {
      let loginStatus = isLogin()
      if (loginStatus) {
          if (to.path.startsWith('/login')) {
              next('/home')
          } else if (to.path === '/') {
              next('/home')
          } else {
              next()
          }
      } else {
          if (!to.path.startsWith('/login')) {
              next('/login')
          } else {
              next()
          }
      }
  })
  ```

  * 配置路由规则为:
    * 在已登录的情况下,访问以`/login`开头的路径(登录,注册,忘记密码页),自动跳转到`home`页
    * 在未登录的情况下,访问除`/login`开头的路径(登录,注册,忘记密码页)的其他目录自动跳转到登录页

   

## 响应拦截器的配置

在`net`目录下的`inde.js`文件下添加响应拦截器**用于判断后端是否返回了用户未登录(状态码401)的响应信息**

```js
axios.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response.status === 401) {
        Router.push("/login").then(r => ElMessage.error("用户未登录"))
    }
    return error
})
```

修改默认异常处理方法,添加判断条件(status != 401)

```js
const defaultError = (error) => {
    if (error.response.status !== 401) {
        ElMessage.error('发生了一些错误,请联系管理员')
    }
}
```
