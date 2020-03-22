import {
  login,
  getAdminUsers,
  addAdminUsers,
  updateAdminUsers,
  deleteAdminUsers,
  resetPassword,
  changePassword,
} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/token'
import { setStore, getStore, removeStore } from '@/utils/local-store'
import router, { resetRouter } from '@/router'
const userInfoKeyName = 'admin_userInfo'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  userInfo: getStore(userInfoKeyName) || {},
  userList: [],
  imgPrefix:
    process.env.NODE_ENV === 'development'
      ? 'http://techpanda.h.test.codesign.me'
      : '',
}
const getters = {
  userInfo(state) {
    return state.userInfo
  },
  userList(state) {
    return state.userList
  },
}
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERINFO(state, payload) {
    state.userInfo = payload
    setStore(userInfoKeyName, payload)
  },
  REMOVE_USERINFO(state) {
    state.userInfo = {}
    removeStore(userInfoKeyName)
  },
  SET_USERLIST(state, payload) {
    state.userList = payload
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data, token } = response
          commit('SET_TOKEN', token)
          commit('SET_USERINFO', data)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const role = state.userInfo.role
      const data = {
        roles: [],
      }
      data.roles.push('ROOT')
      // if (role) {
      //   data.roles.push(role)
      // }
      commit('SET_ROLES', data.roles)
      resolve(data)
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    commit('REMOVE_USERINFO')
    removeToken()
    resetRouter()
    // reset visited views and cached views
    // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
    dispatch('tagsView/delAllViews', null, { root: true })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('REMOVE_USERINFO')
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true,
    })

    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })

    return Promise.resolve()
  },
  getAdminUsers(context, payload) {
    return getAdminUsers(payload).then(response => {
      context.commit('SET_USERLIST', response)
    })
  },
  addAdminUsers(context, payload) {
    return addAdminUsers(payload)
  },
  updateAdminUsers(context, { id, params }) {
    return updateAdminUsers(id, params)
  },
  deleteAdminUsers(context, id) {
    return deleteAdminUsers(id)
  },
  resetPassword(context, { id, params }) {
    return resetPassword(id, params)
  },
  changePassword(context, { id, params }) {
    return changePassword(id, params)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
