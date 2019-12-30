import vue from 'vue';
import vuex from 'vuex';
vue.use(vuex);
let modules = {};
const context = require.context('./modules', true, /\.js$/);
context.keys().forEach(mod => {
  const storeModule = context(mod).default;
  if (!storeModule._name) return;
  modules[storeModule._name] = storeModule;
});
export default new vuex.Store({ modules });
