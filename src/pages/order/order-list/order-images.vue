<template>
  <div>
    <baseNavBar title="订单图片"/>
    <van-cell-group :title="imageTitle">
      <van-collapse v-model="activeNames" style="padding:4% 4% 4% 4%">
        <van-collapse-item v-for="item in orderImageArray" :key="item.id"
                           :title="item.orderName+'  '+item.createDate"
                           :name="item.id">
          <van-cell-group style="text-align: center">
            <van-image radius="7"
                       :src="'\thttps://order-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.imageUrl"/>
            <van-icon style="margin-left: 90%" size="20" @click="deleteOrderImage(item)" name="delete-o"/>
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
    </van-cell-group>
    <van-cell-group :title="addTitle">
    </van-cell-group>

    <van-form @submit="addOrderImage">
      <van-field name="uploader" label="订单图片">
        <template #input>
          <van-uploader v-model="fileList" :after-read="afterRead" multiple :max-count="1"/>
        </template>
      </van-field>
      <!-- 裁剪页 -->
      <transition name="slim-fade">
        <div v-show="cropShow" class="crop-wrap">
          <SlimCropper ref="cropper" :src="inputImgUrl" :aspect-ratio="0.8"></SlimCropper>
          <div class="btn-box">
            <button type="button" class="crop-btn" @click="hideCrop">取消</button>
            <button type="button" class="crop-btn" @click="submitCrop">使用</button>
          </div>
        </div>
      </transition>
      <br>
      <br>
      <van-row>
        <van-button
            color="linear-gradient(to right, #50E64D, #03B300)"
            class="bottom-button"
            round block
            type="primary"
            native-type="submit">提交
        </van-button>
      </van-row>
    </van-form>
  </div>

</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"


const getObjectURL = (file) => {
  let url
  if (window.createObjectURL) { // basic
    url = window.createObjectURL(file)
  } else if (window.URL) { // mozilla(firefox)
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}


function blobToFile(theBlob, fileName) {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  return new window.File([theBlob], fileName, {type: 'image/jpeg'})
}

export default {
  name: "orderImages",
  inject: ['reload']
  , components: {
    baseNavBar
  }
  , created() {
    this.order = this.$route.query
    this.imageTitle = this.order.name + "的订单图片"
    this.addTitle = "添加订单图片"
    console.log(this.order)
    this.queryOrderImages()
  }
  , data() {
    return {

      imageTitle: "",
      addTitle: "",
      tenantCrop: localStorage.getItem("tenantCrop"),

      //订单图片
      fileName: "",
      fileList: [],

      cropShow: false, // 裁剪弹窗显示
      inputImgUrl: '', // input 选中的图片 url
      getObjectURL,


      order: {},
      activeNames: ['1'],
      orderImageArray: [],
    }
  }, methods: {
    queryOrderImages: function () {
      this.$axios({
        method: 'GET',
        params: {
          cusId: this.order.cusId,
          tenantCrop: this.order.tenantCrop,
        },
        url: '/image/orderImagesByCus',
      }).then(response => {
        this.orderImageArray = response.data.data
      })
    },
    deleteOrderImage: function (value) {
      console.log(value)
      this.$dialog.confirm({
        title: '移除订单图片',
        message: '是否确认移除该订单图片?',
      }).then(() => {
        this.$axios({
          method: 'delete',
          params: {
            orderImage: value.imageUrl,
            cusId: this.order.cusId,
            tenantCrop: this.tenantCrop,
          },
          url: '/image/deleteOrderImage',
        }).then(response => {
          var code = response.data.code;
          if (code === 200) {
            this.$toast.success("移除订单图片成功")
            this.reload()
          } else {
            this.$toast.fail(response.data.msg)
          }
        })
      })
    }
    , addOrderImage: function (data) {
      this.$dialog.confirm({
        title: '添加订单图片',
        message: '是否确认给 : ' + this.order.name + ' 添加订单图片?',
      }).then(() => {
        if (this.fileList.length !== 0) {
          this.$toast.loading({
            message: '上传图片中...',
            forbidClick: true,
            duration: 3000
          })
        } else {
          this.$toast.fail("当前未选择图片,选择后进行提交")
          return
        }
        this.uploadOrderImage().then(value => {
          if (!value) {
            this.$toast.fail("图片上传发生错误,请检查后进行上传")
          } else {
            data.orderImage = this.fileName
            data.cusId = this.order.cusId
            data.registrant = localStorage.getItem("empId")
            data.orderProject = this.order.orderNameId
            data.tenantCrop = this.tenantCrop
            data.uploader = []
            this.$axios({
              method: "POST",
              url: "/image/saveOrderImages",
              params: data
            }).then(response => {
              console.log(response)
              if (response.data.code !== 200) {
                this.$toast.fail(response.data.msg)
                return
              }
              this.$toast.success("订单图片添加成功!")
              const that = this;
              setTimeout(function () {
                that.reload()
              }, 1000)
            })
          }
        })
      })
    }
    , afterRead(file) {
      this.fileName = file.file.name
      this.inputImgUrl = getObjectURL(file.file)
      this.showCrop()
    }
    , uploadOrderImage: function () {
      return new Promise((resolve, reject) => {
        if (this.fileList.length !== 0) {
          this.fileList[0].status = "uploading"
          this.fileList[0].message = "上传中..."
          this.$upload.orderImageUpload(this.fileList[0].file)
              .then(response => {
                let data = response.data
                if (data.code === 200) {
                  this.fileList[0].status = ""
                  this.fileName = data.data
                  resolve(true)
                } else {
                  reject(false)
                }
              })
        } else {
          resolve(true)
        }
      })
    }
    ,// 显示裁剪页
    showCrop() {
      this.cropShow = true
    }
    ,
// 隐藏裁剪页
    hideCrop: function () {
      this.cropShow = false
    }
    ,
// 裁剪页确认
    async submitCrop() {
      this.hideCrop()
      const img = await this.$refs.cropper.getCroppedBlob()
      this.fileList[0].file = blobToFile(img, this.fileName)
    }
  }
}
</script>

<style scoped>
.msg {
  height: 100px;
}

* {
  /*padding: 0;*/
  margin: 0;
  border: none;
  outline: none;
  box-sizing: border-box;
  /*background: transparent;*/
}

.bottom-button {
  /*position: absolute;*/
  width: 90%;
  left: 5%;
  bottom: 20px;
}

.crop-wrap {
  z-index: 1;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #000;
}

.btn-box {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
}

.crop-btn {
  width: 60px;
  height: 100%;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  background: transparent;

}

.slim-fade-enter-active, .slim-fade-leave-active {
  transition: all 0.4s ease;
}

.bottom-button {
  width: 90%;
  bottom: 10%;
}

.slim-fade-enter, .slim-fade-leave-to {
  opacity: 0;
  transform-origin: top;
  transform: translateY(100%);
}
</style>
