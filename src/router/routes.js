export const routes = [
  {
    path: '/main',
    name: 'Main',
    
    component: () => import('../views/Main.vue'),

    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/main_contents/Home.vue')
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('../views/main_contents/Order.vue')
      },
      {
        path: 'shopping-cart',
        name: 'ShoppingCart',
        component: () => import('../views/main_contents/ShoppingCart.vue')
      },
      {
        path: 'my',
        name: 'My',
        component: () => import('../views/main_contents/My.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',

    component: () => import('../views/Login.vue')
  },
  {
    path: '/logon',
    name: 'Logon',

    component: () => import('../views/Logon.vue')
  },
  {
    path: '/retrieve',
    name: 'Retrieve',

    component: () => import('../views/Retrieve.vue')
  },
  {
    path: '/email',
    name: 'Email',

    component: () => import('../views/Email.vue')
  },
  {
    path: '/detail',
    name: 'Detail',

    component: () => import('../views/sub_page/Detail.vue')
  },
  {
    path: '/settlement',
    name: 'Settlement',

    component: () => import('../views/sub_page/Settlement.vue')
  },
  {
    path: '/add-addr',
    name: 'AddAddr',

    component: () => import('../views/sub_page/AddAddr.vue')
  },
  {
    path: '/input-password',
    name: 'InputPassword',

    component: () => import('../views/sub_page/InputPassword.vue')
  },
  {
    path: '/edi-area',
    name: 'EdiArea',

    component: () => import('../views/sub_page/EdiArea.vue')
  },
  {
    path: '/prodata',
    name: 'ProData',

    component: () => import('../views/sub_page/ProData.vue')
  },
  {
    path: '/like',
    name: 'Like',

    component: () => import('../views/sub_page/Like.vue')
  },
  {
    path: '/setting',
    name: 'Setting',

    component: () => import('../views/sub_page/Setting.vue')
  },
  {
    path: '/ify-password',
    name: 'IfyPassword',

    component: () => import('../views/sub_page/IfyPassword.vue')
  },
  {
    path: '*',

    redirect: {
      name: 'Login'
    }
  }
]