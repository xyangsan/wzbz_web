<template>
  <div class="settings-box">
    <div class="title-bar">
      <div :class="['title-option', activeIndex === index ? 'selected-item' : '']"
        :style="{ width: 100 / titles.length + '%' }" v-for="(item, index) in titles" :key="index"
        @click="switchSettings(index)">
        {{ item }}
      </div>
    </div>
    <div v-if="userguid && vipLevel > 0" class="settings-content-container">
      <div class="settings-content" v-if="activeIndex === 0">
        <div class="settings-content-left">
          <div class="settings-content-items">
            <div class="settings-content-title">天干关系</div>
            <div :class="[
              'settings-content-item',
              leftSelectedIndex0 === item.id ? 'selected-item' : '',
            ]" v-for="item in gzRelation_tg" :key="item.id" @click="switchTGRelation(item.id)">
              {{ item.name }}
              <div class="settings-content-item-status">
                {{
                  getSettingGZRelationStatus('tg', item.id, 0) ? '开启' : '关闭'
                }}
                <img class="settings-content-item-status-img" :src="leftArrow" alt="左箭头" />
              </div>
            </div>
          </div>
          <div class="settings-content-items">
            <div class="settings-content-title settings-content-title-special">
              地支关系
            </div>
            <div :class="[
              'settings-content-item',
              leftSelectedIndex0 === item.id ? 'selected-item' : '',
            ]" v-for="item in gzRelation_dz" :key="item.id" @click="switchDZRelation(item.id)">
              {{ item.name }}
              <div class="settings-content-item-status">
                {{
                  getSettingGZRelationStatus('dz', item.id, 0) ? '开启' : '关闭'
                }}
                <img class="settings-content-item-status-img" :src="leftArrow" alt="左箭头" />
              </div>
            </div>
          </div>
        </div>
        <div class="settings-content-right">
          <div class="settings-content-items">
            <div class="settings-content-title">
              开关
              <img :class="[
                'settings-content-title-img',
                getSettingGZRelationStatus(
                  leftSelectedIndex0 < 4 ? 'tg' : 'dz',
                  leftSelectedIndex0,
                  0,
                )
                  ? 'selected-option'
                  : '',
              ]" @click="
                switchGZRelation(
                  leftSelectedIndex0 < 4 ? 'tg' : 'dz',
                  leftSelectedIndex0,
                )
                " :src="iconSelected" alt="选中图标" />
            </div>
          </div>
          <div class="settings-content-items" v-for="(item, index) in rightLists0" :key="item.id">
            <div class="settings-content-title settings-content-title-special">
              {{ item.title }}
            </div>
            <div class="settings-content-item settings-content-item-special" v-for="(item1, index1) in item.list"
              :key="item1.id">
              {{ item1.name }}
              <img :class="[
                'settings-content-item-img',
                getSettingGZRelationStatus(
                  leftSelectedIndex0 < 4 ? 'tg' : 'dz',
                  leftSelectedIndex0,
                  1,
                )[index][index1] === '1'
                  ? 'selected-option'
                  : '',
              ]" @click="
                switchGZCondition(
                  leftSelectedIndex0 < 4 ? 'tg' : 'dz',
                  leftSelectedIndex0,
                  index,
                  index1,
                  item1.id,
                )
                " :src="iconSelected" alt="选中图标" />
            </div>
          </div>
          <div class="settings-content-items">
            <div class="settings-content-title settings-content-title-special">
              位置
            </div>
            <div :class="[
              'settings-content-item',
              'settings-content-item-special',
              index ===
                getSettingGZRelationStatus(
                  leftSelectedIndex0 < 4 ? 'tg' : 'dz',
                  leftSelectedIndex0,
                  2,
                )
                ? 'selected-item-special'
                : '',
            ]" v-for="(item, index) in listLocation" @click="
              switchGZLocation(
                leftSelectedIndex0 < 4 ? 'tg' : 'dz',
                leftSelectedIndex0,
                index,
              )
              " :key="item.id">
              {{ item.name }}
              <div class="settings-content-point"></div>
            </div>
          </div>
          <div :class="['settings-content-reset-button', isReset0 ? 'settings-content-reset-button-active' : '']"
            @click="
              resetSettings0(
                leftSelectedIndex0 < 4 ? 'tg' : 'dz',
                leftSelectedIndex0,
              )
              ">
            重置
          </div>
        </div>
      </div>
      <div class="settings-content" v-if="activeIndex === 1">
        <div class="settings-content-left">
          <div class="settings-content-items">
            <div class="settings-content-title">地支藏干</div>
            <div :class="[
              'settings-content-item',
              leftSelectedIndex1 === item.id ? 'selected-item' : '',
            ]" v-for="item in settingDiZhiZG" :key="item.id" @click="switchDiZhiZG(item.id)">
              {{ getSettingDiZhiZGStatus(item.id) }}
              <div class="settings-content-item-status">
                {{ item.value.replaceAll(' ', '') }}
                <img class="settings-content-item-status-img" :src="leftArrow" alt="左箭头" />
              </div>
            </div>
          </div>
          <div :class="['settings-content-reset-button', isRest1 ? 'settings-content-reset-button-active' : '']"
            @click="resetSettings1()">
            重置
          </div>
        </div>
        <div class="settings-content-right">
          <div class="settings-content-rectangle0">
            <div class="settings-content-rectangle-up">
              <div class="settings-content-rectangle-text0">
                {{ getDiZhi(leftSelectedIndex1) }}
              </div>
              <div class="settings-content-rectangle-line"></div>
              <div class="settings-content-rectangle-text1">
                {{ getZG(settingDiZhiZG, leftSelectedIndex1) }}
              </div>
            </div>
            <div class="settings-content-rectangle-down">
              (默认:{{ getZG(setting_dizhizg_default, leftSelectedIndex1) }})
            </div>
          </div>
          <div class="settings-content-rectangle1">
            <van-picker
              :columns="columnsData"
              :show-toolbar="false"
              :item-height="50"
              :visible-item-count="5"
              v-model="selectedValue"
              @change="onChangePicker"
            ></van-picker>
          </div>
        </div>
      </div>
      <div class="settings-content" v-if="activeIndex === 2" style="flex-direction: column">
        <div class="settings-content-title" style="justify-content: flex-start">
          人元司令分野显示
          <img :class="[
            'settings-content-title-img',
            RYSLStatus ? 'selected-option' : '',
          ]" style="margin-left: 10px" @click="switchRYSL" :src="iconSelected" alt="选中图标" />
        </div>
        <div class="settings-content-rysllist">
          <div :class="[
            'settings-content-ryslitem-container',
            index === leftSelectedIndex2
              ? 'settings-content-ryslitem-container-active'
              : '',
          ]" @click="switchRYSLIndex(index)" v-for="(item, index) in ryslList" :key="item.id">
            <img class="settings-content-title-img" :src="iconSelected" alt="选中图标" />
            <div class="settings-content-ryslitem">
              <div class="settings-content-ryslitem-title">
                {{ item.title }}
              </div>
              <p class="settings-content-ryslitem-content">
                {{ item.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="settings-content" v-if="activeIndex === 3">
        <div class="settings-content-left">
          <div class="settings-content-items">
            <div class="settings-content-title">系统神煞</div>
            <div :class="[
              'settings-content-item',
              leftSelectedIndex3 === index ? 'selected-item' : '',
            ]" v-for="(item, index) in ssSequenceList" :key="index" @click="switchSSS(index, item)">
              {{
                item +
                (item === '天罗地网'
                  ? '（现代常用）'
                  : item === '天罗' || item === '地网'
                    ? '（古技法）'
                    : '')
              }}
              <div class="settings-content-item-status">
                {{
                  sysShenShaList[
                    sysShenShaList.findIndex((item1) => item1.name === item)
                  ].switch
                    ? '开启'
                    : '关闭'
                }}
                <img class="settings-content-item-status-img" :src="leftArrow" alt="左箭头" />
              </div>
            </div>
          </div>
        </div>
        <div class="settings-content-right">
          <div class="settings-content-items">
            <div class="settings-content-title">
              {{ ssSequenceList[leftSelectedIndex3] }}
              <img :class="[
                'settings-content-title-img',
                sysShenShaList[
                  sysShenShaList.findIndex(
                    (item1) =>
                      item1.name === ssSequenceList[leftSelectedIndex3],
                  )
                ].switch
                  ? 'selected-option'
                  : '',
              ]" @click="setSSS(ssSequenceList[leftSelectedIndex3])" :src="iconSelected" alt="选中图标" />
            </div>
            <div class="settings-content-items" v-for="(item, index) in sysSSListR.idArr" :key="index">
              <div class="settings-content-title settings-content-title-special">
                条件
              </div>
              <div class="settings-content-item">
                种类：{{
                  getTypeName(
                    getTypeId(
                      sysSSListR.mainArr[index],
                      sysSSListR.tagsArr[index],
                    ),
                  )
                }}
              </div>
              <div class="settings-content-item" style="
                  text-align: justify;
                  line-height: 2;
                  display: flex;
                  /* text-overflow: ; */
                  width: 100%;
                  /* white-space: nowrap; */
                  overflow: hidden;
                  min-height: 40px;
                  height: auto;
                ">
                位置：{{
                  getMainTagsName(
                    sysSSListR.mainArr[index],
                    sysSSListR.tagsArr[index],
                  )
                }}
              </div>
              <div class="settings-content-item" style="
                  text-align: justify;
                  line-height: 2;
                  display: flex;
                  /* text-overflow: ; */
                  width: 100%;
                  /* white-space: nowrap; */
                  overflow: hidden;
                  min-height: 40px;
                  height: auto;
                ">
                {{ getDataName(sysSSListR.dataArr[index]) }}
              </div>
            </div>
            <div :class="['settings-content-reset-button', isReset3 ? 'settings-content-reset-button-active' : '']"
              @click="resetSettings3()">
              重置
            </div>
          </div>
        </div>
      </div>
      <div class="settings-content" v-if="activeIndex === 4">
        <div class="settings-content-left">
          <div class="settings-content-items" v-for="item in gongList" :key="item.id">
            <div :class="[
              'settings-content-title',
              item.id === 2 ? 'settings-content-title-special' : '',
            ]">
              {{ item.title }}
              <img :class="[
                'settings-content-title-img',
                setting_other[item.label] ? 'selected-option' : '',
              ]" @click="switchOther(item.label, item.setkey)" :src="iconSelected" alt="选中图标" />
            </div>
            <div class="settings-content-item">
              {{ item.content }}
            </div>
          </div>
        </div>
        <div class="settings-content-right"></div>
      </div>
      <div class="settings-content" v-if="activeIndex === 5">
        <div class="settings-content-left">
          <div class="settings-content-items" v-for="(item, index) in geJuContent" :key="index">
            <div :class="[
              'settings-content-title',
              index === 0 ? '' : 'settings-content-title-special',
            ]">
              {{ item.title }}
              <div class="settings-content-title-tips" @click="openDialog(index)">
                <img class="settings-content-title-tips-img" :src="iconAttention" alt="注意图标" />
                {{ item.tip }}
              </div>
            </div>
            <div :class="[
              'settings-content-item',
              leftSelectedIndex4 === index1 ? 'selected-item' : '',
            ]" v-show="index === 0" v-for="(item1, index1) in item.list[0]" :key="index1" @click="switchGeJu(index1)">
              {{ item1 }}
              <div class="settings-content-item-status">
                {{ ylTitles[settingGeJu.ylValues[index1]].title }}
                <img class="settings-content-item-status-img" :src="leftArrow" alt="左箭头" />
              </div>
            </div>
            <div class="settings-content-item settings-content-item-special" :style="index === 1
              ? {}
              : {
                height: '67px',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }
              " v-show="index !== 0" v-for="(item1, index1) in item.list[0]" :key="index1">
              {{ item1 }}
              <div class="settings-content-item-content"
                :style="index === 1 ? {} : { width: '100%', marginTop: '10px' }">
                {{ item.list[1][index1] }}
                <img :class="[
                  'settings-content-title-img',
                  settingGeJu[
                    index === 1 ? 'additionValues' : 'specialValues'
                  ][index1]
                    ? 'selected-option'
                    : '',
                ]" :src="iconSelected" alt="选择图标" @click="
                  setGeJu(
                    index === 1 ? 'additionValues' : 'specialValues',
                    index1,
                  )
                  " />
              </div>
            </div>
          </div>
          <div :class="['settings-content-reset-button', isReset2 ? 'settings-content-reset-button-active' : '']"
            style="margin-top: 15px" @click="resetSettings2()">
            重置
          </div>
        </div>
        <div class="settings-content-right">
          <div class="settings-content-items">
            <div style="padding-right: 20px" :class="[
              'settings-content-item',
              settingGeJu.ylValues[leftSelectedIndex4] === index
                ? 'selected-item-special'
                : '',
            ]" v-for="(item, index) in ylTitles" :key="index" @click="setGeJu('ylValues', index)">
              {{ item.title }}
              <div class="settings-content-point"></div>
            </div>
            <div class="settings-content-items" v-if="settingGeJu.ylValues[leftSelectedIndex4] === 0">
              <div class="settings-content-item" style="
                  height: 68px;
                  font-size: 14px;
                  text-align: justify;
                  line-height: 1.5;
                  padding: 0 20px;
                ">
                {{ ylData2[0][0] + ylData2[0][1] }}
              </div>
            </div>
            <div class="settings-content-items" v-if="settingGeJu.ylValues[leftSelectedIndex4] === 1">
              <div class="settings-content-item" style="
                  height: 68px;
                  font-size: 14px;
                  text-align: justify;
                  line-height: 1.5;
                  padding: 0 20px;
                ">
                {{ ylData.title }}
              </div>
              <div class="settings-content-item" style="
                  flex-direction: column;
                  height: auto;
                  align-items: flex-start;
                  padding: 0 20px;
                  font-weight: bold;
                " v-for="(item, index) in ylData.datas" :key="index">
                <div style="padding: 20px 0 4px; margin-left: -10px">
                  {{
                    index === 0
                      ? leftSelectedIndex4 >= 8
                        ? item.titles[1]
                        : item.titles[0]
                      : item.title
                  }}
                </div>
                <div :class="[
                  'settings-content-item',
                  'settings-content-item-geju',
                  settingGeJu.ylDatas[leftSelectedIndex4][4]
                    ? 'selected-item-special'
                    : '',
                ]" v-if="index === 3 && leftSelectedIndex4 >= 8">
                  {{ ylData4_content }}
                  <img :class="[
                    'settings-content-item-img',
                    settingGeJu.ylDatas[leftSelectedIndex4][4]
                      ? 'selected-option'
                      : '',
                  ]" @click="setGeJu('ylDatas', 4)" :src="iconSelected" alt="选中图标" />
                </div>
                <div :class="[
                  'settings-content-item',
                  'settings-content-item-geju',
                  settingGeJu.ylDatas[leftSelectedIndex4][index] === index1
                    ? 'selected-item-special'
                    : '',
                ]" v-for="(item1, index1) in item.contents" :key="index1" @click="setGeJu('ylDatas1', index, index1)">
                  {{
                    index > 1
                      ? isArray1(item1)
                        ? leftSelectedIndex4 >= 8
                          ? item1[1]
                          : item1[0]
                        : item1
                      : item1
                  }}
                  <div :style="{ display: index <= 1 ? 'none' : '' }" class="settings-content-point"></div>
                </div>
              </div>
              <div class="special-tips-content">
                <div class="special-tips-content-title">特别说明</div>
                <text class="special-tips-content-text" v-for="(item, index) in specialList[
                  leftSelectedIndex4 >= 8 ? 1 : 0
                ]" :key="index">
                  {{ item }}
                </text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="settings-content" v-if="activeIndex === 6">
        <div class="settings-content-left">
          <div class="settings-content-items">
            <div style="padding-right: 20px" :class="[
              'settings-content-item',
              leftSelectedIndex5 === index ? 'selected-item-special' : '',
            ]" v-for="(item, index) in ['虚岁', '实岁']" :key="index" @click="switchXSS(index)">
              {{ item }}显示
              <div class="settings-content-point"></div>
            </div>
            <div class="xss-content">
              <div class="xss-content-text">
                在中华文化中，年龄的计算方式一直存在着一种独特的二元性，即“虚岁”与“实岁”（或称“周岁”）的并存。这两种计算方式不仅反映了古代与现代对时间认知的差异，也蕴含了深厚的文化意蕴和民俗习惯。实岁是孩子呱呱落地，从0算起。而虚岁却是一出生，就是1岁了。
              </div>
              <div class="xss-content-title">什么是虚岁？</div>
              <div class="xss-content-text">
                虚岁是中国传统的计算年龄的方式，“虚岁”从一算起，逢新年（大年初一）长一岁，遵循农历。
              </div>
              <div class="xss-content-text">
                例如：2000年7月1日出生，2000年当年为一岁，2001年农历大年初一为两岁，2002年农历大年初一为三岁。
              </div>
              <div class="xss-content-text">
                这里需要注意的是，无论出生日期的早晚，只要过了农历新年，年龄就增加一岁。因此，虚岁并不与个人的实际生日相关联，而是与春节的日期紧密相关。
              </div>
              <div class="xss-content-title">什么是周岁？</div>
              <div class="xss-content-text">
                周岁，又称实足年龄或实岁，是国际通用的年龄计算方式。周岁从零算起，逢生日长一岁，遵循阳历。例如：2000年7月1日出生，2001年7月1日前为0周岁，2001年7月2日开始为1周岁，2002年7月2日开始为2周岁。
              </div>
              <div class="xss-content-title">虚实岁的流派使用</div>
              <div class="xss-content-text">
                虚岁与实岁作为中国传统文化与现代科学的两种年龄计算方式，都各有其独特的魅力和价值。
              </div>
              <div class="xss-content-text">
                在命理方面，不同流派或地区可能会存在差异，特别是在年龄计算上。问真八字目前提供虚岁与实岁两种选项，默认选中
                <span class="xss-content-title">“虚岁”</span>。
              </div>
              <div class="xss-content-text">
                用户可以根据自己的实际情况和信仰偏好进行选择，无论是遵循传统方法的用户还是偏好国际标准的用户都能得到满足。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="settings-content-container">
      <div class="settings-content">
        <NoVIPCard :content="noVIPContents[activeIndex]" widthValue="474px" />
      </div>
    </div>
    <PopupBox v-if="isShowDialog" :width="dialogWidth" :height="dialogHeight" @onFullClick="closeDialog">
      <ImgDialog :title="dialogTitle" :imgUrl="imgUrl" @close="closeDialog" />
    </PopupBox>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineProps, watch } from 'vue'
import { DiZhi, TianGan } from '@/static/index.js'
import store from '@/store'
import { updateSetting, delSetting, resetSetting } from '@/api/setting.js'
import {
  gzRelation_tg,
  gzRelation_dz,
  setting_gzrelation_default,
  setting_dizhizg_default,
  ryslList,
  ssSequenceList,
  sysSSList,
  ylTitles,
  ylData,
  ylData4_content,
  specialList,
  ylData2,
  setting_geju_default,
} from '../static.js'
import {
  getTypeId,
  getTypeName,
  getMainTagsName,
  getDataName,
  handleGetSetting,
  getPostSSValue,
} from '../utils.js'
import { ElMessage } from 'element-plus'
import NoVIPCard from '@/components/noVIPCard'
import PopupBox from '@/components/popupBox'
import ImgDialog from '@/components/imgDialog'
const leftArrow = require('@/assets/images/icon_left_arrow.png')
const iconSelected = require('@/assets/images/icon_selected.png')
const iconAttention = require('@/assets/images/icon_attention.png')
const imgUrl = ref('')
const userguid = computed(() => store.getters.userguid)
const vipLevel = computed(() => store.getters.viplevel)

const props = defineProps({
  setIndex: {
    type: Number,
    default: 0,
  },
})
watch(props, (nweProps) => {
  activeIndex.value = nweProps.setIndex
})
const isReset0 = computed(() => {
  const type = leftSelectedIndex0.value < 4 ? 'tg' : 'dz'
  const index = settingGZRelation.value[type].findIndex(
    (item) => item.id === leftSelectedIndex0.value,
  )
  return (
    JSON.stringify(settingGZRelation.value[type][index]) !==
    JSON.stringify(setting_gzrelation_default[type][index])
  )
})
const isRest1 = computed(() => {
  return (
    JSON.stringify(settingDiZhiZG.value) !==
    JSON.stringify(setting_dizhizg_default)
  )
})
const isReset2 = computed(() => {
  return (
    JSON.stringify(settingGeJu.value) !== JSON.stringify(setting_geju_default)
  )
})
const isReset3 = computed(() => {
  const index = sysShenShaList.value.findIndex(
    (item) => item.name === sysSSListR.value.name,
  )
  const sysShenShaListDefault = initSystemList(true)
  return (
    JSON.stringify(sysShenShaListDefault[index]) !== JSON.stringify(sysSSListR.value)
  )
})
const noVIPContents = [
  '开通VIP会员，即可解锁智能四柱图示中干支关系的设置。包括天干关系的相冲、相克、五合；地支关系的六合、三合、三会、暗合、相刑、相冲、相破、相害',
  '开通VIP会员，即可对基本排盘和专业细盘的藏干进行自定义设置',
  '开通VIP会员，即可使用不同古籍流派的人元司令分野',
  '开通VIP会员，即可对基本排盘和专业细盘的神煞进行显示设置，也可查看所有神煞的规则和原理',
  '开通VIP会员，即可对命宫、身宫进行显示设置。',
  '开通VIP会员，即可对小真智能系统和师傅点评的格局进行自定义设置。并提供主流命理古籍中，格局的满足条件和详细原理，方便用户快速读懂和学习古籍格局知识',
  '开通VIP会员，即可对专业细盘的岁数进行实岁和虚岁的设置。',
]
const titles = [
  '干支关系',
  '地支藏干',
  '人元司令',
  '神煞设置',
  '命宫身宫',
  '格局取法',
  '虚实岁',
]
const listLocation = [
  {
    id: 1,
    name: '原局四柱，须两干紧邻相贴',
  },
  {
    id: 2,
    name: '原局四柱，任何两干',
  },
]
const gongList = [
  {
    id: 1,
    title: '命宫显示',
    content: '命宫算法：月令过中气按次月推算',
    label: 'showMing',
    setkey: 'mingGongMethod',
  },
  {
    id: 2,
    title: '身宫显示',
    content: '身宫算法：月令过中气按次月推算',
    label: 'showShen',
    setkey: 'shenGongMethod',
  },
]

const cloneDefault = (value) => JSON.parse(JSON.stringify(value))

const parseLocalSetting = (key) => {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null || raw === '') return undefined
    return JSON.parse(raw)
  } catch (error) {
    return undefined
  }
}

const readLocalSetting = (key, defaultValue, normalize) => {
  const value = parseLocalSetting(key)
  if (value === undefined) return cloneDefault(defaultValue)
  return normalize ? normalize(value) : value
}

const normalizeGZRelationList = (value, defaultValue) => {
  if (!Array.isArray(value)) return cloneDefault(defaultValue)

  return defaultValue.map((defaultItem) => {
    const item = value.find((option) => option && option.id === defaultItem.id)
    const result = cloneDefault(defaultItem)
    if (!item || typeof item !== 'object') return result

    if (typeof item.switch === 'boolean') result.switch = item.switch
    if (typeof item.selected === 'number') result.selected = item.selected
    if (
      Array.isArray(item.datas) &&
      item.datas.length === result.datas.length &&
      item.datas.every((data) => typeof data === 'string')
    ) {
      result.datas = item.datas.slice()
    }
    return result
  })
}

const normalizeGZRelation = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return cloneDefault(setting_gzrelation_default)
  }

  return {
    tg: normalizeGZRelationList(value.tg, setting_gzrelation_default.tg),
    dz: normalizeGZRelationList(value.dz, setting_gzrelation_default.dz),
  }
}

const normalizeDiZhiZG = (value) => {
  if (!Array.isArray(value)) return cloneDefault(setting_dizhizg_default)

  return setting_dizhizg_default.map((defaultItem) => {
    const item = value.find((option) => option && option.id === defaultItem.id)
    return {
      ...cloneDefault(defaultItem),
      value: item && typeof item.value === 'string' ? item.value : defaultItem.value,
    }
  })
}

const normalizeGeJu = (value) => {
  const result = cloneDefault(setting_geju_default)
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result

  if (
    Array.isArray(value.ylValues) &&
    value.ylValues.length === result.ylValues.length
  ) {
    result.ylValues = value.ylValues.slice()
  }
  if (
    Array.isArray(value.additionValues) &&
    value.additionValues.length === result.additionValues.length
  ) {
    result.additionValues = value.additionValues.slice()
  }
  if (
    Array.isArray(value.specialValues) &&
    value.specialValues.length === result.specialValues.length
  ) {
    result.specialValues = value.specialValues.slice()
  }
  if (Array.isArray(value.ylDatas) && value.ylDatas.length === result.ylDatas.length) {
    result.ylDatas = result.ylDatas.map((defaultItem, index) =>
      Array.isArray(value.ylDatas[index]) &&
      value.ylDatas[index].length === defaultItem.length
        ? value.ylDatas[index].slice()
        : defaultItem,
    )
  }

  return result
}

const normalizeRysl = (value) => {
  const result = {
    switch: true,
    selected: 0,
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result
  if (typeof value.switch === 'boolean') result.switch = value.switch
  if (typeof value.selected === 'number') result.selected = value.selected
  return result
}

const normalizeOther = (value) => {
  const result = {
    showMing: false,
    showShen: false,
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result
  if (typeof value.showMing === 'boolean') result.showMing = value.showMing
  if (typeof value.showShen === 'boolean') result.showShen = value.showShen
  return result
}

const readLocalBoolean = (key, defaultValue = false) => {
  const value = parseLocalSetting(key)
  return typeof value === 'boolean' ? value : defaultValue
}

const readLocalObject = (key) => {
  const value = parseLocalSetting(key)
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}
const columnsData = ref([
  {
    values: ['-', ...TianGan],
    defaultIndex: 0,
  },
  {
    values: ['-', ...TianGan],
    defaultIndex: 0,
  },
  {
    values: ['-', ...TianGan],
    defaultIndex: 0,
  },
])
const settingGZRelation = ref(
  JSON.parse(JSON.stringify(setting_gzrelation_default)),
)
const settingDiZhiZG = ref(JSON.parse(JSON.stringify(setting_dizhizg_default)))
const rightLists0 = ref(gzRelation_tg[0].lists)
const activeIndex = ref(0)
const leftSelectedIndex0 = ref(1)
const leftSelectedIndex1 = ref('CG_zi')
const leftSelectedIndex2 = ref(1)
const leftSelectedIndex3 = ref(0)
const leftSelectedIndex4 = ref(0)
const leftSelectedIndex5 = ref(0)
const selectedValue = ref(['-', '-', '-'])
const RYSLStatus = ref(true)
const isShowDialog = ref(false)
const dialogWidth = ref(0)
const dialogHeight = ref(0)
const dialogTitle = ref('')
const setting_rysl = ref({
  switch: true,
  selected: 0,
})
const setting_other = ref({
  showMing: false,
  showShen: false,
})
const settingGeJu = ref(
  readLocalSetting('setting_geju', setting_geju_default, normalizeGeJu),
)
const setting_age = ref(false)
const geJuContent = [
  {
    title: '天干关系',
    tip: '（普通格是什么）',
    list: [
      ['子', '午', '卯', '酉', '寅', '申', '巳', '亥', '辰', '戌', '丑', '未'],
      ['', '', '', '', '', '', '', '', '', '', '', ''],
    ],
  },
  {
    title: '附加规则（变格）',
    tip: '（附加规则说明）',
    list: [
      [
        '若月令发生三合局，则显示三合而成的变格',
        '若月令发生三会局，则显示三会而成的变格',
      ],
      ['', ''],
    ],
  },
  {
    title: '特殊格',
    tip: '（特殊格是什么）',
    list: [
      ['专旺格', '从弱格'],
      [
        '曲直格、炎上格、稼穑格、从革格、润下格、专旺格',
        '从财格、从杀格、从儿格、从弱格',
      ],
    ],
  },
]
const sysShenShaList = ref([])

// 神煞设置右边内容
const sysSSListR = ref({})
onMounted(async () => {
  await handleGetSetting()
  settingGZRelation.value = readLocalSetting(
    'setting_gzrelation',
    setting_gzrelation_default,
    normalizeGZRelation,
  )
  settingDiZhiZG.value = readLocalSetting(
    'setting_dizhizg',
    setting_dizhizg_default,
    normalizeDiZhiZG,
  )
  setting_rysl.value = readLocalSetting('setting_rysl', {
    switch: true,
    selected: 0,
  }, normalizeRysl)
  RYSLStatus.value = setting_rysl.value.switch
  leftSelectedIndex2.value = setting_rysl.value.selected
  sysShenShaList.value = initSystemList()
  sysShenShaList.value.forEach((item) => {
    if (item.name === '天乙贵人') {
      sysSSListR.value = item
    }
  })
  setting_other.value = readLocalSetting('setting_other', {
    showMing: false,
    showShen: false,
  }, normalizeOther)
  setting_age.value = readLocalBoolean('setting_age', false)
  leftSelectedIndex5.value = setting_age.value ? 1 : 0
  initPicker(leftSelectedIndex1.value)
  imgUrl.value = makeImgUrl(1)
})

// 组装图片路径
const makeImgUrl = (index = 1) => {
  return require(`@/assets/images/img_settings_geju${index}.png`)
}

// 切换设置
const switchSettings = (index) => {
  activeIndex.value = index
}

// 切换天干关系
const switchTGRelation = (id) => {
  leftSelectedIndex0.value = id
  rightLists0.value = gzRelation_tg.find((item) => item.id === id).lists
}

// 获取设置干支关系状态
const switchDZRelation = (id) => {
  leftSelectedIndex0.value = id
  rightLists0.value = gzRelation_dz.find((item) => item.id === id).lists
}

// 获取设置干支关系状态
const getSettingGZRelationStatus = (type, id, flag = 0) => {
  switch (flag) {
    case 0:
      return settingGZRelation.value[type].find((item) => item.id === id).switch
    case 1:
      return settingGZRelation.value[type].find((item) => item.id === id).datas
    case 2:
      return settingGZRelation.value[type].find((item) => item.id === id)
        .selected
    default:
      return false
  }
}

// 获取地支藏干状态
const getSettingDiZhiZGStatus = (id) => {
  id = settingDiZhiZG.value.findIndex((item) => item.id === id)
  return id > -1 ? DiZhi[id] : ''
}

// 获取地支藏干状态
const switchGZRelation = async (type, id) => {
  const idIndex = settingGZRelation.value[type].findIndex(
    (item) => item.id === id,
  )
  const param = new URLSearchParams()
  param.append('UserGuid', userguid.value)
  param.append('platformid', 2)
  param.append('setkey', `GZMainState${id}`)
  param.append(
    'setvalue',
    settingGZRelation.value[type][idIndex].switch ? false : true,
  )
  param.append('type', 3)
  const res = await updateSetting(param)
  if (res.code === 1) {
    settingGZRelation.value[type][idIndex].switch =
      !settingGZRelation.value[type][idIndex].switch
    saveSetting(0)
  } else {
    ElMessage.error('设置失败')
  }
}

// 切换干支关系条件
const switchGZCondition = async (type, id, index, index1, id1) => {
  const idIndex = settingGZRelation.value[type].findIndex(
    (item) => item.id === id,
  )
  let dataString = settingGZRelation.value[type][idIndex].datas[index]
  const param = new URLSearchParams()
  param.append('UserGuid', userguid.value)
  param.append('platformid', 2)
  param.append('setkey', `GZItemState${id1}`)
  param.append('setvalue', dataString[index1] === '0' ? true : false)
  param.append('type', 3)
  const res = await updateSetting(param)
  if (res.code === 1) {
    let newChar = dataString[index1] === '0' ? '1' : '0'
    let newDataString =
      dataString.substring(0, index1) +
      newChar +
      dataString.substring(index1 + 1)
    settingGZRelation.value[type][idIndex].datas[index] = newDataString
    saveSetting(0)
  } else {
    ElMessage.error('设置失败')
  }
}

// 切换干支关系位置
const switchGZLocation = async (type, id, index) => {
  const idIndex = settingGZRelation.value[type].findIndex(
    (item) => item.id === id,
  )
  const param = new URLSearchParams()
  param.append('UserGuid', userguid.value)
  param.append('platformid', 2)
  param.append('setkey', `GZMainRule${id}`)
  param.append('setvalue', index === 0 ? true : false)
  param.append('type', 3)
  const res = await updateSetting(param)
  if (res.code === 1) {
    settingGZRelation.value[type][idIndex].selected = index
    saveSetting(0)
  } else {
    ElMessage.error('设置失败')
  }
}

// 切换地支藏干
const switchDiZhiZG = (id) => {
  leftSelectedIndex1.value = id
  initPicker(id)
}

// 切换人员司令
const switchRYSL = async () => {
  const param = new URLSearchParams()
  param.append('UserGuid', userguid.value)
  param.append('platformid', 2)
  param.append('setkey', 'ryslfyShow')
  param.append('setvalue', !RYSLStatus.value)
  param.append('type', 4)
  const res = await updateSetting(param)
  if (res.code === 1) {
    RYSLStatus.value = !RYSLStatus.value
    saveSetting(2)
  } else {
    ElMessage.error('设置失败')
  }
}

// 切换人员司令索引
const switchRYSLIndex = (id) => {
  leftSelectedIndex2.value = id
  saveSetting(2)
}

// 切换神煞显示
const switchSSS = (index, name) => {
  leftSelectedIndex3.value = index
  sysShenShaList.value.forEach((item) => {
    if (item.name === name) {
      sysSSListR.value = item
    }
  })
}

// 格局设置
const setGeJu = (type, index, index1 = 0) => {
  switch (type) {
    case 'ylValues':
      settingGeJu.value[type][leftSelectedIndex4.value] = index
      break
    case 'additionValues':
    case 'specialValues':
      settingGeJu.value[type][index] = !settingGeJu.value[type][index]
      break
    case 'ylDatas':
      settingGeJu.value[type][leftSelectedIndex4.value][index] =
        !settingGeJu.value[type][leftSelectedIndex4.value][index]
      break
    case 'ylDatas1':
      settingGeJu.value.ylDatas[leftSelectedIndex4.value][index] = index1
      break
    default:
      return
  }
  saveSetting(5)
}

// 切换格局取法
const switchOther = async (label, setkey) => {
  const param = new URLSearchParams()
  param.append('UserGuid', userguid.value)
  param.append('platformid', 2)
  param.append('setkey', setkey)
  param.append('setvalue', !setting_other.value[label] ? 'true' : 'false')
  param.append('type', 4)
  const res = await updateSetting(param)
  if (res.code == 1) {
    setting_other.value[label] = !setting_other.value[label]
    saveSetting(4)
  } else {
    ElMessage.error('设置失败')
  }
}

// 切换格局
const switchGeJu = (index) => {
  leftSelectedIndex4.value = index
}

// 切换系统神煞
const switchXSS = async (index) => {
  const age = index === 1
  if (age === setting_age.value) {
    return
  }
  const param = new URLSearchParams()
  param.append('UserGuid', userguid.value)
  param.append('platformid', 2)
  param.append('setkey', 'xuShiSui')
  param.append('setvalue', age ? 'true' : 'false')
  param.append('type', 4)
  const res = await updateSetting(param)
  if (res.code === 1) {
    setting_age.value = age
    leftSelectedIndex5.value = setting_age.value ? 1 : 0
    saveSetting(6)
  } else {
    ElMessage.error('设置失败')
  }
}

// 设置系统神煞开启关闭
const setSSS = async (name) => {
  const index = sysShenShaList.value.findIndex((item) => item.name === name)
  sysShenShaList.value[index].switch = !sysShenShaList.value[index].switch
  for (let i = 0; i < sysShenShaList.value[index].idArr.length; i++) {
    const CSS_name = `CSS_${sysShenShaList.value[index].idArr[i]}`
    let sysSSList = readLocalObject('setting_shensha_sys')
    const setvalue = getPostSSValue(sysShenShaList.value[index], true, i)
    const param = new URLSearchParams()
    param.append('UserGuid', userguid.value)
    param.append('platformid', 2)
    param.append('setkey', CSS_name)
    param.append('setvalue', setvalue)
    param.append('type', 6)
    const res = await updateSetting(param)
    if (res.code === 1) {
      sysSSList[CSS_name] = setvalue
      localStorage.setItem('setting_shensha_sys', JSON.stringify(sysSSList))
    } else {
      ElMessage.error('设置失败')
      sysShenShaList.value[index].switch = !sysShenShaList.value[index].switch
      return
    }
  }
}

// 获取地支
const getDiZhi = (id) => {
  id = settingDiZhiZG.value.findIndex((item) => item.id === id)
  return id > -1 ? DiZhi[id] : ''
}

// 获取藏干
const getZG = (arr, id) => {
  id = arr.findIndex((item) => item.id === id)
  return id > -1 && arr[id] && typeof arr[id].value === 'string'
    ? arr[id].value.replaceAll(' ', '')
    : ''
}

// 初始化藏干选择器
const initPicker = (id) => {
  id = settingDiZhiZG.value.findIndex((item) => item.id === id)
  const value =
    id > -1 && settingDiZhiZG.value[id] && typeof settingDiZhiZG.value[id].value === 'string'
      ? settingDiZhiZG.value[id].value
      : setting_dizhizg_default[0].value
  const arr = value.split(' ')
  // 不足三个干支补“-”
  if (arr.length < 3) {
    for (let i = arr.length; i < 3; i++) {
      arr.push('-')
    }
  }
  for (let i = 0; i < 3; i++) {
    columnsData.value[i].defaultIndex =
      TianGan.findIndex((item) => item === arr[i]) + 1
  }
}

// 打开弹窗
const openDialog = (index) => {
  imgUrl.value = makeImgUrl(index + 1)
  const heights = [695, 380, 846]
  const titles = ['普通格是什么', '附加规则说明', '特殊格是什么']
  dialogWidth.value = 950
  dialogHeight.value = heights[index]
  dialogTitle.value = titles[index]
  isShowDialog.value = true
}

// 关闭弹窗
const closeDialog = () => {
  isShowDialog.value = false
}

// 重置干支关系设置
const resetSettings0 = async (type, id) => {
  if (!isReset0.value) {
    // ElMessage.warning('当前设置与默认设置一致，无需重置！')
    return
  }
  const delitems = []
  delitems.push(`GZMainState${id}`)
  delitems.push(`GZMainRule${id}`)
  const idIndex = setting_gzrelation_default[type].findIndex(
    (item) => item.id === id,
  )
  let obj = gzRelation_tg
  if (type === 'dz') {
    obj = gzRelation_dz
  }
  obj[idIndex].lists.forEach((item) => {
    item.list.forEach((item1) => {
      delitems.push(`GZItemState${item1.id}`)
    })
  })
  delitems.forEach(async (item) => {
    await delSetting(userguid.value, item)
  })
  settingGZRelation.value[type][idIndex] = JSON.parse(
    JSON.stringify(setting_gzrelation_default[type][idIndex]),
  )
  saveSetting(0)
}

// 重置地支藏干设置
const resetSettings1 = async () => {
  if (!isRest1.value) {
    // ElMessage.warning('当前设置与默认设置一致，无需重置！')
    return
  }
  const res = await resetSetting(userguid.value, 5)
  if (res.code === 1) {
    settingDiZhiZG.value = JSON.parse(JSON.stringify(setting_dizhizg_default))
    saveSetting(1)
    initPicker(leftSelectedIndex1.value)
  } else {
    ElMessage.error('设置失败')
  }
}

// 重置格局设置
const resetSettings2 = () => {
  if (!isReset2.value) {
    // ElMessage.warning('当前设置与默认设置一致，无需重置！')
    return
  }
  settingGeJu.value = JSON.parse(JSON.stringify(setting_geju_default))
  saveSetting(5)
}

// 重置神煞设置
const resetSettings3 = async () => {
  if (!isReset3.value) {
    // ElMessage.warning('当前设置与默认设置一致，无需重置！')
    return
  }
  const index = sysShenShaList.value.findIndex(
    (item) => item.name === sysSSListR.value.name,
  )
  for (let i = 0; i < sysShenShaList.value[index].idArr.length; i++) {
    const CSS_name = `CSS_${sysShenShaList.value[index].idArr[i]}`
    let sysSSList = readLocalObject('setting_shensha_sys')
    if (sysSSList[CSS_name]) {
      const res = await delSetting(userguid.value, CSS_name)
      if (res.code === 1) {
        delete sysSSList[CSS_name]
        localStorage.setItem('setting_shensha_sys', JSON.stringify(sysSSList))
      } else {
        ElMessage.error('设置失败')
        return
      }
    }
  }
  await handleGetSetting()
  sysShenShaList.value = initSystemList()
  sysShenShaList.value.forEach((item) => {
    if (item.name === ssSequenceList[leftSelectedIndex3.value]) {
      sysSSListR.value = item
    }
  })
}
// 选择器改变
const onChangePicker = async (e) => {
  const index = settingDiZhiZG.value.findIndex(
    (item) => item.id === leftSelectedIndex1.value,
  )
  if (index < 0) return
  if (e[0] === '-' && e[1] === '-' && e[2] === '-') {
    ElMessage.warning('请至少选择一项！')
    settingDiZhiZG.value[index].value = JSON.parse(
      JSON.stringify(setting_dizhizg_default[index].value),
    )
    initPicker(leftSelectedIndex1.value)
  } else {
    const selectedValue = e.join(' ').replaceAll('-', '').trim()
    const param = new URLSearchParams()
    param.append('UserGuid', userguid.value)
    param.append('platformid', 2)
    param.append('setkey', leftSelectedIndex1.value)
    param.append('setvalue', selectedValue)
    param.append('type', 5)
    const res = await updateSetting(param)
    if (res.code === 1) {
      settingDiZhiZG.value[index].value = selectedValue
      saveSetting(1)
    } else {
      ElMessage.error('设置失败')
      settingDiZhiZG.value[index].value = JSON.parse(
        JSON.stringify(setting_dizhizg_default[index].value),
      )
      initPicker(leftSelectedIndex1.value)
    }
  }
}

// 存储设置
const saveSetting = (index) => {
  switch (index) {
    case 0:
      localStorage.setItem(
        'setting_gzrelation',
        JSON.stringify(settingGZRelation.value),
      )
      break
    case 1:
      localStorage.setItem(
        'setting_dizhizg',
        JSON.stringify(settingDiZhiZG.value),
      )
      break
    case 2:
      localStorage.setItem(
        'setting_rysl',
        JSON.stringify({
          switch: RYSLStatus.value,
          selected: leftSelectedIndex2.value,
        }),
      )
      break
    case 4:
      localStorage.setItem('setting_other', JSON.stringify(setting_other.value))
      break
    case 5:
      localStorage.setItem('setting_geju', JSON.stringify(settingGeJu.value))
      break
    case 6:
      localStorage.setItem('setting_age', JSON.stringify(setting_age.value))
      break
    default:
      return
  }
}

// 判断是否为数组
const isArray1 = (arr) => {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

const handleList = (list) => {
  const map = {}
  list.forEach((item) => {
    if (map[item.name]) {
      map[item.name].idArr.push(item.id)
      map[item.name].sexArr.push(item.sex)
      map[item.name].mainArr.push(item.main)
      map[item.name].tagsArr.push(item.tags)
      map[item.name].dataArr.push(item.data)
      map[item.name].typeIdArr.push(
        item.typeId ? item.typeId : getTypeId(item.main, item.tags),
      )
    } else {
      map[item.name] = {
        name: item.name,
        switch: item.switch,
        idArr: [item.id],
        sexArr: [item.sex],
        mainArr: [item.main],
        tagsArr: [item.tags],
        dataArr: [item.data],
        typeIdArr: [
          item.typeId ? item.typeId : getTypeId(item.main, item.tags),
        ],
      }
    }
  })
  return map
}

// 初始化系统神煞
const initSystemList = (isDefault = false) => {
  let systemList = JSON.parse(JSON.stringify(sysSSList))
  if (!isDefault) {
    systemList.forEach((item) => {
      item.switch = true
      let shenShaSys = readLocalObject('setting_shensha_sys')
      let curSetting = shenShaSys[`CSS_${item.id}`]
      if (curSetting) {
        curSetting = curSetting.split('|')
        item.main = curSetting[3]
        item.tags = curSetting[4]
        item.data = curSetting[6] ? JSON.parse(curSetting[6]) : {}
        item.switch = JSON.parse(curSetting[7])
        item.typeId = curSetting[8]
      }
    })
  } else {
    systemList.forEach((item) => {
      item.switch = true
    })
  }
  systemList = Object.values(handleList(systemList))
  return systemList
}
</script>

<style lang="scss" scoped>
$themeColor: #b2955d;
$fontColor: #494949;
$borderColor: #e6e6e6;
$fontSize: 14px;

::-webkit-scrollbar {
  width: 10px;
  height: 5px;
}
:hover::-webkit-scrollbar-thumb {
  border-radius: 30px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #dedfe1;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  flex-shrink: 0;
  line-height: 1;
}

:root {
  --van-picker-option-text-color: #101010;
}

// 穿透样式
:deep(.van-picker-column__item--selected) {
  // background-color: #f5f5f5;
  color: #101010 !important;
}

:deep(.van-picker-column__item) {
  // color: #c6c6c6;
}

:deep(.popup-box) {
  padding: 0 !important;
  border-radius: 0 !important;
  background-color: transparent !important;
}

.settings-box {
  width: 100%;
  height: 1028px;
  color: $fontColor;

  .title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    overflow: hidden;
    border-radius: 15px 15px 0 0;
    border-bottom: 1px solid $borderColor;

    .title-option {
      height: 100%;
      font-size: $fontSize;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      cursor: pointer;
    }
  }

  .settings-content-container {
    width: 100%;
    height: calc(100% - 60px);
    padding: 2% 2.5%;
    box-sizing: border-box;

    .settings-content {
      width: 100%;
      height: 100%;
      border: 1px solid $borderColor;
      border-radius: 15px;
      display: flex;
      overflow: hidden;

      .settings-content-left {
        width: 50%;
        height: 100%;
        border-right: 1px solid $borderColor;
        overflow: auto;
      }

      .settings-content-right {
        width: 50%;
        height: 100%;
        overflow: auto;

        .settings-content-rectangle0,
        .settings-content-rectangle1 {
          border: 1px solid $borderColor;
          width: calc(100% - 72px);
          height: 67px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 0 36px;
          margin-top: 50px;
          border-radius: 10px;
          overflow: hidden;
          position: relative;

          .settings-content-rectangle-up {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 70%;

            .settings-content-rectangle-text0 {
              color: #101010;
            }

            .settings-content-rectangle-text1 {
              color: $themeColor;
              font-weight: bold;
            }

            .settings-content-rectangle-line {
              flex-grow: 1;
              margin: 0 10px;
              height: 1px;
              background-color: #bbbbbb;
            }
          }

          .settings-content-rectangle-down {
            color: #737373;
            font-size: 11px;
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
          }
        }

        .settings-content-rectangle1 {
          height: 280px;
          display: block;
          margin-top: 20px;
          padding: 15px 0;
        }
      }

      .settings-content-rysllist {
        width: 100%;
        height: calc(100% - 50px);
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;

        .settings-content-ryslitem-container {
          width: 33.3%;
          height: 50%;
          border: 1px solid $borderColor;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;

          .settings-content-ryslitem {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            flex-shrink: 1;

            .settings-content-ryslitem-title {
              font-size: 15px;
              line-height: 2;
            }

            .settings-content-ryslitem-content {
              font-size: $fontSize;
              white-space: pre-wrap;
              text-align: left;
              line-height: 1.5;
            }
          }

          .settings-content-title-img {
            height: 28px;
            width: 28px;
            border: none;
            border-radius: 50%;
            position: absolute;
            bottom: 14px;
            right: 16px;
          }

          &:nth-child(4) {
            border-bottom-left-radius: 15px;
          }

          &:nth-child(6) {
            border-bottom-right-radius: 15px;
          }
        }

        .settings-content-ryslitem-container-active {
          border-color: $themeColor;

          .settings-content-ryslitem-title {
            color: $themeColor !important;
          }

          .settings-content-title-img {
            background-color: $themeColor;
          }
        }
      }

      .settings-content-items {
        .settings-content-item-geju {
          &:last-child {
            border-bottom: none;
          }
        }
      }

      .settings-content-title {
        height: 50px;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid $borderColor;
        padding: 0 20px;
      }

      .settings-content-title-img {
        width: 18px;
        height: 18px;
        border-radius: 3px;
        border: 1px solid #bbbbbb;
        cursor: pointer;
      }

      .settings-content-title-special {
        margin-top: 7px;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: -7px;
          left: 0;
          width: 100%;
          height: 7px;
          background-color: $borderColor;
        }
      }

      .settings-content-title-tips {
        display: flex;
        align-items: center;
        font-size: 15px;
        color: rgba($color: $fontColor, $alpha: 0.6);
        font-weight: normal;
        cursor: pointer;

        .settings-content-title-tips-img {
          width: 22px;
          height: 22px;
        }
      }

      .settings-content-item {
        height: 40px;
        font-size: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid $borderColor;
        padding: 0 8px 0 20px;

        .settings-content-item-status {
          opacity: 0.6;
          display: flex;
          align-items: center;
          justify-content: center;

          .settings-content-item-status-img {
            width: 21px;
            height: 21px;
            margin-bottom: 2px;
            opacity: 0;
          }
        }

        .settings-content-item-content {
          font-size: $fontSize;
          color: #737373;
          white-space: pre-wrap;
        }

        .settings-content-point {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1px solid #bbbbbb;
          position: relative;
          cursor: pointer;

          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background-color: #fff;
            border-radius: 50%;
            // display: none;
          }
        }
      }

      .settings-content-item-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .settings-content-item-special {
        padding: 0 20px;
      }

      .settings-content-item-img {
        width: 18px;
        height: 18px;
        border-radius: 3px;
        border: 1px solid #bbbbbb;
        cursor: pointer;
      }

      .settings-content-item-geju {
        width: 100%;
        padding-right: 0;
        padding-left: 14px;
        font-size: $fontSize;
        position: relative;
        font-weight: normal;

        &::before {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: $fontColor;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }

      .special-tips-content {
        padding: 24px 20px 0;
        text-align: justify;

        .special-tips-content-title {
          font-size: 15px;
          color: $fontColor;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .special-tips-content-text {
          font-size: 12px;
          line-height: 1.5;
        }
      }
    }
  }
}

.selected-item {
  color: $themeColor !important;
  background-color: rgba($color: $themeColor, $alpha: 0.1) !important;
  font-weight: bold !important;

  .settings-content-item-status {
    font-weight: normal !important;
    opacity: 1 !important;

    .settings-content-item-status-img {
      opacity: 1 !important;
    }
  }
}

.selected-item-special {
  color: $themeColor !important;

  .settings-content-point {
    background-color: $themeColor !important;
  }

  &::before {
    background-color: $themeColor !important;
  }
}

.selected-option {
  background-color: $themeColor;
}

.settings-content-reset-button {
  width: 152px;
  height: 40px;
  margin: 42px auto 0;
  border-radius: 22px;
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: #dcdcdc;
  border-top: 1px solid $borderColor;
  cursor: not-allowed;
}

.settings-content-reset-button-active {
  background-color: $themeColor;
  cursor: pointer;
}

.xss-content {
  padding: 10px 20px;
  font-size: $fontSize;
  text-align: justify;

  .xss-content-text {
    line-height: 1.5;
    margin-bottom: 6px;
  }

  .xss-content-title {
    line-height: 1.5;
    margin-top: 26px;
    margin-bottom: 4px;
    color: $themeColor;
  }
}
:deep(.van-picker__mask) {
  background-image:
  linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 0.7)
    ),
    linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
}
:deep(.van-picker__columns) {
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    pointer-events: none;
    height: calc(100% / 5);
    // border-radius: 5px;
    background-color: rgba(245, 245, 245, 1);
  }
}
</style>
