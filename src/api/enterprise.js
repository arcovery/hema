// 导入请求对象
import request from '@/utils/request.js'

//  企业列表
export function enterpriseListAPI(params) {
  return request({
    url: '/enterprise/list',
    method: 'get',
    params,
  })
}
//  添加企业
export function enterpriseAddAPI(data) {
  return request({
    url: '/enterprise/add',
    method: 'post',
    data,
  })
}

//  企业状态
export function enterpriseStatusAPI(data) {
  return request({
    url: '/enterprise/status',
    method: 'post',
    data,
  })
}

//  企业编辑
export function enterpriseEditAPI(data) {
  return request({
    url: '/enterprise/edit',
    method: 'post',
    data,
  })
}

//  企业删除
export function enterpriseRemoveAPI(data) {
  return request({
    url: '/enterprise/remove',
    method: 'post',
    data,
  })
}
