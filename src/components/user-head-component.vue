

<template>
  <div style="height: 3vh;">
    <van-row style="margin: 8px 8px;padding:8px 8px;background-color: #89bea8;border-radius: 5px;">
      <van-col :span="8">
      </van-col>
      <van-col :span="8">
        <div style="height: 25px;display: flex;justify-content: center;align-items: center">
          <span @click="copyLink" style="font-size: 25px;transform: scale(1.05, 1);color: #ffffff;">ISASA</span>
        </div>

      </van-col>
      <van-col :span="8">
        <div style="height: 25px;display: flex;justify-content: flex-end;align-items: center">
          <img  @click="onClickItem('user')" :src="user" style="height: 100%;border-radius: 10%;"/>
        </div>
      </van-col>
    </van-row>
  </div>
</template>
<script>
import {ImagePreview} from "vant";

export default {
  name: "statistic",
  data(){
    return{
      user: require("@/assets/user.svg"),
      modules: {},
    }
  },

  created() {
  },
  methods: {
    onClickItem: function (event, id) {
      this.$store.commit('setKeepAlive', [event])
      this.$router.push({name: event, query: {id: id}})
    },
    //复制手机号
    copyLink: function () {
      //获取复制链接
      let val = this.copyLinkVal === 0 ? "http://www.isasaerp.com" :
          this.copyLinkVal === 1
              ? "http://www.isasaerp.com/android/isasa.apk" : "https://apps.apple.com/cn/app/isasa/id1558243921"

      //获取复制成功提示
      let textVal = this.copyLinkVal === 0 ? "电脑端链接复制成功"
          : this.copyLinkVal === 1
              ? "安卓下载端链接已复制" : "苹果下载端链接已复制"

      //更改索引
      this.copyLinkVal = this.copyLinkVal === 0 || this.copyLinkVal === 1
          ? this.copyLinkVal + 1 : 0;

      let _this = this;
      _this.$copyText(val).then(function (e) {
        _this.$toast.success({message: textVal, duration: 700});
      }, err => {
        _this.$toast.fail({message: textVal, duration: 700});
      })
    },
    //点击Logo
    openImg() {
      ImagePreview([this.logo])
    },
  },

}
</script>
<style>

</style>