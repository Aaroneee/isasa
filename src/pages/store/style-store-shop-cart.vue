<template>
  <div>
    <baseNavBar title="购物车"/>
    <van-swipe-cell v-for="(item,index) in shopCartList" :key="index">
      <div class="card">
        <van-row>
          <van-col :span="10">
            <div>
              <img :src="`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${item.mainImage}?imageMogr2/rquality/60`" style="height: 150px;border-radius: 10px"
                   @click="clickImageItem(item.mainImage)" alt="图片已损坏"/>
            </div>
          </van-col>
          <van-col :span="14" @click="toStyleDetails(item)">
            <van-row><p>品牌 : {{item.libBrandName}}</p></van-row>
            <van-row><p>类型 : {{item.libTypeName}}</p></van-row>
            <van-row><p>系列 : {{item.libSeriesName}}</p></van-row>
            <van-row><p>系列编号 : {{item.libSeriesNumberName}}</p></van-row>
            <van-row><p>价格 : {{item.salePrice}}</p></van-row>
            <van-row>
              <van-col v-for="(childItem,index) in getLabel(item.labelNames)" :key="index" style="margin: 1% 1%">
                <van-tag size="large" v-once :color="labelColor[Math.floor(Math.random() * labelColor.length)]">{{ childItem }}</van-tag>
              </van-col>
            </van-row>
          </van-col>
        </van-row>
      </div>
      <template #right>
        <van-button square text="删除" type="danger" class="delete-button" @click="delShoppingCart(item.id)"/>
      </template>
    </van-swipe-cell>
    <br><br><br>
    <van-submit-bar button-text="结算" @submit="onSubmit"/>
  </div>
</template>

<script>
import {ImagePreview} from "vant";
import baseNavBar from "@/components/nav-bar/base-nav-bar";

export default {
  name: "style-store-shop-cart",
  data(){
    return{
      shopCartList:[],

      priceCount:0,

      labelColor: ["#A52A2A", "#FF8C00", "#696969", "#FFA500", "#2F4F4F", "#6495ED", "#FF4500", "#40E0D0"],

      loading: false,
      tenantCrop: localStorage.getItem("tenantCrop"),
    }
  },
  created() {
    this.queryShoppingCart()
  },
  components: {
    baseNavBar
  },
  methods:{
    //查询购物车列表
    queryShoppingCart(){
      this.loading = true;
      this.$axios({
        method: "GET",
        url: "/libraryStyle/queryShoppingCart",
        params: {
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        this.loading = false
        if (response.data.code!==200) return false;
        this.shopCartList=response.data.data;
      })
    },
    //跳转到款式详情
    toStyleDetails(value) {
      this.$router.push({name: "styleStoreDetails", query: value})
    },
    //删除购物车
    delShoppingCart(id){
      this.$axios({
        method: "POST",
        url: "/libraryStyle/delShoppingCart",
        data: {
          id: id,
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        this.queryShoppingCart();
      })
    },
    //获得标签
    getLabel(val){
      return val!==""?val.split(","):[];
    },
    //跳转到添加订单页面
    onSubmit(){
      this.$router.push({name: "styleStoreAddOrder", query: this.shopCartList})
    },
    clickImageItem: function (image) {
      ImagePreview([`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${image}`])
    },
  },
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 7px;
  margin:  1% 3%;
  padding: 3% 3%;
  height: 100%;
  overflow: hidden;
}
.cardTitle{
  text-align: center;
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 10px;
}
.card .imgParent {
  padding-left: 2%;
  height: 100%;
  width: 80px;
  display: inline-block;
  /*align-items: center;*/
}
p {
  font-size: 14px;
  margin: 0 0 2% 0;
}
.delete-button {
  height: 100%;
}
</style>