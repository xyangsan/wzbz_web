<template>
  <div class="record-root" ref="rc">
    <div class="record-box" id="record-box" @click="clickMask">
      <div class="record-indexs" :style="{ left: indexL + 'px' }" @click.stop>
        <!-- <label class="record-indexs-title">所有档案</label> -->
        <label
          :style="{
            color: i == indexsPosition ? '#b2955d' : '',
            borderBottom: i == indexs.length - 1 ? '' : '1px solid #f5f5f7',
          }"
          @click="onIndexs(i)"
          class="record-indexs-items pointer"
          v-for="(item, i) in indexs"
          :key="i"
        >
          {{ item }}
        </label>
      </div>
      <div class="record-container" @click.stop>
        <PPRecord
          v-if="isLoads[0]"
          class="record-container-item"
          :class="{ shiftOut: 0 != indexsPosition }"
        />
        <HPRecord
          v-if="isLoads[1]"
          class="record-container-item"
          :class="{ shiftOut: 1 != indexsPosition }"
        />
        <CYRecord
          v-if="false"
          class="record-container-item"
          :class="{ shiftOut: 2 != indexsPosition }"
        />
        <!-- <PPRecord></PPRecord> -->
        <!-- 排盘档案单文件 -->
        <!-- <div>
        <div>分组组件</div>
        <div>索引组件</div>
        <div>
          滚动加载组件
          <div>案例组件</div>
        </div>
      </div> -->
        <!-- 合盘档案单文件 -->
        <!-- <div></div> -->
        <!-- 八字论财单文件 -->
        <!-- <div></div> -->
      </div>
    </div>
    <div class="mask" @click="clickMask"></div>
  </div>
  <img
    style="height: 20px; margin: 20px auto;padding-left: 190px;"
    :src="require('@/assets/images/icon_warning.png')"
    alt=""
  />
  <!-- 
    侧边栏、搜索栏、案例列表、分页组件放components，
    与“名人案例”有很多共同组件
   -->
</template>

<script>
// const indexs = ['排盘档案', '合盘档案', '八字论财档案']
const indexs = ["排盘案例", "合盘案例"];
import PPRecord from "./components/paipan-record";
import HPRecord from "./components/hepan-record";
import CYRecord from "./components/caiyun-record";
import { navigationTo, updateLevel } from "@/utils";
import store from '@/store'
// import paipanRecord from './components/paipan-record.vue'
export default {
  name: "Record",
  components: { PPRecord, HPRecord, CYRecord },
  data() {
    return {
      indexs,
      indexsPosition: 0,
      isLoads: [false, false, false],
      indexL: 0,
      vipleval: store.getters.viplevel,
    };
  },
  watch: {
    "$route.query.index": {
      handler(index) {
        console.log("watch-index", index);
        if (index) {
          this.isLoads[index] = true;
          this.indexsPosition = index;
        } else {
          this.isLoads[0] = true;
        }
      },
      immediate: true,
    },
  },
  async created() {
    // console.log(model.getMRData());
    if (this.vipleval > 0) {
      await updateLevel()
    }
  },
  mounted() {
    console.log(window.innerWidth);
    // this.indexL = this.$refs.rc.clientWidth - 1229
  },
  methods: {
    async onIndexs(position) {
      navigationTo({ path: this.$route.path, params: { index: position } });
      await store.dispatch('page/updateClickMask', true)
      setTimeout(async () => {
        store.dispatch('page/updateClickMask', false)
      }, 0)
    },
    async clickMask() {
      return
      await store.dispatch('page/updateClickMask', true)
      setTimeout(async () => {
        store.dispatch('page/updateClickMask', false)
      }, 0)
    },
    preventParent(event) {
      event.stopPropagation()
    },
  },
};
</script>

<style lang="scss" scoped>
.record-root {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  // overflow-y: auto;
  // min-height: 700px;
  background-color: #f5f5f7;
}
.record-box {
  display: flex;
  width: 1228px;
  margin: 0 auto;
  height: 100%;
  // min-height: 700px;
  // overflow: hidden;
  // background-color: #f5f5f7;
  background-color: transparent;
  z-index: 998;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 997;
  display: var(--maskDisplay2);
}

.record-indexs {
  position: sticky;
  top: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 183px;
  max-width: 200%;
  height: 100%;
  border-radius: 15px;
  // padding-bottom: 10px;
  background-color: white;
  white-space: nowrap;
  .record-indexs-title {
    color: black;
    font-size: 18px;
    padding: 41px 55px 14px 56px;
    width: 100%;

    border-bottom: 1px solid #f5f5f7;
  }
  .record-indexs-items {
    color: #838383;
    font-size: 16px;
    width: 100%;
    // padding: 16px 59px 15px 60px;
    font-weight: 400;
    height: 65px;
    line-height: 65px;
    text-align: center;

    &:hover {
      color: $themeColor;
    }
  }
  .record-indexs-items-s {
    color: black;
    font-size: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f5f5f7;
  }
}

.record-container {
  flex: 1;
  position: relative;
  height: 100%;
  margin-left: 15px;
  border-radius: 15px;
  background-color: white;
  .record-container-item {
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
