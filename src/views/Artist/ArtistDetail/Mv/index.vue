<template>
  <div class="mv">
    <ul class="mvlist clearfix">
      <li v-for="(mv, index) in mvlist" :key="index" :title="mv.name">
        <router-link :to="{ path: '/mvlist/mv', query: { id: mv.id } }">
          <div class="cover">
            <el-image :src="mv.imgurl" lazy/>
          </div>
          <span class="des">{{ mv.name }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>

import { ref, onMounted, computed } from "vue";
import { reqArtistMv } from "@/api";
import { useRoute } from "vue-router";

export default {
  name: "Mv",
  setup() {
    // mv列表
    let mvlist = ref([]);
    const route = useRoute();
    const id = computed(() => route.query.id);
    
    // 获取歌曲相关mv
    const getMv = async () => {
      const result = await reqArtistMv(id.value);
      mvlist.value = result.mvs;
    };

    onMounted(() => {
      getMv();
    });
    return {
      mvlist,
      id,
      getMv,
    };
  },
};
</script>

<style scoped lang="less">
.mv {
  width: 100%;
  .mvlist {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    text-align: center;
    li {
      width: 166px;
      height: 170px;
      padding-bottom: 30px;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
      .cover {
        height: 117px;
        overflow: hidden;
        .el-image {
          height: 100%;
        }
      }
      .des {
        width: 100%;
        display: block;
        margin-top: 8px;
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>
