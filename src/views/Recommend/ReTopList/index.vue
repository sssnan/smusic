<template>
  <div class="wrapper">
    <div v-for="item in toplist.slice(0, 4)" :key="item.id" class="toplist_item">
      <div class="toplist_hd">
        <router-link :to="{ path: '/topList', query: { rId: item.id } }" class="toplist_name">{{ item.name }}</router-link>
        <h5 class="toplist_update">
          最近更新：{{ $utils.formartDate(item.updateTime, "MM月dd日") }}<span>（{{ item.updateFrequency }}）</span>
        </h5>
      </div>
      <div class="toplist_wrapper">
        <div class="songitem" v-for="(songItem, index) in songList[item.id].tracks.slice(0, 6)" :key="songItem.id">
          <div class="songimg">
            <el-image :src="songItem.al.picUrl" lazy> </el-image>
          </div>
          <div class="songinfo">
            <router-link :to="{ path: '/songlist/detail', query: { id: songItem.id } }" class="song_title">{{ songItem.name }}</router-link>
            <div class="song_author">
              <router-link :to="{ path: '/artist/detail', query: { id: ar.id } }" class="song_name" v-for="(ar, index) in songItem.ar" :key="index">{{
                index !== 0 ? " / " + ar.name : ar.name
              }}</router-link>
            </div>
          </div>
          <div class="songoperate">
            <i class="iconfont icon-add" title="添加到播放列表" @click="addSongList(songItem)"></i>
            <i class="iconfont icon-xiai" title="添加到收藏"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import topList from "@/hook/topList";

const { toplist, songList, addSongList } = topList();
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  margin: 0 -10px;
  height: 600px;
}
.toplist_item {
  position: relative;
  flex: 1;
  margin: 0 10px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  background: #fff;
  .toplist_name {
    display: block;
    font-size: 22px;
    line-height: 30px;
    font-weight: 700;
    padding-bottom: 10px;
    color: #2c3e50;
  }

  .toplist_update {
    line-height: 18px;
    font-weight: 300;
    color: #666;
  }
}

.toplist_wrapper {
  padding-top: 30px;

  .songitem {
    position: relative;
    display: flex;
    padding-bottom: 20px;

    &.active {
      opacity: 0.6;
    }

    .songimg {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      line-height: 48px;
      font-size: 18px;
      border-radius: 8px;
      margin-right: 20px;
      box-shadow: 0 4px 6px rgb(0 0 0 / 12%);
      overflow: hidden;
    }

    .songinfo {
      flex: 1;
    }

    .song_title {
      line-height: 24px;
      overflow: hidden;
      text-align: left;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      word-break: break-all;
      padding-bottom: 5px;
      font-size: 14px;
      transition: all 0.3s ease-in;
    }

    .song_author {
      display: block;
      font-size: 0;
      height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      word-break: break-all;
      text-align: left;

      a {
        display: inline-block;
        line-height: 20px;
        font-size: 14px;
        color: #666;
      }
    }

    &:hover {
      .song_title {
        transform: translate(15px, 0);
        transition: all 0.3s ease-in;
      }

      .songoperate {
        width: 80px;
        transition: all 0.3s ease-in;
      }
    }

    &:last-child {
      padding-bottom: 0;
    }
  }

  .songoperate {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 0;
    line-height: 48px;
    transition: all 0.3s ease-in;
    overflow: hidden;

    i {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
