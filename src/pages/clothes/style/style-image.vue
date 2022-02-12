<template>
  <div>
    <van-sticky><baseNavBar title="款式图片"/></van-sticky>
    <van-collapse v-model="activeNames" style="padding:4% 4% 4% 4%">
      <van-collapse-item v-for="item in styleImageArray" :key="item.id"
                         :title="item.typeName"
                         :name="item.typeName">
        <div v-for="chil in item.image" :key="chil.id" style="width: 90%;height: 90%;margin: 0 auto">
          <van-image radius="7"
                     :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+chil.styleImage"
                     @click="imageShowClick('https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+chil.styleImage)"/>
        </div>
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
        this.styleImageArray=this.arrGroupBy(response.data.data);
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
    arrGroupBy(array){
      if (array===undefined||array===null||array===[]||array.length===0) return [];
      //获取去重后的图片类型
      let typeName=[];
      array.map(k=>{return k.imageTypeName}).forEach(k=>{
        if (!typeName.includes(k)){
          typeName.push(k)
        }
      })

      let newArr=[];
      typeName.forEach(k=>{
        let arrItem={typeName:k,image:[]}
        array.forEach(v=>{
          if(k===v.imageTypeName){
            arrItem.image.push(v)
          }
        })
        newArr.push(arrItem)
      })
      return newArr;
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
