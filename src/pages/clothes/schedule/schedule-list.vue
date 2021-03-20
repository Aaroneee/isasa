<template>
  <div>

    <van-sticky>
      <switchNavBar title="档期查询" :switchText="dateText" @flag="dateShow=true"/>
      <van-search
          @search="queryClothesList"
          v-model="searchValue"
          placeholder="请输入婚纱编号"/>
      <van-calendar safe-area-inset-bottom v-model="dateShow" :min-date="new Date('2020/01/01')" :max-date="new Date('2022/01/01')"  @confirm="dateOnConfirm"/>
    </van-sticky>
  </div>

</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar"

export default {
  name: "schedule-list"
  , components: {
    switchNavBar: switchNavBar,
  },
  data(){
    return{
      searchValue:"",
      dateShow:false,
      scheduleDate:"",
      dateText:"选择档期"
    }
  }
  ,methods:{
    queryClothesList:function (value){
      console.log(value)
    },dateOnConfirm:function (value){
      const s = this.$dateUtils.vantDateToYMD(value);
      this.scheduleDate = s
      this.dateText = s
      this.dateShow = false
    }
  }
}
</script>

<style scoped>

</style>
