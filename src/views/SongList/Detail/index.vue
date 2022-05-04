<template>
  <div v-if="songInfo" class="song-container">
    <div class="song-main">
      <div class="song-header">
        <div class="song-l">
          <div class="song-info">
            <div class="info-top">
              <h3 class="song-name">
                {{ songInfo.name }}
                <router-link class="mv-name" :to="{ path: '/mvlist/mv', query: { id: songInfo.mv } }" v-if="songInfo.mv">
                  <i class="iconfont icon-mv1" title="MV"></i>
                </router-link>
              </h3>
              <p>
                歌手：<router-link :to="{ path: '/artist/detail', query: { id: author.id } }" v-for="(author, k) in songInfo.ar" :key="author.name">
                  <span class="song-author">{{ author.name }}</span>
                  <span v-if="songInfo.ar.length > 1 && k != songInfo.ar.length - 1">&nbsp/&nbsp</span>
                </router-link>
              </p>
              <p class="song-related">
                <span
                  >专辑：<router-link class="song-album" :to="{ path: '/album/detail', query: { id: songInfo.al.id } }" v-if="songInfo.al">{{ songInfo.al.name }}</router-link></span
                >
                <span v-if="songInfo.publishTime"
                  >发行时间：<em>{{ $utils.formartDate(songInfo.publishTime, "yyyy-MM-dd") }}</em></span
                >
              </p>
              <div class="cover-desc" v-if="coverDesc">
                <h5>歌曲简介</h5>
                <p>{{ coverDesc }}</p>
              </div>
            </div>
            <div class="info-bottom">
              <div class="song-oper">
                <span class="play-btn play-all" @click="playing(songInfo)"><i :class="['iconfont', playFontIcon]"></i>立即播放</span>
                <span class="play-btn play-collect" @click="showAddList"><i class="iconfont icon-shoucang1"></i> 收藏</span>
                <span class="play-btn play-comment" @click="jumpComment"><i class="iconfont icon-jianyi"></i> 评论</span>
              </div>
            </div>
          </div>
          <!-- 相似歌曲 -->
          <div class="simi-song">
            <h3 class="aside-title">相似歌曲</h3>
            <div class="simi-main">
              <div class="simi-item" v-for="simiItem in simiSong" :key="simiItem.id">
                <div class="simi-info">
                  <router-link class="simi-name" :to="{ path: '/songlist/detail', query: { id: simiItem.id } }">
                    {{ simiItem.name }}
                  </router-link>
                  <div class="simi-author">
                    <router-link :to="{ path: '/artist/detail', query: { id: author.id } }" class="song-author" v-for="(author, k) in simiItem.singer" :key="author.name">{{
                      k !== 0 ? " / " + author.name : author.name
                    }}</router-link>
                  </div>
                </div>
                <div class="simi-song-status">
                  <i @click="playing(simiItem)" :class="['iconfont', playSimiIcon(simiItem)]"></i>
                  <i class="iconfont icon-add" title="添加到列表" @click="addSongList(simiItem)"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 歌词 -->
        <div class="song-lyric">
          <h5>歌词</h5>
          <Lyric :sId="sId" maxH="530"></Lyric>
        </div>
      </div>
      <!-- 评论 -->
      <div class="song-comments" ref="cBox">
        <Comment :type="commentType" :sId="sId"></Comment>
      </div>
    </div>
    <div class="aside-box">
      <div class="cover">
        <em class="lt"></em>
        <em class="rt"></em>
        <em class="rb"></em>
        <em class="lb"></em>
        <div class="cover-img" :class="[isCurSong ? 'active' : '']" @click.stop="playing(songInfo)">
          <img src="../../../assets/images/stylus.png" class="cover-stylus" />
          <el-image :src="songInfo.al.picUrl" v-if="songInfo.al" lazy> </el-image>
        </div>
      </div>
      <div class="sidebar-box playlist-simi" v-if="playlists.length">
        <h3 class="aside-title">包含这首歌的歌单</h3>
        <div class="aside-main playlist-main">
          <router-link class="playlist-item" :to="{ path: '/playlist/detail', query: { id: item.id } }" v-for="item in playlists" :key="item.id">
            <el-image :src="item.coverImgUrl" lazy> </el-image>
            <div class="playlist-info">
              <div class="playlist-name">{{ item.name }}</div>
              <div class="playlist-author">
                By. <router-link :to="{ path: '/user', query: { id: item.creator.userId } }">{{ item.creator.nickname }}</router-link>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Lyric from "@/views/Lyric";
import Comment from "@/components/Comment";
import { reqSongDetail, reqSimiSong, reqSimiPlayList } from "@/api";
import { getCurrentInstance, reactive, toRefs, onMounted, computed, ref } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { useStore } from "vuex";
import topList from "@/hook/topList";
export default {
  name: "SongDetail",
  setup() {
    const { proxy } = getCurrentInstance();
    const { addSongList } = topList();
    const store = useStore();
    const route = useRoute();
    const info = reactive({
      songInfo: null,
      sId: 0, // 歌曲的ID
      coverDesc: "",
      simiSong: [],
      playlists: [],
      mlogMv: [],
      commentType: 0, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
    });
    const cBox = ref(null);

    const isLogin = computed(() => store.getters.isLogin);
    const isPlayed = computed(() => store.getters.isPlayed);
    const playList = computed(() => store.getters.playList);
    const playIndex = computed(() => store.getters.playIndex);
    const curSongInfo = computed(() => playList.value[playIndex.value]);

    const isCurSong = computed(() => isPlayed.value && curSongInfo.value && curSongInfo.value.id == info.sId);

    // 当前播放状态
    const playFontIcon = computed(() => (isCurSong.value ? "icon-zanting1" : "icon-bofang2"));
    // 若是无版权获取vip歌曲 播放按钮置灰
    // const songDisable = computed(() => (info.songInfo.license || info.songInfo.vip ? "disable" : ""));

    // 获取歌曲详情
    const getSongDetail = async () => {
      const result = await reqSongDetail({ ids: info.sId, timestamp: new Date().valueOf() });

      // 是否有版权播放
      // result.songs[0].license = !result.privileges[0].cp;
      info.songInfo = result.songs[0];

      // 显示歌曲简介
      if (info.songInfo.alia) {
        info["coverDesc"] = info["songInfo"].alia.join(" / ");
      }
    };
    // 播放音乐
    const playing = params => {
      // 若当前无歌曲 或者 当前播放歌曲不是本页显示的歌曲  立即播放当前页面歌曲
      if (!curSongInfo.value || curSongInfo.value.id !== params.id) {
        // // 无版权及vip不可播放
        if (params.license) {
          ElMessage.error("由于版权保护，您所在的地区暂时无法使用。");
          return;
        }

        store.dispatch("selectPlay", { list: [params] });
        store.commit("SET_PLAYLISTTIPS", true);
      } else {
        store.commit("SET_PLAYSTATUS", !isPlayed.value);
      }
    };

    // 获取相似音乐
    const getSimiSong = async () => {
      const result = await reqSimiSong(info.sId);
      if (result.code === 200 && result) {
        info["simiSong"] = result.songs.map(item => {
          return {
            id: String(item.id),
            name: item.name,
            mvId: item.mvid,
            singer: item.artists,
            album: item.album,
            alia: item.alias,
            duration: proxy.$utils.formatSongTime(item.duration),
            url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
            // vip: item.fee === 1,
            license: item.license,
            publishTime: item.publishTime,
          };
        });
      }
    };
    // 相似音乐icon
    const playSimiIcon = computed(() => {
      return function (item) {
        return curSongInfo.value && String(item.id) === curSongInfo.value.id && isPlayed.value ? "icon-zanting1" : "icon-bofang2";
      };
    });

    // 包含这首歌的歌单
    const getSimiPlayList = async () => {
      const result = await reqSimiPlayList(info.sId);
      info["playlists"] = result.playlists;
    };

    const jumpComment = () => {
      cBox.value.scrollIntoView(true);
    };

    onBeforeRouteUpdate(to => {
      info["sId"] = to.query.id;
      init();
    });

    onMounted(() => {
      info["sId"] = route.query.id;
      init();
      console.log(info.currentTime);
    });

    const init = () => {
      if (info["sId"]) {
        getSongDetail();
        getSimiSong();
        getSimiPlayList();
      }
    };

    return {
      ...toRefs(info),
      getSimiPlayList,
      addSongList,
      playSimiIcon,
      playFontIcon,
      jumpComment,
      isCurSong,
      isLogin,
      playing,
      cBox,
    };
  },
  components: {
    Lyric,
    Comment,
  },
};
</script>

<style lang="less" scoped>
.song-container {
  display: flex;
  padding-top: 30px;
  width: 80%;
  margin-left: 15%;
  text-align: left;
  // 歌曲详情
  .song-main {
    flex: 1;
    .song-header {
      display: flex;
      .song-l {
        flex: 1;
      }
    }
  }
  // 碟子
  .aside-box {
    margin-left: 20px;
  }
}

.cover {
  position: relative;
  display: inline-block;
  padding: 20px 40px;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  border-radius: 6px;

  em {
    position: absolute;
    display: inline-block;
    padding: 10px;
    border-radius: 100%;
    border: 1px solid #fff;
    background: #fafafa;
    box-shadow: 0 2px 7px rgb(0 0 0 / 10%) inset;

    &::before {
      position: absolute;
      top: 6px;
      left: 6px;
      display: inline-block;
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background: #ddd;
      box-shadow: 0 2px 7px rgb(0 0 0 / 10%);
    }
  }

  .lt,
  .lb {
    left: 10px;
  }

  .rt,
  .rb {
    right: 10px;
  }

  .lt,
  .rt {
    top: 10px;
  }

  .lb,
  .rb {
    bottom: 10px;
  }
}

.cover-img {
  position: relative;
  padding: 40px;
  font-size: 0;
  background: url("../../../assets/images/disc.png") no-repeat;
  background-size: contain;
  cursor: pointer;

  .cover-stylus {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
    display: inline-block;
    width: 30px;
    height: 120px;
    transition: all 0.3s;
    transform-origin: 23px 5px;
    transform: rotateZ(-25deg);
  }

  .el-image {
    width: 190px;
    height: 190px;
    border-radius: 100%;
    animation: soundPaying 15s linear infinite;
    animation-play-state: paused;
  }

  &.active {
    .cover-stylus {
      transform: rotateZ(0);
    }

    .el-image {
      animation-play-state: running;
    }
  }

  .iconfont {
    position: absolute;
    z-index: 3;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
  }
}

@keyframes soundPaying {
  from {
    -webkit-transform: rotate(10deg);
    transform: rotate(10deg);
  }

  to {
    -webkit-transform: rotate(370deg);
    transform: rotate(370deg);
  }
}

.song-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  height: 270px;
  margin: 0 20px 20px 0;
  background-color: #fff;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  border-radius: 6px;
  p {
    font-size: 13px;
    width: 300px;
  }
}
.song-lyric {
  width: 450px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  border-radius: 6px;
  text-align: center;

  h5 {
    font-size: 14px;
    padding: 15px 0;
  }
}
.cover-desc {
  h5 {
    font-size: 14px;
    font-weight: normal;
    color: #444;
  }

  p {
    width: 100%;
    font-size: 12px;
    color: #666;
    line-height: 21px;
    word-break: break-all;
  }
}

.song-name {
  font-size: 30px;
  line-height: 50px;
  padding-bottom: 20px;

  .iconfont {
    margin-right: 10px;
    font-size: 24px;
    color: #0095d9;
  }
}

.song-author {
  display: inline-block;
  font-size: 13px;
  color: #0095d9;
  line-height: 18px;
  &:hover {
    text-decoration: underline;
  }
  span {
    color: #333;
    font-size: 14px;
  }
}

.song-related {
  padding: 10px 0 20px;
  font-size: 0;
  color: #666;

  span {
    display: inline-block;
    padding-right: 30px;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    // padding-bottom: 5px;
  }

  a,
  em {
    color: #777;
    font-style: normal;
  }
}

.song-oper {
  .play-btn {
    display: inline-block;
    line-height: 16px;
    align-items: center;
    border-radius: 50px;
    padding: 7px 15px;
    cursor: pointer;
    margin: 5px 15px 5px 0;
    background: #f0f0f0;
    color: #666;
  }

  .play-all {
    color: #fff;
    background: #0fb4fb;
    i {
      color: #fff;
    }
  }

  .disable {
    background: #ccc;
    cursor: not-allowed;
  }
}

.simi-song {
  padding: 20px;
  height: 350px;
  margin: 0 20px 0 0;
  background-color: #fff;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  border-radius: 6px;

  .simi-name {
    line-height: 20px;
    font-size: 12px;
    color: #000;
    // padding-bottom: 10px;
  }

  .simi-author {
    font-size: 0;

    a {
      font-size: 12px;
      color: #999;
    }
  }

  .simi-item {
    display: flex;
    border-bottom: 1px solid #f2f2f2;

    &:last-child {
      border: 0;
    }
  }

  .simi-info {
    flex: 1;
    padding-top: 5px;
    height: calc((310px - 24px) / 5);
  }

  .simi-song-status {
    line-height: 48px;

    i {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}

.aside-title {
  position: relative;
  font-size: 16px;
  line-height: 24px;

  &::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 18px;
    margin: 3px 5px 0 0;
    border-radius: 2px;
    background: #0fb4fb;
    vertical-align: top;
  }
}

.sidebar-box {
  padding: 20px;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
}

.aside-main {
  .el-image {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    overflow: hidden;
  }

  .playlist-item {
    display: flex;
    padding-top: 22px;
  }

  .playlist-info {
    flex: 1;
    padding-left: 10px;
  }

  .playlist-name {
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-all;
    cursor: pointer;
  }

  .playlist-author {
    height: 20px;
    line-height: 20px;
    margin-top: 20px;
    font-size: 12px;
    color: #999;

    a {
      color: #666;
    }
  }
}
</style>
