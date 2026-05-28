<template>
  <div class="xz-tip-set">
    <!-- <div class="xz-tip-title">
        {{ tipTitle }}
      </div> -->
    <div class="xz-tip-content">
      <div class="xz-tip-content-title">
        <label class="bold">系统默认旺衰</label>

        <!-- <img v-if="false" class="xz-tip-icon" src="@/assets/images/setting.png"> -->
      </div>
      <div class="xz-tip-content-title2" @click="onSelect(-1)">
        <p>系统提示：</p>
        <img
          class="xz-tip-icon"
          :src="
            require(selectIndex === -1
              ? '@/assets/images/icon_sel2.png'
              : '@/assets/images/icon_unsel2.png')
          "
        />
        <span :class="`xz-tip-value` + (selectIndex === -1 ? '-sel' : '')">
          {{ info.sysTipName }}
        </span>
      </div>
      <div class="xz-tip-content-title3">
        <label class="bold">断事笔记</label>
        <span class="xz-tip-value2">（人工选择旺衰）</span>
        <img
          :src="require('@/assets/images/icon_record.png')"
          class="icon"
          @click="navToFeedBack"
        />
        <lable class="edit" @click="navToFeedBack">(编辑)</lable>
      </div>
      <div class="xz-tip-content-list">
        <span>自定旺衰：</span>
        <div class="xz-tip-content-list-items">
          <div
            class="xz-tip-content-list-item"
            v-for="(item, index) in info.cusItems"
            :key="index"
            @click="onSelect(index)"
          >
            <img
              class="xz-tip-icon"
              :src="
                require(selectIndex === index
                  ? '@/assets/images/icon_sel2.png'
                  : '@/assets/images/icon_unsel2.png')
              "
            />
            <span
              :class="`xz-tip-value` + (selectIndex === index ? '-sel' : '')"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
      <div class="xz-tip-content-tip">
        <span>
          判断旺衰是八字核心技法之一，目前问真的系统评估准确率在90%以上，机器算法如有误差，专业命理师可自定义旺衰，此功能与断事笔记的旺衰选择-键同步。
        </span>
      </div>
    </div>
    <!-- <div v-else-if="tipCode < 2" class="xz-tip-img-box">
        <img class="xz-tip-img" :style="{ height: $px2rem((+item.h) * 340 / (+item.w) + 'px') }" :src="item.src"
          v-for="(item, index) in rzimg" :key="index">
      </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectIndex: -1,
    }
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          sysTipName: '系统提示',
          cusItems: [
            '建禄格',
            '劫财格',
            '食神格',
            '伤官格',
            '正财格',
            '偏财格',
            '正印格',
            '偏印格',
            '正官格',
            '七杀格',
            '曲直格',
            '炎上格',
            '稼穑格',
            '从革格',
            '润下格',
            '从儿格',
            '从财格',
            '从杀格',
            '从强格',
            '从弱格',
          ],
          selDex: -1,
        }
      },
    },
  },
  created() {
    this.selectIndex = this.info.selDex
  },
  computed: {},
  methods: {
    navToFeedBack() {
      this.$emit('goToGanZhiSetting', 3)
    },
    onSelect(index) {
      this.selectIndex = index
      this.$emit('select', index)
    },
    xzToSettingGJ() {
      //this.$router.push('/main/rulesetting/tab08')
      //跳转到设置页
    },
  },
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.xz-tip-set {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  border-radius: 10px;
  background-color: #ffffff;
  overflow: hidden;

  /* Chrome Safari */
  ::-webkit-scrollbar {
    display: none;
  }

  .xz-tip-close {
    position: absolute;
    top: 0;
    right: 0;
    width: 15px;
    height: 15px;
    padding: 10px 15px;
  }

  .xz-tip-title {
    padding: 10px 0;
    color: #000000;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }

  .xz-tip-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: 15px;
    overflow: hidden;

    /* Chrome Safari */
    ::-webkit-scrollbar {
      display: none;
    }

    .xz-tip-content-title {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      width: 100%;
      color: #000000;
      font-size: 15px;
      font-family: SourceHanSansSC-regular;
    }

    .xz-tip-content-title2 {
      display: flex;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 1px solid #e6e6e6;
      margin-bottom: 22px;
      width: 100%;
      color: #000000;
      p {
        font-size: 14px;
      }
    }

    .xz-tip-content-title3 {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      width: 100%;
      color: #000000;

      .icon {
        width: 18px;
        cursor: pointer;
        margin-left: auto;
      }

      .edit {
        font-size: 14px;
        color: #9c8251;
        cursor: pointer;
      }
    }

    .xz-tip-content-list {
      display: flex;
      overflow-y: auto;
      overflow-x: hidden;

      & > span {
        color: #101010;
        margin-bottom: 15px;
        font-size: 14px;
      }

      .xz-tip-content-list-items {
        display: flex;
        align-items: center;
        margin-left: 5px;
        flex-wrap: wrap;
        flex: 1;

        .xz-tip-content-list-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          width: 84px;

          &:first-child {
            margin-left: 0;
          }
        }
      }
    }

    .xz-tip-content-tip {
      //margin-top: 10px;
      color: #a5a5a5;
      font-size: 14px;
      font-weight: normal;
      letter-spacing: 1.5px;
      text-align: left;
      line-height: 26px;
      padding-bottom: 140px;
      margin-left: 76px;
    }

    .xz-tip-setting {
      border-top: 1px solid #e6e6e6;
      padding-top: 15px;
      display: flex;
      justify-content: center;
      align-content: center;
      cursor: pointer;

      & > span {
        color: #9c8251;
        font-size: 14px;
        text-align: center;
        margin-left: 5px;
      }

      & > img {
        width: 19px;
      }
    }
  }

  .xz-tip-img-box {
    width: 100%;
    height: calc(100vh - 130px);

    overflow-y: auto;
    /* Firefox */
    scrollbar-width: none;
    /* IE 10+ */
    -ms-overflow-style: none;

    .xz-tip-img {
      width: 100%;
    }
  }

  .xz-tip-icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }

  .xz-tip-value {
    color: #444 !important;
    font-weight: normal;
  }

  .xz-tip-value-sel {
    color: #9c8251 !important;
  }

  .xz-tip-value2 {
    font-size: 12px;
    color: #7d7d7d !important;
    text-align: center;
    line-height: 18px;
    font-weight: normal;
  }

  .noBorder {
    border: none !important;
  }
}

.bold {
  color: #101010;
  font-weight: bold !important;
}

.flexBetween {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
