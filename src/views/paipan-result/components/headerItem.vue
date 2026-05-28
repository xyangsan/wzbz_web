<template>
  <div
    class="container"
    :style="{
      'background-image': `url(${require('@/assets/images/paipan_header_bg.png')})`,
    }"
  >.
      <img class="header-avatar" :src="sxImg" alt="生肖头像" />

    <div class="header-username" :style="{ fontSize: usernameSize + 'px' }">
      {{ username }}
    </div>
    <div class="header-calendar columnFlex">
      <div class="header-calendar-text">
        {{
          MRType == 0
            ? `阴历：${infoData.unknowhour == 1?infoData.lunarTime.split(' ')[0]: infoData.lunarTime}`
            : `朝代：${infoData.peroid}`
        }}
        <span class="mainColor">
          {{ infoData.sex == 1 ? '（乾造）' : '（坤造）' }}
        </span>
      </div>
      <div class="header-calendar-text">
        {{
          MRType == 0
            ? `阳历：${infoData.solarTime[0]}年${infoData.solarTime[1]}月${infoData.solarTime[2]}日 ${infoData.unknowhour == 1? '':(infoData.solarTime[3] + ':' + infoData.solarTime[4])}`
            : `标签：${infoData.alias}`
        }}
        {{ `` }}
      </div>
    </div>
    <div class="tms pointer" v-if="isShowTms" @click="onTms()">
      <img class="tms_icon" :src="tmsValue ? tmsOpen : tmsClose" />
      <div class="tms_text">胎命身</div>
    </div>
    <img v-if="MRType == 0" class="edit pointer" @click.stop="onEdit(true)" :src="require('@/assets/images/icon_edit.png')" />
    <!-- <span v-if="MRType == 0" class="edit pointer" @click.stop="onEdit(true)" >编辑</span> -->
  </div>
  <Popup width="681px" height="596px" v-if="isEdit">
    <div class="icon_close">
      <img
        :src="require('@/assets/images/icon_close.png')"
        @click.stop="onEdit(false)"/>
    </div>
    <FormPP :info="timeInfo" @confirm="confirmPP"/>
  </Popup>
</template>

<script setup>
import { ref, defineProps, onBeforeMount, defineEmits } from 'vue'
import Popup from '@/components/popupBox3/index.vue'
import FormPP from '@/components/time/formpp.vue'
// import { getDateTimeStr } from '../utils'
import{ getDateTimeStr
} from '@/utils'
import {useRoute,useRouter} from 'vue-router'
import {getBaseBZ} from '@/api/bazi'
const route = useRoute()
const router = useRouter()
const emits = defineEmits(['onTms'])
const props = defineProps({
  MRType: {
    type: Number,
    default: 0,
  },
  infoData: {
    type: Object,
    require: true,
  },
  isShowTms: {
    type: Boolean,
    default: false,
  },
  tmsValue: {
    type: Boolean,
    default: false,
  },
})

const sxImg = require(`@/assets/images/sx_${props.infoData.shengxiaoIndex}.png`)
const tmsOpen = require(`@/assets/images/icon_tms_open.png`)
const tmsClose = require(`@/assets/images/icon_tms_close.png`)
const timeInfo = ref(null)
const isEdit = ref(false)
const timeStr2Arr = (str) => {
  return str.split(' ')[0].split('-').concat(str.split(' ')[1].split(':'))
} 
const confirmPP = async (data) => {
  console.log('data', data)
  timeInfo.value = data
  // isEdit.value = false
  username.value = data.username
  let tg = route.query.tg
  let dz = route.query.dz
  const nowDate = new Date()
  const dateStr = getDateTimeStr(nowDate, true)
  let reqData = {
    d: data.sunTime,
    s: data.sex,
    today: dateStr,
    yzs: localStorage.getItem('setting_midnight') || 0,
    vip: 3,
    userguid: data.guid || '',
  }
  let res = await getBaseBZ(reqData)
  if (res) {
    tg = [res.bz[0], res.bz[2], res.bz[4], res.bz[6]]
    dz = [res.bz[1], res.bz[3], res.bz[5], res.bz[7]]
  }
   let json = {
    MRType: 0,
    guid: data.guid || '',
    location: data.address,
    name: data.username || '案例',
    sex: data.sex,
    solarTime: timeStr2Arr(data.birthday),
    sunTime: timeStr2Arr(data.sunTime),
    lunarArr: JSON.stringify(data.lunarArr),
    tg,
    dz,
    typeId: data.typeId || '00000000-0000-0000-0000-000000000000',
    xls: data.xls || 0,
    unknowhour: data.unknowhour || 0,
  }
  // router.replace({
  //     path: '/paipan-result/index',
  //     query: json,
  // })
  const routeData = router.resolve({
      path: '/paipan-result/index',
      query: json,
    })
  //let pre = location.href.split('#')[0]
  window.open(routeData.href, '_self')
  // console.log("即将跳转的排盘数据：",location.href, pre + routeData.href);
  
  // route.query.dz = dz
  // route.query.guid = data.guid
  // route.query.location = data.address
  // route.query.lunarArr = JSON.stringify(data.lunarArr)
  // route.query.name = data.username
  // route.query.sex = data.sex
  // route.query.solarTime = data.birthday.split(/[-\s:]/);
  // route.query.sunTime = data.sunTime.split(/[-\s:]/);
  // route.query.tg = tg
  // route.query.typeId = data.typeId
  // route.query.xls = data.xls
  // console.log("路由信息：",route.query)
  location.reload()
}
onBeforeMount(() => {
  console.log('infoData', props.infoData)
  timeInfo.value = {
      guid: props.infoData.caseGuid || '',
      type: props.infoData.type || 0,
      username: props.infoData.name,
      sex: props.infoData.sex,
      birthday: getDateTimeStr(props.infoData.solarTime),
      lunarArr: JSON.parse(props.infoData.lunarArr),
      sunTime: getDateTimeStr(props.infoData.sunTime),
      address: props.infoData.address,
      unknowhour: props.infoData.unknowhour || 0, // 是否为未知时间 0:否 1:是
      typeId: props.infoData.typeId,
      xls: props.infoData.xls,
  }
  console.log('timeInfo', timeInfo.value)
})
const onEdit = (status) => {
  console.log('isEdit', status)
  isEdit.value = Boolean(status)
}
const onTms = () => {
  emits('onTms')
}
// 案例名字体大小
const usernameSize = ref(18)
const username = ref(props.infoData.name)
if (username.value.length <= 3) {
  usernameSize.value = 30
} else if (username.value.length <= 5) {
  usernameSize.value = 25
} else if (username.value.length > 6) {
  username.value = username.value.slice(0, 6) + '...'
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 105px !important;
  border-radius: 15px 15px 0 0;
  background-size: 100% 100%;

  .tms {
    position: absolute;
    right: 135px;
    display: flex;
    align-items: center;

    .tms_icon {
      width: 46px;
    }

    .tms_text {
      font-size: 15px;
      color: white;
      text-align: center;
      margin-left: 10px;
    }
  }

  .edit{
    position: absolute;
    right: 28px;
    width: 86px;
  }

  // .edit {
  //   position: absolute;
  //   right: 28px;
  //   font-size: 16px;
  //   line-height: 20px;
  //   border-radius: 30px;
  //   text-align: center;
  //   color: #B2955D;
  //   border: 1px solid rgba(178, 149, 93, 1);
  //   padding: 8px 24px;
  // }

  .header-username {
    color: $mainColor;
    white-space: nowrap;
    font-weight: bold;
    margin-right: 55px;
  }
  .header-avatar {
    // position: absolute;
    margin-left: 43px;
    margin-right: 13px;
    top: 30px;
    left: 61px;
    width: 50px;
  }
  .header-calendar {
    //position: absolute;
    top: 29px;
    left: 215px;
    color: white;
    .header-calendar-text {
      line-height: 23px;
      font-size: 16px;
      text-align: left;
      &:first-child {
        margin-bottom: 7px;
      }
    }
  }
}

.icon_close{
  display: flex;
  width: 100%;
  padding-top: 17px;
  justify-content: flex-end;
  & > img{
    width: 14px;
    margin-right: 17px;
    cursor: pointer;
  }
}

:deep(.datetime_wrapper){
  left: calc(50% - 195px);
}

:deep(.datetime_wrapper){
  left: calc(50% - 195px);
}

.form_wrapper{
  padding-top: 30px ;
}
</style>
