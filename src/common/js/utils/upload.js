import self from "@/main";


export default {
    tenantCrop: localStorage.getItem("tenantCrop"),

    clothesImage: "clothes",
    orderImage: "order",
    commImage:"comm",
    yarnClothesImage: "yarnClothesImage",
    depositImage: "depositImage",


    clothesImageUpload: function (file) {
        const data = new FormData();
        data.append('file',file)
        data.append("tenant",this.tenantCrop)
        data.append("imageType",this.clothesImage)
        return self.$axios({
            method: "post",
            url: '/upload/uploadImage', //用于文件上传的服务器端请求地址
            data: data,
        })
    },
    orderImageUpload: function (file) {
        const data = new FormData();
        data.append('file',file)
        data.append("tenant",this.tenantCrop)
        data.append("imageType",this.orderImage)
        return self.$axios({
            method: "post",
            url: '/upload/uploadImage', //用于文件上传的服务器端请求地址
            data: data,
        })
    },
    yarnClothesImageUpload(file) {
        const data = new FormData();
        data.append("file", file)
        data.append("imageType", this.yarnClothesImage)
        return self.$axios({
            method: "post",
            url: "/upload/uploadImage",
            data: data
        })
    },
    refundImageUpload(file) {
        const data = new FormData();
        data.append("file", file)
        data.append("imageType", this.depositImage)
        data.append("tenant",this.tenantCrop)
        return self.$axios({
            method: "post",
            url: "/upload/uploadImage",
            data: data
        })
    }

}
