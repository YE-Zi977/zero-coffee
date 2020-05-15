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
  }
  
}