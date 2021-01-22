import proceedsAdd from "@/pages/proceeds/proceeds-add"
import proceedsList from "@/pages/proceeds/proceeds-list/proceeds-list"
import proceedsDetails from "@/pages/proceeds/proceeds-list/proceeds-details"
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
    {
        path: '/proceedsDetails',
        name: 'proceedsDetails',
        component: proceedsDetails,
    },
]