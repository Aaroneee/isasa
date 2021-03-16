<template>
  <div>
    <baseNavBar  title="款式添加"/>
    <van-form scroll-to-error @submit="addStyleSubmit">
      <van-field
          name="styleType"
          :value="styleTypeText"
          label="款式类型"
          placeholder="点击选择款式类型"
          readonly
          @click="styleShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-popup v-model="styleShowPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="styleColumnsArray"
            @confirm="styleOnConfirm"
            @cancel="styleShowPicker = false"
        />
      </van-popup>

      <van-field
          name="styleName"
          :value="styleNameText"
          readonly
          label="款式名称"
          placeholder="查询款式名称"
          :rules="[{ required: true }]">
      </van-field>


      <van-field
          readonly
          clickable
          name="purchaseDate"
          :value="purchaseDate"
          label="采购日期"
          placeholder="点击选择采购日期"
          @click="createDateShowPicker = true"
          :rules="[{ required: true }]"
      />
      <van-calendar v-model="createDateShowPicker" :min-date="new Date('2020/01/01')" :max-date="new Date('2022/01/01')" @confirm="createDateOnConfirm"/>
      <van-field
          class="msg"
          name="styleInfo"
          v-model="styleInfo"
          type="textarea"
          label="款式介绍"
          placeholder="款式介绍"
          maxlength="40"
          show-word-limit
      />
      <van-field
          class="msg"
          name="styleFit"
          v-model="styleFit"
          type="textarea"
          label="适合身形"
          placeholder="请输入适合身形"
          maxlength="40"
          show-word-limit
      />
      <van-field
          class="msg"
          name="styleNoFit"
          v-model="styleNoFit"
          type="textarea"
          label="不适合身形"
          placeholder="请输入不适合身形"
          maxlength="40"
          show-word-limit
      />
      <van-field
          name="factoryName"
          v-model="factoryName"
          rows="1"
          label="工厂来源"
          placeholder="请输入工厂来源"
      />

      <van-field name="uploader" label="婚纱图片">
        <template #input>
          <van-uploader v-model="fileList" :after-read="afterRead" multiple :max-count="1"/>
        </template>
      </van-field>
      <!-- 裁剪页 -->
      <transition name="slim-fade">
        <div v-show="cropShow" class="crop-wrap">
          <SlimCropper ref="cropper" :src="inputImgUrl" :aspect-ratio="0.7"></SlimCropper>
          <div class="btn-box">
            <button type="button" class="crop-btn" @click="hideCrop">取消</button>
            <button type="button" class="crop-btn" @click="submitCrop">使用</button>
          </div>
        </div>
      </transition>

      <br>
      <van-button
          color="linear-gradient(to right, #50E64D, #03B300)"
          class="bottom-button"
          round block type="primary"
          native-type="submit">提交
      </van-button>
    </van-form>


    <van-overlay :show="overlayShow"/>
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

// 将 blob 对象转化为 url
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
  name: "styleAdd",
  inject:['reload'],
  data() {
    return {
      //款式id
      styleType: "",
      //款式文字显示
      styleTypeText: "",
      //款式可选数组
      styleColumnsArray: [],
      //款式下拉是否展示
      styleShowPicker: false,
      //款式名称id
      //款式名称文字显示
      styleName: "",
      styleNameText: "",
      tenantCrop: localStorage.getItem("tenantCrop"),
      //创建日期
      purchaseDate: "",
      //日期选择框展示
      createDateShowPicker: false,
      //款式介绍
      styleInfo:"",
      //适合身形
      styleFit: "",
      //不适合身形
      styleNoFit: "",
      //工厂信息
      factoryName: "",
      fileName: "",
      fileList: [],

      cropShow: false, // 裁剪弹窗显示
      inputImgUrl: '', // input 选中的图片 url
      getObjectURL,
      loading: false,
      overlayShow: false,
    }
  },
  created() {
    this.queryStyleIds()
  },
  components: {
    baseNavBar
  },
  methods: {
    queryStyleIds: function () {
      this.$selectUtils.queryStyleIds(this.$selectUtils.Picker).then(response => {
        this.styleColumnsArray = JSON.parse(response.data.data)
      })
    }
    , styleOnConfirm: function (value) {
      this.styleType = value.id
      this.styleTypeText = value.text
      this.styleShowPicker = false
      this.queryStyleName(value.id).then((response) => {
        var name = response.data.data + "";
        var styleNameLen = name.length
        switch (styleNameLen) {
          case 1:
            name = "000" + name;
            break;
          case 2:
            name = "00" + name;
            break;
          case 3:
            name = "0" + name;
            break;
        }
        this.styleNameText = name
      })
    }
    , queryStyleName: function (value) {
      return this.$axios({
        method: "GET",
        url: "/style/queryStyleName",
        params: {
          styleType: value,
          tenantCrop: this.tenantCrop
        }
      })
    }
    , addStyleSubmit(data) {
      data.styleType = this.styleType
      this.$dialog.confirm({
        title: '添加款式',
        message: '确定要添加该款式吗？',
      }).then(() => {
        if (this.fileList.length !== 0) {
          this.$toast.loading({
            message: '上传图片中...',
            forbidClick: true,
            duration: 3000
          })
        }
        this.uploadClothesImage().then(value => {
          if (!value) {
            this.$toast.fail("图片上传发生错误,请检查后进行上传")
            this.overlayShow = false
          } else {
            data.tenantCrop = this.tenantCrop
            data.styleImage = this.fileName
            data.uploader = []
            this.$axios({
              method: "POST",
              url: "/style/saveStyle",
              params: data
            }).then((response) => {
              if (response.data.code === 200) {
                this.overlayShow = false
                this.$dialog.confirm({
                  title: '添加成功',
                  message: '是否跳转款式列表查看?',
                }).then(() => {
                  this.$router.replace({name: "styleList"})
                })
                .catch(()=>{
                  console.log("取消按钮 刷新当前页面")
                  this.reload()
                })
              } else {
                this.$toast.fail(response.data.msg);
              }
            })
          }
        })
      })
    }
    , createDateOnConfirm: function (time) {
      this.purchaseDate = this.$dateUtils.vantDateToYMD(time);
      this.createDateShowPicker = false;

    },
    beforeClose: function (action, done) {
      if (action === 'confirm') {
        setTimeout(done, 1000);
      } else {
        done();
      }
    }
    , afterRead(file) {
      console.log(file)
      this.fileName = file.file.name
      this.inputImgUrl = getObjectURL(file.file)
      this.showCrop()
      // this.fileList[0].status = "uploading"
      // this.fileList[0].message = "上传中..."
      // this.$upload.clothesImageUpload(file)
      // .then(response=>{
      //   let data = response.data
      //   if (data.code === 200){
      //     this.fileList[0].status = ""
      //   }
      // })
    }
    , uploadClothesImage: function () {
      return new Promise((resolve, reject) => {
        if (this.fileList.length !== 0) {
          this.fileList[0].status = "uploading"
          this.fileList[0].message = "上传中..."
          this.$upload.clothesImageUpload(this.fileList[0].file)
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
      console.log(this.fileList)
    },
    // 隐藏裁剪页
    hideCrop: function () {
      this.cropShow = false
    },
    // 裁剪页确认
    async submitCrop() {
      this.hideCrop()
      const img = await this.$refs.cropper.getCroppedBlob('image/jpeg',0.7)
      console.log(img)
      this.fileList[0].file = blobToFile(img, this.fileName)
      console.log(this.fileList)
    },
  },

}
</script>

<style scoped>
.msg {
  height: 100px;
  word-break:break-all
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
  width: 90%;
  bottom: 5%;
  left: 5%;
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

.slim-fade-enter, .slim-fade-leave-to {
  opacity: 0;
  transform-origin: top;
  transform: translateY(100%);
}

</style>
