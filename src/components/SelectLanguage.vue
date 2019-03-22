<template>
  <div class="select-container">
      <select id="subtitleLanguage" class="input-select"
        v-model="selectedValue" @change="setUserLanguage($event.target.value)">
        <option v-for="lang in languages"
          :key="lang.code"
          :value="lang.code">
          {{ lang.name }}
        </option>
      </select>
      <label for="subtitleLanguage" class="user-language">{{ userLanguageName }}</label>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Languages from '@/lib/languages'

export default {
  name: 'SelectLanguage',
  data () {
    return {
      languages: Languages,
      selectedValue: ''
    }
  },
  mounted () {
    this.selectedValue = this.userLanguageCode
  },
  methods: {
    setUserLanguage (val) {
      this.$store.commit('setUserLanguage', this.selectedValue)
    }
  },
  computed: {
    ...mapGetters([
      'userLanguageName',
      'userLanguageCode'
    ])
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
  .select-container {
    position: relative;
    -webkit-app-region: no-drag;
    display: inline-block;
    height: 100%;
    text-align: right;
    white-space: nowrap;
    margin-right: 10px;

    .user-language {
      display: inline-block;
      border: none;
      -webkit-appearance: none;
      background: transparent;
      box-shadow: none;
      font-size: 13px;
      height: 26px;
      line-height: 1em;
      padding: 6px;
      padding-left: 10px;
      vertical-align: middle;
      margin-top: 8px;
      pointer-events: none;

      &::after {
        content: '';
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid;
        margin-left: 6px;
        margin-bottom: 1px;
        color: $grey-color;
      }
    }

    .input-select {
      position: absolute;
      top: 50%;
      left: 0;
      display: inline-block;
      font-size: 13px;
      height: 26px;
      line-height: 1em;
      vertical-align: middle;
      border: 0;
      -webkit-appearance: none;
      background: transparent;
      box-shadow: none;
      padding: 6px;
      padding-left: 10px;
      width: 100%;
      margin-top: -12px;
      text-indent: 200%;
      white-space: nowrap;
      overflow: hidden;
    }

    .input-select:focus + label::after {
      color: $darkgrey-color;
    }
  }
</style>
