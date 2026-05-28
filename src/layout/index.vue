<template>
  <div class="layout-root">
    <Sidebar />
    <AppMain />
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar'
import AppMain from './AppMain.vue'
</script>

<style scoped lang="scss">
.layout-root {
  min-height: 100vh;
}
</style>
