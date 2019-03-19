<template>
  <div class="subtitles-list">
    <div class="item"
      v-bind:key="`item-${index}`"
      v-for="(subtitle, index) in subtitles"
      @click="download(subtitle)">
      <h3 class="item-name"
        @mouseover.stop="itemHover($event)"
        @mouseout.stop="itemWidth = 0">
        <span v-bind:style="{ left: '-' + calculateWidth + 'px' }">
          {{ subtitle.name }}
        </span>
      </h3>
      <p class="item-meta">
        <span class="source">{{ subtitle.source }}</span>
        <span v-if="subtitle.subInfo">{{ subtitle.subInfo.downloads }} downloads</span>
        <span v-if="subtitle.score !== 0">Rated: {{ subtitle.score }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import Caption from 'caption-core'
const { shell } = require('electron')

export default {
  name: 'Subtitles',
  props: ['subtitles'],
  data () {
    return {
      itemWidth: 0
    }
  },
  methods: {
    download (result) {
      const { dialog } = require('electron').remote
      const savePath = dialog.showSaveDialog({
        defaultPath: result.name
      })

      if (!savePath) {
        return
      }

      try {
        Caption.download(result, result.source, savePath)
          .then(() => {
            let myNotification = new Notification('Subtitle downloaded!', {
              body: result.name
            })

            myNotification.onclick = () => {
              shell.showItemInFolder(savePath)
            }
          })
          .catch(err => console.log('error', err))
      } catch (e) {
        console.log('err', e)
      }
    },
    itemHover (e) {
      if (e.target.className === 'item-name') {
        var diff = e.target.firstChild.clientWidth - e.target.clientWidth
        this.itemWidth = diff > 0 ? diff : 0
      }
    }
  },
  watch: {},
  computed: {
    calculateWidth: function (e) {
      return this.itemWidth
    }
  }
}
</script>

<style lang="scss" scoped>
  .subtitles-list {
    overflow: hidden;

    .item {
      text-align: left;
      border-top: 1px solid $lightgrey-color;
      padding: 12px 25px;
      //cursor: pointer;
      user-select: none;

      &:hover {
        background-color: $lightgrey-color;
      }

      .item-name {
        font-size: 13px;
        //overflow-wrap: break-word;
        white-space: nowrap;
        overflow: hidden;
        //text-overflow: ellipsis;
        width: 100%;
        position: relative;

        span {
          //position: relative;
          pointer-events: none;
          display:inline-block;
          left: 0;
          //transform: translateX(0);
          transition: 0s;
        }

        &:hover span {
          position: relative;
          transition: 1s linear .3s;
          //transform: translateX(calc(200px - 100%));
        }
      }

      .item-meta {
        font-size: 11px;
        color: $grey-color;

        > *:not(:last-child)::after {
          content: ' | '
        }
      }
    }
  }
</style>
