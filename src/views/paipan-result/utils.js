import store from '@/store'
import DateUtil from '@/utils/DateSwitchUtils'
import {
  shisheng,
  TianGan,
  DiZhi,
  ly_zhi,
  monthArray,
  dayArray,
} from '@/static'
import {
  jiazi,
  changSheng12,
  _JieQiData,
  _JieQiData2,
  TimeArr,
  wx_wangshuai,
  ylcode,
  animals,
} from './static'
import { getShenSha, getGeJu } from '@/api/bazi.js'
import { getWxOfGz } from '@/utils'
import { getSetting } from '@/api/setting'
import {
  gzRelation_tg,
  gzRelation_dz,
  setting_gzrelation_default,
  setting_dizhizg_default,
  setting_rysl_default,
} from './static.js'

const DiZhiToTianGan = {
  子: '癸',
  丑: '己',
  寅: '甲',
  卯: '乙',
  辰: '戊',
  巳: '丙',
  午: '丁',
  未: '己',
  申: '庚',
  酉: '辛',
  戌: '戊',
  亥: '壬',
}
export function getShiShenShortName(shishen) {
  switch (shishen) {
    case '正官':
      return '官'
    case '七杀':
      return '杀'
    case '正印':
      return '印'
    case '偏印':
      return '枭'
    case '比肩':
      return '比'
    case '劫财':
      return '劫'
    case '食神':
      return '食'
    case '伤官':
      return '伤'
    case '日主':
      return '元'
    case '正财':
      return '财'
    case '偏财':
      return '才'
    default:
      return ''
  }
}

export function getShiShen(gan, rizhu) {
  return shisheng[getGanId(rizhu)][getGanId(gan)]
}

export function getGanId(g) {
  let index = 0
  for (var i = 0; i < TianGan.length; i++) {
    if (TianGan[i] == g) {
      index = i
      break
    }
  }
  return index
}

export function getShiShenOfZhi(zhi, rizhu) {
  const gan = DiZhiToTianGan[zhi]
  return getShiShen(gan, rizhu)
}

export function getDiZhiCG(dizhi) {
  var returnstring = new Array()
  if (dizhi == '子') {
    returnstring.push('癸')
  }
  if (dizhi == '丑') {
    returnstring.push('己')
    returnstring.push('癸')
    returnstring.push('辛')
  }
  if (dizhi == '寅') {
    returnstring.push('甲')
    returnstring.push('丙')
    returnstring.push('戊')
  }
  if (dizhi == '卯') {
    returnstring.push('乙')
  }
  if (dizhi == '辰') {
    returnstring.push('戊')
    returnstring.push('乙')
    returnstring.push('癸')
  }
  if (dizhi == '巳') {
    returnstring.push('丙')
    returnstring.push('庚')
    returnstring.push('戊')
  }
  if (dizhi == '午') {
    returnstring.push('丁')
    returnstring.push('己')
  }
  if (dizhi == '未') {
    returnstring.push('己')
    returnstring.push('丁')
    returnstring.push('乙')
  }
  if (dizhi == '申') {
    returnstring.push('庚')
    returnstring.push('壬')
    returnstring.push('戊')
  }
  if (dizhi == '酉') {
    returnstring.push('辛')
  }
  if (dizhi == '戌') {
    returnstring.push('戊')
    returnstring.push('辛')
    returnstring.push('丁')
  }
  if (dizhi == '亥') {
    returnstring.push('壬')
    returnstring.push('甲')
  }
  return returnstring
}

// 获取年干支
export function getYearGZ(year) {
  //1801 "辛酉"
  if (year >= 1801) {
    let index = (year - 1801 + 57) % 60
    return jiazi[index]
  } else {
    return ''
  }
}

// 设置排盘数据
export async function setHeader(panDatas, yunDatas, gz, riGan, sex, ss = '') {
  const CGArr = getDiZhiCG(gz[1])
  const CGSSArr = []
  for (let i = 0; i < CGArr.length; i++) {
    CGSSArr.push(getShiShen(CGArr[i], riGan))
  }
  panDatas.zhuxing.unshift(getShiShen(gz[0], riGan))
  panDatas.tiangan.unshift(gz[0])
  panDatas.dizhi.unshift(gz[1])
  panDatas.canggan.unshift(CGArr)
  panDatas.fuxing.unshift(CGSSArr)
  panDatas.xingyun.unshift(get12ChangSheng(riGan, gz[1]))
  panDatas.zizuo.unshift(get12ChangSheng(gz[0], gz[1]))
  panDatas.kongwang.unshift(getZhuKongWang(gz[0], gz[1]))
  panDatas.nayin.unshift(getNayin(gz[0] + gz[1]))
  let bzstr = ''
  for (let i = 0; i < 8; i++) bzstr += panDatas.bazi[i] + ' '
  bzstr = bzstr.trim()
  /**
   * 获取神煞
   *   先从已获取的缓存中查找是否有数据
   *   没有数据时从后端请求
   */
  let shensha = store.getters.shenshaList.find((item) => {
    if (item.ln == gz[0] + gz[1] && item.bz == bzstr) {
      panDatas.shensha.unshift(item.data)
      ss ? (yunDatas[ss] = [gz[0] + gz[1], item.data]) : ''
      return true
    }
  })
  if (!shensha) {
    // 模拟请求返回数据
    // panDatas.shensha.unshift(['mock数据'])

    // 获取神煞
    const parms = {
      ln: gz[0] + gz[1],
      bz: bzstr,
      sex: sex,
      data: null,
    }
    await getShenSha({
      ln: parms.ln,
      bz: parms.bz,
      sex: parms.sex,
      vip: store.getters.viplevel,
      userguid: store.getters.userguid,
    })
      .then(async (res) => {
        ss ? (yunDatas[ss] = [parms.ln, res.shensha[1]]) : ''
        panDatas.shensha.unshift(res.shensha[1])
        // 缓存神煞数据
        parms.data = res.shensha[1]
        await store.dispatch('paipan/setShenshaList', parms)
      })
      .catch((err) => {
        console.log('获取神煞失败！', err)
      })
  }
}

/**
 * 运势对应的干支设置
 */
export function setDayunHeader(panDatas, yunDatas, gz, riGan, index, sex) {
  removePanDatas(panDatas, 4)
  panDatas.rowTitle.unshift(index == -1 ? '小运' : '大运')
  setHeader(panDatas, yunDatas, gz, riGan, sex)
}

/**
 * 设置流年header信息
 */
export async function setLiuNianHeader(panDatas, yunDatas, gz, riGan, sex) {
  removePanDatas(panDatas, 5)
  panDatas.rowTitle.unshift('流年')
  setHeader(panDatas, yunDatas, gz, riGan, sex, 'lnshensha')
}

/**
 * 设置流月header信息
 */
export async function setLiuYueHeader(panDatas, yunDatas, gz, riGan, sex) {
  removePanDatas(panDatas, 6)
  panDatas.rowTitle.unshift('流月')
  setHeader(panDatas, yunDatas, gz, riGan, sex, 'lyshensha')
}

/**
 * 设置流日header信息
 */
export async function setLiuRiHeader(panDatas, yunDatas, gz, riGan, sex) {
  removePanDatas(panDatas, 7)
  panDatas.rowTitle.unshift('流日')
  setHeader(panDatas, yunDatas, gz, riGan, sex, 'lrshensha')
}

/**
 * 设置流时header信息
 */
export async function setLiuShiHeader(panDatas, yunDatas, gz, riGan, sex) {
  removePanDatas(panDatas, 8)
  panDatas.rowTitle.unshift('流时')
  setHeader(panDatas, yunDatas, gz, riGan, sex, 'lsshensha')
}

/**
 * 初始化流年数据
 */
export async function setLiuNianData(
  panDatas,
  yunDatas,
  selectliunian,
  dyindex,
  liunianArr,
  riGan,
  todayYear,
  sex,
) {
  let arr = null
  if (dyindex == -1 && liunianArr[0].length == 0) {
    arr = liunianArr[1]
  } else {
    arr = liunianArr[dyindex + 1]
  }
  let liunian = arr[0][1]
  let gz = arr[0][0]
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][1] == todayYear) {
      liunian = arr[i][1]
      gz = arr[i][0]
    }
  }
  selectliunian.value = liunian
  setLiuNianHeader(panDatas, yunDatas, gz, riGan, sex)
}

/**
 * 初始化流月数据
 */
export function setLiuyueData(
  yunDatas,
  selectliuyue,
  todayMonthGZ,
  todayYear,
  year,
  riGan,
) {
  if (year >= 2100) {
    yunDatas.liuyueArr = []
    return
  }
  let selectliunian = year
  let liuyueArr = []
  let liuyue = 1
  let gz = ['', '']
  let currentTime = new Date(),
    month = currentTime.getMonth() + 1,
    day = currentTime.getDate()
  for (let yue = 1; yue <= 12; yue++) {
    let tmpgan = getYueGan(selectliunian, yue)
    let tmpzhi = ly_zhi[yue - 1]
    if (gz[0] == '') {
      gz = [tmpgan, tmpzhi]
      gz[0] = tmpgan
      gz[1] = tmpzhi
    }
    let tmpgz = tmpgan + tmpzhi
    let jqnian = selectliunian
    let jqyue = yue + 1
    if (jqyue == 13) {
      jqyue = 1
    }
    if (jqyue == 1) {
      jqnian = jqnian + 1
    }
    var ss1 = getShiShenShortName(getShiShen(tmpgan, riGan))
    var ss2 = getShiShenShortName(getShiShen(getDiZhiCG(tmpzhi)[0], riGan))
    var jqdata = getJieqiWithYearAndMonth(jqnian, jqyue)
    var jqdatearr = jqdata[0].split('-')
    liuyueArr.push([
      tmpgan,
      tmpzhi,
      jqdatearr[1],
      jqdatearr[2],
      jqdata[1],
      ss1,
      ss2,
    ])
    if ((month + '' === jqdatearr[1] && day +'' === jqdatearr[2]) || tmpgz == todayMonthGZ) {
      liuyue = yue
      gz = [tmpgan, tmpzhi]
    }
  }
  yunDatas.liuyueArr = liuyueArr
  selectliuyue.value = liuyue
}

/**
 * 初始化流日数据
 */
export function setLiuRiData(
  yunDatas,
  liuriIndex,
  todayObj,
  year,
  month,
  riGan,
) {
  let selectMonthArr = yunDatas.liuyueArr[month - 1]
  let selectliuRi = 1
  let liuyueGanZhi = selectMonthArr[0] + selectMonthArr[1]
  let monthTmp = +selectMonthArr[2]
  let dayTmp = +selectMonthArr[3]

  let curY = year,
    curM = monthTmp,
    nextY,
    nextM,
    days
  if (curM >= 12) {
    nextY = curY + 1
    nextM = 1
  } else if (curM == 1) {
    curY += 1
    nextY = curY
    nextM = curM + 1
  } else {
    nextY = curY
    nextM = curM + 1
  }
  let nextJQ = getJieqiWithYearAndMonth(nextY, nextM)
  let nextJQArr = nextJQ[0].split('-').map((i) => +i)
  nextY = nextJQArr[0]
  nextM = nextJQArr[1]
  let nextD = nextJQArr[2]
  let nextDate = new Date(`${nextY}/${nextM}/${nextD} 00:00:00 GMT+8`),
    curDate = new Date(`${curY}/${curM}/${dayTmp} 00:00:00 GMT+8`)
  days = Math.floor((nextDate - curDate) / 86400000) - 1

  if (month > 11) {
    year++
  }
  let dateDic = DateUtil.getDateDataWithDate(year, monthTmp, dayTmp)
  let liuriTmpArr = []
  let yangliStr = year + '年' + monthTmp + '月' + dayTmp + '日'
  let nongliStr = dateDic['lunarDate']
  let nongliDay = nongliStr.split('月')[1]
  let weekday = dateDic['week']
  let liuRiGanZhi = dateDic['sizhu'][2]
  let liuRiGan = liuRiGanZhi.split('')[0]
  let liuRiZhi = liuRiGanZhi.split('')[1]
  var ss1 = getShiShenShortName(getShiShen(liuRiGan, riGan))
  var ss2 = getShiShenShortName(getShiShen(getDiZhiCG(liuRiZhi)[0], riGan))
  liuriTmpArr.push([
    liuRiGan,
    liuRiZhi,
    nongliDay,
    ss1,
    ss2,
    yangliStr,
    nongliStr,
    weekday,
    dateDic['sizhu'],
  ])

  let selectDate = new Date(year, monthTmp - 1, dayTmp, 0, 0, 0)
  for (let i = 0; i < days; i++) {
    selectDate = selectDate.setDate(selectDate.getDate() + 1)
    selectDate = new Date(selectDate)
    // console.log("流日：" + selectDate);
    let yearstr = selectDate.getFullYear()
    let monthstr = selectDate.getMonth() + 1
    let daystr = selectDate.getDate()
    dateDic = DateUtil.getDateDataWithDate(yearstr, monthstr, daystr)
    if (dateDic) {
      yangliStr = yearstr + '年' + monthstr + '月' + daystr + '日'
      nongliStr = dateDic['lunarDate']
      nongliDay = nongliStr.split('月')[1]
      weekday = dateDic['week']
      liuRiGanZhi = dateDic['sizhu'][2]
      liuRiGan = liuRiGanZhi.split('')[0]
      liuRiZhi = liuRiGanZhi.split('')[1]
      ss1 = getShiShenShortName(getShiShen(liuRiGan, riGan))
      ss2 = getShiShenShortName(getShiShen(getDiZhiCG(liuRiZhi)[0], riGan))
    } else {
      continue
    }
    // console.log("流月干支：", liuyueGanZhi);
    // console.log("选中干支：", dateDic);
    if (liuyueGanZhi == dateDic['sizhu'][1]) {
      liuriTmpArr.push([
        liuRiGan,
        liuRiZhi,
        nongliDay,
        ss1,
        ss2,
        yangliStr,
        nongliStr,
        weekday,
        dateDic['sizhu'],
      ])
      if (monthstr == todayObj.todayMonth && daystr == todayObj.todayDay) {
        selectliuRi += i + 1
      }
    }
  }
  yunDatas.liuriArr = liuriTmpArr
  liuriIndex.value = selectliuRi
}

/**
 * 初始化流时数据
 */
export function setLiuShiData(yunDatas, day, riGan) {
  const selectDayArr = yunDatas.liuriArr[day - 1]
  const liuriGan = selectDayArr[0]
  const liuShiTmpArr = []
  if (liuriGan) {
    const mapShiGan = getMapShiGan(liuriGan)
    for (let i = 0; i < DiZhi.length; i++) {
      let liuShiGan = mapShiGan.get(DiZhi[i])
      let ss1 = getShiShenShortName(getShiShen(liuShiGan, riGan))
      let ss2 = getShiShenShortName(getShiShen(getDiZhiCG(DiZhi[i])[0], riGan))
      liuShiTmpArr.push([
        mapShiGan.get(DiZhi[i]),
        DiZhi[i],
        TimeArr[i],
        ss1,
        ss2,
      ])
    }
    yunDatas.liushiArr = liuShiTmpArr
  } else {
    yunDatas.liushiArr = []
  }
}

/**
 * 根据干支获取对应的纳音
 */
export function getNayin(paramString) {
  if (paramString == '甲子' || paramString == '乙丑') {
    return '海中金'
  }
  if (paramString == '丙寅' || paramString == '丁卯') {
    return '炉中火'
  }
  if (paramString == '戊辰' || paramString == '己巳') {
    return '大林木'
  }
  if (paramString == '庚午' || paramString == '辛未') {
    return '路旁土'
  }
  if (paramString == '壬申' || paramString == '癸酉') {
    return '剑锋金'
  }
  if (paramString == '甲戌' || paramString == '乙亥') {
    return '山头火'
  }
  if (paramString == '丙子' || paramString == '丁丑') {
    return '涧下水'
  }
  if (paramString == '戊寅' || paramString == '己卯') {
    return '城头土'
  }
  if (paramString == '庚辰' || paramString == '辛巳') {
    return '白蜡金'
  }
  if (paramString == '壬午' || paramString == '癸未') {
    return '杨柳木'
  }
  if (paramString == '甲申' || paramString == '乙酉') {
    return '泉中水'
  }
  if (paramString == '丙戌' || paramString == '丁亥') {
    return '屋上土'
  }
  if (paramString == '戊子' || paramString == '己丑') {
    return '霹雳火'
  }
  if (paramString == '庚寅' || paramString == '辛卯') {
    return '松柏木'
  }
  if (paramString == '壬辰' || paramString == '癸巳') {
    return '长流水'
  }
  if (paramString == '甲午' || paramString == '乙未') {
    return '沙中金'
  }
  if (paramString == '丙申' || paramString == '丁酉') {
    return '山下火'
  }
  if (paramString == '戊戌' || paramString == '己亥') {
    return '平地木'
  }
  if (paramString == '庚子' || paramString == '辛丑') {
    return '壁上土'
  }
  if (paramString == '壬寅' || paramString == '癸卯') {
    return '金箔金'
  }
  if (paramString == '甲辰' || paramString == '乙巳') {
    return '覆灯火'
  }
  if (paramString == '丙午' || paramString == '丁未') {
    return '天河水'
  }
  if (paramString == '戊申' || paramString == '己酉') {
    return '大驿土'
  }
  if (paramString == '庚戌' || paramString == '辛亥') {
    return '钗钏金'
  }
  if (paramString == '壬子' || paramString == '癸丑') {
    return '桑柘木'
  }
  if (paramString == '甲寅' || paramString == '乙卯') {
    return '大溪水'
  }
  if (paramString == '丙辰' || paramString == '丁巳') {
    return '沙中土'
  }
  if (paramString == '戊午' || paramString == '己未') {
    return '天上火'
  }
  if (paramString == '庚申' || paramString == '辛酉') {
    return '石榴木'
  }
  if (paramString == '壬戌' || paramString == '癸亥') {
    return '大海水'
  }
  return ''
}

/**
 * 获取十二长生值
 * */
export function get12ChangSheng(rigan, zhi) {
  var base = changSheng12[0]
  var gId = getGanId(rigan) + 1
  var base_zhi = changSheng12[gId]
  var index = 0
  for (var i = 0; i < base_zhi.length; i++) {
    if (zhi == base_zhi[i]) {
      index = i
      break
    }
  }
  return base[index]
}

export function getZhuKongWang(gan, zhi) {
  var kw = ['', '']
  var ganId = getBaseGanZhiId(gan, 0)
  var zhiId = getBaseGanZhiId(zhi, 1)
  var index = zhiId + (TianGan.length - ganId)

  if (index < DiZhi.length) {
    kw[0] = DiZhi[index]
  } else {
    index = index % 12
    kw[0] = DiZhi[index]
  }
  if (index + 1 < DiZhi.length) {
    kw[1] = DiZhi[index + 1]
  } else {
    index = (index + 1) % 12
    kw[1] = DiZhi[index]
  }
  return kw[0] + kw[1]
}

export function getBaseGanZhiId(gz, type) {
  var index = 0
  if (type == 0) {
    for (var i = 0; i < TianGan.length; i++) {
      if (gz == TianGan[i]) {
        index = i
      }
    }
  } else {
    for (var i = 0; i < DiZhi.length; i++) {
      if (gz == DiZhi[i]) {
        index = i
      }
    }
  }
  return index
}

export function ArrayToStrGZTips(arr, sstr) {
  let ret = ''
  for (let i = 0; i < arr.length; i++) {
    ret += arr[i].split(',')[0]
    if (i < arr.length - 1) ret += sstr
  }
  return ret
}

/**
 * 根据年月获取月干支
 */
export function getYueGan(year, month) {
  let initnum = 1801 * 12 + 1
  let newnum = year * 12 + month
  if (newnum >= initnum) {
    let index = (newnum - initnum + 6) % 10
    return TianGan[index]
  }
  return ''
}

// 根据年月获取节气
export function getJieqiWithYearAndMonth(year, month) {
  const ret = ['', '']
  if (!_JieQiData[year] || !_JieQiData[year][month]) return ret

  const date = _JieQiData[year][month]
  ret[0] = year + '-' + month + '-' + date[1]
  ret[1] = date[0]
  ret[2] = date[2]
  return ret
}

// 根据年月获取节气
export function getJieqiWithYearAndMonth2(year, month) {
  const ret = ['', '']
  if (!_JieQiData2[year] || !_JieQiData2[year][month]) return ret

  const date = _JieQiData2[year][month]
  ret[0] = year + '-' + month + '-' + date[1]
  ret[1] = date[0]
  ret[2] = date[2]
  return ret
}

/**
 * 获取日干支对应对应的时干支map
 */
export function getMapShiGan(gan) {
  let mapShiGan = initMapShiGan()
  return mapShiGan.get(gan)
}

/**
 * 初始化时对应的干支map
 */
export function initMapShiGan() {
  let mapShiGan = new Map()
  let m1 = new Map()
  m1.set('子', '甲')
  m1.set('丑', '乙')
  m1.set('寅', '丙')
  m1.set('卯', '丁')
  m1.set('辰', '戊')
  m1.set('巳', '己')
  m1.set('午', '庚')
  m1.set('未', '辛')
  m1.set('申', '壬')
  m1.set('酉', '癸')
  m1.set('戌', '甲')
  m1.set('亥', '乙')
  mapShiGan.set('甲', m1)
  mapShiGan.set('己', m1)

  let m2 = new Map()
  m2.set('子', '丙')
  m2.set('丑', '丁')
  m2.set('寅', '戊')
  m2.set('卯', '己')
  m2.set('辰', '庚')
  m2.set('巳', '辛')
  m2.set('午', '壬')
  m2.set('未', '癸')
  m2.set('申', '甲')
  m2.set('酉', '乙')
  m2.set('戌', '丙')
  m2.set('亥', '丁')
  mapShiGan.set('乙', m2)
  mapShiGan.set('庚', m2)

  let m3 = new Map()
  m3.set('子', '戊')
  m3.set('丑', '己')
  m3.set('寅', '庚')
  m3.set('卯', '辛')
  m3.set('辰', '壬')
  m3.set('巳', '癸')
  m3.set('午', '甲')
  m3.set('未', '乙')
  m3.set('申', '丙')
  m3.set('酉', '丁')
  m3.set('戌', '戊')
  m3.set('亥', '己')
  mapShiGan.set('丙', m3)
  mapShiGan.set('辛', m3)

  let m4 = new Map()
  m4.set('子', '庚')
  m4.set('丑', '辛')
  m4.set('寅', '壬')
  m4.set('卯', '癸')
  m4.set('辰', '甲')
  m4.set('巳', '乙')
  m4.set('午', '丙')
  m4.set('未', '丁')
  m4.set('申', '戊')
  m4.set('酉', '己')
  m4.set('戌', '庚')
  m4.set('亥', '辛')
  mapShiGan.set('丁', m4)
  mapShiGan.set('壬', m4)

  let m5 = new Map()
  m5.set('子', '壬')
  m5.set('丑', '癸')
  m5.set('寅', '甲')
  m5.set('卯', '乙')
  m5.set('辰', '丙')
  m5.set('巳', '丁')
  m5.set('午', '戊')
  m5.set('未', '己')
  m5.set('申', '庚')
  m5.set('酉', '辛')
  m5.set('戌', '壬')
  m5.set('亥', '癸')
  mapShiGan.set('戊', m5)
  mapShiGan.set('癸', m5)
  return mapShiGan
}

export function wxForBz(item) {
  var wx = ''
  if (item == '甲' || item == '乙' || item == '寅' || item == '卯') {
    wx = '木'
  }
  if (item == '丙' || item == '丁' || item == '巳' || item == '午') {
    wx = '火'
  }
  if (
    item == '戊' ||
    item == '己' ||
    item == '丑' ||
    item == '辰' ||
    item == '未' ||
    item == '戌'
  ) {
    wx = '土'
  }
  if (item == '庚' || item == '辛' || item == '申' || item == '酉') {
    wx = '金'
  }
  if (item == '壬' || item == '癸' || item == '子' || item == '亥') {
    wx = '水'
  }
  return wx
}

// 清除排盘数据前几项
const removePanDatas = (panDatas, num) => {
  while (panDatas.rowTitle.length > num) {
    panDatas.rowTitle.shift()
    panDatas.zhuxing.shift()
    panDatas.tiangan.shift()
    panDatas.dizhi.shift()
    panDatas.canggan.shift()
    panDatas.fuxing.shift()
    panDatas.xingyun.shift()
    panDatas.zizuo.shift()
    panDatas.kongwang.shift()
    panDatas.nayin.shift()
    panDatas.shensha.shift()
  }
}

export const getWXIcon = (gan) => {
  let wx = ''
  if (/^(木|火|土|金|水)$/.test(gan)) {
    wx = gan
  } else if (/^(甲|乙|寅|卯)$/.test(gan)) {
    wx = '木'
  } else if (/^(丙|丁|巳|午)$/.test(gan)) {
    wx = '火'
  } else if (/^(戊|己|丑|辰|未|戌)$/.test(gan)) {
    wx = '土'
  } else if (/^(庚|辛|申|酉)$/.test(gan)) {
    wx = '金'
  } else if (/^(壬|癸|子|亥)$/.test(gan)) {
    wx = '水'
  }
  switch (wx) {
    case '木':
      return require('@/assets/images/icon_wx_mu.png')
    case '火':
      return require('@/assets/images/icon_wx_huo.png')
    case '土':
      return require('@/assets/images/icon_wx_tu.png')
    case '金':
      return require('@/assets/images/icon_wx_jin.png')
    case '水':
      return require('@/assets/images/icon_wx_shui.png')
    default:
      return ''
  }
}

export async function getXZParmFromSetting3(setting3, bzArr) {
  const guid = store.getters.userguid
  let ylCode = getYueLingToCode(bzArr[3])
  let xzparm = ''
  let xzSpcgeju1 = setting3[14].mainSelectedCode
  let xzSpcgeju2 = setting3[15].mainSelectedCode
  let mainSelectedCode = setting3[ylCode].mainSelectedCode ^ 1
  let contentCode = setting3[ylCode].contentCode.join(',')
  let bzstr = ''
  for (let i = 0; i < 8; i++) bzstr += bzArr[i]
  if (ylCode < 8) {
    xzparm =
      setting3[12].mainSelectedCode +
      ',' +
      setting3[13].mainSelectedCode +
      ',' +
      mainSelectedCode +
      ',' +
      contentCode +
      ',' +
      '0,0,0,0,0,0,0'
  } else {
    //三换二，第六换到第四去，第四跟第五互换；这一步的兼容是服务器需要的透干下半部分中：从上往下开始编号，而我的则是从上往下，switch在最后一位
    // let arrCode = []
    // arrCode.push(contentCode.split(',')[5])
    // arrCode.push(contentCode.split(',')[3])
    // arrCode.push(contentCode.split(',')[4])
    contentCode =
      contentCode.slice(0, 5) +
      contentCode.substr(9, 2) +
      contentCode.substr(5, 2) +
      contentCode.substr(7, 2)

    xzparm =
      setting3[12].mainSelectedCode +
      ',' +
      setting3[13].mainSelectedCode +
      ',' +
      '0,0,0,0,0,0' +
      ',' +
      mainSelectedCode +
      ',' +
      contentCode
  }

  let xzResult
  await getGeJu({
    bz: bzstr,
    guid,
    parm: xzparm,
    spcgeju1: xzSpcgeju1,
    spcgeju2: xzSpcgeju2,
  }).then(async (res) => {
    xzResult = res
    await store.dispatch('page/setAppMainLoading', false)
  })
  console.log('xzResult', xzResult)
  return JSON.stringify(xzResult)
}

export function initSetting3() {
  return [
    {
      mainSelectedCode: 0,
      contentCode: [0, 1, 0, 0, 1],
    },
    {
      mainSelectedCode: 0,
      contentCode: [0, 1, 0, 0, 1],
    },
    {
      mainSelectedCode: 0,
      contentCode: [0, 1, 0, 0, 1],
    },
    {
      mainSelectedCode: 0,
      contentCode: [0, 1, 0, 0, 1],
    },
    {
      mainSelectedCode: 0,
      contentCode: [0, 1, 0, 0, 1],
    },
    {
      mainSelectedCode: 0,
      contentCode: [0, 1, 0, 0, 1],
    },
    {
      mainSelectedCode: 0,
      contentCode: [0, 1, 0, 0, 1],
    },
    {
      mainSelectedCode: 0,
      contentCode: [0, 1, 0, 0, 1],
    },
    {
      mainSelectedCode: 1,
      contentCode: [0, 1, 0, 0, 1, 1],
    },
    {
      mainSelectedCode: 1,
      contentCode: [0, 1, 0, 0, 1, 1],
    },
    {
      mainSelectedCode: 1,
      contentCode: [0, 1, 0, 0, 1, 1],
    },
    {
      mainSelectedCode: 1,
      contentCode: [0, 1, 0, 0, 1, 1],
    },
    {
      mainSelectedCode: 1,
      contentCode: [],
    },
    {
      mainSelectedCode: 1,
      contentCode: [],
    },
    {
      mainSelectedCode: 1,
      contentCode: [],
    },
    {
      mainSelectedCode: 1,
      contentCode: [],
    },
  ]
}

/**
 * @param {给小真智能的后台数据去格化为客户端专用}
 * @return  json = JSON.stringify({  yyText:  , gjItems: }) 格式都为字符串
 */
export function getXZParmFromClient(xzResult) {
  let obj = JSON.parse(xzResult)
  let contentMain = obj.data.split(';')
  let contentGJ = contentMain[1]
  let arrTemp = []
  if (obj.data == '') return JSON.stringify('')
  for (let i = 0; i < contentMain.length; i++) {
    if (
      contentGJ.split(',')[i] == '' ||
      typeof contentGJ.split(',')[i] == 'undefined'
    )
      continue
    arrTemp.push(contentGJ.split(',')[i] + '格')
  }
  if (obj.data != '') {
    let json = JSON.stringify({
      yyText: contentMain[0], //阴阳text
      gjItems: arrTemp.join(','), //格局items：
    })
    return json
  }
}

/**
 * 根据月令返回它的下标码：下标码对应的是setting3的数组下标
 */
export function getYueLingToCode(yueling) {
  return ylcode.indexOf(yueling)
}

export function thysInit() {
  let thysDict = {}
  let thysDataStr =
    '丙 癸,丙 癸,壬 庚,庚 甲,丙 甲 癸,丙 庚 甲,戊 甲 壬 丙 丁,己 壬 庚,庚 丙 戊,辛 丙\n' +
    '庚 丙 丁 戊 己,丙 癸,壬 己,庚 甲,丙 甲 癸,甲 丙 癸,丁 甲 庚 丙,壬 甲,庚 辛 戊,庚 辛\n' +
    '庚 丁 壬,癸 丙 戊,壬 甲,甲 庚,甲 丙 癸,丙 癸 甲,甲 丁 壬 癸,壬 甲,甲 庚,丙 辛 甲\n' +
    '癸 庚 丁,癸,壬 癸 庚,甲 庚,甲 丙 癸,癸 丙,壬 戊 丙 丁,壬 甲 癸,壬 辛 庚 癸,辛\n' +
    '癸 庚 丁,癸 丙,壬 庚,壬 癸 庚,壬 甲 丙,癸 丙,壬 癸,壬 己 癸,癸 庚 辛,庚 辛 壬 癸\n' +
    '癸 庚 丁,癸 丙,壬 庚,甲 壬 庚,癸 丙 甲,癸 丙,丁 甲,壬 庚 甲,辛 甲,庚 辛 壬 癸\n' +
    '庚 丁 壬,丙 癸 己,壬 戊,甲 丙 庚 戊,丙 癸 甲,丙 癸,丁 甲,壬 甲 戊,戊 丁,丁\n' +
    '庚 丁 丙,癸 丙 丁,壬 癸,甲 丙 庚 戊,丙 癸,丙 癸,丁 甲 丙,壬 甲,甲 庚,辛 丙\n' +
    '庚 甲 丁 壬 癸,癸 辛,甲 壬,甲 戊 庚,甲 丙 癸,甲 丙 癸,甲 壬,壬 甲,甲 丙,辛 甲 壬 癸\n' +
    '庚 丁 丙 戊,丙 戊,甲 戊 庚 壬,甲 庚,甲 丙,丙 甲 戊,丁 丙,壬 丙,戊 丙 庚,庚 辛 戊 丁\n' +
    '丁 庚 丙,丙,壬 戊 己,甲 庚,丙 甲,丙 甲 戊,丁 甲 丙,丙 戊 壬 甲,戊 丙,丙 辛\n' +
    '丁 庚 丙,丙,壬 甲,甲 庚,丙 甲,丙 甲 戊,丁 甲 丙,丙 壬 戊 己,丙 甲 丁,丙 丁'

  let tian_gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  let di_zhi = [
    '寅',
    '卯',
    '辰',
    '巳',
    '午',
    '未',
    '申',
    '酉',
    '戌',
    '亥',
    '子',
    '丑',
  ]
  let arr1 = thysDataStr.split('\n')
  for (let i = 0; i < arr1.length; i++) {
    let arr2 = arr1[i].split(',')
    for (let j = 0; j < arr2.length; j++) {
      thysDict[tian_gan[j] + di_zhi[i]] = arr2[j]
    }
  }
  return thysDict
}

export function getWxData(zhi) {
  const result = ['', '', '', '', '']
  let yue_index = 0
  for (let i = 0; i < wx_wangshuai[0].length; i++) {
    if (wx_wangshuai[0][i] == wxForBz(zhi)) {
      yue_index = i + 1
      break
    }
  }

  const wx_attr = wx_wangshuai[yue_index]
  const wx = ['旺', '相', '休', '囚', '死']
  const tmpwx = ['', '', '', '', '']
  tmpwx[0] = '金' + wx_attr[0]
  tmpwx[1] = '木' + wx_attr[1]
  tmpwx[2] = '水' + wx_attr[2]
  tmpwx[3] = '火' + wx_attr[3]
  tmpwx[4] = '土' + wx_attr[4]

  for (let i = 0; i < wx.length; i++) {
    for (let j = 0; j < tmpwx.length; j++) {
      if (tmpwx[j].substring(1, 2) == wx[i]) {
        result[i] = tmpwx[j]
        break
      }
    }
  }

  return result
}

/**
 * 根据年支返回生肖
 *
 * @param nianzhi 年支
 * @return String
 */
export function getShengXiao(nianzhi) {
  const index = getZhiId(nianzhi)
  return animals[index]
}

// 获取生肖index
export function getShengXiaoIndex(nianzhi) {
  return getZhiId(nianzhi)
}

export function getZhiId(z) {
  let index = 0
  for (let i = 0; i < DiZhi.length; i++) {
    if (DiZhi[i] == z) {
      index = i
      break
    }
  }
  return index
}

export function getRiLingToWuXing(riling) {
  let rzStr = ''
  switch (riling) {
    case '甲':
      rzStr = '甲木'
      break
    case '乙':
      rzStr = '乙木'
      break
    case '丙':
      rzStr = '丙火'
      break
    case '丁':
      rzStr = '丁火'
      break
    case '戊':
      rzStr = '戊土'
      break
    case '己':
      rzStr = '己土'
      break
    case '庚':
      rzStr = '庚金'
      break
    case '辛':
      rzStr = '辛金'
      break
    case '壬':
      rzStr = '壬水'
      break
    case '癸':
      rzStr = '癸水'
      break
  }
  return rzStr
}

export function getShengWX(wx) {
  if (wx == '金') {
    return '土'
  } else if (wx == '木') {
    return '水'
  } else if (wx == '水') {
    return '金'
  } else if (wx == '火') {
    return '木'
  } else if (wx == '土') {
    return '火'
  } else {
    return ''
  }
}

/**
 * 根据农历月获取索引:
 *   正月0 腊月11 闰月按润哪个月处理 eg：润二月 取二月 1
 */
export function getIndexOfLunarM(month) {
  let index = 0
  if (/闰/.test(month)) {
    index = monthArray.findIndex((m) => month.slice(1) == m)
  } else {
    index = monthArray.findIndex((m) => month == m)
  }
  return index
}

/**
 * 根据农历日获取索引:
 *   初一0 三十29
 */
export function getIndexOfLunarD(day) {
  return dayArray.findIndex((d) => day == d) || 0
}

const rdic = {
  土: ['金', '火', '水', '木'],
  金: ['水', '土', '木', '火'],
  火: ['土', '木', '金', '水'],
  水: ['木', '金', '火', '土'],
  木: ['火', '水', '土', '金'],
}
const ssArr = ['食伤', '印绶', '财才', '官杀']
/**
 * 获取五行能量的十神
 * @param {*} rzwx 日支
 * @param {*} wx 五行
 * @returns
 */
export const getWXSS = (rz, wx) => {
  let res = ''
  const rzwx = getWxOfGz(rz)
  if (rzwx === wx) res = '比劫'
  else {
    const index = rdic[rzwx].findIndex((item) => item === wx)
    if (index >= 0) res = ssArr[index]
  }
  return res
}

/**
 * 时间数组转字符串: [2020,10,1,12,12,0] => 2020-10-01 12:12:00
 * @param {Number[]|String[]} arr 
 * @returns {String}
 */
export const getDateTimeStr = (arr, isAddZero = false) => {
  if (isAddZero) {
    return `${arr[0]}-${getAddZero(arr[1])}-${getAddZero(arr[2])} ${getAddZero(arr[3])}:${getAddZero(arr[4])}:${getAddZero(arr[5] || 0)}`
  } else {
    return `${arr[0]}-${arr[1]}-${arr[2]} ${arr[3]}:${arr[4]}:${arr[5] || 0}`
  }
}

export function getRiLingToCode(riling) {
  let rzCode = -1
  switch (riling) {
      case '甲':
          rzCode = 0
          break;
      case '乙':
          rzCode = 1
          break;
      case '丙':
          rzCode = 2
          break;
      case '丁':
          rzCode = 3
          break;
      case '戊':
          rzCode = 4
          break;
      case '己':
          rzCode = 5
          break;
      case '庚':
          rzCode = 6
          break;
      case '辛':
          rzCode = 7
          break;
      case '壬':
          rzCode = 8
          break;
      case '癸':
          rzCode = 9
          break;
  }
  return rzCode
}

import { sysSSTypes, ssMainTags, sysSSList } from './static.js'

export const getGZStr = (id) => {
  let str = ''
  if (id) {
    id = +id
    if (1 <= id && id <= 6) {
      str = '干'
    } else if (7 <= id && id <= 11) {
      str = '支'
    } else if (13 <= id && id <= 16) {
      str = '干支'
    } else if (id === 17 || (20 <= id && id <= 22)) {
      str = '纳音'
    } else if (id === 18) {
      str = '天干相连'
    } else if (23 <= id && id <= 26) {
      str = '干支一柱'
    }
  }
  return str
}

export const getTypeName = (typeId) => {
  typeId = +typeId
  let typeName = ''
  if (typeId >= 0) {
    typeName = sysSSTypes[typeId]
  } else if (typeId === -3) {
    typeName = '天干相连'
  }
  return typeName
}

export const getTypeId = (main, tags) => {
  let index = -1,
    t1 = '',
    t2 = ''
  if (main) {
    t1 = getGZStr(main.split(',')[0])
  }
  if (tags) {
    t2 = getGZStr(tags.split(',')[0])
  }
  if (t1 === '天干相连') {
    index = -3
  } else if (t1 === '干支一柱') {
    index = sysSSTypes.findIndex((item) => item === t1)
  } else {
    index = sysSSTypes.findIndex((item) => item === `${t1}对${t2}`)
  }
  return index
}

export const getMainTagsName = (main, tags) => {
  let t1 = '',
    t2 = ''
  if (main && main !== '0') {
    main.split(',').forEach((item) => {
      const str = getNameById(+item)
      if (str) t1 += (t1 ? '，' : '') + str
    })
  }
  if (tags && tags !== '0') {
    tags.split(',').forEach((item) => {
      const str = getNameById(+item)
      if (str) t2 += (t2 ? '，' : '') + str
    })
  }
  return `${t1 + (t1 && t2 ? '—' : '') + t2}`
}

function getNameById(id) {
  let str = ''
  if (id === 18) {
    str = '年，月，日，时'
  } else if (
    (1 <= id && id <= 4) ||
    (7 <= id && id <= 10) ||
    (13 <= id && id <= 17) ||
    (20 <= id && id <= 22)
  ) {
    str = ssMainTags[id][0]
  } else if (id === 5 || id === 11 || id === 19) {
    str = '流运'
  } else if (23 <= id && id <= 26) {
    str = ssMainTags[id].replace('干支一', '')
  }
  return str
}

export const getDataName = (data) => {
  let str = ''
  for (let key in data) {
    let t = key.indexOf('纳音') >= 0 ? key[2] : key
    str += (str ? '，' : '') + `${t + (data[key] ? '-' : '') + data[key]}`
  }
  return str
}

export const getID = () => {
  let id = 0
  let settingData = JSON.parse(localStorage.getItem('setting_shensha') || '{}'),
    settingDataSys = JSON.parse(
      localStorage.getItem('setting_shensha_sys') || '{}',
    )
  settingData = { ...settingData, ...settingDataSys }
  for (let key in settingData) {
    const arr = settingData[key].split('|')
    const _id = parseInt(arr[0])
    if (_id > id) {
      id = _id
    }
  }
  return id + 1
}

export const getDataID = () => {
  let id = parseInt(sysSSList[sysSSList.length - 1].id) + 100
  let settingData = store.getters.setting_shensha,
    settingDataSys = store.getters.setting_shensha_sys
  settingData = { ...settingData, ...settingDataSys }
  for (let key in settingData) {
    const _id = parseInt(key.slice(4))
    if (_id > id) {
      id = _id
    }
  }
  return id + 1
}

// 根据 main 或者 tags 获取 topSelected 或者 bottomSelected
function getSelectStrFromMainOrTags(main) {
  const selected = [],
    arr = main.split(',')
  arr.forEach((item) => {
    if (item == 1 || item == 7 || item == 13 || item == 17) {
      selected.push('0') //年
    } else if (item == 2 || item == 8 || item == 14) {
      selected.push('1') //月
    } else if (item == 3 || item == 9 || item == 15) {
      selected.push('2') //日
    } else if (item == 4 || item == 10 || item == 16) {
      selected.push('3') //时
    } else if (item == 5 || item == 11 || item == 19) {
      selected.push('4') //大运
    } else if (item == 6 || item == 12) {
      selected.push('5') //流年
    } else if (item == 18) {
      selected.push('6')
    }
  })
  return selected.join(',')
}

export const getPostSSValue = (ssData, isSys = true, index = 0) => {
  const id = getID(),
    dataID = ssData.idArr[index],
    name = ssData.name,
    main = ssData.mainArr[index],
    tags = ssData.tagsArr[index],
    sex = ssData.sexArr[index],
    data = JSON.stringify(ssData.dataArr[index]),
    isShow = ssData.switch,
    type = ssData.typeIdArr[index],
    topSelected = getSelectStrFromMainOrTags(ssData.mainArr[index]),
    bottomSelected = getSelectStrFromMainOrTags(ssData.tagsArr[index])
  return `${id}|${dataID}|${name}|${main}|${tags}|${sex}|${data}|${isShow}|${type}|${topSelected}|${bottomSelected}|${isSys}`
}

/**
 * 重置系统神煞
 */
export const handleResetSysSS = async () => {
  await store.dispatch('setting/resetSysShensha')
}

/**
 * 处理登录获取设置数据
 */
export const handleGetSetting = async () => {
  const guid = store.getters.userguid
  if (!guid) return false
  await getSetting(guid).then(async (res) => {
    console.log('getSetting', res)
    if (res.code == 0 && Array.isArray(res.data)) {
      let midnightData = 'false',
        gzRelationData = JSON.parse(JSON.stringify(setting_gzrelation_default)),
        dizhizgData = JSON.parse(JSON.stringify(setting_dizhizg_default)),
        ryslData = JSON.parse(
          localStorage.getItem('setting_rysl') ||
            JSON.stringify(setting_rysl_default),
        ),
        shenshaSysData = {},
        shenshaData = {},
        settingData = {},
        settingAge = 'false',
        zhijiexipan = 'false'
      res.data.forEach((item) => {
        // 早晚子时
        // if (item.setkey === 'isYeZiShi') {
        //   midnightData = item.setvalue
        //   return
        // }

        // 干支关系
        if (item.setkey.indexOf('GZMainState') >= 0) {
          const id = +item.setkey.split('GZMainState')[1]
          if (id < 1) return
          if (id <= 3) {
            gzRelationData.tg[id - 1].switch =
              item.setvalue == 1 || item.setvalue === 'true'
          } else if (id < 12) {
            gzRelationData.dz[id - 4].switch =
              item.setvalue == 1 || item.setvalue === 'true'
          } else {
            if (gzRelationData.zz && gzRelationData.zz[id])
              gzRelationData.zz[id].switch = item.setvalue == 1 || item.setvalue === 'true'
          }
          return
        }
        if (item.setkey.indexOf('GZMainRule') >= 0) {
          const id = +item.setkey.split('GZMainRule')[1]
          if (id < 1) return
          let selected = JSON.parse(item.setvalue)
          if (typeof selected == 'boolean') {
            selected = selected ? 0 : 1
          }
          if (id <= 3) {
            gzRelationData.tg[id - 1].selected = selected
          } else if (id < 12) {
            gzRelationData.dz[id - 4].selected = selected
          } else {
            if (gzRelationData.zz && gzRelationData.zz[id])
              gzRelationData.zz[id].selected = selected
          }
          return
        }
        if (item.setkey.indexOf('GZItemState') >= 0) {
          const id = +item.setkey.split('GZItemState')[1]
          if (id < 1) return
          let type,
            gzIndex,
            listIndex,
            listsIndex = 0
          if (id < 20) {
            type = 'tg'
            gzRelation_tg.find((item, index) => {
              const _listsIndex = item.lists.findIndex((item2, index2) => {
                const _listIndex = item2.list.findIndex((item3, index3) => {
                  return item3.id == id
                })
                if (_listIndex >= 0) {
                  gzIndex = index
                  listIndex = _listIndex
                  return true
                } else {
                  return false
                }
              })
              if (_listsIndex >= 0) {
                gzIndex = index
                listsIndex = _listsIndex
                return true
              } else {
                return false
              }
            })
          } else if (id < 99) {
            type = 'dz'
            gzRelation_dz.find((item, index) => {
              const _listsIndex = item.lists.findIndex((item2, index2) => {
                const _listIndex = item2.list.findIndex((item3, index3) => {
                  return item3.id == id
                })
                if (_listIndex >= 0) {
                  gzIndex = index
                  listIndex = _listIndex
                  return true
                } else {
                  return false
                }
              })
              if (_listsIndex >= 0) {
                listsIndex = _listsIndex
                return true
              } else {
                return false
              }
            })
          } else {
            return false
          }
          const datas = gzRelationData[type][gzIndex].datas
          const str = datas[listsIndex >= 0 ? listsIndex : 0]
          datas[listsIndex >= 0 ? listsIndex : 0] =
            str.slice(0, listIndex) +
            (JSON.parse(item.setvalue) ? 1 : 0) +
            str.slice(listIndex + 1)
        }
        // 地支藏干
        dizhizgData.find((dizhizg) => {
          if (item.setkey === dizhizg.id) {
            dizhizg.value = item.setvalue
            return true
          }
          return false
        })
        // 人元司令
        if (item.setkey === 'ryslfyShow') {
          ryslData.switch = JSON.parse(item.setvalue)
          return
        }

        // 神煞
        if (item.setkey.indexOf('CSS_') >= 0) {
          const arr = item.setvalue.split('|')
          const isSys = JSON.parse(arr[11])

          // 删除对数组中与坐数组相同的元素
          const zuoArr = arr[3].split(',')
          const duiArr = arr[4].split(',').filter((t) => !zuoArr.includes(t))
          arr[4] = duiArr.join(',')
          item.setvalue = arr.join('|')

          if (isSys) {
            shenshaSysData[item.setkey] = item.setvalue
          } else {
            shenshaData[item.setkey] = item.setvalue
          }
        }

        // 命身宫
        if (item.setkey.indexOf('GongMethod') >= 0) {
          if (item.setkey === 'mingGongMethod') {
            settingData['showMing'] = JSON.parse(item.setvalue)
          } else {
            settingData['showShen'] = JSON.parse(item.setvalue)
          }
        }

        // 虚实岁
        if (item.setkey.indexOf('xuShiSui') >= 0) {
          settingAge = JSON.parse(item.setvalue)
        }

        // // 偏好设置 (直接进入细盘)
        // if (item.setkey.indexOf('isXiPan') >= 0) {
        //   zhijiexipan = item.setvalue
        // }
      })
      // 设置缓存
      localStorage.setItem('setting_gzrelation', JSON.stringify(gzRelationData))
      localStorage.setItem('setting_dizhizg', JSON.stringify(dizhizgData))
      localStorage.setItem('setting_rysl', JSON.stringify(ryslData))
      localStorage.setItem(
        'setting_shensha_sys',
        JSON.stringify(shenshaSysData),
      )
      localStorage.setItem('setting_shensha', JSON.stringify(shenshaData))
      localStorage.setItem('setting_other', JSON.stringify(settingData))
      localStorage.setItem('setting_age', settingAge)
      // let list = []
      // for (let key in shenshaData) {
      //   const curSetting = shenshaData[key].split('|')
      //   const ssData = {
      //     name: curSetting[2],
      //   }
      //   list.push(ssData)
      // }
      // const map = {}
      // list.forEach((item, index) => {
      //   if (map[item.name]) {
      //   } else {
      //     map[item.name] = {
      //       name: item.name,
      //     }
      //   }
      // })
      // let otherList = Object.values(map)
      // // 设置自定义神煞的备注
      // let obj = {}
      // for (let i = 0; i < otherList.length; i++) {
      //   obj[otherList[i].name] = ''
      // }
      // for (let key1 in obj) {
      //   for (let key2 in store.getters.setting_desc) {
      //     if (key1 === key2) {
      //       obj[key1] = store.getters.setting_desc[key2]
      //     }
      //   }
      // }
      // await store.dispatch('setting/setDesc', obj)
      // await store.dispatch('setting/setMidnight', midnightData)
      // await store.dispatch('setting/setGzrelation', gzRelationData)
      // await store.dispatch('setting/setDizhizg', dizhizgData)
      // await store.dispatch('setting/setRysl', ryslData)
      // await store.dispatch('setting/setShenshaSys', shenshaSysData)
      // await store.dispatch('setting/setShensha', shenshaData)
      // await store.dispatch('setting/setTingOther', settingData)
      // await store.dispatch('setting/setTingAge', settingAge)
      // await store.commit('settingShow/setPreferenceIsShowInfo', {
      //   key: 'zhijiexipan',
      //   checked: JSON.parse(zhijiexipan),
      // })
    }
  })
}
