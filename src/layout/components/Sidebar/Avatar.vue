<template>
  <div class="avatar-box">
    <div
      style="display: flex; align-items: center; position: relative"
      class="pointer"
      v-if="userguid"
      @click.stop="onOpen"
    >
      <img
        :src="require('@/assets/images/icon_avatar.png')"
        style="width: 41px; height: 41px"
      />
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin: 0 10px;
        "
      >
        <div style="display: flex; align-items: center; margin-bottom: 6px">
          <span
            style="
              margin-right: 5px;
              display: flex;
              align-items: center;
              color: #101010;
            "
          >
            {{ username || '小真' }}
          </span>
          <span
            style="
              display: flex;
              align-items: center;
              border-radius: 10px;
              padding: 5px 7.5px;
              color: white;
              font-size: 10px;
            "
            :style="{ backgroundColor: viplevel > 0 ? '#b2955d' : '#8a8a8a' }"
          >
            {{ vipName }}
          </span>
        </div>
        <span style="color: #c2c2c5">ID:{{ userguid.slice(-8) }}</span>
      </div>
      <div style="padding: 5px">
        <img
          :src="require('@/assets/images/icon_arrow.png')"
          style="width: 18px; height: 18px"
          :class="[isOpen ? 'openRotateAnimation' : 'closeRotateAnimation']"
        />
      </div>
      <!-- <div
        v-if="isOpen"
        class="dropdown-first-item"
        style="color: white; background-color: white; z-index: 9999"
        :style="{ right: popupRight + 'px' }"
      >
        <span class="triggle"></span>
        <span
          style="
            padding: 15px 35px;
            font-size: 14px;
            background-color: #b2955d;
            border-radius: 20px 20px 0 0;
          "
        >
          账号:{{ phone }}
        </span>
        <div
          class="dropdown-popup pointer"
          @mouseover="onHoverItem('vip')"
          @mouseout="onUnHoverItem('vip')"
          @click="onPath('vip-page')"
        >
          <img class="dropdown-icon" :src="vipIcon" alt="vip_icon" />
          <span class="dropdown-text">会员中心</span>
        </div>
        <span
          style="background-color: #f5f5f7; width: 100%; height: 1px"
        ></span>
        <div
          class="dropdown-popup pointer"
          @mouseover="onHoverItem"
          @mouseout="onUnHoverItem"
          @click="onLogout"
        >
          <img class="dropdown-icon" :src="logoutIcon" alt="logout_icon" />
          <span class="dropdown-text">退出登录</span>
        </div>
      </div> -->
    </div>
    <div v-else class="avatar-label">
      <span class="label-item pointer" @click="onPath('login')">登录</span>
      |
      <span class="label-item pointer" @click="onPath('login')">注册</span>
    </div>
  </div>
  <!--   <div class="dropdown-first-item" style="color: white" v-if="isOpen">
          <span class="triggle"></span>
          <span
            style="
              padding: 15px 35px;
              font-size: 14px;
              background-color: #b2955d;
              border-radius: 20px 20px 0 0;
            "
          >
            账号:{{ phone }}
          </span>
          <div
            class="pointer"
            style="padding: 15px 35px; font-size: 14px; display: flex"
            @mouseover="onHoverItem('vip')"
            @mouseout="onUnHoverItem('vip')"
            @click="onPath('vip-page')"
          >
            <img class="dropdown-icon" :src="vipIcon" alt="vip_icon" />
            <span style="color: #646464; font-size: 16px">会员中心</span>
          </div>
          <span
            style="background-color: #f5f5f7; width: 100%; height: 1px"
          ></span>
          <div
            class="pointer"
            style="padding: 15px 35px; font-size: 14px; display: flex"
            @mouseover="onHoverItem"
            @mouseout="onUnHoverItem"
            @click="onLogout"
          >
            <img class="dropdown-icon" :src="logoutIcon" alt="logout_icon" />
            <span style="color: #646464; font-size: 16px">退出登录</span>
          </div>
        </div> -->
</template>

<script setup>
import { ref, computed, onMounted, defineProps, watch } from 'vue'
import store from '@/store'
import { navigationTo, logout, phoneOmitFn } from '@/utils'
import { vipLevelName2 } from '@/static'
import { Toast } from 'vant'

const avatarSrc = require('@/assets/images/avatar.png')
const userguid = computed(() => store.getters.userguid)
const username = computed(() => store.getters.username)
const phone = computed(() => phoneOmitFn(store.getters.phone))
const viplevel = computed(() => store.getters.viplevel)
const isOpen = ref(false)
const vipIconUnHover = require('@/assets/images/vip_icon.png')
const logoutIconUnHover = require('@/assets/images/logout_icon.png')
const vipIconHover = require('@/assets/images/vip_icon2.png')
const logoutIconHover = require('@/assets/images/logout_icon2.png')
const vipIcon = ref(vipIconUnHover)
const logoutIcon = ref(logoutIconUnHover)
const vipName = computed(
  () => vipLevelName2[store.getters.viplevel > -1 ? store.getters.viplevel : 0],
)
let vipUpdateCode = 0
const porps = defineProps({
  scrollLeft: {
    type: Number,
    default: 0,
  },
})

const avatarBoxInfo = ref({
  left: 0,
  width: 0,
})
//监听scrollLeft的变化
watch(
  () => porps.scrollLeft,
  (val) => {
    // console.log('scrollLeft', val)
    //popupRight.value = 10
    //popupRight.value =  val
    let avatarBox = document.getElementsByClassName('avatar-box')[0]
    let avatarBoxLeft = avatarBox.offsetLeft
    let avatarBoxWidth = avatarBox.offsetWidth
    if (window.innerWidth + val < avatarBoxLeft) {
      //console.log("我看不到啦");
    } else {
      popupRight.value =
        window.innerWidth + val - avatarBoxLeft - avatarBoxWidth - 20
      //同步修改由动态创建的下拉菜单的位置
      // console.log(document.getElementsByClassName('dropdown-first-item'))

      if (document.getElementsByClassName('dropdown-first-item')[0]) {
        //console.log('popupRight', popupRight.value);
        document.getElementsByClassName('dropdown-first-item')[0].style.right =
          popupRight.value + 'px'
      }
    }

    // let avatarBoxLeft = avatarBoxInfo.value.left
    // let avatarBoxWidth = avatarBoxInfo.value.width
    // if ((window.innerWidth + val) < avatarBoxLeft) {
    //   console.log("我看不到啦");
    // }else{
    //   popupRight.value =  (window.innerWidth + val) - avatarBoxLeft - avatarBoxWidth - 20
    // }
    //console.log('可视宽度', window.innerWidth)
  },
)

let popupRight = ref(20)

// 打开下拉菜单
const onOpen = () => {
  isOpen.value = !isOpen.value
  vipIcon.value = vipIconUnHover
  logoutIcon.value = logoutIconUnHover
  if (isOpen.value) {
    //动态创建与app同级的元素
    // 创建新的HTML元素
    const newElement = document.createElement('div')
    newElement.className = 'dropdown-first-item'
    newElement.style = `color: white; background-color: white; z-index: 9999;right: ${popupRight.value}px`
    newElement.innerHTML = `
          <span class="triggle"></span>
          <span
            style="
              padding: 15px 35px;
              font-size: 14px;
              background-color: #b2955d;
              border-radius: 20px 20px 0 0;
            "
          >
            账号:${phone.value}
          </span>
          <div
            class="dropdown-popup pointer dropdown-first-item-vip"
            @mouseover="onHoverItem('vip')"
            @mouseout="onUnHoverItem('vip')"
            @click="onPath('vip-page')"
          >
            <img class="dropdown-icon dropdown-icon-vip" src="${vipIcon.value}" alt="vip_icon" />
            <span class="dropdown-text">会员中心</span>
          </div>
          <span
            style="background-color: #f5f5f7; width: 100%; height: 1px"
          ></span>
          <div
            class="dropdown-popup pointer dropdown-first-item-logout"
            @mouseover="onHoverItem"
            @mouseout="onUnHoverItem"
            @click="onLogout"
          >
            <img class="dropdown-icon dropdown-icon-logout" src="${logoutIcon.value}" alt="logout_icon" />
            <span class="dropdown-text">退出登录</span>
          </div>
        </div>`
    // 获取根节点
    const appElement = document.getElementById('app')
    // 将新元素插入到根节点之前
    if (appElement.parentNode) {
      appElement.parentNode.insertBefore(newElement, appElement)
      console.log(document.getElementsByClassName('dropdown-first-item-vip')[0])
      document
        .getElementsByClassName('dropdown-first-item-vip')[0]
        .addEventListener('click', (e) => {
          console.log('点击了会员中心')
          onPath('vip-page')
          //e.stopPropagation()
        })
      document
        .getElementsByClassName('dropdown-first-item-vip')[0]
        .addEventListener('mouseover', (e) => {
          //e.target.childNodes[1].src = vipIconHover
          //onHoverItem('vip')
          document.getElementsByClassName('dropdown-icon-vip')[0].src =
            vipIconHover
          document.getElementsByClassName('dropdown-icon-logout')[0].src =
            logoutIconUnHover
        })
      document
        .getElementsByClassName('dropdown-first-item-vip')[0]
        .addEventListener('mouseout', (e) => {
          //onUnHoverItem('vip')
          document.getElementsByClassName('dropdown-icon-logout')[0].src =
            logoutIconUnHover
          document.getElementsByClassName('dropdown-icon-vip')[0].src =
            vipIconUnHover
        })
      document
        .getElementsByClassName('dropdown-first-item-logout')[0]
        .addEventListener('click', (e) => {
          console.log('点击了退出登录')
          onLogout()
        })
      document
        .getElementsByClassName('dropdown-first-item-logout')[0]
        .addEventListener('mouseover', (e) => {
          document.getElementsByClassName('dropdown-icon-logout')[0].src =
            logoutIconHover
          document.getElementsByClassName('dropdown-icon-vip')[0].src =
            vipIconUnHover
        })
      document
        .getElementsByClassName('dropdown-first-item-logout')[0]
        .addEventListener('mouseout', (e) => {
          document.getElementsByClassName('dropdown-icon-logout')[0].src =
            logoutIconUnHover
          document.getElementsByClassName('dropdown-icon-vip')[0].src =
            vipIconUnHover
        })
    }
  } else {
    document.getElementsByClassName('dropdown-first-item')[0].remove()
  }
}
// 跳转
const onPath = (path) => {
  vipUpdateCode = vipUpdateCode ^ 1
  let params = {
    updateCode: vipUpdateCode,
  }
  //传递事件给跳转的页面

  navigationTo({ path, params})
}
// 退出登录
const onLogout = async () => {
  await logout()
}
// 移到指定项
const onHoverItem = (item) => {
  switch (item) {
    case 'vip':
      vipIcon.value = vipIconHover
      //document.getElementsByName('dropdown-icon')[0].src = vipIconHover
      break
    default:
      logoutIcon.value = logoutIconHover
    //document.getElementsByName('dropdown-icon')[1].src = logoutIconHover
  }
}
// 移开指定项
const onUnHoverItem = (item) => {
  switch (item) {
    case 'vip':
      vipIcon.value = vipIconUnHover
      //document.getElementsByName('dropdown-icon')[0].src = vipIconUnHover
      break
    default:
      logoutIcon.value = logoutIconUnHover
    //document.getElementsByName('dropdown-icon')[1].src = logoutIconUnHover
  }
}

onMounted(() => {
  console.log('porps', porps)

  let avatarBox = document.getElementsByClassName('avatar-box')[0]
  avatarBoxInfo.value.left = avatarBox.offsetLeft
  avatarBoxInfo.value.width = avatarBox.offsetWidth
  console.log('avatarBoxInfo', avatarBoxInfo.value)
  // test-start
  let avatarBoxLeft = avatarBox.offsetLeft
  let avatarBoxWidth = avatarBox.offsetWidth
  popupRight.value = window.innerWidth - avatarBoxLeft - avatarBoxWidth - 20
  // test-end
  window.addEventListener('resize', () => {
    let pageW = window.innerWidth
    let avatarBoxLeft = avatarBox.offsetLeft
    let avatarBoxWidth = avatarBox.offsetWidth
    // console.log(
    //   '屏幕变化啦',
    //   window.innerWidth,
    //   document.getElementsByClassName('avatar-box')[0].offsetLeft,
    //   document.getElementsByClassName('avatar-box')[0].offsetWidth,
    // )
    if (pageW > avatarBoxLeft + avatarBoxWidth) {
      popupRight.value = 10
    } else {
      popupRight.value = pageW - avatarBoxLeft - avatarBoxWidth - 10
    }
    //同步修改由动态创建的下拉菜单的位置
    if (document.getElementsByClassName('dropdown-first-item')[0]) {
      document.getElementsByClassName('dropdown-first-item')[0].style.right =
        popupRight.value + 'px'
    }
  })

  //同步修改由动态创建的下拉菜单的位置
  document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
    if (e.target.className !== 'avatar-box') {
      isOpen.value = false
      vipIcon.value = vipIconUnHover
      logoutIcon.value = logoutIconUnHover
      //同步修改由动态创建的下拉菜单的位置
      if (document.getElementsByClassName('dropdown-first-item')[0]) {
        document.getElementsByClassName('dropdown-first-item')[0].remove()
      }
    }
  })

  document
    .getElementsByClassName('avatar-box')[0]
    .addEventListener('click', (e) => {
      e.stopPropagation()
    })

  window.onresize = () =>
    (() => {
      let pageW = window.innerWidth
      let avatarBox = document.getElementsByClassName('avatar-box')[0]
      let avatarBoxLeft = avatarBox.offsetLeft
      let avatarBoxWidth = avatarBox.offsetWidth
      console.log(
        '屏幕变化啦',
        window.innerWidth,
        document.getElementsByClassName('avatar-box')[0].offsetLeft,
        document.getElementsByClassName('avatar-box')[0].offsetWidth,
      )
      if (pageW > avatarBoxLeft + avatarBoxWidth) {
        popupRight.value = 10
      } else {
        popupRight.value = pageW - avatarBoxLeft - avatarBoxWidth - 10
      }
    })()
})
</script>

<style lang="scss">
::v-deep .el-popper .is-pure {
  border-radius: 20px !important;
}
::v-deep .el-scrollbar {
  border-radius: 20px !important;
}
.avatar-box {
  margin-right: 30px;
  text-align: right;
  //background-color: orange;
  white-space: nowrap;
  .avatar-content {
    display: flex;
    align-items: center;
  }

  .avatar-label {
    display: inline-flex;
    align-items: center;
    width: 120px;
    white-space: nowrap;
    .label-item {
      margin: 0 10px;
      color: rgba(0, 0, 0, 1);
      font-size: 14px;
    }
  }
}

.dropdown-first-item {
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  position: fixed;
  right: 10px;
  top: calc(114px - 20px);
  // box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.12);

  //在头部显示一个三角形
  &::after {
    content: '';
    position: absolute;
    top: -42px;
    right: 2%;
    width: 0;
    height: 0;
    border-top: 30px solid transparent;
    border-right: 30px solid transparent;
    border-left: 30px solid transparent;
    border-bottom: 30px solid #b2955d;
  }
  //padding: 15px 0 0 17px;
  .my-header-username {
    line-height: 10px;
    white-space: nowrap;
    .my-header-username-value {
      display: inline-block;
      font-size: 14px;
      font-weight: bold;
    }
    .my-header-username-label {
      display: inline-block;
      font-size: 0;
      transform: translateX(-7px) scale(0.6);
      .my-header-username-label-item {
        padding: 3px 5px;
        font-size: 12px;
        color: #f1cb8c;
        background-color: black;
      }
      .vip {
        color: black;
        background-color: #f1cb8c;
      }
      .novip {
        color: black;
        background-color: #c1c1c1;
      }
    }
  }
  .dropdown-first-item-tip {
    color: rgba(157, 157, 157, 100);
    font-size: 12px;
  }
}

.dropdown-icon {
  width: 23px;
  margin-right: 8px;
}

:deep(.el-dropdown__popper .el-dropdown__list) {
  border-radius: 20px !important;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  color: rgba(89, 89, 89, 100);
  font-size: 16px !important;
  padding: 15px 35px;
  border-radius: 0 0 20px 20px;
  &:hover {
    color: rgba(178, 149, 93, 100) !important;
    background-color: transparent !important;
  }
}

.dropdown-popup {
  padding: 15px 35px;
  font-size: 14px;
  display: flex;
  color: #646464;
  .dropdown-text {
    font-size: 16px;
    display: flex;
    align-items: center;
  }
  &:hover {
    color: #b2955d;
  }
}

.closeRotateAnimation {
  transform: rotate(0);
  animation: closeRotateAnimation 0.4s;
}

.openRotateAnimation {
  transform: rotate(180deg);
  animation: openRotateAnimation 0.4s;
}

@keyframes closeRotateAnimation {
  0% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(0);
  }
}

@keyframes openRotateAnimation {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(180deg);
  }
}
.el-popper {
  --el-popper-border-radius: 20px !important;
}

:root {
  --el-popper-border-radius: 20px !important;
}

.el-popper__arrow {
  display: none !important;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 333;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
