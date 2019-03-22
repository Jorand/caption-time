<template>
  <div id="app" class="flex-container" :data-theme="theme">
    <TheTitleBar />
    <div class="app-content flex-content">
      <!-- <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div> -->
      <router-view/>
    </div>
    <TheFooterBar />
  </div>
</template>

<script>
import TheTitleBar from '@/components/TheTitleBar.vue'
import TheFooterBar from '@/components/TheFooterBar.vue'

export default {
  name: 'app',
  components: {
    TheTitleBar,
    TheFooterBar
  },
  data () {
    return {
      theme: 'dark'
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
    background-color: #fff; // #303133, #1c1e23
    color: #000;
  }

  .flex-container {
    display: flex;
    height: 100%;
    overflow: hidden;
    flex-direction: column;
  }

  .flex-content {
    flex: 1; /* takes the remaining height of the "container" div */
    overflow: auto;
  }

</style>
