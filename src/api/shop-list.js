import request from '@/utils/request'

// 商铺列表
export function getShops(params) {
  return request.get(`/shops`, { params })
}
// 添加商铺
export function addShops(params) {
  return request.post(`/shops`, params)
}
// 更新商铺
export function updateShops(id, params) {
  return request.put(`/shops/${id}`, params)
}
// 删除商铺
export function deleteShops(id) {
  return request.delete(`/shops/${id}`)
}

// 详情
export function getShopsDetail(id) {
  return request.get(`/shops/${id}`)
}
