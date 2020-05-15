<template>
  <div class="set">

    <vHead :to="{name: 'My'}">安全与设置</vHead>

    <div class="container">

      <div class="bg-box">
        <img src="@/assets/images/set-bg.jpg" class="auto-img">
      </div>

      <div class="set-list">

        <div class="item-box clearfix" @click="toPage({name: 'IfyPassword'})">
          <span class="fl title">修改密码</span>
          <span class="fr icon"><van-icon name="arrow" /></span>
        </div>

        <div class="item-box clearfix">
          <span class="fl title">版本信息</span>
          <span class="fr desc">v 1.1.1<i class="new"></i></span>
        </div>

        <div class="btn-box">
          <van-button @click="out('/logout', 'Login')" class="btn" block round color="#dedede">退出登录</van-button>
          <van-button @click="out('/destroyAccount', 'Logon')" class="btn" block round type="danger">注销账号</van-button>
        </div>

      </div>

    </div>

  </div>
</template>

<script>

  import { utils } from '@/utils/utils'
  export default {
    name: 'Setting',
    methods: {

      // 退出登录和注销
      out(url, path) {

        this.$toast.loading({
          message: '请稍等...',
          forbidClick: true,
          duration: 0
        });

        let token = utils.getToken.call(this);
        this.axios({
          method: 'post',
          url,
          data: {
            appkey: this.appkey,
            tokenString: token
          },
          transformRequest: utils.transformRequest
        })
        .then(v => {
          this.$toast.clear();
          console.log(v.data.msg);

          // 清空cookies
          for (let i = 0; ; i++) {
            if (!this.$cookies.isKey('l' + i)) {
              break;
            }

            this.$cookies.remove('l' + i)
          }

          this.$router.push({name: path});
        })

      },

      // 跳转页面
      toPage(path) {
        this.$router.push(path);
      }
    }
  }
</script>

<style lang="less" scoped>

  .set {
    height: calc(100% - 65px);
    padding-top: 65px;
    .container {
      height: 100%;
      background: #f0e4ca;
      overflow: auto;
      .bg-box {
        height: 230px;
      }
      .set-list {
        font-size: 16px;
        .item-box {
          height: 55px;
          padding: 0 10px;
          margin-bottom: 2px;
          line-height: 55px;
          background: #fff;
          transition: background .4s linear;
          .icon, .desc {
            color: #666;
          }
          .desc {
            position: relative;
            margin-right: 10px;
            .new {
              position: absolute;
              top: 8px;
              right: -8px;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: #ff1e00;
            }
          }
        }
        .item-box:active {
          background: rgba(0, 0, 0, .15);
        }
        .btn-box {
          width: 80%;
          margin: 25px auto 0;
          .btn {
            height: 40px;
            margin-bottom: 15px;
          }
        }
      }
    }
  }

</style>