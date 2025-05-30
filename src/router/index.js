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
import user from "@/router/user";//押金
import message from "@/router/message";//押金
import makeup from "@/router/makeup";//化妆
import spend from "@/router/spend";//支出
import account from "@/router/account";//账户
import clothesOperation from "@/router/clothesOperation";//婚纱操作

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
        ...user,
        ...message,
        ...makeup,
        ...spend,
        ...account,
        ...clothesOperation,
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
