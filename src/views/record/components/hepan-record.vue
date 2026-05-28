<template>
  <div class="paipanR-box">
    <CUSSearch
      :showDel="false"
      :isMoreDel="isMoreDel"
      from="hepanRecord"
      @onSearch="onSearch"
      @onSelectDel="onSelectDel"
      @onFocus="searchFocus"
    />
    <!--合盘卡片组件 -->
    <!-- <el-scrollbar :noresize="true"> -->
    <CardHP
      @onItem="onCardItem"
      @onMenuTop="onMenuTop"
      @onMenuDel="onMenuDel"
      @onCheckDel="onCheckDel"
      @onCheckCancle="onCheckCancle"
      :power="hpPower"
      :list="recordList"
      :listX="recordListX"
      :isMenu="true"
    />
    <!-- </el-scrollbar> -->
    <div ref="loadMoreTrigger" class="loading-trigger"></div>
    <NoVIPBox
      v-if="isNavVip"
      title="合盘功能"
      content="亲爱的问真用户，成为问真会员方可使用合盘功能"
      btnText="开通会员"
      @onClose="onNoVIP"
    />
  </div>
</template>

<script>
import CUSSearch from "@/components/searchBox/index";
import CardHP from "./card-hp";
import model from "./../assets/model.js";
import router from "@/router";
import NoVIPBox from "@/components/noVIPBox";
import store from "@/store";
import { mapGetters } from "vuex";

import * as homeApi from "@/api/home-api";

export default {
  name: "HePanRecord",
  components: {
    CUSSearch,
    CardHP,
    NoVIPBox,
  },
  data() {
    return {
      recordList: [],
      recordListX: [],
      isMoreDel: false,
      hpPower: 1,
      count: 20,
      delOrderid: [],
      vipleval: store.getters.viplevel,
      isNavVip: false,
    };
  },
  created() {
    this.initData();
  },
  computed: {
    ...mapGetters({
      guid: "userguid",
      updateHepan: "updateHepan",
    }),
    isClickMask() {
      return store.getters.isClickMask
    },
  },
  watch: {
    guid() {
      if (store.getters.userguid == "") {
        console.log("清空了吗：", store);
        this.recordList = [];
        this.recordListX = [];
      }
    },
    updateHepan: {
      async handler() {
        this.updateHepan ? this.initData() : "";
        await store.dispatch("paipan/setUpdateHepai", false);
      },
    },
    isClickMask: {
      handler(val) {
        if (val) {
          this.isMoreDel = false
          this.hpPower = 1
        }
      },
    },
  },
  mounted() {
    const loadMoreTrigger = this.$refs.loadMoreTrigger
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.load()
      }
    })
    observer.observe(loadMoreTrigger)
  },
  // activated() {
  //   window.addEventListener("scroll", this.scroll);
  // },

  methods: {
    async initData() {
      if (this.guid == "") return;
      this.recordList = await model.getHepanList(this.guid);
      this.recordListX = JSON.parse(JSON.stringify(this.recordList));
      this.recordList = JSON.parse(JSON.stringify(this.recordListX)).slice(0, this.count);
    },
    // scroll(e) {
    //   let element = e.target.scrollingElement;
    //   if (element.scrollHeight - element.scrollTop === element.clientHeight) {
    //     // console.log(
    //     //   "hp,到底不啦",
    //     //   element.scrollHeight,
    //     //   e.target.scrollingElement.scrollTop,
    //     //   element.clientHeight
    //     // );
    //     if (this.count > this.recordListX.length) return;
    //     this.count += 40;
    //     this.recordList = JSON.parse(JSON.stringify(this.recordListX)).slice(
    //       0,
    //       this.count
    //     );
    //   }
    // },
    load() {
      console.log("load");
      if (this.count > this.recordListX.length) return;
      this.count += 40;
      this.recordList = JSON.parse(JSON.stringify(this.recordListX)).slice(0, this.count);
    },
    async onCardItem(content) {
      if (this.vipleval < 0) {
        this.isNavVip = true;
        return;
      }
      console.log(JSON.stringify(content.parms.info1));
      const obj = {
        info1: JSON.stringify(content.parms.info1),
        info2: JSON.stringify(content.parms.info2),
      };
      router.push({ path: "/hepan-result/index", query: obj });
    },

    onBack() {
      this.$router.go(-1);
    },
    onNoVIP() {
      this.isNavVip = false;
    },

    //过去合盘列表数据[{orderid:'',parms:"{}"}]
    onSearch(text) {
      console.log("sdsd");
      this.recordList = this.recordListX.filter((item) => {
        return (
          item.parms.info1.name.indexOf(text) != -1 ||
          item.parms.info2.name.indexOf(text) != -1
        );
      });
    },
    onSelectDel(isMoreDel) {
      this.isMoreDel = isMoreDel;
      this.hpPower = isMoreDel ? 2 : 1;
    },
    onMenuTop(position) {
      console.log("置顶了", position);
      let star = Math.round(new Date() / 1000);
      this.recordList[position].parms.star = star;
      this.recordList.sort((a, b) => {
        return b.parms.star - a.parms.star;
      });
    },
    onMenuDel(position) {
      let res = this.recordList.splice(position, 1);
      this.delOrderid.push(res[0].orderid);
      this.synUserArr();
    },
    onCheckDel(arr) {
      console.log("删除啦：", arr);
      let delItems = [];
      let delPositions = [];

      for (let i = arr.length - 1; i >= 0; i--) {
        let delItem = this.recordList.splice(arr[i], 1);
        this.delOrderid.push(delItem[0].orderid);
        delItems.push(delItem[0]);
      }

      for (let i = 0; i < this.recordListX.length; i++) {
        const element = this.recordListX[i];
        for (let j = 0; j < delItems.length; j++) {
          const item = delItems[j];
          if (element.orderid.includes(item.orderid)) {
            delPositions.push(i);
            break;
          }
        }
      }

      //拿到了position，进行定位到当前的dom进行删除；并且根据position取到对应的orderid然后在总缓存里面进行删除即可
      for (let i = delPositions.length - 1; i >= 0; i--) {
        this.recordListX.splice(delPositions[i], 1);
      }
      this.isMoreDel = false;
      this.hpPower = 1;
      this.synUserArr();
    },
    onCheckCancle() {
      this.isMoreDel = false;
      this.hpPower = 1;
    },
    synUserArr() {
      this.delOrderid.forEach(async (item) => {
        let url = "delhepan.php?";
        let parms = "guid=" + this.guid + "&orderid=" + item;
        await homeApi
          .Request(url, parms)
          .then((res) => {
            console.log("成功删除！", res);
          })
          .catch((err) => {
            console.log("删除失败！", err);
          });
      });
    },
    searchFocus() {
      this.isMoreDel = false
      this.hpPower = 1
    },
  },
  // deactivated: function () {
  //   //将案例保存到服务器中
  //   window.removeEventListener("scroll", this.scroll);

  //   //await this.synUserArr();
  //   console.log("删除啦");
  // },
};
</script>

<style lang="scss" scoped>
ul {
  padding-left: 0;
}

li {
  list-style: none;
}

.s {
  border-radius: 30px;
}

::v-deep .popup-box {
  width: 500px !important;
}
.paipanR-box {
  padding: 40px;
}
:deep(.search-box) {
  margin-top: 0;
  .search-input {
    width: 435px !important;
    height: 47px;
    flex: unset;
  }
}
// :deep(.groups-container) {
//   padding: 30px 0 !important;

//   .groups-items-input {
//     width: 240px;
//   }
// }
:deep(.bz-list) {
  justify-content: space-between;
  padding-bottom: 0 !important;
  .bz-card {
    width: calc((100% - 14px) / 2) !important;
    margin-right: 0 !important;
    // padding-right: 30px;
    border: 1px solid #f0f0f0 !important;
    border-radius: 10px !important;
    // margin-bottom: 14px !important;
    margin-top: 14px !important;
    height: 92px !important;
    padding: 0 !important;
    padding-left: 20px !important;
    // overflow: hidden;

    // 第一二个卡片的margin-top
    &:nth-child(1),
    &:nth-child(2) {
      margin-top: 0 !important;
    }
    .bz-card-gz {
      position: unset;
      margin-left: auto;
      margin-right: 0;
    }
    .bz-card-option {
      position: unset !important;
      margin-left: 75px;
      height: 100% !important;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 !important;
      width: 27px !important;
      background-color: #f5f5f7 !important;
      border-top-right-radius: 10px !important;
      border-bottom-right-radius: 10px !important;
      .el-icon {
        width: 20px;
        height: 20px;
        svg {
          width: 20px;
          height: 20px;
        }
      }
      &:hover {
        .el-icon {
          svg {
            path {
              fill: #b2955b;
            }
          }
        }
      }
    }
    .card-icon-sx {
      position: absolute;
      margin-right: 0;
      right: 50px;
    }
  }
}
:deep(.dialog-mask) {
  background-color: unset;
}
:deep(.search-box) {
  margin-top: 0 !important;
  margin-bottom: 27px;
  .search-input {
    width: 435px !important;
    height: 47px !important;
    flex: unset;
  }
  .options {
    width: 120px !important;
    .option {
      width: 100% !important;
    }
  }
}
</style>
