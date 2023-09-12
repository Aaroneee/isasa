<template>
  <div>
    <van-sticky>
      <baseNavBar title="款式详情"/>
    </van-sticky>
    <!--    头部-->
    <div class="card">
      <van-tabs type="card">
        <van-tab title="标签 1">图片</van-tab>
        <van-tab title="标签 2">视频</van-tab>
      </van-tabs>
<!--      <van-row>-->
<!--        <van-swipe :loop="false" ref="swiper" @change="imageChange">-->
<!--          <van-swipe-item v-for="(image, index) in images" :key="index" style="text-align: center">-->
<!--            <img :src="`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${image.styleImage}?imageSlim`"-->
<!--                 style="height: 300px;max-width: 85vw" @click="imageShowClick(index)" alt=""/>-->
<!--          </van-swipe-item>-->
<!--        </van-swipe>-->
<!--        <div v-for="(item, index) in styleVideoList" :key="images.length+index" style="display: inline-block;margin-right: 2%">-->
<!--          <vue-plyr :options="plyrOptions" :ref="`plyr${index}`" style="height: 300px">-->
<!--            <video-->
<!--                controls-->
<!--                crossorigin-->
<!--                playsinline-->
<!--            >-->
<!--              <source-->
<!--                  :src="`https://style-video-1304365928.cos.ap-shanghai.myqcloud.com/${item.storeStyleVideo}`"-->
<!--                  type="video/mp4"-->
<!--              />-->
<!--            </video>-->
<!--          </vue-plyr>-->
<!--        </div>-->
<!--        <van-radio-group v-model="imagePosition" direction="horizontal" >-->
<!--          <van-radio v-for="(typeName , index) in imageTypes" :name="typeName" :key="index"-->
<!--                     icon-size="15px" checked-color="#409EFF" @click="imageTypeSelect">{{ typeName }}</van-radio>-->
<!--        </van-radio-group>-->
<!--      </van-row>-->
    </div>
    <!--    信息-->
    <div class="card">
      <van-row><p class="cardTitle">款式信息</p></van-row>
      <van-row>
        <van-col :span="12">
          <p>款式类型 : {{ style.storeTypeName }}</p>
        </van-col>

      </van-row>
      <van-row>
        <van-col :span="12">
          <p>款式售价 : {{ style.salePrice }}元</p>
        </van-col>
        <van-col :span="12">
          <p>建议零售价 : {{ style.suggestSalePrice }}元</p>
        </van-col>
      </van-row>
      <van-row>
        <van-col :span="12">
          <p>款式名称 : {{ style.styleName }}</p>
        </van-col>
        <van-col :span="12">
          <p>款式编号 : {{ style.styleNum }}</p>
        </van-col>
      </van-row>
      <van-row>
        <van-col :span="12">
          <p>系列名称 : {{ style.storeSeriesName }}</p>
        </van-col>
        <van-col :span="12">
          <p>系列编号 : {{ style.storeSeriesNum }}</p>
        </van-col>
      </van-row>
    </div>
    <!--    标签-->
    <div class="card">
      <van-row><p class="cardTitle">款式标签</p></van-row>
      <van-row v-if="labelNames.length>0" type="flex" justify="center">
        <van-col v-for="(item,index) in labelNames" :key="index" style="margin: 1% 1%">
          <van-tag size="large" v-once :color="labelColor[Math.floor(Math.random() * labelColor.length)]">{{ item }}</van-tag>
        </van-col>
      </van-row>
      <van-row v-else>
        <p style="text-align: center;">无</p>
      </van-row>
    </div>
    <!--    款式信息-->
    <div class="card">
      <van-row><p class="cardTitle">款式信息</p></van-row>
      <van-row>
        <van-col :span="24">
          <p>款式信息 : {{ style.styleInfo }}</p>
          <br/>
          <p>适合情况 : {{ style.styleFit }}</p>
          <br/>
          <p>不适合情况 : {{ style.styleNoFit }}</p>
        </van-col>
      </van-row>
    </div>
    <br><br><br><br><br><br>
    <p/>
    <van-goods-action>
      <van-goods-action-icon  />
      <van-goods-action-icon icon="cart-o" text="购物车" :badge="shopCartNum" @click="toShopCartList"/>
      <van-goods-action-icon  />
      <van-goods-action-button type="warning" text="加入购物车" @click="clickShopCartButton"/>
      <!--      <van-goods-action-button-->
      <!--          type="danger"-->
      <!--          text="立即购买"-->
      <!--          @click="clickBuyButton"-->
      <!--      />-->
    </van-goods-action>
    <van-icon v-show="imageShow" name="ellipsis" class="more" :style="{'z-index':9999}" @click="showShare = true"/>
    <van-image-preview v-model="imageShow" @change="imagePreviewChange" :images="previewImages" :startPosition="openImagesIndex" @close="()=>{
      this.imageShow=false;
      this.showShare=false;
    }"/>
    <van-share-sheet
        v-model="showShare"
        :options="options"
        @select="onSelect"
    />
  </div>

</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"
import {ImagePreview} from "vant";

export default {
  name: "styleDetails",
  components: {
    baseNavBar,
  },
  created() {
    this.style = this.$route.query
    this.queryStyleDetails()
    this.queryStoreStyleImage()
    // this.queryStyleVideo()
    this.queryShoppingCart()
  },
  data() {
    return {
      style: {},
      plyrOptions: {
        // Plyr 播放器的配置选项 fullscreen
        controls: ['play-large','play', 'mute','progress'], // 控制按钮
      },
      labelNames:[],
      labelColor: ["#A52A2A", "#FF8C00", "#696969", "#FFA500", "#2F4F4F", "#6495ED", "#FF4500", "#40E0D0"],

      images:[],
      shopCartNum:0,
      styleVideoList:[],
      tenantCrop: localStorage.getItem("tenantCrop"),

      showShare: false,
      imageShow:false,
      options: [
        { name: '保存图片', icon: 'https://icon-image-1304365928.cos.ap-shanghai.myqcloud.com/save.png' },
      ],
      openImagesIndex:"",

      previewImages:[],
      imageTypes:[],
      imagePosition:"",
    }
  },
  watch: {
    'style.labelNames':function (val){
      this.labelNames=val!==""?val.split(","):[];
    },
  },
  mounted() {
    // // 监听 Plyr 播放器的 fullscreenchange 事件
    // this.styleVideoList.forEach((item,index)=>{
    //   console.log(this.$refs[`plyr${index}`])
    //   this.$refs[`plyr${index}`].player.on('custom-control', this.handleCustomControl);
    // })
  },
  methods: {
    onSelect(option, index) {
      if (index === 0) {
        console.log(this.openImagesIndex)
        let imageUrl = this.previewImages[this.openImagesIndex];

        /Linux/i.test(navigator.platform)
            ? androidMethod.downImage(imageUrl)
            : window.webkit.messageHandlers.save.postMessage(imageUrl);
        this.showShare = false
      }
    },
    imageShowClick(index) {
      this.openImagesIndex = index
      this.imageShow = true
    },
    imagePreviewChange(index) {
      this.openImagesIndex = index
    },
    handleCustomControl(event) {
      event.preventDefault();
      // // 自定义控件按钮被点击时的操作
      console.log('Custom control clicked:', event);
    },
    queryStyleDetails(){
      this.$axios({
        method: "GET",
        url: "/storeStyle/queryById",
        params: {
          id: this.style.id,
        }
      }).then(response => {
        this.style=response.data.data
      })
    },
    queryStoreStyleImage() {
      this.$axios({
        method: "GET",
        url: "/storeStyleImage/queryByStoreStyleId",
        params: {
          storeStyleId: this.style.id,
        }
      }).then(response => {
        console.log(response.data.data);
        response.data.data.forEach(k=>{
          this.previewImages.push(`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${k.styleImage}`)
          this.imageTypes.push(k.storeImageTypeName);
        })
        this.imageTypes=Array.from(new Set(this.imageTypes));
        this.images=response.data.data;
        this.imagePosition=this.imageTypes[0];
      })
    },
    //查询款式视频
    queryStyleVideo() {
      this.$axios({
        method: "GET",
        url: "/storeStyleVideo/queryList",
        params: {
          styleId: this.style.id
        }
      }).then(response => {
        this.styleVideoList = response.data.data
        this.$nextTick(()=>{
          this.styleVideoList.forEach((item,index)=>{
            this.$refs[`plyr${index}`][0].player.on('fullscreenchange', this.handleCustomControl, { passive: false });
          })
        })
      })
    },
    //图片滑动时改变radio的值
    imageChange:function (val){
      this.imagePosition=this.images[val].storeImageTypeName;
    },
    //radio 点击后 图片跳转
    imageTypeSelect(val){
      console.log(this.imagePosition)
      for(let i = 0;i < this.images.length; i++){
        if (this.images[i].storeImageTypeName===this.imagePosition){
          // //因为要把选择的图片展示正中间 所以要-1在0位展示上一张 这么1位就展示的是选中类型的图
          // this.$refs.swiper.swipeTo(i-1);
          this.$refs.swiper.swipeTo(i);
          return;
        }
      }
    },
    clickService:function (){

    },
    //点击购买按钮
    clickBuyButton:function (){
      this.$router.push({name: "styleStoreAddOrder", query: [this.style]})
    },
    //点击添加到购物车按钮
    clickShopCartButton:function (){
      this.$axios({
        method: "PUT",
        url: "/storeStyle/addShoppingCart",
        data: {
          id: this.style.id,
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        if (response.data.code!==200){
          this.$toast.fail('添加失败,请返回重试!');
          return false;
        }
        this.$toast.success('添加成功');
        //todo
        this.queryShoppingCart();
      })
    },
    //查询购物车列表
    queryShoppingCart(){
      this.$axios({
        method: "GET",
        url: "/storeStyle/queryShoppingCart",
        params: {
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        if (response.data.code!==200) return false;
        let res=response.data.data;
        this.shopCartNum=res.length===0?0:res.length;
      })
    },
    toShopCartList(){
      this.$router.push({name: "styleStoreShopCart"})
    },
  },
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 7px;
  margin:  4% 3%;
  padding: 3% 3%;
  height: 100%;
  overflow: hidden;
}
.cardTitle{
  text-align: center;font-weight: bold
}
.card .imgParent {
  padding-left: 2%;
  height: 100%;
  width: 80px;
  display: inline-block;
  /*align-items: center;*/
}

p {
  font-size: 15px;
  margin: 2% 0;
}
.more {
  position: absolute;
  top: 13px;
  right: 6px;
  color: #f5f7fa;
  font-size: 27px;
}
</style>
