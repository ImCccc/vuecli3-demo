import { isArrObj } from '@/util/utils.js';

export default {
  _name: 'menu',

  state: {
    menuList: [],
  },

  getters: {
    menuList: state => state.menuList,

    // 当前登录角色有权限访问的左侧菜单， [path1, path2, path3]
    authMenu: state => {
      let arr = [];
      let menuList = state.menuList;
      const loop = (list) => {
        list.forEach(item => {
          let { children, hasAuthority } = item;
          if (!hasAuthority) return;
          if (item.path) arr.push(item.path);
          if (isArrObj(children)) loop(children);
        });
      };
      loop(menuList);
      return arr;
    },

    // 所有菜单的扁平化数组 [menuItem1, menuItem2, ...]
    allMenu: state => {
      let arr = [];
      let menuList = state.menuList;
      const loop = (list) => {
        list.forEach(item => {
          let { children } = item;
          if (item.path) arr.push(item);
          if (isArrObj(children)) loop(children);
        });
      };
      loop(menuList);
      return arr;
    }
  },

  mutations: {
    SET_MENULIST(state, data) {
      state.menuList = data;
    }
  }
};
