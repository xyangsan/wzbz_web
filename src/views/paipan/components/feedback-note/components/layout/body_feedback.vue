<template>
  <div class="feedback-note-feedback-root">
    <div class="head">
      <!-- <div v-for="(item, index) in headInfo" :key="index" class="item">
        <span class="title">{{ item.title }}</span>
        <div class="box">
          <span>{{ item.content }}</span>
          <img :src="require('@/assets/images/icon_down.png')" alt="" />
        </div>
      </div> -->
      <div style="display: flex; flex-wrap: wrap; width: 100%;justify-content: space-between;">
        <div
          style="width: calc(50% - 30px);"
          v-for="(info, headIndex) in feedbackHeadInfos"
          :key="headIndex"
        >
          <CusMenu1 :info="info" />
        </div>
      </div>
    </div>
    <div class="body">
      <div
        v-for="(item, bodyIndex) in feedbackBodyInfos"
        :key="bodyIndex"
        class="item"
      >
        <span class="title">{{ item.name }}：</span>
        <textarea
          :name="item.name"
          v-model="item.data"
          placeholder="请输入"
          id=""
          cols="10"
          rows="4"
          :maxlength="500"
        />
        <span class="tip">{{ item.data.length }}/500</span>
      </div>
    </div>

    <div class="foot">
      <span>关键事件反馈记录</span>
      <div
        v-for="(info, footIndex) in feedbackFootInfosXX"
        :key="footIndex"
        class="item"
      >
        <CusMenu2 :info="info" />
        <!-- <div class="title">
          <img :src="require('@/assets/images/icon_record2.png')" />
          <span>{{ item.title }}</span>
          
          <CusMenu2 @onSel="onSelMenu2" :dex="index" ref="cusmenu2"/>
        </div>

        <div
          class="contents"
          v-for="(content, dex) in item.contents"
          :key="`${index}_${dex}`"
        >
          <span class="title">{{ content.title }}</span>
          <textarea
            rows="1"
            cols="1"
            class="content"
            :name="content.content"
            placeholder="请输入"
          />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  defineEmits,
  defineProps,
  onBeforeMount,
  computed,
  watch,
} from 'vue'
import CusMenu1 from '../power/cusMenu1.vue'
import '../model.js'
import CusMenu2 from '../power/cusMenu2.vue'
const headInfos = ref()
const feedbackFootInfosXX = ref([])
const props = defineProps({
  feedbackFootInfos: {
    type: Object,
    default: [],
  },
  feedbackBodyInfos: {
    type: Object,
    default: [],
  },
  feedbackHeadInfos: {
    type: Object,
    default: [],
  },
  liuzhuInfos: {
    type: Object,
    default: { dayuns: [], liunians: [] },
  },
})
watch(
  () => props.feedbackFootInfos,
  (newVal) => {
    let feedbackFootInfosXXTmp = []
    // feedbackFootInfosXXTmp = JSON.parse(JSON.stringify(props.feedbackFootInfos))
    feedbackFootInfosXXTmp = props.feedbackFootInfos
    feedbackFootInfosXXTmp[0].items = props.liuzhuInfos.dayuns
    feedbackFootInfosXXTmp[1].items = props.liuzhuInfos.liunians
    feedbackFootInfosXX.value = feedbackFootInfosXXTmp
    console.log('FeedBack组件：feedbackFootInfosXX', feedbackFootInfosXX.value)
  },
)
onBeforeMount(() => {
  console.log('FeedBack组件：feedbackFootInfos', props.feedbackFootInfos)
  console.log('FeedBack组件：feedbackBodyInfos', props.feedbackBodyInfos)
  console.log('FeedBack组件：feedbackHeadInfos', props.feedbackHeadInfos)
  // props.feedbackFootInfos[0].items = props.liuzhuInfos.dayuns
  // props.feedbackFootInfos[1].items = props.liuzhuInfos.liunians
  console.log('FeedBack组件：liuzhuInfos', props.liuzhuInfos)
})
let footInfos = ref([
  {
    title: '大运',
    contents: [
      {
        title: '2029年 巳酉',
        content: '事迹记录',
      },
    ],
  },
  {
    title: '流年',
    contents: [
      {
        title: '2029年',
        content: '事迹记录',
      },
    ],
  },
])

const cusmenu2 = ref(null)

const openMenu2 = (index) => {
  console.log(index)
}

const onSelMenu2 = (str) => {
  /**
   * 获取:dex的值
   */

  console.log('onSelMenu2', cusmenu2.value, str)
}
</script>

<style lang="scss" scoped>
$normal_color: #646464;
$active_color: #b2955d;
$active_bgcolor: #f9f7f2;

.feedback-note-feedback-root {
  display: flex;
  flex-direction: column;
  padding: 0 15px;
  border-left: 1px solid rgba(240, 240, 240, 1);
  border-right: 1px solid rgba(240, 240, 240, 1);
  border-bottom: 1px solid rgba(240, 240, 240, 1);
  // height: 87%;
  flex: 1;
  overflow-y: auto;
  .head {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 26px;
    .item {
      display: flex;
      align-items: center;
      width: calc(50% - 30px);
      margin-bottom: 18px;
      margin-right: 15px;
      flex-wrap: 1;
      .title {
        font-size: 14px;
        color: $normal_color;
        text-align: center;
        margin-right: 10px;
        color: #646464;
      }
      .box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0 5px 10px;
        border: 1px solid #e5e5e5;
        border-radius: 5px;
        flex: 1;
        font-size: 14px;
        color: #101010;
        img {
          width: 18px;
          height: 18px;
          margin-right: 8px;
        }
      }
    }
  }
  .body {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    .item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: left;
      width: 100%;
      margin-top: 18px;
      .title {
        font-size: 14px;
        text-align: left;
        color: $normal_color;
      }
      .tip {
        position: absolute;
        right: 10px;
        bottom: 10px;
        font-size: 12px;
        color: #7b7b7b;
      }
      textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #e5e5e5;
        border-radius: 5px;
        margin-top: 10px;
        resize: none;

        &::placeholder {
          color: #7b7b7b;
          font-size: 12px;
        }
      }
    }
  }
  .foot {
    display: flex;
    flex-direction: column;
    margin-top: 27px;
    & > span {
      color: #646464;
      font-size: 14px;
      margin-bottom: 12px;
      text-align: left;
    }
    .item {
      width: 100%;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(230, 230, 230, 1);
      .title {
        display: flex;
        align-items: center;

        img {
          width: 22px;
        }
        span {
          font-size: 16px;
          color: #101010;
          margin-left: 10px;
          width: 100%;
          text-align: left;
        }
      }
      .contents {
        display: flex;
        flex-wrap: wrap;
        margin-top: 8px;
        margin-bottom: 6px;
        .title {
          font-size: 16px;
          color: #b2955d;
        }
        .content {
          width: 100%;
          padding: 10px;
          border: 1px solid #e5e5e5;
          border-radius: 5px;
          margin-top: 10px;
          resize: none;

          &::placeholder {
            line-height: 12px;
            color: #7b7b7b;
            font-size: 12px;
            line-height: 16px;
          }
        }
      }

      &:nth-child(3n) {
        margin-top: 30px;
      }
      &:last-child {
        border-bottom: 0 !important;
      }
    }
  }
}
</style>
