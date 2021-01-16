import self from "@/main";

//1.Vant-picker  {text,id}
//2.Vant-DropdownMenu {text,value}

export default {
    tenantCrop:localStorage.getItem("tenantCrop"),

    Picker: 1,
    DropDownMenu: 2,
    //渠道
    querySourceIds: function (type) {
        return self.$axios({
            method: "GET",
            url: "/select/sourceIds",
            params: {
                type: type,
                tenantCrop: this.tenantCrop,
            }
        })
    },
    //意愿
    queryGradeIds: function (type) {
        return self.$axios({
            method: "GET",
            url: "/select/gradeIds",
            params: {
                type: type,
                tenantCrop:  this.tenantCrop,
            }
        })
    },
    //状态
    queryStateIds: function (type) {
        return self.$axios({
            method: "GET",
            url: "/select/stateIds",
            params: {
                type: type,
            }
        })
    },
    //客服
    queryServiceIds: function (type) {
        return self.$axios({
            method: "GET",
            url: "/select/serviceIds",
            params: {
                tenantCrop:  this.tenantCrop,
                type: type,
            }
        })
    },
    //预约人
    queryEmpIds: function (type) {
        return self.$axios({
            method: "GET",
            url: "/select/empIds",
            params: {
                tenantCrop:  this.tenantCrop,
                type: type,
            }
        })
    },
    //项目
    queryProjectsIds: function (projectType, type) {
        return self.$axios({
            method: "GET",
            url: "/select/projectsIds",
            params: {
                tenantCrop:  this.tenantCrop,
                type: type,
                projectsType: projectType,
            }
        })
    },
    //店铺
    queryShopIds: function (type) {
        return self.$axios({
            method: "GET",
            url: "/select/shopIds",
            params: {
                tenantCrop:  this.tenantCrop,
                type: type,
            }
        })
    },
    //根据店铺查询城市
    queryCityByShopIds: function (shopId) {
        return self.$axios({
            method: "GET",
            url: "/shop/queryCityByShopId",
            params: {
                id: shopId,
            }
        })
    },
    //礼服师
    queryDressIds: function (type) {
        return self.$axios({
            method: "GET",
            url: "/select/dressIds",
            params: {
                type: type,
                tenantCrop:  this.tenantCrop,
            }
        })
    },
    //根据店铺ID查询房间
    queryRoomIdsByShopId:function (shopId,type){
        return self.$axios({
            method: "GET",
            url: "/select/roomIdsByShopId",
            params: {
                type: type,
                shopId:shopId,

                tenantCrop:  this.tenantCrop,
            }
        })
    },

}