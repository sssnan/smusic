<template>
  <div class="album">
    <Albums :albums="hotAlbums"></Albums>
    <Pagination :pageNo="pageNo" :pageSize="pageSize" :total="total" :continues="5" @getPageNo="getPageNo"></Pagination>
  </div>
</template>

<script>
import Albums from "@/components/Albums";
import { reactive, toRefs, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { reqArtistAlbum } from "@/api";

export default {
  name: "Album",
  components: { Albums },
  setup() {
    const data = reactive({
      // 热门专辑
      hotAlbums: [],
      pageNo: 1,
      pageSize: 20,
      total: 0,
    });

    const route = useRoute();
    const id = computed(() => route.query.id);

    //获取歌手专辑
    const getAlbum = async () => {
      let result = await reqArtistAlbum(id.value, data.pageSize, (data.pageNo - 1) * data.pageSize);
      data.total = result.artist.albumSize;
      data.hotAlbums = result.hotAlbums;
      data.hotAlbums.forEach(item => {
        var a = new Date(item.publishTime);
        item.time = a.toLocaleDateString().replace(/\//g, ".");
      });
    };

    const getPageNo = page => {
      data.pageNo = page;
      getAlbum();
    };

    onMounted(() => {
      getAlbum();
    });
    return {
      ...toRefs(data),
      id,
      getAlbum,
      getPageNo,
    };
  },
};
</script>

<style scoped lang="less">
.album {
  width: 100%;
}
</style>
