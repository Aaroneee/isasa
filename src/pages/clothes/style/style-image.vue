<template>
  <div>
    <baseNavBar title="款式图片"/>
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
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'
import {ImagePreview} from "vant";

export default {
  name: "styleImage",
  created() {
    this.style = this.$route.query
    this.queryStyleImage(this.style.id)
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
    ,queryStyleImage(styleId){
      console.log(styleId)
      this.$axios({
        method:"GET",
        url:"/styleImage/queryStylePhotos",
        params:{
          styleId:styleId,
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
