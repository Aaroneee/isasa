<template>
  <div>
    <van-sticky>
      <baseNavBar title="账户信息"/>
    </van-sticky>
    <div class="card">
      <div style="text-align: center;padding-top: 5%">
        <p style="font-size: 40px;font-weight: bolder">{{mathUtils.add(advanceCharge,cashPledge)}}</p>
        <p style="font-size: 20px;">总余额(元)</p>
      </div>
      <van-row style="text-align: center;margin-top: 7%">
        <van-col :span="12">
          <div >
            <p style="font-size: 25px;font-weight: bolder">{{advanceCharge}}</p>
            <p style="font-size: 15px;">预付款余额(元)</p>
          </div>
        </van-col>
        <van-col :span="12">
          <div>
            <p style="font-size: 25px;font-weight: bolder">{{cashPledge}}</p>
            <p style="font-size: 15px;">押金余额(元)</p>
          </div>
        </van-col>
      </van-row>

    </div>
  </div>
</template>

<script>

import baseNavBar from "@/components/nav-bar/base-nav-bar"
import mathUtils from "@/common/js/utils/math-utils";

export default {
  name: "account_info",
  computed: {
    mathUtils() {
      return mathUtils
    }
  },
  data() {
    return {
      tenantVO: {},
      tenantCrop: localStorage.getItem("tenantCrop"),
      advanceCharge:0,
      cashPledge:0,


    }
  },
  components: {
    baseNavBar
  },
  created() {
    this.queryAdvanceCharge();
    this.queryTenantBill();
  },
  watch: {},
  methods: {
    //查询公司信息
    queryAdvanceCharge() {
      this.$axios({
        method: "GET",
        url: "/tenant/queryTenantInfo",
        params: {
          tenantCrop: this.tenantCrop
        }
      }).then(response => {
        this.tenantVO=response.data.data;
        this.advanceCharge = response.data.data.advanceCharge;
        this.cashPledge = response.data.data.cashPledge;

      })
    },

    //查询公司信息
    queryTenantBill() {
      this.$axios({
        method: "GET",
        url: "/tenantBill/queryList",
        params: {
          tenantCrop: this.tenantCrop
        }
      }).then(response => {
        console.log(response)

      })
    },


  }
}
</script>

<style scoped>
.card {
  margin: 3% auto 0 auto;
  background-color: #6391d2;
  height: 180px;
  width: 90%;
  color: #ffffff;
  border-radius: 10px;
}

p{
  margin-block-start: 0px;
  margin-block-end: 0px;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
</style>
