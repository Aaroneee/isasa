<template>
  <div>
    <baseNavBar title="试纱图片" :fixed="true"/>
    <van-cell-group :title="title">
      <van-empty v-if="imageList.length == 0" description="暂无试纱图片"/>
      <div v-else>
        <van-collapse v-model="activeNames" style="padding:4% 4% 4% 4%">
          <van-collapse-item v-for="item in imageList" :key="item.id"
                             :name="item.id">
            <van-cell-group style="text-align: center">
              <van-image radius="7"
                         :src="'\thttps://yarn-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.yarnImage"
                         @click="clickItem('\thttps://yarn-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.yarnImage)"/>
              <van-icon style="margin-left: 90%" color="#ee0a24" size="20" @click="deleteImage(item)" name="delete-o"/>
            </van-cell-group>
          </van-collapse-item>
        </van-collapse>
      </div>
    </van-cell-group>
    <van-form @submit="addYarnClothesImage">
      <van-field name="uploader" label="订单图片">
        <template #input>
          <van-uploader v-model="fileList" multiple :max-count="1"/>
        </template>
      </van-field>
      <van-row style="margin-top: 20px">
        <van-col span="22" offset="1">
          <van-button
              color="linear-gradient(to right, #50E64D, #03B300)"
              class="bottom-button"
              round block
              type="primary"
              native-type="submit">提交
          </van-button>
        </van-col>
      </van-row>
    </van-form>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"
import {ImagePreview} from "vant";
export default {
  name: "yarn_clothes_images",
  components: {
    baseNavBar,
  },
  created() {
    this.title = this.appointVo.name + "的试纱图片"
    this.queryImageList()
  },
  data() {
    return {
      title: "",
      appointVo: this.$route.query.appointVo,
      yarnClothes: this.$route.query.item,
      imageList: [],
      fileList: [],
      activeNames: ['1'],
      fileName: "",
    }
  },
  methods: {
    queryImageList() {
      this.$axios({
        method: 'get',
        url: '/clothesYarn/queryYarnClothesImages',
        params: {
          clothesId: this.yarnClothes.clothesId,
          appId: this.appointVo.id,
        }
      }).then(response => {
        this.imageList = []
        this.imageList.push(...response.data.data)
        console.log(this.imageList)
      })
    },
    addYarnClothesImage(data) {
      if (this.fileList.length === 0) {
        this.$toast.fail("当前未选择图片,选择后进行提交")
        return
      }
      this.$dialog.confirm({
        title: '添加试纱图片',
        message: '确认添加图片吗？'
      }).then(() => {
        this.uploadImage().then(value => {
          if (!value) {
            this.$toast.fail("图片上传发生错误,请检查后进行上传")
          } else {
            data.yarnImage = this.fileName
            data.appId = this.appointVo.id
            data.clothesId = this.yarnClothes.clothesId
            data.uploader = []
            this.$axios({
              method: 'post',
              url: "/image/savaYarnClothesImage",
              params: data,
            }).then(response => {
              if (response.data.code === 200) {
                this.$toast.success("试纱图片添加成功!")
                this.queryImageList()
                this.fileList = []
                this.fileName = ""
              } else {
                this.$toast.fail(response.data.msg)
              }
            })
          }
        })
      })
    },
    uploadImage: function () {
      return new Promise((resolve, reject) => {
        if (this.fileList.length !== 0) {
          this.fileList[0].status = "uploading"
          this.fileList[0].message = "上传中..."
          this.$upload.yarnClothesImageUpload(this.fileList[0].file)
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
    },
    clickItem: function (value) {
      ImagePreview([value])
    },
    deleteImage(val) {
      this.$dialog.confirm({
        title: '移除订单图片',
        message: '是否确认移除该订单图片?',
      }).then(() => {
        this.$axios({
          method: 'post',
          url: "/image/deleteYarnClothesImage",
          params: {
            id: val.id
          }
        }).then(resposne => {
          if (resposne.data.code === 200) {
            this.$toast.success("移除试纱图片成功")
            this.queryImageList()
          } else {
            this.$toast.fail(resposne.data.msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>