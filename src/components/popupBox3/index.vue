<template>
  <div class="popup-box3-root" :style="{ width: width, height: height,top: `calc(50% - ${height}/2)`,left: `calc(50% - ${width}/2)`}">
    <slot></slot>
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
  //遮罩层是否可点击关闭;默认不可关闭
  isMaskClose: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '950px',
  },
  height: {
    type: String,
    default: '72%',
  },
})
</script>

<style lang="scss" scoped>
.popup-box3-root {
  position: fixed;
  background-color: #ffffff;
  border-radius: 15px;
  overflow: hidden;
  //op: 14%;
  //   height: 72%;
  margin: auto;
  overflow: hidden;
  z-index: 9999;
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
