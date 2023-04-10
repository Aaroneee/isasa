import depositDetail from "@/pages/statement/deposit/deposit-detail";
import depositApply from "@/pages/statement/deposit/deposit-apply";
import depositList from "@/pages/statement/deposit/deposit-list";
import depositEdit from "@/pages/statement/deposit/deposit-edit";
import depositConfirm from "@/pages/statement/deposit/deposit-confirm";

export default [
    {
        path: '/depositDetail',
        name: 'depositDetail',
        component: depositDetail,
    },
    {
        path: '/depositApply',
        name: 'depositApply',
        component: depositApply,
    },
    {
        path: '/depositList',
        name: 'depositList',
        component: depositList
    },
    {
        path: '/depositEdit',
        name: 'depositEdit',
        component: depositEdit
    },
    {
        path: '/depositConfirm',
        name: 'depositConfirm',
        component: depositConfirm
    }
]