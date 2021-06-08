<template>
  <div>
    <van-sticky>
      <switchNavBar title="款式档期查询" :switchText="dateText" @flag="dateShow=true"/>
      <form action="javascript:return true">
      <van-search
          @search="searchStyleName"
          v-model="searchValue"
          placeholder="请输入婚纱编号"/>
      </form>
      <van-calendar safe-area-inset-bottom v-model="dateShowPicker" :min-date="minDate" :max-date="maxDate" @confirm="dateOnConfirm"/>
    </van-sticky>

    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了">
        <van-cell style="font-size: 12px" v-for="item in clothesScheduleVO" :key="item.id" @click="clickItem(item)"  is-link >
          <div v-show="dateText==='选择档期' ">
            <van-col span="12"> 客户名   :  {{ item.customerName }}</van-col>
            <van-col span="12">婚期:{{ item.weddingDay }}</van-col>
            <van-row>
              <van-col span="16">档期:{{ item.scheduleDate }}</van-col>
            </van-row>
          </div>
          <van-row>
          <van-col span="14">婚纱名称   :  {{ item.styleType + "-" + item.styleName + "-" + item.clothesSize + "-" + item.clothesNo }}</van-col>
          <van-col span="10">位置:{{ item.positionName }}</van-col>
          </van-row>
            <van-row>
            <van-col v-show="dateText!=='选择档期'" span="12">档期状态:{{ dateText === "选择档期"?"未选择":item.scheduleState }}</van-col>
          </van-row>
        </van-cell>
      </van-list>
    </div>
  </div>

</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar"

export default {
  name: "scheduleList"
  , components: {
    switchNavBar: switchNavBar,
  },
  data() {
    return {
      searchValue: "",
      dateShow: false,
      dateShowPicker:false,
      scheduleDate: "",
      dateText: "选择档期",

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

      loading: false,
      finished: true,
      clothesScheduleVO: [],
      tenantCrop: localStorage.getItem("tenantCrop"),
    }
  }
  , methods: {
    clickItem:function (value){
      this.$router.push({name:"clothesSchedule",query:value})
    },
    checkScheduleState: function () {
      this.$axios({
        method: "get",
        url: '/schedule/checkScheduleState',
        params: {
          styleName: this.searchValue,
          tenantCrop: this.tenantCrop,
          scheduleDate: this.scheduleDate
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.clothesScheduleVO = response.data.data
          this.finished = true;
        }
      })
    },
    dateOnConfirm: function (value) {
      const s = this.$dateUtils.vantDateToYMD(value);
      this.scheduleDate = s
      this.dateText = s
      this.dateShowPicker = false
      this.checkScheduleState()
    },
    searchStyleName: function (value) {
      this.searchValue = value
      this.checkScheduleState()
    }
  },beforeRouteLeave (to, from, next) {
    if (to.name === 'clothesSchedule') {
      this.$store.commit('setKeepAlive', ['scheduleList'])
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  },watch:{
    dateShow:function (newValue){
      console.log(newValue)
      if (this.clothesScheduleVO.length === 0){
        this.$toast.fail("请先查询款式")
        this.dateShow = false
      }else {
        this.dateShowPicker = true
        this.dateShow = false
      }
    }
  }
}
</script>

<style scoped>

</style>
