import orderAdd from "@/pages/order/order-add"//订单添加
import orderList from "@/pages/order/order-list/order-list"//订单列表
import orderDetails from "@/pages/order/order-list/order-details"//订单详情
import orderClothes from "@/pages/order/order-list/order-clothes"//订单款式上传
import orderImages from "@/pages/order/order-list/order-images"//订单图片及上传订单图片

export default [
    {
        path: '/orderAdd',
        name: 'orderAdd',
        component: orderAdd,
    },
    {
        path: '/orderList',
        name: 'orderList',
        component: orderList,

    },
    {
        path: '/orderDetails',
        name: 'orderDetails',
        component: orderDetails,
    },
    {
        path: '/orderClothes',
        name: 'orderClothes',
        component: orderClothes,
    },
    {
        path: '/orderImages',
        name: 'orderImages',
        component: orderImages,
    },
]
