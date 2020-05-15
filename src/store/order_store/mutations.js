
export const mutations = {

  // 设置值
  setValue(state, obj) {
    state[obj.key] = obj.value;
  },

  // 裁剪
  splice(state, index) {
    state.OrderList.splice(index, 1);
  }

}