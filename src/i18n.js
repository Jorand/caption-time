import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  'en': {
    settings: {
      title: 'Settings',
      language_label: 'Language',
      language_detail: 'App language',
      analytics_label: 'Allow analytics',
      analytics_detail: 'Help improve by sending anonymous stats',
      butter_label: 'Enable Popcorn-Time',
      butter_detail: 'Automatically get title watching',
      ip_label: 'Adresse IP',
      port_label: 'Port HTTP',
      username_label: 'Username',
      password_label: 'Password'
    },
    search: {
      placeholder: 'Enter show or movie name…'
    },
    subtitles: {
      nothing: 'Nothing found !',
      alternative: 'Try subtitlecat',
      all: 'All',
      download_all: 'Download all',
      downloads: 'downloads',
      rated: 'rated'
    },
    season: 'Season',
    episode: 'Episode'
  },
  'fr': {
    settings: {
      title: 'Réglages',
      language_label: 'Langue',
      language_detail: 'Langue de l\'interface',
      analytics_label: 'Autoriser analytics',
      analytics_detail: 'Envoyer des statistiques anonymes',
      butter_label: 'Activer Popcorn-Time',
      butter_detail: 'Détection automatique du titre en cours de lecture',
      ip_label: 'Adresse IP',
      port_label: 'Port HTTP',
      username_label: 'Nom d\'utilisateur',
      password_label: 'Mot de passe'
    },
    search: {
      placeholder: 'Entrez le nom d\'une serie ou d\'un film…'
    },
    subtitles: {
      nothing: 'Aucun résultat !',
      alternative: 'Éssayer subtitlecat',
      all: 'Tout',
      download_all: 'Tout télécharger',
      downloads: 'téléchargements',
      rated: 'note'
    },
    season: 'Saison',
    episode: 'Épisode'
  }
}

export default new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages // set locale messages
})
