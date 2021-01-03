import Vue from 'vue'
import App from './App.vue'

import Vant from 'vant'
import axios from 'axios'
import 'vant/lib/index.css'
import router from './router'

Vue.use(Vant)

Vue.prototype.axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
