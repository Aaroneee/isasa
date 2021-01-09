import self from "@/main";

export default {
    //查询渠道
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
     //查询意愿
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
    //查询状态
    queryStateIds(type){
        return self.axios({
            method: "GET",
            url: "/select/stateIds",
            params: {
                type:type,
            }
        })
    },
    //查询状态
    queryServiceIds(type,tenantCrop){
        return self.axios({
            method: "GET",
            url: "/select/serviceIds",
            params: {
                tenantCrop:tenantCrop,
                type:type,
            }
        })
    }
 }