<template>
  <ol class="subtitles-list">
    <li class="item" ref="item" v-bind:key="`item-${i}`"
      v-for="(subtitle, i) in orderedSubtitles"
      :class="{ 'is-active': i === arrowNavPosition }"
      @click="download(subtitle)">
      <h3 class="item-name"
        @mouseover.stop="itemHover($event)"
        @mouseout.stop="itemWidth = 0">
        <span v-bind:style="{ left: '-' + calculateWidth + 'px' }">
          {{ subtitle.name }}
        </span>
      </h3>
      <ul class="item-meta">
        <li aria-label="source">{{ subtitle.source }}</li>
        <li aria-label="downloads" v-if="subtitle.subInfo">{{ subtitle.subInfo.downloads }} downloads</li>
        <li aria-label="score" v-if="subtitle.score !== 0">Rated: {{subtitle.score}}</li>
        <li aria-label="hearingImpaired" v-if="subtitle.hearingImpaired">SDH</li>
        <li aria-label="lang">{{ subtitle.langName }}</li>
      </ul>
    </li>
  </ol>
</template>

<script>
import Caption from 'caption-core'
import _ from 'lodash'
const { shell } = require('electron')
const { dialog } = require('electron').remote

function uiError (msg, error) {
  dialog.showErrorBox('Oops! Something went wrong', msg + ': ' + error)
}

export default {
  name: 'Subtitles',
  props: ['subtitles', 'arrowNavPosition', 'arrowNavEnter'],
  data () {
    return {
      itemWidth: 0
    }
  },
  methods: {
    download (subtitle) {
      var filename = subtitle.name.replace(/ - /g, ' ').replace(/ /g, '.').replace(/.srt$|.str$/gi, '') + '-' + subtitle.langName + '.srt'

      const savePath = dialog.showOpenDialog({
        title: 'Select a folder',
        properties: ['openDirectory'],
        defaultPath: filename
      })
      if (!savePath) return

      var path = savePath[0] + '/' + filename

      try {
        Caption.download(subtitle, subtitle.source, path)
          .then(() => {
            let myNotification = new Notification('Subtitle downloaded!', {
              body: filename
            })
            myNotification.onclick = () => {
              shell.showItemInFolder(path)
            }
          })
          .catch(error => {
            uiError('Download failed', error)
          })
      } catch (error) {
        uiError('Download failed', error)
      }
    },
    itemHover (e) {
      if (e.target.className === 'item-name') {
        var diff = e.target.firstChild.clientWidth - e.target.clientWidth
        this.itemWidth = diff > 0 ? diff : 0
      }
    }
  },
  watch: {
    arrowNavEnter: function (newVal, oldVal) { // watch it
      if (this.subtitles.length > 0 && this.arrowNavPosition >= 0) {
        this.download(this.subtitles[this.arrowNavPosition])
      }
    },
    arrowNavPosition: function (newVal, oldVal) {
      var $container = this.$parent.$refs.container
      var containerHeight = $container.clientHeight
      var scrollTop = $container.scrollTop
      // console.log($container.scrollTop);

      if (newVal < 0) {
        $container.scrollTop = 0
        return
      }

      var $item = this.$refs.item[newVal]
      var itemHeight = $item.clientHeight
      var pos = $item.offsetTop - $container.offsetTop
      // console.log(pos);

      if (pos < scrollTop) {
        $container.scrollTop = pos
      } else if (pos + itemHeight > scrollTop + containerHeight) {
        $container.scrollTop = (pos + itemHeight) - containerHeight
      }
    }
  },
  computed: {
    calculateWidth: function (e) {
      return this.itemWidth
    },
    onlyAddic7ed: function () {
      return this.subtitles.filter(function (sub) {
        return sub.source === 'addic7ed'
      })
    },
    orderedSubtitles: function () {
      // _.orderBy(this.users, ['name', 'last_login'], ['asc', 'desc'])
      return _.orderBy(this.subtitles, ['source', 'downloads', 'score'], ['asc', 'desc', 'desc'])
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
      user-select: none;

      &.is-active {
        background-color: $lightgrey-color;
      }

      .item-name {
        font-size: 13px;
        //overflow-wrap: break-word;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        position: relative;
        margin-bottom: 5px;
        font-weight: 400;

        span {
          pointer-events: none;
          display: inline-block;
          transition: 0s;
        }

        &:hover span {
          position: relative;
          transition: 1s linear .3s;
        }
      }

      .item-meta {
        font-size: 11px;
        color: $grey-color;

        li {
          display: inline-block;
        }

        > *:not(:last-child)::after {
          content: ' | ';
          margin-right: 3px;
        }
      }
    }
  }
</style>
