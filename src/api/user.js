// 导入请求对象
import request from '@/utils/request.js'

//  用户列表
export function userListAPI(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params,
  })
}
//  添加用户
export function userAddAPI(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data,
  })
}

//  用户状态
export function userStatusAPI(data) {
  return request({
    url: '/user/status',
    method: 'post',
    data,
  })
}

//  用户编辑
export function userEditAPI(data) {
  return request({
    url: '/user/edit',
    method: 'post',
    data,
  })
}

//  用户删除
export function userRemoveAPI(data) {
  return request({
    url: '/user/remove',
    method: 'post',
    data,
  })
}

// 退出接口
export function userLogoutAPI(data) {
  return request({
    url: '/logout',
    data,
  })
}
