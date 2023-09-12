<template>
  <div>
    <van-sticky>
      <baseNavBar title="确认订单"/>
    </van-sticky>
    <div class="card" v-for="(item,index) in styleList" :key="index">
      <!--      <van-row class="cardTitle"><span>{{item.storeTypeName+'-'+item.storeSeriesNum}}</span></van-row>-->
      <van-row gutter="20">
        <van-col :span="11">
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
        <van-col :span="13">
          <van-row><p>品牌 : {{ item.storeBrandName }}</p></van-row>
          <van-row><p>类型 : {{ item.storeTypeName }}</p></van-row>
          <van-row><p>系列 : {{ item.storeSeriesName }}</p></van-row>
          <van-row><p>系列编号 : {{ item.storeSeriesNum }}</p></van-row>
          <van-row><p>款式名称 : {{ item.styleName }}</p></van-row>
          <van-row><p>款式编号 : {{ item.styleNum }}</p></van-row>
          <van-row><p>价格 : {{ item.salePrice }}</p></van-row>
          <van-row><p>建议零售价 : {{ item.suggestSalePrice }}</p></van-row>
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
      <van-row>
        <van-field
            style="padding: 10px 16px 0 10px;"
            v-model="item.styleRemark"
            autosize
            type="textarea"
            maxlength="100"
            placeholder="请输入留言"
            show-word-limit
        />
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
      <br><br>
      <van-row>
        <p v-show="styleDiscountRatio!==1" style="font-weight: bold;font-size: 15px;"
           v-html="`${priceCount} (原价) * ${styleDiscountRatio} (客户折扣)&ensp;&ensp;=&ensp;&ensp;${totalAmount} (总金额)`"/>
      </van-row>
    </div>
    <div class="card">
      <van-row class="cardTitle"><span>订单备注</span></van-row>
      <van-field
          v-model="remark"
          autosize
          type="textarea"
          maxlength="100"
          placeholder="请输入留言"
          show-word-limit
      />
    </div>
    <br><br><br><br>
    <van-submit-bar :price="totalAmount*100" button-text="提交订单" @submit="addOrder"/>
  </div>
</template>
<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"
import {ImagePreview} from "vant";
import mathUtils from "@/common/js/utils/math-utils"
import MathUtils from "@/common/js/utils/math-utils";

export default {
  name: "styleDetails",
  components: {
    baseNavBar,
  },
  created() {
    this.styleList = this.$route.query
    this.queryAdvanceCharge();
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
      //折扣前价格
      priceCount: 0,
      labelColor: ["#A52A2A", "#FF8C00", "#696969", "#FFA500", "#2F4F4F", "#6495ED", "#FF4500", "#40E0D0"],

      images: [],
      advanceCharge: 0,
      //折扣比例
      styleDiscountRatio: 0,
      //折扣后价格
      totalAmount: 0,
      //客户备注
      remark:"",
      orderId:0,
    }
  },
  methods: {
    clickImageItem(image) {
      ImagePreview([`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${image}`])
    },
    //查询预付款
    queryAdvanceCharge() {
      this.$axios({
        method: "GET",
        url: "/tenant/queryTenantInfo",
        params: {
          tenantCrop: this.tenantCrop
        }
      }).then(response => {
        this.advanceCharge = response.data.data.advanceCharge;
        this.styleDiscountRatio = response.data.data.styleDiscountRatio;
        this.getCountPrice();
      })
    },
    //点击订单
    addOrder() {
      this.$dialog.confirm({
        title: "确认订单?",
        message: "",
      }).then(() => {
        this.$axios({
          method: "PUT",
          url: "/storeOrder/addStoreOrder",
          data: this.structureData()
        }).then(response => {
          //如果提交订单成功则进入支付逻辑
          if (response.data.code === 200) {
            this.orderId=response.data.data.id;
            this.delAllShoppingCart();
            //如果余额有钱则使用余额支付 否则直接使用支付宝
            if (this.advanceCharge >= this.totalAmount) {
              this.changeAdvanceCharge(this.orderId);
              return;
            }
            this.$dialog.confirm({
              title: '预付款不足',
              message: `是否先用支付宝支付差额: ${MathUtils.subtract(this.totalAmount,this.advanceCharge)}?`,
            }).then(() => {
              if (/Linux/i.test(navigator.platform)) {
                androidMethod.getAliPayInfo(this.orderId);
              }else {
                window.webkit.messageHandlers.pay.postMessage(this.orderId);
              }
            })
          } else {
            this.$toast.fail('提交订单失败,请返回重试');
          }
        })
      })
    },
    //调用余额支付
    changeAdvanceCharge(orderId) {
      this.$dialog.confirm({
        title: '支付提示',
        message: '当前预付款余额: ' + this.advanceCharge + '<br>是否直接使用余额支付?',
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/storeOrder/advanceChargePay",
          data: {
            tenantCrop: this.tenantCrop,
            id: orderId,
            totalAmount: this.totalAmount,
            payChannel: 2,
            empId: this.empId,
            orderState: 1,
          }
        }).then(response => {
          //如果提交订单成功则进入支付逻辑
          if (response.data.code === 200) {
            this.$toast.success('支付成功');
          } else {
            this.$toast.fail('支付失败,请到采购列表完成支付!');
          }
          let self=this;
          setTimeout(()=>{
            self.$router.replace({name: "styleStoreOrderList"})
          })
        })
      }).catch(()=>{
        this.$router.replace({name: "styleStoreOrderList"})
      })
    },

    payResult(status) {
      if (status === 0 || status === "0") {
        this.$toast.fail('支付失败');
        let self=this;
        setTimeout(()=>{
          self.$router.replace({name: "styleStoreOrderList"})
        },1000)
      }
      if (status === 1 || status === "1") {

        //查询订单 如果是差额支付 则直接使用预付款支付剩余
        this.$axios({
          method: "GET",
          url: "/storeOrder/queryInfoById",
          params: {
            id:this.orderId
          }
        }).then(response=>{
          let orderStyle=response.data.data;
          if (orderStyle.unpaidAmount!=0){
            this.$axios({
              method: "POST",
              url: "/storeOrder/advanceChargePay",
              data: {
                tenantCrop: this.tenantCrop,
                id: this.orderId,
                totalAmount: orderStyle.unpaidAmount,
                payChannel: 2,
                empId: this.empId,
                orderState: 1,
              }
            }).then(response1 => {
              if (response1.data.code === 200) {
                this.$toast.success('支付成功');
              } else {
                this.$toast.fail('支付失败,请到采购列表完成支付!');
              }
              let self=this;
              setTimeout(()=>{
                self.$router.replace({name: "styleStoreOrderList"})
              },1000)
            })
          }
        })

      }
      console.log("js 接受原生回调")
    },
    //获得标签
    getLabel(val) {
      return val !== "" ? val.split(",") : [];
    },
    //获得一个款式的总价 数量*单价
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
      //获取总价
      this.priceCount = Number(this.$math.format(mathJsChain.done()))
      //获取折扣后价格
      this.totalAmount = mathUtils.multiply(this.priceCount, this.styleDiscountRatio);
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
          supplierTenantCrop: k.tenantCrop,
          tenantCrop: this.tenantCrop,
          remark: k.styleRemark,
        })
      })
      return {
        empId: this.empId,
        totalAmount: this.totalAmount,
        orderState: 0,
        styleDiscountRatio: this.styleDiscountRatio,
        tenantCrop: this.tenantCrop,
        supplierTenantCrop: storeOrderStyleS[0].supplierTenantCrop,
        storeOrderStyleS: storeOrderStyleS,
        remark: this.remark,
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
