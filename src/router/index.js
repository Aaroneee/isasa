import Vue from 'vue'
import Router from 'vue-router'

import home from "./home"
import customer from "./customer"//客资
import appoint from "./appoint"//预约
import order from "./order"//订单
import proceeds from "./proceeds"//收款
import clothes from "@/router/clothes";


// import login from '../pages/login/login'//首页


Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        ...home,
        ...customer,
        ...appoint,
        ...order,
        ...proceeds,
        ...clothes,
    ]
})
