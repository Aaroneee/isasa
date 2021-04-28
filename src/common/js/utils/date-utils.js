export default {

    //Vant 单选时间转化为 年月日
    vantDateToYMD(date) {
        let year = date.getFullYear();
        let month = this.dateIsSingle(date.getMonth() + 1);
        let day = this.dateIsSingle(date.getDate());
        return year + "-" + month + "-" + day;
    },

    //Vant 跨月时间转化为 年月日 - 年月日
    rangeVantDateToYMD(date) {
        let startDate = date[0];
        let endDate = date[1];
        let startYear = startDate.getFullYear();
        let startMonth = this.dateIsSingle(startDate.getMonth() + 1);
        let startDay = this.dateIsSingle(startDate.getDate());

        let endYear = endDate.getFullYear();
        let endMonth = this.dateIsSingle(endDate.getMonth() + 1);
        let endDay = this.dateIsSingle(endDate.getDate());
        return startYear + "-" + startMonth + "-" + startDay + " - " + endYear + "-" + endMonth + "-" + endDay;
    },
    //获取周几
    getweekday: function (date) {
        var weekArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
        var week = weekArray[new Date(date).getDay()];//注意此处必须是先new一个Date
        return week;
    },
    dateSectionStrToDateArray: function (dateSectionStr) {
        const start = dateSectionStr.substring(0, dateSectionStr.length / 2).trim()
        const end = dateSectionStr.substring(dateSectionStr.length / 2 + 1).trim()
        const  dateArray = new Array(2)
        dateArray[0] = new Date(start.replace(/-/g, "/"))
        dateArray[1] =  new Date(end.replace(/-/g, "/"))
        return dateArray
    },

    //日历选择器 获取最大时间和最小时间
    getMaxMinDate:function (){
        const maxDate=new Date();
        maxDate.setFullYear(maxDate.getFullYear()+3);
        const minDate=new Date();
        minDate.setFullYear(minDate.getFullYear()-3);
        return [maxDate,minDate];
    },


    //如果时间是 一位数则补充0
    //1 返回 01
    dateIsSingle(date) {
        return date < 9 ? "0" + date : date;
    }
}
