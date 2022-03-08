export default [
    {
        path: '/pickUpApp',
        name: 'pickUpApp',
        component: () => import("@/pages/afterSale/pick-up-app")
    },
    {
        path: '/addDeposit',
        name: 'addDeposit',
        component: () => import("@/pages/afterSale/add-deposit")
    },
]