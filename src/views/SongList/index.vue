<template>
  <!-- 歌曲列表 -->
  <div class="song">
    <div class="header">
      <li class="w1"></li>
      <li class="w2">歌曲标题</li>
      <li class="w3">时长</li>
      <li class="w4">歌手</li>
      <li class="w5">专辑</li>
    </div>
    <div class="mainer">
      <ul v-for="(song, index) in list" :key="index">
        <li class="m1 over underline">
          <span>{{ pageSize * (currentPage - 1) + index + 1 }}</span>
        </li>
        <li class="m2 over underline" :title="song.name">
          <router-link :to="{ path: '/songlist/detail', query: { id: `${song.id}` } }">
            <span class="underline">{{ song.name }}</span>
            <span v-if="song.alia.length != 0" style="margin-left: 6px; color: #999">-{{ song.alia[0] }}</span>
            <span class="iconfont icon-bofangquanbu" style="font-size: 12px; margin-left: 10px"></span>
          </router-link>
        </li>
        <li class="m3 over underline">
          <span class="time">{{ $utils.formatSongTime(song.dt) }}</span>
          <div class="show">
            <a title="添加到播放列表" class="a1 iconfont icon-tianjia-" @click="addSongList(song.id)"></a>
            <a title="收藏" class="a2 iconfont icon-shoucang1"></a>
            <a title="分享" class="a3 iconfont icon-fenxiang"></a>
            <a title="下载" class="a4 iconfont icon-xiazai"></a>
          </div>
        </li>
        <li class="m4 over underline">
          <router-link :to="{ path: '/artist/detail', query: { id: song.ar[0].id } }" :title="song.ar[0].name">
            <span :title="song.ar[0].name">{{ song.ar[0].name }}</span>
          </router-link>
        </li>
        <li class="m5 over underline" :title="song.al.name">
          <span>{{ song.al.name }}</span>
        </li>
      </ul>
    </div>
  </div>
  <Pagination :pageNo="currentPage" :pageSize="pageSize" :total="total" :continues="5" @getPageNo="getPageNo" v-if="!isScroll"></Pagination>
</template>

<script>
import { computed, reactive, ref, toRefs, nextTick, watch } from "vue";
import { useStore } from "vuex";

export default {
  name: "SongList",
  components: {},
  props: {
    songList: {
      // 歌曲列表
      type: Array,
      required: true,
    },
    typeSize: {
      // 播放列表展示类型， 默认normal是歌单下的展示列表，mini是播放条下的歌曲列表的
      type: String,
      default: "normal",
    },
    height: {
      type: [Number, String],
      default: "auto",
    },
    // 是否分页
    isScroll: {
      type: Boolean,
      default: true,
    },
    pageSize: {
      // 分页 每页展示数量
      type: Number,
      default: 30,
    },
    total: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const curSongRef = ref(null);
    const store = useStore();
    const info = reactive({
      typeSize: props.typeSize,
      pageSize: props.pageSize,
      currentPage: 1,
      playing: false,
      timer: null,
      offset: 0,
    });

    const playList = computed(() => store.getters.playList);
    const isPlayed = computed(() => store.getters.isPlayed);

    // 获取歌曲列表
    const list = computed(() => {
      if (!props.isScroll) {
        return props.songList.slice((info.currentPage - 1) * info.pageSize, info.currentPage * info.pageSize);
      } else {
        return props.songList;
      }
    });

    // 序号及播放状态
    const playIcon = computed(() => {
      return item => {
        return ["iconfont", "playicon", isPlayed.value && item.id === curSongInfo.value.id ? "icon-pause" : "icon-play"];
      };
    });

    // 播放当前播放歌曲
    const currentSong = item => {
      // 若当前唔歌曲 或者 当前播放歌曲不是本歌单显示的歌曲  立即播放当前歌单
      if (!curSongInfo.value || item.id !== curSongInfo.value.id) {
        store.dispatch("selectPlay", { list: [item] });
        // if (this.isShowTips) {
        //     this.setPlayListTips({ flag: true, txt: '已开始播放' })
        //     clearTimeout(this.timer)
        //     this.timer = setTimeout(() => {
        //         this.setPlayListTips({ flag: false, txt: '已开始播放' })
        //     }, 2000)
        // }
      } else {
        store.commit("SET_PLAYSTATUS", !isPlayed.value);
      }
    };

    // 获取当前播放音乐信息
    const curSongInfo = computed(() => {
      return playList.value[store.getters.playIndex];
    });

    // 添加当前歌曲到播放列表
    const addSongList = item => {
      store.dispatch("addList", { list: [item] });
      store.commit("SET_PLAYLISTTIPS", true);
    };

    // 在播放列表删除当前歌曲
    const delList = index => {
      if (playList.value.length > 1) {
        playList.value.splice(index, 1);
        store.commit("SET_PLAYLIST", playList.value);
      } else {
        store.commit("SET_PLAYSTATUS", false);
        store.commit("SET_PLAYLIST", []);
      }
    };

    // 更改页数
    const getPageNo = val => {
      info.currentPage = val;
      // info.offset = (val - 1) * 30;
    };

    // 滚动到当前播放音乐的位置
    const scrollCurSong = cur => {
      if (props.isScroll) {
        const curIndex = props.songList.findIndex(item => {
          return item.id === cur.id;
        });

        if (curIndex > 7 && curIndex < props.songList.length - 8) {
          info.curScroll = -(curIndex - 4) * 50;
        } else if (curIndex >= props.songList.length - 8 && props.songList.length - 8 > 0) {
          info.curScroll = -(props.songList.length - 8) * 50;
        } else {
          info.curScroll = 0;
        }

        const $curSongRef = curSongRef.value;
        $curSongRef.addEventListener(
          "wheel",
          event => {
            if (event.wheelDelta > 0 || event.detail < 0) {
              info.curScroll = Math.abs(info.curScroll) > 0 ? info.curScroll + 50 : 0;
            } else {
              info.curScroll = Math.abs(info.curScroll) < ((props.songList.length - 8) / 2) * 100 ? info.curScroll - 50 : info.curScroll;
            }
          },
          { passive: true }
        );
      }
    };

    watch(
      curSongInfo,
      val => {
        // 添加歌曲的时候，props的歌曲列表没有更新
        nextTick(() => {
          val && scrollCurSong(val);
        });
      },
      { deep: true }
    );

    watch(
      () => props.songList,
      () => (info.currentPage = 1)
    );

    return {
      ...toRefs(info),
      list,
      // curSongRef,
      currentSong,
      playIcon,
      curSongInfo,
      addSongList,
      delList,
      getPageNo,
    };
  },
};
</script>

<style scoped lang="less">
.song {
  width: 100%;
  top: 5px;
  text-align: center;

  .header {
    width: 100%;
    height: 39px;
    display: flex;
    padding: 0;
    li {
      border-right: 1px solid #d9d9d9;
      padding: 8px 10px;
      background-image: linear-gradient(rgb(255, 255, 255), rgb(240, 240, 240));
      box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);
    }
    .w1 {
      width: 10%;
      height: 34px;
    }
    .w2 {
      width: 40%;
    }
    .w3 {
      width: 15%;
    }
    .w4 {
      width: 15%;
    }
    .w5 {
      width: 20%;
    }
  }

  .mainer {
    width: 100%;
    display: block;
    white-space: nowrap;
    ul:nth-of-type(odd) {
      background: #f7f7f7;
    }
    .good {
      height: 70px;
      span,
      a,
      i {
        display: block;
        margin-top: 20px;
      }
    }
    ul {
      height: 30px;
      width: 100%;
      display: flex;
      color: #666;

      &:hover .time {
        display: none;
      }
      &:hover .show {
        display: block;
        text-align: center;
        font-size: 12px;
        margin-left: 10%;
      }

      li {
        padding: 6px 10px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .m1 {
        width: 10%;
        // height: 100%;
        padding: 6px 10px;
        line-height: 18px;

        span {
          float: left;
          width: 25px;
          height: 18px;
          color: #999;
          text-align: center;
        }
        .play {
          float: right;
          display: block;
          width: 17px;
          height: 17px;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .m2 {
        width: 40%;
        a {
          width: 280px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          float: left;
        }
      }

      .m3 {
        width: 15%;
        .time {
          display: block;
        }
        .show {
          width: calc(100% - 10px);
          height: 18px;
          display: none;
          a {
            margin: 2px 0 0 4px;
            width: 18px;
            height: 16px;
            display: block;
            float: left;
            &:hover {
              cursor: pointer;
            }
          }
          .a1 {
            width: 13px;
            margin-left: 0;
          }
          .a3 {
            padding-top: 4px;
            font-size: 10px;
          }
        }
      }

      .m4 {
        width: 15%;
        & a:hover {
          color: #444;
          cursor: pointer;
          text-decoration: underline;
        }
      }
      .m5 {
        width: 20%;
        cursor: pointer;
      }
    }
  }
}
</style>
