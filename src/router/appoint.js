import appAdd from "@/pages/appoint/app_add" //客资添加
import appList from "@/pages/appoint/app-list/app-list" //客资添加
import appDetails from "@/pages/appoint/app-list/app-details" //客资添加


export default [
    {
        path: '/appAdd',
        name: 'appAdd',
        component: appAdd,
    },
    {
        path: '/appList',
        name: 'appList',
        component: appList,
    },
    {
        path: '/appDetails',
        name: 'appDetails',
        component: appDetails,
    },
];