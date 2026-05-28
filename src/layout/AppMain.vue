<template>
  <div class="app-main" ref="appMain" v-loading="appMainLoading">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <div
      class="float-btns-container"
      style="position: fixed; top: 73vh; z-index: 996"
      :style="{ left: floatBtnsLeft + 'px' }"
    >
      <FloatBtns v-if="showFloat" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import store from '@/store'
import FloatBtns from './components/FloatBtns'
import { navigationTo } from '@/utils'

const route = useRoute()
const showFloat = ref(true)
const floatBtnsLeft = ref(0)
const appMainLoading = computed(() => store.getters.appMainLoading)
let isHome = false // 是否首页
let windowWidth = 0

watch(
  () => route.path,
  (path) => {
    if (path.search(/(paipan-result)|(hepan-result)/g) > -1) {
      showFloat.value = false
    } else {
      showFloat.value = true
      navigationTo({ path, params: {}, next: false })
    }
  },
  { immediate: true },
)

// 主内容宽度
const appMain = ref(null)

const onHandleOffset = async (e) => {
  const innerWidth = e.target.innerWidth
  if (windowWidth != innerWidth) {
    if (innerWidth > 1355) {
      floatBtnsLeft.value = (innerWidth - 1230) / 2 + 1230 + 4
    } else {
      floatBtnsLeft.value = innerWidth - 60
    }
    windowWidth = innerWidth
  }

  // 获取主内容宽度
  let appMainWidth = appMain.value.children[0].clientWidth
  if (route.name === 'Record') {
    appMainWidth = appMain.value.children[0].children[0].clientWidth
  }
  await store.dispatch('page/setAppMainWidth', appMainWidth)
}

onMounted(() => {
  window.addEventListener('resize', onHandleOffset)
  onHandleOffset({ target: { innerWidth: window.innerWidth } })
})
onUnmounted(() => {
  window.removeEventListener('resize', onHandleOffset)
})
</script>

<style scoped lang="scss">
.app-main {
  position: relative;
  top: calc($sidebarHeight + 1px);
  left: 0;
  right: 0;
  margin: 0 auto;
  padding: 15px 0;
  font-family: Roboto;
  border-radius: 15px;
  ::-webkit-scrollbar {
    width: 10px;
    height: 5px;
  }
  :hover::-webkit-scrollbar-thumb {
    border-radius: 30px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #dedfe1;
  }
}
</style>
