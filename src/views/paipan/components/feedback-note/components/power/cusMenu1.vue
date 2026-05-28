<template>
  <div class="menu1-root">
    <span class="title">{{ infoTmp.name.padStart(2,'  ') }}</span>
    <!-- <span class="title">{{ infoTmp.name }}</span> -->
    <div class="input-box" @click.stop="open" :style="{borderColor: isShowDialog ? '#b2955d' : '#e5e5e5'}">
      <div class="dialog-root" v-if="isShowDialog">
        <div class="list-box">
          <div
            :class="['item', 'pointer', isEdit ? 'edit-item' : '']"
            v-for="(content, index) in infoTmp.items"
            :key="index"
            @click.stop="onSel(index)"
          >
            <textarea
              rows="1"
              :readonly="!isEdit"
              :name="content"
              v-model="infoTmp.items[index]"
              :class="[isEdit ? 'edit-textarea' : 'normal-textarea']"
            />
            <img
              @click="onDel(index)"
              :src="
                require('@/assets/images/' +
                  (isEdit ? 'icon_del' : 'icon_sel') +
                  '.png')
              "
            />
          </div>
        </div>

        <div class="foot-add" v-if="isAdd">
          <textarea rows="1" v-model="addName" placeholder="请输入" />
        </div>
        <div class="foot-curd">
          <img
            :src="require('@/assets/images/icon_add_main.png')"
            @click.stop="onAdd"
          />
          <span @click.stop="onEdit">
            {{ isEdit || isAdd ? '完成' : '编辑' }}
          </span>
        </div>
      </div>
      <div class="menu1-mask" @click.stop="close" v-if="isShowDialog"></div>
      <span>{{ infoTmp.data }}</span>
      <img :src="require('@/assets/images/icon_down.png')" alt="" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onBeforeMount, watch } from 'vue'
import popupBox from '@/components/popupBox/index.vue'
const props = defineProps({
  info: {
    type: Object,
    default: () => {
      return {}
    },
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
})
const isShowDialog = ref(false)

watch(
  () => props.isOpen,
  (val) => {
    isShowDialog.value = val
  },
  { immediate: true }
)



const addName = ref('')
const isEdit = ref(false)
const isAdd = ref(false)
const infoTmp = ref({})

onBeforeMount(() => {
  console.log('props', props, props.info)
  // infoTmp.value = JSON.parse(JSON.stringify(props.info))
  infoTmp.value = props.info
})

const open = () => {
  isShowDialog.value = true
  console.log('选择')
}

const close = () => {
  isShowDialog.value = false
  console.log('选择')
}

const onSel = (index) => {
  if (isEdit.value) return
  isShowDialog.value = false
  infoTmp.value.data = infoTmp.value.items[index]
}

const onEdit = () => {
  if (isAdd.value) {
    isAdd.value = false
    if (addName.value.trim() !== '') {
      infoTmp.value.items.push(addName.value)
      addName.value = ''
    }
  } else {
    isEdit.value = !isEdit.value
    isAdd.value = false
  }

  console.log('编辑')
}

const onAdd = () => {
  isAdd.value = true
  console.log('添加')
}

const onDel = (index) => {
  if (!isEdit.value) return
  infoTmp.value.items.splice(index, 1)
  console.log('删除', infoTmp.value.items)
}
// const menuInfo = ref({
//   title: '职业',
//   content: {
//     name: '未知',
//     value: 0,
//   },
// })
</script>

<style lang="scss" scope>
$normal_color: #646464;
.menu1-root {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 18px;
  margin-right: 15px;
  .title {
    font-size: 14px;
    color: $normal_color;
    text-align: center;
    margin-right: 10px;
  }
  .input-box {
    position: relative;
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

.dialog-root {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 102%;
  //height: 520px;
  top: 101%;
  left: -1%;
  z-index: 7777;
  // overflow-y: auto;
  background-color: white;
  border-left: 2px solid rgba(240, 240, 240, 1);
  border-right: 2px solid rgba(240, 240, 240, 1);
  border-bottom: 1px solid rgba(240, 240, 240, 1);

  // &::before {
  //   //三角红领巾
  //   position: absolute;
  //   content: '';
  //   width: 0;
  //   height: 0;
  //   border-style: solid;
  //   border-width: 10px;
  //   border-color: transparent transparent #b2955d transparent;
  //   top: 0%;
  //   left: calc(50% - 10px);
  //   transform: translateX(-50%);
  //   transform: rotate(180deg);
  // }

  //   &::before {
  //   //三角红领巾
  //   position: absolute;
  //   content: '';
  //   width: 1px;
  //   height: 20px;
  //   background-color: #b2955d;
  //   top: -1%;
  //   left: -100%;
  //   left: 0;
  // }

  .list-box{
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
    width: 100%;
    overflow-y: auto;
    .item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #101010;
    width: 100%;
    padding: 5px;
    //background-color: rosybrown;
    margin: 5px 0;

    .edit-textarea {
      padding: 10px;
      cursor: text;
      border-radius: 5px;
      border: 1px solid #b2955d;
    }

    .normal-textarea {
      color: #101010;
      border: none;
    }

    &:hover {
      & > textarea {
        color: #b2955d;
      }

      & > img {
        display: block;
      }
    }

    &::after {
      position: absolute;
      content: '';
      height: 1px;
      bottom: 0%;
      width: calc(100% - 20px);
      background-color: rgba(240, 240, 240, 1);
    }

    & > textarea {
      padding: 10px 0;
      resize: none;
      cursor: pointer;
      width: 100%;
    }

    img {
      display: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-left: auto;
    }
  }
   .edit-item {
    &:hover {
      & > textarea {
        color: #101010;
      }
    }
    img {
      display: block;
      width: 24px;
      height: 24px;
      margin-left: 4px;
    }
   }
}


  .foot-add {
    display: flex;
    padding: 10px;
    width: 100%;
    //background-color: red;
    textarea {
      resize: none;
      width: 100%;
      padding: 8px;
      cursor: text;
      border-radius: 8px;
      border: 1px solid #b2955d;
    }
  }

  .foot-curd {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    font-size: 14px;
    //background-color: orange;
    & > img {
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
    & > span {
      color: #b2955d;
      cursor: pointer;
    }
  }
}

.menu1-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 6666;
  background-color: transparent;
}
</style>
