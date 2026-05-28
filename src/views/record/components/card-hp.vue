<template>
  <div class="hepanR-root">
    <div class="record-application">
      <div
        :class="['list-item', 'pointer', menuPosition == i ? 'list-item-active' : '']"
        v-for="(item, i) in list"
        :key="i"
        @click="onItem(item, i)"
      >
        <div class="img-decorate-left">
          <img
            :src="
              require('../../../assets/images/sx_' +
                (item.parms.info1.sx + 1) +
                '.png')
            "
            class="hepanR-icon-sx"
          />
        </div>
        <div class="content-left">
          <label>
            {{ item.parms.info1.name.substring(0, 3)
            }}{{ item.parms.info1.name.length > 3 ? '‧‧‧' : '' }}
          </label>
          <label style="font-size: 13px; color: #c2c2c5; margin-left: 4px;">
            {{ item.parms.info1.sex == 1 ? '男' : '女' }}
          </label>
        </div>
        <div class="content-center">
          <img
            src="../../../assets/images/hepan_icon.png"
            style="width: 46px; height: 46px"
          />
        </div>
        <div class="content-right">
          <label style="font-size: 13px; color: #c2c2c5; margin-right: 2px;">
            {{ item.parms.info2.sex == 1 ? '男' : '女' }} 
          </label>
          <label>
            {{ item.parms.info2.name.substring(0, 3)
            }}{{ item.parms.info2.name.length > 3 ? '‧‧‧' : '' }}
          </label>
        </div>
        <div class="img-decorate-right">
          <img
            :src="
              require('../../../assets/images/sx_' +
                (item.parms.info2.sx + 1) +
                '.png')
            "
            class="hepanR-icon-sx"
          />
        </div>
        <div
          class="list-item-option-1"
          v-if="power == 1 && isMenu"
          @click.stop="onMenu(i)"
        >
          <el-icon style="transform: rotate(90deg)"><MoreFilled /></el-icon>
        </div>
        <div
          class="list-item-option-1 list-item-option-2"
          v-if="power == 2 && isMenu"
        >
          <el-checkbox-group v-model="curSelects">
            <div style="width: 30px;height: 30px;position: absolute;top:50%;right: 12px;transform: translateY(-50%);z-index: 888;"></div>
            <el-checkbox
              :label="i"
              size="large"
              @click.stop="clickCheck"
            ></el-checkbox>
          </el-checkbox-group>
        </div>
        <transition name="el-fade-in-linear">
          <div class="list-item-menu" v-if="menuPosition == i && power == 1">
            <li class="list-item-menu-item pointer" @click.stop="onDel(i)">
              删除
            </li>
            <li
              class="list-item-menu-item pointer"
              v-if="false"
              @click.stop="onTop(i)"
            >
              置顶
            </li>
          </div>
        </transition>
      </div>
    </div>
  </div>
  <!-- 下啦选择框 -->

  <!-- 删除的dialog -->
  <div class="checkdialog-box" v-if="power == 2 && isMenu">
    <div
      class="checkdialog-item pointer"
      v-for="(item, index) in checksArr"
      :key="index"
      :style="{ color: item.color }"
    >
      <div
        @click.stop="onDialog(index)"
        @mousemove="mousemove(index)"
        @mouseleave="mouseleave(index)"
      >
        <img
          class="checkdialog-item-icon"
          :src="require('../../../assets/images/' + item.icon)"
        />
        <div style="font-weight: bold">{{ item.name }}</div>
      </div>
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
    name: '取消',
    icon: 'bz_card_cancle.png',
    color: '#808080',
  },
  {
    name: '删除',
    icon: 'bz_card_del.png',
    color: '#808080',
  },
  {
    name: '全选',
    icon: 'bz_card_all.png',
    color: '#808080',
  },
]
var isCheckArrDel = false
export default {
  name: 'CardHP',
  emits: ['onMenuDel', 'onMenuTop', 'onCheckDel', 'onCheckCancle', 'onItem'],
  props: {
    list: {
      type: Array,
      defalut: [],
    },
    listX: {
      type: Array,
      defalut: [],
    },
    power: {
      type: Number,
      defalut: 0,
    },
    isMenu: {
      type: Boolean,
      defalut: false,
    },
  },
  data() {
    return {
      selectedPath: '../../assets/images/icon-selected.png',
      unselectedPath: '../../assets/images/icon-unselected.png',
      curSelects: [], //选中的集合
      menuPosition: -1,
      checksArr: checksArr,
      checkdialogL: (document.body.clientWidth - 845) / 2,
    }
  },
  mounted() {
    window.onresize = () =>
      (() => {
        this.checkdialogL = (document.body.clientWidth - 845) / 2
      })()
  },
  computed: {
    isAllSelected() {
      return this.curSelects.length === this.listX.length
    },
  },

  methods: {
    clickCheck() {},
    onItem(item, position) {
      if (this.power == 2) {
        if (this.curSelects.indexOf(position) == -1) {
          this.curSelects.push(position)
        } else {
          //搜索到对应的值所带有的下标
          this.curSelects.splice(this.curSelects.indexOf(position), 1)
        }
        return
      }
      this.$emit('onItem', item)
    },
    onMenu(position) {
      console.log('菜单栏', this.menuPosition, position)
      this.menuPosition = position
    },
    onTop(position) {
      console.log('置顶')
      this.$emit('onMenuTop', position)
      this.menuPosition = -1
    },
    onDel(position) {
      this.$emit('onMenuDel', position)
      this.menuPosition = -1

      console.log('单个的删除下标', position)
    },
    // 关闭菜单栏
    onCloseMenu() {
      this.menuPosition = -1
    },

    // dialog的各项操作
    onDialog(i) {
      switch (i) {
        case 0:
          this.$emit('onCheckCancle')
          break
        case 1:
          this.curSelects.sort((a, b) => {
            return a - b
          })
          this.$emit('onCheckDel', this.curSelects)
          this.curSelects = []
          break
        case 2:
          let arr = []
          if (!isCheckArrDel)
            for (let i = 0; i < this.listX.length; i++) {
              arr.push(i)
            }
          this.curSelects = arr
          isCheckArrDel = !isCheckArrDel
          break
      }
    },
    mousemove(index) {
      if (index === 2 && this.isAllSelected) return;
      this.checksArr[index].color = "#b2955b";
      this.checksArr[index].icon = this.checksArr[index].icon.indexOf("_s.png") == -1 ? this.checksArr[index].icon.replace(".png", "_s.png") : this.checksArr[index].icon;
    },
    mouseleave(index) {
      if (index === 2 && this.isAllSelected) return;
      this.checksArr[index].color = "#808080";
      this.checksArr[index].icon = this.checksArr[index].icon.indexOf("_s.png") != -1 ? this.checksArr[index].icon.replace("_s.png", ".png") : this.checksArr[index].icon;
    },
  },
  watch: {
    // power: {
    //   handler(val) {
    //     if (val == 2) {
    //       this.checksArr = JSON.parse(JSON.stringify(checksArr));
    //     }
    //   },
    //   immediate: true,
    // },
    isAllSelected: {
      handler(val) {
        if (val) {
          this.checksArr[2].color = "#b2955b";
          this.checksArr[2].icon = this.checksArr[2].icon.indexOf("_s.png") == -1 ? this.checksArr[2].icon.replace(".png", "_s.png") : this.checksArr[2].icon;
        } else {
          this.checksArr[2].color = "#808080";
          this.checksArr[2].icon = this.checksArr[2].icon.indexOf("_s.png") != -1 ? this.checksArr[2].icon.replace("_s.png", ".png") : this.checksArr[2].icon;
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
li {
  list-style: none;
}

.hepanR-root {
  // height: 100vh;
  width: 100%;
  // padding-bottom: 80px;
  // background-color: #eeeeee;
}

.record-application {
  background-color: #ffffff;
  font-size: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.list-item {
  /* background-color: rgb(202, 145, 70); */
  background-color: white;
  // border-radius: 20px;
  // width: 45%;
  // min-width: 45%;
  // margin-right: 10%;
  // margin-bottom: 10px;
  // margin-right: 10%;

  height: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // padding: 40px;
  // height: 111px;
  // border-bottom: 1px solid #eeeeee;
  position: relative;
  //   background-color: aquamarine;
  // margin-bottom: 5px;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  height: 92px;
  width: calc((100% - 14px) / 2);
  margin-top: 14px;
  &:first-child,
  &:nth-child(2) {
    margin-top: 0;
  }
}

:deep(.list-item-active) {
  background-color: rgba($color: #000, $alpha: 0.05);
  .list-item-option-1 {
    background-color: rgba($color: #b2955b, $alpha: 0.1) !important;
    .el-icon {
      svg {
        path {
          fill: #b2955b !important;
        }
      }
    }
  }
}

.list-item:nth-child(2n) {
  margin-right: 0%;
}

.image-decorate-left {
  top: 100%;
  background-color: black;
  width: 35px;
  height: 35px;
  border-radius: 17.5px;
  display: flex;
  margin-left: 5px;
}

.image-decorate-right {
  background-color: black;
  width: 37.5px;
  height: 37.5px;
  border-radius: 17.5px;
  margin-right: 5px;
  position: absolute;
  right: 1%;
}

.content-left {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-left: 10px;
  height: 100%;
  margin-right: auto;
}

.content-selected-icon {
}

.content-center {
  // position: absolute;
  // left: 43%;
  // top: 27.5%;
  font-size: 12px;

  // background-color: antiquewhite;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding-right: 27px;
}

.content-right {
  display: flex;
  align-items: center;
  margin-right: 10px;
  font-size: 16px;
  height: 100%;
  // position: absolute;
  // right: 11%;
  // top: 1%;
  margin-left: auto;
}

/* .cover{
    z-index: 1999;
    position: fixed;
    height: 500vw;
    width: 500vw;
    background-color: (0,0,0,0.8);
  } */

.record-select-down {
  background-color: #eeeeee;
  position: fixed;
  bottom: 0;
  width: 375px;
}

.item-delete {
  display: flex;
  background-color: white;
  font-size: 14px;
  border-top-left-radius: 12.25px;
  border-top-right-radius: 12.25px;
  height: 50px;
  border-bottom: 1px solid #eeeeee;
}

.item-selectAll {
  display: flex;
  background-color: white;
  font-size: 14px;
  height: 50px;
  border-bottom-left-radius: 12.25px;
  border-bottom-right-radius: 12.25px;
  margin-bottom: 7.5px;
}

.item-cancle {
  display: flex;
  background-color: white;
  height: 50px;
  font-size: 14px;
  border-top-left-radius: 12.25px;
  border-top-right-radius: 12.25px;
  border-bottom: 1px solid #eeeeee;
}

.img-decorate-left {
  // position: absolute;
  // top: 25%;
  // left: 0%;
  // background-color: aqua;
  margin-left: 30px;
}
.img-decorate-right {
  // position: absolute;
  // top: 25%;
  // right: 4%;
  // background-color: aqua;
  margin-right: 30px;
}

.hepanR-icon-delete {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 2%;
}

.hepanR-icon-select {
  width: 20px;
  height: 20px;
  margin: auto;
  margin-left: 5px;
  margin-right: 5px;
}

.hepanR-icon-center {
  height: 46px;
  width: 46px;
}

.hepanR-icon-sx {
  width: 53px;
  height: 53px;
  background-color: rgb(0, 0, 0);
  border-radius: 50%;
}

.hepanR-icon-back {
  width: 8.6px;
  height: 15px;
  position: absolute;
  left: 2%;
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
  // margin-right: 30px;
  // font-size: 60px;
  // margin-bottom: 18px;
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
  left: calc(50% - 416px);
  display: flex;
  background-color: white;
  border: 1px solid #bbbbbb;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  color: #808080;
  // padding-top: 15px;
  // padding-bottom: 15px;
  width: 1030px;
  z-index: 3;
  height: 90px;
}
.checkdialog-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  // flex: 1;
  width: calc(100% / 3);
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

:deep(.list-item-option-1) {
  position: unset;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 27px;
  background-color: #f5f5f7;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  .el-icon {
    width: 20px;
    height: 20px;
    svg {
      width: 20px;
      height: 20px;
      path {
        fill: #5e5e5e;
      }
    }
  }
  &:hover {
    .el-icon {
      svg {
        path {
          fill: $themeColor !important;
        }
      }
    }
  }
}
:deep(.list-item-option-2) {
  background-color: unset !important;
  .el-checkbox.el-checkbox--large .el-checkbox__inner {
    border-color: #4f4f4f;
    width: 23px !important;
    height: 23px !important;
    transform: translateX(-12px);
    &::after {
      width: 6px;
      height: 12px;
      left: 7px;
      top: 1px;
      border-width: 2px;
    }
  }
}
.list-item-menu {
  width: 132px;
  border-radius: 10px;
  // overflow: hidden;
  top: 15px;
  // bottom: -165px;
  right: 50px;
  position: absolute;
  background-color: white;
  box-shadow: 0 0 7px 1px #c4c4c4;
  z-index: 20;
  height: auto;
  .list-item-menu-item {
    height: 60px;
    line-height: 60px;
    text-align: center;
    padding: 0;
    font-size: 16px;
    border-bottom: 1px solid #f0f0f0;
    color: #646464;
    &:hover {
      color: $themeColor;
    }
    &:last-child {
      border-bottom: none;
      position: relative;
    }
  }
}
</style>
