import appAdd from "@/pages/appoint/app-add" //预约添加
import appList from "@/pages/appoint/app-list/app-list" //预约列表
import appScheduleList from "@/pages/appoint/appoint-schedule/app-schedule-list" //预约档期
import appDetails from "@/pages/appoint/app-list/app-details" //预约详情
import appEdit from "@/pages/appoint/app-list/app-edit" //预约编辑
import appArrival from "@/pages/appoint/app-list/app-arrival"//预约到店
import mScheduleList from "@/pages/appoint/appoint-schedule/m-schedule-list" //我的预约
import addYarnClothes from "@/pages/appoint/yarn-clothes/add-yarn-clothes" //添加试纱
import dailyAppList from "@/pages/appoint/yarn-clothes/daily-app-list"  //试纱 每日预约
import yarnClothesImages from "@/pages/appoint/yarn-clothes/yarn_clothes_images" // 试纱图片
import afterSaleAppAdd from "@/pages/appoint/after-sale-app-add"
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
    },
    {
        path: '/mScheduleList',
        name: 'mScheduleList',
        component: mScheduleList,
    },
    {
        path: '/addYarnClothes',
        name: 'addYarnClothes',
        component: addYarnClothes,
    },
    {
        path: '/dailyAppList',
        name: 'dailyAppList',
        component: dailyAppList,
    },
    {
        path: '/yarnClothesImages',
        name: "yarnClothesImages",
        component: yarnClothesImages
    },
    {
        path: '/appAdd',
        name: 'appAdd',
        component: appAdd,
    },
    {
        path: '/afterSaleAppAdd',
        name: 'afterSaleAppAdd',
        component: afterSaleAppAdd,
    }
];
