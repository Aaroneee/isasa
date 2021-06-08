<template>
  <div>
    <van-sticky>
      <switchNavBar :title="titleText" switchText="到店日期" @flag="createDateShow=true"/>
      <div style="z-index: 999;position: absolute;width: 70%;
      left:0; right:0; top:12px;margin: auto">
        <div style="text-align: center;">
          <van-icon name="arrow-left" size="20" color="#1989fa" @click="dayBefore()"/>
          <div style="display: inline-block;width:60%"></div>
          <van-icon name="arrow" size="20" color="#1989fa" @click="nextDay()"/>
        </div>
      </div>
      <form action="javascript:return true">
      <van-search
          @search="queryAppList"
          v-model="searchValue"
          placeholder="请输入搜索关键词"/>
      </form>
      <van-calendar v-model="createDateShow" :min-date="minDate" :max-date="maxDate" @confirm="createDateOnConfirm"/>
      <van-dropdown-menu>
        <van-dropdown-item v-model="appointName" @change="appointNameChange"
                           :options="appointNameArray"/>
        <van-dropdown-item v-model="inviter" @change="inviterChange" :options="inviterArray"/>
        <van-dropdown-item v-model="appointDress" @change="appointDressChange"
                           :options="appointDressArray"/>
        <van-dropdown-item v-model="appointShop" @change="appointShopChange"
                           :options="appointShopArray"/>
      </van-dropdown-menu>
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
      >
        <van-cell style="font-size: 12px" v-for="item in appointList" :key="item.id" @click="clickItem(item.id)">
          <van-row  style="padding-bottom: 5px">
            <van-col style="color: #39a9ed;font-size: 15px" span="12">预约档期:{{ item.appointTime }}</van-col>
            <van-col style="color: coral;font-size: 15px" span="12">客资状态:{{ item.stateName }}</van-col>
          </van-row>
          <van-row >
            <van-col  span="12">婚期:{{ item.weddingDay }}</van-col>
            <van-col span="12" v-if="item.isValid === '1'" style="color: coral">已预约</van-col>
            <van-col span="12" v-if="item.isValid === '2'" style="color: mediumseagreen">已到店</van-col>
            <van-col span="12" v-if="item.isValid ==='3'" style="color: red">预约已取消</van-col>
          </van-row>
          <van-row >
            <van-col span="12">姓名:{{ item.name }}</van-col>
            <van-col span="12">手机号:{{item.phone}}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">来源:{{ item.sourceName }}</van-col>
            <van-col span="12">预约项目:{{ item.appointName }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">城市:{{ item.appointCity }}</van-col>
            <van-col span="12">店铺:{{ item.appointShop }}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">预约人:{{ item.inviter }}</van-col>
            <van-col span="8">礼服师:{{ item.appointDress }}</van-col>
            <van-col span="8">化妆师:{{ item.appointCosmetics }}</van-col>
          </van-row>
          <van-row>
            <van-col span="24">备注:{{ item.appointRemark }}</van-col>
          </van-row>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import switchNavBar from '@/components/nav-bar/switch-nav-bar'

export default {
  name: "appScheduleList",
  data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      appointList: [],
      searchValue: "",
      loading: false,
      finished: false,

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

      titleText: this.$dateUtils.vantDateToYMD(new Date()) +' ' + this.$dateUtils.getweekday(new Date()),
      createDateShow: false,
      appointNameArray: [{text: "项目", value: ""}],
      inviterArray: [{text: "预约人", value: ""}],
      appointDressArray: [{text: "礼服师", value: ""}],
      appointShopArray: [{text: "店铺", value: ""}],

      appointDate: this.$dateUtils.vantDateToYMD(new Date()),
      appointName: "",
      inviter: "",
      appointDress: "",
      appointShop: "",
      state: "",
    }
  },
  components: {
    switchNavBar: switchNavBar,
  },
  created() {
    this.queryAppList();
    this.queryAppointName();
    this.queryInviter();
    this.queryAppointDress();
    this.queryAppointShop();
  },
  methods: {
    //日历确认
    createDateOnConfirm: function (time) {
      this.appointDate = this.$dateUtils.vantDateToYMD(time);
      this.titleText = this.$dateUtils.vantDateToYMD(time)  +' ' + this.$dateUtils.getweekday(time);
      this.queryAppList();
      this.createDateShow = false;
    },
    inviterChange: function (value) {
      this.inviter = value;
      this.queryAppList();
    },
    appointNameChange: function (value) {
      this.appointName = value;
      this.queryAppList();
    },
    appointDressChange: function (value) {
      this.appointDress = value;
      this.queryAppList();
    },
    appointShopChange: function (value) {
      this.appointShop = value;
      this.queryAppList();
    },
    clickItem: function (id) {
      this.$router.push({name: "appDetails", query: {id: id,pageSource:'appScheduleList'}})
    },
    //前一天
    dayBefore:function (){
      //获取顶部当前日期
      let date=new Date(this.appointDate);
      date.setDate(date.getDate()-1);
      //日期格式化后字符串
      let dateStr=this.$dateUtils.vantDateToYMD(date);
      this.appointDate=dateStr;
      this.titleText=dateStr+' '+this.$dateUtils.getweekday(date)
      this.queryAppList();
    },
    //后一天
    nextDay :function (){
      //获取顶部当前日期
      let date=new Date(this.appointDate);
      date.setDate(date.getDate()+1);
      //日期格式化后字符串
      let dateStr=this.$dateUtils.vantDateToYMD(date);
      this.appointDate=dateStr;
      this.titleText=dateStr+' '+this.$dateUtils.getweekday(date)
      this.queryAppList();
    },


    queryAppList: function () {
      this.$axios({
        method: "GET",
        url: "/appoint/mAppointList",
        params: {
          value: this.searchValue,
          appointDate: this.appointDate,
          appointName: this.appointName,
          inviter: this.inviter,
          appointDress: this.appointDress,
          appointShop: this.appointShop,
          tenantCrop: this.tenantCrop
        }
      }).then(response => {
        this.appointList = response.data.data.list;
        this.finished = true;
      })
    },
    //查询预约项目
    queryAppointName: function () {
      this.$selectUtils.queryProjectsIds(this.$projectsType.appoint, this.$selectUtils.DropDownMenu).then(response => {
        this.appointNameArray.push(...JSON.parse(response.data.data));
      })
    },
    //查询预约人
    queryInviter: function () {
      this.$selectUtils.queryEmpIds(this.$selectUtils.DropDownMenu).then(response => {
        this.inviterArray.push(...JSON.parse(response.data.data));
      })
    },
    //查询礼服师
    queryAppointDress: function () {
      this.$selectUtils.queryDressIds(this.$selectUtils.DropDownMenu).then(response => {
        this.appointDressArray.push(...JSON.parse(response.data.data));
      })
    },
    //查询店铺
    queryAppointShop: function () {
      this.$selectUtils.queryShopIds(this.$selectUtils.DropDownMenu).then(response => {
        this.appointShopArray.push(...JSON.parse(response.data.data));
      })
    },
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'appDetails') {
      this.$store.commit('setKeepAlive', ['appScheduleList'])
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  },activated(){
    console.log("哎呀看见我了")
    console.log("----------activated--------")
  },
  deactivated(){
    console.log("讨厌！！你又走了")
    console.log("----------deactivated--------")
  }

}
</script>

<style scoped>

</style>
