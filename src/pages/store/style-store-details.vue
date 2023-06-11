<template>
  <div>
    <van-sticky>
      <baseNavBar title="款式详情"/>
    </van-sticky>
    <!--    头部-->
    <div class="card">
      <van-row>
        <div class="scrollbarDiv">
          <div v-for="(image, index) in images" :key="index" style="display: inline;margin-right: 2%">
            <img :src="image" style="height: 300px"
                 @click="clickImageItem(index)" alt="未查到图片"/>
          </div>
        </div>
      </van-row>
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
          <p>折扣金额 : {{ style.discountPrice }}元</p>
        </van-col>
        <van-col :span="12">
          <p>折扣比例 : {{ style.discountRatio*100 }}</p>
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
    console.log(this.style)
    this.queryStyleDetails()
    this.queryStoreStyleImage()
    this.queryShoppingCart()
  },
  data() {
    return {
      style: {},

      labelNames:[],
      labelColor: ["#A52A2A", "#FF8C00", "#696969", "#FFA500", "#2F4F4F", "#6495ED", "#FF4500", "#40E0D0"],

      images:[],
      shopCartNum:0,

      tenantCrop: localStorage.getItem("tenantCrop"),
    }
  },
  watch: {
    'style.labelNames':function (val){
      this.labelNames=val!==""?val.split(","):[];
    },
  },
  methods: {
    queryStyleDetails(){
      this.$axios({
        method: "GET",
        url: "/storeStyle/queryById",
        params: {
          id: this.style.id,
        }
      }).then(response => {
        console.log(response)
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
        console.log(response.data.data)
        const data = response.data.data;
        for (let index in data) {
          data[index] = "https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/" + data[index].styleImage
        }
        this.images = data
      })
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
        console.log(response)
        if (response.data.code!==200) return false;
        let res=response.data.data;
        this.shopCartNum=res.length===0?0:res.length;
      })
    },
    clickImageItem: function (index) {
      ImagePreview(this.images,index)
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


.scrollbarDiv{

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

</style>
