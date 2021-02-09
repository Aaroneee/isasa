import clothesAdd from "@/pages/clothes/clothes/clothes-add"
import clothesList from "@/pages/clothes/clothes/clothes-list"
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
    {
        path: '/styleEdit',
        name: 'styleEdit',
        component: styleEdit,
    },
]
