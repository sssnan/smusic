<template>
  <div class="artist-list">
    <div class="h_title">
      <h3>热门歌手</h3>
      <router-link class="more" :to="{ path: '/artist' }">更多<i class="iconfont icon-gengduo"></i></router-link>
    </div>
    <el-carousel class="artist" height="340px" :interval="8000" arrow="never" indicator-position="outside">
      <el-carousel-item class="box" :key="index" v-for="(list, index) in hotArtists">
        <router-link :to="{ path: '/artist/detail', query: { id: item.id } }" :key="item.id" v-for="item in list" class="item">
          <figure class="faceImg">
            <el-image :src="item.picUrl"> </el-image>
            <figcaption>
              <h3>{{ item.name }}</h3>
            </figcaption>
          </figure>
        </router-link>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script setup>
import { reqGetHotArtists } from "@/api";
import { ref, onMounted } from "vue";

// 热门歌手
let hotArtists = ref([]);
// 获取热门歌手数据
const getHotArtists = async () => {
  const result = await reqGetHotArtists();
  if (result.code === 200) {
    hotArtists.value[0] = result.artists.slice(0, 9);
    hotArtists.value[1] = result.artists.slice(9, 18);
    hotArtists.value[2] = result.artists.slice(18, 27);
  }
};
onMounted(() => {
  getHotArtists();
});
</script>
<style lang="less" scoped>
.artist {
  height: 360px;
  font-size: 0;

  .box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .item {
    border-radius: 4px;
    width: calc(450px / 3 - 30px);
    height: calc(340px / 3 - 20px);
    .faceImg {
      width: 100px;
      height: 100px;
      transition: all 0.45s ease;
      &:before,
      &:after {
        background-color: rgba(0, 0, 0, 0.5);
        border-top: 32px solid rgba(0, 0, 0, 0.5);
        border-bottom: 32px solid rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        content: "";
        transition: all 0.3s ease;
        z-index: 1;
        opacity: 0;
        transform: scaleY(2);
      }
      figcaption {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        line-height: 1.1em;
        opacity: 0;
        z-index: 3;
        transition-delay: 0.1s;
        font-size: 14px;
        font-family: sans-serif;
        text-transform: uppercase;
        color: #fff;
      }
      &:hover:before,
      &:hover:after {
        transform: scale(1);
        opacity: 1;
      }

      &:hover > .el-image {
        opacity: 0.7;
      }

      &:hover figcaption {
        opacity: 1;
      }
    }
  }
}
</style>
