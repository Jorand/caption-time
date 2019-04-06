<template>
  <div class="settings content-wrapper">
    <div class="sub-nav-bar">
      <router-link class="sub-nav-back"
        to="/home"
        title="Go back page"></router-link>
        <h1>{{ $t('settings.title') }}</h1>
    </div>
    <div class="content-scroll">
      <ol class="settings-list">

        <li class="settings-item">
          <div class="left">
            <label for="settings_ui_lang">{{ $t('settings.language_label') }}</label>
            <small>{{ $t('settings.language_detail') }}</small>
          </div>
          <div class="right">
            <select id="settings_ui_lang" class="input-select"
              v-model="$i18n.locale"
              @change="setAppLanguage($event.target.value)">
              <option v-for="(lang, i) in languages"
                :key="`Lang${i}`"
                :value="lang.language">
                {{ lang.title }}
              </option>
            </select>
          </div>
        </li>

        <li class="settings-item">
          <div class="left">
            <label for="enable-analytics">{{ $t('settings.analytics_label') }}</label>
            <small>{{ $t('settings.analytics_detail') }}</small>
          </div>
          <div class="right">
            <div class="toggle">
              <input id="enable-analytics" class="toggle-input" type="checkbox"
                v-model="analytics">
            </div>
          </div>
        </li>

        <li class="settings-item">
          <div class="left">
            <label for="enable-butter">{{ $t('settings.butter_label') }}</label>
            <small>{{ $t('settings.butter_detail') }}</small>
          </div>
          <div class="right">
            <div class="toggle">
              <input id="enable-butter" class="toggle-input" type="checkbox"
                v-model="butterIsEnable">
            </div>
          </div>
          <ol class="settings-sublist">
            <li class="settings-item">
              <label for="butter-ip">{{ $t('settings.ip_label') }}</label>
              <input id="butter-ip" class="input-text" type="text" name=""
                placeholder="127.0.0.1"
                :value="butter.ip"
                @change="setButterIp($event.target.value)">
            </li>
            <li class="settings-item">
              <label for="butter-port">{{ $t('settings.port_label') }}</label>
              <input id="butter-port" class="input-text" type="text" name=""
                placeholder="8080"
                :value="butter.port"
                @change="setButterPort($event.target.value)">
            </li>
            <li class="settings-item">
              <label for="butter-username">{{ $t('settings.username_label') }}</label>
              <input id="butter-username" class="input-text" type="text" name=""
                placeholder="popcorn"
                :value="butter.username"
                @change="setButterUsername($event.target.value)">
            </li>
            <li class="settings-item">
              <label for="butter-password">{{ $t('settings.password_label') }}</label>
              <input id="butter-password" class="input-text" type="text" name=""
                placeholder="popcorn"
                :value="butter.password"
                @change="setButterPassword($event.target.value)">
            </li>
          </ol>
        </li>

        <li class="settings-item">
          <div class="left">
            <label>{{appName}}</label>
            <small>Version {{appVersion}}</small>
          </div>
        </li>

      </ol>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import electron from 'electron'

export default {
  name: 'Settings',
  data () {
    return {
      appName: electron.remote.app.getName(),
      appVersion: electron.remote.app.getVersion(),
      languages: [
        { language: 'en', title: 'English' },
        { language: 'fr', title: 'Français' }
      ]
    }
  },
  methods: {
    setAppLanguage (value) {
      this.$store.commit('setAppLanguage', value)
    },
    setButterIp (value) {
      this.$store.commit('setButterIp', value)
    },
    setButterPort (value) {
      this.$store.commit('setButterPort', value)
    },
    setButterUsername (value) {
      this.$store.commit('setButterUsername', value)
    },
    setButterPassword (value) {
      this.$store.commit('setButterPassword', value)
    }
  },
  mounted () {

  },
  computed: {
    ...mapState({
      butter: state => state.userSettings.butter
    }),
    analytics: {
      get () {
        return this.$store.state.userSettings.analytics
      },
      set (value) {
        this.$store.commit('setAnalytics', value)
      }
    },
    butterIsEnable: {
      get () {
        return this.$store.state.userSettings.butter.enable
      },
      set (value) {
        this.$store.commit('setButterEnable', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .sub-nav-bar {
    text-align: left;
    border-bottom: 1px solid $lightgrey-color;
    user-select: none;

    h1 {
      font-size: 26px;
      color: $darkgrey-color;
      font-weight: 600;
      display: inline-block;
      vertical-align: middle;
      padding: 4px 0 13px 0;
    }

    .sub-nav-back {
      display: inline-block;
      vertical-align: middle;
      padding: 15px 15px 15px 25px;
      margin-top: -5px;
      color: $darkgrey-color;

      &::after {
        content: '';
        display: block;
        width: 11px;
        height: 11px;
        border-style: solid;
        border-width: 2px 0px 0px 2px;

        transform: rotate(-45deg);
      }

      &:focus {
        color: $black-color;
      }
    }
  }

  .content-wrapper {
    position: relative;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .content-scroll {
    overflow: auto;
    flex: 1;
  }

  .settings-list {

    .settings-item {
      min-height: 68px;
      border-bottom: 1px solid $lightgrey-color;
      display: flex;
      flex-flow: row wrap;
      padding: 16px 25px;

      &:last-child {
        border-bottom: none;
      }

      .left {
        margin-right: auto;
        text-align: left;
      }

      .right {
        margin-left: auto;
        text-align: right;
        padding-top: 7px;
      }

      label {
        display: block;
        font-size: 14px;
        width: 100%;
        text-align: left;
      }

      small {
        font-size: 11px;
        color: $darkgrey-color;
      }

      .input-text {
        border: none;
        width: 100%;
        border-bottom: 1px solid #ddd;
        font-size: 13px;
        color: $darkgrey-color;
        padding: 5px 0;
      }

      .input-select {
        font-size: 14px;
      }
    }

    .settings-sublist {
      width: 100%;
      margin-top: 15px;

      .settings-item {
        padding: 7px 0;
        border: none;
        min-height: 36px;
      }
    }
  }
</style>
