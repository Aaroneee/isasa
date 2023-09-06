<template>
  <div>
    <van-sticky>
      <baseNavBar title="采购列表"/>
      <van-row style="display: flex;align-items: center;background: #FFFFFF;">
        <van-col :span="12" style="height: 100%;">
          <div style="height:100%;border-radius: 10px;display: flex;
flex-direction: column;justify-content: center;align-items: center">
            <p style="font-size: 15px">预付款余额</p>
            <p style="font-size: 14px">¥ {{ advanceCharge }}</p>
          </div>
        </van-col>
        <van-col :span="12" style="height: 100%">
          <van-dropdown-menu active-color="#1989fa">
            <van-dropdown-item v-model="orderState" :options="orderStateArray" @change="queryOrderList()"/>
          </van-dropdown-menu>
        </van-col>
      </van-row>
    </van-sticky>
    <van-loading type="spinner" v-show="loading"/>
    <van-collapse v-model="activeNames">
      <van-collapse-item :name="index" :style="{color: `${getOrderStateText(item.orderState)[1]} !important`}"
                         v-for="(item,index) in orderList" :key="index">
        <template #title>
          <van-row>
            <van-col :span="12">
              {{ item.storeOrderStyleVOS[0].storeBrandName }}
            </van-col>
            <van-col :span="12">
              {{ item.createDate }}
            </van-col>

          </van-row>
          <van-row>
            <van-col :span="12" :style="{textAlign:'left',color:getOrderStateText(item.orderState)[1]}">
              {{ getOrderStateText(item.orderState)[0] }}
            </van-col>
            <van-col :span="12">
              总金额 : {{ item.totalAmount }}
              <van-icon @click.stop="queryChangeAmountList(item.id)" v-show="item.changeAmount!==''" name="question-o"/>
            </van-col>
          </van-row>
          <van-row>
            <van-col :span="24" v-show="item.orderState===2">
              <span @click.stop="copyTrackingNumber(item.trackingNumber)" style="color: var(--my-describe-color)">快递单号 : {{ item.trackingNumber }}</span>
            </van-col>
          </van-row>
        </template>
        <div class="cardParent">
          <p>订单编号: {{ item.orderNo }}</p>
          <p>下单日期: {{ item.createDate }}</p>
          <p>订单总价: {{ item.totalAmount }}
          <p style="color: var(--my-describe-color)">订单备注: {{ item.remark }}
            <van-icon @click.stop="queryChangeAmountList(item.id)" v-show="item.changeAmount!==''" name="question-o"/>
          </p>
          <div class="card" v-for="(childItem,childIndex) in item.storeOrderStyleVOS" :key="childIndex">
            <van-row gutter="10">
              <van-col :span="10">
                <div class="imgParent">
                  <img class="style-img"
                       @click="clickImageItem(childItem.mainImage)"
                       :src="
                   'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+childItem.mainImage+'?imageMogr2/rquality/60'"
                       @error="($event)=>{
                        $event.target.src='https://isasaerp-img-1304365928.cos.ap-shanghai.myqcloud.com/logoFont.jpg?imageMogr2/rquality/2';
                      }" alt=""/>
                </div>
              </van-col>
              <van-col :span="14" @click="toStyleDetails({id:childItem.storeStyleId})">
                <van-row><p :style="{color: getOrderStateText(childItem.styleState)[1]}">款式状态 :
                  {{ getOrderStateText(childItem.styleState)[0] }}</p></van-row>
                <van-row v-show="childItem.styleState===2">
                  <p @click.stop="copyTrackingNumber(childItem.trackingNumber)" style="color: var(--my-describe-color)">
                    快递单号 : {{ childItem.trackingNumber }}</p>
                </van-row>
                <van-row><p>类型 : {{ childItem.storeTypeName }}</p></van-row>
                <van-row><p>品牌 : {{ childItem.storeBrandName }}</p></van-row>
                <van-row><p>系列名称 : {{ childItem.storeSeriesName }}</p></van-row>
                <van-row><p>系列编号 : {{ childItem.storeSeriesNum }}</p></van-row>
                <van-row><p>单价 : {{ childItem.unitPrice }}</p></van-row>
                <van-row><p>数量 : {{ childItem.styleNum }}</p></van-row>
                <van-row><p>总金额 : {{ childItem.amount }}</p></van-row>
              </van-col>
            </van-row>
            <van-row>
              款式备注：{{childItem.remark}}
            </van-row>
          </div>
          <van-row :gutter="5">
            <van-col v-if="item.orderState===0" :span="8" style="text-align: center">
              <van-button
                  style="border-radius: 10px;background-color: var(--my-success-one-color);border-color: var(--my-success-one-color);width: 100%;height: 35px;font-size: 13px"
                  @click="goPay(item.id,item.totalAmount)" text="点击支付">
              </van-button>
            </van-col>
            <van-col v-if="item.orderState===0" :span="8" style="text-align: center">
              <van-button
                  style="border-radius: 10px;background-color: var(--my-warning-one-color);border-color: var(--my-warning-one-color);width: 100%;height: 35px;font-size: 13px"
                  @click="cancelOrder('取消订单',item.id)" text="取消订单"/>
            </van-col>
            <van-col v-if="item.orderState===1" :span="8" style="text-align: center">
              <van-button
                  style="border-radius: 10px;background-color: var(--my-warning-color);border-color: var(--my-warning-color);width: 100%;height: 35px;font-size: 13px"
                  @click="cancelOrder('取消并退款',item.id)" text="取消并退款">
              </van-button>
            </van-col>

            <van-col v-if="[3,4].includes(item.orderState)" :span="8" style="text-align: center">
              <van-button
                  style="border-radius: 10px;background-color: var(--my-error-color);border-color: var(--my-error-color);width: 100%;height: 35px;font-size: 13px"
                  @click="delByOrderId(item.id)" text="删除订单"/>
            </van-col>
          </van-row>
        </div>

      </van-collapse-item>
    </van-collapse>
    <van-popup v-model="updateAmount.openChangeAmountListState" round style="width: 80vw;height: 50vh;padding:8px 16px 24px;
    background-color: #F0F2F5">
      <p style="text-align: center;font-size:18px;font-weight: bolder" >价格历史</p>
      <div v-for="(updateAmountItem,updateAmountIndex) in updateAmount.changeAmountList" :key="updateAmountIndex"
           class="updateAmountCard">
        <p :style="{textAlign: 'center',fontSize: '16px',color:updateAmountItem.amount<0?'#67C23A':'#F56C6C'}">{{updateAmountItem.createDate}}</p>
        <van-row style="margin: 4% 0 2% 0">
          <van-col :span="10" style="height: 20px;">价格调整 :</van-col>
          <van-col :span="14" style="height: 20px;display: flex;align-items: center">
            {{ updateAmountItem.amount>0?'+'+updateAmountItem.amount:updateAmountItem.amount }}
          </van-col>
        </van-row>
        <van-row style="margin: 2% 0">
          <van-col :span="10">调整前价格 :</van-col>
          <van-col :span="14">{{ updateAmountItem.originalAmount }}</van-col>
        </van-row>
        <van-row style="margin: 2% 0">
          <van-col :span="10">调整后价格 :</van-col>
          <van-col :span="14">{{ updateAmountItem.finalAmount }}</van-col>
        </van-row>
        <van-row style="margin: 2% 0">
          <van-col :span="10">调整备注 :</van-col>
          <van-col :span="14">{{ updateAmountItem.remark }}</van-col>
        </van-row>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {ImagePreview} from "vant";
import baseNavBar from "@/components/nav-bar/base-nav-bar";
import MathUtils from "@/common/js/utils/math-utils";

export default {
  name: "style-store-order-list",
  data() {
    return {
      orderState: "",
      orderList: [],
      activeNames: [0],
      orderStateArray: [
        {text: '全部', value: ''},
        {text: '待付款', value: 0},
        {text: '待发货', value: 1},
        {text: '已发货', value: 2},
        {text: '已退款', value: 3},
        {text: '已取消', value: 4},
      ],

      priceCount: 0,

      labelColor: ["#A52A2A", "#FF8C00", "#696969", "#FFA500", "#2F4F4F", "#6495ED", "#FF4500", "#40E0D0"],

      loading: false,
      tenantCrop: localStorage.getItem("tenantCrop"),
      empId: localStorage.getItem("empId"),

      updateAmount: {
        openChangeAmountListState: false,
        changeAmountList: [],
      },
      //预付款
      advanceCharge: 0,
      //点击支付暂时存orderId
      orderId:0.
    }
  },
  created() {
    this.queryOrderList()
    this.queryAdvanceCharge()
  },
  mounted() {
    window.onClickLeft = this.onClickLeft
    window.payResult = this.payResult
  },
  components: {
    baseNavBar
  },
  methods: {
    //查询购物车列表
    queryOrderList() {
      this.loading = true;
      this.$axios({
        method: "GET",
        url: "/storeOrder/queryList",
        params: {
          orderState: this.orderState,
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        this.loading = false
        if (response.data.code !== 200) return false;
        this.orderList = response.data.data;
      })
    },
    //跳转到款式详情
    toStyleDetails(value) {
      this.$router.push({name: "styleStoreDetails", query: value})
    },
    //点击支付
    goPay(id,totalAmount) {
      this.orderId=id;
      //如果余额有钱则使用余额支付 否则直接使用支付宝
      if (this.advanceCharge >= totalAmount) {
        this.changeAdvanceCharge(id,totalAmount);

        return;
      }
      this.$dialog.confirm({
        title: '预付款不足',
        message: `是否先用支付宝支付差额: ${MathUtils.subtract(totalAmount,this.advanceCharge)}?`,
      }).then(() => {
        if (/Linux/i.test(navigator.platform)) {
          androidMethod.getAliPayInfo(id);
        }else {
          window.webkit.messageHandlers.pay.postMessage(id);
        }
      })
    },
    payResult(status) {
      if (status === 0 || status === "0") {
        this.$toast.fail('支付失败');
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
              if (response1.data.code===200){
                this.$toast.success('支付成功');
                this.queryOrderList();
                this.queryAdvanceCharge();
              }else {
                this.$toast.fail('支付失败');
              }
            })
          }
        })

      }
    },
    //取消和退款
    cancelOrder(type, orderId) {
      let text = type === '取消并退款' ? "是否取消该订单？款项将退回账户预付款!" : "是否取消订单？";
      let resultText = type === '取消并退款' ? "取消成功,钱款已退回!" : "取消成功!";
      this.$dialog.confirm({
        title: type,
        message: text,
      })
          .then(() => {
            this.$axios({
              method: "POST",
              url: "/storeOrder/cancelOrder",
              data: {
                id: orderId,
              }
            }).then(response => {
              if (response.data.code === 200) {
                this.$toast.success(resultText);
                this.queryOrderList();
                return;
              }
              this.$toast.fail(response.data.msg);
            });
          })
          .catch(() => {
            // on cancel
          });
    },
    //删除订单
    delByOrderId(orderId) {
      this.$dialog.confirm({
        title: "删除订单",
        message: "是否删除该订单?",
      })
          .then(() => {
            this.$axios({
              method: "POST",
              url: "/storeOrder/delById",
              data: {
                id: orderId,
              }
            }).then(response => {
              if (response.data.code === 200) {
                this.$toast.success("删除成功!");
                this.queryOrderList();
                return;
              }
              this.$toast.fail(response.data.msg);
            });
          })
          .catch(() => {
            // on cancel
          });
    },
    //查询价格修改历史
    queryChangeAmountList(orderId) {
      this.$axios({
        method: "GET",
        url: "/storeOrderAmount/queryList",
        params: {
          orderId: orderId,
        }
      }).then(response => {
        this.updateAmount.changeAmountList = response.data.data.reverse();
        this.updateAmount.openChangeAmountListState = true;
      });
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
      })
    },
    //调用余额支付
    changeAdvanceCharge(orderId,totalAmount) {
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
            totalAmount: totalAmount,
            payChannel: 2,
            empId: this.empId,
            orderState: 1,
          }
        }).then(response => {
          //如果提交订单成功则进入支付逻辑
          if (response.data.code === 200) {
            this.$toast.success('支付成功');

            this.queryOrderList();
          } else {
            this.$toast.fail('支付失败,请刷重试!');
          }
          this.queryAdvanceCharge();
        })
      })
    },
    clickImageItem: function (image) {
      ImagePreview([`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${image}`])
    },
    //复制文本
    copyTrackingNumber(text) {
      let _this = this;
      _this.$copyText(text).then(function (e) {
        _this.$toast.success({message: '已复制快递单号', duration: 700});
      }, err => {
        _this.$toast.fail({message: '快递单号复制失败,请充实', duration: 700});
      })
    },
    //获取订单显示文本
    getOrderStateText(orderState) {
      switch (orderState) {
        case 0:
          return ["待付款", "#FAAB0C"];
        case 1:
          return ["待发货", "#E6A23C"];
        case 2:
          return ["已发货", "#07c160"];
        case 3:
          return ["已退款", "#EE0A24"];
        case 4:
          return ["已取消", "#F56C6C"];
      }
    },
  },
}
</script>

<style scoped>
.cardParent {
  background: white;
  border-radius: 7px;
  /*margin:  2% 3%;*/
  /*padding: 3% 3%;*/
  height: 100%;
  overflow: hidden;
}

.card {
  background: white;
  border-radius: 7px;
  margin: 2% 3%;
  /*padding: 3% 3%;*/
  height: 100%;
  overflow: hidden;
}

.van-search {
  padding: 7px 12px;
}

.imgParent {
  max-height: 250px;
}

img {
  max-height: 250px;
  width: 100%;
  border-radius: 7px;
}

p {
  font-size: 14px;
  margin: 0 0 2% 0;
  color: #000000;
  word-break: normal;
  width: auto;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
}
.updateAmountCard {
  background-color: #ffffff;
  border-radius: 10px;
  padding:8px 16px 24px;
  margin:8px 16px 24px;
  font-size: 14px;
  word-break: normal;
  width: auto;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
}
</style>