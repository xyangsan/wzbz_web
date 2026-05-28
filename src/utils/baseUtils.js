import {
    getWxOfGz
} from './index.js'

const GongLi_Day = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const XingXiu = ["轸", "角", "亢", "氐", "房", "心", "尾", "箕",
    "斗", "牛", "女", "虚", "危", "室", "壁",
    "奎", "娄", "胃", "昴", "毕", "觜", "参",
    "井", "鬼", "柳", "星", "张", "翼"]

function getWuChaForPi(year) {
    let pi = 11;
    for (let i = 1700; i <= year; i++) {
        if (i % 100 == 0 && i % 400 != 0) {
            pi++;
        }
    }
    return pi;
}

function getBaseDayForB(year, month, day) {
    let d = 0;
    for (let i = 1; i < month; i++) {
        d = d + GongLi_Day[i];
    }
    d = d + day;
    return (year - 1) * 365 + d;
}

function getBaseDayForC(year, month, day) {
    let pi = 0;
    if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
        if (month < 3) {
            pi = 0;
        } else if (month == 3) {
            if (day == 1) {
                pi = 0;
            } else {
                pi = 1;
            }
        } else {
            pi = 1;
        }
    } else {
        pi = 0;
    }
    return Math.floor((year - 1) / 4 - getWuChaForPi(year) + pi);
}

function getBaseDayForA(year, month, day) {
    const b = getBaseDayForB(year, month, day),
        c = getBaseDayForC(year, month, day)
    return b + c;
}

/**
 * 获取星宿
 * @param {Number} year 
 * @param {Number} month 
 * @param {Number} day 
 */
export const getXingXiu = (year, month, day) => {
    let zi = (24 + getBaseDayForA(year, month, day)) % 28,
        m = "";
    if (zi >= 1 && zi <= 7) {
        m = "东方苍龙";
    } else if (zi >= 8 && zi <= 14) {
        m = "北方玄武";
    } else if (zi >= 15 && zi <= 21) {
        m = "西方白虎";
    } else if (zi >= 22 && zi <= 27 || zi == 0) {
        m = "南方朱雀";
    }
    const xx = XingXiu[zi] + '宿' + m
    return xx;
}

/**
 * 节气推算星座表
 */
const astroStr = '摩羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手摩羯'
export const getAstro = (month, day) => {
    let arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 23, 22]
    let start = month * 2 - (day < arr[month - 1] ? 2 : 0)
    let end = start + 2
    return astroStr.slice(start, end)
}

/**
 * 星座英简表
 */
export const getXZOfEn = {
    "水瓶": "Aquarius",
    "双鱼": "Pisces",
    "白羊": "Aries",
    "金牛": "Taurus",
    "双子": "Gemini",
    "巨蟹": "Cancer",
    "狮子": "Leo",
    "处女": "Virgo",
    "天秤": "Libra",
    "天蝎": "Scorpio",
    "射手": "Sagittarius",
    "摩羯": "Capricorn"
}

function safe_convert(x) {
    let xstr = x + "";
    let G = 0;
    for (let i = 0; i < xstr.length; i++) {
        G += +xstr[i];
    }
    let H = 0;
    let GStr = G + "";
    for (let i = 0; i < GStr.length; i++) {
        H += +GStr[i];
    }

    let v = 0;
    if (G <= 9) {
        v = 11 - G;
    } else {
        if (11 - H <= 9) {
            v = 11 - H;
        } else {
            v = 11 - H - 9;
        }
    }
    return v;
}
function safe_convert_a(x) {
    let xstr = x + "";
    let G = 0;
    for (let i = 0; i < xstr.length; i++) {
        G += +xstr[i];
    }
    let H = 0;
    let GStr = G + "";
    for (let i = 0; i < GStr.length; i++) {
        H += +GStr[i];
    }

    let v = 0;
    if (G <= 9) {
        if (G + 4 <= 9) {
            v = G + 4;
        } else {
            v = G + 4 - 9;
        }
    } else {
        if (H + 4 <= 9) {
            v = H + 4;
        } else {
            v = H + 4 - 9;
        }
    }
    return v;
}

function mgong(i, sex) {
    let s = "";
    switch (i) {
        case 1:
            s = "坎";
            break;
        case 2:
            s = "坤";
            break;
        case 3:
            s = "震";
            break;
        case 4:
            s = "巽";
            break;
        case 5: {
            s = sex == 1 ? "坤" : "艮";
        }
            break;
        case 6:
            s = "乾";
            break;
        case 7:
            s = "兑";
            break;
        case 8:
            s = "艮";
            break;
        case 9:
            s = "离";
            break;
    }
    return s;
}

function dxsz(i) {
    let s = "";
    switch (i) {
        case 1:
            s = "东";
            break;
        case 2:
            s = "西";
            break;
        case 3:
            s = "东";
            break;
        case 4:
            s = "东";
            break;
        case 5:
            s = "西";
            break;
        case 6:
            s = "西";
            break;
        case 7:
            s = "西";
            break;
        case 8:
            s = "西";
            break;
        case 9:
            s = "东";
            break;
    }
    return s;
}

/**
 * 获取命卦
 * @param {Number} sex 性别 1:男 0:女
 * @param {Number} lunarYear 农历年(以立春为新一年开始)
 * @returns 
 */
export const getMingGua = (sex = 1, lunarYear) => {
    let mgi = sex == 1 ? safe_convert(lunarYear) : safe_convert_a(lunarYear)
    let mgstr1 = mgong(mgi, sex) + '卦'
    let mgstr2 = dxsz(mgi) + '四命'
    return [mgstr1, mgstr2]
}

const rdic = {
    "土": ["金", "火", "水", "木"],
    "金": ["水", "土", "木", "火"],
    "火": ["土", "木", "金", "水"],
    "水": ["木", "金", "火", "土"],
    "木": ["火", "水", "土", "金"],
}
const ssArr = ["食伤", "印绶", "财才", "官杀"]
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
        const index = rdic[rzwx].findIndex(item => item === wx)
        if (index >= 0) res = ssArr[index]
    }
    return res
}