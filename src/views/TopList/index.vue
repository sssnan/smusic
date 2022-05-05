<template>
  <div class="toplist">
    <div class="toplist-container">
      <div class="toplist-main">
        <!-- 歌单信息 -->
        <div class="cover">
          <div class="cover-img">
            <el-image :src="songList.coverImgUrl"> </el-image>
          </div>
          <div class="cover-info">
            <div class="cover-header">
              <div class="cover-title">
                {{ songList.name }} <span>({{ $utils.formartDate(songList.updateTime, "MM月dd日") }} 更新)</span>
              </div>
            </div>
            <div class="cover-author-tags">
              <div class="cover-author" v-if="songList.creator">
                <el-image :src="songList.creator.avatarUrl" class="cover-avatar"> </el-image>
                <div class="cover-name">{{ songList.creator.nickname }}</div>
                <div class="cover-date">{{ $utils.formartDate(songList.createTime, "yyyy-MM-dd") }}</div>
              </div>
            </div>
            <div class="cover-digital">
              <span class="cover-playCount"><i class="iconfont icon-playnum"></i> {{ $utils.formartNum(songList.playCount) }}次</span>
              <span class="cover-collect"><i class="iconfont icon-shoucangcishu-hui"></i> {{ $utils.formartNum(songList.subscribedCount) }}</span>
              <span class="cover-comment"><i class="iconfont icon-pinglun"></i> {{ $utils.formartNum(songList.commentCount) }}</span>
            </div>
            <div class="cover-desc">
              <h5>歌单简介</h5>
              <p v-html="songList.description"></p>
            </div>
          </div>
        </div>
        <!-- 歌曲列表 -->
        <div class="song-main">
          <div class="song-header">
            <h4>
              歌曲列表 <em>{{ total + "首歌" }}</em>
            </h4>
            <span :class="['collect', songList.subscribed ? 'active' : '']" @click="subPlayList(songList)"
              ><i :class="['iconfont', 'icon-shoucang1' + (songList.subscribed ? '-active' : '')]"></i> {{ songList.subscribed ? "已收藏" : "收藏" }}</span
            >
            <span class="play-all" @click="playAllsongList"><i class="iconfont icon-bofangquanbu"></i>播放全部</span>
            <SongList :songList="songList.tracks" :total="total"></SongList>
          </div>
        </div>
      </div>
      <!-- 侧边栏排行榜列表 -->
      <div class="toplist-aside">
        <div class="aside-menu">
          <span :class="type === 'Featrue' ? 'active' : ''" @click="selectType('Featrue')"><em>云音乐特色榜</em></span>
          <span :class="type === 'Global' ? 'active' : ''" @click="selectType('Global')"><em>全球媒体榜</em></span>
        </div>
        <div class="type-main">
          <div class="type-item" :class="rId == item.id ? 'active' : ''" v-for="(item, index) in toplist" :key="index" @click="selectItem(item.id)">
            <div class="item-info">
              <div class="item-title">
                {{ item.name }}
              </div>
              <div class="item-time">
                {{ item.updateFrequency }}
              </div>
            </div>
            <el-image class="item-img" :src="item.coverImgUrl" lazy> </el-image>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import SongList from "@/views/SongList";
import { reqTopList, reqListDetail } from "@/api";

export default {
  name: "TopList",
  components: { SongList },
  setup() {
    const route = useRoute();
    const router = useRouter();
    let data = reactive({
      // 对应的歌曲列表
      songList: [],
      total: 0,
      toplist: [],
      songList: {},
      type: "Featrue",
      rId: route.query.rId || 19723756,
    });

    // 获取排行榜列表
    const getTopList = async type => {
      const result = await reqTopList();
      data.type = type;
      if (result.code === 200) {
        if (type == "Global") {
          data.toplist = result.list.slice(4, result.list.length);
        } else {
          data.toplist = result.list.slice(0, 4);
        }
      }
    };
    const subPlayList = () => {};
    // 获取排行榜歌曲列表
    const getSongList = async id => {
      const res = await reqListDetail(id);
      data.songList = res.playlist;
      data.total = data.songList.tracks.length;
    };
    // 选择榜单类型
    const selectType = type => {
      data.type = type;
      getTopList(type);
    };

    // 查看榜单详情
    const selectItem = id => {
      data.rId = id;
      router.push({ path: "/toplist", query: { rId: data.rId } });
      getSongList(data.rId);
    };

    onMounted(() => {
      getTopList(data.type);
      getSongList(data.rId);
    });

    return {
      getTopList,
      getSongList,
      selectType,
      selectItem,
      subPlayList,
      ...toRefs(data),
    };
  },
};
</script>

<style lang="less" scoped>
.toplist {
  width: 70%;
  margin: 0 auto;
  padding-bottom: 40px;
  .toplist-container {
    display: flex;
    padding-top: 40px;
    .toplist-main {
      flex: 1;
      width: 851px;
      padding-bottom: 45px;

      .cover {
        display: flex;
        text-align: left;

        .cover-img {
          display: flex;
          align-items: center;
          width: 250px;
          height: 250px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 27px rgba(0, 0, 0, 0.05);
          flex-shrink: 0;

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
        .cover-info {
          width: 581px;
          padding: 20px;
          margin-left: 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 20px 27px rgba(0, 0, 0, 0.05);

          .cover-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .cover-title {
              flex: 1;
              font-size: 24px;
              font-weight: bold;
              height: 34px;
              line-height: 34px;

              span {
                display: inline-block;
                padding-left: 10px;
                font-weight: normal;
                line-height: 22px;
                font-size: 14px;
                color: #666;
              }
            }
          }
          .cover-author-tags {
            .cover-author {
              padding: 15px 0 10px;
              .cover-avatar {
                display: inline-block;
                width: 32px;
                height: 32px;
                border-radius: 100%;
                vertical-align: top;
              }

              .cover-name,
              .cover-date {
                display: inline-block;
                padding: 0 10px;
                line-height: 32px;
                color: #666;
              }

              .cover-date {
                color: #555;
              }
            }
          }
          .cover-digital {
            .cover-playCount,
            .cover-collect,
            .cover-comment {
              display: inline-block;
              padding: 0 20px 5px 0;
              line-height: 16px;
              font-size: 14px;
              color: #666;
              i {
                vertical-align: top;
              }
            }
          }
          .cover-desc {
            position: relative;

            h5 {
              padding: 25px 0 5px;
              line-height: 20px;
              font-size: 14px;
              color: #666;
              font-weight: 600;
            }

            p {
              line-height: 22px;
              font-size: 14px;
              color: #666;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
            }
          }
        }
      }
      .song-main {
        position: relative;
        padding: 0 20px;
        margin-top: 25px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 20px 27px rgba(0, 0, 0, 0.05);
        min-height: 40px;
        .song-header {
          padding: 0 30px 30px 10px;
          h4 {
            font-size: 20px;
            line-height: 40px;
            text-align: left;
            float: left;

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
          }

          .collect,
          .play-all {
            line-height: 16px;
            border-radius: 50px;
            padding: 7px 20px;
            cursor: pointer;
            margin: 5px 0 5px 15px;
            transition: all 0.4s;
            background: #f0f0f0;
            color: #666;
            z-index: 10;

            i {
              margin-right: 3px;
            }
          }

          .play-all {
            color: #fff;
            background: #44c1ff;
            float: right;
            i {
              color: #fff;
            }
          }
          .collect,
          .shoucang.active,
          .shoucang.active i {
            color: #333;
            float: right;
          }
        }
      }
    }

    .toplist-aside {
      width: 450px;
      padding-bottom: 25px;
      flex-shrink: 0;
      padding-left: 20px;
      .aside-menu {
        display: flex;
        margin: 0 -10px 20px;
        width: 400px;

        span {
          flex: 1;
          display: inline-block;
          padding: 20px;
          margin: 0 10px;
          background: #fff;
          border-radius: 12px;
          cursor: pointer;
          color: #555;

          &.active {
            position: relative;
            color: rgb(86, 81, 81);
            font-weight: 800;
            opacity: 1;
            background: -moz-linear-gradient(-45deg, #ffffff 20%, #74f9ff 100%); /* FF3.6-15 */
            background: -webkit-linear-gradient(-45deg, #ffffff 20%, #74f9ff 100%); /* Chrome10-25,Safari5.1-6 */
            background: linear-gradient(-45deg, #ffffff 20%, #74f9ff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
            transition: color 0.2s ease-in;
          }

          em {
            line-height: 14px;
          }
        }
      }

      .type-main {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 0 -10px;
        width: 400px;
        .type-item {
          display: flex;
          justify-content: space-between;
          width: calc(50% - 40px);
          padding: 10px 20px;
          margin: 0 10px 20px;
          background: #fff;
          border-radius: 12px;
          opacity: 0.8;
          cursor: pointer;
          box-shadow: 0 20px 27px rgb(0 0 0 / 5%);

          .item-info {
            flex: 1;
            width: calc(100% - 50px);
          }

          .item-img {
            flex-shrink: 0;
            width: 40px;
            height: 40px;
            margin-left: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.12);
          }

          .item-title {
            width: 100%;
            font-weight: bold;
            line-height: 30px;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: top;
          }

          .item-time {
            font-size: 12px;
            line-height: 12px;
            color: #666;
          }

          &.active {
            opacity: 1;
            background: -moz-linear-gradient(-45deg, #ffffff 20%, #74f9ff 100%); /* FF3.6-15 */
            background: -webkit-linear-gradient(-45deg, #ffffff 20%, #74f9ff 100%); /* Chrome10-25,Safari5.1-6 */
            background: linear-gradient(135deg, #ffffff 20%, #74f9ff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
          }
        }
      }
    }
  }
}
</style>
