<template>
  <div class="form_wrapper" v-if="infoData">
    <div class="input-box">
      <span>命主姓名</span>
      <el-input
        v-model="infoData.username"
        placeholder="请输入姓名"
        :maxlength="30"
      />
    </div>
    <div class="form-row">
      <div class="form-row-left">
        <div
          class="form-row-item-sex pointer"
          v-for="(item, index) in ['男', '女']"
          :key="index"
          @click="onChangeSex(index ^ 1)"
        >
          <img
            :src="
              require('@/assets/images/icon_' +
                ((infoData.sex == index) ^ 1 ? '' : 'un') +
                'sel2.png')
            "
          />
          <span>{{ item }}</span>
        </div>
      </div>
      <div class="form-row-right form-row-item-box">
        <div
          v-for="(item, index) in ['公历', '农历', '四柱']"
          :key="index"
          class="form-row-item pointer"
          :style="
            index == datetimeIndex ? 'background-color:#b2955d;color:white' : ''
          "
          @click="onShowDatetime(index)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="input-box" @click="onShowDatetime(datetimeIndex_real)">
      <span>出生时间</span>
      <span class="bogus-input" v-if="infoData.birthday">{{ padTimeString(birthDate) }}</span>
      <span v-else class="bogus-inpu form_light_color">请输入出生时间</span>
    </div>
    <div class="input-box" @click="onShowAddress">
      <span>出生地址</span>
      <span v-if="infoData.address" class="bogus-input">
        {{
          addressData &&
          addressData.length === 2 &&
          addressData[0] === addressData[1]
            ? addressData[0]
            : infoData.address
        }}
      </span>
      <span v-else class="form_light_color bogus-input">请输入出生地址</span>
    </div>
    <div class="form-row-settime-box">
      <div
        class="form-row-settime-box-item pointer"
        v-for="(item, index) in setTimeInfo"
        :key="index"
        @click="onSetTimeInfo(index)"
      >
        <img
          :src="
            require('@/assets/images/icon_' +
              (item.value == 1 ? '' : 'un') +
              'sel.png')
          "
        />
        <span>{{ item.name }}</span>
      </div>
      <el-switch
        class="save-box"
        v-model="infoData.isSave"
        active-color="#bb9c5c"
        width="46px"
        size="large"
        @change="onChangeSave"
        active-text="保存"
      />
    </div>

    <div class="suntime-info-box">
      <span>
        真太阳时：{{
          infoData.unknowhour == 1 ? '未知（需选时辰）' : padTimeString(infoData.sunTime)
        }}
      </span>
      <span>
        地址经纬： {{ selectedLat?`北纬${selectedLat}`:'' }} {{ ` 东经${selectedLng}` }}
      </span>
    </div>
    <div class="type-box">
      <span>案例分类</span>
      <div class="type-item-box">
        <div
          class="type-item pointer"
          v-for="item in typeList"
          :key="item.id"
          @click="onTypeClick(item.id)"
        >
          <img
            :src="
              require('@/assets/images/icon_' +
                (infoData.typeId == item.id ? '' : 'un') +
                'sel2.png')
            "
          />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <!-- <div class="form_row3">
      <div class="form_realsolartime">
        <label class="form_realsolartime_text1">
          真太阳时：{{
            infoData.unknowhour == 1 ? '未知（需选时辰）' : infoData.sunTime
          }}
        </label>
        <label>
          地址经纬：
          <span v-if="selectedLat !== undefined">
            {{ `北纬${selectedLat}` }}
          </span>
          <span v-if="selectedLng !== undefined">
            {{ ` 东经${selectedLng}` }}
          </span>
        </label>
      </div>
      <div class="form_save" @click.stop="onChangeSave">
        <label style="margin-right: 8px">保存</label>
        <img
          class="form_save_icon"
          :src="switchSave ? switchImg_open : switchImg_close"
        />
      </div>
    </div> -->

    <div class="form_paipan siyuanfont pointer" @click="toPaiPan">
      {{ startBtnText }}
    </div>

    <DateTime
      v-if="birthdayDate"
      ref="formDatetime"
      :showDatetime="showDatetime"
      :tabIndex="datetimeIndex"
      :birthday="birthdayDate"
      :unknowhour="infoData.unknowhour"
      :addressData="addressData"
      @tab="onChangeDatetimeTab"
      @close="onCloseDatetime"
      @confirm="onConfirmDatetime"
      @setUnknowhour="setUnknowhour"
    />
    <Address
      v-if="addressData"
      :showAddress="showAddress"
      :tabIndex="addressIndex"
      :addressData="addressData"
      @tab="onChangeAddressTab"
      @close="onCloseAddress"
      @confirm="onConfirmAddress"
    />
  </div>
</template>

<script>
import DateTime from './datetime.vue'
import Address from './address.vue'
import { packageParams } from '@/utils'

// import FormAddress from '@/components/components/form-com/address.vue'
import WzToast from '@/utils/toast.js'
import model from '../wz-index/model'
import { addBZ } from '@/api/bazi2.js'
import { getBaseBZ } from '@/api/bazi.js'
import {
  getDateTimeStr,
  getSunTime,
  getAddZero,
  getBlackLebelOfName,
  daysInFebruary,
} from '@/utils'
import { lunar2Solar } from '@/utils/DateUtils.js'
import { xlsData } from './static.js'
import * as homeApi from '@/api/home-api'

const solarDaysArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const setTimeInfo = [
  {
    name: '夏令时',
    value: 0,
  },
  {
    name: '真太阳时',
    value: 1,
  },
  {
    name: '早晚子时',
    value: 0,
  },
]
export default {
  components: {
    DateTime,
    Address,
  },
  props: {
    // type username sex birthday lunarArr sunTime address groupId unknowhour xls bjtime hw
    startBtnText: {
      type: String,
      default: '开始排盘',
    },
    showQiYun: {
      type: Boolean,
      default: true,
    },
    info: {
      type: Object,
      default: null,
    },
    from: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      infoData: {
        guid: '',
        type: 0,
        username: '1111',
        sex: 1,
        birthday: '1990-01-01 00:00',
        lunarArr: [2024, 11, 7, false, { cnm: '冬月', cnd: '初七' }],
        sunTime: '1990-01-01 00:00',
        address: '未知地 北京时间 --',
        // groupId: '',
        unknowhour: 0, // 是否为未知时间 0:否 1:是
        // type: 'hepan', // hepan 从合盘页过来  luncai 从论财页过来
        typeId: '00000000-0000-0000-0000-000000000000',
      },
      setTimeInfo,
      clockImg1: '',
      clockImg2: '',
      clockImg3: '',
      clockImg4: '',
      switchImg_open: '',
      switchImg_close: '',

      switchSave: false, // 是否保存
      clockData: {
        // 即时起局数据
        nowDate: [1999, 3, 14, 0, 0, 0],
        bz: ['.', '.', '.', '.', '.', '.', '.', '.'],
        solarDateStr: '1999年03月14日 00:00',
        lunarDateStr: '1999年正月廿七 子时',
        hDeg: 0,
        mDeg: 0,
      },

      // 时间选择器
      birthdayDate: null,
      showDatetime: false,
      datetimeIndex_real: 0, // 确定选中的时间类型
      datetimeIndex: 0, // 选中的时间类型 0:阳历 1:阴历 2:四柱

      // 地区选择器
      addressData: null,
      showAddress: false,
      addressIndex: 0, // 选中的地址类型 0:国内 1:海外
      selectedLng: '120.00',
      selectedLat: '39.00',
      zone: 8,
    }
  },
  computed: {
    typeList() {
      return this.$store.getters.typeList
    },
    imgPath() {
      return this.$store.getters.imgPath
    },
    guid() {
      this.infoData.isSave = !!this.$store.getters.userguid
      console.log('this.$store.getters.userguid', this.$store.getters.userguid);
      return this.$store.getters.userguid
    },
    viplevel() {
      return this.$store.getters.viplevel
    },
    groupArr() {
      return this.$store.getters.groupArr
    },
    solarArr() {
      return this.infoData.birthday.split(' ').reduce((acc, cur, index) => {
        acc.push(...cur.split(index === 0 ? '-' : ':'))
        return acc
      }, [])
    },
    birthDate() {
      const birthDate =
        this.datetimeIndex_real == 0 || this.datetimeIndex_real === 2
          ? `${this.solarArr[0]}年${this.solarArr[1]}月${this.solarArr[2]}日 ${
              this.infoData.unknowhour
                ? '未知时辰'
                : this.solarArr[3] + ':' + this.solarArr[4]
            }`
          : this.infoData.lunarArr.length === 0
          ? this.infoData.birthday
          : `${this.infoData.lunarArr[0]}年${this.infoData.lunarArr[4].cnm}${
              this.infoData.lunarArr[4].cnd
            } ${
              this.infoData.unknowhour
                ? '未知时辰'
                : this.solarArr[3] + ':' + this.solarArr[4]
            }`
      return birthDate
    },
    isXLS() {
      return this.$store.getters.isXLS
    },
    isBJTime() {
      return this.$store.getters.isBJTime
    },
    allDialog() {
      const { showAddress, showDatetime } = this
      return {
        showAddress,
        showDatetime,
      }
    },
  },
  created() {
    if(!this.info){
      //使用当下默认值进行作为排盘默认值
      // let nowDate = new Date()
      // const nowDateArr = [
      //   nowDate.getFullYear(),
      //   nowDate.getMonth() + 1,
      //   nowDate.getDate(),
      //   nowDate.getHours(),
      //   nowDate.getMinutes(),
      // ]
      // let nowDateStr = getDateTimeStr(nowDateArr)
      let nowDateStr = '1990-01-01 00:00'
      console.log('nowDateStr', nowDateStr)
      this.infoData = {
        guid: '',
        type: 0,
        username: '',
        sex: 1,
        birthday: nowDateStr,
        lunarArr: [2024, 11, 7, false, { cnm: '冬月', cnd: '初七' }],
        sunTime: nowDateStr,
        address: '未知地 北京时间 --',
        unknowhour: 0, // 是否为未知时间 0:否 1:是
        typeId: '00000000-0000-0000-0000-000000000000',
      }
    }else{
      this.infoData = JSON.parse(JSON.stringify(this.info))
    }
    this.clockImg1 = this.imgPath + 'icon-clock-1.png'
    this.clockImg2 = this.imgPath + 'icon-clock-2.png'
    this.clockImg3 = this.imgPath + 'icon-clock-3.png'
    this.clockImg4 = this.imgPath + 'icon-clock-4.png'
    this.switchImg_open = this.imgPath + 'switchbtn_selected.png'
    this.switchImg_close = this.imgPath + 'switchbtn.png'
    this.switchSave = this.guid ? true : false
    this.setTimeInfo[0].value = this.infoData.xls
    this.setTimeInfo[2].value = localStorage.getItem('setting_midnight') || 0
    this.initXLS()
  },
  mounted() {
    setTimeout(() => {
      this.initData()
      // if (this.showQiYun) this.initClock()
    })
  },
  watch: {
    guid() {
      this.switchSave = !!this.guid
    },
    allDialog: {
      handler(val) {
        if (val.showAddress || val.showDatetime) {
          //this.$EventBus.$emit('scroll', false)
        } else {
          //this.$EventBus.$emit('scroll', true)
        }
      },
      deep: true,
    },
    infoData() {
      this.initData()
    },
  },
  methods: {
    padTimeString(timeStr) {
      return timeStr.replace(/(\d{1,2})/g, function(match, p1, offset, string) {
        return p1.padStart(2, '0');
      });
    },
    onTypeClick(id) {
      this.infoData.typeId = id
    },
    onSetTimeInfo(index) {
      // this.setTimeInfo.forEach((item, dex) =>
      //   dex == index ? (item.value = 1) : (item.value = 0),
      // )
      this.setTimeInfo[index].value = this.setTimeInfo[index].value ^ 1
      switch (index) {
        case 0:
          //夏令时同步到用户设置
          //localStorage.setItem("setting_xls", JSON.stringify(this.setTimeInfo[index].value))
          break
        case 1:
          break
        case 2:
          //早晚子时同步到用户设置
          localStorage.setItem("setting_midnight", JSON.stringify(this.setTimeInfo[index].value))
      }
    },
    async initData() {
      // 初始化分组
      if (this.typeList.length == 1 && this.guid) {
        await homeApi
          .Request('user/customGroupList?userGuid=', this.guid, 1)
          .then(async (res) => {
            if (res.code == 0) {
              console.log('获取分组数据成功！', res.data.items)

              await this.$store.dispatch('paipan/setTypeList', res.data.items)
            }
          })
          .catch((err) => {
            console.log('获取分组数据失败！', err)
          })
      }
      if (this.infoData) {
        // 初始化日历类型
        switch (this.infoData.type) {
          case 1:
            this.datetimeIndex = 1
            this.datetimeIndex_real = 1
            break
          case 2:
            this.handleBookSave()
            break
        }

        // 初始化地址类型
        if (this.infoData.hw || this.infoData.address.split(' ').length !== 3) {
          this.addressIndex = 1
        }
      }

      console.log('this.infoData.birthday', this.infoData.birthday)

      // 初始化时间
      this.birthdayDate = this.infoData
        ? new Date(this.infoData.birthday.replace(/-/g, '/'))
        : new Date()

      // 初始化地址
      this.addressData =
        !this.infoData || !this.infoData.address
          ? ['未知地', '北京时间', '--']
          : this.infoData.address.split(' ')
    },
    // 初始化时钟组件数据
    initClock() {
      let date = new Date()
      let nowDate = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
      ]
      this.updateClockData(nowDate)
      let dTime = (60 - nowDate[5]) * 1000
      setTimeout(() => {
        date = new Date(date.getTime() + dTime)
        nowDate = [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
        ]
        this.updateClockData(nowDate)
        setInterval(() => {
          date = new Date()
          nowDate = [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
          ]
          this.updateClockData(nowDate)
        }, 1000 * 60)
      }, dTime)
    },
    /**
     * 初始化夏令时数据
     * eg1: [{startY: 2024, endY: 2024, rangeArr: [{startM: 1, startD: 1, endM: 12, endD: 31}]}]
     * eg2: [{startY: 2024, endY: 2024, isAllYear: true}]
     * eg2: [{startY: 2024, endY: 2024, type: 1}]
     * eg2: [{startY: 2024, endY: 2024, jqType: 1}]
     */
    initXLS() {
      if (typeof xlsData[0] === 'boolean') return
      const curYear = new Date().getFullYear()
      xlsData.forEach((item) => {
        for (let [key, value] of Object.entries(item.data)) {
          const rangeArr = []
          value.forEach((range) => {
            const [range_year, range_range] = range.split(' ')
            const [startY, endY] = range_year.split('-')
            const isToDate = endY === '*'
            const rangeItem = {
              startY: +startY,
              endY: isToDate ? curYear : +endY,
              isToDate,
            }
            if (range_range === '*') {
              rangeItem.isAllYear = true
            } else if (range_range.length === 1) {
              rangeItem.type = +range_range
            } else if (range_range === '春分-秋分') {
              rangeItem.jqType = 1
            } else if (range_range.indexOf('-') > -1) {
              const rangeRArr = range_range.split(',').map((rr) => {
                const rArr = rr.split('-')
                const [startM, startD] =
                    rArr[0] === '*' ? [1, 1] : rArr[0].split('/'),
                  [endM, endD] = rArr[1] === '*' ? [12, 31] : rArr[1].split('/')
                return {
                  startM: +startM,
                  startD: +startD,
                  endM: +endM,
                  endD: +endD,
                }
              })
              rangeItem.rangeArr = rangeRArr
            }
            rangeArr.push(rangeItem)
          })
          item.data[key] = rangeArr
        }
      })
      xlsData.unshift(true)
    },
    /**
     * 更新时钟组件数据
     */
    async updateClockData(nowDate) {
      this.clockData.solarDateStr = `${nowDate[0]}年${
        (nowDate[1] < 10 ? '0' : '') + nowDate[1]
      }月${(nowDate[2] < 10 ? '0' : '') + nowDate[2]}日 ${
        (nowDate[3] < 10 ? '0' : '') + nowDate[3]
      }:${(nowDate[4] < 10 ? '0' : '') + nowDate[4]}:${
        (nowDate[5] < 10 ? '0' : '') + nowDate[5]
      }`
      this.clockData.hDeg = ((nowDate[3] % 12) + nowDate[4] / 60) * 30
      this.clockData.mDeg = nowDate[4] * 6
      if (nowDate[3] !== this.clockData.nowDate[3]) {
        const dateStr = getDateTimeStr(nowDate, true)
        let yzs = localStorage.getItem('setting_midnight')
        if (yzs) {
          yzs = yzs == 'true' ? 1 : 0
        } else {
          yzs = 0
        }
        const reqData = {
          d: dateStr,
          s: this.infoData.sex,
          today: dateStr,
          yzs,
          vip: this.viplevel,
          userguid: this.guid,
        }
        await getBaseBZ(reqData).then((res) => {
          if (res) {
            this.clockData.bz = [
              res.bz[0],
              res.bz[2],
              res.bz[4],
              res.bz[6],
              res.bz[1],
              res.bz[3],
              res.bz[5],
              res.bz[7],
            ]
            this.clockData.lunarDateStr = res.bz[8]
          }
        })
      }
      this.clockData.nowDate = nowDate
    },
    // 性别切换
    onChangeSex(sex) {
      console.log('sex：', sex)
      this.infoData.sex = sex
    },
    onChangeSave() {
      if (!this.guid) {
        this.switchSave = false
        this.$message.warning('未登录, 不提供排盘存储功能')
        this.infoData.isSave = false
      } else {
        this.switchSave = !this.switchSave
      }
    },
    onChangeGroup(groupId) {
      this.infoData.groupId = groupId
    },
    onAddGroup() {
      this.$router.push({ path: '/main/addgroup' })
    },
    async toPaiPan() {
      if (this.infoData.username) {
        const res = await getBlackLebelOfName(this.infoData.username)
        if (res.level == 1) {
          // WzToast({
          //   message: '该词汇无法排盘，请重新输入',
          //   type: 'warning',
          // })
          this.$message.warning('该词汇无法排盘，请重新输入')
          this.username = ''
          this.infoData.username = ''
          return
        } else if (res.level == 2) {
          this.$message.warning('该词汇无法排盘，请重新输入')
          this.infoData.username = res.label
          this.username = res.label
        }
      }
      this.infoData.xls = this.setTimeInfo[0].value
      this.infoData.bjtime = this.isBJTime ? 1 : 0
      this.infoData.hw = this.addressData.length !== 3 ? 1 : 0

      //同步到服务器端
      if(this.infoData.isSave){
        await this.saveDemo()
      }else{
        this.infoData.guid = ''
      }
      //将保存的案例信息回送给父组件
      this.$emit('confirm', this.infoData)
      console.log('排盘信息：', this.infoData)

      //this.$emit('confirm', this.switchSave)
    },
    async saveDemo() {
      let lunarArr = this.infoData.lunarArr
      if (this.from === 'paipanRecord') {
        let url = 'User/UpdateSubUser2'
        let msg = packageParams({
          guid: this.infoData.guid,
          name: this.infoData.username || '案例',
          isLeapMonth: lunarArr[3],
          leapMonth: lunarArr[3] ? lunarArr[1] : 0,
          sex: this.infoData.sex,
          birthDay: this.infoData.birthday,
          solarTime: this.infoData.birthday,
          lunarTime:
            lunarArr[0] +
            '-' +
            lunarArr[1] +
            '-' +
            lunarArr[2] +
            ' ' +
            this.infoData.birthday.split(' ')[1],
          sunTime: this.setTimeInfo[1].value == 1 ? this.infoData.sunTime : this.infoData.birthday,
          location: this.infoData.address,
          parentGuid: this.infoData.parentGuid,
          type: 1,
          groupGuid: this.infoData.typeId,
          star: this.infoData.star,
          unknowhour: this.infoData.unknowhour || 0,
        })
        await homeApi.Request(url, msg, 2, 'post')
        return
      }
      let json = {
        name: this.infoData.username || '案例',
        isLeapMonth: lunarArr[3],
        leapMonth: lunarArr[3]?lunarArr[1]:0,
        sex: this.infoData.sex,
        birthDay: this.infoData.birthday,
        solarTime: this.infoData.birthday,
        lunarTime:
          lunarArr[0] +
          '-' +
          lunarArr[1] +
          '-' +
          lunarArr[2] +
          ' ' +
          this.infoData.birthday.split(' ')[1],
        sunTime: this.setTimeInfo[1].value == 1?this.infoData.sunTime:this.infoData.birthday,
        location: this.infoData.address,
        ParentGuid: this.guid,
        groupGuid: this.infoData.typeId,
        type: 1,
        star: false,
        unknowhour: 0,
        xls: this.infoData.xls,
        hw: this.infoData.hw,
        bjtime: 0,
      }
      console.log('保存数据', json)
      var param = new URLSearchParams()
      param.append('name', json.name)
      param.append('isLeapMonth', json.isLeapMonth?1:0)
      param.append('leapMonth', json.leapMonth)
      param.append('sex',json.sex)
      param.append('birthDay',json.birthDay)
      param.append('solarTime',json.solarTime)
      param.append('lunarTime',json.lunarTime)
      param.append('sunTime',json.sunTime)
      param.append('location',json.location)
      param.append('ParentGuid',json.ParentGuid)
      param.append('groupGuid',json.groupGuid)
      param.append('type',json.type)
      param.append('star',json.star)
      param.append('unknowhour',json.unknowhour)
      param.append('xls',json.xls)
      param.append('hw',json.hw)
      param.append('bjtime',json.bjtime)
      await addBZ(param).then((res) => {
          console.log('保存成功', res)
          if(res.code == 0){
            this.infoData.guid = res.data
          }
      }).catch((err) => {
          console.log('保存失败', err)
      })
    },
    // 确定公历选中时间
    handleConfirmSolar(dateArr) {
      this.infoData.unknowhour =
        dateArr[3] === '未知' || dateArr[4] === '未知' ? 1 : 0
      if (this.infoData.unknowhour) {
        this.infoData.birthday = `${dateArr[0]}-${dateArr[1]}-${dateArr[2]} 00:00`
      } else {
        this.infoData.birthday = `${dateArr[0]}-${dateArr[1]}-${dateArr[2]} ${dateArr[3]}:${dateArr[4]}`
      }
      this.infoData.lunarArr.length = 0
    },
    // 确定选中农历时间
    handleConfirmLunar(dateArr) {
      this.infoData.unknowhour =
        dateArr[3] === '未知' || dateArr[4] === '未知' ? 1 : 0
      let leepflag = dateArr[1].indexOf('闰') > -1
      const lunarM =
          model.monthArray.findIndex(
            (item) => item === dateArr[1].slice(leepflag ? 1 : 0),
          ) + 1,
        lunarD = model.dayArray.findIndex((item) => item === dateArr[2]) + 1
      let solarArr = lunar2Solar(dateArr[0], lunarM, lunarD, leepflag)
      this.infoData.birthday = `${solarArr[0]}-${getAddZero(
        solarArr[1],
      )}-${getAddZero(solarArr[2])} ${
        this.infoData.unknowhour
          ? '00:00'
          : getAddZero(dateArr[3]) + ':' + getAddZero(dateArr[4])
      }`
      this.infoData.lunarArr = [
        dateArr[0],
        getAddZero(lunarM),
        getAddZero(lunarD),
        leepflag,
        { cnm: dateArr[1], cnd: dateArr[2] },
      ]
    },
    // 四柱数据
    handleConfirmSizhu(datestr) {
      let birthday = datestr
      if (birthday.indexOf('时辰未知') >= 0) {
        birthday = birthday.split(' ')[0] + ' 00:00'
        this.infoData.unknowhour = 1
      }
      this.infoData.birthday = birthday
      this.infoData.lunarArr.length = 0
    },
    // 确定选中国内地址
    handleConfirmDomestic(dataArr) {
      this.infoData.hw = 0
      this.infoData.address =
        dataArr[0].text + ' ' + dataArr[1].text + ' ' + dataArr[2].text
      this.selectedLng = dataArr[2].gisGcj02Lng
      this.selectedLat = dataArr[2].gisGcj02Lat
      this.addressData = this.infoData.address.split(' ')
    },
    // 确定选中海外地址
    handleConfirmOverseas(dataArr) {
      this.infoData.hw = 1
      this.infoData.address = dataArr[0].name + ' ' + dataArr[1].text
      this.selectedLng = dataArr[1].lng
      this.selectedLat = undefined
      this.zone = dataArr[1].zone
      this.addressData = this.infoData.address.split(' ')
    },
    onConfirmDatetime(id, data) {
      switch (id) {
        case 0:
          this.handleConfirmSolar(data)
          break
        case 1:
          this.handleConfirmLunar(data)
          break
        case 2:
          this.handleConfirmSizhu(data)
          break
      }
      this.datetimeIndex_real = this.datetimeIndex
      this.onCloseDatetime()
      this.handleSunTime()
    },
    onChangeDatetimeTab(id) {
      this.datetimeIndex = id
    },
    onCloseDatetime() {
      this.showDatetime = false
    },
    onShowDatetime(id) {
      if (id !== undefined) this.datetimeIndex = id
      this.showDatetime = true
    },
    setUnknowhour(data) {
      this.infoData.unknowhour = data
      console.log("未知时辰：",data);
      
    },
    onChangeAddressTab(id) {
      this.addressIndex = id
    },
    onCloseAddress() {
      this.showAddress = false
    },
    onShowAddress() {
      this.showAddress = true
    },
    onConfirmAddress(id, data) {
      console.log('onConfirmAddress', id, data)
      switch (id) {
        case 0:
          this.handleConfirmDomestic(data)
          break
        case 1:
          this.handleConfirmOverseas(data)
          break
      }
      this.handleSunTime()
    },
    // 计算真太阳时
    handleSunTime() {
      if (this.infoData && this.infoData.unknowhour == 1) {
        const arr = this.solarArr
        this.infoData.sunTime = `${arr[0]}-${arr[1]}-${arr[2]} 00:00`
      } else {
        let arr = this.solarArr
        if (this.infoData.address.indexOf('未知地') !== 0) {
          if (this.isXLS) arr = this.handleXLSData()
          arr = getSunTime(
            arr,
            this.selectedLng,
            !!this.infoData.hw,
            this.isBJTime,
            this.zone,
          )
        }
        this.infoData.sunTime = `${arr[0]}-${arr[1]}-${arr[2]} ${arr[3]}:${arr[4]}`
      }
    },
    // 计算夏令时时间
    handleXLSData() {
      let solarArr = this.solarArr.map((i) => +i),
        isHW = !!this.infoData.hw
      let xlsItem = null,
        xlsKey = ''
      if (!isHW) {
        xlsItem = xlsData[1].data
        xlsKey = '大陆'
        if (this.addressData[0].indexOf('台湾') > -1) {
          xlsKey = '台湾'
        } else if (this.addressData[0].indexOf('澳门') > -1) {
          xlsKey = '澳门'
        } else if (this.addressData[0].indexOf('香港') > -1) {
          xlsKey = '香港'
        } else {
          xlsKey = '大陆'
        }
      } else {
        xlsItem = xlsData.find((item) => item.text === this.addressData[0])
        if (!xlsItem) return solarArr
        xlsItem = xlsItem.data
        xlsKey = this.addressData[1]
      }
      if (!xlsItem[xlsKey]) return solarArr
      const xlsArr = xlsItem[xlsKey] // 拿到该地区夏令时生效的时间范围

      const isWithin = getIsWithin(xlsArr, solarArr)
      if (isWithin) {
        if (solarArr[3] > 0) {
          solarArr[3] -= 1
        } else if (solarArr[2] > 0) {
          solarArr[2] -= 1
          solarArr[3] = 23
        } else if (solarArr[1] > 0) {
          solarArr[1] -= 1
          let maxD = solarDaysArr[solarArr[1] - 1]
          if (solarArr[1] === 2) {
            maxD = daysInFebruary(solarArr[0])
          }
          solarArr[2] = maxD
          solarArr[3] = 23
        } else {
          solarArr[0] -= 1
          indexes[1] = 12
          indexes[2] = 31
          indexes[3] = 23
        }
      }

      return solarArr
    },
    // 古籍页跳转过来时打开四柱弹窗
    handleBookSave() {
      this.onShowDatetime(2)
      this.datetimeIndex_real = 2
      const bz = this.infoData.bz
      if (bz) {
        this.$nextTick(() => {
          const formDatetime = this.$refs.formDatetime
          formDatetime && formDatetime.handleBookSave(bz)
        })
      }
    },
  },
}

// 判断是否在夏令时时间范围内
function getIsWithin(xlsArr, arr) {
  let res = false
  const xlsItem = xlsArr.find(
    (xls) => xls.startY <= arr[0] && xls.endY >= arr[0],
  )
  if (xlsItem) {
    if (xlsItem.isToDate) {
      const date = new Date()
      const curY = date.getFullYear(),
        curM = date.getMonth() + 1,
        curD = date.getDate()
      if (
        curY === arr[0] &&
        (arr[1] > curM || (arr[1] === curM && arr[2] > curD))
      )
        return false
    }
    if (xlsItem.isAllYear) {
      // 全年
      res = true
    } else if (typeof xlsItem.type === 'number') {
      res = (function () {
        switch (xlsItem.type) {
          case 1:
            // 3月最后一个星期日到10月最后一个星期日
            if (arr[1] >= 3 && arr[1] <= 10) {
              if (arr[1] === 3) {
                const date = new Date(arr[0], 3, 0)
                const day = date.getDate() - date.getDay()
                if (arr[2] < day) return false
              } else if (arr[1] === 10) {
                const date = new Date(arr[0], 10, 0)
                const day = date.getDate() - date.getDay()
                if (arr[2] > day) return false
              }
              return true
            }
            break
          case 2:
            // 3月第二个星期日到11月的第一个星期日
            if (arr[1] >= 3 && arr[1] <= 11) {
              if (arr[1] === 3) {
                const date = new Date(arr[0], 2, 1)
                const day = 8 + ((7 - date.getDay()) % 7)
                if (arr[2] < day) return false
              } else if (arr[1] === 11) {
                const date = new Date(arr[0], 10, 1)
                const day = 1 + ((7 - date.getDay()) % 7)
                if (arr[2] > day) return false
              }
              return true
            }
            break
          case 3:
            // 4月的第一个周日到10月的最后一个周日
            if (arr[1] >= 4 && arr[1] <= 10) {
              if (arr[1] === 4) {
                const date = new Date(arr[0], 3, 1)
                const day = 1 + ((7 - date.getDay()) % 7)
                if (arr[2] < day) return false
              } else if (arr[1] === 10) {
                const date = new Date(arr[0], 10, 0)
                const day = date.getDate() - date.getDay()
                if (arr[2] > day) return false
              }
              return true
            }
            break
          case 4:
            // 4月的最后一个周五到10月的最后一个周四
            if (arr[1] >= 4 && arr[1] <= 10) {
              if (arr[1] === 4) {
                const date = new Date(arr[0], 10, 0)
                const day = date.getDate() - date.getDay() - 2
                if (arr[2] > day) return false
              } else if (arr[1] === 10) {
                const date = new Date(arr[0], 10, 0)
                const day = date.getDate() - date.getDay() - 3
                if (arr[2] > day) return false
              }
              return true
            }
            break
        }
        return false
      })()
    } else if (xlsItem.jqType) {
      switch (xlsItem.jqType) {
        case 1:
          // 以春分后一天开始，以秋分后一天结束
          if (arr[1] >= 3 && arr[1] <= 9) {
            if (arr[1] === 3) {
              if (arr[2] >= 22) {
                res = true
              } else {
                const cfArr = getJieqiWithYearAndMonth2(arr[0], 3)[0]
                  .split('-')
                  .map((i) => +i)
                res = arr[2] >= cfArr[2] + 1
              }
            } else if (arr[1] === 9) {
              if (arr[2] <= 23) {
                res = true
              } else {
                const qfArr = getJieqiWithYearAndMonth2(arr[0], 9)[0]
                  .split('-')
                  .map((i) => +i)
                res = arr[2] <= qfArr[2] + 1
              }
            } else {
              res = true
            }
          } else {
            res = false
          }
          break
      }
    } else if (xlsItem.rangeArr) {
      res = !!xlsItem.rangeArr.find((xls) => {
        if (arr[1] >= xls.startM && arr[1] <= xls.endM) {
          if (arr[1] === xls.startM) {
            return arr[2] >= xls.startD
          } else if (arr[1] === xls.endM) {
            return arr[2] <= xls.endD
          }
          return true
        }
        return false
      })
    }
  }

  return res
}
</script>

<style lang="scss" scoped>
.form_wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: white;
  padding: 60px;
  border-radius: 30px;

  .form_row1,
  .form_row2,
  .form_row3,
  .form_group,
  .clock_box {
    box-sizing: border-box;
    width: 280px;
    text-align: left;
  }

  .form_row1 {
    padding: 4px 2px;
    border-bottom: 1px solid rgba(136, 136, 136, 0.2);

    &:nth-child(1) {
      margin-bottom: 8px;
    }

    &:nth-child(4) {
      margin-bottom: 6px;
    }
  }

  .form_row2 {
    display: flex;
    justify-content: space-between;
    color: #929292;
    font-size: 13px;

    &:nth-child(2) {
      margin-bottom: 2px;
    }
  }

  .form_row3 {
    position: relative;
  }

  .form_realsolartime {
    display: flex;
    flex-direction: column;
    color: #a7a7a7;
    transform-origin: left top;
    transform: scale(0.8);

    .form_realsolartime_text1 {
      margin-bottom: 5px;
    }
  }

  .form_save {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    color: #444444;
    font-size: 12px;

    .form_save_icon {
      width: 30px;
    }
  }

  .form_input {
    box-sizing: border-box;
    width: 100%;
    padding: 0;
    border: none;

    &::-webkit-input-placeholder {
      color: #d5d5d5;
    }
  }

  .form_light_color {
    color: #d5d5d5;
  }

  .form_radios_box {
    box-sizing: border-box;
    display: flex;
    height: 25px;
    border-radius: 15px;
    border: 1px solid rgba(178, 149, 93, 0.3);

    .form_radios_item {
      box-sizing: border-box;
      min-width: 45px;
      height: 100%;
      padding: 0 15px;
      text-align: center;
      line-height: 25px;
      white-space: nowrap;
      border-radius: 15px;
    }

    .form_radios_item_selected {
      color: white;
      background-color: #b2955d;
    }
  }

  /* 分类 */
  .form_group {
    display: flex;
    align-items: center;
    margin-top: -3px;
    font-size: 0;

    .form_group_label,
    .form_group_items,
    .form_group_item {
      white-space: nowrap;
    }

    .form_group_label {
      font-size: 15px;
    }

    .form_group_items {
      flex: 1;
      overflow-x: auto;
      overflow-y: hidden;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .form_group_item {
      box-sizing: border-box;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 39px;
      height: 20px;
      margin-right: 7px;
      color: #929292;
      font-size: 12px;
      border-radius: 15px;
      border: 1px solid rgba(178, 149, 93, 0.4);
    }

    .form_group_item_selected {
      color: white;
      border: none;
      background-color: #b2955d;
    }

    .form_group_item_add {
      font-size: 16px;
    }
  }

  /* 即时起局 */
  .clock_box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;

    .clock_content {
      position: relative;
      left: -13px;
      width: 100px;
    }

    .clock_content_icon {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      width: 85px;
      height: 85px;
      margin: auto;
    }

    .clock_bz_box {
      width: 130px;
      color: #515151;
      font-size: 16px;
    }

    .clock_bz_row {
      display: flex;
      justify-content: space-between;
      line-height: 1.4em;
    }

    .clock_bz_row2 {
      color: #a7a7a7;
      line-height: 1em;
      text-align: left;
      white-space: nowrap;
      transform-origin: left center;
      transform: scale(0.6);
    }

    .clock_qiju {
      padding-left: 15px;
      transform-origin: right center;
      transform: scale(0.8);

      .clock_qiju_column {
        box-sizing: border-box;
        width: 32px;
        padding: 12px 8px;
        color: #b2955d;
        line-height: 1.1em;
        text-align: center;
        opacity: 0.7;
        border-radius: 60px;
        border: 1px solid rgba(178, 149, 93, 0.5);
      }
    }
  }

  /* 开始排盘 */
  .form_paipan {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 63px;
    margin: 5px auto 0;
    color: #f7d3a1;
    font-size: 18px;
    font-weight: bold;
    border-radius: 63px;
    background-color: black;
    font-family: 宋体;
  }
}

.wd {
  right: 0;
  width: 375px;
  margin: 0 auto;

  .datetime_title2_wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    color: #969799;
    font-size: 16px;

    .datetime_title2_item {
      flex: 1;
    }
  }

  .picker-title-head {
    display: flex;
    position: relative;
    font-size: 12px;
    padding: 10px;
    margin-bottom: 5px;
    border-bottom: 0.5px solid #eeeeee;
  }

  .confirm-btn {
    width: 80%;
    margin: 10px auto 10px;
    padding: 6px 0;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    color: white;
    border-radius: 10px;
    background-color: #000;
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
  margin-bottom: 22px;
  .form-row-left,
  .form-row-right {
    display: flex;
    align-items: center;
  }
  .form-row-item {
    padding: 6px 30px;
    white-space: nowrap;
    border-radius: 20px;
  }

  .form-row-item-sex {
    display: flex;
    justify-content: center;
    margin-right: 31px;
    & > img {
      width: 18px;
      margin-right: 5px;
    }
  }
  .form-row-item-box {
    border-radius: 20px;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.07);
  }

  .selectedItem {
    color: white !important;
    border-radius: 20px;
    background-color: $mainColor !important;
  }
}

.type-box {
  flex: 1;
  display: flex;
  // align-items: center;
  margin-bottom: 26px;
  width: 100%;

  & > span {
    margin-right: 14px;
    color: #7b7b7b;
    font-size: 16px;
    white-space: nowrap;
    padding-bottom: 10px;
  }

  .type-item-box {
    display: flex;
    //justify-content: center;
    overflow-x: scroll;
    padding-bottom: 3px;
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
    .type-item {
      display: flex;
      justify-content: center;
      margin-right: 31px;

      & > img {
        width: 18px;
        height: 18px;
        margin-right: 5px;
      }

      & > span {
        white-space: nowrap;
        color: #444444;
        font-size: 16px;
      }
    }
  }
}

.suntime-info-box {
  display: flex;
  align-items: flex-start;
  margin-bottom: 22px;
  width: 100%;
  white-space: nowrap;
  & > span {
    margin-right: 28px;
    color: #7b7b7b;
    font-size: 16px;
  }
}

.input-box {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 22px;

  .bogus-input {
    border: 1px solid #ececec;
    border-radius: 6px;
    padding: 9px 0 9px 13px;
    width: 100%;
    text-align: left;
    margin-right: 0px;
  }

  & > span {
    margin-right: 14px;
    color: #444;
    font-size: 16px;
    white-space: nowrap;
  }

  & > .el-input {
    border: 1px solid #ececec;
    border-radius: 6px;
  }
}

.form-row-settime-box {
  position: relative;
  display: flex;
  width: 100%;
  margin-top: 13px;
  margin-bottom: 37px;
  .form-row-settime-box-item {
    display: flex;
    justify-content: center;
    margin-right: 31px;
    white-space: nowrap;
    & > img {
      margin-right: 5px;
    }
  }
  .save-box {
    position: absolute;
    user-select: none;
    right: 0%;
    top: -12px;
    color: #444444;
    font-family: SourceHanSansSC-regular;
  }
}

:deep(.van-picker-column__item) {
  font-size: 14px;
}

:deep(.el-input__wrapper) {
  box-sizing: border-box;
  height: 36px;
  margin: 0;
  padding: 0;
  font-size: 16px;
  box-shadow: none;
  background-color: rgba(255, 255, 255, 100);
  .el-input__inner {
    height: 100%;
    margin-left: 13px;
    font-size: 16px;
    &::placeholder {
      opacity: 0.35;
      font-size: 15px;
      color: #d5d5d5;
    }
  }
}
:deep(.el-switch__label.is-active) {
  color: rgba(68, 68, 68, 100);
  font-size: 14px;
}

::-webkit-input-placeholder {
  padding: none;
}

@media screen and (min-height: 800px) {
  .form_wrapper {
    //padding-top: 26px;
    // background-color: rgba(255, 192, 203, 0.5);
  }

  .form_row1:nth-child(1) {
    margin-bottom: 10px !important;
    // background-color: pink
  }

  .form_row2:nth-child(2) {
    margin-bottom: 10px !important;
  }

  .form_row1:nth-child(3) {
    margin-bottom: 10px !important;
  }

  .form_row1:nth-child(4) {
    margin-bottom: 14px !important;
  }

  .form_realsolartime_text1 {
    margin-bottom: 12px !important;
  }

  .form_group {
    margin-bottom: 7px !important;
  }

  .clock_box {
    margin-bottom: 8px !important;
  }
}
</style>
