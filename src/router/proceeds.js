import proceedsAdd from "@/pages/proceeds/proceeds-add"
import proceedsList from "@/pages/proceeds/proceeds-list/proceeds-list"

export default [
    {
        path: '/proceedsAdd',
        name: 'proceedsAdd',
        component: proceedsAdd,
    },
    {
        path: '/proceedsList',
        name: 'proceedsList',
        component: proceedsList,
    },
]