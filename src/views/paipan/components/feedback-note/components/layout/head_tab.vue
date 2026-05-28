<template>
  <div class="feedback-note-headtab-root">
    <span
      @click="onTab(index)"
      :class="[activeTab == index ? 'tab-active' : '']"
      v-for="(item, index) in tabs"
      :key="index"
    >
      {{ item }}
    </span>
  </div>
</template>

<script setup>
import { ref, defineEmits, onBeforeMount, defineProps, watch } from 'vue'
const emits = defineEmits(['onTab'])

const tabs = ref(['命主反馈', '师傅点评'])
let activeTab = ref(0)
const props = defineProps({
  options: {
    type: Object,
    default: {
      headDex: 0,
      sDex: -1,
    },
  },
  selDex: {
    type: Number,
    default: 0,
  },
})

onBeforeMount(() => {
  activeTab.value = props.selDex
})

// watch(
//   () => props.selDex,
//   (newVal) => {
//     console.log('newVal', newVal);
    
//     activeTab.value = newVal
//   }
// )

// onBeforeMount(() => {
//   //activeTab.value = props.options.headDex
// })

const onTab = (index) => {
  activeTab.value = index
  emits('onTab', index)
}
</script>

<style lang="scss" scoped>
$normal_color: #646464;
$active_color: #b2955d;
$active_bgcolor: #f9f7f2;

.feedback-note-headtab-root {
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  border: 1px solid rgba(240, 240, 240, 1);
  span {
    font-size: 16px;
    padding: 10px 0;
    color: normal_color;
    text-align: center;
    cursor: pointer;
    flex: 1;
    &.tab-active {
      color: $active_color;
      background-color: $active_bgcolor;
    }
  }

  span:first-child {
    border-top-left-radius: 15px;
  }
  span:last-child {
    border-top-right-radius: 15px;
  }
}
</style>
