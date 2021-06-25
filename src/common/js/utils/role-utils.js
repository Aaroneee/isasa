import self from "@/main";

export default {
    //查询该用户是否有客服角色
    isService: function () {
        return self.$axios({
            method: "GET",
            url: "/emp/isService",
            params: {
                empId: localStorage.getItem("empId"),
                tenantCrop: localStorage.getItem("tenantCrop"),
            }
        })
    },
    //根据EmpId 查询权限
    queryRoleByEmpId: function () {
        return self.$axios({
            method: "GET",
            url: "/role/queryRoleByEmpId",
            params: {
                empId: localStorage.getItem("empId"),
            }
        })
    }
}
