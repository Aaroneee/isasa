<template>
  <div>
    <baseNavBar title="档期详情"/>
    <van-cell-group>
    <van-cell style="font-size: 12px" v-for="item in clothesScheduleList" :key="item.id">
      <van-row>
        <van-col span="14">客户名:{{ item.customerName }}</van-col>
        <van-col span="10">婚期:{{ item.weddingDay }}</van-col>
      </van-row>
      <van-row>
        <van-col span="24">档期:{{' '+ item.scheduleDate }}</van-col>
      </van-row>
    </van-cell>
    </van-cell-group>
    <van-empty v-if="clothesScheduleList.length === 0" image="search" description="该婚纱下暂未查询到档期使用" />
  </div>

</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "clothesSchedule"
  , created() {
    this.clothesScheduleVO = this.$route.query
    this.queryClothesSchedules(this.clothesScheduleVO.clothesId)
  }
  , components: {
    baseNavBar
  }
  , data() {
    return {
      clothesScheduleVO: {},
      clothesScheduleList: []
    }
  },
  methods: {
    queryClothesSchedules: function (clothesId) {
      this.$axios({
        method: "GET",
        url: "/schedule/clothesSchedules",
        params: {
          clothesId: clothesId,
        }
      }).then(response => {
        this.clothesScheduleList = response.data.data
      })
    }
  }
}
</script>

<style scoped>

</style>
