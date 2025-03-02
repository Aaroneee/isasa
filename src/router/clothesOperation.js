import clothesOperationApplicationAdd from "@/pages/clothesOperation/clothesOperationApplicationAdd" //客资列表
import clothesOperationExamine from "@/pages/clothesOperation/clothesOperationExamine.vue" //调货审核
import clothesOperationConfirm from "@/pages/clothesOperation/clothesOperationConfirm.vue" //调货执行
import clothesOperationList from "@/pages/clothesOperation/clothesOperationList.vue" //调货列表

export default [
    {
        path: '/clothesOperationApplicationAdd',
        name: 'clothesOperationApplicationAdd',
        component: clothesOperationApplicationAdd,
    },
    {
        path: '/clothesOperationExamine',
        name: 'clothesOperationExamine',
        component: clothesOperationExamine,
    },
    {
        path: '/clothesOperationConfirm',
        name: 'clothesOperationConfirm',
        component: clothesOperationConfirm,
    },
    {
        path: '/clothesOperationList',
        name: 'clothesOperationList',
        component: clothesOperationList,
    },
];
