<template>
  <div
    class="container"
    :class="{ fixedCenter: isCenter }"
    @click="onFullClick"
  >
    <div
      class="popup-box"
      :style="{
        width: width + 'px',
        height: height + 'px',
        left: left + 'px',
        right: right + 'px',
        'border-radius': borderRadius + 'px',
        'background-color': isTransparent ? 'transparent' : 'white',
      }"
      @click.stop
    >
      <img
        v-if="isClose"
        class="popup-close pointer"
        :src="closeIcon"
        alt=""
        @click="onClose"
      />
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const emits = defineEmits(['onClose', 'onFullClick'])
const props = defineProps({
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 320,
  },
  isCenter: {
    type: Boolean,
    default: true,
  },
  left: {
    type: Number,
    default: 0,
  },
  right: {
    type: Number,
    default: 0,
  },
  borderRadius: {
    type: Number,
    default: 30,
  },
  isClose: {
    type: Boolean,
    default: false,
  },
  isTransparent: {
    type: Boolean,
    default: false,
  },
})
const closeIcon = require('@/assets/images/close_icon.png')

const onClose = () => {
  emits('onClose')
}

const onFullClick = () => {
  emits('onFullClick')
}
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $shadowBg;
  z-index: 999;
  .popup-box {
    position: relative;
    padding: 30px;
    .popup-close {
      position: absolute;
      top: 5px;
      right: 5px;
      padding: 5px;
      width: 30px;
      opacity: 0.5;
    }
  }
}
</style>
