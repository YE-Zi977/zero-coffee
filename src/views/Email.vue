<template>
  <div class="email">

    <vHead :to="{name: 'Login'}">邮箱验证</vHead>

    <div class="container">

      <van-form class="email-box" @submit="onSubmit">

        <van-field
          class="item"
          v-model="email"
          type="text"
          name="email"
          label="我的邮箱"
          placeholder="请输入您的邮箱"
          :rules="[{ pattern: /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/, message: '邮箱格式不正确！' }]"
        />

        <van-field
          class="item"
          v-model="code"
          type="text"
          name="code"
          label="验证码"
          placeholder="请输入验证码"
        />

        <div class="get-code" @click="getCode" :class="{disable: isDisable}">
          {{content}}
        </div>

        <div style="margin: 16px;">
          <van-button round block color="#561610" type="info" native-type="submit">
            下一步
          </van-button>
        </div>

      </van-form>

    </div>

  </div>
</template>

<script>

  import { utils } from '@/utils/utils'
  export default {
    name: 'Email',

    data() {
      return {
        email: '',
        code: '',
        isDisable: false,
        content: '获取验证码'
      }
    },
    methods: {
      onSubmit(values) {
        console.log(values);

        this.axios({
          method: 'post',
          url: 'checkValidCode',
          data: {
            appkey: this.appkey,
            validCode: values.code
          },
          transformRequest: utils.transformRequest
        })
        .then(v => {

          console.log(v.data.msg);

          if (v.data.code === 'K002') {
            this.$toast('验证码不正确!')
          }
          
          if (v.data.code === 'K001') {
            this.$router.push({name: 'Retrieve'});
          }
        })

      },

      // 获取验证码
      getCode() {

        if (this.isDisable) {
          return;
        }

        this.isDisable = true;

        if (!utils.RegValue(/^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/, this.email)) {
          return;
        }

        this.axios({
          method: 'post',
          url: 'emailValidCode',
          data: {
            appkey: this.appkey,
            email: this.email
          },
          transformRequest: utils.transformRequest
        })
        .then(v => {

          if (v.data.code === 'J001') {

            this.$toast(v.data.msg);
            console.log(v.data.msg);

          }
        })

        let time = 60;
        this.content = (time < 10 ? '0' + time : time) + '秒后获取';

        let timer = setInterval(() => {
          
          if (time <= 1) {

            this.isDisable = false;
            this.content = '获取验证码'

            clearInterval(timer);
            return;

          }

          this.content = (--time < 10 ? '0' + time : time) + '秒后获取';

        }, 1000);

      }
    }
  }
</script>

<style lang="less" scoped>

  .email {
    height: calc(100% - 65px);
    padding-top: 65px;
    .container {
      height: 100%;
      background: #f0e4ca;
      overflow: auto;
      .email-box {
        position: relative;
        margin-top: 72px;
        .item {
          height: 68px;
        }
        .get-code {
          position: absolute;
          right: 8px;
          bottom: 90px;
          padding: 4px 6px;
          border: 1px solid #561610;
          background: #f0e4ca;
          color: #561610;
          border-radius: 14px;
          font-size: 14px;
        }
        .get-code.disable {
          background: #f7f7f7;
        }
      }
    }
  }

</style>