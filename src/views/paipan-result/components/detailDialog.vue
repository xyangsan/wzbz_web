<template>
  <div class="detail-dialog-box fixedCenter" @click="onFullClick">
    <div
      class="detail-dialog-container"
      :style="{ width: containerWidth + 'px', height: containerHeight + 'px' }"
      @click.stop
    >
      <div class="title-box">
        <div class="title-box-name">{{ keyName }}</div>
        <img
          class="title-box-close pointer"
          :src="closeIcon"
          alt="关闭按钮"
          @click="onClose"
        />
      </div>
      <div class="content-box" :style="{ height: contentHeight + 'px' }">
        <div
          class="content-item"
          v-for="(item, index) in itemList"
          :key="index"
        >
          <div class="content-item-title">{{ item.title }}</div>
          <div class="content-item-value" v-html="item.content"></div>
        </div>
        <!-- 跳转链接 -->
        <div
          class="content-link pointer"
          v-if="keyType == typeNameList[1]"
          @click="onToPath('zhangsheng')"
        >
          {{ `\{\{查看更多十二长生文章\}\}` }}
        </div>
        <div
          class="content-link pointer"
          v-if="keyType == typeNameList[3]"
          @click="onToPath('shensha')"
        >
          查看更多神煞文章 &gt;
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  defineProps,
  defineEmits,
  reactive,
  onMounted,
  onUnmounted,
} from 'vue'
import { useRouter } from 'vue-router'
import { ShiShenTips, ZhangShengTips, NaYinTips } from '../static'
import { ShenShaTips } from '@/utils/static'

const router = useRouter()
const props = defineProps({
  keyType: {
    type: String,
    require: true,
  },
  keyName: {
    type: String,
    require: true,
  },
})
const emits = defineEmits(['onClose'])
const itemList = reactive([])
const closeIcon = require('@/assets/images/close_icon.png')
const typeNameList = ['shishen', 'zhangsheng', 'nayin', 'shensha']

// 关闭按钮
const onClose = () => {
  emits('onClose')
}
const onFullClick = () => {
  onClose()
}
// 跳转文章
const onToPath = (path) => {
  switch (path) {
    case 'zhangsheng':
      window.open(
        'https://bzpp2.iwzbz.com/artical/pcbook/v7/3_1_102_6.html',
        '_blank',
      )
      break
    case 'shensha':
      router.push({
        path: '/book/index',
        query: { id: '3_1', bookId: 3, isBase: true },
      })
      break
  }
}
// 初始化食神
const initShiShen = () => {
  const shishen = ShiShenTips.find((item) => item.name == props.keyName)
  const tip = {
    title: '问真精评',
    content: shishen ? lineFeed(shishen.tip) : '',
  }
  const gujue = {
    title: '古决',
    content: shishen ? lineFeed(shishen.gujue) : '',
  }
  const func = {
    title: '十神功能',
    content: shishen ? lineFeed(shishen.shishen) : '',
  }
  itemList.push(tip, gujue, func)
}
const initZhangSheng = () => {
  const zhangsheng = ZhangShengTips.find((item) => item.name == props.keyName)
  const shijue = {
    title: '诗决',
    content: zhangsheng ? lineFeed(zhangsheng.shijue) : '',
  }
  const chafa = {
    title: '查法',
    content: zhangsheng ? lineFeed(zhangsheng.chafa) : '',
  }
  itemList.push(shijue, chafa)
}
const initNayin = () => {
  const nayin = NaYinTips.find((item) => item.name == props.keyName)
  const tip = {
    title: '问真精评',
    content: nayin ? lineFeed(nayin.tip) : '',
  }
  const book1 = {
    title: '《渊海子平》',
    content: nayin ? lineFeed(nayin.book1) : '',
  }
  const book2 = {
    title: '《三命通会》',
    content: nayin ? lineFeed(nayin.book2) : '',
  }
  const book3 = {
    title: '《李虚中命书》',
    content: nayin ? lineFeed(nayin.book3) : '',
  }
  itemList.push(tip, book1, book2, book3)
}
const initShenSha = () => {
  const shensha = ShenShaTips.find((item) => item.name == props.keyName)
  const tip = {
    title: '问真精评',
    content: shensha ? lineFeed(shensha.tip) : '',
  }
  const gujue = {
    title: '古决',
    content: shensha ? lineFeed(shensha.gujue) : '',
  }
  const chafa = {
    title: '查法',
    content: shensha ? lineFeed(shensha.chafa) : '',
  }
  itemList.push(tip, gujue, chafa)
}
// 将换行符改为<br>
const lineFeed = (content) => {
  const reg = /\n/g
  return content.replace(reg, '<br>')
}
// 初始化
const init = () => {
  // 根据 keyType 进行初始化
  switch (props.keyType) {
    case typeNameList[0]:
      initShiShen()
      break
    case typeNameList[1]:
      initZhangSheng()
      break
    case typeNameList[2]:
      initNayin()
      break
    case typeNameList[3]:
      initShenSha()
      break
    default:
      onClose()
  }
}

init()

const containerWidth = ref(800),
  containerHeight = ref(800),
  contentHeight = ref(720)
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
  contentHeight.value = containerHeight.value - 80
}

// 监听 Esc：关闭弹框
const handleKeyup = (e) => {
  if (e.keyCode == 27) {
      onClose()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleChangeClient)
  window.addEventListener('keyup', handleKeyup)
  handleChangeClient({
    target: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', handleChangeClient)
  window.removeEventListener('keyup', handleKeyup)
})
</script>

<style lang="scss" scoped>
.detail-dialog-box {
  background-color: $shadowBg;
  z-index: 999;
  ::-webkit-scrollbar {
    width: 10px;
    height: 5px;
  }
  :hover::-webkit-scrollbar-thumb {
    border-radius: 30px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #dedfe1;
  }
  .detail-dialog-container {
    position: relative;
    min-width: 200px;
    min-height: 200px;
    border-radius: 15px;
    background-color: white;
    .title-box {
      height: 75px;
      line-height: 75px;
      text-align: center;
      border-radius: 15px 15px 0 0;
      background-color: #f6f6f6;
      .title-box-name {
        font-size: 20px;
        font-weight: bold;
      }
      .title-box-close {
        position: absolute;
        top: 5px;
        right: 5px;
        box-sizing: content-box;
        width: 26px;
        padding: 5px;
        opacity: 0.5;
      }
    }
    .content-box {
      padding: 35px 43px;
      font-size: 16px;
      text-align: left;
      overflow-y: auto;
      .content-item {
        margin-bottom: 20px;
        .content-item-title {
          padding-bottom: 10px;
          font-size: 18px;
          font-weight: bold;
          color: $mainColor;
        }
        .content-item-value {
          line-height: 25px;
          color: #666666;
        }
      }
      .content-link {
        color: $mainColor;
      }
    }
  }
}
</style>
