<template>
  <!-- <div class="smart-book-box" @click="onFullClick"> -->
  <div class="smart-book-container" @click.stop>
    <!-- <div class="title-box">
      <div class="title-box-name">{{ bookData.name }}</div>
      <img
        class="title-box-close pointer"
        :src="require('@/assets/images/close_icon.png')"
        alt="关闭按钮"
        @click="onClose"
      />
    </div> -->
    <div v-if="viplevel < 1 && bookData.id > 2" class="book-container-novip">
      <!-- <div class="book-container-novip-title">{{ bookData.name }}</div> -->
      <div class="book-container-novip-content">{{ content }}</div>
      <img
        class="book-container-novip-img pointer"
        :src="noVipIcon"
        alt="noVipIcon"
        @click="onToVip"
      />
    </div>
    <div style="display: flex; flex-direction: column; flex: 1" v-else>
      <div v-if="bookData.id == 2 && geju" class="book-container-geju">
        <span class="book-container-geju-label">自定格局：</span>
        {{ geju }}
      </div>
      <div class="thys-block" :style="bookData.id == 1 ? '' : 'display:none'">
        <img class="thys-block-icon" alt="提醒图标" :src="tipIcon" @click="openDialog"/>
        <div class="thys-block-title">
          调候用神提示：
          <span class="thys-block-title_span">{{ thysStr }}</span>
        </div>
        <div class="thys-block-tips">
          本八字：
          <span
            :class="[
              item == '透' ? 'thys-block-tips-text1' : 'thys-block-tips-text2',
            ]"
            v-for="(item, index) in thysTouStr.length > 0
              ? thysTouStr.split(' ')
              : []"
            :key="index"
          >
            {{ item }}
          </span>
          <span
            :class="[
              item == '藏' ? 'thys-block-tips-text1' : 'thys-block-tips-text2',
            ]"
            v-for="(item, index) in thysCangStr.length > 0
              ? thysCangStr.split(' ')
              : []"
            :key="item + index"
          >
            {{ item }}
          </span>
        </div>
      </div>
      <div class="book-container-tips" v-if="tips.length > 0">
        <div
          class="book-container-tips-item pointer"
          v-for="(tip, index) in tips"
          :key="index"
          :class="{
            'book-container-tips-item_active': index == tipIndex,
          }"
          @click="onChangeTip(index)"
        >
          {{ tip.value }}
        </div>
      </div>
      <div style="flex: 1; display: flex">
        <iframe
          ref="bookbox"
          id="bookbox"
          :src="content"
          width="100%"
          height="100%"
          frameborder="0"
        ></iframe>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  defineProps,
  defineEmits,
  getCurrentInstance,
  onMounted,
  onActivated,
  onUnmounted,
} from 'vue'
import { navigationTo } from '@/utils'
import store from '@/store'
import GuJi from '@/utils/guJiIndex'
import { thysInit } from '../utils'
const props = defineProps({
  bookData: {
    type: Object,
    default: '',
  },
  bazi: {
    type: Object,
    require: true,
  },
  cgArr: {
    type: Array,
    require: true,
  },
  geju: {
    type: String,
    require: true,
  },
})
const guid = computed(() => store.getters.userguid)
const viplevel = computed(() => store.getters.viplevel)
const emits = defineEmits(['onClose', 'onDialog'])
const noVipIcon = require('@/assets/images/book_vip_btn_02.png')
const tips = reactive([])
const tipIndex = ref(0)
const content = ref('')
let thysDict = null
const thysStr = ref('')
const thysTouStr = ref('')
const thysCangStr = ref('')
const tipResult = ref('')
const iframeheight = ref('660px')
const loading = ref(false)
const tipIcon = require('@/assets/images/icon_tip2.png')

// 切换下标
const onChangeTip = (index) => {
  if (tipIndex.value == index) return
  tipIndex.value = index
  getContent()
}
// 关闭按钮
const onClose = () => {
  emits('onClose')
}
// 获取古籍链接
const getHtmlLink = () => {
  let html
  const tip = tips[tipIndex.value]
  html = `https://bzapi2.iwzbz.com/getnewgujipc.php?guid=${guid.value}&b=${
    props.bookData.id
  }&i=${(tip ? tip.index : 0) + 1}&p=${tipResult.value}&t=${Math.random()}`
  return html
}
const noVipContent = [
  ``,
  ``,
  ``,
  `该书是传统命理四大作之一，作者明朝进士万明英。\n\u3000\u3000全书共十二卷，前九卷分列了十天干，每天干以日为主，以月为核心时为辅，定人吉凶。古籍智能推荐，将书中的书中相关论述，匹配命盘的月日时配置，为批命提供思路和取用神参考。`,
  `作者命理学大家韦千里。作者基于实地命理经验的立论与观点，以月令、日干和时柱的配合，进行命局特点和喜用的批算，准确率颇高。\n\u3000\u3000古籍智能推荐，将其书内一千四百四十条分析，与命盘进行匹配，条目信息简明，且上手简单操作性强。`,
  `统命理四大作之一，作者清朝进士沈孝瞻。\n\u3000\u3000该书更重视理论思路的阐述，让命理学走向了更加有核心、有重点、有条理的分析方法上。是传统子平命理学中分量最少，但是理论最为精辟的著作。\n\u3000\u3000古籍智能推荐，根据命盘特征，匹配将该书对于格局和格局取运的论述，是了解八字格局和行运成败的绝佳文本。`,
  `该书由宋代徐大升依据徐子平先师论命成果而编著，是八字命理学的宗祖之作，在命理发展史上具有划时代的意义。故当今算命书又被称为“子平术”。\n\u3000\u3000古籍智能推荐，根据命盘特征，匹配该书对于格局、干支、诗诀的文本，是您断命不可错过的经典教材。`,
  `该书刊载于《古今图书集成》艺术典之中，该书是以日和时统计来定吉凶，进行归类八字的索引档案。\n\u3000\u3000古籍智能推荐，省去人工索引的工作，自动推送匹配条目。条目信息简明，且上手操作性强。`,
  `作者明朝神峰子张楠。书中《十天干体象全编论》和《十二支咏》，对干支特性进行了经典的论述；后三卷而用非常直白的语言对许多子平经典古歌赋进行了注解。\n\u3000\u3000古籍智能推荐，将书中对干支的精妙注解，匹配命盘上的相应五行，是辅助命盘研究的绝佳材料。`,
  `作者民国韦千里，韦千里在民国与袁树珊被合并誉为“南袁北韦”，该书是他主讲的命学培训班的讲义。\n\u3000\u3000该书语言简练、述理清晰，尤其是对格局、五行、六神的性质讲解，可以说是此书的精华。\n\u3000\u3000智能古籍推荐，根据命盘格局，匹配该书对于格局成、败、过、不及、用神等描述，是您把握格局真义的绝佳文本！`,
  `《五行精纪》作者廖中，南宋人。\n\u3000\u3000该书以年柱干支来推算富贵贫贱，用纳音，重神煞，讲格局。它引用了当时流行的50多种算命文献，是南宋朝代算命学的一部集大成作。 \n\u3000\u3000智能古籍推荐，根据命盘特征，匹配该书对纳音、天干、五行、节气的论述，为大家断命提供参考！`,
  `《李虚中命书》传为鬼谷子撰，唐李虚中注。后世传星命之学者，皆以虚中为祖。\n\u3000\u3000该书在中国命理学上有很重要的地位，是把五行学、阴阳学、星命学整合而成的重要著作，是向八字命理学迈进的主要里程碑。\n\u3000\u3000智能古籍推荐，根据命盘特征，匹配该书的六十甲子解析，为大家断命提供参考！`,
]
// 获取古籍内容
const getContent = () => {
  if (props.bookData.id > 2 && viplevel.value < 1) {
    // content.value = props.bookData.noVipContent
    content.value = noVipContent[props.bookData.id]
    loading.value = false
  } else {
    const tip = tips[tipIndex.value]
    tipResult.value = GuJi[
      `getIndex${props.bookData.id}_${(tip ? tip.index : 0) + 1}`
    ](props.bazi, tip ? tip.value : undefined)
    content.value = getHtmlLink()
  }
}
// 前往VIP页
const onToVip = () => {
  navigationTo({ path: 'vip-page' })
}
// 监听初始化iframe高度
const iframeHeightBypostmessage = (e) => {
  if (e && e.data && e.data.code === 'iframeheight') {
    iframeheight.value = e.data.text + 'px'
  }
}

// 打开弹框
const openDialog = () => {
  emits('onDialog', {
    title: '调候用神提示',
    content: thysStr.value,
  })
}
// const onFullClick = () => {
//   onClose()
// }
// 初始化
const init = () => {
  loading.value = true
  thysDict = thysInit()

  //调候用神处理
  let tyshkey = props.bazi[4] + props.bazi[3]
  if (thysDict[tyshkey]) {
    thysStr.value = thysDict[tyshkey]
    let arr = thysStr.value.split(' ')
    let touarr = []
    let indexarr = [0, 2, 6]
    for (let a in indexarr) {
      for (let b in arr) {
        let aa = props.bazi[indexarr[a]]
        let bb = arr[b]
        if (aa == bb) {
          if (touarr.indexOf(bb) == -1) {
            touarr.push(bb)
          }
        }
      }
    }
    if (touarr.length > 0) {
      thysTouStr.value = '透'
      for (let i = 0; i < touarr.length; i++)
        thysTouStr.value += ' ' + touarr[i]
    } else {
      thysTouStr.value = ''
    }
  }

  if (thysDict[tyshkey]) {
    thysStr.value = thysDict[tyshkey]
    let arr = thysStr.value.split(' ')
    let cangarr = []
    for (let i = 0; i < props.cgArr.length; i++) {
      for (let j = 0; j < props.cgArr[i].length; j++) {
        var aa = props.cgArr[i][j]
        for (let x = 0; x < arr.length; x++) {
          if (aa == arr[x]) {
            if (cangarr.indexOf(aa) == -1) cangarr.push(aa)
          }
        }
      }
    }
    if (cangarr.length > 0) {
      thysCangStr.value = '藏'
      for (let i = 0; i < cangarr.length; i++)
        thysCangStr.value += ' ' + cangarr[i]
    } else {
      thysCangStr.value = ''
    }
  }

  if (!(props.bookData.id > 2 && viplevel.value < 1)) {
    tips.length = 0
    tips.push(
      ...GuJi[`getGuji${props.bookData.id}_branch`](props.bazi, props.geju),
    )
    tipIndex.value = 0
  }
  getContent()

  // 监听iframe
  window.addEventListener('message', iframeHeightBypostmessage)
}

const containerWidth = ref(800),
  containerHeight = ref(800),
  scrollbarHeight = ref(660)
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
  scrollbarHeight.value = containerHeight.value - 140
}

init()

// 监听 Esc：关闭弹框
const handleKeyup = (e) => {
  if (e.keyCode == 27) {
    onClose()
  }
}

let proxy = null
onMounted(() => {
  proxy = getCurrentInstance().proxy
  const bookbox = proxy.$refs ? proxy.$refs.bookbox : proxy.refs.bookbox
  if (bookbox) {
    bookbox.onload = () => {
      loading.value = false
    }
  }
  window.addEventListener('resize', handleChangeClient)
  // window.addEventListener('keyup', handleKeyup)
  handleChangeClient({
    target: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
  })
})
onUnmounted(() => {
  window.removeEventListener('message', iframeHeightBypostmessage)
  window.removeEventListener('resize', handleChangeClient)
  window.removeEventListener('keyup', handleKeyup)
})
onActivated(() => {
  proxy = proxy ? '' : getCurrentInstance().proxy
  const bookbox = proxy.$refs.bookbox
  if (bookbox) {
    bookbox.onload = () => {
      loading.value = false
    }
  }
})
</script>

<style lang="scss" scoped>
.smart-book-box {
  background-color: $shadowBg;
  z-index: 999;
}
.smart-book-container {
  position: relative;
  min-width: 200px;
  min-height: 200px;
  border-radius: 15px;
  background-color: white;
  display: flex;
  flex-direction: column;
  flex: 1;
  .title-box {
    height: 60px;
    line-height: 60px;
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
  .book-container-geju {
    width: 100%;
    // height: 50px;
    // line-height: 40px;
    font-size: 14px;
    color: $themeColor;
    padding: 10px;
    text-align: left;

    .book-container-geju-label {
      // font-weight: bold;
      color: #101010;
    }
  }
  .thys-block {
    line-height: 24px;
    font-size: 14px;
    padding: 0 10px 10px;
    position: relative;

    .thys-block-icon {
      width: 26px;
      cursor: pointer;
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
    }

    .thys-block-title {
      margin-bottom: 10px;
      color: #101010;
      text-align: left;
      // font-weight: bold;

      .thys-block-title_span {
        color: $themeColor;
        font-weight: normal;
      }
    }

    .thys-block-tips {
      display: flex;
      // font-weight: bold;

      .thys-block-tips-text1 {
        display: inline-block;
        margin-right: 4px;
      }

      .thys-block-tips-text2 {
        display: inline-block;
        margin-right: 4px;
        padding: 0 4px;
        color: white;
        font-weight: normal;
        background-color: $themeColor;
        transform: scaleY(0.9);
        border-radius: 6px;
      }
    }
  }
  .book-container-tips {
    display: flex;
    width: 100%;
    // height: 30px;
    padding: 10px 0 0px 10px;
    white-space: nowrap;
    overflow-x: auto;
    justify-content: flex-start;
    &::-webkit-scrollbar {
      width: 10px;
      height: 25px;
    }
    &:hover::-webkit-scrollbar-thumb {
      // border-radius: 30px;
      // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0px;
      box-shadow: none;
      background: linear-gradient(to bottom, transparent 0%, transparent 50%, #dedfe1 50%, #dedfe1 70%, transparent 70%, transparent 100%) !important;
      background-color: transparent !important;
    }
    .book-container-tips-item {
      display: inline-block;
      box-sizing: border-box;
      margin-right: 10px;
      padding: 6px 15px;
      font-size: 14px;
      border-radius: 50px;
      background-color: #f6f6f6;
    }
    .book-container-tips-item_active {
      color: white;
      background-color: $themeColor;
    }
  }
  .book-container-novip {
    padding: 20px;
    text-align: left;
    .book-container-novip-title {
      padding: 20px 0 12px;
      font-size: 20px;
      font-weight: bold;
    }
    .book-container-novip-content {
      font-size: 14px;
      line-height: 24px;
      white-space: pre-wrap;
      // 换行缩进
      text-indent: 2em;
    }
    .book-container-novip-img {
      display: block;
      width: 285px;
      margin: 30px auto;
      border-radius: 40px;
    }
  }
}
</style>
