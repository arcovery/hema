// 导入请求对象
import request from '@/utils/request.js'

//  题库列表
export function questionListAPI(params) {
  return request({
    url: '/question/list',
    method: 'get',
    params,
  })
}
//  添加题库
export function questionAddAPI(data) {
  return request({
    url: '/question/add',
    method: 'post',
    data,
  })
}

//  题库状态
export function questionStatusAPI(data) {
  return request({
    url: '/question/status',
    method: 'post',
    data,
  })
}

//  题库编辑
export function questionEditAPI(data) {
  return request({
    url: '/question/edit',
    method: 'post',
    data,
  })
}

//  题库删除
export function questionRemoveAPI(data) {
  return request({
    url: '/question/remove',
    method: 'post',
    data,
  })
}
//  上传文件
export function questionUploadAPI(data) {
  return request({
    url: '/question/upload',
    method: 'post',
    data,
  })
}
