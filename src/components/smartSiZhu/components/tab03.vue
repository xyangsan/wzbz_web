<template>
  <div class="ganzhi_tab03_wrapper">
    <div class="ganzhi_tab03_wrapper_left">
      <table class="ganzhi_wrapper">
        <tr class="ganzhi_row">
          <td
            class="ganzhi_row_gong"
            v-for="(arr, index) in gongArr"
            :key="index"
          >
            <span v-for="item in arr" :key="item">{{ item }}</span>
          </td>
        </tr>
        <tr class="ganzhi_row">
          <td
            class="ganzhi_row_title"
            v-for="(item, index) in titleArr"
            :key="index"
          >
            {{ item }}
          </td>
        </tr>
        <tr class="ganzhi_row">
          <td
            class="ganzhi_row_gz"
            :class="[getClassOfGZ(item)]"
            v-for="(item, index) in gztipsGanArr"
            :key="index"
          >
            {{ item }}
          </td>
        </tr>
        <tr class="ganzhi_row">
          <td
            class="ganzhi_row_gz"
            :class="[getClassOfGZ(item)]"
            v-for="(item, index) in gztipsZhiArr"
            :key="index"
          >
            {{ item }}
          </td>
        </tr>
      </table>
    </div>
    <div class="ganzhi_tab03_wrapper_right">
      <div class="ganzhi_img_wrapper">
        <img class="ganzhi_img" :src="img" alt="" @dragstart.prevent />
      </div>
    </div>
  </div>
</template>

<script>
import { getClassOfGZ } from '@/utils'

const gongArr = [
    ['祖辈宫'],
    ['事业宫', '父母宫', '兄弟宫'],
    ['夫妻宫'],
    ['子女宫'],
  ],
  titleArr = ['年柱', '月柱', '日柱', '时柱']

export default {
  props: {
    gztipsGanArr: {
      type: Array,
      default: () => [],
    },
    gztipsZhiArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      gongArr,
      titleArr,
      img: '',
    }
  },
  created() {
    this.img = require('@/assets/images/ganzhi/bzr_lx.png')
  },
  methods: {
    getClassOfGZ(val) {
      return getClassOfGZ(val)
    },
  },
}
</script>

<style scoped lang="scss">
.ganzhi_tab03_wrapper {
  box-sizing: border-box;
  height: 750px;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  flex-direction: column;

  .ganzhi_tab03_wrapper_left,
  .ganzhi_tab03_wrapper_right {
    width: 50%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .ganzhi_tab03_wrapper_right {
    // border-right: 1px solid #e5e5e5;
    margin-top: 10px;
  }

  .ganzhi_wrapper {
    width: 100%;
    margin: 20px auto 0;
    font-size: 25px;

    .ganzhi_row {
      display: flex;
      justify-content: space-evenly;

      td {
        width: 50px;
      }

      .ganzhi_row_gong {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        line-height: 30px;
        color: #101010;
        font-size: 15px;
        // font-weight: bold;
      }

      .ganzhi_row_title {
        padding-bottom: 12px;
        color: #a1a1a1;
        font-size: 14px;
      }

      .ganzhi_row_gz {
        padding-bottom: 12px;
      }
    }
  }

  .ganzhi_img_wrapper {
    // height: 100%;
    width: 100%;
    // overflow-y: auto;
    box-sizing: border-box;
    padding: 0 30px;
    // 禁用拖拽
    user-select: none;

    .ganzhi_img {
      width: 100%;
      // height: 478.4px;
    }
  }
}
</style>
