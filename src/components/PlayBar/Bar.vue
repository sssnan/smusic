<template>
  <div :class="['play-bar', lockName]" @mouseenter="enterBar($event)" @mouseleave="leaveBar($event)" v-if="curSongInfo">
    <!-- 固定播放条按钮 -->
    <div class="fold">
      <div class="fold-btn" @click="lockBar">
        <i class="iconfont icon-lock" :class="[locked ? 'active' : '']"></i>
      </div>
    </div>

    <!-- 播放进度条 -->
    <ProgressLine class="audioProgress" :progressWidth="audioProgressWidth" @setProgressLine="setAudioProgress"></ProgressLine>
    <div class="playBar">
      <div class="play-bar-inside">
        <div class="bar-l">
          <router-link :to="{ path: '/songlist/detail', query: { id: curSongInfo.id } }">
            <el-image class="bar-cover-img" v-if="curSongInfo.al.picUrl" :src="curSongInfo.al.picUrl"></el-image>
            <el-image src="../../assets/images/music.png" class="bar-cover-img" v-else/>
          </router-link>
          <!-- 播放歌曲详情 -->
          <div class="bar-name">
            <router-link class="song_name" :to="{ path: '/songlist/detail', query: { id: curSongInfo.id } }">{{ curSongInfo.name }} - </router-link>
            <router-link :to="{ path: '/artist/detail', query: { id: ar.id } }" class="song_author" v-for="ar in curSongInfo.ar" :key="ar.id">{{ ar.name }} / </router-link>
          </div>
          <!-- 播放时长 -->
          <div class="bar-time">
            <span v-if="curSongInfo.dt">{{ $utils.formatSongTime(currentTime * 1000) }}/{{ totalTime }}</span>
            <span v-else>00:00 / 00:00</span>
          </div>
        </div>
        <!-- 控制区域 -->
        <div class="bar-m">
          <div class="bar-control">
            <i class="iconfont icon-prev" title="上一首" @click.stop="audioHandler('prev')"></i>
            <i :class="['iconfont', playIcon]" title="播放/暂停" @click.stop="audioHandler('play')"></i>
            <i class="iconfont icon-next" title="下一首" @click.stop="audioHandler('next')"></i>
          </div>
        </div>
        <div class="bar-r">
          <div class="bar-oper">
            <!-- 音量控制 -->
            <div class="volume-main">
              <i :class="['iconfont', mutedIcon]" title="音量" @click.stop="volumeHandler"></i>
              <ProgressLine class="volumeLine" :progressWidth="volumeProgressWidth" @setProgressLine="setvolumeProgress"></ProgressLine>
            </div>
            <!-- 播放模式 -->
            <i :class="['iconfont', modeIcon.className]" :title="modeIcon.title" @click.stop="changePlayMode"></i>
            <div class="popver">
              <!-- 歌词气泡框 -->
              <el-popover placement="top" :width="400" trigger="click" @hide="popverClose">
                <template #reference>
                  <div class="lyric">
                    <span class="lyric-btn" title="歌词" @click="popverHandle">词</span>
                  </div>
                </template>
                <div class="lyrics-container">
                  <h3 class="lyrics-header">
                    <span
                      >{{ curSongInfo.name }} - <i v-for="ar in curSongInfo.ar" :key="ar.id">{{ ar.name }}</i></span
                    >
                  </h3>
                  <Lyric :sId="curSongInfo.id" :currentTime="currentTime"></Lyric>
                </div>
              </el-popover>
              <!-- 播放列表 -->
              <el-popover placement="top" :width="0" trigger="click" @hide="popverClose">
                <template #reference>
                  <div class="playlist">
                    <span class="tips" v-if="isShowPlayListTips">已添加到播放列表</span>
                    <i class="iconfont icon-bofangliebiao1" title="播放列表" @click="popverHandle"></i>
                    <div class="playlist-num">{{ 99 > playList.length ? playList.length : "99+" }}</div>
                  </div>
                </template>
                <div class="playlist-container">
                  <h3 class="playlist-header">
                    <span
                      >播放列表<em>共{{ playList.length }}首</em></span
                    >
                    <div class="delSonglist" @click="clearSonglist"><i class="iconfont icon-btn_delete" title="清空列表"></i></div>
                  </h3>
                  <!-- 歌曲列表 -->
                  <div :class="['songs', { curSong: curSongInfo.id == song.id }]" v-for="(song, index) in playList" :key="song" @click.stop="audioHandler('play')">
                    <span class="topNum" v-if="curSongInfo.id != song.id">{{ index + 1 }}</span>
                    <span class="iconfont icon-bofang topNum" v-else></span>
                    <span class="songMid">
                      <span class="song_name">{{ song.name }}</span>
                    </span>
                    <span class="songRight">
                      <span class="song_author" v-for="ar in song.ar" :key="ar.id">{{ ar.name }} / </span>
                      <span class="song_time">{{ $utils.formatSongTime(song.dt) }}</span>
                    </span>
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressLine from "@/components/ProgressLine";
import Lyric from "@/views/Lyric";
import SongList from "@/views/SongList";
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, reactive, toRefs } from "vue";
import { useStore } from "vuex";

export default {
  name: "Bar",
  setup(props, { emit }) {
    const store = useStore();

    const { proxy } = getCurrentInstance();
    const info = reactive({
      // 歌词弹窗时，固定播放条
      isLock: false,
      locked: false,
      lockName: "active",
      // manual: true,

      currentTime: inject("currentTime"), // 音频当前时长
      isMuted: false, // 是否禁音
      playMode: 0, // 播放模式  0循环播放、1单曲循环、2随机播放
      volumeNum: 1, // 音量值(0~1)
      oldVolume: 0, // 取消禁音的时候，设置保留的上一次的音量值
      timer: null,
      tipsTimer: null,
    });

    onMounted(() => {
      leaveBar();
      store.commit("SET_PLAYLIST", playList.value);
    });

    onBeforeUnmount(() => {
      clearTimeout(info.timer);
      clearTimeout(info.tipsTimer);
    });

    // 获取播放列表
    const playIndex = computed(() => store.getters.playIndex);
    const playList = computed(() => store.getters.playList);
    const isPlayed = computed(() => store.getters.isPlayed);

    // 添加歌曲到播放列表后，弹窗tips提示
    const isShowPlayListTips = computed(() => {
      let val = store.getters.isShowPlayListTips;

      if (val) {
        clearTimeout(info.tipsTimer);
        info.tipsTimer = setTimeout(() => {
          store.commit("SET_PLAYLISTTIPS", false);
        }, 3000);
      }

      return val;
    });

    // 获取当前播放歌曲信息
    const curSongInfo = computed(() => playList.value[playIndex.value]);
    // 获取音频总时长
    const totalTime = computed(() => proxy.$utils.formatSongTime(curSongInfo.value.dt));
    // 播放模式
    const modeIcon = computed(() => {
      const params = [
        {
          className: "icon-liebiao",
          title: "循环模式",
        },
        {
          className: "icon-danqu",
          title: "单曲循环",
        },
        {
          className: "icon-suiji",
          title: "随机播放",
        },
      ];
      return params[info.playMode];
    });

    // 切换播放模式
    const changePlayMode = () => {
      info["playMode"] = info["playMode"] >= 2 ? 0 : info["playMode"] + 1;

      emit("playAudioMode", info["playMode"]);
    };

    // 音频播放进度条
    const audioProgressWidth = computed(() => {
      if (curSongInfo.value) {
        // 音频进度条长度
        return (info["currentTime"] / curSongInfo.value.dt) * 1000 * 100 + "%";
      }
    });
    // 设置音频音量进度条
    const volumeProgressWidth = computed(() => {
      return (info["volumeNum"] / 1) * 100 + "%";
    });

    // 音量禁音及取消操作
    const volumeHandler = () => {
      info["isMuted"] = info["isMuted"] ? 0 : 1;
      info["isMuted"] && (info["oldVolume"] = info["volumeNum"]);
      info["volumeNum"] = info["isMuted"] ? 0 : info["oldVolume"];

      emit("setVolumeHandler", info["isMuted"]);
    };

    // 点击拖拽音量条，设置当前音量
    const setvolumeProgress = params => {
      info["volumeNum"] = params.val;
      info["oldVolume"] = params.val;
      info["isMuted"] = params.val ? 0 : 1;

      emit("setvolumeProgress", params.val);
    };

    // 播放暂停按钮
    const playIcon = computed(() => {
      return !isPlayed.value ? "icon-bofang2" : "icon-zanting1";
    });

    // 是否静音
    const mutedIcon = computed(() => {
      return info["isMuted"] ? "icon-volume" : "icon-volume-active";
    });

    // 音频播放/暂停/上一首/下一首事件
    const audioHandler = type => {
      emit("audioHandler", type);
    };

    // 点击拖拽进度条，设置当前时间
    const setAudioProgress = params => {
      info["initAudioReady"] = false;
      info["currentTime"] = (params.val * curSongInfo.value.dt) / 1000;

      // 拖拽的时候，不实时更改音频的时间
      if (params.flag) {
        emit("setAudioProgress", info["currentTime"]);
      }
    };

    const popverHandle = () => {
      info["isLock"] = true;
    };

    const popverClose = () => {
      info["isLock"] = false;
      leaveBar();
    };

    const enterBar = () => {
      clearTimeout(info.timer);
      info.lockName = "active";
    };

    const leaveBar = e => {
      // 点击锁住按钮，会触发mouseleave 事件 此时的e的值是 undefined  而正常通过鼠标移出的时候 e是个对象
      // if (!e) return
      if (!info["isLock"] && !info["locked"]) {
        clearTimeout(info.timer);
        info.timer = setTimeout(() => {
          info.lockName = info.isLock ? "active" : "";
        }, 3000);
      }
    };

    const lockBar = () => {
      info.locked = !info.locked;
      info.isLock = info.locked;
      leaveBar();
    };

    // 清空播放列表
    const clearSonglist = () => {
      store.commit("SET_PLAYSTATUS", false);
      store.commit("SET_PLAYLIST", []);
      store.commit("SET_PLAYINDEX", 0);
    };

    return {
      leaveBar,
      enterBar,
      lockBar,
      ...toRefs(info),
      playList,
      isShowPlayListTips,
      curSongInfo,
      modeIcon,
      playIcon,
      mutedIcon,
      totalTime,
      audioProgressWidth,
      volumeProgressWidth,
      audioHandler,
      volumeHandler,
      changePlayMode,
      popverClose,
      popverHandle,
      clearSonglist,
      setAudioProgress,
      setvolumeProgress,
    };
  },

  components: {
    ProgressLine,
    Lyric,
    SongList,
  },
};
</script>

<style scoped lang="less">
.play-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  height: 70px;
  background: #fff;
  box-shadow: 0 5px 40px -1px rgba(2, 10, 18, 0.1);
  transition: all 0.4s ease-out;
  transform: translateY(100%);

  &.active {
    transform: translateY(0);
  }
}
.fold {
  position: absolute;
  top: -30px;
  left: 0;
  z-index: 3;
  width: 100%;
  height: 30px;

  .fold-btn {
    position: absolute;
    right: 200px;
    display: inline-block;
    width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 50px 50px 0px 0px;
    background: #fff;
    box-shadow: 0 5px 40px -1px rgba(2, 10, 18, 0.1);
    cursor: pointer;

    .active {
      color: #48c6fc;
    }
  }
}
.audioProgress {
  position: absolute;
  top: -6px;
  z-index: 9;
}
.playBar {
  max-width: 1300px;
  margin: 0 auto;
}
.play-bar-inside {
  display: flex;
  font-size: 0;
  line-height: 0;
  justify-content: space-between;
  align-items: center;

  .bar-l {
    display: flex;
    width: 450px;
    // flex: 1;
    align-items: center;
    justify-content: center;
  }

  .bar-cover-img {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    // box-shadow: 0 0 15px 5px rgba(48, c6, fc, 0.15);
  }

  .bar-name {
    flex: 1;
    font-size: 0;
    padding: 0 10px 6px 30px;
    overflow: hidden;
    text-align: center;

    .song_name {
      // display: block;
      padding: 10px 0;
      line-height: 12px;
      font-size: 12px;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    p {
      line-height: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .song_author {
      // display: block;
      line-height: 12px;
      font-size: 12px;
      color: #999;
      padding-bottom: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .icon-collect,
  .icon-collect-active {
    font-size: 24px;
    line-height: 24px;
    margin: 0 15px;
    cursor: pointer;
  }

  .bar-time {
    width: 115px;
    line-height: 50px;
    font-size: 14px;
    color: #606266;
    text-align: center;
  }

  .bar-control {
    display: flex;
    padding: 10px 0;
    line-height: 1;
    align-items: center;
    justify-content: center;

    .iconfont {
      margin: 0 20px;
      font-size: 30px;
      cursor: pointer;
      color: #666;
    }

    .icon-bofang2,
    .icon-zanting1 {
      font-size: 40px;
      // font-weight: bold;
      color: #00b3ff;
    }
  }

  .volumeLine {
    width: 150px;
    margin: 0 10px;
  }

  .bar-oper {
    position: relative;
    display: flex;
    font-size: 0;
    line-height: 50px;
    padding-left: 30px;
    align-items: center;
    justify-content: center;

    .iconfont {
      margin-left: 20px;
      font-size: 20px;
      cursor: pointer;
      width: 20px;
    }
  }

  .popver {
    position: relative;
  }

  .lyric {
    display: inline-block;
    padding: 26px 0;
    margin-left: 15px;
    font-size: 18px;
    line-height: 18px;
    vertical-align: top;
    color: #999;
    cursor: pointer;
  }

  .playlist {
    position: relative;
    display: inline-block;
    margin-left: 15px;
    line-height: 70px;
    height: 70px;
    color: #999;
    cursor: pointer;

    .iconfont {
      margin-left: 0;
    }

    .playlist-num {
      position: absolute;
      top: 25%;
      left: 90%;
      font-size: 12px;
      line-height: 12px;
      color: #999;
    }

    .tips {
      position: absolute;
      top: -50px;
      left: -60px;
      background: rgba(0, 0, 0, 0.8);
      display: inline-block;
      width: 120px;
      color: #fff;
      font-size: 12px;
      text-align: center;
      height: 30px;
      line-height: 30px;
      padding: 5px 0;
      border-radius: 4px;

      &::after {
        content: "";
        position: absolute;
        bottom: -6px;
        left: 47%;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 6px 8px 0 8px;
        border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
      }
    }
  }

  .volume-main {
    flex: 1;
    padding: 10px 0;
    display: flex;
    align-items: center;
  }
}

.songs {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #dbdbdb;
  font-size: 12px;
  color: #999;
  padding: 5px 0;
  cursor: pointer;
  .topNum {
    width: 60px;
    // color: #666;
    padding-left: 10px;
  }
  .songMid {
    flex-grow: 7;
  }
}
.curSong {
  color: #0099ff;
  font-size: 14px;
  background: #f7f7f7;
}

.playlist-header {
  display: flex;
  line-height: 40px;
  border-bottom: 2px solid #dbdbdb;
  padding-left: 10px;
  span {
    display: inline-block;
    flex: 1;
  }

  em {
    display: inline-block;
    padding-left: 10px;
    font-size: 12px;
    line-height: 14px;
    font-style: normal;
    font-weight: normal;
    color: #666;
    vertical-align: baseline;
  }

  .delSonglist {
    font-size: 13px;
    font-weight: normal;
    cursor: pointer;
    padding-right: 10px;
  }

  .icon-btn_delete {
    margin-right: 5px;
    font-size: 16px;
    color: #333;
  }
}

.lyrics-container {
  height: 430px;
  background: #fff;

  .lyrics-header {
    display: flex;
    padding: 0 0 24px;
    line-height: 16px;
    font-weight: 500;
    font-size: 16px;

    span {
      display: block;
      flex: 1;
    }
    i{
      font-size: 14px;
      color: #999;
    }
  }
}

.playlist-container {
  position: fixed;
  right: -2px;
  top: -377px;
  font-size: 12px;
  background: #fff;
  width: 600px;
  height: 400px;
  z-index: 11;
  overflow: scroll;
  text-align: left;
  border-radius: 5px;
  box-shadow: 0 2px rgba(0, 0, 0, 0.105);
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }

  &::-webkit-scrollbar-thumb {
    background: #2fc2fc;
    border-radius: 12px;
  }
}
</style>
