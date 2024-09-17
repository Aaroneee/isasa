<template>
  <div>
    <van-sticky>
      <base-nav-bar title="账户列表"/>
<!--      <van-dropdown-menu>-->
<!--        <van-dropdown-item v-model="shop" @change="shopChange"-->
<!--                           :options="shopArray"/>-->
<!--      </van-dropdown-menu>-->
    </van-sticky>
    <div style="background-color: #f7f8fa;">
      <van-collapse v-model="collapseActive">
        <van-collapse-item  :name="index" v-for="(item,index) in tableData" :key="index">
          <template #title>
            <div>
              <span>{{item.accountTypeName}} </span>
            </div>
          </template>
          <template #value>
            <div>
              <p>上次对账金额：{{ item.lastTimeAmount }}</p>
              <p>期末结余：{{item.closeBalance}}</p>
            </div>
          </template>

          <van-cell style="font-size: 12px;margin: 2%;border-radius: 10px" v-for="itemChild in item.children" :key="itemChild.id">
            <van-row>
              <van-col span="12">户名：{{ itemChild.accountName }}</van-col>
              <van-col span="12">所属店铺：{{ itemChild.shopName }}</van-col>
            </van-row>
            <van-row>
              <van-col span="12">账户类型：{{ itemChild.accountTypeName }}</van-col>
              <van-col span="12">结算账户：{{ itemChild.settlementAccount }}</van-col>
            </van-row>
            <van-row>
              <van-col span="24">结算账号：{{ itemChild.accountNumber }}</van-col>
            </van-row>
            <van-row>
              <van-col span="24">上次对账时间：{{ itemChild.lastTime }}</van-col>
            </van-row>
            <van-row>
              <van-col span="12">已确认收款：{{ itemChild.confirmProceeds }}</van-col>
              <van-col span="12">已确认支出：{{ itemChild.confirmSpend }}</van-col>
            </van-row>
            <van-row>
              <van-col span="12">上次对账金额：{{ itemChild.lastTimeAmount }}</van-col>
              <van-col span="12">期末结余：{{ itemChild.closeBalance }}</van-col>
            </van-row>
          </van-cell>
        </van-collapse-item>
      </van-collapse>
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
      collapseActive:[],
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
        url: '/account/queryAccountByDeadlineTree',
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
            console.log(response.data.data)
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
.van-collapse >>> .van-cell{
  align-items: center
}
p {
  display: block;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  unicode-bidi: isolate;
}
</style>
