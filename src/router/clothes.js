import clothesAdd from "@/pages/clothes/clothes/clothes-add"
import styleList from "@/pages/clothes/style/style-list"
import styleAdd from "@/pages/clothes/style/style-add"

export default [
    {
        path: '/clothesAdd',
        name: 'clothesAdd',
        component: clothesAdd,
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
    },
]
