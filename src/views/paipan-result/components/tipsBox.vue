<template>
  <div class="tips-box fixedCenter" @click="onFullClick">
    <div class="tips-container columnFlex" @click.stop>
      <img
        class="tips-close-icon pointer"
        :src="require('@/assets/images/close_icon.png')"
        alt="关闭按钮"
        @click="onClose"
      />
      <!-- 天干提示 -->
      <div class="tips-tg-box hiddenScrollbar">
        <div
          class="tips-row"
          v-for="(item, gzindex) in gzchat[0]"
          :key="'gztips1_1_' + gzindex"
        >
          <div
            class="tips-row-line"
            :style="{
              'margin-left':
                (100 / gztipsTitleArr.length) * item[2] +
                100 / gztipsTitleArr.length / 2 +
                '%',
              width: (100 / gztipsTitleArr.length) * item[3] + '%',
            }"
          ></div>
          <div
            class="tips-row-relation"
            :style="{
              'margin-left':
                (100 / gztipsTitleArr.length) * item[2] +
                100 / gztipsTitleArr.length / 2 +
                '%',
              width: (100 / gztipsTitleArr.length) * item[3] + '%',
            }"
          >
            {{ item[1] }}
          </div>
          <div
            class="tips-row-value"
            v-for="(content, gzindex1) in item[0]"
            :key="'gztips1_2_' + gzindex1"
            :style="{
              left:
                (100 / gztipsTitleArr.length) * content[0] +
                100 / gztipsTitleArr.length / 2 +
                '%',
            }"
          >
            {{ content[1] }}
          </div>
        </div>
      </div>

      <!-- 年月日时柱 -->
      <div class="tips-title-box">
        <div
          class="tips-title-item"
          v-for="item in gztipsTitleArr"
          :key="item"
          :style="{
            width: 100 / gztipsTitleArr.length + '%',
          }"
        >
          <label style="color: #999999; font-size: 18px">
            {{ item }}
          </label>
        </div>
        <!-- 天干 -->
        <div
          class="tips-title-item"
          v-for="(item, ganindex) in gztipsGanArr"
          :key="'gztips2_1_' + ganindex"
          :style="{
            width: 100 / gztipsGanArr.length + '%',
          }"
        >
          <label :class="[getClassOfWx(getWxOfGz(item))]">
            {{ item }}
          </label>
        </div>
        <!-- 地支 -->
        <div
          class="tips-title-item"
          v-for="(item, ziindex) in gztipsZhiArr"
          :key="'gztips2_2_' + ziindex"
          :style="{
            width: 100 / gztipsZhiArr.length + '%',
          }"
        >
          <label :class="[getClassOfWx(getWxOfGz(item))]">
            {{ item }}
          </label>
        </div>
      </div>

      <!-- 地支提示 -->
      <div class="tips-dz-box hiddenScrollbar">
        <div
          class="tips-row"
          v-for="(item, gzindex) in gzchat[1]"
          :key="'gztips3_1_' + gzindex"
        >
          <div
            class="tips-row-line"
            :style="{
              'margin-left':
                (100 / gztipsTitleArr.length) * item[2] +
                100 / gztipsTitleArr.length / 2 +
                '%',
              width: (100 / gztipsTitleArr.length) * item[3] + '%',
            }"
          ></div>
          <div
            class="tips-row-relation"
            :style="{
              'margin-left':
                (100 / gztipsTitleArr.length) * item[2] +
                100 / gztipsTitleArr.length / 2 +
                '%',
              width: (100 / gztipsTitleArr.length) * item[3] + '%',
            }"
          >
            {{ item[1] }}
          </div>
          <div
            class="tips-row-value"
            v-for="(content, gzindex1) in item[0]"
            :key="'gztips3_2_' + gzindex1"
            :style="{
              'margin-left':
                (100 / gztipsTitleArr.length) * content[0] +
                100 / gztipsTitleArr.length / 2 +
                '%',
            }"
          >
            {{ content[1] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, onUnmounted } from 'vue'
import { getWxOfGz, getClassOfWx } from '@/utils'

defineProps({
  gzchat: {
    type: Array,
    require: true,
  },
  gztipsTitleArr: {
    type: Array,
    require: true,
  },
  gztipsGanArr: {
    type: Array,
    require: true,
  },
  gztipsZhiArr: {
    type: Array,
    require: true,
  },
})
const emits = defineEmits(['onClose'])

// 关闭按钮
const onClose = () => {
  emits('onClose')
}
const onFullClick = () => {
  onClose()
}
// 初始化
const init = () => {}

init()

// 监听 Esc：关闭弹框
const handleKeyup = (e) => {
  if (e.keyCode == 27) {
      onClose()
  }
}

onMounted(() => {
  window.addEventListener('keyup', handleKeyup)
})
onUnmounted(() => {
  window.removeEventListener('keyup', handleKeyup)
})
</script>

<style lang="scss" scoped>
.tips-box {
  background-color: $shadowBg;
  z-index: 999;
  .tips-container {
    position: relative;
    width: 50%;
    min-width: 800px;
    height: 800px;
    border-radius: 15px;
    background-color: white;
    .tips-close-icon {
      position: absolute;
      top: 5px;
      right: 5px;
      box-sizing: content-box;
      width: 26px;
      padding: 5px;
      opacity: 0.5;
    }
    .tips-tg-box,
    .tips-dz-box {
      width: 100%;
      overflow-y: auto;
    }
    .tips-tg-box {
      height: 25%;
      margin-top: 48px;
    }
    .tips-dz-box {
      height: 52%;
    }
    .tips-row {
      position: relative;
      height: 50px;
      margin-top: 10px;
    }
    .tips-row-line {
      position: absolute;
      top: 55%;
      height: 1px;
      background-color: #aaaaaa;
      z-index: 990;
    }
    .tips-row-relation {
      position: absolute;
      top: -5px;
      white-space: nowrap;
      font-size: 14px;
      z-index: 991;
    }
    .tips-row-value {
      position: absolute;
      top: 12.1875px;
      font-size: 16px;
      padding: 5px;
      transform: translateX(-50%);
      border: solid 0.1125px #aaaaaa;
      border-radius: 50%;
      background: #ffffff;
      z-index: 999;
    }
    .tips-title-box {
      margin: 5px 0;
      .tips-title-item {
        float: left;
        line-height: 40px;
        text-align: center;
        font-size: 28px;
      }
    }
  }
}
</style>
