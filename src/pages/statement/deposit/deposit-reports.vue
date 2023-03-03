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
          <van-grid-item
              @click="showDepositDetails('已收押金')">押金总金额<br/>{{ depositAmount }}</van-grid-item>
          <van-grid-item
              v-for="item in depositReceived"
              :key="item.depositItemName"
              @click="showDepositDetails('已收押金', item.paymentId)">
            {{item.depositItemName}}<br>{{item.depositItemAmount}}
          </van-grid-item>
        </van-grid>
      </van-collapse-item>

      <van-collapse-item title="已退押金" name="2" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="3">
          <van-grid-item>押金数<br/>{{ depositCountBack }}</van-grid-item>
          <van-grid-item @click="showDepositDetails('已退押金')">押金总金额<br/>{{ depositAmountBack }}</van-grid-item>
          <van-grid-item
              v-for="item in depositBack"
              :key="item.depositItemName"
              @click="showDepositDetails('已退押金', item.paymentId)">
            {{item.depositItemName}}<br>{{item.depositItemAmount}}
          </van-grid-item>
        </van-grid>
      </van-collapse-item>

      <van-collapse-item title="未退押金" name="3" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="3">
          <van-grid-item>押金数<br/>{{ depositCountNoBack }}</van-grid-item>
          <van-grid-item @click="showDepositDetails('未退押金')">押金总金额<br/>{{ depositAmountNoBack }}</van-grid-item>
          <van-grid-item
              v-for="item in depositNoBack"
              :key="item.depositItemName"
              @click="showDepositDetails('未退押金', item.paymentId)">
            {{item.depositItemName}}<br>{{item.depositItemAmount}}
          </van-grid-item>
        </van-grid>
      </van-collapse-item>

      <van-collapse-item title="已申请未退押金" name="4" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="3">
          <van-grid-item>已申请未退数<br/>{{ depositCountApplyNoBack }}</van-grid-item>
          <van-grid-item @click="showDepositDetails('已申请未退押金')">已申请未退金额<br/>{{ depositAmountApplyNoBack }}</van-grid-item>
          <van-grid-item
              v-for="item in depositApplyNoBack"
              :key="item.depositItemName"
              @click="showDepositDetails('已申请未退押金', item.depositItemName)">
            {{item.depositItemName}}<br>{{item.depositItemAmount}}
          </van-grid-item>
        </van-grid>
      </van-collapse-item>

    </van-collapse>

    <!-- 已收、未退押金详情 -->
    <van-popup
        v-model="showDepositDetail"
        closeable
        position="bottom"
        close-icon-position="top-right"
        style="height: 60%; background-color: rgba(255,255,255,0.9) "
        round>
      <van-row type="flex" justify="space-around" align="center" style="background-color: rgb(255,255,255); height: 12%">
        {{ depositDetailName }}详情
      </van-row>
      <br>
      <van-row
          type="flex"
          justify="center"
          v-for="(item,index) in depositDetails"
          :name="index"
          :key="index">
          <van-grid
              :border="false"
              style="text-align: left; font-size: 12px; width: 90%" :column-num="2"
              :center="false"
          >
            <van-grid-item>
              收款方式：{{ item.paymentName }}<br>
              客户名：{{ item.customerName }}<br>
              订单编号：{{ item.orderNo }}<br>
              日期：{{ item.createDate }}
            </van-grid-item>
            <van-grid-item>
              收款人：{{ item.payeeName }}<br>
              <b>押金数：{{ item.depositAmount }}</b><br>
              <a style="color: deepskyblue" @click="showDepositCollectionPictures(item.proceedsId)">查看收押图片</a>
            </van-grid-item>
            <hr>
          </van-grid>
      </van-row>
    </van-popup>

    <!-- 已退押金详情 -->
    <van-popup
        v-model="showDepositBackDetail"
        closeable
        position="bottom"
        close-icon-position="top-right"
        style="height: 60%; background-color: rgba(255,255,255,0.9) "
        round>
      <van-row type="flex" justify="space-around" align="center" style="background-color: rgb(255,255,255); height: 12%">
        {{ depositDetailName }}详情
      </van-row>
      <br>
      <van-row type="flex" justify="center">
        <van-collapse v-model="activeDepositDetail" :border="false" style="width: 90%">
          <van-collapse-item v-for="(item,index) in depositDetails" :name="index" :key="index">
            <template #title>
              <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
                <van-grid-item>
                  退款方式：{{ item.refundPayment }}<br>
                  客户名：{{ item.customerName }}
                </van-grid-item>
                <van-grid-item>
                  退款人：{{ item.payeeName }}<br>
                  <b>退款金额：{{ item.refundAmount }}</b>
                </van-grid-item>
              </van-grid>
            </template>
            <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
              <van-grid-item>
                客户名：{{ item.customerName }}<br>
                订单编号：{{ item.orderNo }}<br>
                押金数：{{ item.depositAmount }}<br>
                退款方式：{{ item.refundPayment }}<br>
                退款目标账户：{{ item.targetAccount }}
              </van-grid-item>
              <van-grid-item>
                退款人：{{ item.payeeName }}<br>
                退款金额：{{ item.refundAmount }}<br>
                退款目标：{{ item.refundTarget }}<br>
                退款日期：{{ item.createDate }}<br>
                <a style="color: deepskyblue" @click="showDepositCollectionPictures(item.proceedsId)">查看收押图片</a>
                <a style="color: deepskyblue" @click="showDepositBackPictures(item.refundId)">查看退押图片</a>
              </van-grid-item>
            </van-grid>
          </van-collapse-item>
        </van-collapse>
      </van-row>
    </van-popup>

    <!-- 已申请未退押金详情 -->
    <van-popup
        v-model="showDepositApplyNoBackDetail"
        closeable
        position="bottom"
        close-icon-position="top-right"
        style="height: 60%; background-color: rgba(255,255,255,0.9) "
        round>
      <van-row type="flex" justify="space-around" align="center" style="background-color: rgb(255,255,255); height: 12%">
        {{ depositDetailName }}详情
      </van-row>
      <br>
      <van-row type="flex" justify="center">
        <van-collapse v-model="activeDepositDetail" :border="false" style="width: 90%">
          <van-collapse-item v-for="(item,index) in depositDetails" :name="index" :key="index">
            <template #title>
              <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
                <van-grid-item>
                  客户名：{{ item.customerName }}<br>
                  退款方式：{{ item.refundMethod }}
                </van-grid-item>
                <van-grid-item>
                  申请人：{{ item.petitioner }}<br>
                  <b>退款金额：{{ item.refundAmount }}</b>
                </van-grid-item>
              </van-grid>
            </template>
            <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
              <van-grid-item>
                客户名：{{ item.customerName }}<br>
                退款方式：{{ item.refundMethod }}<br>
                退款目标账户名：{{ item.refundTarget }}<br>
                退款备注：{{ item.refundInfo === "" ? "无" : item.refundInfo }}<br>
                退款目标账户：{{ item.targetAccount }}
              </van-grid-item>
              <van-grid-item>
                申请人：{{ item.petitioner }}<br>
                申请时间：{{ item.createDate }}<br>
                所属店铺：{{ item.shopName }}<br>
                退款金额：{{ item.refundAmount }}<br>
                押金收款人：{{ item.payeeName }}<br>
                <a style="color: deepskyblue" @click="showDepositCollectionPictures(item.proceedsId)">查看收押图片</a>
              </van-grid-item>
            </van-grid>
          </van-collapse-item>
        </van-collapse>
      </van-row>
    </van-popup>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar";
import { ImagePreview } from "vant";
import { Notify } from "vant";

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
      activeNames: ['1','2','3', '4'],
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
      // 是否显示已收押金
      showDepositDetail: false,
      // 押金名称
      depositDetailName: '',
      // 是否展开单个押金详情
      activeDepositDetail: [],
      // 已收和未退押金详情
      depositDetails: [],
      // 是否显示已退押金详情
      showDepositBackDetail: false,
      // 是否显示已申请未退押金详情
      showDepositApplyNoBackDetail: false,
      // 已申请未退款各渠道金额
      depositApplyNoBack: [],
      // 已申请未退款数
      depositCountApplyNoBack: '',
      // 已申请未退款总金额
      depositAmountApplyNoBack: '',
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
        this.shopName="全国店铺"
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
      this.queryDepositApplyNoBack();
      this.loadingList = true;
    },
    queryDepositReceivedDetail(paymentId) {
      this.$axios({
        method: "GET",
        url: "/shopReports/queryDepositDetails",
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          tenantCrop: this.tenantCrop,
          shopId: this.shopId,
          paymentId: paymentId
        }
      }).then(response => {
        this.depositDetails = response.data.data;
      })
    },
    queryDepositNoBackDetail(paymentId) {
      this.$axios({
        method: "GET",
        url: "/shopReports/queryDepositNoBackDetails",
        params: {
          tenantCrop: this.tenantCrop,
          shopId: this.shopId,
          paymentId: paymentId
        }
      }).then(response => {
        this.depositDetails = response.data.data;
      })
    },
    showDepositDetails(depositName ,paymentId) {
      this.activeDepositDetail = [];
      if (depositName === '已收押金') {
        this.depositDetailName = depositName;
        this.queryDepositReceivedDetail(paymentId);
        this.showDepositDetail = true;
      } else if (depositName === '已退押金') {
        this.depositDetailName = depositName;
        this.queryDepositBackDetail(paymentId);
        this.showDepositBackDetail = true;
      } else if (depositName === '未退押金') {
        this.depositDetailName = depositName;
        this.queryDepositNoBackDetail(paymentId);
        this.showDepositDetail = true;
      } else if (depositName === '已申请未退押金') {
        this.depositDetailName = depositName;
        this.queryDepositApplyNoBackDetails(paymentId);
        this.showDepositApplyNoBackDetail = true;
      }
    },
    queryDepositBackDetail(paymentId) {
      this.$axios({
        method: "GET",
        url: "/shopReports/queryDepositBackDetails",
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          tenantCrop: this.tenantCrop,
          shopId: this.shopId,
          paymentId: paymentId
        }
      }).then(response => {
        this.depositDetails = response.data.data;
      })
    },
    queryDepositApplyNoBack() {
      this.$axios({
        method: "GET",
        url: "/shopReports/queryDepositApplyNoBack",
        params: {
          tenantCrop: this.tenantCrop,
          shopId: this.shopId
        }
      }).then(response => {
        this.depositCountApplyNoBack = response.data.data.depositCount;
        this.depositAmountApplyNoBack = response.data.data.depositAmount;
        this.depositApplyNoBack = response.data.data.depositItem;
      })
    },
    queryDepositApplyNoBackDetails(refundMethod) {
      this.$axios({
        method: "GET",
        url: "/shopReports/queryDepositApplyNoBackDetails",
        params: {
          tenantCrop: this.tenantCrop,
          shopId: this.shopId,
          refundMethod: refundMethod
        }
      }).then(response => {
        this.depositDetails = response.data.data;
      })
    },
    showDepositCollectionPictures(proceedsId) {
      if (proceedsId === '' || proceedsId === undefined) {
        Notify("当前未设置收押图")
        return false
      }
      this.$axios({
        method: "GET",
        url: "/shopReports/queryDepositCollectionPictures",
        params: {
          tenantCrop: this.tenantCrop,
          proceedsId: proceedsId
        }
      }).then(response => {
        if (response.data.data.length === 0) {
          Notify("当前未设置收押图")
          return false
        }
        ImagePreview(response.data.data)
      })
    },
    showDepositBackPictures(refundId) {
      if (refundId === '' || refundId === undefined) {
        Notify("当前未设置退押图")
        return false
      }
      this.$axios({
        method: "GET",
        url: "/shopReports/queryDepositBackPictures",
        params: {
          tenantCrop: this.tenantCrop,
          refundId: refundId
        }
      }).then(response => {
        if (response.data.data.length === 0) {
          Notify("当前未设置退押图")
          return false
        }
        ImagePreview(response.data.data)
      })
    }
  }
}
</script>

<style scoped>

</style>
