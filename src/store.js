import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        keepAlive: []
    },
    mutations: {
        setKeepAlive: (state, keepAlive) => {
            state.keepAlive = keepAlive
        }
    },
    getters: {
        keepAlive: state => state.keepAlive
    }
});