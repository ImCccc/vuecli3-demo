import Vue from 'vue';
import App from './App.vue';
import '@/plugins';
import '@/assets/styles/index.scss';
import 'element-ui/lib/theme-chalk/index.css';
import { Button, Image } from 'element-ui';

Vue.component(Image.name, Image);
Vue.component(Button.name, Button);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');
