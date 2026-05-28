
const state = {
  // guid parentGuid name isLeapMonth leapMonth sex birthDay solarTime lunarTime sunTime location type groupGuid bz star hasBirthdayRemind birthdayRemindType
  userList: [], // 用户案例
  hepanList: [], // 合盘案例
  wealthList: [], // 论财案例
  typeList: [{ name: '全部', id: '00000000-0000-0000-0000-000000000000' }], // 分组
  shenshaList: [], // 缓存神煞数据
  updateHepan: false, // 是否更新合盘
  navToFeedback: false, // 是否跳转到断事笔记反馈页面
}

const mutations = {
  setNavToFeedback(state, data) {
    state.navToFeedback = data
  },
  setUserList(state, data) {
    state.userList = data
  },
  addUser(state, data) {
    const index = state.userList.findIndex((item) => !item.star)
    state.userList.splice(index, 0, data)
  },
  setHepanList(state, data) {
    state.hepanList = data
  },
  setWealthList(state, data) {
    state.wealthList = data
  },
  setTypeList(state, data) {
    state.typeList.splice(1, state.typeList.length - 1)
    if (Array.isArray(data) && data.length > 0) {
      state.typeList.push(...data)
    }
  },
  addType(state, data) {
    state.typeList.push(data)
  },
  deleteType(state, id) {
    const index = state.typeList.findIndex((item) => item.id == id)
    index > -1 ? state.typeList.splice(index, 1) : ''
  },
  setShenshaList(state, data) {
    state.shenshaList.push(data)
  },
  setUpdateHepai(state, data) {
    state.updateHepan = data
  },
}

const actions = {
  setNavToFeedback({ commit }, data) {
    commit('setNavToFeedback', data)
  },
  setUserList({ commit }, data) {
    commit('setUserList', data)
  },
  addUser({ commit }, data) {
    commit('addUser', data)
  },
  setHepanList({ commit }, data) {
    commit('setHepanList', data)
  },
  setWealthList({ commit }, data) {
    commit('setWealthList', data)
  },
  setTypeList({ commit }, data) {
    commit('setTypeList', data)
  },
  addType({ commit }, data) {
    commit('addType', data)
  },
  deleteType({ commit }, id) {
    commit('deleteType', id)
  },
  setShenshaList({ commit }, data) {
    commit('setShenshaList', data)
  },
  setUpdateHepai({ commit }, data) {
    commit('setUpdateHepai', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
