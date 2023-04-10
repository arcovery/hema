import router from './router/index'
import store from './store/index'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress配置

const whiteList = ['/login', '/404', '/register'] //  白名单

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 当用户已经登录
  const hasToken = store.state.user.token
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经登录,重定向为首页
      next({ path: '/' })
      NProgress.done()
    } else {
      const { userInfo } = store.state.user
      if (Object.keys(userInfo).length) {
        next()
      } else {
        try {
          // 获取用户基本信息和员工详细信息
          await store.dispatch('user/getUserInfo')
          // 解决刷新白屏问题
          next(to)
        } catch (error) {
          // 删除token并去登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在白名单,直接放行
      next()
    } else {
      // 没有权限访问其他页面,重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
