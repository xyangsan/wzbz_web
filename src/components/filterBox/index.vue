<template>
  <PopupBox
    :width="1229"
    :height="838"
    :borderRadius="10"
    v-if="props.show"
    @onFullClick="onClose"
  >
    <div class="filter-box">
      <div class="filter-box-title-bar">
        <div
          :class="[
            'filter-box-title',
            'pointer',
            selectedIndex === index ? 'filter-box-title-active' : '',
          ]"
          v-for="(item, index) in props.titles"
          :key="index"
          @click="switchTab(index)"
        >
          {{ item }}
          <img
            class="filter-box-title-icon"
            :src="vipLogo"
            alt="vip图标"
            v-if="item === '笔记'"
          />
        </div>
      </div>
      <div class="filter-box-content" v-if="selectedIndex === 0">
        <div class="filter-box-content-up">
          <div class="filter-box-content-row">
            <div class="filter-box-content-row-title">出生信息</div>
            <div
              class="filter-box-content-row-contents"
              style="
                justify-content: space-between;
                align-items: flex-end;
                flex-wrap: nowrap;
                margin-top: -28px;
              "
            >
              <div class="filter-box-content-row-content">
                <div class="filter-box-content-row-content-title">性别</div>
                <div class="filter-box-content-row-content-items">
                  <div
                    :class="[
                      'filter-box-content-row-content-item',
                      'pointer',
                      index === sexIndex
                        ? 'filter-box-content-row-content-item-active'
                        : '',
                    ]"
                    v-for="(item, index) in ['男', '女']"
                    :key="index"
                    @click="switchRecordData('sex', { index })"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
              <div class="filter-box-content-row-content" @click="openAddress">
                <div class="filter-box-content-row-content-title">出生地区</div>
                <div class="filter-box-content-row-content-items">
                  <div
                    :class="[
                      'filter-box-content-row-content-item',
                      'pointer',
                      addressData[2] === ''
                        ? ''
                        : 'filter-box-content-row-content-item-active',
                    ]"
                    style="
                      width: 195px;
                      line-height: 1;
                      align-items: center;
                      display: flex;
                      justify-content: center;
                    "
                  >
                    {{
                      `${addressData[0]} ${addressData[1]} ${addressData[2]}`
                    }}
                  </div>
                </div>
              </div>
              <div class="filter-box-content-row-content">
                <div
                  class="filter-box-content-row-content-items"
                  style="position: relative"
                >
                  <div
                    class="filter-box-content-row-content-items-mask"
                    v-if="vipLevel <= 0"
                  >
                    <img
                      class="pointer"
                      :src="require('@/assets/images/filter_vip_button_02.png')"
                      alt="开通会员"
                      style="width: 200px"
                      @click="onVip"
                    />
                  </div>
                  <div
                    class="filter-box-content-row-content-item-special"
                    v-for="(item, index) in ['年', '月', '日', '时']"
                    :key="index"
                  >
                    <div class="filter-box-content-row-content-item-title">
                      {{ item }}柱
                    </div>
                    <div
                      :class="[
                        'filter-box-content-row-content-item',
                        'pointer',
                        row[index] === '-'
                          ? ''
                          : 'filter-box-content-row-content-item-active',
                      ]"
                      @click="openGZSelect(index, rIndex)"
                      v-for="(row, rIndex) in selectedSiZhu"
                      :key="rIndex"
                      style="margin-top: 5px"
                    >
                      {{ row[index] }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="filter-box-content-row-content">
                <div class="filter-box-content-row-content-title">
                  旺相休囚死
                </div>
                <div class="filter-box-content-row-content-items">
                  <div
                    class="filter-box-content-row-content-item-special"
                    v-for="(row, index) in selectedWWXQS"
                    :key="index"
                  >
                    <div
                      :class="[
                        'filter-box-content-row-content-item',
                        'pointer',
                        row === '-'
                          ? ''
                          : 'filter-box-content-row-content-item-active',
                      ]"
                      @click="openWXSelect(index)"
                      style="margin: 0px; margin-right: 5px"
                    >
                      {{ row }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="filter-box-content-down">
          <div class="filter-box-content-row">
            <div class="filter-box-content-row-title">原局干支关系</div>
            <div class="filter-box-content-row-contents">
              <div
                class="filter-box-content-row-content"
                v-for="(item, index) in YJGZGX"
                :key="index"
              >
                <div class="filter-box-content-row-content-title">
                  {{ item.title }}
                </div>
                <div class="filter-box-content-row-content-items">
                  <div
                    :class="[
                      'filter-box-content-row-content-item',
                      'pointer',
                      row.selected
                        ? 'filter-box-content-row-content-item-active'
                        : '',
                    ]"
                    v-for="(row, rIndex) in item.data"
                    :key="rIndex"
                    @click="switchRecordData('gz0', { index, rIndex })"
                  >
                    {{ row.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="filter-box-content-row" style="flex: unset">
            <div
              class="filter-box-content-row-title"
              style="margin-bottom: 0px"
            >
              四柱干支
            </div>
            <div class="filter-box-content-row-contents">
              <div class="filter-box-content-row-content" style="width: 100%">
                <div
                  class="filter-box-content-row-content-title"
                  style="
                    width: 100%;
                    display: flex;
                    border-bottom: 1px solid #f0f0f0;
                    min-height: 32px;
                    align-items: center;
                    overflow: hidden;
                    flex-shrink: 0;
                  "
                >
                  选项:
                  <div class="filter-box-content-row-content-title-options">
                    <div
                      class="filter-box-content-row-content-title-option pointer"
                      v-for="(item, index) in selectedGZArr"
                      :key="index"
                      @click="switchRecordData('gz2', { index, item })"
                    >
                      {{ item }}
                    </div>
                  </div>
                </div>
                <div
                  class="filter-box-content-row-content-items"
                  style="flex-wrap: wrap; width: 100%"
                  v-for="(item, index) in SZGZ"
                  :key="index"
                >
                  <div
                    class="filter-box-content-row-content-item pointer"
                    v-for="(row, rIndex) in item"
                    :key="rIndex"
                    style="
                      width: 35px;
                      height: 35px;
                      line-height: 35px;
                      padding: 0 !important;
                      margin-bottom: 5px;
                      min-width: unset !important;
                    "
                    @click="switchRecordData('gz1', { row })"
                  >
                    {{ row }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="filter-box-content"
        style="position: relative"
        v-if="selectedIndex === 1"
      >
        <div class="filter-box-content-down-mask" v-if="vipLevel <= 0">
          <img
            class="pointer"
            :src="require('@/assets/images/filter_vip_button_02.png')"
            alt="开通会员"
            style="width: 250px"
            @click="onVip"
          />
        </div>
        <div
          class="filter-box-content-down"
          :style="{
            'border-top': 'unset',
            'padding-bottom': '15px',
            filter: vipLevel > 0 ? 'unset' : 'blur(5px)',
          }"
        >
          <div class="filter-box-content-row">
            <div class="filter-box-content-row-contents">
              <div
                class="filter-box-content-row-content"
                v-for="(item, index) in noteData"
                :key="index"
                style="width: 100%"
              >
                <div class="filter-box-content-row-content-title">
                  {{ item.title }}
                </div>
                <div class="filter-box-content-row-content-items">
                  <div
                    :class="[
                      'filter-box-content-row-content-item',
                      'pointer',
                      row.selected
                        ? 'filter-box-content-row-content-item-active'
                        : '',
                    ]"
                    v-for="(row, rIndex) in item.data"
                    :key="rIndex"
                    @click="switchRecordData('note', { index, rIndex })"
                  >
                    {{ row.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="filter-box-footbar">
        <div
          :class="[
            'filter-box-footbar-button',
            'pointer',
            enableReset ? 'filter-box-footbar-button-active' : '',
          ]"
          @click="switchRecordData('reset', {})"
        >
          重置
        </div>
        <div
          :class="[
            'filter-box-footbar-button',
            'pointer',
            enableConfirm ? 'filter-box-footbar-button-active' : '',
          ]"
          @click="confirm"
        >
          确定
        </div>
      </div>
      <img
        class="filter-box-close pointer"
        :src="closeIcon"
        alt="关闭"
        @click="onClose"
      />
    </div>
    <PopupBox
      :width="390"
      :height="320"
      :borderRadius="10"
      v-if="showGZSelect"
      @onFullClick="closeGZSelect"
    >
      <div class="filter-box" style="padding: 25px">
        <div
          class="filter-box-content"
          style="border: unset; justify-content: space-between"
        >
          <div class="filter-box-content-up" style="padding: 0">
            <div class="filter-box-content-row">
              <div
                class="filter-box-content-row-title"
                style="margin-bottom: 10px"
              >
                请选择-{{ selectedGZIndex1 === 0 ? '天干' : '地支' }}
              </div>
              <div class="filter-box-content-row-contents">
                <div class="filter-box-content-row-content" style="width: 100%">
                  <div
                    class="filter-box-content-row-content-items"
                    :style="{
                      width: selectedGZIndex1 === 0 ? '80%' : '100%',
                      'flex-wrap': 'wrap',
                    }"
                  >
                    <div
                      class="filter-box-content-row-content-item pointer"
                      style="
                        width: 40px;
                        min-width: unset;
                        padding: 0;
                        margin-bottom: 5px;
                      "
                      v-for="(row, rIndex) in selectedGZ"
                      :key="rIndex"
                      @click="switchRecordData('sizhu', { row })"
                    >
                      {{ row }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style="width: 100%; height: 1px; background-color: #f0f0f0"
          ></div>
          <div
            class="filter-box-content-down"
            style="padding: 0; border-top: unset; flex: unset"
          >
            <div class="filter-box-content-row">
              <div
                class="filter-box-content-row-title"
                style="margin-bottom: 10px"
              >
                请选择-{{ selectedGZIndex1 === 0 ? '天干' : '地支' }}十神
              </div>
              <div class="filter-box-content-row-contents">
                <div class="filter-box-content-row-content" style="width: 100%">
                  <div
                    class="filter-box-content-row-content-items"
                    style="width: 100%; flex-wrap: wrap"
                  >
                    <div
                      class="filter-box-content-row-content-item pointer"
                      :style="{
                        padding: '0 !important',
                        'margin-bottom': '5px',
                        'min-width': 'unset !important',
                        width: rIndex === 5 ? '40px' : '54px',
                      }"
                      v-for="(row, rIndex) in shishenList"
                      :key="rIndex"
                      @click="switchRecordData('sizhu', { row })"
                    >
                      {{ row }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          class="filter-box-close pointer"
          :src="closeIcon"
          alt="关闭"
          @click="closeGZSelect"
          style="width: 14px; height: 14px; right: 15px; top: 15px"
        />
      </div>
    </PopupBox>
    <PopupBox
      :width="390"
      :height="120"
      :borderRadius="10"
      v-if="showWXSelect"
      @onFullClick="closeWXSelect"
    >
      <div class="filter-box" style="padding: 25px">
        <div
          class="filter-box-content"
          style="border: unset; justify-content: space-between"
        >
          <div class="filter-box-content-up" style="padding: 0">
            <div class="filter-box-content-row">
              <div
                class="filter-box-content-row-title"
                style="margin-bottom: 10px"
              >
                请选择-旺相休囚死
              </div>
              <div class="filter-box-content-row-contents">
                <div class="filter-box-content-row-content" style="width: 100%">
                  <div class="filter-box-content-row-content-items">
                    <div
                      class="filter-box-content-row-content-item pointer"
                      style="
                        width: 40px;
                        min-width: unset;
                        padding: 0;
                        margin-bottom: 5px;
                      "
                      v-for="(row, rIndex) in [
                        '金',
                        '木',
                        '水',
                        '火',
                        '土',
                        '-',
                      ]"
                      :key="rIndex"
                      @click="switchRecordData('wxxqs', { row })"
                    >
                      {{ row }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          class="filter-box-close pointer"
          :src="closeIcon"
          alt="关闭"
          @click="closeWXSelect"
          style="width: 14px; height: 14px; right: 15px; top: 15px"
        />
      </div>
    </PopupBox>
    <PopupBox
      :width="286"
      :height="144"
      :borderRadius="10"
      v-if="isShowNoLogin"
    >
      <div class="login-tip-box">
        <div class="login-tip-title">温馨提示</div>
        <div class="login-tip-content">登录才能使用筛选功能</div>
        <div class="login-tip-footbar">
          <div class="login-tip-button pointer" @click="onClose1">取消</div>
          <div class="login-tip-button pointer" @click="onLogin">登录</div>
        </div>
      </div>
    </PopupBox>
    <Address
      :showAddress="showAddress"
      :tabIndex="addressIndex"
      :addressData="addressData"
      @close="closeAddress"
      @tab="switchAddressTab"
      @confirm="getAddress"
    ></Address>
  </PopupBox>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch } from 'vue'
import PopupBox from '@/components/popupBox'
import Address from '@/components/time/address.vue'
import { TianGan, DiZhi } from '@/static'
import { noteDataDefault, yuanJuGanZhi, watchRecordDataDefault } from './utils'
import store from '@/store'
import { navigationTo } from '@/utils'

const selectedIndex = ref(0)
const showAddress = ref(false)
const vipLogo = require('@/assets/images/vipicon3.png')
const closeIcon = require('@/assets/images/icon_close.png')

const props = defineProps({
  titles: {
    type: Array,
    default: () => ['记录', '笔记'],
  },
  show: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['onClose', 'updateRecordData'])
const userguid = computed(() => store.getters.userguid)
const vipLevel = computed(() => store.getters.viplevel)
const isShowNoLogin = ref(false)
const showGZSelect = ref(false)
const showWXSelect = ref(false)
// 在TianGan的中间位置插入一个字符串"-"
const tgArr = TianGan.slice()
tgArr.splice(5, 0, '-')
const dzArr = DiZhi.slice()
dzArr.splice(6, 0, '-')
const selectedGZ = ref(tgArr)
const shishenList = [
  '比肩',
  '劫财',
  '食神',
  '伤官',
  '偏财',
  '-',
  '正财',
  '七杀',
  '正官',
  '偏印',
  '正印',
]
const wxxqsTable = [
  ['木', '火', '水', '金', '土'],
  ['火', '土', '木', '水', '金'],
  ['金', '水', '土', '火', '木'],
  ['水', '木', '金', '土', '火'],
  ['土', '金', '火', '木', '水'],
]
const selectedGZIndex0 = ref(0)
const selectedGZIndex1 = ref(0)
const selectedWXIndex = ref(0)
const addressData = ref(['', '-', ''])
const addressIndex = ref(0)
const sexIndex = ref(-1)
const YJGZGX = ref(yuanJuGanZhi)
const noteData = ref(noteDataDefault)
const SZGZ = ref([])
const selectedSiZhu = ref([
  ['-', '-', '-', '-'],
  ['-', '-', '-', '-'],
])
const selectedWWXQS = ref(['-', '-', '-', '-', '-'])
const selectedGZArr = ref([])
// 拼接天干地支
SZGZ.value[0] = TianGan
SZGZ.value[1] = DiZhi
const watchRecordData = ref(JSON.parse(JSON.stringify(watchRecordDataDefault)))
const oldWatchRecordData = ref(
  JSON.parse(JSON.stringify(watchRecordDataDefault)),
)
const selectedGZGXArr = ref([])
const enableReset = computed(() => {
  return (
    JSON.stringify(watchRecordData.value) !==
    JSON.stringify(watchRecordDataDefault)
  )
})
const enableConfirm = computed(() => {
  return (
    JSON.stringify(watchRecordData.value) !==
    JSON.stringify(oldWatchRecordData.value)
  )
})
watch(
  () => props.show,
  (val) => {
    document.getElementById('container-popup').style.zIndex = val
      ? '998'
      : '999'
    document.getElementById('record-box').style.zIndex = val ? 'unset' : '999'
  },
  // { immediate: true },
)
const initWatchRecordDataGZ = () => {
  let arr = []
  selectedGZGXArr.value.forEach((item) => {
    arr = arr.concat(
      YJGZGX.value[item[0]].data[item[1]].name.split('(')[0].split(''),
    )
  })
  watchRecordData.value.gz = arr
  watchRecordData.value.gz = watchRecordData.value.gz.concat(
    selectedGZArr.value,
  )
}
const switchTab = (index) => {
  selectedIndex.value = index
}
const onClose = () => {
  emits('onClose')
}
const onClose1 = () => {
  isShowNoLogin.value = false
}
const openGZSelect = (index, rIndex) => {
  if (userguid.value === '') {
    isShowNoLogin.value = true
    return
  }
  if (vipLevel.value <= 0) return
  if (rIndex === 0) {
    selectedGZ.value = tgArr
    if (selectedSiZhu.value[1][index] !== '-') {
      if (
        ['子', '寅', '辰', '午', '申', '戌'].includes(
          selectedSiZhu.value[1][index],
        )
      ) {
        selectedGZ.value = ['甲', '丙', '戊', '庚', '壬', '-']
      } else {
        selectedGZ.value = ['乙', '丁', '己', '辛', '癸', '-']
      }
    }
  } else {
    selectedGZ.value = dzArr
    if (selectedSiZhu.value[0][index] !== '-') {
      if (
        ['甲', '丙', '戊', '庚', '壬'].includes(selectedSiZhu.value[0][index])
      ) {
        selectedGZ.value = ['子', '寅', '辰', '午', '申', '戌', '-']
      } else {
        selectedGZ.value = ['丑', '卯', '巳', '未', '酉', '亥', '-']
      }
    }
  }
  selectedGZIndex0.value = index
  selectedGZIndex1.value = rIndex
  showGZSelect.value = true
}
const openWXSelect = (index) => {
  if (userguid.value === '') {
    isShowNoLogin.value = true
    return
  }
  console.log(index)
  selectedWXIndex.value = index
  showWXSelect.value = true
}
const closeGZSelect = () => {
  showGZSelect.value = false
}
const closeWXSelect = () => {
  showWXSelect.value = false
}
const openAddress = () => {
  if (userguid.value === '') {
    isShowNoLogin.value = true
    return
  }
  showAddress.value = true
}
const closeAddress = () => {
  showAddress.value = false
}
const switchAddressTab = (index) => {
  addressIndex.value = index
}
const getAddress = (index, data) => {
  // if (firstEnter.value) {
  //   firstEnter.value = false
  //   return
  // }
  addressIndex.value = index
  addressData.value = []
  data.forEach((element) => {
    addressData.value.push(element.text)
  })
  watchRecordData.value.address = addressData.value
  closeAddress()
}
const switchRecordData = (key, data) => {
  if (userguid.value === '') {
    isShowNoLogin.value = true
    return
  }
  if (key === 'sex') {
    if (sexIndex.value === data.index) {
      sexIndex.value = -1
      watchRecordData.value.sex = -1
    } else {
      sexIndex.value = data.index
      watchRecordData.value.sex = data.index === 0 ? 1 : 0
    }
  }
  if (key === 'gz0') {
    YJGZGX.value[data.index].data[data.rIndex].selected =
      !YJGZGX.value[data.index].data[data.rIndex].selected
    // 先检测是否已经存在，存在则删除，不存在则添加
    let isExist = false
    selectedGZGXArr.value.forEach((item) => {
      if (item[0] === data.index && item[1] === data.rIndex) {
        isExist = true
      }
    })
    if (isExist) {
      let index = -1
      selectedGZGXArr.value.forEach((item, i) => {
        if (item[0] === data.index && item[1] === data.rIndex) {
          index = i
        }
      })
      selectedGZGXArr.value.splice(index, 1)
    } else {
      selectedGZGXArr.value.push([data.index, data.rIndex])
    }
    initWatchRecordDataGZ()
  }
  if (key === 'gz1') {
    selectedGZArr.value.push(data.row)
    initWatchRecordDataGZ()
  }
  if (key === 'gz2') {
    selectedGZArr.value.splice(data.index, 1)
    initWatchRecordDataGZ()
  }
  if (key === 'sizhu') {
    selectedSiZhu.value[selectedGZIndex1.value][selectedGZIndex0.value] =
      data.row
    watchRecordData.value.sizhu = selectedSiZhu.value[0].concat(
      selectedSiZhu.value[1],
    )
    showGZSelect.value = false
  }
  if (key === 'wxxqs') {
    if (data.row === '-') {
      selectedWWXQS.value = ['-', '-', '-', '-', '-']
    } else {
      wxxqsTable.forEach((item) => {
        if (item[selectedWXIndex.value] === data.row) {
          selectedWWXQS.value = item
        }
      })
    }
    watchRecordData.value.wxxqs = selectedWWXQS.value
    showWXSelect.value = false
  }
  if (key === 'note') {
    noteData.value[data.index].data.forEach((item, index) => {
      if (data.rIndex !== index) {
        item.selected = false
      } else {
        item.selected = !item.selected
        if (item.selected) {
          watchRecordData.value[noteData.value[data.index].type] = item.name
        } else {
          watchRecordData.value[noteData.value[data.index].type] = ''
        }
      }
    })
  }
  if (key === 'reset') {
    if (!enableReset.value) return
    sexIndex.value = -1
    addressData.value = ['', '-', '']
    selectedSiZhu.value = [
      ['-', '-', '-', '-'],
      ['-', '-', '-', '-'],
    ]
    selectedWWXQS.value = ['-', '-', '-', '-', '-']
    selectedGZGXArr.value = []
    selectedGZArr.value = []
    YJGZGX.value.forEach((item) => {
      item.data.forEach((row) => {
        row.selected = false
      })
    })
    noteData.value.forEach((item) => {
      item.data.forEach((row) => {
        row.selected = false
      })
    })
    watchRecordData.value = JSON.parse(JSON.stringify(watchRecordDataDefault))
  }
}
const confirm = () => {
  if (userguid.value === '') {
    isShowNoLogin.value = true
    return
  }
  if (!enableConfirm.value) return
  oldWatchRecordData.value = JSON.parse(JSON.stringify(watchRecordData.value))
  emits('updateRecordData', watchRecordData.value)
}
const onLogin = () => {
  // 跳转登录
  navigationTo({ path: 'login' })
}
const onVip = () => {
  // 跳转会员页面
  navigationTo({ path: 'vip-page' })
}
</script>

<style lang="scss" scoped>
:deep(.popup-box) {
  padding: 0 !important;
  overflow: hidden;
}
* {
  box-sizing: border-box;
  flex-shrink: 0;
}
.filter-box {
  width: 100%;
  height: 100%;
  padding: 20px 30px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .filter-box-title-bar {
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;

    .filter-box-title {
      width: 120px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      font-size: 15px;
      color: #646464;
      position: relative;
      border: 1px solid #f0f0f0;

      &:first-child {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        border-right: unset;
      }
      &:last-child {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        border-left: unset;
      }

      .filter-box-title-icon {
        height: 36px;
        position: absolute;
        top: -5px;
        right: -12px;
        transform: rotate(90deg);
      }
    }

    .filter-box-title-active {
      color: $themeColor;
      background-color: rgba($color: #b2955d, $alpha: 0.08);
      font-weight: bold;
    }
  }

  .filter-box-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #f0f0f0;
    flex: 1;
    border-radius: 10px;

    .filter-box-content-up,
    .filter-box-content-down {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 20px 25px 15px;
      box-sizing: border-box;
      position: relative;
    }

    .filter-box-content-down {
      flex: 1;
      border-top: 1px solid #f0f0f0;
      padding: 20px 25px 50px;
      .filter-box-content-row {
        flex: 1;
      }
      .filter-box-content-row-title {
        margin-bottom: 10px;
      }
      .filter-box-content-row-contents {
        flex: 1;
        justify-content: flex-start !important;
      }
      .filter-box-content-row-content {
        &:first-child,
        &:nth-child(3),
        &:nth-child(6) {
          width: 32%;
        }

        &:nth-child(4),
        &:nth-child(7) {
          width: 39%;
        }

        // &:nth-child(3),
        // &:nth-child(5),
        // &:nth-child(7) {
        //   width: 43%;
        // }
        .filter-box-content-row-content-item {
          padding: 0 10px !important;
          min-width: 48px !important;
        }
      }
    }

    .filter-box-content-row {
      width: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;

      .filter-box-content-row-title {
        width: fit-content;
        font-size: 16px;
        font-weight: bold;
        color: #101010;
        margin-bottom: 10px;
      }

      .filter-box-content-row-contents {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .filter-box-content-row-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          align-items: flex-start;

          .filter-box-content-row-content-title {
            font-size: 14px;
            color: #101010;
            margin-bottom: 10px;
          }

          .filter-box-content-row-content-items {
            display: flex;

            .filter-box-content-row-content-item {
              height: 40px;
              line-height: 40px;
              text-align: center;
              font-size: 14px;
              color: #818181;
              padding: 0 13px;
              border-radius: 4px;
              background-color: #f5f5f7;
              margin-right: 5px;
              min-width: 54px;

              &:hover {
                color: $themeColor;
              }
            }

            .filter-box-content-row-content-item-special {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;

              .filter-box-content-row-content-item-title {
                font-size: 12px;
                color: #818181;
                margin-bottom: 2px;
              }

              .filter-box-content-row-content-item {
                // width: 70px;
                height: 35px;
                line-height: 35px;
                padding: 0;
                margin-right: 0;
                margin: 0 2.5px;
              }
            }
          }
        }
      }
    }

    .filter-box-content-row-content-item-active {
      color: white !important;
      background-color: $themeColor !important;
      font-weight: bold !important;
    }
  }

  .filter-box-footbar {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 25px;

    .filter-box-footbar-button {
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 15px;
      color: #3d3d3d;
      background-color: #f7f7f7;
      border-radius: 25px;
      margin: 0 5px;
      border: 1px solid #c7c7c7;

      &:hover {
        color: $themeColor;
      }
    }

    .filter-box-footbar-button-active {
      color: white;
      background-color: $themeColor;
      border: unset;

      &:hover {
        color: white;
      }
    }
  }

  .filter-box-close {
    position: absolute;
    top: 20px;
    right: 30px;
    width: 16px;
    height: 16px;
  }
}
:deep(.wzbz_container) {
  .box {
    overflow: hidden;
    .datetime_wrapper {
      top: 50%;
      left: 50%;
      bottom: unset;
      transform: translate(-50%, -50%);
      .datetime_picker {
        width: 100%;
      }
    }
  }
}
.filter-box-content-row-content-title-options {
  display: flex;
  align-items: center;

  .filter-box-content-row-content-title-option {
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    font-size: 14px;
    color: white;
    background-color: $themeColor;
    border-radius: 4px;
    margin-left: 5px;
  }
}
.login-tip-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .login-tip-title {
    height: 44px;
    width: 100%;
    line-height: 44px;
    text-align: center;
    background-color: #eee;
    color: #101010;
    font-size: 18px;
    font-weight: bold;
  }

  .login-tip-content {
    font-size: 14px;
    color: #101010;
  }

  .login-tip-footbar {
    width: 100%;
    display: flex;
    justify-content: center;
    border-top: 1px solid #e4e4e4;

    .login-tip-button {
      width: 50%;
      height: 44px;
      line-height: 44px;
      text-align: center;
      font-size: 15px;
      color: #8c8e96;
      border-right: 1px solid #e4e4e4;

      &:last-child {
        border-right: unset;
        color: $themeColor;
      }
    }
  }
}
.filter-box-content-down-mask {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.filter-box-content-row-content-items-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 75px;
  background-color: #f5f5f7;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
