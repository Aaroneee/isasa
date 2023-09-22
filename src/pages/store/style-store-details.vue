<template>
  <div>
    <van-sticky>
      <baseNavBar title="款式详情"/>
    </van-sticky>
    <!--    头部-->
    <div class="card">
      <van-tabs animated>
        <van-tab title="图片">
          <van-swipe :loop="false" ref="swiper" @change="imageChange" style="margin-top: 1%">
            <van-swipe-item v-for="(image, index) in images" :key="index" style="text-align: center">
              <img
                  v-lazy="`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${image.styleImage}?imageMogr2/rquality/20`"
                  style="height: 270px;max-width: 85vw" @click="imageShowClick(index)" alt=""/>
            </van-swipe-item>
          </van-swipe>
          <p style="text-align: center">{{ imgTypeName }}</p>
        </van-tab>
        <van-tab title="视频">
          <van-swipe :loop="false" style="margin-top: 1%">
            <van-swipe-item v-for="(item, index) in styleVideoList" :key="index" style="text-align: center">
              <vue-plyr :options="plyrOptions" :ref="`plyr${index}`" style="height: 300px">
                <video
                    controls
                    crossorigin
                    playsinline
                >
                  <source
                      :src="`https://style-video-1304365928.cos.ap-shanghai.myqcloud.com/${item.storeStyleVideo}`"
                      type="video/mp4"
                  />
                </video>
              </vue-plyr>
            </van-swipe-item>
          </van-swipe>
        </van-tab>
      </van-tabs>
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
          <van-tag size="large" v-once :color="labelColor[Math.floor(Math.random() * labelColor.length)]">
            {{item }}
          </van-tag>
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
      <van-goods-action-icon/>
      <van-goods-action-icon icon="cart-o" text="购物车" :badge="shopCartNum" @click="toShopCartList"/>
      <van-goods-action-icon/>
      <van-goods-action-button type="warning" text="加入购物车" @click="clothesSizeShow=true"/>
      <!--      <van-goods-action-button-->
      <!--          type="danger"-->
      <!--          text="立即购买"-->
      <!--          @click="clickBuyButton"-->
      <!--      />-->
    </van-goods-action>
    <van-icon v-show="imageShow" name="ellipsis" class="more" :style="{'z-index':9999}" @click="showShare = true"/>
    <van-image-preview v-model="imageShow" @change="imagePreviewChange" :images="previewImages"
                       :startPosition="openImagesIndex" @close="()=>{
      this.imageShow=false;
      this.showShare=false;
    }"/>
    <van-share-sheet
        v-model="showShare"
        :options="options"
        @select="onSelect"
    />
    <van-popup round position="bottom" v-model="clothesSizeShow" style="height: 40vh">
      <van-divider content-position="left">尺码</van-divider>
      <van-row>
        <van-col :span="6" class="sizeNotActive">
          <p :class="clothesSize==='S'?'sizeP sizeActiveP':'sizeP sizeNotActiveP'" @click='clothesSize="S"'>S</p>
        </van-col>
        <van-col :span="6" class="sizeNotActive">
          <p :class="clothesSize==='M'?'sizeP sizeActiveP':'sizeP sizeNotActiveP'" @click='clothesSize="M"'>M</p>
        </van-col>
        <van-col :span="6" class="sizeNotActive">
          <p :class="clothesSize==='L'?'sizeP sizeActiveP':'sizeP sizeNotActiveP'" @click='clothesSize="L"'>L</p>
        </van-col>
        <van-col :span="6" class="sizeNotActive">
          <p :class="clothesSize==='F'?'sizeP sizeActiveP':'sizeP sizeNotActiveP'" @click='clothesSize="F"'>F</p>
        </van-col>
      </van-row>
      <van-goods-action>
        <van-goods-action-button type="warning" text="加入购物车" @click="clickShopCartButton"/>
      </van-goods-action>
    </van-popup>
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
    this.queryStyleVideo()
    this.queryShoppingCart()
  },
  data() {
    return {
      style: {},
      plyrOptions: {
        // Plyr 播放器的配置选项 fullscreen
        controls: ['play-large', 'play', 'mute', 'progress'], // 控制按钮
      },
      labelNames: [],
      labelColor: ["#A52A2A", "#FF8C00", "#696969", "#FFA500", "#2F4F4F", "#6495ED", "#FF4500", "#40E0D0"],

      images: [],
      shopCartNum: 0,
      styleVideoList: [],
      tenantCrop: localStorage.getItem("tenantCrop"),

      showShare: false,
      imageShow: false,
      options: [
        {name: '保存原图', icon: 'https://icon-image-1304365928.cos.ap-shanghai.myqcloud.com/save.png'},
      ],
      openImagesIndex: "",

      previewImages: [],
      imgTypeName: "",

      clothesSize:"M",
      clothesSizeShow:false,
      clothesSizeArray:['S', 'M', 'L', 'F'],
    }
  },
  watch: {
    'style.labelNames': function (val) {
      this.labelNames = val !== "" ? val.split(",") : [];
    },
  },
  mounted() {

  },
  methods: {
    onSelect(option, index) {
      if (index === 0) {
        let imageUrl = this.previewImages[this.openImagesIndex].replace("?imageMogr2/rquality/20", "");
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
    queryStyleDetails() {
      this.$axios({
        method: "GET",
        url: "/storeStyle/queryById",
        params: {
          id: this.style.id,
        }
      }).then(response => {
        this.style = response.data.data
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
        if (response.data.data.length < 1) return;
        response.data.data.forEach(k => {
          this.previewImages.push(`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${k.styleImage}?imageMogr2/rquality/20`)
        })
        this.images = response.data.data;
        this.imgTypeName = response.data.data[0].storeImageTypeName;
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
      })
    },
    //图片滑动时改变radio的值
    imageChange: function (val) {
      this.imgTypeName = this.images[val].storeImageTypeName;
    },
    //点击购买按钮
    clickBuyButton: function () {
      this.$router.push({name: "styleStoreAddOrder", query: [this.style]})
    },
    //点击添加到购物车按钮
    clickShopCartButton: function () {
      this.$axios({
        method: "PUT",
        url: "/storeStyle/addShoppingCart",
        data: {
          id: this.style.id,
          clothesSize: this.clothesSize,
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        response.data.code === 200?this.$toast.success('添加成功'):this.$toast.fail(response.data.msg);
        this.clothesSizeShow=false;
        this.queryShoppingCart();
      })
    },
    //查询购物车列表
    queryShoppingCart() {
      this.$axios({
        method: "GET",
        url: "/storeStyle/queryShoppingCart",
        params: {
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        if (response.data.code !== 200) return false;
        let res = response.data.data;
        this.shopCartNum = res.length === 0 ? 0 : res.length;
      })
    },
    toShopCartList() {
      this.$router.push({name: "styleStoreShopCart"})
    },
  },
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 7px;
  margin: 4% 3%;
  padding: 3% 3%;
  height: 100%;
  overflow: hidden;
}

.cardTitle {
  text-align: center;
  font-weight: bold
}

.card .imgParent {
  padding-left: 2%;
  height: 100%;
  width: 80px;
  display: inline-block;
}

.scrollbarDiv {

  white-space: nowrap;
  overflow-y: auto;
}

.scrollbarDiv::-webkit-scrollbar {
  width: 0;
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
.sizeNotActive{
  display: flex;
  justify-content: center
}
.sizeP{
  width: 60%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;

}
.sizeNotActiveP{
  background-color: var(--my-gray-color);
}
.sizeActiveP{

  background-color: var(--my-error-two-color);
}
</style>
