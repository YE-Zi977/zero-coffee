<template>
  <div class="edi-area">

    <vHead :to="{name: 'ProData'}">收货地址</vHead>

    <div class="container">

      <div class="tip" style="text-align: center; margin-top: 30px;font-size: 16px;" v-if="addrList.length <= 0">还没有地址，快去添加吧~^-^~</div>

      <div class="item-box" v-for="(item, index) in addrList" :key="index">
        <div class="top clearfix">
          <span class="fl name">{{item.name}}</span>
          <span class="fl">{{item.tel}}</span>
          <span class="fl tag" v-if="item.isDefault"><van-tag type="danger">默认</van-tag></span>
          <span class="fl tag"><van-tag type="primary">{{item.postalCode}}</van-tag></span>
        </div>
        <div class="area">{{item.province + item.city + item.county + item.addressDetail}}</div>
        <div class="tool">
          <div class="edi fl" @click="ediArea(item.aid)"><span class="iconfont">&#xe605;</span></div>
          <div class="delete fl" @click="Delete(item, index)"><span class="iconfont">&#xe655;</span></div>
        </div>
      </div>

    </div>

    <div class="add" @click="toPage({name: 'AddAddr'})">
      <van-button class="add-btn" block square color="#561610">新增地址</van-button>
    </div>

  </div>
</template>

<script>
  import { utils } from '@/utils/utils'
  export default {
    data() {
      return {
        token: ''
      }
    },
    created() {
      this.token = utils.getToken.call(this);
      this.getArea();
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
          }

        })
      },

      toPage(path) {
        this.$store.commit('setValue', {key: 'tempUrl', value: this.$store.state.historyUrl});

        this.$store.commit('setHistoryUrl', 'EdiArea');
        this.$router.push(path);
      },

      // 编辑
      ediArea(aid) {
        this.$store.commit('setEdiState', {state: true, aid: aid});
        this.toPage({name: 'AddAddr'});
      },

      Delete(item, index) {
        
        this.axios({
          method: 'post',
          url: '/deleteAddress',
          data: {
            appkey: this.appkey,
            tokenString: this.token,
            aid: item.aid
          },
          transformRequest: utils.transformRequest
        })
        .then(v => {

          if (v.data.code === 10000) {
            console.log('删除地址成功');
            this.$toast('删除成功');

            if (item.isDefault) {

              // 如果删除的是默认，则第一个为默认
              let first = this.$store.state.addrList[0];
              this.axios({
                method: 'post', 
                url: '/editAddress',
                data: {
                  appkey: this.appkey,
                  tokenString: this.token,
                  aid: first.aid,
                  name: first.name,
                  tel: first.tel,
                  province: first.province,
                  city: first.city,
                  county: first.county,
                  addressDetail: first.addressDetail,
                  areaCode: first.areaCode, 
                  postalCode: first.postalCode,
                  isDefault: 1
                },
                transformRequest: utils.transformRequest
              })
            }
          }
        })

        this.$store.commit('subArea', index);
      }
    },
    computed: {
      addrList() {
        return this.$store.state.addrList;
      }
    }
  }
</script>

<style lang="less" scoped>

  .edi-area {
    height: calc(100% - 65px);
    padding-top: 65px;
    .add {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 50px;
    }
    .add-btn {
      height: 50px;
      font-size: 16px;
    }
    .container {
      height: calc(100% - 50px);
      overflow: auto;
      background: #f0e3c9;
      .item-box {
        position: relative;
        height: 60px;
        font-size: 16px;
        padding: 10px;
        background: #fff;
        margin-bottom: 2px;
        .top {
          height: 30px;
          font-weight: bold;
          line-height: 30px;
          .name {
            margin-right: 25px;
          }
          .tag {
            margin-left: 10px;
            margin-top: -1px;
          }
        }
        .area {
          width: calc(100% - 80px);
          margin-top: 5px;
          font-size: 15px;
          color: #666;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .tool {
          position: absolute;
          top: 17px;
          right: 10px;
          width: 75px;
          height: 60px;
          text-align: center;
          >div {
            width: 30px;
            height: 30px;
            margin-top: 15px;
            line-height: 30px;
          }
          .edi {
            margin-right: 15px;
            span {
              font-size: 22px;
            }
          }
          span {
            font-size: 20px;
          }
          >div:active {
            background: rgba(0, 0, 0, .15);
          }
        }
      }
    }
  }

</style>