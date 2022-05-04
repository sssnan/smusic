<template>
  <div class="loginDialog" @mousewheel.prevent>
    <div class="loginContainer">
      <div :class="['form-box', isPwd ? 'appear' : 'fade']">
        <div :class="['login-pwd', { hidden: !isPwd }]">
          <div class="loginForm">
            <h1>密码登录</h1>
            <input type="text" class="loginInput" placeholder="请输入网易云音乐手机号" v-model="phone" />
            <input type="password" class="loginInput" placeholder="请输入网易云音乐密码" v-model="pwd" />
            <button class="loginBtn" @click="submitForm('pwd')">登录</button>
          </div>
        </div>
        <div :class="['login-captcha', { hidden: isPwd }]">
          <div class="loginForm">
            <h1>验证码登录</h1>
            <input type="text" class="loginInput" placeholder="请输入网易云音乐手机号" v-model="phone" />
            <input id="captcha" type="password" class="loginInput" placeholder="请输入验证码" v-model="captcha" />
            <button class="captchaBtn" @click="getCaptcha">
              <span v-if="codeShow">获取验证码</span>
              <span v-else class="count">{{ count }}秒后重试</span>
            </button>
            <button class="loginBtn" @click="submitForm('captcha')">登录</button>
          </div>
        </div>
      </div>
      <div class="con-box left">
        <h2>欢迎<span>登录</span></h2>
        <button id="login" @click="change('captcha')">验证码登录</button>
      </div>
      <div class="con-box right">
        <h2>欢迎<span>登录</span></h2>
        <button id="login" @click="change('pwd')">密码登录</button>
      </div>
    </div>
    <div class="mask" @click="handleClose"></div>
  </div>
</template>

<script>
import { reactive, toRefs, watch, computed } from "vue";
import { useStore } from "vuex";
import { reqGetUserInfo, reqLogin, reqCaptchaLogin, reqCaptchaSent } from "@/api";

export default {
  name: "Login",
  setup() {
    const store = useStore();
    const formInfo = reactive({
      // 手机号
      phone: "",
      // 密码
      pwd: "",
      // 验证码
      captcha: "",
      // 登陆方式
      isPwd: false,
      // 验证码获取后60秒才能再次获取
      codeShow: true,
      // 时间
      count: 0,
      // 计时器
      timer: null,
    });

    // 关闭登录弹框
    const handleClose = () => store.commit("setLoginDialog", false);

    // 监视登录状态,并刷新页面
    const isLogin = computed(() => store.getters.isLogin);

    watch(isLogin, () => {
      location.reload();
      handleClose();
    });

    // 切换登录方式
    const change = type => {
      if (type == "pwd") {
        formInfo.isPwd = true;
      } else {
        formInfo.isPwd = false;
      }
    };
    // 获取验证码
    const getCaptcha = async () => {
      const result = await reqCaptchaSent(formInfo.phone);
      if (result.code === 200) {
        ElMessage.success("验证码发送成功");
        if (!formInfo.timer) {
          // 从60开始减到0
          formInfo.count = 60;
          // 发送成功后修改按钮显示
          formInfo.codeShow = false;
          // 循环定时器,每秒让 count -1
          formInfo.timer = setInterval(() => {
            if (formInfo.count > 0 && formInfo.count <= 60) {
              formInfo.count--;
            } else {
              // 结束后修改按钮显示 同时关闭定时器
              formInfo.codeShow = true;
              clearInterval(formInfo.timer);
              formInfo.timer = null;
            }
          }, 1000);
        }
      } else {
        ElMessage.error(result.message);
      }
    };

    // 登录提交表单功能
    const submitForm = async type => {
      const { phone, pwd, captcha } = formInfo;
      let result;
      if (type == "pwd") {
        // 密码登录
        result = await reqLogin(phone, pwd);
      } else {
        // 验证码登录
        result = await reqCaptchaLogin(phone, captcha);
      }
      if (result.code === 200) {
        getUserInfo(result.profile.userId);
        window.localStorage.setItem("token", result.token);
        window.localStorage.setItem("cookie", result.cookie);
      }
    };

    // 登陆后获取用户信息
    const getUserInfo = async uid => {
      const result = await reqGetUserInfo(uid);
      if (result.code === 200) {
        window.localStorage.setItem("isLogin", true);
        window.localStorage.setItem("userInfo", JSON.stringify(result.profile));
        store.commit("SET_LOGIN", true);
        store.commit("setUserInfo", result.profile);
      }
    };

    return {
      handleClose,
      ...toRefs(formInfo),
      submitForm,
      getUserInfo,
      change,
      getCaptcha,
    };
  },
};
</script>

<style lang="less" scoped>
.loginDialog {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 150px;
  .loginContainer {
    position: fixed;
    z-index: 100;
    border-radius: 5px;
    background-color: #fff;
    width: 650px;
    height: 415px;
    border-radius: 5px;
    /* 阴影 */
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    left: 30%;
    .form-box {
      /* 绝对定位 */
      position: absolute;
      display: flex;
      top: -10%;
      left: 3%;
      background-color: #d3b7d8;
      width: 60%;
      height: 500px;
      border-radius: 5px;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      justify-content: center;
      align-items: center;
      z-index: 2;
      /* 动画过渡 加速后减速 */
      transition: 0.5s ease-in-out;
      .hidden {
        display: none;
        transition: 0.5s;
      }
      .loginBtn {
        width: 30%;
        margin-top: 35px;
        margin-left: 50px;
        background-color: #f6f6f6;
        outline: none;
        border-radius: 8px;
        padding: 13px;
        color: #a262ad;
        letter-spacing: 2px;
        border: none;
        cursor: pointer;
        letter-spacing: 2px;
      }

      .loginForm {
        display: flex;
        padding-left: 50px;
        width: 400px;
        flex-direction: column;
        h1 {
          padding-left: 50px;
          text-align: left;
        }
        button {
          outline: none;
          border-radius: 8px;
          padding: 13px;
          color: #a262ad;
          border: none;
          cursor: pointer;
          &:hover {
            background-color: #a262ad;
            color: #f6f6f6;
            transition: background-color 0.5s ease;
          }
        }
        .captchaBtn {
          position: absolute;
          width: 90px;
          height: 30px;
          line-height: 0;
          left: 70%;
          top: 53%;
          text-align: center;
        }
        .loginInput {
          display: inline-block;
          background-color: transparent;
          width: 60%;
          color: #fff;
          border: none;
          /* 下边框样式 */
          border-bottom: 3px solid rgba(255, 255, 255, 0.4);
          padding: 10px 0;
          text-indent: 10px;
          margin: 8px 0;
          font-size: 14px;
          letter-spacing: 2px;
          &:focus {
            color: #a262ad;
            outline: none;
            border-bottom: 3px solid #a262ad80;
            transition: 0.5s;
            &::placeholder {
              opacity: 0;
            }
          }
        }
      }
    }
    .con-box {
      width: 40%;
      /* 弹性布局 垂直排列 居中 */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      /* 绝对定位 居中 */
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      h2 {
        display: inline-block;
        color: #8e9aaf;
        font-size: 25px;
        font-weight: bold;
        letter-spacing: 3px;
        text-align: center;
        margin-bottom: 4px;
        color: #d3b7d8;
      }
      button {
        margin-top: 3%;
        background-color: #fff;
        color: #a262ad;
        border: 1px solid #d3b7d8;
        padding: 6px 10px;
        border-radius: 5px;
        letter-spacing: 1px;
        outline: none;
        cursor: pointer;
        &:hover {
          background-color: #d3b7d8;
          color: #fff;
        }
      }
    }
    .left {
      left: -2%;
    }
    .right {
      right: -2%;
    }
  }
  .mask {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0px;
    background: rgba(0, 0, 0, 0.442);
    z-index: 99;
  }
}

.appear {
  transform: translateX(221px);
}

.fade {
  transform: translateX(0);
}
</style>
