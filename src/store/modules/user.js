import { getUserInfoAPI, loginAPI } from '@/api/login'
import router from '@/router'
import { Notification } from 'element-ui'

const getDefaultState = () => {
  return {
    token: '',
    userInfo: {},
  }
}

const state = getDefaultState()

const mutations = {
  // 重置状态
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
    router.push('/')
  },

  // 设置token
  SET_TOKEN: (state, token) => {
    state.token = token
  },

  // 设置用户信息
  SET_USERINFO: (state, data) => {
    state.userInfo = data
  },
}

const actions = {
  // 用户登录
  async login({ commit }, userInfo) {
    const res = await loginAPI(userInfo)
    console.log(res)
    if (res.code === 200) {
      Notification.success({
        title: '登录成功',
        duration: 1000,
        forbidClick: true,
      })
      commit('SET_TOKEN', res.data.token)
    } else {
      throw new Error('登录失败')
    }
  },

  // 获取用户信息
  async getUserInfo({ commit }) {
    const res = await getUserInfoAPI()
    if (res.code === 200) {
      Notification.success({
        title: '登录成功',
        message: '欢迎回来' + res.data.username,
        duration: 1000,
        forbidClick: true,
      })
      commit('SET_USERINFO', res.data)
    } else {
      throw new Error('获取用户信息失败')
    }
  },

  // 用户退出
  logout({ commit, state }) {
    commit('RESET_STATE')
    Notification.success({
      title: '退出成功',
      duration: 1000,
      forbidClick: true,
    })
  },

  // 删除token
  resetToken({ commit }) {},
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
