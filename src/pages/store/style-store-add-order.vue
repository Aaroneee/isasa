<template>
  <div>
    <van-sticky>
      <baseNavBar title="确认订单"/>
    </van-sticky>
    <div class="card" v-for="(item,index) in styleList" :key="index">
      <!--      <van-row class="cardTitle"><span>{{item.storeTypeName+'-'+item.storeSeriesNum}}</span></van-row>-->
      <van-row>
        <van-col :span="10">
          <div>
            <van-image class="style-img" radius="7"
                       @click="clickImageItem(item.mainImage)"
                       fit="contain"
                       :src="item.styleImage===''?'null'
                               :'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.mainImage+'?imageMogr2/rquality/60'">
              <template v-slot:error>加载失败,请更换主图</template>
            </van-image>
          </div>
        </van-col>
        <van-col :span="14">
          <van-row><p>品牌 : {{ item.storeBrandName }}</p></van-row>
          <van-row><p>类型 : {{ item.storeTypeName }}</p></van-row>
          <van-row><p>系列 : {{ item.storeSeriesName }}</p></van-row>
          <van-row><p>系列编号 : {{ item.storeSeriesNum }}</p></van-row>
          <van-row><p>价格 : {{ item.salePrice }}</p></van-row>
          <van-row>
            <van-col v-for="(childItem,index) in getLabel(item.labelNames)" :key="index" style="margin: 1% 1%">
              <van-tag size="large" v-once :color="labelColor[Math.floor(Math.random() * labelColor.length)]">
                {{ childItem }}
              </van-tag>
            </van-col>
          </van-row>
          <van-row style="text-align: right">
            <van-stepper min="1" v-model="item.styleNumber" @change="getCountPrice"/>
          </van-row>
        </van-col>
      </van-row>
    </div>
    <div class="card">
      <van-row class="cardTitle"><span>价格明细</span></van-row>
      <br>
      <van-row v-for="(item,index) in styleList" :key="index" style="margin-bottom: 10px">
        <van-col :span="12">
          <span
              style="font-size: 15px;font-weight: bold">{{
              item.storeTypeName + '-' + item.storeSeriesName + '-' + item.storeSeriesNum
            }} </span>
          <span style="font-size: 15px;">  共<span style="font-weight: bold">{{ item.styleNumber }}</span>件</span>
        </van-col>
        <van-col :span="12">
          <p style="width: 100%;font-size: 15px;font-weight: bold;text-align: right">
            ￥{{ getSingleCountPrice(item.styleNumber === undefined ? 1 : item.styleNumber, item.salePrice) }}
          </p>
        </van-col>
      </van-row>
    </div>
    <van-submit-bar :price="priceCount*100" button-text="提交订单" @submit="addOrder"/>
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
    this.styleList = this.$route.query
    this.getCountPrice();
  },
  mounted() {
    window.payResult = this.payResult
  },
  data() {
    return {
      styleList: [],
      styleNumber: 1,
      tenantCrop: localStorage.getItem("tenantCrop"),
      empId: localStorage.getItem("empId"),
      priceCount: 0,
      labelColor: ["#A52A2A", "#FF8C00", "#696969", "#FFA500", "#2F4F4F", "#6495ED", "#FF4500", "#40E0D0"],

      images: [],
    }
  },
  methods: {
    clickImageItem(image) {
      ImagePreview([`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${image}`])
    },
    addOrder() {
      this.$axios({
        method: "PUT",
        url: "/storeOrder/addStoreOrder",
        data: this.structureData()
      }).then(response => {

        //如果提交订单成功 则调用支付宝 并清空购物车
        if (response.data.code === 200) {
          console.log(response)
          this.delAllShoppingCart();
          if (/Linux/i.test(navigator.platform)) {
            androidMethod.getAliPayInfo(response.data.data.id);
          } else {
            window.webkit.messageHandlers.pay.postMessage(response.data.data.id);
          }

        } else {
          this.$toast.fail('提交订单失败,请返回重试');
        }
      })
    },
    payResult(status) {
      console.log(status)
      if (status === 0 || status === "0") {
        this.$toast.fail('支付失败');
      }
      if (status === 1 || status === "1") {
        this.$toast.success('支付成功');

        this.$router.push({name:"styleStoreOrderList"})
      }
      console.log("js 接受原生回调")
    },
    //获得标签
    getLabel(val) {
      return val !== "" ? val.split(",") : [];
    },
    //获得一个款式的总价
    getSingleCountPrice(num, price) {
      return Number(this.$math.format(
          this.$math.chain(this.$math.bignumber(num))
              .multiply(this.$math.bignumber(price)).done()
      ))
    },
    //获得总价
    getCountPrice() {
      let mathJsChain = this.$math.chain(this.$math.bignumber(0));
      this.styleList.forEach(k => {
        let styleNumber = this.$math.bignumber(k.styleNumber === undefined ? 1 : k.styleNumber);
        let salePrice = this.$math.bignumber(k.salePrice);

        let bigNumber = this.$math.format(
            this.$math.chain(styleNumber)
                .multiply(salePrice).done());
        mathJsChain = mathJsChain.add(this.$math.bignumber(bigNumber));
      })
      this.priceCount = Number(this.$math.format(mathJsChain.done()))
    },
    //清空购物车
    delAllShoppingCart() {
      this.$axios({
        method: "POST",
        url: "/storeStyle/delAllShoppingCart",
        data: {
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {

      })
    },
    //构建提交参数
    structureData() {
      let storeOrderStyleS = [];
      this.styleList.forEach(k => {
        storeOrderStyleS.push({
          storeStyleId: k.id,
          styleNum: k.styleNumber,
          unitPrice: k.salePrice,
          amount: this.getSingleCountPrice(k.styleNumber, k.salePrice),
          tenantCrop: this.tenantCrop,
        })
      })
      return {
        empId: this.empId,
        totalAmount: this.priceCount,
        payState: 0,
        tenantCrop: this.tenantCrop,
        storeOrderStyleS: storeOrderStyleS,
      }
    }
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


.scrollbarDiv {

  white-space: nowrap;
  overflow-y: auto;
}

.scrollbarDiv::-webkit-scrollbar {
  width: 0;
}

p {
  font-size: 14px;
  margin: 0 0 2% 0;
}

</style>
