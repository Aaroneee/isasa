<template>
  <div>
    <baseNavBar title="账户信息" />
    <div class="card">

    </div>
  </div>
</template>

<script>

import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "account_info",
  data() {
    return {
      tenantVO:{},
      tenantCrop: localStorage.getItem("tenantCrop"),

    }
  },
  components: {
    baseNavBar
  },
  created() {

  },
  watch:{

  },
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
        this.advanceCharge = response.data.data.advanceCharge;
        this.styleDiscountRatio = response.data.data.styleDiscountRatio;
        this.getCountPrice();
      })
    },


  }
}
</script>

<style scoped>
.card{
  margin: 3% auto 0 auto;
  background-color: #1AA090;
  height: 200px;
  width: 90%;

  border-radius: 10px;
}
</style>
