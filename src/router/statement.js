import shopEarningReports from "@/pages/statement/shop/shop-earning-reports"//店铺业绩报表
import shopDailyReports from "@/pages/statement/shop/shop-daily-reports"//店铺每日业绩
import customerSource from "@/pages/statement/service-reports/customer-source"
import depositReports from "@/pages/statement/shop/deposit-reports";
//渠道分析表
export default[
    {
        path: '/shopEarningReports',
        name: 'shopEarningReports',
        component: shopEarningReports,
    },
    {
        path: '/shopDailyReports',
        name: 'shopDailyReports',
        component: shopDailyReports,
    },
    {
        path: '/customerSource',
        name: 'customerSource',
        component: customerSource,
    },
    {
        path: '/depositReports',
        name: 'depositReports',
        component: depositReports,
    }
]