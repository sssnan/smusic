import { reqGetNewMv } from "@/api"
import { ref, onMounted } from 'vue'

export default function new_mv() {
  // 最新MV
  let newMv = ref([])
  let mv_area = ref(["全部", "内地", "港台", "欧美", "日本", "韩国"])
  let currentIndex = ref(0)
  // 获取最新mv数据
  async function getNewMv(area) {
    let result = await reqGetNewMv(area)
    if (result.code === 200) {
      newMv.value = result.data
    }
  }
  // 切换地区
  function changeArea(index) {
    currentIndex.value = index
    let area = mv_area.value[index]
    if (area == "全部") {
      area = ""
    }
    getNewMv(area)
  }
  onMounted(() => {
    if (mv_area.value[currentIndex] === "全部") {
      getNewMv("")
    } else {
      getNewMv(mv_area.value[currentIndex])
    }
  })
  return { newMv, getNewMv, mv_area, currentIndex, changeArea }
}
