// 导入请求对象
import request from '@/utils/request.js'

//  学科列表
export function subjectListAPI(params) {
  return request({
    url: '/subject/list',
    method: 'get',
    params,
  })
}
//  添加学科
export function subjectAddAPI(data) {
  return request({
    url: '/subject/add',
    method: 'post',
    data,
  })
}

//  学科状态
export function subjectStatusAPI(data) {
  return request({
    url: '/subject/status',
    method: 'post',
    data,
  })
}

//  学科编辑
export function subjectEditAPI(data) {
  return request({
    url: '/subject/edit',
    method: 'post',
    data,
  })
}

//  学科删除
export function subjectRemoveAPI(data) {
  return request({
    url: '/subject/remove',
    method: 'post',
    data,
  })
}
