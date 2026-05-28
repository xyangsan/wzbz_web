<template>
  <div class="comment-note-feedback-root">
    <div class="head">
      <div style="display: flex; flex-wrap: wrap; width: 100%;justify-content: space-between;">
        <div
          style="width: calc(50% - 30px);"
          v-for="(info, headIndex) in commentHeadInfos"
          :key="headIndex"
        >
          <CusMenu1 :info="info" :isOpen="menu1Opens[headIndex]" />
        </div>
      </div>
    </div>
    <div class="body">
      <div
        v-for="(item, bodyIndex) in commentBodyInfos"
        :key="bodyIndex"
        class="item"
      >
        <span class="title">{{ item.name }}：</span>
        <textarea
          :name="item.name"
          v-model="item.data"
          placeholder="请输入"
          id=""
          cols="30"
          rows="20"
          :maxlength="2000"
        />
        <span class="tip">{{ item.data.length }}/2000</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Toast } from 'vant'
import { ref, defineProps, onBeforeMount, watch, computed } from 'vue'
import CusMenu1 from '../power/cusMenu1.vue'
import store from '@/store'

// import { commentHeadInfos, commentBodyInfos } from '../../model.js'
const cusmenu2 = ref(null)
const menu1Opens = ref([])
const props = defineProps({
  commentHeadInfos: {
    type: Object,
    default: [],
  },
  commentBodyInfos: {
    type: Object,
    default: [],
  },
  selDex: {
    type: Number,
    default: 0,
  },
  options: {
    type: Object,
    default: {
      headDex: 0,
      sDex: -1,
    },
  },
})

onBeforeMount(() => {
  // window.addEventListener('storage', handleStorageChange)
})

const handleStorageChange = (event) => {
  console.log('event', event);
  
  if (event.key === 'navToFeedback') {
    Toast('已跳转到反馈记录：' + event.newValue)
  }
}

// menu1Opens.value[0] = computed(() => store.getters.navToFeedback)

// watch(
//   () => props.commentHeadInfos,
//   (newVal) => {
//     for (let i = 0; i < props.commentHeadInfos.length; i++) {
//       menu1Opens.value.push(false)
//     }
    
//     console.log('menu1Opens', menu1Opens.value)
//   },
//   () => props.options,
//   (newVal) => {
//     menu1Opens.value = newVal
//     console.log('menu1Opens2222', menu1Opens.value)
//   },
//   () => localStorage.getItem('navToFeedback'),
//   (newVal) => {
//     menu1Opens.value[0] = Boolean(newVal) || false
//     console.log('navToFeedback', newVal)
//   },
// )
watch(
  () => props.selDex,
  () => {
    console.log("奥克兰及时拨打时刻校订巴哈水库及",props.selDex);
    menu1Opens.value = []
    for (let i = 0; i < 12; i++) {
      menu1Opens.value.push(false)
    }
    if (props.selDex === 1) {
      menu1Opens.value[0] = true
      console.log('menu1Opens', menu1Opens.value);
      
    }
  },
  { immediate: true },
)

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

.comment-note-feedback-root {
  display: flex;
  flex-direction: column;
  padding: 0 15px;
  border-left: 1px solid rgba(240, 240, 240, 1);
  border-right: 1px solid rgba(240, 240, 240, 1);
  border-bottom: 1px solid rgba(240, 240, 240, 1);
  // height: 87%;
  flex: 1;
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
}
</style>
