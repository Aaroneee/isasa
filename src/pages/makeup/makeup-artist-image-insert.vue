<template>
  <div>
    <van-sticky>
      <baseNavBar title="修改形象"/>
    </van-sticky>
    <div class="card">
      <br>
      <van-row style="text-align: center">
        <van-field name="uploader" label="形象图片">
          <template #input>
            <van-uploader v-model="file" :max-count="1"/>
          </template>
        </van-field>
      </van-row>
      <van-form @submit="onSubmit">
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>

import baseNavBar from "@/components/nav-bar/base-nav-bar.vue";

export default {
  name: "makeupArtistImageInsert",
  data() {
    return {
      makeupArtistImage: {
        makeupArtistId: this.$route.query.id,
        imageType: '形象图',
        imageUrl: "",
      },
      file: [],
      fileName: "",
    }
  },
  created() {
  },
  components: {
    baseNavBar
  },
  methods: {
    onSubmit: function () {
      this.$dialog.confirm({
        title: '修改形象',
        message: '是否修改形象?',
      }).then(() => {
        if (this.file.length > 0) {
          let arr = this.file[0].file.name.split(".");
          let name = this.$md5(arr[0] + new Date()) + '.' + arr[arr.length - 1];
          this.$upload.uploadSingeFile('makeupImage', this.file[0].file, name).then(value => {
            if (!value) {
              this.$toast.fail("图片上传失败,请重试");
            }else {
              this.makeupArtistImage.imageUrl = name;
              this.addMakeupArtistImage().then((response) => {
                if (response === 'success') {
                  setTimeout(this.back, 1000);
                }
              })
            }
          })
        }
      })
    },
    back() {
      this.$router.back()
    },
    async addMakeupArtistImage() {
    return this.$axios({
        method: "POST",
        url: "/makeup/addMakeupArtistImage",
        data: this.makeupArtistImage
      }).then(response => {
        if (response.data.code === 200) {
          this.$toast.success('添加成功')
          return 'success'
        } else {
          this.$toast.fail(response.data.msg)
          return 'fail'
        }  
      })
    },
  },
}
</script>


<style scoped>
.card {
  margin: 2%;
  background-color: white;
  height: 90vh;
  border-radius: 10px;
}

.style-img {
  height: 270px;
  display: block;
  margin: 0 auto;
  border-radius: 10px;
}
</style>