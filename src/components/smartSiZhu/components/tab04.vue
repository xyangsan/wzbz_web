<template>
  <div class="ganzhi_tab04_wrapper">
    <div
      class="ganzhi_tab04_wrapper_left"
      v-for="(gzRelation, gzIndex) in gzRelations"
      :key="gzIndex"
    >
      <div class="ganzhi_wrapper_table_title">{{ tabList[gzIndex] }}</div>
      <table class="ganzhi_wrapper">
        <tr class="ganzhi_row ganzhi_row_gong_wrapper">
          <td
            class="ganzhi_row_gong"
            v-for="(arr, index) in gzRelation[0]"
            :key="index"
          >
            <span v-if="index === 2">自己</span>
            <template v-else>
              <span v-for="item in arr" :key="item">{{ item }}</span>
            </template>
          </td>
        </tr>
        <tr class="ganzhi_row">
          <td
            class="ganzhi_row_ss"
            v-for="(item, index) in ganSSArr"
            :key="index"
          >
            {{ index === 2 ? `元${sex === 1 ? '男' : '女'}` : item }}
          </td>
        </tr>
        <tr class="ganzhi_row">
          <td
            class="ganzhi_row_gz"
            :class="[getClassOfGZ(item)]"
            v-for="(item, index) in gztipsGanArr"
            :key="index"
          >
            {{ item }}
          </td>
        </tr>
        <tr class="ganzhi_row">
          <td
            class="ganzhi_row_gz ganzhi_row_gz2"
            :class="[getClassOfGZ(item)]"
            v-for="(item, index) in gztipsZhiArr"
            :key="index"
          >
            {{ item }}
          </td>
        </tr>
        <tr class="ganzhi_row">
          <td
            class="ganzhi_row_ss"
            v-for="(item, index) in zhiSSArr"
            :key="index"
          >
            {{ item }}
          </td>
        </tr>
        <tr class="ganzhi_row ganzhi_row_gong_wrapper">
          <td
            class="ganzhi_row_gong ganzhi_row_gong2"
            v-for="(arr, index) in gzRelation[1]"
            :key="index"
          >
            <span v-for="item in arr" :key="item">{{ item }}</span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { getClassOfGZ } from '@/utils'

const relationData = [
    // 男的亲属关系
    {
      正官: ['女儿', '侄女', '外婆'],
      七杀: ['儿子', '姐夫', '妹婿', '侄儿'],
      正印: ['母亲', '外孙女'],
      偏印: ['爷爷', '男外孙', '外父'],
      比肩: ['兄弟', '姑父'],
      劫财: ['姐妹', '儿媳'],
      食神: ['外公', '女婿', '孙儿'],
      伤官: ['奶奶', '孙女', '外母'],
      正财: ['妻子', '兄嫂', '弟媳', '姑母'],
      偏财: ['父亲', '伯叔', '情人'],
    },
    // 女的亲属关系
    {
      正官: ['丈夫', '姐夫', '妹婿'],
      七杀: ['情人', '儿媳', '外婆', '夫家姐妹'],
      正印: ['爷爷', '女婿', '孙儿'],
      偏印: ['母亲', '孙女'],
      比肩: ['姐妹'],
      劫财: ['兄弟', '家公'],
      食神: ['奶奶', '女儿'],
      伤官: ['儿子', '外公', '夫家姐夫'],
      正财: ['父亲', '伯叔'],
      偏财: ['家婆', '兄嫂', '弟媳', '姑母'],
    },
    // 社会关系
    {
      正官: ['上司', '政府', '官运'],
      七杀: ['敌人', '小人', '恶势力', '权力'],
      正印: ['贵人', '房子', '文凭'],
      偏印: ['长辈', '意外助力', '精神追求'],
      比肩: ['同性朋友', '同性同辈'],
      劫财: ['异性朋友', '异性同辈'],
      食神: ['晚辈', '学生', '下属', '仆人'],
      伤官: ['晚辈', '下属', '仆人'],
      正财: ['稳定之财', '正途之财', '不动产'],
      偏财: ['意外之财', '暴发之财'],
    },
  ],
  tabList = ['亲属关系', '社会关系']

export default {
  props: {
    sex: {
      type: Number,
      default: 1,
    },
    gztipsGanArr: {
      type: Array,
      default: () => [],
    },
    gztipsZhiArr: {
      type: Array,
      default: () => [],
    },
    ganSSArr: {
      type: Array,
      default: () => [],
    },
    zhiSSArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tabList,
      gzRelations: [],
    }
  },
  created() {
    this.initDatas()
  },
  methods: {
    getClassOfGZ(val) {
      return getClassOfGZ(val)
    },
    initDatas() {
      const gzRelations = []
      gzRelations.push(this.initData(0))
      gzRelations.push(this.initData(1))
      this.gzRelations = gzRelations
    },
    initData(index = 0) {
      const relationArr =
        index === 0 ? relationData[this.sex === 1 ? 0 : 1] : relationData[2]
      const ganRelation = [],
        zhiRelation = []
      this.ganSSArr.forEach((ganSS, index) => {
        let arr = relationArr[ganSS] || []
        ganRelation.push(arr)
        arr = relationArr[this.zhiSSArr[index]] || []
        zhiRelation.push(arr)
      })
      const relations = []
      relations.push(ganRelation)
      relations.push(zhiRelation)
      return relations
    },
  },
}
</script>

<style scoped lang="scss">
$borderRadius: 12px;
.ganzhi_tab04_wrapper {
  display: flex;
  // flex-direction: column;
  height: 440px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  width: 100%;

  .ganzhi_tab04_wrapper_left {
    width: 50%;
    height: 100%;

    &:first-child {
      border-right: 1px solid #e5e5e5;
    }
  }

  .ganzhi_wrapper_table_title {
    font-size: 16px;
    font-weight: bold;
    color: #101010;
    text-align: center;
    width: 100%;
    height: 42px;
    line-height: 42px;
    border-bottom: 1px solid #e5e5e5;
  }

  .ganzhi_wrapper {
    width: 100%;
    margin: 10px auto;
    font-size: 25px;

    .ganzhi_row {
      display: flex;
      justify-content: space-evenly;

      td {
        width: 60px;
      }

      .ganzhi_row_gong {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        line-height: 29px;
        color: #101010;
        font-size: 15px;
        // font-weight: bold;
        white-space: nowrap;
      }

      .ganzhi_row_ss {
        padding: 5px 0;
        color: #a1a1a1;
        font-size: 14px;
      }

      .ganzhi_row_gz {
        padding: 6px 0;
        padding-top: 10px;
      }

      .ganzhi_row_gong2 {
        justify-content: flex-start;
      }

      .ganzhi_row_gz2 {
        padding-top: 6px;
        padding-bottom: 10px;
      }
    }

    .ganzhi_row_gong_wrapper {
      height: 115px;
    }
  }

  .relation_wrapper {
    flex: 1;
    display: flex;
    align-items: flex-end;

    .relation_list {
      display: flex;
      width: 206px;
      height: 38px;
      margin: 0 auto 30px;
      border-radius: $borderRadius;
      background-color: #f0f0f0;

      .relation_item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: calc(100% - 4px);
        margin: 2px;
        font-size: 14px;
        font-weight: bold;
      }

      .relation_item_selected {
        background-color: white;
        border-radius: $borderRadius;
      }
    }
  }
}
</style>
