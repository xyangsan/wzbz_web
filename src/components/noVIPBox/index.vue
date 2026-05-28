<template>
  <div class="no-vip-box-root">
    <div class="no-vip-box">
      <img
        v-if="closeIcon"
        class="close pointer"
        :src="closeIcon"
        alt=""
        @click="emit('onClose')"
      />
      <div v-if="title" class="title">{{ title }}</div>
      <div class="content">{{ content }}</div>
      <button class="button pointer" type="button" @click="handleClick">
        {{ btnText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'
import { navigationTo } from '@/utils'

defineProps({
  title: {
    type: String,
    default: '会员功能',
  },
  content: {
    type: String,
    default: '成为会员后可使用该功能',
  },
  btnText: {
    type: String,
    default: '开通会员',
  },
  closeIcon: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['onClose'])

const handleClick = () => {
  navigationTo({ path: 'vip-page' })
}
</script>

<style scoped lang="scss">
.no-vip-box-root {
  position: fixed;
  inset: 0;
  z-index: 1002;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);
}

.no-vip-box {
  position: relative;
  width: min(360px, calc(100vw - 40px));
  padding: 28px 24px 24px;
  border-radius: 12px;
  background: #fff;
  text-align: center;
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.16);
}

.close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 18px;
  height: 18px;
}

.title {
  margin-bottom: 12px;
  color: #101010;
  font-size: 18px;
  font-weight: 600;
}

.content {
  color: #555;
  font-size: 14px;
  line-height: 1.6;
}

.button {
  min-width: 150px;
  height: 40px;
  margin-top: 22px;
  border: 0;
  border-radius: 22px;
  background: linear-gradient(91.34deg, #c68d56 0.25%, #844f15 100.46%);
  color: #fff;
  font-size: 14px;
}
</style>
