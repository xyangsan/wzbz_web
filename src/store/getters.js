const getters = {
  sidebarIndex: (state) => +state.page.sidebarIndex,
  sidebarRoutes: (state) => state.page.sidebarRoutes,
  appMainLoading: (state) => state.page.appMainLoading,
  backTop: (state) => state.page.backTop,
  appMainWidth: (state) => state.page.appMainWidth,
  userguid: (state) => state.permission.userguid,
  username: (state) => state.permission.username,
  viplevel: (state) => +state.permission.viplevel,
  expires: (state) => state.permission.expires,
  avatar: (state) => state.permission.avatar,
  phone: (state) => state.permission.phone,
  userList: (state) => state.paipan.userList,
  hepanList: (state) => state.paipan.hepanList,
  wealthList: (state) => state.paipan.wealthList,
  typeList: (state) => state.paipan.typeList,
  shenshaList: (state) => state.paipan.shenshaList,
  updateHepan: (state) => state.paipan.updateHepan,
  isClickMask: (state) => state.page.isClickMask,
}
export default getters

