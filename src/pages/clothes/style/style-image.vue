<template>
  <div>
    <baseNavBar title="款式图片"/>
    <van-collapse v-model="activeNames" style="padding:4% 4% 4% 4%">
      <van-collapse-item v-for="item in styleImageArray" :key="item.id"
                         :title="item.imageTypeName"
                         :name="item.id">
        <van-cell-group style="text-align: center">
          <van-image radius="7"
                     :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.styleImage"
                     @click="imageShowClick('https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.styleImage)"/>
        </van-cell-group>
      </van-collapse-item>
    </van-collapse>
    <div @touchstart.prevent="touchStart()" @touchend.prevent="touchEnd()">
      <van-image-preview v-model="imageShow" :images="images"
      ></van-image-preview>
    </div>
    <van-share-sheet
        v-model="showShare"
        :options="options"
        @select="onSelect"
    />
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "styleImage",
  created() {
    this.styleId = this.$route.query
    this.queryStyleImage()
  },
  data() {
    return {
      styleId:"",
      showShare: false,
      activeNames: ['1'],
      styleImageArray: [],
      imageShow: false,
      images: [],
      options: [
        {name: '保存图片', icon: 'poster'}
      ],
      imageUrl: "",
    }
  },
  components: {
    baseNavBar
  },
  methods: {
    queryStyleImage() {
      this.$axios({
        method: "GET",
        url: "/image/queryStyleImages",
        params: {
          styleId: this.styleId,
        }
      }).then(response => {
        this.styleImageArray = response.data.data
      })
    },
    imageShowClick(val) {
      this.imageShow = true
      this.images = [val]
      this.imageUrl = val
    },
    touchStart() {
      console.log(111)
      clearTimeout(this.loop)
      this.loop = setTimeout(() => {
        this.showShare = true
      }, 1000)
    },
    touchEnd() {
      clearTimeout(this.loop)
    },
    onSelect() {
      /Linux/i.test(navigator.platform)
          ? androidMethod.downImage(this.imageUrl)
          : window.webkit.messageHandlers.save.postMessage(this.imageUrl);

      this.showShare = false
    },
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
