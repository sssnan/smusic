<template>
  <!-- 侧边栏 -->
  <aside @mouseenter="handleEnter" @mouseleave="handleLeave" ref="top" style="display: none" @scroll="handleScroll()">
    <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen" @close="handleClose" :router="true" :default-active="myPath">
      <el-menu-item index="recommend">
        <span class="iconfont icon-shouye"></span>
        <template #title>推荐</template>
      </el-menu-item>
      <el-menu-item index="toplist">
        <span class="iconfont icon-paihangbang1"></span>
        <template #title>排行榜</template>
      </el-menu-item>
      <el-menu-item index="playlist">
        <span class="iconfont icon-gedan1"></span>
        <template #title>歌单</template>
      </el-menu-item>
      <el-menu-item index="mvlist">
        <span class="iconfont icon-shipin1"></span>
        <template #title>MV</template>
      </el-menu-item>
      <el-menu-item index="artist">
        <span class="iconfont icon-ktv"></span>
        <template #title>歌手</template>
      </el-menu-item>
      <el-menu-item index="album">
        <span class="iconfont icon-zhuanjibaidi-copy-copy"></span>
        <template #title>新碟</template>
      </el-menu-item>
      <el-menu-item index="my">
        <span class="iconfont icon-wodeyinleku"></span>
        <template #title>我的音乐</template>
      </el-menu-item>
    </el-menu>
  </aside>
  <el-backtop :right="100" :bottom="100" />
</template>

<script setup>
import { ref, getCurrentInstance, computed, watch } from "vue";
import { useRoute } from "vue-router";

const { proxy } = getCurrentInstance();
const route = useRoute();

// 控制菜单展开和折叠
const isCollapse = ref(true);
const handleOpen = () => {};
const handleClose = () => {};

// 鼠标移入展开菜单
const handleEnter = () => {
  isCollapse.value = false;
};

// 鼠标移出折叠菜单
const handleLeave = () => {
  isCollapse.value = true;
};

// 滚动页面显示菜单栏
const handleScroll = () => {
  if (window.pageYOffset >= 420) {
    proxy.$refs.top.style.display = "block";
    proxy.$refs.top.style.position = "fixed";
  } else {
    proxy.$refs.top.style.display = "none";
  }
};

// 监听当前页面的rolly
window.addEventListener("scroll", handleScroll, true);
const myPath = computed(() => route.path.split("/")[1]);
watch(myPath, () => computed(() => (myPath.value = route.path.split("/")[1])));
</script>

<style scoped lang="less">
aside {
  top: calc(100vh / 4);
}
.iconfont {
  color: #666;
  padding-right: 20px;
  font-size: 22px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  // min-height: 400px;
}
.el-menu-vertical-demo {
  position: absolute;
}
.el-menu-item.is-active {
  color: #00e0ff;
  font-weight: 700;
  background-color: #ecf5ff;
  .iconfont {
    color: #00e0ff;
  }
}
.el-menu-item {
  color: #aaa;
  text-align: left;
}
</style>
