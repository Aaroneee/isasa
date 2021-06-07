import cusList from "@/pages/customer/cus-list/cus-list" //客资列表
import cusDetails from "@/pages/customer/cus-list/cus-details" //客资详情
import cusAdd from "@/pages/customer/cus-add" //客资添加
import mCusList from "@/pages/customer/cus-list/m-cus-list"//我的客资列表
import cusEdit from "@/pages/customer/cus-list/cus-edit" //客资修改

export default [
    {
        path: '/cusList',
        name: 'cusList',
        component: cusList,
    },
    {
        path: '/cusDetails',
        name: 'cusDetails',
        component: cusDetails,
    },
    {
        path: '/cusAdd',
        name: 'cusAdd',
        component: cusAdd,
    },
    {
        path: '/cusEdit',
        name: 'cusEdit',
        component: cusEdit,
    },
    {
        path: '/mCusList',
        name: 'mCusList',
        component: mCusList,
    }
];
