<template>
  <div class="dj-list">
    <div class="h_title">
      <h3>热门电台</h3>
      <router-link class="more" :to="{ path: '/djlist' }">更多<i class="iconfont icon-gengduo"></i></router-link>
    </div>
    <div class="dj">
      <router-link :to="{ path: '/dj', query: { id: item.id } }" class="item" :key="item.id" v-for="item in hotDj.slice(0, 6)">
        <div class="faceImg">
          <el-image :src="item.picUrl" lazy> </el-image>
        </div>
        <div class="info">
          <div class="dj-name" v-if="item.name" :title="item.name"><i class="iconfont icon-diantai"></i>{{ item.name }}</div>
          <div class="dj-rcmdtext" v-if="item.rcmdtext" :title="item.rcmdtext">{{ item.rcmdtext }}</div>
          <div class="dj-count">
            <span>共{{ $utils.formartNum(item.programCount) }}期</span> <span>订阅{{ $utils.formartNum(item.subCount) }}次</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { reqGetHotDj } from "@/api";
import { onMounted, ref } from "vue";

let hotDj = ref([]);

const getHotDj = async () => {
  const result = await reqGetHotDj();
  hotDj.value = result.djRadios;
};
onMounted(() => {
  getHotDj();
});
</script>

<style lang="less" scoped>
.dj {
  display: flex;
  flex-wrap: wrap;
  font-size: 0;
  margin-right: -20px;

  .item {
    display: inline-flex;
    width: 50%;
    height: 100px;
    margin-bottom: 20px;
    .faceImg {
      width: 80px;
      // height: 80px;
      .el-image {
        width: 80px;
        height: 80px;
      }
    }
  }

  .info {
    flex: 1;
    padding: 5px 0;
    margin: 0 20px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    text-align: left;
  }

  .dj-name,
  .icon-diantai {
    padding-right: 5px;
    font-size: 16px;
    font-weight: bold;
    color: #666;
  }
  .dj-name {
    width: 142px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .dj-rcmdtext {
    font-size: 12px;
    width: 142px;
    color: #666;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .dj-count {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #999;
  }
}
</style>
