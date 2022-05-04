<template>
  <div class="mv">
    <div class="mv-container">
      <div class="mv-head">
        <div class="title">
          <span class="mv_area">地区：</span>
          <span :class="['list', areaIndex == index ? 'active' : '']" v-for="(item, index) in area" :key="index" @click="changeTag('area', index)">{{ item }}</span>
        </div>
        <div class="title">
          <span class="mv_type">类型：</span>
          <span :class="['list', typeIndex == index ? 'active' : '']" v-for="(item, index) in type" :key="index" @click="changeTag('type', index)">{{ item }}</span>
        </div>
      </div>
      <div class="mv-main">
        <div class="h_title">
          <h3 class="mv_tag">全部MV</h3>
          <span :class="['mv_order', orderIndex == index ? 'actived' : '']" v-for="(item, index) in order" @click="changeTag('order', index)">{{ item }}</span>
        </div>
        <Mv :mvList="mvList" :type="1014"></Mv>
        <Pagination :total="total" :pageNo="pageNo" @getPageNo="getPageNo" :continues="5" :pageSize="30"></Pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, getCurrentInstance } from "vue";
import { reqMv } from "@/api";
import Mv from "@/components/Mv";

export default {
  name: "Mvlist",
  components: { Mv },
  setup() {
    const { proxy } = getCurrentInstance();
    // 数据
    const data = reactive({
      area: proxy.$params.mv_area,
      type: proxy.$params.mv_type,
      order: proxy.$params.mv_order,
      mvList: [],
      areaIndex: 0,
      typeIndex: 0,
      orderIndex: 0,
      total: 0,
      pageNo: 1,
      offset: 0,
    });
    // 点击切换分类显示
    const changeTag = (type, index) => {
      if (type === "area") {
        data.areaIndex = index;
      } else if (type == "type") {
        data.typeIndex = index;
      } else {
        data.orderIndex = index;
      }
      getMv(data.area[data.areaIndex], data.type[data.typeIndex], data.order[data.orderIndex]);
    };
    // 获取mv数据
    const getMv = async (area, type, order, offset, isTag = 1) => {
      if (area === "全部") {
        area = "";
      }
      if (type == "全部") {
        type = "";
      }
      const result = await reqMv(area, type, order, offset);
      console.log(result);
      if (result.code === 200) {
        data.mvList = result.data;
        // 标记是更改页数还是切换标签，是否需要修改总数据量
        if (isTag) {
          data.total = result.count;
        }
      }
    };
    // 更改页数
    const getPageNo = val => {
      data.pageNo = val;
      data.offset = (val - 1) * 30;
      getMv(data.area[data.areaIndex], data.type[data.typeIndex], data.order[data.orderIndex], data.offset, 0);
    };
    onMounted(() => {
      getMv(data.area[data.areaIndex], data.type[data.typeIndex], data.order[data.orderIndex], data.offset);
    });
    return { ...toRefs(data), changeTag, getMv, getPageNo };
  },
};
</script>

<style lang="less" scoped>
.mv {
  width: 1075px;
  margin: 0 auto;
  padding-bottom: 100px;
  .mv-container {
    display: flex;
    padding-top: 40px;
    flex-direction: column;
    .mv-head {
      height: 100px;
      background: #fff;
      // display: flex;
      // background: #fff;
      border-radius: 10px;
      .title {
        flex: 1;
        text-align: left;
        // width: ;
        height: 50px;
        span:first-child {
          font-size: 16px;
          font-weight: 600;
          color: #555;
          // padding: 5px;
        }
        .mv_area,
        .mv_type {
          padding-top: 15px;
          padding-left: 10px;
        }
        span {
          display: inline-block;
          text-align: center;
        }
        .list {
          margin: 0 15px 0;
          padding: 5px 5px 5px;
          font-size: 16px;
          min-width: 60px;
          height: 40px;
          line-height: 30px;
          color: #555;
          &:hover,
          &.active {
            cursor: pointer;
            color: #48c8ff;
            border-radius: 7px;
            position: relative;
            z-index: 1;
            font-weight: 600;

            &:after {
              position: absolute;
              content: "";
              left: 0;
              bottom: 1px;
              width: 100%;
              height: 6px;
              background: #6cd3ff;
              z-index: -1;
            }
          }
        }
      }
    }
    .mv-main {
      flex: 1;
      // background: #fff;
      margin-top: 30px;
      .h_title {
        padding-top: 0;
        padding-bottom: 0;
        .mv_order {
          float: right;
          text-align: right;
          margin: 0 0 0 10px;
          width: 70px;
          text-align: center;
          height: 40px;
          line-height: 40px;
          &.actived {
            font-weight: 600;
            color: #606060;
          }
        }
      }
    }
  }
}
</style>
