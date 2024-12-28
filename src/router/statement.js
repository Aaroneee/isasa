import shopEarningReports from "@/pages/statement/shop/shop-earning-reports"//店铺业绩报表
import shopDailyReports from "@/pages/statement/shop/shop-daily-reports"//店铺每日业绩
import customerSource from "@/pages/statement/service-reports/customer-source"
import depositReports from "@/pages/statement/deposit/deposit-reports";
import proceedsReports from "@/pages/statement/proceed/proceeds-reports";
import clothesOrderAnalysis from "@/pages/statement/clothes-order-analysis/clothes-order-analysis";
import clothesScheduleAnalysis from "@/pages/statement/clothes-schedule-analysis/clothes-schedule-analysis";
import performanceAnalysisReports from "@/pages/statement/shop/performance-analysis-reports"//执行分析计划表

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
    },
    {
        path: '/proceedsReports',
        name: 'proceedsReports',
        component: proceedsReports
    },
    {
        path: '/clothesOrderAnalysis',
        name: 'clothesOrderAnalysis',
        component: clothesOrderAnalysis
    },
    {
        path: '/clothesScheduleAnalysis',
        name: 'clothesScheduleAnalysis',
        component: clothesScheduleAnalysis
    },
    {
        path: '/performanceAnalysisReports',
        name: 'performanceAnalysisReports',
        component: performanceAnalysisReports,
    },
]
