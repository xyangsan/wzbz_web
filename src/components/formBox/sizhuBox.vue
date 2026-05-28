<template>
  <el-popover
    v-model:visible="popoverVisible"
    placement="top"
    :width="400"
    :offset="50"
  >
    <div v-if="isShowPopupBox">
      <div v-if="isConfirm" class="sizhu-popover-list columnFlex">
        <div
          class="sizhu-popover-list-item pointer"
          v-for="(item, index) in dateList"
          :key="index"
          @click="onClickDate(item)"
        >
          公历：{{ item }} >
        </div>
      </div>
      <div v-else-if="isTG" class="sizhu-popover-row">
        <div
          class="sizhu-popover-row-item pointer"
          v-for="(item, index) in TianGan"
          :key="item + index"
          @click="onClickTG(item, index)"
        >
          {{ item }}
        </div>
        <!-- <div
          v-if="gzIndex == 3"
          class="sizhu-popover-row-item pointer"
          @click="onClickTG('未知', -1)"
        >
          未知
        </div> -->
      </div>
      <div v-else class="sizhu-popover-row">
        <div
          class="sizhu-popover-row-item pointer"
          style="width: 16%"
          v-for="(item, index) in DiZhis"
          :key="item + index"
          @click="onClickDZ(item)"
        >
          {{ item }}
        </div>
        <!-- <div
          v-if="gzIndex == 3"
          class="sizhu-popover-row-item pointer"
          style="width: 16%"
          @click="onClickDZ('未知')"
        >
          未知
        </div> -->
      </div>
    </div>
    <template #reference>
      <div class="sizhu-box columnFlex">
        <div class="sizhu-cancel pointer" @click="onClose">取消</div>
        <div class="sizhu-box-header">
          <div class="sizhu-header-item" v-for="item in headerArr" :key="item">
            {{ item }}
          </div>
        </div>
        <div class="sizhu-box-body">
          <div class="sizhu-body-row">
            <div
              class="sizhu-body-row-item pointer"
              :class="{ 'sizhu-body-row-item_selected': gzCheckList[index] }"
              v-for="(item, index) in tgList"
              :key="item + index"
              @click="onOpenPopover('tg', index)"
            >
              <span v-if="index != 4">{{ item }}</span>
            </div>
          </div>
          <div class="sizhu-body-row">
            <div
              class="sizhu-body-row-item pointer"
              :class="{
                'sizhu-body-row-item_selected': gzCheckList[index + 4],
              }"
              v-for="(item, index) in dzList"
              :key="item + index"
              @click="onOpenPopover('dz', index)"
            >
              <span v-if="index != 4">{{ item }}</span>
            </div>
          </div>
        </div>
        <div class="sizhu-box-footer">
          <div class="sizhu-footer-tip">查找范围：1801-2099年</div>
          <el-button round @click="onConfirm">确定</el-button>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script setup>
import { reactive, ref, watch, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import { TianGan, DiZhi } from '@/static'
import * as homeApi from '../../api/home-api'

const emits = defineEmits(['onClose', 'onClickDate'])
const props = defineProps({
  isShowPopupBox: {
    type: Boolean,
    default: false,
  },
})
watch(() => props.isShowPopupBox, (val) => {
  popoverVisible.value = val
})
const headerArr = ['年', '月', '日', '时']
const tgList = reactive([...TianGan.slice(0, 4)])
const dzList = reactive([...DiZhi.slice(0, 4)])
const gzCheckList = reactive(new Array(8).fill(false))
const DiZhi_odd = DiZhi.filter((_, index) => index % 2 == 0)
const DiZhi_even = DiZhi.filter((_, index) => index % 2 == 1)
const isTG = ref(true) // 判断当前点击的是天干还是地支
const gzIndex = ref(0) // 当前选中的干支下标
const popoverVisible = ref(false) // 是否显示弹出框
const DiZhis = reactive([...DiZhi_odd])
const isConfirm = ref(false)
const dateList = reactive([])

// 关闭四柱
const onClose = () => {
  popoverVisible.value = false
  emits('onClose')
}
// 打开弹出框
const onOpenPopover = (str, index) => {
  if (popoverVisible.value) {
    if (isConfirm.value) {
      isConfirm.value = false
      return
    } else if (
      gzIndex.value == index &&
      ((str == 'tg' && isTG.value) || (str != 'tg' && !isTG.value))
    ) {
      // 重复点击隐藏弹出框
      popoverVisible.value = false
      return
    }
  }
  if (str == 'tg') {
    isTG.value = true
  } else {
    isTG.value = false
    DiZhis.length = 0
    if (index == 3 && tgList[3] == '未知') {
      DiZhis.push(...DiZhi_odd, ...DiZhi_even)
    } else {
      const i = TianGan.findIndex((item) => tgList[index] == item)
      if (i % 2 == 0) {
        DiZhis.push(...DiZhi_odd)
      } else {
        DiZhis.push(...DiZhi_even)
      }
    }
  }
  gzIndex.value = index
  popoverVisible.value = true
}
// 选中天干
const onClickTG = (item, index) => {
  DiZhis.length = 0
  if (index == -1) {
    DiZhis.push(...DiZhi_odd, ...DiZhi_even)
  } else {
    if (index % 2 == 0) {
      DiZhis.push(...DiZhi_odd)
    } else {
      DiZhis.push(...DiZhi_even)
    }
    if (DiZhis.findIndex((item) => dzList[gzIndex.value] == item) == -1) {
      dzList[gzIndex.value] = DiZhis[0]
    }
  }
  tgList[gzIndex.value] = item
  gzCheckList[gzIndex.value] = true
  gzCheckList[gzIndex.value + 4] = false
  popoverVisible.value = false
  onOpenPopover('dz', gzIndex.value)
}
// 选中地支
const onClickDZ = (item) => {
  dzList[gzIndex.value] = item
  gzCheckList[gzIndex.value + 4] = true
  popoverVisible.value = false
  if (gzIndex.value != 3) {
    onOpenPopover('tg', gzIndex.value + 1)
  }
}
// 确定
const onConfirm = async () => {
  if (isConfirm.value) {
    if (popoverVisible.value) {
      ElMessage.error('请选择一组日期')
    } else {
      popoverVisible.value = true
    }
    return
  }
  // 请求
  let bzstr = ''
  for (let i = 0; i < 4; i++) {
    bzstr += tgList[i] + dzList[i]
  }
  const params = `bz=${bzstr}`
  // const params = `bz=壬寅丁未丙寅丙申`
  await homeApi
    .Request('szbz.php?', params)
    .then((res) => {
      if (!res || res.length == 0) {
        ElMessage.warning('在查找范围内无该八字数据')
      } else {
        dateList.length = 0
        dateList.push(...res)
        isConfirm.value = true
        popoverVisible.value = true
      }
    })
    .catch((err) => {
      ElMessage.error('获取四柱数据失败！')
      return
    })
}
// 选中日期
const onClickDate = (item) => {
  popoverVisible.value = false
  emits('onClickDate', item)
}
</script>

<style lang="scss" scoped>
.sizhu-popover-list {
  align-items: center;
  width: 100%;
  .sizhu-popover-list-item {
    margin-bottom: 5px;
    color: $mainColor;
    font-size: 20px;
  }
}
.sizhu-popover-row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  font-size: 18px;
  font-weight: bold;
  .sizhu-popover-row-item {
    width: 20%;
    padding: 5px 10px;
    text-align: center;
  }
}
.sizhu-box {
  position: relative;
  width: 100%;
  .sizhu-cancel {
    position: absolute;
    color: $mainColor;
    font-size: 16px;
  }
  .sizhu-box-header {
    display: flex;
    justify-content: space-around;
    margin-top: 28px;
    padding: 8px 0;
    font-size: 16px;
    border-top: 1px solid rgba(233, 233, 233, 100);
    .sizhu-header-item {
    }
  }
  .sizhu-box-body {
    .sizhu-body-row {
      display: flex;
      justify-content: space-around;
      font-size: 18px;
      .sizhu-body-row-item {
        width: 57px;
        height: 57px;
        margin-bottom: 10px;
        line-height: 57px;
        color: white;
        border-radius: 50%;
        background-color: #b8b8b8;
      }
      .sizhu-body-row-item_selected {
        background-color: $mainColor;
      }
    }
  }
  .sizhu-box-footer {
    .sizhu-footer-tip {
      font-size: 14px;
      margin: 10px 0;
    }
  }
}

:deep(.el-button) {
  margin: 0 auto;
  width: 88%;
  height: 40px;
  color: white;
  font-size: 16px;
  border: none;
  background-color: black;
}
</style>
