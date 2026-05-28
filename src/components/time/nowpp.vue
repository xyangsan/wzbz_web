<template>
  <div class="clock_box pointer" @click="onPaiPan">
    <div class="clock_content">
      <img
        class="clock_content_icon"
        :src="require('@/assets/images/icon-clock-1.png')"
      />
      <img
        class="clock_content_icon"
        :style="{ transform: `rotate(${clockData.mDeg}deg)` }"
        :src="require('@/assets/images/icon-clock-2.png')"
      />
      <img
        class="clock_content_icon"
        :style="{ transform: `rotate(${clockData.hDeg}deg)` }"
        :src="require('@/assets/images/icon-clock-3.png')"
      />
      <img
        class="clock_content_icon"
        :src="require('@/assets/images/icon-clock-4.png')"
      />
    </div>
    <div class="clock_bz_box-left">
      <div class="clock_bz_row siyuanfont">
        <div v-for="(item, index) in clockData.bz.slice(0, 4)" :key="index">
          {{ item }}
        </div>
      </div>
      <div class="clock_bz_row siyuanfont">
        <div v-for="(item, index) in clockData.bz.slice(4)" :key="item + index">
          {{ item }}
        </div>
      </div>
    </div>

    <div class="clock_bz_box-right">
      <span class="jishiqiju">即时起局</span>
      <div class="lunar">农历：{{ clockData.lunarDateStr }}</div>
      <div class="solar">公历：{{ clockData.solarDateStr.split(' ')[0] }} {{ clockData.solarDateStr.split(' ')[1] }}</div>
      <!-- <div class="date">
        {{ clockData.solarDateStr.split(' ')[1] }}
      </div> -->
    </div>
    <!-- <div class="clock_qiju">
      <div class="clock_qiju_column">即时起局</div>
    </div> -->
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted, defineProps, defineEmits, computed } from 'vue'
import { getDateTimeStr, getAddZero } from '@/utils'
import { getBaseBZ } from '@/api/bazi'
import { Toast } from 'vant'
import { solar2Lunar } from '@/utils/DateUtils'
const emits = defineEmits(['confirm'])
const viplevel = computed(() => store.getters.viplevel)
let clockData = ref({
  // 即时起局数据
  nowDate: [1999, 3, 14, 11, 0, 0],
  bz: ['.', '.', '.', '.', '.', '.', '.', '.'],
  solarDateStr: '1999年03月14日 00:00',
  lunarDateStr: '1999年正月廿七 子时',
  hDeg: 10,
  mDeg: 11,
})
const props = defineProps({
  sex: {
    type: Number,
    default: 0,
  },
})
onMounted(() => {
  // updateClockDate()
  // //一分钟更新一次
  // const intervalId = setInterval(updateClockDate, 1000)
  // onUnmounted(() => clearInterval(intervalId))
  setTimeout(() => {
    initClock()
  })
  updateClockTime()
  // setInterval(() => {
  //   updateClockTime()
  // }, 1000)
})

const updateClockTime = () => {
  const now = new Date()
  const nowHour = now.getHours()
  const nowMinutes = now.getMinutes()
  clockData.value.hDeg = (nowHour % 12) * 30
  clockData.value.mDeg = (nowMinutes % 60) * 6
  clockData.value.solarDateStr = `${now.getFullYear()}年${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}月${now.getDate().toString().padStart(2, '0')}日 ${now
    .getHours()
    .toString()
    .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

const initClock = () => {
  let date = new Date()
  let nowDate = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ]
  updateClockData(nowDate)
  // let dTime = (60 - nowDate[5]) * 1000
  // setTimeout(() => {
  //   date = new Date(date.getTime() + dTime)
  //   nowDate = [
  //     date.getFullYear(),
  //     date.getMonth() + 1,
  //     date.getDate(),
  //     date.getHours(),
  //     date.getMinutes(),
  //     date.getSeconds(),
  //   ]
  //   updateClockData(nowDate)
  //   setInterval(() => {
  //     date = new Date()
  //     nowDate = [
  //       date.getFullYear(),
  //       date.getMonth() + 1,
  //       date.getDate(),
  //       date.getHours(),
  //       date.getMinutes(),
  //       date.getSeconds(),
  //     ]
  //     updateClockData(nowDate)
  //   }, 1000 * 60)
  // }, dTime)
}

/**
 * 更新时钟组件数据
 */
const updateClockData = async (nowDate) => {
  const dateStr = getDateTimeStr(nowDate, true)
  let yzs = localStorage.getItem('setting_midnight') || 0
  const reqData = {
    d: dateStr,
    s: 1,
    today: dateStr,
    yzs,
    vip: 0,
    userguid: '',
  }
  await getBaseBZ(reqData).then((res) => {
    console.log('res是的是的', res)
    if (res) {
      clockData.value.bz = [
        res.bz[0],
        res.bz[2],
        res.bz[4],
        res.bz[6],
        res.bz[1],
        res.bz[3],
        res.bz[5],
        res.bz[7],
      ]
      clockData.value.lunarDateStr = res.bz[8]
    }
  })
  console.log('clockData.value', clockData.value)
  clockData.value.nowDate = nowDate
}

/**
 * 即时起局
 */
const onPaiPan = () => {
  const suntime = clockData.value.solarDateStr
    .replace(/[年月]/g, '-')
    .replace(/日/g, '')
  let parms =
    suntime +
    '|' +
    '即时局' +
    '|' +
    (props.sex == 0 ? 2 : 1) +
    '|' +
    `${clockData.value.nowDate[0]}-${getAddZero(
      clockData.value.nowDate[1],
    )}-${getAddZero(clockData.value.nowDate[2])} ${getAddZero(
      clockData.value.nowDate[3],
    )}:${getAddZero(clockData.value.nowDate[4])}` +
    '|' +
    '未知地 北京时间 --' +
    '|0'
  //Toast(JSON.stringify(parms))
  const lunarArr = solar2Lunar(
    clockData.value.nowDate[0],
    clockData.value.nowDate[1],
    clockData.value.nowDate[2],
  )
  console.log(clockData.value, '司机哦i是')

  let json = {
    guid: '',
    type: 0,
    username: '即时局',
    sex: 1,
    birthday: suntime,
    lunarArr,
    sunTime: suntime,
    address: '未知地 北京时间 --',
    unknowhour: 0,
    typeId: '00000000-0000-0000-0000-000000000000',
    bjtime: 0,
    hw: 0,
    isSave: false,
    xls: 0,
  }
  emits('confirm', json)
}
</script>

<style lang="scss" scoped>
/* 即时起局 */
.clock_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 91px 10px 75px;
  border-radius: 30px;
  background-color: white;

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
    width: 90px;
    height: 90px;
    margin: auto;
  }

  .clock_bz_box-left {
    width: 130px;
    color: #515151;
    font-size: 16px;
    margin-right: 120px;
    margin-top: 17px;
  }

  .clock_bz_box-right {
    display: flex;
    flex-direction: column;
    color: #515151;
    font-size: 16px;
    width: 150px;
    white-space: nowrap;
    margin-top: 17px;

    .jishiqiju {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      width: 149px;
      text-align: center;
      color: #b2955d;
      font-size: 14px;
      border: 1px solid rgba(178, 149, 93, 1);
      border-radius: 100px;
      margin-bottom: 12px;
    }

    .lunar {
      color: rgba(123, 123, 123, 1);
      font-size: 12px;
      text-align: left;
      margin-bottom: 4px;
    }

    .solar {
      color: rgba(123, 123, 123, 1);
      font-size: 12px;
      text-align: left;
      margin-bottom: 4px;
    }

    .date {
      color: rgba(123, 123, 123, 1);
      font-size: 12px;
      text-align: left;
    }
  }

  .clock_bz_row {
    display: flex;
    justify-content: space-between;
  }

  .clock_bz_row2 {
    color: #a7a7a7;
    text-align: left;
    white-space: nowrap;
    transform-origin: left center;
    transform: scale(0.6);
    font-size: 20px;
  }

  .clock_qiju {
    padding-left: 15px;
    transform-origin: right center;
    transform: scale(0.8);

    .clock_qiju_column {
      width: 32px;
      padding: 12px 8px;
      color: #b2955d;
      text-align: center;
      opacity: 0.7;
      border-radius: 60px;
      border: 1px solid rgba(178, 149, 93, 0.5);
    }
  }
}

.siyuanfont {
  font-family: 宋体;
  font-size: 20px;
  padding-bottom: 10px;
  color: #444444;
  font-weight: bold;
}
</style>
