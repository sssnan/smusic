// 热门推荐hook函数
import { ref, onMounted, computed } from "vue";
import { reqHotList, reqPlayList, reqHighquality, reqHighqualitytag } from "@/api";
import { useStore } from "vuex";

// 歌单
export default function hot_recommend() {
  // 热门歌单分类
  let hotListTags = ref([])
  // 热门歌单
  let hotList = ref([])
  // 当前选中标签索引
  let tagIndex = ref(0)
  // 当前标签分类
  let cat = ref("全部")
  // 总数量
  let total = ref(0)

  const store = useStore()
  const isLogin = computed(() => store.getters.isLogin)

  // 登陆后获取精品歌单分类
  const getHighqualityTags = async () => {
    let result = await reqHighqualitytag()
    if (result.code === 200) {
      hotListTags.value = result.tags
      hotListTags.value.unshift({ name: "精品" })
    }
  }

  // 获取热门歌单分类
  const getHotListTags = async () => {
    let result = await reqHotList();
    if (result.code === 200) {
      hotListTags.value = result.tags;
      hotListTags.value.unshift({ name: "推荐" })
    }
  }

  // 登录后获取推荐歌单
  const getHighquality = async () => {
    let result = await reqHighquality()
    if (result.code === 200) {
      hotList.value = result.playlists
    }
  }

  // 未登录获取推荐歌单 
  const getHotList = async (order, cat, limit, offset) => {
    let result = await reqPlayList(order, cat, limit, offset);
    if (result.code === 200) {
      hotList.value = result.playlists;
      total.value = result.total
    }
  }

  // 点击切换标签 
  const changeTag = (index) => {
    tagIndex.value = index
    cat.value = hotListTags.value[index].name
    if (cat.value === "推荐" || cat.value === "精品") {
      cat.value = "全部"
    }
    getHotList('hot', cat.value, 60)
  }

  onMounted(() => {
    getHotListTags();
    getHotList();
  });
  return {
    hotListTags,
    hotList,
    cat,
    total,
    tagIndex,
    getHotListTags,
    getHotList,
    changeTag,
    getHighquality,
  };
}
