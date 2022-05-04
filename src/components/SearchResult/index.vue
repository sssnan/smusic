<template>
  <div class="search-container">
    <div class="search-form">
      <!-- 顶部搜索框 -->
      <div class="search-input">
        <input type="text" v-model="keyVal" />
        <i class="iconfont icon-sousuo1" @click="goSearch"></i>
      </div>
      <!-- 搜索内容 -->
      <div class="search-main">
        <div class="search-info">
          搜索"{{ key }}"，找到<span>{{ res }}</span>
        </div>
        <div class="search-content">
          <ul class="search-nav">
            <li :class="{ active: type == item.type }" v-for="(item, index) in navs" :key="index" @click="navChange(item.type)">
              <em>{{ item.nav }}</em>
            </li>
          </ul>
          <div class="search-res">
            <SongList :songList="list['songs']" :isScroll="true" v-if="list['songs']" :total="30"></SongList>
            <Artists :artistList="list['artists']" v-if="list['artists']"></Artists>
            <Albums :albums="list['albums']" v-if="list['albums']"></Albums>
            <Playlist :hotList="list['playlists']" v-if="list['playlists']"></Playlist>
            <Mv :mvList="list['videos']" v-if="list['videos']"></Mv>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SongList from "@/views/SongList";
import Playlist from "@/components/Playlist";
import Artists from "@/components/Artists";
import Mv from "@/components/Mv";
import Albums from "@/components/Albums";

import { reactive, toRefs, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { reqCloudSearch } from "@/api";
import { useRouter } from "vue-router";
import search from "@/hook/search";

export default {
  name: "SearchResult",
  components: { SongList, Playlist, Mv, Artists, Albums },
  setup() {
    const route = useRoute();
    const router = useRouter();
    // 数据
    const data = reactive({
      // 搜索导航
      navs: [
        {
          label: "songs",
          type: 1,
          nav: "单曲",
        },
        {
          label: "artists",
          type: 100,
          nav: "歌手",
        },
        {
          label: "albums",
          type: 10,
          nav: "专辑",
        },
        {
          label: "playlists",
          type: 1000,
          nav: "歌单",
        },
        {
          label: "videos",
          type: 1014,
          nav: "视频",
        },
      ],
      // 默认激活导航
      type: 1,
      // 搜索结果列表
      list: {},
      keyVal: "",
      res: "",
    });
    // 页面跳转
    const { jumpPage } = search();
    // 搜索关键词
    const key = computed(() => route.query.key);

    // 获取搜索结果
    const getSearch = async (key, type) => {
      const result = await reqCloudSearch(key, type);
      if (result.code === 200) {
        data.list = result.result;
      }
      switch (type) {
        case 1:
          data.res = result.result.songs.length + "首单曲";
          break;
        case 10:
          data.res = result.result.albums.length + "张专辑";
          break;
        case 100:
          data.res = result.result.artists.length + "个歌手";
          break;
        case 1000:
          data.res = result.result.playlists.length + "个歌单";
          break;
        case 1014:
          data.res = result.result.videos.length + "个视频";
          break;
      }
    };
    // 搜索功能
    const goSearch = () => {
      if (data.keyVal === key.value){
        ElMessage.error('请勿重复搜索同一关键词')
      };
      router.push({ path: "/search/res", query: { key: data.keyVal } });
      data.type = 1;
      getSearch(data.keyVal);
    };

    // 导航标签切换
    const navChange = type => {
      data.type = type;
      getSearch(key.value, type);
    };

    onMounted(() => {
      data.keyVal = key.value;
      getSearch(data.keyVal, data.type);
    });

    return {
      ...toRefs(data),
      key,
      jumpPage,
      goSearch,
      navChange,
    };
  },
};
</script>

<style lang="less" scoped>
.search-container {
  width: 70%;
  margin: 0 auto;
  // background: #fff;
  .search-form {
    padding: 40px;
    // background: #fff;
    // 顶部搜索框
    .search-input {
      display: flex;
      width: 420px;
      margin: 0 auto;
      border: 1px solid #bbc8e6;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1) inset;
      border-radius: 4px;
      input {
        margin-left: 12px;
        background: #f3f2f8;
        flex: 1;
      }

      i {
        width: 50px;
        line-height: 39px;
        border-left: 1px solid #bbc8e6;
        box-shadow: -1px 0 5px rgba(0, 0, 0, 0.1);
        cursor: pointer;
      }
    }
    // 搜索内容
    .search-main {
      padding: 20px 0;
      text-align: left;
      .search-info {
        color: #999;
        margin: 28px 0 17px;
        padding: 10px;
        background: #fff;
        border-radius: 6px;
      }
      .search-content {
        background: #fff;
        border-radius: 6px;
        .search-nav {
          display: flex;
          width: 440px;
          height: 39px;
          li {
            width: 110px;
            height: 39px;
            border-width: 1px 0;
            line-height: 39px;
            text-align: center;
            padding-right: 10px;
            font-size: 18px;
            border-radius: 6px;
            cursor: pointer;
            &.active,
            &:hover {
              border-bottom: 3px solid #89c3f4;
              color: #89c3f4;
            }
            a {
              padding-left: 2px;
            }
          }
        }
      }
    }
  }
}
</style>
