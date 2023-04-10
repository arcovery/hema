import request from '@/utils/request'

// 登录接口
export function loginAPI(data) {
  return request({
    url: '/login',
    method: 'post',
    data,
    noToken: true,
  })
}

// 注册接口
export function registerAPI(data) {
  return request({
    url: '/register',
    method: 'post',
    data,
    noToken: true,
  })
}

// 上传图片接口
export function uploadsAPI(data) {
  return request({
    url: '/uploads',
    method: 'post',
    data,
    noToken: true,
  })
}

// 获取用户信息
export function getUserInfoAPI() {
  return request({
    url: '/info',
    method: 'get',
  })
}

// 为指定的手机号发送短信验证码
export function sendSmsAPI(data) {
  return request({
    url: '/sendsms',
    method: 'post',
    data,
  })
}
