import styleStore from "@/pages/store/style-store"//款式商城
import styleStoreDetails from "@/pages/store/style-store-details"//款式详情
import styleStoreAddOrder from "@/pages/store/style-store-add-order"//添加订单
import styleStoreShopCart from "@/pages/store/style-store-shop-cart"//购物车
import styleStoreOrderList from "@/pages/store/style-store-order-list"//订单列表
import styleStoreOrderAdminList from "@/pages/store/style-store-order-admin-list"//订单管理
import styleStoreBrandManage from "@/pages/store/brand/style-store-brand-manage.vue"//品牌管理
import styleStoreBrandEdit from "@/pages/store/brand/style-store-brand-edit.vue"//品牌系列编辑
import styleStoreBrandAdd from "@/pages/store/brand/style-store-brand-add.vue"//品牌添加
import styleStoreSeriesAdd from "@/pages/store/brand/style-store-series-add.vue"//系列添加
import styleStoreStyleList from "@/pages/store/style-store-style-list.vue"//款式列表
export default[
    {
        path: '/styleStore',
        name: 'styleStore',
        component: styleStore,
    },
    {
        path: '/styleStoreDetails',
        name: 'styleStoreDetails',
        component: styleStoreDetails,
    },
    {
        path: '/styleStoreAddOrder',
        name: 'styleStoreAddOrder',
        component: styleStoreAddOrder,
    },
    {
        path: '/styleStoreShopCart',
        name: 'styleStoreShopCart',
        component: styleStoreShopCart,
    },
    {
        path: '/styleStoreOrderList',
        name: 'styleStoreOrderList',
        component: styleStoreOrderList,
    },
    {
        path: '/styleStoreOrderAdminList',
        name: 'styleStoreOrderAdminList',
        component: styleStoreOrderAdminList,
    },
    {
        path: '/styleStoreBrandManage',
        name: 'styleStoreBrandManage',
        component: styleStoreBrandManage,
    },    {
        path: '/styleStoreBrandEdit',
        name: 'styleStoreBrandEdit',
        component: styleStoreBrandEdit,
    },
    {
        path: '/styleStoreBrandAdd',
        name: 'styleStoreBrandAdd',
        component: styleStoreBrandAdd,
    },
    {
        path: '/styleStoreSeriesAdd',
        name: 'styleStoreSeriesAdd',
        component: styleStoreSeriesAdd,
    },
    {
        path: '/styleStoreStyleList',
        name: 'styleStoreStyleList',
        component: styleStoreStyleList,
    },

]