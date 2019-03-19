<template>
  <div class="select-container">
      <button class="select-button">{{ userLanguageName }}</button>
      <select class="input-select" v-model="userLanguage">
        <option v-for="lang in languages" v-bind:key="lang.code" v-bind:value="lang.code">
          {{ lang.name }}
        </option>
      </select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Languages from '@/lib/languages'

export default {
  name: 'SelectLanguage',
  data () {
    return {
      languages: Languages
    }
  },
  methods: {},
  computed: {
    ...mapGetters([
      'userLanguageName',
      'userLanguageCode'
    ]),
    userLanguage: {
      set (lang) {
        this.$store.commit('setUserLanguage', lang)
      },
      get () {
        return this.userLanguageCode
      }
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
  .select-container {
    position: relative;
    -webkit-app-region: no-drag;
    display: inline-block;
    height: auto;
    text-align: right;
    margin: 8px 10px 0 10px;
    white-space: nowrap;

    .select-button {
      font-size: 13px;
      border: none;
      -webkit-appearance: none;
      background: transparent;
      box-shadow: none;
      padding: 4px 5px;
      padding-left: 10px;

      &::after {
        content: '';
        display: inline-block;
        opacity: .3;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid black;
        margin-left: 6px;
        margin-bottom: 1px;
      }
    }

    .input-select {
      position: absolute;
      opacity: 0;
      left: 0;
      font-size: 13px;
      border: 0;
      -webkit-appearance: none;
      background: transparent;
      box-shadow: none;
      padding: 4px 0 0 10px;
      background-color: red;
      width: 100%;
    }
  }
</style>
