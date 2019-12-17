import request from '@/utils/request'

// 轮播图列表
export function getSwiper(params) {
  return request.get(`/carousels`, { params })
}
// 添加轮播图
export function addSwiper(params) {
  return request.post(`/carousels`, params)
}
// 更新轮播图
export function updateSwiper(id, params) {
  return request.put(`/carousels/${id}`, params)
}
// 删除轮播图
export function deleteSwiper(id) {
  return request.delete(`/carousels/${id}`)
}
