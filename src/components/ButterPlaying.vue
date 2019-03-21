<template>
  <div class="butter-remote"
    :class="{active: isActive}"
    @click.stop="toggle()"
    v-if="butterCurrentShow.title">
    <span class="player">Popcorn-Time Player</span>
    <p class="show-title">
      {{ butterCurrentShow.tnp.title }}
      <span class="details"
        v-if="butterCurrentShow.tnp.episodeName">
        ({{ butterCurrentShow.tnp.episodeName }})
      </span>
      <br>
      <span class="details"
        v-if="butterCurrentShow.isShow">
        Season {{ butterCurrentShow.tnp.season }} -
        Episode {{ butterCurrentShow.tnp.episode }}
      </span>
    </p>
    <button class="close" @click.stop="toggle()"></button>
  </div>
</template>

<script>
import ButterRemote from '@/lib/butter-remote'

export default {
  name: 'ButterRemote',
  data () {
    return {
      isActive: true,
      butterCurrentShow: {},
      butterLastShow: {},
      butterInterval: null
    }
  },
  methods: {
    toggle () {
      this.isActive = !this.isActive
      if (this.isActive && this.butterCurrentShow.query !== '') {
        this.$emit('title-playing', this.butterCurrentShow.query)
      } else {
        this.$emit('title-playing', '')
      }
    }
  },
  computed: {},
  mounted () {
    // this.$store.state.userSettings.butter
    // this.$store.commit('setUserLanguage', this.selectedValue)
    // getters

    var Butter = new ButterRemote(this.$store.state.userSettings.butter)

    Butter.connect()

    Butter.subscribe('disconnected', data => {
      console.log('disconnected', data)
    })

    Butter.subscribe('playingtitle', data => {
      if (!data.title) {
        this.butterCurrentShow = {}
        return
      }

      if (this.butterCurrentShow.title !== data.title) {
        console.info('[INFO] Playing:', data.title, data)
        var show = data.tnp
        data.query = show.title
        if (show.season && show.episode) {
          data.isShow = true
          data.query += ' S' + Butter.pad(show.season) + ' E' + Butter.pad(show.episode) + (show.quality ? ' ' + show.quality : '')
        }
        this.butterCurrentShow = data
        this.isActive = true
        console.info('[INFO] Emit:', data.query)
        this.$emit('title-playing', data.query)
      }
    })
  },
  destroy () {
    clearInterval(this.butterInterval)
  }
}
</script>

<style lang="scss" scoped>
  .butter-remote {
    cursor: pointer;
    position: relative;
    margin: 0 13px;
    margin-top: 2px;
    margin-bottom: 5px;
    height: 25px;
    background-color: $accent-color;
    border-radius: 5px;
    padding: 2px 15px 0;
    padding-bottom: 10px;
    overflow: hidden;
    transition: .2s;
    z-index: 1;

    &.active {
      margin-bottom: -60px;
      height: 90px;
    }

    .player {
      font-size: 12px;
      color: $acccentDark-color;
    }

    .show-title {
      font-size: 16px;
      font-weight: 700;
      margin-top: 7px;

      .details {
        font-size: 14px;
        font-weight: normal;
      }
    }

    .close {
      position: absolute;
      right: 3px;
      top: 3px;
      height: 20px;
      width: 20px;
      background: transparent;
      border: none;
      display: none;

      &::after, &::before {
        content: '';
        position: absolute;
        display: block;
        top: 50%;
        left: 50%;
        width: 14px;
        height: 2px;
        margin-top: -1px;
        margin-left: -7px;
        background-color: $acccentDark-color;
      }

      &::after {
        transform: rotate(45deg);
      }

      &::before {
        transform: rotate(-45deg);
      }
    }

    &.active .close {
      display: block;
    }
  }
</style>
