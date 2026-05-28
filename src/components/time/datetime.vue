<template>
  <div
    v-show="showDatetime"
    class="wzbz_container"
    @click.stop="onClose"
    @wheel.prevent.stop
  >
    <div class="datetime_wrapper" @click.stop="void 0">
      <div class="datetime_header">
        <div class="datetime_header_cancel" @click.stop="onClose">
          <img :src="require('@/assets/images/icon_close.png')" alt="" />
        </div>
        <div class="datetime_header_tabs">
          <div
            class="datetime_header_tab"
            :class="[
              tabIndex === item.id ? 'datetime_header_tab-selected' : '',
            ]"
            v-for="item in tabArr"
            :key="item.id"
            @click.stop="onTab(item.id)"
          >
            {{ item.name }}
          </div>
        </div>
        <div
          v-if="showToday"
          class="datetime_header_today"
          @click.stop="onToday"
        >
          今
        </div>
      </div>
      <div v-if="tabIndex === 0" class="datetime_search">
        <!-- <van-field class="datetime_search_input" :border="false" type="text" v-model="searchVal"
                    placeholder="输入出生年月日时分(格式199303270255)" :clearable="true" />
                <div class="datetime_search_btn" :class="{ 'datetime_search_btn-selected': searchVal.length > 0 }"
                    @click.stop="onSearch">确定</div> -->
        <input
          class="datetime_search_input"
          v-model="searchVal"
          placeholder="输入出生年月日时分(格式199303270255)"
          placeholder-class="input-placeholder"
        />
        <div
          class="datetime_search_btn"
          :class="{ 'datetime_search_btn-selected': searchVal.length > 0 }"
          @click.stop="onSearch"
        >
          确定
        </div>
      </div>
      <div class="datetime_picker">
        <div class="datetime_picker_header">
          <div v-for="item in headerArr" :key="item">
            {{ item }}
          </div>
        </div>
        <div
          class="picker_wrapper"
          :class="{ removeOffSreen: tabIndex !== 0 }"
          @wheel.prevent.stop="onPickerWheel($event, 'timeVal')"
        >
          <van-picker
            :show-toolbar="false"
            default
            ref="timeVal"
            :allow-html="false"
            :columns="solars"
            :item-height="pickerItemHeight"
            visible-item-count="4.5"
            @change="onChangeSolar"
          />
        </div>
        <div
          class="picker_wrapper"
          :class="{ removeOffSreen: tabIndex !== 1 }"
          @wheel.prevent.stop="onPickerWheel($event, 'lunarValue')"
        >
          <van-picker
            :show-toolbar="false"
            default
            ref="lunarValue"
            :allow-html="false"
            :columns="lunars"
            :item-height="pickerItemHeight"
            visible-item-count="4.5"
            @change="onChangeLunar"
          />
        </div>
        <div class="picker_wrapper" :class="{ removeOffSreen: tabIndex !== 2 }">
          <div class="sizhu-box-body">
            <div class="sizhu-body-row">
              <div
                class="sizhu-body-row-item pointer"
                :class="{
                  'sizhu-body-row-item_selected': gzCheckList[index],
                  'sizhu-body-row-item_unknowhour': item.length > 1,
                }"
                v-for="(item, index) in tgList"
                :key="item + index"
                @click="onOpenPopover('tg', index)"
              >
                <span v-if="index != 4">{{ item }}</span>
              </div>
            </div>
            <div class="sizhu-body-row">
              <div
                class="sizhu-body-row-item pointer"
                :class="{
                  'sizhu-body-row-item_selected': gzCheckList[index + 4],
                  'sizhu-body-row-item_unknowhour': item.length > 1,
                }"
                v-for="(item, index) in dzList"
                :key="item + index"
                @click="onOpenPopover('dz', index)"
              >
                <span v-if="index != 4">{{ item }}</span>
              </div>
            </div>
          </div>
          <div class="sizhu-box-footer">
            <div class="sizhu-footer-tip">查找范围：1801-2099年</div>
          </div>
        </div>
      </div>
      <!-- <div class="datetime_confirm" @click.stop="onConfirm">确定</div> -->
      <!-- <img class="datetime_confirm" :src="confirmIcon" @click.stop="onConfirm" /> -->
      <span class="datetime_confirm" @click.stop="onConfirm">确定</span>

      <!-- 四柱弹窗 -->
      <div
        v-show="popoverVisible"
        class="sizhu-popover-wrapper"
        @click.stop="void 0"
      >
        <div v-if="isConfirm" class="sizhu-popover-list columnFlex">
          <div
            class="sizhu-popover-list-item pointer"
            v-for="(item, index) in dateList"
            :key="index"
            @click="onClickDate(item)"
          >
            公历：{{ item }} >
          </div>
        </div>
        <div v-else-if="isTG" class="sizhu-popover-row">
          <div
            class="sizhu-popover-row-item pointer"
            v-for="(item, index) in TianGan"
            :key="item + index"
            @click="onClickTG(item, index)"
          >
            {{ item }}
          </div>
          <div
            v-if="gzIndex == 3"
            class="sizhu-popover-row-item pointer"
            @click="onClickTG('未知', -1)"
          >
            未知
          </div>
          <div
            class="sizhu-popover-row-arrow"
            :class="[`arrow_${gzIndex}`]"
          ></div>
        </div>
        <div v-else class="sizhu-popover-row">
          <div
            class="sizhu-popover-row-item pointer"
            style="width: 16.5%"
            v-for="(item, index) in DiZhis"
            :key="item + index"
            @click="onClickDZ(item)"
          >
            {{ item }}
          </div>
          <div
            v-if="gzIndex == 3"
            class="sizhu-popover-row-item pointer"
            style="width: 16.5%"
            @click="onClickDZ('未知')"
          >
            未知
          </div>
          <div
            class="sizhu-popover-row-arrow"
            :class="[`arrow_${gzIndex}`]"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Notify } from 'vant'
import { TianGan, DiZhi } from '@/utils/static'
import model from '@/components/wz-index/model.js'
import { getSZBZ } from '@/api/bazi.js'
import { getAddZero, daysInFebruary } from '@/utils'
import { solar2Lunar, lunar2Solar } from '@/utils/DateUtils.js'
import WzToast from '@/utils/toast.js'

const tabArr = [
  {
    id: 0,
    name: '公历',
  },
  {
    id: 1,
    name: '农历',
  },
  {
    id: 2,
    name: '四柱',
  },
]
const sizhuHeaderArr = ['年柱', '月柱', '日柱', '时柱']
const unknowhourObj = {
  甲: '甲',
  己: '甲',
  乙: '丙',
  庚: '丙',
  丙: '戊',
  辛: '戊',
  丁: '庚',
  壬: '庚',
  戊: '壬',
  癸: '壬',
}
const minDateArr = [1801, 2, 13],
  maxDateArr = [2099, 12, 31]
const dateTitleArr = ['年', '月', '日', '时', '分']
const solarDaysArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export default {
  props: {
    showDatetime: {
      type: Boolean,
      default: true,
    },
    tabIndex: {
      type: Number,
      default: 0,
    },
    birthday: {
      type: Date,
      default: null,
    },
    unknowhour: {
      type: Number,
      default: 0,
    },
    addressData: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      tabArr,
      searchVal: '',
      pickerItemHeight: 44,
      isXLS: false, // 夏令时开关

      // 公历
      solars: [],
      solarMonths: [],
      solarDays: [],
      hours: [],
      minutes: [],

      // 农历
      lunars: [],
      lunarYears: [],
      lunarMonths: [],
      lunarDays: [],

      // 四柱
      TianGan,
      DiZhi,
      tgList: [],
      dzList: [],
      gzCheckList: new Array(8).fill(false),
      DiZhi_odd: [],
      DiZhi_even: [],
      isTG: true,
      gzIndex: 0,
      popoverVisible: false,
      DiZhis: [],
      isConfirm: false,
      dateList: [],

      solarValues: [],
      lunarValues: [],
      todayData: {},

      confirmIcon: '',
    }
  },
  created() {
    this.confirmIcon = require('@/assets/images/btn_confirm.png')

    this.initLunarDate() // 初始化农历数据
    this.initSolarDate() // 初始化阳历数据
    this.initSizhu() // 初始化四柱数据
    this.handleTodayData()
  },
  mounted() {
    this.togglePageScrollLock(this.showDatetime)
  },
  beforeUnmount() {
    this.togglePageScrollLock(false)
  },
  watch: {
    showDatetime(value) {
      this.togglePageScrollLock(value)
    },
  },
  computed: {
    imgPath() {
      return this.$store.getters.imgPath
    },
    headerArr() {
      return this.tabIndex === 2 ? sizhuHeaderArr : dateTitleArr
    },
    showToday() {
      if (this.tabIndex === 2) return false
      switch (this.tabIndex) {
        case 0:
          if (
            this.solarValues[4] !== this.todayData.minute ||
            this.solarValues[3] !== this.todayData.hour
          )
            return true
          return (
            this.solarValues[2] !== this.todayData.day ||
            this.solarValues[1] !== this.todayData.month ||
            this.solarValues[0] !== this.todayData.year
          )
        case 1:
          if (
            this.lunarValues[4] !== this.todayData.minute ||
            this.lunarValues[3] !== this.todayData.hour
          )
            return true
          return (
            this.lunarValues[2] !== this.todayData.lDay ||
            this.lunarValues[1] !== this.todayData.lMonth ||
            this.lunarValues[0] !== this.todayData.lYear
          )
      }
      return false
    },
  },
  methods: {
    togglePageScrollLock(lock) {
      if (typeof document === 'undefined') return
      document.body.classList.toggle('wzbz-picker-scroll-lock', lock)
    },
    initLunarDate() {
      for (let i = minDateArr[0]; i <= maxDateArr[0]; i++)
        this.lunarYears.push(i)

      const date = this.birthday
      let cy, cm
      cy = date.getFullYear() - minDateArr[0]
      // 当前农月
      const lunarMonths = []
      let curLunarMonth = buildLunarMonthList(this.lunarYears[cy])
      for (let i = 0; i < curLunarMonth.length; i++) {
        if (i == date.getMonth()) {
          cm = i
        }
        lunarMonths.push(curLunarMonth[i]['name'])
      }
      // 阴历日
      const lunarDays = []
      let curMothon = date.getMonth()
      let lunarDayCount = 0
      if (getLunarLeapMonth(model.lunarYears[cy]) == 0) {
        //闰年
        lunarDayCount = getDayCountOfLunarMonth(
          model.lunarYears[cy],
          curMothon + 1,
          false,
        )
      } else {
        if (curMothon == getLunarLeapMonth(model.lunarYears[cy])) {
          lunarDayCount = getDayCountOfLunarMonth(
            model.lunarYears[cy],
            curMothon,
            true,
          )
        } else if (curMothon > getLunarLeapMonth(model.lunarYears[cy])) {
          lunarDayCount = getDayCountOfLunarMonth(
            model.lunarYears[cy],
            curMothon,
            false,
          )
        } else {
          lunarDayCount = getDayCountOfLunarMonth(
            model.lunarYears[cy],
            curMothon + 1,
            false,
          )
        }
      }
      for (let i = 0; i < lunarDayCount; i++) {
        lunarDays.push(model.dayArray[i])
      }
      // 时
      const hours = ['未知']
      for (let i = 0; i <= 23; i++) {
        if (i < 10) hours.push('0' + i)
        else hours.push(i)
      }
      this.hours = hours
      // 分
      const minutes = ['未知']
      for (let i = 0; i <= 59; i++) {
        if (i < 10) minutes.push('0' + i)
        else minutes.push(i)
      }
      this.minutes = minutes

      let lunarYIndex = 0,
        lunarMIndex = 0,
        lunarDIndex = 0,
        hourIndex = this.unknowhour ? 0 : date.getHours() + 1,
        minuteIndex = this.unknowhour ? 0 : date.getMinutes() + 1

      const lunarArr = solar2Lunar(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
      )
      lunarYIndex = lunarArr[0] - minDateArr[0]
      lunarMIndex = lunarArr[1] - 1
      lunarDIndex = lunarArr[2] - 1
      this.lunars.push(
        { values: this.lunarYears, defaultIndex: lunarYIndex },
        { values: lunarMonths, defaultIndex: lunarMIndex },
        { values: lunarDays, defaultIndex: lunarDIndex },
        { values: hours, defaultIndex: hourIndex },
        { values: minutes, defaultIndex: minuteIndex },
      )

      if (this.tabIndex === 1) {
        const _lunarArr = [
          lunarArr[0],
          lunarMonths[lunarArr[1] - 1],
          lunarDays[lunarArr[2] - 1],
          hourIndex - 1,
          minuteIndex - 1,
        ]
        this.$emit('confirm', this.tabIndex, _lunarArr)
      }
      this.lunarValues = [
        lunarArr[0],
        lunarArr[4].cnm,
        lunarArr[4].cnd,
        hourIndex - 1,
        minuteIndex - 1,
      ]
    },
    initSolarDate() {
      const date = this.birthday
      for (let i = 1; i <= 12; i++) {
        this.solarMonths.push(getAddZero(i))
      }

      const curY = date.getFullYear(),
        curM = date.getMonth() + 1,
        curD = date.getDate(),
        hourIndex = this.unknowhour ? 0 : date.getHours() + 1,
        minuteIndex = this.unknowhour ? 0 : date.getMinutes() + 1
      let maxD = solarDaysArr[curM - 1]
      if (curM === 2) {
        maxD = daysInFebruary(curY)
      }
      for (let i = 1; i <= maxD; i++) {
        this.solarDays.push(getAddZero(i))
      }

      this.solars.push(
        { values: this.lunarYears, defaultIndex: curY - minDateArr[0] },
        { values: this.solarMonths, defaultIndex: curM - 1 },
        { values: this.solarDays, defaultIndex: curD - 1 },
        { values: this.hours, defaultIndex: hourIndex },
        { values: this.minutes, defaultIndex: minuteIndex },
      )
      this.solarValues = [curY, curM, curD, hourIndex - 1, minuteIndex - 1]
    },
    initSizhu() {
      this.tgList = [...this.TianGan.slice(0, 4)]
      this.dzList = [...this.DiZhi.slice(0, 4)]
      this.DiZhi_odd = this.DiZhi.filter((_, index) => index % 2 == 0)
      this.DiZhi_even = this.DiZhi.filter((_, index) => index % 2 == 1)
      this.DiZhis = [...this.DiZhi_odd]
    },
    onClose() {
      this.isXLS = this.$store.getters.isXLS
      this.popoverVisible = false
      this.$emit('close')
    },
    onTab(id) {
      if (this.tabIndex === 0 && id === 1) {
        // 公历切农历
        const dateArr = this.$refs.timeVal.getValues()
        const lunarArr = solar2Lunar(dateArr[0], +dateArr[1], +dateArr[2])
        this.onChangeLunar(
          [
            lunarArr[0],
            (lunarArr[3] ? '闰' : '') + lunarArr[4].cnm,
            lunarArr[4].cnd,
            dateArr[3],
            dateArr[4],
          ],
          0,
        )
        this.$nextTick(() => {
          const leapMonth = getLunarLeapMonth(lunarArr[0])
          this.$refs.lunarValue.setIndexes([
            lunarArr[0] - minDateArr[0],
            lunarArr[1] +
              (leapMonth == 0 ||
              lunarArr[1] < leapMonth ||
              (leapMonth == +lunarArr[1] && !lunarArr[3])
                ? -1
                : 0),
            lunarArr[2] - 1,
            dateArr[3] + 1,
            dateArr[4] + 1,
          ])
        })
      } else if (this.tabIndex === 1 && id === 0) {
        // 农历切公历
        const dateArr = this.$refs.lunarValue.getValues()
        let leepflag = dateArr[1].indexOf('闰') > -1
        const lunarM =
            model.monthArray.findIndex(
              (item) => item === dateArr[1].slice(leepflag ? 1 : 0),
            ) + 1,
          lunarD = model.dayArray.findIndex((item) => item === dateArr[2]) + 1
        let solarArr = lunar2Solar(dateArr[0], lunarM, lunarD, leepflag)
        this.onChangeSolar(
          [solarArr[0], solarArr[1], solarArr[2], dateArr[3], dateArr[4]],
          0,
        )
        this.$nextTick(() => {
          this.$refs.timeVal.setIndexes([
            solarArr[0] - minDateArr[0],
            solarArr[1] - 1,
            solarArr[2] - 1,
            dateArr[3] + 1,
            dateArr[4] + 1,
          ])
        })
      }
      this.popoverVisible = false
      this.$emit('tab', id)
    },
    onToday() {
      const curDate = new Date()
      if (this.tabIndex === 0) {
        let y = curDate.getFullYear()
        let m = curDate.getMonth()
        let d = curDate.getDate()
        let h = curDate.getHours()
        let min = curDate.getMinutes()
        this.onChangeSolar([y, m + 1, d, h, min], 0)
        this.$nextTick(() => {
          this.$refs.timeVal.setIndexes([
            y - minDateArr[0],
            m,
            d - 1,
            h + 1,
            min + 1,
          ])
        })
      } else {
        const lunarArr = solar2Lunar(
          curDate.getFullYear(),
          curDate.getMonth() + 1,
          curDate.getDate(),
        )
        this.onChangeLunar(
          [
            lunarArr[0],
            (lunarArr[3] ? '闰' : '') + lunarArr[4].cnm,
            lunarArr[4].cnd,
            curDate.getHours(),
            curDate.getMinutes(),
          ],
          0,
        )
        this.$nextTick(() => {
          this.$refs.lunarValue.setIndexes([
            lunarArr[0] - minDateArr[0],
            lunarArr[1] - 1,
            lunarArr[2] - 1,
            curDate.getHours() + 1,
            curDate.getMinutes() + 1,
          ])
        })
      }
    },
    onSearch() {
      if (this.searchVal.length !== 12 || !/^\d{12}$/.test(this.searchVal)) {
        // WzToast({
        //     message: '请输入正确的日期时间格式',
        //     type: 'info'
        // })
        this.$message.warning('请输入正确的日期时间格式')
        return
      }
      const year = +this.searchVal.slice(0, 4),
        month = +this.searchVal.slice(4, 6),
        day = +this.searchVal.slice(6, 8),
        hour = +this.searchVal.slice(8, 10),
        min = +this.searchVal.slice(10, 12)
      if (
        year < minDateArr[0] ||
        (year === minDateArr[0] && month < minDateArr[1]) ||
        (year === minDateArr[0] &&
          month === minDateArr[1] &&
          day < minDateArr[2])
      ) {
        WzToast({
          message: '日期时间不能小于1801年2月13日',
          type: 'info',
        })
        return
      } else if (year > maxDateArr[0]) {
        WzToast({
          message: '日期时间不能大于2099年12月31日',
          type: 'info',
        })
        return
      }
      this.onChangeSolar([year, month, day, hour, min], 0)
      this.$nextTick(() => {
        this.$refs.timeVal.setIndexes([
          year - minDateArr[0],
          month - 1,
          day - 1,
          hour + 1,
          min + 1,
        ])
      })
    },
    onOpenTip() {
      // const url = 'https://www.iwzbz.com/artical/h5book/v5/3_1_100_2_3.html'
      // handleIOSAppJump({
      //     router: this.$router,
      //     title: '夏令时',
      //     link: url,
      //     isHeader: false
      // })
      // this.$router.push({
      //     path: '/main/wzXialingshi'
      // })
    },
    // 切换夏令时开关
    onChangeXLS() {
      this.isXLS = !this.isXLS
    },
    async onConfirm() {
      if (this.tabIndex !== 2) {
        //this.$store.commit('setting/setIsXLS', this.isXLS)
      }
      switch (this.tabIndex) {
        case 0:
          this.handleConfirmSolar()
          break
        case 1:
          this.handleConfirmLunar()
          break
        case 2:
          await this.handleConfirmSizhu()
          break
      }
    },
    handleConfirmSolar() {
      const dateArr = this.$refs.timeVal.getValues()
      const year = +dateArr[0],
        month = +dateArr[1],
        day = +dateArr[2]
      if (
        (year === minDateArr[0] && month < minDateArr[1]) ||
        (year === minDateArr[0] &&
          month === minDateArr[1] &&
          day < minDateArr[2])
      ) {
        WzToast({
          message: '日期时间不能小于1801年2月13日',
          type: 'info',
        })
        return
      }
      this.$emit('confirm', this.tabIndex, dateArr)
    },
    handleConfirmLunar() {
      const dateArr = this.$refs.lunarValue.getValues()
      let leepflag = dateArr[1].indexOf('闰') > -1
      const lunarM =
          model.monthArray.findIndex(
            (item) => item === dateArr[1].slice(leepflag ? 1 : 0),
          ) + 1,
        lunarD = model.dayArray.findIndex((item) => item === dateArr[2]) + 1
      let solarArr = lunar2Solar(dateArr[0], lunarM, lunarD, leepflag)
      if (solarArr[0] > maxDateArr[0]) {
        WzToast({
          message: '日期时间不能大于2099年12月31日',
          type: 'info',
        })
        return
      }
      this.$emit('confirm', this.tabIndex, dateArr)
    },
    async handleConfirmSizhu() {
      if (this.isConfirm) {
        if (this.popoverVisible) {
          Notify({ type: 'danger', message: '请选择一组日期' })
        } else {
          this.popoverVisible = true
        }
        return
      }
      // 请求
      let bzstr = ''
      for (let i = 0; i < 4; i++) {
        let tg = this.tgList[i],
          dz = this.dzList[i]
        if (i === 3 && tg === '未知' && dz === '未知') {
          tg = unknowhourObj[this.tgList[2]]
          dz = '子'
        }
        bzstr += tg + dz
      }
      await getSZBZ(bzstr)
        .then((res) => {
          if (!res || res.length == 0) {
            Notify({ type: 'warning', message: '在查找范围内无该八字数据' })
          } else {
            this.dateList.length = 0
            this.dateList.push(
              ...res.map((item) => {
                if (this.unknowhour) {
                  return item.split(' ')[0] + ' 时辰未知'
                }
                return item
              }),
            )
            this.isConfirm = true
            this.popoverVisible = true
          }
        })
        .catch((err) => {
          Notify({ type: 'danger', message: '获取四柱数据失败！' })
          return
        })
    },
    onChangeSolar(value, index) {
      console.log('没有呀', value)

      this.solarValues = value.map((i) => +i)
      this.handleTodayData()

      const _picker = this.$refs.timeVal
      if (!_picker) return
      const arr = _picker.getIndexes().slice()
      if (index === 3 || index === 4) {
        if (value[index] === '未知') {
          arr[3] = 0
          arr[4] = 0
        } else if (value[3] === '未知') {
          arr[3] = 1
        } else if (value[4] === '未知') {
          arr[4] = 1
        }
        _picker.setIndexes(arr)
      } else if (index === 0 || index === 1) {
        let maxD = solarDaysArr[+value[1] - 1]
        if (+value[1] === 2) {
          maxD = daysInFebruary(+value[0])
        }
        if (maxD !== this.solarDays.length) {
          if (maxD < this.solarDays.length) {
            this.solarDays.length = maxD
            arr[2] = maxD < +value[2] ? maxD - 1 : value[2] - 1
          } else {
            for (let i = this.solarDays.length + 1; i <= maxD; i++) {
              this.solarDays.push(getAddZero(i))
            }
            arr[2] = +value[2] - 1
          }
          this.solars[2].values = this.solarDays.slice()
          this.$nextTick(() => {
            _picker.setIndexes(arr)
          })
        }
      }
    },
    onChangeLunar(value, index) {
      console.log('没有呀', value)
      this.lunarValues = value.map((i, i2) => {
        if (i2 === 1 || i2 === 2) return i
        return +i
      })
      this.handleTodayData()

      const _picker = this.$refs.lunarValue
      if (!_picker) return
      if (index === 3 || index === 4) {
        const arr = _picker.getIndexes().slice()
        if (value[index] === '未知') {
          arr[3] = 0
          arr[4] = 0
        } else if (value[3] === '未知') {
          arr[3] = 1
        } else if (value[4] === '未知') {
          arr[4] = 1
        }
        _picker.setIndexes(arr)
        return
      }
      // 农历选择器更改
      let selectedLunarYear = value[0]
      let selectedLunarMonthItem = model.monthArray.indexOf(value[1])
      let selectedLunarMOnthList = buildLunarMonthList(selectedLunarYear)
      // 更新月份列表
      const lunarMonths = []
      this.lunarMonths.length = 0
      for (let i = 0; i < selectedLunarMOnthList.length; i++) {
        lunarMonths.push(selectedLunarMOnthList[i]['name'])
        if (selectedLunarMOnthList[i]['name'] == value[1]) {
          selectedLunarMonthItem = i
        }
      }
      let lunarDayCount = 0
      if (getLunarLeapMonth(selectedLunarYear) == 0) {
        //不是闰年
        lunarDayCount = getDayCountOfLunarMonth(
          selectedLunarYear,
          selectedLunarMonthItem + 1,
          false,
        )
      } else {
        if (selectedLunarMonthItem == getLunarLeapMonth(selectedLunarYear)) {
          if (selectedLunarMonthItem == 0) {
            lunarDayCount = getDayCountOfLunarMonth(
              selectedLunarYear,
              selectedLunarMonthItem + 1,
              false,
            )
          } else {
            lunarDayCount = getDayCountOfLunarMonth(
              selectedLunarYear,
              selectedLunarMonthItem,
              true,
            )
          }
        } else if (
          selectedLunarMonthItem > getLunarLeapMonth(selectedLunarYear)
        ) {
          lunarDayCount = getDayCountOfLunarMonth(
            selectedLunarYear,
            selectedLunarMonthItem,
            false,
          )
        } else {
          lunarDayCount = getDayCountOfLunarMonth(
            selectedLunarYear,
            selectedLunarMonthItem + 1,
            false,
          )
        }
      }
      // 清空之前的天数
      const lunarDays = []
      this.lunarDays.length = 0
      for (let i = 0; i < lunarDayCount; i++) {
        lunarDays.push(model.dayArray[i])
      }
      switch (index) {
        case 0:
          //年份改变，月份，日期都会发生改变
          this.lunars[1].values = lunarMonths
          this.lunars[2].values = lunarDays
          break
        case 1:
          //月份改变，日期会发生改变
          this.lunars[2].values = lunarDays
          break
      }
    },
    // 打开弹出框
    onOpenPopover(str, index) {
      if (this.popoverVisible) {
        if (this.isConfirm) {
          this.isConfirm = false
          return
        } else if (
          this.gzIndex == index &&
          ((str == 'tg' && this.isTG) || (str != 'tg' && !this.isTG))
        ) {
          // 重复点击隐藏弹出框
          this.popoverVisible = false
          return
        }
      }
      if (str == 'tg') {
        this.isTG = true
      } else {
        this.isTG = false
        this.DiZhis.length = 0
        if (index == 3 && this.tgList[3] == '未知') {
          this.DiZhis.push(...this.DiZhi_odd, ...this.DiZhi_even)
        } else {
          const i = this.TianGan.findIndex((item) => this.tgList[index] == item)
          if (i % 2 == 0) {
            this.DiZhis.push(...this.DiZhi_odd)
          } else {
            this.DiZhis.push(...this.DiZhi_even)
          }
        }
      }
      this.gzIndex = index
      this.popoverVisible = true
    },
    // 选中天干
    onClickTG(item, index) {
      const unknowhour = item === '未知' || this.dzList[3] === '未知' ? 1 : 0
      this.$emit('setUnknowhour', unknowhour)
      this.DiZhis.length = 0
      if (index == -1) {
        this.DiZhis.push(...this.DiZhi_odd, ...this.DiZhi_even)
      } else {
        if (index % 2 == 0) {
          this.DiZhis.push(...this.DiZhi_odd)
        } else {
          this.DiZhis.push(...this.DiZhi_even)
        }
        if (
          this.DiZhis.findIndex((item) => this.dzList[this.gzIndex] == item) ==
          -1
        ) {
          this.dzList[this.gzIndex] = this.DiZhis[0]
        }
      }
      this.tgList[this.gzIndex] = item
      this.gzCheckList[this.gzIndex] = true
      this.gzCheckList[this.gzIndex + 4] = false
      this.popoverVisible = false
      this.onOpenPopover('dz', this.gzIndex)
    },
    // 选中地支
    onClickDZ(item) {
      const unknowhour = item === '未知' || this.tgList[3] === '未知' ? 1 : 0
      this.$emit('setUnknowhour', unknowhour)
      this.dzList[this.gzIndex] = item
      this.gzCheckList[this.gzIndex + 4] = true
      this.popoverVisible = false
      if (this.gzIndex != 3) {
        this.onOpenPopover('tg', this.gzIndex + 1)
      }
    },
    // 选中日期
    onClickDate(item) {
      this.popoverVisible = false
      //this.$store.commit('setting/setIsXLS', this.isXLS)
      this.$emit('confirm', this.tabIndex, item)
    },
    handleTodayData() {
      const now = new Date()
      const year = now.getFullYear(),
        month = now.getMonth() + 1,
        day = now.getDate(),
        hour = now.getHours(),
        minute = now.getMinutes()
      if (
        this.todayData.minute === minute &&
        this.todayData.hour === hour &&
        this.todayData.day === day &&
        this.todayData.month === month &&
        this.todayData.year === year
      )
        return
      const lunarArr = solar2Lunar(year, month, day)
      const todayData = {
        year,
        month,
        day,
        hour,
        minute,
        lYear: lunarArr[0],
        lMonth: lunarArr[4].cnm,
        lDay: lunarArr[4].cnd,
      }
      this.todayData = todayData
    },
    handleBookSave(bz) {
      this.tgList = [bz[0], bz[2], bz[4], bz[6]]
      this.dzList = [bz[1], bz[3], bz[5], bz[7]]
      this.gzCheckList = new Array(8).fill(true)
    },
    onPickerWheel(event, pickerRef) {
      event.preventDefault()
      event.stopPropagation()

      const picker = this.$refs[pickerRef]
      if (!picker || !event.deltaY) return

      const target = event.target && event.target.closest ? event.target : null
      const columnEl = target ? target.closest('.van-picker-column') : null
      const pickerEl = picker.$el || event.currentTarget
      const columns = Array.from(
        pickerEl.querySelectorAll('.van-picker-column'),
      )
      const columnIndex = columns.indexOf(columnEl)
      if (columnIndex < 0) return

      const values = picker.getColumnValues(columnIndex) || []
      if (!values.length) return

      const curIndex = picker.getColumnIndex(columnIndex) || 0
      const nextIndex = Math.min(
        Math.max(curIndex + (event.deltaY > 0 ? 1 : -1), 0),
        values.length - 1,
      )
      if (nextIndex === curIndex) return

      picker.setColumnIndex(columnIndex, nextIndex)

      this.$nextTick(() => {
        const values = picker.getValues()
        if (pickerRef === 'timeVal') {
          this.onChangeSolar(values, columnIndex)
        } else {
          this.onChangeLunar(values, columnIndex)
        }
      })
    },
  },
}

/**
 * 根据年生成月列表
 */
function buildLunarMonthList(y) {
  let list = []
  for (let i = 1; i <= 12; i++) {
    list.push({
      id: i,
      name: model.monthArray[i - 1],
    })
  }
  let leapMonth = getLunarLeapMonth(y)
  if (leapMonth != 0) {
    list.splice(leapMonth, 0, {
      id: leapMonth,
      name: '闰' + model.monthArray[leapMonth - 1],
    })
  }
  return list
}

/**
 * 获取闰月
 * @param {年} curYear
 */
function getLunarLeapMonth(curYear) {
  let ydata = model.lunarInfo[curYear - 1801]
  let lm = ydata & 0xf
  let leapMonth = lm == 0xf ? 0 : lm
  return leapMonth
}

/**
 * 计算指定农历年，月的天数
 */
function getDayCountOfLunarMonth(y, m, isLeap) {
  if (isLeap) {
    let leapMonth = getLunarLeapMonth(y)
    if (leapMonth != 0 && leapMonth == m) {
      return (model.lunarInfo[y - 1801 + 1] & 0xf) == 0xf ? 30 : 29
    }
  } else {
    return (model.lunarInfo[y - 1801] & (0x10000 >> m)) > 0 ? 30 : 29
  }
}
</script>

<style lang="scss" scoped>
$mainColor: #b2955d;
$textColor: #f7d3a1;

.wzbz_container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  overflow: hidden;
  overscroll-behavior: contain;
}

.datetime_wrapper {
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 390px;
  padding: 17px;
  color: #101010;
  border-radius: 20px;
  background-color: white;

  .datetime_header {
    box-sizing: border-box;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    // height: 60px;
    margin-bottom: 15px;

    .datetime_header_cancel {
      position: absolute;
      right: 0;
      padding: 6px;
      & > img {
        width: 14px;
      }
    }

    .datetime_header_tabs {
      box-sizing: border-box;
      display: flex;
      color: #444;
      font-size: 15px;
      border-radius: 25px;
      border: 1px solid rgba(187, 187, 187, 0.5);
      overflow: hidden;
    }

    .datetime_header_tab {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 75px;
      padding: 8px 0;
    }

    .datetime_header_tab-selected {
      position: relative;
      color: white;
      border-radius: 25px;
      background-color: #b2955d;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px;
        height: 22px;
        margin: auto;
        background-color: rgba(187, 187, 187, 0.5);
      }

      &::before {
        left: -76px;
      }

      &::after {
        right: -76px;
      }
    }

    .datetime_header_today {
      position: absolute;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      color: white;
      font-size: 15px;
      border-radius: 16px;
      line-height: 16px;
      background-color: #b3b3b3;
    }
  }

  .datetime_search {
    display: flex;
    align-items: center;
    margin-bottom: 13px;
    width: 100%;
    .datetime_search_input {
      box-sizing: border-box;
      height: 36px;
      padding: 5px 20% 5px 10px;
      font-size: 13px;
      border-radius: 50px;
      width: 100%;
      border: 1px solid rgba(187, 187, 187, 0.5);

      :deep(.van-field__control::-webkit-input-placeholder) {
        color: #9e9e9e;
        font-size: 13px;
      }

      :deep(.van-field__clear) {
        margin-right: 55px;
      }
    }

    .datetime_search_btn {
      position: absolute;
      right: 19px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 62px;
      height: 32px;
      color: white;
      border-radius: 25px;
      background-color: rgba(180, 180, 180, 1);
      font-size: 15px;
    }

    .datetime_search_btn-selected {
      background-color: $mainColor;
    }
  }

  .datetime_picker {
    display: flex;
    flex-direction: column;
    // width: 339px;

    .picker_wrapper {
      //height: 210px;
      overscroll-behavior: contain;
    }

    .datetime_picker_header {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 40px;
      font-size: 15px;
      //font-weight: bold;
      border-top: 1px solid rgba(233, 233, 233, 0.5);
    }

    .sizhu-box-body {
      padding-top: 10px;

      .sizhu-body-row {
        display: flex;
        justify-content: space-around;

        .sizhu-body-row-item {
          width: 57px;
          height: 57px;
          margin-bottom: 20px;
          line-height: 57px;
          color: white;
          font-size: 24px;
          border-radius: 50%;
          background-color: #b8b8b8;
        }

        .sizhu-body-row-item_selected {
          background-color: $mainColor;
        }

        .sizhu-body-row-item_unknowhour {
          font-size: 20px;
        }
      }
    }

    .sizhu-box-footer {
      .sizhu-footer-tip {
        font-size: 14px;
        margin-bottom: 20px;
        //font-weight: bold;
      }
    }
  }

  .datetime_option {
    box-sizing: border-box;
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 20px;
    margin-bottom: 12px;
    padding-top: 5px;
    color: #999999;
    font-size: 15px;
    background: linear-gradient(
      to top,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0.7)
    );
    z-index: 1;

    .datetime_option_icon {
      width: 18px;
      height: 18px;
      margin-right: 6px;
    }

    .datetime_option_switch {
      width: 34px;
      height: 20px;
      margin-left: 6px;
    }
  }

  .datetime_confirm {
    position: relative;
    width: 340px;
    height: 54px;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #101010;
    color: #f7d3a1;
    font-size: 18px;
    font-weight: bold;
    margin: 0 auto;
    text-align: center;
    border-radius: 30px;
    font-family: 宋体;
  }
}

.sizhu-popover-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  margin: 0 auto;
  transform: translateY(-100%);

  .sizhu-popover-list,
  .sizhu-popover-row,
  .sizhu-box {
    width: 390px;
    margin: 0 auto 20px;
    padding: 20px;
    border-radius: 20px;
    background-color: white;
    overflow: hidden;
  }

  .sizhu-popover-list {
    align-items: center;

    .sizhu-popover-list-item {
      margin-bottom: 2px;
      color: $mainColor;
      font-size: 18px;
    }
  }

  .sizhu-popover-row {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    color: #a3a3a3;
    font-size: 24px;
    //font-weight: bold;
    overflow: visible;

    .sizhu-popover-row-item {
      width: 20%;
      padding: 10px 0;
      text-align: center;
    }

    .sizhu-popover-row-arrow {
      position: absolute;
      bottom: -20px;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-top: 15px solid white;
    }

    .arrow_0 {
      left: 50px;
    }

    .arrow_1 {
      left: 145px;
    }

    .arrow_2 {
      left: 230px;
    }

    .arrow_3 {
      left: 320px;
    }
  }
}

.removeOffSreen {
  position: fixed;
  left: 300vw;
  top: 300vh;
  transform: translateX(300vw) translateY(300vh);
}

.input-placeholder {
  color: red;
  font-size: 13px;
}

input::-webkit-input-placeholder {
  color: #A9ABB3; /* 更改placeholder的颜色 */
  font-size: 13px; /* 更改placeholder的字体大小 */
}

:deep(.van-picker-column__item) {
  font-size: 14px !important;
}

:deep(.van-picker-column__item--selected) {
  font-size: 20px !important;
  font-weight: bold;
}

:deep(.van-picker__mask) {
  background-image: linear-gradient(
      180deg,
      hsla(0, 0%, 100%, 1),
      hsla(0, 0%, 100%, 0.7)
    ),
    linear-gradient(0deg, hsla(0, 0%, 100%, 1), hsla(0, 0%, 100%, 0.7)) !important;
}

:deep(.van-picker__frame) {
  left: 0 !important;
  right: 0 !important;
}

:deep(.van-hairline-unset--top-bottom::after) {
  border-width: 0 !important;
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
    height: calc(100% / 4.5);
    border-radius: 5px;
    background-color: rgba(245, 245, 245, 1);
  }
}
</style>
