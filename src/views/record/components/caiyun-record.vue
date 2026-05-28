<template>
  <div class="cy-record-box">
    <div style="width: 90%; margin: 0 auto">
      <CUSSearch :isMoreDel="isMoreDel" @onSearch="onSearch" @onSelectDel="onSelectDel" />
      <el-scrollbar style="height: 100%" :noresize="true">
        <div
          v-infinite-scroll="load"
          infinite-scroll-distance="10"
          :infinite-scroll-immediate="false"
          style="height: 100%; width: 100%"
        >
          <CURDCY
            :power="cyPower"
            :list="recordList"
            :isMenu="true"
            @onClick="onDetail"
            @onMenuDel="onMenuDel"
            @onCheckDel="onCheckDel"
            @onCheckCancle="onCheckCancle"
            @onMenuTop="onMenuTop"
          />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import CUSSearch from "@/components/searchBox/index";
import CURDCY from "./card-cy";
import model from "./../assets/model.js";
import * as homeApi from "@/api/home-api";

const tests = [
  {
    name: "案例1",
    datestr: "2022-06-21 00:00:00",
    sex: 1,
    solar: "2022年6月21日",
    orderid: "asdasd1as54d8wd841as1b",
    star: -1, //存储个时间戳？初始化的时候默认时间戳为-1 先按时间戳进行排序，然后在进行时间排序
  },
  {
    name: "案例2",
    datestr: "2022-06-20 00:00:00",
    sex: 1,
    solar: "2022年6月20日",
    orderid: "wddddddddddddddasdddww",
    star: -1,
  },
  {
    name: "案例3",
    datestr: "2022-06-23 00:00:00",
    sex: 1,
    solar: "2022年6月23日",
    orderid: "cccccccccccccccccccccc",
    star: -1,
  },
  {
    name: "案例4",
    datestr: "2022-06-24 00:00:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "dddddddddddddddddddddd",
    star: -1,
  },
  {
    name: "案例5",
    datestr: "2022-06-19 01:00:00",
    sex: 1,
    solar: "2022年6月19日",
    orderid: "awwwwwwwwwwwwwwwwwwwww",
    star: 1655881803,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例8",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例8",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例8",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例8",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例8",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例8",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例8",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例8",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例8",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例8",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例8",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例8",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例8",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例8",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
  {
    name: "案例6",
    datestr: "2022-06-24 01:01:00",
    sex: 1,
    solar: "2022年6月24日",
    orderid: "gggggggggggg5332342344",
    star: -1,
  },
  {
    name: "案例7",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "gffghfghfghfghfghfghhh",
    star: -1,
  },
  {
    name: "案例9",
    datestr: "2022-06-22 00:00:00",
    sex: 1,
    solar: "2022年6月22日",
    orderid: "asdasd1assadasdasdweee",
    star: -1,
  },
];

export default {
  name: "CaiYunRecord",
  components: {
    CUSSearch,
    CURDCY,
  },
  data() {
    return {
      tests,
      recordList: [],
      recordListX: [],
      isMoreDel: false,
      cyPower: 1,
      count: 40,
      delOrderid: [],
    };
  },
  created() {
    this.initData();
  },

  mounted() {},

  methods: {
    async initData() {
      //获取财运
      let data = await model.getCaiYunList("eb3e6a89-dbf2-481f-835c-24108ee2d05f");
      this.recordList = data;
      this.recordListX = JSON.parse(JSON.stringify(data));
      this.recordList = JSON.parse(JSON.stringify(this.recordListX)).slice(0, this.count);
      console.log("拿到的财运列表：", data);
    },
    onDetail(item) {
      console.log("拿到啦", item);
    },
    onSearch(text) {
      this.recordList = this.recordListX.filter((item) => {
        return item.name.indexOf(text) != -1;
      });
      console.log("搜索", text);
    },
    onSelectDel(isMoreDel) {
      console.log("选中删除");
      this.isMoreDel = isMoreDel;
      this.cyPower = isMoreDel ? 2 : 1;
    },
    onCheckDel(arr) {
      console.log("删除啦：", arr);
      //拿到了position，进行定位到当前的dom进行删除；并且根据position取到对应的orderid然后在总缓存里面进行删除即可
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
      this.cyPower = 1;
      this.synUserArr();
      // arr.foreach((item) => {
      //   //删除了之后会改变原有的顺序
      //   this.tests.splice(item, 1);
      // });
      // if (flag) this.bzPower = 2;
      // else this.bzPower = 1;
    },
    onCheckCancle() {
      this.isMoreDel = false;
      this.cyPower = 1;
    },
    onMenuDel(position) {
      let res = this.recordList.splice(position, 1);
      this.delOrderid.push(res[0].orderid);
      this.synUserArr();
    },
    load() {
      console.log("加载更多");
      if (this.count > this.recordListX.length) return;
      this.count += 40;
      this.recordList = JSON.parse(JSON.stringify(this.recordListX)).slice(0, this.count);
    },
    onMenuTop(positon) {
      let star = Math.round(new Date() / 1000);
      this.recordList[positon].star = star;
      this.recordList.sort((a, b) => {
        return b.star - a.star;
      });
      //如何定位到对应的item？根据recordID进行定位，然后对应的进行改变即可
    },
    synUserArr(){
       this.delOrderid.forEach(async (item) => {
        let url = "delcy.php?";
        let parms = "guid=" + "eb3e6a89-dbf2-481f-835c-24108ee2d05f" + "&orderid=" + item;
        await homeApi
          .Request(url, parms)
          .then((res) => {
            console.log("成功删除！", res);
          })
          .catch((err) => {
            console.log("删除失败！", err);
          });
      });
    }
  },
  deactivated: function () {
    //将案例保存到服务器中
    //await this.synUserArr();
    console.log("删除啦");
  },
};
</script>

<style lang="scss" scoped>
.cy-record-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  height: 1200px;
  min-height: 800px;
  overflow: hidden;
}
</style>

