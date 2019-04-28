import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import Languages from '@/lib/languages'

const vuexPersist = new VuexPersist({
  key: 'app',
  storage: localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    userSettings: {
      appLanguage: '',
      subLanguage: 'eng',
      analytics: true,
      butter: {
        enable: true,
        ip: '',
        username: '',
        password: '',
        port: ''
      }
    },
    data: {
      butterIsConnected: false
    }
  },
  getters: {
    getSubLanguageCode: (state) => {
      return state.userSettings.subLanguage
    },
    getSubLanguage: (state) => {
      return Languages.find(l => l.code === state.userSettings.subLanguage)
    }
  },
  mutations: {
    setSubLanguage: (state, code) => {
      // no need to check the code it came frome the Languages select
      state.userSettings.subLanguage = code
      console.log('[INFO] Subtitle language saved: ', Languages.find(l => l.code === code).name)
    },
    setAnalytics: (state, value) => {
      state.userSettings.analytics = value
    },
    setButterEnable: (state, value) => {
      state.userSettings.butter.enable = value
    },
    setButterIp: (state, value) => {
      state.userSettings.butter.ip = value
    },
    setButterPort: (state, value) => {
      state.userSettings.butter.port = value
    },
    setButterUsername: (state, value) => {
      state.userSettings.butter.username = value
    },
    setButterPassword: (state, value) => {
      state.userSettings.butter.password = value
    },
    setAppLanguage: (state, lang) => {
      state.userSettings.appLanguage = lang
      console.log('[INFO] APP Language saved: ', lang)
    },
    setButterIsConnected: (state, value) => {
      state.data.butterIsConnected = value
      // console.log('[INFO] Butter is connected: ', value)
    }
  },
  actions: {

  }
})
