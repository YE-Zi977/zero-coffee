export const state = {
  // 用户名
  userName: {
    value: '',
    isShow: true,
    isShowPass: false,
    isPass: -1
  },
  // 验证码
  ifyCode: {
    value: '',
    isShow: true,
    isShowPass: false,
    isPass: -1,
    codeText: '获取验证码',
    // 是否禁用获取验证码
    isProhibit: false,
    code: '',
    once: 0
  },
  // 密码
  passWord1: {
    value: '',
    isShow: true,
    isShowPass: false,
    isPass: -1,
    isHide: true
  },
  // 确认密码
  passWord2: {
    value: '',
    isShow: true,
    isShowPass: false,
    isPass: -1,
    isHide: true
  }
}