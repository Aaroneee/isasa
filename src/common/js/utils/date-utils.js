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
    getTimeStr(type) {
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();

        if (type == 'y') return d.getFullYear();
        if (type == 'M') return d.getFullYear() + "-" + month;
        if (type == 'd') return d.getFullYear() + "-" + month + "-" + day;
        if (type == 'H') return d.getFullYear() + "-" + month + "-" + day + " " + hour;
        if (type == 'minute') return d.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute;
        if (type == 's') return d.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        return d.getFullYear() + "-" + month + "-" + day;
    },
    //时间区间样式转换 比如传进来 2021-03，转换成  2021-03-01 00:00:00 - 2021-03-31 23:59:59
    tran_second_of_the_month(theMonth) {
        let year1 = theMonth.substring(0, 4);
        let month1 = theMonth.substring(5, 7);

        //尾月的结束日期
        var monthEndDate = new Date(year1, month1, 0);

        var time1 = year1 + "-" + month1 + "-" + "01 00:00:00";//time1表示首月1号 0点整
        var time2 = year1 + "-" + month1 + "-" + monthEndDate.getDate() + " 23:59:59";//time2表示尾月最后一天最后一秒
        return time1 + ' - ' + time2;
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
        const dateArray = new Array(2)
        dateArray[0] = new Date(start.replace(/-/g, "/"))
        dateArray[1] = new Date(end.replace(/-/g, "/"))
        return dateArray
    },

    //日历选择器 获取最大时间和最小时间
    getMaxMinDate: function () {
        //更改时间格式 IOS:年/月/日
        let date = new Date();
        let maxDateStr = date.getFullYear() + 3 + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        let minDateStr = date.getFullYear() - 3 + "/" + (date.getMonth() + 1) + "/" + date.getDate();

        let maxDate = new Date(maxDateStr.replace(/-/g, '/'));
        let minDate = new Date(minDateStr.replace(/-/g, '/'));
        return [maxDate, minDate];
    },

    //获取当前时间转化为 年月
    vantDateToYM: function (date) {
        let year = date.getFullYear();
        let month = this.dateIsSingle(date.getMonth() + 1);
        return year + "-" + month;
    },

    //获取时间的前后三天区间
    getAroundDateToYMD: function (date) {
        const nowDate = new Date(date);
        const dateArray = this.vantDateToYMD(new Date(nowDate.getTime() - 24 * 60 * 60 * 1000)) +
            " - " + this.vantDateToYMD(new Date(nowDate.getTime() + 24 * 60 * 60 * 1000));
        return dateArray;
    },
    //获取时间前后 day 天的日期
    getAroundDate: function (date, day) {
        const dateArray = new Array(2);
        const nowDate = new Date(date);
        dateArray[0] = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000 * day);
        dateArray[1] = new Date(nowDate.getTime() + 24 * 60 * 60 * 1000 * day);
        return dateArray;
    },

    //如果时间是 一位数则补充0
    //1 返回 01
    dateIsSingle(date) {
        return date < 10 ? "0" + date : date;
    },
    getMonthStartEndDayStr() {
        let nowDate = new Date();
        let year = nowDate.getFullYear();
        let month = this.dateIsSingle(nowDate.getMonth() + 1);
        let lastDay = new Date(year, nowDate.getMonth() + 1, 0).getDate();
        return year + "-" + month + "-01 - " + year + "-" + month + "-" + lastDay;
    },
    getMonthStartEndDayByDate(val) {
        let year = val.getFullYear();
        let month = this.dateIsSingle(val.getMonth() + 1);
        let lastDay = new Date(year, val.getMonth() + 1, 0).getDate();
        return year + "-" + month + "-01 - " + year + "-" + month + "-" + lastDay;
    },
    convertDateFromString(dateString) {
        var date = new Date(dateString.replaceAll("-", "/"))
        return date;
    },
    // 获取当前月最后一天
    getCurrentMonthLastDay() {
        var date = new Date();
        var currentMonth = date.getMonth();
        var nextMonth = ++currentMonth;
        var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
        var oneDay = 1000 * 60 * 60 * 24;
        return new Date(nextMonthFirstDay - oneDay);
    },
    // 获取当前月第一天
    getCurrentMonthFirstDay() {
        var date = new Date();
        date.setDate(1);
        return date;
    }
}
