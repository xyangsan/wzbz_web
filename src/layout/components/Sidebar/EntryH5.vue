<template>
  <div class="entryh5-root" @click="navToWindowPhone">
    <img v-show="obj.text == '返回网页版'" :src="obj.icon" />
    <svg
      v-show="obj.text == '切换手机版'"
      viewBox="0 0 1024 1024"
      width="16"
      height="16"
      style=""
      filter="none"
    >
      <g>
        <path
          d="M637.952 161.792a43.008 43.008 0 0 1 60.8-0.384l227.456 224.256A43.008 43.008 0 0 1 896 459.264H128a43.008 43.008 0 0 1 0-86.016h663.168L638.336 222.592a43.008 43.008 0 0 1-4.928-55.424l4.48-5.376zM896 564.736a43.008 43.008 0 1 1 0 86.016l-663.232-0.064 152.896 150.72a43.008 43.008 0 0 1 4.928 55.424l-4.48 5.376a43.008 43.008 0 0 1-60.864 0.384L97.792 638.336A43.008 43.008 0 0 1 128 564.736h768z"
          p-id="6957"
          fill="rgba(134.895,134.895,134.895,1)"
        ></path>
      </g>
    </svg>
    <span v-show="obj.text == '切换手机版'">{{ obj.text }}</span>
    <label v-show="obj.text == '返回网页版'">{{ obj.text }}</label>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  obj: {
    text: '切换手机版',
    icon: require('@/assets/images/icon_change.svg'),
    routeName: 'WindowPhone',
    urlTag: 'pc_home',
  },
})
const navToWindowPhone = () => {
  // this.$router.push({ name: 'window-phone' })
  console.log('进来了路由2', props.obj)
  if (props.obj.urlTag === 'back') {
    console.log('路由表：', router.currentRoute.value.query.urlParams)
    let params = router.currentRoute.value.query.urlParams
    console.log('路由表2：', JSON.parse(params))
    router.replace({
      path: '/paipan-result/index',
      query: JSON.parse(params),
    })
    //router.back()
  } else if (props.obj.urlTag === 'pc_home') {
    console.log('进来了路由PC_HOME')

    const routeData = router.resolve({
      name: props.obj.routeName,
      //query: { urlTag: 'pc_home' },
    })
    window.open(routeData.href, '_blank')
  } else if (props.obj.urlTag === 'pc_paipan') {
    router.push({
      name: props.obj.routeName,
      query: { urlTag: 'pc_paipan' },
    })
  } else if (props.obj.urlTag === 'h5_home') {
    const routeData = router.resolve({
      name: props.obj.routeName,
      query: { urlTag: 'h5_home' },
    })
    window.open(routeData.href, '_blank')
  } else if (props.obj.urlTag === 'h5_paipan') {
    router.push({
      name: props.obj.routeName,
      query: {
        urlTag: 'h5_paipan',
        urlParams: JSON.stringify(props.obj.urlParams),
      },
    })
  }
}
</script>

<style lang="scss">
.entryh5-root {
  display: flex;
  padding: 14px 18px;
  border: 1px solid rgba(187, 187, 187, 1);
  border-radius: 200px;
  cursor: pointer;
  align-items: center;
  white-space: nowrap;
  & > img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }

  & > svg {
    margin-right: 8px;
  }

  & > span,
  label {
    color: #878787;
    text-align: center;
    font-size: 16px;
    font-family: SourceHanSansSC-regular;
    font-weight: normal;
    cursor: pointer;
  }
}

.entryh5-root:hover {
  border: 1px solid #b2955d;
  background-color: #F7F4EE;
  svg path {
    fill: #b2955d;
  }
  span {
    color: #b2955d;
  }
}
</style>
