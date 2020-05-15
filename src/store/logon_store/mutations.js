// 导入正则验证
import { utils } from '@/utils/utils'

export const mutations = {

  // 控制密码可不可见
  show(state, key) {
    if (state[key].isHide) {
      state[key].isHide = false
      return;
    }

    state[key].isHide = true;

  },

  // 隐藏提示
  hide(state, key) {
    if (state[key].value != '') {
      return
    }

    state[key].isShow = false;
  },

  // 显示错误提示
  showP(state, obj) {

    if (obj.reg !== undefined) {
        
      if (obj.key == 'ifyCode') {
        state[obj.key].value = state[obj.key].value.toLowerCase();
      }

      state[obj.key].isShowPass = !utils.RegValue(obj.reg, state[obj.key].value);
      state[obj.key].isPass = state[obj.key].isShowPass ? 0 : 1;
    }

    if (obj.key == 'passWord1' && state.passWord1.value != state.passWord2.value) {
      state.passWord2.isPass = 0;
    }

    if (state[obj.key].value == '') {
      state[obj.key].isShow = true;
      state[obj.key].isPass = 0;
      return
    }
  },
  
  // 更改验证码
  changeCode(state, code) {
    state.ifyCode.code = code.toLowerCase();
    if (state.ifyCode.value != state.ifyCode.code && state.ifyCode.once++) {
      state.ifyCode.isShowPass = true;
      state.ifyCode.isPass = 0;
    }
    state.ifyCode.isProhibit = true;
    let time = 45;
    state.ifyCode.codeText = time + '秒后获取'
    let timer = setInterval(() => {
      state.ifyCode.codeText = (--time < 10 ? '0' + time : time) + '秒后获取';
      if (time == -1) {
        clearInterval(timer);
        state.ifyCode.isProhibit = false;
        state.ifyCode.codeText = '获取验证码'
      }
    }, 1000);
  },

  // 重置表单
  reset(state) {
    state.userName.value = '';
    state.ifyCode.value = '';
    state.passWord1.value = '';
    state.passWord2.value = '';

    state.userName.isPass = -1;
    state.ifyCode.isPass = -1;
    state.passWord1.isPass = -1;
    state.passWord2.isPass = -1;
  }
}