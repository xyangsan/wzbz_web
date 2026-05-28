<template>
  <div class="placeholder-page">
    <h1>排盘首页</h1>
    <div class="actions">
      <button type="button" class="primary pointer" @click="navigationTo({ path: '/paipan/index' })">
        八字排盘
      </button>
      <button type="button" class="secondary pointer" @click="navigationTo({ path: '/hepan/index' })">
        八字合盘
      </button>
    </div>
  </div>
</template>

<script setup>
import { navigationTo } from '@/utils'
</script>

<style scoped lang="scss">
.placeholder-page {
  max-width: 960px;
  min-height: 360px;
  margin: 0 auto;
  padding: 64px 24px;
  border-radius: 12px;
  background: #fff;
}

h1 {
  margin: 0 0 24px;
  font-size: 28px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

button {
  min-width: 120px;
  height: 40px;
  border: 1px solid $mainColor;
  border-radius: 20px;
  font-size: 14px;
}

.primary {
  background: $mainColor;
  color: #fff;
}

.secondary {
  background: #fff;
  color: $mainColor;
}
</style>
