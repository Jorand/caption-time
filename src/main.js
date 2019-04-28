import { remote } from 'electron'
import fs from 'fs'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import VueAnalytics from 'vue-analytics'

const { Menu } = remote

let isProd = process.env.NODE_ENV === 'production'
Vue.config.productionTip = isProd

console.log('[INFO] Production: ', isProd)

Vue.use(VueAnalytics, {
  id: 'UA-137809428-2',
  disable: false,
  router,
  autoTracking: {
    exception: true
  },
  debug: {
    enable: !isProd,
    sendHitTask: isProd
  }
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  mounted () {
    // Prevent blank screen in Electron builds
    this.$router.push('/')
    // Init APP lang
    var appLang = this.$store.state.userSettings.appLanguage
    if (appLang) {
      this.$i18n.locale = appLang
      console.log('[INFO] APP Language (User): ', appLang)
    } else if (navigator.language in this.$i18n.messages) {
      this.$i18n.locale = navigator.language
      console.log('[INFO] APP Language (navigator): ', navigator.language)
    }
    this.updateAppMenu(this.$i18n.locale)
    this.toggleAnalytics(this.$store.state.userSettings.analytics)
  },
  methods: {
    updateAppMenu (lang) {
      var filePath = `./src/menu-${lang}.js`
      if (fs.existsSync(filePath)) {
        var template = require('./' + `menu-${lang}`)
        const menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)
      } else {
        var templateD = require('./menu')
        const menu = Menu.buildFromTemplate(templateD)
        Menu.setApplicationMenu(menu)
      }
    },
    toggleAnalytics (value) {
      console.log('[INFO] Analytics: ', value)
      if (value) {
        Vue.$ga.enable()
      } else {
        Vue.$ga.disable()
      }
    }
  },
  watch: {
    '$i18n.locale': function (newVal, oldVal) {
      this.updateAppMenu(newVal)
    },
    '$store.state.userSettings.analytics': function (newVal, oldVal) {
      this.toggleAnalytics(newVal)
    }
  }
}).$mount('#app')
