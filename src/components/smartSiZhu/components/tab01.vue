<template>
  <div class="ganzhi_tab01_wrapper">
    <!-- 天干提示 -->
    <div class="tg_wrapper">
      <div style="width: 100%; height: 100%">
        <div
          v-for="(item, gzindex) in gzchat2[0]"
          :key="'gztips1_1_' + gzindex"
          class="gzchatitem"
        >
          <div
            class="gztipsline"
            :style="{
              'margin-left':
                (100 / gztipsTitleArr.length) * item[2] +
                100 / gztipsTitleArr.length / 2 +
                '%',
              width: (100 / gztipsTitleArr.length) * item[3] + '%',
            }"
          ></div>
          <div
            class="gzchatitem_relaction"
            :style="{
              'margin-left':
                (100 / gztipsTitleArr.length) * item[2] +
                100 / gztipsTitleArr.length / 2 +
                '%',
              width: (100 / gztipsTitleArr.length) * item[3] + '%',
            }"
          >
            {{ item[1] }}
          </div>
          <div
            v-for="(content, gzindex1) in item[0]"
            :key="'gztips1_2_' + gzindex1"
            class="gzchatitem_gz"
            :style="{
              'margin-left': `calc(${(100 / gztipsTitleArr.length) * content[0] + 100 / gztipsTitleArr.length / 2}% - 10px)`,
            }"
          >
            {{ content[1] }}
          </div>
        </div>
        <div id="toview1"></div>
      </div>
    </div>

    <!-- 年月日时柱 -->
    <div style="width: 100%">
      <div
        v-for="item in gztipsTitleArr"
        :key="item"
        :style="{
          float: 'left',
          width: 100 / gztipsTitleArr.length + '%',
          'text-align': 'center',
          padding: '10px 0',
        }"
      >
        <label style="color: #a1a1a1; font-weight: normal; font-size: 14px">
          {{ item }}
        </label>
      </div>
      <!-- 天干 -->
      <div
        class="gztips_mpgz_wrapper"
        v-for="(item, ganindex) in gztipsGanArr"
        :key="'gztips2_1_' + ganindex"
        :style="{ width: 100 / gztipsZhiArr.length + '%' }"
      >
        <label class="gztips_mpgz" :class="[getClassOfGZ(item)]">
          {{ item }}
        </label>
      </div>
      <!-- 地支 -->
      <div
        class="gztips_mpgz_wrapper"
        v-for="(item, ziindex) in gztipsZhiArr"
        :key="'gztips2_2_' + ziindex"
        :style="{ width: 100 / gztipsZhiArr.length + '%' }"
      >
        <label class="gztips_mpgz" :class="[getClassOfGZ(item)]">
          {{ item }}
        </label>
      </div>
    </div>

    <!-- 地支提示 -->
    <div class="dz_wrapper">
      <div id="toview2"></div>
      <div
        v-for="(item, gzindex) in gzchat2[1]"
        :key="'gztips3_1_' + gzindex"
        class="gzchatitem"
      >
        <div
          class="gztipsline"
          :style="{
            'margin-left':
              (100 / gztipsTitleArr.length) * item[2] +
              100 / gztipsTitleArr.length / 2 +
              '%',
            width: (100 / gztipsTitleArr.length) * item[3] + '%',
          }"
        ></div>
        <div
          class="gzchatitem_relaction"
          :style="{
            'margin-left':
              (100 / gztipsTitleArr.length) * item[2] +
              100 / gztipsTitleArr.length / 2 +
              '%',
            width: (100 / gztipsTitleArr.length) * item[3] + '%',
          }"
        >
          {{ item[1] }}
        </div>
        <div
          v-for="(content, gzindex1) in item[0]"
          :key="'gztips3_2_' + gzindex1"
          class="gzchatitem_gz"
          :style="{
            'margin-left': `calc(${(100 / gztipsTitleArr.length) * content[0] + 100 / gztipsTitleArr.length / 2}% - 10px)`,
          }"
        >
          {{ content[1] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getClassOfGZ } from '@/utils'

export default {
  props: {
    gzchat: {
      type: Array,
      default: () => [],
    },
    gztipsTitleArr: {
      type: Array,
      default: () => [],
    },
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
      gzchat2: [],
    }
  },
  watch: {
    gzchat: {
      handler() {
        this.gzchat2 =
          this.gztipsGanArr.slice(-1)[0] == '*'
            ? this.gzchat.map((arr) => {
                return arr.filter(
                  (item) => item[2] + item[3] < this.gztipsGanArr.length - 1,
                )
              })
            : this.gzchat.slice()
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getClassOfGZ(gz) {
      return getClassOfGZ(gz)
    },
  },
}
</script>

<style lang="scss" scoped>
.ganzhi_tab01_wrapper {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  font-size: 12.5px;
  overflow: hidden;
  // height: auto;
  padding: 30px 0;
  // display: flex;
  // flex-direction: column;
  // justify-content: flex-start;
  // align-items: center;
  // max-height: 700px;

  .tg_wrapper {
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
  }

  .dz_wrapper {
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
  }

  .gzchatitem {
    position: relative;
    height: 50px;
    text-align: center;
    width: 100%;
  }

  .gztipsline {
    height: 0.5px;
    background-color: #bbbbbb;
    position: absolute;
    top: 60%;
    z-index: 990;
  }

  .gzchatitem_relaction {
    position: absolute;
    top: 0;
    white-space: nowrap;
    font-size: 14px;
    z-index: 991;
  }

  .gzchatitem_gz {
    position: absolute;
    font-size: 14px;
    background: #ffffff;
    border: 1px solid #bbbbbb;
    width: 23px;
    height: 23px;
    line-height: 23px;
    text-align: center;
    padding: 0;
    top: 18px;
    z-index: 999;
    border-radius: 50%;
  }

  .gztips_mpgz_wrapper {
    float: left;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }

  .gztips_mpgz {
    font-size: 25px;
    font-weight: normal;
  }
}
</style>
