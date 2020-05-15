<template>
  <div class="like">

    <vHead :to="{name: 'My'}">我的收藏</vHead>

    <div class="container clearfix">

      <div class="tip" v-if="likeList.length <= 0">还没有收藏，快去收藏吧~^-^~</div>

      <div class="item-box" v-for="(item, index) in likeList" :key="index" @click="toPage(item.pid)">
        <div class="img-box">
          <img class="auto-img" :src="item.largeImg" />
        </div>
        <div class="name">{{item.name}}</div>
        <div class="price-box clearfix">
          <div class="fl price">￥{{item.price}}</div>
          <div class="fr delete" @click.stop="cancel(item.pid, index)"><span class="iconfont">&#xe655;</span></div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>

  import { utils } from '@/utils/utils'
  export default {
    name: 'Like',
    data() {
      return {
        token: '',
        likeList: []
      }
    },
    created() {
      this.token = utils.getToken.call(this);
      this.getLike();
    },
    methods: {

      // 请求喜欢数据
      getLike() {

        this.$toast.loading({
          message: '稍等...',
          forbidClick: true,
          duration: 0
        });

        this.axios({
          method: 'get',
          url: '/findAllLike',
          params: {
            appkey: this.appkey,
            tokenString: this.token
          }
        })
        .then(v => {
          
          if (v.data.code === 2000) {
            this.$toast.clear();
            console.log('收藏信息获取成功');

            if (v.data.result.length <= 0) {
              return 
            }

            this.likeList = v.data.result;

          }
        })
      },

      toPage(pid) {
        this.$store.commit('setHistoryUrl', 'Like');
        this.$store.commit('setDetailPid', pid);

        this.$router.push({name: 'Detail'})
      },

      // 取消 
      cancel(pid, index) {

        this.axios({
          method: 'post',
          url: 'notlike',
          data: {
            appkey: this.appkey,
            pid,
            tokenString: this.token
          },
          transformRequest: utils.transformRequest
        })
        .then(v => {

          if (v.data.code === 900) {
            this.$toast('已取消收藏');
            console.log('取消收藏成功');
          }

          this.likeList.splice(index, 1);

        })

      }
    }
  }
</script>

<style lang="less" scoped>

  .like {
    padding-top: 65px;
    height: calc(100% - 65px);
    overflow-y: auto;
    .container {
      width: 100%;
      height: 100%;
      font-size: 16px;
      background: #f0e4ca;
      .item-box:nth-child(even) {
        margin-right: 0;
      }
      >div {
        float: left;
        margin-right: 2%;
      }
      .item-box {
        width: calc(49% - 20px);
        height: 220px;
        padding: 10px;
        margin-bottom: 10px;
        background: #fff;
        box-shadow: 0 0 4px 1px rgba(0, 0, 0, .25);
        .img-box {
          width: 100%;
          height: 150px;
        }
        .name {
          padding: 10px 0 12px;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .price {
          color: #e4393c;
        }

        .delete {
          color: #666;
        }
      }
      .tip {
        width: 100%;
        text-align: center;
        margin-top: 30px;
      }
    }
  }

</style>