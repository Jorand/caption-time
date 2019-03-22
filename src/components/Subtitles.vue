<template>
  <div class="subtitles-wrapper">
    <div class="actionsBar">
      <ul class="left">
        <li class="bar-item">
          <button type="button" name="show-all"
            :class="{active: activeFilter === 'all'}"
            @click="filterSubtitles('all')"
            @keydown.enter="filterSubtitles('all')"
            @focus="actionFocused = true"
            @blur="actionFocused = false">All</button>
        </li>
        <li class="bar-item" v-bind:key="`source-${i}`"
          v-for="(source, i) in sources">
          <button type="button" name="filter"
            :class="{active: activeFilter === source}"
            @click="filterSubtitles(source)"
            @keydown.enter="filterSubtitles(source)"
            @focus="actionFocused = true"
            @blur="actionFocused = false">{{source}}</button>
        </li>
      </ul>
      <div class="right">
        <div class="bar-item">
          <button class="button" type="button" name="download-all"
            @click="downloadAll()"
            @keydown.enter="downloadAll()"
            @focus="actionFocused = true"
            @blur="actionFocused = false">
            Download all
          </button>
        </div>
      </div>
    </div>
    <div class="subtitles-container" ref="containerSubtitlesScroll">
      <ol class="subtitles-list">
        <li class="item" ref="item" v-bind:key="`item-${i}`"
          v-for="(subtitle, i) in subtitlesList"
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
    </div>
  </div>
</template>

<script>
import Caption from 'caption-core'
import _ from 'lodash'
const { shell } = require('electron')
const remote = require('electron').remote
const { dialog, app } = remote

function uiError (msg, error) {
  console.log(error)
  dialog.showErrorBox('Oops! Something went wrong', msg + ': ' + error)
}

export default {
  name: 'Subtitles',
  props: ['subtitles', 'arrowNavPosition', 'arrowNavEnter'],
  data () {
    return {
      itemWidth: 0,
      subtitlesList: [],
      sources: [],
      actionFocused: false,
      activeFilter: 'all'
    }
  },
  methods: {
    notification: (message, savePath) => {
      const myNotification = new Notification(app.getName(), {
        body: message
      })
      myNotification.onclick = () => {
        shell.showItemInFolder(savePath)
      }
    },
    download (subtitle) {
      const hasExtension = subtitle.name.includes('.srt')
      let filename = hasExtension ? subtitle.name.replace(/.srt$|.str$/gi, '') : subtitle.name
      filename = `${filename}-${subtitle.langName}.srt`
      const mainWindow = remote.getCurrentWindow()
      const savePath = dialog.showSaveDialog(mainWindow, {
        title: 'Download',
        properties: ['openDirectory'],
        defaultPath: filename
      })
      if (!savePath) return
      try {
        Caption.download(subtitle, subtitle.source, savePath)
          .then(() => {
            this.notification(`${filename} is successfully downloaded!`, savePath)
          })
          .catch(err => {
            console.log('[ERROR] download:', err)
            uiError('Download failed', err)
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
    },
    filterSubtitles (source) {
      this.activeFilter = source
      switch (source) {
        case 'all':
          this.subtitlesList = _.orderBy(this.subtitles, ['source', 'downloads', 'score'], ['asc', 'desc', 'desc'])
          break
        default:
          this.subtitlesList = this.subtitles.filter((subtitle) => {
            return subtitle.source === source
          })
      }
    },
    downloadAll () {

    }
  },
  watch: {
    subtitles: function (newVal, oldVal) {
      this.sources = [...new Set(this.subtitles.map(s => s.source))]
      // Filter list here
      this.filterSubtitles('all')
    },
    arrowNavEnter: function (newVal, oldVal) { // watch it
      if (this.subtitlesList.length > 0 && this.arrowNavPosition >= 0 && !this.actionFocused) {
        this.download(this.subtitlesList[this.arrowNavPosition])
      }
    },
    arrowNavPosition: function (newVal, oldVal) {
      var $container = this.$refs.containerSubtitlesScroll
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
  mounted () {},
  computed: {
    calculateWidth: function (e) {
      return this.itemWidth
    }
  }
}
</script>

<style lang="scss" scoped>
  .subtitles-wrapper {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .subtitles-container {
    overflow: auto;
    flex: 1;
  }

  .actionsBar {
    display: flex;
    padding: 0px 25px 10px;

    .left {
      margin-right: auto;
      text-align: left;
    }

    .right {
      margin-left: auto;
      text-align: right;
    }

    .bar-item {
      display: inline-block;
      cursor: pointer;
      color: $grey-color;
      font-size: 13px;

      &:not(:last-child)::after {
        content: '|';
        margin: 0 7px;
      }

      button {
        position: relative;
        border: none;
        padding: 0;
        white-space: nowrap;

        &:hover, &:focus {
          color: $darkgrey-color;
        }

        &.active::after {
          border-bottom: 1px solid;
        }
      }
    }
  }

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
        user-select: text;

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
