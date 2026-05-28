import request from "@/utils/request";
const baseURL = 'https://bzpp2.iwzbz.com/api/v1.1'

/**
 * 获取断事笔记
 * @param {String} guid 用户ID
 * @returns
 */
export const getNote = guid => {
  let url = `${baseURL}/user/note2?userGuid=${guid}`;
  return request({
    url,
    method: "get"
  });
};

/**
 * 更新断事笔记
 * @param {String} guid 用户ID
 * @param {Object} data 断事笔记数据对象
 * @returns
 */
export const updateNote = (data) => {
  let url = `${baseURL}/user/updateNote2`;
  return request({
    url,
    method: "post",
    data
  });
};

/**
 * 获取笔记中筛选的案例id
 * @param {String} guid 用户ID
 * @param {Object} data 笔记选中数据对象
 * @returns
 */
export const getNotesearch = (params) => {
  let url = `${baseURL}/user/notesearch`;
  return request({
    url,
    method: "get",
    params
  });
};