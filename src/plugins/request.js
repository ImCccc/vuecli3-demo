import axios from 'axios';
import router from '../router';
import { Message, MessageBox } from 'element-ui';
const urlConfig = require('../../url.config.js');

const service = axios.create({
  timeout: 600000, // 设置超时时间
  baseURL: urlConfig.axiosBaseURL,
});

service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
service.defaults.headers.post['Accept'] = 'application/json;charset=UTF-8';

const _goLogin = (time = 0) => {
  localStorage.removeItem('token');
  setTimeout(() => {
    router.replace({
      path: '/login',
      query: { redirect: router.currentRoute.fullPath }
    });
  }, time);
};

const _Message = msg => {
  Message({ type: 'error', message: msg });
};

const _requestMock = (reqConfig) => {
  let mockUrl = reqConfig.mock !== true ? reqConfig.mock : `${reqConfig.url.replace(/\//g, '_')}.js`;
  mockUrl = mockUrl.startsWith('_') ? mockUrl.slice(1) : mockUrl;
  return new Promise((resolve) => {
    import(`@/mock/${mockUrl}`).then(rs => {
      resolve(reqConfig.rawData !== false ? rs.default : rs.default.data);
    });
  });
};

/**
* 请求前拦截
* 用于处理需要在请求前的操作
*/
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = token;
  return config;
}, e => Promise.reject(e));

/**
* 请求响应拦截
* 用于处理需要在请求返回后的操作
*/
service.interceptors.response.use(
  response => {
    return response.status === 200 ? Promise.resolve(response.data) : Promise.reject(response);
  },
  error => {
    if (!error.response) {
      _Message('请检查网络是否连接正常');
      return Promise.reject(error);
    }

    // 服务器返回不是2开头的情况，会进入这个回调
    switch (error.response.status) {
      case 404:
        _Message('网络请求不存在');
        break;
      case 500:
        _Message('服务器请求失败');
        break;
      default:
        _Message(error.response.data.message || '服务器请求失败');
    }
    return Promise.reject(error);
  }
);

// 公共错误处理
let hasMessageBox = null;
const errorCode = {
  '400'() {
    hasMessageBox = MessageBox.alert('登录信息过期，请重新登录', '提示', {
      callback: () => { hasMessageBox = null; _goLogin(100); }
    });
  }
};

export const request = (reqConfig, params, options) => {
  if (hasMessageBox) return;

  // 跑模拟数据
  if (reqConfig.mock && process.env.NODE_ENV === 'development') {
    return _requestMock(reqConfig);
  }

  options = options || {
    hideLoading: false,
    isFormData: false,
    config: {},
  };

  const method = reqConfig.method || 'post';
  return service({
    method: method,
    url: reqConfig.url,
    [method.toLowerCase() !== 'post' ? 'params' : 'data']: params,
    ...options.config
  })
    .then(rs => {
      // 处理公共错误，token过期之类的
      if (errorCode[rs.code]) return errorCode[rs.code]();
      return reqConfig.rawData !== false ? rs : rs.data;
    })
    .catch(e => Promise.reject(e));
};

export default {
  install(Vue) {
    Vue.prototype.$_api = request;
  }
};