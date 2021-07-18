
export default {
    //隐藏电话号码
    phoneIsHide: function (phone) {
        return phone.replace(new RegExp("(\\d{3})\\d{4}(\\d{4})"),"$1****$2")
    },
}
