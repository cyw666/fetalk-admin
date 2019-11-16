import Store from 'store/dist/store.modern'
const TokenKey = 'admin_accessToken'

export function getToken() {
  return Store.get(TokenKey)
}

export function setToken(token) {
  return Store.set(TokenKey, token)
}

export function removeToken() {
  return Store.remove(TokenKey)
}
