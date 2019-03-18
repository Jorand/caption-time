<template>
  <header class="title-bar">
    <h1 class="title">{{ appName }}</h1>
  </header>
</template>

<script>
import electron from 'electron'

export default {
  name: "TheTitleBar",
  data() {
    return {
      appName: electron.remote.app.getName(),
    };
  }
}
</script>

<style lang="scss" scoped>
  .title-bar {
    background: transprent;
    height: 38px;
    -webkit-app-region: drag;
    user-select: none;
    cursor: default;
    border-radius: 6px 6px 0 0;
    flex: none;
    text-align: center;
    
    .title {
      width: 100%;
      text-align: center;
      margin: 0;
      padding: 11px 0;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
    }
  }
</style>
