<template>
  <div class="login-box">
    <vHead :to="{name: 'Login'}">注册</vHead>
    <div class="login">
      <div class="login-info">
        <div class="login-username">
          <div class="tip"><img src="@/assets/images/phone-icon.png" /><span v-show="userNameInfo.isShow">请输入手机号</span></div>
          <div v-show="userNameInfo.isShowPass" class="tip-pass">11位数字的正确号码!</div>
          <input :class="{pass: userNameInfo.isPass === 1, 'no-pass': userNameInfo.isPass === 0}" type="text" v-model="userNameInfo.value" @focus="hide('userName')" @blur="showP({key: 'userName', reg: /^[1][3,4,5,7,8][0-9]{9}$/})" />
        </div>
        <div class="login-username">
          <div class="tip">
            <img class="code" src="@/assets/images/code.png" />
            <span v-show="ifyCodeInfo.isShow">请输入验证码</span>
          </div>
          <div v-show="ifyCodeInfo.isShowPass" class="tip-pass y-pass">验证码错误!</div>
          <div class="get-code" @click="getCode" :class="{disable: ifyCodeInfo.isProhibit}">{{ifyCodeInfo.codeText}}</div>
          <input :class="{pass: ifyCodeInfo.isPass === 1, 'no-pass': ifyCodeInfo.isPass === 0}" type="text" v-model="ifyCodeInfo.value" @focus="hide('ifyCode')" @blur="showP({key: 'ifyCode', reg: '^' + ifyCodeInfo.code + '$'})" />
        </div>
        <div class="login-password">
          <div class="tip"><img class="m-img" src="@/assets/images/password-icon.png" /><span v-show="passWord1Info.isShow">请输入密码</span></div>
          <div v-show="passWord1Info.isShowPass" class="tip-pass">最少6位，大小写字母、数字、特殊字符各含一个!</div>
          <input :class="{pass: passWord1Info.isPass === 1, 'no-pass': passWord1Info.isPass === 0}" :type="passWord1Info.isHide ? 'password' : 'text'" v-model="passWord1Info.value" @focus="hide('passWord1')" @blur="showP({key: 'passWord1', reg: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).{6,}$/})" />
          <div @click="show('passWord1')" class="eye">
            <img class="auto-img" :src="passWord1Info.isHide ? $store.state.eyeIcon.hideUrl: $store.state.eyeIcon.showUrl" />
          </div>
        </div>
        <div class="login-password">
          <div class="tip"><img class="m-img" src="@/assets/images/password-icon.png" /><span v-show="passWord2Info.isShow">确认密码</span></div>
          <div v-show="passWord2Info.isShowPass" class="tip-pass">两次密码不一致！</div>
          <input :class="{pass: passWord2Info.isPass === 1, 'no-pass': passWord2Info.isPass === 0}" :type="passWord2Info.isHide ? 'password' : 'text'" v-model="passWord2Info.value" @focus="hide('passWord2')" @blur="showP({key: 'passWord2', reg: '^' + passWord1Info.value + '$'})" />
          <div @click="show('passWord2')" class="eye">
            <img class="auto-img" :src="passWord2Info.isHide ? $store.state.eyeIcon.hideUrl: $store.state.eyeIcon.showUrl" />
          </div>
        </div>
      </div>
      <div class="login-tool">
        <div class="fr">
          已有账号？<span class="to-login" @click="toPage({name: 'Login'})">登录</span>
        </div>
      </div>
      <div class="submit" @click="next">确定</div>
      <div class="footer">
        <div>
          <img src="@/assets/images/qq.png" />
        </div>
        <div>
          <img src="@/assets/images/weixin.png" />
        </div>
        <div>
          <img src="@/assets/images/weibo.png" />
        </div>
      </div>
      <div class="line-box">
        <span class="line fl"></span>
        其它方式登录
        <span class="line fr"></span>
      </div>
    </div>
  </div>
</template>

<script>

import { utils } from '@/utils/utils'

export default {
  computed: {
    userNameInfo() {
      return this.$store.state.LogonModule.userName
    },
    ifyCodeInfo() {
      return this.$store.state.LogonModule.ifyCode

    },
    passWord1Info() {
      return this.$store.state.LogonModule.passWord1

    },
    passWord2Info() {
      return this.$store.state.LogonModule.passWord2

    }
  },
  methods: {
    // 控制密码可不可见
    show(key) {
      this.$store.commit('LogonModule/show', key);
    },
    // 得到焦点
    hide(key) {
      this.$store.commit('LogonModule/hide', key);
      
    },
    // 失去焦点
    showP(obj) {
      this.$store.commit('LogonModule/showP', obj);

    },
    toPage(path) {
      this.$router.push(path);
    },
    getCode() {
      
      if (this.ifyCodeInfo.isProhibit) {
        return
      }
      let code = '';
      for (let i = 0; i < 4; i++) {
        let temp = this.$store.state.code[Math.floor(Math.random() * this.$store.state.code.length)];
        code += temp;
      }
      this.$dialog.alert({
        title: '验证码',
        message: code
      }).then(() => {
        this.$store.commit('LogonModule/changeCode', code);
      });
    },
    // 确定后的下一步
    next() {
      if (this.userNameInfo.value == ''  ||
          this.ifyCodeInfo.value == ''   ||
          this.passWord1Info.value == '' ||
          this.passWord2Info.value == '' ||
          this.userNameInfo.isShowPass   ||
          this.passWord1Info.isShowPass  ||
          this.passWord2Info.isShowPass  ||
          this.passWord1Info.value != this.passWord2Info.value ||
          this.ifyCodeInfo.isShowPass) {
            console.log('不通过...');

            this.$toast('请输入正确格式');

            return;
          }else {
            console.log('通过...');

            this.$toast.loading({
              message: '注册中...',
              forbidClick: true,
              duration: 0
            });

            // 发起请求
            this.axios({

              method: 'post',
              url: '/register',
              data: {
                appkey: this.appkey,
                nickName: 'id_' + (+new Date()),
                phone: this.userNameInfo.value,
                password: this.passWord1Info.value
              },
              transformRequest: utils.transformRequest,

            })
            .then(v => {
              
              this.$toast.clear();
              console.log(v);

              if(v.data.code === 102) {
                this.$toast('手机号已被注册!');
                this.$store.commit('LogonModule/reset');
              }

              if (v.data.code === 100) {
                this.$toast('恭喜你,注册成功!');

                this.$router.push({name: 'Login'});
              }

            })
            
          }
    }
  }
};
</script>

<style lang="less" scoped>

  @import '../assets/style/register.less';
  
  .login-box {
    .login {
      position: relative;
      z-index: 1;
      .login-info {
        margin-top:125px;
        .code {
          width: 22px !important;
          margin-left: 5px;
          margin-right: 11px !important;
        }
        .y-pass {
          right: 124px;
        }
        .get-code {
          position: absolute;
          top: 0;
          right: 8px;
          width: 100px;
          height: 35px;
          border: 1px solid #fff;
          border-radius: 8px;
          text-align: center;
          line-height: 35px;
          font-size: 14px;
        }
        .get-code:active {
          background: rgba(0, 0, 0, .35);
        }
        .disable {
          border: 1px solid rgba(255, 255, 255, .35) !important;
          background: rgba(255, 255, 255, .35) !important;
          color: #aaa !important;
        }
      }
      span.to-login {
        color: blue;
      }
    }
  }
  .login-box::after {
    content: "";
    width: 104%;
    height: 104%;
    position: absolute;
    left: -2%;
    top: -2%;
    background: inherit;
    filter: blur(4px);
  }
</style>