<template>
  <div class="ganzhi_tab02_wrapper">
    <table class="ganzhi_wrapper">
      <tr class="ganzhi_row">
        <td
          class="ganzhi_row_ss"
          v-for="(item, index) in ganSSArr"
          :key="index"
        >
          {{ index === 2 ? '日主' : item }}
        </td>
      </tr>
      <tr class="ganzhi_row" v-for="(row, rowIndex) in list" :key="rowIndex">
        <template v-if="rowIndex === 1">
          <td v-for="(item, index) in row" :key="index">
            <img
              v-if="item"
              class="ganzhi_img_verti"
              :src="item"
              alt=""
              @dragstart.prevent
            />
            <div v-else class="ganzhi_img_verti"></div>
          </td>
        </template>
        <template v-else>
          <td
            :class="[index % 2 === 0 ? getClassOfGZ(item) : '']"
            v-for="(item, index) in row"
            :key="index"
          >
            <template v-if="index % 2 === 0">{{ item }}</template>
            <img
              v-else-if="item"
              class="ganzhi_img_hori"
              :src="item"
              alt=""
              @dragstart.prevent
            />
            <div v-else class="ganzhi_img_hori"></div>
          </td>
        </template>
      </tr>
      <tr class="ganzhi_row">
        <td
          class="ganzhi_row_ss"
          v-for="(item, index) in zhiSSArr"
          :key="index"
        >
          {{ item }}
        </td>
      </tr>
      <tr class="ganzhi_row">
        <td
          class="ganzhi_row_btm"
          :style="{ color: item ? '' : 'white' }"
          v-for="(item, index) in bottomArr"
          :key="index"
          @click.stop="onBottomItem(item)"
        >
          {{ item || '占位' }}
        </td>
      </tr>
    </table>
    <img class="ganzhi_img" :src="img" alt="" @dragstart.prevent />

    <!-- <DetailDialog
      v-if="keyName"
      keyType="liutong"
      :keyName="keyName"
      @closeDialog="onCloseDialog"
    /> -->
  </div>
</template>

<script>
// import DetailDialog from '@/components/paipan/components/detail-dialog.vue'
import { getClassOfGZ } from '@/utils'

const imgObj = {}

export default {
  // components: { DetailDialog },
  props: {
    gztipsGanArr: {
      type: Array,
      default: () => [],
    },
    gztipsZhiArr: {
      type: Array,
      default: () => [],
    },
    liutongArr: {
      type: Array,
      default: () => [],
    },
    ganSSArr: {
      type: Array,
      default: () => [],
    },
    zhiSSArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      list: [],
      liutongImgArr: [],
      bottomArr: ['', '', '', ''],
      keyName: '',
      img: '',
    }
  },
  created() {
    this.img = require('@/assets/images/ganzhi/gzr_lt_tips.png')
    imgObj['gzr_lth'] = require('@/assets/images/ganzhi/gzr_lth.png')
    imgObj['gzr_lts'] = require('@/assets/images/ganzhi/gzr_lts.png')
    imgObj['lt_ch'] = require('@/assets/images/ganzhi/lt_ch.png')
    imgObj['lt_cs'] = require('@/assets/images/ganzhi/lt_cs.png')
    imgObj['lt_h'] = require('@/assets/images/ganzhi/lt_h.png')
    imgObj['lt_kh'] = require('@/assets/images/ganzhi/lt_kh.png')
    imgObj['lt_ks'] = require('@/assets/images/ganzhi/lt_ks.png')
    imgObj['lt_ss'] = require('@/assets/images/ganzhi/lt_ss.png')
    imgObj['lt_sx'] = require('@/assets/images/ganzhi/lt_sx.png')
    imgObj['lt_sy'] = require('@/assets/images/ganzhi/lt_sy.png')
    imgObj['lt_sz'] = require('@/assets/images/ganzhi/lt_sz.png')
    imgObj['lt_xh'] = require('@/assets/images/ganzhi/lt_xh.png')
    imgObj['lt_xs'] = require('@/assets/images/ganzhi/lt_xs.png')
    imgObj['lt_zh'] = require('@/assets/images/ganzhi/lt_zh.png')
    imgObj['lt_zs'] = require('@/assets/images/ganzhi/lt_zs.png')
  },
  watch: {
    liutongArr() {
      this.initData()
    },
  },
  methods: {
    initData() {
      if (this.gztipsGanArr.length < 4 || this.liutongArr.length < 10) return
      if (this.liutongImgArr.length === 0) {
        this.liutongImgArr = this.liutongArr.map((item) =>
          item == 0 ? '' : imgObj[item],
        )
      }
      this.list = [
        [
          this.gztipsGanArr[0],
          this.liutongImgArr[0],
          this.gztipsGanArr[1],
          this.liutongImgArr[1],
          this.gztipsGanArr[2],
          this.liutongImgArr[2],
          this.gztipsGanArr[3],
        ],
        this.liutongImgArr.slice(3, 7),
        [
          this.gztipsZhiArr[0],
          this.liutongImgArr[7],
          this.gztipsZhiArr[1],
          this.liutongImgArr[8],
          this.gztipsZhiArr[2],
          this.liutongImgArr[9],
          this.gztipsZhiArr[3],
        ],
      ]

      this.gztipsGanArr.forEach((gan, index) => {
        const gz = gan + this.gztipsZhiArr[index]
        if (
          /(甲辰)|(甲戌)|(乙丑)|(乙未)|(丙申)|(丁酉)|(戊子)|(己亥)|(庚寅)|(辛卯)|(壬午)|(癸巳)/.test(
            gz,
          )
        ) {
          this.bottomArr[index] = '盖头'
        } else if (
          /(甲申)|(乙酉)|(丙子)|(丁亥)|(戊寅)|(己卯)|(庚午)|(辛巳)|(壬辰)|(癸丑)|(癸未)|(壬戌)/.test(
            gz,
          )
        ) {
          this.bottomArr[index] = '截脚'
        }
      })
    },
    onBottomItem(item) {
      if (item) {
        this.keyName = item
      }
    },
    onCloseDialog() {
      this.keyName = ''
    },
    getClassOfGZ(val) {
      return getClassOfGZ(val)
    },
  },
}
</script>

<style scoped lang="scss">
.ganzhi_tab02_wrapper {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 356px;
  overflow: hidden;

  .ganzhi_wrapper {
    box-sizing: border-box;
    margin: 0 auto;
    font-size: 25px;

    .ganzhi_row {
      display: flex;
      justify-content: space-between;

      td {
        display: flex;
        align-items: center;
        line-height: 30px;
      }

      .ganzhi_row_ss {
        color: #a1a1a1;
        font-size: 14px;
      }

      .ganzhi_row_btm {
        margin: 12px 0;
        color: $themeColor;
        font-size: 14px;
      }
    }

    .ganzhi_img_verti {
      // width: 21px;
      height: 97px;
      margin: 6px 0px;
    }

    .ganzhi_img_hori {
      width: 97px;
      // height: 21px;
      margin: 0 6px;
    }
  }

  .ganzhi_img {
    width: 280px;
    height: 57px;
    float: left;
  }
}

// /deep/.detail-dialog-box {
//   left: 375px !important;
//   width: 375px;
// }
</style>
