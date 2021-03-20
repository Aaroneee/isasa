import self from "@/main";

export default {
    ifService: function () {
        return self.$axios({
            method: "GET",
            url: "/emp/isService",
            params: {
                empId: localStorage.getItem("empId"),
                tenantCrop: localStorage.getItem("tenantCrop"),
            }
        })
    }
}
