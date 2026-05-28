<template>
  <div class="wzbz_header">
    <!-- <img class="wzbz_header_icon" :src="backIcon" @click.stop="onBack" /> -->
    <div class="wzbz_header_title">智能四柱图示</div>
    <div class="wzbz_header_list">
      <div
        class="wzbz_header_list_item"
        :class="{ wzbz_header_list_item_selected: tabIndex === index }"
        v-for="(item, index) in list"
        :key="item"
        @click.stop="onTab(index)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
const list = ['干支', '流通', '宫位', '六亲']

export default {
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      list,
      backIcon: '',
    }
  },
  created() {
    // this.backIcon = this.imgPath + 'icon_back.png'
  },
  computed: {
    imgPath() {
      return this.$store.getters.imgPath
    },
  },
  methods: {
    onBack() {
      this.$emit('back')
    },
    onTab(index) {
      this.$emit('tab', index)
    },
  },
}
</script>

<style scoped lang="scss">
$borderRadius: 12px;

.wzbz_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // height: 42px;
  // padding: 0 15px;
  background-color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.wzbz_header_title {
  font-size: 17px;
  font-weight: bold;
  width: 100%;
  height: 54px;
  line-height: 54px;
  text-align: center;
}

.wzbz_header_icon {
  width: 20px;
  height: 20px;
  padding-left: 15px;
}

.wzbz_header_list {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 42px;
  margin: auto;
  // border-radius: $borderRadius;
  // background-color: #f0f0f0;
  width: 100%;
  border-top: 1px solid #dfdfdf;
  border-bottom: 1px solid #dfdfdf;

  .wzbz_header_list_item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25%;
    height: 100%;
    font-size: 15px;
  }
  .wzbz_header_list_item_selected {
    background-color: rgba($color: $themeColor, $alpha: 0.1);
    // border-radius: $borderRadius;
    color: $themeColor;
  }
}
</style>
