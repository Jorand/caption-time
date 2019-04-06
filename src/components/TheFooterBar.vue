<template>
  <footer class="footer-bar">
    <!-- <span class="app-version">v{{ appVersion }}</span> -->
    <span class="butter-status"
      v-if="butterIsEnable"
      v-bind:class="{ 'connected': butterStatus }">
      Popcorn-Time
    </span>
  </footer>
</template>

<script>
import { mapState } from 'vuex'
import electron from 'electron'

export default {
  name: 'TheFooterBar',
  data () {
    return {
      appVersion: electron.remote.app.getVersion()
    }
  },
  mounted () {},
  computed: {
    ...mapState({
      butterIsEnable: state => state.userSettings.butter.enable,
      butterStatus: state => state.data.butterIsConnected
    })
  }
}
</script>

<style lang="scss" scoped>
  .footer-bar {
    height: 34px;
    border-radius: 0 0 6px 6px;
    text-align: center;
    border-top: 1px solid $lightgrey-color;
    text-align: left;
    padding: 0 12px;

    .app-version {
      margin: 0;
      padding: 0;
      line-height: 34px;
      font-size: 12px;
      color: $grey-color;
      margin-right: 15px;
    }

    .butter-status {
      margin: 0;
      padding: 0;
      line-height: 34px;
      font-size: 12px;
      color: $grey-color;
      margin-right: 15px;

      &::before {
        content: '';
        width: 8px;
        height: 8px;
        display: inline-block;
        background-color: $grey-color;
        border-radius: 50%;
        margin-right: 3px;
      }

      &.connected::before {
        background-color: $accent-color;
      }
    }
  }
</style>
