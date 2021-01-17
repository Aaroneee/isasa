import orderAdd from "@/pages/order/order-add"
import orderList from "@/pages/order/order-list/order-list"

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
]