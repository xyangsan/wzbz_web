<template>
  <div class="container">
    <HeaderItem :MRType="MRType" :infoData="infoData" />
    <div class="base-msg-box">
      <!-- 基本信息 -->
      <div class="base-msg-content">
        <div
          class="base-msg-content-row"
          v-for="(item, index) in baseMsgData.leftDatas"
          :key="index"
        >
        <!-- v-if="!item.title.includes('**') " -->
          <div class="base-msg-content-row-left" >
            <div class="base-msg-content-row-title paipanTitleColor">
              {{ item.title }}
            </div>
            <!-- unknowhour处理后 -->
            <!-- <div
              class="base-msg-content-row-value"
              :title="item.value.length > 20 ? item.value : null"
            >
              {{ item.value.includes('NaN')? '**': item.value }}
            </div> -->
            <div
              class="base-msg-content-row-value"
              :title="item.value.length > 20 ? item.value : null"
            >
              {{ item.value }}
            </div>
            <!-- unknowhour处理前 -->
          </div>
          <!--v-if="baseMsgData.rightDatas[index] && baseMsgData.rightDatas[index].title" -->
          <div
            class="base-msg-content-row-right"
            v-if="baseMsgData.rightDatas[index]"
          >

            <!-- unknowhour处理后 -->
            <div class="base-msg-content-row-title paipanTitleColor" :style="baseMsgData.rightDatas[index].title?'backgroundColor:transparent': ''">
              {{ baseMsgData.rightDatas[index].title? baseMsgData.rightDatas[index].title: '**' }}
            </div>
            <div class="base-msg-content-row-value" v-if="index != 3">
              {{ baseMsgData.rightDatas[index].value.includes('NaN')? '**': baseMsgData.rightDatas[index].value }}
            </div>
            <div class="base-msg-content-row-value" v-if="index == 3 && infoData.unknowhour == 0 && baseMsgData.rightDatas[index].value[0] != '**'">
              <span>出生于{{baseMsgData.rightDatas[index].value[0]}}后</span>
              <span style="color:#c21818">{{baseMsgData.rightDatas[index].value[1][0]}}</span>
              <span>天{{baseMsgData.rightDatas[index].value[1][1]}}小时，</span>
              <span>{{baseMsgData.rightDatas[index].value[2]}}前</span>
              <span style="color:#c21818">{{baseMsgData.rightDatas[index].value[3][0]}}</span>
              <span>天{{baseMsgData.rightDatas[index].value[3][1]}}小时</span>
            </div>
            <div class="base-msg-content-row-value"  v-if="index == 3 && infoData.unknowhour == 0 && baseMsgData.rightDatas[index].value[0] == '**'">
                <span>**</span>
            </div>
            <!-- unknowhour处理后 -->

            <!-- unknowhour处理前 -->
             <!-- <div class="base-msg-content-row-title paipanTitleColor">
              {{ baseMsgData.rightDatas[index].title }}
            </div>
            <div class="base-msg-content-row-value" v-if="index != 3">
              {{ baseMsgData.rightDatas[index].value }}
            </div>
            <div class="base-msg-content-row-value" v-if="index == 3">
                <span>出生于{{baseMsgData.rightDatas[index].value[0]}}后</span>
                <span style="color:#c21818">{{baseMsgData.rightDatas[index].value[1][0]}}</span>
                <span>天{{baseMsgData.rightDatas[index].value[1][1]}}小时，</span>
                <span>{{baseMsgData.rightDatas[index].value[2]}}前</span>
                <span style="color:#c21818">{{baseMsgData.rightDatas[index].value[3][0]}}</span>
                <span>天{{baseMsgData.rightDatas[index].value[3][1]}}小时</span>
            </div> -->
            <!-- unknowhour处理前 -->
          </div>
        </div>
      </div>
      <div class="base-msg-center">
        <!-- 小真智能系统 -->
        <div class="base-msg-xiaozhen">
          <div class="base-msg-xiaozhen-title">
            <img
              class="base-msg-xiaozhen-title-icon"
              :src="require('@/assets/images/xiaozhen_icon.png')"
              alt="小真智能图标"
            />
            <span>小真智能系统</span>
          </div>
          <div class="base-msg-xiaozhen-rizhu">
            <div
              class="base-msg-xiaozhen-rizhu-item"
              v-for="(item, index) in rizhuDatas"
              :key="index"
            >
              <div class="base-msg-xiaozhen-rizhu-item-title">
                {{ item.title }}：
              </div>
              <div
                v-if="index == 0 || viplevel > 0"
                class="base-msg-xiaozhen-rizhu-item-value pointer"
                @click="onRiZhuItemClick(index)"
              >
                {{ noRizhu ? '*' : item.value }}
              </div>
              <img
                v-else
                class="base-msg-xiaozhen-rizhu-novip-icon"
                :src="novipIcon"
                alt="novipIcon"
              />
            </div>
          </div>
          <div class="base-msg-xiaozhen-progress">
            <div :class="{ glassClass: viplevel < 1 || noRizhu }"></div>
            <img
              v-if="viplevel < 1"
              class="base-msg-xiaozhen-progress-novip-icon"
              :src="novipIcon"
              alt="novipIcon"
            />
            <span
              class="base-msg-xiaozhen-progress-left"
              :style="{ width: mywx + '%' }"
            >
              {{ mywx }}%
            </span>
            <span
              class="base-msg-xiaozhen-progress-right"
              :style="{ width: otherwx + '%' }"
            >
              {{ otherwx }}%
            </span>
          </div>
        </div>
        <!-- 五行能量 -->
        <div class="base-msg-wuxingbar">
          <div class="base-msg-wuxingbar-tabs">
            <img
              class="base-msg-wuxingbar-tabs-icon"
              :src="require('@/assets/images/vipicon3.png')"
              alt="vip_icon"
            />
            <div
              class="base-msg-wuxingbar-tabs-item pointer"
              :class="{ tabsItemSelected: wxTabIndex == 0 }"
              @click="onChangeWxType(0)"
            >
              五行能量
            </div>
            <div
              class="base-msg-wuxingbar-tabs-item pointer"
              :class="{ tabsItemSelected: wxTabIndex == 1 }"
              @click="onChangeWxType(1)"
            >
              五行个数
            </div>
            <div
              class="base-msg-wuxingbar-tabs-item pointer"
              :class="{ tabsItemSelected: wxTabIndex == 2 }"
              @click="onChangeWxType(2)"
            >
              含藏干数
            </div>
          </div>
          <div
            v-if="viplevel < 1 && wxTabIndex == 0"
            class="base-msg-wuxingbar-novip columnFlex"
          >
            <div class="base-msg-wuxingbar-novip-tip">
              五行能量综合计算了五行个数、干支比重、藏干深浅、宫位力量、刑冲破害合等因素影响后的量化结果，是喜用神判断的重要参考指标
            </div>
            <div
              class="base-msg-wuxingbar-novip-button pointer"
              @click="onToVip"
            >
              开通VIP会员
            </div>
          </div>
          <div
            class="base-msg-wuxingbar-item"
            v-for="(item, index) in wuxingDatas"
            :key="index"
          >
            <div class="base-msg-wuxingbar-item-tip">{{ item.wx }}</div>
            <div class="base-msg-wuxingbar-item-progress">
              <div
                class="base-msg-wuxingbar-item-progressed"
                :style="{
                  width: item.width + '%',
                  backgroundColor: getColorOfWx(item.wx),
                }"
              ></div>
            </div>
            <div class="base-msg-wuxingbar-item-value">
              {{ item.value }}{{ wxunit }} {{ item.ssValue }}
            </div>
          </div>
        </div>
      </div>
      <!-- 五行 -->
      <div class="base-msg-wuxing">
        <div class="base-msg-wuxing-item" v-for="item in wxData" :key="item">
          <span>{{ item }}</span>
          <img class="wuxingIcon" :src="getWXIcon(item[0])" alt="五行图标" />
        </div>
      </div>
      <!-- 袁天罡称骨 -->
      <div class="base-msg-chenggu columnFlex">
        <img
          class="base-msg-chenggu-content-icon"
          :src="require('@/assets/images/pingyu.png')"
          alt=""
        />
        <div class="base-msg-chenggu-content-title">袁天罡称骨</div>
        <div class="base-msg-chenggu-content-value" v-if="!noRizhu">
          重量 {{ chengguDatas.weightStr }}
        </div>
        <div class="base-msg-chenggu-content-value">
          {{ noRizhu ? '**' : chengguDatas.tip }}
        </div>
      </div>
    </div>
  </div>
  <PopupBox2 v-if="rizhuDex == 0" :title="rizhuDatas[0].value" @close="closePopup" :isMaskClose="true">
    <iframe :src="`https://www.iwzbz.com/rigan/${rizhuGanDex}.html`" frameborder="0" width="100%" height="660px" />
  </PopupBox2>

  <PopupBox2 v-if="rizhuDex == 1" title="阴阳" @close="closePopup" :isMaskClose="true">
    <img :src="require('@/assets/images/rizhu_yy.png')" style="width:908px"/>
  </PopupBox2>

  <PopupBox2 v-if="rizhuDex == 2" title="旺衰选择" @close="closePopup" :isMaskClose="true">
    <!-- <CusMenu3 :tipTitle="xzTipTitle" :tipCode="2" :selectIndex="xzSelectIndex"
            :selectTitle="xzSystemTitle" :xzItems="xzItems" :rzimg="rzimg" @close="closePopup" @select="onSelectXZIndex" /> -->
    <CusMenu3 :info="menu3Info" @select="onWangShuaiSelect" @goToGanZhiSetting="goToGanZhiSetting"/>
  </PopupBox2>

    <PopupBox2 v-if="rizhuDex == 3" title="格局选择" @close="closePopup" :isMaskClose="true">
    <CusMenu4 :info="menu4Info" @select="onGeJuSelect" @goToGanZhiSetting="goToGanZhiSetting"/>
  </PopupBox2>
</template>

<script setup>
import { ref, reactive, computed, defineProps, onBeforeMount, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import store from '@/store'
import HeaderItem from './headerItem'
import PopupBox2 from '@/components/popupBox2/index.vue'
import CusMenu3 from '@/views/paipan/components/feedback-note/components/power/cusMenu3.vue'
import CusMenu4 from '@/views/paipan/components/feedback-note/components/power/cusMenu4.vue'
import { getColorOfWx, navigationTo } from '@/utils'
import {
  wxForBz,
  getWXIcon,
  getShengWX,
  initSetting3,
  getXZParmFromSetting3,
  getXZParmFromClient,
  getRiLingToWuXing,
  getIndexOfLunarM,
  getIndexOfLunarD,
  getWXSS,
  getDateTimeStr,
  getRiLingToCode,
} from '../utils'
import { getXZTips } from '@/utils/xzUtils.js'

import {feedbackStruct as selects, bzStruct as selectsX } from '../static'
import CG from '../assets/model'
import {
  getBaseBZ,
  getWXPW2,
} from '@/api/bazi.js'

import { updateNote } from '@/api/note.js'

import { getWXPW } from '@/api/bazi2.js'
import WzToast from "@/utils/toast.js"

import {
  getXingXiu,
  getAstro,
  getXZOfEn,
  getMingGua,
} from '@/utils/baseUtils.js'

const emits = defineEmits(['onSel', 'goToGanZhiSetting', 'changeGJ', 'DSBJIndex'])
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
  // name sex solarTime lunarTime address sunTime jqArr shengxiao shengxiaoIndex
  infoData: {
    type: Object,
    require: true,
  },
  // rowTitle zhuxing tiangan dizhi canggan fuxing xingyun zizuo kongwang nayin shensha bazi tdbzArr
  panDatas: {
    type: Object,
    require: true,
  },
})
const goToGanZhiSetting = (index) => {
  emits('goToGanZhiSetting', index)
}
const viplevel = computed(() => store.getters.viplevel)
const guid = computed(() => store.getters.userguid)
const novipIcon = require('@/assets/images/vip_close.png')
// 小真智能
const xzCurdSelectWSCode = ref(-1)
const xzCurdSelectGJCode = ref(-1)
const rzTitle = ref('')
const xzYYTitle = ref()
const xzWSTitle = ref('')
const xzGJTitle = ref('')
let xzTipTitle = ref('小真智能title')
let xzTipCode = ref(0)
let xzSelectIndex = ref(-1)
let xzSystemTitle = ref('')
const xzItems = ref([])
const rzimg = ref([])
const xzData = ref(null)
let rzCode = ref('')
//小真智能

const onSelectXZIndex = (index) => {
  xzSelectIndex.value = index
}
// 同异党
const mywx = ref(50)
const otherwx = ref(50)
// 五行能量
const wxTabIndex = ref(0)
const wxpwidth = reactive([0, 0, 0, 0, 0])
const wxpcount = reactive([0, 0, 0, 0, 0])
const wxCount = reactive([0, 0, 0, 0, 0])
const wxcgCount = reactive([0, 0, 0, 0, 0])
const wxunit = ref('%')
// 五行
const wxData = computed(() => props.wxData)
// 袁天罡称骨
const chengguDatas = reactive({
  weight: 0,
  weightStr: '',
  tip: '',
})
const rizhuGanDex = ref(0)
const rizhuDex = ref(-1)
const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const menu4Info = ref(null)
const menu3Info = ref(null)

const onWangShuaiSelect = (index) => {
  menu3Info.value.selDex = index
}

const onGeJuSelect = (index) => {
  menu4Info.value.selDex = index
}

const closePopup = () => {
      let xzDataX = null

      switch (rizhuDex.value) {
        case 2:
          // xzData.value.wsIndex = xzSelectIndex.value
          // xzData.value.wsVal = xzSelectIndex.value >= 0 ? xzItems.value[xzSelectIndex.value] : xzData.value.wsSysVal
          // xzDataX = noteData.value.bzData.find(item => item.name === '旺衰' || item.name === '旺弱')
          // xzDataX.data = xzSelectIndex.value === -1 ? '' : xzData.value.wsVal
          let wsindex = menu3Info.value.selDex
          xzWSTitle.value = wsindex == -1 ?menu3Info.value.sysTipName:menu3Info.value.cusItems[wsindex]
          menu3Info.value.selDex = wsindex
            noteData.value.bzData.forEach(item => {
            if (item.name === '旺衰' || item.name === '旺弱') {
              item.data = xzWSTitle.value
            }
          })
          console.log("旺衰选中数据及下标：", menu3Info.value);
          break
        case 3:
          let index = menu4Info.value.selDex
          // xzData.value.gjIndex = index
          // xzData.value.gjVal = index >= 0 ? xzItems.value[index] : xzData.value.gjSysVal
          // xzDataX = noteData.value.bzData.find(item => item.name === '格局')
          // xzDataX.data = index === -1 ? '' : xzData.value.gjVal
          // console.log("xzDataX.data", xzDataX,noteData.value);
          
          // 如果新格局导致旺衰变化，则更新旺衰
          // let wsVal = ''
          // if (xzData.value.gjVal.includes(/^(从弱格)|(从儿格)|(从杀格)|(从财格)$/)) {
          //   wsVal = '从弱'
          // } else if (xzData.value.gjVal.search(/^(专旺格)|(稼穑格)|(曲直格)|(炎上格)|(润下格)|(从革格)$/) > -1) {
          //   wsVal = '从强'
          // }
          // const wsData = noteData.value.bzData.find(item => item.name === '旺衰' || item.name === '旺弱')
          // wsData.data = ''
          // if (wsVal) {
          //   xzData.value.wsVal = wsVal
          //   xzData.value.wsSysVal = wsVal
          // } else {
          //   xzData.value.wsVal = xzData.value._xzWSTitle
          //   xzData.value.wsSysVal = xzData.value._xzWSTitle
          // }
          //console.log("格局选中数据及下标：", xzData.value.gjVal, index,xzDataX,noteData.value.bzData,JSON.parse(JSON.stringify(noteData.value)));
        
          console.log("格局选中数据及下标：", menu4Info.value);
          xzGJTitle.value = index == -1 ?menu4Info.value.sysTipName:menu4Info.value.cusItems[index]
          
          menu4Info.value.selDex = index
            noteData.value.bzData.forEach(item => {
            if (item.name === '格局') {
              item.data = xzGJTitle.value
            }
          })
          break
      }
      
        onNoteSave(JSON.parse(JSON.stringify(noteData.value)))
      
        // console.log("小真智能数据8888：", xzData.value);
        // xzData.value = Object.assign({}, xzData.value)
        // xzWSTitle.value = xzData.value.wsVal
        rizhuDex.value = -1
        // console.log("小真智能数据9999：", xzData.value);
        // console.log("格局选中数据及下标：5555", noteData.value.bzData);
        emits('changeGJ', xzGJTitle.value)
}



/**
     * 保存断事笔记数据
     */
const onNoteSave = async (jsonData) =>{
      // const jsonData = JSON.parse(JSON.stringify(noteData.value))
      //const jsonData = Object.assign({}, noteData.value)
      console.log("断式笔记数据222：",noteData.value,jsonData);
      
      jsonData.bzData = jsonData.bzData.map(item => {
          delete item.list
          delete item.isShow
          return item
        })
        jsonData.feedbackData = jsonData.feedbackData.map(item => {
            delete item.list
            delete item.isShow
            return item
        })
      // jsonData.pickers.forEach(item => {
      //   if (typeof item.data !== 'string' && item.data.list) {
      //     item.data = JSON.stringify(item.data)
      //   }
      //   item.data = `${item.data}|${item.showJX ? 1 : 0}|${item.jxIndex}`
      //   delete item.showJX
      //   delete item.jxIndex
      //   delete item.year
      //   if (item.name.includes('大运')) {
      //     item.list = item.list.map(item2 => {
      //       item2.data = `${item2.data}|${item2.showJX ? 1 : 0}|${item2.jxIndex}`
      //       delete item2.showJX
      //       delete item2.jxIndex
      //       delete item2.year
      //       return item2
      //     })
      //     item.data = JSON.stringify({data: item.data, list: item.list})
      //     delete item.list
      //   }
      //   jsonData.feedbackData.push(item)
      // })
      //delete jsonData.pickers
      jsonData.bzStruct = jsonData.bzStruct || JSON.stringify(jsonData.bzData.map(item => {
        // item.data = ''
        return {
          ...item,
          data: '',
        }
      }))
      jsonData.feedbackStruct = jsonData.feedbackStruct || JSON.stringify(jsonData.feedbackData.filter(item => {
        item.data = ''
        return item.type != 2
      }))
      // if (content) {
      //   jsonData.content = content
      // }
      const param = new URLSearchParams()
      
      param.append("userGuid", props.infoData.caseGuid)
      param.append("content", jsonData.content)
      param.append("bzData", JSON.stringify(jsonData.bzData))
      param.append("bzStruct", jsonData.bzStruct)
      param.append("feedbackData", JSON.stringify(jsonData.feedbackData))
      param.append("feedbackStruct", jsonData.feedbackStruct)
      // 遍历URLSearchParams对象，打印出所有的键和值
      for (const [key, value] of param) {
        console.log("断式笔记数据：",key, value);
      }      
      await updateNote(param).then(res => {
        if (res.code != 0) {
          WzToast({
            message: '保存断事笔记失败',
            type: 'warning'
          })
        } else {
          // let bzData = noteData.value.bzData.find(item => item.name === '旺衰' || item.name === '旺弱')
          // if (bzData.data) {
          //   xzData.value.wsIndex = bzData.items.split(",").findIndex(item => item == bzData.data)
          //   xzData.value.wsVal = bzData.data
          // } else {
          //   xzData.value.wsIndex = -1
          // }

          // bzData = noteData.value.bzData.find(item => item.name === '格局')
          // console.log("格局选中数据及下标3333333：", bzData);
          
          // if (bzData.data) {
          //   xzData.value.gjIndex = bzData.items.split(",").findIndex(item => item == bzData.data)
          //   xzData.value.gjVal = bzData.data
          // } else {
          //   xzData.value.wsIndex = -1
          // }
          // console.log("格局选中数据及下标44444：", bzData);

          // WzToast({
          //   message: '保存成功',
          //   type: 'main'
          // })
        }
      }).catch(err => {
      })
    }

const onRiZhuItemClick = (index) => {
    rizhuDex.value = index
    switch (index) {
      case 0:
        rizhuGanDex.value = gan.indexOf(rizhuDatas.value[0].value.charAt(0)) + 1
        break
      case 2:
        // xzTipTitle.value = '旺衰选择'
        // xzSelectIndex.value = xzData.value.wsIndex
        // xzSystemTitle.value = xzData.value.wsSysVal
        //xzItems.value = noteData.value.bzData.find(item => item.name === '旺衰' || item.name === '旺弱').items.split(",")
        break
    }
    //ElMessage.warning(index+"功能暂未开放")
}

//夜子时
const yzs = ref(localStorage.getItem('setting_midnight') ? (localStorage.getItem('setting_midnight') === 'true' ? 1 : 0) : 0)
const noteData = ref(null)

   /**
     * 处理断事笔记数据
     */
    const handleNoteData = (noteDataX) =>{
      if (!noteDataX.userGuid) {
        noteData.userGuid = props.infoData.caseGuid
      }
      if (!noteDataX.bzData) {
        noteDataX.bzData = noteDataX.bzStruct ? JSON.parse(noteDataX.bzStruct) : JSON.parse(JSON.stringify(selectsX))
      } else {
        noteDataX.bzData = JSON.parse(noteDataX.bzData)
      }
      const hasObj = {}
      noteDataX.bzData = noteDataX.bzData.filter(item => {
        if (hasObj[item.name]) {
          return false
        } else {
          hasObj[item.name] = 1
          return true
        }
      })
      noteDataX.bzData.forEach(item => {
        if (item.name.indexOf('格局') >= 0) {
          item.index = 1
        } else if (item.name.indexOf('喜') >= 0) {
          item.index = 2
        } else if (item.name.indexOf('忌') >= 0) {
          item.index = 3
        }
        if (item.name !== '旺衰' && item.name !== '旺弱') {
          let lastStr = item.name.slice(-1)
          if (lastStr !== ')') {
            lastStr = parseInt(lastStr)
            if (lastStr !== lastStr) {
              item.sname = '(一)'
            } else {
              switch (lastStr) {
                case 2:
                  item.sname = '(二)'
                  break
                case 3:
                  item.sname = '(三)'
                  break
              }
              item.name = item.name.slice(0, -1)
            }
          }
        }
      })
      noteDataX.bzData.sort((a, b) => a.index - b.index)
      noteDataX.bzData.unshift(...noteDataX.bzData.splice(noteDataX.bzData.findIndex(item => item.name === '旺衰' || item.name === '旺弱'), 1))
      if (!noteDataX.feedbackData) {
        noteDataX.feedbackData = noteDataX.feedbackStruct ? JSON.parse(noteDataX.feedbackStruct) : JSON.parse(JSON.stringify(selects))
      } else {
        noteDataX.feedbackData = JSON.parse(noteDataX.feedbackData)
      }

      noteDataX.feedbackData = noteDataX.feedbackData.filter(item => {
        if (hasObj[item.name]) {
          return false
        } else {
          hasObj[item.name] = 1
          return true
        }
      })
      if (!noteDataX.feedbackData.find(item => item.type == 3)) {
        const recordItem = selects.find(item => item.type == 3)
        if (recordItem) noteDataX.feedbackData.push(JSON.parse(JSON.stringify(recordItem)))
      }

      noteDataX.bzData.forEach(item => {
        item.list = item.items.split(',').map((i, j) => {
          return {
            id: j,
            name: i
          }
        })
        item.isShow = item.show == 1
      })
      noteDataX.feedbackData.forEach(item => {
        if (item.type != 2) {
          item.list = item.items.split(',').map((i, j) => {
            return {
              id: j,
              name: i
            }
          })
          item.isShow = item.show == 1
        } else {
          item.year = +item.name.split('年')[0]
          if (item.name.includes('大运')) {
            if (!item.data) {
              item.data = ''
              item.showJX = true
              item.jxIndex = 0
              item.list = []
            } else {
              const _data = JSON.parse(item.data)
              const arr = _data.data.split('|')
              item.data = arr[0]
              item.showJX = (arr[1] || 1) == 1 ? true : false
              item.jxIndex = +(arr[2] || '0')
              item.list = _data.list.map(item2 => {
                item2.year = +item2.name.split('年')[0]
                const arr = item2.data.split('|')
                item2.data = arr[0]
                item2.showJX = (arr[1] || 1) == 1 ? true : false
                item2.jxIndex = +(arr[2] || '0')
                return item2
              })
            }
          } else {
            const arr = item.data.split('|')
            item.data = arr[0]
            item.showJX = (arr[1] || 1) == 1 ? true : false
            item.jxIndex = +(arr[2] || '0')
          }
        }
      })

      noteDataX.pickers = noteDataX.feedbackData.filter(item => item.type == 2)
      noteDataX.feedbackData = noteDataX.feedbackData.filter(item => item.type != 2)
      console.log("小真智能数据222222：", noteDataX);
      return noteDataX
      console.log("小真智能数据223333.value2：", noteData.value);
    }
/**
 * 初始化小真智能
 */
const initXZData = async () => {
  
  const bzArr = Object.values(props.panDatas.bazi).slice(0, 8)
    console.log("初始化小真智能数据：",props.infoData,props.panDatas);

  // const xzDataX = {
  //   rzVal: '',
  //   yyVal: '',
  //   wsVal: '',
  //   gjVal: '',
  //   wsSysVal: '',
  //   gjSysVal: '',
  //   wsIndex: '',
  //   gjIndex: '',
  // }
  const xzTips = await getXZTips(props.infoData.caseGuid, bzArr.join(' '), true)
  noteData.value = handleNoteData(xzTips.noteData || {})
  console.log("小真智能数据1111：", noteData.value,xzTips);
  // xzDataX.rzVal = xzTips.rzTitle
  // xzDataX.yyVal = xzTips.xzYYTitle
  // xzDataX.wsVal = xzTips.xzWSTitle
  // xzDataX.gjVal = xzTips.xzGJTitle
  // xzDataX.gjVal2 = xzTips.xzGJTitle2
  // xzDataX.wsSysVal = xzTips.xzSystemWSTitle
  // xzDataX.gjSysVal = xzTips.xzSystemGJTitle
  // xzDataX._xzWSTitle = xzTips._xzWSTitle

  // const wsData = noteData.value.bzData.find(
  //   (item) => item.name === '旺衰' || item.name === '旺弱',
  // )
  // const gjData = noteData.value.bzData.find((item) => item.name === '格局')
  // xzDataX.wsIndex = wsData.data
  //   ? wsData.items.split(',').findIndex((item,index) => item === xzTips.xzWSTitle)
  //   : -1
  // xzDataX.gjIndex = gjData.data
  //   ? gjData.items.split(',').findIndex((item,index) => item.includes(xzTips.xzGJTitle))
  //   : -1

  // rzCode.value = getRiLingToCode(bzArr[4])
  // xzGJTitle.value = xzDataX.gjVal || xzDataX.gjVal2 || '*'
  // xzData.value = xzDataX
  const gjItems = noteData.value.bzData.find((item) => item.name === '格局').items.split(',')
  const wsItems = noteData.value.bzData.find((item) => item.name === '旺衰' || item.name === '旺弱').items.split(',')
  menu3Info.value = {
    sysTipName: xzTips.xzSystemWSTitle,
    cusItems: wsItems,
    selDex: wsItems.indexOf(xzTips.xzWSTitle),
  }
  menu4Info.value = {
    sysTipName: xzTips.xzSystemGJTitle,
    cusItems: gjItems,
    selDex: gjItems.indexOf(xzTips.xzGJTitle),
  }
  //如果系统有，默认为系统的
 if(xzTips.xzWSTitle == xzTips.xzSystemWSTitle){
    menu3Info.value.selDex = -1
  }
  // console.log("小真智能数据4444444444445555：", xzTips.xzGJTitle,xzTips.xzSystemGJTitle);
  if(xzTips.xzGJTitle == xzTips.xzSystemGJTitle){
    menu4Info.value.selDex = -1
  }
  xzWSTitle.value = menu3Info.value.selDex == -1 ? menu3Info.value.sysTipName:menu3Info.value.cusItems[menu3Info.value.selDex]
  xzGJTitle.value = menu4Info.value.selDex == -1 ? menu4Info.value.sysTipName:menu4Info.value.cusItems[menu4Info.value.selDex]
  
  console.log("小真智能数据5555：", noteData.value,menu4Info.value);
  //return xzData
}
// 计算日主属性
// const rizhuDatas = ref([
//     {
//       title: '日主属性',
//       value: rzTitle.value || '*',
//     },
//     {
//       title: '阴阳参考',
//       value: xzYYTitle.value || '*',
//     },
//     {
//       title: xzCurdSelectWSCode.value != -1 ? '自定旺衰' : '旺衰参考',
//       value: xzWSTitle.value|| '*',
//     },
//     {
//       title: xzCurdSelectGJCode.value != -1 ? '自定格局' : '格局参考',
//       value: xzGJTitle.value || '*',
//     },
//   ]
// )
onBeforeMount(async ()=>{
  //let res = await getBZInfo()
  console.log("新栏目数据：", props.panDatas,props.infoData);
  await initXZData()
  // 初始化
  init()
  // console.log("小真智能数据6666：", xzData.value);
  // xzTipTitle.value = '旺衰选择'
  // xzSelectIndex.value = xzData.value.wsIndex
  // xzSystemTitle.value = xzData.value.wsSysVal
  // //xzItems.value = noteData.value.bzData.find(item => item.name === '旺衰' || item.name === '旺弱').items.split(",")
  // console.log("小真智能数据7777：",xzData.value, xzTipTitle.value,xzSelectIndex.value,xzSystemTitle.value,xzItems.value);

})

const getBZInfo = async () => {
  const data = props.infoData
  const sex = data.sex == 1 ? '男' : '女' || '*'
  const sunTime =
    props.MRType == 1
      ? '*'
      : `${data.sunTime[0]}年${data.sunTime[1]}月${data.sunTime[2]}日 ${data.sunTime[3]}:${data.sunTime[4]}`
  const now = new Date()
      const nowDateArr = [
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      ]
   const reqData = {
        d: sunTime + ' 00:00',
        s: sex,
        today: getDateTimeStr(nowDateArr),
        yzs: yzs.value,
        vip: viplevel.value,
        userguid: guid.value,
      }
   let res = await getBaseBZ(reqData)
   return Promise.resolve(res)
}

// 计算头部表格栏生肖、节气等
const baseMsgData = computed(() => {
  const MRType = props.MRType
  const data = props.infoData
  const panDatas = props.panDatas
  console.log("基本信息数据：", panDatas);
  
  const name = data.name || '*'
  const lunarTime = MRType == 1 ? '*' : data.lunarTime || '*'
  const solarTime =
    props.panDatas.isLiuNian == 0
      ? '*'
      : `${data.solarTime[0]}年${data.solarTime[1]}月${data.solarTime[2]}日 ${data.solarTime[3]}:${data.solarTime[4]}`
  const sunTime =
    MRType == 1
      ? '*'
      : `${data.sunTime[0]}年${data.sunTime[1]}月${data.sunTime[2]}日 ${data.sunTime[3]}:${data.sunTime[4]}`
  let address = data.address
  let jieqi = ''
  if (MRType == 1) {
    jieqi = '*'
  } else {
    jieqi = data.jqArr[0] ? data.jqArr[0] + ' ' + data.jqArr[1] : '*'
  }
  const sex = data.sex == 1 ? '男' : '女' || '*'
  const shengxiao = data.shengxiao || '*'

  //新增栏目
  const xingzuo = getAstro(data.solarTime[1], data.solarTime[2])
  //命卦
  const dateArr = data.solarTime
        let lunarY = dateArr[0]
        if (dateArr[1] < 2) {
          lunarY--
        } else if (dateArr[1] === 2) {
          if (!data.unknowhour) {
            const jqTimestamp = data.jqArr1[0] == '立春' ? data.jqArr1[1] : data.jqArr2[1]
            const jqTime = new Date(jqTimestamp.replace(/-/g, '/')).getTime(),
              solarTime = new Date(data.solarTime.replace(/-/g, '/')).getTime()
            if (solarTime < jqTime) {
              lunarY--
            }
          }
        }
  const mgArr = getMingGua(data.sex, lunarY)
  console.log("命卦数据：", mgArr);
  const XingZuoEnglish = [
"Aquarius",
 "Pisces",
 "Aries",
 "Taurus",
 "Gemini",
 "Cancer",
 "Leo",
 "Virgo",
 "Libra",
 "Scorpio",
 "Sagittarius",
 "Capricorn"]

   const XingZuoChina = [
"水瓶",
"双鱼",
"白羊",
"金牛",
"双子",
"巨蟹",
"狮子",
"处女",
"天秤",
"天蝎",
"射手",
"摩羯"]
  //const xingxiu = getXingXiu(...data.solarTime.slice(0, 3))
  const result = {
    leftDatas: [
      {
        title: '姓名',
        value: name,
      },
      {
        title: '农历',
        // value: data.unknowhour == 1?lunarTime.split(' ')[0]: lunarTime,
        value: lunarTime,
      },
      {
        title: '生肖',
        value: shengxiao,
      },
      {
        title: '出生地区',
        value: address,
      },
      {
        title: data.jqArr1[0],
        value: formatDate(data.jqArr1[1]),
      },
      {
        title: '星宿',
        value: data.xingxiu,
      },
      {
        title: '胎息',
        value: `${panDatas.taixi} (${panDatas.taixi_nayin})`,
      },
      {
        title:'人元司令分野',
        value: panDatas.rysl,
      },
      {
        title: '身宫',
        // value: data.unknowhour == 0? (panDatas.shenggong + ' ' +  '(' + panDatas.shenggong_nayin + ')'): '**',
        value: panDatas.shenggong + ' ' +  '(' + panDatas.shenggong_nayin + ')'
      },
      {
        title: '命卦',
        value: `${mgArr[0]} (${mgArr[1]})`,
      },
    ],
    rightDatas: [
      {
        title: '性别',
        value: sex,
      },
      {
        title: '阳历',
        // value: data.unknowhour == 1?solarTime.split(' ')[0]:solarTime,
        value: solarTime,
      },
      {
        title: '真太阳时',
        // value: data.unknowhour == 1?sunTime.split(' ')[0]:sunTime,
        value: sunTime,
      },
      {
        title: '出生节气',
        value: data.jqInfo,
      },
      {
        title: data.jqArr2[0],
        value: formatDate(data.jqArr2[1]),
      },
      {
        title: '星座',
        value: xingzuo + '座' + "(" + XingZuoEnglish[XingZuoChina.indexOf(xingzuo)] +")",
      },
      {
        title: '胎元',
        value: `${panDatas.taiyuan} (${panDatas.taiyuan_nayin})`,
      },
      {
        title: '空亡',
        value: panDatas.kongwang[2],
      },
      {
        title: '命宫',
        // value: data.unknowhour == 0? (panDatas.minggong + ' ' +  '(' + panDatas.minggong_nayin + ')'): '**',
        value: panDatas.minggong + ' ' +  '(' + panDatas.minggong_nayin + ')',
      },
    ],
  }
  if (!props.panDatas.isShowRYSL) {
    // 去除人元司令
    result.leftDatas = result.leftDatas.filter(item => item.title !== '人元司令分野')
  }
  return result
})

function formatDate(input) {
     // 解析输入的日期字符串
     if(!input) return '**'
    console.log("日期格式化：",input);
     let inputTmp = input.replace(/-/g, '/');
     console.log("日期格式化：",input);
     
    const date = new Date(inputTmp);

    // 获取年、月、日、小时、分钟和秒
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以需要+1
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    console.log("日期格式化：",date);

    // 返回格式化后的日期字符串
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


const rizhuDatas = computed(() => {
  return [
    {
      title: '日主属性',
      value: rzTitle.value || '*',
    },
    {
      title: '阴阳参考',
      value: xzYYTitle.value || '*',
    },
    {
      title: xzCurdSelectWSCode.value != -1 ? '自定旺衰' : '旺衰参考',
      value: xzWSTitle.value || '*',
    },
    {
      title: xzCurdSelectGJCode.value != -1 ? '自定格局' : '格局参考',
      value: xzGJTitle.value || '*',
    },
  ]
})
// 计算五行能量
const wuxingDatas = computed(() => {
  const rg = props.panDatas.tiangan.slice(-4)[2]
  return [
    {
      wx: '木',
      width: wxpwidth[0],
      value: wxpcount[0],
      ssValue: getWXSS(rg, '木')
    },
    {
      wx: '火',
      width: wxpwidth[1],
      value: wxpcount[1],
      ssValue: getWXSS(rg, '火')
    },
    {
      wx: '土',
      width: wxpwidth[2],
      value: wxpcount[2],
      ssValue: getWXSS(rg, '土')
    },
    {
      wx: '金',
      width: wxpwidth[3],
      value: wxpcount[3],
      ssValue: getWXSS(rg, '金')
    },
    {
      wx: '水',
      width: wxpwidth[4],
      value: wxpcount[4],
      ssValue: getWXSS(rg, '水')
    },
  ]
})

// 跳转VIP
const onToVip = () => {
  navigationTo({ path: 'vip-page' })
}
//五行能量切换
const onChangeWxType = (code) => {
  switch (code) {
    case 0:
      if (props.MRType == 1 && props.noRizhu) {
        ElMessage.warning('时辰未知，不支持此功能。')
        return
      }
      if (viplevel.value > 0) {
        setWXProgrss(3)
      }
      break
    case 1:
    case 2:
      setWXProgrss(code)
      break
    default:
      break
  }
  wxTabIndex.value = code
}
//计算五行个数
const setWXProgrss = async (type) => {
  const bzArr = props.panDatas.bazi
  if (type == 1) {
    let total = 8
    for (let i = 0; i < wxCount.length; i++) {
      wxpwidth[i] = Math.round((wxCount[i] / total) * 100)
      wxpcount[i] = wxCount[i]
    }
    wxunit.value = '个'
  } else if (type == 2) {
    let total = 0
    for (let i = 0; i < wxCount.length; i++) total += wxcgCount[i]
    for (let i = 0; i < wxCount.length; i++) {
      wxpwidth[i] = Math.round((wxcgCount[i] / total) * 100)
      wxpcount[i] = wxcgCount[i]
    }
    wxunit.value = '个'
  } else if (type == 3) {
    let wxbzstr = ''
    for (let i = 0; i < 8; i++) wxbzstr += bzArr[i]
    let data = ''
    await getWXPW(guid.value, wxbzstr).then(async res => {
      if (!res.data) {
        await getWXPW2(guid.value, wxbzstr).then(res2 => {
          res = res2
        })
      }
      data = res
    })
    if (data.data != null) {
      let dataArr = data.data.split(' ')
      let v1 = 0
      let v2 = 0
      let wxpwws = ''
      if (dataArr.length == 2) {
        let pwArr = dataArr[1].replace('[', '').replace(']', '').split(',')
        // 水 木 火 土 金
        let total = 0
        for (let i = 0; i < pwArr.length; i++) {
          total += parseInt(pwArr[i])
        }
        for (let i = 0; i < pwArr.length; i++) {
          let vv = parseInt(pwArr[i])
          vv = vv / (total / 100.0)
          pwArr[i] = vv
        }
        const pwDict = new Array()
        pwDict['水'] = pwArr[0]
        pwDict['木'] = pwArr[1]
        pwDict['火'] = pwArr[2]
        pwDict['土'] = pwArr[3]
        pwDict['金'] = pwArr[4]
        let rzwx = wxForBz(bzArr[4])
        let swwx = getShengWX(rzwx)
        for (let k in pwDict) {
          if (k == rzwx || k == swwx) {
            v1 += pwDict[k]
          } else {
            v2 += pwDict[k]
          }
        }
        wxpwidth[0] = Math.round(pwArr[1])
        wxpwidth[1] = Math.round(pwArr[2])
        wxpwidth[2] = Math.round(pwArr[3])
        wxpwidth[3] = Math.round(pwArr[4])
        wxpwidth[4] = Math.round(pwArr[0])
        wxpcount[0] = Math.round(pwArr[1])
        wxpcount[1] = Math.round(pwArr[2])
        wxpcount[2] = Math.round(pwArr[3])
        wxpcount[3] = Math.round(pwArr[4])
        wxpcount[4] = Math.round(pwArr[0])
        switch (dataArr[0]) {
          case '日元极弱':
            wxpwws = '极弱'
            break
          case '日元太弱':
            wxpwws = '身弱'
            break
          case '日元偏弱':
            wxpwws = '偏弱'
            break
          case '日元平和':
            wxpwws = '平和'
            break
          case '日元偏旺':
            wxpwws = '偏强'
            break
          case '日元太旺':
            wxpwws = '身强'
            break
          case '日元极旺':
            wxpwws = '极强'
            break
        }
      }
      wxunit.value = '%'
      console.log('wxpwws', wxpwws);
      
      xzWSTitle.value = wxpwws
      mywx.value = Math.round(v1)
      otherwx.value = Math.round(v2)
    }
  }
}
// 获取日主属性
const initRizhu = async () => {
  let setting3 = initSetting3() //调用初始化函数
  let xzResult = await getXZParmFromSetting3(setting3, props.panDatas.bazi) //拿到小真智能的系统提示
  let contentObj = JSON.parse(getXZParmFromClient(xzResult)) //得到一个小真的智能提示对象
  //xzGJTitle.value = contentObj.gjItems

  if (contentObj) {
    xzYYTitle.value = contentObj.yyText
    //xzGJTitle.value = contentObj.gjItems.replace(/\,/g, '\n')
    //取出当data不为空时取出data对应的第一个下标
    if (noteData.value.bzData[0].data != '') {
      // xzCurdSelectWSCode.value = getItemsToIndex(
      //   selectsX[0].data,
      //   selectsX[0].items,
      //   ',',
      // ) //从列表项获取对应下标
      xzWSTitle.value = noteData.value.bzData[0].data
    }
    if (noteData.value.bzData[1].data != '') {
      // xzCurdSelectGJCode.value = getItemsToIndex(
      //   selectsX[1].data,
      //   selectsX[1].items,
      //   ',',
      // ) //从列表项获取对应下标
      xzGJTitle.value = noteData.value.bzData[1].data
    }
  }
  rzTitle.value = getRiLingToWuXing(props.panDatas.bazi[4])
}
// 计算称骨
const initChengGu = () => {
  const lunarTime = props.infoData.lunarTime
  const nIndex = lunarTime.indexOf('年'),
    yIndex = lunarTime.indexOf('月')
  let nz =
      props.panDatas.tiangan.slice(-4)[0] + props.panDatas.dizhi.slice(-4)[0],
    lunarM = getIndexOfLunarM(lunarTime.slice(nIndex + 1, yIndex + 1)),
    lunarD = getIndexOfLunarD(lunarTime.slice(yIndex + 1, yIndex + 3)),
    sl = lunarTime.slice(yIndex + 4, yIndex + 5)
  console.log('getCGByW', nz, lunarM, lunarD, sl);
  const weightArr = CG.getCGByW(nz, lunarM, lunarD, sl)
  chengguDatas.weight = weightArr[0]
  chengguDatas.weightStr = weightArr[1]
  chengguDatas.tip = CG.getCGByPoetry(weightArr[0], +props.infoData.sex)
}
// 初始化
const init = async () => {
  const bzArr =
    props.MRType == 1
      ? props.panDatas.mrbazi || props.panDatas.bazi
      : props.panDatas.bazi
  const cgArr = props.panDatas.cgArr

  // 获取日主属性
  initRizhu()

  // 计算五行个数
  const wxCount2 = {
    木: 0,
    火: 0,
    土: 0,
    金: 0,
    水: 0,
  }
  const wxcgCount2 = {
    木: 0,
    火: 0,
    土: 0,
    金: 0,
    水: 0,
  }
  for (let i = 0; i < 8; i++) {
    let wxstr = wxForBz(bzArr[i])
    wxCount2[wxstr] += 1
  }
  let tmpwx = wxForBz(bzArr[0])
  wxcgCount2[tmpwx] += 1
  tmpwx = wxForBz(bzArr[2])
  wxcgCount2[tmpwx] += 1
  tmpwx = wxForBz(bzArr[4])
  wxcgCount2[tmpwx] += 1
  tmpwx = wxForBz(bzArr[6])
  wxcgCount2[tmpwx] += 1

  for (let i = 0; i < cgArr.length; i++) {
    for (let j = 0; j < cgArr[i].length; j++) {
      tmpwx = wxForBz(cgArr[i][j])
      wxcgCount2[tmpwx] += 1
    }
  }
  wxCount[0] = wxCount2['木']
  wxCount[1] = wxCount2['火']
  wxCount[2] = wxCount2['土']
  wxCount[3] = wxCount2['金']
  wxCount[4] = wxCount2['水']
  wxcgCount[0] = wxcgCount2['木']
  wxcgCount[1] = wxcgCount2['火']
  wxcgCount[2] = wxcgCount2['土']
  wxcgCount[3] = wxcgCount2['金']
  wxcgCount[4] = wxcgCount2['水']

  //初始化五行能量条
  if (viplevel.value > 0) {
    if (props.MRType == 1 && props.noRizhu) {
      onChangeWxType(1)
    } else {
      onChangeWxType(0)
    }
  }

  setTimeout(() => {
    initChengGu()
  })
}


</script>

<style lang="scss" scoped>
.container {
  // min-width: 1025px;
  width: 100%;
  border-radius: 15px 15px 0 0;
  .base-msg-box {
    width: 100%;
    // padding: 26px 36px;
    padding: 24px 13px;
    .base-msg-content {
      border-radius: 10px;
      border-left: 1px solid rgba(230, 230, 230, 100);
      border-right: 1px solid rgba(230, 230, 230, 100);
      overflow: hidden;
      .base-msg-content-row {
        display: flex;
        background-color: white;
        border-bottom: 1px solid rgba(230, 230, 230, 100);
        &:first-child {
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          border-top: 1px solid rgba(230, 230, 230, 100);
        }
        &:last-child {
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          border-bottom: 1px solid rgba(230, 230, 230, 100);
        }
        .base-msg-content-row-left,
        .base-msg-content-row-right {
          display: flex;
          align-items: center;
          width: 50%;
          text-align: left;
          white-space: nowrap;
          font-size: 15px;
        }
        .base-msg-content-row-left {
          //border-right: 1px solid #f8f8f8;
        }
        .base-msg-content-row-title {
          width: 134px;
          color: #838383;
          box-sizing: border-box;
          background-color: #f8f8f8;
          padding: 10px 0 10px 20px;

         
        }
        .base-msg-content-row-value {
          flex: 1;
          color: #0e0e0e;
          overflow-x: hidden;
          text-overflow: ellipsis;
          padding: 7px 0 7px 20px;
        }
      }
      // .base-msg-content-row:nth-of-type(2n) {
      //   background-color: #f8f8f8;
      // }
    }
    .base-msg-center {
      display: flex;
      justify-content: space-between;
      min-width: 700px;
      margin: 17px 0 13px;
      .base-msg-xiaozhen {
        width: 49%;
        border-radius: 10px;
        border: 1px solid rgba(230, 230, 230, 100);
        .base-msg-xiaozhen-title {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 41px;
          line-height: 41px;
          color: rgba(16, 16, 16, 100);
          font-size: 18px;
          //font-weight: bold;
          border-radius: 10px 10px 0 0;
          background-color: #f8f8f8;
          .base-msg-xiaozhen-title-icon {
            width: 30px;
            margin-right: 5px;
          }
        }

        .base-msg-xiaozhen-rizhu {
          display: flex;
          flex-wrap: wrap;
          margin: 20px 32px;
          .base-msg-xiaozhen-rizhu-item {
            display: flex;
            width: 50%;
            line-height: 30px;
            text-align: left;
            font-size: 15px;
            white-space: nowrap;
            .base-msg-xiaozhen-rizhu-item-title {
              color: rgba(131, 131, 131, 100);
            }
            .base-msg-xiaozhen-rizhu-item-value {
              position: relative;
              color: rgba(178, 149, 93, 100);
              white-space: normal;

              &::after {
                content: '';
                position: absolute;
                bottom: 5px;
                left: 0;
                width: 100%;
                height: 1px;
                background-color: #B2955D;
              }
            }
            .base-msg-xiaozhen-rizhu-novip-icon {
              align-self: center;
              width: 12px;
              height: 15px;
            }
          }
        }
        .base-msg-xiaozhen-progress {
          position: relative;
          margin: 0 32px;
          margin-bottom: 42px;
          font-size: 0;
          border-radius: 50px;
          .base-msg-xiaozhen-progress-left,
          .base-msg-xiaozhen-progress-right {
            position: relative;
            display: inline-block;
            padding: 5px 0;
            color: white;
            font-size: 14px;
            text-align: center;
            white-space: nowrap;
          }
          .base-msg-xiaozhen-progress-left {
            border-radius: 50px 0 0 50px;
            background-color: #d10506;
          }
          .base-msg-xiaozhen-progress-right {
            border-radius: 0 50px 50px 0;
            background-color: #2f83f6;
          }
          .base-msg-xiaozhen-progress-left::after {
            content: '同党';
            position: absolute;
            top: 35px;
            left: 0;
            right: 0;
            margin: 0 auto;
            color: rgba(131, 131, 131, 100);
            font-size: 14px;
          }
          .base-msg-xiaozhen-progress-right::after {
            content: '异党';
            position: absolute;
            top: 35px;
            left: 0;
            right: 0;
            margin: 0 auto;
            color: rgba(131, 131, 131, 100);
            font-size: 14px;
          }
          .base-msg-xiaozhen-progress-novip-icon {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            width: 18px;
            height: 22px;
            z-index: 99;
          }
        }
      }
      .base-msg-wuxingbar {
        position: relative;
        width: 49%;
        border-radius: 10px;
        border: 1px solid rgba(230, 230, 230, 100);
        .base-msg-wuxingbar-tabs {
          position: relative;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          height: 41px;
          margin-bottom: 20px;
          color: rgba(16, 16, 16, 100);
          font-size: 15px;
          border-radius: 10px 10px 0 0;
          background-color: #f8f8f8;
          .base-msg-wuxingbar-tabs-icon {
            position: absolute;
            top: -10px;
            left: -10px;
            width: 70px;
            pointer-events: none;
          }
          .base-msg-wuxingbar-tabs-item {
            flex: 1;
            height: 33px;
            line-height: 33px;
            border-radius: 50px;
            color: #101010;
            font-size: 14px;
          }
          .tabsItemSelected {
            border-radius: 15px;
            background-color: rgba(255, 255, 255, 100);
            text-align: center;
            box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.05);
          }
        }
        .base-msg-wuxingbar-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin: 12px;
          color: rgba(16, 16, 16, 100);
          font-size: 15px;
          .base-msg-wuxingbar-item-tip {
            display: inline;
            padding: 0 15px 0 5px;
          }
          .base-msg-wuxingbar-item-progress {
            flex: 1;
            height: 14px;
            border-radius: 50px;
            background-color: #f8f8f8;
            overflow: hidden;
            .base-msg-wuxingbar-item-progressed {
              height: 100%;
              border-radius: 50px;
              width: 100%;
              transition: width .5s;
            }
          }
          .base-msg-wuxingbar-item-value {
            display: inline;
            width: 105px;
            padding-right: 26px;
            text-align: right;
            white-space: nowrap;
          }
        }
        .base-msg-wuxingbar-novip {
          position: absolute;
          top: 60px;
          left: 0;
          right: 0;
          bottom: 0;
          align-items: center;
          padding: 0 53px;
          color: rgba(16, 16, 16, 100);
          font-size: 16px;
          background-color: white;
          .base-msg-wuxingbar-novip-tip {
            line-height: 20px;
          }
          .base-msg-wuxingbar-novip-button {
            width: 154px;
            height: 39px;
            margin-top: 27px;
            line-height: 39px;
            color: rgba(255, 255, 255, 100);
            font-size: 16px;
            border-radius: 30px;
            background-color: rgba(178, 149, 93, 100);
          }
        }
      }
    }
    .base-msg-wuxing {
      display: flex;
      align-items: center;
      width: 100%;
      height: 43px;
      border-radius: 10px;
      border: 1px solid rgba(230, 230, 230, 100);
      .base-msg-wuxing-item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba(16, 16, 16, 100);
        font-size: 15px;
      }
      .wuxingIcon {
        width: 30px;
      }
    }
    .base-msg-chenggu {
      position: relative;
      width: 100%;
      height: 109px;
      margin-top: 13px;
      padding: 18px 100px;
      text-align: left;
      font-size: 15px;
      border-radius: 10px;
      border: 1px solid rgba(230, 230, 230, 100);
      .base-msg-chenggu-content-icon {
        position: absolute;
        left: 50px;
        top: 21px;
        width: 33px;
      }
      .base-msg-chenggu-content-title {
        margin-bottom: 10px;
        line-height: 22px;
        color: rgba(14, 14, 14, 100);
        font-weight: bold;
        font-size: 15px;
      }
      .base-msg-chenggu-content-value {
        line-height: 22px;
        font-size: 14px;
        color: rgba(72, 72, 72, 100);
      }
    }
  }
}
</style>
