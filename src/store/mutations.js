
export default {
    SET_LOGIN (state, val = false) {
        state.isLogin = val
    },
    setUserInfo (state, val) {
        state.userInfo = val
    },
    setLoginDialog(state, val) {
        state.loginDialogVisible = val
    },
    SET_PLAYSTATUS (state, val = false) {
        state.isPlayed = val
    },
    SET_PLAYLIST (state, val = null) {
        state.playList = val
        window.localStorage.setItem('playList', JSON.stringify(val))
    },
    SET_PLAYINDEX (state, val = 0) {
        state.playIndex = val
        window.localStorage.setItem('playIndex', val)
    },
    SET_PLAYLISTTIPS (state, val = false) {
        state.isShowPlayListTips = val
    },
}
