<template>
  <div class="search-box">
    <el-input
      @keyup.enter="onSearch"
      :placeholder="tipText"
      v-model="searText"
      class="search-input"
      @focus="onFocus"
    >
      <template #prefix>
        <img
          src="../../assets/images/search_icon.png"
          @click="onSearch"
          :round="true"
          class="search-input-left"
        />
      </template>
      <template #suffix v-if="showSearchBtn">
        <el-button
          type="primary"
          @click="onSearch"
          :round="true"
          class="search-input-btn"
        >
          搜索
        </el-button>
      </template>
    </el-input>
    <img
      v-if="showDel"
      class="pointer"
      style="margin-left: 30px; width: 100px; height: 25px"
      @click="onDel"
      :src="
        require(isMoreDel
          ? '../../assets/images/search_del_s.png'
          : '../../assets/images/search_del_u.png')
      "
      alt=""
    />
    <div class="pointer options" v-if="from === 'paipanRecord' || from === 'hepanRecord'">
      <div
        :class="['option', selectdIndex === index ? 'option-s' : '']"
        v-for="(item, index) in from === 'paipanRecord'
          ? options
          : from === 'hepanRecord'
          ? options.slice(2, 3)
          : []"
        :key="index"
        @click="onSelectOption(index)"
      >
        <div class="svg-box">
          <img
            :src="require(`@/assets/images/icon_option${from === 'paipanRecord' ? index : from === 'hepanRecord' ? 2 : index}.svg`)"
            class="svg-content"
          />
        </div>
        {{ item }}
      </div>
    </div>
    <div
      class="other-option pointer"
      v-if="from === 'paipanRecord' || from === 'celebrity'"
      @click="onFilter"
    >
      筛选
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed } from 'vue'
import { debounce } from '@/utils'

const emit = defineEmits([
  'onSearch',
  'onSelectDel',
  'onSelectStar',
  'onSelectGroup',
  'onInstantSearch',
  'onFilter',
  'onFocus',
])
const props = defineProps({
  showDel: {
    type: Boolean,
    default: true,
  },
  isMoreDel: {
    type: Boolean,
    default: false,
  },
  isMoreStar: {
    type: Boolean,
    default: false,
  },
  isMoreGroup: {
    type: Boolean,
    default: false,
  },
  showSearchBtn: {
    type: Boolean,
    default: true,
  },
  tipText: {
    type: String,
    default: '请输入搜索的内容',
  },
  from: {
    type: String,
    default: '',
  },
})
const searText = ref('')
const onInstantSearch = debounce((text) => emit('onInstantSearch', text), 500)
const options = ['移动分组', '星标八字', '批量删除']
const selectdIndex = ref(-1)

watch(searText, (text) => {
  onInstantSearch(text)
})
const isShowMask = computed(
  () => props.isMoreDel || props.isMoreStar || props.isMoreGroup,
)
watch(
  () => isShowMask.value,
  (val) => {
    if (!val) {
      selectdIndex.value = -1
      document.documentElement.style.setProperty('--maskDisplay1', 'none')
      document.documentElement.style.setProperty('--maskDisplay2', 'none')
    }
  },
)

// 搜索
const onSearch = () => {
  // if (!searText.value) return
  emit('onSearch', searText.value)
}

const onDel = () => {
  emit('onSelectDel', !props.isMoreDel)
}

const onStar = () => {
  emit('onSelectStar', !props.isMoreStar)
}

const onGroup = () => {
  // return
  emit('onSelectGroup', !props.isMoreGroup)
}

const onFilter = () => {
  emit('onFilter')
}

const onFocus = () => {
  if (props.from == 'paipanRecord' || props.from == 'hepanRecord') {
    emit('onFocus')
  }
}

// 选择
const onSelectOption = (index) => {
  // return
  switch (index) {
    case 0:
      props.from === 'hepanRecord' ? onDel() : onGroup()
      break
    case 1:
      onStar()
      break
    case 2:
      onDel()
      break
  }
  if (index === selectdIndex.value) {
    document.documentElement.style.setProperty('--maskDisplay1', 'none')
    document.documentElement.style.setProperty('--maskDisplay2', 'none')
    selectdIndex.value = -1
    // onDel()
    return
  }
  document.documentElement.style.setProperty('--maskDisplay1', 'block')
  document.documentElement.style.setProperty('--maskDisplay2', 'block')
  selectdIndex.value = index
  // onDel()
}
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
  align-items: center;
  margin-top: 20px;
  background-color: #ffffff;
  width: 100%;
  height: 47px;
}

.search-input {
  flex: 1;
}

.search-input-btn {
  position: absolute;
  right: 0%;
  top: 2.5px;
  bottom: 2.5px;
  height: 42px;
  padding: 9px 35px;
  font-size: 16px;
}

.search-input-btn:active {
  background-color: #b2955b;
  color: white;
}

::v-deep .el-input__inner {
  background-color: transparent;
  height: 47px;
}

::v-deep .el-input__wrapper {
  border-radius: 30px;
  background-color: #f5f5f7;
  box-shadow: unset;
}

// ::v-deep .is-focus {
//   box-shadow: unset;
// }

::v-deep .el-button--primary {
  background-color: white;
  color: black;
  border-color: transparent;
  // box-shadow: 0 0 3px 1px #c4c4c4;
  border-radius: 30px;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.12);
  margin-right: 3px;
}

.search-input-left {
  width: 30px;
  height: 30px;
}

.options {
  width: 363px;
  height: 47px;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  overflow: hidden;

  .option {
    width: calc(100% / 3);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #646464;
    font-size: 15px;
    border-right: 1px solid #f0f0f0;

    .svg-box {
      width: 18px;
      height: 18px;
      overflow: hidden;
      display: inline-block;
      margin-right: 2px;

      .svg-content {
        width: 100%;
        height: 100%;
      }
    }

    &:hover {
      color: $themeColor;

      .svg-box {
        .svg-content {
          transform: translateX(20px);
          filter: drop-shadow($themeColor -20px 0px 0px);
        }
      }
    }

    &:last-child {
      border-right: none;
    }
  }

  .option-s {
    background-color: rgba($color: #b2955d, $alpha: 0.08);
    color: $themeColor;

    .svg-box {
      .svg-content {
        transform: translateX(18px);
        filter: drop-shadow($themeColor -18px 0px 0px);
      }
    }
  }
}

.other-option {
  width: 67px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #525252;
  font-size: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  margin-left: 10px;
  background-color: #f5f5f7;

  &:hover {
    color: $themeColor;
  }
}
</style>
