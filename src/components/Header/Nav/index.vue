<template>
  <ul class="nav">
    <li :class="{ actived: menuActive.indexOf(item.path) >= 0 }" v-for="(item, index) in menuList" :key="item.path" @click="selectNav(item.path)">
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { reactive, computed } from "vue";

const route = useRoute();
const router = useRouter();

const menuList = reactive([
  {
    name: "推荐",
    path: "recommend",
  },
  {
    name: "排行榜",
    path: "toplist",
  },
  {
    name: "歌单",
    path: "playlist",
  },
  {
    name: "MV",
    path: "mvlist",
  },
  {
    name: "歌手",
    path: "artist",
  },
  {
    name: "新碟",
    path: "album",
  },
  {
    name: "我的音乐",
    path: "my",
  },
]);

// 当前选择菜单
const menuActive = computed(() => route.path);

// 切换导航跳转
const selectNav = item => {
  router.push({
    path: "/" + item,
  });
};
</script>
<style lang="less">
.nav {
  display: flex;
  height: 80px;
  padding: 15px 0 ;
  border-top: 1px solid #fff;
  justify-content: space-between;
  li {
    display: block;
    padding: 10px 16px;
    color: #333;
    text-align: center;
    margin-left: 10px;
    text-align: left;
    font-weight: 300;

    cursor: pointer;
    &:hover {
      color: #fff;
      // font-weight: 600;
      text-shadow: 0 0 30px #0eb83a;
      font-family: "yjsz";
    }
    &.actived {
      color: #fff;
      text-shadow: 0 0 30px #0eb83a;
      font-family: "yjsz";
      // font-weight: 600;

      .iconfont {
        color: #fff;
        background-color: #909090;
      }
    }

    span {
      display: inline-block;
      line-height: 32px;
      font-size: 20px;
    }
  }

  .iconfont {
    display: inline-flex;
    width: 32px;
    height: 32px;
    background-color: #fff;
    box-shadow: 0 4px 6px rgb(0 0 0 / 12%);
    border-radius: 6px;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    font-size: 18px;
    color: #909090;
    vertical-align: top;
  }
}
</style>

