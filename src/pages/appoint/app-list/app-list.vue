<template>
  <div>
    <van-sticky>
      <switchNavBar title="预约列表" switchText="日期" @flag="createDateOpen"/>
      <van-search
          @search="queryAppList"
          v-model="searchValue"
          placeholder="请输入搜索关键词"/>
      <van-calendar safe-area-inset-bottom v-model="createDateShow" type="range" @confirm="createDateOnConfirm"/>
      <van-dropdown-menu>
        <van-dropdown-item :title="appointNameText" v-model="appointName" @change="appointNameChange"
                           :options="appointNameArray"/>
        <van-dropdown-item :title="inviterText" v-model="inviter" @change="inviterChange" :options="inviterArray"/>
        <van-dropdown-item :title="appointDressText" v-model="appointDress" @change="appointDressChange"
                           :options="appointDressArray"/>
        <van-dropdown-item :title="appointShopText" v-model="appointShop" @change="appointShopChange"
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
          <p>姓名:{{ item.name }}</p>
          <van-row>
            <van-col span="12">预约时间:{{ item.createDate }}</van-col>
            <van-col span="12">到店时间:{{ item.appointDate }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">预约项目:{{ item.appointName }}</van-col>
            <van-col span="12">预约店铺:{{ item.state }}</van-col>
          </van-row>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import switchNavBar from '@/components/nav-bar/switch-nav-bar'

export default {
  name: "app-list",
  components: {
    switchNavBar
  },
  data() {
    return {
      appointList: [],
      searchValue: "",
      loading: false,
      finished: false,

      createDateShow: false,
      createDate: "日期",

      appointNameText: "",
      appointName: "",
      appointNameArray: [{text: "项目", value: ""}],

      inviterText: "",
      inviter: "",
      inviterArray: [{text: "预约人", value: ""}],

      appointDressText: "",
      appointDress: "",
      appointDressArray: [{text: "礼服师", value: ""}],

      appointShopText: "",
      appointShop: "",
      appointShopArray: [{text: "店铺", value: ""}],

      state: "",
      tenantCrop: "",

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
    //打开日历
    createDateOpen: function (flag) {
      this.createDateShow = flag;
    },
    //日历确认
    createDateOnConfirm: function (time) {
      this.createDate = this.dateUtils.rangeVantDateToYMD(time);
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
      this.$router.push({name:"appDetails",query:{id:id}})
    },


    queryAppList: function () {
      this.axios({
        method: "GET",
        url: "/appoint/mAppointList",
        params: {
          value: this.searchValue,
          createDate: this.createDate,
          appointName: this.appointName,
          inviter: this.inviter,
          appointDress: this.appointDress,
          appointShop: this.appointShop,
          tenantCrop: 1
        }
      }).then(response => {
        this.appointList = response.data.data.list;
        this.finished = true;
      })
    },
    //查询预约项目
    queryAppointName: function () {
      this.selectUtils.queryProjectsIds("预约项目", 2, 1).then(response => {
        this.appointNameArray.push(...response.data.data);
      })
    },
    //查询预约人
    queryInviter: function () {
      this.selectUtils.queryEmpIds(2, 1).then(response => {
        this.inviterArray.push(...response.data.data);
      })
    },
    //查询礼服师
    queryAppointDress: function () {
      this.selectUtils.queryDressIds(2, 1).then(response => {
        this.appointDressArray.push(...response.data.data);
      })
    },
    //查询店铺
    queryAppointShop: function () {
      this.selectUtils.queryShopIds(2, 1).then(response => {
        this.appointShopArray.push(...response.data.data);
      })
    },
  }
}
</script>

<style scoped>

</style>