<template>
  <div class="home">
    <Search v-on:search-result="showResult" />
    <div class="search">
      <input type="text" name="query" placeholder="Search" v-model="searchQuery" @keyup.enter="search">
    </div>
    <div class="results">
      <ul>
        <li v-for="result in results" @click="download(result)">
          <p class="name">{{ result.name }}</p>
          <span class="source">{{ result.source }}</span>
        </li>
      </ul>
    </div>
    
    <Subtitles v-bind:subtitles="subtitles" />
  </div>
</template>

<script>
import Search from '@/components/Search.vue'

// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import Subtitles from '@/components/Subtitles.vue'


import Caption from "caption-core";
const ENGLISH = "eng";
const LIMIT = 10;

import ButterRemote from '../butter-remote';
var Butter = new ButterRemote({
  username: "popcorn",
  password: "popcorn",
  ip: "192.168.1.33",
  port: "8008",
  debug: "false"
});

Butter.ping()
  .then(function(data) {
    console.log(data);
  })
  .catch(err => console.log("error", err));
  


var popInterval = setInterval(() => {
  
}, 10000);

Butter.getViewStack()
  .then((data) => {
    //console.log(data);
    if( typeof(data.butterVersion) == "undefined" ) { //check if using an old before 0.3.4
  		var currentview = data.result[0][data.result[0].length - 1];
  	}
  	else { // 0.3.4 or higher
  		var currentview = data.viewstack[data.viewstack.length - 1];
  	}
    console.log("[DEBUG] Current view: " + currentview);
  })
  .catch(err => console.log("error", err));
// 
export default {
  name: 'home',
  components: {
    Search,
    Subtitles
    //HelloWorld
  },
  data() {
    return {
      searchQuery: '',
      results: [],
      
      subtitles : []
    }
  },
  methods: {
    showResult(result) {
      // const { title, id } = result
      //this.subtitles = [...this.subtitles, result];
      this.subtitles = result;
    },
    search () {
      Caption.searchByQuery(this.searchQuery, ENGLISH, LIMIT)
        .on("fastest", subtitles => {
          // Fastest source has been checked.
          console.log("fastest",subtitles);
          this.results = subtitles;
        })
        .on("completed", subtitles => {
          // All sources are checked.
          console.log("completed",subtitles);
          this.results = subtitles;
        });
    },
    download (result) {
      console.log(result);
      const { dialog } = require('electron').remote
      const savePath = dialog.showSaveDialog({
        defaultPath: result.name + '.str',
      });
      console.log(savePath)
      
      if (!savePath) {
        return;
      }
      
      try {
        Caption.download(result, result.source, savePath)
          .then(() => {
            console.log("successfully downloaded!");
          })
          .catch(err => console.log("error", err));
      } catch (e) {
        console.log("err", err);
      }
    }
  }
}
</script>

<style lang="scss">
  .results {
    text-align: left;
  }
</style>
