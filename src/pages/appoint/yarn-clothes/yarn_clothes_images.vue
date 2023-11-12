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
      <van-field name="uploader" label="试纱图片">
        <template #input>
          <van-uploader v-model="fileList" multiple :max-count="4"/>
        </template>
      </van-field>
      <van-row style="margin-top: 20px">
        <van-col span="22" offset="1">
          <van-button
              :loading="loading"
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
      loading: false,
      imageCount: 0,
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
        this.imageCount = this.fileList.length
        for (let i = 0; i < this.fileList.length; i++) {
          this.$set(this.fileList, i, {
            content: this.fileList[i].content,
            file: this.fileList[i].file,
            message: "上传中...",
            status: 'uploading',
          })
          this.imageUpload(i)
        }
      })
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
          method: "post",
          url: "/image/savaYarnClothesImage",
          params: {
            appId: this.appointVo.id,
            yarnImage: response.data.data,
            clothesId: this.yarnClothes.clothesId,
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
          this.queryImageList()
        }
      }
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