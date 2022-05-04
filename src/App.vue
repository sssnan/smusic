<template>
  <Header></Header>
  <Menu></Menu>
  <router-view></router-view>
  <Login v-if="loginDialogVisible" />
  <PlayBar></PlayBar>
</template>

<script>
import Recommend from "@/views/Recommend";
import Login from "@/components/Login";
import PlayBar from "@/components/PlayBar";
import { computed, ref } from "vue";
import { useStore } from "vuex";

export default {
  name: "App",
  components: { Recommend, Login, PlayBar },
  setup() {
    const store = useStore();
    // 登录框显示与隐藏
    const loginDialogVisible = computed(() => store.getters.loginDialogVisible);
    const isShowDesc = ref(false);
    // 页面滚动
    let winX = null;
    let winY = null;

    window.addEventListener("scroll", () => {
      if (winX !== null && winY !== null) {
        window.scrollTo(winX, winY);
      }
    });

    const disableWindowScroll = () => {
      winX = window.scrollX;
      winY = window.scrollY;
    };

    const enableWindowScroll = () => {
      winX = null;
      winY = null;
    };

    // 登录框显示与隐藏
    if (loginDialogVisible.value) {
      disableWindowScroll();
    } else {
      enableWindowScroll();
    }

    return {
      loginDialogVisible,
      disableWindowScroll,
      enableWindowScroll,
    };
  },
};
</script>

<style lang="less" scoped>
#app {
  overflow-y: auto;
}
</style>
