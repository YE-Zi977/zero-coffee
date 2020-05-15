<template>
  <div class="home h-100" @click="() => {this.isOpen = false}">

    <div class="header p-15">
      <div class="sweep-code fl">
        <img class="auto-img" src="@/assets/images/sweep-code.png" />
      </div>
      <div class="search-box">
        <van-search @input="querySearch" @focus="() => {this.isOpen = true}" @click.stop v-model="searchKey" placeholder="搜你喜欢" shape="round" background="#f0e3c9"/>
        <div class="result-box" v-show="isOpen">
          <div class="no-result" v-show="queryResult.length <= 0">无结果~</div>
          <div class="result-item clearfix" @click.stop="toPage(item.pid)" v-for="(item, index) in queryResult" :key="index">
            <div class="fl overflow r-name">{{item.name}}</div>
            <div class="fr overflow r-price">{{item.price | toPrice}}</div>
          </div>
        </div>
      </div>
      <div class="microphone fr">
        <img class="auto-img" src="@/assets/images/microphone.png" />
      </div>
    </div>
    
    <div class="container">

      <div class="banner">
        <van-swipe :autoplay="3000" :indicator-color="'#f0e3c9'" :width="'100%'" :height="'100%'"> 
          <van-swipe-item v-for="(image, index) in bannerImgs" :key="index">
            <img :src="image.bannerImg" />
          </van-swipe-item>
        </van-swipe>
      </div>

      <div class="column">
        <div>
          <img class="c-img" src="@/assets/images/xd.png" />
          <span>磨咖心得</span>
        </div>
        <div>
          <img class="c-img" src="@/assets/images/dg.png" />
          <span>蛋糕食品</span>
        </div>
        <div>
          <img class="c-img" src="@/assets/images/mw.png" />
          <span>免费品尝</span>
        </div>
        <div>
          <img class="c-img d-img" src="@/assets/images/py.png" />
          <span>咖啡圈</span>
        </div>
      </div>

      <!-- 栏目 -->
      <div class="recommend-column p-15" v-for="(item, index) in columnData" :key="index">
        <div class="h-title">{{item.typeDesc}}<span class="van-icon"><van-icon name="arrow" color="#561610" /></span></div>
        <div class="slider">
          <slider :isEnd="tempList['t' + index].isEnd" :width="getWidth(tempList['t' + index].data.length)" :height="'100%'" @my-load="load(item.recommendImages, index, 3)">

            <div class="item" @click="toPage(goods.pid)" v-for="(goods, i) in tempList['t' + index].data" :key="i">
              <div class="img-box">
                <img :src="goods.smallImg" />
              </div>
              <div class="info">
                <div class="info-top">
                  <div class="name">{{goods.name}}</div>
                  <div class="price">{{goods.price | toPrice}}</div>
                </div>
                <div class="info-bottom">{{goods.desc}}</div>
              </div>
            </div>

          </slider>
        </div>
      </div>

      <div class="footer">
        到底了~^-^~
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    name: 'Home', 
    data() {
      return {
        // 搜索关键字
        searchKey: '',
        // 查询结果
        queryResult: [],
        isOpen: false,

        timer: null,
        timers: []
      }
    },
    created() {
      if (this.$store.state.isLoad) {
        return;
      }

      this.$store.state.isLoad = true;
      this.getBanner();
      this.getType();
    },
    methods: {

      // 模糊查询
      querySearch() {

        // 函数防抖
        this.timers.push(setTimeout(() => {

          for (let i = 0; i < this.timers.length - 1; i++) {
            clearTimeout(this.timers[i]);
          }

          // 关键字
          let searchKey = this.searchKey.trim();

          if (searchKey == '') {
            this.queryResult = [];
            return;
          }

          // 所有咖啡数据
          let data = [];
          this.columnData.forEach(v => {
            data.push(v.recommendImages);
          })
          data = [].concat(...data);

          // 要查询的键名
          let keys = ['name', 'price'];

          this.queryResult = data.filter(v => {

            let flag = false;
            keys.forEach(value => {
              if (v[value].indexOf(searchKey) > -1) {
                // 存在
                flag = true;
              }
            })

            return flag;

          })

        }, 500))

      },

      // 懒加载
      load(item, index, count) {
        let data = JSON.parse(JSON.stringify(item)).concat();
        let i = 0;
        for (i = this.tempList['t' + index].endIndex; i < this.tempList['t' + index].endIndex + count; i++) {

          if (data[i] == undefined) {
            this.tempList['t' + index].isEnd = true;
            break;
          }

          this.tempList['t' + index].data.push(data[i]);
        }

        this.tempList['t' + index].endIndex = i;
      },

      // 求每栏的宽度
      getWidth(len) {
        let pro = window.innerWidth / 375;
        return (120 * len + 10 * (len - 1) + 30) * pro;
      },

      // 请求banner数据
      getBanner() {
        this.axios({
          method: 'get',
          url: '/banner',
          params: {
            appkey: this.appkey
          }
        })
        .then(v => {
          
          if (v.data.code === 300) {
            console.log('请求banner成功');

            this.$store.commit('HomeModule/getBanner', v.data.result);
          }

        })
      },

      // 请求栏目数据
      getType() {

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        });

        this.axios({
          method: 'get',
          url: '/type',
          params: {
            appkey: this.appkey
          }
        })
        .then(v => {
          
          if (v.data.code === 400) {
            console.log('请求column成功');

            let columnData = [];
            v.data.result.forEach(v => {
              columnData.push(v);
            })

            let hot = {
              id: 0,
              isHot: 1,
              typeDesc: '最新推荐',
              createdAt: '-未知-',
              updatedAt: '-未知-'
            }

            columnData.unshift(hot);
            // console.log(columnData);

            this.sendRe(columnData, 0);

          }
        })

        this.timer = setTimeout(() => {
          this.$toast.clear();
          this.$toast('请求超时');
        }, 5000);
      },

      //发送商品请求函数
      sendRe(data, index) {

        // 出口
        if (!data[index]) {
          this.$store.commit('HomeModule/getColumnDate', data);
          clearTimeout(this.timer);
          this.$toast.clear();
          return;
        }

        this.axios({
          method: 'get',
          url: '/typeProducts',
          params: {
            appkey: this.appkey,
            key: data[index].type ? 'type' : 'isHot',
            value: data[index].type || data[index].isHot
          }
        })
        .then(result => {
          data[index].recommendImages = result.data.result;
          this.tempList['t' + index].data = result.data.result.slice(0, 3);
          this.tempList['t' + index].endIndex = 3;
          
          // 递归
          this.sendRe(data, ++index);
        })

      },

      // 跳转
      toPage(pid) {

        this.$store.commit('setHistoryUrl', 'Home');
        this.$store.commit('setDetailPid', pid);

        this.$router.push({name: 'Detail'})
      }
    },
    computed: {
      bannerImgs() {
        return this.$store.state.HomeModule.bannerImgs;
      },
      columnData() {
        return this.$store.state.HomeModule.columnData;
      },
      tempList() {
        return this.$store.state.HomeModule.tempList;
      }
    },
    filters: {
      toPrice(price) {
        return '￥' + parseFloat(price).toFixed(2);
      }
    }
  }
</script>

<style lang="less" scoped>

  .home {
    width: 100%;
    background: #f0e3c9;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f0e3c9;
      .search-box {
        position: relative;
        width: 85%;
        .result-box {
          position: absolute;
          left: 0;
          top: 50px;
          width: 100%;
          max-height: 170px;
          overflow-y: auto;
          padding: 10px 0;
          border-radius: 8px;
          font-size: 14px;
          box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, .15);
          background: #fff;
          color: #666;
          z-index: 99;
          .no-result {
            padding: 10px 0;
            text-align: center;
          }
          .result-item {
            padding: 10px;
            .r-name {
              max-width: 50%;
            }
            .r-price {
              max-width: 40%;
              color: #e4393c;
            }
          }
          .result-item:active {
            background: rgba(240, 227, 201, .55);
          }
        }
      }
      .sweep-code, .microphone {
        width: 22px;
        height: 22px;
      }
    }
    .container {
      height: calc(100% - 54px);
      overflow-y: auto;
    }
    .banner {
      height: 250px;
      img {
        width: 100%;
        height: 250px;
      }
    }
    .column {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
      padding: 8px 15px 5px;
      font-size: 15px;
      .c-img {
        display: block;
        width: 45px;
        height: 45px;
        margin: 0 auto;
        margin-bottom: 5px;
      }
      .c-img.d-img {
        width: 48px;
      }
    }
    .recommend-column {
      height: 230px;
      margin: 10px 0px;
    }
    .footer {
      font-size: 14px;
      padding: 15px 0;
      text-align: center;
    }
  }
  .p-15 {
    padding: 0 15px;
  }
  .h-title {
    font-size: 18px;
  }
  span.van-icon {
    vertical-align: -2px;
    margin-left: 4px;
  }
  .slider {
    height: 190px;
    margin-top: 10px;
    font-size: 16px;
    .item {
      width: 120px;
      height: 100%;
      margin-right: 10px;
      color: #222;
      .img-box {
        width: 100%;
        height: 120px;
        border-radius: 20px;
        overflow: hidden;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .info-top {
        margin: 8px 0 5px;
        overflow: hidden;
        .price {
          color: #e4393c;
          font-size: 14px;
          margin-right: 12px;
        }
        .name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .info-bottom {
        color: #666;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

</style>
