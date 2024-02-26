import self from "@/main";
import {re} from "mathjs";

let COS = require('cos-js-sdk-v5');

export default {
  tenantCrop: localStorage.getItem("tenantCrop"),

  clothesImage: "clothes",
  orderImage: "order",
  commImage: "comm",
  yarnClothesImage: "yarnClothesImage",
  depositImage: "depositImage",
  brandImage:'brandImage',
  expendImage:'expendImage',

  getRegion() {
    return 'ap-shanghai'
  },

  getBucketName(name) {
    switch (name) {
      case 'clothes':
        return 'clothes-image-1304365928';
      case 'styleVideo':
        return 'style-video-1304365928';
      case 'brandImage':
        return 'brand-image-1304365928';
      case 'makeupImage':
        return 'makeup-image-1304365928';
      case 'expendImage':
        return 'expend-image-1304365928';
    }
  },


  clothesImageUpload: function (file) {
    const data = new FormData();
    data.append('file', file)
    data.append("tenant", this.tenantCrop)
    data.append("imageType", this.clothesImage)
    return self.$axios({
      method: "post",
      url: '/upload/uploadImage', //用于文件上传的服务器端请求地址
      data: data,
    })
  },
  orderImageUpload: function (file) {
    const data = new FormData();
    data.append('file', file)
    data.append("tenant", this.tenantCrop)
    data.append("imageType", this.orderImage)
    return self.$axios({
      method: "post",
      url: '/upload/uploadImage', //用于文件上传的服务器端请求地址
      data: data,
    })
  },
  refundImageUpload(file) {
    const data = new FormData();
    data.append("file", file)
    data.append("imageType", this.depositImage)
    data.append("tenant", this.tenantCrop)
    return self.$axios({
      method: "post",
      url: "/upload/uploadImage",
      data: data
    })
  },
  expendImageUpload: function (file) {
    const data = new FormData();
    data.append("file", file)
    data.append("tenant", this.tenantCrop)
    data.append("imageType", this.expendImage)
    return self.$axios({
      method: "post",
      url: "/upload/uploadImage",
      data: data,
    })
  },
  //上传单个文件
  uploadSingeFile(type, file, fileName) {
    return new Promise((resolve, reject) => {
      this.getTemporaryKey(type).putObject({
        Bucket: this.getBucketName(type), /* 必须 */
        Region: this.getRegion(),     /* 存储桶所在地域，必须字段 */
        Key: fileName,              /* 必须 */
        StorageClass: 'STANDARD',
        Body: file, // 上传文件对象
      }, function (err, data) {
        if (err !== null) {
          resolve(false)
        } else {
          resolve(true)
        }
      });

    })

  },

  //获取tencentCloud上传秘钥
  getTemporaryKey(bucket) {
    return new COS({
      // getAuthorization 必选参数
      getAuthorization: function (options, callback) {
        //本地测试时删除/api
        let url = `/api/upload/getTemporaryKey/${bucket}`; // url替换成您自己的后端服务
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function (e) {
          let credentials;
          let data = JSON.parse(e.target.responseText).data;
          credentials = data.credentials;
          if (!data || !credentials) {
            return console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
          }
          callback({
            TmpSecretId: credentials.tmpSecretId,
            TmpSecretKey: credentials.tmpSecretKey,
            SecurityToken: credentials.sessionToken,
            // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
            StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
            ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
          });
        };
        xhr.send();
      }
    });
  },

}
