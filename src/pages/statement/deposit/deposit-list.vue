<template>
  <div>
    <van-sticky>
      <van-nav-bar
          :title="titleText"
          left-text="返回"
          left-arrow
          :fixed="false"
          :placeholder="true"
          @click-left="onClickLeft"
      />
      <form action="javascript:return true">
        <van-search
            @search="queryDepositList"
            v-model="searchValue"
            placeholder="请输入客户名"
        />
      </form>
      <van-field
          readonly
          clickable
          label="选择日期："
          :value="date"
          placeholder="选择日期"
          @click="showDate = true"
      />
      <van-calendar
          v-model="showDate"
          type="range"
          @confirm="dateOnConfirm"
          allow-same-day
          :min-date="minDate"
      />
      <van-dropdown-menu>
        <van-dropdown-item v-model="shopId" @change="shopNameChange"
                           :options="shopArray"/>
        <van-dropdown-item v-model="dressId" @change="dressChange"
                           :options="dressArray"/>
      </van-dropdown-menu>
      <van-tabs v-model="active" @click="typeChange">
        <van-tab title="未申请押金" :name="0"></van-tab>
        <van-tab title="已申请未退" :name="1"></van-tab>
        <van-tab title="已退押金" :name="2"></van-tab>
      </van-tabs>
    </van-sticky>
    <div>
      <van-cell>
        <van-col :span="24">
          {{ active === 0 ? '未申请' : active === 1 ? '已申请未退' : '已退' }}押金 总数：{{ count ? count : 0 }}
        </van-col>
        <van-col>
          {{ active === 0 ? '未申请' : active === 1 ? '已申请未退' : '已退' }}押金 总金额：{{ amount ? amount : 0 }}
        </van-col>
      </van-cell>
      <van-divider/>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
      >
        <van-cell style="font-size: 12px" v-for="item in depositList" :key="item.proceedsId">
          <van-row style="margin-bottom: 2%">
            <van-col span="12">客户姓名:{{ item.customerName }}</van-col>
            <van-col span="12" style="font-size: 15px">
              退押状态:
              <b style="color: red" v-if="item.type===0">未申请</b>
              <b style="color: #07c160" v-if="item.type===1">已申请</b>
              <b v-if="item.type===2">已退</b>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="12">收款方式:{{ item.paymentName }}</van-col>
            <van-col v-if="item.type===0" span="12">收款人:{{ item.payeeName }}</van-col>
            <van-col v-if="item.type===1" span="12">收款人:{{ item.payeeName }}</van-col>
            <van-col v-if="item.type===2" span="12">退款人:{{ item.payeeName }}</van-col>
          </van-row>

          <van-row>
            <van-col span="12">押金金额:{{ item.depositAmount }}</van-col>
            <van-col span="12">收款日期:{{ item.proceedsDate }}</van-col>
          </van-row>
          <van-row v-if="item.type=== 1|| item.type === 2" style="margin-top: 2%">
            <van-col span="12">退款目标:{{ item.refundTarget }}</van-col>
            <van-col span="12">退款账户:{{ item.targetAccount }}</van-col>
          </van-row>
          <van-row v-if="item.type=== 1">
            <van-col span="12">申请人:{{ item.petitioner }}</van-col>
            <van-col span="12">申请日期:{{ item.applyDate }}</van-col>
          </van-row>
          <van-row v-if="item.type=== 1|| item.type === 2">
            <van-col span="12">退款金额:{{ item.refundAmount }}</van-col>
            <van-col span="12">退款备注:{{ item.refundInfo }}</van-col>
          </van-row>
          <van-row v-if=" item.type === 2">
            <van-col span="12">退款方式:{{ item.refundPayment }}</van-col>
            <van-col span="12">退款日期:{{ item.createDate }}</van-col>
          </van-row>
          <van-row style="margin: 1px auto">
            <van-col :span="item.type ===0 ? 24 : 12" style="text-align: center">
              <van-button size="small" round @click="clickItem(item)">查看详情</van-button>
            </van-col>
            <van-col :span="12" style="text-align: center">
              <van-button size="small" round @click="copyRefundInfo(item)" v-if="item.type === 1|| item.type===2">复制信息
              </van-button>
            </van-col>
          </van-row>

        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import {abs} from "mathjs";

export default {
  name: "deposit-list",
  data() {
    return {
      titleText: "押金列表",
      active: 0,
      tenantCrop: localStorage.getItem("tenantCrop"),
      maxDate: this.$dateUtils.getMaxMinDate()[0],
      minDate: this.$dateUtils.getMaxMinDate()[1],
      searchValue: '',
      amount: 0,
      count: 0,
      typeArray: [
        {
          text: "押金类型",
          value: ""
        },
        {
          text: "未申请",
          value: "0"
        },
        {
          text: "已申请",
          value: "1"
        },
        {
          text: "已退",
          value: "2"
        }
      ],
      dressId: "",
      type: "",
      shopId: "",
      shopArray: [{text: "所有店铺", value: ""}],
      dressArray: [{text: "所有礼服师", value: ""}],

      showDate: false,
      loading: true,
      finished: false,
      date: "",
      depositList: []
    }
  },
  created() {
    this.date = this.formatDate(this.$dateUtils.getCurrentMonthFirstDay()) + " - " + this.formatDate(this.$dateUtils.getCurrentMonthLastDay())
    this.queryDress()
    this.queryShops()
    this.queryDepositList()
  },
  methods: {
    formatDate(date) {
      return `${date.getFullYear()}-${this.$dateUtils.dateIsSingle(date.getMonth() + 1)}-${this.$dateUtils.dateIsSingle(date.getDate())}`;
    },
    dateOnConfirm(date) {
      const [start, end] = date;
      this.showDate = false;
      this.date = this.formatDate(start) + ' - ' + this.formatDate(end);
      this.queryDepositList()
    },
    onClickLeft() {
      this.$router.push('statistic')
    },
    // 查询店铺
    queryShops() {
      this.$selectUtils.queryShopIds(this.$selectUtils.DropDownMenu).then(response => {
        this.shopArray.push(...JSON.parse(response.data.data))
      })
    },
    // 查询礼服师
    queryDress() {
      this.$selectUtils.queryDressIds(this.$selectUtils.DropDownMenu).then(response => {
        this.dressArray.push(...JSON.parse(response.data.data))
      })
    },
    // 查询押金列表
    queryDepositList() {
      this.$axios({
        method: 'get',
        url: '/refund/queryDepositList',
        params: {
          tenantCrop: this.tenantCrop,
          shopId: this.shopId,
          dressId: this.dressId,
          type: this.active,
          customerName: this.searchValue,
          date: this.date
        }
      }).then(response => {
        let data = response.data.data.list
        this.depositList = data
        this.amount = response.data.data.amount
        this.count = response.data.data.count
        this.loading = false
        this.finished = true
      })
    },
    // 押金类型改变
    typeChange() {
      this.queryDepositList()
    },
    // 店铺改变
    shopNameChange() {
      this.queryDepositList()
    },
    copyRefundInfo: function (item) {
      let _this = this;
      console.log("复制退押信息")
      let refundInfo = item.refundInfo === '' ? '无' : item.refundInfo
      let text = '客户 ' + item.refundTarget + ' 还件退押金 ' + item.refundAmount + '元 , ' + item.refundPayment + ' ' + item.targetAccount + item.targetAccount + ' (申请人' + item.petitioner + ' ) ' + '备注: ' + refundInfo
      _this.$copyText(text).then(function (e) {
        _this.$toast.success({message: '已复制复制退押信息', duration: 700});
      }, err => {
        _this.$toast.fail({message: '复制退押信复制失败,请重试', duration: 700});
      })
    },
    // 礼服师改变
    dressChange() {
      this.queryDepositList()
    },
    // 传参
    clickItem(item) {
      this.$router.push(`depositDetail/${item.type}/${item.proceedsId}/${item.orderId}`)
    }
  }
}
</script>

<style scoped>

</style>