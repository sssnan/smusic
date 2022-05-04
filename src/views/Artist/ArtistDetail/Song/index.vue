<template>
  <div class="song">
    <!-- 歌曲列表 -->
    <div class="songlist" v-show="id != undefined && songList.length != 0">
      <SongList :songList="songList" :total="songList.length" :isScroll="true"></SongList>
    </div>
  </div>
</template>

<script>
import SongList from "@/views/SongList";
import { ref, onMounted, computed } from "vue";
import { reqArtists } from "@/api";
import { useRoute } from "vue-router";

export default {
  name: "Song",
  components: { SongList },
  setup() {
    let songList = ref([]);
    const route = useRoute();
    const id = computed(() => route.query.id);

    // 获取歌手单曲
    const getArtist = async () => {
      const result = await reqArtists(id.value);
      songList.value = result.hotSongs.slice(0, 30);
    };

    onMounted(() => {
      getArtist();
    });
    return {
      songList,
      id,
      getArtist,
    };
  },
};
</script>

<style scoped lang="less">
.song {
  width: 100%;
}
</style>
