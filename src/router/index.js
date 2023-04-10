import Vue from 'vue'
import Router from 'vue-router'

import home from "@/router/home"
import customer from "@/router/customer"//客资
import appoint from "@/router/appoint"//预约
import order from "@/router/order"//订单
import proceeds from "@/router/proceeds"//收款
import clothes from "@/router/clothes"
import statement from "@/router/statement"
import afterSale from "@/router/afterSale";
import store from "@/router/store";
import deposit from "@/router/deposit";//押金

// import login from '../pages/login/login'//首页


Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        ...home,
        ...customer,
        ...appoint,
        ...order,
        ...proceeds,
        ...clothes,
        ...statement,
        ...afterSale,
        ...store,
        ...deposit,
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {x: 0, y: 0}
        }
    }
})

router.afterEach(() => {

    window.scrollTo(0, 0);

});

export default router
