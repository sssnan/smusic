<template>
  <div class="mv_list">
    <div class="h_title">
      <h3>最新MV</h3>
      <span v-for="(item, index) in mv_area" :key="index" :class="index == currentIndex ? 'active' : ''" @click="changeArea(index)">{{ item }}</span>
      <router-link class="more" :to="{ path: '/mvlist' }">更多<i class="iconfont icon-gengduo"></i></router-link>
    </div>
    <div class="wrapper">
      <div class="mv">
        <!-- 列表有重复的MV， 相同id的key会报错，加上字符串的index -->
        <div class="item" :key="'' + item.id + index" v-for="(item, index) in newMv.slice(0, 6)">
          <router-link :to="{ path: '/mvlist/mv', query: { id: item.id } }" class="faceImg">
            <el-image :src="item.cover || item.imgurl" lazy> </el-image>
          </router-link>
          <div class="info">
            <router-link :to="{ path: '/mvlist/mv', query: { id: item.id } }" class="mv-name">{{ item.name }}</router-link>
            <router-link :to="{ path: '/artist/detail', query: { id: item.artistId } }" class="mv-author" v-if="!item.publishTime">{{ item.artistName }}</router-link>
            <div class="mv-playCount"><i class="iconfont icon-mv"></i> {{ $utils.formartNum(item.playCount) }}</div>
            <div class="mv-time" v-if="item.publishTime">发布时间：{{ item.publishTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import new_mv from "@/hook/new_mv";

const { newMv, mv_area, currentIndex, changeArea } = new_mv();
</script>

<style lang="less" scoped>
.wrapper {
  padding-top: 0px;
}
.mv {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: left;
  margin: 0 -10px;

  .item {
    flex: 30%;
    max-width: calc(100% / 6 - 20px);
    margin: 20px 10px 0;
    border-radius: 4px;
    overflow-y: auto;
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
</style>
