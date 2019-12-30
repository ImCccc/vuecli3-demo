let baseURL = {
  development: '/api', // 开发环境
  production: '' // 生产环境
};

module.exports = {
  // 配置axios的baseURL； 开发环境是所有的请求前序添加 /api 用于代理； 生产环境设置为''
  axiosBaseURL: baseURL[process.env.NODE_ENV],
  // 开发环境代理服务器配置
  proxyTarget: 'http://localhost:8081/'
  // proxyTarget: 'http://10.8.108.105:8081/'
};