<template>
  <Banner></Banner>
  <div class="wrap">
    <HotRecommend></HotRecommend>
    <NewAlbum></NewAlbum>
    <NewMV></NewMV>
    <ReTopList></ReTopList>
    <div class="dj-artist">
      <HotDj></HotDj>
      <HotArtist></HotArtist>
    </div>
  </div>
</template>

<script>
import HotRecommend from "./HotRecommend";
import NewAlbum from "./NewAlbum";
import NewMV from "./NewMV";
import ReTopList from "./ReTopList";
import HotDj from "./HotDj";
import HotArtist from "./HotArtist";
import Banner from "./Banner";
export default {
  name: "Recommend",

  components: {
    HotArtist,
    HotDj,
    HotRecommend,
    NewAlbum,
    NewMV,
    ReTopList,
    Banner,
  },
};
</script>
<style lang="less">
.wrap {
  width: 1075px;
  margin: 0 auto;
}

.h_title {
  padding: 20px 0 10px;
  text-align: left;

  .more {
    float: right;
    text-align: center;
    padding-top: 10px;
    line-height: 32px;
    height: 32px;
    color: #aaa;
    font-size: 14px;
    &:hover {
      text-decoration: underline;
      color: #606060;
    }
  }

  h3 {
    display: inline-block;
    padding-right: 50px;
    font-size: 28px;
    font-weight: 700;
  }

  span {
    display: inline-block;
    font-size: 16px;
    margin: 0 40px 0 0;
    color: #aaa;
    cursor: pointer;
    &:hover {
      position: relative;
      z-index: 1;
      font-weight: 600;
      color: #606060;
    }

    &.active {
      position: relative;
      z-index: 1;
      font-weight: 600;
      color: #606060;

      &:after {
        position: absolute;
        content: "";
        left: 0;
        bottom: 1px;
        width: 100%;
        height: 6px;
        background: #00e0ff;
        z-index: -1;
      }
    }
  }
}

.hot-list,
.album_list,
.mv_list,
.dj-list,
.artist-list {
  padding: 0 20px;
  margin-bottom: 25px;
  background: #fff;
  border-radius: 12px;
}

.top_list {
  margin-bottom: 25px;
}
.dj-artist {
  display: flex;
}
.dj-list {
  flex: 1;
  margin-right: 20px;
}
.artist-list {
  width: 40%;
}
</style>
