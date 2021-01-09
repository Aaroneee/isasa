import Vue from 'vue'
import App from './App.vue'

import Vant from 'vant'
import axios from 'axios'
import 'vant/lib/index.css'
import router from './router'
import dateUtils from './common/js/date-utils'
import selectUtils from './common/js/select-utils'

Vue.use(Vant)

Vue.prototype.axios = axios
Vue.prototype.dateUtils = dateUtils
Vue.prototype.selectUtils = selectUtils

Vue.config.productionTip = false

export default new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
