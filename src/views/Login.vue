<template>

  <div class="login-box">
    <div class="login">
      <div class="login-logo">
        <img class="auto-img" src="@/assets/images/logo.png" />
      </div>
      <div class="login-info">
        <div class="login-username">
          <div class="tip"><img src="@/assets/images/phone-icon.png" /><span v-show="userNameInfo.isShow">请输入手机号</span></div>
          <div v-show="userNameInfo.isShowPass" class="tip-pass">11位数字的正确号码!</div>
          <input :class="{pass: userNameInfo.isPass === 1, 'no-pass': userNameInfo.isPass === 0}" type="text" v-model="userNameInfo.value" @focus="hide('userName')" @blur="showP({key: 'userName', reg: /^[1][3,4,5,7,8][0-9]{9}$/})" />
        </div>
        <div class="login-password">
          <div class="tip"><img class="m-img" src="@/assets/images/password-icon.png" /><span v-show="passWordInfo.isShow">请输入密码</span></div>
          <div v-show="passWordInfo.isShowPass" class="tip-pass">最少6位，大小写字母、数字、特殊字符各含一个!</div>
          <input :class="{pass: passWordInfo.isPass === 1, 'no-pass': passWordInfo.isPass === 0}" :type="passWordInfo.isHide ? 'password' : 'text'" v-model="passWordInfo.value" @focus="hide('passWord')" @blur="showP({key: 'passWord', reg: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).{6,}$/})" />
          <div @click="show('passWord')" class="eye">
            <img class="auto-img" :src="passWordInfo.isHide ? $store.state.eyeIcon.hideUrl: $store.state.eyeIcon.showUrl" />
          </div>
        </div>
      </div>
      <div class="login-tool">
        <div class="fl" @click="toPage({name: 'Logon'})">立即注册</div>
        <div class="fr" @click="toPage({name: 'Email'})">忘记密码？</div>
      </div>
      <div class="submit" @click="next">确定</div>
      <div class="footer">
        <div><img src="@/assets/images/qq.png" /></div>
        <div><img src="@/assets/images/weixin.png" /></div>
        <div><img src="@/assets/images/weibo.png" /></div>
      </div>
      <div class="line-box">
        <span class="line fl"></span>
        其它方式登录
        <span class="line fr"></span>
      </div>
    </div>
    <div class="skip" @click="toPage({name: 'Home'})">
      跳过
    </div>
  </div>
  
</template>

<script>

import { utils } from '@/utils/utils'

  export default {
    computed: {
      userNameInfo() {
        return this.$store.state.LoginModule.userName;
      },
      passWordInfo() {
        return this.$store.state.LoginModule.passWord;
      }
    },
    methods: {
      // 控制密码可不可见
      show(key) {
        this.$store.commit('LoginModule/show', key);
      },
      // 得到焦点
      hide(key) {
        this.$store.commit('LoginModule/hide', key);
      },
      // 失去焦点
      showP(obj) {
        this.$store.commit('LoginModule/showP', obj);
      },
      // 页面跳转
      toPage(path) {
        this.$router.push(path);
      },
      // 确定后的下一步
      next() {
        if (this.userNameInfo.value == '' ||
            this.passWordInfo.value == '' ||
            this.userNameInfo.isShowPass  ||
            this.passWordInfo.isShowPass) {
              console.log('不通过...');

              this.$toast('请输入正确格式');

              return;
            }else {
              console.log('通过...');

              this.$toast.loading({
                message: '登录中...',
                forbidClick: true,
                duration: 0
              });

              // 发起请求
              this.axios({

                method: 'post',
                url: '/login',
                data: {
                  appkey: this.appkey,
                  password: this.passWordInfo.value,
                  phone: this.userNameInfo.value
                },
                transformRequest: utils.transformRequest,

              })
              .then(v => {
                
                this.$toast.clear();
                console.log(v);

                if(v.data.code === 202) {
                  this.$toast('手机号或密码不正确!');
                  this.$store.commit('LogonModule/reset');
                }

                if(v.data.code === 201) {
                  this.$toast('手机号未注册!');
                  this.$store.commit('LogonModule/reset');
                }

                if (v.data.code === 200) {
                  this.$toast('登录成功!');

                  // 保存token到cookies中
                  let token = v.data.token.split('.');
                  let time = 30 * 24 * 60 * 60   // 30天

                  token.forEach((v, i) => {
                    this.$cookies.set('l' + i, v, time);
                  })

                  this.$store.commit('MainModule/toName', {self: this, name: 'Home', active: '0'});
                }

              })
            }
      }
    }
  }
</script>

<style lang="less" scoped>

  @import '../assets/style/register.less';

  .login-logo {
    width: 250px;
    height: 150px;
    margin: 55px auto 0px;
  }
  .login-box {
    .login {
      .footer {
        bottom: -200px;
      }
      .line-box {
        bottom: -120px;
      }
    }

  }
  .skip {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 60px;
    height: 35px;
    border-radius: 35px;
    text-align: center;
    line-height: 35px;
    font-size: 15px;
    color: #fff;
    background: rgba(0, 0, 0, .45);
  }

</style>