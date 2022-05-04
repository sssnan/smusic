<template>
  <div class="album_list">
    <div class="h_title">
      <h3>新碟上架</h3>
      <router-link class="more" :to="{ path: '/album' }">更多<i class="iconfont icon-gengduo"></i></router-link>
    </div>
    <div class="wrapper">
      <swiper
        :initialSlide="3"
        :modules="modules"
        :slidesPerGroup="4"
        :slidesPerView="4"
        :loop="true"
        navigation
        :autoplay="{ delay: 4000 }"
        :space-between="20"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide v-for="item in newAlbums" :key="item.id">
          <router-link :to="{ path: '/album/detail', query: { id: item.id } }">
            <el-image :src="item.picUrl" class="albumImg" />
            <div class="info">
              <div class="info">
                <div class="album-name" v-if="item.name">{{ item.name }}</div>
                <div class="artist-name" v-if="item.artist">{{ item.artist.name }}</div>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import new_album from "@/hook/new_album";
import { Navigation, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue";
import "swiper/swiper.less";
import "swiper/modules/navigation/navigation.less";
export default {
  name: "NewAlbum",
  components: {
    Swiper,
    SwiperSlide,
  },

  setup() {
    const { newAlbums } = new_album();
    const onSwiper = swiper => {};
    const onSlideChange = swiper => {};
    return {
      newAlbums,
      onSwiper,
      onSlideChange,
      modules: [Autoplay, Navigation],
    };
  },
};
</script>

<style lang="less">
.wrapper {
  padding-top: 30px;
  padding-bottom: 30px;
  --swiper-navigation-color: #4e4e4e; /* 单独设置按钮颜色 */
  --swiper-navigation-size: 20px; /* 设置按钮大小 */
  .swiper-slide {
    background: #f5f3f2;
    color: #000;
    border-radius: 10px;
    height: 265px;
    &:hover {
      cursor: pointer;
    }
    .info {
      overflow: hidden;
      &:hover {
        animation: info 0.5s forwards;
        text-decoration: underline;
      }
      .album-name {
        font-size: 16px;
        color: inherit;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        opacity: inherit;
      }

      .artist-name {
        font-size: 14px;
        color: inherit;
        opacity: inherit;
      }
    }
  }
}
.albumImg {
  width: 200px;
  border-radius: 5px;
  margin-top: 10px;
  &:hover {
    animation: img 0.5s forwards;
  }
}
// 动画效果
@keyframes info {
  from {
    color: #999;
  }
  to {
    color: #666;
  }
}
@keyframes img {
  from {
    width: 200px;
  }
  to {
    width: 210px;
  }
}
</style>
