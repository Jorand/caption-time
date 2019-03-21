import Vue from 'vue'
import Vuex from 'vuex'
import Languages from '@/lib/languages'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userSettings: {
      language: 'eng',
      butter: {
        enable: true,
        ip: '192.168.1.24',
        username: 'popcorn',
        password: 'popcorn',
        port: '8008'
      }
    }
  },
  getters: {
    userLanguageCode: (state) => {
      var data = localStorage.getItem('user-language') || state.userSettings.language
      state.userSettings.language = data
      return data
    },
    userLanguage: (state) => {
      return Languages.find(l => l.code === state.userSettings.language)
    },
    userLanguageName: (state, getters) => {
      return getters.userLanguage.name
    },
    butterRemoteIsEnable: (state) => {
      return state.userSettings.butter.enable
    },
    butterRemoteSettings: (state) => {
      return state.userSettings.butter
    }
  },
  mutations: {
    setUserLanguage: (state, code) => {
      // no need to check the code it came frome the Languages select
      state.userSettings.language = code
      localStorage.setItem('user-language', code)
      console.log('[INFO] User Language saved: ', Languages.find(l => l.code === code).name)
    },
    enableButterRemote: (state) => {
      state.userSettings.butter.enable = true
    },
    disableButterRemote: (state) => {
      state.userSettings.butter.enable = false
    },
    setButterRemoteSettings: (state, params) => {
      state.userSettings.butter = params
    }
  },
  actions: {

  }
})
