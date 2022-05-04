<template>
  <div class="album">
    <!-- 热门新碟 -->
    <div class="hot clearfix">
      <div class="tit">
        <h3><span>热门新碟</span></h3>
      </div>
      <Albums :albums="hotAlbums"></Albums>
    </div>
    <!-- 全部新碟 -->
    <div class="all">
      <div class="tit">
        <h3><span>全部新碟</span></h3>
        <div class="tab clearfix">
          <li v-for="(tit, index) in title" :key="index">
            <a @click="changeArea(tit.area, index)">{{ tit.name }}</a>
            <span class="line" v-if="index != 4">|</span>
          </li>
        </div>
      </div>
      <Albums :albums="allAlbum"></Albums>
    </div>
    <!-- 分页器 -->
    <Pagination :pageNo="pageNo" :pageSize="30" :total="total" :continues="5" @getPageNo="getPageNo"></Pagination>
  </div>
</template>

<script>
import Albums from "@/components/Albums";
import { reqAlbumNewset, reqAllNewAlbum } from "@/api";
import { reactive, toRefs, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "Album",
  components: { Albums },
  setup() {
    const data = reactive({
      //热门新碟
      hotAlbums: [],
      //全部新碟
      allAlbum: [],
      //全部新碟的标题分类
      title: [
        {
          name: "全部",
          area: "ALL",
        },
        {
          name: "华语",
          area: "ZH",
        },
        {
          name: "欧美",
          area: "EA",
        },
        {
          name: "韩国",
          area: "KR",
        },
        {
          name: "日本",
          area: "JP",
        },
      ],
      tIndex: 0,
      offset: 0,
      pageNo: 1,
      type: "new",
      total: 0,
    });
    const route = useRoute();

    const area = computed(() => {
      if (route.query.area == undefined) return "ALL";
      return route.query.area;
    });

    watch(area, () => changeArea());

    // 获取热门新碟
    const getNewset = async () => {
      const result = await reqAlbumNewset();
      data.hotAlbums = result.weekData.slice(0, 10);
    };

    // 获取全部新碟
    const getAll = async (offset, area) => {
      const result = await reqAllNewAlbum(offset, area);
      if (result.code === 200) {
        data.allAlbum = result.albums;
        data.total = result.total;
      }
    };

    //改变地区选择
    const changeArea = (area, index) => {
      data.tIndex = index;
      data.offset = 0;
      getAll(data.offset, area);
    };

    // 更改页数
    const getPageNo = val => {
      data.pageNo = val;
      data.offset = (val - 1) * 30;
      getAll(data.offset, area.value);
    };

    onMounted(() => {
      getNewset();
      getAll(data.offset, area.value);
    });

    return {
      ...toRefs(data),
      getNewset,
      getAll,
      changeArea,
      getPageNo,
    };
  },
};
</script>

<style lang="less" scoped>
.album {
  width: 982px;
  margin: 0 auto;
  border: 1px solid #d3d3d3;
  background-color: #fff;
  min-height: 700px;
  padding: 40px 40px 100px;
  .hot {
    .tit {
      width: 100%;
      height: 42px;
      border-bottom: 2px solid #75c7fc;

      h3 {
        float: left;
        font-size: 24px;
        font-weight: normal;
        color: #333;
      }
    }
  }
  .all {
    .tit {
      width: 100%;
      height: 42px;
      border-bottom: 2px solid #75c7fc;
      h3 {
        float: left;
        font-size: 24px;
        font-weight: normal;
        color: #333;
      }
      .tab {
        float: left;
        margin: 12px 0 0 20px;
        li {
          float: left;

          a {
            float: left;
            &:hover {
              color: #75c7fc;
              cursor: pointer;
            }
          }
          .line {
            display: block;
            float: left;
            margin: 0 10px;
            margin-top: -1px;
          }
        }
      }
    }
  }
}
</style>
