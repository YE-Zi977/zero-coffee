
export const mutations = {
  // 获取订单数据
  getOrder(state, data) {
    state.orderList = data;
  },

  // 添加订单
  addOrder(state, data) {
    state.orderList.push(data);
  },

  // 设置值
  setValue(state, obj) {
    state[obj.key] = obj.value;
  }

}