<template>
  <div class="home flex-container">
    <SearchInput v-on:search-result="updateList" />
    <span>Popcorn-Time: {{butterCurrentShow.title}}</span>
    <div class="flex-content">
      <Subtitles v-bind:subtitles="subtitleList" />
    </div>
  </div>
</template>

<script>
import SearchInput from '@/components/SearchInput.vue'
import Subtitles from '@/components/Subtitles.vue'
import ButterRemote from '@/lib/butter-remote';

var Butter = new ButterRemote({
  username: "popcorn",
  password: "popcorn",
  ip: "192.168.1.33",
  port: "8008",
  debug: false
});

export default {
  name: 'Home',
  components: {
    SearchInput,
    Subtitles
  },
  data() {
    return {
      searchQuery: '',
      subtitleList: [],
      butterCurrentShow: {},
      butterInterval: null
    }
  },
  methods: {
    updateList(result) {
      // const { title, id } = result
      //this.subtitles = [...this.subtitles, result];
      this.subtitleList = result;
    }
  },
  mounted() {
    Butter.connect()
      .then((data) => {
        startButterCall();
      })
      .catch(err => {
        console.warn("[WARN]: Connection Fail: ", err)
        startButterCall();
      });
    
    const getTitle = () => {
      Butter.getPlayingTitle(data => {
        //console.log(data);
        if (data.error != undefined) {
          this.butterCurrentShow = {};
          console.warn("[WARN]: ", data.error)
        }
        else {
          this.butterCurrentShow = data;
          if (data.title)
            console.info("[INFO] Playing: ", data.title)
        }
      })
    }
    
    const startButterCall = () => {
      getTitle();
      clearInterval(this.butterInterval);
      this.butterInterval = setInterval(() => {
        getTitle();
      }, 2000);
    }
    
  },
  destroy() {
    clearInterval(this.butterInterval);
  }
}
</script>

<style lang="scss" scoped>
  .home-content {
    flex: 1; /* takes the remaining height of the "container" div */
    overflow: auto;
  }
</style>
