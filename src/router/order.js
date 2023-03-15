import orderAdd from "@/pages/order/order-add"//订单添加
import orderList from "@/pages/order/order-list/order-list"//订单列表
import orderDetails from "@/pages/order/order-list/order-details"//订单详情
import orderClothes from "@/pages/order/order-list/order-clothes"//订单款式上传
import orderImages from "@/pages/order/order-list/order-images"//订单图片及上传订单图片
import orderEdit from "@/pages/order/order-list/order-edit"//订单图片及上传订单图片
import collOrderList from "@/pages/order/order-list/coll-order-list"//已订单列表
import unCollOrderList from "@/pages/order/order-list/un-coll-order-list"//未订单列表
import onlineOrderAdd from "@/pages/order/online-order-add"//线上订单添加
import directOrderAdd from "@/pages/order/direct-order-add"//直接添加订单
import applyRefund from "@/pages/order/apply-refund.vue";

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
        meta: {
            isBack: false,
        }
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
    {
        path: '/orderEdit',
        name: 'orderEdit',
        component: orderEdit,
    },
    {
        path: '/collOrderList',
        name: 'collOrderList',
        component: collOrderList,
    },
    {
        path: '/unCollOrderList',
        name: 'unCollOrderList',
        component: unCollOrderList,
    },
    {
        path: '/onlineOrderAdd',
        name: 'onlineOrderAdd',
        component: onlineOrderAdd,
    },
    {
        path: '/directOrderAdd',
        name: 'directOrderAdd',
        component: directOrderAdd,
    },
    {
        path: '/applyRefund',
        name: 'applyRefund',
        component: applyRefund,
    }
]
