// 新碟上架hook函数
import { ref, onMounted, reactive } from "vue";
import { reqNewAlbum } from "@/api";

export default function new_album() {
  // 新碟上架数据
  let newAlbums = ref([])
  // 获取新碟上架数据
  const getNewAlbum = async () => {
    const result = await reqNewAlbum()
    if (result.code === 200) {
      newAlbums.value = result.albums
    }
  }
  onMounted(() => {
    getNewAlbum()
  })
  return {
    newAlbums,
    getNewAlbum,
  }
}
