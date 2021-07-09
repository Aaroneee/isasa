import Vue from 'vue'
import App from './App.vue'
import store from './store'

import Vant from 'vant'
import axios from 'axios'
import 'vant/lib/index.css'
import router from './router'
import dateUtils from './common/js/utils/date-utils'
import selectUtils from './common/js/utils/select-utils'
import upload from "@/common/js/utils/upload";
import roleUtils from "@/common/js/utils/role-utils";
import stringUtils from "@/common/js/utils/string-utils";
import projectsType from './common/js/constant/projects-type';
import SlimCropper from 'vue-slim-cropper';


Vue.use(Vant)

Vue.prototype.$axios = axios;
Vue.prototype.$dateUtils = dateUtils;
Vue.prototype.$selectUtils = selectUtils;
Vue.prototype.$roleUtils = roleUtils;
Vue.prototype.$upload = upload
Vue.prototype.$projectsType = projectsType;
Vue.prototype.$stringUtils = stringUtils;
Vue.use(SlimCropper)
Vue.config.productionTip = false

axios.defaults.baseURL = '/api'
export default new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
