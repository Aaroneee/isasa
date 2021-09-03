<template>
  <div>
    <van-sticky>
      <switchNavBar  title="预约列表" switchText="日期" @flag="createDateShow=true"/>
      <form action="javascript:return true">
      <van-search
          @search="queryAppList"
          v-model="searchValue"
          placeholder="请输入搜索关键词"/>
      </form>
      <van-calendar safe-area-inset-bottom v-model="createDateShow" :min-date="minDate" :max-date="maxDate"
                    type="range" @confirm="createDateOnConfirm"/>
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
        <van-cell v-for="item in appointList" :key="item.id" @click="clickItem(item.id)">
          <van-row style="padding-bottom: 10px">
            <van-col span="12">姓名:{{ item.name }}</van-col>
            <van-col v-if="item.isValid === '1'" style="color: coral">状态 : {{ item.appStateName }}</van-col>
            <van-col v-if="item.isValid === '2'" style="color: #39a9ed">状态 : {{ item.appStateName }}</van-col>
            <van-col v-if="item.isValid === '3'" style="color: red">状态 : {{ item.appStateName }}</van-col>
          </van-row>
<!--          <van-row>-->
<!--            <van-col span="12">客资状态:{{ item.stateName }}</van-col>-->
<!--            <van-col span="12">预约状态:{{ item.appStateName }}</van-col>-->
<!--          </van-row>-->
          <van-row>
            <van-col span="12">预约日期:{{ item.createDate }}</van-col>
            <van-col span="12">到店日期:{{ item.appointDate }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">来源:{{ item.sourceName }}</van-col>
            <van-col span="12">到店时间:{{ item.appointTime }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">预约项目:{{ item.appointName }}</van-col>
            <van-col span="12">城市:{{ item.appointCity }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">预约人:{{ item.inviter }}</van-col>
            <van-col span="12">店铺:{{ item.appointShop }}</van-col>
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
  name: "appList",
  components: {
    switchNavBar
  },
  data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      appointList: [],
      searchValue: "",
      loading: false,
      finished: false,

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

      createDateShow: false,
      appointNameArray: [{text: "项目", value: ""}],
      inviterArray: [{text: "预约人", value: ""}],
      appointDressArray: [{text: "礼服师", value: ""}],
      appointShopArray: [{text: "店铺", value: ""}],

      createDate: "日期",
      appointName: "",
      inviter: "",
      appointDress: "",
      appointShop: "",
      state: "",


      customer:{},

    }
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
      this.createDate = this.$dateUtils.rangeVantDateToYMD(time);
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
      this.$router.push({name: "appDetails", query: {id: id,pageSource:'appList'}})
    },


    queryAppList: function () {
      this.$axios({
        method: "GET",
        url: "/appoint/mAppointList",
        params: {
          value: this.searchValue,
          createDate: this.createDate,
          appointName: this.appointName,
          inviter: this.inviter,
          appointDress: this.appointDress,
          appointShop: this.appointShop,
          tenantCrop: this.tenantCrop
        }
      }).then(response => {
        this.appointList = response.data.data.list;
        console.log(response)
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
      this.$store.commit('setKeepAlive', ['appList'])
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  }

}
</script>

<style scoped>

</style>
