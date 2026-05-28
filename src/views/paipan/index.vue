<template>
  <div
    class="paipan-box"
    ref="paipanBox"
    :style="{ marginTop: topOffset + 'px' }"
  >
    <div class="paipan-box-right">
      <!-- <form-box
        :infoData="infoData"
        @onCalendar="onCalendar"
        @onAddress="onAddress"
      />
      <el-button class="paipan-btn" :loading="loading" @click="onPaipan">
        开始排盘
      </el-button> -->

      <div class="paipan-form-box">
                  <!-- :infoData="infoData" -->

        <FormPP
          @onCalendar="onCalendar"
          @onAddress="onAddress"
          @confirm="onPaipan"
        />
        <nowpp :sex="infoData.sex" style="margin-top: 16px" @confirm="onPaipan"/>
          <div class="foot-tip">
            <img :src="require('@/assets/images/icon_tip.png')"/>
            <span>平台所有产品拒绝向未成年人提供服务，仅供娱乐和参考</span>       
          </div>
      </div>
    </div>
     
  </div>
  <HistorySidebar />
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import store from '@/store'
import FormBox from '@/components/formBox'
import FormPP from '@/components/time/formpp'
import HistorySidebar from './components/historySidebar'
import nowpp from '@/components/time/nowpp'
import {getBaseBZ} from '@/api/bazi'
import {
  navigationTo,
  getSunTime,
  LunarToSolar,
  packageParams,
  handleUserListItem,
  verifyInput,
  verifySensitiveWord,
  getDateTimeStr,
} from '@/utils'

import * as homeApi from '../../api/home-api'

const guid = computed(() => store.getters.userguid)
const viplevel = computed(() => store.getters.viplevel)
const infoData = reactive({
  name: '', // 姓名
  sex: 1, // 性别
  isSolar: true, // 是否选择阳历
  calendar: '', // 日期
  address: '', // 出生地址
  sunTime: '', // 出生地址
  typeId: '', // 分类ID
  isSave: guid.value ? true : false, // 是否保存八字
})


const loading = ref(false)

// 监听日期
const onCalendar = (data) => {
  infoData.calendar = data
}
// 监听地址
const onAddress = (data) => {
  infoData.address = data
  infoData.sunTime = ''
}

const onPaipan = (data)=>{
  console.log('排盘页拿下来的data：', data);
  navToPPResult(data);
}

const timeStr2Arr = (str) => {
  console.log('str:', str);
  
  return str.split(' ')[0].split('-').concat(str.split(' ')[1].split(':'))
} 

const navToPPResult = async (data) => {
  console.log('data:', timeStr2Arr(data.birthday));
  // await homeApi
  //           .Request('getbz.php?', parmsd)
  //           .then((bzRes) => {
  //             saveObj.bz = `${bzRes.bz[0]} ${bzRes.bz[1]} ${bzRes.bz[2]} ${bzRes.bz[3]} ${bzRes.bz[4]} ${bzRes.bz[5]} ${bzRes.bz[6]} ${bzRes.bz[7]}`
  //           })
  //           .catch((err) => {
  //             ElMessage.error('获取八字数据失败！')
  //             loading.value = false
  //             return
  //           })
  const nowDate = new Date()
  const dateStr = getDateTimeStr(nowDate, true)
  let reqData = {
    d: data.sunTime,
    s: data.sex,
    today: dateStr,
    yzs: localStorage.getItem('setting_midnight') || 0,
    vip: viplevel.value,
    userguid: guid.value || '',
  }
  let tg = []
  let dz = []
  await getBaseBZ(reqData).then(res => {
          if (res) {
            tg = [res.bz[0], res.bz[2], res.bz[4], res.bz[6]]
            dz = [res.bz[1], res.bz[3], res.bz[5], res.bz[7]]
          }
        })
  let demoCount = localStorage.getItem('demoCount') || 0      
  localStorage.setItem('demoCount', ++demoCount)
  // let unknowhour = data.unknowhour || 0
  // if(unknowhour == 1){
  //   tg[3] = '*'
  //   dz[3] = '*'
  // }
  let unknowhour = 0
  let json = {
    MRType: 0,
    guid: data.guid || '',
    location: data.address,
    name: data.username || '案例' + demoCount++,
    sex: data.sex,
    solarTime: timeStr2Arr(data.birthday),
    sunTime: timeStr2Arr(data.sunTime),
    lunarArr: JSON.stringify(data.lunarArr),
    tg,
    dz,
    typeId: data.typeId || '00000000-0000-0000-0000-000000000000',
    xls: data.xls || 0,
    unknowhour,
  }
  console.log("即将跳转的排盘数据：", json);
  
 navigationTo({ path: 'paipan-result', params: json })
}
// const onPaipan = async () => {
//   loading.value = true
//   if (infoData.isSave && !guid.value) {
//     ElMessage({
//       message: '登录以后才能保存八字',
//       type: 'warning',
//     })
//     infoData.isSave = false
//     loading.value = false
//     return
//   }
//   const name = infoData.name.trim() || '案例1'
//   if (!verifyInput(name)) {
//     const form = document.querySelector('.paipan-box-right')
//     ElMessage({
//       message: '请输入中文或数字或字母',
//       type: 'warning',
//       appendTo: form,
//       offset: 56,
//     })
//     loading.value = false
//     return
//   }
//   if (!verifySensitiveWord(name)) {
//     const form = document.querySelector('.paipan-box-right')
//     ElMessage({
//       message: '该词汇无法排盘，请重新输入',
//       type: 'warning',
//       appendTo: form,
//       offset: 56,
//     })
//     loading.value = false
//     return
//   }

//   const sex = infoData.sex
//   const solarTime = infoData.isSolar
//     ? infoData.calendar
//     : LunarToSolar(...infoData.calendar)
//   const solarTimeStr = `${solarTime[0]}-${solarTime[1]}-${solarTime[2]} ${solarTime[3]}:${solarTime[4]}:00`
//   let sunTime = []
//   let sunTimeStr = ''
//   let location = ''
//   if (infoData.sunTime) {
//     const stArr = infoData.sunTime.split(' ')
//     sunTime = [...stArr[0].split('-'), ...stArr[1].split(':')]
//     sunTimeStr = infoData.sunTime
//     location = infoData.address
//   } else {
//     sunTime = getSunTime(solarTime, infoData.address.lng)
//     sunTimeStr = `${sunTime[0]}-${sunTime[1]}-${sunTime[2]} ${sunTime[3]}:${sunTime[4]}:00`
//     location = `${infoData.address[0]} ${infoData.address[1]}${
//       infoData.address[2] != '--' ? ' ' + infoData.address[2] : ''
//     }`
//   }

//   // 保存八字
//   if (infoData.isSave) {
//     let saveObj = {
//       name,
//       isLeapMonth: '0',
//       leapMonth: '0',
//       sex,
//       birthDay: solarTimeStr,
//       solarTime: solarTimeStr,
//       lunarTime: solarTimeStr,
//       sunTime: sunTimeStr,
//       location,
//       ParentGuid: guid.value,
//       groupGuid: infoData.typeId || '00000000-0000-0000-0000-000000000000',
//       type: 1,
//       star: false,
//       bz: null,
//     }
//     // console.log(JSON.stringify(saveObj));
//     const params = packageParams(saveObj)
//     await homeApi
//       .Request('User/AddSubUserH5', params, 2, 'post')
//       .then(async (res) => {
//         if (res.code != 0) {
//           ElMessage.error('保存八字失败！')
//           loading.value = false
//           return
//         } else {
//           saveObj.guid = res.data
//           const todayObj = {
//             todayYear: '',
//             todayMonth: '',
//             todayDay: '',
//             todayHour: '',
//             todayMinus: '',
//             todaySecond: '',
//           }
//           const now = new Date()
//           todayObj.todayYear = now.getFullYear()
//           todayObj.todayMonth = now.getMonth() + 1
//           todayObj.todayDay = now.getDate()
//           todayObj.todayHour = now.getHours()
//           todayObj.todayMinus = now.getMinutes()
//           todayObj.todaySecond = now.getSeconds()
//           const parmsd = `d=${sunTime[0]}-${sunTime[1]}-${sunTime[2]} ${sunTime[3]}:${sunTime[4]}:00&s=${sex}&today=${todayObj.todayYear}-${todayObj.todayMonth}-${todayObj.todayDay} ${todayObj.todayHour}:${todayObj.todayMinus}:${todayObj.todaySecond}`
//           await homeApi
//             .Request('getbz.php?', parmsd)
//             .then((bzRes) => {
//               saveObj.bz = `${bzRes.bz[0]} ${bzRes.bz[1]} ${bzRes.bz[2]} ${bzRes.bz[3]} ${bzRes.bz[4]} ${bzRes.bz[5]} ${bzRes.bz[6]} ${bzRes.bz[7]}`
//             })
//             .catch((err) => {
//               ElMessage.error('获取八字数据失败！')
//               loading.value = false
//               return
//             })
//           handleUserListItem(saveObj)
//           await store.dispatch('paipan/addUser', saveObj)
//         }
//       })
//       .catch((err) => {
//         ElMessage.error('保存八字失败！', err)
//         loading.value = false
//         return
//       })
//   }

  //const obj = {
  //  name,
   // sex,
  //  solarTime,
  //  address: location,
  //  sunTime,
    // guid: infoData.guid || '',
    // tg: saveObj.bz
    //   ? [saveObj.bz[0], saveObj.bz[2], saveObj.bz[4], saveObj.bz[6]]
    //   : ['癸', '己', '丙', '丙'],
    // dz: saveObj.bz
    //   ? [saveObj.bz[1], saveObj.bz[3], saveObj.bz[5], saveObj.bz[7]]
    //   : ['卯', '未', '寅', '申'],
  //}
  // const obj = {
  //   MRtype: '0',
  //   dz: ['卯', '未', '寅', '申'],
  //   name: '史蒂夫',
  //   sex: '1',
  //   solarTime: ['2023', '07', '07', '16', '04'],
  //   sunTime: ['2023', '07', '07', '15', '44'],
  //   tg: ['癸', '己', '丙', '丙'],
  // }
 // console.log('obj', obj)
  //loading.value = false
  //navigationTo({ path: 'paipan-result', params: obj })
//}

const paipanBox = ref(null)
const topOffset = ref(0)
let containerHeight = 0
const handleVerticalCenter = (e) => {
  nextTick(() => {
    const height = e.target.innerHeight
    containerHeight =
      paipanBox.value.getBoundingClientRect().height || containerHeight
      //console.log('变化的高度:', containerHeight, height);
      if(containerHeight > height){
        topOffset.value = 0
      }else if(Math.abs((height - containerHeight) / 2) < 114){
        topOffset.value = Math.abs((height - containerHeight) / 2)
      }else{
        topOffset.value = (height - containerHeight) / 2 - 114
      }
  })
}
onMounted(() => {
  window.addEventListener('resize', handleVerticalCenter)
  handleVerticalCenter({ target: { innerHeight: window.innerHeight } })
})
onUnmounted(() => {
  window.removeEventListener('resize', handleVerticalCenter)
})
</script>

<style lang="scss" scoped>
.paipan-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1215px;
  margin: auto;
  .paipan-box-left {
    width: 410px;
    margin-right: 144px;
  }
  .paipan-box-right {
    position: relative;
    width: 681px;
    border-radius: 30px;

    .paipan-form-box{
      display: flex;
      flex-direction: column;
      width: 100%;

      .foot-tip{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        background-color: white;
        border-radius: 20px;
        margin-top: 16px;
        height: 42px;

        & > img {
          width: 17px;
          margin-right: 5px;
        }

        & > span {
          color: #C2C2C2;
          font-size: 12px;
        }
      }
    }

    .paipan-btn {
      width: 100%;
      // height: 63px;
      height: 47px;
      margin-top: 46px;
      color: #F7D3A1;
      font-size: 18px;
      border: none;
      border-radius: 30px;
      background-color: #101010;
    }

    :deep(.el-message) {
      position: absolute !important;
    }
  }
}
</style>
