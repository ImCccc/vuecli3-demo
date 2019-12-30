import { isObj } from '@/util/utils.js';
const PARAMS_KEY = '__PAGE_PARAMS__';

// 获取参数
const getParams = (key = '') => {
  let params = sessionStorage[PARAMS_KEY] || '';
  try {
    let paramsParse = JSON.parse(params);
    if (isObj(paramsParse)) return key ? paramsParse[key] : paramsParse;
    return paramsParse;
  } catch (e) {
    return params;
  }
};

// 设置页面的参数
const setParams = (params) => {
  sessionStorage[PARAMS_KEY] = params !== undefined ? JSON.stringify(params) : null;
};

const install = {
  install(Vue) {
    Object.assign(Vue.prototype, {
      $_getParams(key) {
        return getParams(key);
      },

      $_clearParams() {
        setParams();
      },

      // 全局的返回方法，可以传递参数
      $_back(params) {
        setParams(params);
        this.$router.back();
      },

      // 全局的跳转方法，参数统一传递
      $_goPage(router, params) {
        setParams(params);
        if (isObj(router)) {
          // 有breadCrumbTitle需要添加面包屑
          if (router.breadCrumbTitle) {
            this.$root.$emit('pushBreadRecord', {
              path: router.path,
              title: router.breadCrumbTitle
            });
          }
          // 列表需要保存滚动的位置
          if (router.saveScrollRef && this.$_saveScrollBar) {
            this.$_saveScrollBar(router.saveScrollRef);
          }
        }
        this.$router.push(router);
      }
    });
  }
};

export default install;
