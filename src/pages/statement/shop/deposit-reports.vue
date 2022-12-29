<template>
  <div>
    <van-sticky>
      <baseNavBar :title="titleText"/>
      <van-field
          readonly
          clickable
          label="日期："
          :value="date"
          placeholder="选择日期"
          @click="show = true"
      />
      <van-calendar
          v-model="show"
          type="range"
          @confirm="dateOnConfirm"
          allow-same-day
          :min-date="minDate"
      />

      <van-field
          readonly
          clickable
          label="店铺："
          :value="shopName"
          placeholder="选择店铺"
          @click="showShop = true"
      />
      <van-popup v-model="showShop" round position="bottom">
        <van-picker
            show-toolbar
            :columns="shopArray"
            @cancel="showShop = false"
            @confirm="shopOnConfirm"
            :loading="shopLoading"
        />
      </van-popup>
    </van-sticky>

    <div v-if="!loadingList">
      <br/><br/><br/>
      <van-loading color="#1989fa" vertical>加载中...</van-loading>
    </div>
    <van-collapse v-model="activeNames" v-else>
      <van-collapse-item title="已收押金" name="1" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="3">
          <van-grid-item>押金数<br/>{{ depositCount }}</van-grid-item>
          <van-grid-item>押金总金额<br/>{{ depositAmount }}</van-grid-item>
          <van-grid-item v-for="item in depositReceived" :key="item.depositItemName">
            {{item.depositItemName}}<br>{{item.depositItemAmount}}
          </van-grid-item>
        </van-grid>
      </van-collapse-item>
      <van-collapse-item title="已退押金" name="2" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="3">
          <van-grid-item>押金数<br/>{{ depositCountBack }}</van-grid-item>
          <van-grid-item>押金总金额<br/>{{ depositAmountBack }}</van-grid-item>
          <van-grid-item v-for="item in depositBack" :key="item.depositItemName">
            {{item.depositItemName}}<br>{{item.depositItemAmount}}
          </van-grid-item>
        </van-grid>
      </van-collapse-item>
      <van-collapse-item title="未退押金" name="3" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="3">
          <van-grid-item>押金数<br/>{{ depositCountNoBack }}</van-grid-item>
          <van-grid-item>押金总金额<br/>{{ depositAmountNoBack }}</van-grid-item>
          <van-grid-item v-for="item in depositNoBack" :key="item.depositItemName">
            {{item.depositItemName}}<br>{{item.depositItemAmount}}
          </van-grid-item>
        </van-grid>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar";
export default {
  name: "deposit-reports",
  components: {
    baseNavBar
  },
  created() {
    this.queryShop();
    this.queryDeposit();
  },
  data() {
    return {
      titleText: "押金分析",
      loadingList: true,
      tenantCrop: localStorage.getItem("tenantCrop"),
      // 起始日期(默认昨天)
      startDate: this.formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)),
      // 结束日期(默认今天)
      endDate: this.formatDate(new Date()),
      date: this.formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)) + ' - ' + this.formatDate(new Date()),
      show: false,
      // 可选择的最早日期
      minDate: new Date(2015, 0, 1),
      // 是否显示店铺下拉列表
      showShop: false,
      // 选择的店铺
      shopName: '',
      shopId: '',
      // 是否正在加载店铺
      shopLoading: false,
      // 店铺列表
      shopArray: [{text: "全国店铺", id: ""}],
      activeNames: ['1','2','3'],
      // 已收押金数
      depositCount: '',
      // 已收押金总金额
      depositAmount: '',
      // 已收各渠道押金金额
      depositReceived: [],
      // 已退押金数
      depositCountBack: '',
      // 已退押金总金额
      depositAmountBack: '',
      // 已退各渠道押金金额
      depositBack: [],
      // 未退押金数
      depositCountNoBack: '',
      // 未退押金总金额
      depositAmountNoBack: '',
      // 未退各渠道押金金额
      depositNoBack: [],

    }
  },
  methods: {
    formatDate(date) {
      return `${date.getFullYear()}-${this.$dateUtils.dateIsSingle(date.getMonth() + 1)}-${this.$dateUtils.dateIsSingle(date.getDate())}`;
    },
    dateOnConfirm(date) {
      this.loadingList = false;
      const [start, end] = date;
      this.show = false;
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
      this.date = this.startDate + ' - ' + this.endDate;
      this.queryDeposit();
    },
    shopOnConfirm(shop) {
      this.loadingList = false;
      this.shopName = shop.text;
      this.shopId = shop.id;
      this.showShop = false;
      this.queryDeposit();
    },
    queryShop: function () {
      this.$selectUtils.queryShopIds(this.$selectUtils.Picker).then(response => {
        this.shopArray.push(...JSON.parse(response.data.data));
      })
    },
    queryDepositReceived() {
      this.$axios({
        method: "GET",
        url: "/shopReports/queryDepositReceived",
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          tenantCrop: this.tenantCrop,
          shopId: this.shopId
        }
      }).then(response => {
        this.depositCount = response.data.data.depositCount;
        this.depositAmount = response.data.data.depositAmount;
        this.depositReceived = response.data.data.depositItem;
      })
    },
    queryDepositBack() {
      this.$axios({
        method: "GET",
        url: "/shopReports/queryDepositBack",
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          tenantCrop: this.tenantCrop,
          shopId: this.shopId
        }
      }).then(response => {
        this.depositCountBack = response.data.data.depositCount;
        this.depositAmountBack = response.data.data.depositAmount;
        this.depositBack = response.data.data.depositItem;
      })
    },
    queryDepositNoBack() {
      this.$axios({
        method: "GET",
        url: "/shopReports/queryDepositNoBack",
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          tenantCrop: this.tenantCrop,
          shopId: this.shopId
        }
      }).then(response => {
        this.depositCountNoBack = response.data.data.depositCount;
        this.depositAmountNoBack = response.data.data.depositAmount;
        this.depositNoBack = response.data.data.depositItem;
      })
    },
    queryDeposit() {
      this.queryDepositReceived();
      this.queryDepositBack();
      this.queryDepositNoBack();
      this.loadingList = true;
    }
  }
}
</script>

<style scoped>

</style>