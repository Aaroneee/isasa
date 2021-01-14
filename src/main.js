import Vue from 'vue'
import App from './App.vue'

import Vant from 'vant'
import axios from 'axios'
import 'vant/lib/index.css'
import router from './router'
import dateUtils from './common/js/utils/date-utils'
import selectUtils from './common/js/utils/select-utils'
import projectsType from './common/js/constant/projects-type'

Vue.use(Vant)

Vue.prototype.$axios = axios;
Vue.prototype.$dateUtils = dateUtils;
Vue.prototype.$selectUtils = selectUtils;
Vue.prototype.$projectsType = projectsType;

Vue.config.productionTip = false

export default new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
