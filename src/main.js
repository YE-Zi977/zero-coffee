import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 插件
import vHead from '@/components/v-head.vue'
import slider from '@/components/slider.vue'

Vue.component('vHead', vHead);
Vue.component('slider', slider);

// Vuex
import store from './store'

// axios
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios);

// vue cookies
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)

// rem 适配
import 'amfe-flexible/index.js'

// vant 
import {
  Dialog,
  Button,
  Search,
  Swipe,
  SwipeItem,
  Sticky,
  Icon,
  Tab,
  Tabs,
  NoticeBar,
  Checkbox, 
  CheckboxGroup,
  Stepper,
  Tag,
  SubmitBar,
  Overlay,
  Toast,
  Popup,
  Area,
  RadioGroup,
  Radio,
  Switch,
  PasswordInput,
  NumberKeyboard,
  Uploader,
  Field,
  Form,
  Loading,
  Lazyload
} from 'vant'

Vue
  .use(Dialog)
  .use(Button)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Sticky)
  .use(Icon)
  .use(Tab)
  .use(Tabs)
  .use(NoticeBar)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Stepper)
  .use(Tag)
  .use(SubmitBar)
  .use(Overlay)
  .use(Toast)
  .use(Popup)
  .use(Area)
  .use(RadioGroup)
  .use(Radio)
  .use(Switch)
  .use(PasswordInput)
  .use(NumberKeyboard)
  .use(Uploader)
  .use(Field)
  .use(Form)
  .use(Loading)
  .use(Lazyload)

router.beforeEach((to, form, next) => {

  window.addEventListener('load', function () {
    if(location.href.split('#')[1].split('/')[1] =='main'){
      // location.replace(location.href.split('#')[0])
      next({name: 'Home'});
    }
  })

  next();
})

Vue.config.productionTip = false

//设置基础请求路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

//配置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

// appkey
Vue.prototype.appkey = 'U2FsdGVkX1++HynedZE6l4PAgkjvZ1ejpanidvR4YKc=';
// Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';

// 动态设置body元素高度
let height = window.innerHeight;
document.body.style.height = height + 'px';

window.onresize = function() {
  height = window.innerHeight;
  document.body.style.height = height + 'px';
}


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
