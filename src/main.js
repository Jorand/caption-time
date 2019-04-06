import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

Vue.config.productionTip = process.env.NODE_ENV === 'production'

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
  }
}).$mount('#app')
