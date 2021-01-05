
export default {

    //Vant 单选时间转化为 年月日
    vantDateToYMD(date){
        let year=date.getFullYear();
        let month=this.dateIsSingle(date.getMonth()+1);
        let day=this.dateIsSingle(date.getDate());
        return year+"-"+month+"-"+day;
    },

    //Vant 跨月时间转化为 年月日 - 年月日
    rangeVantDateToYMD(startDate,endDate){
        let startYear=startDate.getFullYear();
        let startMonth=this.dateIsSingle(startDate.getMonth()+1);
        let startDay=this.dateIsSingle(startDate.getDate());

        let endYear=endDate.getFullYear();
        let endMonth=this.dateIsSingle(endDate.getMonth()+1);
        let endDay=this.dateIsSingle(endDate.getDate());
        return startYear+"-"+startMonth+"-"+startDay+" - "+endYear+"-"+endMonth+"-"+endDay;
    },

    //如果时间是 一位数则补充0
    //1 返回 01
    dateIsSingle(date){
        return date<9?"0"+date:date;
    }
}
