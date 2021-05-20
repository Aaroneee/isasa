import appAdd from "@/pages/appoint/app-add" //预约添加
import appList from "@/pages/appoint/app-list/app-list" //预约列表
import appScheduleList from "@/pages/appoint/appoint-schedule/app-schedule-list" //预约档期
import appDetails from "@/pages/appoint/app-list/app-details" //预约详情
import appEdit from "@/pages/appoint/app-list/app-edit" //预约编辑
import appArrival from "@/pages/appoint/app-list/app-arrival"//预约到店
import mScheduleList from "@/pages/appoint/appoint-schedule/m-schedule-list" //我的预约


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
    {
        path: '/appEdit',
        name: 'appEdit',
        component: appEdit,
    },
    {
        path: '/appArrival',
        name: 'appArrival',
        component: appArrival,
    },
    {
        path: '/appScheduleList',
        name: 'appScheduleList',
        component: appScheduleList,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/mScheduleList',
        name: 'mScheduleList',
        component: mScheduleList,
        meta: {
            keepAlive: true
        }
    },
];
