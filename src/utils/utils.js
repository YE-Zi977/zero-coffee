class Utils {
  constructor() {

  }
  
  // 序列化参数
  transformRequest(obj) {
    let paramsString = '';
    for(let key in obj) {
      paramsString += key + '=' + obj[key] + '&';
    }
    return paramsString.slice(0, -1);
  }

  // 正则验证
  RegValue(reg, value) {
    let $reg = new RegExp(reg);
    return $reg.test(value);
  }

  // 请导零
  zero(number) {
    return number < 10 ? '0' + number : number;
  }

  // 格式化时间
  getTime(dateObj) {
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();

    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let seconds = dateObj.getSeconds();

    return year + '-' + this.zero(month) + '-' + this.zero(day) + ' ' + this.zero(hours) + ':' + this.zero(minutes) + ':' + this.zero(seconds);
  }

  // 获取token
  getToken() {

    let token = '';

    for (let i = 0; ; i++) {
      if (this.$cookies.get('l' + i) == null) {
        break;
      }
      token += this.$cookies.get('l' + i) + '.'
    }

    token = token.slice(0, -1);

    return token
  }

}

export const utils = new Utils()