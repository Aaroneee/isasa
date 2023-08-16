<template>
  <div>
    <van-sticky>
      <baseNavBar title="款式订单"/>
      <van-row>
        <van-col :span="12">
          <van-search
              v-model="tenantName"
              placeholder="请输入搜索关键词"
              input-align="center"
              @search="queryAdminList()"
          />
        </van-col>
        <van-col :span="12" style="height: 100%">
          <van-dropdown-menu active-color="#1989fa">
            <van-dropdown-item v-model="orderState" :options="orderStateArray" @change="queryAdminList()"/>
          </van-dropdown-menu>
        </van-col>
      </van-row>


    </van-sticky>

    <!--    <van-loading type="spinner" v-show="loading"/>-->
    <van-collapse v-model="activeNames">
      <van-collapse-item :name="index" :style="{color: `${getOrderStateText(item.orderState)[1]} !important`}"
                         v-for="(item,index) in orderList" :key="index">
        <template #title>
          <van-row>
            <van-col :span="12">
              {{ item.tenantName }}
            </van-col>
            <van-col :span="12" style="text-align: center">
              {{ item.createDate }}
            </van-col>
          </van-row>
          <van-row>
            <van-col :span="12" :style="{color:getOrderStateText(item.orderState)[1]}">
              {{ getOrderStateText(item.orderState)[0] }}
            </van-col>
            <van-col :span="12" v-show="item.orderState===1">
              <van-button
                  style="border-radius: 5px;background-color: var(--my-success-one-color);border-color: var(--my-success-one-color);width: 100%;height: 25px;font-size: 12px;"
                  @click.stop="(()=>{openTrackingNumberState=true;orderId=item.id})" text="一键发货">
              </van-button>
            </van-col>
            <van-col :span="12" v-show="item.orderState===2" style="text-align: center">
              <p @click.stop="copyTrackingNumber(item.trackingNumber)" style="color: var(--my-describe-color)">{{item.trackingNumber}}</p>
            </van-col>
          </van-row>
        </template>
        <div class="cardParent">
          <p>订单编号: {{ item.orderNo }}</p>
          <p>下单日期: {{ item.createDate }}</p>
          <p>订单总价: {{ item.totalAmount }}</p>
          <div class="card" v-for="(childItem,childIndex) in item.storeOrderStyleVOS" :key="childIndex">
            <van-row gutter="10">
              <van-col :span="10">
                <div class="imgParent">
                  <img
                      class="style-img"
                      @click="clickImageItem(childItem.mainImage)"
                      :src="'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+childItem.mainImage+'?imageMogr2/rquality/60'"
                      alt="主图显示失败,请重新设置主图"
                      @error="($event)=>{
                        $event.target.src='https://isasaerp-img-1304365928.cos.ap-shanghai.myqcloud.com/logoFont.jpg?imageMogr2/rquality/2';
                      }"/>
                </div>
              </van-col>
              <van-col :span="14" @click="toStyleDetails({id:childItem.storeStyleId})">
                <van-row><p :style="{color: getOrderStateText(childItem.styleState)[1]}">款式状态 :
                  {{ getOrderStateText(childItem.styleState)[0] }}</p></van-row>
                <van-row v-show="childItem.styleState===2">
                  <p @click.stop="copyTrackingNumber(childItem.trackingNumber)" style="color: var(--my-describe-color)">快递单号 : {{childItem.trackingNumber}}</p>
                </van-row>
                <van-row><p>品牌 : {{ childItem.storeBrandName }}</p></van-row>
                <van-row><p>类型 : {{ childItem.storeTypeName }}</p></van-row>
                <van-row><p>系列 : {{ childItem.storeSeriesName }}</p></van-row>
                <van-row><p>系列编号 : {{ childItem.storeSeriesNum }}</p></van-row>
                <van-row><p>单价 : {{ childItem.unitPrice }}</p></van-row>
                <van-row><p>数量 : {{ childItem.styleNum }}</p></van-row>
                <van-row><p>总金额 : {{ childItem.amount }}</p></van-row>
                <van-button v-if="childItem.styleState===1"
                            style="border-radius: 10px;background-color: var(--my-success-color);border-color: var(--my-success-color);width: 100%;height: 25px;font-size: 12px"
                            @click.stop="(()=>{openChildTrackingNumberState=true;orderId=item.id;orderStyleId=childItem.id})" text="单件发货">
                </van-button>
              </van-col>
            </van-row>
          </div>
          <van-row :gutter="5">
            <van-col v-if="item.orderState===1" :span="8" style="text-align: center">
              <van-button
                  style="border-radius: 10px;background-color: var(--my-success-one-color);border-color: var(--my-success-one-color);width: 100%;height: 35px;font-size: 13px"
                  @click="(()=>{openTrackingNumberState=true;orderId=item.id})" text="一键发货">
              </van-button>
            </van-col>
            <van-col v-if="item.orderState===1" :span="8" style="text-align: center">
              <van-button
                  style="border-radius: 10px;background-color: var(--my-warning-color);border-color: var(--my-warning-color);width: 100%;height: 35px;font-size: 13px"
                  @click="cancelOrder('取消并退款',item.id)" text="取消并退款">
              </van-button>
            </van-col>
            <van-col v-if="item.orderState===0" :span="8" style="text-align: center">
              <van-button
                  style="border-radius: 10px;background-color: var(--my-warning-one-color);border-color: var(--my-warning-one-color);width: 100%;height: 35px;font-size: 13px"
                  @click="cancelOrder('取消订单',item.id)" text="取消订单"/>
            </van-col>
            <van-col v-if="[3,4].includes(item.orderState)" :span="8" style="text-align: center">
              <van-button
                  style="border-radius: 10px;background-color: var(--my-error-color);border-color: var(--my-error-color);width: 100%;height: 35px;font-size: 13px"
                  @click="delByOrderId(item.id)" text="删除订单" />
            </van-col>
          </van-row>
        </div>

      </van-collapse-item>
    </van-collapse>
    <van-dialog v-model="openTrackingNumberState" title="快递单号" show-cancel-button @confirm="inputTrackingNumber">
      <van-field v-model="trackingNumberVal" placeholder="请输入快递单号"/>
    </van-dialog>
    <van-dialog v-model="openChildTrackingNumberState" title="快递单号" show-cancel-button @confirm="inputChildTrackingNumber">
      <van-field v-model="childTrackingNumberVal" placeholder="请输入快递单号"/>
    </van-dialog>
  </div>
</template>

<script>
import {ImagePreview} from "vant";
import baseNavBar from "@/components/nav-bar/base-nav-bar";

export default {
  name: "style-store-order-admin-list",
  data() {
    return {
      orderState: 0,
      tenantName: "",
      orderList: [],
      activeNames: [0],

      priceCount: 0,

      labelColor: ["#A52A2A", "#FF8C00", "#696969", "#FFA500", "#2F4F4F", "#6495ED", "#FF4500", "#40E0D0"],

      loading: true,
      supplierTenantCrop: localStorage.getItem("tenantCrop"),

      orderStateArray: [
        {text: '全部', value: ''},
        {text: '待付款', value: 0},
        {text: '待发货', value: 1},
        {text: '已发货', value: 2},
        {text: '已退款', value: 3},
        {text: '已取消', value: 4},
      ],
      orderId: "",
      openTrackingNumberState: false,
      trackingNumberVal: "",

      orderStyleId: "",
      openChildTrackingNumberState: false,
      childTrackingNumberVal: "",
    }
  },
  created() {
    this.queryAdminList()
  },
  components: {
    baseNavBar
  },
  mounted() {
    window.onClickLeft = this.onClickLeft
  },
  methods: {
    //查询购物车列表
    queryAdminList() {
      this.$axios({
        method: "GET",
        url: "/storeOrder/queryAdminList",
        params: {
          tenantName: this.tenantName,
          orderState: this.orderState,
          supplierTenantCrop: this.supplierTenantCrop,
        }
      }).then(response => {
        this.loading = false
        if (response.data.code !== 200) return false;
        this.orderList = response.data.data;
      })
    },
    //单件发货按钮
    inputChildTrackingNumber() {
      this.$axios({
        method: "POST",
        url: "/storeOrderStyle/sendStyle",
        data: {
          id: this.orderStyleId,
          storeOrderId:this.orderId,
          styleState:2,
          trackingNumber: this.childTrackingNumberVal,
        }
      }).then(response => {
        if (response.data.code === 200){
          this.$toast.success("单件款式发货成功!");
          this.queryAdminList();
          this.orderStyleId="";
          this.childTrackingNumberVal="";
          return;
        }
        this.$toast.fail(response.data.msg);
      });
    },
    //发货按钮
    inputTrackingNumber() {
      this.$axios({
        method: "POST",
        url: "/storeOrder/sendAllStyles",
        data: {
          id: this.orderId,
          orderState: 2,
          trackingNumber: this.trackingNumberVal,
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.$toast.success("订单发货成功!");
          this.queryAdminList();
          this.orderId="";
          this.trackingNumberVal="";
          return;
        }
        this.$toast.fail(response.data.msg);
      });
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
                this.queryAdminList();
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
              if (response.data.code === 200){
                this.$toast.success("删除成功!");
                this.queryAdminList();
                return;
              }
              this.$toast.fail(response.data.msg);
            });
          })
          .catch(() => {
            // on cancel
          });
    },
    //跳转到款式详情
    toStyleDetails(value) {
      this.$router.push({name: "styleStoreDetails", query: value})
    },
    clickImageItem: function (image) {
      ImagePreview([`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${image}`])
    },
    onClickLeft: function () {
      this.$router.replace({name: 'work'})
    },
    //复制文本
    copyTrackingNumber(text){
      let _this = this;
      _this.$copyText(text).then(function (e) {
        _this.$toast.success({message:'已复制快递单号', duration: 700});
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
.van-search{
  padding: 7px 12px ;
}
.imgParent{
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
  word-break:normal;
  width:auto;
  display:block;
  white-space:pre-wrap;
  word-wrap : break-word ;
  overflow: hidden ;
}
</style>