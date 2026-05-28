<template>
  <div class="paipanR-box">
    <CUSSearch
      :showDel="false"
      :isMoreDel="isMoreDel"
      :isMoreStar="isMoreStar"
      :isMoreGroup="isMoreGroup"
      from="paipanRecord"
      @onSearch="onSearch"
      @onSelectDel="onSelectDel"
      @onSelectStar="onSelectStar"
      @onSelectGroup="onSelectGroup"
      @onFilter="onFilter"
      @onFocus="searchFocus"
    />
    <CURDGroups
      @onGroupDel="onGroupDel"
      @onAddSave="onGroupAddSave"
      :groups="groups"
      @onGroupClick="onGroupClick"
      :isCURD="isCURD"
      from="paipanRecord"
    />
    <!-- 用户列表 -->
    <!-- <el-scrollbar style="height: 72vh; padding-bottom: 50px;padding-top:33px" :noresize="true"> -->
    <CardBZ
      :isMenu="true"
      :list="list"
      :fiterListArr="fiterListArr"
      :type="0"
      :power="bzPower"
      :groupArr="groupArr"
      from="paipanRecord"
      @onDetail="onDetail"
      @onMenuDel="onMenuDel"
      @onMenuTop="onMenuTop"
      @onMenuTops="onMenuTops"
      @onMenuEdit="onMenuEdit"
      @onCheckDel="onCheckDel"
      @onMoverGroup="onMoverGroup"
      @onCheckCancle="onCheckCancle"
    />
    <!-- </el-scrollbar> -->
    <div ref="loadMoreTrigger" class="loading-trigger"></div>
    <FilterBox
      :show="isShowFilter"
      @onClose="onCloseFilter"
      @updateRecordData="updateRecordData"
    />
    <Popup width="681px" height="596px" v-if="isEdit">
      <div class="icon_close pointer">
        <img
          :src="require('@/assets/images/icon_close.png')"
          @click.stop="onEdit(false)"
        />
      </div>
      <FormPP :info="timeInfo" @confirm="confirmPP" startBtnText="保存" from="paipanRecord" />
    </Popup>
  </div>
</template>

<script>
import CURDGroups from '@/components/groupBox'
import CardBZ from '@/components/bzCardBox'
import CUSSearch from '@/components/searchBox/index'
import Popup from '@/components/popupBox3/index.vue'
import FormPP from '@/components/time/formpp.vue'
import { getSSOfGZ } from '@/utils/ssUtils.js'
import { getWxData } from '@/views/paipan-result/utils.js'
import * as homeApi from '@/api/home-api'
import { getNotesearch } from '@/api/note.js'
import {
  navigationTo,
  packageParams,
  handleUserListItem,
  getDateTimeStr,
} from '@/utils'
import { solar2Lunar } from '@/utils/DateUtils.js'
import { getBaseBZ } from '@/api/bazi'
import params from '@/utils/params'
import store from '@/store'
import { mapGetters } from 'vuex'
import FilterBox from '@/components/filterBox'
import { Toast } from 'vant'
import { setStar } from '@/api/bazi2'
const groups = [
  {
    name: '全部',
    id: '',
  },
]
const list = []
var count = 40
var deletGuid = []
export default {
  name: 'PaiPanRecord',
  components: {
    CURDGroups,
    CardBZ,
    CUSSearch,
    FilterBox,
    Popup,
    FormPP,
  },
  data() {
    return {
      groups: JSON.parse(JSON.stringify(groups)),
      list,
      bzPower: 1,
      groupId: '',
      count,
      fillText: '',
      fillList: [],
      isMoreDel: false,
      isMoreStar: false,
      isMoreGroup: false,
      sortType: 1, //默认升序；0不排序 1升序 2降序
      groupArr: [],
      isCURD: true,
      isLeave: false,
      isShowFilter: false,
      watchRecordData: {
        sex: -1,
        gz: [],
        sizhu: [],
        address: '',
        wxxqs: [],
        zhiye: '',
        xueli: '',
        caifu: '',
        hunyin: '',
        geju: '',
        wangruo: '',
        xi: '',
        ji: '',
      },
      isEdit: false,
      timeInfo: {},
      groupIndex: 0,
      filterData: {},
      fiterListArr: [],
    }
  },
  async created() {
    //获取分组信息
    this.initGroups()
    //获取案例信息
    this.initUserArr()
  },
  computed: {
    ...mapGetters({
      guid: 'userguid',
      typeList: 'typeList',
      userList: 'userList',
    }),
    isClickMask() {
      return store.getters.isClickMask
    },
  },
  watch: {
    guid() {
      if (this.guid == '') {
        console.log('清空了吗：', store)
        this.list = []
        this.fillList = []
        this.fiterListArr = []
        this.groupArr = []
        this.groups = JSON.parse(JSON.stringify(groups))
        this.isCURD = false
      }
    },
    userList: {
      handler(res) {
        if (this.isLeave) {
          this.isLeave = false
          return
        }
        this.fillList = JSON.parse(JSON.stringify(res))
        this.list.length = 0
        this.list.push(...this.fillList.slice(0, this.count))
      },
      deep: true,
    },
    isClickMask: {
      handler(val) {
        if (val) {
          this.isMoreDel = false
          this.isMoreStar = false
          this.isMoreGroup = false
          this.bzPower = 1
        }
      },
    },
  },
  methods: {
    async initGroups() {
      if (this.guid == '') {
        this.isCURD = false
        return
      }

      let url = 'user/customGroupList?'
      let parms = 'userGuid=' + this.guid
      let groupsArr = ''
      if (!this.typeList || this.typeList.length == 1) {
        console.log('请求分组：', this.typeList)
        groupsArr = await homeApi.Request(url, parms, 1)
        groupsArr.data.items.forEach((item) => {
          this.groups.push(item)
          this.groupArr.push(item)
        })
        store.dispatch('paipan/setTypeList', groupsArr.data.items)
      } else {
        console.log('vuex数据：', store.getters.typeList)
        this.groups = store.getters.typeList
        this.groupArr = JSON.parse(JSON.stringify(store.getters.typeList))
        console.log('vuex数据1：', this.groups)

        // groupsArr.forEach((item) => {
        //   this.groups.push(item);
        //   this.groupArr.push(item);
        // });
      }
    },

    async initUserArr() {
      let url1 = 'User/SubUser2?'
      let parms1 = 'userGuid=' + this.guid
      if (this.guid == '') return
      let data1 = ''
      let arr = ''
      // if (!this.userList || this.userList.length == 0) {
        data1 = await homeApi.Request(url1, parms1, 1)
        arr = data1.data.items[0].userList.items
        store.dispatch('paipan/setUserList', arr)
      // } else {
      //   arr = store.getters.userList
      // }
      console.log('用户列表：', arr)

      //加上天干地支
      arr.forEach(handleUserListItem)

      //时间排序一下
      // arr.sort((user1, user2) => {
      //   let a1 = user1.solarTime.split(" ")[0];
      //   let a2 = user2.solarTime.split(" ")[0];
      //   let y1 = a1.split("-")[0];

      //   let m1 = a1.split("-")[1];
      //   let d1 = a1.split("-")[2];

      //   let y2 = a2.split("-")[0];
      //   let m2 = a2.split("-")[1];
      //   let d2 = a2.split("-")[2];

      //   let time1 = Number(new Date(y1, m1, d1));
      //   let time2 = Number(new Date(y2, m2, d2));
      //   return this.sortType == 1 ? time2 - time1 : time1 - time2;
      // });
      this.fillList = JSON.parse(JSON.stringify(arr))
      this.fiterListArr = JSON.parse(JSON.stringify(arr))
      this.list = arr.slice(0, this.count)
      //置顶排序一下
    },
    async onGroupAddSave(text) {
      //新增案例分组
      let url =
        'user/addCustomGroupH5?userGuid=' + this.guid + '&groupName=' + text
      let result = await homeApi.Request(url, '', 1, 'get')
      let data = result.data
      // await store.dispatch("paipan/addType", data);
      this.groups.push(data)
      this.groupArr.push(data)
    },

    async onGroupDel(id) {
      let url = 'user/deleteCustomGroup3?'
      let parms = 'groupGuid=' + id
      await homeApi.Request(url, parms, 1)
      store.dispatch('paipan/deleteType', id)
    },
    synUserArr() {
      deletGuid.forEach(async (item) => {
        let url = 'User/DeleteSubUser2?guid=' + item
        await homeApi
          .Request(url, '', 2)
          .then((res) => {
            console.log('成功删除！', res)
          })
          .catch((err) => {
            console.log('删除失败！', err)
            return
          })
      })
      if (deletGuid.length > 0) {
        this.isLeave = true
        store.dispatch('paipan/setUserList', this.fillList)
        return
      }
    },
    onMenuDel(position) {
      //先删除掉本地的显示 再删除原来初始化的,最后离开的时候再进行后台同步？
      //2023-02-28:nono 要改成实时删除
      let delItem = this.list.splice(position, 1)
      // console.log("删除的item：", delItem[0].guid);
      let delPosition = -1

      this.fillList.forEach((item, i) => {
        if (item.guid.includes(delItem[0].guid)) {
          deletGuid.push(delItem[0].guid)
          delPosition = i
          return
        }
      })
      this.fillList.splice(delPosition, 1)
      this.synUserArr()
    },
    onMenuTop(item, flag) {
      //Toast('置顶成功')
      this.list.forEach((element) => {
        if (element.guid.includes(item.guid)) {
          element.star = flag
          return
        }
      })

      this.fillList.forEach(async (element) => {
        if (element.guid.includes(item.guid)) {
          element.star = flag
          //同步后端案例数据
          await this.asyncMenuTop(element.guid)
          return
        }
      })
      this.list.sort((a, b) => {
        return b.star - a.star
      })
      this.fillList.sort((a, b) => {
        return b.star - a.star
      })
      this.fiterListArr.sort((a, b) => {
        return b.star - a.star
      })
    },
    onMenuTops(selPositions, unSelPositions) {
      //  更新视图列表显示
      this.list.forEach((element) => {
        selPositions.forEach(async (selPosition) => {
          if (element.guid.includes(this.fiterListArr[selPosition].guid)) {
            element.star = true;
          }
        });
        unSelPositions.forEach(async (unSelPosition) => {
          if (element.guid.includes(this.fiterListArr[unSelPosition].guid)) {
            element.star = false;
          }
        });
      })

      this.fillList.forEach((element) => {
        selPositions.forEach(async (selPosition) => {
          if (element.guid.includes(this.fiterListArr[selPosition].guid)) {
            element.star = true;
            await this.asyncMenuTop(element.guid)
          }
        });
        unSelPositions.forEach(async (unSelPosition) => {
          if (element.guid.includes(this.fiterListArr[unSelPosition].guid)) {
            element.star = false;
            await this.asyncMenuTop(element.guid, 0)
          }
        });
      })
      this.fiterListArr.forEach((element) => {
        selPositions.forEach(async (selPosition) => {
          if (element.guid.includes(this.fiterListArr[selPosition].guid)) {
            element.star = true;
            // await this.asyncMenuTop(element.guid)
          }
        });
        unSelPositions.forEach(async (unSelPosition) => {
          if (element.guid.includes(this.fiterListArr[unSelPosition].guid)) {
            element.star = false;
            // await this.asyncMenuTop(element.guid, 0)
          }
        });
      })
      this.list.sort((a, b) => {
        return b.star - a.star
      })
      this.fillList.sort((a, b) => {
        return b.star - a.star
      })
      this.fiterListArr.sort((a, b) => {
        return b.star - a.star
      })
      this.bzPower = 1
      this.isMoreDel = false
      this.isMoreStar = false
    },
    async asyncMenuTop(userGuid, star = 1) {
      await setStar(userGuid, star)
    },
    async onMoverGroup(info) {
      let group = info.group
      let item = info.item
      this.list.forEach((element) => {
        if (element.guid.includes(item.guid)) {
          element.groupGuid = group.id
          return
        }
      })
      this.fillList.forEach((element) => {
        if (element.guid.includes(item.guid)) {
          element.groupGuid = group.id
          return
        }
      })
      //后端同步
      let url = 'User/updatesubuser6'
      let msg = packageParams({
        guid: item.guid,
        name: item.name,
        isLeapMonth: item.isLeapMonth,
        leapMonth: item.leapMonth,
        sex: item.sex,
        birthDay: item.birthDay,
        solarTime: item.solarTime,
        lunarTime: item.lunarTime,
        sunTime: item.sunTime,
        location: item.location,
        parentGuid: item.parentGuid,
        type: item.type,
        groupGuid: group.id,
        star: item.star,
        unknowhour: item.unknowhour || 0,
        xls: item.xls || 0,
        hw: item.hw || 0,
        bjtime: item.bjtime || 0,
      })
      await homeApi.Request(url, msg, 2, 'post')
    },
    load() {
      if (this.fillText) return
      console.log('加载更多~')
      if (this.count > this.fiterListArr.length) return
      this.count += 40
      this.list = JSON.parse(JSON.stringify(this.fiterListArr)).slice(0, this.count)
    },

    onDetail(item) {
      let obj = params.userToPaiPan(item)
      obj.unknowhour = 0
      navigationTo({ path: 'paipan-result', params: obj })
      console.log('单击跳跳啦：', obj)
    },

    onGroupClick(item, position) {
      this.groupId = item.id
      this.groupIndex = position
      this.filterList(this.filterData)
      this.count = 40
      this.list = JSON.parse(JSON.stringify(this.fiterListArr)).slice(0, this.count)
      console.log('拿到的：', item, position)
    },
    onSearch(text) {
      console.log(text)
      this.fillText = text
      this.filterList(this.filterData)
      //讲关键词传递进card-bz进行过滤搜索
    },
    onSelectDel(isMoreDel) {
      this.isMoreDel = isMoreDel
      this.isMoreGroup = false
      this.isMoreStar = false
      this.bzPower = isMoreDel ? 2 : 1
    },
    onSelectStar(isMoreStar) {
      this.isMoreStar = isMoreStar
      this.isMoreGroup = false
      this.isMoreDel = false
      this.bzPower = isMoreStar ? 3 : 1
    },
    onSelectGroup(isMoreGroup) {
      this.isMoreGroup = isMoreGroup
      this.isMoreStar = false
      this.isMoreDel = false
      this.bzPower = isMoreGroup ? 4 : 1
    },
    onCheckDel(arr) {
      let delItems = []
      let delPositions = []

      for (let i = arr.length - 1; i >= 0; i--) {
        let delItem = this.list.splice(arr[i], 1)
        deletGuid.push(delItem[0].guid)
        delItems.push(delItem[0])
      }
      console.log('delItems', JSON.stringify(delItems[0]))
      for (let i = 0; i < this.fillList.length; i++) {
        const element = this.fillList[i]
        for (let j = 0; j < delItems.length; j++) {
          const item = delItems[j]
          if (element.guid.includes(item.guid)) {
            delPositions.push(i)
            break
          }
        }
      }
      // console.log("delPositions", delPositions);

      for (let i = delPositions.length - 1; i >= 0; i--) {
        this.fillList.splice(delPositions[i], 1)
      }

      this.bzPower = 1
      this.isMoreDel = false
      this.synUserArr()
      // if (flag) this.bzPower = 2;
      // else this.bzPower = 1;
    },
    onCheckCancle() {
      this.isMoreDel = false
      this.isMoreStar = false
      this.isMoreGroup = false
      this.bzPower = 1
    },
    // scroll(e) {
    //   let element = e.target.scrollingElement;
    //   if (element.scrollHeight - element.scrollTop === element.clientHeight) {
    //     // console.log(
    //     //   "pp,到底不啦",
    //     //   element.scrollHeight,
    //     //   e.target.scrollingElement.scrollTop,
    //     //   element.clientHeight
    //     // );
    //     if (this.count > this.list.length) return;
    //     this.count += 40;
    //     this.list = JSON.parse(JSON.stringify(this.fillList)).slice(0, this.count);
    //   }
    // },
    onFilter() {
      this.isShowFilter = true
      this.bzPower = 1
      this.isMoreDel = false
      this.isMoreStar = false
      this.isMoreGroup = false
    },
    onCloseFilter() {
      this.isShowFilter = false
    },
    async updateRecordData(data) {
      this.onCloseFilter()
      this.filterData = data
      this.filterList(data)
    },
    async filterList(data) {
      let arr = JSON.parse(JSON.stringify(this.fillList))
      // 过滤分组
      arr = arr.filter((user) => {
        return this.groupIndex == 0 ? user : user.groupGuid == this.groupId
      })
      // 过滤关键字
      arr = arr.filter((item) => item.name.indexOf(this.fillText) !== -1)
      // 过滤职业
      // 如果data为空，不过滤
      if (Object.keys(data).length === 0) {
        this.fiterListArr = JSON.parse(JSON.stringify(arr))
        console.log('过滤后的数据：', this.fiterListArr);
        this.list = JSON.parse(JSON.stringify(arr)).slice(0, this.count)
        return
      }
      let d1 = data['zhiye']
      // 过滤学历
      let d2 = data['xueli']
      // 过滤财富
      let d3 = data['caifu']
      // 过滤婚姻
      let d4 = data['hunyin']
      // 过滤格局
      let d5 = data['geju']
      // 过滤旺弱
      let d6 = data['wangruo']
      // 过滤喜
      let d7 = data['xi']
      // 过滤忌
      let d8 = data['ji']

      // 过滤性别
      let recordData = data['sex']
      if (recordData !== -1) {
        if (recordData === 1) {
          arr = arr.filter((item) => item.sex == 1)
        } else {
          arr = arr.filter((item) => item.sex != 1)
        }
      }

      // 过滤干支
      recordData = data['gz']
      const set = {}
      recordData.forEach((item) => {
        if (item) {
          if (set[item]) {
            set[item] += 1
          } else {
            set[item] = 1
          }
        }
      })
      if (Object.keys(set).length > 0) {
        arr = arr.filter((item) => {
          let isDone = true
          for (let i in set) {
            const found = item.bz.match(new RegExp(i, 'g'))
            if (!found || found.length < set[i]) {
              isDone = false
              break
            }
          }
          return isDone
        })
      }

      // 过滤四柱
      recordData = data['sizhu'].map((item) => {
        return item.replace(/-/g, '')
      })
      if (recordData.findIndex((item) => !!item) >= 0) {
        arr = arr.filter((item) => {
          if (!item.tg || !item.dz) return false
          const gzArr = (item.tg + ' ' + item.dz).trim().split(/\s+/)
          const ssArr = gzArr.map((gz) => getSSOfGZ(gzArr[2], gz))
          let isDone = true
          for (let i = 0; i < 8; i++) {
            if (recordData[i] && (recordData[i] !== gzArr[i] && recordData[i] !== ssArr[i])) {
              isDone = false
              break
            }
          }
          return isDone
        })
      }

      // 过滤地址
      recordData = data['address']
      if (recordData) {
        const aArr = recordData.slice()
        if (aArr[0] === '未知地区') {
          aArr.length = 1
          aArr[0] = '未知'
        } else {
          if (aArr[0].indexOf('省')) {
            aArr[0] = aArr[0].slice(0, -1)
          }
        }
        if (aArr[2] === '--') {
          aArr.length = 2
        }
        arr = arr.filter((item) => {
          let isDone = true
          for (let a of aArr) {
            if (item.location.indexOf(a) < 0) {
              isDone = false
              break
            }
          }
          return isDone
        })
      }

      // 过滤旺相休囚死
      recordData = data['wxxqs'].map((item) => {
        return item.replace(/-/g, '')
      })
      if (recordData.length > 0) {
        arr = arr.filter((item) => {
          const wxData = getWxData(item.dz[2])
          if (!wxData) return false
          let isDone = true
          for (let i in wxData) {
            if (recordData[i] && recordData[i] !== wxData[i][0]) {
              isDone = false
              break
            }
          }
          return isDone
        })
      }
      // 过滤笔记
      if (d1 || d2 || d3 || d4 || d5 || d6 || d7 || d8) {
        await getNotesearch({
          guid: this.guid,
          d1,
          d2,
          d3,
          d4,
          d5,
          d6,
          d7,
          d8,
        }).then((res) => {
          if (res.code === 0) {
            let data = []
            if (res.data !== '') {
              data = res.data.split(',')
              console.log('笔记数据：', data);
            }
            let result = [];
            for (let i = 0; i < arr.length; i++) {
              for (let j = 0; j < data.length; j++) {
                if (arr[i].guid === data[j]) {
                  result.push(arr[i]);
                }
              }
            }
            arr = result
          }
        })
      }
      this.fiterListArr = JSON.parse(JSON.stringify(arr))
      this.list = JSON.parse(JSON.stringify(arr)).slice(0, this.count)
    },
    onEdit(status) {
      this.isEdit = status
    },
    onMenuEdit(index) {
      const dateArr = this.fiterListArr[index].solarTime.split(/[-\s:]/)
      const lunarArr = solar2Lunar(dateArr[0], dateArr[1], dateArr[2])
      this.timeInfo = {
        guid: this.fiterListArr[index].guid || '',
        type: 0,
        username: this.fiterListArr[index].name,
        sex: this.fiterListArr[index].sex === 1 ? 1 : 0,
        birthday: this.fiterListArr[index].solarTime,
        lunarArr: lunarArr,
        sunTime: this.fiterListArr[index].sunTime,
        address: this.fiterListArr[index].location,
        unknowhour: this.fiterListArr[index].unknowhour || 0, // 是否为未知时间 0:否 1:是
        typeId: this.fiterListArr[index].groupGuid,
        xls: this.fiterListArr[index].xls,
        parentGuid: this.fiterListArr[index].parentGuid,
        star: this.fiterListArr[index].star,
        bjtime: this.fiterListArr[index].bjtime || 0,
        hw: this.fiterListArr[index].hw || 0,
      }
      this.onEdit(true)
    },
    async confirmPP(data) {
      // console.log('编辑的数据：', data)
      // this.timeInfo = data
      // const nowDate = new Date()
      // const dateStr = getDateTimeStr(nowDate, true)
      // let reqData = {
      //   d: data.sunTime,
      //   s: data.sex,
      //   today: dateStr,
      //   yzs: localStorage.getItem('setting_midnight') || 0,
      //   vip: 3,
      //   userguid: data.parentGuid || '',
      // }
      // let res = await getBaseBZ(reqData)
      // let tg = []
      // let dz = []
      // if (res) {
      //   tg = [res.bz[0], res.bz[2], res.bz[4], res.bz[6]]
      //   dz = [res.bz[1], res.bz[3], res.bz[5], res.bz[7]]
      // }
      // let json = {
      //   MRType: 0,
      //   guid: data.guid || '',
      //   location: data.address,
      //   name: data.username || '案例',
      //   sex: data.sex,
      //   solarTime: data.birthday.split(/[-\s:]/),
      //   sunTime: data.sunTime.split(/[-\s:]/),
      //   lunarArr: JSON.stringify(data.lunarArr),
      //   tg,
      //   dz,
      //   typeId: data.typeId || '00000000-0000-0000-0000-000000000000',
      //   xls: data.xls || 0,
      //   unknowhour: data.unknowhour || 0,
      // }
      // navigationTo({ path: 'paipan-result', params: json })
      this.onEdit(false)
      //获取分组信息
      this.initGroups()
      //获取案例信息
      this.initUserArr()
    },
    searchFocus() {
      this.isMoreDel = false
      this.isMoreStar = false
      this.isMoreGroup = false
      this.bzPower = 1
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
  deactivated: function () {
    // window.removeEventListener("scroll", this.scroll);
    //将案例保存到服务器中
    //this.synUserArr();
    console.log('删除啦')
    deletGuid = []
  },
}
</script>

<style lang="scss" scoped>
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
    border: 1px solid #f0f0f0;
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
    .bz-card-option-1 {
      position: unset !important;
      margin-left: 75px;
      height: 100% !important;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 !important;
      width: 27px !important;
      background-color: #f5f5f7;
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
              fill: $themeColor;
            }
          }
        }
      }
    }
    .bz-card-option-2 {
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
    .card-icon-sx {
      position: absolute;
      margin-right: 0;
      right: 50px;
    }
  }
  .bz-card-active2 {
    background-color: white !important;
    border: 1px solid #b2955b;
  }
}
:deep(.dialog-mask) {
  background-color: unset;
}
.icon_close {
  display: flex;
  top: 17px;
  right: 17px;
  justify-content: flex-end;
  position: absolute;
  z-index: 999;
  & > img {
    width: 14px;
  }
}
:deep(.datetime_wrapper) {
  bottom: unset !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
}
:deep(.wzbz_container .box) {
  overflow: hidden;
}
:deep(.el-switch) {
  display: none;
}
</style>
