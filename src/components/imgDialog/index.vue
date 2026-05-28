<template>
  <div class="img-dialog-root">
    <div class="img-dialog-title-bar">
      <div class="img-dialog-title">{{ title }}</div>
      <img
        @click="onClose"
        class="icon_close"
        :src="iconClose"
        alt="关闭按钮"
      />
    </div>
    <div class="img-container">
      <img class="img" :src="imgUrl" alt="关闭弹窗" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const iconClose = require('@/assets/images/icon_close.png')
const emit = defineEmits(['close'])

const onClose = () => {
  emit('close')
}

defineProps({
  title: {
    type: String,
    default: '弹窗标题',
  },
  imgUrl: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped>
.img-dialog-root {
  position: relative;
  background-color: #ffffff;
  border-radius: 15px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .img-dialog-title-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 54px;
    position: relative;
    background-color: #eeeeee;

    .img-dialog-title {
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
  .img-container {
    width: 100%;
    height: calc(100% - 54px);
    overflow: auto;

    .img {
      width: calc(100% - 40px);
      margin: 20px auto;
    }
  }
}
</style>
