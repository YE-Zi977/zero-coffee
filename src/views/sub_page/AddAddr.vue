<template>
  <div class="add-addr">

      <vHead :to="{name: $store.state.historyUrl}" :bool="true">新增地址</vHead>

      <div class="container">
        <div v-show="showTip" :style="{top: top + 'px'}" class="tip">{{tipText}}</div>
        <div class="name">
          <label>
            <span class="title">联系人</span>
            <input type="text" v-model="name" placeholder="请输入您的称呼" maxlength="9">
          </label>
        </div>
        <div class="sex clearfix">
          <span class="title fl">性别</span>
          <div class="sex-item fl">
            <van-radio-group v-model="radio" direction="horizontal">
              <van-radio name="1">女士</van-radio>
              <van-radio name="2">先生</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="phone">
          <label>
              <span class="title">手机号</span> 
              <input type="text" v-model="tel" placeholder="请输入您的手机号">
            </label>
        </div>
        <div class="area" @click="showArea">
          <span class="title">地址</span>
          <span class="area-btn">{{areaData}}</span>
        </div>
        <van-popup
          v-model="show"
          position="bottom"
          :style="{ height: '40%' }"
        >
          <van-area
            :area-list="areaList"
            @cancel="hideArea"
            @confirm="getAreaData"
            :columns-placeholder="['请选择', '请选择', '请选择']"
          />
        </van-popup>
        <div class="area-detail">
          <label>
            <span class="title">详细地址</span>
            <textarea class="detail" v-model="detailArea" maxlength="32" placeholder="如5楼502房"></textarea>
          </label>
        </div>
        <div class="tag clearfix">
          <span class="title fl">标签</span>
          <div class="tag-box fl clearfix">
            <span class="tag-item fl" @click="toggle(item)" :class="{active: item.isActive}" v-for="(item, index) in tag" :key="index">{{item.title}}</span>
          </div>
        </div>
        <div class="setDefault">
          <span>设置为默认地址</span>
          <span class="fr" style="padding-top: 7px;">
            <van-switch v-model="checked" size="24px" />
          </span>
        </div>
      </div>

      <div class="save" @click="saveData">
        <van-button class="save-btn" block square color="#561610">保存</van-button>
      </div>

  </div>
</template>

<script>

import areaList from '@/assets/js/area'
import { utils } from '@/utils/utils'

  export default {
    name: 'AddAddr',
    data() {
      return {
        areaList,
        radio: '1',
        checked: false,
        show: false,
        areaData: '请选择地址',
        name: '',
        tel: '',
        detailArea: '',
        tag: [
          {title: '公司', isActive: true},
          {title: '家', isActive: false},
          {title: '学校', isActive: false}
        ],
        showTip: false,
        tipText: '请输入昵称',
        top: 36,
        token: '',
        province: '',
        city: '',
        county: ''
      }
    },
    created() {

      this.token = utils.getToken.call(this);

      if (this.$store.state.ediState.isEdi) {
        let temp = this.$store.state.addrList.filter(v => v.aid === this.$store.state.ediState.aid)[0]

        this.name = temp.name;
        this.radio = temp.areaCode;
        this.tel = temp.tel;

        this.tag.forEach(v => {
          if (v.title == temp.postalCode) {
            v.isActive = true;
          }else {
            v.isActive = false;
          }
        })

        this.detailArea = temp.addressDetail;

        this.checked = temp.isDefault === 1;
      }
    },
    methods: {

      showArea() {
        this.show = true;
      },
      hideArea() {
        this.show = false;
      },
      getAreaData(data) {

        this.province = data[0].name;
        this.city = data[1].name;
        this.county = data[2].name;

        this.areaData = '';
        for (let i = 0; i < data.length; i++) {
          if (data[i].name == undefined || data[i].name == '') {
            this.areaData = '请选择地址';
            return;
          }else {
            this.areaData += data[i].name + ' ';
          }
        }

        this.areaData = this.areaData.slice(0, -1);
        this.hideArea();
      },
      // 保存
      saveData() {
        
        if (this.name == '') {
          this.showTip = true;
          this.top = 36;
          this.tipText = '请输入您的称呼'
          return
        }

        if (this.tel == '' || !utils.RegValue(/^1[34578]\d{9}$/, this.tel)) {
          this.showTip = true;
          this.top = 160;
          this.tipText = '请输入正确格式的手机号'
          return
        }

        if (this.areaData == '请选择地址') {
          this.showTip = true;
          this.top = 222;
          this.tipText = '请选择地址'
          return
        }

        if (this.detailArea == '') {
          this.showTip = true;
          this.top = 324;
          this.tipText = '请填写详细地址'
          return
        }

        if (this.$store.state.ediState.isEdi) {
          
          this.$toast.loading({
            message: '保存中...',
            forbidClick: true,
            duration: 0
          });

          this.axios({
            method: 'post', 
            url: '/editAddress',
            data: {
              appkey: this.appkey,
              tokenString: this.token,
              aid: this.$store.state.ediState.aid,
              name: this.name,
              tel: this.tel,
              province: this.province,
              city: this.city,
              county: this.county,
              addressDetail: this.detailArea,
              areaCode: this.radio, 
              postalCode: this.tag.filter(v => v.isActive)[0].title,
              isDefault: this.checked ? 1 : 0
            },
            transformRequest: utils.transformRequest
          })
          .then(v => {
            if (v.data.code === 30000) {

              this.$toast.clear();
              console.log('地址修改成功');
              this.$store.commit('setEdiState', {state: false, aid: 0});
              
              this.$router.push({name: 'EdiArea'});
            }
          })
          return;
        }

        this.$toast.loading({
          message: '保存中...',
          forbidClick: true,
          duration: 0
        });

        this.axios({
          method: 'post', 
          url: '/addAddress',
          data: {
            appkey: this.appkey,
            tokenString: this.token,
            name: this.name,
            tel: this.tel,
            province: this.province,
            city: this.city,
            county: this.county,
            addressDetail: this.detailArea,
            areaCode: this.radio, 
            postalCode: this.tag.filter(v => v.isActive)[0].title,
            isDefault: this.checked ? 1 : 0
          },
          transformRequest: utils.transformRequest
        })
        .then(v => {

          if (v.data.code === 9000) {

            this.$toast.clear();
            console.log('新增地址成功')

            let historyUrl = this.$store.state.historyUrl;

            let areaInfo = {};

            areaInfo.phone = this.tel;
            areaInfo.address = this.province + this.city + this.county + this.detailArea;
            areaInfo.receiver = this.name;

            this.$router.push({name: historyUrl, query: {areaInfo}});

          }
        })

      },

      // tag切换
      toggle(item) {
        if (item.isActive) {
          return;
        }

        for (let i = 0; i < this.tag.length; i++) {
          if (this.tag[i].isActive) {
            this.tag[i].isActive = false;
            break;
          }
        }

        item.isActive = true;
      }
    }
  }
</script>

<style lang="less" scoped>

  .add-addr {
    position: relative;
    height: calc(100% - 65px);
    padding-top: 65px;
    overflow: hidden;
    .container {
      position: relative;
      height: calc(100% - 50px);
      overflow: auto;
      background: #f0e3c9;
      font-size: 16px;
      line-height: 60px;
      color: #555;
      >div:not(.tip) {
        height: 60px;
        margin-bottom: 2px;
        padding: 0 10px;
        background: #fff;
      }
      .tip {
        position: absolute;
        left: 92px;
        top: 36px;
        height: 25px;
        color: #e4393c;
        line-height: 25px;
        font-size: 12px;
      }
      input {
        margin-left: 35px;
        font-size: 15px;
      }
      .sex-item {
        margin-left: 52px;
        padding-top: 19px;
      }
      .area-btn {
        margin-left: 51px;
      }
      .area-detail {
        height: 100px !important;
        line-height: 100px;
        textarea {
          height: 50px;
          width: calc(100% - 83px);
          margin-left: 19px;
          line-height: 25px;
          font-size: 15px;
          vertical-align: middle;
        }
      }
      .tag-box {
        display: inline;
        margin-left: 51px;
        padding-top: 14px;
        color: #fff;
        .tag-item {
          width: 65px;
          height: 32px;
          border-radius: 16px;
          background: #f0e3c9;
          line-height: 32px;
          text-align: center;
          margin-right: 10px;
          &.active {
            background: #1989fa;
          }
        }
      }
    }
    .save {
      width: 100%;
      height: 50px;
    }
    .save-btn {
      height: 50px;
      font-size: 16px;
    }
  }

</style>