<template>
  <div class="pro-data">

    <vHead :to="{name: 'My'}">个人资料</vHead>

    <div class="container">

      <div class="photo clearfix">
        <van-uploader max-size="512000" @oversize="tip('图片超出可上传大小')" :after-read="updatePhoto" class="v-uploader" />
        <span class="fl title">头像</span>
        <span class="fr img-box"><img class="auto-img" :src="userInfo.userImg" /></span>
      </div>

      <div class="username clearfix">
        <span class="fl title">我的id</span>
        <span class="fr">{{userInfo.userId}}</span>
      </div>

      <div class="username clearfix">
        <span class="fl title">手机号</span>
        <span class="fr">{{userInfo.phone | phone}}</span>
      </div>

      <div class="username clearfix">
        <span class="fl title">我的昵称</span>

        <van-field @blur="ifyInfo('/updateNickName', 'nickName', userInfo.nickName, '昵称修改成功~')" @focus="tip('正在修改昵称~')" class="fr name" maxlength="6" v-model="userInfo.nickName" />
      </div>

      <div class="autograph clearfix">
        <span class="title fl">个性签名</span>
        <van-field
          class="auto-box fl"
          v-model="userInfo.desc"
          @focus="tip('正在修改签名~')"
          @blur="ifyInfo('/updateDesc', 'desc', userInfo.desc, '签名修改成功~')"
          rows="2"
          autosize
          type="textarea"
          maxlength="45"
          placeholder="快写下你的个性签名吧~"
          show-word-limit
        />
      </div>

      <div class="area clearfix" @click="toPage({name: 'EdiArea'})">
        <span class="fl title">收货地址</span>
        <span class="fr"><van-icon name="arrow" /></span>
      </div>

    </div>

  </div>
</template>

<script>

  import { utils } from '@/utils/utils'
  export default {
    name: 'ProData',
    data() {
      return {
        userInfo: {
          desc: '我很懒，我什么都不想留下',
          nickName: '帅气就完事了',
          phone: '15779001249',
          userId: 'id_232032903',
          userImg: 'http://www.kangliuyong.com:10002/assets/default.png'
        }
      }
    },
    created() {
      this.getUserInfo();
    },

    methods: {
      toPage(path) {
        this.$router.push(path);
      },

      // 获取账号管理信息
      getUserInfo() {

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        });

        let token = utils.getToken.call(this);
        this.axios({
          method: 'get',
          url: '/findAccountInfo',
          params: {
            appkey: this.appkey,
            tokenString: token
          }
        })
        .then(v => {

          if (v.data.code === 'B001') {
            
            this.$toast.clear();
            console.log(v.data.msg);

            this.userInfo = v.data.result[0];
          }
        })

      },
      
      // 提示信息
      tip(tipInfo) {
        this.$toast({
          message: tipInfo,
          duration: 500
        });
      },

      // 修改信息
      ifyInfo(url, key, value, tipInfo) {

        let token = utils.getToken.call(this);
        this.axios({
          method: 'post',
          url,
          data: {
            appkey: this.appkey,
            tokenString: token,
            [key]: value
          },
          transformRequest: utils.transformRequest
        })
        .then(v => {
          this.tip(tipInfo);
        })

      },

      // 上传图片
      updatePhoto(file) {
        
        let token = utils.getToken.call(this);
        let imgType = file.file.type.split('/')[1];
        let serverBase64Img = file.content.split(',')[1];
        this.axios({
          method: 'post',
          url: '/updateAvatar',
          data: {
            appkey: this.appkey,
            tokenString: token,
            imgType,
            serverBase64Img
          },
          transformRequest: utils.transformRequest
        })
        .then(v => {
          if (v.data.code === 'H001') {
            this.$toast('头像上传成功')
            console.log('头像上传成功');

            this.userInfo.userImg = v.data.userImg;
          }
        })

      }
    },

    filters: {
      phone(v) {
        v = v.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        return v;
      }
    }
  }
</script>

<style lang="less" scoped>

  .pro-data {
    height: calc(100% - 65px);
    padding-top: 65px;
    .container {
      height: 100%;
      overflow: auto;
      background: #f0e3c9;
      font-size: 16px;
      >div {
        height: 50px;
        padding: 0 10px;
        line-height: 50px;
        margin-bottom: 2px;
        background: #fff;
        color: #666;
      }
      .name {
        width: 120px;
        padding: 5px;
        margin-top: 8px;
        font-size: 16px;
        /deep/ .van-field__control {
          text-align: right;
        }
      }
      /deep/ .van-field__control {
        color: #666;
      }
      .autograph {
        height: 120px;
        .title {
          width: 100%;
          line-height: 35px;
        }
        .auto-box {
          padding: 5px;
          border-radius: 4px;
          background: #f7f7f7;
        }
      }
      .title {
        color: #333;
      }
      .img-box {
        width: 40px;
        height: 40px;
        margin-top: 5px;
        border-radius: 50%;
        overflow: hidden;
      }
      .photo {
        position: relative;
        .v-uploader {
          position: absolute;
          right: 0;
          top: 5px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          opacity: 0;
          z-index: 1;
        }
      }
    }
  }

</style>