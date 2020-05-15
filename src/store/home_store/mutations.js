export const mutations = {
  // 获取banner图片路径
  getBanner(state, data) {
    state.bannerImgs = data;
  },

  // 获取column图片路径
  getColumnDate(state, data) {
    state.columnData = data;
  }
}