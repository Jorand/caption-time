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
    // Init UI lang
    var userLang = this.$store.getters.uiLanguage
    if (userLang) {
      this.$i18n.locale = userLang
      console.log('[INFO] UI Language (User): ', userLang)
    } else if (navigator.language in this.$i18n.messages) {
      this.$i18n.locale = navigator.language
      console.log('[INFO] UI Language (navigator): ', navigator.language)
    }
  }
}).$mount('#app')
