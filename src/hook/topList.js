import { onMounted, reactive, toRefs } from "vue";
import { reqTopList, reqListDetail } from "@/api";
import { useStore } from "vuex";

export default function topList() {
  const store = useStore();
  const data = reactive({
    // 排行榜列表
    toplist: [],
    // 排行榜详情
    songList: {},
    // num: 6,
  });
  // 获取排行榜
  async function getTopList() {
    let result = await reqTopList();
    if (result.code === 200) {
      data.toplist = result.list;
    }
    // 获取排行榜歌曲列表
    data.toplist.forEach(async item => {
      let res = await reqListDetail(item.id);
      data.songList[item.id] = res.playlist;
    });
  }
  // 添加当前歌曲到播放列表
  const addSongList = item => {
    store.dispatch("addList", { list: [item] });
    store.commit("SET_PLAYLISTTIPS", true);
  };

  onMounted(() => {
    getTopList();
  });

  return {
    ...toRefs(data),
    addSongList,
    getTopList,
  };
}
