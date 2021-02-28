import clothesAdd from "@/pages/clothes/clothes/clothes-add"
import clothesList from "@/pages/clothes/clothes/clothes-list"
import clothesDetails from "@/pages/clothes/clothes/clothes-details"
import styleList from "@/pages/clothes/style/style-list"
import styleAdd from "@/pages/clothes/style/style-add"
import styleEdit from "@/pages/clothes/style/style-edit"

export default [
    {
        path: '/clothesAdd',
        name: 'clothesAdd',
        component: clothesAdd,
    },
    {
        path: '/clothesList',
        name: 'clothesList',
        component: clothesList,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/styleAdd',
        name: 'styleAdd',
        component: styleAdd,
    },
    {
        path: '/styleList',
        name: 'styleList',
        component: styleList,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/styleEdit',
        name: 'styleEdit',
        component: styleEdit,
    },
    {
        path: '/clothesDetails',
        name: 'clothesDetails',
        component: clothesDetails,
    },
]
