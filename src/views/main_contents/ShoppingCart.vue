<template>
  <div class="shopping-cart">

    <!-- 顶部 -->
    <div class="header-box clearfix">
      <div class="notice-bar fl">
        <van-notice-bar
          color="#f0e3c9"
          background="rgba(86, 22, 16, .35)"
          left-icon="volume-o"
          text="在这里每一粒咖啡豆都在努力的为你迸发出最醇香的味觉体验，他们便快捷却不敷衍，为努力的你而全力绽放。"
        >
          
        </van-notice-bar>
      </div>
      <div class="ad-btn fr" @click="toggleState">{{isDel.isShowClack ? '完成' : '管理'}}</div>
    </div>

    <div class="shop-list" >

      <div class="shop-item" v-for="(item, index) in shopList" :key="index">
        <div class="item-content">
          <div class="item-top clearfix">
            <div class="check-box fl">
              <van-checkbox @change="isAll('isChecked', 'submitData')" v-model="item.isChecked"></van-checkbox>
            </div>
            <div class="img-box fl" @click="toDetail(item.pid)">
              <img class="auto-img" :src="item.small_img" />
            </div>
            <div class="shop-info-box fl">
              <div class="shop-title clearfix">
                <span class="fl">{{item.name}}</span>
                <span class="coupon fr">领券</span>
              </div>
              <div class="shop-flavor" v-if="item.rule != ''">{{item.rule}}</div>
              <div v-if="item.rule == ''" style="height: 43px;"></div>
              <div class="shop-price clearfix">
                <div class="price fl">{{item.price | firstPrice}}<span class="zero">{{item.price | lastPrice}}</span></div>
                <div class="fr">
                  <van-stepper disable-input :max="99" :button-size="21" v-model="item.count" @change="changeCount(item.sid, item.count)" integer />
                </div>
              </div>
            </div>
          </div>
          <div class="shop-active">
            <van-tag v-if="item.isShopActive" plain type="danger">本店活动</van-tag>
            <span v-if="item.isShopActive" class="aa">{{item.isActiveContent}}</span>
          </div>
        </div>
        <div v-show="isDel.isShowClack" class="item-clack">
          <div class="del-btn">
            <van-checkbox @change="isAll('isDel', 'isDel')" v-model="item.isDel"></van-checkbox>
          </div>
        </div>
      </div>

      <div class="tip" style="text-align: center; margin-top: 30px;" v-if="shopList.length <= 0">还没有商品哦，快去添加吧~^-^~</div>

    </div>

    <van-submit-bar
      v-show="!isDel.isShowClack"
      class="submit-box" 
      :price="totalPrice * 100"
      button-text="提交订单"
      @submit="onSubmit"
    >
      <van-checkbox @click="checkeAll('isChecked', submitData.checked)" v-model="submitData.checked">全选</van-checkbox>
    </van-submit-bar>

    <div class="like-box" v-if="shopList.length <= 0">

      <div class="title">猜你喜欢</div>

      <div class="like-list">
        
        <van-swipe :show-indicators="false">
          <van-swipe-item v-for="(item, index) in likeList" :key="index" @click="toDetail(item.pid)">
            <img v-lazy="item.largeImg" />
          </van-swipe-item>
        </van-swipe>

      </div>

    </div>

    <div v-show="isDel.isShowClack" class="del-box">
      <div class="all-btn fl">
        <van-checkbox @click="checkeAll('isDel', isDel.checked)" class="all-btn-color" v-model="isDel.checked">全选</van-checkbox>
      </div>

      <div class="delete-btn fr" @click="remove">
        确认删除
      </div>

    </div>

  </div>
</template>

<script>

  import { utils } from '@/utils/utils'
  export default {
    name: 'ShoppingCart',
    data() {
      return {
        shopList: [],
        isDel: {
          isShowClack: false,
          checked: false
        },
        submitData: {
          checked: false,
        },
        token: '',
        likeList: []
      }
    },
    created() {
      this.token = utils.getToken.call(this);
      this.getshopData();

      this.likeList = this.$store.state.HomeModule.columnData[0].recommendImages;
    },
    methods: {

      toDetail(pid) {

        this.$store.commit('setHistoryUrl', 'ShoppingCart');
        this.$store.commit('setDetailPid', pid);

        this.$router.push({name: 'Detail'})
      },

      // 判断是否全选
      isAll(get, set) {
        for (let i = 0; i < this.shopList.length; i++) {
          if (!this.shopList[i][get]) {
            this[set].checked = false;
            return
          }
        }

        this[set].checked = true;
      },

      toggleState() {
        if (!this.isDel.isShowClack) {
          this.isDel.isShowClack = true;
          return;
        }
        this.isDel.isShowClack = false;
      },
      checkeAll(setValue, value) {
        this.shopList.forEach(v => {
          v[setValue] = !value;
        })
      },
      onSubmit() {

        if (this.shopList.length <= 0) {
          this.$toast('还没有商品哦~');
          return;
        }
        
        // 购买已选择的商品
        let checkedPro = this.shopList.filter(v => v.isChecked);

        if (checkedPro.length <= 0) {
          this.$toast('请选择要购买的商品哦~');
          return;
        }else {

          this.$toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0
          });

          setTimeout(() => {
            this.$toast.clear();

            this.$store.commit('SettlementModule/setValue', {key: 'orderList', value: checkedPro});

            this.$store.commit('setValue', {key: 'port', value: 2});
            this.$router.push({name: 'Settlement'});
          }, 1000)
        }
      },

      // 改变商品数量
      changeCount(sid, count) {
        
        this.axios({
          method: 'post', 
          url: '/modifyShopcartCount',
          data: {
            appkey: this.appkey,
            tokenString: this.token,
            sid,
            count
          },
          transformRequest: utils.transformRequest
        })
        .then(v => {
          if (v.data.code !== 6000) {
            this.$toast('数量更改出现错误')
          }else {
            console.log('数量更改成功')
          }
        })
      },

      // 请求购物车数据
      getshopData() {

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        });

        this.axios({
          method: 'get',
          url: '/findAllShopcart',
          params: {
            appkey: this.appkey,
            tokenString: this.token
          }
        })
        .then(v => {

          if (v.data.code === 5000) {
            console.log('购物车加载成功');

            this.$toast.clear();
  
            let data = v.data.result;

            if (data.length <= 0) {
              return 
            }
            data.forEach( v => {
              v.isDel = false;
              v.isShopActive = true;
              v.isChecked = false;
              v.isActiveContent = '满368享受85折';
              v.flavor = v.rule.split('/');
              v.imgUrl = v.small_img;
            })

            this.shopList = data;
          }

        })  
      },

      // 逻辑删除
      remove() {

        if (this.shopList.length <= 0) {
          this.$toast('还没有商品哦~');
          return;
        }

        let sids = [];
        let index = []
        this.shopList.forEach((v, i) => {
          if (v.isDel) {
            sids.push(v.sid);
            index.push(i);
          }
        })

        if (sids.length <= 0 ) {
          this.$toast('请选择商品哦~');
          return;
        }

        this.axios({
          method: 'post',
          url: '/removeShopcart',
          data: {
            appkey: this.appkey,
            tokenString: this.token,
            sids: JSON.stringify(sids)
          },
          transformRequest: utils.transformRequest
        })
        .then(v => {

          if (v.data.code === 7000) {
            console.log(v.data.msg);
            this.$toast('删除成功');

            index.forEach(v => {
              this.shopList.splice(v, 1);
            })
          }
        })
        
      }
    },
    computed: {
      totalPrice() {
        let temp = 0;
        this.shopList.forEach(v => {
          if (v.isChecked) {
            temp += v.price * v.count;
          }
        })
        return temp;
      }
    },
    filters: {
      firstPrice(v) {
        return '￥' + parseFloat(v).toFixed(2).split('.')[0];
      },
      lastPrice(v) {
        return '.' + parseFloat(v).toFixed(2).split('.')[1];
      }
    }
  }
</script>

<style lang="less" scoped>

  .shopping-cart {
    width: 100%;
    height: 100%;
    background: #f0e3c9;
    .header-box {
      position: relative;
      height: 40px;
      z-index: 99;
      .notice-bar {
        width: calc(100% - 65px);
      }
      .ad-btn {
        width: 65px;
        height: 100%;
        font-size: 16px;
        text-align: center;
        line-height: 40px;
        color: #555;
        background: #f0e3c9;
      }
    }
    .shop-list {
      font-size: 16px;
      height: calc(100% - 90px);
      background: #f0e3c9;
      overflow-y: auto;
      .shop-item {
        padding: 5px 15px 0;
        margin-bottom: 12px;
        position: relative;
        height: 150px;
        background: #fff;
        .item-content {
          .item-top {
            height: 105px;
            .check-box {
              width: 22px;
              height: 22px;
              margin-top: 42px;
              margin-right: 12px;
            }
            .img-box {
              width: 105px;
              height: 85px;
              padding-top: 10px;
            }
            .shop-info-box {
              width: calc(100% - 151px);
              margin-top: 10px;
              margin-left: 12px;
              .shop-title {
                letter-spacing: 1px;
                .coupon {
                  font-size: 14px;
                  line-height: 21px;
                  color: #e4393c;
                }
              }
              .shop-flavor {
                display: inline-block;
                margin-top: 8px;
                margin-bottom: 12px;
                padding: 2px 8px;
                font-size: 14px;
                border-radius: 4px;
                color: #999;
                background: #eeeeee;
              }
              .shop-price {
                .price {
                  color: #e4393c;
                  .zero {
                    font-size: 12px;
                  }
                }
              }
            }
          }
          .shop-active {
            height: 44px;
            margin-left: 34px;
            line-height: 44px;
            font-size: 13px;
            border-top: 1px solid #f4f4f4;
            .aa {
              margin-left: 8px;
              color: #666;
            }
          }
        }
        .item-clack {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, .75);
          .del-btn {
            position: absolute;
            top: 47px;
            left: 15px;
          }
        }
      }
    }
    .submit-box {
      bottom: 50px;
      .modify {
        color: #1989fa;
      }
    }
    .del-box {
      position: fixed;
      bottom: 50px;
      left: 0;
      width: 100%;
      height: 50px;
      z-index: 999;
      background: #fff;
      .all-btn{
        margin-top: 15px;
        margin-left: 15px;
        font-size: 16px;
      }
      .delete-btn {
        height: 100%;
        padding: 0 10px;
        font-size: 16px;
        line-height: 50px;
        background: #1989fa;
        color: #fff;
      }
    }
    .like-box {
      position: fixed;
      bottom: 120px;
      left: 0;
      right: 0;
      height: 300px;
      box-shadow: 0 0 12px 3px rgba(0, 0, 0, .75);
      background: #fff;
      .title {
        height: 55px;
        letter-spacing: 2px;
        text-align: center;
        line-height: 55px;
        font-size: 22px;
        color: #f9d74d;
      }
      .like-list {
        margin: 15px 0 30px;
        height: 210px;
        overflow: hidden;
        img {
          position: relative;
          display: block;
          width: 100%;
          height: 210px;
        }
      }
    }
  }

</style>