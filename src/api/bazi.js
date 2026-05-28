import request from "./request.js";
import request2 from "@/utils/request2";

const baseURL = 'https://bzapi4.iwzbz.com'
const baseURL_pro = baseURL

/**
 * 创建财运
 * @param {String} guid 用户ID
 * @param {String} date 真太阳时
 * @param {String} name 案例名
 * @param {String} sex 性别
 * @param {String} gj 格局
 * @param {String} ws 旺衰
 * @param {String} yzs 夜子时 
 * @returns
 */
export const createCY = ({ guid, date, name, sex, gj, ws, yzs = 0 }) => {
    let url = `/createcy.php?guid=${guid}&date=${date}&name=${name}&sex=${sex}&gj=${gj}&ws=${ws}&yzs=${yzs}`;
    return request2({
        url,
        method: "get"
    });
};

/**
 * 创建财运
 * @param {String} guid 用户ID
 * @param {String} orderid 财运ID
 * @returns
 */
export const delCY = (guid, orderid) => {
    let url = `/delcy.php?guid=${guid}&orderid=${orderid}`;
    return request2({
        url,
        method: "get"
    });
};

/**
 * 获取财运列表
 * @param {String} guid 用户ID
 * @returns
 */
export const getCYList = (guid) => {
    let url = `/getcylist.php?guid=${guid}`;
    return request2({
        url,
        method: "get"
    });
};

/**
 * 获取合盘数据
 * @param {String} bz1
 * @param {String} bz2
 * @param {String} sex1
 * @param {String} sex2
 * @param {String} guid
 * @returns
 */
export const getHPData = ({ bz1, bz2, sex1, sex2, guid }) => {
    let url = `/hepan3.php?bz1=${bz1}&bz2=${bz2}&sex1=${sex1}&sex2=${sex2}&guid=${guid}`;
    return request2({
        url,
        method: "get"
    });
};

/**
 * 创建合盘数据
 * @param {String} guid
 * @param {String} parms
 * @returns
 */
export const createHP = ({ guid, parms }) => {
    let url = `/createhepan.php?guid=${guid}&parms=${parms}`;
    return request2({
        url,
        method: "get"
    });
};

/**
 * 获取合盘列表
 * @param {String} guid
 * @returns
 */
export const getHPList = (guid) => {
    let url = `/gethepanlist.php?guid=${guid}`;
    return request2({
        url,
        method: "get"
    });
};

/**
 * 删除合盘数据
 * @param {String} guid
 * @param {String} id
 * @returns
 */
export const deleteHP = (guid, id) => {
    let url = `/delhepan.php?guid=${guid}&orderid=${id}`;
    return request2({
        url,
        method: "get"
    });
};

/**
 * 获取八字数据
 * @param {String} d 真太阳时
 * @param {String} s 性别
 * @param {String} today 今天时间
 * @param {String} yzs 夜子时 
 * @param {String} vip VIP等级
 * @param {String} userguid 用户ID
 * @returns
 */
export const getBaseBZ = ({ d, s, today, yzs, vip, userguid }) => {
    let url = `${baseURL_pro}/getbasebz8.php?d=${d}&s=${s}&today=${today}&vip=${vip}&userguid=${userguid}&yzs=${yzs}`;
    return request({
        url,
        method: "get"
    });
};

/**
 * 获取干支关系
 * @param {String} gz
 * @returns
 */
export const getGZRelation = ({ gz, userguid, vip  }) => {
    let url = `${baseURL_pro}/getGZRelaction3.php?gz=${gz}&userguid=${userguid}&vip=${vip}`;
    return request({
        url,
        method: "get"
    });
};

/**
 * 获取神煞数据
 * @param {String} ln 流干支
 * @param {String} bz 八字
 * @param {String} sex 性别
 * @returns
 */
export const getShenSha = ({ ln, bz, sex, vip, userguid }) => {
    let url = `/getliunianshensha5.php?ln=${ln}&bz=${bz}&sex=${sex}&vip=${vip}&userguid=${userguid}`;
    return request2({
        url,
        method: "get"
    });
};

/**
 * 获取格局数据
 * @param {String} bz 八字
 * @param {String} guid 用户ID
 * @param {String} parm 格局设置
 * @param {String} spcgeju1 特殊格-专旺格
 * @param {String} spcgeju2 特殊格-从弱格
 * @returns
 */
export const getGeJu = ({ bz, guid, parm, spcgeju1, spcgeju2 }) => {
    let url = `/getgeju3.php?bz=${bz}&guid=${guid}&parm=${parm}&spcgeju1=${spcgeju1}&spcgeju2=${spcgeju2}`;
    return request2({
        url,
        method: "get"
    });
};

/**
 * 获取黑名单
 */
export const getBlackword = () => {
    let url = '/getblackword2.php';
    return request2({
        url,
        method: "get"
    });
};

/**
 * 人元司令
 * @param {String} datestr 真太阳时
 * @param {Number} ryslFlag 设置索引
 * @returns 
 */
export const getRysl = (datestr, ryslFlag = 0) => {
    let url = `/getRysl.php?datestr=${datestr}&ryslFlag=${ryslFlag}`;
    console.log("人员失灵：", url);
    
    return request2({
        url,
        method: "get"
    });
};

/**
 * 获取名人库案例
 * @param {String} guid 
 * @returns 
 */
export const getMRList = (guid) => {
    let url = `/mingren.php?guid=${guid}`;
    return request2({
        url,
        method: "get"
    });
}

/**
 * 获取五行能量相关数据(替补算法)
 * @param {String} guid 用户ID
 * @param {String} bzstr 八字 "壬寅癸丑戊辰辛酉"
 * @returns
 */
export const getWXPW2 = (guid, bzstr) => {
    let url = `/getwxnl.php?parm=${guid}|${bzstr}`
    return request2({
        url,
        method: "get"
    })
}

/**
 * 获取流通数据
 * @param {String} bz 
 * @param {String} userguid 
 * @param {Number} vip 
 * @returns 
 */
export const getLiuTong = (bz, userguid, vip) => {
    let url = `/getliutong.php?bz=${bz}&userguid=${userguid}&vip=${vip}`
    return request2({
        url,
        method: "get"
    })
}

/**
 * 根据四柱八字获取出生时间
 */
export const getSZBZ = (bzstr) => {
  let url = `/szbz.php?bz=${bzstr}`;
  return request2({
    url,
    method: "get",
  });
}