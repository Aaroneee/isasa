import Vue from 'vue'
import App from './App.vue'
import store from './store'

import Vant from 'vant'
import axios from 'axios'
import 'vant/lib/index.css'
import '@/common/css/base.css'
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
import VConsole from 'vconsole';

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
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'


Vue.use(SlimCropper)
Vue.use(Clipboard)
Vue.use(VuePlyr)
Vue.config.productionTip = false

axios.defaults.baseURL = '/api'
// const vConsole = new VConsole();
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
axios.interceptors.request.use(
    config => {
        let empId = localStorage.getItem("empId");
        if (empId!==null){
            // config.headers.empId = JSON.parse(emp).id;
            config.headers['empId']=empId;
        }
        let tenantCrop = localStorage.getItem("tenantCrop");
        if (tenantCrop!==null){
            // config.headers.tenantCrop = tenantCrop;
            config.headers['tenantCrop']=tenantCrop;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
export default new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
