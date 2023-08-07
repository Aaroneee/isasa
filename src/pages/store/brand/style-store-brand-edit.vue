<template>
  <div>
    <van-sticky>
      <baseNavBar title="品牌系列编辑"/>
    </van-sticky>
    <div class="card" v-show="loading" style="display: flex;justify-content: center;align-items: center">
      <van-loading />
    </div>
    <div class="card" v-show="!loading">
      <br>

      <van-row style="text-align: center">
        <van-uploader v-if="seriesInfo.seriesImg===''" v-model="file" :max-count="1"/>
        <van-badge v-else>
          <img class="style-img"
               :src="'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+seriesInfo.seriesImg">
          <template #content>
            <van-icon @click="delImg" name="cross" class="badge-icon" />
          </template>
        </van-badge>

      </van-row>
      <van-form @submit="onSubmit">
        <van-field
            v-model="seriesInfo.brandName"
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
import md5 from 'js-md5';
import {re} from "mathjs";
export default {
  name: "style-store-brand-edit",
  data() {
    return {
      seriesId: this.$route.query.id,
      seriesInfo: "",
      file:[],
      fileName:"",

      loading: true,
    }
  },
  created() {
    let self=this;
    self.queryById();
  },
  components: {
    baseNavBar
  },
  methods: {
    queryById: function () {
      this.loading =true;
      this.$axios({
        method: "GET",
        url: "/storeSeries/queryById",
        params: {
          id: this.seriesId,
        }
      }).then(response => {
        this.seriesInfo = response.data.data;
        this.loading=false;
      })
    },
    onSubmit: function () {
      this.$dialog.confirm({
        title: '修改系列',
        message: '是否确定修改系列名称和编号?',
      })
          .then(() => {
            if (this.file.length>0){
              let arr = this.file[0].file.name.split(".");
              let name=this.$md5(arr[0] + new Date())+'.'+ arr[arr.length - 1];
              this.$upload.uploadSingeFile(this.$upload.clothesImage,this.file[0].file,name).then(value=>{
                if (!value){
                  this.$toast.fail("图片上传失败,请重试");
                  return;
                }
                this.seriesInfo.seriesImg=name;
                this.updateSeries();
              })
            }else
              this.updateSeries();
          })
          .catch(() => {
            this.$toast.fail('已取消');
          });

    },
    updateSeries(){
      this.$axios({
        method: "POST",
        url: "/storeSeries/updateSeries",
        data: this.seriesInfo
      }).then(response => {
        response.data.code===200?this.$toast.success('修改成功'):this.$toast.fail('修改失败');
        this.queryById();
      })
    },
    delImg(){
      this.$dialog.confirm({
        title: '删除系列图',
        message: '是否确定删除该图片?',
      })
          .then(() => {
            this.seriesInfo.seriesImg="";
            this.$axios({
              method: "POST",
              url: "/storeSeries/updateSeries",
              data: this.seriesInfo
            }).then(response => {
              response.data.code===200?this.$toast.success('删除成功'):this.$toast.fail('删除失败');
              this.queryById();
            })
          })
          .catch(() => {
            this.$toast.fail('已取消');
          });
    }
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