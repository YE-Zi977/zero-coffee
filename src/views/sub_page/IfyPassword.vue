<template>
  <div class="ify-password">

    <vHead :to="{name: 'Setting'}">修改密码</vHead>

    <div class="container">

      <van-form @submit="onSubmit">

        <van-field
          v-model="oldPassword"
          type="password"
          name="oldPassword"
          label="旧密码"
          placeholder="请输入您原来的密码"
          :rules="[{ pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).{6,}$/, message: '最少6位，大小写字母、数字、特殊字符各含一个!' }]"
        />

        <van-field
          v-model="newPassword"
          type="password"
          name="newPassword"
          label="新密码"
          placeholder="请输入您新的密码"
          :rules="[{ pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).{6,}$/, message: '最少6位，大小写字母、数字、特殊字符各含一个!' }]"
        />

        <van-field
          v-model="confirmPassword"
          type="password"
          name="confirmPassword"
          label="确认密码"
          placeholder="请再次确认您的密码"
          :rules="[{ pattern: new RegExp('^' + newPassword + '$'), message: '两次密码不一致！' }]"
        />

        <div style="margin: 16px;">
          <van-button round block color="#561610" type="info" native-type="submit">
            确认修改
          </van-button>
        </div>

      </van-form>

    </div>

  </div>
</template>

<script>

  import { utils } from '@/utils/utils'
  export default {
    name: 'IfyPassword',
    data() {
      return {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }
    },
    methods: {
      onSubmit(values) {

        if (values.newPassword == values.oldPassword) {
          this.$toast('新旧密码一致！');
          return;
        }
        
        this.$toast.loading({
          message: '修改中...',
          forbidClick: true,
          duration: 0
        });

        let token = utils.getToken.call(this);
        this.axios({
          method: 'post',
          url: '/updatePassword',
          data: {
            appkey: this.appkey,
            tokenString: token,
            password: values.newPassword,
            oldPassword: values.oldPassword
          },
          transformRequest: utils.transformRequest
        })
        .then(v => {
          this.$toast.clear();
          console.log(v.data.msg);

          if (v.data.code === 'E003') {

            this.$toast(v.data.msg);
            return;
          }

          if (v.data.code === 'E001') {

            // 清空cookies
            for (let i = 0; ; i++) {
              if (!this.$cookies.isKey('l' + i)) {
                break;
              }
  
              this.$cookies.remove('l' + i)
            }
  
            this.$router.push({name: 'Login'});
          }

        })
      },
    }
  }
</script>

<style lang="less" scoped>

  .ify-password {
    height: calc(100% - 65px);
    padding-top: 65px;
    .container {
      height: 100%;
      background: #f0e4ca;
      overflow: auto;
    }
  }

</style>