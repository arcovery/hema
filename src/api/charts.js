// 导入 axios 副本
import request from '@/utils/request.js'

//  顶部数据统计
export function chatTitleAPI() {
  return request({
    url: '/data/title',
    method: 'post',
  })
}
//  企业数据
export function enterpriseDataAPI() {
  return request({
    url: '/data/statistics',
    method: 'post',
  })
}
