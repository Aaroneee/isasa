<template>
  <div>
    <van-sticky>
      <baseNavBar title="系列添加"/>
    </van-sticky>
    <div class="card">
      <br>
      <van-row style="text-align: center">
        <van-uploader v-model="file" :max-count="1"/>
      </van-row>
      <van-form @submit="onSubmit">
        <van-field
            v-model="storeBrand.brandName"
            name="品牌"
            label="品牌"
            placeholder="品牌"
            readonly
            :rules="[{ required: true, message: '请填写品牌' }]"
        />
        <van-field
            v-model="seriesInfo.seriesName"
            name="系列名称"
            label="系列名称"
            placeholder="系列名称"
            :rules="[{ required: true, message: '请填写系列名称' }]"
        />
        <van-field
            v-model="seriesInfo.seriesNum"
            name="系列编号"
            label="系列编号"
            placeholder="系列编号"
            :rules="[{ required: true, message: '请填写系列编号' }]"
        />
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
  name: "style-store-series-add",
  data() {
    return {
      storeBrand:this.$route.query.storeBrand,
      seriesInfo:{
        storeBrandId:this.$route.query.storeBrand.id,
        createDate:new Date(),
        seriesName:"",
        seriesNum:"",
        seriesImg:"",
        tenantCrop:localStorage.getItem("tenantCrop"),
      },
      file:[],
      fileName:"",
    }
  },
  created() {
  },
  components: {
    baseNavBar
  },
  methods: {
    onSubmit: function () {
      let self=this
      self.$dialog.confirm({
        title: '添加系列',
        message: '是否确定在:'+this.storeBrand.brandName+' 品牌下添加该系列?',
        beforeClose:function (action, done){
          if (self.file.length>0){
            let arr = self.file[0].file.name.split(".");
            let name=self.$md5(arr[0] + new Date())+'.'+ arr[arr.length - 1];
            self.$upload.uploadSingeFile(self.$upload.clothesImage,self.file[0].file,name).then(value=>{
              if (!value){
                self.$toast.fail("图片上传失败,请重试");
                return;
              }
              self.seriesInfo.seriesImg=name;
              self.addSeries(done);
            })
          }else{
            self.addSeries(done);
          }
        },
      })
    },
    addSeries(done){
      this.$axios({
        method: "PUT",
        url: "/storeSeries/addSeries",
        data: this.seriesInfo
      }).then(response => {
        response.data.code===200?this.$toast.success('添加成功'):this.$toast.fail(response.data.msg);
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