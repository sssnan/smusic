<template>
  <div class="artist-main">
    <div class="list-container">
      <div class="item" v-for="item in artistList" :key="item.id">
        <em class="circle"></em>
        <router-link :to="{ path: '/artist/detail', query: { id: item.id } }" class="faceImg">
          <el-image :src="item.picUrl" lazy> </el-image>
        </router-link>
        <div class="info">
          <div class="info-header">
            <router-link :to="{ path: '/artist/detail', query: { id: item.id } }" class="name" :title="item.name">
              {{ item.name }}
            </router-link>
            <span class="nickname" v-for="(nickname, index) in item.alias" :key="nickname">{{ nickname }}</span>
          </div>
          <div class="info-num">
            <span class="albumSize"><em>专辑</em>{{ item.albumSize }}</span>
            <span class="musicSize" v-if="item.musicSize"><em>单曲</em>{{ item.musicSize }}</span>
            <span class="mvSize" v-if="item.mvSize"><em>MV</em>{{ item.mvSize }}</span>
            <span class="fansSize" v-if="item.fansCount"><em>粉丝</em>{{ $utils.formartNum(item.fansCount) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  artistList: { type: Array, required: true },
});

const artistList = computed(() => props.artistList);
</script>

<style lang="less" scoped>
// 歌手列表
.artist-main {
  flex: 1;
  margin-top: 10px;

  .list-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    padding-bottom: 40px;
    margin-right: -30px;

    .item {
      position: relative;
      display: flex;
      width: calc(100% / 3 - 60px);
      height: 150px;
      padding: 10px 0;
      margin: 0 30px 20px;
      border-radius: 4px;
      background: #fff;
      transition: all 0.3s ease-in-out;
      .info {
        flex: 1;
        padding: 0 10px;
        width: 180px;
        .name {
          display: inline-block;
          max-width: 140px;
          white-space: nowrap;
          margin-right: 10px;
          line-height: 40px;
          font-size: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
        }

        .nickname {
          font-size: 12px;
          display: block;
          color: #999;
        }

        .info-num {
          display: flex;
          padding-top: 10px;
          color: #666;

          span {
            flex: 1;
            display: inline-block;
            font-weight: 600;
            color: #666;
            em {
              display: block;
              font-style: normal;
              font-size: 12px;
              font-weight: 300;
              color: #666;
            }
          }
        }
      }

      &:hover {
        margin-left: 0;
        width: calc(100% / 3 - 30px);
        // border-radius: 60px 12px 12px 60px;
        // transition: all 0.3s ease-in-out;
        background: -moz-linear-gradient(-45deg, #ffffff 20%, #5ce7ff 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(-45deg, #ffffff 20%, #5ce7ff 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(60deg, #ffffff 20%, #5ce7ff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      }

      .faceImg {
        display: block;
        width: 100px;
        height: 100px;
        font-size: 0;
        margin-top: 10px;
        overflow: hidden;
        flex-shrink: 0;
        transition: all 0.3s ease-in-out;
        margin-left: 5px;
        padding: 0;
        .el-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
