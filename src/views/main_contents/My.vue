<template>
  <div class="my">

    <!-- 头部 -->
    <div class="header" @click="photo(userInfo.userBg)" :style="{background: ' url(' + userInfo.userBg + ') no-repeat center center / cover'}">
      <div class="user-info clearfix" @click.stop>
        <div class="info-box fl">
          <div class="username">{{userInfo.nickName}}</div>
          <div class="desc">{{userInfo.desc === '' ? '这个人很懒，什么都没留下~' : userInfo.desc}}</div>
        </div>
        <div class="img-box fl" @click.stop="photo(userInfo.userImg)">
          <img class="auto-img" :src="userInfo.userImg" />
        </div>
      </div>
      <div class="set-bg" @click.stop>
        <van-icon name="photograph" />
        <van-uploader max-size="512000" @oversize="tip('图片超出可上传大小')" :after-read="updatePhoto" class="v-uploader" />
      </div>
    </div>

    <!-- 操作列表 -->
    <div class="tool-list">
      <div class="item" @click="toPage(item.name)" v-for="(item, index) in toolList" :key="index">
        <div class="img-box fl">
          <van-icon :name="item.iconName" />
        </div>
        <div class="text fl">{{item.title}}</div>
        <div class="to fr">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 查看图片 -->
    <van-overlay class="overlay-box" :show="photoShow" @click="photoShow = false">
      <div class="wrapper">
        <img class="img-box" :src="url">
      </div>
    </van-overlay>
  </div>
</template>

<script>

  import { utils } from '@/utils/utils'
  export default {
    name: 'My', 
    data() {
      return {
        // 控制查看图片遮罩层
        photoShow: false,
        // 图片地址
        url: null,
        // 操作列表
        toolList: [
          {name: 'ProData', title: '个人资料', iconName: 'manager'},
          // {name: 'My', title: '我的订单', iconName: 'balance-list'},
          {name: 'My', title: '我的预约', iconName: 'clock'},
          {name: 'Like', title: '我的收藏', iconName: 'like'},
          {name: 'My', title: '我的足迹', iconName: 'browsing-history'},
          {name: 'My', title: '我的优惠券', iconName: 'coupon'},
          {name: 'Setting', title: '安全与设置', iconName: 'setting'},
        ],
         
        // 用户信息
        userInfo: {}
      }
    },
    created() {
      this.getMyData();
    },
    methods: {
      // 查看图片
      photo(url) {
        this.url = url;
        this.photoShow = true;
      },
      // 跳转页面
      toPage(path) {

        if (path == 'My') {
          this.$toast('还没有开发此功能~^-^~');
          return 
        }
        this.$router.push({name: path});
      },

      // 获取我的数据
      getMyData() {

        this.$toast.loading({
          message: '稍等...',
          forbidClick: true,
          duration: 0
        });

        let token = utils.getToken.call(this);
        this.axios({
          method: 'get',
          url: '/findMy',
          params: {
            appkey: this.appkey,
            tokenString: token
          }
        })
        .then(v => {

          if (v.data.code === 'A001') {
            
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

      // 上传图片
      updatePhoto(file) {
        
        let token = utils.getToken.call(this);
        let imgType = file.file.type.split('/')[1];
        let serverBase64Img = file.content.split(',')[1];
        this.axios({
          method: 'post',
          url: '/updateUserBg',
          data: {
            appkey: this.appkey,
            tokenString: token,
            imgType,
            serverBase64Img
          },
          transformRequest: utils.transformRequest
        })
        .then(v => {
         
          if (v.data.code === 'I001') {
            this.$toast('背景上传成功')
            console.log('背景上传成功');

            this.userInfo.userBg = v.data.userBg;
          }
        })

      }

    }
  }
</script>

<style lang="less" scoped>

  .my {
    height: 100%;
    overflow: auto;
    background: #f0e4ca;
    .header {
      position: relative;
      height: 200px;
      background: url(../../assets/images/user-bg.jpg) no-repeat center center / cover;
      .user-info {
        position: absolute;
        bottom: -20px;
        right: 20px;
        height: 80px;
        .info-box {
          width: 195px;
          height: 80px;
          margin-right: 12px;
          .username {
            margin-bottom: 4px;
            text-align: right;
            color: #fff;
            text-shadow: 1px 1px 4px #000;
            font-size: 20px;

            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .desc {
            height: 25px;
            padding: 0 5px;
            line-height: 25px;
            text-align: center;
            font-size: 14px;
            border-radius: 12px;
            background: rgba(255, 255, 255, .65);
            color: #666;

            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .img-box {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          background: #eee;
        }
      }
      .set-bg {
        position: absolute;
        right: 12px;
        top: 10px;
        font-size: 28px;
        .v-uploader {
          position: absolute;
          top: 0;
          left: 0;
          height: 37px;
          width: 28px;
          overflow: hidden;
          opacity: 0;
          z-index: 1;
        }
      }
    }
    .tool-list {
      padding: 20px 0 0;
      font-size: 16px;
      .item {
        height: 50px;
        padding: 0 15px;
        border-bottom: 1px solid #e4dac2;
        .img-box {
          font-size: 28px;
          margin-top: 9px;
          margin-right: 15px;
        }
        .text {
          line-height: 50px;
          letter-spacing: 1px;
        }
        .to {
          margin-top: 15px;
        }
      }
      .item:active {
        background: rgba(0, 0, 0, .15);
      }
    }
    .overlay-box {
      z-index: 1000;
      background: rgba(0, 0, 0, .85);
      .wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: auto;
        width: 100%;
        .img-box {
          display: block;
          width: 100%;
          height: auto;
        }
      }
    }
  }

</style>