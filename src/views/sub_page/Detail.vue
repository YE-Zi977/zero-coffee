<template>
  <div class="detail">

    <vHead :to="{name: $store.state.historyUrl}">商品详情</vHead>

    <div class="content-box">

      <div class="img-box">
        <img class="auto-img" :src="detailData.large_img" />
      </div>

      <div class="top-box">
        <div class="head clearfix">
          <div class="fl">{{detailData.name}}</div>
          <div class="fr like">
            <van-icon @click="toggleLike" name="like" :color="isLike ? '#c92f31' : '#f2f3f5'"></van-icon>
          </div>
        </div>
        <div class="flavor">
          <div class="fv clearfix" :class="{'end-line': item.isEnd === true}" v-for="(item, index) in flavor" :key="index">
            <span class="ft fl">{{item.name}}</span>
            <span @click="toggle(item.select, i)" class="fa fl" :class="{active: v.isActive}" v-for="(v, i) in item.select" :key="i">{{v.title}}</span>
          </div>
          
        </div>
      </div>

      <div class="desc">
        <div class="title">咖啡物语</div>
        <div class="desc-content">{{detailData.desc}}</div>
      </div>

      <div class="price-box">
        <div class="price fl">{{detailData.price | price}}</div>
        <div class="count fr">
          <van-stepper v-model="count" disable-input />
        </div>
      </div>

    </div>

    <div class="shop-box">
      <div class="shop-btn-left fl" @click="addShopping()">
        <div class="column-count" v-if="columnCount != '0'">{{columnCount}}</div>
        <van-button class="btn" square block color="#3a2313">加入购物车</van-button>
      </div>
      <div class="shop-btn-right fr" @click="toPage">
        <van-button class="btn" square block color="#561610">立即购买</van-button>
      </div>
    </div>

  </div>
</template>

<script>

  import { utils } from '@/utils/utils'

  export default {
    name: 'Detail',
    data() {
      return {
        count: 1,
        // 详情数据
        detailData: {},
        // 口味
        flavor: [],
        // token
        token: '',
        // 是否收藏
        isLike: false,
        columnCount: 0
      }
    },
    created() {

      if (this.$store.state.detailPid == '') {
        this.$router.push({name: this.$store.state.historyUrl});
        return;
      }

      this.token = utils.getToken.call(this);
      this.load();
      this.findLike();
      this.getcolumnCount();
    },
    methods: {

      // 加载资源
      load() {
  
        // 等待
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        });
  
        //根据pid请求数据
        this.axios({
          method: 'get',
          url: '/productDetail',
          params: {
            appkey: this.appkey,
            pid: this.$store.state.detailPid
          }
        })
        .then(v => {
  
          this.$toast.clear();
  
          if (v.data.code === 600 && v.data.result.length > 0) {
            console.log('请求详情页成功');
  
            this.detailData = v.data.result[0];
  
            if (this.detailData.cream != '') {
  
              this.flavor.push({select: this.split(this.detailData.cream), name: this.detailData.cream_desc});
            }
            if (this.detailData.milk != '') {
  
              this.flavor.push({select: this.split(this.detailData.milk), name: this.detailData.milk_desc});
            }
            if (this.detailData.sugar != '') {
  
              this.flavor.push({select: this.split(this.detailData.sugar), name: this.detailData.sugar_desc});
            }
            if (this.detailData.tem != '') {
  
              this.flavor.push({select: this.split(this.detailData.tem), name: this.detailData.tem_desc});
            }
  
            this.flavor[this.flavor.length - 1].isEnd = true;
  
          }
  
        })
        
      },

      // 获取收藏信息
      findLike() {
        console.log(this.token)
        this.axios({
          method: 'get',
          url: '/findlike',
          params: {
            appkey: this.appkey,
            pid: this.$store.state.detailPid,
            tokenString: this.token
          }
        })
        .then(v => {

          if (v.data.code === 1000) {
            console.log('收藏查询成功');
            this.isLike = v.data.result.length > 0 ? true : false;
          }
        })
      },

      // 是否收藏
      toggleLike() {

        if (this.isLike) {
          this.isLike = false;
          this.re('/notlike')
          .then(v => {
            if (v.data.code === 900) {
              this.$toast('已取消收藏');
              console.log('取消收藏成功');
            }
          })

          return
        }

        this.isLike = true;

        this.re('/like')
        .then(v => {
          if (v.data.code === 800) {
            this.$toast('收藏成功');
            console.log('收藏成功');
          }
        })
      },

      // 请求
      re(url) {
        return this.axios({
          method: 'post',
          url: url,
          data: {
            appkey: this.appkey,
            pid: this.$store.state.detailPid,
            tokenString: this.token
          },
          transformRequest: utils.transformRequest
        })
      },

      // 切割
      split(str) {
        let arr = [];
        let temp = str.split('/');
        temp.forEach(v => {
          arr.push({title: v, isActive: false});
        })

        return arr;
      },

      // 切换
      toggle(item, index) {
        if (item[index].isActive) {
          item[index].isActive = false;
          return
        }

        for (let i = 0; i < item.length; i++) {
          if (item[i].isActive) {
            item[i].isActive = false;
            break;
          }
        }

        item[index].isActive = true;
      },

      // 添加到购物车
      addShopping(bool) {

        this.$toast.loading({
          message: '稍等...',
          forbidClick: true,
          duration: 0
        });

        let rule = '';

        this.flavor.forEach(value => {
          value.select.forEach(v => {

            if (v.isActive) {
              rule += v.title + '/'
            }
          })
        })

        rule = rule.slice(0, -1);

        this.axios({
          method: 'post',
          url: '/addShopcart',
          data: {
            pid: this.$store.state.detailPid,
            count: this.count,
            rule,
            appkey: this.appkey,
            tokenString: this.token
          },
          transformRequest: utils.transformRequest
        })
        .then(v => {
          
          if (v.data.code === 3000) {
            this.$toast.clear();

            if (bool === true) {
              let data = {
                name: this.detailData.name,
                price: this.detailData.price,
                count: this.count,
                imgUrl: this.detailData.small_img,
                pid: this.detailData.pid,
                sid: v.data.sid,
                flavor: []
              };

              this.flavor.forEach(value => {
                value.select.forEach(v => {

                  if (v.isActive) {
                    data.flavor.push(v.title);
                  }
                })
              })

              let temp = [];
              temp.push(data);
              
              this.$store.commit('SettlementModule/getOrder', temp);
              this.$router.push({name: 'Settlement'});
              return;
            }

            console.log('加入购物车成功');
            this.$toast('加入购物车成功');

            if (v.data.status === 1) {

              this.columnCount ++;
            }
            
          }
        })


      },

      // 获取购物车总条目数
      getcolumnCount() {

        this.axios({
          method: 'get',
          url: '/shopcartRows',
          params: {
            appkey: this.appkey,
            tokenString: this.token
          }
        })
        .then(v => {
          if (v.data.code === 8000) {
            console.log('购物车条目数查询成功');
            this.columnCount = v.data.result;
          }
        })

      },

      // 跳转
      toPage() {

        // 加入到购物车
        this.addShopping(true);

      }
    },
    filters: {
      price(v) {
        return '￥' + parseFloat(v).toFixed(2);
      }
    }
  }
</script>

<style lang="less" scoped>

  .detail {
    padding-top: 65px;
    height: calc(100% - 65px);
    overflow: hidden;
    .content-box {
      height: calc(100% - 50px);
      overflow: auto;
      background: #f0e3c9;
      .img-box {
        width: 100%;
        height: 249px;
      }
      .top-box {
        background: #fff;
        padding: 20px 10px 0;
        .head {
          font-size: 18px;
          font-weight: bold;
          color: #555;
          .like {
            font-size: 24px;
          }
        }
        .flavor {
          margin-top: 10px;
          font-size: 16px;
          line-height: 30px;
          .fv {
            height: 30px;
            padding-bottom: 20px;
          }
          .end-line {
            border-bottom: 1px solid #f0e3c9;
          }
          .fa {
            width: 80px;
            height: 30px;
            margin-left: 25px;
            text-align: center;
            line-height: 30px;
            background: #e5e5e5;
            border-radius: 15px;
            color: #fff;
          }
          .fa.active {
            background: #f0e3c9;
          }
        }
      }
      .desc {
        padding: 15px 10px 0;
        font-size: 16px;
        background: #fff;
        .desc-content {
          font-size: 15px;
          margin-top: 8px;
          color: #555;
          line-height: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f0e3c9;
        }
      }
      .price-box {
        height: 45px;
        background: #fff;
        margin-bottom: 25px;
        padding: 0 10px;
        .price {
          font-size: 20px;
          line-height: 45px;
          color: #e4393c;
        }
        .count {
          padding-top: 8px;
        }
      }
    }
    .shop-box {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 50px;
      .shop-btn-left {
        position: relative;
        width: 35%;
        .column-count {
          position: absolute;
          top: 4px;
          right: 5px;
          width: 16px;
          height: 16px;
          text-align: center;
          line-height: 16px;
          font-size: 12px;
          border-radius: 50%;
          background: #f0e3c9;
          color: #561610;
          z-index: 100;
        }
      }
      .shop-btn-right {
        width: 65%;
      }
      .btn {
        height: 50px;
        font-size: 16px;
      }
    }
  }

</style>