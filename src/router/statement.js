import shopEarningReports from "@/pages/statement/shop/shop-earning-reports"//店铺业绩报表
import customerSource from "@/pages/statement/service-reports/customer-source"//渠道分析表
export default[
    {
        path: '/shopEarningReports',
        name: 'shopEarningReports',
        component: shopEarningReports,
    },
    {
        path: '/customerSource',
        name: 'customerSource',
        component: customerSource,
    }
]