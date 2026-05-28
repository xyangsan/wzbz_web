import request from '@/utils/request'

const baseURL = 'https://bzpp2.iwzbz.com/api/v1.1/'

/**
 * 更改设置
 * @param {String} UserGuid 用户ID
 * @param {Object} platformid 2
 * @param {String} setkey 键
 * @param {Object} setvalue 值
 * @param {Object} type
 * @returns
 */
export const updateSetting = (data) => {
  let url = `${baseURL}user/UpdateSetting`
  return request({
    url,
    method: 'post',
    data,
  })
}

/**
 * 获取设置
 * @param {String} guid 用户ID
 * @returns
 */
export const getSetting = (guid) => {
  let url = `${baseURL}user/GetSetting?userguid=${guid}&platformid=2`
  return request({
    url,
    method: 'get',
  })
}

/**
 * 重置设置
 * @param {String} guid 用户ID
 * @param {String} type
 * @returns
 */
export const resetSetting = (guid, type) => {
  let url = `${baseURL}user/ResetSetting?userguid=${guid}&platformid=2&type=${type}`
  return request({
    url,
    method: 'get',
  })
}

/**
 * 删除设置
 * @param {String} guid 用户ID
 * @param {String} key 键
 * @returns
 */
export const delSetting = (guid, key) => {
  let url = `${baseURL}user/DelSetting?userguid=${guid}&platformid=2&key=${key}`
  return request({
    url,
    method: 'get',
  })
}

/**
 * 更新自定义备注
 * @param {String} UserGuid 用户ID
 * @param {String} ShenSh 神煞名字
 * @param {String} Remark 备注内容
 * @returns
 */
export const UpdateSheShaRemark = (data) => {
  let url = `${baseURL}User/UpdateSheShaRemark`
  return request({
    url,
    method: 'post',
    data,
    header: true,
  })
}

/**
 * 获取自定义备注
 * @param {String} UserGuid 用户ID
 * @param {String} ShenSha 神煞名字
 * @returns
 */
export const getShenShaRemark = (UserGuid, ShenSha) => {
  let url = `${baseURL}user/getShenShaRemark?UserGuid=${UserGuid}&ShenSha=${ShenSha}`
  return request({
    url,
    method: 'get',
  })
}
