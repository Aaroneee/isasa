<template>
  <div>
    <van-sticky >
      <base-nav-bar  title="收款列表" />
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
      >
        <van-cell style="font-size: 12px" v-for="item in tableData" :key="item.id">
          <van-row style="margin-bottom: 2%">
            <van-col span="8">户名:{{ item.accountName }}</van-col>
          </van-row>
          <van-row style="margin-bottom: 2%">
            <van-col span="8">结算账户:{{ item.settlementAccount }}</van-col>
          </van-row>
          <van-row style="margin-bottom: 2%">
            <van-col span="8">账户类型:{{ item.accountTypeName }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">结算账号:{{ item.accountNumber }}</van-col>
            <van-col span="12">所属店铺:{{ item.shopName }}</van-col>

          </van-row>
          <van-row>
            <van-col span="12">上次对账时间:{{ item.lastTime }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">上次对账金额:{{ item.lastTimeAmount }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">已确认收款:{{ item.confirmProceeds }}</van-col>
            <van-col span="8">已确认支出:{{ item.confirmSpend }}</van-col>
            <van-col span="8">期末结余:{{ item.closeBalance }}</van-col>
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
  components:{
    BaseNavBar,
  },
  data(){
    return{
      loading:false,
      finished:false,
      tableData:[],
      tenantCrop:localStorage.getItem("tenantCrop"),

    }
  },
  created() {
    this.queryAccountList();
  },
  methods:{
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
        this.loading=false;
        this.finished=true;
        if (response.data.code === 200) {
          this.tableData = response.data.data
        } else {
          this.$toast.fail(response.data.msg)
        }
      })
    },
  },

}
</script>

<style scoped>

</style>
