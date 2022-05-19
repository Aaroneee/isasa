<template>
  <div>
    <van-sticky>
      <baseNavBar title="确认订单"/>
    </van-sticky>
    <div class="card">
      <van-row class="cardTitle"><span>信息</span></van-row>
      <br>
      <van-row>
        <van-col :span="10">
          <div>
            <img :src="`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${style.mainImage}?imageMogr2/rquality/60`" style="height: 150px;border-radius: 10px"
                 @click="clickImageItem(style.mainImage)" alt="图片已损坏"/>
          </div>
        </van-col>
        <van-col :span="14">
          <van-row><p>品牌 : {{style.libBrandName}}</p></van-row>
          <van-row><p>类型 : {{style.libTypeName}}</p></van-row>
          <van-row><p>系列 : {{style.libSeriesName}}</p></van-row>
          <van-row><p>编号 : {{style.libSeriesNumberName}}</p></van-row>
          <van-row><p>价格 : {{style.salePrice}}</p></van-row>
          <van-row>
            <van-col v-for="(item,index) in labelNames" :key="index" style="margin: 1% 1%">
              <van-tag size="large" v-once :color="labelColor[Math.floor(Math.random() * labelColor.length)]">{{ item }}</van-tag>
            </van-col>
          </van-row>
          <van-row style="text-align: right">
            <van-stepper min="1" v-model="styleNumber" />
          </van-row>
        </van-col>
      </van-row>
    </div>
    <div class="card">
      <van-row class="cardTitle"><span>价格明细</span></van-row>
      <br>
      <van-row>
        <van-col :span="24">
          <van-row>
            <van-col :span="12">
              <span style="font-size: 15px;font-weight: bold">商品总价 </span>
              <span style="font-size: 15px;"> 共{{styleNumber}}件</span>
            </van-col>
            <van-col :span="12">
              <p style="width: 100%;font-size: 15px;font-weight: bold;text-align: right">￥{{priceCount}}</p>
            </van-col>
          </van-row>
        </van-col>
      </van-row>
    </div>
    <van-submit-bar :price="priceCount*100" button-text="提交订单" @submit="addOrder" />
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
  },
  data() {
    return {
      style: {},
      styleNumber:1,
      tenantCrop: localStorage.getItem("tenantCrop"),
      empId: localStorage.getItem("empId"),
      priceCount:0,
      labelNames:[],
      labelColor: ["#A52A2A", "#FF8C00", "#696969", "#FFA500", "#2F4F4F", "#6495ED", "#FF4500", "#40E0D0"],

      images:[],
    }
  },
  watch: {
    'style.labelNames':function (val){
      this.labelNames=val!==""?val.split(","):[];
    },
    styleNumber:function (val){
      this.priceCount=this.$math.evaluate(this.styleNumber*this.style.salePrice)
      this.priceCount=Number(this.$math.format(
          this.$math.chain(this.$math.bignumber(this.styleNumber))
          .multiply(this.$math.bignumber(this.style.salePrice)).done()
      ))
    }
  },
  methods: {
    queryStyleDetails(){
      this.$axios({
        method: "GET",
        url: "/libraryStyle/queryById",
        params: {
          id: this.style.id,
        }
      }).then(response => {
        this.style=response.data.data
        this.priceCount=this.style.salePrice;
        console.log( this.style)
      })
    },
    clickImageItem(image){
        ImagePreview([`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${image}`])
    },
    addOrder(){
      console.log("单价")
      console.log(this.style.salePrice)
      console.log("总价")
      console.log(this.priceCount)
      console.log("数量")
      console.log(this.styleNumber)
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
  text-align: center;
  font-weight: bold;
  font-size: 20px;
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
  margin: 0 0 2% 0;
}

</style>
