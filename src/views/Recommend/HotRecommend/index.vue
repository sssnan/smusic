<template>
  <div class="hot-list">
    <div class="h_title">
      <h3>热门歌单</h3>
      <span v-for="(tag, index) in hotListTags.slice(0, 5)" :key="tag.id" :class="tagIndex == index ? 'active' : ''" @click="changeTag(index)">{{ tag.name }}</span>
      <router-link class="more" :to="{ path: '/playlist' }">更多<i class="iconfont icon-gengduo"></i></router-link>
    </div>
    <div class="wrapper">
      <div class="playlist">
        <div class="item" v-for="item in hotList.slice(0, 6)" :key="item.id">
          <router-link class="faceImg" :to="{ path: '/playlist/detail', query: { id: item.id } }">
            <el-image :src="item.coverImgUrl" lazy> </el-image>
            <span class="playCount"
              ><i class="iconfont icon-yinle"></i><em>{{ $utils.formartNum(item.playCount) }}</em> / {{ item.trackCount + "首" }}</span
            >
          </router-link>
          <div class="info">
            <router-link :to="{ path: '/playlist/detail', query: { id: item.id } }" class="info_name">{{ item.name }} </router-link>
            <div class="tags">
              <router-link :to="{ path: '/playlist', query: { cat: tag } }" class="tag" v-for="(tag, index) in item.tags" :key="index">#{{ tag }}</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import hot_recommend from "@/hook/hot_recommend";

const { changeTag, tagIndex, hotListTags, hotList } = hot_recommend();
</script>

<style lang="less">
.wrapper {
  padding-top: 0px;
}
.playlist {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  font-size: 0;
}
.item {
  width: calc(100% / 6);
  padding: 20px 40px 0 0;
  box-sizing: border-box;

  .faceImg {
    display: block;
    position: relative;
    padding-top: 100%;
  }

  .el-image {
    display: block;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    border-radius: 4px;
  }

  .playCount {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 4;
    font-size: 12px;
    display: block;
    text-align: center;
    color: #fff;
    line-height: 30px;
    padding-right: 10px;
    border-radius: 0 4px 0 0;
    background: -moz-linear-gradient(left, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 97%, rgba(0, 0, 0, 0.5) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(left, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 97%, rgba(0, 0, 0, 0.5) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 97%, rgba(0, 0, 0, 0.5) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#80000000',GradientType=1 ); /* IE6-9 */

    em {
      display: inline-block;
      padding-left: 5px;
      font-style: normal;
    }
  }

  &:hover {
    .info_name {
      color: #000;
      text-decoration: underline;
    }
  }

  .info_name {
    display: block;
    font-size: 16px;
    line-height: 22px;
    margin-top: 15px;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }

  .tags {
    padding: 5px 0;

    .tag {
      padding-right: 5px;
      font-size: 12px;
      color: #fff;
    }
  }
}
</style>
