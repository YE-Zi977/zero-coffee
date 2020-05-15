import Vue from 'vue'
import Vuex from 'vuex'

import { LoginModule } from './login_store/store'
import { LogonModule } from './logon_store/store'
import { RetrieveModule } from './retrieve_store/store'
import { MainModule } from './main_store/store'
import { HomeModule } from './home_store/store'
import { SettlementModule } from './settlement_store/store'
import { OrderModule } from './order_store/store'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,
  // 公共数据
  state: {
    // 密码可不可见图标
    eyeIcon: {
      showUrl: require('@/assets/images/m-show.png'),
      hideUrl: require('@/assets/images/m-hide.png')
    },
    // 验证码
    code: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    // 历史记录路径
    historyUrl: 'Home',
    // 临时历史记录
    tempUrl: '',
    // 详情pid
    detailPid: '',
    // 是否加载过
    isLoad: false,
    // 用户地址
    addrList: [
      // {name: '郭春梅', sex: '1', phone: '13200000098', tag: '家', isDefault: true, addr: '北京市北京市东城区908路'},
      // {name: '黄冰冰', sex: '1', phone: '13300000098', tag: '公司', isDefault: false, addr: '北京市北京市东城区908路'}
    ],
    // 编辑状态
    ediState: {
      isEdi: false,
      aid: ''
    },

    // 返回的路
    port: 1

  },
  mutations: {
    // 设置历史路径
    setHistoryUrl(state, name) {
      state.historyUrl = name;
    },
    // 设置临时详情数据
    setDetailPid(state, pid) {
      state.detailPid = pid;
    },

    // 设置值
    setValue(state, obj) {
      state[obj.key] = obj.value;
    },

    // 设置地址
    setArea(state, data) {

      state.addrList = data;

    },

    // 删除地址
    subArea(state, index) {
      state.addrList.splice(index, 1);

      if (state.addrList.length <= 0) {
        return
      }

      for (let i = 0; i < state.addrList.length; i++) {
        if (state.addrList[i].isDefault) {
          return;
        }
      }

      state.addrList[0].isDefault = 1;
    },

    // 设置地址修改状态
    setEdiState(state, obj) {
      state.ediState.isEdi = obj.state;
      state.ediState.aid = obj.aid;
    }
  },
  // 模块数据
  modules: {
    // 登录模块
    LoginModule,
    // 注册模块
    LogonModule,
    // 找回密码模块
    RetrieveModule,
    // 主页模块
    MainModule,
    // 首页模块
    HomeModule,
    // 提交订单模块
    SettlementModule,
    // 订单模块
    OrderModule
  }
})
