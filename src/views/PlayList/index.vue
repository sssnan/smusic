<template>
  <div class="playlistContainer" @click.stop="closeBox">
    <!-- 顶部 -->
    <div class="header">
      <h3>
        <span>{{ cat }}</span>
        <a class="menu" @click.stop="showList">
          <i>选择分类</i>
          <em class="iconfont icon-xiangxia"></em>
        </a>
      </h3>
      <a class="hot">热门</a>
    </div>
    <!-- 弹出框 -->
    <div class="cateListBox" v-if="isShowList">
      <div class="hd">
        <i class="iconfont icon-xiangshang1"></i>
      </div>
      <div class="bd">
        <h3><a @click="goCatList('全部')">全部风格</a></h3>
        <li class="cb clearfix" v-for="(item, index) in catList" :key="index" :class="{ last: index == 4 }">
          <!-- 种类 -->
          <div class="kind">
            <i class="iconfont icon-yuzhong-" v-if="index == 0"></i>
            <i class="iconfont icon-gangqin" v-else-if="index == 1"></i>
            <i class="iconfont icon-kafei" v-else-if="index == 2"></i>
            <i class="iconfont icon-xiaolian" v-else-if="index == 3"></i>
            <i class="iconfont icon-shejiao-yinle" v-else></i>
            <span>{{ category[index] }}</span>
          </div>
          <!-- 种类详情 -->
          <ul class="item">
            <li v-for="(attr, index2) in item" :key="index2">
              <a class="sep" @click="goCatList(attr)">{{ attr }}</a>
              <span class="line">|</span>
            </li>
          </ul>
        </li>
      </div>
      <div class="ft"></div>
    </div>
    <Playlist :hotList="hotList"></Playlist>
    <!-- 分页器 -->
    <Pagination :pageNo="pageNo" :pageSize="60" :total="total" :continues="5" @getPageNo="getPageNo"></Pagination>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import hot_recommend from "@/hook/hot_recommend";
import { reqCatList } from "@/api";
import Playlist from "@/components/Playlist";

export default {
  name: "PlayList",
  components: { Playlist },
  setup() {
    const { hotListTags, hotList, cat, getHotList, total } = hot_recommend();
    const data = reactive({
      catList: [[], [], [], [], []],
      category: [],
      isShowList: false,
      pageNo: 1,
      offset: 0,
    });

    // 获取所有分类
    const getCatList = async () => {
      let result = await reqCatList();
      if (result.code === 200) {
        data.category = result.categories;
      }
      result.sub.forEach(item => {
        data.catList[item.category].push(item.name);
      });
    };

    // 关闭弹窗
    const closeBox = () => {
      if (data.isShowList == true) {
        data.isShowList = false;
      }
    };

    // 选择分类弹框
    const showList = () => {
      data.isShowList = true;
    };

    // 点击切换分类显示
    const goCatList = attr => {
      getHotList("hot", attr);
      cat.value = attr;
    };

    // 更改页数
    const getPageNo = val => {
      data.pageNo = val;
      data.offset = (val - 1) * 60;
      getHotList("hot", cat.value, 60, data.offset);
    };

    onMounted(() => {
      getCatList();
    });

    return {
      ...toRefs(data),
      hotListTags,
      hotList,
      cat,
      total,
      closeBox,
      goCatList,
      getCatList,
      showList,
      getHotList,
      getPageNo,
    };
  },
};
</script>

<style lang="less" scoped>
.playlistContainer {
  padding: 40px 40px 100px;
  width: 1075px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #d3d3d3;
  position: relative;
  min-height: 700px;
  // 顶部
  .header {
    width: 100%;
    height: 42px;
    border-bottom: 2px solid #74f9ff;

    > h3 {
      height: 33px;
      float: left;
      font-size: 24px;
      font-weight: normal;
      span {
        float: left;
        margin-top: -3px;
        font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
        color: #333;
      }
      .menu {
        margin: 2px 0 0 12px;
        padding-left: 5px;
        display: inline-block;
        position: relative;
        width: 96px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        &:hover {
          cursor: pointer;
        }
        i {
          padding: 0 10px 0 10px;
          height: 31px;
          line-height: 31px;
          background: #eaeef1;
          border: 1px solid #ddd;
          color: #0c73c2;
          display: inline-block;
          overflow: hidden;
          vertical-align: top;
          font-size: 12px;
          text-align: left;
          width: 80px;
          &:hover {
            box-shadow: 1px 1px 5px #999;
          }
        }
        .iconfont {
          position: absolute;
          top: 7px;
          right: 15px;
          width: 8px;
          height: 5px;
          font-size: 12px;
        }
      }
    }
    .hot {
      float: right;
      display: block;
      background: #00e0ff;
      color: #000;
      width: 46px;
      height: 29px;
      line-height: 29px;
      text-align: center;
      font-size: 12px;
      border-radius: 3px;
      box-shadow: 0px 2px 0px #00e0ff, 0px 2px 5px rgba(0, 0, 0, 0.7);

      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
  //弹出框
  .cateListBox {
    width: 720px;
    position: absolute;
    top: 75px;
    left: 10px;
    z-index: 10;
    .hd {
      height: 16px;

      .iconfont {
        position: absolute;
        top: -5px;
        left: 132px;
        display: inline-block;
        width: 24px;
        height: 11px;
        font-size: 24px;
        color: #99e0fe;
      }
    }
    .bd {
      border: 1px solid #ccc;
      box-shadow: -2px 1px 5px #ccc;
      background: #fff;

      h3 {
        text-align: left;
        height: 38px;
        padding-left: 26px;
        border-bottom: 1px solid #e6e6e6;
        font-weight: normal;
        // display: block;
        color: #333;
        font-family: Arial, Helvetica, sans-serif;
        -webkit-text-size-adjust: none;

        a {
          width: 75px;
          height: 26px;
          margin-top: 6px;
          text-align: center;
          display: inline-block;
          background: #eee;
          border: 1px solid #eee;
          line-height: 26px;
          font-size: 12px;

          &:hover {
            cursor: pointer;
            text-decoration: underline;
            color: #333;
          }
        }
      }

      .cb {
        width: 100%;
        display: block;

        .kind {
          float: left;
          width: 70px;
          height: 43px;
          margin-left: 26px;
          padding-top: 20px;
          font-weight: bold;
          text-align: center;
          vertical-align: bottom;
          i {
            display: block;
            float: left;
            width: 23px;
            height: 23px;
            margin: 0px 8px 4px 0;
            font-size: 18px;
          }
          span {
            font-size: 14px;
            color: #333;
            font-family: Arial, Helvetica, sans-serif;
            -webkit-text-size-adjust: none;
            line-height: 26px;
          }
        }
        .item {
          float: left;
          padding: 21px 15px 0 15px;
          border-left: 1px solid #e6e6e6;
          line-height: 24px;
          width: 603px;

          li {
            float: left;
            padding-right: 5px;
            line-height: 24px;
            text-align: center;

            .sep {
              color: #333;
              font-size: 12px;
              text-align: center;
              &:hover {
                color: #333;
                cursor: pointer;
                text-decoration: underline;
              }
            }

            .line {
              font-size: 12px;
              margin: 0 9px 0 11px;
              color: #d8d8d8;
            }
          }
        }
      }
      .last {
        height: 102px;
        text-align: center;
        .item {
          height: 100%;
        }
      }
    }
    .ft {
      width: 100%;
      height: 20px;
    }
  }
}
.clearfix:after {
  clear: both;
  content: ".";
  display: block;
  height: 0;
  visibility: hidden;
}
.clearfix {
  zoom: 1;
}
</style>
