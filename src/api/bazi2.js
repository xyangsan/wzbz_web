import request from "@/utils/request";
const baseURL = 'https://bzpp2.iwzbz.com/api/v1.1'

/**
 * 添加八字
 */
export const addBZ = (data) => {
    let url = `${baseURL}/User/AddsubuserH5_5`;
    return request({
        url,
        method: "post",
        data
    });
}

/**
 * 编辑八字
 */
export const editBZ = (data) => {
    let url = `${baseURL}/User/updatesubuser5`;
    return request({
        url,
        method: "post",
        data
    });
}

/**
 * 设置星标
 * @param {String} guid 案例ID
 * @param {Number} op 是否置顶 1：置顶 0：取消置顶
 * @returns
 */
export const setStar = (guid, op) => {
  let url = `${baseURL}/user/star?userGuid=${guid}&op=${op}`;
  return request({
    url,
    method: "post"
  });
};

/**
 * 获取五行能量相关数据
 * @param {String} guid 用户ID
 * @param {String} bzstr 八字 "壬寅癸丑戊辰辛酉"
 * @returns
 */
export const getWXPW = (guid, bzstr) => {
    let url = `${baseURL}/User/getWXPW?parm=${guid}|${bzstr}`;
    return request({
        url,
        method: "get"
    });
};

/**
 * 获取广告数据
 */
export const getAdData = (guid = '', version = '2.3.7') => {
  let url = `${baseURL}/user/newgetad2?userguid=${guid}&ver=${version}`;
  return request({
    url,
    method: "get",
  });
}

/**
 * 获取用户列表
 * @param {String} guid 用户ID
 * @returns
 */
export const getUserList = (guid) => {
    let url = `${baseURL}/User/SubUserH5?userGuid=${guid}&pageindex=1&t=${Math.random()}`;
    return request({
      url,
      method: "get"
    });
  };