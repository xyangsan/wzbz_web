<template>
  <div class="hepan-box columnFlex">
    <div class="hepai-header">
      <div class="hepai-header-form">
        <div class="hepai-header-form-item">
          <form-box
            :type="1"
            :infoData="infoData1"
            @onInitForm="onInitForm1"
            @onCalendar="onCalendar1"
            @onAddress="onAddress1"
          />
        </div>
        <div class="hepai-header-form-division"></div>
        <div class="hepai-header-form-item">
          <form-box
            :type="1"
            :infoData="infoData2"
            @onInitForm="onInitForm2"
            @onCalendar="onCalendar2"
            @onAddress="onAddress2"
          />
        </div>
      </div>
      <el-button class="hepai-header-btn pointer" @click="onHepai">
        开始合盘
      </el-button>
    </div>
    <!-- 静态页面 -->
    <div class="hepai-footer">
      <div class="hepai-footer-title">八字合盘</div>
      <div class="hepai-footer-content">
        <div class="hepai-footer-content-text">
          在古代，八字命理的一大应用场景就是婚姻
        </div>
        <div class="hepai-footer-content-text">
          通过八字，判断男女对方的匹配度：包括是否相处和睦、是否旺夫帮妻、乃至是否子息兴旺、寿元同步等
        </div>
      </div>
      <div class="hepai-footer-title2">
        八字合盘里面的奥妙，可谓是无穷而精微！
      </div>
      <div class="hepai-footer-card">
        <div
          class="hepai-footer-card-item columnFlex"
          v-for="(item, index) in cardList"
          :key="index"
        >
          <img
            class="hepai-footer-card-item-img"
            :src="require(`../../assets/images/relation_img${index + 1}.png`)"
            :alt="item"
          />
          <div class="hepai-footer-card-item-division"></div>
          <div class="hepai-footer-card-item-text">{{ item }}</div>
        </div>
      </div>
      <div class="hepai-footer-content">
        <div class="hepai-footer-content-text">
          问真八字的合盘功能，就是基于传统八字合盘技法，将关键的匹配要素罗列，并给出必要提示。
        </div>
        <div class="hepai-footer-content-text">
          值得说明的是，除了进行婚恋合盘外，对于朋友、闺蜜、同事、领导、合伙等社会关系，都可以运用合盘来做参考。也欢迎大家多多尝试。
        </div>
      </div>
    </div>
  </div>
  <img
    style="height: 20px; margin: 20px auto;"
    :src="require('@/assets/images/icon_warning.png')"
    alt=""
  />
  <NoVIPBox
    v-if="showNoVIP"
    class="vip-box"
    title="合盘功能"
    content="亲爱的问真用户，成为问真会员方可使用合盘功能"
    btnText="开通会员"
    @onClose="onNoVIP"
    :closeIcon="require('@/assets/images/icon_close2.png')"
  />
  <transition name="fade">
    <PopupBox class="tips-box" v-if="showTips" :width="385" :height="87">
      请先选择档案后合盘
    </PopupBox>
  </transition>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import FormBox from '@/components/formBox'
import NoVIPBox from '@/components/noVIPBox'
import PopupBox from '@/components/popupBox'
import { getShengXiaoIndex, getYearGZ } from '@/views/paipan-result/utils'
import {
  navigationTo,
  LunarToSolar,
  getSunTime,
  dateArrToStr,
  verifyInput,
  verifySensitiveWord,
  updateLevel,
} from '@/utils'
import * as homeApi from '@/api/home-api'
import store from '@/store'

const guid = computed(() => store.getters.userguid)
const viplevel = computed(() => store.getters.viplevel)
const infoData1 = reactive({
  name: '', // 姓名
  sex: 1, // 性别
  isSolar: true, // 是否选择阳历
  calendar: '', // 日期
  sunTime: '', // 太阳时
  address: '', // 出生地址
})
const infoData2 = reactive({
  name: '', // 姓名
  sex: 1, // 性别
  isSolar: true, // 是否选择阳历
  calendar: '', // 日期
  sunTime: '', // 太阳时
  address: '', // 出生地址
})
const cardList = [
  '婚恋关系',
  '朋友关系',
  '闺蜜关系',
  '同事关系',
  '领导关系',
  '合伙关系',
]
const showNoVIP = ref(false)

// 前往VIP页
const onNoVIP = () => {
  showNoVIP.value = !showNoVIP.value
}

// 监听日期
const onCalendar1 = (data) => {
  handleInitForm(1)
  infoData1.calendar = data
}
const onCalendar2 = (data) => {
  handleInitForm(2)
  infoData2.calendar = data
}
// 监听地址
const onAddress1 = (data) => {
  handleInitForm(1)
  infoData1.address = data
}
const onAddress2 = (data) => {
  handleInitForm(2)
  infoData2.address = data
}
// 保存合盘记录
const saveHepan = async (info1, info2) => {
  let url = 'createhepan.php?'
  let parms =
    'guid=' + guid.value + '&parms=' + JSON.stringify({ info1, info2 })
  let result = false
  await homeApi
    .Request(url, parms)
    .then((res) => {
      result = true
    })
    .catch((err) => {
      ElMessage.error('保存合盘数据失败')
    })
  return result
}
// 初始化表单：表示已选择从档案列表获取或新建档案
const initForm = reactive({
  initForm1: false,
  initForm2: false,
})
const onInitForm1 = (isInit) => {
  initForm.initForm1 = isInit
}
const onInitForm2 = (isInit) => {
  initForm.initForm2 = isInit
}
// 提示：选择档案后合盘
const showTips = ref(false)
const onShowTips = () => {
  showTips.value = !showTips.value
}
// 是否重置案例信息
const handleInitForm = (index) => {
  if (index == 1) {
    infoData1.sunTime = ''
  } else {
    infoData2.sunTime = ''
  }
}
// 开始合盘
const onHepai = async () => {
  if (!guid.value || viplevel.value < 1) {
    onNoVIP()
    return
  } else {
    await updateLevel()
    if (viplevel.value < 1) {
      onNoVIP()
      return
    }
  }
  if (!initForm.initForm2 || !initForm.initForm1) {
    onShowTips()
    setTimeout(() => {
      onShowTips()
    }, 1000)
    return
  }
  if (
    !verifyInput(infoData1.name.trim()) ||
    !verifyInput(infoData2.name.trim())
  ) {
    const form = document.querySelector('.hepai-header-form')
    ElMessage({
      message: '请输入中文或数字或字母',
      type: 'warning',
      appendTo: form,
      offset: 56,
    })
    return
  }

  if (
    !verifySensitiveWord(infoData1.name.trim()) ||
    !verifySensitiveWord(infoData2.name.trim())
  ) {
    const form = document.querySelector('.hepai-header-form')
    ElMessage({
      message: '该词汇无法排盘，请重新输入',
      type: 'warning',
      appendTo: form,
      offset: 56,
    })
    return
  }

  const solarTime1 = infoData1.isSolar
    ? infoData1.calendar
    : LunarToSolar(...infoData1.calendar)
  const solarTime2 = infoData2.isSolar
    ? infoData2.calendar
    : LunarToSolar(...infoData2.calendar)
  // const solarTimeStr1 = `${solarTime1[0]}-${solarTime1[1]}-${solarTime1[2]} ${solarTime1[3]}:${solarTime1[4]}:00`
  // const solarTimeStr2 = `${solarTime2[0]}-${solarTime2[1]}-${solarTime2[2]} ${solarTime2[3]}:${solarTime2[4]}:00`
  const sunTimeStr1 =
    infoData1.sunTime ||
    dateArrToStr(getSunTime(solarTime1, infoData1.address.lng))
  const sunTimeStr2 =
    infoData2.sunTime ||
    dateArrToStr(getSunTime(solarTime2, infoData2.address.lng))
  const sx1 = getShengXiaoIndex(getYearGZ(+solarTime1[0])[1])
  const sx2 = getShengXiaoIndex(getYearGZ(+solarTime2[0])[1])
  console.log("跳转前：", infoData1, infoData2);
  
  const info1 = {
    name: infoData1.name.trim() || '案例1',
    datastr: sunTimeStr1,
    sex: infoData1.sex,
    sx: sx1,
  }
  const info2 = {
    name: infoData2.name.trim() || '案例1',
    datastr: sunTimeStr2,
    sex: infoData2.sex,
    sx: sx2,
  }
  console.log(info1, info2)
  const res = await saveHepan(info1, info2)
  if (!res) return
  await store.dispatch('paipan/setUpdateHepai', true)
  navigationTo({
    path: 'hepan-result',
    params: { info1: JSON.stringify(info1), info2: JSON.stringify(info2) },
  })
}
</script>

<style lang="scss" scoped>
.hepan-box {
  align-items: center;
  width: 1230px;
  margin: auto;
  border-radius: 15px;
  background-color: white;
  .hepai-header {
    width: 1017px;
    margin: 78px auto 104px;
    border: 1px solid rgba(227, 227, 227, 0.98);
    border-radius: 30px;
    .hepai-header-form {
      position: relative;
      display: flex;
      height: 100%;
      .hepai-header-form-item {
        flex: 1;
        margin: 40px 70px 0;
        padding: 0;
      }
      .hepai-header-form-division {
        width: 1px;
        height: 315px;
        margin-top: 50px;
        background-color: rgba(227, 227, 227, 100);
      }

      :deep(.el-message) {
        position: absolute !important;
      }
    }
    .hepai-header-btn {
      width: 869px;
      height: 62px;
      margin: 115px auto 73px;
      line-height: 38px;
      color: rgba(255, 255, 255, 100);
      font-size: 20px;
      border: none;
      border-radius: 30px;
      background-color: #101010;
    }
  }
  .hepai-footer {
    width: 100%;
    padding: 0 110px 56px;
    text-align: left;
    .hepai-footer-title {
      color: rgba(16, 16, 16, 100);
      font-size: 28px;
      margin-bottom: 9px;
    }
    .hepai-footer-content {
      .hepai-footer-content-text {
        color: rgba(68, 68, 68, 100);
        font-size: 14px;
        line-height: 22px;
      }
    }
    .hepai-footer-title2 {
      margin: 47px auto 40px;
      color: rgba(16, 16, 16, 100);
      font-size: 18px;
    }
    .hepai-footer-card {
      display: flex;
      .hepai-footer-card-item {
        flex: 1;
        min-width: 100px;
        .hepai-footer-card-item-img {
          width: 132px;
        }
        .hepai-footer-card-item-division {
          width: 26px;
          height: 4px;
          margin: 32px 0 21px;
          background-color: $mainColor;
        }
        .hepai-footer-card-item-text {
          margin-bottom: 47px;
          color: rgba(16, 16, 16, 100);
          font-size: 16px;
        }
      }
    }
  }
}
.vip-box {
  :deep(.popup-box) {
    width: 385px !important;
    padding-bottom: 0 !important;
    height: 176px !important;
    color: #101010 !important;
  }

  :deep(.noVIP-box-title){
    margin-top: 5px !important;
    font-weight: normal !important;
    font-size: 19px !important;
  }

  :deep(.el-button){
    background: linear-gradient(91.34deg, rgba(198,141,86,1) 0.25%,rgba(132,79,21,1) 100.46%) !important;
    width: 132px !important;
    font-size: 16px !important;
    margin-top: 14px;
  }

  :deep(.noVIP-box-content){
    white-space: normal !important;
    font-size: 13px  !important;
    margin-bottom: 15px !important;
  }

  :deep(.noVIP-box-close){
    width: 38px !important;
    height: 38px !important;
    top: -20px !important;
  }
}
.tips-box {
  transition: all 2s;
  ::deep(.popup-box) {
    color: rgba(16, 16, 16, 100);
    font-size: 20px;
  }
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
