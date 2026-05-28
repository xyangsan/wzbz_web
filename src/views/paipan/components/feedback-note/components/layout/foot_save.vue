<template>
  <div class="foot-save-root">
    <span @click.stop="onSave">保存</span>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
const emit = defineEmits(['update:dex', 'onSave'])
const props = defineProps({
  dex: {
    type: Number,
    default: () => {
      return {}
    },
  },
  model: {
    type: Number,
    default: () => {
      return {}
    },
  },
})

const onSave = () => {
  emit('onSave')
  emit('update:dex', props.dex + 1)
  console.log('保存', props.dex)
}
</script>

<style lang="scss" scope>
.foot-save-root {
  width: 100%;
  color: #333;
  font-size: 16px;
  padding: 20px 0;
  border-left: 1px solid rgba(240, 240, 240, 1);
  border-right: 1px solid rgba(240, 240, 240, 1);
  border-bottom: 1px solid rgba(240, 240, 240, 1);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  //border-radius: 0px 0px 10px 10px;

  & > span {
    // background-color: #a3a3a3;
    background-color: #b2955d;
    color: white;
    text-align: center;
    padding: 8px 36px;
    border-radius: 30px;
    font-size: 15px;
    cursor: pointer;
  }
}
</style>
