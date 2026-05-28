import * as homeApi from '@/api/home-api'
import { getNote } from '@/api/note'
import { getGeJu, getWXPW2 } from '@/api/bazi'
import { getWXPW } from '@/api/bazi2.js'
import { gejuZhi, setting_geju_default } from '@/components/rule-setting/static'
import store from '@/store'
import {
    wxForBz,
    getShengWX,
} from '@/views/paipan-result/utils.js'

/**
 * 返回小真智能五行能量相关数据
 * @param {String} guid
 * @param {String} bzArr
 * @param {Object} options
 *   unknowhour {Number} 未知时辰
 *   cgArr {Array<Array<String>>} 藏干数据
 * @returns {Object}
 *   mywx {Number} 同党
 *   otherwx {Number} 异党
 *   wxpwArr {Array<Number>} 五行能量 [<widths>,<counts>]
 *   wxcountArr {Array<Number>} 五行个数
 *   cgcountArr {Array<Number>} 含藏干数
 */
export const getWXPWData = (guid, bzArr, options = {}) => {
    const resData = {
        mywx: 0,
        otherwx: 0,
        wxpwArr: new Array(2).fill(0).map(() => new Array(5).fill(0)),
        wxcountArr: new Array(2).fill(0).map(() => new Array(5).fill(0)),
        cgcountArr: new Array(2).fill(0).map(() => new Array(5).fill(0)),
    }
    const bzstr = bzArr.join('')
    return new Promise(async resolve => {
        await getWXPW(guid, bzstr).then(async res => {
            if (!res.data) {
                await getWXPW2(guid, bzstr).then(res2 => {
                    res = res2
                })
            }
            if (!res || !res.data) return resolve(resData)
            const dataArr = res.data.split(' ')
            if (dataArr.length < 2) return resolve(resData)

            // 计算五行能量
            const pwArr = dataArr[1].replace("[", "").replace("]", "").split(",").map(i => +i)
            let total = pwArr.reduce((acc, cur) => acc + cur, 0)
            const wxpwwidth = pwArr.map(i => Math.round(i / (total / 100.0)))
            resData.wxpwArr[0] = [wxpwwidth[1], wxpwwidth[2], wxpwwidth[3], wxpwwidth[4], wxpwwidth[0]]
            resData.wxpwArr[1] = [pwArr[1], pwArr[2], pwArr[3], pwArr[4], pwArr[0]]

            // 计算同异党
            const pwDict = []
            pwDict["水"] = wxpwwidth[0]
            pwDict["木"] = wxpwwidth[1]
            pwDict["火"] = wxpwwidth[2]
            pwDict["土"] = wxpwwidth[3]
            pwDict["金"] = wxpwwidth[4]
            const rzwx = wxForBz(bzArr[4])
            const swwx = getShengWX(rzwx)
            let mywx = 0
            for (let k in pwDict) {
                if (k == rzwx || k == swwx) {
                    mywx += pwDict[k]
                }
            }
            resData.mywx = mywx
            resData.otherwx = 100 - mywx

            // 计算五行个数
            const unknowhour = options.unknowhour || 0
            let wxCount = {
                '木': 0,
                '火': 0,
                '土': 0,
                '金': 0,
                '水': 0
            }
            for (var i = 0; i < 8; i++) {
                const wxstr = unknowhour && i > 5 ? '' : wxForBz(bzArr[i])
                if (wxstr) wxCount[wxstr] += 1
            }
            wxCount = [wxCount['木'], wxCount['火'], wxCount['土'], wxCount['金'], wxCount['水']]
            for (var i = 0; i < wxCount.length; i++) {
                resData.wxcountArr[0][i] = wxCount[i] / 8 * 100
                resData.wxcountArr[1][i] = wxCount[i]
            }

            // 计算含藏干数
            const cgArr = options.cgArr || []
            let wxcgCount = {
                '木': 0,
                '火': 0,
                '土': 0,
                '金': 0,
                '水': 0
            }
            let tmpwx = wxForBz(bzArr[0])
            wxcgCount[tmpwx] += 1
            tmpwx = wxForBz(bzArr[2])
            wxcgCount[tmpwx] += 1
            tmpwx = wxForBz(bzArr[4])
            wxcgCount[tmpwx] += 1
            tmpwx = unknowhour ? '' : wxForBz(bzArr[6])
            wxcgCount[tmpwx] += 1
            for (let i = 0; i < cgArr.length; i++) {
                for (let j = 0; j < cgArr[i].length; j++) {
                    tmpwx = unknowhour && i == 3 ? '' : wxForBz(cgArr[i][j])
                    if (tmpwx) wxcgCount[tmpwx] += 1
                }
            }
            wxcgCount = [wxcgCount['木'], wxcgCount['火'], wxcgCount['土'], wxcgCount['金'], wxcgCount['水']]
            total = 0
            for (let i = 0; i < wxcgCount.length; i++) {
                total += wxcgCount[i]
            }
            for (let i = 0; i < wxcgCount.length; i++) {
                resData.cgcountArr[0][i] = wxcgCount[i] / total * 100
                resData.cgcountArr[1][i] = wxcgCount[i]
            }

            resolve(resData)
        })
    })
}

/**
 * 小真智能
 * @param {String} caseGuid 案例ID
 * @param {String} bz 八字，eg: "癸 卯 丁 巳 庚 午 壬 午"
 * @param {Boolean} isGetNote 是否返回断事笔记数据
 */
export const getXZTips = async (caseGuid, bz, isGetNote = false) => {
    const guid = store.getters.userguid,
        bzStr = bz.replace(/\s/g, ''),
        bzArr = bzStr.split('')
    let bzData = null,
        wsData = null,
        gjData = null,
        xzWSTitle = '',
        xzGJTitle = '',
        xzSystemWSTitle = '',
        xzSystemGJTitle = '',
        xzYYTitle = '',
        xzGJTitle2 = '',
        noteData = null,
        _xzWSTitle = ''

    // 根据断事笔记数据获取格局与旺衰
    if (caseGuid) {
        await getNote(caseGuid).then(res => {
            if (res.data) {
                bzData = res.data.bzData
                noteData = res.data
            }
        })
        if (bzData) {
            bzData = JSON.parse(bzData)
            wsData = bzData.find(item => item.name === '旺衰' || item.name === '旺弱')
            gjData = bzData.find(item => item.name === '格局')
            xzWSTitle = wsData.data
            xzGJTitle = gjData.data
        }
    }

    // 系统旺衰
    if (guid) {
        await (async function () {
            await getWXPW(guid, bzStr).then(async res => {
                if (!res.data) {
                    await getWXPW2(guid, bzStr).then(res2 => {
                        res = res2
                    })
                    if (!res.data) return
                }
                let wxpwws = ''
                switch (res.data.split(' ')[0]) {
                    case "日元极弱":
                        wxpwws = "极弱";
                        break;
                    case "日元太弱":
                        wxpwws = "身弱";
                        break;
                    case "日元偏弱":
                        wxpwws = "偏弱";
                        break;
                    case "日元平和":
                        wxpwws = "平和";
                        break;
                    case "日元偏旺":
                        wxpwws = "偏强";
                        break;
                    case "日元太旺":
                        wxpwws = "身强";
                        break;
                    case "日元极旺":
                        wxpwws = "极强";
                        break;
                }
                _xzWSTitle = wxpwws
                xzSystemWSTitle = wxpwws
            })
        })();
    }
    if (!xzWSTitle) {
        xzWSTitle = xzSystemWSTitle
    }

    // 系统格局
    await (async function () {
        // let setting3 = initSetting3()
        // let xzResult = await getXZParmFromSetting3({ setting3, bzArr, bzStr, guid })
        let gejuSetting = window.localStorage.getItem("setting_geju")
        if (gejuSetting) {
            gejuSetting = JSON.parse(gejuSetting)
        } else {
            gejuSetting = JSON.parse(JSON.stringify(setting_geju_default))
        }
        const yzIndex = gejuZhi.findIndex(item => item === bzArr[3]),
            isZiHai = yzIndex < 8,
            ylValue = gejuSetting.ylValues[yzIndex],
            ylData = gejuSetting.ylDatas[yzIndex]
        let parm = [gejuSetting.additionValues[0] ? 1 : 0, gejuSetting.additionValues[1] ? 1 : 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
            spcgeju1 = gejuSetting.specialValues[0] ? 1 : 0,
            spcgeju2 = gejuSetting.specialValues[1] ? 1 : 0
        if (isZiHai) {
            parm[2] = ylValue ? 0 : 1
            switch (ylData[2]) {
                case 0:
                    parm[3] = 1
                    parm[4] = 0
                    parm[5] = 0
                    break
                case 1:
                    parm[3] = 0
                    parm[4] = 1
                    parm[5] = 0
                    break
                case 2:
                    parm[3] = 0
                    parm[4] = 0
                    parm[5] = 1
                    break
            }
            switch (ylData[3]) {
                case 0:
                    parm[6] = 1
                    parm[7] = 0
                    break
                case 1:
                    parm[6] = 0
                    parm[7] = 1
                    break
            }
        } else {
            parm[8] = ylValue ? 0 : 1
            switch (ylData[2]) {
                case 0:
                    parm[9] = 1
                    parm[10] = 0
                    parm[11] = 0
                    break
                case 1:
                    parm[9] = 0
                    parm[10] = 1
                    parm[11] = 0
                    break
                case 2:
                    parm[9] = 0
                    parm[10] = 0
                    parm[11] = 1
                    break
            }
            parm[12] = ylData[4] ? 1 : 0
            switch (ylData[3]) {
                case 0:
                    parm[13] = 1
                    parm[14] = 0
                    break
                case 1:
                    parm[13] = 0
                    parm[14] = 1
                    break
            }

        }
        if (guid) {
            parm = parm.join(',')
            let xzResult = await getGeJu({ bz: bzStr, guid, parm, spcgeju1, spcgeju2 })
            let contentObj = JSON.parse(getXZParmFromClient(xzResult))
            if (contentObj) {
                const gjArr = contentObj.gjItems.split(',')
                xzSystemGJTitle = gjArr[0] || ''
                xzGJTitle2 = gjArr[1] || ''
                xzYYTitle = contentObj.yyText || ''
            }
        }
    })();
    if (!xzGJTitle) {
        xzGJTitle = xzSystemGJTitle
    }

    // 根据格局算出最终旺衰
    if (xzGJTitle.search(/^(从弱格)|(从儿格)|(从杀格)|(从财格)$/) > -1) {
        xzWSTitle = '从弱'
        xzSystemWSTitle = '从弱'
    }
    if (xzGJTitle.search(/^(专旺格)|(稼穑格)|(曲直格)|(炎上格)|(润下格)|(从革格)$/) > -1) {
        xzWSTitle = '从强'
        xzSystemWSTitle = '从强'
    }

    // 日柱属性
    const rzTitle = getRiLingToWuXing(bzArr[4])

    const resData = { xzWSTitle, xzGJTitle, rzTitle, xzYYTitle, xzSystemWSTitle, xzSystemGJTitle, xzGJTitle2, _xzWSTitle }
    if (isGetNote && noteData) resData.noteData = noteData
    return resData
}

/**
 * 初始化小真智能
 */
function initSetting3() {
    return [{
        mainSelectedCode: 0,
        contentCode: [
            0, 1, 0, 0, 1
        ]
    },
    {
        mainSelectedCode: 0,
        contentCode: [
            0, 1, 0, 0, 1
        ]
    },
    {
        mainSelectedCode: 0,
        contentCode: [
            0, 1, 0, 0, 1
        ]
    },
    {
        mainSelectedCode: 0,
        contentCode: [
            0, 1, 0, 0, 1
        ]
    },
    {
        mainSelectedCode: 0,
        contentCode: [
            0, 1, 0, 0, 1
        ]
    },
    {
        mainSelectedCode: 0,
        contentCode: [
            0, 1, 0, 0, 1
        ]
    },
    {
        mainSelectedCode: 0,
        contentCode: [
            0, 1, 0, 0, 1
        ]
    },
    {
        mainSelectedCode: 0,
        contentCode: [
            0, 1, 0, 0, 1
        ]
    },
    {
        mainSelectedCode: 1,
        contentCode: [
            0, 1, 0, 0, 1, 1
        ]
    },
    {
        mainSelectedCode: 1,
        contentCode: [
            0, 1, 0, 0, 1, 1
        ]
    },
    {
        mainSelectedCode: 1,
        contentCode: [
            0, 1, 0, 0, 1, 1
        ]
    },
    {
        mainSelectedCode: 1,
        contentCode: [
            0, 1, 0, 0, 1, 1
        ]
    },
    {
        mainSelectedCode: 1,
        contentCode: []
    },
    {
        mainSelectedCode: 1,
        contentCode: []
    },
    {
        mainSelectedCode: 1,
        contentCode: []
    },
    {
        mainSelectedCode: 1,
        contentCode: []
    },
    ]
}

/**
 * 根据setting3获取小真智能需要的参数
 */
async function getXZParmFromSetting3({ setting3, bzArr, bzStr, guid }) {
    let ylCode = getYueLingToCode(bzArr[3])
    let xzparm = ''
    let xzSpcgeju1 = setting3[14].mainSelectedCode
    let xzSpcgeju2 = setting3[15].mainSelectedCode
    let mainSelectedCode = setting3[ylCode].mainSelectedCode ^ 1
    let contentCode = setting3[ylCode].contentCode.join(',')

    if (ylCode < 8) {
        xzparm = setting3[12].mainSelectedCode + ',' + setting3[13].mainSelectedCode + ',' + mainSelectedCode + ',' + contentCode + ',' + '0,0,0,0,0,0,0'
    } else {
        //三换二，第六换到第四去，第四跟第五互换；这一步的兼容是服务器需要的透干下半部分中：从上往下开始编号，而我的则是从上往下，switch在最后一位
        // let arrCode = []
        // arrCode.push(contentCode.split(',')[5])
        // arrCode.push(contentCode.split(',')[3])
        // arrCode.push(contentCode.split(',')[4])
        contentCode = contentCode.slice(0, 5) + contentCode.substr(9, 2) + contentCode.substr(5, 2) + contentCode.substr(7, 2)
        xzparm = setting3[12].mainSelectedCode + ',' + setting3[13].mainSelectedCode + ',' + '0,0,0,0,0,0' + ',' + mainSelectedCode + ',' + contentCode
    }

    let xzUrlStr = 'https://bzapi2.iwzbz.com/getgeju3.php?bz=' + bzStr + '&guid=' + guid + '&parm=' + xzparm + '&spcgeju1=' + xzSpcgeju1 + '&spcgeju2=' + xzSpcgeju2
    let xzResult = await homeApi.Request(xzUrlStr, '', 4)
    return JSON.stringify(xzResult)
}

/**
 * 根据月令返回它的下标码：下标码对应的是setting3的数组下标
 */
function getYueLingToCode(yueling) {
    var ylcode = ['子', '午', '卯', '酉', '寅', '申', '巳', '亥', '辰', '戌', '丑', '未']
    return ylcode.indexOf(yueling)
}

/**
 * @param {给小真智能的后台数据去格化为客户端专用}
 * @return  json = JSON.stringify({  yyText:  , gjItems: }) 格式都为字符串
 */
function getXZParmFromClient(xzResult) {
    let obj = xzResult
    if (obj.data == '') return JSON.stringify('')
    let contentMain = obj.data.split(';')
    let contentGJ = contentMain[1]
    let arrTemp = contentGJ.split(',').filter(item => !!item).map(item => item + '格')
    if (obj.data != '') {
        let json = JSON.stringify({
            yyText: contentMain[0], //阴阳text
            gjItems: arrTemp.join(','), //格局items：
        })
        return json
    }
}

export function getRiLingToWuXing(riling) {
    let rzStr = ''
    switch (riling) {
        case '甲':
            rzStr = '甲木'
            break;
        case '乙':
            rzStr = '乙木'
            break;
        case '丙':
            rzStr = '丙火'
            break;
        case '丁':
            rzStr = '丁火'
            break;
        case '戊':
            rzStr = '戊土'
            break;
        case '己':
            rzStr = '己土'
            break;
        case '庚':
            rzStr = '庚金'
            break;
        case '辛':
            rzStr = '辛金'
            break;
        case '壬':
            rzStr = '壬水'
            break;
        case '癸':
            rzStr = '癸水'
            break;
    }
    return rzStr
}
