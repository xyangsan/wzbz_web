<template>
  <div class="bz-list">
    <div class="bz-card" v-for="(item, i) in list" :key="i" @click="power != 2 ? onClick(item) : ''">
      <img class="card-icon-sx" src="../../../assets/images/sx_1.png" alt="" />
      <div class="bz-card-userinfo">
        <label style="color: black; font-weight: bold; margin-bottom: 10px"
          >{{ item.name }}
          <label style="color: #c2c2c5">{{ item.sex == 1 ? "男" : "女" }}</label></label
        >
        <label style="color: #c2c2c5">{{ "阳历：" + item.solar.split(' ')[0]+'日' }}</label>
      </div>
      <div class="bz-card-look">
        <label>查看</label>
      </div>
      <!-- <el-collapse-transition> -->
      <div
        v-if="power == 1 && isMenu"
        style="position: absolute; right: 0%; top: 30%; padding: 10px"
        @click.stop="onMenu(i)"
      >
        <el-icon style="transform: rotate(90deg)"><MoreFilled /></el-icon>
      </div>
      <div
        v-if="power == 2 && isMenu"
        style="position: absolute; right: -10%; top: 15%; padding: 10px"
      >
        <el-checkbox-group v-model="checksBoxArr">
          <el-checkbox :label="i" size="large"></el-checkbox>
        </el-checkbox-group>
      </div>
      <transition name="el-fade-in-linear">
        <div
          v-if="menuPosition == i && power == 1"
          style="
            top: 25%;
            right: 2%;
            position: absolute;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 10px 1px #c4c4c4;
            z-index: 3;
            font-size: 14px;
          "
        >
          <li
            style="
              padding-top: 7.5px;
              padding-bottom: 7.5px;
              font-weight: bold;
              border-bottom: 1px solid #eeeeee;
              width: 100%;
              padding-left: 10px;
              padding-right: 10px;
            "
            @click.stop="onDel(i)"
          >
            删除
          </li>
          <li
            v-if="false"
            style="
              padding-top: 7.5px;
              font-weight: bold;
              padding-bottom: 7.5px;
              border-bottom: 1px solid #eeeeee;
              width: 100%;
              padding-left: 10px;
              padding-right: 10px;
            "
            @click.stop="onTop(i)"
          >
            置顶
          </li>
        </div>
      </transition>
      <!-- </el-collapse-transition> -->

      <!-- <div >sdsd</div> -->
    </div>
  </div>
  <!-- 删除的dialog -->
  <div class="checkdialog-box" v-if="power == 2 && isMenu">
    <div
      @click.stop="onDialog(index)"
      class="checkdialog-item pointer"
      v-for="(item, index) in checksArr"
      :key="index"
    >
      <img
        class="checkdialog-item-icon"
        :src="require('../../../assets/images/' + item.icon)"
      />
      <label>{{ item.name }}</label>
    </div>
  </div>
  <!-- 遮罩层 -->
  <div
    @click="onCloseMenu"
    class="dialog-mask"
    v-if="menuPosition != -1 && power == 1"
  ></div>
</template>

<script>
const checksArr = [
  {
    name: "取消",
    icon: "bz_card_cancle.png",
  },
  {
    name: "删除",
    icon: "bz_card_del.png",
  },
  {
    name: "全选",
    icon: "bz_card_all.png",
  },
];
var isCheckArrDel = false;

export default {
  name: "CardCY",
  emits: ["onCheckCancle", "onClick", "onCheckDel", "onMenuDel", "onMenuTop"],
  props: {
    isMenu: {
      default: false,
      type: Boolean,
      //可操作的功能：0什么都不显示：1：更多菜单栏；2：复选框多选
    },
    list: Array,
    power: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 40,
      //滚动加载每次加载的数量
    },
  },
  data() {
    return {
      menuPosition: -1, //菜单栏选中的下标
      checksArr, //dialog静态数据
      checksBoxArr: [], //保留已经勾选的数组
      
    };
  },

  mounted() {},

  methods: {
    // 单击跳转到详细信息
    onClick(item) {
      this.$emit("onClick", item);
    },

    //显示菜单栏
    onMenu(position) {
      console.log("菜单栏", this.menuPosition, position);
      if (this.menuPosition == position) {
        this.menuPosition = -1;
        return;
      }
      this.menuPosition = position;
    },

    // 置顶
    onTop(position) {
      console.log("置顶");
      this.menuPosition = -1;
      this.$emit("onMenuTop", position);
    },

    // 菜单栏选中的单个栏目删除
    onDel(position) {
      console.log("删除");
      this.menuPosition = -1;
      this.$emit("onMenuDel", position);
    },

    // 关闭菜单栏
    onCloseMenu() {
      this.menuPosition = -1;
    },

    // dialog的各项操作
    onDialog(i) {
      console.log("sdsd");

      switch (i) {
        case 0:
          this.$emit("onCheckCancle");
          break;
        case 1:
          this.checksBoxArr.sort((a,b)=>{
            return a - b
          })
          this.$emit("onCheckDel", this.checksBoxArr);
          this.checksBoxArr = [];
          break;
        case 2:
          let arr = [];
          if (!isCheckArrDel)
            for (let i = 0; i < this.list.length; i++) {
              arr.push(i);
            }
          this.checksBoxArr = arr;
          isCheckArrDel = !isCheckArrDel;
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  padding-left: 0;
}

li {
  list-style: none;
}

.bz-list {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
  overflow: hidden;
  align-items: flex-start;
}
.bz-card {
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eeeeee;
  padding-bottom: 20px;
  padding-top: 20px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 48%;
  min-width: 48%;
  margin-right: 2%;
  white-space: nowrap;
  // background-color: violet;
}

.card-icon-sx {
  width: 50px;
  height: 50px;
  background-color: black;
  border-radius: 50%;
  margin-right: 10px;
}
.bz-card-userinfo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.bz-card-look {
  position: absolute;
  right: 5%;
  top: 35%;
  margin-left: 30px;
  margin-right: 12.25px;
  display: flex;
  font-size: 15px;
  flex-direction: column;
  border-radius: 20px;
  background-color: #b2955b;
  color: white;
  font-size: 12px;
  padding: 5px 15px 5px 15px;
}

.bz-card-gz-t {
  padding: 1px 2px 1px 2px;
  text-align: center;
  background-color: #b2955b;
  margin-right: 5px;
  padding: 2px 5px 2px 5px;
  border-radius: 50%;
  color: white;
}

::v-deep .el-input__inner {
  background-color: transparent;
  height: 35px;
}

::v-deep .el-input__wrapper {
  border-radius: 20px;
  background-color: #f5f5f7;
}

::v-deep .is-focus {
  box-shadow: unset;
}

::v-deep .el-button--primary {
  background-color: white;
  color: black;
  border-color: transparent;
  box-shadow: 0 0 3px 1px #c4c4c4;
}

// 修改选择框颜色
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border-color: #b2955b !important;
  background-color: #b2955b !important;
}
::v-deep .el-checkbox__inner:hover {
  border-color: #b2955b !important;
}

::v-deep .el-checkbox {
  color: #111;
  margin-right: 30px;
  font-size: 60px;
  margin-bottom: 18px;
}
// 修改选择框大小
::v-deep .el-checkbox__inner {
  transform: scale(140%);
}

//不让check的label渲染
::v-deep .el-checkbox__label {
  display: none;
}

.checkdialog-box {
  position: fixed;
  bottom: 0%;
  left: 5%;
  display: flex;
  background-color: white;
  border: 1px solid #bbbbbb;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  color: #808080;
  padding-top: 15px;
  padding-bottom: 15px;
  width: 90%;
  z-index: 3;
}
.checkdialog-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex: 1;
}
.checkdialog-item-icon {
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
}

.dialog-mask {
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  background-color: rgba(168, 168, 168, 0.295);
}
</style>
