<template>
  <div class="submit-box h-100">

    <vHead :to="{name: 'Settlement'}">立即付款</vHead>

    <div class="container">

      <!-- 密码输入框 -->
      <van-password-input
        :value="value"
        info="演示密码为666666"
        :error-info="errorInfo"
      />
      <!-- 数字键盘 -->
      <van-number-keyboard
        show
        @input="onInput"
        @delete="onDelete"
      />

    </div>

  </div>
</template>

<script>

  import { utils } from '@/utils/utils'
  export default {
    name: 'InputPassword',
    data() {
      return {
        value: '',
        errorInfo: ''
      };
    },
    methods: {
      onInput(key) {
        this.value = (this.value + key).slice(0, 6);
        if (this.value.length === 6 && this.value !== '666666') {
          this.errorInfo = '密码错误，请重新输入';
          this.value = '';
        }
        if (this.value.length === 6 && this.value == '666666') {

          this.errorInfo = '';
          
          this.$toast.loading({
            message: '付款中...',
            forbidClick: true,
            duration: 0
          });

          // 更改
          let token = utils.getToken.call(this);
          let sids = [];
          this.$store.state.SettlementModule.orderList.forEach(v => {
            sids.push(v.sid);
          });
         
          let areaInfo = this.$store.state.SettlementModule.areaInfo;

          this.axios({
            method: 'post',
            url: 'pay',
            data: {
              appkey: this.appkey,
              tokenString: token,
              sids: JSON.stringify(sids),
              phone: areaInfo.phone,
              address: areaInfo.address,
              receiver: areaInfo.receiver
            },
            transformRequest: utils.transformRequest
          })
          .then(v => {
            if (v.data.code === 60000) {

              this.$toast.clear();

              this.$store.commit('MainModule/toName', {self: this, name: 'Order', active: '1'});

            }
          })

        }
      },
      onDelete() {
        this.value = this.value.slice(0, this.value.length - 1);
      }
    }
  }
</script>

<style lang="less" scoped>

  .container {
    height: calc(100% - 165px);
    padding-top: 165px;
    background: #f0e3c9;
  }

</style>