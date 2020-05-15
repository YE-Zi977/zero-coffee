export const mutations = {

  toggle(state, item) {

    for (let i = 0; i < state.menuList.length; i++) {
      if (state.menuList[i].isActive) {
        state.menuList[i].isActive = false;
        break;
      }
    }
    
    item.isActive = true;
    state.currentTitle = item.title;
  },

  // 通过name来跳转
  toName(state, obj) {
    for (let i = 0; i < state.menuList.length; i++) {
      if (state.menuList[i].path.name == obj.name) {
        state.menuList[i].isActive = true;
        state.currentTitle = state.menuList[i].title;
      }else {
        state.menuList[i].isActive = false;
      }
    }
    state.active.number = obj.active;
    obj.self.$router.push({name: obj.name});
  }
}