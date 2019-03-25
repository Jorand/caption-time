<template>
  <header id="toolbar" class="title-bar">
    <div class="left"></div>
    <h1 class="title">{{ appName }}</h1>
    <div class="right">
      <SelectLanguage class="right" v-if="currentRouteName == 'home'" />
    </div>
  </header>
</template>

<script>
import SelectLanguage from '@/components/SelectLanguage.vue'
const remote = require('electron').remote

export default {
  name: 'TheTitleBar',
  components: {
    SelectLanguage
  },
  data () {
    return {
      appName: remote.app.getName(),
      currentRouteName: ''
    }
  },
  mounted () {
    var toolbarRect = document.getElementById('toolbar').getBoundingClientRect()
    var win = remote.getCurrentWindow()
    win.setSheetOffset(toolbarRect.height)
    this.currentRouteName = this.$route.name
  },
  watch: {
    '$route' (to, from) {
      this.currentRouteName = this.$route.name
    }
  }
}
</script>

<style lang="scss" scoped>
  .title-bar {
    background: transparent;
    height: 38px;
    -webkit-app-region: drag;
    user-select: none;
    cursor: default;
    border-radius: 6px 6px 0 0;
    flex: none;
    display: flex;
    text-align: center;

    .title {
      flex: 1;
      text-align: center;
      margin: 0;
      padding: 11px 5px;
      font-size: 14px;
      font-weight: 400;
      color: $grey-color;
      white-space: nowrap;
    }

    .right {
      flex: 1;
      text-align: right;
    }

    .left {
      flex: 1;
      text-align: left;
      min-width: 75px;
    }
  }
</style>
