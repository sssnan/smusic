//当前这个模块：API进行统一管理
import request from '@/api/ajax';

// 首页轮播图
export const reqtBanner = () => { return request.get('/banner', {}) }
// 搜索
export const reqSearch = (keywords) => { return request.get(`/search?keywords=${keywords}`, {}) }
// 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
export const reqCloudSearch = (keywords, type = 1) => { return request.get(`/cloudsearch?keywords=${keywords}&type=${type}`, {}) }
// 热门搜索
export const reqSearchHot = () => { return request.get('/search/hot', {}) }
// 热门搜索详细
export const reqSearchHotDetail = () => { return request.get('/search/hot/detail', {}) }
export const reqSearchSuggest = (keywords) => { return request.get(`/search/suggest?keywords=${keywords}`, {}) }
export const reqSearchMatch = (keywords) => { return request.get(`/search/multimatch?keywords=${keywords}`, {}) }
// 密码登录
export const reqLogin = (phone, pwd) => { return request.post(`/login/cellphone?phone=${phone}&password=${pwd}`) }
// 验证码登录 
export const reqCaptchaLogin = (phone, captcha) => { return request.post(`/login/cellphone?phone=${phone}&captcha=${captcha}`) }
// 发送验证码 /captcha/sent
export const reqCaptchaSent = (phone) => { return request.post(`/captcha/sent?phone=${phone}`) }
// 验证验证码/captcha/verify
export const reqCaptchaVerify = (phone, captcha) => { return request.post(`/captcha/sent?phone=${phone}&captcha=${captcha}`) }

// 退出登录
export const reqLogout = () => { return request.get('/logout', {}) }
// 获取用户详情
export const reqGetUserInfo = (uid) => { return request.get(`/user/detail?uid=${uid}`, {}) }
// 音乐是否可用
export const reqCheckSong = ({ id = '' }) => { return request.get(`/check/music?id=${id}`, {}) }

/* ********* 歌单 ********* */
// 热门歌单分类
export const reqHotList = () => { return request.get('/playlist/hot', {}) }
// 歌单列表
export const reqPlayList = (order = "hot", cat = "", limit = 60, offset = 0) => { return request.get(`/top/playlist?order=${order}&cat=${cat}&limit=${limit}&offset=${offset}`, {}) }
// 推荐歌单
export const reqPersonalized = (limit = 30) => { return request.get(`/personalized?limit=${limit}`, {}) }
// 登陆后每日推荐歌单 /recommend/resource
export const reqResource = () => { return request.get('/recommend/resource') }
// 精品歌单
export const reqHighquality = (limit = 20, before = 0) => { return request.get(`/top/playlist/highquality?limit=${limit}&before=${before}`, {}) }
// 精品歌单标签
export const reqHighqualitytag = () => { return request.get('/playlist/highquality/tags', {}) }
// 歌单分类
export const reqCatList = () => { return request.get('/playlist/catlist', {}) }
// 歌单详情
export const reqPlayListDetail = (id) => { return request.get(`/playlist/detail?id=${id}`, {}) }
// 歌单收藏用户
export const reqPlayListSCollect = (id) => { return request.get(`/playlist/subscribers?id=${id}`, {}) }
// 相关歌单推荐
export const reqPlayListRelated = (id) => { return request.get(`/related/playlist?id=${id}`, {}) }
// 歌单评论
export const reqPlayListComment = (id, limit = 8) => { return request.get(`/comment/playlist?id=${id}&limit=${limit}`, {}) }
// 收藏、取消歌单 1：收藏 2取消
export const reqSubPlayList = ({ t = 1, id = '' }) => { return request.get(`/playlist/subscribe?t=${t}&id=${id}`, {}) }
// 获取用户歌单
export const reqPlaylistUser = ({ uid = '', limit = 30, offset = 0 }) => { return request.get(`/user/playlist?uid=${uid}&limit=${limit}&offset=${offset}`, {}) }
// 添加歌曲到歌单
export const reqaddPlayList = ({ op = 'add', pid = '', tracks = '' }) => { return request.get(`/playlist/tracks?op=${op}&pid=${pid}&tracks=${tracks}`, {}) }

/* ********* 歌曲 ********* */
// 歌曲详情 多个id , 隔开
export const reqSongDetail = ({ ids = '', timestamp = 0 }) => { return request.post(`/song/detail?timestamp=${timestamp}`, { ids: ids }) }
// 获取音乐URL
export const reqSongUrl = (id) => { return request.get(`/song/url?id=${id}`, {}) }
// 喜欢歌曲
export const reqLikeSong = ({ id = '', like = false }) => { return request.get(`/like?id=${id}&like=${like}`, {}) }
// 歌词
export const reqLyric = (id) => { return request.get(`/lyric?id=${id}`, {}) }
// 获取相似音乐
export const reqSimiSong = (id) => { return request.get(`/simi/song?id=${id}`, {}) }
// 包含这首歌的歌单
export const reqSimiPlayList = (id) => { return request.get(`/simi/playlist?id=${id}`, {}) }

/* ********* 歌曲评论 ********* */
// 歌曲评论
export const reqCommentSong = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => { return request.get(`/comment/music?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {}) }
/*
    * 发送/删除评论
    * t: 0删除 1发送 2回复
    * type: 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
    * id: 对应资源id
    * content: 发送的内容/对应内容的id
    * commentId: 回复的评论id
*/
export const reqComment = ({ t = 1, type = 0, id = '', content = '', commentId = '' }) => { return request.get(`/comment?t=${t}&type=${type}&id=${id}&content=${content}&commentId=${commentId}`, {}) }
/*
    * 给评论点赞
    * id: 对应资源id
    * cid: 评论id
    * t: 是否点赞 1: 是  0: 取消
    * type: 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
*/
export const reqCommentLike = ({ id = '', cid = '', t = 1, type = 0 }) => { return request.get(`/comment/like?id=${id}&cid=${cid}&t=${t}&type=${type}`, {}) }

/* ********* 专辑 ********* */
// 获取专辑内容
// 新碟上架
export const reqAlbumNewset = () => { return request.get(`/top/album`, {}) }
// 最新专辑 /album/newest
export const reqNewAlbum = () => { return request.get('/album/newest', {}) }
// 全部新碟 /album/new
export const reqAllNewAlbum = (offset = 0, area) => { return request.get(`/album/new?area=${area}&offset=${offset}`, {}) }
// 专辑详情
export const reqAlbum = (id) => { return request.get(`/album?id=${id}`, {}) }
// 专辑动态信息
export const reqAlbumDynamic = (id) => { return request.get(`/album/detail/dynamic?id=${id}`, {}) }
// 专辑是否收藏
export const reqAlbumSub = ({ id = '', t = 1 }) => { return request.get(`/album/sub?id=${id}&t=${t}`, {}) }
// 专辑评论
export const reqAlbumComment = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => { return request.get(`/comment/album?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {}) }

/* ********* 歌手 ********* */
// 歌手描述
export const reqArtistDesc = (id) => { return request.get(`/artist/desc?id=${id}`, {}) }
// 歌手详情
export const reqArtistDetail = (id) => { return request.get(`/artist/detail?id=${id}`, {}) }
// 歌手全部歌曲 /artist/songs
export const reqArtistSongs = (id, limit = 30, offset = 0) => { return request.get(`/artist/songs?id=${id}&limit=${limit}&offset=${offset}`, {}) }

// 歌手热门歌曲
export const reqArtists = (id) => { return request.get(`/artists?id=${id}`, {}) }
// 收藏/取消收藏歌手
export const reqArtistSub = (id, t = '1') => { return request.get(`/artist/sub?id=${id}&t=${t}`, {}) }
// 获取歌手专辑
export const reqArtistAlbum = (id = '', limit = 30, offset = 0) => { return request.get(`/artist/album?id=${id}&limit=${limit}&offset=${offset}`, {}) }
// 获取歌手 mv
export const reqArtistMv = (id, limit = 50, offset = 0) => { return request.get(`/artist/mv?id=${id}&limit=${limit}&offset=${offset}`, {}) }
// 获取相似歌手 /simi/artist
export const reqSimiArtist = (id) => { return request.get(`/simi/artist?id=${id}`, {}) }

// 获取歌手列表
/*
    * 给评论点赞
    * type: -1:全部; 1:男歌手; 2:女歌手; 3:乐队
    * area: -1:全部; 7华语; 96欧美; 8:日本; 16韩国; 0:其他
    * initial: 按首字母索引查找参数, 热门传-1, #传0
    * limit: 30
    * offset: 0
*/
export const reqArtistList = ({ type = -1, area = -1, initial = '', limit = 50, offset = 0 }) => { return request.get(`/artist/list?type=${type}&area=${area}&initial=${initial}&limit=${limit}&offset=${offset}`, {}) }

// 收藏的歌手列表
export const reqSubArtist = () => { return request.get('/artist/sublist', {}) }

/* ********* MV ********* */
// 最新MV
export const reqGetNewMv = (area = "") => { return request.get(`/mv/first?area=${area}`, {}) }
// 获取全部mv
export const reqMv = (area = "", type = "", order = "", offset = 0) => { return request.get(`/mv/all?area=${area}&type=${type}&order=${order}&offset=${offset}`, {}) }
// 获取mv详情
export const reqMvDetail = (id) => { return request.get(`/mv/detail?mvid=${id}`, {}) }
// 获取mv点赞转发评论数数据 /mv/detail/info
export const reqMvDetailInfo = (id) => { return request.get(`/mv/detail/info?mvid=${id}`, {}) }
// 获取mv地址
export const reqMvUrl = ({ id = '', r = 1080 }) => { return request.get(`/mv/url?id=${id}&r=${r}`, {}) }
// 获取mv评论
export const reqCommentMv = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => { return request.get(`/comment/mv?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {}) }
// 相似mv
export const reqSimiMv = (id) => { return request.get(`/simi/mv?mvid=${id}`, {}) }

/* ********* 排行榜 ********* */
// 排行榜
export const reqTopList = () => { return request.get('/toplist', {}) }
// 所有榜单内容摘要
export const reqTopListDetail = () => { return request.get('/toplist/detail', {}) }
// 歌单详情
export const reqListDetail = (id) => { return request.get(`/playlist/detail?id=${id}`, {}) }

/* ********* video ********* */
// 视频播放地址
export const reqVideoUrl = ({ id = '', r = 1080 }) => { return request.get(`/video/url?id=${id}&r=${r}`, {}) }
// 获取 video 详情
export const reqVideoDetail = ({ id = '' }) => { return request.get(`/video/detail?id=${id}`, {}) }
// 相似video
export const reqSimiVideo = ({ id = '' }) => { return request.get(`/related/allvideo?id=${id}`, {}) }
// 获取video评论
export const reqCommentVideo = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => { return request.get(`/comment/video?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {}) }

// 热门话题
export const reqHotTopic = (limit = 20, offset = 0) => { return request.get(`/hot/topic?limit=${limit}&offset=${offset}`, {}) }
// 热门歌手
export const reqGetHotArtists = () => { return request.get(`/top/artists`, {}) }

// 热门电台
export const reqGetHotDj = () => { return request.get(`/dj/hot`, {}) }
