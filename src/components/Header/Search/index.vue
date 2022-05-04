<template>
  <!-- 搜索区域 -->
  <div class="search">
    <el-select
      v-model="keyVal"
      class="keyVal"
      clearable
      filterable
      remote
      placeholder="请输入歌名、歌词、歌手或专辑"
      :remote-method="remoteMethod"
      :fit-input-width="true"
      :loading="loading"
      loading-text="搜索中..."
      @focus="handleFocus"
    >
      <div class="hot-search" v-if="keyVal == ''">
        <h5>热门搜索</h5>
        <el-option v-for="(item, index) in searchHot" :key="index" :label="item.first" :value="item.first" @click="jumpSearch(item)">
          <span :class="[index < 3 ? 'top-' + index : '']">{{ index + 1 + "." }}</span>
          {{ item.first }}
        </el-option>
      </div>
      <el-option-group v-else v-for="(list, index) in suggestInfo" :key="index" :label="listType[list.label]">
        <el-option v-for="(item, index) in list.data" :key="list.label + index" :label="item.name" :value="list.label + item.name" class="searchItem" @click="jumpPage(item, list.label)">
          {{ item.name }}
          <template v-if="list.label === 'songs'">
            - <span class="artists" v-for="(a, i) in item.artists" :key="i">{{ (i !== 0 ? " / " : "") + a.name }}</span>
          </template>
          <template v-else-if="list.label === 'albums'">
            - <span class="artists">{{ item.artist.name }}</span>
          </template>
        </el-option>
      </el-option-group>
    </el-select>
  </div>
  <!-- 登录区域 -->
  <div :class="isLogin ? 'user-avatar' : 'login'">
    <div class="logined" v-if="isLogin">
      <el-image :src="userInfo.avatarUrl" class="avatar"> </el-image>
      <span class="quit" @click="logout"><i class="iconfont icon-tuichu"></i></span>
    </div>
    <a class="login-btn" @click="loginDialog" v-else>登录</a>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { reqLogout, reqSearchHot, reqSearchSuggest } from "@/api";
import search from "@/hook/search";

export default {
  name: "Search",
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const { jumpPage } = search();

    const data = reactive({
      keyVal: "",
      searchHot: [],
      suggestInfo: [],
      loading: true,
      listType: {
        songs: "单曲",
        artists: "歌手",
        albums: "专辑",
        playlists: "歌单",
      },
    });

    // 是否显示登录弹窗
    const loginDialog = () => store.commit("setLoginDialog", true);

    // 登录成功后，获取用户信息
    const isLogin = computed(() => {
      return store.getters.isLogin;
    });
    const userInfo = computed(() => {
      return store.getters.userInfo;
    });

    watch(isLogin, val => store.commit("setLoginDialog", val));

    const logout = async () => {
      const result = await reqLogout();
      ElMessage.success("退出成功");
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("cookie");
      window.localStorage.removeItem("userInfo");
      window.localStorage.removeItem("isLogin");
      store.commit("setUserInfo", {});
      store.commit("SET_LOGIN", false);

      if (route.path.indexOf("/my") >= 0) {
        router.push({ path: "/" });
      }
      // 退出后刷新页面
      router.go(0);
    };

    const remoteMethod = query => {
      data["keyVal"] = query;

      if (data["keyVal"]) {
        data["loading"] = true;
        data["suggestInfo"] = [];

        getSearchSuggest();
      }
    };

    //搜索框，获取焦点时，请求热门搜索列表接口
    const handleFocus = () => {
      data["suggestInfo"] = [];

      getSearchSuggest();
    };

    // 热门搜索
    const getSearchHot = async () => {
      const result = await reqSearchHot();
      if (result.code === 200) {
        data.searchHot = result.result.hots;
      }
    };

    // 搜索结果
    const getSearchSuggest = async () => {
      const result = await reqSearchSuggest(data.keyVal);
      data["loading"] = false;
      if (result.result.order) {
        data["suggestInfo"] = result.result.order.map(item => {
          return {
            label: item,
            data: result.result[item],
          };
        });
      }
    };
    // 默认热门搜索列表，点击后台跳转到搜索结果页面
    const jumpSearch = item => {
      data.keyVal = item.first;
      if (item.first === route.query.key) {
        return;
      }
      router.push({ path: "/search/res", query: { key: item.first } });
    };

    onMounted(() => {
      getSearchHot();
    });

    return {
      ...toRefs(data),
      loginDialog,
      remoteMethod,
      handleFocus,
      getSearchSuggest,
      jumpSearch,
      jumpPage,
      isLogin,
      userInfo,
      logout,
    };
  },
};
</script>

<style lang="less" scoped>
.search {
  position: relative;
  display: flex;
  text-align: right;
  align-items: center;
  border-bottom: 1px solid #999;
  background: #fff;
  opacity: 0.9;
  border-radius: 10px;

  .keyVal {
    width: 250px;
    border: 0;

    :deep(input) {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      border: none;
    }
  }
}

.el-select-dropdown__wrap {
  max-height: 400px;
}

.hot-search {
  width: 200px;
  h5 {
    padding: 5px 0 5px 20px;
    font-size: 18px;
  }

  .top-0 {
    font-weight: bold;
    color: rgba(255, 0, 0, 1);
  }

  .top-1 {
    font-weight: bold;
    color: rgba(255, 0, 0, 0.6);
  }

  .top-2 {
    font-weight: bold;
    color: rgba(255, 0, 0, 0.4);
  }
}

.searchItem {
  padding-right: 20px;

  .artists {
    font-size: 12px;
    color: #666;
  }

  &.selected {
    color: #666;

    .artists {
      color: #666;
    }
  }
}

.login-btn {
  color: #999;
  display: block;
  font-size: 16px;
  // padding-right: 10px;
  &:hover {
    color: #fff;
    cursor: pointer;
    // font-weight: 600;
  }
}

.user-avatar {
  // width: 120px;
  height: 70px;

  .avatar {
    width: 40px;
    height: 40px;
    // line-height: 40px;
    margin-top: 15px;
    border-radius: 50%;
  }
  .icon-tuichu {
    position: relative;
    top: -13px;
    left: 13px;
    font-size: 18px;
    color: #666;
  }
  .quit {
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
