<template>
  <div class="container hiddenScrollbar">
    <div class="pro-pan-content" ref="container">
      <div class="pro-pan-content-left">
        <div class="pro-pan-content-table">
          <div class="pro-pan-row paipanTitleColor">
            <div class="pro-pan-row-item paipanTitleColor">日期</div>
            <div
              class="pro-pan-row-item shadowBoder"
              v-for="(item, tIndex) in panDatas.rowTitle"
              :key="tIndex"
            >
              {{ item }}
            </div>
          </div>
          <!-- 主星 -->
          <div class="pro-pan-row">
            <div class="pro-pan-row-item paipanTitleColor">主星</div>
            <div
              class="pro-pan-row-item"
              v-for="(item, zxIndex) in panDatas.zhuxing"
              :key="zxIndex"
            >
              <span
                v-if="
                  (panDatas.isLiuNian == 0 && zxIndex == 0) ||
                  (zxIndex == panDatas.zhuxing.length - 1 && noRizhu)
                "
              >
                *
              </span>
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
          <!-- 天干 -->
          <div class="pro-pan-row">
            <div class="pro-pan-row-item paipanTitleColor">天干</div>
            <div
              class="pro-pan-row-item gzClass"
              v-for="(item, tgIndex) in panDatas.tiangan"
              :key="tgIndex"
            >
              <span
                :class="[
                  getClassOfWx(
                    getWxOfGz(
                      panDatas.isLiuNian == 0 && tgIndex == 0 ? '*' : item,
                    ),
                  ),
                ]"
              >
                {{
                  item == defaultText ||
                  (panDatas.isLiuNian == 0 && tgIndex == 0) ||
                  infoData.unknowhour === 1
                    ? '*'
                    : item
                }}
              </span>
              <!-- <span v-if="panDatas.isLiuNian == 0 && tgIndex == 0">*</span>
              <span v-else :class="[getClassOfWx(getWxOfGz(item))]">
                {{ item }}
              </span> -->
            </div>
          </div>
          <!-- 地支 -->
          <div class="pro-pan-row" style="padding-bottom: 15px">
            <div class="pro-pan-row-item paipanTitleColor">地支</div>
            <div
              class="pro-pan-row-item gzClass"
              v-for="(item, dzIndex) in panDatas.dizhi"
              :key="dzIndex"
            >
              <span
                :class="[
                  getClassOfWx(
                    getWxOfGz(
                      panDatas.isLiuNian == 0 && dzIndex == 0 ? '*' : item,
                    ),
                  ),
                ]"
              >
                {{
                  item == defaultText ||
                  (panDatas.isLiuNian == 0 && dzIndex == 0)
                    ? '*'
                    : item
                }}
              </span>
              <!-- <span v-if="panDatas.isLiuNian == 0 && dzIndex == 0">*1</span>
              <span v-else :class="[getClassOfWx(getWxOfGz(item))]">
                {{ item }}
              </span> -->
            </div>
          </div>
          <!-- 藏干 -->
          <div class="pro-pan-row greyBg" style="padding: 8px 0 6px">
            <div class="pro-pan-row-item paipanTitleColor">藏干</div>
            <div
              class="pro-pan-row-item columnFlex alignSelfStart"
              v-for="(items, cgIndex) in panDatas.canggan"
              :key="cgIndex"
            >
              <div
                v-if="
                  (panDatas.isLiuNian == 0 && cgIndex == 0) ||
                  (cgIndex == panDatas.canggan.length - 1 && noRizhu)
                "
                class="pro-pan-row-item"
              >
                *
              </div>
              <div v-else class="pro-pan-row-item columnFlex">
                <span
                  :class="[getClassOfWx(getWxOfGz(item))]"
                  style="font-size: 0; margin-bottom: 2px"
                  v-for="(item, index) in items"
                  :key="index"
                >
                  <span style="font-size: 15px">{{ item }}</span>
                  <span
                    class="pointer"
                    style="color: black; font-size: 14px"
                    @click="
                      onShowDetail('shishen', panDatas.fuxing[cgIndex][index])
                    "
                  >
                    {{ panDatas.fuxing[cgIndex][index] }}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <!-- 星运 -->
          <div class="pro-pan-row" style="padding-top: 12px">
            <div class="pro-pan-row-item paipanTitleColor">星运</div>
            <div
              class="pro-pan-row-item"
              v-for="(item, xyIndex) in panDatas.xingyun"
              :key="xyIndex"
            >
              <span
                v-if="
                  (panDatas.isLiuNian == 0 && xyIndex == 0) ||
                  (xyIndex == panDatas.xingyun.length - 1 && noRizhu)
                "
              >
                *
              </span>
              <span
                v-else
                class="pointer"
                @click="onShowDetail('zhangsheng', item)"
              >
                {{ item }}
              </span>
            </div>
          </div>
          <!-- 自坐 -->
          <div class="pro-pan-row">
            <div class="pro-pan-row-item paipanTitleColor">自坐</div>
            <div
              class="pro-pan-row-item"
              v-for="(item, zzIndex) in panDatas.zizuo"
              :key="zzIndex"
            >
              <span
                v-if="
                  (panDatas.isLiuNian == 0 && zzIndex == 0) ||
                  (zzIndex == panDatas.zizuo.length - 1 && noRizhu)
                "
              >
                *
              </span>
              <span
                v-else
                class="pointer"
                @click="onShowDetail('zhangsheng', item)"
              >
                {{ item }}
              </span>
            </div>
          </div>
          <!-- 空亡 -->
          <div class="pro-pan-row">
            <div class="pro-pan-row-item paipanTitleColor">空亡</div>
            <div
              class="pro-pan-row-item"
              v-for="(item, kwIndex) in panDatas.kongwang"
              :key="kwIndex"
            >
              {{
                (panDatas.isLiuNian == 0 && kwIndex == 0) ||
                (kwIndex == panDatas.kongwang.length - 1 && noRizhu)
                  ? '*'
                  : item
              }}
            </div>
          </div>
          <!-- 纳音 -->
          <div class="pro-pan-row" style="padding-bottom: 14px">
            <div class="pro-pan-row-item paipanTitleColor">纳音</div>
            <div
              class="pro-pan-row-item"
              v-for="(item, nyIndex) in panDatas.nayin"
              :key="nyIndex"
            >
              <span
                v-if="
                  (panDatas.isLiuNian == 0 && nyIndex == 0) ||
                  (nyIndex == panDatas.nayin.length - 1 && noRizhu)
                "
              >
                *
              </span>
              <span v-else class="pointer" @click="onShowDetail('nayin', item)">
                {{ item }}
              </span>
            </div>
          </div>
          <!-- 有色间距 -->
          <!-- <div
            class="shensha_division"
            style="
              height: 11px;
              width: 100%;
              background-color: rgba(248, 248, 248, 100);
            "
          ></div> -->
        </div>
      </div>
    </div>
  </div>
  <TipsBox
    v-show="showTips"
    :gzchat="gzchat"
    :gztipsTitleArr="panDatas.rowTitle"
    :gztipsGanArr="panDatas.tiangan"
    :gztipsZhiArr="panDatas.dizhi"
    @onClose="showTips = false"
  />
</template>

<script setup>
import {
  ref,
  reactive,
  defineProps,
  defineEmits,
  computed,
  getCurrentInstance,
  onMounted,
  onUpdated,
  watch,
  nextTick,
} from 'vue'
import HeaderItem from './headerItem'
import store from '@/store'
import { getWxOfGz, getClassOfWx, navigationTo } from '@/utils'
import {
  setDayunHeader,
  setLiuNianHeader,
  setLiuYueHeader,
  setLiuRiHeader,
  setLiuShiHeader,
  setLiuNianData,
  setLiuyueData,
  ArrayToStrGZTips,
  getYueGan,
  setLiuRiData,
  setLiuShiData,
  getJieqiWithYearAndMonth,
} from '../utils'
import { ly_zhi, defaultText } from '@/static'
import gzcls from '../gzcls'
import TipsBox from './tipsBox'
import { getGZRelation } from '@/api/bazi.js'

const props = defineProps({
  MRType: {
    type: Number,
    default: 0,
  },
  noRizhu: {
    type: Boolean,
    default: false,
  },
  wxData: {
    type: Array,
    require: true,
  },
  infoData: {
    type: Object,
    require: true,
  },
  // rowTitle zhuxing tiangan dizhi canggan fuxing xingyun zizuo kongwang nayin shensha bazi tdbzArr
  panDatas: {
    type: Object,
    require: true,
  },
  // dayunArr xiaoyunArr liunianArr liuyueArr liuriArr liushiArr
  yunDatas: {
    type: Object,
    require: true,
  },
  // todayYear todayMonth todayDay todayHour
  todayObj: {
    type: Object,
    require: true,
  },
  // year month day
  lunarToday: {
    type: Object,
    require: true,
  },
})
const emits = defineEmits(['onShowDetail'])
const riGan = computed(() => props.panDatas.bazi[4])
const userguid = computed(() => store.getters.userguid)
const viplevel = computed(() => store.getters.viplevel)
const dayunIndex = ref(-2)
const liunianIndex = ref(0)
const liuyueIndex = ref(-1)
const liuriIndex = ref(-1)
const liushiIndex = ref(-1)
const selectliunian = ref(0)
const isClickLiuYue = ref(false)
const isClickLiuRi = ref(false)
const isClickLiuShi = ref(false)
const isClickJin = ref(false) // 是否点击“今”
const clickTodayYear = ref(0) // 点击了今天后获取的年份
const gzrelactionparm = ref('')
let RetGanArr = null
let RetZhiArr = null
const todayYearGZ = ref('')
const todayMonthGZ = ref('')
const todayDayGZ = ref('')
// 五行
const wxData = computed(() => props.wxData)
const todayDayunIndex = ref(-1) // 当前年的大运
const shenshaOfTable = ref(true) // 神煞是否以表格显示
// 干支提示
const gzTips = reactive(['', ''])
const GZTips = {}
const gzchat = reactive([])
const showTips = ref(false)

// 显示关键词详情对话框
const onShowDetail = (type, item) => {
  emits('onShowDetail', type, item)
}
// 切换神煞显示形式: 表格 | 对应框
const onClickShenSha = () => {
  shenshaOfTable.value = !shenshaOfTable.value
  initHeight.value++
}
// 点击“今”
const onTodayClick = () => {
  isClickJin.value = true
  const todayObj = props.todayObj
  let todayYear = todayObj.todayYear,
    todayMonth = todayObj.todayMonth,
    todayDay = todayObj.todayDay
  dayunIndex.value = todayDayunIndex.value
  setDayunHeader(
    props.panDatas,
    props.yunDatas,
    todayDayunIndex.value == -1
      ? props.yunDatas.xiaoyunArr[0]
      : props.yunDatas.dayunArr[todayDayunIndex.value],
    riGan.value,
    dayunIndex.value,
    props.infoData.sex,
  )
  setLiuNianData(
    props.panDatas,
    props.yunDatas,
    selectliunian,
    dayunIndex.value,
    props.yunDatas.liunianArr,
    riGan.value,
    todayYear,
    props.infoData.sex,
  )

  if (props.MRType == 1) return

  // 获取今年的立春节气的日期
  let yearstartdate = getJieqiWithYearAndMonth(selectliunian.value, 2) //截取年份跟月份
  var tmplcmonth = 0 //立春月份
  var tmplcday = 0 //立春天数
  if (yearstartdate[0] != '') {
    var tmparr = yearstartdate[0].split('-')
    tmplcmonth = parseInt(tmparr[1])
    tmplcday = parseInt(tmparr[2])
  }
  clickTodayYear.value = selectliunian.value
  // 判断今天日期是否在立春前并且出生年是否等于今年,如果是则选中年-1
  if (
    todayMonth * 100 + todayDay < tmplcmonth * 100 + tmplcday &&
    todayYear == props.infoData.solarTime[0]
  ) {
    clickTodayYear.value = selectliunian.value - 1
  }

  setLiuyueData(
    props.yunDatas,
    liuyueIndex,
    todayMonthGZ.value,
    todayYear,
    clickTodayYear.value,
    riGan.value,
  )
  let liuyueGZTmpArr = props.yunDatas.liuyueArr[liuyueIndex.value - 1]
  let liuyueGZ = [liuyueGZTmpArr[0], liuyueGZTmpArr[1]]
  setLiuYueHeader(
    props.panDatas,
    props.yunDatas,
    liuyueGZ,
    riGan.value,
    props.infoData.sex,
  )

  setLiuRiData(
    props.yunDatas,
    liuriIndex,
    todayObj,
    clickTodayYear.value,
    liuyueIndex.value,
    riGan.value,
  )
  let liuriGZTmpArr = props.yunDatas.liuriArr[liuriIndex.value - 1]
  let liuriGZ = [liuriGZTmpArr[0], liuriGZTmpArr[1]]
  setLiuRiHeader(
    props.panDatas,
    props.yunDatas,
    liuriGZ,
    riGan.value,
    props.infoData.sex,
  )

  setLiuShiData(props.yunDatas, liuriIndex.value, riGan.value)

  const todayHour = todayObj.todayHour
  if (todayHour >= 23) {
    liushiIndex.value = 1
  } else if (todayHour >= 21) {
    liushiIndex.value = 12
  } else if (todayHour >= 19) {
    liushiIndex.value = 11
  } else if (todayHour >= 17) {
    liushiIndex.value = 10
  } else if (todayHour >= 15) {
    liushiIndex.value = 9
  } else if (todayHour >= 13) {
    liushiIndex.value = 8
  } else if (todayHour >= 11) {
    liushiIndex.value = 7
  } else if (todayHour >= 9) {
    liushiIndex.value = 6
  } else if (todayHour >= 7) {
    liushiIndex.value = 5
  } else if (todayHour >= 5) {
    liushiIndex.value = 4
  } else if (todayHour >= 3) {
    liushiIndex.value = 3
  } else if (todayHour >= 1) {
    liushiIndex.value = 2
  } else {
    liushiIndex.value = 1
  }
  let liushiGZTmpArr = props.yunDatas.liushiArr[liushiIndex.value - 1]
  let liushiGZ = [liushiGZTmpArr[0], liushiGZTmpArr[1]]
  setLiuShiHeader(
    props.panDatas,
    props.yunDatas,
    liushiGZ,
    riGan.value,
    props.infoData.sex,
  )
  setXiPanGZTips()

  isClickLiuYue.value = true
  if (viplevel.value > 0) {
    isClickLiuRi.value = true
    isClickLiuShi.value = true
  }

  initHeight.value++
}
// 点击大运 / 小运
const onDayunClick = (index) => {
  if (index == dayunIndex.value) return
  let lunarYear = props.todayObj.todayYear
  dayunIndex.value = index

  setDayunHeader(
    props.panDatas,
    props.yunDatas,
    index == -1 ? props.yunDatas.xiaoyunArr[0] : props.yunDatas.dayunArr[index],
    riGan.value,
    index,
    props.infoData.sex,
  )
  setLiuNianData(
    props.panDatas,
    props.yunDatas,
    selectliunian,
    index,
    props.yunDatas.liunianArr,
    riGan.value,
    lunarYear,
    props.infoData.sex,
  )
  if (props.panDatas.isLiuNian == 0 || props.MRType == 1) return
  // if (selectliunian.value > 2100) {
  //   props.yunDatas.liuyueArr.length = 0
  //   return
  // }
  setLiuyueData(
    props.yunDatas,
    liuyueIndex,
    todayMonthGZ.value,
    lunarYear,
    selectliunian.value,
    riGan.value,
  )
  setXiPanGZTips()

  isClickLiuYue.value = false
  isClickLiuRi.value = false
  isClickLiuShi.value = false

  initHeight.value++
}
// 点击流年
const onLiuNianClick = (item, index) => {
  if (selectliunian.value == item[1]) return
  let lunarYear = props.todayObj.todayYear
  const panDatas = props.panDatas
  selectliunian.value = item[1]
  // let arr = item[4].split('')
  // panDatas.tiangan[panDatas.tiangan.length - 6] = arr[0]
  // panDatas.dizhi[panDatas.dizhi.length - 6] = arr[1]

  setLiuNianHeader(
    panDatas,
    props.yunDatas,
    item[0],
    riGan.value,
    props.infoData.sex,
  )
  if (props.MRType == 1) return
  setLiuyueData(
    props.yunDatas,
    liuyueIndex,
    todayMonthGZ.value,
    lunarYear,
    selectliunian.value,
    riGan.value,
  )
  setXiPanGZTips()

  liunianIndex.value = index
  isClickLiuYue.value = false
  isClickLiuRi.value = false
  isClickLiuShi.value = false

  initHeight.value++
}
// 点击流月
const onLiuYueClick = (index) => {
  if ((isClickLiuYue.value && liuyueIndex.value == index) || props.MRType == 1)
    return
  const todayObj = props.todayObj
  liuyueIndex.value = index
  let tmpgan = getYueGan(selectliunian.value, index)
  let tmpzhi = ly_zhi[index - 1]
  let gz = [tmpgan, tmpzhi]
  setLiuYueHeader(
    props.panDatas,
    props.yunDatas,
    gz,
    riGan.value,
    props.infoData.sex,
  )
  setLiuRiData(
    props.yunDatas,
    liuriIndex,
    todayObj,
    selectliunian.value,
    index,
    riGan.value,
  )
  setXiPanGZTips()

  isClickLiuYue.value = true
  isClickLiuRi.value = false
  isClickLiuShi.value = false

  initHeight.value++
}
// 点击流日
const onLiuRiClick = (index) => {
  if (isClickLiuRi.value && (liuriIndex.value == index || props.MRType == 1))
    return
  liuriIndex.value = index
  let tmpgz = props.yunDatas.liuriArr[index - 1]
  let gz = [tmpgz[0], tmpgz[1]]
  setLiuRiHeader(
    props.panDatas,
    props.yunDatas,
    gz,
    riGan.value,
    props.infoData.sex,
  )
  setLiuShiData(props.yunDatas, index, riGan.value)
  setXiPanGZTips()

  isClickLiuYue.value = true
  isClickLiuRi.value = true
  isClickLiuShi.value = false

  initHeight.value++
}
// 点击流时
const onLiuShiClick = (index) => {
  if (isClickLiuShi.value && (liushiIndex.value == index || props.MRType == 1))
    return
  liushiIndex.value = index
  let tmpgz = props.yunDatas.liushiArr[index - 1]
  let gz = [tmpgz[0], tmpgz[1]]
  setLiuShiHeader(
    props.panDatas,
    props.yunDatas,
    gz,
    riGan.value,
    props.infoData.sex,
  )
  setXiPanGZTips()

  isClickLiuYue.value = true
  isClickLiuRi.value = true
  isClickLiuShi.value = true

  initHeight.value++
}
/**
 * 获取专业细盘的天干地支提示
 */
const setXiPanGZTips = async () => {
  const panDatas = props.panDatas
  let gzrelactionparm1 = ''
  for (let i = 0; i < panDatas.tiangan.length; i++) {
    gzrelactionparm1 += panDatas.tiangan[i] + panDatas.dizhi[i] + ' '
  }
  gzrelactionparm1 = gzrelactionparm1.slice(0, -1)
  gzrelactionparm.value = gzrelactionparm1
  if (GZTips[gzrelactionparm1]) {
    RetGanArr = GZTips[gzrelactionparm1][0]
    RetZhiArr = GZTips[gzrelactionparm1][1]
    gzTips[0] = ArrayToStrGZTips(RetGanArr, ',')
    gzTips[1] = ArrayToStrGZTips(RetZhiArr, ',')
  } else {
    // 后端请求
    let gzrresult = ''
    await getGZRelation({
      gz: gzrelactionparm1,
      userguid: userguid.value,
      vip: viplevel.value,
    })
      .then((res) => {
        gzrresult = res
      })
      .catch((err) => {
        console.log('失败!')
      })
    if (gzrresult) {
      let retganArr = gzrresult[0]
      let retZhiArr = gzcls.otherRule(gzrresult[1])
      RetGanArr = retganArr
      RetZhiArr = retZhiArr
      gzTips[0] = ArrayToStrGZTips(retganArr, ',')
      gzTips[1] = ArrayToStrGZTips(retZhiArr, ',')
      GZTips[gzrelactionparm] = [retganArr, retZhiArr]
    }
  }
}
// 点击干支留意
const onTips = () => {
  if (props.panDatas.isLiuNian == 0) return
  const gzchat2 = gzcls.calculate([RetGanArr, RetZhiArr], gzrelactionparm.value)
  gzchat.length = 0
  gzchat.push(...gzchat2)
  showTips.value = true
}
// 前往VIP页
const onToVip = () => {
  navigationTo({ path: 'vip-page' })
}
// 初始化
const init = () => {
  const infoData = props.infoData
  const panDatas = props.panDatas
  const yunDatas = props.yunDatas
  const tdbzArr = panDatas.tdbzArr
  let todayYear = props.todayObj.todayYear,
    todayMonth = props.todayObj.todayMonth,
    todayDay = props.todayObj.todayDay

  // 初始化今日数据
  todayYearGZ.value = tdbzArr[0] + tdbzArr[1]
  todayMonthGZ.value = tdbzArr[2] + tdbzArr[3]
  todayDayGZ.value = tdbzArr[4] + tdbzArr[5]

  // 初始化大运起始索引
  let dayunStartYear = +infoData.solarTime[0] + (yunDatas.qiyunsui - 1) //新历
  let selectdayun = -1
  if (dayunStartYear <= todayYear) {
    selectdayun = 0
  }
  for (let i = 0; i < yunDatas.dayunArr.length; i++) {
    dayunStartYear = dayunStartYear + 10
    if (dayunStartYear <= todayYear) {
      selectdayun = i + 1
    }
  }
  if (selectdayun >= 8) {
    selectdayun = 0
  }
  todayDayunIndex.value = selectdayun
  onDayunClick(selectdayun)

  var yearstartdate = getJieqiWithYearAndMonth(todayYear, 2) //截取年份跟月份
  var tmplcmonth = 0 //月份
  var tmplcday = 0 //天数
  if (yearstartdate[0] != '') {
    var tmparr = yearstartdate[0].split('-')
    tmplcmonth = parseInt(tmparr[1])
    tmplcday = parseInt(tmparr[2])
  }
  if (todayMonth * 100 + todayDay < tmplcmonth * 100 + tmplcday) {
    todayYear = todayYear - 1
  }
  selectliunian.value = todayYear

  setXiPanGZTips()
}

// 监听内容区域高度，使左右区域高度一致
const container = ref(null)
const containerHeight = ref(0)
const initHeight = ref(0)
const handleContainerHeight = () => {
  setTimeout(() => {
    const height = Math.round(
      container.value.getBoundingClientRect().height + 4,
    )
    containerHeight.value = height
  }, 100)
}
watch(
  initHeight,
  () => {
    containerHeight.value = 0
    nextTick(handleContainerHeight)
  },
  { immediate: true },
)
// 监听流日滚动到指定位置
let proxy = null
let liuriItem = null
const liuriBox = ref(null)
const handleOffsetLeft = () => {
  liuriItem = proxy.$refs
    ? proxy.$refs['liuriItem' + liuriIndex.value]
    : proxy.refs['liuriItem' + liuriIndex.value]
  if (isClickJin.value && liuriBox.value && liuriItem && liuriItem.length > 0) {
    liuriBox.value.scrollLeft =
      liuriItem[0].offsetWidth * (liuriIndex.value - 1)
    isClickJin.value = false
  }
}
onMounted(() => {
  if (props.MRType == 1) return
  proxy = getCurrentInstance().proxy
})
onUpdated(() => {
  if (props.MRType == 1) return
  nextTick(handleOffsetLeft)
})

init()
</script>

<style lang="scss" scoped>
.container {
  box-sizing: border-box;
  // min-width: 1270px;
  .pro-pan-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    // margin-bottom: 10px;
    color: black;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    background-color: white;
    .pro-pan-content-left {
      flex: 1;
      height: 100%;
      .pro-pan-content-table {
        width: 100%;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        border: 1px solid rgba(240, 240, 240, 100);
      }
      .pro-pan-content-table {
        .pro-pan-row {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 5px 0;
          font-size: 15px;
          &:first-child {
            padding-top: 13px;
          }
          .pro-pan-row-item {
            flex: 1;
            white-space: nowrap;
          }
          .gzClass {
            font-size: 28px;
            font-weight: bold;
          }
          .rowItemLineHeight {
            margin-bottom: 3px;
          }
        }
        .shadowBoder {
          position: relative;
        }
        .shadowBoder:nth-last-child(4)::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 328px;
          border: 1px solid rgba(240, 240, 240, 100);
        }
      }
      .pro-pan-content-shensha {
        position: relative;
        align-items: flex-start;
        padding: 20px;
        .pro-pan-content-shensha-item {
          align-items: flex-start;
          margin-bottom: 20px;
          .pro-pan-content-shensha-item-title {
            padding: 5px 0 10px 0;
            color: $mainColor;
            font-size: 18px;
          }
          .pro-pan-content-shensha-item-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 15px;
            line-height: 22px;
            .pro-pan-content-shensha-item-row-title {
              color: black;
              white-space: nowrap;
            }
            .pro-pan-content-shensha-item-row-values {
              display: flex;
              flex-wrap: wrap;
            }
            .pro-pan-content-shensha-item-row-value {
              margin-right: 10px;
              color: $mainColor;
              white-space: nowrap;
            }
          }
        }
      }
      .switchIcon,
      .switchIcon2 {
        color: $mainColor;
        border-radius: 50%;
        background-color: #f6f6f6;
        transform: rotateZ(90deg) rotateX(180deg);
      }
      .switchIcon {
        margin-top: 5px;
      }
      .switchIcon2 {
        position: absolute;
        right: 15px;
        top: 15px;
      }
    }
    .pro-pan-content-right {
      width: 600px;
      height: 100%;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      border: 1px solid rgba(240, 240, 240, 100);
      background-color: white;
    }
    .pro-pan-content-bg {
      width: 100%;
      height: 100%;
      background-color: $bg;
    }
    .pro-pan-qiyun {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 77px;
      padding: 12px 10px;
      border-radius: 10px 10px 0 0;
      border-top: 1px solid rgba(240, 240, 240, 100);
      background-color: white;
      .pro-pan-qiyun-left {
        margin-right: 20px;
        text-align: left;
        font-size: 15px;
      }
      .pro-pan-qiyun-right {
        position: relative;
        margin-right: 69px;
        padding: 0;
        text-align: right;
        font-size: 14px;
        white-space: nowrap;
      }
      .pro-pan-qiyun-icon {
        position: absolute;
        top: 0;
        right: -47px;
        box-sizing: content-box;
        width: 28px;
        padding: 7px 8px;
      }
    }
    .pro-pan-yun {
      display: flex;
      width: 100%;
      margin-top: 10px;
      overflow: hidden;
      background-color: white;
      .pro-pan-yun-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 114px;
        padding: 5px 0;
        white-space: nowrap;
        font-size: 20px;
        border-right: 2px solid $bg;
      }
      .pro-pan-yun-item-title {
        color: #9e9e9e;
        font-weight: bold;
        line-height: 28px;
      }
      .pro-pan-yun-item-label {
        padding-top: 5px;
        font-size: 0;
      }
      .pro-pan-yun-item-text {
        font-size: 20px;
      }
      .pro-pan-yun-item-shishen {
        color: $fireColor;
        font-size: 16px;
      }
      .pro-pan-yun-item-small {
        font-size: 14px;
      }
      .pro-pan-yun-item-selected {
        font-weight: bold;
        background-color: #dcdcdc;
      }
    }
    .pro-pan-novip {
      width: 100%;
      height: 80px;
      margin-top: 10px;
      line-height: 80px;
      font-size: 20px;
      text-align: center;
      background-color: white;
      .pro-pan-novip-tip {
        color: $mainColor;
      }
    }
    .selectdateblock {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      height: 40px;
      padding: 0 15px;
      line-height: 40px;
      color: #999999;
      font-size: 13px;
      // transform-origin: left top;
      // transform: scale(0.95);
    }
    .pro-pan-wuxing {
      display: flex;
      align-items: center;
      width: 100%;
      height: 28px;
      background-color: $mainColor;
      .pro-pan-wuxing-item {
        flex: 1;
        color: white;
        font-size: 15px;
        text-align: center;
      }
      .pro-pan-wuxing-item:nth-of-type(n + 2) {
        content: '';
        border-left: 1px solid white;
      }
    }
    .pro-pan-tips {
      padding: 11px;
      background-color: white;
      .pro-pan-tips-item {
        display: flex;
        font-size: 15px;
        line-height: 22px;
        &:first-child {
          margin-bottom: 3px;
        }
        .pro-pan-tips-item-title {
          color: $mainColor;
          white-space: nowrap;
        }
        .pro-pan-tips-item-value {
          text-align: left;
        }
      }
    }

    .yunScroll {
      flex: 1;
      width: 400px;
      display: flex;
      overflow-y: hidden;
      overflow-x: auto;
      .pro-pan-yun-item {
        padding: 5px 8px;
      }
    }
  }
}

:deep(.el-scrollbar__view) {
  flex: 1;
  display: flex;
}
</style>
