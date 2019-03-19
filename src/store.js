import Vue from 'vue'
import Vuex from 'vuex'
import Languages from '@/lib/languages'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userSettings: {
      language: 'eng'
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
    }
  },
  mutations: {
    setUserLanguage: (state, code) => {
      state.userSettings.language = code
      localStorage.setItem('user-language', state.userSettings.language)
    }
  },
  actions: {

  }
})
