<template>
  <footer class="footer-bar">
    <!-- <span class="app-version">v{{ appVersion }}</span> -->
  </footer>
</template>

<script>
import electron from 'electron'

export default {
  name: 'TheFooterBar',
  data () {
    return {
      appVersion: electron.remote.app.getVersion()
    }
  }
}
</script>

<style lang="scss" scoped>
  .footer-bar {
    height: 34px;
    border-radius: 0 0 6px 6px;
    text-align: center;
    border-top: 1px solid $lightgrey-color;
    text-align: right;

    .app-version {
      margin: 0;
      padding: 0;
      line-height: 34px;
      font-size: 12px;
      color: $grey-color;
      margin-right: 15px;
    }
  }
</style>
