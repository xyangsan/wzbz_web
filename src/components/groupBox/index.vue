<template>
  <div class="groups-container scrollBar">
    <div class="groups-title" v-if="from == 'paipanRecord' || from == 'celebrity'">案例分类:</div>
    <div class="groups-items specialScrollbar">
      <div
        @click="onSelected(item, i)"
        :style="selectPosition == i ? 'background-color:#b2955d' : ''"
        class="groups-item pointer"
        v-for="(item, i) in groups"
        :key="i"
      >
        <label
          :style="selectPosition == i ? 'color:white' : 'cursor: pointer;'"
        >
          {{ item.name }}
        </label>
        <label
          v-if="i > 0 && isDel"
          @click.stop="onDel(item, i)"
          class="groups-items-badge"
        >
          ×
        </label>
      </div>
    </div>
    <el-container v-if="isCURD && (!isAdd || isDel)">
      <div class="groups-items-icon pointer" @click="onShowDel" style="margin-right: 10px">
        <img
          style="position: absolute; left: 50%; top: 50%; width: 25px; height: 25px; transform: translate(-50%, -50%)"
          src="../../assets/images/groups_del.png"
          alt=""
        />
      </div>
      <div class="groups-items-icon pointer" @click="onAdd">
        <img
          style="position: absolute; left: 50%; top: 50%; width: 25px; height: 25px; transform: translate(-50%, -50%)"
          src="../../assets/images/groups_add.png"
          alt=""
        />
      </div>
    </el-container>
    <div style="display: flex" v-if="isAdd">
      <el-input
        maxlength="2"
        v-model="text"
        placeholder="请输入"
        class="groups-items-input"
        ref="input"
        @blur="onBlur"
      >
        <template #suffix>
          <el-button @click="onSave" :round="true" class="groups-items-input-save"
            >保存</el-button
          >
        </template>
      </el-input>
    </div>
    <!-- <div v-if="isCURD" style="padding-left: 250px; color: transparent">111111111</div> -->
  </div>
  <el-alert
    v-if="isAlert"
    title="保存失败！"
    type="error"
    description="分组名必须为两个"
    show-icon
    @close="closeAlert"
  />
  <el-alert
    v-if="isDelAlert"
    title="删除失败！"
    type="error"
    description="当前分组已选中，不可进行删除操作！"
    show-icon
    @close="closeDelAlert"
  />
</template>

<script>
export default {
  name: "CURDGroups",
  emits: ["onGroupClick", "onAddSave", "onGroupDel"],
  props: {
    groups: Array,
    isCURD: {
      type: Boolean,
      default: true,
    },
    from: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectPosition: 0,
      isDel: false,
      text: "",
      isAdd: false,
      isAlert: false,
      isDelAlert: false,
    };
  },

  mounted() {},

  methods: {
    onSelected(item, position) {
      this.selectPosition = position;
      this.$emit("onGroupClick", item, position);
    },
    onShowDel() {
      this.isDel = !this.isDel;
      this.isAlert = false;
      this.isDelAlert = false;
    },
    onDel(item, position) {
      if (this.selectPosition == position) {
        this.isDelAlert = true;
        return;
      }
      console.log("删除啦", position, this.selectPosition);
      this.groups.splice(position, 1);
      this.isDel = false;
      //返回一个事件给父组件自己处理:比如接口删除分组，更改分组id为空
      this.$emit("onGroupDel", item.id);
    },
    onAdd() {
      this.isDel = false;
      this.isAdd = true;
      this.isAlert = false;
      this.isDelAlert = false;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    closeAlert() {
      this.isAlert = false;
    },
    closeDelAlert() {
      this.isDelAlert = false;
    },
    onSave() {
      console.log(this.text);
      if (this.text.length != 2) {
        this.isAlert = true;
        this.isAdd = false;
        return;
      } else {
        this.isAdd = false;
        this.isAlert = false;
        this.$emit("onAddSave", this.text);
        this.text = "";
      }
    },
    // onBlur() {
    //   this.isAdd = false;
    //   this.text = "";
    // },
  },
};
</script>

<style lang="scss" scoped>
.groups-container {
  display: flex;
  // padding-top: 10px;
  // padding-bottom: 10px;
  padding-top: 30px;
  align-items: flex-start;
  font-size: 15px;
  width: 100%;
  // margin-right: 30px;
  // background-color: wheat;
  white-space: nowrap;
}

.groups-items-input {
  // height: 35px;
  height: 40px;
  width: 240px;
  background-color: transparent;
}

.groups-items-input-save {
  color: white;
  background-color: #b2955b;
  height: 25px;
  width: 40px;
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 12px;
  padding: none;
  box-shadow: unset;
}
::v-deep .el-input__inner {
  background-color: transparent;
}

::v-deep .el-input__wrapper {
  border-radius: 20px;
}

::v-deep .is-focus {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}

::v-deep .el-alert {
  margin: 20px 0 0;
}
::v-deep .el-alert:first-child {
  margin: 0;
}

::v-deep .el-alert__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

button::after {
  border: none;
}

.groups-items {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  max-width: 600px;
  overflow-x: scroll;
  overflow-y: hidden;
}

.groups-item {
  position: relative;
  background-color: #f5f5f7;
  color: #818181;
  text-align: center;
  // height: 32px;
  // padding: 7.5px 20px 7.5px 20px;
  margin: 0 10px 0 0px;
  border-radius: 10px;
  height: 40px;
  width: 90px;
  line-height: 40px;
  text-align: center;
  flex-shrink: 0;
}

.groups-items-icon {
  // width: 60px;
  // height: 32px;
  // width: 90px;
  width: 47px;
  height: 40px;
  position: relative;
  background-color: #f5f5f7;
  color: white;
  text-align: center;
  // padding: 7.5px 50px 7.5px 20px;
  cursor: pointer;
  // margin: 0 10px 0 10px;
  // border-radius: 30px;
  border-radius: 10px;

  img {
    width: 20px !important;
    height: 20px !important;
  }
}

.groups-items-badge {
  // right: -5%;
  // top: -20%;
  right: 2px;
  top: 2px;
  position: absolute;
  background-color: #d81e06;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  line-height: 16px;
  text-align: center;
}

.groups-title {
  color: #818181;
  font-size: 15px;
  margin-right: 10px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
</style>
