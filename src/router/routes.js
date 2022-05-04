const routes = [
  // 重定向
  {
    path: "/",
    redirect: "/recommend",
  },
  // 推荐
  {
    path: "/recommend",
    component: () => import('@/views/Recommend')
  },
  // 排行榜
  {
    path: "/toplist",
    component: () => import('@/views/TopList')
  },
  // 歌曲列表
  {
    path: "/songlist",
    component: () => import('@/views/SongList'),
  },
  // 歌曲详情
  {
    path: "/songlist/detail",
    component: () => import('@/views/SongList/Detail')
  },
  // 歌手
  {
    path: "/artist",
    component: () => import('@/views/Artist'),
  },
  // 歌手详情
  {
    path: "/artist/detail",
    name: "ArtistDetail",
    component: () => import('@/views/Artist/ArtistDetail'),
    redirect: "/artist/detail/songs",
    children: [
      {
        path: "als",
        component: () => import('@/views/Artist/ArtistDetail/Album')
      },
      {
        path: "descs",
        component: () => import('@/views/Artist/ArtistDetail/Desc')
      },
      {
        path: "mvs",
        component: () => import('@/views/Artist/ArtistDetail/Mv')
      },
      {
        path: "songs",
        component: () => import('@/views/Artist/ArtistDetail/Song')
      }
    ]
  },
  // 专辑
  {
    path: "/album",
    component: () => import('@/views/Album'),
  },
  // 专辑详情
  {
    path: "/album/detail",
    component: () => import('@/views/Album/AlbumDetail'),
  },
  // 歌单
  {
    path: "/playlist",
    name: "PlayList",
    component: () => import('@/views/PlayList'),
  },
  // 歌单详情
  {
    path: '/playlist/detail',
    name: 'PlayListDetail',
    component: () => import('@/views/PlayList/Detail')
  },
  // 歌词
  {
    path: "/lyric",
    component: () => import('@/views/Lyric')
  },
  // MV
  {
    path: "/mvlist",
    name: "mvlist",
    component: () => import('@/views/MV'),
  },
  // mv详情
  {
    path: "/mvlist/mv",
    name: "mv",
    component: () => import('@/views/MV/Video')
  },
  // 搜索
  {
    path: '/search/res',
    component: () => import('@/components/SearchResult')
  },
  // 电台
  {
    path: '/djlist',
    name: 'djlist',
    component: () => import('@/views/DjList')
  },

]

export default routes
