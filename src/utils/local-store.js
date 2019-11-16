import Store from 'store/dist/store.modern'

export function getStore(key) {
  return Store.get(key)
}

export function setStore(key, value) {
  return Store.set(key, value)
}

export function removeStore(key) {
  return Store.remove(key)
}

export function clearAllStore() {
  return Store.clearAll()
}
