const state = {
  sidebarIndex: 0,
  sidebarRoutes: [],
  appMainLoading: false, // app-main区域的加载效果
  backTop: 0, // 置顶内容
  appMainWidth: 0, // 主内容宽度
  isClickMask: false, // 是否点击了遮罩层
}

const mutations = {
  setSidebarIndex(state, data) {
    state.sidebarIndex = data
  },
  setSidebarRoutes(state, data) {
    state.sidebarRoutes = data
  },
  setAppMainLoading(state, data) {
    state.appMainLoading = data
  },
  updateBackTop(state) {
    state.backTop++
  },
  setAppMainWidth(state, data) {
    state.appMainWidth = data
  },
  updateClickMask(state, data) {
    state.isClickMask = data
  },
}

const actions = {
  setSidebarIndex({ commit }, data) {
    commit('setSidebarIndex', data)
  },
  setSidebarRoutes({ commit }, data) {
    commit('setSidebarRoutes', data)
  },
  setAppMainLoading({ commit }, data) {
    commit('setAppMainLoading', data)
  },
  updateBackTop({ commit }, data) {
    commit('updateBackTop', data)
  },
  setAppMainWidth({ commit }, data) {
    commit('setAppMainWidth', data)
  },
  updateClickMask({ commit }, data) {
    commit('updateClickMask', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

