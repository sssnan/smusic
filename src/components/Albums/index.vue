<template>
  <ul class="m-list clearfix">
    <li v-for="(album, index) in albums" :key="index">
      <router-link :to="{ path: '/album/detail', query: { id: album.id } }">
        <el-image :src="album.blurPicUrl" lazy />
      </router-link>
      <p class="name" :title="album.name">
        <router-link :to="{ path: '/album/detail', query: { id: album.id } }" style="color: #333">{{ album.name }}</router-link>
      </p>
      <p class="artist">
        <span v-for="(artist, index) in album.artists" :key="index">
          <router-link :to="{ path: '/artist/detail', query: { id: artist.id } }" :title="artist.name" class="underline">{{ artist.name }}</router-link>
          <span v-if="index != album.artists.length - 1">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
        </span>
      </p>
    </li>
  </ul>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  albums: { type: Array },
});

const albums = computed(() => props.albums);
</script>

<style lang="less" scoped>
.m-list {
  display: flex;
  width: 100%;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: space-around;
  text-align: center;
  li {
    width: calc(100% / 5);
    padding-bottom: 30px;
    .el-image {
      width: 90%;
      cursor: pointer;
    }
    .name {
      display: block;
      color: #333;
      font-family: Arial, Helvetica, sans-serif;
      -webkit-text-size-adjust: none;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
    .artist {
      width: 90%;
      margin: 0 auto;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
