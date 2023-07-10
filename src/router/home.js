import home from '../pages/home/home'//首页
import user from '../pages/home/user'//我的
import work from '../pages/home/work'//我的
import store from '../pages/home/store'//我的
import statistic from '../pages/home/statistic'//我的

export default [
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
                path: '/statistic',
                name: 'statistic',
                component: statistic
            },
            //商城
            {
                path: '/store',
                name: 'store',
                component: store
            },
            //我的
            {
                path: '/user',
                name: 'user',
                component: user
            },
        ]
    },

]