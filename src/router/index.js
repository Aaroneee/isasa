import Vue from 'vue'
import Router from 'vue-router'

import home from "./home"
import customer from "./customer"
import appoint from "./appoint"


// import login from '../pages/login/login'//首页


Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [...home,...customer,...appoint]
})