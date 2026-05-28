<template>
  <div class="paipan-result-box" style="min-width: 1160px">
    <div class="paipan-result-sidebar columnFlex">
      <div class="sidebar-item-first pointer" @click="onGoHome">问真官网</div>
      <div
        class="sidebar-item pointer"
        :class="{ sidebarItemSelected: item.index == sidebarIndex }"
        v-for="item in sidebarList"
        :key="item.index"
        @click="onSidebar(item.index)"
      >
        {{ item.name }}
      </div>
      <EntryH5 :obj="entryPhoneObj" />
    </div>
    <div class="paipan-result-content" v-loading="appMainLoading">
      <div
        class="paipan-result-content-tab"
        :class="{ shiftOut: 0 != sidebarIndex }"
      >
        <BaseMsgBox
          v-if="isLoads[0] && isDataLoad"
          :MRType="MRType"
          :noRizhu="noRizhu"
          :wxData="wxData"
          :infoData="infoData"
          :panDatas="panDatas"
          @goToGanZhiSetting="navTo"
          @changeGJ="changeGJ"
          @DSBJIndex="DSBJIndex"
        />
      </div>
      <div
        class="paipan-result-content-tab"
        :class="{ shiftOut: 1 != sidebarIndex }"
      >
        <BasePanBox
          v-if="isLoads[1] && isDataLoad"
          :MRType="MRType"
          :noRizhu="noRizhu"
          :infoData="infoData"
          :panDatas="panDatas"
          :geju="geju"
          :sidebarIndex="sidebarIndex"
          @onShowDetail="onShowDetail"
          @goToGanZhiSetting="goToGanZhiSetting"
        />
      </div>
      <div
        class="paipan-result-content-tab"
        :class="{ shiftOut: 2 != sidebarIndex }"
      >
        <ProPanBox
          v-if="isLoads[2] && isDataLoad"
          :MRType="MRType"
          :noRizhu="noRizhu"
          :wxData="wxData"
          :infoData="infoData"
          :panDatas="panDatas"
          :yunDatas="yunDatas"
          :todayObj="todayObj"
          :lunarToday="lunarToday"
          :tmsReady="tmsReady"
          :sidebarIndex="sidebarIndex"
          @onShowDetail="onShowDetail"
          @goToGanZhiSetting="goToGanZhiSetting"
          @onTms="onTms"
        />
      </div>
      <div class="paipan-result-content-tab-note" v-if="isLoads[3] && isDataLoad" :class="{ shiftOut: 3 != sidebarIndex }">
        <HeaderItem :MRType="MRType" :infoData="infoData"/>
        <div class="paipan-result-content-tab-note-box" >
          <div class="left">
            <SiZhuBox 
              :MRType="MRType"
              :noRizhu="noRizhu"
              :wxData="wxData"
              :infoData="infoData"
              :panDatas="panDatas"
              :yunDatas="yunDatas"
              :todayObj="todayObj"
              :lunarToday="lunarToday"
            />
            <LiuZhuBox
              :MRType="MRType"
              :noRizhu="noRizhu"
              :wxData="wxData"
              :infoData="infoData"
              :panDatas="panDatas"
              :yunDatas="yunDatas"
              :todayObj="todayObj"
              :lunarToday="lunarToday"
            />
          </div>
          <FeedbackNote class="right" :MRType="MRType" :liuzhuInfos="liuzhuInfos" :dsbjIndex="dsbjIndex" :options="feedbackOptions"/>
        </div>
      </div>
      <div
        class="paipan-result-content-tab"
        :class="{ shiftOut: 4 != sidebarIndex }"
      >
        <SettingsBox :setIndex="setIndex" />
      </div>
    </div>
  </div>
  <DetailDialog
    v-if="keyType && keyName"
    :keyType="keyType"
    :keyName="keyName"
    @onClose="onCloseDetail"
  />
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, toRaw } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import router from '@/router'
import store from '@/store'
import * as homeApi from '../../api/home-api'
import BaseMsgBox from './components/baseMsgBox'
import BasePanBox from './components/basePanBox'
import ProPanBox from './components/proPanBox'
import DetailDialog from './components/detailDialog'
import EntryH5 from '@/layout/components/Sidebar/EntryH5'
import SettingsBox from './components/settingsBox'
import FeedbackNote from '@/views/paipan/components/feedback-note/index.vue'
import HeaderItem from '@/views/paipan-result/components/headerItem.vue'
import SiZhuBox from '@/views/paipan-result/components/sizhuBox.vue'
import LiuZhuBox from '@/views/paipan-result/components/liuzhuBox.vue'

import { getShenSha } from '@/api/bazi.js'
import {
  getShiShenShortName,
  getShiShen,
  getDiZhiCG,
  getYearGZ,
  getWxData,
  getJieqiWithYearAndMonth,
  getJieqiWithYearAndMonth2,
  getShengXiao,
  getShengXiaoIndex,
  initSetting3,
  getXZParmFromSetting3,
  getXZParmFromClient,
  getDateTimeStr,
  get12ChangSheng,
  getZhuKongWang,
  getNayin,
  handleGetSetting,
} from './utils'
import { defaultText } from '@/static'
import { navigationTo, updateLevel } from '@/utils'
import {
  solar2Lunar
} from '@/utils/DateUtils.js'
import {
  getBaseBZ,
  getRysl
} from '@/api/bazi.js'
import {
  getXingXiu,
  getAstro,
  getXZOfEn,
  getMingGua,
} from '@/utils/baseUtils.js'
import { Toast } from 'vant'
import { getNote } from '@/api/note.js'
const route = useRoute()
const appMainLoading = computed(() => store.getters.appMainLoading)
const entryPhoneObj = ref({
  text: '切换手机版',
  icon: require('@/assets/images/icon_change.png'),
  routeName: 'WindowPhone',
  urlTag: 'h5_paipan',
  urlParams: route.query,
})
const dsbjIndex = ref(0)
const MRType = ref(0) // 判断是否从名人库进入
// 个人相关信息
const infoData = reactive({
  name: '',
  sex: 1,
  solarTime: null,
  lunarTime: null,
  address: null,
  sunTime: null,
  jqArr: null,
  shengxiao: '',
  shengxiaoIndex: 1,
  alias: null, // 别名
  peroid: null, // 朝代
  caseGuid: '', // 案例guid
})
const isLoads = reactive([false, false, false]) // 判断子组件加载情况
const isDataLoad = ref(false) // 判断infoData加载情况
const sidebarIndex = ref(1) // 侧边导航栏选中下标
const viplevel = computed(() => store.getters.viplevel)
const userguid = computed(() => store.getters.userguid)
const feedbackOptions = ref({
  headDex: 0,
  sDex: -1,
})

// 侧边导航栏
const sidebarList = [
  {
    index: 0,
    name: '基本信息',
  },
  {
    index: 1,
    name: '基本排盘',
  },
  {
    index: 2,
    name: '专业细盘',
  },
  {
    index: 3,
    name: '断事笔记',
  },
  {
    index: 4,
    name: '设置',
  },
]
// 排盘相关信息
const panDatas = reactive({
  rowTitle: ['年柱', '月柱', '日柱', '时柱'],
  zhuxing: null,
  tiangan: null,
  dizhi: null,
  canggan: null,
  fuxing: null,
  xingyun: null,
  zizuo: null,
  kongwang: null,
  nayin: null,
  shensha: null,
  bazi: null,
  mrbazi: null,
  tdbzArr: null,
  cgArr: null,
  isLiuNian: '1', // 是否显示流年
})
const keyType = ref('') // 关键词类型
const keyName = ref('') // 关键词名
const noRizhu = ref(false) // 判断是否没有日柱
const liuzhuInfos = ref({
  dayuns: [],
  liunians: [],
}) // 流注信息
// 大运、流年、流月之类是数据
const yunDatas = reactive({
  dayunArr: null,
  xiaoyunArr: null,
  liunianArr: null,
  liuyueArr: null,
  liuriArr: null,
  liushiArr: null,
  dyshensha: null,
  lnshensha: null,
  lyshensha: null,
  lrshensha: null,
  lsshensha: null,
  qiyunsui: null, // 起运岁
  qiyunstr: null, // 起运
  jiaoyunstr: null, // 交运
  riKWStr: null, // 司令
})
const dayunCount = 12 // 大运个数
const wxData = reactive(['木旺', '火相', '水休', '金囚', '土死'])
const geju = ref('') // 格局
const todayObj = reactive({
  todayYear: '',
  todayMonth: '',
  todayDay: '',
  todayHour: '',
  todayMinus: '',
  todaySecond: '',
})
const lunarToday = reactive({
  year: '',
  month: '',
  day: ''
})
let res = null
const setIndex = ref(0) // 设置页下标
let tmsReady = ref(false) // 胎命身是否准备好
// 模拟后台返回八字数据
// const res = {
//   sex: 1,
//   bz: {
//     0: '\u58ec',
//     1: '\u5bc5',
//     2: '\u4e19',
//     3: '\u5348',
//     6: '\u4e01',
//     7: '\u672a',
//     4: '\u4e01',
//     5: '\u9149',
//     8: '2022\u5e74\u4e94\u6708\u5341\u4e94 \u672a\u65f6',
//   },
//   tdbz: {
//     0: '\u58ec',
//     1: '\u5bc5',
//     2: '\u4e19',
//     3: '\u5348',
//     6: '\u4e01',
//     7: '\u672a',
//     4: '\u4e01',
//     5: '\u9149',
//     8: '2022\u5e74\u4e94\u6708\u5341\u4e94 \u672a\u65f6',
//   },
//   ss: ['\u6b63\u5b98', '\u52ab\u8d22', '\u65e5\u4e3b', '\u6bd4\u80a9'],
//   cg: [
//     ['\u7532', '\u4e19', '\u620a'],
//     ['\u4e01', '\u5df1'],
//     ['\u8f9b'],
//     ['\u5df1', '\u4e01', '\u4e59'],
//   ],
//   cgss: [
//     ['\u6b63\u5370', '\u52ab\u8d22', '\u4f24\u5b98'],
//     ['\u6bd4\u80a9', '\u98df\u795e'],
//     ['\u504f\u8d22'],
//     ['\u98df\u795e', '\u6bd4\u80a9', '\u504f\u5370'],
//   ],
//   kw: ['\u8fb0\u5df3', '\u5bc5\u536f', '\u8fb0\u5df3', '\u5bc5\u536f'],
//   xy: ['\u6b7b', '\u4e34\u5b98', '\u957f\u751f', '\u51a0\u5e26'],
//   zz: ['\u75c5', '\u5e1d\u65fa', '\u957f\u751f', '\u51a0\u5e26'],
//   ny: [
//     '\u91d1\u7b94\u91d1',
//     '\u5929\u6cb3\u6c34',
//     '\u5c71\u4e0b\u706b',
//     '\u5929\u6cb3\u6c34',
//   ],
//   dayun: [
//     '\u4e01\u672a',
//     '\u620a\u7533',
//     '\u5df1\u9149',
//     '\u5e9a\u620c',
//     '\u8f9b\u4ea5',
//     '\u58ec\u5b50',
//     '\u7678\u4e11',
//     '\u7532\u5bc5',
//     '\u4e59\u536f',
//     '\u4e19\u8fb0',
//   ],
//   xiaoyun: [
//     '\u620a\u7533',
//     '\u5df1\u9149',
//     '\u5e9a\u620c',
//     '\u8f9b\u4ea5',
//     '\u58ec\u5b50',
//     '\u7678\u4e11',
//     '\u7532\u5bc5',
//     '\u4e59\u536f',
//     '\u4e19\u8fb0',
//     '\u4e01\u5df3',
//     '\u620a\u5348',
//     '\u5df1\u672a',
//     '\u5e9a\u7533',
//     '\u8f9b\u9149',
//     '\u58ec\u620c',
//     '\u7678\u4ea5',
//     '\u7532\u5b50',
//     '\u4e59\u4e11',
//     '\u4e19\u5bc5',
//     '\u4e01\u536f',
//     '\u620a\u8fb0',
//     '\u5df1\u5df3',
//     '\u5e9a\u5348',
//     '\u8f9b\u672a',
//     '\u58ec\u7533',
//     '\u7678\u9149',
//     '\u7532\u620c',
//     '\u4e59\u4ea5',
//     '\u4e19\u5b50',
//     '\u4e01\u4e11',
//     '\u620a\u5bc5',
//     '\u5df1\u536f',
//     '\u5e9a\u8fb0',
//     '\u8f9b\u5df3',
//     '\u58ec\u5348',
//     '\u7678\u672a',
//     '\u7532\u7533',
//     '\u4e59\u9149',
//     '\u4e19\u620c',
//     '\u4e01\u4ea5',
//     '\u620a\u5b50',
//     '\u5df1\u4e11',
//     '\u5e9a\u5bc5',
//     '\u8f9b\u536f',
//     '\u58ec\u8fb0',
//     '\u7678\u5df3',
//     '\u7532\u5348',
//     '\u4e59\u672a',
//     '\u4e19\u7533',
//     '\u4e01\u9149',
//     '\u620a\u620c',
//     '\u5df1\u4ea5',
//     '\u5e9a\u5b50',
//     '\u8f9b\u4e11',
//     '\u58ec\u5bc5',
//     '\u7678\u536f',
//     '\u7532\u8fb0',
//     '\u4e59\u5df3',
//     '\u4e19\u5348',
//     '\u4e01\u672a',
//     '\u620a\u7533',
//     '\u5df1\u9149',
//     '\u5e9a\u620c',
//     '\u8f9b\u4ea5',
//     '\u58ec\u5b50',
//     '\u7678\u4e11',
//     '\u7532\u5bc5',
//     '\u4e59\u536f',
//     '\u4e19\u8fb0',
//     '\u4e01\u5df3',
//     '\u620a\u5348',
//     '\u5df1\u672a',
//     '\u5e9a\u7533',
//     '\u8f9b\u9149',
//     '\u58ec\u620c',
//     '\u7678\u4ea5',
//     '\u7532\u5b50',
//     '\u4e59\u4e11',
//     '\u4e19\u5bc5',
//     '\u4e01\u536f',
//     '\u620a\u8fb0',
//     '\u5df1\u5df3',
//     '\u5e9a\u5348',
//     '\u8f9b\u672a',
//     '\u58ec\u7533',
//     '\u7678\u9149',
//     '\u7532\u620c',
//     '\u4e59\u4ea5',
//     '\u4e19\u5b50',
//     '\u4e01\u4e11',
//     '\u620a\u5bc5',
//     '\u5df1\u536f',
//     '\u5e9a\u8fb0',
//     '\u8f9b\u5df3',
//     '\u58ec\u5348',
//     '\u7678\u672a',
//     '\u7532\u7533',
//     '\u4e59\u9149',
//     '\u4e19\u620c',
//     '\u4e01\u4ea5',
//     '\u620a\u5b50',
//     '\u5df1\u4e11',
//     '\u5e9a\u5bc5',
//     '\u8f9b\u536f',
//     '\u58ec\u8fb0',
//     '\u7678\u5df3',
//     '\u7532\u5348',
//     '\u4e59\u672a',
//     '\u4e19\u7533',
//     '\u4e01\u9149',
//   ],
//   qiyunsui: 9,
//   qiyunarr: [7, 11, 9, 23, 38, 9],
//   jiaoyun:
//     '\u9022\u5e9a\u3001\u4e59\u5e74 \u7acb\u590f\u540e17\u5929 \u4ea4\u5927\u8fd0',
//   szshensha: [
//     [
//       '\u6587\u660c\u8d35\u4eba',
//       '\u5929\u53a8\u8d35\u4eba',
//       '\u5929\u5fb7\u5408',
//       '\u56fd\u5370',
//       '\u8bcd\u9986',
//       '\u52ab\u715e',
//     ],
//     [
//       '\u5929\u53a8\u8d35\u4eba',
//       '\u6708\u5fb7\u8d35\u4eba',
//       '\u5fb7\u79c0\u8d35\u4eba',
//       '\u7984\u795e',
//       '\u5c06\u661f',
//       '\u6843\u82b1',
//     ],
//     [
//       '\u5929\u4e59\u8d35\u4eba',
//       '\u592a\u6781\u8d35\u4eba',
//       '\u6587\u660c\u8d35\u4eba',
//       '\u5fb7\u79c0\u8d35\u4eba',
//       '\u5341\u7075\u65e5',
//       '\u4e5d\u4e11',
//       '\u5143\u8fb0',
//     ],
//     [
//       '\u5fb7\u79c0\u8d35\u4eba',
//       '\u7ea2\u8273\u715e',
//       '\u7ae5\u5b50\u715e',
//       '\u56fd\u5370',
//       '\u5929\u559c',
//     ],
//     [],
//   ],
//   dyshensha: [
//     [
//       '\u4e01\u672a',
//       [
//         '\u5fb7\u79c0\u8d35\u4eba',
//         '\u7ea2\u8273\u715e',
//         '\u56fd\u5370',
//         '\u5929\u559c',
//       ],
//     ],
//     [
//       '\u620a\u7533',
//       [
//         '\u592a\u6781\u8d35\u4eba',
//         '\u5fb7\u79c0\u8d35\u4eba',
//         '\u8bcd\u9986',
//         '\u91d1\u8206',
//         '\u6d41\u971e',
//         '\u9a7f\u9a6c',
//         '\u4ea1\u795e',
//       ],
//     ],
//     [
//       '\u5df1\u9149',
//       [
//         '\u5929\u4e59\u8d35\u4eba',
//         '\u592a\u6781\u8d35\u4eba',
//         '\u6587\u660c\u8d35\u4eba',
//         '\u5143\u8fb0',
//         '\u5c06\u661f',
//       ],
//     ],
//     ['\u5e9a\u620c', ['\u534e\u76d6']],
//     [
//       '\u8f9b\u4ea5',
//       [
//         '\u5929\u4e59\u8d35\u4eba',
//         '\u798f\u661f\u8d35\u4eba',
//         '\u5929\u5fb7\u8d35\u4eba',
//         '\u6708\u5fb7\u5408',
//         '\u52ab\u715e',
//         '\u62ab\u9ebb',
//         '\u9a7f\u9a6c',
//       ],
//     ],
//     ['\u58ec\u5b50', ['\u707e\u715e', '\u540a\u5ba2']],
//     [
//       '\u7678\u4e11',
//       [
//         '\u5fb7\u79c0\u8d35\u4eba',
//         '\u91d1\u8206',
//         '\u98de\u5203',
//         '\u5be1\u5bbf',
//         '\u7ea2\u9e3e',
//         '\u534e\u76d6',
//       ],
//     ],
//     [
//       '\u7532\u5bc5',
//       [
//         '\u6587\u660c\u8d35\u4eba',
//         '\u5929\u53a8\u8d35\u4eba',
//         '\u5929\u5fb7\u5408',
//         '\u56fd\u5370',
//         '\u8bcd\u9986',
//         '\u52ab\u715e',
//       ],
//     ],
//   ],
//   runtime: '7ms',
// }

// 返回排盘入口页

// 监听侧边导航栏
const onSidebar = async(index) => {
  dsbjIndex.value = 0
  await store.dispatch('paipan/setNavToFeedback', false)
  localStorage.setItem('navToFeedback', false)
  if (index == sidebarIndex.value) return
  !isLoads[index] ? (isLoads[index] = true) : ''
  sidebarIndex.value = index
}
// 选中关键词打开详情介绍
const onShowDetail = (type, item) => {
  keyType.value = type
  keyName.value = item
}
// 关闭详情框
const onCloseDetail = () => {
  keyType.value = ''
  keyName.value = ''
}
// 初始化节气数据
const initJieQi = () => {
  const bornyear = +infoData.solarTime[0]
  const bornmonth = +infoData.solarTime[1]
  const jq1 = getJieqiWithYearAndMonth(bornyear, bornmonth)
  const jq2 = getJieqiWithYearAndMonth2(bornyear, bornmonth)
  const jqArr = ['', '']
  jqArr[0] = jq1[1] + ':' + jq1[0] + ' ' + jq1[2]
  jqArr[1] = jq2[1] + ':' + jq2[0] + ' ' + jq2[2]
  infoData.jqArr = jqArr
}
// 初始化生肖
const initShengxiao = () => {
  infoData.shengxiao = getShengXiao(panDatas.bazi[1])
  infoData.shengxiaoIndex = getShengXiaoIndex(panDatas.bazi[1]) + 1
}
// 初始化排盘数据
const initPan = () => {
  const zhuxing = [
    res.ss[0],
    res.ss[1],
    infoData.sex == 1 ? '元男' : '元女',
    res.ss[3],
  ]
  const tiangan = [res.bz[0], res.bz[2], res.bz[4], res.bz[6]]
  const dizhi = [res.bz[1], res.bz[3], res.bz[5], res.bz[7]]
  const canggan = [res.cg[0], res.cg[1], res.cg[2], res.cg[3]]
  const fuxing = [res.cgss[0], res.cgss[1], res.cgss[2], res.cgss[3]]
  const xingyun = [res.xy[0], res.xy[1], res.xy[2], res.xy[3]]
  const zizuo = [res.zz[0], res.zz[1], res.zz[2], res.zz[3]]
  const kongwang = [res.kw[0], res.kw[1], res.kw[2], res.kw[3]]
  const nayin = [res.ny[0], res.ny[1], res.ny[2], res.ny[3]]
  const shensha = [
    res.szshensha[0],
    res.szshensha[1],
    res.szshensha[2],
    res.szshensha[3],
  ]

  panDatas.zhuxing = zhuxing
  panDatas.tiangan = tiangan
  panDatas.dizhi = dizhi
  panDatas.canggan = canggan
  panDatas.fuxing = fuxing
  panDatas.xingyun = xingyun
  panDatas.zizuo = zizuo
  panDatas.kongwang = kongwang
  panDatas.nayin = nayin
  panDatas.shensha = shensha
  panDatas.bazi = res.bz //干支
  panDatas.tdbzArr = res.tdbz
  panDatas.cgArr = res.cg // 藏干
}
// 初始化大运之类的数据
const initYun = async () => {
  const bornYear = +infoData.solarTime[0]
  const qiyunsui = res.qiyunsui
  const bazi = res.bz
  const xiaoyun = res.xiaoyun

  // 初始化大运
  const dayunArr = []
  for (let i = 0; i < res.dayun.length && i < dayunCount; i++) {
    let dayungz = res.dayun[i]
    let dayunitem = new Array(5).fill(null)
    dayunitem[0] = dayungz[0]
    dayunitem[1] = dayungz[1]
    dayunitem[2] = getShiShenShortName(getShiShen(dayungz[0], bazi[4]))
    dayunitem[3] = getShiShenShortName(
      getShiShen(getDiZhiCG(dayungz[1])[0], bazi[4]),
    )
    if (panDatas.selectedAge === 0) {
      dayunitem[4] = qiyunsui + i * 10
    } else {
      dayunitem[4] = qiyunsui + i * 10 - 1
    }
    dayunitem[5] = qiyunsui + i * 10 + bornYear - 1
    dayunArr.push(dayunitem)
  }
  yunDatas.dayunArr = dayunArr
  yunDatas.qiyunsui = qiyunsui

  // 初始化小运
  const xiaoyunArr = []
  for (let i = 0; i < xiaoyun.length; i++) {
    let xiaoyungz = xiaoyun[i]
    let xiaoyunitem = new Array(5).fill(null)
    xiaoyunitem[0] = xiaoyungz[0]
    xiaoyunitem[1] = xiaoyungz[1]
    if (panDatas.selectedAge === 0) {
      xiaoyunitem[4] = 1 + '~' + (qiyunsui - 1)
    } else {
      xiaoyunitem[4] = 0 + '~' + (qiyunsui - 2)
    }
    // xiaoyunitem[4] = 1 + '~' + (qiyunsui - 1)
    xiaoyunitem[5] = bornYear
    xiaoyunArr.push(xiaoyunitem)
  }
  yunDatas.xiaoyunArr = xiaoyunArr

  // 初始化流年
  const liunianArr = []
  let dayunYears0 = []
  for (let i = bornYear; i < bornYear + qiyunsui - 1; i++) {
    let tmpgz = getYearGZ(i)
    var ss1 = getShiShenShortName(getShiShen(tmpgz[0], bazi[4]))
    var ss2 = getShiShenShortName(getShiShen(getDiZhiCG(tmpgz[1])[0], bazi[4]))
    var xiaoyunstr = xiaoyun[i - bornYear]
    dayunYears0.push([tmpgz, i, ss1, ss2, xiaoyunstr])
  }
  liunianArr.push(dayunYears0)
  for (let i = 0; i < dayunCount; i++) {
    let yearcount = 10
    let dayunYears = []
    for (let j = 0; j < yearcount; j++) {
      let tmpyear = bornYear + (qiyunsui - 1) + i * 10 + j
      let tmpgz = getYearGZ(tmpyear)

      var ss1 = getShiShenShortName(getShiShen(tmpgz[0], bazi[4]))
      var ss2 = getShiShenShortName(
        getShiShen(getDiZhiCG(tmpgz[1])[0], bazi[4]),
      )
      var xiaoyunstr = xiaoyun[qiyunsui - 1 + i * 10 + j]
      dayunYears.push([tmpgz, tmpyear, ss1, ss2, xiaoyunstr])
    }
    liunianArr.push(dayunYears)
  }
  yunDatas.liunianArr = liunianArr

  // 添加大运神煞数据
  yunDatas.dyshensha = res.dyshensha

  // 添加起运、交运
  if (panDatas.isLiuNian == 0) {
    yunDatas.qiyunstr = '*'
    yunDatas.jiaoyunstr = '*'
  } else {
    const qiyunArr = res.qiyunarr
    yunDatas.qiyunstr = noRizhu.value
      ? '*'
      : '出生后' +
        qiyunArr[0] +
        '年' +
        qiyunArr[1] +
        '月' +
        qiyunArr[2] +
        '天' +
        qiyunArr[3] +
        '时起运'

    yunDatas.jiaoyunstr = noRizhu.value ? '*' : res.jiaoyun
  }

  // 添加司令
  yunDatas.riKWStr = res.kw[2]

  // 初始化五行旺度
  const wxData2 = getWxData(panDatas.bazi[3])
  for (let i = 0; i < wxData.length; i++) {
    wxData[i] = wxData2[i]
  }

  //初始化断是笔记流注信息
  let yunDatasTmp = JSON.parse(JSON.stringify(yunDatas))
  let dayunItems = []
  let liunianItems = []
  yunDatasTmp.dayunArr.forEach((item,index) => {
    dayunItems.push(item[5] + '年' + ' ' + item[0] + item[1] + '大运')
  })

  console.log('yunDatasTmp',yunDatasTmp);

  yunDatasTmp.liunianArr.forEach((item,index) => {
    item.forEach((liunian,dex) => {
      liunianItems.push(liunian[1] + '年' + ' ' + liunian[0])
    })
  })

  liuzhuInfos.value = {
    dayuns: dayunItems,
    liunians: liunianItems
  }
}
// 初始化当前时间
const initToday = () => {
  const now = new Date()
  todayObj.todayYear = now.getFullYear()
  todayObj.todayMonth = now.getMonth() + 1
  todayObj.todayDay = now.getDate()
  todayObj.todayHour = now.getHours()
  todayObj.todayMinus = now.getMinutes()
  todayObj.todaySecond = now.getSeconds()

  const lunarInfo = solar2Lunar(todayObj.todayYear, todayObj.todayMonth, todayObj.todayDay)
  lunarToday.year = lunarInfo[0]
  lunarToday.month = lunarInfo[1]
  lunarToday.day = lunarInfo[2]
}
// 重置数据
const resetDatas = () => {
  // 重置个人信息
  infoData.name = ''
  infoData.sex = 1
  infoData.solarTime = null
  infoData.lunarTime = null
  infoData.address = null
  infoData.sunTime = null
  infoData.jqArr = null
  infoData.shengxiao = ''
  infoData.shengxiaoIndex = 1
  infoData.alias = null
  infoData.peroid = null
  infoData.caseGuid = ''
  // 重置排盘相关数据
  panDatas.rowTitle = ['年柱', '月柱', '日柱', '时柱']
  panDatas.zhuxing = null
  panDatas.tiangan = null
  panDatas.dizhi = null
  panDatas.canggan = null
  panDatas.fuxing = null
  panDatas.xingyun = null
  panDatas.zizuo = null
  panDatas.kongwang = null
  panDatas.nayin = null
  panDatas.shensha = null
  panDatas.bazi = null
  panDatas.mrbazi = null
  panDatas.tdbzArr = null
  panDatas.cgArr = null
  panDatas.isLiuNian = 1
  // 重置大运相关数据
  yunDatas.dayunArr = null
  yunDatas.xiaoyunArr = null
  yunDatas.liunianArr = null
  yunDatas.liuyueArr = null
  yunDatas.liuriArr = null
  yunDatas.liushiArr = null
  yunDatas.dyshensha = null
  yunDatas.lnshensha = null
  yunDatas.lyshensha = null
  yunDatas.lrshensha = null
  yunDatas.lsshensha = null
  yunDatas.qiyunsui = null
  yunDatas.qiyunstr = null
  yunDatas.jiaoyunstr = null
  yunDatas.riKWStr = null
}
// 返回首页
const onGoHome = () => {
  navigationTo({ path: '/', isBlank: true })
}

const navTo = (index) => {
  if(index == 3){
    onSidebarByFeedback(3)
  }else{
    onSidebar(index)
    if(index == 4) setIndex.value = 5
  }
}

const onSidebarByFeedback = async(index) => {
  localStorage.setItem('navToFeedback', true)
  await store.dispatch('paipan/setNavToFeedback', true)
  feedbackOptions.value = {
    headDex: 1,
    sDex: 0,
  }
  console.log("menu1Opens000",feedbackOptions);
   if (index == sidebarIndex.value) return
  !isLoads[index] ? (isLoads[index] = true) : ''
  sidebarIndex.value = index
  dsbjIndex.value = 1
}

// 跳转到干支设置
const goToGanZhiSetting = () => {
  onSidebar(4)
  setIndex.value = 0
}

const onTms = async (isShowTMS) => {
  // if (viplevel.value > 0) {
  //   await updateLevel()
  // }
  if (!isShowTMS) {
    tmsReady.value = false
    return
  }
  const tiangan = panDatas.tiangan.slice(-4),
    dizhi = panDatas.dizhi.slice(-4),
    canggan = panDatas.canggan.slice(-4),
    xingyun = panDatas.xingyun.slice(-4),
    zizuo = panDatas.zizuo.slice(-4),
    kongwang = panDatas.kongwang.slice(-4),
    nayin = panDatas.nayin.slice(-4),
    zhuxing = panDatas.zhuxing.slice(-4),
    rowTitle = panDatas.rowTitle.slice(-4),
    fuxing = panDatas.fuxing.slice(-4),
    shensha = panDatas.shensha.slice(-4)
  let tiangan_tms = [panDatas.shenggong[0], panDatas.minggong[0], panDatas.taiyuan[0]],
    dizhi_tms = [panDatas.shenggong[1], panDatas.minggong[1], panDatas.taiyuan[1]],
    canggan_tms = [],
    xingyun_tms = [],
    zizuo_tms = [],
    kongwang_tms = [],
    nayin_tms = [],
    zhuxing_tms = [],
    rowTitle_tms = ['身宫', '命宫', '胎元'],
    fuxing_tms = [],
    shensha_tms = []
  tiangan_tms.forEach(async (item, index) => {
    zhuxing_tms.push(getShiShen(item, tiangan[2]))
    kongwang_tms.push(getZhuKongWang(item, dizhi_tms[index]))
    xingyun_tms.push(get12ChangSheng(tiangan[2], dizhi_tms[index]))
    zizuo_tms.push(get12ChangSheng(item, dizhi_tms[index]))
    canggan_tms.push(getDiZhiCG(dizhi_tms[index]))
    nayin_tms.push(getNayin(item + dizhi_tms[index]))
  })
  for (let i = 0; i < 3; i++) {
    const ln = tiangan_tms[i] + dizhi_tms[i]
    let bz = ""
    for (let i = 0; i < 8; i++) {
      bz += panDatas.bazi[i] + " "
    }
    // 去掉最后一个空格
    bz = bz.substring(0, bz.length - 1)
    const res = await getShenSha({
      bz: bz,
      ln: ln,
      sex: infoData.sex,
      vip: viplevel.value,
      userguid: userguid.value,
    })
    shensha_tms.push(res.shensha[1])
  }
  canggan_tms.forEach((item, index) => {
    let items = []
    item.forEach((item2, index2) => {
      items.push(getShiShen(item2, tiangan[2]))
    })
    fuxing_tms.push(items)
  })
  tiangan_tms = tiangan_tms.concat(tiangan)
  dizhi_tms = dizhi_tms.concat(dizhi)
  // canggan_tms = canggan_tms.concat(canggan)
  canggan_tms = canggan_tms.concat(canggan.map(item => toRaw(item)))
  zhuxing_tms = zhuxing_tms.concat(zhuxing)
  kongwang_tms = kongwang_tms.concat(kongwang)
  xingyun_tms = xingyun_tms.concat(xingyun)
  zizuo_tms = zizuo_tms.concat(zizuo)
  nayin_tms = nayin_tms.concat(nayin)
  rowTitle_tms = rowTitle_tms.concat(rowTitle)
  fuxing_tms = fuxing_tms.concat(fuxing)
  shensha_tms = shensha_tms.concat(shensha.map(item => toRaw(item)))
  panDatas.tiangan_tms = tiangan_tms
  panDatas.dizhi_tms = dizhi_tms
  panDatas.zhuxing_tms = zhuxing_tms
  panDatas.canggan_tms = canggan_tms
  panDatas.kongwang_tms = kongwang_tms
  panDatas.xingyun_tms = xingyun_tms
  panDatas.zizuo_tms = zizuo_tms
  panDatas.nayin_tms = nayin_tms
  panDatas.rowTitle_tms = rowTitle_tms
  panDatas.fuxing_tms = fuxing_tms
  panDatas.shensha_tms = shensha_tms
  tmsReady.value = true
}

onMounted(async () => {
  console.log("排盘咯",viplevel.value);
  if (store.getters.sidebarIndex != 1) {
    await store.dispatch('page/setSidebarIndex', 1)
  }
  await store.dispatch('page/setAppMainLoading', true)
  // 初始化
  // if (viplevel.value > 0) {
    
  // }
  await updateLevel()
    console.log("排盘咯1",viplevel.value);

  const query = route.query
  console.log('query', query)
  if (query.MRType) {
    MRType.value = +query.MRType
  } else {
    MRType.value = 0
  }
  if(query.guid){
    infoData.caseGuid = query.guid
  }
  console.log('infoData', infoData)
  infoData.name = query.name || '*'
  infoData.sex = query.sex == 2 ? 0 : query.sex || 1
  infoData.solarTime = query.solarTime
  infoData.sunTime = query.sunTime
  infoData.address = route.query.address || route.query.location || '*'
  MRType.value != 1 ? (infoData.sunTime = query.sunTime) : ''
  if (MRType.value == 1) {
    infoData.alias = query.alias || '*'
    infoData.peroid = query.peroid || '*'
    panDatas.isLiuNian = query.isLiuNian || 1
  }
  document.title = infoData.name // 设置页面标题
  initToday()
  await getBaseBZ({
    d: `${MRType.value == 1 ? infoData.solarTime[0] : infoData.sunTime[0]
      }-${MRType.value == 1 ? infoData.solarTime[1] : infoData.sunTime[1]}-${
        MRType.value == 1 ? infoData.solarTime[2] : infoData.sunTime[2]
      } ${MRType.value == 1 ? infoData.solarTime[3] : infoData.sunTime[3]}:${
      MRType.value == 1 ? infoData.solarTime[4] : infoData.sunTime[4]}:00`,
    s: infoData.sex,
    today: `${todayObj.todayYear}-${todayObj.todayMonth}-${todayObj.todayDay
      } ${todayObj.todayHour}:${todayObj.todayMinus}:${todayObj.todaySecond}`,
    yzs: localStorage.getItem('setting_midnight') || 0,
    vip: viplevel.value,
    userguid: userguid.value
  }).then(result => {
    res = result
  }).catch(async (err) => {
    ElMessage.error('获取八字数据失败！')
    await store.dispatch('page/setAppMainLoading', false)
    return
  })
  infoData.lunarTime = query.lunarTime || res.bz[8]
  initPan()
  if (MRType.value == 1 && query.tg && query.dz) {
    const tg = query.tg
    const dz = query.dz
    const bazi = []
    panDatas.tiangan.length = 0
    panDatas.dizhi.length = 0
    for (let i = 0; i < 4; i++) {
      bazi.push(tg[i], dz[i])
      panDatas.tiangan.push(tg[i])
      panDatas.dizhi.push(dz[i])
    }
    panDatas.bazi = bazi
    panDatas.mrbazi = res.bz // 名人库出生日期获取的新八字
    noRizhu.value =
      tg[3] == '*' ||
      dz[3] == '*' ||
      tg[3] == defaultText ||
      dz[3] == defaultText
  }
  // initYun()
  initJieQi()
  initShengxiao()
  //新栏目新增字段
  panDatas.taixi = res.taixi
  panDatas.taixi_nayin = res.taixi_nayin
  panDatas.taiyuan = res.taiyuan
  panDatas.taiyuan_nayin = res.taiyuan_nayin
  panDatas.shenggong = res.shenggong 
  panDatas.shenggong_nayin = res.shenggong_nayin
  panDatas.minggong = res.minggong
  panDatas.minggong_nayin = res.minggong_nayin
  //infoData新增编辑时间弹窗字段
  infoData.typeId = query.typeId || '00000000-0000-0000-0000-000000000000'
  infoData.lunarArr = query.lunarArr || JSON.stringify([])
  infoData.xls = query.xls || 0
  infoData.unknowhour = query.unknowhour || 0
  console.log("query22222",query);
  
  let rysl = ''
  let settingRysl = JSON.parse(localStorage.getItem("setting_rysl")) || {
    switch: true, selected: 0
  }
    let flag = settingRysl.selected
    let ryslRes = await getRysl(getDateTimeStr(infoData.sunTime), flag)
    if(ryslRes.code == 0){
    rysl = ryslRes.data
  }
  
  panDatas.rysl = rysl
  const jqArr = ['*', '']
  let jqInfo = ''
  let jqStrArr = []
if (infoData.unknowhour && infoData.unknowhour != 1 && infoData.sunTime) {  
          const curDate = new Date(infoData.sunTime[0], infoData.sunTime[1] - 1, infoData.sunTime[2], infoData.sunTime[3], infoData.sunTime[4], 0)
          const datetimeArr = infoData.sunTime.reduce((acc, cur, index) => {
            const arr = cur.split(index === 0 ? '-' : ':').map(item => parseInt(item))
            acc.push(...arr)
            return acc
          }, [])
          let jq1 = getJieqiWithYearAndMonth(datetimeArr[0], datetimeArr[1]),
            jq2
          if (new Date(`${jq1[0].replace(/-/g, '/')} ${jq1[2]}`).getTime() > curDate.getTime()) {
            jq2 = jq1
            let _m = datetimeArr[1] - 1,
              _y = datetimeArr[0]
            if (_m <= 0) {
              _y--
              _m = 12
            }
            jq1 = getJieqiWithYearAndMonth(_y, _m)
          } else {
            let _m = datetimeArr[1] + 1,
              _y = datetimeArr[0]
            if (_m > 12) {
              _y++
              _m = 1
            }
            jq2 = getJieqiWithYearAndMonth(_y, _m)
          }
          if (jq1[0] && jq1[1])
            jqArr[0] = jq1[1] + "：" + jq1[0] + " " + jq1[2] + ""
          if (jq2[0] && jq2[1])
            jqArr[1] = jq2[1] + "：" + jq2[0] + " " + jq2[2] + ""
          console.log("jq1、jq2",jq1, jq2);
          //将时间字符串2024-12-6 23:16:47转换为时间数组[2024,12,6,23,16,47]
          
          // const jqDate1 = new Date(jq1[0].split('-').join + ' ' + jq1[2]),
            // jqDate2 = new Date(jq2[0].replace(/-/g, '-') + ' ' + jq2[2])

          const date1Array = jq1[0].split('-').map(Number); // 使用 map(Number) 将字符串转换为数字
          const time1Array = jq1[2].split(':').map(Number); // 使用 map(Number) 将字符串转换为数字  
          const date2Array = jq2[0].split('-').map(Number); // 使用 map(Number) 将字符串转换为数字
          const time2Array = jq2[2].split(':').map(Number); // 使用 map(Number) 将字符串转换为数字  
          const jqDate1 = new Date(date1Array[0],Number(date1Array[1])-1,date1Array[2],time1Array[0],time1Array[1],time1Array[2]);
          const jqDate2 = new Date(date2Array[0],Number(date2Array[1])-1,date2Array[2],time2Array[0],time2Array[1],time2Array[2]);
          console.log("jqDate1、jqDate2",jqDate1.getTime(), jqDate2.getTime(),curDate.getTime());

          let d1 = Math.floor((curDate.getTime() - jqDate1.getTime()) / 3600000),
            d2 = Math.floor((jqDate2.getTime() - curDate.getTime()) / 3600000)
          let r1 = d1 % 24,
            r2 = d2 % 24
          d1 = Math.floor(d1 / 24)
          d2 = Math.floor(d2 / 24)
          // console.log(jq1[0].replace(/-/g, '/') + ' ' + jq1[2]);
          // console.log(infoData.sunTime.replace(/-/g, '/'));
          // console.log(jq2[0].replace(/-/g, '/') + ' ' + jq2[2]);
          // console.log(jqDate1.toJSON(), jqDate2.toJSON(), curDate.toJSON());
          // console.log(d1, d2);
          // jqStrArr = `${d1}天${r1}小时，${jq2[1]}前${d2}天${r2}小时`
          jqInfo = [
            jq1[1], //出生节气
            [d1, r1], //出生后d1天r1小时
            jq2[1], //下一个节气
            [d2, r2]  //下一个节气前d2天r2小时
          ]
          // `出生于${jq1[1]}后${d1}天${r1}小时${jq2[1]}前${d2}天${r2}小时`
          console.log("jqInfo",jqInfo);
          
          infoData.xingxiu = getXingXiu(...datetimeArr.slice(0, 3))
        } else {
          const datetimeArr2 = infoData.sunTime.reduce((acc, cur, index) => {
            const arr = cur.split(index === 0 ? '-' : ':').map(item => parseInt(item))
            acc.push(...arr)
            return acc
          }, [])
          jqArr[0] = '**'
          jqStrArr.push('*')
          infoData.xingxiu = getXingXiu(...datetimeArr2.slice(0, 3))
          jqInfo = ['**', [0, 0], '**', [0, 0]]
        }
        infoData.jqArr = jqArr
        infoData.jqArr1 = infoData.unknowhour == 1 ? ['**'] : jqArr[0].split('：')
        infoData.jqArr2 = infoData.unknowhour == 1 ? ['**'] : jqArr[1].split('：')
        infoData.jqInfo = jqInfo

        //----------------------end-------------------------
  let setting3 = initSetting3() //调用初始化函数
  let xzResult = await getXZParmFromSetting3(
    setting3,
    MRType.value == 1 ? panDatas.mrbazi : panDatas.bazi,
  ) //拿到小真智能的系统提示
  let contentObj = JSON.parse(getXZParmFromClient(xzResult)) //得到一个小真的智能提示对象
  if (contentObj) {
    // 获取格局
    geju.value = contentObj.gjItems.split(',')[0]
  }
  const note = await getNote(infoData.caseGuid)
  if (note.code === 0 && note.data && note.data.bzData) {
    const bzData = JSON.parse(note.data.bzData)
    if (bzData[1].data) {
      geju.value = bzData[1].data
    }
  }
  isDataLoad.value = true
  isLoads[sidebarIndex.value] = true

  await store.dispatch('page/setAppMainLoading', false)
  await handleGetSetting()
  const setting_rysl = JSON.parse(localStorage.getItem('setting_rysl')) || { switch: true, selected: 0 }
  panDatas.isShowRYSL = setting_rysl.switch
  const setting_age = JSON.parse(localStorage.getItem('setting_age')) || false
  panDatas.selectedAge = setting_age ? 1 : 0
  initYun()
  // if (infoData.unknowhour) {
  //   noRizhu.value = true
  // } else {
  //   noRizhu.value = false
  // }
})
onUnmounted(async () => {
  sidebarIndex.value = 1
  isDataLoad.value = false
  onCloseDetail()
  resetDatas()
  await store.dispatch('page/setAppMainLoading', false)
})
const changeGJ = (name) => {
  geju.value = name
}
const DSBJIndex = (index) => {
  dsbjIndex.value = index
}
</script>

<style lang="scss" scoped>
$borderRadius: 10px;
.paipan-result-box {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  margin-top: 32px;
  width: 1350px;
  // padding-top: 32px;
  display: flex;
  justify-content: space-between;
  // ::-webkit-scrollbar {
  //   width: 10px;
  //   height: 5px;
  // }
  // :hover::-webkit-scrollbar-thumb {
  //   border-radius: 30px;
  //   box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  //   background: #dedfe1;
  // }
  .paipan-result-sidebar {
    position: sticky;
    top: 32px;
    // flex: 1;
    // max-width: 183px;
    // min-width: 120px;
    width: 161px;
    height: 100%;
    white-space: nowrap;
    .sidebar-item-first,
    .sidebar-item {
      color: rgba(131, 131, 131, 100);
      font-size: 18px;
      background-color: white;
    }
    .sidebar-item-first {
      height: 87px;
      margin-bottom: 18px;
      line-height: 87px;
      border-radius: $borderRadius;
    }
    .sidebar-item {
      height: 71px;
      line-height: 71px;
      border-bottom: 1px solid rgba(244, 244, 244, 100);
      &:nth-of-type(2) {
        border-top-left-radius: $borderRadius;
        border-top-right-radius: $borderRadius;
      }
      &:nth-of-type(5) {
        border: none;
        border-bottom-left-radius: $borderRadius;
        border-bottom-right-radius: $borderRadius;
      }
      &:nth-of-type(6) {
        border: none;
        border-radius: $borderRadius;
        margin-top: 15px;
      }
    }
    .sidebar-item-first:hover,
    .sidebar-item:hover {
      color: $mainColor;
    }
    .sidebarItemSelected {
      color: $mainColor;
    }
  }
  .paipan-result-content {
    // min-width: 1025px;
    // margin-left: 21px;
    width: 1170px;
    border-radius: 15px;
    background-color: white;
    .paipan-result-content-tab {
      width: 100%;
      height: 100%;
    }
    .paipan-result-content-tab-note {
      display: flex;
      flex-direction: column;
      width: 100%;
      .paipan-result-content-tab-note-box {
        display: flex;
        width: 100%;
        // height: 970px;
        height: auto;
        padding: 24px 13px;
        .left {
          display: flex;
          flex-direction: column;
          width: 52%;
          // height: 1028px;
          height: 1048px;
          // height: 100%;
          background-color: white;
          margin-right: 12px;
          //padding: 10px;
          flex: 1;
        }
        .right {
          width: 512px;
          // height: 100%;
          // height: 1028px;
          height: 1048px;
          // overflow-y: auto;
          //background-color: #f5f5f5;
        }
      }
    }
  }
}

::v-deep .entryh5-root {
  margin-top: 15px;
  border-radius: $borderRadius;
  border: none;
  background-color: white;
  padding: 30px 20px;
  color: #878787;
  & > img {
    width: 18px;
    height: 18px;
  }

  & > span {
    font-size: 18px;
  }
}
</style>
