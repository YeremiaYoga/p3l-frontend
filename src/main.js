import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueQRCodeComponent from 'vue-qr-generator'
import axios from 'axios'

Vue.component('qr-code', VueQRCodeComponent)

Vue.config.productionTip = false

Vue.prototype.$http = axios;
Vue.prototype.$api = 'http://192.168.100.3:6969/api';

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
