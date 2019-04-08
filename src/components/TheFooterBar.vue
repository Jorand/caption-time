<template>
  <footer class="footer-bar">
    <!-- <span class="app-version">v{{ appVersion }}</span> -->
    <span class="butter-status"
      v-if="butterIsEnable && $route.name === 'home'"
      v-bind:class="{ 'connected': butterStatus }">
      Popcorn-Time
    </span>
    <div class="right"
      v-if="$route.name != 'settings'">
      <router-link to="/settings" title="App Preferences" class="app-pref">
        <i class="icon cog">
          <!-- Icons made by https://www.freepik.com/ -->
          <svg xmlns="http://www.w3.org/2000/svg" width="369.793" height="369.792" viewBox="0 0 369.793 369.792"><path d="M320.83 140.434l-1.759-.627-6.87-16.399.745-1.685c20.812-47.201 19.377-48.609 15.925-52.031l-27.761-27.082c-1.135-1.126-3.128-1.918-4.846-1.918-1.562 0-6.293 0-47.294 18.57l-1.644.738-16.916-6.812-.679-1.684c-19.281-47.742-21.256-47.742-26.054-47.742h-39.205c-4.78 0-6.957 0-24.836 47.825l-.673 1.741-16.828 6.86-1.609-.669c-27.752-11.7-43.956-17.633-48.18-17.633-1.714 0-3.714.769-4.854 1.892l-27.787 27.16c-3.525 3.477-4.987 4.933 16.915 51.149l.805 1.714-6.881 16.381-1.684.651c-48.86 18.882-48.86 20.723-48.86 25.641v38.418c0 4.931 0 6.979 48.957 24.524l1.75.618 6.882 16.333-.739 1.669c-20.812 47.223-19.492 48.501-15.949 52.025l27.719 27.119c1.162 1.117 3.173 1.915 4.888 1.915 1.552 0 6.272 0 47.3-18.561l1.643-.769 16.927 6.846.658 1.693c19.293 47.726 21.275 47.726 26.076 47.726h39.217c4.924 0 6.966 0 24.859-47.857l.667-1.742 16.855-6.814 1.604.654c27.729 11.733 43.925 17.654 48.122 17.654 1.699 0 3.717-.745 4.876-1.893l27.832-27.219c3.501-3.495 4.96-4.924-16.981-51.096l-.816-1.734 6.869-16.31 1.64-.643c48.938-18.981 48.938-20.831 48.938-25.755v-38.395c-.001-4.93-.001-6.966-48.964-24.446zm-135.934 106.769c-35.038 0-63.542-27.959-63.542-62.3 0-34.342 28.505-62.264 63.542-62.264 35.023 0 63.522 27.928 63.522 62.264.001 34.335-28.498 62.3-63.522 62.3z"/>
          </svg>
        </i>
      </router-link>
    </div>

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
    flex: none;
    display: flex;
    text-align: center;

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
      padding: 0 12px;
      line-height: 34px;
      font-size: 12px;
      color: $grey-color;
      margin-right: 15px;
      flex: 1;
      text-align: left;

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

    .right {
      flex: 1;
      text-align: right;
    }

    .app-pref {
      display: inline-block;
      height: 100%;
      padding: 6px 12px;
      border: none;
      background: transparent;
      fill: $grey-color;

      .cog {
        display: inline-block;
        width: 12px;
        height: 12px;
        vertical-align: middle;
        padding: 0;

        svg {
          margin-top: -10px;
        }
      }

      &:hover, &:focus {
        fill: $black-color;
      }
    }
  }

</style>
