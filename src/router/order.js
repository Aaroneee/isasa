import orderAdd from "@/pages/order/order-add"//订单添加
import orderList from "@/pages/order/order-list/order-list"//订单列表
import orderDetails from "@/pages/order/order-list/order-details"//订单详情

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
]