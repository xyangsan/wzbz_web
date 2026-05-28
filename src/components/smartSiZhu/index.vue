<template>
  <div class="wzbz_container wzbz_container_h">
    <Header :tabIndex="tabIndex" @back="onBack" @tab="onTab" />
    <van-swipe
      class="main_box"
      ref="swipeApi"
      :loop="false"
      :show-indicators="false"
      @change="onSwipeChange"
    >
      <van-swipe-item class="swiper-item">
        <Tab01
          :gzchat="gzchat"
          :gztipsTitleArr="gztipsTitleArr"
          :gztipsGanArr="gztipsGanArr"
          :gztipsZhiArr="gztipsZhiArr"
        />
      </van-swipe-item>
      <van-swipe-item class="swiper-item">
        <Tab02
          :style="viplevel > 0 ? 'filter: blur(0);' : 'filter: blur(5px);'"
          :gztipsGanArr="gztipsGanArr.slice(-4)"
          :gztipsZhiArr="gztipsZhiArr.slice(-4)"
          :liutongArr="liutongArr"
          :ganSSArr="ganSSArr"
          :zhiSSArr="zhiSSArr"
        />
        <div v-if="viplevel <= 0" class="vip_wrapper">
          <div class="vip_content_container">
            <div class="vip_content" v-html="vipContent"></div>
            <img
              class="vip_img"
              :src="openvipImg"
              alt="VIP图标"
              @click.stop="onVip"
            />
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item class="swiper-item">
        <Tab03
          :style="viplevel > 0 ? 'filter: blur(0);' : 'filter: blur(5px);'"
          :gztipsGanArr="gztipsGanArr.slice(-4)"
          :gztipsZhiArr="gztipsZhiArr.slice(-4)"
        />
        <div v-if="viplevel <= 0" class="vip_wrapper">
          <div class="vip_content_container">
            <div class="vip_content" v-html="vipContent"></div>
            <img
              class="vip_img"
              :src="openvipImg"
              alt="VIP图标"
              @click.stop="onVip"
            />
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item class="swiper-item">
        <Tab04
          :style="viplevel > 0 ? 'filter: blur(0);' : 'filter: blur(5px);'"
          :sex="sex"
          :gztipsGanArr="gztipsGanArr.slice(-4)"
          :gztipsZhiArr="gztipsZhiArr.slice(-4)"
          :ganSSArr="ganSSArr"
          :zhiSSArr="zhiSSArr"
        />
        <div v-if="viplevel <= 0" class="vip_wrapper">
          <div class="vip_content_container">
            <div class="vip_content" v-html="vipContent"></div>
            <img
              class="vip_img"
              :src="openvipImg"
              alt="VIP图标"
              @click.stop="onVip"
            />
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
    <div class="wzbz_container_bottom_button" @click="goToGanZhiSetting" v-if="tabIndex === 0">
      <img
        class="wzbz_container_bottom_button_icon"
        :src="buttonIcon"
        alt="干支设置"
      />
      干支设置
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import Header from './components/header.vue'
import Tab01 from './components/tab01.vue'
import Tab02 from './components/tab02.vue'
import Tab03 from './components/tab03.vue'
import Tab04 from './components/tab04.vue'
import { getLiuTong } from '@/api/bazi.js'
import { getShiShen, getShiShenOfZhi } from '@/views/paipan-result/utils'

const vipContentArr = [
  '\u3000\u3000流通代表八字五行循环相生，通行不悖，是判断命主格局层次的一个重要指标。<br>\u3000\u3000如果八字的流通性好，代表八字宫位接连相生，则命主能量利用效率高，遇事可逢凶化吉;如果流通性差，代表八字宫位多刑冲克害，则命主内心与环境冲突大，做事自我内耗、阻碍多。<br>\u3000\u3000问真八字流通图示，用形象化的方式标明命盘具体的流通走向，是您判断八字整体流通性的重要参考!',
  '\u3000\u3000八字年、月、日、时所居的位置，便是宫位。<br>\u3000\u3000宫位标记着时间、空间、身体、六亲等，由此可以推演出命主的诸多信息，是八字断命中一个不可忽略的侧面。<br>\u3000\u3000问真八字宫位图示，清晰简明的标明命主八字的宫位代表要素，方便您快速推断命局细节!',
  '\u3000\u3000命主的六亲，由五行间的生克关系所推导，通过“十神”所表达。<br>\u3000\u3000如:如果命主为女性，则食伤代表儿女。如进一步划分阴阳/性别，则与我同性者为食神，为女儿;与我异性者为伤官，为儿子。其他六亲依次类推。<br>\u3000\u3000问真八字六亲图示，基于命盘要素清晰标明六亲，方便您快速进行相关事项推导!',
]
export default {
  components: {
    Header,
    Tab01,
    Tab02,
    Tab03,
    Tab04,
  },
  props: {
    gzchat: {
      type: Array,
      default: () => [
        [
          [
            [
              [0, '壬'],
              [3, '丙'],
            ],
            '克',
            0,
            3,
          ],
        ],
        [
          [
            [
              [0, '子'],
              [1, '丑'],
              [2, '亥'],
            ],
            '三会水局',
            0,
            2,
          ],
          [
            [
              [1, '丑'],
              [2, '亥'],
              [3, '子'],
            ],
            '三会水局',
            1,
            2,
          ],
        ],
      ],
    },
    gztipsTitleArr: {
      type: Array,
      default: () => ['年柱', '月柱', '日柱', '时柱'],
    },
    gztipsGanArr: {
      type: Array,
      default: () => ['壬', '癸', '乙', '丙'],
    },
    gztipsZhiArr: {
      type: Array,
      default: () => ['子', '丑', '亥', '子'],
    },
    sex: {
      type: Number,
      default: 1,
    },
    parentIndex: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      tabIndex: -1,
      ganSSArr: [],
      zhiSSArr: [],

      // 干支
      // gzchat: [],
      // gztipsTitleArr: [],
      // gztipsGanArr: [],
      // gztipsZhiArr: [],

      // 流通
      liutongArr: [],

      // sex: 1,

      vipContent: '',
      openvipImg: '',
      buttonIcon: '',
    }
  },
  created() {
    this.buttonIcon = require('@/assets/images/ganzhi/icon_ganzhi_setting.png')
    delete window.isBack_vip
    this.initData()
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.onTab(0)
      }, 500)
    })
  },
  computed: {
    userguid() {
      return this.$store.getters.userguid
    },
    viplevel() {
      return this.$store.getters.viplevel
    },
  },
  watch: {
    gzchat: {
      handler() {
        if (this.tabIndex === 0 && (this.parentIndex === 1 || this.parentIndex === 2)) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.onTab(0)
            }, 500)
          })
        }
      },
      deep: true,
    },
    parentIndex: {
      handler() {
        if (this.tabIndex === 0 && (this.parentIndex === 1 || this.parentIndex === 2)) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.onTab(0)
            }, 500)
          })
        }
      },
      deep: true,
    },
  },
  methods: {
    initData() {
      // const route = this.$route
      // this.gzchat = JSON.parse(route.query.gzchat)
      // this.gztipsTitleArr = JSON.parse(route.query.tabHeaderArr)
      // this.gztipsGanArr = JSON.parse(route.query.gztipsGanArr)
      // this.gztipsZhiArr = JSON.parse(route.query.gztipsZhiArr)
      // this.gzchat = [
      //   [
      //     [
      //       [
      //         [0, '壬'],
      //         [3, '丙'],
      //       ],
      //       '克',
      //       0,
      //       3,
      //     ],
      //   ],
      //   [
      //     [
      //       [
      //         [0, '子'],
      //         [1, '丑'],
      //         [2, '亥'],
      //       ],
      //       '三会水局',
      //       0,
      //       2,
      //     ],
      //     [
      //       [
      //         [1, '丑'],
      //         [2, '亥'],
      //         [3, '子'],
      //       ],
      //       '三会水局',
      //       1,
      //       2,
      //     ],
      //   ],
      // ]
      // this.gztipsTitleArr = ['年柱', '月柱', '日柱', '时柱']
      // this.gztipsGanArr = ['壬', '癸', '乙', '丙']
      // this.gztipsZhiArr = ['子', '丑', '亥', '子']
      // this.sex = +route.query.sex
      this.tabIndex = 0

      const riZhu = this.gztipsGanArr.slice(-2)[0]
      this.ganSSArr = this.gztipsGanArr
        .slice(-4)
        .map((gan) => (gan && gan != '*' ? getShiShen(gan, riZhu) : '*'))
      this.zhiSSArr = this.gztipsZhiArr
        .slice(-4)
        .map((zhi) => (zhi && zhi != '*' ? getShiShenOfZhi(zhi, riZhu) : '*'))
    },
    onBack() {
      this.$router.back()
    },
    onTab(index = 0) {
      this.onSwipeChange(index)
      this.$refs.swipeApi.swipeTo(index)
    },
    async onSwipeChange(index) {
      const heights = ['600px', '380px', '750px', '440px']
      // 选择ganzhi_tab01_wrapper
      if (index === 0) {
        const eles = document.querySelectorAll('.ganzhi_tab01_wrapper')
        if (eles.length === 0) return
        const h = eles[this.parentIndex === 1 ? 0 : 1].offsetHeight
        document.documentElement.style.setProperty(
          '--main-box-height',
          `${h}px`,
        )
      } else {
        document.documentElement.style.setProperty(
          '--main-box-height',
          `${heights[index]}`,
        )
      }
      if (this.viplevel > 0) {
        if (index === 1 && this.liutongArr.length === 0) {
          let bz = ''
          const gztipsGanArr = this.gztipsGanArr.slice(-4),
            gztipsZhiArr = this.gztipsZhiArr.slice(-4)
          gztipsGanArr.forEach((gan, index) => {
            bz += gan + gztipsZhiArr[index]
          })
          await getLiuTong(bz, this.userguid, this.viplevel).then((res) => {
            this.liutongArr = res.data.split(',')
          })
        }
      } else {
        if (index === 1 && this.liutongArr.length === 0) {
          this.liutongArr = [
            'lt_sy',
            'lt_zh',
            'lt_sz',
            'lt_ks',
            'lt_ks',
            'lt_zs',
            'lt_sx',
            'lt_h',
            'lt_kh',
            'lt_zh',
          ]
        }
        if (index > 0) {
          this.openvipImg = require('@/assets/images/ganzhi/gzropenvip.png')
          this.vipContent = vipContentArr[index - 1]
        }
      }
      this.tabIndex = index
    },
    onVip() {
      window.isBack_vip = true
      this.$router.push('/vip-page/index')
    },
    goToGanZhiSetting() {
      this.$emit('goToGanZhiSetting')
    },
  },
}
</script>

<style lang="scss" scoped>

.wzbz_container {
  background-color: white;
  height: 100%;
  // min-width: 1025px;
  // max-width: 1350px;
  width: 100%;
  ::-webkit-scrollbar {
    width: 10px;
    height: 5px;
  }
  :hover::-webkit-scrollbar-thumb {
    border-radius: 30px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #dedfe1;
  }
  .main_box {
    box-sizing: border-box;
    // height: calc(100% - 15px);
    // padding: 15px 0;
    overflow: hidden;
    width: 100%;
    position: relative;
    height: var(--main-box-height);

    .swiper-item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      width: 25% !important;
      position: relative;
    }

    .vip_wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      filter: blur(0);
      display: flex;
      justify-content: center;
      align-items: center;

      .vip_content_container {
        box-sizing: border-box;
        width: 475px;
        // margin: 0 auto;
        // margin-top: 80px;
        padding: 28px;
        line-height: 24px;
        color: #101010;
        font-size: 14px;
        // font-weight: bold;
        border-radius: 15px;
        background-color: #fff;
        border: 1px solid #bbbbbb;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
      }

      .vip_content {
        box-sizing: border-box;
        text-align: justify;
      }

      .vip_img {
        width: 166px;
        margin-top: 20px;
      }
    }
  }

  .wzbz_container_bottom_button {
    box-sizing: border-box;
    width: 100%;
    height: 54px;
    border-top: 1px solid #e5e5e5;
    font-size: 15px;
    color: $themeColor;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    .wzbz_container_bottom_button_icon {
      width: 20px;
      margin-right: 5px;
    }
  }
}

:deep(.van-swipe__track) {
  justify-content: center;
  align-items: center;
}
</style>
