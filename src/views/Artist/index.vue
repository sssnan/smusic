<template>
  <div class="artist">
    <div class="artist-container">
      <div class="main">
        <!-- 顶部字母分类 -->
        <div class="initial">
          <span v-for="(item, index) in initial" :key="index" :class="['list', index === initialIndex ? 'active' : '']" @click="selectType('initial', index)">{{ item.label }}</span>
        </div>
        <div class="line"></div>
        <!-- 歌手列表 -->
        <Artists :artistList="artistList"></Artists>
      </div>
      <!-- 侧边栏分类 -->
      <div class="aside-box">
        <el-affix :offset="140">
          <div class="aside-menu">
            <div class="filter">
              <div class="filter-item"></div>
              <div class="filter-item">
                <span v-for="(item, index) in area" :key="index" :class="index === areaIndex ? 'active' : ''" @click="selectType('area', index)">{{ item.label }}</span>
              </div>
              <div class="filter-item">
                <span v-for="(item, index) in type" :key="index" :class="index === typeIndex ? 'active' : ''" @click="selectType('type', index)">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </el-affix>
      </div>
    </div>
  </div>
</template>.

<script>
import Artists from "@/components/Artists";
import { onMounted, getCurrentInstance, reactive, toRefs } from "vue";
import { reqArtistList } from "@/api";
import params from "@/assets/js/params";

export default {
  name: "Artist",
  components: { Artists },
  setup() {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      typeIndex: 0,
      areaIndex: 0,
      initialIndex: 0,
      params: {
        // 地区
        area: -1,
        // 类型
        type: -1,
        // 字母
        initial: "",
        limit: 50,
      },
      area: proxy.$params.artist_area,
      type: proxy.$params.artist_type,
      initial: proxy.$params.artist_initial,
      // 歌手列表
      artistList: [],
    });

    // 字母分类
    function renderInitial() {
      const alphabet = [];
      for (let i = 0; i < 26; i++) {
        alphabet.push({
          label: String.fromCharCode(65 + i),
          val: String.fromCharCode(97 + i),
        });
      }
      data.initial = [data.initial[0], ...alphabet, data.initial[1]];
    }

    // 获取歌手列表
    async function getArtistList(params) {
      let result = await reqArtistList(params);
      if (result.code === 200) {
        data.artistList = result.artists;
      }
    }

    // 点击切换分类
    function selectType(type, index) {
      if (type == "initial") {
        data.initialIndex = index;
        data.params.initial = data.initial[index].val;
      } else if (type == "area") {
        data.areaIndex = index;
        data.params.area = data.area[index].val;
      } else {
        data.typeIndex = index;
        data.params.type = data.type[index].val;
      }
      getArtistList(data.params);
    }

    onMounted(() => {
      renderInitial();
      getArtistList(params);
    });
    return {
      ...toRefs(data),
      renderInitial,
      getArtistList,
      selectType,
    };
  },
};
</script>

<style scoped lang="less">
.artist {
  width: 1305px;
  float: right;
  padding-bottom: 40px;
  .artist-container {
    display: flex;
    padding-top: 40px;

    // 顶部字母分类
    .initial {
      margin-top: 5px;
      text-align: center;
      line-height: 30px;
      margin-right: -30px;

      span {
        display: inline-block;
        text-align: center;
      }
      .list {
        margin-left: 2px;
        font-size: 13px;
        min-width: 30px;
        color: #555;
        &:hover,
        &.active {
          cursor: pointer;
          background: #48c8ff;
          // border-radius: 5px;
          color: #fff;
          z-index: 1;
        }
      }
    }

    .line {
      border: 1px solid #00000017;
      width: 95%;
      // margin: 5px auto;
      margin: 5px 0 5px 36px;
    }

    // 侧分类栏
    .aside-box {
      z-index: 5;
      .aside-menu {
        margin-left: 10px;
        padding-left: 15px;
        text-align: left;
        margin-bottom: 25px;
        background: #fff;
        border-radius: 12px;
        .filter-item {
          font-size: 0;
          padding-bottom: 20px;

          span {
            display: inline-block;
            padding: 0 12px;
            font-size: 14px;
            line-height: 30px;
            margin-right: 6px;
            vertical-align: top;
            cursor: pointer;
            border-radius: 3px;

            &.active {
              color: #fff;
              background: #48c8ff;
            }
          }
        }
      }
    }
  }
}
</style>
