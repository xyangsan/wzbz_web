<template>
  <div class="feedback-note-root">
    <Head @onTab="onTab" :options="props.options" :selDex="selTabDex" />
    <Feedback
      v-show="selTabDex == 0 && isFeedback"
      :feedbackFootInfos="feedbackFootInfos"
      :feedbackHeadInfos="feedbackHeadInfos"
      :feedbackBodyInfos="feedbackBodyInfos"
      :liuzhuInfos="props.liuzhuInfos"
      :options="props.options"
    />
    <Comment
      :selDex="commentDex"
      v-show="selTabDex == 1 && isFeedback"
      :commentHeadInfos="commentHeadInfos"
      :commentBodyInfos="commentBodyInfos"
      :options="props.options"
    />
    <FootSave v-if="isFeedback" v-model:dex="dex" @onSave="onSave" />
    <div class="tip_nocurd" v-if="!isFeedback">
      <img :src="require('@/assets/images/icon_tip.png')" />
      <span>{{ tipText }}</span>
    </div>
  </div>
</template>

<script setup>
import Head from './layout/head_tab.vue'
import Feedback from './layout/body_feedback.vue'
import Comment from './layout/body_comment.vue'
import FootSave from './layout/foot_save.vue'
import { getNote, updateNote } from '@/api/note.js'
import { onBeforeMount, ref, computed, defineProps, watch } from 'vue'
import store from '@/store'
import {
  structModels,
  feedbackFootInfosX,
  commentBodyInfosX,
  feedbackHeadInfosX,
  commentHeadInfosX,
  feedbackBodyInfosX,
} from './model'

import { Toast } from 'vant'
import { useRoute } from 'vue-router'
const route = useRoute()
const feedbackFootInfos = ref([])
const feedbackHeadInfos = ref([])
const feedbackBodyInfos = ref([])
const commentHeadInfos = ref([])
const commentBodyInfos = ref({})
const selTabDex = ref(0)
const commentDex = ref(0)
const isFeedback = ref(true)
const dex = ref(0)
const guid = computed(() => store.getters.userguid)
let tipText = computed(() => {
  let userguid = localStorage.getItem('wzbz_userguid') || ''
  if (userguid == '' && props.MRType == 0) {
    return '未登录的用户不支持此功能，只支持排盘'
  } else if (caseGuid.value == '' && props.MRType == 0) {
    return '未保存的案例不支持此功能'
  } else if (props.MRType == 1) {
    return '名人事迹不支持此功能'
  }
})

// const caseGuid = ref('f8d777de-1c44-4b7d-b0da-3f4cf82efd33')
const caseGuid = ref('')
const props = defineProps({
  liuzhuInfos: {
    type: Object,
    default: {},
  },
  dsbjIndex: {
    type: Number,
    default: 0,
  },
  MRType: {
    type: Number,
    default: 0,
  },
})

watch(
  () => props.dsbjIndex,
  () => {
    selTabDex.value = props.dsbjIndex
    commentDex.value = props.dsbjIndex
  },
  { immediate: true },
)

onBeforeMount(async () => {
  //获取断式笔记数据
  caseGuid.value = route.query.guid
  console.log('caseGuid', caseGuid.value)

  console.log(
    '模拟数据feedbackFootInfos：',
    JSON.parse(JSON.stringify(structModels.feedbackFootInfos)),
  )
  console.log(
    '模拟数据feedbackBodyInfos：',
    JSON.parse(JSON.stringify(structModels.feedbackBodyInfos)),
  )
  console.log(
    '模拟数据feedbackHeadInfos：',
    JSON.parse(JSON.stringify(structModels.feedbackHeadInfos)),
  )
  console.log(
    '模拟数据commentHeadInfos：',
    JSON.parse(JSON.stringify(structModels.commentHeadInfos)),
  )
  console.log(
    '模拟数据commentBodyInfos：',
    JSON.parse(JSON.stringify(structModels.commentBodyInfos)),
  )
  console.log('liuzhuInfos', caseGuid.value, guid.value)
  let userguid = localStorage.getItem('wzbz_userguid') || ''
  if (userguid == '' && props.MRType == 0) {
    isFeedback.value = false
    return
  } else if (caseGuid.value == '' && props.MRType == 0) {
    isFeedback.value = false
    return
  } else if (props.MRType == 1) {
    isFeedback.value = false
    return
  }
  //名人库 || 未保存的案例
  // feedbackFootInfos.value = JSON.parse(JSON.stringify(structModels.feedbackFootInfos))
  // feedbackBodyInfos.value = JSON.parse(JSON.stringify(structModels.feedbackBodyInfos))
  // feedbackHeadInfos.value = JSON.parse(JSON.stringify(structModels.feedbackHeadInfos))
  // commentHeadInfos.value = JSON.parse(JSON.stringify(structModels.commentHeadInfos))
  // commentBodyInfos.value = JSON.parse(JSON.stringify(structModels.commentBodyInfos))

  // return
  await getNote(caseGuid.value).then((res) => {
    console.log('getNote', props, res.data)
    let bzData =
      JSON.parse(res.data.bzData || res.data.bzStruct) ||
      structModels.commentHeadInfos
    let bzStruct =
      JSON.parse(res.data.bzStruct) || structModels.commentHeadInfos
    let feedbackData =
      JSON.parse(res.data.feedbackData || res.data.feedbackStruct) ||
      structModels.feedbackHeadInfos.concat(structModels.feedbackBodyInfos)
    let feedbackStruct =
      JSON.parse(res.data.feedbackStruct) ||
      structModels.feedbackHeadInfos.concat(structModels.feedbackBodyInfos)
    let feedbackHeadInofsTmp = []
    let commentHeadInfosImp = []
    let feedbackBodyInfosTmp = []
    let commentBodyInfosImp = {}
    let feedbackFootInfo1 = {
      title: '大运',
      items: [], //大运年份列表
      contents: [
        // {
        //   name: '2029年 巳酉',
        //   content: '事迹记录',
        //   jxDex: -1,
        //tag: 0, //识别流年，以此作为绑定的标识（适配后端接口，与前端交互不匹配的问题）
        // },
      ],
    }
    let feedbackFootInfo2 = {
      title: '流年',
      items: [], //流年年份列表
      contents: [
        // {
        //   name: '2029年 巳酉',
        //   content: '事迹记录',
        //   jxDex: -1,
        //   tag: 0,
        // },
      ],
    }
    feedbackData.forEach((item, index) => {
      switch (item.type) {
        case 0:
          //健康状态
          feedbackBodyInfosTmp.push({
            name: item.name,
            items: item.items,
            type: item.type,
            show: item.show,
            data: item.data,
          })
          break
        case 1:
          //职业
          feedbackHeadInofsTmp.push({
            name: item.name,
            // items: item.items.split(',').filter((i) => !!i),
            items: item.items.split(',').filter((i) => !!i),
            data: item.data,
            type: item.type,
            show: item.show,
          })
          break
        case 2:
          //大运流年
          //大运流年分开存入
          //情形1：有存储大运下的流年
          let isDayun = item.name.includes('大运')
          if (isDayun) {
            let dayunData = JSON.parse(item.data)
            feedbackFootInfo1 = {
              title: '大运',
              items: feedbackFootInfo1.items,
              contents: feedbackFootInfo1.contents.concat([
                {
                  name: item.name,
                  data: dayunData.data.split('|')[0],
                  jxDex: dayunData.data.split('|')[1]
                    ? dayunData.data.split('|')[2]
                    : -1,
                  tag: index,
                },
              ]),
            }
            if (dayunData.list && dayunData.list.length > 0) {
              //说明有流年
              dayunData.list.forEach((liunianItem) => {
                let liunianData = liunianItem.data.split('|')
                feedbackFootInfo2 = {
                  title: '流年',
                  items: feedbackFootInfo2.items,
                  contents: feedbackFootInfo2.contents.concat([
                    {
                      name: liunianItem.name,
                      data: liunianData[0],
                      jxDex: liunianData[1] ? liunianData[2] : -1,
                      tag: index, //因为标识需要结合items才能确认，所以这里先设置为跟大运旗下的，后面组件初始化时再处理
                    },
                  ]),
                }
              })
            }
          } else {
            //情形2：没有存储大运下的流年
            let liunianData = item.data.split('|')
            feedbackFootInfo2 = {
              title: '流年',
              items: feedbackFootInfo2.items,
              contents: feedbackFootInfo2.contents.concat([
                {
                  name: item.name,
                  data: liunianData[0],
                  jxDex: liunianData[1] ? liunianData[2] : -1,
                  tag: index, //因为标识需要结合items才能确认，所以这里先设置为跟大运旗下的，后面组件初始化时再处理
                },
              ]),
            }
          }

          // let dayunData = liuninaData.data.split('|')
          // feedbackFootInfo1 = {
          //   title: '大运',
          //   items: feedbackFootInfo1.items,
          //   contents: feedbackFootInfo1.contents.concat([
          //     {
          //       name: item.name,
          //       data: dayunData[0],
          //       jxDex: dayunData[1] ? dayunData[2] : -1,
          //       tag: index,
          //     },
          //   ]),
          // }
          // if (liuninaData.list) {
          //   liuninaData.list.forEach((liunianItem) => {
          //     let liunianData = liunianItem.data.split('|')
          //     feedbackFootInfo2 = {
          //       title: '流年',
          //       items: feedbackFootInfo2.items,
          //       contents: feedbackFootInfo2.contents.concat([
          //         {
          //           name: liunianItem.name,
          //           data: liunianData[0],
          //           jxDex: liunianData[1] ? liunianData[2] : -1,
          //           tag: index,
          //         },
          //       ]),
          //     }
          //   })
          // }
          break
        case 3:
          //事件内容
          break
      }
    })
    commentBodyInfosImp.name = '总结'
    commentBodyInfosImp.data = res.data.content

    bzData.forEach((item) => {
      switch (item.type) {
        case 0:
          //健康状态
          break
        case 1:
          //旺衰
          commentHeadInfosImp.push({
            name: item.name,
            items: item.items.split(',').filter((i) => !!i),
            data: item.data,
            type: item.type,
            show: item.show,
          })
          break
        case 2:
        //大运流年
        case 3:
          //事件内容
          break
      }
    })
    feedbackFootInfos.value = [feedbackFootInfo1, feedbackFootInfo2]
    feedbackBodyInfos.value = feedbackBodyInfosTmp
    feedbackHeadInfos.value = feedbackHeadInofsTmp
    commentHeadInfos.value = commentHeadInfosImp
    commentBodyInfos.value = [commentBodyInfosImp]
    console.log('bzData', bzData, bzStruct, feedbackData, feedbackStruct)
    // console.log('feedbackFootInfos', JSON.stringify(feedbackFootInfos.value))
    // console.log('feedbackBodyInfos', JSON.stringify(feedbackBodyInfos.value))
    // console.log('feedbackHeadInfos', JSON.stringify(feedbackHeadInfos.value))
    // console.log('commentHeadInfos', JSON.stringify(commentHeadInfos.value))
    console.log(
      'commentBodyInfos',
      JSON.stringify(commentBodyInfos.value),
      JSON.stringify(commentBodyInfosImp),
    )
  })
  console.log('feedbackFootInfos', JSON.stringify(feedbackFootInfos.value))
  console.log('feedbackBodyInfos', JSON.stringify(feedbackBodyInfos.value))
  console.log('feedbackHeadInfos', JSON.stringify(feedbackHeadInfos.value))
  console.log('commentHeadInfos', JSON.stringify(commentHeadInfos.value))
})

const onSave = () => {
  Toast('保存成功')
  //restoreNormal()
  buildServerNote()
  console.log('onSave')
}

const restoreNormal = async () => {
  let feedbackInfo = JSON.parse(
    JSON.stringify(structModels.feedbackHeadInfos),
  ).concat(JSON.parse(JSON.stringify(structModels.feedbackBodyInfos)))
  let json = {
    userGuid: caseGuid.value,
    content: JSON.parse(JSON.stringify(structModels.commentBodyInfos))[0].data,
    bzData: JSON.parse(JSON.stringify(structModels.commentHeadInfos)),
    bzStruct: JSON.parse(JSON.stringify(structModels.commentHeadInfos)),
    feedbackData: feedbackInfo,
    feedbackStruct: feedbackInfo,
  }
  const param = new URLSearchParams()
  param.append('userGuid', json.userGuid)
  param.append('content', json.content)
  param.append('bzData', JSON.stringify(json.bzData))
  param.append('bzStruct', JSON.stringify(json.bzStruct))
  param.append('feedbackData', JSON.stringify(json.feedbackData))
  param.append('feedbackStruct', JSON.stringify(json.feedbackStruct))
  await updateNote(param)
}

const onTab = (index) => {
  if (caseGuid.value.length == 0) return
  selTabDex.value = index
  console.log('onTab', index)
}

const buildServerNote = async () => {
  const bzDataTmp = JSON.parse(JSON.stringify(commentHeadInfos.value)).map(
    (item) => {
      return {
        ...item,
        items: item.items.join(','),
      }
    },
  )
  console.log('bzDataTmp', bzDataTmp)

  const bzStruct = JSON.parse(JSON.stringify(bzDataTmp)).map((item, index) => {
    console.log('bzDataTmp', bzDataTmp[index])
    return {
      ...item,
      items: JSON.parse(JSON.stringify(bzDataTmp[index].items)),
      data: '',
    }
    console.log('index', index)

    item.items = JSON.parse(JSON.stringify(bzDataTmp[index].items))
    return item
  })

  let feedbackData = JSON.parse(JSON.stringify(feedbackHeadInfos.value)).map(
    (item) => {
      return {
        ...item,
        items: item.items.join(','),
      }
    },
  )
  const feedbackBodyInfosTmp = JSON.parse(
    JSON.stringify(feedbackBodyInfos.value),
  )

  //健康状态
  feedbackData = feedbackData.concat(feedbackBodyInfosTmp)

  let feedbackStruct = JSON.parse(JSON.stringify(feedbackData)).map(
    (item, index) => {
      return {
        ...item,
        items: JSON.parse(JSON.stringify(feedbackData[index].items)),
        data: '',
      }
    },
  )

  //大运流年
  let noLiunianArrCounts = []
  const feedbackFootInfosTmp = JSON.parse(
    JSON.stringify(feedbackFootInfos.value),
  )
  const dayuns = []
  //情形1：存储大运下的流年
  feedbackFootInfosTmp[0].contents.forEach((dayun, dex) => {
    let liunianArr = feedbackFootInfosTmp[1].contents.map(
      (liunian, liunianDex) => {
        if (dayun.tag == liunian.tag) {
          //在该大运下的流年
          noLiunianArrCounts.push(liunianDex)
          return {
            name: liunian.name,
            data:
              liunian.data +
              '|' +
              (liunian.jxDex > -1 ? 1 : 0) +
              '|' +
              liunian.jxDex,
            type: 2,
            items: '',
          }
        }
      },
    )
    //去除liunianArr的null值
    //将上面的流年数组存入大运
    liunianArr = liunianArr.filter((item) => !!item)
    console.log('liunianArr', liunianArr)

    dayuns.push({
      name: dayun.name,
      type: 2,
      items: '',
      //方便查看list的数据
      // data: dayun.data + '|' + (dayun.jxDex > -1 ? 1 : 0) + '|' + dayun.jxDex,
      // list: JSON.stringify(liunianArr),

      //保存到后端的数据格式
      data: JSON.stringify({
        data: dayun.data + '|' + (dayun.jxDex > -1 ? 1 : 0) + '|' + dayun.jxDex,
        list: liunianArr,
      }),
    })

    //console.log("liunianArr", liunianArr);

    // if (liunianArr[dex] && liunianArr.length > 0) {
    //   let json = {
    //     name: dayun.name,
    //     type: 2,
    //     items: '',
    //     data: dayun.data + '|' + (dayun.jxDex > -1 ? 1 : 0) + '|' + dayun.jxDex,
    //     list: liunianArr,
    //   }
    //   dayuns.push(json)
    // } else {
    //   let json = {
    //     name: dayun.name,
    //     type: 2,
    //     items: '',
    //     data: dayun.data + '|' + (dayun.jxDex > -1 ? 1 : 0) + '|' + dayun.jxDex,
    //   }
    //   dayuns.push(json)
    // }
  })

  //情形二,存储没有选择大运时却选择了流年的情况
  let liunians = feedbackFootInfosTmp[1].contents.map((item, index) => {
    if (noLiunianArrCounts.indexOf(index) == -1) {
      return {
        name: item.name,
        type: 2,
        items: '',
        data: item.data + '|' + (item.jxDex > -1 ? 1 : 0) + '|' + item.jxDex,
      }
    }
  })
  liunians = liunians.filter((item) => !!item)
  console.log('feedbackFootInfosTmp', feedbackFootInfosTmp)

  console.log('dayuns', dayuns)
  console.log('liunians', noLiunianArrCounts, liunians)

  feedbackData = feedbackData.concat(dayuns)
  feedbackData = feedbackData.concat(liunians)
  let json = {
    userGuid: caseGuid.value,
    content: commentBodyInfos.value[0].data,
    bzData: bzDataTmp,
    bzStruct: bzStruct,
    feedbackData: feedbackData,
    feedbackStruct: feedbackStruct,
  }
  const param = new URLSearchParams()
  param.append('userGuid', json.userGuid)
  param.append('content', json.content)
  param.append('bzData', JSON.stringify(json.bzData))
  param.append('bzStruct', JSON.stringify(json.bzStruct))
  param.append('feedbackData', JSON.stringify(json.feedbackData))
  param.append('feedbackStruct', JSON.stringify(json.feedbackStruct))
  //Toast('保存成功')
  await updateNote(param)
  console.log('保存的断是笔记数据：', json)
}
</script>

<style lang="scss" scope>
.feedback-note-root {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  ::-webkit-scrollbar {
    width: 10px;
    height: 5px;
  }
  :hover::-webkit-scrollbar-thumb {
    border-radius: 30px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #dedfe1;
  }

  .tip_nocurd {
    display: flex;
    justify-content: center;
    align-content: center;
    margin-top: 55px;

    & > img {
      width: 17px;
      margin-right: 7px;
    }

    & > span {
      color: rgba(175, 175, 175, 1);
      font-size: 14px;
      text-align: center;
      font-family: SourceHanSansSC-regular;
    }
  }
}
</style>
