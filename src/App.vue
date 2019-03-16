<template>
  <div id="app">
    <header class="title-bar">
      <h1 class="title">{{ title }}</h1>
    </header>
    <div class="app-content">
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div>
      <router-view/>
    </div>
  </div>
</template>

<script>
const electron = require('electron');

export default {
  data() {
    return {
      title: electron.remote.app.getName()
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.title-bar {
  background: #fff;
  height: 38px;
  -webkit-app-region: drag;
  user-select: none;
  cursor: default;
  border-radius: 6px 6px 0 0;
  flex: none;
  
  .title {
    width: 100%;
    text-align: center;
    margin: 0;
    padding: 11px 0;
    font-size: 14px;
    font-weight: 400;
  }
}

.app-content {
  overflow: auto;
}
</style>
