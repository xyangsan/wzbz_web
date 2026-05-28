import { updateSetting, delSetting } from '@/api/setting.js'
import {
  gzRelation_tg,
  gzRelation_dz,
  setting_gzrelation_default,
  setting_dizhizg_default,
  setting_rysl_default,
} from '@/views/paipan-result/static.js'

const setting = {
  namespaced: true,
  state: {
    setting_midnight: JSON.parse(
      localStorage.getItem('setting_midnight') || 'false',
    ),
    setting_gzrelation: localStorage.getItem('setting_gzrelation')
      ? JSON.parse(localStorage.getItem('setting_gzrelation'))
      : undefined,
    setting_dizhizg: localStorage.getItem('setting_dizhizg')
      ? JSON.parse(localStorage.getItem('setting_dizhizg'))
      : undefined,
    setting_rysl: localStorage.getItem('setting_rysl')
      ? JSON.parse(localStorage.getItem('setting_rysl'))
      : Object.assign({}, setting_rysl_default),
    setting_shensha: localStorage.getItem('setting_shensha')
      ? JSON.parse(localStorage.getItem('setting_shensha'))
      : {},
    setting_shensha_sys: localStorage.getItem('setting_shensha_sys')
      ? JSON.parse(localStorage.getItem('setting_shensha_sys'))
      : {},
    setting_geju: localStorage.getItem('setting_geju')
      ? JSON.parse(localStorage.getItem('setting_geju'))
      : undefined,
    setting_other: localStorage.getItem('setting_other')
      ? JSON.parse(localStorage.getItem('setting_other'))
      : { showMing: 'false', showShen: 'false' },
    setting_age: JSON.parse(localStorage.getItem('setting_age') || 'false'),
    isXLS: false, // 是否打开夏令时
    isBJTime: false, // 是否打开换算北京时间
    setting_desc: localStorage.getItem('setting_desc')
      ? JSON.parse(localStorage.getItem('setting_desc'))
      : {},
  },
  mutations: {
    setMidnight(state, setting) {
      state.setting_midnight = setting
      localStorage.setItem('setting_midnight', setting)
    },
    setGzrelation(state, setting) {
      state.setting_gzrelation = setting
      localStorage.setItem('setting_gzrelation', JSON.stringify(setting))
    },
    setDizhizg(state, setting) {
      state.setting_dizhizg = setting
      localStorage.setItem('setting_dizhizg', JSON.stringify(setting))
    },
    setRysl(state, setting) {
      state.setting_rysl = setting
      localStorage.setItem('setting_rysl', JSON.stringify(setting))
    },
    setShensha(state, setting) {
      state.setting_shensha = setting
      localStorage.setItem('setting_shensha', JSON.stringify(setting))
    },
    setShenshaSys(state, setting) {
      state.setting_shensha_sys = setting
      localStorage.setItem('setting_shensha_sys', JSON.stringify(setting))
    },
    setDesc(state, setting) {
      state.setting_desc = setting
      localStorage.setItem('setting_desc', JSON.stringify(setting))
    },
    setGeju(state, setting) {
      state.setting_geju = setting
      localStorage.setItem('setting_geju', JSON.stringify(setting))
    },
    setTingOther(state, setting) {
      state.setting_other = setting
      localStorage.setItem('setting_other', JSON.stringify(setting))
    },
    setTingAge(state, setting) {
      state.setting_age = setting
      localStorage.setItem('setting_age', setting)
    },
    /**
     * 修改神煞数据
     */
    updateShensha(state, setting) {
      if (setting) {
        const arr = setting.split('|')
        const dataID = `CSS_${arr[1]}`,
          isSys = JSON.parse(arr[11]),
          settingType = isSys ? 6 : 7
        if (isSys) {
          state.setting_shensha_sys[dataID] = setting
          localStorage.setItem(
            'setting_shensha_sys',
            JSON.stringify(state.setting_shensha_sys),
          )
        } else {
          state.setting_shensha[dataID] = setting
          localStorage.setItem(
            'setting_shensha',
            JSON.stringify(state.setting_shensha),
          )
        }
        const guid = localStorage.getItem('wzbz_userguid')
        if (guid) {
          const param = new URLSearchParams()
          param.append('UserGuid', guid)
          param.append('platformid', 2)
          param.append('setkey', dataID)
          param.append('setvalue', setting)
          param.append('type', settingType)
          updateSetting(param)
        }
      }
    },
    /**
     * 修改自定义神煞备注
     */
    updateDesc(state, setting) {
      if (setting) {
        for (let key in state.setting_desc) {
          if (setting.tempName === key) {
            delete state.setting_desc[key]
          }
        }
        state.setting_desc[setting.name] = setting.data
        localStorage.setItem('setting_desc', JSON.stringify(state.setting_desc))
      }
    },

    /**
     * 删除神煞条件，因为系统神煞没有删除相关操作，因此默认删除的都是自定义神煞
     */
    removeShensha(state, dataID) {
      dataID = `CSS_${dataID}`
      delete state.setting_shensha[dataID]
      localStorage.setItem(
        'setting_shensha',
        JSON.stringify(state.setting_shensha),
      )

      const guid = localStorage.getItem('wzbz_userguid')
      if (guid) {
        delSetting(guid, dataID)
      }
    },
    // 删除自定义神煞备注
    removeDesc(state, name) {
      delete state.setting_desc[name]
      localStorage.setItem('setting_desc', JSON.stringify(state.setting_desc))
    },
    async resetSysShensha(state) {
      const dataIDArr = []
      for (let key in state.setting_shensha_sys) {
        dataIDArr.push(key)
      }

      state.setting_shensha_sys = {}
      localStorage.removeItem('setting_shensha_sys')

      const guid = localStorage.getItem('wzbz_userguid')
      if (guid) {
        for (let i = 0; i < dataIDArr.length; i++) {
          await delSetting(guid, dataIDArr[i])
        }
      }
    },
    setIsXLS(state, setting) {
      state.isXLS = setting
    },
    setIsBJTime(state, setting) {
      state.isBJTime = setting
    },
    clearSetting(state) {
      state.setting_gzrelation = undefined
      state.setting_dizhizg = undefined
      state.setting_shensha_sys = {}
      state.setting_shensha = {}
      state.setting_desc = {}
      state.setting_other = {}
      state.setting_age = 'false'
      state.isXLS = false
      state.isBJTime = false
      localStorage.removeItem('setting_gzrelation')
      localStorage.removeItem('setting_dizhizg')
      localStorage.removeItem('setting_shensha_sys')
      localStorage.removeItem('setting_shensha')
      localStorage.removeItem('setting_desc')
      localStorage.removeItem('setting_other')
      localStorage.removeItem('setting_age')
      localStorage.removeItem('setting_bjtime')
    },
  },
  actions: {
    setMidnight({ commit }, setting) {
      commit('setMidnight', setting)
    },
    setGzrelation({ commit }, setting) {
      commit('setGzrelation', setting)
    },
    setDizhizg({ commit }, setting) {
      commit('setDizhizg', setting)
    },
    setRysl({ commit }, setting) {
      commit('setRysl', setting)
    },
    setShensha({ commit }, setting) {
      commit('setShensha', setting)
    },
    setShenshaSys({ commit }, setting) {
      commit('setShenshaSys', setting)
    },
    setDesc({ commit }, setting) {
      commit('setDesc', setting)
    },
    updateShensha({ commit }, setting) {
      commit('updateShensha', setting)
    },
    updateDesc({ commit }, setting) {
      commit('updateDesc', setting)
    },
    removeShensha({ commit }, dataID) {
      commit('removeShensha', dataID)
    },
    removeDesc({ commit }, name) {
      commit('removeDesc', name)
    },
    resetSysShensha({ commit }) {
      commit('resetSysShensha')
    },
    setGeju({ commit }, setting) {
      commit('setGeju', setting)
    },
    setTingOther({ commit }, setting) {
      commit('setTingOther', setting)
    },
    setTingAge({ commit }, setting) {
      commit('setTingAge', setting)
    },
    setIsXLS({ state }, setting) {
      state.isXLS = setting
      // localStorage.setItem('setting_xls', JSON.stringify(setting))
    },
    setIsBJTime({ state }, setting) {
      state.isBJTime = setting
      // localStorage.setItem('setting_bjtime', JSON.stringify(setting))
    },
    clearSetting({ commit }) {
      commit('clearSetting')
      commit('setRysl', Object.assign({}, setting_rysl_default))
    },
  },
}

export default setting
