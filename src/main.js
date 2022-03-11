import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/global.scss';
import App from './App.vue'
import router from './router'
import store from './store'


// import echarts from 'echarts'; 
import * as echarts from 'echarts'; // 如果安装的是echarts 5以上版本，则需此种方式引入
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
