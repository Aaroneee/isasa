<template>
  <div>
    <van-sticky>
      <van-nav-bar
          :title="'款式订单'"
          left-text="返回"
          left-arrow
          :fixed="true"
          :placeholder="true"
          @click-left="onClickLeft"
      />
      <van-row>
        <van-col :span="12">
          <van-search
              v-model="tenantName"
              show-action
              placeholder="请输入搜索关键词"
          >
            <template #action>
              <div @click="queryAdminList()">搜索</div>
            </template>
          </van-search>
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
          </van-row>
        </template>
        <div class="cardParent">
          <p>订单编号: {{ item.orderNo }}</p>
          <p>下单日期: {{ item.createDate }}</p>
          <p>订单总价: {{ item.totalAmount }}</p>
          <div class="card" v-for="(childItem,childIndex) in item.storeOrderStyleVOS" :key="childIndex">
            <van-row gutter="10">
              <van-col :span="10">
                <div>
                  <van-image class="style-img" radius="7"
                             @click="clickImageItem(childItem.mainImage)"
                             fit="contain"
                             :src="item.styleImage===''?'null'
                               :'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+childItem.mainImage+'?imageMogr2/rquality/60'">
                    <template v-slot:error>加载失败,请更换主图</template>
                  </van-image>
                </div>
              </van-col>
              <van-col :span="14" @click="toStyleDetails({id:childItem.storeStyleId})">
                <van-row><p :style="{color: getOrderStateText(childItem.styleState)[1]}">款式状态 :
                  {{ getOrderStateText(childItem.styleState)[0] }}</p></van-row>
                <van-row><p>品牌 : {{ childItem.storeBrandName }}</p></van-row>
                <van-row><p>类型 : {{ childItem.storeTypeName }}</p></van-row>
                <van-row><p>系列 : {{ childItem.storeSeriesName }}</p></van-row>
                <van-row><p>系列编号 : {{ childItem.storeSeriesNum }}</p></van-row>
                <van-row><p>单价 : {{ childItem.unitPrice }}</p></van-row>
                <van-row><p>数量 : {{ childItem.styleNum }}</p></van-row>
                <van-row><p>总金额 : {{ childItem.amount }}</p></van-row>
              </van-col>
            </van-row>
          </div>
          <van-row :gutter="5">
            <van-col v-if="item.orderState===1" :span="6" style="text-align: center">
              <van-button
                  style="border-radius: 10px;background-color: #a0e05b;border-color: #a0e05b;width: 100%;height: 35px;font-size: 13px"
                  @click="(()=>{openTrackingNumberState=true;orderId=item.id})">一键发货
              </van-button>
            </van-col>
            <van-col v-if="item.orderState===1" :span="6" style="text-align: center">
              <van-button
                  style="border-radius: 10px;background-color: #e0ba5b;border-color: #e0ba5b;width: 100%;height: 35px;font-size: 13px"
                  @click="cancelOrder('取消并退款',item.id)">取消并退款
              </van-button>
            </van-col>
            <van-col v-if="item.orderState===0" :span="6" style="text-align: center">
              <van-button
                  style="border-radius: 10px;background-color: #e0e05b;border-color: #e0e05b;width: 100%;height: 35px;font-size: 13px"
                  @click="cancelOrder('取消订单',item.id)">取消订单
              </van-button>
            </van-col>
            <van-col v-if="[3,4].includes(item.orderState)" :span="6" style="text-align: center">
              <van-button
                  style="border-radius: 10px;background-color: #da1212;border-color: #da1212;width: 100%;height: 35px;font-size: 13px"
                  @click="delByOrderId(item.id)">删除订单
              </van-button>
            </van-col>
          </van-row>
        </div>

      </van-collapse-item>
    </van-collapse>
    <van-dialog v-model="openTrackingNumberState" title="快递单号" show-cancel-button @confirm="inputTrackingNumber">
      <van-field v-model="trackingNumberVal" placeholder="请输入快递单号"/>
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
    //获取订单显示文本
    getOrderStateText(orderState) {
      switch (orderState) {
        case 0:
          return ["待付款", "#FFA500FF"];
        case 1:
          return ["待发货", "#be7c00"];
        case 2:
          return ["已发货", "#187e18"];
        case 3:
          return ["已退款", "#e02e2e"];
        case 4:
          return ["已取消", "#ec7878"];
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

p {
  font-size: 14px;
  margin: 0 0 2% 0;
  color: #000000;
}

.delete-button {
  height: 100%;
}

.van-loading--spinner {
  text-align: center;
}
</style>