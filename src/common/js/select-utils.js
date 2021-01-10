import self from "@/main";

export default {
    //渠道
     querySourceIds(type,tenantCrop){
         return self.axios({
             method: "GET",
             url: "/select/sourceIds",
             params: {
                 type:type,
                 tenantCrop: tenantCrop
             }
         })
     },
     //意愿
    queryGradeIds(type,tenantCrop){
        return self.axios({
            method: "GET",
            url: "/select/gradeIds",
            params: {
                type:type,
                tenantCrop: tenantCrop
            }
        })
    },
    //状态
    queryStateIds(type){
        return self.axios({
            method: "GET",
            url: "/select/stateIds",
            params: {
                type:type,
            }
        })
    },
    //客服
    queryServiceIds(type,tenantCrop){
        return self.axios({
            method: "GET",
            url: "/select/serviceIds",
            params: {
                tenantCrop:tenantCrop,
                type:type,
            }
        })
    },
    //预约人
    queryEmpIds(type,tenantCrop){
        return self.axios({
            method: "GET",
            url: "/select/empIds",
            params: {
                tenantCrop:tenantCrop,
                type:type,
            }
        })
    },
    //项目
    queryProjectsIds(projectType,type,tenantCrop){
        return self.axios({
            method: "GET",
            url: "/select/projectsIds",
            params: {
                tenantCrop:tenantCrop,
                type:type,
                projectsType:projectType,
            }
        })
    },
    //店铺
    queryShopIds(type,tenantCrop){
        return self.axios({
            method: "GET",
            url: "/select/shopIds",
            params: {
                tenantCrop:tenantCrop,
                type:type,
            }
        })
    },
    //根据店铺查询城市
    queryCityByShopId(shopId){
        return self.axios({
            method: "GET",
            url: "/shop/queryCityByShopId",
            params: {
                id:shopId,
            }
        })
    }
 }