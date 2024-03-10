import directAddSpend from "@/pages/spend/direct-add-spend.vue"//直接加支出页面
import spendList from "@/pages/spend/spend-list"//支出列表
import spendAnalysis from "@/pages/spend/spend-analysis"//支出分析报表

export default [
    {
        path: '/directAddSpend',
        name: 'directAddSpend',
        component: directAddSpend,
    },
    {
        path: '/spendList',
        name: 'spendList',
        component: spendList,
    },
    {
        path: '/spendAnalysis',
        name: 'spendAnalysis',
        component: spendAnalysis,
    },
]
