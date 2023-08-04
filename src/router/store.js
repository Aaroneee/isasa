import styleStore from "@/pages/store/style-store"//款式商城
import styleStoreDetails from "@/pages/store/style-store-details"//款式商城
import styleStoreAddOrder from "@/pages/store/style-store-add-order"//款式商城
import styleStoreShopCart from "@/pages/store/style-store-shop-cart"//款式商城
import styleStoreOrderList from "@/pages/store/style-store-order-list"//款式商城
import styleStoreOrderAdminList from "@/pages/store/style-store-order-admin-list"//款式商城
import styleStoreBrandManage from "@/pages/store/style-store-brand-manage"//款式商城
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
    },
]