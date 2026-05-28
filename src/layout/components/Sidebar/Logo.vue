<template>
  <div class="logo-box">
    <img
      class="logo-img"
      :src="require('@/assets/images/logo.png')"
      alt="logo"
    />
    <span class="logo-title">问真八字</span>
  </div>
</template>
<script setup>
</script>

<style scoped lang="scss">
.logo-box {
  display: flex;
  align-items: center;
  margin-left: 81px;
  text-align: left;
  .logo-img {
    width: 60px;
    margin-right: 20px;
  }
  .logo-title {
    color: rgba(0, 0, 0, 1);
    font-size: 28px;
    font-family: 'SourceHanSerif-semiBold';
    white-space: nowrap;
  }
}
</style>