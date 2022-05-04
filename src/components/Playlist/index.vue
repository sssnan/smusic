<template>
  <!-- 主体 -->
  <div class="mainer clearfix">
    <li v-for="(play, index) in hotList" :key="index">
      <div class="u-cover">
        <el-image :src="play.coverImgUrl" lazy />
      </div>
      <router-link class="shadow" :to="{ path: '/playlist/detail', query: { id: play.id } }"></router-link>
      <div class="bottom">
        <span class="iconfont icon-playnum"></span>
        <span class="nb">{{ play.playCount >= 10000 ? parseInt(play.playCount / 10000) + "万" : play.playCount }}</span>
        <span class="iconfont icon-bofangquanbu"></span>
      </div>
      <p class="dec">
        <router-link :title="play.name" class="underline" :to="{ path: '/playlist/detail', query: { id: `${play.id}` } }">{{ play.name }}</router-link>
      </p>
      <p class="author">
        <span>by</span>
        <a :title="play.creator.nickname">{{ play.creator.nickname }}</a>
        <el-image :src="play.creator.avatarDetail.identityIconUrl" class="detail" v-if="play.creator.avatarDetail != null" lazy />
      </p>
    </li>
  </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  hotList: { type: Array, required: true },
});

const hotList = computed(() => props.hotList);
</script>
<style lang="less" scoped>
// 主体
.mainer {
  width: 100%;
  margin: 30px 0 50px -50px;
  li {
    width: calc(100% / 6);
    height: 218px;
    padding: 0 0 30px 63px;
    position: relative;
    float: left;
    .u-cover {
      width: 140px;
      height: 140px;
      img {
        width: 100%;
      }
    }
    .shadow {
      display: block;
      width: 140px;
      height: 140px;
      position: absolute;
      top: 0;
      &:hover {
        cursor: pointer;
      }
    }
    .bottom {
      position: absolute;
      bottom: 78px;
      left: 30;
      width: 140px;
      height: 27px;
      color: #eee;
      background: rgba(51, 51, 51, 0.5);

      .icon-playnum {
        float: left;
        width: 14px;
        height: 11px;
        font-size: 12px;
        margin: 6px 5px 9px 10px;
      }

      .nb {
        display: block;
        text-align: -webkit-match-parent;
        word-wrap: break-word;
        word-break: break-word;
        font-size: 12px;
        float: left;
        margin: 7px 0 0 0;
        font-family: Arial, Helvetica, sans-serif;
        -webkit-text-size-adjust: none;
      }

      .icon-bofangquanbu {
        position: absolute;
        float: right;
        right: 10px;
        bottom: 5px;
        width: 16px;
        height: 17px;
        z-index: 9;
        color: #ccc;

        &:hover {
          cursor: pointer;
          color: #fff;
        }
      }
    }
    .dec {
      margin-top: 8px;
      // line-height: 14px;
      a {
        font-size: 14px;
        text-align: -webkit-match-parent;
        font-family: Arial, Helvetica, sans-serif;
        -webkit-text-size-adjust: none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
        width: 140px;
        display: inline-block;
        color: #333;
        &:hover {
          cursor: pointer;
          color: #000;
          text-decoration: underline;
        }
      }
    }
    .author {
      padding-top: 5px;
      width: 140px;
      span {
        color: #999;
        font-family: Arial, Helvetica, sans-serif;
        -webkit-text-size-adjust: none;
        margin-right: 3px;
        font-size: 12px;
      }
      a {
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          color: #000;
          cursor: pointer;
          text-decoration: underline;
        }
      }

      .detail {
        margin-top: -8px;
        margin-left: 4px;
        width: 13px;
        height: 13px;
      }
    }
  }
}
</style>
