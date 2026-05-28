<template>
  <div id="container-popup" class="container hiddenScrollbar" @scroll="handleScroll">
    <Logo />
    <div
      style="
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      "
    >
      <ItemList />
      <EntryH5 :obj="enteryObj" style="margin-right: 20px; zoom: 90%" />
      <Avatar :scrollLeft="scrollLeft" />
    </div>
  </div>
  <div class="mask" @click="clickMask"></div>
</template>

<script setup>
import Logo from './Logo'
import ItemList from './ItemList'
import Avatar from './Avatar'
import EntryH5 from './EntryH5'
import store from '@/store'
import { ref } from 'vue'
const enteryObj = ref({
  text: '切换手机版',
  icon: require('@/assets/images/icon_change.svg'),
  routeName: 'WindowPhone',
  urlTag: 'h5_home',
})
const clickMask = async () => {
  return
  await store.dispatch('page/updateClickMask', true)
  setTimeout(async () => {
    store.dispatch('page/updateClickMask', false)
  }, 0)
}

let scrollLeft = ref(0)

const handleScroll = (e) => {
  scrollLeft.value = e.target.scrollLeft
  console.log('scroll',e.target.scrollLeft)
}

</script>

<style scoped lang="scss">
.container {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: $sidebarHeight;
  background-color: $sidebarBg;
  z-index: 999;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 114px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: var(--maskDisplay1);
}
</style>
