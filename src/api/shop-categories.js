import request from '@/utils/request'

// 商铺分类列表
export function getShopCategories(params) {
  return request.get(`/shop-categories`, { params })
}
// 添加商铺分类
export function addShopCategories(params) {
  return request.post(`/shop-categories`, params)
}
// 更新商铺分类
export function updateShopCategories(id, params) {
  return request.put(`/shop-categories/${id}`, params)
}
// 删除商铺分类
export function deleteShopCategories(id) {
  return request.delete(`/shop-categories/${id}`)
}
