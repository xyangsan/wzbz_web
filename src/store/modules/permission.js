const state = {
  userguid: localStorage.getItem('wzbz_userguid') || '',
  username: localStorage.getItem('wzbz_username') || '',
  viplevel: localStorage.getItem('wzbz_viplevel') || 0,
  expires: localStorage.getItem('wzbz_expires') || '',
  avatar: localStorage.getItem('wzbz_avatar') || '',
  phone: localStorage.getItem('wzbz_phone') || '',
}

const mutations = {
  setUserguid(state, data) {
    state.userguid = data
    localStorage.setItem('wzbz_userguid', data)
  },
  setUsername(state, data) {
    state.username = data
    localStorage.setItem('wzbz_username', data)
  },
  setViplevel(state, data) {
    state.viplevel = data
    localStorage.setItem('wzbz_viplevel', data)
  },
  setExpires(state, data) {
    state.expires = data
    localStorage.setItem('wzbz_expires', data)
  },
  setAvatar(state, data) {
    state.avatar = data
    localStorage.setItem('wzbz_avatar', data)
  },
  setPhone(state, data) {
    state.phone = data
    localStorage.setItem('wzbz_phone', data)
  },
  logout(state, data) {
    state.userguid = ''
    state.username = ''
    state.viplevel = 0
    state.avatar = ''
    state.phone = ''
    localStorage.clear()
  },
}

const actions = {
  setUserguid({ commit }, data) {
    commit('setUserguid', data)
  },
  setUsername({ commit }, data) {
    commit('setUsername', data)
  },
  setViplevel({ commit }, data) {
    commit('setViplevel', data)
  },
  setExpires({ commit }, data) {
    commit('setExpires', data)
  },
  setAvatar({ commit }, data) {
    commit('setAvatar', data)
  },
  setPhone({ commit }, data) {
    commit('setPhone', data)
  },
  logout({ commit }, data) {
    commit('logout', data)
    commit('paipan/setTypeList', null, { root: true }) // 保留第一个元素，其他都清除
    commit('paipan/setUserList', [], { root: true })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

