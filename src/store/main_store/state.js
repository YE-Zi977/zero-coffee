export const state = {
  menuList: [
    {title: '零度咖啡', name: '主页', icon: '&#xe603;', isActive: true, path: {name: 'Home'}},
    {title: '我的订单', name: '订单', icon: '&#xe658;', isActive: false, path: {name: 'Order'}},
    {title: '购物车', name: '购物车', icon: '&#xe501;', isActive: false, path: {name: 'ShoppingCart'}},
    {title: '个人中心', name: '我的', icon: '&#xe510;', isActive: false, path: {name: 'My'}}
  ],
  currentTitle: '零度咖啡',
  active: {
    number: '0'
  }
}