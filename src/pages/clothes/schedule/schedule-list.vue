<template>
  <div>
    <van-sticky>
      <switchNavBar title="档期查询" :switchText="dateText" @flag="dateShow=true"/>
      <form action="javascript:return true">
      <van-search
          @search="searchStyleName"
          v-model="searchValue"
          placeholder="请输入婚纱编号"/>
      </form>
      <van-calendar safe-area-inset-bottom v-model="dateShow" :min-date="new Date('2020/01/01')"
                    :max-date="new Date('2022/01/01')" @confirm="dateOnConfirm"/>
    </van-sticky>

    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了">
        <van-cell style="font-size: 12px" v-for="item in clothesScheduleVO" :key="item.id" @click="clickItem(item)"  is-link >
          <p>婚纱名称   :  {{ item.styleType + "-" + item.styleName + "-" + item.clothesSize + "-" + item.clothesNo }}</p>
          <van-row>
            <van-col span="12">目前位置:{{ item.positionName }}</van-col>
            <van-col span="12">档期状态:{{ dateText === "选择档期"?"未选择":item.scheduleState }}</van-col>
          </van-row>
        </van-cell>
      </van-list>
    </div>
  </div>

</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar"

export default {
  name: "schedule-list"
  , components: {
    switchNavBar: switchNavBar,
  },
  data() {
    return {
      searchValue: "",
      dateShow: false,
      scheduleDate: "",
      dateText: "选择档期",

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
    }, dateOnConfirm: function (value) {
      const s = this.$dateUtils.vantDateToYMD(value);
      this.scheduleDate = s
      this.dateText = s
      this.dateShow = false
      this.checkScheduleState()
    }, searchStyleName: function (value) {
      this.searchValue = value
      this.checkScheduleState()
    }
  }, beforeRouteLeave (to, from, next) {
    // 从列表页去到别的页面，如果不是判断页面，则不缓存列表页
    this.$route.meta.keepAlive = to.name === 'clothesSchedule';
    next()
  }
}
</script>

<style scoped>

</style>
