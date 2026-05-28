<template>
  <div class="touch-root">
    <div class="head">
      <img :src="require('@/assets/images/icon_record2.png')" class="record" />
      <span>{{ infoTmp.title }}</span>
      <img
        class="add"
        :src="
          require('@/assets/images/icon_add_' +
            (isAdd ? 'main' : 'gray') +
            '.png')
        "
        @click.stop="onAdd"
      />
    </div>

    <div
      class="contents"
      v-for="(selInfo, dex) in infoTmp.contents"
      :key="`${dex}`"
    >
      <span class="title" @click="onDel(dex)">
        {{ selInfo.name
        }}{{
          headDexs[dex] > -1 ? '【' + headTitles[headDexs[dex]] + '】' : ''
        }}
      </span>
      <textarea
        rows="1"
        cols="1"
        class="content"
        :name="selInfo.name"
        v-model="selInfo.data"
        placeholder="请输入"
      />
    </div>
    <div class="menu2-root" v-if="isAdd">
      <img
        class="icon_triangle"
        :src="require('@/assets/images/icon_triangle.png')"
      />
      <div class="head">
        <div
          v-for="(item, index) in headTitles"
          :key="index"
          @click.stop="onSel(index)"
        >
          <img
            :src="
              require('@/assets/images/icon_' +
                (selHeadDex == index ? '' : 'un') +
                'sel2.png')
            "
          />
          <span>{{ item }}</span>
        </div>
      </div>
      <div class="contents">
        <div
          class="item"
          v-for="(content, contentDex) in infoTmp.items"
          :key="content"
          @click.stop="onSelContent(content,contentDex)"
        >
          <span>
            {{ content }}
          </span>
          <img :src="require('@/assets/images/icon_sel.png')" />
        </div>
      </div>
    </div>
    <div class="menu2-mask" @click.stop="close" v-if="isAdd"></div>
  </div>
</template>

<script setup>
import { Toast } from 'vant'
import { ref, defineProps, onBeforeMount, defineEmits } from 'vue'

const isAdd = ref(false)
const infoTmp = ref({})
const headTitles = ref(['平', '吉', '凶'])
const headDexs = ref([])
const selItemDex = ref(-1)
const selHeadDex = ref(-1)
const props = defineProps({
  info: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

onBeforeMount(() => {
  console.log('info22222', props.info)
  // infoTmp.value = JSON.parse(JSON.stringify(props.info))
  infoTmp.value = props.info
  infoTmp.value.contents.forEach((item) => {
    headDexs.value.push(item.jxDex)
  })
})

const contents = ref([
  '2027年 乙亥大运',
  '2028年 丙子大运',
  '2029年 丁丑大运',
  '2030年 戊寅大运',
  '2031年 己卯大运',
  '2032年 庚辰大运',
  '2033年 辛巳大运',
  '2034年 壬午大运',
  '2035年 癸未大运',
  '2036年 甲申大运',
  '2037年 乙酉大运',
  '2038年 丙戌大运',
  '2039年 丁亥大运',
  '2040年 戊子大运',
  '2041年 己丑大运',
  '2042年 庚寅大运',
  '2043年 辛卯大运',
  '2044年 壬辰大运',
  '2045年 癸巳大运',
  '2046年 甲午大运',
  '2047年 乙未大运',
  '2048年 丙申大运',
  '2049年 丁酉大运',
  '2050年 戊戌大运',
  '2051年 己亥大运',
  '2052年 庚子大运',
  '2053年 辛丑大运',
  '2054年 壬寅大运',
])
const info = ref({
  title: '大运',
  contents,
})

const selInfos = ref([])
const emits = defineEmits(['onSel'])
const selDexs = ref([])
const close = () => {
  isAdd.value = false
}

const onAdd = () => {
  isAdd.value = true
}

const onDel = (index) => {
  // if (!isEdit.value) return
  //infoTmp.value.contents.splice(index, 1)
  console.log('删除', infoTmp.value.contents)
}

//吉凶等级选择
const onSel = (index) => {
  //单选
  selHeadDex.value = index == selHeadDex.value ? -1 : index
}

const onSelContent = (item,contentDex) => {
  console.log('改变前：', headDexs.value)
  headDexs.value.push(selHeadDex.value)
  console.log('改变后：', headDexs.value)
  if(selDexs.value.indexOf(contentDex) > -1) {
    //Toast('已经选择过了')
    isAdd.value = false
    return
  }
  selDexs.value.push(contentDex)
  isAdd.value = false
  // selInfos.value.push({
  //   title: item,
  //   content: '',
  //   tag:
  //     selTag.value > -1
  //       ? `【${headInfos.value[Number(selTag.value)].name}】`
  //       : '',
  // })
  //区分大运还是流年
  if(infoTmp.value.items.length > 12) {
    //流年
    // infoTmp.value.contents[selItemDex.value].name = item
    // infoTmp.value.contents[selItemDex.value].jxDex = selHeadDex.value
    let tag =  ~~(contentDex / 10) 
    if(infoTmp.value.items.length - 121 >= contentDex ){
      tag = -1
    }
    infoTmp.value.contents.push({
      name: item,
      data: '',
      jxDex: selHeadDex.value,
      tag,
    })
  }else{
    //大运
    infoTmp.value.contents.push({
      name: item,
      data: '',
      jxDex: selHeadDex.value,
      tag: contentDex,
    })
  }
  //排序
  infoTmp.value.contents.sort((a, b) => {
    //再根据里面的name的前四位年份排序
    return a.tag - b.tag? a.tag - b.tag : a.name.slice(0, 4) - b.name.slice(0, 4)
  })
  emits('onSel', item)
  console.log('选择-添加的', contentDex, infoTmp.value.contents)
}
</script>
<style lang="scss" scope>
.touch-root {
  position: relative;
  display: flex;
  flex-direction: column;
  //z-index: 6666;
  .head {
    display: flex;
    align-items: center;
    .record {
      width: 27px;
      height: 27px;
      margin-right: 10px;
    }

    & > span {
      font-size: 16px;
      color: #101010;
      margin-right: 10px;
      text-align: left;
      flex: 1;
    }
    .add {
      width: 27px;
      height: 27px;
      cursor: pointer;
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
}

.menu2-root {
  position: absolute;
  right: calc(27px + 10px + 4px);
  top: -420px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid rgba(178, 149, 93, 1);
  background-color: white;
  width: 190px;
  z-index: 7777;

  .icon_triangle {
    position: absolute;
    width: 10px;
    left: 100%;
    top: 426px;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 17px;
    border-bottom: 1px solid #e5e5e5;
    div {
      display: flex;
      align-items: center;
      cursor: pointer;

      img {
        width: 20px;
        height: 20px;
      }
      span {
        color: #444;
        margin-left: 5px;
        text-align: center;
        font-size: 16px;
      }
    }
  }
  .contents {
    display: flex;
    box-sizing: border-box;
    overflow-y: auto;
    height: 520px;
    overflow-x: hidden;
    .item {
      display: flex;
      cursor: pointer;
      width: 100%;
      text-align: left;
      padding: 10px 0;
      font-size: 14px;
      border-bottom: 1px solid #e5e5e5;

      &:last-child {
        border-bottom: 0 !important;
      }

      &:hover {
        & > span {
          color: #b2955d;
        }

        & > img {
          display: block;
        }
      }

      & > img {
        margin-left: auto;
        display: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
      }

      & > span {
        color: #101010;
      }
    }
  }
}

.menu2-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 6666;
  background-color: transparent;
}
</style>
