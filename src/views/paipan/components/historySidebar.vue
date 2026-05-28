<template>
  <div class="history-sidebar">
    <div
      class="history-sidebar-back columnFlex pointer"
      :style="{
        borderBottom: isOpen ? '1px solid rgba(233, 233, 233, 100)' : 'none',
      }"
      @click="onOpen"
    >
      <img
        class="history-sidebar-back-icon"
        :src="isOpen ? leftIcon : rightIcon"
        alt=""
      />
      <div class="history-sidebar-back-value">历史</div>
      <div class="history-sidebar-back-value">记录</div>
    </div>
    <transition name="fade">
      <ul class="history-sidebar-list hiddenScrollbar" v-show="isOpen">
        <li
          class="history-sidebar-list-item columnFlex pointer"
          v-for="item in listDatas"
          :key="item.guid"
          :title="item.name"
          @click="onToPaipan(item)"
        >
          <div class="history-sidebar-list-item-flag">
            {{ item.name.slice(-1) }}
          </div>
          <div class="history-sidebar-list-item-value">{{ item.name.length>3?`${item.name.slice(0,3)}...`:item.name }}</div>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import store from '@/store'
import { navigationTo } from '@/utils'
import params from '@/utils/params'

// 历史记录按钮相关逻辑
const leftIcon = require('@/assets/images/left_round_black_icon.png'),
  rightIcon = require('@/assets/images/right_round_black_icon.png')
const isOpen = ref(false)
const onOpen = () => {
  isOpen.value = !isOpen.value
}

// 历史记录列表
const listDatas = computed(() => store.getters.userList.slice(0, 8))
const onToPaipan = (item) => {
  let obj = params.userToPaiPan(item)
  navigationTo({ path: 'paipan-result', params: obj })
}
</script>

<style lang="scss" scoped>
.history-sidebar {
  position: fixed;
  left: 0;
  top: 163px;
  width: 81px;
  height: calc(100vh - 180px);
  max-height: 877px;
  padding-bottom: 1px;
  border-radius: 0px 15px 15px 0px;
  overflow: hidden;
  .history-sidebar-back {
    position: relative;
    justify-content: flex-start;
    align-items: center;
    box-sizing: content-box;
    width: 100%;
    height: 82px;
    padding-top: 16px;
    background-color: rgba(255, 255, 255, 100);
    z-index: 1;
    .history-sidebar-back-icon {
      width: 36px;
      height: 36px;
    }
    .history-sidebar-back-value {
      color: rgba(36, 36, 36, 100);
      font-size: 16px;
    }
  }
  .history-sidebar-list {
    width: 100%;
    height: calc(100% - 82px);
    background-color: rgba(255, 255, 255, 100);
    overflow-y: auto;
    .history-sidebar-list-item {
      align-items: center;
      width: 100%;
      margin-bottom: 20px;
      .history-sidebar-list-item-flag {
        width: 50px;
        height: 50px;
        margin-bottom: 5px;
        line-height: 50px;
        text-align: center;
        color: rgba(251, 230, 137, 100);
        font-size: 18px;
        border: 1px solid #fbe689;
        border-radius: 50%;
        background-color: black;
      }
      .history-sidebar-list-item-value {
        color: rgba(16, 16, 16, 100);
        font-size: 14px;
      }
      &:first-child {
        margin-top: 16px;
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.8s;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
