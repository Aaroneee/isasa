<template>
  <div>
    <base-nav-bar title="历史操作记录"/>
    <van-cell-group>
      <van-cell style="font-size: 12px" v-for="item in clothesOperations" :key="item.id">
        <van-row>
          <van-col span="12">经办人:{{ item.empName }}</van-col>
          <van-col span="12">行为:{{ item.operationName }}</van-col>
        </van-row>
        <van-row>
          <van-col span="12">目标店铺:{{' '+ item.localShopName }}</van-col>
          <van-col span="12">所在店铺:{{' '+ item.shopName }}</van-col>
        </van-row>
        <van-row>
          <van-col span="12">位置:{{item.positionName}}</van-col>
          <van-col span="12">操作日期:{{item.createDate}}</van-col>
        </van-row>
      </van-cell>
    </van-cell-group>
    <van-empty v-if="clothesOperations.length === 0" image="search" description="该婚纱暂未查询到历史操作" />
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "clothesOperationRecord",
  components: {
    baseNavBar
  },
  created() {
    console.log(this.clothes)
    this.queryClothesOperations();
  },
  data() {
    return {
      clothesOperations: [],
      tenantCrop: localStorage.getItem("tenantCrop"),
      clothes: this.$route.query
    }
  },
  methods: {
    queryClothesOperations: function () {
      this.$axios({
        method: "GET",
        url: "/clothesOperation/clothesOperationList",
        params: {
          tenantCrop: this.tenantCrop,
          clothesId: this.clothes.clothesId,
        }
      }).then(response => {
        this.clothesOperations = response.data.data.list
      })
    },
  }
}
</script>

<style scoped>

</style>