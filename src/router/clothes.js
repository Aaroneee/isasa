import clothesAdd from "@/pages/clothes/clothes/clothes-add"
import clothesList from "@/pages/clothes/clothes/clothes-list"
import clothesDetails from "@/pages/clothes/clothes/clothes-details"
import clothesOperation from "@/pages/clothes/clothes/clothes-operation"
import styleList from "@/pages/clothes/style/style-list"
import styleImage from "@/pages/clothes/style/style-image"
import styleDetails from "@/pages/clothes/style/style-details"
import styleAdd from "@/pages/clothes/style/style-add"
import styleEdit from "@/pages/clothes/style/style-edit"
import scheduleList from "@/pages/clothes/schedule/schedule-list"
import clothesSchedule from "@/pages/clothes/schedule/clothes-schedule"
import styleIntroduce from "@/pages/clothes/style/style-introduce"

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
    {
        path: '/styleImage',
        name: 'styleImage',
        component: styleImage,
    },
    {
        path: '/styleDetails',
        name: 'styleDetails',
        component: styleDetails,
    },
    {
        path: '/scheduleList',
        name: 'scheduleList',
        component: scheduleList,

    },
    {
        path: '/clothesSchedule',
        name: 'clothesSchedule',
        component: clothesSchedule,
    },
    {
        path: '/clothesOperation',
        name: 'clothesOperation',
        component: clothesOperation,
    },
    {
        path: '/styleIntroduce',
        name: 'styleIntroduce',
        component: styleIntroduce,
    },
]
