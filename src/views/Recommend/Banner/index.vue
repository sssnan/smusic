<template>
  <div class="bannerContainer">
    <div class="banner">
      <swiper :initialSlide="1" :modules="modules" :slidesPerView="1" navigation :loop="true" :autoplay="true" :pagination="{ clickable: true }" @swiper="onSwiper" @slideChange="onSlideChange">
        <swiper-slide v-for="banner in bannerList" :key="banner.targetId" @click="go(banner.targetId, banner.targetType)">
          <el-image :src="banner.imageUrl" class="bannerImg"/>
        </swiper-slide>
      </swiper>
    </div>
    <div class="img-blur">
      <img :src="img" class="blur" />
    </div>
  </div>
</template>

<script>
import { reqtBanner } from "@/api";
import { onMounted, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/swiper.less";

// 分页器
import "swiper/modules/pagination/pagination.less";
import "swiper/modules/navigation/navigation.less";
export default {
  name: "Banner",
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const router = useRouter();
    const data = reactive({
      // 轮播图数据
      bannerList: [],
      img: "",
    });
    // 获取轮播图数据
    const getBannerList = async () => {
      let result = await reqtBanner();
      if (result.code === 200) {
        data.bannerList = result.banners;
      }
      data.img = data.bannerList[0].imageUrl;
    };
    const onSwiper = swiper => {};
    const onSlideChange = swiper => {
      let index = swiper.realIndex;
      if (data.bannerList != "") {
        data.img = data.bannerList[index].imageUrl;
      }
    };

    const go = (targetId, targetType) => {
      switch (targetType) {
        case 1:
          router.push({ path: "/songlist/detail", query: { id: targetId } });
          break;
        case 10:
          router.push({ path: "/album/detail", query: { id: targetId } });
          break;
        case 100:
          router.push({ path: "/artist/detail", query: { id: targetId } });
          break;
        case 1000:
          router.push({ path: "/playlist/detail", query: { id: targetId } });
          break;
        default:
          break;
      }
    };

    onMounted(() => {
      getBannerList();
    });
    
    return {
      ...toRefs(data),
      getBannerList,
      onSwiper,
      onSlideChange,
      go,
      modules: [Navigation, Pagination, Autoplay],
    };
  },
};
</script>

<style lang="less">
.banner {
  position: relative;
  margin: 50px auto;
  .swiper {
    margin: 0 auto;
    width: 1200px;
    --swiper-navigation-color: #e8ffe8; /* 单独设置按钮颜色 */
    --swiper-navigation-size: 60px; /* 设置按钮大小 */
    .swiper-pagination-bullets {
      .swiper-pagination-bullet {
        margin: 0 5px;
        background-color: #eee;
        width: 15px;
        height: 7px;
        opacity: 0.5;
        border-radius: 5px;
      }
      .swiper-pagination-bullet-active {
        background-color: #e8ffe8;
        width: 30px;
        opacity: 0.8;
      }
    }
    .bannerImg {
      padding-bottom: 30px;
      border-radius: 10px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}

/* 背景模糊图片 */
.img-blur {
  // width: 100%;
  // height: 326px;
  overflow: hidden;
  margin-bottom: 50px;
  .blur {
    width: 100%;
    height: 500px;
    position: absolute;
    top: 70px;
    left: 0;
    z-index: 0;
    -webkit-filter: blur(30px); /* Chrome, Opera */
    -moz-filter: blur(30px);
    -ms-filter: blur(10px);
    filter: blur(15px);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
</style>
