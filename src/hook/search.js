import { useRouter } from 'vue-router'
export default function search() {

  const router = useRouter()

  // 搜索建议列表，点击后跳转到相对应的落地页
  const jumpPage = (item, type) => {
    switch (type) {
      case "songs":
        router.push({ path: "/songlist/detail", query: { id: item.id } });
        break;
      case "artists":
        router.push({ path: "/artist/detail", query: { id: item.id } });
        break;
      case "albums":
        router.push({ path: "/album", query: { id: item.id } });
        break;
      case "playlists":
        router.push({ path: "/playlist/detail", query: { id: item.id } });
        break;
    }
  };
  
  return {
    jumpPage,
  }

}
