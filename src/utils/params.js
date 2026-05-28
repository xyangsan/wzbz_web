import { solar2Lunar } from "./DateUtils";

const userToPaiPan = (item) => {
    //构建数据
    console.log("拿到的item：",item);
    let t1_1 = item.solarTime.split(" ")[0];
    let t1_2 = item.solarTime.split(" ")[1];
    let t2_1 = item.sunTime.split(" ")[0];
    let t2_2 = item.sunTime.split(" ")[1];
    let solar = [];
    let sun = [];
    for (let i = 0; i < 3; i++) {
        solar.push(t1_1.split("-")[i]);
        sun.push(t2_1.split("-")[i]);
    }
    for (let i = 0; i < 2; i++) {
        solar.push(t1_2.split(":")[i]);
        sun.push(t2_2.split(":")[i]);
    }
    let lunarArr = solar2Lunar(solar[0], solar[1], solar[2]);
    
    const lunarArrStr = JSON.stringify(lunarArr)
    const typeId = item.groupGuid

    const obj = {
        name: item.name,
        sex: item.sex,
        solarTime: solar,
        sunTime: sun,
        MRType: 0,
        tg: item.tg.split(" "),
        dz: item.dz.split(" "),
        location: item.location,
        guid: item.guid,
        lunarArr: lunarArrStr,
        typeId: typeId,
        xls: item.xls || 0,
    };
    return obj
}

const mrToPaiPan = (item) => {
    let t1_1 = item.solartime.split(" ")[0];
    let t1_2 = item.solartime.split(" ")[1];
    let solar = [];
    for (let i = 0; i < 3; i++) {
        solar.push(t1_1.split("-")[i]);
    }
    for (let i = 0; i < 2; i++) {
        solar.push(t1_2.split(":")[i]);
    }

    const obj = {
        name: item.name,
        sex: item.sex,
        solarTime: solar,
        sunTime: solar,
        MRType: 1,
        alias: item.alias,
        peroid: item.peroid,
        tg: item.tg.split(" "),
        dz: item.dz.split(" "),
        isLiuNian: item.isLiuNian,
        guid: '',
    };
    return obj
}

export default {
    userToPaiPan,
    mrToPaiPan,
}