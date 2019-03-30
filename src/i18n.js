import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  'en': {
    settingsPageTitle: 'Settings',
    welcomeMsg: 'Welcome to Your Vue.js App'
  },
  'fr': {
    settingsPageTitle: 'Réglages',
    welcomeMsg: 'Bienvenue sur votre application Vue.js'
  }
}

export default new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages // set locale messages
})
