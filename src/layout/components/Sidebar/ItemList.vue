<template>
  <div class="item-list-box">
    <!-- 导航栏 -->
    <div
      class="sidebar-item pointer"
      :class="{ 'item-selected': index == routeIndex }"
      v-for="(item, routeIndex) in routes"
      :key="item.path"
      @click="onPath(item.path, routeIndex)"
    >
      {{ item.title }}
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { navigationRoutes } from '@/router'
import store from '@/store'
import { navigationTo } from '@/utils'
import { Toast } from 'vant'
let vipUpdateCode = 2
// 扁平化路由对象并存储到vuex
const routes = reactive([])
const filterRoutes = (list) => {
  const res = []
  list.forEach((route) => {
    let tem = []
    if (route.children) {
      filterRoutes(route.children).forEach((item) => {
        const newRoute = {
          path: route.path + '/' + item.path,
          title: item.meta.title,
        }
        tem.push(newRoute)
      })
    } else {
      tem.push({ ...route })
    }
    res.push(...tem)
  })
  return res
}
const filterRoutesFunc = async (list) => {
  routes.push(...filterRoutes(list))
  await store.dispatch('page/setSidebarRoutes', routes)
}
filterRoutesFunc(navigationRoutes)

// 初始化路由跳转
const route = useRoute()
navigationTo({ path: route.path, params: route.query })

// 获取当前路由索引
const index = computed(() => store.getters.sidebarIndex)

// 监听导航栏
const onPath = (path, routeIndex) => {
  //Toast(path + "____" + routeIndex)
  if (routeIndex == index.value && path != '/vip-page/index') return
  if(path == '/vip-page/index') {
    vipUpdateCode = vipUpdateCode ^ 1
    let params = {
      updateCode: vipUpdateCode,
    }
    navigationTo({ path, params})
  } else {
    navigationTo({ path })
  }
  
}

// 监听主内容宽度动态改变导航栏边距
const marginRight = ref(0)
const guid = computed(() => store.getters.userguid) // 用于判断是否登录
const handlePlace = (e) => {
  const innerWidth = e.target.innerWidth
  const distance =
    (innerWidth - store.getters.appMainWidth) / 2 - (guid.value ? 92 : 150)
  if (distance > 30) {
    marginRight.value = distance
  } else {
    marginRight.value = 30
  }
}
onMounted(() => {
  window.addEventListener('resize', handlePlace)
  setTimeout(() => {
    handlePlace({ target: { innerWidth: window.innerWidth } })
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', handlePlace)
})
</script>

<style scoped lang="scss">
.item-list-box {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  .sidebar-item {
    box-sizing: border-box;
    flex: 1;
    max-width: 159px;
    padding: 5px;
    color: $sidebarUnselected;
    font-size: 18px;
    text-align: center;
    white-space: nowrap;
    &:hover {
      color: $mainColor;
    }
    &:first-child {
      margin-left: 0;
    }
  }
  .item-selected {
    position: relative;
    color: $mainColor;
    font-weight: bold;
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      right: calc(50% - 11.5px);
      width: 23px;
      height: 2px;
      background-color: $mainColor;
    }
  }
}
</style>
