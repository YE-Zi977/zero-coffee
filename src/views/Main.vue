<template>
  <div class="main h-100">

    <vHead :no="false" >{{currentTitle}}</vHead>

    <div class="content">
      <router-view></router-view>
    </div>

    <div class="menu">
      <div :class="{active: item.isActive}" @click="toggle(item, item.path)" v-for="(item, index) in menuList" :key="index"><span class="iconfont" v-html="item.icon"></span><br />{{item.name}}</div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'Main',
  created() {

    let token = '';
    for (let i = 0; ; i++) {
      if (this.$cookies.get('l' + i) == null) {
        break;
      }
      token += this.$cookies.get('l' + i) + '.'
    }

    token = token.slice(0, -1);

    if (token != '') {
      return;
    }

    this.$dialog.confirm({
      title: '小提示',
      message: '登录后更多体验哦~^-^~'
    }).then(() => {
      // on confirm

      this.$router.push({name: 'Login'});
    }).catch(() => {
      // on cancel

      return
    });

  },
  computed: {
   menuList() {
     return this.$store.state.MainModule.menuList;
   },
   currentTitle() {
     return this.$store.state.MainModule.currentTitle;
   }
  },
  methods: {

    // 获取token
    getToken() {

      for (let i = 0; ; i++) {
        if (this.$cookies.get('l' + i) == null) {
          break;
        }
        this.token += this.$cookies.get('l' + i) + '.'
      }

      this.token = this.token.slice(0, -1);
    },

    toggle(item, path) {

      if (item.isActive) {
        return;
      }

      this.$router.push(path);
      this.$store.commit('MainModule/toggle', item);
    }
  }
}
</script>

<style lang="less" scoped>

  .main {
    overflow: hidden;
  }

  .menu {
    display: flex;
    height: 50px;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    font-size: 14px;
    color: #fff;
    background: #561610;
    .active {
      color: #ffdb2a;
    }
  }

  .content {
    width: 100%;
    height: calc(100% - 115px);
    padding-top: 65px;
    overflow: auto;
  }

</style>
