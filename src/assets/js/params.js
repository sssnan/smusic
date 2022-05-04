// 专辑
const album_area = [{ name: '全部', code: 'all' }, { name: '华语', code: 'zh' }, { name: '欧美', code: 'ea' }, { name: '韩国', code: 'kr' }, { name: '日本', code: 'jp' }];

// MV
const mv_area = ['全部', '内地', '港台', '欧美', '日本', '韩国'];
const mv_type = ['全部', '官方版', '原生', '现场版', '网易出品'];
const mv_order = ['上升最快', '最热', '最新']

// 歌手
const artist_area = [{ label: '全部', val: -1 }, { label: '华语', val: 7 }, { label: '欧美', val: 96 }, { label: '日本', val: 8 }, { label: '韩国', val: 16 }, { label: '其他', val: 0 }];
const artist_type = [{ label: '全部', val: -1 }, { label: '男歌手', val: 1 }, { label: '女歌手', val: 2 }, { label: '乐队', val: 3 }];
const artist_initial = [{ label: "热门", val: -1 }, { label: "#", val: 0 },]


export default {
  // 专辑
  album_area,
  // MV
  mv_area,
  mv_type,
  mv_order,
  // 歌手
  artist_area,
  artist_type,
  artist_initial
}
