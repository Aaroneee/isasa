<template>
  <div>
    <baseNavBar title="婚纱详情"/>

    <H5 class="van-field van-col--offset-1">婚纱0101-0101-F-12</H5>

    <div>
      <van-swipe height="300" :autoplay="3000">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <div class="img-box">
            <van-image fit="scale-down" round radius="7" width="50%" height="90%" :src="image"
                       @click="clickItem(image)"/>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>


    <H5 class="van-field van-col--offset-1">操作记录</H5>
    <van-empty description="描述文字" />

    <H5 class="van-field van-col--offset-1">婚纱操作</H5>
    <van-empty description="描述文字" />


  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'
import {ImagePreview} from "vant";

export default {
  name: "clothesDetails",
  created() {
    this.clothes = this.$route.query
    this.queryStyleImageByClothesId(this.clothes.id)
  },
  data() {
    return {
      clothes: {},
      images: [],
    }
  }
  , components: {
    baseNavBar
  }
  , methods: {
    clickItem: function (value) {
      ImagePreview([value])
    }
    ,queryStyleImageByClothesId(clothesId){
      console.log(clothesId)
      this.$axios({
        method:"GET",
        url:"/styleImage/queryStyleImageByClothesId",
        params:{
          clothesId:clothesId,
        }
      }).then(response=>{
        const data = response.data.data;
        for (let index in data){
          data[index] = "https://www.ivorybai.com:443/clothes/"+data[index]
        }
        this.images = data
      })
    }
  }
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
</style>
