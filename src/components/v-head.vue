<template>
  <div class="header">
    <div v-if="no" class="back" @click="toPage(to)"><img src="@/assets/images/back.png" /></div>
    <span><slot></slot></span>
  </div>
</template>

<script>

import { utils } from '@/utils/utils'
  export default {
    name: 'Head',
    props: {
      to: {
        type: Object,
        default() {
          return {}
        }
      },
      no: {
        type: Boolean,
        default() {
          return true;
        }
      },
      bool: {
        type: Boolean,
        default() {
          return false;
        }
      },
      history:{
        type: Object,
        default() {
          return {
            is: false
          };
        }
      }
    },
    methods: {
      toPage(path) {

        if (this.$store.state.ediState.isEdi) {
          this.$store.commit('setEdiState', {state: false, index: 0});
        }

        if (this.bool === true) {

          this.$store.commit('setValue', {key: 'historyUrl', value: this.$store.state.tempUrl});
        }

        if (this.history.is === true) {

          this.$store.commit('setValue', {key: 'port', value: 1});
        }

        this.$router.push(path);
      }
    }
  }
</script>

<style lang="less" scoped>

  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    padding-top: 15px;
    text-align: center;
    line-height: 50px;
    font-size: 18px;
    letter-spacing: 2px;
    background: #561610;
    color: #fff;
    z-index: 999;
    .back {
      position: absolute;
      left: 0;
      width: 22px;
      height: 22px;
      padding: 14px;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

</style>