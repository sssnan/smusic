<template>
  <div class="wrapper infinite-list">
    <div class="mv-list">
      <div class="item" :key="'' + item.id + index" v-for="(item, index) in mvList">
        <router-link :to="{ path: '/mvlist/mv', query: { id: item.id | item.vid } }" class="faceImg">
          <el-image :src="item.coverUrl || item.cover" lazy> </el-image>
        </router-link>
        <div class="info">
          <router-link :to="{ path: '/mvlist/mv', query: { id: item.id || item.vid } }" class="mv-name" :title="item.name || item.title">{{ item.name || item.title }}</router-link>

          <router-link :to="{ path: '/artist/detail', query: { id: item.artistId } }" class="mv-author" v-if="type == 1014">{{ item.artistName }}</router-link>

          <router-link :to="{ path: '/artist/detail', query: { id: item.creator[0].userId } }" class="mv-author" v-else>{{ item.creator[0].userName }}</router-link>
          <div class="mv-playCount"><i class="iconfont icon-mv"></i> {{ $utils.formartNum(item.playCount || item.playTime) }}</div>
          <div class="mv-time" v-if="item.publishTime">发布时间：{{ item.publishTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  // 视频数据列表
  mvList: { type: Array, required: true },
  // 类型，是搜索页面的视频还是MV下的视频
  type: { type: Number },
});
const mvList = computed(() => props.mvList);
const type = computed(() => props.type);
</script>
<style lang="less" scoped>
.wrapper {
  padding-top: 5px;
  .mv-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: left;
    background: #fff;
    border-radius: 15px;

    .item {
      flex: 30%;
      max-width: calc(100% / 6 - 20px);
      margin: 20px 10px 0;
      border-radius: 4px;

      &:hover {
        .el-image {
          transform: scale(1.1);
        }

        .icon-video-play {
          opacity: 1;
          transform: scale(1);
        }
      }
    }

    .faceImg {
      display: block;
      position: relative;
      width: 100%;
      height: 123px;
      overflow: hidden;
    }

    .el-image {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      z-index: 2;
      transition: all 0.4s linear;

      :deep(img) {
        width: auto;
      }
    }

    .info {
      position: relative;
      padding: 15px 0;

      .mv-name {
        display: block;
        font-size: 14px;
        text-overflow: ellipsis;
        height: 20px;
        overflow: hidden;
        white-space: nowrap;
      }

      .mv-author,
      .mv-playCount,
      .mv-time {
        display: block;
        line-height: 24px;
        font-size: 14px;
        color: #999;
      }
    }
  }
}
</style>
