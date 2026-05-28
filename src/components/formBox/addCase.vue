<template>
  <div class="fixedCenter add-popup" @click="onFullClick">
    <div
      class="add-box"
      :style="{ width: containerWidth + 'px', height: containerHeight + 'px' }"
      @click.stop
    >
      <el-icon class="close-icon pointer" @click="onClose">
        <CloseBold />
      </el-icon>
      <div class="add-header">
        <div class="add-header-title">排盘记录</div>
        <Search class="add-search" :showDel="false" @onSearch="onSearch" />
      </div>
      <el-scrollbar :height="scrollbarHeight + 'px'">
        <div
          style="width: 100%; margin: 0; padding: 0"
          v-infinite-scroll="loadMore"
          infinite-scroll-delay="500"
          infinite-scroll-distance="10"
        >
          <CardBZ
            :list="currentUserList"
            :columns="1"
            :maxSize="20"
            @onDetail="onDetail"
          />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  defineEmits,
  reactive,
  watch,
  onMounted,
  onUnmounted,
} from 'vue'
import store from '@/store'
import { handleUserListItem } from '@/utils'
import Search from '@/components/searchBox'
import CardBZ from '@/components/bzCardBox'
import * as homeApi from '@/api/home-api'

const emits = defineEmits(['onClose', 'onDetail', 'onFullClick'])
const guid = computed(() => store.getters.userguid)
const allUserList = computed(() => store.getters.userList)
const currentUserList = reactive([])
let pageIndex = 0,
  pageCount = 20

// 关闭弹框
const onClose = () => {
  emits('onClose')
}
// 搜索
const onSearch = (text) => {
  currentUserList.length = 0
  currentUserList.push(
    ...allUserList.value.filter((item) => item.name.indexOf(text) > -1),
  )
}
// 监听项
const onDetail = (item) => {
  emits('onDetail', item)
}
// 滚动加载更多
const loadMore = () => {
  console.log('loadMore', currentUserList.length, allUserList.value.length)
  if (currentUserList.length >= allUserList.value.length) return
  currentUserList.push(
    ...allUserList.value.slice(pageIndex * pageCount, ++pageIndex * pageCount),
  )
}
const onFullClick = () => {
  emits('onFullClick')
}
// 初始化
const init = async () => {
  if (!guid.value) return
  if (!allUserList.value || allUserList.value.length == 0) {
    let url1 = 'User/SubUser2?'
    let parms1 = `userGuid=${guid.value}`
    await homeApi.Request(url1, parms1, 1).then(async (res) => {
      const list = res.data.items[0].userList.items
      //加上天干地支
      list.forEach(handleUserListItem)
      await store.dispatch('paipan/setUserList', list)
      loadMore()
    })
  }
}

init()

const containerWidth = ref(800),
  containerHeight = ref(800),
  scrollbarHeight = ref(620)
const handleChangeClient = (e) => {
  const innerWidth = e.target.innerWidth,
    innerHeight = e.target.innerHeight
  if (innerWidth < 800) {
    containerWidth.value = innerWidth - 20
  } else if (innerWidth > 1600) {
    containerWidth.value = Math.floor(innerWidth / 2)
  } else {
    containerWidth.value = 800
  }
  if (innerHeight < 800) {
    containerHeight.value = innerHeight - 20
  } else if (innerHeight > 1600) {
    containerHeight.value = Math.floor(innerHeight / 2)
  } else {
    containerHeight.value = 800
  }
  scrollbarHeight.value = containerHeight.value - 180
}

onMounted(() => {
  window.addEventListener('resize', handleChangeClient)
  handleChangeClient({
    target: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', handleChangeClient)
})

watch(
  allUserList,
  () => {
    pageIndex = 0
    currentUserList.length = 0
    loadMore()
  },
  { deep: true, immediate: true },
)
</script>

<style lang="scss" scoped>
.add-popup {
  background-color: $shadowBg;
  z-index: 1001;
  .add-box {
    position: relative;
    min-width: 200px;
    min-height: 200px;
    padding: 0 90px;
    border-radius: 15px;
    background-color: white;
    .close-icon {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 38px;
      height: 38px;
      font-size: 18px;
    }
    .add-header {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      height: 95px;
      margin-bottom: 46px;
      border-bottom: 1px solid rgba(187, 187, 187, 0.28);
      .add-header-title {
        position: absolute;
        bottom: 0;
        width: 143px;
        padding-bottom: 16px;
        color: rgba(178, 149, 93, 100);
        font-size: 16px;
        text-align: center;
        border-bottom: 3px solid #b2955d;
      }
      .add-search {
        position: absolute;
        bottom: 10px;
        right: 0;
        width: 70%;
        max-width: 800px;
      }
    }
    .add-content {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  }
}
:deep(.el-input__wrapper) {
  height: 47px;
  box-shadow: none;
}
:deep(.bz-list) {
  padding-bottom: 0;
}
</style>
