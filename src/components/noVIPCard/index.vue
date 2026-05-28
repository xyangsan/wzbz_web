<template>
  <div
    class="no-vip-card-root pointer"
    :style="{ width: widthValue }"
    @click="handleClick"
  >
    <div class="no-vip-card-content">{{ content }}</div>
    <div class="no-vip-card-button">开通会员解锁</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { navigationTo } from '@/utils'

defineProps({
  content: {
    type: String,
    default: '提示内容',
  },
  widthValue: {
    type: String,
    default: '100%',
  },
})

const handleClick = () => {
  navigationTo({ path: 'vip-page' })
}
</script>

<style lang="scss" scoped>
.no-vip-card-root {
  position: relative;
  background-color: #fff;
  border: 1px solid #bbbbbb;
  height: auto !important;
  font-size: 14px;
  margin: 30px auto auto;
  padding: 24px 30px;
  border-radius: 15px;
  text-align: center;

  .no-vip-card-content {
    margin: 0 auto;
    margin-bottom: 20px;
    color: #101010;
    line-height: 1.2;
  }

  .no-vip-card-button {
    width: 166px;
    height: 42px;
    line-height: 42px;
    border-radius: 24px;
    background: linear-gradient(
      91.34deg,
      rgba(198, 141, 86, 1) 0.25%,
      rgba(132, 79, 21, 1) 100.46%
    );
    color: #fff;
    margin: 0 auto;
  }
}
</style>
