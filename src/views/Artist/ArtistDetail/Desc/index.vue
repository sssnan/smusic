<template>
  <div class="des">
    <div class="briefDesc">
      <h2 class="name">歌手简介</h2>
      <p>{{ desc.briefDesc }}</p>
    </div>
    <div class="introduction">
      <div class="desc" v-for="(info, index) in desc.introduction" :key="index">
        <h2 class="name">{{ info.ti }}</h2>
        <p v-html="info.txt"></p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, computed } from "vue";
import { reqArtistDesc } from "@/api";
import { useRoute } from "vue-router";
export default {
  name: "Desc",
  setup() {
    let desc = reactive({});
    const route = useRoute();
    const id = computed(() => route.query.id);
    // 获取歌手介绍
    const getArtistDesc = async () => {
      let result = await reqArtistDesc(id.value);
      desc.briefDesc = result.briefDesc;
      desc.introduction = result.introduction;
      desc.introduction.forEach(item => {
        item.txt = item.txt.replace(/\n/g, "<br>");
      });
    };

    onMounted(() => {
      getArtistDesc();
    });
    return {
      desc,
      id,
      getArtistDesc,
    };
  },
};
</script>

<style lang="less" scoped>
.des {
  width: 100%;
  text-align: left;
  .name {
    margin: 28px 0 8px 0;
    color: #333;
    font-size: 14px;
    padding-left: 10px;
    border-left: 3px solid #ff461f;
  }
  p {
    line-height: 25px;
    color: #666;
    // text-indent: 2em;
  }
  .briefDesc {
    margin-bottom: 10px;
  }
  .introduction {
    width: 100%;
    .desc {
      margin-bottom: 30px;
    }
  }
}
</style>
