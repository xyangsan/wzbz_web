<template>
  <div class="popup-box2-root">
    <div class="popup-box2-title-bar">
      <div class="popup-box2-title">{{ title }}</div>
      <img
        @click.stop="onClose(true)"
        class="icon_close"
        :src="iconClose"
        alt="关闭按钮"
      />
    </div>
    <div class="box">
      <slot></slot>
    </div>
  </div>
  <div class="mask" @click.stop="onClose(isMaskClose)"></div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const iconClose = require('@/assets/images/icon_close.png')
const emit = defineEmits(['close'])

const onClose = (isClose) => {
  if (isClose) emit('close')
}

defineProps({
  title: {
    type: String,
    default: '弹窗标题',
  },
  //遮罩层是否可点击关闭;默认不可关闭
  isMaskClose: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.popup-box2-root {
  position: fixed;
  background-color: #ffffff;
  border-radius: 15px;
  overflow: hidden;
  top: 14%;
  width: 950px;
  //   height: 72%;
  margin: auto;
  overflow: hidden;
  z-index: 9999;

  .popup-box2-title-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 54px;
    position: relative;
    background-color: #eeeeee;

    .popup-box2-title {
      flex: 1;
      font-size: 18px;
      font-weight: bold;
      color: #333333;
    }

    .icon_close {
      width: 14px;
      height: 14px;
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }
  .box {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 25px 24px 24px 19px;
  }
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 8888;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
