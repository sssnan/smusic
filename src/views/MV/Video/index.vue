<template>
  <div v-if="sources.src" class="mv-detail">
    <div class="mv-main">
      <div class="mv-info-hd">
        <div class="info-name"><i class="iconfont icon-mv2"></i>{{ mvDetail.name }}</div>
        <router-link :to="{ path: '/artise/detail', query: { id: author.id } }" class="song-author" v-for="(author, k) in mvDetail.artists" :key="author.name">{{
          k !== 0 ? " / " + author.name : author.name
        }}</router-link>
      </div>
      <div class="video-main">
        <video 
          id="videobox" 
          class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" 
          preload="auto" 
          width="100%" 
          ref="videoRef" 
          autoplay="false" 
          :poster="sources.poster"
        >
          <source :src="sources.src" />
        </video>
        <span class="icon">
          <i class="iconfont icon-dianzan">({{ detailInfo.likedCount }})</i>
          <i class="iconfont icon-tianjiashoucang-">({{ mvDetail.subCount }})</i>
          <i class="iconfont icon-fenxiang1">({{ detailInfo.shareCount }})</i>
        </span>
      </div>
      <div class="mv-comment">
        <Comment :type="type" :sId="mId"></Comment>
      </div>
    </div>
    <!-- 侧边栏 -->
    <div class="aside-box">
      <div class="mv-info">
        <h3 class="aside-title">MV简介</h3>
        <div class="mv-info-count">
          <div class="info-time">发布时间：{{ mvDetail.publishTime }}</div>
          <div class="info-count">播放量：{{ $utils.formartNum(mvDetail.playCount) }}</div>
        </div>
        <div class="mv-desc">
          {{ mvDetail.desc ? mvDetail.desc : "暂无简介" }}
        </div>
      </div>
      <div class="simi-mv">
        <h3 class="aside-title">相似MV</h3>
        <div class="aside-main mv-main">
          <div class="videoItem" :key="'' + item.id + index" v-for="(item, index) in simiMv">
            <router-link :to="{ path: '/mvlist/mv', query: { id: item.id } }" class="faceImg">
              <i class="iconfont icon-bofang1"></i>
              <el-image :src="item.cover || item.imgurl" lazy> </el-image>
            </router-link>
            <div class="info">
              <router-link :to="{ path: '/mvlist/mv', query: { id: item.id } }" class="mv-name">{{ item.name }}</router-link>
              <router-link :to="{ path: '/artise/detail', query: { id: item.artistId } }" class="mv-author" v-if="!item.publishTime">{{ item.artistName }}</router-link>
              <div class="mv-playCount"><i class="iconfont icon-mv1"></i> {{ $utils.formartNum(item.playCount) }}</div>
              <div class="mv-time" v-if="item.publishTime">发布时间：{{ item.publishTime }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Comment from "@/components/Comment";
import { reqMvUrl, reqMvDetail, reqSimiMv, reqMvDetailInfo } from "@/api";
import { onMounted, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import videojs from "video.js";
import "video.js/dist/video-js.min.css";

export default {
  name: "MvDetail",
  components: {
    Comment,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const info = reactive({
      videoRef: null,
      mId: "0",
      player: null,
      mvDetail: {},
      type: 1, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
      sources: {
        src: "", //视频源
        poster: "",
      },
      detailInfo: {},
      simiMv: [],
    });
    
    const videoInit = () => {
      info.player = videojs(
        info.videoRef,
        {
          // 视频源
          sources: [{ src: info.sources.src, type: "video/mp4" }],
          //是否显示播放按钮
          bigPlayButton: true,
          playbackRates: [0.5, 1, 1.5, 2],
          controls: true,
          //设置小喇叭音量键
          controlBar: {
            fullscreenToggle: true,
            // 音量条的横向还是纵向显示
            volumePanel: {
              inline: false,
            },
          },
        },
        () => {
          info.player.on("play", () => {
            // console.log("开始播放");
          });
          //设置默认倍速
          info.player.playbackRate(1);
        }
      );
    };
    // 获取mv详情
    const getMvDetail = async () => {
      const result = await reqMvDetail(info.mId);
      if (result.code === 200) {
        info.mvDetail = result.data;
        info.sources.poster = result.data.cover;
      }
    };
    // 获取mv评论点赞转发数据
    const getMvDetailInfo = async () => {
      const result = await reqMvDetailInfo(info.mId);
      if (result.code === 200) {
        info.detailInfo = result;
      }
    };
    // 获取mv播放地址
    const getMvUrl = async r => {
      const result = await reqMvUrl({ id: info.mId, r });
      if (result.code === 200) {
        info.sources.src = result.data.url;
      }
    };
    // 获取相似mv
    const getSimiMv = async () => {
      const result = await reqSimiMv(info.mId);

      if (result.code === 200) {
        info.simiMv = result.mvs;
      }
    };

    const init = () => {
      getMvDetail();
      getMvUrl();
      getSimiMv();
      getMvDetailInfo();
      setTimeout(() => {
        videoInit();
      }, 200);
    };

    onBeforeRouteUpdate(to => {
      info["mId"] = to.query.id;
      init();
    });

    onMounted(() => {
      info["mId"] = route.query.id;
      init();
      store.commit("SET_PLAYSTATUS", false);
    });

    return {
      ...toRefs(info),
    };
  },
};
</script>

<style scoped lang="less">
.mv-detail {
  display: flex;
  padding-top: 40px;
  width: 80%;
  margin: 0 auto;
  text-align: left;
  .mv-main {
    flex: 1;

    .mv-info-hd {
      display: flex;
      padding-bottom: 10px;

      .info-name {
        padding-right: 20px;
        font-size: 24px;
        line-height: 24px;

        .icon-mv2 {
          margin-right: 5px;
          color: #00bfff;
          font-size: 30px;
        }
      }

      .song-author {
        line-height: 34px;
        color: #666;
      }
    }

    .video-main {
      position: relative;
      height: 500px;
      font-size: 0;
      .icon {
        display: inline-block;
        margin-top: 10px;
        cursor: pointer;
        .iconfont {
          padding: 5px;
          margin: 5px;
          background: #eaeef1;
          border: 1px solid #bbbbbb;
          box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
          color: #666;

          &:hover {
            background: #f0f0f4;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }

  .aside-box {
    width: 400px;
    padding-top: 44px;
    padding-left: 20px;
    .mv-info {
      width: 400px;
      padding: 20px;
      margin-bottom: 20px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 20px 27px rgb(0 0 0 / 5%);

      .mv-info-count {
        padding: 10px 0;
        font-size: 12px;
        color: #777;
      }
      .mv-desc {
        font-size: 13px;
        word-spacing: 1px;
      }
    }

    .simi-mv {
      width: 400px;
      flex: 1;
      background: #fff;

      .aside-title {
        padding: 20px;
      }

      .videoItem {
        padding: 20px;
        margin-bottom: 10px;
        border-top: 1px solid #ccc;

        &:hover {
          .el-image {
            transform: scale(1.1);
          }

          .icon-bofang1 {
            opacity: 1;
          }
        }
      }

      .faceImg {
        display: block;
        position: relative;
        border-radius: 6px;
        overflow: hidden;
      }

      .icon-bofang1 {
        position: absolute;
        top: calc(50% - 30px);
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 3;
        margin-top: -30px;
        font-size: 60px;
        text-align: center;
        color: #fff;
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.4s linear;
        text-shadow: 2px 2px 10px #000;
      }

      .el-image {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        z-index: 2;
        transition: all 0.4s linear;

        :deep(img) {
          height: auto;
        }
      }

      .info {
        position: relative;
        padding: 15px 0 0;

        .mv-name {
          display: block;
          font-size: 14px;
        }

        .mv-author,
        .mv-playCount,
        .mv-time {
          display: block;
          line-height: 24px;
          font-size: 14px;
          color: #999;
        }

        .icon-video {
          font-size: 24px;
          color: #999;
          vertical-align: top;
        }
      }
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
    background: #74f9ff;
    vertical-align: top;
  }
}
</style>
