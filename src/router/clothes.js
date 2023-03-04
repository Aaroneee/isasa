import clothesAdd from "@/pages/clothes/clothes/clothes-add"
import clothesList from "@/pages/clothes/clothes/clothes-list"
import clothesListPad from "@/pages/clothes/clothes/clothes-list-pad"
import clothesDetails from "@/pages/clothes/clothes/clothes-details"
import clothesDetailsPad from "@/pages/clothes/clothes/clothes-details-pad"
import clothesOperation from "@/pages/clothes/clothes/clothes-operation"
import styleList from "@/pages/clothes/style/style-list"
import styleImage from "@/pages/clothes/style/style-image"
import styleDetails from "@/pages/clothes/style/style-details"
import styleAdd from "@/pages/clothes/style/style-add"
import styleEdit from "@/pages/clothes/style/style-edit"
import scheduleList from "@/pages/clothes/schedule/schedule-list"
import clothesSchedule from "@/pages/clothes/schedule/clothes-schedule"
import styleIntroduce from "@/pages/clothes/style/style-introduce"
import clothesOperationRecord from "@/pages/clothes/clothes/clothes-operation-record"
import stylePrice from "@/pages/clothes/style/style-price"
import clothesBumperAlert from "@/pages/clothes/clothes/clothes-bumper-alert";
import clothesManager from "@/pages/clothes/clothes/clothes-manager";

export default [
    {
        path: '/clothesManager',
        name: 'clothesManager',
        component: clothesManager,
    },
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
        path: '/clothesListPad',
        name: 'clothesListPad',
        component: clothesListPad,
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
    {
        path: '/clothesDetails',
        name: 'clothesDetails',
        component: clothesDetails,
    },
    {
        path: '/clothesDetailsPad',
        name: 'clothesDetailsPad',
        component: clothesDetailsPad,
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
    {
        path: '/clothesOperationRecord',
        name: 'clothesOperationRecord',
        component: clothesOperationRecord,
    },
    {
        path: '/stylePrice',
        name: 'stylePrice',
        component: stylePrice,
    },
    {
        path: '/clothesBumperAlert',
        name: 'clothesBumperAlert',
        component: clothesBumperAlert,
    }
]
