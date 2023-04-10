import axios from 'axios'
import { Notification } from 'element-ui'
import store from '@/store'
import router from '@/router'

// 创建一个axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基地址
  withCredentials: true, // 当跨域请求发送cookie
  timeout: 5000, // 请求超时时间
})
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 判断是否需要token
    if (!config.noToken) {
      const { token } = store.state.user
      config.headers.token = `${token}`
    }
    return config
  },
  (error) => {
    console.log(error) //调试
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    switch (true) {
      case 200 < res.code && res.code <= 205:
        Notification.error({
          title: '错误',
          message: res.message,
          duration: 1000,
          forbidClick: true,
        })
        break
      case res.code == 0:
        Notification.error({
          title: '错误',
          message: res.message,
          duration: 1000,
          forbidClick: true,
        })
        break
      case res.code == 206:
        Notification.error({
          title: '错误',
          message: res.message,
          duration: 1000,
          forbidClick: true,
        })
        store.commit('user/RESET_STATE')
        break

      default:
        Notification.success({
          title: '操作成功',
          message: res.message,
          duration: 1000,
          forbidClick: true,
        })
        break
    }
    return res
  },
  (error) => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath,
            },
          })
          break

        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          Notification({
            message: '登录过期，请重新登录',
            duration: 1000,
            forbidClick: true,
          })
          // 清除token
          localStorage.removeItem('token')
          store.commit('loginSuccess', null)
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath,
              },
            })
          }, 1000)
          break

        // 404请求不存在
        case 404:
          Notification({
            message: '网络请求不存在',
            duration: 1500,
            forbidClick: true,
          })
          break
        // 其他错误，直接抛出错误提示
        default:
          Notification({
            message: error.response.data.message,
            duration: 1500,
            forbidClick: true,
          })
      }
      return Promise.reject(error.response)
    }
    console.log('err' + error) //调试
    Notification({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  },
)

export default service
