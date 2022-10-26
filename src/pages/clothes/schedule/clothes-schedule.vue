<template>
  <div>
    <switchNavBar title="档期详情" :switch-text="historyShow?'隐藏历史档期':'显示历史档期'" @flag="changeShowHistory"/>
    <van-divider :style="{ color: '#000000', borderColor: '#000000', padding: '0 16px' }">
      今天及将来档期
    </van-divider>
    <van-cell-group>
    <van-cell style="font-size: 12px" v-for="item in forwardScheduleList" :key="item.id">
      <van-row>
        <van-col span="14">客户名:{{ item.customerName }}</van-col>
        <van-col span="10">婚期:{{ item.weddingDay }}</van-col>
      </van-row>
      <van-row>
        <van-col span="24">档期:{{' '+ item.scheduleDate }}</van-col>
      </van-row>
    </van-cell>
    </van-cell-group>
    <van-empty v-if="forwardScheduleList.length === 0" image-size="50" image="search" description="该婚纱下暂无未来档期" />
      <van-divider :style="{ color: '#000000', borderColor: '#000000', padding: '0 16px' }"
      v-show="historyShow">
        历史档期
      </van-divider>
    <van-cell-group v-show="historyShow">
      <van-cell style="font-size: 12px" v-for="item in historyScheduleList" :key="item.id">
        <van-row>
          <van-col span="14">客户名:{{ item.customerName }}</van-col>
          <van-col span="10">婚期:{{ item.weddingDay }}</van-col>
        </van-row>
        <van-row>
          <van-col span="24">档期:{{' '+ item.scheduleDate }}</van-col>
        </van-row>
      </van-cell>
    </van-cell-group>
    <van-empty v-if="historyScheduleList.length === 0" v-show="historyShow" image-size="50" image="search" description="该婚纱下暂无历史档期" />
  </div>

</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar"

export default {
  name: "clothesSchedule"
  , created() {
    this.clothesScheduleVO = this.$route.query
    this.queryClothesForwardSchedules(this.clothesScheduleVO.clothesId)
    this.queryClothesHistorySchedules(this.clothesScheduleVO.clothesId)
  }
  , components: {
    switchNavBar: switchNavBar,
  }
  , data() {
    return {
      clothesScheduleVO: {},
      historyText: "显示历史档期",
      historyShow: false,
      loading: false,
      finished: true,
      forwardScheduleList: [],
      historyScheduleList: [],
    }
  },
  methods: {
    changeShowHistory: function (){
      this.historyShow = !this.historyShow
    },
    queryClothesHistorySchedules: function (clothesId) {
      this.$axios({
        method: "GET",
        url: "/schedule/clothesHistorySchedules",
        params: {
          clothesId: clothesId,
        }
      }).then(response => {
        this.historyScheduleList = response.data.data
      })
    },
    queryClothesForwardSchedules: function (clothesId) {
      this.$axios({
        method: "GET",
        url: "/schedule/clothesForwardSchedules",
        params: {
          clothesId: clothesId,
        }
      }).then(response => {
        this.forwardScheduleList = response.data.data
      })
    },
  },
}
</script>

<style scoped>

</style>
