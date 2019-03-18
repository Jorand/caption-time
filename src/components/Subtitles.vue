<template>
  <div class="subtitles">
    <div v-bind:key="subtitle.id" v-for="subtitle in subtitles">
      <h3>{{ subtitle.name }}</h3>
    </div>
    
    <!-- <div class="results">
      <ul>
        <li v-for="result in results" @click="download(result)">
          <p class="name">{{ result.name }}</p>
          <span class="source">{{ result.source }}</span>
        </li>
      </ul>
    </div>
     -->
  </div>
</template>

<script>
export default {
  name: "Subtitles",
  props: ["subtitles"],
  methods: {
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

<style lang="scss" scoped>
  
</style>
