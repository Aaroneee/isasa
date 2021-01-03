import Vue from 'vue'
import Router from 'vue-router'
import home from '../pages/home/home'//首页
import user from '../pages/home/user'//我的
import work from '../pages/home/work'//我的
import statistic from '../pages/home/statistic'//我的

import cusList from "../pages/customer/cus-list/cus-list" //客资列表

// import login from '../pages/login/login'//首页


Vue.use(Router)

export default new Router({
    routes: [
        // {//登陆
        //     path: '/',
        //     name: '/',
        //     component: login
        // },
        {//首页
            path: '/',
            name: 'home',
            component: home,
            children:[
                //我的
                {
                    path: '',
                    name: 'work',
                    component: work
                },
                //我的
                {
                    path: 'statistic',
                    name: 'statistic',
                    component: statistic
                },
                //我的
                {
                    path: 'user',
                    name: 'user',
                    component: user
                },
            ]
        },
        {
            path: 'cusList',
            name: 'cusList',
            component: cusList,
        },
    ]
})