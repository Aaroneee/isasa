import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        keepAlive: [],
        permission: [],
    },
    mutations: {
        setKeepAlive: (state, keepAlive) => {
            state.keepAlive = keepAlive
        },
        setPermission(state, permission) {
            this.state.permission = permission
        },
    },
    getters: {
        keepAlive: state => state.keepAlive
    }
});