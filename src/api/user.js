import request from '@/utils/request'

// 登陆
export function login(data) {
  return request.post('/auth/login', data)
}
// 修改密码
export function changePassword(id, params) {
  return request.put(`/accounts/${id}/change-password`, params)
}
// 重置密码
export function resetPassword(id, params) {
  return request.put(`/accounts/${id}/reset-password`, params)
}
// 管理员列表
export function getAdminUsers() {
  return request.get(`/accounts`)
}
// 更新
export function updateAdminUsers(id, params) {
  return request.put(`/accounts/${id}`, params)
}
// 添加
export function addAdminUsers(params) {
  return request.post(`/accounts`, params)
}
// 删除
export function deleteAdminUsers(id) {
  return request.delete(`/accounts/${id}`)
}

// 用户列表
export function getUsers() {
  return request.get(`/users`)
}
