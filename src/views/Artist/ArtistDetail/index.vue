<template>
  <div class="artist"  @click.stop="isShowDesc=false">
    <div class="wrapper clearfix">
      <!-- 歌手详情 -->
      <div class="artist-detail">
        <!-- 歌手信息 -->
        <div class="cover">
          <div class="avatar">
            <el-image :src="artist.artist.cover" v-if="artist.artist" lazy></el-image>
          </div>
          <div class="info">
            <h2 class="info_name" v-if="artist.artist">
              {{ artist.artist.name }}<span class="imageDesc" v-if="artist.identify">{{ artist.identify.imageDesc }}</span>
            </h2>
            <span class="info_albums" v-if="artist.artist">专辑：{{ artist.artist.albumSize }}</span>
            <span class="info_songs" v-if="artist.artist">单曲：{{ artist.artist.musicSize }}</span>
            <span class="info_mv" v-if="artist.artist">mv： {{ artist.artist.mvSize }}</span>
            <div class="popular">
              代表作品：<span v-for="song in songList" :key="song.id"
                ><router-link :to="{ path: '/songlist/detail', query: { id: song.id } }" class="song_name">{{ song.name }}</router-link> |
              </span>
            </div>
            <div class="desc">
              <h3>歌手简介</h3>
              <p class="info_desc" v-html="artist.artist.briefDesc" @click.stop="showAllDesc" :title="isShowDesc ? '点击关闭更多介绍' : '点击展开查看更多'" v-if="artist.artist"></p>
              <pre class="cover-desc-all" v-if="isShowDesc">{{ artist.artist.briefDesc }}</pre>
            </div>
          </div>
        </div>
        <!-- 内容导航 -->
        <ul class="tab">
          <li :class="{ actived: actived == 1 }">
            <router-link :to="{ path: '/artist/detail/songs', query: { id: `${id}` } }">热门歌曲</router-link>
          </li>
          <li :class="{ actived: actived == 2 }">
            <router-link :to="{ path: '/artist/detail/als', query: { id: `${id}` } }">所有专辑</router-link>
          </li>
          <li :class="{ actived: actived == 3 }">
            <router-link :to="{ path: '/artist/detail/mvs', query: { id: `${id}` } }">相关mv</router-link>
          </li>
          <li :class="{ actived: actived == 4 }">
            <router-link :to="{ path: '/artist/detail/descs', query: { id: `${id}` } }">艺人介绍</router-link>
          </li>
        </ul>
        <router-view></router-view>
      </div>
      <!-- 侧边推荐栏 -->
      <div class="aside-box">
        <div class="simi-artist">
          <h3 class="aside-title">相似歌手</h3>
          <ul class="artlist">
            <li v-for="(simi, index) in simiList" :key="index">
              <router-link :to="{ path: '/artist/detail/songs', query: { id: simi.id } }">
                <figure class="artist-img">
                  <el-image :src="simi.img1v1Url" lazy> </el-image>
                  <figcaption class="mask-name">
                    <h3>{{ simi.name }}</h3>
                  </figcaption>
                </figure>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, computed, watch, toRefs } from "vue";
import { reqArtistDesc, reqSimiArtist, reqArtistDetail, reqArtistSongs } from "@/api";
import { useRoute } from "vue-router";

export default {
  name: "ArtistDetail",
  setup() {
    const route = useRoute();

    const data = reactive({
      // 歌手详情
      artist: {},
      // 歌手描述
      desc: [],
      // 当前激活标签
      actived: 1,
      // 相似歌手
      simiList: [],
      // 展开全部简介
      isShowDesc: false,
      songList: [],
    });

    // 歌手id
    const id = computed(() => route.query.id);
    // 路径
    const path = computed(() => route.path);

    watch(id, () => location.reload());

    watch(path, () => {
      if (path.value == "/artist/detail/songs") data.actived = 1;
      if (path.value == "/artist/detail/als") data.actived = 2;
      if (path.value == "/artist/detail/mvs") data.actived = 3;
      if (path.value == "/artist/detail/descs") data.actived = 4;
    });

    // 简介查看更多
    const showAllDesc = () => {
      if (data.artist.artist.briefDesc.length > 120) {
        data.isShowDesc = !data.isShowDesc;
      }
    };

    // 获取相似歌手
    const getSimi = async () => {
      const result = await reqSimiArtist(id.value);
      console.log(result);
      data.simiList = result.artists.slice(0, 14);
    };

    // 获取歌手描述
    const getArtistDesc = async () => {
      const result = await reqArtistDesc(id.value);
      console.log(result);
      data.desc = result.introduction;
    };

    // 歌手详情
    const getArtistDetail = async () => {
      const result = await reqArtistDetail(id.value);
      console.log(result);
      data.artist = result.data;
    };

    // 获取歌手全部单曲
    const getArtist = async () => {
      const result = await reqArtistSongs(id.value);
      data.songList = result.songs.slice(0,6);
    };

    onMounted(() => {
      getArtistDetail();
      getSimi();
      getArtistDesc();
      getArtist();
      if (path.value == "/artist/detail/songs") data.actived = 1;
      if (path.value == "/artist/detail/als") data.actived = 2;
      if (path.value == "/artist/detail/mvs") data.actived = 3;
      if (path.value == "/artist/detail/descs") data.actived = 4;
    });
    return {
      id,
      path,
      showAllDesc,
      ...toRefs(data),
    };
  },
};
</script>

<style lang="less" scoped>
.artist {
  width: 1228px;
  margin: 0 auto;
  padding-bottom: 20px;
  .wrapper {
    display: flex;
    padding-top: 40px;
    // 歌手详情
    .artist-detail {
      flex: 1;
      width: 851px;
      padding-bottom: 45px;
      // 歌手描述
      .cover {
        display: flex;
        text-align: left;
        .info {
          width: 590px;
          padding: 15px;
          margin-left: 20px;
          background: #ffffffbd;
          border-radius: 12px;
          box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
          .info_name {
            padding-left: 5px;
            max-width: 75%;
            height: 34px;
            line-height: 34px;
            font-weight: normal;
            font-size: 24px;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .imageDesc {
              font-size: 12px;
              padding-left: 15px;
              color: #999;
            }
          }
          .info_albums,
          .info_songs,
          .info_mv {
            display: inline-block;
            font-size: 12px;
            padding: 0 5px;
            margin: 10px 0;
            cursor: pointer;
            // &:hover {
            color: #2ca9e1;
            // }
          }
          .info_albums,
          .info_songs {
            border-right: 2px solid #ccc;
          }
          .popular {
            padding: 10px 0;
            padding-left: 5px;
            color: #000;
            font-size: 13px;
            .song_name {
              color: #2ca9e1;

              &:hover {
                text-decoration: underline;
              }
            }
          }
          .desc {
            padding-left: 5px;
            margin-top: 10px;
            h3 {
              // font-weight: no;
              padding-bottom: 5px;
            }
            .info_desc {
              line-height: 22px;
              font-size: 14px;
              color: #777;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
              cursor: pointer;
            }
            .cover-desc-all {
              position: absolute;
              max-width: 50%;
              z-index: 1;
              padding: 10px;
              margin: -10px;
              max-height: 250px;
              line-height: 22px;
              font-size: 14px;
              white-space: pre-line;
              font-family: inherit;
              color: #666;
              background: #fff;
              overflow-y: scroll;
              box-shadow: 0 2px 10px 0 rgba(52, 52, 52, 0.1);
            }
          }

          .alias {
            float: left;
            max-width: 23%;
            padding-left: 10px;
            font-size: 14px;
            line-height: 32px;
            color: #999;
            font-weight: normal;
          }
        }
        .avatar {
          display: flex;
          align-items: center;
          width: 250px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
          flex-shrink: 0;
          overflow: hidden;
          .el-image {
            width: 100%;
          }
          &::after {
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            // width: 100%;
            height: 100%;
            content: "";
            transform: scale(0.95) translateX(5%);
          }
        }
      }
      // 内容标签
      .tab {
        height: 39px;
        border: 1px solid #ccc;
        border-width: 0 1px;
        background: #f0f0f0;
        margin-top: 20px;
        li {
          float: left;
          height: 39px;
          font-size: 14px;
          width: 138px;
          text-align: center;
          line-height: 39px;
          &:hover {
            background-color: #fff;
            border-top: 3px solid #ff461f;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
            line-height: 35px;
            cursor: pointer;
          }
          a {
            display: block;
            padding-left: 2px;
            text-decoration: none;
            color: #333;
            height: 39px;
            font-size: 14px;
            width: 100%;
          }
        }
        .actived {
          background-color: #fff;
          border-top: 3px solid #ff461f;
          border-left: 1px solid #ddd;
          border-right: 1px solid #ddd;
          line-height: 35px;
          cursor: pointer;
        }
      }
    }
    // 侧边相似歌手
    .aside-box {
      margin-left: 20px;
      .simi-artist {
        padding: 20px;
        margin-bottom: 20px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
        .aside-title {
          position: relative;
          font-size: 16px;
          line-height: 24px;
          text-align: left;

          &::before {
            content: "";
            display: inline-block;
            width: 4px;
            height: 18px;
            margin: 3px 5px 0 0;
            border-radius: 2px;
            background: #44c1ff;
            vertical-align: top;
          }
        }
        .artlist {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          li {
            width: (100%) / 2;
            padding: 10px 10px 0;
          }
        }
      }
    }
  }
}

.artist-img {
  width: 136px;
  height: 136px;
  position: relative;
  transition: all 0.45s ease;
  &:before,
  &:after {
    background-color: rgba(0, 0, 0, 0.3);
    border-top: 32px solid rgba(0, 0, 0, 0.3);
    border-bottom: 32px solid rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    content: "";
    transition: all 0.3s ease;
    z-index: 1;
    opacity: 0;
    transform: scaleY(1.5);
  }
  .mask-name {
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
</style>
