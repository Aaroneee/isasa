<template>
  <div>
    <van-sticky>
      <base-nav-bar title="账户列表"/>
      <van-dropdown-menu>
        <van-dropdown-item v-model="shop" @change="shopChange"
                           :options="shopArray"/>
      </van-dropdown-menu>
    </van-sticky>
    <div style="background-color: #f7f8fa;">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          style="display: flex;flex-direction: column;align-items: center;padding: 2%;"
      >
        <van-cell style="font-size: 12px;margin: 2%;border-radius: 10px" v-for="item in tableData" :key="item.id">
          <van-row>
            <van-col span="12">户名：{{ item.accountName }}</van-col>
            <van-col span="12">所属店铺：{{ item.shopName }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">账户类型：{{ item.accountTypeName }}</van-col>
            <van-col span="12">结算账户：{{ item.settlementAccount }}</van-col>
          </van-row>
          <van-row>
            <van-col span="24">结算账号：{{ item.accountNumber }}</van-col>
          </van-row>
          <van-row>
            <van-col span="24">上次对账时间：{{ item.lastTime }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">已确认收款：{{ item.confirmProceeds }}</van-col>
            <van-col span="12">已确认支出：{{ item.confirmSpend }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">上次对账金额：{{ item.lastTimeAmount }}</van-col>
            <van-col span="12">期末结余：{{ item.closeBalance }}</van-col>
          </van-row>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>

import DateUtils from "@/common/js/utils/date-utils";
import BaseNavBar from "@/components/nav-bar/base-nav-bar.vue";

export default {
  name: "accountList",
  components: {
    BaseNavBar,
  },
  data() {
    return {
      loading: false,
      finished: false,
      tableData: [],
      tenantCrop: localStorage.getItem("tenantCrop"),

      shopArray: [{text: "店铺", value: ""}],
      shop: "",

    }
  },
  created() {
    this.queryAccountList();
    this.queryShopList();
  },
  methods: {
    // 查询
    queryAccountList() {
      this.$axios({
        method: 'GET',
        url: '/account/queryAccountByDeadline',
        params: {
          tenantCrop: localStorage.getItem('tenantCrop'),
          deadline: DateUtils.vantDateToYMD(new Date()) + " 23:59:59",
        }
      }).then(response => {
        this.loading = false;
        this.finished = true;
        if (response.data.code === 200) {
          if (this.shop){
            this.tableData = response.data.data.filter(item=>{
              return item.shopId===this.shop
            })
          }else {
            this.tableData = response.data.data
          }
        } else {
          this.$toast.fail(response.data.msg)
        }
      })
    },
    shopChange: function (value) {
      this.shop = value;
      this.queryAccountList();
    },
    //查询店铺
    queryShopList: function () {
      this.$selectUtils.queryShopIdsIsValid(this.$selectUtils.DropDownMenu).then(response => {
        this.shopArray.push(...JSON.parse(response.data.data));
      })
    },
  },

}
</script>

<style scoped>

</style>
