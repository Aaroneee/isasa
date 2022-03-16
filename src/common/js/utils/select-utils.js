import self from "@/main";

//1.Vant-picker  {text,id}
//2.Vant-DropdownMenu {text,value}

export default {
    tenantCrop: localStorage.getItem("tenantCrop"),

    Picker: 1,
    DropDownMenu: 2,
    //渠道
    querySourceIds: function (type) {
        return self.$axios({
            method: "GET",
            url: "/select/sourceIds",
            params: {
                type: type,
                tenantCrop: localStorage.getItem("tenantCrop"),
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
                tenantCrop: localStorage.getItem("tenantCrop"),
            }
        })
    },
    //状态
    queryStateIds: function (type,stateType) {
        return self.$axios({
            method: "GET",
            url: "/select/stateIds",
            params: {
                type: type,
                stateType:stateType,
            }
        })
    },
    //客服
    queryServiceIds: function (type) {
        return self.$axios({
            method: "GET",
            url: "/select/serviceIds",
            params: {
                tenantCrop: localStorage.getItem("tenantCrop"),
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
                tenantCrop: localStorage.getItem("tenantCrop"),
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
                tenantCrop: localStorage.getItem("tenantCrop"),
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
                tenantCrop: localStorage.getItem("tenantCrop"),
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
    //根据店铺查询位置
    queryPositionIdsByShop:function (shopId,type){
        return self.$axios({
            method: "GET",
            url: "/select/positionIdsByShopId",
            params: {
                shopId: shopId,
                type:type,
                tenantCrop:localStorage.getItem("tenantCrop")
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
                tenantCrop: localStorage.getItem("tenantCrop"),
            }
        })
    },
    //化妆师
    queryCosmeticsIds: function (type) {
        return self.$axios({
            method: "GET",
            url: "/select/cosmeticsIds",
            params: {
                type: type,
                tenantCrop: localStorage.getItem("tenantCrop"),
            }
        })
    },
    //根据店铺ID查询房间
    queryRoomIdsByShopId: function (shopId, type) {
        return self.$axios({
            method: "GET",
            url: "/select/roomIdsByShopId",
            params: {
                type: type,
                shopId: shopId,

                tenantCrop: localStorage.getItem("tenantCrop"),
            }
        })
    },
    //收款方式   //可以参考订单添加
    queryPaymentIds: function (type) {
        return self.$axios({
            method: "GET",
            url: "/select/paymentIds",
            params: {
                type: type,
                tenantCrop: localStorage.getItem("tenantCrop"),
            }
        })
    },
    //收款人
    queryPayeeIds: function (type) {
        return self.$axios({
            method: "GET",
            url: "/select/payeeIds",
            params: {
                type: type,
                tenantCrop: localStorage.getItem("tenantCrop"),
            }
        })
    },
    queryStyleIds: function (type) {
        return self.$axios({
            method: "GET",
            url: "/select/styleTypeIds",
            params: {
                type: type,
                tenantCrop: localStorage.getItem("tenantCrop")
            }
        })
    },
    queryStyleLabels:function (){
        return self.$axios({
            method: "GET",
            url: "/select/labelIds",
            params: {
                labelType: 2,
                tenantCrop: localStorage.getItem("tenantCrop")
            }
        })
    },
    queryOperationIds:function (type){
        return self.$axios({
            method: "GET",
            url: "/select/operationIds",
            params: {
                type: type,
                tenantCrop: localStorage.getItem("tenantCrop")
            }
        })
    },
    //查询品牌ID
    queryBrandIds: function (type) {
        return self.$axios({
            method: "GET",
            url: "/select/brandIds",
            params:{
                tenantCrop: localStorage.getItem("tenantCrop"),
                type:type
            }
        })
    },
    //查询品牌ID 会隐藏品牌名显示品牌等级
    queryMBrandIds:function (){
        return self.$axios({
            method:"GET",
            url: "/select/mBrandIds",
            params: {
                tenantCrop: localStorage.getItem("tenantCrop"),
            }
        })
    },
    queryPhoneIsHide: function (mobileViewId) {
        return self.$axios({
           method: "GET",
           url: "/specialFun/queryPhoneIsHide",
           params: {
               mobileViewId: mobileViewId,
               tenantCrop: localStorage.getItem("tenantCrop"),
           }
        });
    },
    //查询款式图片类型
    queryStyleImageTypeIds: function (type,state) {
        return self.$axios({
            method: "GET",
            url: "/select/styleImageTypeIds",
            params: {
                type: type,
                state:state,
                tenantCrop: localStorage.getItem("tenantCrop"),
            }
        });
    },
    //线上收款项目
    queryOnlineOrder: function (type) {
        return self.$axios({
           method: "get",
           url:"/select/onlineProcessProjectIds",
            params: {
                type: type,
                tenantCrop: localStorage.getItem("tenantCrop"),
            }
        });
    },
    //订单收款项目
    queryOrderProceedsProjects: function (type) {
      return self.$axios({
          method: "get",
          url:"/select/orderProceedsProjectId",
          params: {
              type: type,
              tenantCrop: localStorage.getItem("tenantCrop"),
          }
      })
    },
    //追加收款项目
    queryAddProceedsProjects: function (type) {
        return self.$axios({
            method: "get",
            url: "/select/addProceedsProjectsId",
            params: {
                type: type,
                tenantCrop: localStorage.getItem("tenantCrop"),
            }
        })
    },
    // 查询婚纱尺寸
    queryClothesSize: function (type) {
        return self.$axios({
            method: "get",
            url: "/select/clothesSizeIds",
            params: {
                type: type,
                tenantCrop: localStorage.getItem("tenantCrop"),
            }
        })
    },
    // 查询款式价格类型
    queryStylePriceType(type) {
        return self.$axios({
            method: "GET",
            url: "/select/stylePriceType",
            params: {
                type: type,
            }
        })
    },
    // 查询收押收款方式
    queryDepositPayment(type) {
        return self.$axios({
            method: "GET",
            url: "/select/queryDepositPayment",
            params: {
                type: type,
                tenantCrop: localStorage.getItem("tenantCrop"),
            }
        })
    },
    queryDressIdsByShop(type, shopId) {
        return self.$axios({
            method: "GET",
            url: "/select/queryDressIdsByShop",
            params: {
                type: type,
                shop: shopId,
                tenantCrop: localStorage.getItem("tenantCrop")
            }
        })
    }


}
