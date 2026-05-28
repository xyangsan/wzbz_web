import router from '@/router'
import store from '@/store'
import { ElMessage } from 'element-plus'
import {
  lunarInfo,
  ShiChaXiuZheng,
  monthArray,
  dayArray,
  blackwordList,
} from '@/static'
import model2 from '@/components/wz-index/model.js'
import model from '@/views/record/assets/model'

import { getBlackword } from '@/api/bazi.js'

import * as homeApi from '@/api/home-api'
import {
  getShengXiaoIndex
} from '@/views/paipan-result/utils.js'

/**
 * 对象转params格式参数
 * @param object {arg1:val1,arg2:val2}
 * @return string '?arg1=val1&arg2=val2'
 */
export function objToParams(params) {
  let res = Object.keys(params).reduce(
    (arr, cur) => `${arr}${cur}=${params[cur]}&`,
    '?',
  )
  return res.slice(0, -1)
}

// 路由跳转
export async function navigationTo({
  path,
  params = {},
  next = true,
  isBlank = false,
}) {
  if (path.indexOf('paipan-result') > -1) {
    if (router.currentRoute.value.name == 'PaipanResult') return
    console.log("看看传的啥：", params);
    
    const { href } = router.resolve({
      path: '/paipan-result/index',
      query: params,
    })
    window.open(href, '_blank')
    return
  } else if (path.indexOf('hepan-result') > -1) {
    await store.dispatch('page/setSidebarIndex', 4)
    next ? router.push({ path: '/hepan-result/index', query: params }) : ''
    return
  } else if (path.indexOf('wealth-result') > -1) {
    await store.dispatch('page/setSidebarIndex', 5)
    next ? router.push({ path: '/wealth-result/index', query: params }) : ''
    return
  } else if (path.indexOf('login') > -1) {
    await store.dispatch('page/setSidebarIndex', -1)
    next ? router.push({ path: '/login', query: params }) : ''
    return
  } 
  else if (path.indexOf('vip-page') > -1) {
    await store.dispatch('page/setSidebarIndex', 6)
    next ? router.push({ path: '/vip-page/index', query: params }) : ''
    return
  }
  switch (path) {
    case '/':
      await store.dispatch('page/setSidebarIndex', 0)
      if (isBlank) {
        const { href } = router.resolve({
          path: '/',
          query: params,
        })
        window.open(href, '_blank')
      } else {
        next ? router.push({ path: '/', query: params }) : ''
      }
      break
    case 'protocol':
      next ? router.push({ path: '/protocol', query: params }) : ''
      break
    case 'privacy':
      next ? router.push({ path: '/privacy', query: params }) : ''
      break
    case 'window-phone':
      router.push({ path: '/window-phone/index', query: params })
      break
    default:
      const index = store.getters.sidebarRoutes.findIndex(
        (route) => route.path == path,
      )
      if (index >= 0) {
        await store.dispatch('page/setSidebarIndex', index)
        next ? router.push({ path, query: params }) : ''
      } else {
        await store.dispatch('page/setSidebarIndex', 0)
        next ? router.push({ path: '/home/index' }) : ''
      }
  }
}

// 退出登陆
export async function logout() {
  await store.dispatch('permission/logout')
  ElMessage.success('退出成功')
}

// 判断闰年
export function isLeapYear(curYear) {
  let res = false
  if (curYear % 4 === 0) {
    if (curYear % 100 === 0) {
      if (curYear % 400 === 0) res = true
    } else {
      res = true
    }
  }
  return res
}

// 获取闰月
export function getLunarLeapMonth(curYear) {
  let ydata = lunarInfo[curYear - 1801]
  let lm = ydata & 0xf
  let leapMonth = lm == 0xf ? 0 : lm
  return leapMonth
}

// 计算指定农历年、月的天数
export function getDayCountOfLunarMonth(y, m, isLeap) {
  if (isLeap) {
    let leapMonth = getLunarLeapMonth(y)
    if (leapMonth != 0 && leapMonth == m) {
      return (lunarInfo[y - 1801 + 1] & 0xf) == 0xf ? 30 : 29
    }
  } else {
    return (lunarInfo[y - 1801] & (0x10000 >> m)) > 0 ? 30 : 29
  }
}

/**
 * 获取真太阳时
 * @param {Array} 阳历
 * @param {Number} 经度
 * @returns 
 */
export const getSunTime = (solartimeParm, lngParm, isHW = false, isBJTime = false, zone = 8) => {
  // console.log("当前经度：" + lngParm);
  // solartimeParm：2022,05,5,20,48
  // console.log("真太阳时原来的阳历时间：" + solartimeParm);
  let year = solartimeParm[0];
  let month = solartimeParm[1] - 1;
  let day = solartimeParm[2];
  let hour = solartimeParm[3];
  let minute = solartimeParm[4];
  let solarDate = new Date(year, month, day, hour, minute, 0);
  let timestamp = solarDate.getTime();
  // console.log("原来时间：" + solarDate);
  // console.log("原来时间戳：" + timestamp);
  if (lngParm != 120.00) {

    // 首先根据当地的经度，计算出当地的平太阳时：平太阳时 = 北京时间 + 4分钟 × (当地东经经度 - 120)
    let lngRange = lngParm - (isHW ? zone * 15 : 120.00);  // 相差的经度差
    let lngType = 0 // 判断相差的时间是在原来的时间上加减
    if (lngRange >= 0) {
      lngType = 1
    }
    let f = (Math.abs(lngRange) * 4).toFixed(3); // 计算经度差所差的时间：4分钟 × (当地东经经度 - 120)
    if (lngType == 1) {
      solarDate.setTime(timestamp + 1000 * 60 * f);
    } else {
      solarDate.setTime(timestamp - 1000 * 60 * f);
    }
    // console.log("平太阳时：" + solarDate);

    // 再根据真平太阳时时差，把当地的平太阳时转换为真太阳时：真太阳时 = 平太阳时 + 时差
    let xiuZhnegTimestamp = solarDate.getTime(); // 平太阳时时间戳
    let shiChaMonthDay = parseInt(month + 1) + "月" + parseInt(day) + "日";
    // console.log("修正月日: " + shiChaMonthDay);
    let isAddXiuZheng = 0; // 判断相差的时间是在原来的时间上加减
    let xiuZhengShiCha = "";
    for (let i = 0; i < ShiChaXiuZheng.length; i++) {
      let item = ShiChaXiuZheng[i];
      if (item[0] == shiChaMonthDay) {
        xiuZhengShiCha = item[1];
        if (item[2] == -1) {
          isAddXiuZheng = 0;
        } else {
          isAddXiuZheng = 1;
        }
        break;
      }
    }
    let xiuZhengMinute = parseInt(xiuZhengShiCha.split(":")[1]);
    let xiuZhengSecond = parseInt(xiuZhengShiCha.split(":")[2]);
    // console.log("修正分：" + xiuZhengMinute);
    // console.log("修正秒：" + xiuZhengSecond);
    if (isAddXiuZheng == 1) {
      solarDate.setTime(xiuZhnegTimestamp + 1000 * (60 * xiuZhengMinute + xiuZhengSecond));
    } else {
      solarDate.setTime(xiuZhnegTimestamp - 1000 * (60 * xiuZhengMinute + xiuZhengSecond));
    }
    // console.log("修改后真太阳时：" + solarDate);
    let monthTmp = solarDate.getMonth() + 1;
    if (monthTmp == 0) {
      monthTmp = "01";
    } else if (monthTmp < 10) {
      monthTmp = "0" + monthTmp;
    }
    let dayTmp = solarDate.getDate();
    if (dayTmp < 10) {
      dayTmp = "0" + dayTmp;
    }
    let hoursTmp = solarDate.getHours();
    if (hoursTmp < 10) {
      hoursTmp = "0" + hoursTmp;
    }
    let minuteTmp = solarDate.getMinutes();
    if (minuteTmp < 10) {
      minuteTmp = "0" + minuteTmp;
    }
    let secondTmp = solarDate.getSeconds();
    if (secondTmp < 10) {
      secondTmp = "0" + secondTmp;
    }
    let solartimeParmArray = [solarDate.getFullYear(), monthTmp, dayTmp, hoursTmp, minuteTmp, secondTmp];
    // console.log("修改后真太阳时：" + solartimeParmArray);
    if (isBJTime) {
      let newDate = new Date(solartimeParmArray[0], solartimeParmArray[1] - 1, solartimeParmArray[2], solartimeParmArray[3], solartimeParmArray[4], solartimeParmArray[5])
      newDate = new Date(newDate.getTime() + (8 - zone) * 3600000)
      let newY = newDate.getFullYear(),
        newM = newDate.getMonth() + 1,
        newD = newDate.getDate(),
        newH = newDate.getHours(),
        newMin = newDate.getMinutes(),
        newS = newDate.getSeconds()
      newM = newM < 10 ? `0${newM}` : newM
      newD = newD < 10 ? `0${newD}` : newD
      newH = newH < 10 ? `0${newH}` : newH
      newMin = newMin < 10 ? `0${newMin}` : newMin
      newS = newS < 10 ? `0${newS}` : newS
      solartimeParmArray = [newY, newM, newD, newH, newMin, newS]
    }
    return solartimeParmArray;
  } else {
    return [solartimeParm[0], solartimeParm[1], solartimeParm[2], solartimeParm[3], solartimeParm[4], "00"];
  }
}

//  农历转阳历
export function LunarToSolar(my, mm, md, hour, minute) {
  const leepflag = mm.indexOf('闰') > -1
  if (leepflag) {
    mm = mm.replace('闰', '')
  }
  for (let i = 0; i < monthArray.length; i++)
    if (mm == monthArray[i]) mm = i + 1

  for (let i = 0; i < dayArray.length; i++) if (md == dayArray[i]) md = i + 1
  let td = 0
  for (let y = 1801; y < my; y++) {
    let lm = getLunarLeapMonth(y)
    for (let m = 1; m <= 12; m++) {
      td += getDayCountOfLunarMonth(y, m, false)
      if (m == lm) td += getDayCountOfLunarMonth(y, m, true)
    }
  }
  let lm = getLunarLeapMonth(my)
  for (let m = 1; m < mm; m++) {
    td += getDayCountOfLunarMonth(my, m, false)
    if (m == lm) td += getDayCountOfLunarMonth(my, m, true)
  }

  if (leepflag && lm == mm) {
    td += getDayCountOfLunarMonth(my, mm, false)
  }

  td += md

  let stYear = 1801
  let stMonth = 2
  let stDay = 13
  td = td - 1
  let xx = 0
  stDay += td
  while (true) {
    let smd = getMonthDays(stYear, stMonth)

    if (stDay <= smd) break
    
    if (stDay > smd) {
      stDay = stDay - smd
      stMonth += 1
    }
    if (stMonth > 12) {
      stMonth = 1
      stYear += 1
    }

    xx++
    if (xx > 100000) break
  }
  if (stMonth < 10) stMonth = '0' + stMonth
  if (stDay < 10) stDay = '0' + stDay
  return [stYear, stMonth, stDay, hour, minute]
}

// 阳历转农历
export function SolarToLunar(my, mm, md) {
  //1802 12 08
  let stYear = 1801
  let stMonth = 2
  let stDay = 13
  //322 + 365
  let td = 0
  let xx = 0
  while (true) {
    let smd = getMonthDays(stYear, stMonth)
    if (stDay > smd) {
      stDay = 1
      stMonth += 1
    }
    if (stMonth > 12) {
      stMonth = 1
      stYear += 1
    }

    if (stYear == my && stMonth == mm && stDay == md) break
    stDay += 1
    td++

    xx++
    if (xx > 100000) break
  }
  //console.log(td);
  stYear = 1801
  stMonth = 1
  stDay = 1
  xx = 0
  stDay += td
  let ret_leep = false
  while (true) {
    ret_leep = false
    let smd = getDayCountOfLunarMonth(stYear, stMonth, false)
    if (stDay > smd) {
      stDay = stDay - smd
      let lm = getLunarLeapMonth(stYear)
      if (lm == stMonth) {
        smd = getDayCountOfLunarMonth(stYear, stMonth, true)
        if (stDay > smd) {
          stDay = stDay - smd
          stMonth += 1
        }
        ret_leep = true
      } else {
        stMonth += 1
      }
    }
    if (stMonth > 12) {
      stMonth = 1
      stYear += 1
    }

    if (stDay <= smd) break

    xx++
    if (xx > 100000) break
  }
  return stYear + '-' + stMonth + '-' + stDay + ' ' + (ret_leep ? 1 : 0)
}

// 获取指定年月的天数
export function getMonthDays(y, m) {
  switch (m) {
    case 1:
      return 31
    case 2:
      return isLeapYear(y) ? 29 : 28
    case 3:
      return 31
    case 4:
      return 30
    case 5:
      return 31
    case 6:
      return 30
    case 7:
      return 31
    case 8:
      return 31
    case 9:
      return 30
    case 10:
      return 31
    case 11:
      return 30
    case 12:
      return 31
  }
  return 0
}

// 根据干支获取五行
export function getWxOfGz(gz) {
  if (/甲|乙|寅|卯/.test(gz)) {
    return '木'
  } else if (/丙|丁|巳|午/.test(gz)) {
    return '火'
  } else if (/戊|己|丑|辰|未|戌/.test(gz)) {
    return '土'
  } else if (/庚|辛|申|酉/.test(gz)) {
    return '金'
  } else if (/壬|癸|子|亥/.test(gz)) {
    return '水'
  } else {
    return ''
  }
}

// 根据五行获取样式
export function getClassOfWx(wx) {
  switch (wx) {
    case '木':
      return 'woodColor'
    case '火':
      return 'fireColor'
    case '土':
      return 'soilColor'
    case '金':
      return 'goldColor'
    case '水':
      return 'waterColor'
    default:
      return ''
  }
}

// 根据五行获取色值
export function getColorOfWx(wx) {
  switch (wx) {
    case '木':
      return '#07E930'
    case '火':
      return '#D30505'
    case '土':
      return '#8B6D03'
    case '金':
      return '#EF9104'
    case '水':
      return '#2E83F6'
    default:
      return ''
  }
}

/**
 * 根据干支获取样式
 * @param {String} 干支
 * @returns {String}
 */
export const getClassOfGZ = (gz) => {
  if (/甲|乙|寅|卯/.test(gz)) {
    return 'woodColor'
  } else if (/丙|丁|巳|午/.test(gz)) {
    return 'fireColor'
  } else if (/戊|己|丑|辰|未|戌/.test(gz)) {
    return 'soilColor'
  } else if (/庚|辛|申|酉/.test(gz)) {
    return 'goldColor'
  } else if (/壬|癸|子|亥/.test(gz)) {
    return 'waterColor'
  } else {
    return ''
  }
}

// 转11位手机号为 130***02 的格式
export function phoneOmitFn(phone = '') {
  if (phone.length != 11) return
  return phone.slice(0, 3) + '***' + phone.slice(-2)
}

// 封装接口参数对象
export function packageParams(obj) {
  const params = new URLSearchParams()
  for (let key in obj) {
    if (obj[key] === null || obj[key] === undefined) continue
    params.append(key, obj[key])
  }
  return params
}

// 计算指定日期距今几年
export function yearDistance(date) {
  let now = new Date()
  let time = date.getTime() - now.getTime()
  return Math.floor(time / (1000 * 3600 * 24 * 30 * 12))
}

// 防抖
export function debounce(fn, wait) {
  let timer = null
  return function () {
    let context = this
    let args = arguments
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
      timer = null
    }, wait)
  }
}

// 日期数组转字符串
export function dateArrToStr(arr) {
  return `${arr[0]}-${arr[1]}-${arr[2]} ${arr[3]}:${arr[4]}:${arr[5] || '00'}`
}

// 日期字符串转数组
export function dateStrToArr(str) {
  const arr = str.split(' ')
  const date = arr[0].split('-')
  const time = arr[1].split(':')
  return [...date, ...time]
}

// 用户案例数据处理
export function handleUserListItem(item) {
  // item.name = item.name.length > 6 ? item.name.substr(0, 6) + '...' : item.name
  if(item.birthDay.split('-')[0] > 2099){
    item.birthDay = '2099-01-01 00:00:00'
    item.solarTime = '2099-01-01 00:00:00'
    item.sunTime = '2099-01-01 00:00:00'
    item.lunarTime = '2098-12-11 00:00:00'
    item.bz = '戊 午 甲 子 戊 戌 壬 子'
  }
  item.time = model.formatTime(item.solarTime.split(' ')[0])
  let tg = ''
  let dz = ''
  for (let i = 0; i < 8; i++) {
    let flag = ' '
    if (i >= 6) flag = ''
    i % 2 == 0
      ? (tg += item.bz.split(' ')[i] + flag)
      : (dz += item.bz.split(' ')[i] + flag)
  }
  item.animal = getShengXiaoIndex(dz[0]) + 1
  item.tg = tg
  item.dz = dz
}

// 验证限制输入只能保护中文和数字和字母
export function verifyInput(str) {
  const reg = /[\u4e00-\u9fa5]|\w/
  return str.split('').every((val) => reg.test(val))
}

// 敏感词过滤
export function verifySensitiveWord(str) {
  if (
    str.indexOf('习近平') > -1 ||
    str.indexOf('习大大') > -1 ||
    str.indexOf('书记') > -1 ||
    str.indexOf('总理') > -1 ||
    str.indexOf('主席') > -1
  ) {
    return false
  }
  if (Object.hasOwnProperty.call(blackwordList, str)) {
    return false
  }
  return true
}

/**
 * 更新vip等级
 */
export function updateLevel() {
  return new Promise(async (res, rej) => {
    const guid = window.localStorage.getItem('wzbz_userguid')
    const vipUrl = `user/getvipinfo?userguid=${guid}`
    await homeApi.Request(vipUrl, '', 1, 'get').then(async (vipRes) => {
      let vipLevel = vipRes.data.vipLevel,
        expires = vipRes.data.expires
      if (vipLevel == 3) {
        yearDistance(new Date(expires)) >= 60 ? (vipLevel = 4) : ''
      }
      await store.dispatch('permission/setViplevel', vipLevel)
      await store.dispatch('permission/setExpires', expires)
      res(+vipLevel)
    }).catch(() => {
      rej(-1)
    })
  })
}


/**
 * 给小于10的数值添加一个“0”前缀
 * @param {Number|String} num 
 * @returns {String}
 */
export const getAddZero = (num) => {
  num = +num
  return (num < 10 ? '0' : '') + num
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

/**
 * 返回year年二月份的天数
 * @param {Number} year 
 */
export const daysInFebruary = (year) => {
  // 判断是否为闰年的条件
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    // 是闰年，二月有 29 天
    return 29;
  } else {
    // 是平年，二月有 28 天
    return 28;
  }
}


/**
 * 敏感词判断 ,flag是总结的时候，不管1，2级都要替换成*
 */
export const getBlackLebelOfName = async (name, flag) => {
  let res = 0, label = null, newName = name.toLowerCase()
    if(!flag) {
        if (newName.indexOf("习") > -1 || newName.indexOf("书记") > -1) {
          return { level: 1, label: null }; // 提前返回 1 级关键词
        }
    }
    if (res === 0) {
        for (let [key, value] of Object.entries(model2.blackwordList)) {
          const newKey = key.toLowerCase()
            if(newName.indexOf(newKey) >= 0){
                res = value
                if (!flag && value === 1) {
                  return { level: 1, label: null }; // 提前返回 1 级关键词
                }
                if(flag){
                    if(newKey) {
                        const regex = new RegExp(newKey, 'g');
                        const replacement = '*'.repeat(newKey.length);
                        newName = newName.replace(regex, replacement);
                        label = newName
                    }
                } else if(value === 2){
                    const regex = new RegExp(newKey, 'g');
                    label = newName.replace(regex, '*');
                }
            }
        }
    }
    if (res === 0) {
      if (model2.blackwordList_net.length === 0) {
        await getBlackword().then(list => {
          model2.blackwordList_net.push(...list)
        })
      }
      for (let i = 0; i < model2.blackwordList_net.length; i++) {
          const item = model2.blackwordList_net[i]
          const newKey = item.key.toLowerCase() 
          if (newName.indexOf(newKey) >= 0) {
            res = item.type
            if (!flag && res === 1) {
              return { level: 1, label: null }; // 提前返回 1 级关键词
            }
              if (flag) {
                  if(newKey) {
                      const regex = new RegExp(newKey, 'g');
                      const replacement = '*'.repeat(newKey.length);
                      newName = newName.replace(regex, replacement);
                      label = newName
                  }
              } else if (item.type === 2) {
                const regex = new RegExp(newKey, 'g');
                label = newName.replace(regex, '*');
              }
          }
      }
    }
    return {level : res, label}
}