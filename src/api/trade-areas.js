import request from '@/utils/request'

// 商圈列表
export function getTradeAreas(params) {
  return request.get(`/trade-areas`, { params })
}
// 添加商圈
export function addTradeAreas(params) {
  return request.post(`/trade-areas`, params)
}
// 更新商圈
export function updateTradeAreas(id, params) {
  return request.put(`/trade-areas/${id}`, params)
}
// 删除商圈
export function deleteTradeAreas(id) {
  return request.delete(`/trade-areas/${id}`)
}
// 详情
export function getTradeAreasDetails(id) {
  return request.get(`/trade-areas/${id}`)
}
