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
import PerButton from "./components/button/per-button"
import Clipboard from "vue-clipboard2";
import hasPermission from "./permission/index";
import { Lazyload } from 'vant';
import { create, all } from 'mathjs'
import md5 from 'js-md5';

const mathjs = create(all)

mathjs.config({
    number: 'BigNumber',
    precision: 64
})
Vue.use(Lazyload);


Vue.use(Vant)
Vue.component("per-button",PerButton)

Vue.prototype.$axios = axios;
Vue.prototype.$dateUtils = dateUtils;
Vue.prototype.$selectUtils = selectUtils;
Vue.prototype.$roleUtils = roleUtils;
Vue.prototype.$upload = upload
Vue.prototype.$projectsType = projectsType;
Vue.prototype.$stringUtils = stringUtils;
Vue.prototype.$per = hasPermission;
Vue.prototype.$math = mathjs
Vue.prototype.$md5 = md5


Vue.use(SlimCropper)
Vue.use(Clipboard)
Vue.config.productionTip = false

axios.defaults.baseURL = '/api'
let token=localStorage.getItem("token");
axios.defaults.headers['token'] = `${token!==null?token:""}`;
axios.defaults.headers['isWebView'] = "WebView";
axios.interceptors.response.use(
    function (response) {
        if (response.data.code===604){
            const u = navigator.userAgent;
            const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            // localStorage.clear();
            if (isiOS) {
                //IOS
                window.webkit.messageHandlers.logout.postMessage("已退出")
            } else {
                //Android
                androidMethod.logOut();
            }
        }

        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
