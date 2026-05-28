<script setup>
import { onMounted, ref, watch, computed, onUnmounted } from 'vue'
import store from '@/store'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import PopupBox from '@/components/popupBox'
import * as homeApi from '@/api/home-api'
import { packageParams } from '@/utils'

const guid = computed(() => store.getters.userguid)
const route = useRoute()
const showPopup = ref(false)
const selectId = ref('')
const leaveMsg = ref('')
const btnList = [
  {
    id: 1,
    name: '用户留言',
  },
  {
    id: 0,
    name: '下载APP',
  },
  {
    id: 2,
    name: '添加微信',
  },
  {
    id: 3,
    icon: 'ArrowUpBold',
  },
]
const isVip = ref(false)
const closeIcon = require('@/assets/images/close_icon.png')
const leaveClass = ref('') // 用户留言弹框样式
const leaveLoading = ref(false)
const qrCode1 = require('@/assets/images/wechart_qrcode1.jpg')
const qrCode2 = require('@/assets/images/wechart_qrcode2.png')
const randomQrcCode = ref(0)
watch(
  () => route.path,
  (path) => {
    if (path.search('vip-page') > -1) {
      isVip.value = true
    } else {
      isVip.value = false
    }
  },
  { immediate: true },
)

watch(
  () => showPopup.value,
  (val) => {
    if (val) {
      document.querySelector('.float-btns-container').style.zIndex = 1000
    } else {
      document.querySelector('.float-btns-container').style.zIndex = 996
    }
  },
)

// 随机返回两个二维码路径之一
const randomQrCodeSrc = computed(() => {
  // console.log("进吗", randomQrcCode.value);
  return randomQrcCode.value > 0.5? qrCode1: qrCode2
})

const onClick = (id) => {
  if(id == 4 || id == 2){
    randomQrcCode.value = Math.random() > 0.5
    // console.log("点击了", id,randomQrcCode.value );
  }
  if (id == 3) {
    onTop()
    return
  }
  selectId.value = id
  showPopup.value = true
}
// 置顶操作
const onTop = async () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
// 关闭弹框
const onClosePopup = (e) => {
  showPopup.value = false
}
// 留言反馈
const onLeave = async () => {
  if (!guid.value) {
    ElMessage.warning('请登录')
    return
  }
  leaveLoading.value = true
  if (!leaveMsg.value) {
    ElMessage.warning('反馈内容不能为空哦！')
    leaveLoading.value = false
    return
  }
  const leaveUrl = 'report/Post'
  const leaveData = packageParams({
    Phone: store.getters.phone,
    Content: leaveMsg.value,
    DeviceType: 4,
  })
  await homeApi
    .Request(leaveUrl, leaveData, 2, 'post')
    .then((res) => {
      if (res.isSuccess) {
        ElMessage.success('已成功反馈')
        leaveMsg.value = ''
      } else {
        ElMessage.error('留言失败')
      }
    })
    .catch((err) => {
      ElMessage.error('留言失败' + err)
    })
  leaveLoading.value = false
}
const onFullClick = () => {
  onClosePopup()
}

// 监听窗口高度设置“用户留言”弹框的样式
const changeLeaveClass = (e) => {
  if (e.target.innerHeight < 1800) {
    leaveClass.value = 'leaveClass'
  } else {
    leaveClass.value = ''
  }
}
// 监听 Esc：关闭弹框
const handleKeyup = (e) => {
  if (e.keyCode == 27) {
      showPopup.value ? onClosePopup() : ''
  }
}
onMounted(() => {
  window.addEventListener('resize', changeLeaveClass)
  window.addEventListener('keyup', handleKeyup)
  changeLeaveClass({ target: { innerHeight: window.innerHeight } })
})
onUnmounted(() => {
  window.removeEventListener('resize', changeLeaveClass)
  window.removeEventListener('keyup', handleKeyup)
})
</script>

<template>
  <div v-if="!isVip" class="float-btns-box columnFlex disabled">
    <div
      class="float-btns-item flexCenter"
      :class="[
        showPopup && item.id == selectId ? 'float-btns-item_selected' : '',
      ]"
      v-for="item in btnList"
      :key="item.id"
    >
      <div
        v-if="!item.icon"
        class="float-btns-item-value pointer"
        @click="onClick(item.id)"
      >
        {{ item.name }}
      </div>
      <el-icon
        v-else
        class="float-btns-item-icon pointer"
        @click="onClick(item.id)"
      >
        <component :is="item.icon" />
      </el-icon>
      <div
        v-if="showPopup && item.id == 0 && selectId == 0"
        class="popup-box popup-box-QRCode columnFlex"
      >
        <img
          class="popup-box-close pointer"
          :src="closeIcon"
          alt=""
          @click.stop="onClosePopup"
        />
        <img
          class="popup-box-QRCode-img"
          style="width: 100px; margin-bottom: 10px"
          :src="require('@/assets/images/download_qrcode.png')"
          alt=""
        />
        <div class="popup-box-QRCode-tip">扫码下载/打开问真八字</div>
        <div class="popup-box-QRCode-tip">在手机上继续排盘八字</div>
      </div>
      <div
        v-if="showPopup && item.id == 1 && selectId == 1"
        class="popup-box popup-box-leave columnFlex"
        :class="[leaveClass]"
      >
        <img
          class="popup-box-close pointer"
          :src="closeIcon"
          alt=""
          @click.stop="onClosePopup"
        />
        <div class="popup-box-leave-title">问真八字</div>
        <el-input
          class="popup-box-leave-textarea"
          v-model="leaveMsg"
          :rows="10"
          type="textarea"
          resize="none"
          placeholder="如果您对问真八字有什么问题，请留言！我们会积极改进！"
        />
        <el-button
          class="popup-box-leave-btn"
          :loading="leaveLoading"
          round
          @click="onLeave"
        >
          提交反馈
        </el-button>
      </div>
      <div
        v-if="showPopup && item.id == 2 && selectId == 2"
        class="popup-box popup-box-QRCode columnFlex"
      >
        <img
          class="popup-box-close pointer"
          :src="closeIcon"
          alt=""
          @click.stop="onClosePopup"
        />
        <img
          class="popup-box-QRCode-img"
          style="width: 100px"
          :src="randomQrCodeSrc"
          alt=""
        />
        <div class="popup-box-QRCode-tip">微信扫码添加客服</div>
      </div>
    </div>
  </div>
  <div v-else class="float-btns-box disabled">
    <div
      class="float-btns-item2"
      :style="{ 'z-index': showPopup && 4 == selectId ? 1001 : 0 }"
    >
      <span class="pointer" style="pointer-events: auto" @click="onClick(4)">
        支付遇到问题
      </span>
      <div
        v-if="showPopup && selectId == 4"
        class="popup-box popup-box-QRCode columnFlex"
      >
        <img
          class="popup-box-close pointer"
          :src="closeIcon"
          alt=""
          @click.stop="onClosePopup"
        />
        <div class="popup-box-QRCode-title">把您的问题告诉我们</div>
        <img
          class="popup-box-QRCode-img"
          :src="randomQrCodeSrc"
          alt=""
        />
        <div class="popup-box-QRCode-tip">微信扫码添加客服</div>
      </div>
    </div>
  </div>
  <div class="shadowMask" v-if="showPopup" @click="onFullClick"></div>
</template>

<style scoped lang="scss">
.float-btns-box {
  flex-wrap: wrap;
  .float-btns-item {
    position: relative;
    box-sizing: content-box;
    width: 35px;
    height: 35px;
    margin-bottom: 3px;
    padding: 3px;
    color: #505050;
    border-radius: 5px;
    background-color: white;
    .float-btns-item-value {
      font-size: 12px;
      pointer-events: auto;
    }
    .float-btns-item-icon {
      font-size: 16px;
      pointer-events: auto;
    }
    // &:first-child {
    //   color: white;
    //   background-color: #a98d55;
    // }
  }
  .float-btns-item_selected {
    color: #505050 !important;
    font-weight: bold;
    background-color: white !important;
    z-index: 1001;
  }
  .float-btns-item2 {
    position: relative;
    box-sizing: content-box;
    width: 35px;
    padding: 5px;
    line-height: 18px;
    font-size: 12px;
    border-radius: 5px;
    background-color: white;
    pointer-events: auto;
  }
}
.popup-box {
  position: absolute;
  top: 0;
  right: 60px;
  justify-content: center;
  align-items: center;
  padding: 20px;
  padding-top: 42px;
  border-radius: 15px;
  background-color: white;
  z-index: 1001;
}
.popup-box-close {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 5px 8px;
  width: 25px;
  opacity: 0.5;
  pointer-events: auto;
}
.popup-box-QRCode {
  color: #656565;
  font-weight: normal;
  .popup-box-QRCode-title {
    margin-bottom: 5px;
    white-space: nowrap;
    color: $mainColor;
    font-size: 14px;
  }
  .popup-box-QRCode-img {
    width: 120px;
  }
  .popup-box-QRCode-tip {
    line-height: 16px;
    white-space: nowrap;
    font-size: 12px;
  }
}
.popup-box-leave {
  box-sizing: content-box;
  width: 400px;
  color: #101010;
  font-weight: normal;
  .popup-box-leave-title {
    color: rgba(16, 16, 16, 100);
    font-size: 22px;
  }
  .popup-box-leave-textarea {
    margin: 20px 26px 0;
    pointer-events: auto;
  }
  .popup-box-leave-btn {
    width: 370px;
    height: 35px;
    border-radius: 30px;
    color: rgba(255, 255, 255, 100);
    font-size: 14px;
    font-weight: bold;
    background-color: rgba(178, 149, 93, 100);
    margin-top: 20px;
  }
}
.leaveClass {
  top: auto;
  bottom: 0;
}

:deep(.el-button) {
  width: 100%;
  height: 38px;
  color: white;
  font-size: 14px;
  border: none;
  background-color: $mainColor;
  pointer-events: auto;
  &:hover {
    color: white;
    background-color: #a98d55;
  }
  &:active,
  &:focus {
    color: white;
    background-color: $mainColor;
  }
}

:deep(.el-textarea__inner) {
  padding: 20px 19px;
}
</style>