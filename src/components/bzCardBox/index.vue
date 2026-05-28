<template>
  <!-- 八字卡片展示 -->
  <div v-if="from == 'paipanRecord' && starIndex !== 0" class="star-card-box">
    <div class="star-card-box-title">星标八字</div>
    <div class="bz-list">
      <div
        :class="['bz-card', 'pointer', 'bz-card-active1', checksBoxArr1.includes(i) ? 'bz-card-active2' : '']"
        :style="{
          width: columns == 1 ? '98%' : '40%',
          borderBottom: columns == 1 && i == list.length - 1 ? 'none' : '',
        }"
        v-for="(item, i) in list.slice(0, starIndex)"
        :key="item.guid"
        @click="onClick1(item, i)"
      >
        <img
          class="card-icon-sx"
          :src="require('@/assets/images/sx_' + item.animal + '.png')"
          alt=""
        />
        <div class="bz-card-userinfo">
          <label class="bz-card-userinfo-name"
            >{{ type == 0 ? item.name.substring(0, maxSize) : item.name
            }}{{ item.name.length > maxSize && type == 0 ? "..." : "" }}
            <label class="bz-card-userinfo-sex">{{
              item.sex == 1 ? "男" : "女"
            }}</label></label
          >
          <label style="color: #c2c2c5; font-size: 14px">{{
            type == 0 ? "阳历：" + item.time : item.peroid + " " + item.alias
          }}</label>
        </div>
        <div class="bz-card-gz">
          <div style="margin-bottom: 10px">
            <label class="bz-card-gz-t" v-for="(items, k) in item.tg.split(' ')" :key="k">{{
              items
            }}</label>
          </div>
          <div>
            <label class="bz-card-gz-t" v-for="(items, k) in item.dz.split(' ')" :key="k">{{
              items
            }}</label>
          </div>
        </div>
        <!-- <el-collapse-transition> -->
        <div
          class="bz-card-option-1"
          style="position: absolute; right: -7%; top: 30%; padding: 10px"
          @click.stop="onMenu1(i)"
          v-if="power == 1 && isMenu"
        >
          <el-icon style="transform: rotate(90deg)"><MoreFilled /></el-icon>
        </div>
        <div
          class="bz-card-option-1 bz-card-option-2"
          style="position: absolute; right: -7%; top: 15%; padding: 10px"
          v-if="power >= 2"
        >
          <el-checkbox-group v-model="checksBoxArr1">
            <div style="width: 30px;height: 30px;position: absolute;top:50%;right: 12px;transform: translateY(-50%);z-index: 888;"></div>
            <el-checkbox size="large" :label="i"></el-checkbox>
          </el-checkbox-group>
        </div>
        <transition name="el-fade-in-linear">
          <div
            class="bz-card-menu"
            v-if="menuPosition1 == i && power == 1 && isMenu"
          >
            <li class="bz-card-menu-item" @click.stop="onDel(i)">删除</li>
            <li class="bz-card-menu-item" @click.stop="onEdit(i)">编辑</li>
            <li class="bz-card-menu-item" @click.stop="onTop(item)">取消置顶</li>
            <li :class="['bz-card-menu-item', isMove ? 'bz-card-menu-item-active' : '']" @click.stop="onMove(item)" style="position: relative;">移动</li>
            <!-- 移动分组dialog -->
          </div>
        </transition>
        <div
          class="groupdialog-box"
          v-if="menuPosition1 == i && power == 1 && isMove"
        >
          <div class="groupdialog-content">
            <div class="groupdialog-title">
              移动到以下分组
              <!-- <label>移动到以下分组</label> -->
              <!-- <label style="flex: 1"></label> -->
              <!-- <el-icon @click="onCloseMove" style="transform: scale(140%)"><Close /></el-icon> -->
            </div>
            <div class="groupdialog-items">
              <div class="groupdialog-item" @click.stop="onMoverGroup({id: '00000000-0000-0000-0000-000000000000', name: '全部'})">
                全部
              </div>
              <div
                class="groupdialog-item"
                v-for="(item, index) in groupArr"
                :key="index"
                @click.stop="onMoverGroup(item)"
              >
                {{ item.name }}
                <!-- <label style="font-size: 15px">{{ item.name }}</label> -->
                <!-- <label style="flex: 1"></label>
                <label class="groupdialog-item-tag" @click="onMoverGroup(item)">纳入分组</label> -->
              </div>
            </div>
          </div>
          <!-- <div @click="onCloseMenu" class="dialog-mask"></div> -->
        </div>
        <!-- <div >sdsd</div> -->
      </div>
      <div
        v-if="isMore"
        style="
          width: 300px;
          margin: 0 auto;
          padding: 30px;
          font-size: 20px;
          text-align: center;
          color: #b2955b;
        "
      >
        <label>没有更多了噢！</label>
      </div>
    </div>
  </div>
  <div class="bz-list">
    <div
      :class="['bz-card', 'pointer', this.menuPosition == i ? 'bz-card-active' : '']"
      :style="{
        width: columns == 1 ? '98%' : '40%',
        borderBottom: columns == 1 && i == list.length - 1 ? 'none' : '',
      }"
      v-for="(item, i) in list.slice(starIndex)"
      :key="item.guid"
      @click="onClick(item, i)"
    >
      <img
        class="card-icon-sx"
        :src="require('@/assets/images/sx_' + item.animal + '.png')"
        alt=""
      />
      <div class="bz-card-userinfo">
        <label class="bz-card-userinfo-name"
          >{{ type == 0 ? item.name.substring(0, maxSize) : item.name
          }}{{ item.name.length > maxSize && type == 0 ? "..." : "" }}
          <label class="bz-card-userinfo-sex">{{
            item.sex == 1 ? "男" : "女"
          }}</label></label
        >
        <label style="color: #c2c2c5; font-size: 14px">{{
          type == 0 ? "阳历：" + item.time : item.peroid + " " + item.alias
        }}</label>
      </div>
      <div class="bz-card-gz">
        <div style="margin-bottom: 10px">
          <label class="bz-card-gz-t" v-for="(items, k) in item.tg.split(' ')" :key="k">{{
            items
          }}</label>
        </div>
        <div>
          <label class="bz-card-gz-t" v-for="(items, k) in item.dz.split(' ')" :key="k">{{
            items
          }}</label>
        </div>
      </div>
      <!-- <el-collapse-transition> -->
      <div
        class="bz-card-option-1"
        style="position: absolute; right: -7%; top: 30%; padding: 10px"
        @click.stop="onMenu(i)"
        v-if="power == 1 && isMenu"
      >
        <el-icon style="transform: rotate(90deg)"><MoreFilled /></el-icon>
      </div>
      <div
        class="bz-card-option-1 bz-card-option-2"
        style="position: absolute; right: -7%; top: 15%; padding: 10px"
        v-if="power >= 2"
      >
        <el-checkbox-group v-model="checksBoxArr">
          <div style="width: 30px;height: 30px;position: absolute;top:50%;right: 12px;transform: translateY(-50%);z-index: 888;"></div>
          <el-checkbox size="large" :label="i"></el-checkbox>
        </el-checkbox-group>
      </div>
      <transition name="el-fade-in-linear">
        <div
          class="bz-card-menu"
          v-if="menuPosition == i && power == 1 && isMenu"
        >
          <li class="bz-card-menu-item" @click.stop="onDel(i + starIndex)">删除</li>
          <li class="bz-card-menu-item" @click.stop="onEdit(i + starIndex)">编辑</li>
          <li class="bz-card-menu-item" @click.stop="onTop(item)">置顶</li>
          <li :class="['bz-card-menu-item', isMove ? 'bz-card-menu-item-active' : '']" @click.stop="onMove(item)" style="position: relative;">移动</li>
          <!-- 移动分组dialog -->
        </div>
      </transition>
      <div
        class="groupdialog-box"
        v-if="menuPosition == i && power == 1 && isMove"
      >
        <div class="groupdialog-content">
          <div class="groupdialog-title">
            移动到以下分组
            <!-- <label>移动到以下分组</label> -->
            <!-- <label style="flex: 1"></label> -->
            <!-- <el-icon @click="onCloseMove" style="transform: scale(140%)"><Close /></el-icon> -->
          </div>
          <div class="groupdialog-items">
            <div class="groupdialog-item" @click.stop="onMoverGroup({id: '00000000-0000-0000-0000-000000000000', name: '全部'})">
              全部
            </div>
            <div
              class="groupdialog-item"
              v-for="(item, index) in groupArr"
              :key="index"
              @click.stop="onMoverGroup(item)"
            >
              {{ item.name }}
              <!-- <label style="font-size: 15px">{{ item.name }}</label> -->
              <!-- <label style="flex: 1"></label>
              <label class="groupdialog-item-tag" @click="onMoverGroup(item)">纳入分组</label> -->
            </div>
          </div>
        </div>
        <!-- <div @click="onCloseMenu" class="dialog-mask"></div> -->
      </div>
      <!-- <div >sdsd</div> -->
    </div>
    <div
      v-if="isMore"
      style="
        width: 300px;
        margin: 0 auto;
        padding: 30px;
        font-size: 20px;
        text-align: center;
        color: #b2955b;
      "
    >
      <label>没有更多了噢！</label>
    </div>
  </div>
  <!-- 删除的dialog -->
  <div class="checkdialog-box" v-if="power >= 2 && isMenu">
    <div class="checkdialog-box-mask">
      <div class="checkmovemask" v-if="isMoveDialog" @click="onCloseMoveDialog">
        <div class="checkmovedialog" :style="{ left: checkdialogL + (1028 / 2) - (276 / 2) + 'px' }">
          <div class="checkmovedialog-title">移动到以下分组</div>
          <div class="checkmovecontent">
            <div class="checkmoveitem" v-for="(item, index) in groupArr" :key="index" @click.stop="onMoveGroups(index)">{{ item.name }}</div>
          </div>
          <img class="bottom-angle" :src="require('@/assets/images/icon_angle.png')"/>
        </div>
      </div>
    </div>
    <div
      class="checkdialog-item pointer"
      v-for="(item, index) in checksArr"
      :key="index"
      :style="{ color: item.color }"
    >
      <div @click.stop="onDialog(index)" @mousemove="mousemove(index)" @mouseleave="mouseleave(index)">
        <img
          class="checkdialog-item-icon"
          :src="require('../../assets/images/' + item.icon)"
        />
        <div
          :style="{
            'font-weight': 'bold',
          }"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
  <!-- 删除的的确定dialog -->
  <div class="deldialog-fixed" v-if="power >= 2 && isMenu && isDelDialog">
    <div class="deldialog-box">
      <label class="deldialog-title">温馨提示</label>
      <div class="deldialog-content">
        {{ noSelected ? '选中数据才能进行删除哦' : '确定要删除选中的数据吗？' }}
      </div>
      <div class="deldialog-btns" v-if="noSelected">
        <label class="deldialog-btn pointer" @click.stop="onDelNo" style="color: #fff;background-color: #b2955b;width: 120px;">我知道了</label>
      </div>
      <div class="deldialog-btns" v-else>
        <label class="deldialog-btn pointer" @click.stop="onDelNo" style="color: #646464">取消</label>
        <!-- <label style="flex: 1; color: #797979">|</label> -->
        <label class="deldialog-btn pointer" @click.stop="onDelYes" style="color: #fff;background-color: #b2955b;">确定</label>
      </div>
    </div>
    <div @click.stop="onCloseMenu1" class="dialog-mask1"></div>
  </div>
  <div class="deldialog-fixed" v-if="outCount">
    <div class="deldialog-box">
      <label class="deldialog-title">温馨提示</label>
      <div class="deldialog-content">PC端一次性只能置顶/取消置顶10个案例</div>
      <div class="deldialog-btns">
        <label class="deldialog-btn pointer" @click.stop="countBack" style="color: #fff;background-color: #b2955b;width: 120px;">我知道了</label>
      </div>
    </div>
    <div @click.stop="onCloseMenu1" class="dialog-mask1"></div>
  </div>
  <div
    @click="onCloseMenu"
    class="dialog-mask"
    v-if="(menuPosition != -1 && power == 1) || (menuPosition1 != -1 && power == 1)"
  ></div>
</template>

<script>
import { Toast } from 'vant';
const checksArr = [
  {
    name: "取消",
    icon: "bz_card_cancle.png",
    color: "#808080",
  },
  {
    name: "删除",
    icon: "bz_card_del.png",
    color: "#808080",
  },
  {
    name: "全选",
    icon: "bz_card_all.png",
    color: "#808080",
  },
];
const checksArr1 = [
  {
    name: "取消",
    icon: "bz_card_cancle.png",
    color: "#808080",
  },
  {
    name: "移动到...",
    icon: "bz_card_move.png",
    color: "#808080",
  },
  {
    name: "全选",
    icon: "bz_card_all.png",
    color: "#808080",
  },
];
const checksArr2 = [
  {
    name: "取消",
    icon: "bz_card_cancle.png",
    color: "#808080",
  },
  {
    name: "置顶",
    icon: "bz_card_top.png",
    color: "#808080",
  },
];

const movesArr = [];
var isCheckArrDel = false;
export default {
  name: "CardBZ",
  props: {
    list: Array,
    isMenu: {
      default: false,
      type: Boolean,
    },
    type: {
      default: 0,
      type: Number,
      //区分是用户的八字还是名人八字：0用户八字；1：名人八字
    },
    power: {
      type: Number,
      default: 0,
      //可操作的功能：0什么都不显示：1：更多菜单栏；2：复选框多选
    },
    columns: {
      type: Number,
      default: 2,
      //1：一行一列 2：一行两列
    },
    groupArr: {
      type: Array,
      default: [],
    },
    maxSize: {
      type: Number, //名称的最大截断字数
      default: 3,
    },
    from: {
      type: String,
      default: '',
    },
    fiterListArr: {
      type: Array,
      default: [],
    },
  },
  emits: [
    "onDetail",
    "onMenuDel",
    "onMenuTop",
    "onMenuEdit",
    "onCheckDel",
    "onCheckCancle",
    "onMoverGroup",
    "onMenuTops",
  ],
  data() {
    return {
      menuPosition: -1, //菜单栏显示的下标
      menuPosition1: -1, //菜单栏显示的下标
      checksArr, //多选dialog静态数组
      searText: "", //搜索文本
      isDel: false, //批量删除的文本样式切换
      isTop: false, //批量置顶的文本样式切换
      isGroup: false, //批量分组的文本样式切换
      isMore: false, //是否显示没有更多了；加载完毕
      checksBoxArr: [],
      checksBoxArr1: [],
      checksBoxArr2: [],
      movesArr,
      isMove: false,
      isDelDialog: false,
      selectItem: {}, //当前选中的卡片item
      checkdialogL: (document.body.clientWidth - 845) / 2,
      starList: [], //星标八字
      commenList: [], //普通八字
      starIndex: 0,
      isCheckArrDel,
      isMoveDialog: false,
      selectedCount: 0,
      selectedIndexArr: [],
      outCount: false,
    };
  },
  created() {},
  activated() {},

  mounted() {
    // const query = document.getElementById("#bzcard");
    // console.log("获取到我们组件的宽度：", query.offsetWidth);
    window.onresize = () =>
      (() => {
        this.checkdialogL = (document.body.clientWidth - 845) / 2;
      })();
  },

  computed: {
    noSelected() {
      return this.checksBoxArr.length == 0 && this.checksBoxArr1.length == 0;
    },
    isAllSelected() {
      return (this.checksBoxArr.length + this.checksBoxArr1.length == this.fiterListArr.length) && this.fiterListArr.length != 0;
    },
  },

  watch: {
    list: {
      handler(val) {
        // this.commenList = val.filter((item) => {
        //   return item.star == false;
        // });
        // this.starList = val.filter((item) => {
        //   return item.star == true;
        // });
        // 找到星标八字的最后一个下标
        if (val.length == 0) {
          this.starIndex = 0;
          return;
        }
        this.starIndex = 0;
        for (let i = 0; i < val.length; i++) {
          if (val[i].star) {
            this.starIndex = i + 1;
          }
        }
        this.checksBoxArr2 = [];
        for (let i = 0; i < this.starIndex; i++) {
          this.checksBoxArr2.push(i);
        }
      },
      deep: true,
      immediate: true,
    },
    power: {
      handler(val) {
        this.checksBoxArr = [];
        this.selectedIndexArr = [];
        this.checksBoxArr1 = [];
        isCheckArrDel = false;
        switch (val) {
          case 2:
            this.checksArr = JSON.parse(JSON.stringify(checksArr));
            break;
          case 3:
            this.checksArr = JSON.parse(JSON.stringify(checksArr2));
            this.checksBoxArr1 = JSON.parse(JSON.stringify(this.checksBoxArr2));
            break;
          case 4:
            this.checksArr = JSON.parse(JSON.stringify(checksArr1));
            break;
        }
      },
      immediate: true,
    },
    isAllSelected: {
      handler(val) {
        if (val) {
          if (this.checksArr[2]) {
            this.checksArr[2].icon = "bz_card_all_s.png";
            this.checksArr[2].color = "#b2955b";
          }
        } else {
          if (this.checksArr[2]) {
            this.checksArr[2].icon = "bz_card_all.png";
            this.checksArr[2].color = "#808080";
          }
        }
      },
    },
  },

  methods: {
    onClick(item, position) {
      if (this.power >= 2) {
        //Toast("下面选中");
        if (this.checksBoxArr.indexOf(position) == -1) {
          this.checksBoxArr.push(position);
          this.selectedCount++;
          if (this.selectedIndexArr.length >= 10 && this.power == 3) {
            this.outCount = true;
            this.checksBoxArr.pop();
          } else {
            this.selectedIndexArr.push(position + this.starIndex);
          }
        } else {
          //搜索到对应的值所带有的下标
          this.checksBoxArr.splice(this.checksBoxArr.indexOf(position), 1);
          this.selectedCount--;
          // 去除this.selectedIndexArr中对应的值
          this.selectedIndexArr.splice(this.selectedIndexArr.indexOf(position + this.starIndex), 1);
        }
        return;
      }
      if (this.power == 1 && this.isDel) {
        this.isDel = false;
      }
      this.$emit("onDetail", item);
    },
    onClick1(item, position) {
      if (this.power >= 2) {
        if (this.checksBoxArr1.indexOf(position) == -1) {
          this.checksBoxArr1.push(position);
          this.selectedCount--;
          this.selectedIndexArr.splice(this.selectedIndexArr.indexOf(position), 1);
        } else {
          //搜索到对应的值所带有的下标
          this.checksBoxArr1.splice(this.checksBoxArr1.indexOf(position), 1);
          this.selectedCount++;
          if (this.selectedIndexArr.length >= 10 && this.power == 3) {
            this.outCount = true;
            this.checksBoxArr1.push(position);
          } else {
            this.selectedIndexArr.push(position);
          }
        }
        return;
      }
      if (this.power == 1 && this.isDel) {
        this.isDel = false;
      }
      this.$emit("onDetail", item);
    },
    onMenu(position) {
      if (this.menuPosition == position) {
        this.menuPosition = -1;
        return;
      }
      this.menuPosition = position;
    },
    onMenu1(position) {
      if (this.menuPosition1 == position) {
        this.menuPosition1 = -1;
        return;
      }
      this.menuPosition1 = position;
    },
    onCloseMenu() {
      this.menuPosition = -1;
      this.menuPosition1 = -1;
      this.isMove = false;
    },
    onCloseMenu1() {
      this.isDelDialog = false;
      this.checksArr[1].color = "#808080";
      this.checksArr[1].icon = this.checksArr[1].icon.indexOf("_s.png") != -1 ? this.checksArr[1].icon.replace("_s.png", ".png") : this.checksArr[1].icon;
    },
    onTop(item) {
      console.log("置顶");
      this.menuPosition = -1;
      this.menuPosition1 = -1;
      this.$emit("onMenuTop", item, item.star ? false : true);
    },
    onMove(item) {
      this.isMove = !this.isMove;
      // this.menuPosition = -1;
      this.selectItem = item;
      console.log("移动");
    },
    onMoverGroup(item) {
      console.log("分组移动：", item);
      this.$emit("onMoverGroup", { group: item, item: this.selectItem });
      this.isMove = false;
      this.menuPosition = -1;
      this.menuPosition1 = -1;
    },
    onCloseMove() {
      this.isMove = false;
      this.menuPosition = -1;
    },
    onMoveGroups(index) {
      this.checksBoxArr.forEach((item) => {
        this.$emit("onMoverGroup", { group: this.groupArr[index], item: this.list[item + this.starIndex] });
      });
      this.checksBoxArr1.forEach((item) => {
        this.$emit("onMoverGroup", { group: this.groupArr[index], item: this.list[item] });
      });
      this.onCloseMoveDialog();
      this.$emit("onCheckCancle");
    },
    onDel(item) {
      console.log("删除");
      this.menuPosition = -1;
      this.menuPosition1 = -1;
      this.$emit("onMenuDel", item);
    },
    countBack() {
      this.outCount = false;
    },
    onDelNo() {
      // this.isDelDialog = false;
      this.onCloseMenu1();
    },
    onDelYes() {
      this.checksBoxArr.sort((a, b) => {
        return a - b;
      });
      this.checksBoxArr1.sort((a, b) => {
        return a - b;
      });
      // 将this.checksBoxArr的每个元素加上this.starIndex
      const checksBoxArr1 = this.checksBoxArr.map((item) => {
        return item + this.starIndex;
      });
      // 将两个数组合并
      const checksArr = this.checksBoxArr1.concat(checksBoxArr1);
      this.$emit("onCheckDel", checksArr);
      this.isDelDialog = false;
      this.checksBoxArr = [];
      this.checksBoxArr1 = [];
      this.selectedIndexArr = [];
    },
    onDialog(i) {
      switch (i) {
        case 0:
          // this.isMoveDialog = false;
          this.onCloseMoveDialog();
          this.$emit("onCheckCancle");
          break;
        case 1:
          switch (this.power) {
            case 2:
              //弹起对话框
              this.isDelDialog = true;
              break;
            case 3:
              //获取全部选中的下标以及取消置顶的下标
              let unselPositions = [];
              let selPositions = [];
              this.selectedIndexArr.forEach((position) => {
                if (position < this.starIndex) {
                  unselPositions.push(position);
                } else {
                  selPositions.push(position);
                }
              });
              //将置顶状态抛到父组件进行同步到服务器中
              this.$emit("onMenuTops", selPositions, unselPositions);
              this.selectedIndexArr = [];
              this.checksBoxArr = [];
              break;
            case 4:
              this.isMoveDialog = !this.isMoveDialog;
              break;
          }
          break;
        case 2:
          this.onCloseMoveDialog();
          this.onCloseMenu1();
          let arr = [];
          let arr1 = [];
          if (!isCheckArrDel) {
            for (let i = 0; i < this.fiterListArr.length; i++) {
              arr.push(i);
            }
            arr1 = this.checksBoxArr2
          }
          this.checksBoxArr1 = JSON.parse(JSON.stringify(arr1));
          this.checksBoxArr = arr.slice(0, arr.length - this.starIndex);
          isCheckArrDel = !isCheckArrDel;
          this.isCheckArrDel = isCheckArrDel;
          break;
      }
    },
    onEdit(i) {
      this.menuPosition = -1;
      this.menuPosition1 = -1;
      this.$emit("onMenuEdit", i);
    },
    onCloseMoveDialog() {
      this.isMoveDialog = false;
      this.checksArr[1].color = "#808080";
      this.checksArr[1].icon = this.checksArr[1].icon.indexOf("_s.png") != -1 ? this.checksArr[1].icon.replace("_s.png", ".png") : this.checksArr[1].icon;
    },
    mousemove(index) {
      if (index === 2 && this.isAllSelected) {
        return;
      }
      if (index === 1 && this.power == 4 && this.isMoveDialog) {
        return;
      }
      if (index === 1 && this.power == 2 && this.isDelDialog) {
        return;
      }
      this.checksArr[index].color = "#b2955b";
      this.checksArr[index].icon = this.checksArr[index].icon.indexOf("_s.png") == -1 ? this.checksArr[index].icon.replace(".png", "_s.png") : this.checksArr[index].icon;
    },
    mouseleave(index) {
      if (index === 2 && this.isAllSelected) {
        return;
      }
      if (index === 1 && this.power == 4 && this.isMoveDialog) {
        return;
      }
      if (index === 1 && this.power == 2 && this.isDelDialog) {
        return;
      }
      this.checksArr[index].color = "#808080";
      this.checksArr[index].icon = this.checksArr[index].icon.indexOf("_s.png") != -1 ? this.checksArr[index].icon.replace("_s.png", ".png") : this.checksArr[index].icon;
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

label {
  cursor: pointer;
}

::v-deep .el-checkbox__label {
  display: none;
}

.card-icon-sx {
  width: 50px;
  height: 50px;
  background-color: black;
  border-radius: 50%;
  margin-right: 10px;
}

.bz-list {
  display: flex;
  align-items: center;
  // justify-content: flex-start;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
  padding-bottom: 55px;
}
:deep(.bz-card) {
  position: relative;
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eeeeee;
  padding-top: 20px;
  // align-items: flex-start;
  justify-content: flex-start;
  margin-right: 10%;
  min-width: 40%;
  white-space: nowrap;
  .bz-card-option-1 {
    .el-icon {
      svg {
        path {
          fill: #5e5e5e !important;
        }
      }
    }
  }
}

:deep(.bz-card-active) {
  background-color: rgba($color: #000, $alpha: 0.05);
  .bz-card-option-1 {
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

:deep(.bz-card-active1) {
  background-color: rgba($color: #b2955b, $alpha: 0.05) !important;
  .bz-card-option-1 {
    background-color: #b2955b !important;
    .el-icon {
      svg {
        path {
          fill: white !important;
        }
      }
    }
  }
}

.bz-card-userinfo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.bz-card-userinfo-name {
  color: black;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}

.bz-card-userinfo-sex {
  color: #c2c2c5;
  font-size: 14px;
}

.bz-card-gz {
  position: absolute;
  right: -4%;
  margin-left: 30px;
  margin-right: 12.25px;
  display: flex;
  font-size: 14px;
  flex-direction: column;
}

.bz-card-gz-t {
  // padding: 1px 2px 1px 2px;
  text-align: center;
  background-color: #b2955b;
  margin-right: 12px;
  width: 25px;
  height: 25px;
  // padding: 2.5px 5px;
  display: inline-block;
  border-radius: 50%;
  line-height: 25px;
  font-weight: bold;
  color: white;
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
  font-size: 60px;
  // margin-bottom: 18px;
}
// 修改选择框大小
::v-deep .el-checkbox__inner {
  transform: scale(140%);
}

.checkdialog-box {
  position: fixed;
  left: calc(50% - 416px);
  bottom: 0%;
  display: flex;
  justify-content: center;
  background-color: white;
  border: 1px solid #bbbbbb;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  overflow: hidden;
  width: 1030px;
  z-index: 3;
}
.checkdialog-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  // flex: 1;
  width: calc(100% / 3);
  z-index: 3;
  // padding-top: 15px;
  // padding-bottom: 15px;
  background-color: white;
  height: 90px;
}

.checkdialog-item-active {
  color: $themeColor !important;
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
  background-color: rgba(95, 95, 95, 0.295);
}

.dialog-mask1 {
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.5);
}

.groupdialog-box {
  z-index: 20;
  background-color: white;
  position: absolute;
  bottom: -165px;
  right: -256px;
  box-shadow: 0 0 7px 1px #c4c4c4;
  width: 276px;
  border-radius: 10px;
  overflow: hidden;
  font-size: 16px;
}

.groupdialog-content {
  // position: fixed;
  // bottom: 41%;
  // left: 41%;
  // display: flex;
  // flex-direction: column;
  // padding: 15px;
  // width: 500px;
  // z-index: 999;
  // background-color: white;
  // border-radius: 20px;
}

.groupdialog-title {
  display: flex;
  align-items: center;
  justify-content: center;
  // padding-top: 10px;
  // padding-bottom: 20px;
  // border-bottom: 1px solid #f0f0f0;
  width: 100%;
  height: 60px;
  background-color: $themeColor;
  color: white;
  font-weight: bold;
}

.groupdialog-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  max-height: 300px;
  overflow-y: auto;
  width: 100%;
}

.groupdialog-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  // padding-bottom: 20px;
  // padding-top: 20px;
  border-bottom: 1px solid #f0f0f0;
  height: 60px;
  color: #646464;
  flex-shrink: 0;

  &:hover {
    color: $themeColor;
  }
}

.groupdialog-item-tag {
  padding: 5px 15px 5px 15px;
  background-color: #b2955b;
  color: white;
  font-size: 15px;
  border-radius: 10px;
}

.deldialog-fixed {
  z-index: 5;
  .deldialog-box {
    position: fixed;
    // bottom: 41%;
    // left: 41%;
    top: 50%;
    left: calc(50% + 90px);
    transform: translate(-50%, -50%);
    // padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    // padding: 20px;
    // width: 500px;
    width: 336px;
    height: 152px;
    z-index: 999;
    background-color: rgb(255, 255, 255);
    // border-radius: 20px;
    border-radius: 10px;
    overflow: hidden;

    .deldialog-title {
      // margin-top: 10px;
      // margin-bottom: 15px;
      color: #101010;
      font-size: 18px;
      font-weight: bold;
      line-height: 44px;
      width: 100%;
      height: 44px;
      background-color: #eeeeee;
      text-align: center;
    }
    .deldialog-content {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      font-size: 15px;
      margin-top: 18px;
    }
    .deldialog-btns {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin-top: 18px;
      .deldialog-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        font-size: 14px;
        background-color: #f7f7f7;
        border-radius: 30px;
        width: 100px;
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
}
label {
  font-weight: normal;
}

.bz-card-menu {
  width: 132px;
  border-radius: 10px;
  // overflow: hidden;
  // top: 15px;
  bottom: -165px;
  right: 50px;
  position: absolute;
  background-color: white;
  box-shadow: 0 0 7px 1px #c4c4c4;
  z-index: 20;
  height: auto;
  .bz-card-menu-item {
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
  .bz-card-menu-item-active {
    color: $themeColor;
    &:last-child {
      &::after {
        // 右侧一个小三角
        content: "";
        position: absolute;
        top: 50%;
        right: -29px;
        width: 30px;
        height: calc(30px * 144 / 90);
        transform: translateY(-50%);
        background-image: url('../../assets/images/icon_right_triangle.png');
        background-size: 100% 100%;
      }
    }
  }
}

.star-card-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 45px;
  width: 100%;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    height: 5px;
    background-color: #f5f5f7;
  }

  .star-card-box-title {
    font-size: 16px;
    font-weight: bold;
    color: $themeColor;
    margin-bottom: 15px;
    width: 100%;
    text-align: left;
  }
}
.checkmovemask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh);
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  .checkmovedialog {
    position: absolute;
    bottom: 80px;
    width: 276px;
    height: 396px;
    border-radius: 10px;
    overflow: hidden;
    .bottom-angle{
      width: 34px;
      height: 34px;
      // margin-left: calc(50% - 18px);
      margin-top: -12px;
      // border-top: 18px solid white;
      // border-right: 18px solid transparent;
      // border-left: 18px solid transparent;
      // border-bottom: 18px solid transparent;
      // border-top-left-radius: 6px;
      // border-top-right-radius: 6px;
    }

    .checkmovedialog-title {
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      background-color: #b2955b;
      color: white;
    }

    .checkmovecontent {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      max-height: 300px;
      height: 300px;
      overflow-y: auto;
      width: 100%;
      color: #646464;
      flex-shrink: 0;
      background-color: white;
      border-radius: 0 0 15px 15px;
      font-size: 16px;
      .checkmoveitem {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #f0f0f0;
        flex-shrink: 0;
        &:hover {
          color: #b2955b;
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
