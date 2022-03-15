<template>
  <div>
    <van-sticky>
      <van-nav-bar title="款式图片" left-arrow left-text="返回" @click-left="onClickLeft" @click-right="addImage">
        <template #right>
          <van-icon name="add" class="right-icon"/>
        </template>
      </van-nav-bar>
    </van-sticky>
    <van-collapse v-model="activeNames" style="padding:4% 4% 4% 4%">
      <van-collapse-item v-for="item in styleImageArray" :key="item.id"
                         :title="item.typeName"
                         :name="item.typeName">
        <div v-for="(chil, index) in item.image" :key="chil.id">
          <van-image
              lazy-load
              style="width: 100%;height: 100%"
              :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+chil.styleImage"
              @click="imageShowClick(item, index)">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <template v-slot:error>加载失败</template>
          </van-image>
        </div>
      </van-collapse-item>
    </van-collapse>
    <van-icon v-if="imageShow" name="ellipsis" class="more" :style="{'z-index':zIndex}" @click="imageClick"/>
    <div  class="test" @press="onPress" >
      <van-image-preview v-model="imageShow" @change="imageChange" :images="images" :startPosition="startPosition" @close="imageClose">
      </van-image-preview>
    </div>
    <van-share-sheet
        @click-overlay="sheetClose"
        @cancel="sheetClose"
        v-model="showShare"
        :options="options"
        @select="onSelect"
    />
    <van-popup v-model="addImagePopup"
               close-icon="close"
               position="bottom"
               round
               @close="addImagePopupClose"
               :style="{height: '350px'}">
      <van-form style="margin-top: 15px" @submit="submit" ref="imageForm">
        <van-field
            name="imageType"
            required
            :rules="[{ required: true,message: '请选择图片类型' }]"
            v-model="imageTypeText"
            placeholder="图片类型"
            readonly
            @click="imageTypeShowPicker = true"
            label="图片类型"/>
        <van-popup v-model="imageTypeShowPicker" position="bottom">
          <van-picker
              getColumnValues
              show-toolbar
              title="图片类型"
              :columns="imageTypeColumnsArray"
              @confirm="imageTypeOnConfirm"
              @cancel="imageTypeShowPicker = false"
          />
        </van-popup>
        <van-field name="uploader" required label="婚纱图片" :rules="[{ required: true,message: '请选择图片'}]">
          <template #input>
            <van-uploader v-model="fileList"
                          multiple :max-count="maxCount">
            </van-uploader>
          </template>
        </van-field>
        <van-row style="position: absolute;bottom: 10px;width: 100%">
          <van-col span="22" offset="1">
            <van-button color="linear-gradient(to right, #50E64D, #03B300)"
                        round
                        block
                        :disabled="loading"
                        :loading="loading"
                        loading-text="图片上传中"
                        native-type="submit">
              确认添加
            </van-button>
          </van-col>
        </van-row>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
import AnyTouch from 'any-touch';
import login from "../../login/login";
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

export default {
  name: "styleImage",
  created() {
    this.styleId = this.$route.query
    this.queryStyleImage()
    this.queryImageType()
  },
  mounted() {
    // 没错, 就这2行
    const at = new AnyTouch(this.$el, {
      preventDefault() {
        return false
      },
    });

    this.$on('hook:destroyed', () => {
      at.destroy();
    });
  },
  data() {
    return {
      styleId:"",
      showShare: false,
      activeNames: ['1'],
      styleImageArray: [],
      imageShow: false,
      images: [],
      options: [
        { name: '保存图片', icon: 'https://icon-image-1304365928.cos.ap-shanghai.myqcloud.com/save.png' },
        { name: '设为主图',icon: 'https://icon-image-1304365928.cos.ap-shanghai.myqcloud.com/star.png' },
        // { name: '更改图片类型', icon: 'https://icon-image-1304365928.cos.ap-shanghai.myqcloud.com/edit.png' },
        { name: '删除', icon: 'https://icon-image-1304365928.cos.ap-shanghai.myqcloud.com/delete.png'},
      ],
      imageUrl: "",
      startPosition: 0,
      zIndex: 9999,
      addImagePopup: false,
      imageType: "",
      imageTypeText: "",
      fileList: [],
      deleteFileList: [],
      imageIndex: null,
      imageObject: [],
      imageTypeShowPicker: false,
      imageTypeColumnsArray: [],
      styleImages: [],
      maxCount: 4,
      loading: false,
      imageCount: 0,
      delImageId: null,
      primaryImageUrl: "",
    }
  },
  methods: {
    queryStyleImage() {
      this.$axios({
        method: "GET",
        url: "/image/queryStyleImages",
        params: {
          styleId: this.styleId,
        }
      }).then(response => {
        this.styleImageArray=this.arrGroupBy(response.data.data);
      })
    },
    queryImageType() {
      this.$selectUtils.queryStyleImageTypeIds(this.$selectUtils.Picker,0).then((response) => {
        this.imageTypeColumnsArray = JSON.parse(response.data.data);
      })
    },
    imageShowClick(val, index) {
      this.imageObject = val.image
      this.images = []
      val.image.forEach(s => {
        this.images.push("https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/" + s.styleImage)
      })
      this.delImageId = val.image[index].id
      this.primaryImageUrl = val.image[index].styleImage
      this.startPosition = index
      this.imageIndex = index
      this.imageShow = true
    },
    // touchStart(e) {
    //   this.zIndex = document.querySelector('.van-image-preview').style.zIndex
    //   clearTimeout(this.loop)
    //   this.loop = setTimeout(() => {
    //     this.showShare = true
    //   }, 1000)
    // },
    // touchEnd() {
    //   clearTimeout(this.loop)
    // },
    onSelect(option, index) {
      if (index == 0) {
        this.imageUrl = this.images[this.imageIndex];
        /Linux/i.test(navigator.platform)
            ? androidMethod.downImage(this.imageUrl)
            : window.webkit.messageHandlers.save.postMessage(this.imageUrl);
        this.showShare = false
      }
      if (index == 1) {
        this.$axios({
          method: "PUT",
          url: "/style/editStyle",
          params: {
            id: this.styleId,
            styleImage: this.primaryImageUrl,
            tenantCrop: localStorage.getItem("tenantCrop")
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("设置主图成功!")
            this.showShare = false
            this.imageShow = false
          } else {
            this.$toast.fail(response.data.msg)
          }
        });
      }
      if (index == 2) {
        this.$axios({
          method: "post",
          url: "/styleImage/deleteStyleImage",
          params: {
            id: this.delImageId
          }
        }).then(response => {
          let flag = response.data.code === 200
          if (flag) {
            this.showShare = false
            this.$toast.success("删除成功")
            this.queryStyleImage()
            this.imageShow = false
          } else {
            this.$toast.fail(response.data.msg)
          }
        })
      }

    },
    arrGroupBy(array){
      if (array===undefined||array===null||array===[]||array.length===0) return [];
      //获取去重后的图片类型
      let typeName=[];
      array.map(k=>{return k.imageTypeName}).forEach(k=>{
        if (!typeName.includes(k)){
          typeName.push(k)
        }
      })

      let newArr=[];
      typeName.forEach(k=>{
        let arrItem={typeName:k,image:[]}
        array.forEach(v=>{
          if(k===v.imageTypeName){
            arrItem.image.push(v)
          }
        })
        newArr.push(arrItem)
      })
      return newArr;
    },
    onClickLeft: function () {
      this.$router.back();
    },
    imageClick() {
      this.zIndex = document.querySelector('.van-image-preview').style.zIndex
      this.showShare = true
    },
    imageChange(index) {
      this.imageIndex = index
    },
    imageClose() {
      this.zIndex = 9999
    },
    sheetClose() {
      this.zIndex = 9999
    },
    onPress() {
      this.zIndex = document.querySelector('.van-image-preview').style.zIndex
      this.showShare = true
    },
    addImage() {
      this.addImagePopup = true
    },
    submit() {
      this.maxCount = this.fileList.length
      this.imageCount = this.fileList.length
      this.loading = true
      for (let i = 0; i < this.fileList.length; i++) {
        this.$set(this.fileList, i, {
          content: this.fileList[i].content,
          file: this.fileList[i].file,
          message: "上传中...",
          status: 'uploading',
        })
        this.imageUpload(i)
      }
    },
    addImagePopupClose() {
      this.fileList = []
      this.$refs.imageForm.resetValidation()
      this.maxCount = 4
    },
    imageTypeOnConfirm(value, index) {
      this.imageType=value.id;
      this.imageTypeText=value.text;
      this.imageTypeShowPicker=false;
    },
    imageUpload(index) {
      this.$upload.clothesImageUpload(this.fileList[index].file).then(response => {
        let flag = response.data.code === 200
        if (!flag) {
          this.$set(this.fileList, index, {
            content: this.fileList[index].content,
            file: this.fileList[index].file,
            message: "上传失败",
            status: 'failed',
            flag: 0
          })
          this.judgeImageAllUpload()
          return
        }
        this.$axios({
          method: "put",
          url: "/styleImage/addStyleImage",
          params: {
            styleId: this.styleId,
            styleImage: response.data.data,
            imageType: this.imageType,
            tenantCrop: localStorage.getItem("tenantCrop")
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.$set(this.fileList, index, {
              content: this.fileList[index].content,
              file: this.fileList[index].file,
              deletable: false,
              flag: 1
            })
          } else {
            this.$toast.fail(response.data.msg);
            this.$set(this.fileList, index, {
              content: this.fileList[index].content,
              file: this.fileList[index].file,
              message: "上传失败",
              status: 'failed',
              flag: 0
            })
          }
          this.judgeImageAllUpload()
        })
      })
    },
    judgeImageAllUpload() {
      this.imageCount--
      if (this.imageCount == 0) {
        this.loading = false
        this.fileList = this.fileList.filter(s => {
          s.flag === 1
        })
        if (this.fileList.length == 0) {
          this.$toast.success("图片添加成功")
          this.queryStyleImage()
          setTimeout(()=>{
            this.addImagePopup = false
          }, 200)
        }
      }
    },
  },
}
</script>

<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}

.img-box {
  width: 100%;
  height: 100%;
  background: white;
  text-align: center
}
.right-icon {
  font-size: 22px;
  color: #ffa71e;
}
/deep/ .van-collapse-item__content {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
/* 一张图片 */
/deep/ .van-collapse-item__content>div:only-child {
  width: 90%;
}

/* 两张图片 */
/deep/ .van-collapse-item__content>div:first-child:nth-last-child(2),
.van-collapse-item__content>div:nth-child(2):nth-last-child(1) {
  width: 45%;
}
/deep/ .van-collapse-item__content>div:nth-child(2):nth-last-child(1) {
  margin-left: 1%;
}

/* 三张图片 */
/deep/ .van-collapse-item__content>div:first-child:nth-last-child(3),
.van-collapse-item__content>div:nth-child(2):nth-last-child(2),
.van-collapse-item__content>div:nth-child(3):nth-last-child(1)
{
  width: 30%;
}
/deep/ .van-collapse-item__content>div:nth-child(2):nth-last-child(2),
.van-collapse-item__content>div:nth-child(3):nth-last-child(1) {
  margin-left: 1%;
}

/* 四张图片 */
/deep/ .van-collapse-item__content>div:first-child:nth-last-child(4),
.van-collapse-item__content>div:first-child:nth-last-child(4) ~ div
{
  width: 45%;
}
/deep/ .van-collapse-item__content>div:nth-child(2):nth-last-child(3),
.van-collapse-item__content>div:nth-child(4):nth-last-child(1) {
  margin-left: 1%;
}
/deep/ .van-collapse-item__content>div:nth-child(2):nth-last-child(3)~div {
  margin-top: 1%;
}

/* 五张图片以上 */
/deep/ .van-collapse-item__content>div:first-child:nth-last-child(n+5),
.van-collapse-item__content>div:first-child:nth-last-child(n+5)~div {
  width: 30%;
}
/deep/ .van-collapse-item__content>div:nth-child(3n - 1),
.van-collapse-item__content>div:nth-child(3n) {
  margin-left: 1%;
}
/deep/ .van-collapse-item__content>div:nth-child(3):nth-last-child(2) {
  margin-left: 0px;
}
/deep/ .van-collapse-item__content>div:nth-child(3) ~ div {
  margin-top: 1%;
}


.more {
  position: absolute;
  top: 13px;
  right: 6px;
  color: #f5f7fa;
  font-size: 27px;
}
/deep/ .van-share-sheet__name {
  margin-top: 0px;
}
</style>
