import styleStore from "@/pages/store/style-store"//款式商城
import styleStoreDetails from "@/pages/store/style-store-details"//款式商城
import styleStoreAddOrder from "@/pages/store/style-store-add-order"//款式商城
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
]