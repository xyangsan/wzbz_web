<template>
  <div v-if="type == 0 || showForm" class="form-box">
    <div v-if="!isPaipan" class="add-item pointer" @click="onBack">
      <img
        class="add-item-icon"
        :src="require('@/assets/images/left_round_icon.png')"
        alt=""
      />
      返回
    </div>
    <el-input
      v-model="infoData.name"
      placeholder="请输入姓名"
      style="margin-bottom: 13px"
      :maxlength="30"
    />
    <div class="form-row" style="margin-bottom: 16px">
      <div class="form-row-left form-row-item-box">
        <div
          class="form-row-item pointer"
          :class="{ selectedItem: infoData.sex == 1 }"
          @click="onSexClick(1)"
        >
          男
        </div>
        <div
          class="form-row-item pointer"
          :class="{ selectedItem: infoData.sex != 1 }"
          @click="onSexClick(0)"
        >
          女
        </div>
      </div>
      <div v-if="!isHepai" class="form-row-right form-row-item-box">
        <div
          class="form-row-item pointer"
          :class="{ selectedItem: !isSizhu && infoData.isSolar }"
          @click="onCalendarClick('solar')"
        >
          公历
        </div>
        <div
          class="form-row-item pointer"
          :class="{ selectedItem: !isSizhu && !infoData.isSolar }"
          @click="onCalendarClick('lunar')"
        >
          农历
        </div>
        <div
          class="form-row-item pointer"
          :class="{ selectedItem: isSizhu }"
          @click="onSizhuClick"
        >
          四柱
        </div>
      </div>
    </div>
    <div
      v-if="isHepai"
      class="form-row"
      style="margin-bottom: 16px; margin-top: 4px"
    >
      <div class="form-row-left form-row-item-box">
        <div
          class="form-row-item pointer"
          :class="{ selectedItem: infoData.isSolar }"
          @click="onCalendarClick('solar')"
        >
          公历
        </div>
        <div
          class="form-row-item pointer"
          :class="{ selectedItem: !infoData.isSolar }"
          @click="onCalendarClick('lunar')"
        >
          农历
        </div>
        <div
          class="form-row-item pointer"
          :class="{ selectedItem: isSizhu }"
          @click="onSizhuClick"
        >
          四柱
        </div>
      </div>
    </div>
    <el-input
      v-model="calendarStr"
      placeholder="请输入出生时间"
      style="margin-bottom: 13px"
      readonly="readonly"
      @click="onCalendarClick(false)"
    />
    <el-input
      v-model="addressStr"
      placeholder="请输入出生地址"
      readonly="readonly"
      @input="onAddressInput"
      @click="onAddressClick"
    />
    <div v-if="isPaipan" class="form-row" style="margin-top: 30px">
      <div class="type-box">
        分类：
        <div class="type-item-box">
          <div
            class="type-item pointer"
            :class="{ selectedItem: infoData.typeId == item.id }"
            v-for="item in typeList"
            :key="item.id"
            @click="onTypeClick(item.id)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <el-switch
        class="save-box"
        v-model="infoData.isSave"
        active-color="#bb9c5c"
        active-text="保存八字"
      />
    </div>
  </div>
  <div v-else class="select-btns flexCenter">
    <div class="select-btn selectBtn1 pointer" @click="onOpenAddCase">
      从档案列表选择
    </div>
    <div class="select-btn selectBtn2 pointer" @click="onShowForm">
      新增案例
    </div>
  </div>
  <AddCase
    v-show="!isPaipan && isShowAddCase"
    @onClose="onCloseAddCase"
    @onDetail="onDetail"
    @onFullClick="onCloseAddCase"
  />
  <popup-box
    v-show="isShowPopupBox"
    :height="sizhuVisiblePopup ? 320 : 340"
    style="z-index: 1001"
    @onFullClick="onClosePopupBox"
  >
    <van-picker
      v-if="dateVisiblePopup"
      :columns="isSolar ? solarDatas : lunarDatas"
      @confirm="onConfirmDate"
      @cancel="onClosePopupBox"
      @change="onChangeDate"
    />
    <van-picker
      v-if="addressVisiblePopup"
      :columns="AllCitys"
      @confirm="onConfirmAddress"
      @cancel="onClosePopupBox"
    />
    <SizhuBox
      v-if="sizhuVisiblePopup"
      :isShowPopupBox="isShowPopupBox"
      @onClose="onClosePopupBox"
      @onClickDate="onClickDate"
    />
  </popup-box>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
} from 'vue'
import { useRoute } from 'vue-router'
import AddCase from './addCase'
import SizhuBox from './sizhuBox'
import PopupBox from '../popupBox'
import { isLeapYear, getLunarLeapMonth, getDayCountOfLunarMonth } from '@/utils'
import { AllCitys, monthArray, dayArray, solarNumberDays } from '@/static'
import store from '@/store'
import * as homeApi from '@/api/home-api'
import { dateStrToArr } from '@/utils'

const route = useRoute()
const props = defineProps({
  type: {
    type: Number,
    default: 0,
  },
  // name sex isSolar calendar address sunTime typeId
  infoData: {
    type: Object,
    require: true,
  },
})
const emits = defineEmits(['onInitForm', 'onCalendar', 'onAddress'])
const guid = computed(() => store.getters.userguid)
const typeList = computed(() => store.getters.typeList)
const infoData = props.infoData
const calendarStr = ref('')
const addressStr = ref('')
const isPaipan = ref(false)
const isHepai = ref(false)
const isShowAddCase = ref(false)
const isShowPopupBox = ref(false)
const dateVisiblePopup = ref(false)
const addressVisiblePopup = ref(false)
const sizhuVisiblePopup = ref(false)
const solarDatas = reactive([
  {
    values: [],
    defaultIndex: 0,
  },
  {
    values: [],
    defaultIndex: 0,
  },
  {
    values: [],
    defaultIndex: 0,
  },
  {
    values: [],
    defaultIndex: 0,
  },
  {
    values: [],
    defaultIndex: 0,
  },
])
const lunarDatas = reactive([
  {
    values: [],
    defaultIndex: 0,
  },
  {
    values: [],
    defaultIndex: 0,
  },
  {
    values: [],
    defaultIndex: 0,
  },
  {
    values: [],
    defaultIndex: 0,
  },
  {
    values: [],
    defaultIndex: 0,
  },
])
const isSolar = ref(true)
const startYear = 1801,
  endYear = 2099
const isSizhu = ref(false)

const onAddressInput = (e) => {
  addressStr.value = `${infoData.address[0]} ${infoData.address[1]} ${infoData.address[2]}`
}
// 关闭添加案例
const onCloseAddCase = () => {
  isShowAddCase.value = false
}
// 打开添加案例
const onOpenAddCase = () => {
  isShowAddCase.value = true
}
// 切换性别
const onSexClick = (sex) => {
  infoData.sex = sex
}
// 打开日历弹框
const onCalendarClick = (data) => {
  data ? (isSolar.value = data == 'solar' ? true : false) : ''
  dateVisiblePopup.value = true
  addressVisiblePopup.value = false
  sizhuVisiblePopup.value = false
  isShowPopupBox.value = true
}
// 打开地址弹框
const onAddressClick = () => {
  dateVisiblePopup.value = false
  addressVisiblePopup.value = true
  sizhuVisiblePopup.value = false
  isShowPopupBox.value = true
}
// 打开四柱弹框
const onSizhuClick = () => {
  dateVisiblePopup.value = false
  addressVisiblePopup.value = false
  sizhuVisiblePopup.value = true
  isShowPopupBox.value = true
}
// 选择分类
const onTypeClick = (id) => {
  infoData.typeId = id
}
// 确定日期
const onConfirmDate = (data) => {
  infoData.isSolar = isSolar.value
  calendarStr.value = infoData.isSolar
    ? `${data[0]}年${data[1]}月${data[2]}日 ${data[3]}:${data[4]}`
    : `${data[0]}年${data[1]}${data[2]} ${data[3]}:${data[4]}`
  emits('onCalendar', data)
  isSizhu.value = false
  onClosePopupBox()
}
// 确定地址
const onConfirmAddress = (data) => {
  const res = {
    0: data[0].text,
    1: data[1].text,
    2: data[2].text,
    lng: data[2].gisGcj02Lng,
  }
  addressStr.value = `${res[0]} ${res[1]} ${res[2]}`
  emits('onAddress', res)
  onClosePopupBox()
}
// 关闭弹框
const onClosePopupBox = () => {
  isShowPopupBox.value = false
}
// 从四柱选择日期
const onClickDate = (item) => {
  props.infoData.calendar = dateStrToArr(item)
  calendarStr.value = item
  isSizhu.value = true
  onClosePopupBox()
}
// 监听日期变化
const onChangeDate = (value, index) => {
  /**
   * 阳历需判断闰年
   * 农历需判断闰月
   */
  if (index >= 2) return
  if (isSolar.value) {
    // 监听阳历的年、月变化
    changeSolarDate(value[0], value[1] - 1)
    // 如果当前日期的天数超出选择月份的总天数时，默认置为15
    if (index[2] > solarDatas.values.length) {
      solarDatas.defaultIndex = 14
    }
  } else {
    // 监听农历的年、月变化
    const monthIndex = lunarDatas[1].values.findIndex(
      (month) => month == value[1],
    )
    if (index == 0) {
      changeLunarYear(value[0], monthIndex)
    } else {
      changeLunarMonth(value[0], monthIndex)
    }
  }
}
// 更新阳历年、月
const changeSolarDate = (curYear, curMonth) => {
  // 闰年二月29天，平年二月28天
  const res = []
  let days = 0
  if (curMonth == 1) {
    days = isLeapYear(curYear) ? 29 : 28
  } else {
    days = solarNumberDays[curMonth]
  }
  for (let i = 1; i <= days; i++) res.push(i <= 9 ? '0' + i : i)
  solarDatas[2].values = res
}
// 更新农历日期：监听农历年份
const changeLunarYear = (curYear, curMonth) => {
  // 更新月份
  let leapMonth = getLunarLeapMonth(curYear)
  let lunarMonths = []
  lunarMonths.push(...monthArray)
  // 闰年
  if (leapMonth != 0)
    lunarMonths.splice(leapMonth, 0, '闰' + monthArray[leapMonth - 1])
  lunarDatas[1].values = lunarMonths
  changeLunarMonth(curYear, curMonth)
}
// 更新农历日期：监听农历月份
const changeLunarMonth = (curYear, curMonth) => {
  let leapMonth = getLunarLeapMonth(curYear)
  let lunarDayCount = 0
  let lunarDays = []
  if (leapMonth == 0) {
    // 平年
    lunarDayCount = getDayCountOfLunarMonth(curYear, curMonth + 1, false)
  } else {
    // 闰年
    if (curMonth == leapMonth) {
      if (curMonth == 0) {
        lunarDayCount = getDayCountOfLunarMonth(curYear, curMonth + 1, false)
      } else {
        lunarDayCount = getDayCountOfLunarMonth(curYear, curMonth, true)
      }
    } else if (curMonth > leapMonth) {
      lunarDayCount = getDayCountOfLunarMonth(curYear, curMonth, false)
    } else {
      lunarDayCount = getDayCountOfLunarMonth(curYear, curMonth + 1, false)
    }
  }
  for (let i = 0; i < lunarDayCount; i++) {
    lunarDays.push(dayArray[i])
  }
  lunarDatas[2].values = lunarDays
}
// 初始化农历数据
const initLunar = (now) => {
  const curYear = now.getFullYear()
  const curMonth = now.getMonth()
  const curHour = now.getHours()
  const curMinutes = now.getMinutes()

  for (let i = startYear; i <= endYear; i++) lunarDatas[0].values.push(i)
  lunarDatas[0].defaultIndex = curYear - startYear

  changeLunarYear(curYear, curMonth)

  for (let i = 0; i < 24; i++) lunarDatas[3].values.push(i <= 9 ? '0' + i : i)
  lunarDatas[3].defaultIndex = curHour

  for (let i = 0; i < 60; i++) lunarDatas[4].values.push(i <= 9 ? '0' + i : i)
  lunarDatas[4].defaultIndex = curMinutes
}
// 初始化阳历数据
const initSolar = (now) => {
  const curYear = now.getFullYear()
  const curMonth = now.getMonth()
  const curDay = now.getDate() - 1
  const curHour = now.getHours()
  const curMinutes = now.getMinutes()

  for (let i = startYear; i <= endYear; i++) solarDatas[0].values.push(i)
  solarDatas[0].defaultIndex = curYear - startYear

  for (let i = 1; i <= 12; i++) solarDatas[1].values.push(i <= 9 ? '0' + i : i)
  solarDatas[1].defaultIndex = curMonth

  changeSolarDate(curYear, curMonth)
  solarDatas[2].defaultIndex = curDay

  for (let i = 0; i < 24; i++) solarDatas[3].values.push(i <= 9 ? '0' + i : i)
  solarDatas[3].defaultIndex = curHour

  for (let i = 0; i < 60; i++) solarDatas[4].values.push(i <= 9 ? '0' + i : i)
  solarDatas[4].defaultIndex = curMinutes
}
// 从记录列表获取项
const onDetail = (item) => {
  console.log('onDetail', item)
  onShowForm()
  props.infoData.name = item.name
  props.infoData.sex = item.sex
  props.infoData.typeId = item.groupGuid
  let calendar = item.solarTime.split(' ')
  const date = calendar[0].split('-')
  const time = calendar[1].split(':')
  isSolar.value = true
  calendar = [...date, ...time]
  onConfirmDate(calendar)
  addressStr.value = item.location
  props.infoData.sunTime = item.sunTime
  onCloseAddCase()
}
// 初始化
const init = async () => {
  const path = route.path
  if (path == '/paipan/index') {
    // 初始化分组
    if (typeList.value.length == 1 && guid.value) {
      await homeApi
        .Request('user/customGroupList?userGuid=', guid.value, 1)
        .then(async (res) => {
          if (res.code == 0) {
            console.log('获取分组数据成功！', res.data.items)
            await store.dispatch('paipan/setTypeList', res.data.items)
          }
        })
        .catch((err) => {
          console.log('获取分组数据失败！', err)
        })
    }
    infoData.typeId = typeList.value[0].id
    isPaipan.value = true
  } else {
    if (path == '/hepan/index') {
      /**
       * 判断是否从合盘进入，如果是从合盘进来的，
       * 则性别和出生日期分两行显示
       */
      isHepai.value = true
    }
  }
  const curDate = new Date()
  initLunar(curDate)
  initSolar(curDate)
  // 初始化日期
  const calendarObj = infoData.isSolar ? solarDatas : lunarDatas
  const defaultCalendar = [
    calendarObj[0].values[calendarObj[0].defaultIndex],
    calendarObj[1].values[calendarObj[1].defaultIndex],
    calendarObj[2].values[calendarObj[2].defaultIndex],
    calendarObj[3].values[calendarObj[3].defaultIndex],
    calendarObj[4].values[calendarObj[4].defaultIndex],
  ]
  const defaultAddress = [
    { text: AllCitys[0].text },
    { text: AllCitys[0].children[0].text },
    {
      text: AllCitys[0].children[0].children[0].text,
      gisGcj02Lng: AllCitys[0].children[0].children[0].gisGcj02Lng,
    },
  ]
  onConfirmDate(defaultCalendar)
  onConfirmAddress(defaultAddress)
  props.infoData.name = ''
  props.infoData.sex = 1
  props.infoData.isSolar = true
  props.infoData.sunTime = ''
  props.infoData.typeId = ''
}

const showForm = ref(false)
const onShowForm = () => {
  emits('onInitForm', true)
  init()
  showForm.value = true
}
const onBack = () => {
  emits('onInitForm', false)
  showForm.value = false
}

init()

// 监听 Esc：关闭弹框
const handleKeyup = (e) => {
  if (e.keyCode == 27) {
    isShowAddCase.value ? onCloseAddCase() : ''
    isShowPopupBox.value ? onClosePopupBox() : ''
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
.form-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: white;
  .add-item {
    display: flex;
    align-items: center;
    align-self: flex-start;
    margin-top: 10px;
    margin-left: 5px;
    color: #929292;
    font-size: 14px;
    .add-item-icon {
      width: 15px;
      margin-right: 5px;
    }
  }
  .form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: rgba(68, 68, 68, 100);
    font-size: 16px;
    white-space: nowrap;
    .form-row-left,
    .form-row-right {
      display: flex;
      align-items: center;
    }
    .form-row-item {
      padding: 6px 30px;
      white-space: nowrap;
    }
    .form-row-item-box {
      border-radius: 20px;
      box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.07);
    }
    .type-box {
      flex: 1;
      display: flex;
      align-items: center;
      width: 300px;
      .type-item-box {
        overflow-x: auto;
        .type-item {
          display: inline-block;
          margin-left: 8px;
          padding: 6px 20px;
          font-size: 14px;
          border-radius: 20px;
          background-color: rgb(245, 245, 247);
        }
      }
    }
    .save-box {
      margin: 0 10px;
      user-select: none;
    }
    .selectedItem {
      color: white !important;
      border-radius: 20px;
      background-color: $mainColor !important;
    }
  }
  :deep(.el-input__wrapper) {
    box-sizing: border-box;
    height: 41px;
    margin: 10px 0;
    padding: 0;
    font-size: 16px;
    box-shadow: none;
    border-bottom: 1px solid rgba(130, 130, 130, 0.15);
    background-color: rgba(255, 255, 255, 100);
    .el-input__inner {
      height: 100%;
      &::placeholder {
        opacity: 0.35;
        color: rgba(136, 136, 136, 100);
      }
    }
  }
  :deep(.el-switch__label.is-active) {
    color: rgba(68, 68, 68, 100);
    font-size: 14px;
  }
}

.select-btns {
  flex-direction: column;
  height: 100%;
  color: rgba(255, 255, 255, 100);
  font-size: 18px;
  .select-btn {
    width: 248px;
    height: 58px;
    line-height: 58px;
    border-radius: 60px;
  }
  .selectBtn1 {
    margin-bottom: 15px;
    background-color: rgba(178, 149, 93, 100);
  }
  .selectBtn2 {
    background-color: rgba(171, 171, 171, 100);
  }
}

.van-picker {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
:deep(.van-picker__cancel),
:deep(.van-picker__confirm) {
  padding: 5px 10px;
  font-size: 16px !important;
}

:deep(.van-picker__confirm) {
  color: $mainColor;
}
:deep(.van-picker__confirm):hover {
  color: $mainColorSelected;
}
:deep(.van-picker__columns) {
  padding-top: 10px;
}
:deep(.van-picker-column__item--selected) {
  color: $mainColor;
  transform: scale(1.1);
}
</style>
