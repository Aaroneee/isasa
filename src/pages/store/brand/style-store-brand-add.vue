<template>
  <div>
    <van-sticky>
      <baseNavBar title="品牌系列添加"/>
    </van-sticky>
    <div class="card">
      <br>

      <van-row style="text-align: center" v-if="form.onlyBrand">
        <van-uploader v-model="file" :max-count="1"/>
      </van-row>
      <van-form @submit="onSubmit">
        <van-field name="checkbox" label="添加系列">
          <template #input>
            <van-checkbox v-model="form.onlyBrand" shape="square" @change="checkBoxChange"/>
          </template>
        </van-field>
        <van-field
            v-model="form.brandName"
            name="品牌"
            label="品牌"
            placeholder="品牌"
            :rules="[{ required: true, message: '请填写品牌' }]"
        />
        <van-field
            v-if="form.onlyBrand"
            v-model="form.seriesName"
            name="系列名称"
            label="系列名称"
            placeholder="系列名称"
            :rules="[{ required: true, message: '请填写系列名称' }]"
        />
        <van-field
            v-if="form.onlyBrand"
            v-model="form.seriesNum"
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
  name: "style-store-brand-edit",
  data() {
    return {
      form: {
        onlyBrand: true,
        brandName: '',
        seriesName: '',
        seriesNum: '',
        seriesImg: '',
        tenantCrop: localStorage.getItem("tenantCrop"),
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
        title: this.form.onlyBrand ? '添加品牌系列' : '添加品牌',
        message: this.form.onlyBrand ? '是否确定添加品牌和系列名称编号?' : '是否确定添加该品牌',
        beforeClose:this.addSeries,
      })
    },
    addSeries(action, done) {
      if (this.file.length > 0 && this.form.onlyBrand) {
        let arr = this.file[0].file.name.split(".");
        let name = this.$md5(arr[0] + new Date()) + '.' + arr[arr.length - 1];
        this.$upload.uploadSingeFile(this.$upload.clothesImage, this.file[0].file, name).then(value => {
          if (!value) {
            this.$toast.fail("图片上传失败,请重试");
            return;
          }
          this.form.seriesImg = name;
          this.$axios({
            method: "PUT",
            url: "/storeBrand/addBrandSeries",
            data: this.form
          }).then(response => {
            response.data.code === 200 ? this.$toast.success('添加成功') : this.$toast.fail(response.data.msg);
            done();
          })
        })
      }else {
        this.$axios({
          method: "PUT",
          url: "/storeBrand/addBrandSeries",
          data: this.form
        }).then(response => {
          response.data.code === 200 ? this.$toast.success('添加成功') : this.$toast.fail(response.data.msg);
          done();
        })
      }

    },
    checkBoxChange(val) {
      if (!val) {
        this.form.seriesName = "";
        this.form.seriesNum = "";
        this.form.seriesImg = "";
        this.file = [];
        this.fileName = "";
      }
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
</style>