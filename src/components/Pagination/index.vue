<template>
  <div class="pagination">
    <!-- 上 -->
    <button :disabled="pageNo == 1" @click="changePageNo(pageNo - 1)" class="move">&lt;上一页</button>
    <button v-if="startNumAndEndNum.start > 1" @click="changePageNo(1)" class="page">1</button>
    <button v-if="startNumAndEndNum.start > 2" class="point">...</button>

    <!-- 中间部分 -->
    <button class="page" v-for="(page, index) in parseInt(startNumAndEndNum.end)" :key="index" v-show="page >= startNumAndEndNum.start" :class="{ active: isPage(page) }" @click="changePageNo(page)">
      {{ page }}
    </button>
    <button v-if="startNumAndEndNum.end < totalPage - 1" class="point">...</button>
    <button v-if="startNumAndEndNum.end < totalPage" @click="changePageNo(totalPage)" class="page">{{ totalPage }}</button>
    <button :disabled="pageNo == totalPage" @click="changePageNo(pageNo + 1)" class="move">下一页&gt;</button>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "Pagination",

  props: ["pageNo", "continues", "total", "pageSize"],

  setup(props, { emit }) {
    let totalPage = computed(() => {
      return Math.ceil(props.total / props.pageSize);
    });

    let pageNo = computed(() => props.pageNo);

    let startNumAndEndNum = computed(() => {
      let start = 0;
      let end = 0;
      start = Math.max(1, pageNo.value - Math.floor(props.continues / 2));
      end = Math.min(totalPage.value, pageNo.value + Math.floor(props.continues / 2));

      return { start, end };
    });

    const isPage = page => {
      return page == pageNo.value;
    };

    const changePageNo = page => {
      emit("getPageNo", page);
    };

    return {
      totalPage,
      startNumAndEndNum,
      isPage,
      changePageNo,
      pageNo,
    };
  },
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  margin: 0 auto;
  padding: 10px 0 20px;
  button {
    margin: 0 5px;
    background-color: #fff;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 10px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;
    margin: 0 5px;
    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }
    &.active {
      cursor: not-allowed;
      background-color: #00e0ff;
      color: #fff;
    }
  }
  .point {
    padding: 0;
    margin: 0 -5px;
  }
}
.active {
  background: #00e0ff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.move {
  &:hover {
    color: #00e0ff;
  }
}
.page {
  border: 1px solid #aaa !important;
  border-radius: 5px !important;
  &:hover {
    border: 1px solid #000 !important;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  }
}
</style>
