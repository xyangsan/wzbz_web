<template>
  <div
    v-show="showAddress"
    class="wzbz_container"
    @click.stop="onClose"
    @wheel.prevent.stop
  >
    <div class="box">
      <div
        class="datetime_wrapper"
        @click.stop="void 0"
        id="datetime_box"
        :style="[dynamicBox]"
      >
        <div class="datetime_header">
          <div class="datetime_header_cancel" @click.stop="onClose">
            <img src="@/assets/images/icon_close.png" />
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
          <!-- <div class="datetime_header_confirm" @click.stop="onConfirm">确定</div> -->
        </div>
        <div class="datetime_search">
          <!-- <van-field
          class="datetime_search_input"
          :border="false"
          type="text"
          v-model="searchVal"
          left-icon="search"
          placeholder="搜索全国城市及地区"
          :clearable="true"
          @focus.stop="onFocus"
          @input="onSearch"
        /> -->
          <img
            class="icon_search"
            :src="require('@/assets/images/icon_search.png')"
          />
          <input
            class="datetime_search_input"
            :border="false"
            type="text"
            v-model="searchVal"
            left-icon="search"
            placeholder="搜索全国城市及地区"
            :clearable="true"
            @focus.stop="onFocus"
            @input="onSearch"
          />
          <template v-if="showSearchPopover">
            <div
              class="datetime_search_cancel"
              @click.stop="onCloseSearchPopover"
            >
              取消
            </div>
            <div
              v-if="showSearchPopover"
              class="datetime_search_popover"
              @wheel.stop
            >
              <div
                class="datetime_search_popover_item"
                v-html="item.htmlText"
                v-for="(item, index) in searchArr"
                :key="index"
                @click.stop="onSelectSearch(item)"
              ></div>
            </div>
          </template>
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
          >
            <van-picker
              :show-toolbar="false"
              :columns="AllCitys"
              default
              ref="domesticRef"
              :allow-html="false"
              :item-height="pickerItemHeight"
              visible-item-count="4.5"
              @wheel.prevent.stop="onPickerWheel($event, 'domesticRef')"
            />
          </div>
          <div
            class="picker_wrapper"
            :class="{ removeOffSreen: tabIndex !== 1 }"
          >
            <van-picker
              :show-toolbar="false"
              :columns="overseasCitys"
              default
              ref="overseasRef"
              :allow-html="false"
              :item-height="pickerItemHeight"
              visible-item-count="4.5"
              @wheel.prevent.stop="onPickerWheel($event, 'overseasRef')"
            />
          </div>
        </div>
        <div class="datetime_setting">
          <template v-if="tabIndex === 1">
            <!-- <div style="display: flex; align-items: center">
              <img class="datetime_setting_icon-warning" :src="warningIcon" /> -->
              <!-- <span style="color: #525252; font-size: 12px; font-weight: normal">
              目前仅支持北半球国家
            </span> -->
            <!-- </div> -->
            <div class="datetime_setting_switch">
              <span class="text_title">换算北京时间</span>
              <span class="text_tip">(默认关闭)</span>
              <el-switch
                v-model="isBJTime"
                active-color="#b2955d"
                color="#b2955d"
              />
            </div>
            <!-- <img
            class="datetime_setting_icon-setting"
            :src="settingIcon"
            @click.stop="onSetting"
          /> -->
          </template>
        </div>
        <!-- <img
          class="datetime_confirm"
          :src="confirmIcon"
          @click.stop="onConfirm"
        /> -->
        <span class="datetime_confirm" @click.stop="onConfirm">确定</span>

        <div
          v-if="tabIndex === 1"
          style="
            color: #525252;
            font-size: 12px;
            font-weight: normal;
            margin-top: 10px;
          "
        >
          目前仅支持北半球国家
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AllCitys, overseasCitys } from './static.js'
import { debounce } from '@/utils'

const tabArr = [
  {
    id: 0,
    name: '国内',
  },
  {
    id: 1,
    name: '海外',
  },
]
const headerArr = ['省份', '城市', '区县'],
  headerArr2 = ['国家', '地区']

export default {
  props: {
    showAddress: {
      type: Boolean,
      default: true,
    },
    tabIndex: {
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
      showSearchPopover: false,
      searchArr: [],
      pickerItemHeight: 48,
      curData: {},

      // 国内
      AllCitys,

      // 海外
      overseasCitys: [],

      warningIcon: '',
      settingIcon: '',
      confirmIcon: '',

      isBJTime: false,
      boxHeight: 0,
      dynamicBox:{}
    }
  },
  created() {
    // this.warningIcon = require('@/assets/images/icon_warning2.png')
    // this.settingIcon = require('@/assets/images/setting.png')
    this.confirmIcon = require('@/assets/images/btn_confirm.png')

    this.initData()

    this.onSearch = debounce(this.handleSearch, 500)
  },
  mounted() {
    this.togglePageScrollLock(this.showAddress)

    const indexes = []
    if (this.tabIndex === 0) {
      indexes[0] = this.AllCitys.findIndex(
        (_city) =>
          _city.text.indexOf(this.addressData[0]) >= 0 ||
          this.addressData[0].indexOf(_city.text) >= 0,
      )
      if (indexes[0] > -1) {
        indexes[1] = this.AllCitys[indexes[0]].children.findIndex(
          (_city) =>
            _city.text.indexOf(this.addressData[1]) >= 0 ||
            this.addressData[1].indexOf(_city.text) >= 0,
        )
        if (indexes[1] > -1) {
          indexes[2] = this.AllCitys[indexes[0]].children[
            indexes[1]
          ].children.findIndex(
            (_city) =>
              _city.text.indexOf(this.addressData[2]) >= 0 ||
              this.addressData[2].indexOf(_city.text) >= 0,
          )
        }
      }
      if (indexes.length === 3 && indexes[2] > -1) {
        this.$refs.domesticRef.setIndexes(indexes)
      }
    } else {
      indexes[0] = this.overseasCitys.findIndex(
        (_city) =>
          _city.text.indexOf(this.addressData[0]) >= 0 ||
          this.addressData[0].indexOf(_city.text) >= 0,
      )
      if (indexes[0] > -1) {
        indexes[1] = this.overseasCitys[indexes[0]].children.findIndex(
          (_city) =>
            _city.text.indexOf(this.addressData[1]) >= 0 ||
            this.addressData[1].indexOf(_city.text) >= 0,
        )
      }
      if (indexes.length === 2 && indexes[1] > -1) {
        this.$refs.overseasRef.setIndexes(indexes)
      }
    }
    // this.onConfirm()
    this.boxHeight = document.getElementById('datetime_box').offsetHeight
    console.log(document.getElementById('datetime_box').offsetHeight)
    window.addEventListener('resize', () => {
      console.log(
        "document.getElementById('datetime_box').offsetHeight)",
        document.getElementById('datetime_box').offsetHeight,
      )

      // this.boxHeight = document.getElementById('datetime_box').offsetHeight
    })
  },
  beforeUnmount() {
    this.togglePageScrollLock(false)
  },
  watch: {
    showAddress(value) {
      this.togglePageScrollLock(value)
    },
  },
  computed: {
    headerArr() {
      return this.tabIndex === 0 ? headerArr : headerArr2
    },
  },
  methods: {
    togglePageScrollLock(lock) {
      if (typeof document === 'undefined') return
      document.body.classList.toggle('wzbz-picker-scroll-lock', lock)
    },
    initData() {
      this.overseasCitys = overseasCitys.map((item) => {
        const data = {
          name: item.text,
          text: `${item.text}GMT${item.zone < 0 ? '' : '+'}${item.zone}`,
          children: item.children,
        }
        return data
      })
    },
    onClose() {
      this.onCloseSearchPopover()
      this.$emit('close')
    },
    onTab(id) {
      this.onCloseSearchPopover()
      this.$emit('tab', id)
    },
    onFocus() {
      this.showSearchPopover = true
      this.handleSearch()
    },
    handleSearch() {
      const searchArr = []
      if (this.searchVal.length === 0) {
        this.searchArr = searchArr
        return
      }
      if (this.tabIndex === 0) {
        this.AllCitys.forEach((child1, index1) => {
          if (
            this.searchVal.indexOf(child1.text) > -1 ||
            child1.text.indexOf(this.searchVal) > -1
          ) {
            child1.children.forEach((child2, index2) => {
              child2.children.forEach((child3, index3) => {
                searchArr.push({
                  id: child3.id,
                  text: `${child1.text} - ${child2.text} - ${child3.text}`,
                  gisGcj02Lat: child3.gisGcj02Lat,
                  gisGcj02Lng: child3.gisGcj02Lng,
                  indexes: [index1, index2, index3],
                })
              })
            })
            return
          }
          child1.children.forEach((child2, index2) => {
            if (
              this.searchVal.indexOf(child2.text) > -1 ||
              child2.text.indexOf(this.searchVal) > -1
            ) {
              child2.children.forEach((child3, index3) => {
                searchArr.push({
                  id: child3.id,
                  text: `${child1.text} - ${child2.text} - ${child3.text}`,
                  gisGcj02Lat: child3.gisGcj02Lat,
                  gisGcj02Lng: child3.gisGcj02Lng,
                  indexes: [index1, index2, index3],
                })
              })
              return
            }
            child2.children.forEach((child3, index3) => {
              if (
                this.searchVal.indexOf(child3.text) > -1 ||
                child3.text.indexOf(this.searchVal) > -1
              ) {
                searchArr.push({
                  id: child3.id,
                  text: `${child1.text} - ${child2.text} - ${child3.text}`,
                  gisGcj02Lat: child3.gisGcj02Lat,
                  gisGcj02Lng: child3.gisGcj02Lng,
                  indexes: [index1, index2, index3],
                })
              }
            })
          })
        })
      } else {
        this.overseasCitys.forEach((child1, index1) => {
          if (
            this.searchVal.indexOf(child1.name) > -1 ||
            child1.name.indexOf(this.searchVal) > -1
          ) {
            child1.children.forEach((child2, index2) => {
              searchArr.push({
                text: `${child1.text} - ${child2.text}`,
                zone: child2.zone,
                lng: child2.lng,
                indexes: [index1, index2],
              })
            })
            return
          }
          child1.children.forEach((child2, index2) => {
            if (
              this.searchVal.indexOf(child2.text) > -1 ||
              child2.text.indexOf(this.searchVal) > -1
            ) {
              searchArr.push({
                text: `${child1.text} - ${child2.text}`,
                zone: child2.zone,
                lng: child2.lng,
                indexes: [index1, index2],
              })
            }
          })
        })
      }
      if (searchArr.length === 0) {
        searchArr.push({ text: '未找到相关地区', disabled: true })
      }
      searchArr.forEach((item) => {
        item.htmlText = item.text.replace(
          new RegExp(this.searchVal, 'g'),
          `<span style="color: #b2955d">${this.searchVal}</span>`,
        )
      })
      this.searchArr = searchArr
    },
    onSelectSearch(res) {
      if (res.disabled) return
      this.searchVal = res.text
      this.curData = res
      this.$refs[
        this.tabIndex === 0 ? 'domesticRef' : 'overseasRef'
      ].setIndexes(res.indexes)
      this.onCloseSearchPopover()
    },
    onCloseSearchPopover() {
      this.showSearchPopover = false
    },
    onConfirm() {
      switch (this.tabIndex) {
        case 0:
          this.handleConfirmDomestic()
          break
        case 1:
          this.handleConfirmOverseas()
          break
      }
      this.onClose()
    },
    onSolarTimeChange() {
      this.isBJTime = !this.isBJTime
    },
    // 确认选中国内
    handleConfirmDomestic() {
      const getColumnValue = this.$refs.domesticRef.getColumnValue
      const dataArr = [getColumnValue(0), getColumnValue(1), getColumnValue(2)]
      console.log('dataArr', dataArr)
      this.$emit('confirm', this.tabIndex, dataArr)
    },
    // 确认选中海外
    handleConfirmOverseas() {
      const getColumnValue = this.$refs.overseasRef.getColumnValue
      const dataArr = [getColumnValue(0), getColumnValue(1)]
      console.log('dataArr', dataArr)

      //this.$store.commit('setting/setIsBJTime', this.isBJTime)

      this.$emit('confirm', this.tabIndex, dataArr)
    },
    onSetting() {
      this.$router.push('/main/settingbjtime')
    },
    onPickerWheel(event, pickerRef) {
      event.preventDefault()
      event.stopPropagation()

      const picker = this.$refs[pickerRef]
      if (!picker || !event.deltaY) return

      const target = event.target && event.target.closest ? event.target : null
      const columnEl = target ? target.closest('.van-picker-column') : null
      const pickerEl = picker.$el || event.currentTarget
      const columns = Array.from(pickerEl.querySelectorAll('.van-picker-column'))
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
    },
  },
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

  .box {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: relative;
  }
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
    height: 53px;

    .datetime_header_cancel {
      position: absolute;
      right: 0;
      padding: 6px;

      & > img {
        width: 16px;
      }
    }

    .datetime_header_tabs {
      box-sizing: border-box;
      display: flex;
      color: #444;
      font-size: 13px;
      border-radius: 25px;
      border: 1px solid rgba(221, 221, 221, 1);
    }

    .datetime_header_tab {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 87px;
      height: 29px;
    }

    .datetime_header_tab-selected {
      color: white;
      border-radius: 25px;
      background-color: #b2955d;
    }

    .datetime_header_confirm {
      position: absolute;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 53px;
      height: 29px;
      color: $textColor;
      font-size: 13px;
      border-radius: 25px;
      background-color: black;
    }
  }

  .datetime_search {
    position: relative;
    display: flex;
    align-items: center;

    .icon_search {
      position: absolute;
      left: 10px;
      width: 16px;
      height: 16px;
      z-index: 99;
    }

    .datetime_search_input {
      box-sizing: border-box;
      flex: 1;
      display: flex;
      align-items: center;
      height: 36px;
      padding: 0 10px;
      padding-left: 30px;
      font-size: 14px;
      border-radius: 50px;
      border: 1px solid rgba(187, 187, 187, 0.5);

      :deep(.van-field__control::-webkit-input-placeholder) {
        color: #9e9e9e;
        font-size: 13px;
      }
    }

    .datetime_search_cancel {
      display: flex;
      align-items: center;
      margin: auto;
      padding: 8px 0 8px 10px;
      white-space: nowrap;
    }

    .datetime_search_popover {
      box-sizing: border-box;
      position: absolute;
      top: 50px;
      left: -17px;
      width: 375px;
      height: 250px;
      padding: 0 17px;
      font-size: 17px;
      background-color: white;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      z-index: 9;

      .datetime_search_popover_item {
        display: flex;
        align-items: center;
        height: 40px;
      }
    }
  }

  .datetime_picker {
    display: flex;
    flex-direction: column;
    width: 339px;
    margin-top: 13px;

    .picker_wrapper {
      height: 210px;
      overscroll-behavior: contain;
    }

    .datetime_picker_header {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 40px;
      font-size: 14px;
      border-top: 1px solid rgba(233, 233, 233, 0.5);
    }
  }

  .datetime_setting {
    box-sizing: border-box;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    //height: 30px;
    padding-top: 10px;
    color: #cccccc;
    font-size: 10px;
    font-weight: bold;
    margin-bottom: 6px;
    background: linear-gradient(
      to top,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0.7)
    );
    z-index: 1;

    .datetime_setting_icon-warning {
      width: 12px;
      height: 12px;
      margin-right: 3px;
    }

    .datetime_setting_icon-setting {
      width: 20px;
      height: 20px;
      padding: 3px 0 3px 10px;
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

.removeOffSreen {
  position: fixed;
  left: 300vw;
  top: 300vh;
  transform: translateX(300vw) translateY(300vh);
}

:deep(.van-icon-search) {
  color: #9e9e9e;
  font-size: 16px !important;
}

:deep(.van-picker-column__item) {
  font-size: 14px !important;
}

:deep(.van-picker-column__item--selected) {
  // padding: 7px 0;
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
    height: calc(100% / 7 + 14px);
    border-radius: 5px;
    background-color: rgba(245, 245, 245, 1);
  }
}

.datetime_setting_switch {
  display: flex;
  flex: 1;
  // flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  // margin-bottom: 40px;

  .text_title {
    color: black;
    font-size: 14px;
    text-align: left;
    margin-right: 5px;
  }

  .text_tip {
    color: #797979;
    font-size: 10px;
    text-align: right;
    margin-right: 12px;
  }
}
</style>
