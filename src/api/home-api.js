/**
 * 引入fetch
 * @param params
 * @returns {*}
 */
import { fetch } from '../apiconfig/index'
// 获取UserID
export function Request(url, params, baseFlag = 0, method = 'get') {
  return fetch(url, params, baseFlag, method)
}
