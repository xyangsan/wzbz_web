<template>
  <div class="container hiddenScrollbar">
    <HeaderItem :MRType="MRType" :infoData="infoData" />
    <div class="base-pan-box columnFlex">
      <div class="base-pan-box-content">
        <div class="base-pan-box-content-left columnFlex">
          <div class="base-pan-row paipanTitleColor">
            <div class="base-pan-row-item paipanTitleColor">日期</div>
            <div
              class="base-pan-row-item paipanTitleColor"
              v-for="item in panDatas.rowTitle.slice(-4)"
              :key="item"
            >
              {{ item }}
            </div>
          </div>
          <div class="base-pan-row">
            <div class="base-pan-row-item paipanTitleColor">主星</div>
            <div
              class="base-pan-row-item"
              v-for="(item, zxIndex) in panDatas.zhuxing.slice(-4)"
              :key="zxIndex"
            >
              <span v-if="zxIndex == 3 && noRizhu">*</span>
              <span
                v-else
                :class="{ pointer: item != '元男' && item != '元女' }"
                @click="
                  item != '元男' && item != '元女'
                    ? onShowDetail('shishen', item)
                    : ''
                "
              >
                {{ item }}
              </span>
            </div>
          </div>
          <div class="base-pan-row">
            <div class="base-pan-row-item paipanTitleColor">天干</div>
            <div
              class="base-pan-row-item gzClass"
              :class="[getClassOfWx(getWxOfGz(item))]"
              v-for="item in panDatas.tiangan.slice(-4)"
              :key="item"
            >
              <span style="padding-left:16px">{{ item == defaultText ? '*' : item }}</span>
              <img
                v-if="item != defaultText && item != '*'"
                class="wuxingIcon"
                :src="getWXIcon(item)"
                alt="五行图标"
              />
            </div>
          </div>
          <div class="base-pan-row">
            <div class="base-pan-row-item paipanTitleColor">地支</div>
            <div
              class="base-pan-row-item gzClass"
              :class="[getClassOfWx(getWxOfGz(item))]"
              v-for="item in panDatas.dizhi.slice(-4)"
              :key="item"
            >
              <span style="padding-left:16px">{{ item == defaultText ? '*' : item }}</span>
              <img
                v-if="item != defaultText && item != '*'"
                class="wuxingIcon"
                :src="getWXIcon(item)"
                alt="五行图标"
              />
            </div>
          </div>
          <div class="base-pan-row">
            <div class="base-pan-row-item paipanTitleColor">藏干</div>
            <div
              class="base-pan-row-item columnFlex alignSelfStart"
              v-for="(items, cgIndex) in panDatas.canggan.slice(-4)"
              :key="cgIndex"
            >
              <div v-if="cgIndex == 3 && noRizhu" class="base-pan-row-item">
                *
              </div>
              <div v-else class="base-pan-row-item columnFlex">
                <span
                  :class="[getClassOfWx(getWxOfGz(item))]"
                  v-for="item in items"
                  :key="item"
                >
                  {{ item + getWxOfGz(item) }}
                </span>
              </div>
            </div>
          </div>
          <div class="base-pan-row">
            <div class="base-pan-row-item paipanTitleColor">副星</div>
            <div
              class="base-pan-row-item columnFlex alignSelfStart"
              v-for="(items, fxIndex) in panDatas.fuxing.slice(-4)"
              :key="fxIndex"
            >
              <div v-if="fxIndex == 3 && noRizhu" class="base-pan-row-item">
                *
              </div>
              <div v-else class="base-pan-row-item columnFlex">
                <span
                  :class="[getClassOfWx(getWxOfGz(item)), 'pointer']"
                  v-for="item in items"
                  :key="item"
                  @click="onShowDetail('shishen', item)"
                >
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
          <div class="base-pan-row">
            <div class="base-pan-row-item paipanTitleColor">星运</div>
            <div
              class="base-pan-row-item"
              v-for="(item, xyIndex) in panDatas.xingyun.slice(-4)"
              :key="xyIndex"
            >
              <span v-if="xyIndex == 3 && noRizhu">*</span>
              <span
                v-else
                class="pointer"
                @click="onShowDetail('zhangsheng', item)"
              >
                {{ item }}
              </span>
            </div>
          </div>
          <div class="base-pan-row">
            <div class="base-pan-row-item paipanTitleColor">自坐</div>
            <div
              class="base-pan-row-item pointer"
              v-for="(item, zzIndex) in panDatas.zizuo.slice(-4)"
              :key="zzIndex"
            >
              <span v-if="zzIndex == 3 && noRizhu">*</span>
              <span
                v-else
                class="pointer"
                @click="onShowDetail('zhangsheng', item)"
              >
                {{ item }}
              </span>
            </div>
          </div>
          <div class="base-pan-row">
            <div class="base-pan-row-item paipanTitleColor">空亡</div>
            <div
              class="base-pan-row-item"
              v-for="(item, kwIndex) in panDatas.kongwang.slice(-4)"
              :key="kwIndex"
            >
              {{ kwIndex == 3 && noRizhu ? '*' : item }}
            </div>
          </div>
          <div class="base-pan-row">
            <div class="base-pan-row-item paipanTitleColor">纳音</div>
            <div
              class="base-pan-row-item pointer"
              v-for="(item, nyIndex) in panDatas.nayin.slice(-4)"
              :key="nyIndex"
            >
              <span v-if="nyIndex == 3 && noRizhu">*</span>
              <span v-else class="pointer" @click="onShowDetail('nayin', item)">
                {{ item }}
              </span>
            </div>
          </div>
          <div class="base-pan-row">
            <div class="base-pan-row-item paipanTitleColor alignSelfStart">
              神煞
            </div>
            <div
              class="base-pan-row-item columnFlex alignSelfStart"
              v-for="(items, ssIndex) in panDatas.shensha.slice(-4)"
              :key="ssIndex"
            >
              <div v-if="ssIndex == 3 && noRizhu" class="base-pan-row-item">
                *
              </div>
              <div v-else class="base-pan-row-item columnFlex">
                <span
                  class="rowItemLineHeight mainColor pointer"
                  v-for="item in items"
                  :key="item"
                  @click="onShowDetail('shensha', item)"
                >
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="base-pan-box-content-right columnFlex">
          <div class="book-item-title">智能古籍参考</div>
          <div class="book-items">
            <div
              :class="[
                'book-item',
                'pointer',
                item.id == bookData.id ? 'book-item-active' : '',
              ]"
              v-for="item in bookList"
              :key="item.id"
              @click="onBookItem(item.id)"
            >
              {{ item.name }}
            </div>
          </div>
          <SmartBoox
            v-if="isShowBook"
            :bookData="bookData"
            :bazi="panDatas.mrbazi || panDatas.bazi"
            :cgArr="panDatas.cgArr"
            :geju="geju"
            @onClose="onCloseBook"
            @onDialog="onDialog"
          />
        </div>
      </div>
      <div class="base-pan-box-sizhu">
        <!-- <div
          class="sizhu-btn mainColor"
          :class="{ pointer: panDatas.isLiuNian != 0 }"
          @click="onTips"
        >
          智能图示
        </div> -->
        <div class="sizhu-gztip columnFlex">
          <div class="sizhu-gztip-item">
            <span
              class="mainColor"
              :class="{ pointer: panDatas.isLiuNian != 0 }"
            >
              天干留意：
            </span>
            {{ gzTips[0] ? gzTips[0] : '无合冲关系' }}
          </div>
          <div class="sizhu-gztip-item">
            <span
              class="mainColor"
              :class="{ pointer: panDatas.isLiuNian != 0 }"
            >
              地支留意：
            </span>
            {{ gzTips[1] ? gzTips[1] : '无合冲关系' }}
          </div>
        </div>
      </div>
      <div class="base-pan-box-sizhu" style="height: auto; overflow: hidden">
        <SmartSiZhu
          :gzchat="gzchat"
          :gztipsTitleArr="panDatas.rowTitle.slice(-4)"
          :gztipsGanArr="panDatas.tiangan.slice(-4)"
          :gztipsZhiArr="panDatas.dizhi.slice(-4)"
          :sex="Number(infoData.sex)"
          :parentIndex="sidebarIndex"
          @goToGanZhiSetting="goToGanZhiSetting"
        ></SmartSiZhu>
      </div>
    </div>
  </div>
  <TipsBox
    v-show="showTips"
    :gzchat="gzchat"
    :gztipsTitleArr="panDatas.rowTitle.slice(-4)"
    :gztipsGanArr="panDatas.tiangan.slice(-4)"
    :gztipsZhiArr="panDatas.dizhi.slice(-4)"
    @onClose="showTips = false"
  />
  <PopupBox v-if="isShowDialog" :width="dialogWidth" :height="dialogHeight" @onFullClick="closeDialog">
    <ImgDialog :title="dialogTitle" :imgUrl="imgUrl" @close="closeDialog" />
  </PopupBox>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  defineProps,
  defineEmits,
  nextTick,
  watch,
} from 'vue'
import HeaderItem from './headerItem'
import SmartBoox from './smartBook'
import SmartSiZhu from '@/components/smartSiZhu'
import store from '@/store'
import { getWxOfGz, getClassOfWx } from '@/utils'
import { getWXIcon, ArrayToStrGZTips } from '../utils'
import { defaultText } from '@/static'
import { bookList } from '../static'
import * as homeApi from '@/api/home-api'
import gzcls from '../gzcls'
import TipsBox from './tipsBox'
import { getGZRelation } from '@/api/bazi.js'
import PopupBox from '@/components/popupBox'
import ImgDialog from '@/components/imgDialog'
const props = defineProps({
  MRType: {
    type: Number,
    default: 0,
  },
  noRizhu: {
    type: Boolean,
    default: false,
  },
  infoData: {
    type: Object,
    require: true,
  },
  panDatas: {
    type: Object,
    require: true,
  },
  geju: {
    type: String,
    require: true,
  },
  sidebarIndex: {
    type: Number,
    default: 0,
  },
})
const emits = defineEmits(['onShowDetail', 'goToGanZhiSetting', 'onDialog'])
const userguid = computed(() => store.getters.userguid)
const viplevel = computed(() => store.getters.viplevel)
const isShowBook = ref(false)
// 干支提示
const gzTips = reactive(['', ''])
const basegzrelactionparm = ref('')
let baseRetGanArr = null
let baseRetZhiArr = null
const gzchat = reactive([])
const showTips = ref(false)
// 古籍相关信息
const bookData = reactive({
  id: '',
  name: '',
  noVipContent: '',
})
const bookId = ref(1)
const isShowDialog = ref(false)
const dialogWidth = ref(951)
const dialogHeight = ref(590)
const dialogTitle = ref('调候提示')
const imgUrl = require('@/assets/images/img_tips.png')
watch(
  () => props.geju,
  () => {
    if (props.geju) {
      if (bookData.id === 2) {
        onBookItem(2)
      }
    }
  },
)

// 打开弹框显示古籍内容
const onBookItem = (id) => {
  isShowBook.value = false
  nextTick(() => {
    isShowBook.value = true
    const book = bookList.find((item) => item.id == id)
    bookData.id = book.id
    bookData.name = book.name
    bookData.noVipContent = book.noVipContent
  })
}
// 关闭古籍
const onCloseBook = () => {
  isShowBook.value = false
}
// 选中关键词打开详情介绍
const onShowDetail = (type, item) => {
  emits('onShowDetail', type, item)
}
// 点击四柱图示
const onTips = () => {
  if (props.panDatas.isLiuNian == 0) return
  const gzchat2 = gzcls.calculate(
    [baseRetGanArr, baseRetZhiArr],
    basegzrelactionparm.value,
  )
  gzchat.length = 0
  gzchat.push(...gzchat2)
  // showTips.value = true
}
// 初始化
const init = async () => {
  // 获取天干地支提示
  let gzrelactionparm = ''
  const tgArr = props.panDatas.tiangan.slice(-4)
  const dzArr = props.panDatas.dizhi.slice(-4)
  for (let i = 0; i < tgArr.length; i++) {
    gzrelactionparm += tgArr[i] + dzArr[i] + ' '
  }
  gzrelactionparm = gzrelactionparm.slice(0, -1)
  let gzResult = ''
  await getGZRelation({
    gz: gzrelactionparm,
    userguid: userguid.value,
    vip: viplevel.value,
  })
    .then((res) => {
      gzResult = res
    })
    .catch((err) => {
      console.log('失败!')
    })
  if (gzResult) {
    const retganArr = gzResult[0]
    const retZhiArr = gzcls.otherRule(gzResult[1])
    basegzrelactionparm.value = gzrelactionparm
    baseRetGanArr = retganArr
    baseRetZhiArr = retZhiArr
    gzTips[0] = ArrayToStrGZTips(retganArr, ',')
    gzTips[1] = ArrayToStrGZTips(retZhiArr, ',')
  }
  onTips()
  onBookItem(1)
}
const goToGanZhiSetting = () => {
  // 向父级传递事件
  emits('goToGanZhiSetting')
}
const onDialog = () => {
  isShowDialog.value = true
}
const closeDialog = () => {
  isShowDialog.value = false
}
init()
</script>

<style lang="scss" scoped>
.container {
  // min-width: 1025px;
  width: 100%;
  border-radius: 15px 15px 0 0;
  .base-pan-box {
    width: 100%;
    padding: 24px 13px;
    .base-pan-box-content {
      display: flex;
      width: 100%;
      .base-pan-box-content-left {
        flex: 1;
        border-radius: 10px;
        border: 1px solid rgb(240, 240, 240);
        padding: 6px 0;
        .base-pan-row {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 8px 0;
          font-size: 15px;
          color: black;
          &:first-child {
            padding-top: 7px;
          }
          .base-pan-row-item {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            .wuxingIcon {
              width: 28px;
            }
          }
          .gzClass {
            font-size: 28px;
            font-weight: bold;
          }
          .rowItemLineHeight {
            margin-bottom: 3px;
          }
        }
        .base-pan-row:nth-of-type(2n) {
          background-color: #f8f8f8;
        }
      }
      .base-pan-box-content-right {
        width: 512px;
        margin-left: 12px;
        border-radius: 10px;
        border: 1px solid rgba(240, 240, 240, 100);
        overflow: hidden;
        .book-item-title {
          height: 42px;
          line-height: 42px;
          color: #101010;
          font-size: 16px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          border-bottom: 1px solid rgba(240, 240, 240, 100);
          font-weight: bold;
        }
        .book-items {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          overflow-x: auto;
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
        }
        .book-item {
          height: 42px;
          width: 87px;
          line-height: 42px;
          color: #646464;
          font-size: 15px;
          border-bottom: 1px solid rgba(240, 240, 240, 100);
          flex-shrink: 0;
        }
        .book-item-active {
          color: $themeColor;
          background-color: rgba($color: #b2955d, $alpha: 0.08);
          font-weight: bold;
        }
        .book-item:hover {
          color: $themeColor;
        }
      }
    }
    .base-pan-box-sizhu {
      display: flex;
      width: 100%;
      height: 76px;
      margin-top: 12px;
      border-radius: 10px;
      border: 1px solid rgb(223, 223, 223);
      .sizhu-btn {
        position: relative;
        width: 120px;
        height: 100%;
        line-height: 73px;
        font-size: 18px;
        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 42px;
          border: 1px solid rgba(213, 213, 213, 0.3);
        }
      }
      .sizhu-gztip {
        flex: 1;
        display: flex;
        justify-content: center;
        padding: 10px 24px;
        .sizhu-gztip-item {
          font-size: 16px;
          text-align: left;
          &:first-child {
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
  ::-webkit-scrollbar {
    width: 10px;
    height: 5px;
  }
  :hover::-webkit-scrollbar-thumb {
    border-radius: 30px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #dedfe1;
  }
:deep(.popup-box) {
  padding: 0 !important;
  border-radius: 0 !important;
  background-color: transparent !important;
}
:deep(.ganzhi_tab01_wrapper) {
  width: 50%;
}
</style>
