<template>
  <div class="settlement">

    <vHead :to="{name: $store.state.port === 1 ? 'Detail' : $store.state.port === 2 ? 'ShoppingCart' : 'Order'}" :history="{is: true}">提交订单</vHead>

    <div class="order-box">

      <div class="addr" @click="showAddr">{{addrContent}}</div>
      <van-popup
        v-model="show"
        position="bottom"
        :style="{ height: '70%' }"
        class="popup-box"
      >
        <div class="addr-list">
          <div class="addr-item" @click="hideAddr(item)" v-for="(item, index) in addrList" :key="index">
            <div class="top clearfix">
              <span class="name fl">{{item.name}}</span>
              <span class="phone fl">{{item.tel}}</span>
              <span class="tag fl"><van-tag type="primary">{{item.postalCode}}</van-tag></span>
              <span v-if="item.isDefault" class="tag fl"><van-tag type="danger">默认</van-tag></span>
            </div>
            <div class="addr-info">{{item.province + item.city + item.county + item.addressDetail}}</div>
          </div>

          <div v-if="addrList.length <= 0" class="tip">暂无地址，快去添加吧~</div>
        </div>

        <div class="add-addr" @click="addTo({name: 'AddAddr'})">
          <van-button class="add-btn" block square color="#561610">新增地址</van-button>
        </div>

      </van-popup>

      <div class="order-list">

        <div class="item" v-for="(item, index) in orderList" :key="index">
          <div class="pro clearfix">
            <div class="img-box fl">
              <img class="auto-img" :src="item.imgUrl" />
            </div>
            <div class="info fl">
              <div class="top clearfix">
                <span class="name fl">{{item.name}}</span>
                <span class="price fr">{{item.price | price}}</span>
              </div>
              <div class="bottom clearfix">
                <span class="flavor fl">{{item.flavor | flavor}}</span>
                <span class="count fr">x{{item.count}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="total-price-box clearfix">
          <span class="total-price fr">{{totalPrice | price}}</span>
          <span class="count fr">共&nbsp;{{count}}&nbsp;件商品&nbsp;&nbsp;合计：</span>
        </div>
      </div>
    </div>

    <div class="settlement-box">
      <div class="fl">应付合计： <span class="price">{{totalPrice | price}}</span></div>
      <div class="fr" @click="toPage()">
        <van-button class="settlement-btn" block square color="#561610">立即结算</van-button>
      </div>
    </div>

  </div>
</template>

<script>
  import { utils } from '@/utils/utils'
  export default {
    name: 'Settlement',
    data() {
      return {
        show: false,
        addrContent: '请选择收货地址',
        token: ''
      }
    },
    created() {

      // 获取token
      this.token = utils.getToken.call(this);

      // 查询地址
      this.getArea();

    },
    computed: {
      addrList() {
        return this.$store.state.addrList;
      },
      orderList() {
        return this.$store.state.SettlementModule.orderList;
      },
      totalPrice() {

        let totalPrice = 0;
        this.orderList.forEach(v => {
          totalPrice += parseFloat(v.price) * v.count;
        })
        return totalPrice;
      },
      count() {

        let count = 0;
        this.orderList.forEach(v => {
          count += v.count;
        })
        return count;
      }
    },
    methods: {

      // 获取地址列表
      getArea() {

        this.axios({
          method: 'get',
          url: '/findAddress',
          params: {
            appkey: this.appkey,
            tokenString: this.token
          }
        })
        .then(v => {
          
          if (v.data.code === 20000) {
            console.log('地址获取成功')
            this.$store.commit('setArea', v.data.result);

            if (this.addrList.length > 0) {
              let item = this.addrList.filter(v => v.isDefault)[0];

              let areaInfo = {};

              areaInfo.phone = item.tel;
              areaInfo.address = item.province + item.city + item.county + item.addressDetail;
              areaInfo.receiver = item.name;

              this.$store.commit('SettlementModule/setValue', {key: 'areaInfo', value: areaInfo});

              this.addrContent = areaInfo.address + "(默认)";
            }

            let areaData = this.$route.query.areaInfo;
            if (areaData != undefined) {

              this.$store.commit('SettlementModule/setValue', {key: 'areaInfo', value: areaData});
              this.addrContent = areaData.address;

            }

          }

        })
      },

      showAddr() {

        this.show = true;
      },

      hideAddr(item) {
        this.show = false;

        let areaInfo = {};

        areaInfo.phone = item.tel;
        areaInfo.address = item.province + item.city + item.county + item.addressDetail;
        areaInfo.receiver = item.name;

        this.$store.commit('SettlementModule/setValue', {key: 'areaInfo', value: areaInfo});

        this.addrContent = areaInfo.address;
      },
      
      toPage() {

        if (this.addrContent == '请选择收货地址') {
          this.$dialog({ message: '请选择收货地址' });
          return;
        }

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        });

        let timer = setTimeout(() => {
          this.$toast.clear();
          this.$router.push({name: 'InputPassword'});
        }, 1000)
      },

      addTo(path) {
        this.$store.commit('setValue', {key: 'tempUrl', value: this.$store.state.historyUrl});

        this.$store.commit('setHistoryUrl', 'Settlement');
        this.$router.push(path);
      }
    },
    filters: {
      price(v) {
        return '￥' + parseFloat(v).toFixed(2);
      },
      flavor(v) {
        if (Object.prototype.toString.call(v) !== '[object String]') {

          let temp = '';
          v.forEach(v => {
            temp += v + '/';
          })
          return temp.slice(0, -1);
        }
        return v
      }
    }
  }
</script>

<style lang="less" scoped>

  .settlement {
    padding-top: 65px;
    height: calc(100% - 65px);
    font-size: 16px;
    .order-box {
      height: calc(100% - 70px);
      padding: 10px;
      overflow-y: auto;
      background: #f0e3c9;
      .addr {
        height: 45px;
        padding-left: 10px;
        border-radius: 4px;
        line-height: 45px;
        background: #fff;
        color: #666;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .popup-box {
        .addr-list {
          position: relative;
          height: calc(100% - 50px);
          .addr-item {
            height: 52px;
            padding: 10px;
            border-bottom: 1px solid #f0e3c9;
            .top {
              height: 23px;
              line-height: 23px;
              font-weight: bold;
              .name {
                margin-right: 20px;
              }
              .tag {
                margin-left: 10px;
              }
            }
            .addr-info {
              margin-top: 10px;
              font-size: 14px;
              color: #666;
            }
          }
          .addr-item:active {
            background: rgba(0, 0, 0, .15);
          }
          .tip {
            text-align: center;
            height: 60px;
            line-height: 60px;
          }
          .add-addr {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 50px;
          }
        }
        .add-btn {
          height: 50px;
          font-size: 16px;
        }
      }
      .order-list {
        padding: 10px;
        margin-top: 35px;
        border-radius: 8px;
        background: #fff;
        .item {
          .pro {
            height: 65px;
            margin-bottom: 15px;
            .img-box {
              width: 65px;
              height: 100%;
              margin-right: 10px;
            }
            .info {
              padding: 4px 0;
              width: calc(100% - 75px);
              .top {
                height: 36px;
                font-size: 15px;
                .name {
                  width: 170px;
                  font-weight: bold;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                .price {
                  color: #e4393c;
                }
              }
              .bottom {
                font-size: 14px;
                color: #666;
              }
            }
          }
        }
        .total-price-box {
          padding-bottom: 8px;
          border-bottom: 1px solid #f0e3c9;
          color: #333;
          .total-price {
            font-weight: bold;
            color: #e4393c;
          }
        }
      }
    }
    .settlement-box {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0px;
      height: 50px;
      z-index: 99;
      line-height: 50px;
      padding-left: 10px;
      .price {
        color: #e4393c;
        font-weight: bold;
      }
      .settlement-btn {
        height: 50px;
        width: 120px;
      }
    }
  }

</style>