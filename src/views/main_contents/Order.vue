<template>
  <div class="order">

    <van-tabs @change="getOrderList" swipeable animated sticky :offset-top="65" v-model="active.number" color="#f56c0f" title-active-color="#f98c47">
      <van-tab title="全部" name="0">
        <div class="order-list">

          <div class="order-item" v-for="(item, index) in OrderList" :key="index">
            <div class="order-header">
              <div class="number fl">订单编号：{{item.id}}</div>
              <div class="state fr">{{item.status ? '已收货' : '未收货'}}</div>
            </div>
            <div class="order-info-box clearfix" v-for="(data, i) in item.data" :key="i">
              <div class="order-img fl">
                <img class="auto-img" :src="data.smallImg" />
              </div>
              <div class="order-info fl">
                <div class="order-top clearfix">
                  <div class="order-title fl">{{data.name}}</div>
                  <div class="order-price fr">{{data.price | price}}</div>
                </div>
                <div class="enname">{{data.enname}}</div>
                <div class="count clearfix">
                  <span class="flavor fl">{{data.rule}}</span>
                  <span class="fr">x{{data.count}}</span>
                </div>
              </div>
            </div>
            <div class="tool-box clearfix">
              <van-button class="tool-btn purchase-btn fr" size="small" round @click="toPage(item, index)">{{item.status ? '再来一单' : '确认收货'}}</van-button>
              <van-button class="tool-btn fr" size="small" round>追加评价</van-button>
              <van-button @click="delItem(item, index)" class="tool-btn fr" size="small" round>删除订单</van-button>
            </div>
            <div class="total-box clearfix">
              <span class="time fl">{{item.time}}</span>
              <span class="total-price fr">{{totalPrice(item)}}</span>
              <span class="fr">共{{item | count}}件商品实付：</span>
            </div>
          </div>
        </div>
        <div class="footer">{{OrderList.length == 0 ? '还没有订单哦~' : '没有更多了~^-^~'}}</div>
      </van-tab>
      <van-tab title="已收货" name="2">
        <div class="order-list">

          <div class="order-item" v-for="(item, index) in OrderList" :key="index">
            <div class="order-header">
              <div class="number fl">订单编号：{{item.id}}</div>
              <div class="state fr">{{item.status ? '已收货' : '未收货'}}</div>
            </div>
            <div class="order-info-box clearfix" v-for="(data, i) in item.data" :key="i">
              <div class="order-img fl">
                <img class="auto-img" :src="data.smallImg" />
              </div>
              <div class="order-info fl">
                <div class="order-top clearfix">
                  <div class="order-title fl">{{data.name}}</div>
                  <div class="order-price fr">{{data.price | price}}</div>
                </div>
                <div class="enname">{{data.enname}}</div>
                <div class="count clearfix">
                  <span class="flavor fl">{{data.rule}}</span>
                  <span class="fr">x{{data.count}}</span>
                </div>
              </div>
            </div>
            <div class="tool-box clearfix">
              <van-button class="tool-btn purchase-btn fr" size="small" round @click="toPage(item, index)">{{item.status ? '再来一单' : '确认收货'}}</van-button>
              <van-button class="tool-btn fr" size="small" round>追加评价</van-button>
              <van-button @click="delItem(item, index)" class="tool-btn fr" size="small" round>删除订单</van-button>
            </div>
            <div class="total-box clearfix">
              <span class="time fl">{{item.time}}</span>
              <span class="total-price fr">{{totalPrice(item)}}</span>
              <span class="fr">共{{item | count}}件商品实付：</span>
            </div>
          </div>
        </div>
        <div class="footer">
          {{OrderList.length == 0 ? '还没有订单哦~' : '没有更多了~^-^~'}}
        </div>
      </van-tab>
      <van-tab title="未收货" name="1">
         <div class="order-list">

          <div class="order-item" v-for="(item, index) in OrderList" :key="index">
            <div class="order-header">
              <div class="number fl">订单编号：{{item.id}}</div>
              <div class="state fr">{{item.status ? '已收货' : '未收货'}}</div>
            </div>
            <div class="order-info-box clearfix" v-for="(data, i) in item.data" :key="i">
              <div class="order-img fl">
                <img class="auto-img" :src="data.smallImg" />
              </div>
              <div class="order-info fl">
                <div class="order-top clearfix">
                  <div class="order-title fl">{{data.name}}</div>
                  <div class="order-price fr">{{data.price | price}}</div>
                </div>
                <div class="enname">{{data.enname}}</div>
                <div class="count clearfix">
                  <span class="flavor fl">{{data.rule}}</span>
                  <span class="fr">x{{data.count}}</span>
                </div>
              </div>
            </div>
            <div class="tool-box clearfix">
              <van-button class="tool-btn purchase-btn fr" size="small" round @click="toPage(item, index)">{{item.status ? '再来一单' : '确认收货'}}</van-button>
              <van-button class="tool-btn fr" size="small" round>追加评价</van-button>
              <van-button @click="delItem(item, index)" class="tool-btn fr" size="small" round>删除订单</van-button>
            </div>
            <div class="total-box clearfix">
              <span class="time fl">{{item.time}}</span>
              <span class="total-price fr">{{totalPrice(item)}}</span>
              <span class="fr">共{{item | count}}件商品实付：</span>
            </div>
          </div>
        </div>
        <div class="footer">
          {{OrderList.length == 0 ? '还没有订单哦~' : '没有更多了~^-^~'}}
        </div>
      </van-tab>
     
    </van-tabs>

  </div>
</template>

<script>

  import { mapState } from 'vuex'
  import { utils } from '@/utils/utils'

  export default {
    name: 'Order',
    computed: {
      active() {
        return this.$store.state.MainModule.active;
      },
      ...mapState('OrderModule', ['OrderList', 'number'])
    },
    methods: {
      totalPrice(item) {
        let temp = 0;
        item.data.forEach(v => {
          temp += v.price * v.count;
        })

        return '￥' + temp.toFixed(2);
      },

      delItem(item, index) {

        if (!item.status) {
          this.$toast('请确认收货')
          return;
        }

        let token = utils.getToken.call(this);
        
        this.axios({
          method: 'post',
          url: 'removeOrder',
          data: {
            appkey: this.appkey,
            tokenString: token,
            oid: item.id
          },
          transformRequest: utils.transformRequest
        })
        .then(v => {
          if (v.data.code === 90000) {

            console.log(v.data.msg);
          }
        })

        this.$store.commit('OrderModule/splice', index);

      },

      // 发送请求
      sendRe(token, data, index) {

        // 出口
        if (!data[index]) {

          this.$toast.clear();

          this.$router.push({name: 'Settlement'});

          return;
        }

        this.axios({
          method: 'post',
          url: '/addShopcart',
          data: {
            pid: data[index].pid,
            count: data[index].count,
            rule: data[index].rule,
            appkey: this.appkey,
            tokenString: token
          },
          transformRequest: utils.transformRequest
        })
        .then(result => {

          let temp = {
            name: data[index].name,
            price: data[index].price,
            count: data[index].count,
            imgUrl: data[index].smallImg,
            pid: data[index].pid,
            sid: result.data.sid,
            flavor: data[index].rule
          };
          this.$store.commit('SettlementModule/addOrder', temp);
          
          // 递归
          this.sendRe(token, data, ++index);
        })

      },

      toPage(item, index) {

        // 已收货再来一单
        if (item.status) {

          this.$toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0
          });
          this.$store.commit('setValue', {key: 'port', value: 3});

          this.$store.commit('SettlementModule/setValue', {key: 'orderList', value: []});
          let token = utils.getToken.call(this);

          this.sendRe(token, item.data, 0);

        }else {

          this.$toast.loading({
            message: '正在完成...',
            forbidClick: true,
            duration: 0
          });

          let token = utils.getToken.call(this);
          // 完成收货
          this.axios({
            method: 'post',
            url: '/receive',
            data: {
              appkey: this.appkey,
              tokenString: token,
              oid: item.id
            },
            transformRequest: utils.transformRequest
          })
          .then(v => {

            if (v.data.code === 80000) {
              
              this.$toast.clear();
              console.log(v.data.msg);

              item.status = true;
              if (this.number !== '0') {

                this.$store.commit('OrderModule/splice', index);
              }

            }
          })
        }
      },

      // 获取订单数据
      getOrderList(name) {

        this.$store.commit('OrderModule/setValue', {key: 'number', value: name});

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        });

        let token = utils.getToken.call(this);

        this.axios({
          method: 'get',
          url: '/findOrder',
          params: {
            appkey: this.appkey,
            tokenString: token,
            status: name
          }
        })
        .then(v => {

          if (v.data.code === 70000) {

            this.$toast.clear();
            console.log('订单获取成功');

            let result = v.data.result;
            let oids = [];
            result.forEach(v => {
              if (oids.indexOf(v.oid) <= -1) {
                oids.push(v.oid);
              };
            })

            let tempList = [];
            oids.forEach(v1 => {
              let data = {};
              data.id = v1;
              data.time = utils.getTime(new Date(parseFloat(v1.slice(2))));
              data.data = result.filter(v2 => v1 == v2.oid);
              let first = data.data[0];
              data.status = first.status === 2 ? true : false;

              tempList.push(data);
            })

            // 排序
            tempList.sort((a, b) => (+new Date(b.time)) - (+new Date(a.time)));

            this.$store.commit('OrderModule/setValue', {key: 'OrderList', value: tempList})

          }
        })
      }
    },
    created() {

      this.getOrderList(this.active.number);

    },
    filters: {
      price(v) {
        return "￥" + parseFloat(v).toFixed(2);
      },
      count(v) {
        let count = 0;
        v.data.forEach(item => {
          count += item.count;
        })

        return count;
      }
    }
  }
</script>

<style lang="less" scoped>

  .order {
    position: relative;
    width: 100%;
    background: #f4f4f4;
    .order-list {
      width: 100%;
      background: #f4f4f4;
      font-size: 15px;
      .order-item {
        margin-top: 10px;
        background: #fff;
        .order-header {
          padding: 8px 10px;
          font-size: 14px;
          overflow: hidden;
          border: 1px solid #f4f4f4;
          color: #666;
          .state {
            color: #f98c47;
          }
        }
        .order-info-box {
          padding: 5px 10px 10px;
          .order-img {
            width: 90px;
            height: 90px;
          }
          .order-info {
            width: calc(100% - 105px);
            margin-left: 15px;
            .order-top {
              font-weight: bold;
              .order-title {
                width: 150px;
                white-space: nowrap;/*规定段落中的文本不进行换行*/
                overflow: hidden;/*内容会被修剪，并且其余内容是不可见的。*/
                text-overflow: ellipsis;/*显示省略号来代表被修剪的文本*/
              }
            }
            .count {
              text-align: right;
              color: #666;
              .flavor {
                margin-top: 3px;
                font-size: 12px;
              }
            }
            .enname {
              width: 100%;
              margin-top: 10px;
              margin-bottom: 15px;
              white-space: nowrap;/*规定段落中的文本不进行换行*/
              overflow: hidden;/*内容会被修剪，并且其余内容是不可见的。*/
              text-overflow: ellipsis;/*显示省略号来代表被修剪的文本*/
              color: #666;
            }
          }
        }
        .tool-box {
          padding: 0 10px 5px;
          .tool-btn {
            margin-left: 12px;
          }
          .purchase-btn {
            color: #f98c47;
          }
        }
        .total-box {
          padding: 5px 10px 10px;
          .total-price {
            font-weight: bold;
            color: #e4393c;
          }
          .time {
            color: #666;
          }
        }
      }
    }
    .footer {
      font-size: 14px;
      text-align: center;
      padding: 20px 0;
    }
  }
</style>