
import * as homeApi from "@/api/home-api";

const DiZhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];


const getHepanList = async (guid) => {
    //合盘列表API测试
    let lUrl = "gethepanlist.php?";
    let lParms = "guid=" + guid;
    let arr1 = [];

    await homeApi
        .Request(lUrl, lParms)
        .then((suc) => {
            let len = suc.length;
            for (let i = 0; i < len; i++) {
                let s = (JSON.parse(suc[i].parms))
                s.star = -1
                arr1.push({
                    orderid: suc[i].orderid,
                    parms: s,
                });
            }
            console.log("拿到的合盘：", arr1);
        })
        .catch((err) => {
            console.log("合盘列表获取失败", err);
        });
    return arr1;

}

const getCaiYunList = async (guid) => {
    if (guid == "") return "";
    let url = "getcylist.php?";
    let parms = "guid="+guid;
    let data = await homeApi.Request(url, parms);
    data.forEach((item)=>{
        item.solar = formatTime(item.datestr)
    })
    data.sort((a, b) => {
        let time1 = a.datestr;
        let mil1 = new Date(time1);
        let time2 = b.datestr;
        let mil2 = new Date(time2);
        return mil2 - mil1;
    });
    return data
}


function getAnimal(nl) {
    return DiZhi.indexOf(nl) + 1;
}
/**
 * 将-格式的转换成年月日
 */
function formatTime(arr) {
    let tmp = arr.split("-");
    tmp[0] += "年";
    tmp[1] += "月";
    tmp[2] += "日";
    return tmp.join("");
}
export default {
    getHepanList,
    getAnimal,
    formatTime,
    getCaiYunList,
}