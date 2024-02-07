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
      let self = this
      self.$dialog.confirm({
        title: '修改形象',
        message: '是否修改形象?',
        beforeClose: function (action, done) {
          if (self.file.length > 0) {
            let arr = self.file[0].file.name.split(".");
            let name = self.$md5(arr[0] + new Date()) + '.' + arr[arr.length - 1];
            self.$upload.uploadSingeFile('makeupImage', self.file[0].file, name).then(value => {
              if (!value) {
                self.$toast.fail("图片上传失败,请重试");
                return;
              }
              self.makeupArtistImage.imageUrl = name;
              self.addMakeupArtistImage(done);
            })
          } else {
            self.addMakeupArtistImage(done);
          }
        },
      })
    },
    addMakeupArtistImage(done) {
      this.$axios({
        method: "POST",
        url: "/makeup/addMakeupArtistImage",
        data: this.makeupArtistImage
      }).then(response => {
        response.data.code === 200 ? this.$toast.success('添加成功') : this.$toast.fail(response.data.msg);
        done();
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