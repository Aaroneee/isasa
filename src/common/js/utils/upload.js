import self from "@/main";


export default {
    tenantCrop: localStorage.getItem("tenantCrop"),

    clothesImage: "clothes",
    orderImage: "order",
    commImage:"comm",


    clothesImageUpload: function (file) {
        const data = new FormData();
        data.append('file', file.file)
        return self.$axios({
            method: "post",
            url: '/upload/uploadImage', //用于文件上传的服务器端请求地址
            data: data,
            params:{
                tenant:this.tenantCrop,
                imageType:this.clothesImage
            }
        })
    }
}
