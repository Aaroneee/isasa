<template>
  <div>
    <!-- 顶部栏 -->
    <van-sticky>
      <baseNavBar title="婚纱撞档预警"/>
      <van-dropdown-menu>
        <van-dropdown-item v-model="shopId" :options="shopArray" @change="changeShop()"/>
      </van-dropdown-menu>
    </van-sticky>

    <!-- 显示撞档婚纱 -->
    <van-tabs :active="active" sticky offset-top="94">
      <van-tab title="订单撞档">
        <!-- 搜索提示 -->
        <van-empty image="search" description="暂无订单撞档" v-if="!scheduleOrderList"/>
        <van-grid :border="false" :column-num="2" :center="false" style="font-size: 12px" v-else>
          <van-grid-item @click="showPopup(item.clothesId, item.clothesName)" v-for="(item,index) in scheduleOrderList" :key="index">
            <van-image
                :src="item.styleImage"
                style="height: 80%;"/><br>
            <b>礼服：{{ item.clothesName }}</b>
            <b>店铺：{{ item.shopName }}</b>
            <b>位置：{{ item.positionName }}</b>
            <b style="color:red;">婚期：{{ item.weddingDay }}</b>
          </van-grid-item>
        </van-grid>
      </van-tab>

      <van-tab title="预约撞档">
        <!-- 搜索提示 -->
        <van-empty image="search" description="暂无预约撞档" v-if="!scheduleAppList"/>
        <van-grid :border="false" :column-num="2" :center="false" style="font-size: 12px" v-else>
          <van-grid-item @click="showPopup2(item.clothesId, item.clothesName)" v-for="(item,index) in scheduleAppList" :key="index">
            <van-image
                :src="item.styleImage"
                style="height: 80%;"/><br>
            <b>礼服：{{ item.clothesName }}</b>
            <b>店铺：{{ item.shopName }}</b>
            <b>位置：{{ item.positionName }}</b>
          </van-grid-item>
        </van-grid>
      </van-tab>
    </van-tabs>

    <!-- 订单档期弹窗 -->
    <van-popup
        v-model="showSchedule"
        position="bottom"
        style="height: 60%; background-color: #f6f7f9"
        closeable
        round>
      <van-row type="flex" justify="space-around" align="center" style="background-color: rgb(255,255,255); height: 50px; border-bottom: 2px solid #f6f7f9">
        {{ clothesNameForPopup }}详情
      </van-row>
      <van-grid
          :border="false"
          style="text-align: left; font-size: 12px; border-bottom: 2px solid #f6f7f9"
          :column-num="2"
          :center="false"
          v-for="(item,index) in clothesOrderList"
          :key="index">
        <van-grid-item>
          客户姓名：{{ item.customerName }}<br>
          签约人：{{ item.empName }}<br>
          档期：{{ item.scheduleDate }}
        </van-grid-item>
        <van-grid-item>
          预约城市：{{ item.shopName }}<br>
          <b style="color: red">婚期：{{ item.weddingDay }}</b>
        </van-grid-item>
      </van-grid>
    </van-popup>

    <!-- 预约档期弹窗 -->
    <van-popup
        v-model="showAppConflict"
        position="bottom"
        style="height: 60%; background-color: #f6f7f9"
        closeable
        round>
      <van-row type="flex" justify="space-around" align="center" style="background-color: rgb(255,255,255); height: 50px; border-bottom: 2px solid #f6f7f9">
        {{ clothesNameForPopup }}详情
      </van-row>
      <van-grid
          :border="false"
          style="text-align: left; font-size: 12px; border-bottom: 2px solid #f6f7f9"
          :column-num="2"
          :center="false"
          v-for="(item,index) in clothesAppList"
          :key="index">
        <van-grid-item>
          客户姓名：{{ item.customerName }}<br>
          档期：{{ item.scheduleDate }}
        </van-grid-item>
        <van-grid-item>
          预约城市：{{ item.shopName }}<br>
          签约人：{{ item.empName }}
        </van-grid-item>
      </van-grid>
    </van-popup>
  </div>

</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar";

export default {
  name: "clothes-bumper-alert",
  components: {
    baseNavBar
  },
  data() {
    return {
      shopArray: [{ text: '全国', value: "" }],
      shopId: "",
      active: 0,
      showSchedule: false,
      showAppConflict: false,
      scheduleOrderList: [],
      scheduleAppList: [],
      tenantCrop: localStorage.getItem("tenantCrop"),
      clothesNameForPopup: '',
      // 订单撞档详情
      clothesOrderList: [],
      // 预约撞档详情
      clothesAppList: [],
    }
  },
  created() {
    this.queryShop();
    this.queryScheduleOrderList();
    this.queryScheduleAppList();
  },
  methods: {
    queryShop: function () {
      this.$selectUtils.queryShopIds(this.$selectUtils.DropDownMenu).then(response => {
        this.shopArray.push(...JSON.parse(response.data.data));
      })
    },
    showPopup(clothesId, clothesName) {
      console.log(clothesId)
      this.queryClothesOrderConflict(clothesId);
      this.clothesNameForPopup = clothesName;
      this.showSchedule = true;
    },
    showPopup2(clothesId, clothesName) {
      this.queryClothesAppConflict(clothesId);
      this.clothesNameForPopup = clothesName;
      this.showAppConflict = true;
    },
    queryScheduleOrderList() {
      this.$axios({
        method: "GET",
        url: "/schedule/queryScheduleConflictList",
        params: {
          shopId: this.shopId,
          // 0是订单
          type: 0,
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        this.scheduleOrderList = response.data.data;
      })
    },
    queryScheduleAppList() {
      this.$axios({
        method: "GET",
        url: "/schedule/queryScheduleConflictList",
        params: {
          shopId: this.shopId,
          // 1是预约
          type: 1,
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        this.scheduleAppList = response.data.data;
      })
    },
    changeShop() {
      this.queryScheduleOrderList();
      this.queryScheduleAppList();
    },
    queryClothesOrderConflict(clothesId) {
      this.$axios({
        method: "GET",
        url: "/schedule/queryClothesOrderConflict",
        params: {
          shopId: this.shopId,
          clothesId: clothesId,
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        this.clothesOrderList = response.data.data;
      })
    },
    queryClothesAppConflict(clothesId) {
      this.$axios({
        method: "GET",
        url: "/schedule/queryClothesAppConflict",
        params: {
          shopId: this.shopId,
          clothesId: clothesId,
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        this.clothesAppList = response.data.data;
      })
    }
  },
}
</script>

<style scoped>

</style>