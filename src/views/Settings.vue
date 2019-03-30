<template>
  <div class="settings content-wrapper">
    <div class="sub-nav-bar">
      <router-link class="sub-nav-back"
        to="/home"
        title="Go back page"></router-link>
        <h1>{{ $t('settingsPageTitle') }}</h1>
    </div>
    <div class="content-scroll">
      <ol class="settings-list">
        <li class="settings-item">
          <div class="left">
            <label for="">Language</label>
            <small>Ui language</small>
          </div>
          <div class="right">
            <select id="language" class="input-select"
              v-model="$i18n.locale" @change="changeLang($event.target.value)">
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
            <label for="">Allow analytics</label>
            <small>Help improve by sending anonymous stats</small>
          </div>
          <div class="right">
            <div class="toggle">
              <input id="switch-pop-enable" class="toggle-input" type="checkbox">
              <label class="toggle-switch" for="switch-pop-enable"></label>
            </div>
          </div>
        </li>
        <li class="settings-item">
          <div class="left">
            <label for="switch-pop-enable">Enable Popcorn-Time</label>
            <small>Automatically get title watching</small>
          </div>
          <div class="right">
            <div class="toggle">
              <input id="switch-pop-enable" class="toggle-input" type="checkbox">
              <label class="toggle-switch" for="switch-pop-enable"></label>
            </div>
          </div>
          <ol class="settings-sublist">
            <li class="settings-item">
              <label for="">Adresse IP</label>
              <input class="input-text" type="text" name="" value="127.0.0.1">
            </li>
            <li class="settings-item">
              <label for="">Port HTTP</label>
              <input class="input-text" type="text" name="" value="8080">
            </li>
            <li class="settings-item">
              <label for="">Username</label>
              <input class="input-text" type="text" name="" value="popcorn">
            </li>
            <li class="settings-item">
              <label for="">Password</label>
              <input class="input-text" type="text" name="" value="popcorn">
            </li>
          </ol>
        </li>
        <li class="settings-item">
          <div class="left">
            <label>Caption Time</label>
            <small>Version 1.0.1</small>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Settings',
  data () {
    return {
      languages: [
        { language: 'en', title: 'English' },
        { language: 'fr', title: 'Français' }
      ],
      butterIsActive: false
    }
  },
  methods: {
    changeLang (value) {
      this.$store.commit('setUILanguage', value)
    },
    updateSubtitles (subtitles) {

    }
  },
  mounted () {
    this.selectedValue = this.userLanguageCode
  },
  computed: {
    ...mapGetters([
      'butterRemoteIsEnable',
      'butterRemoteSettings'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .sub-nav-bar {
    text-align: left;
    border-bottom: 1px solid $lightgrey-color;

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

      &::after {
        content: '';
        display: block;
        width: 11px;
        height: 11px;
        border-color: $darkgrey-color;
        border-style: solid;
        border-width: 2px 0px 0px 2px;

        transform: rotate(-45deg);
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
