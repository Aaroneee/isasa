<template>
  <div>
    <van-sticky>
      <baseNavBar :title="titleText"/>
      <form action="javascript:return true">
        <van-search
            @search="queryAppList"
            v-model="searchValue"
            placeholder="请输入搜索关键词"/>
      </form>
      <van-dropdown-menu>
        <van-dropdown-item v-model="appointName" @change="appointNameChange"
                           :options="appointNameArray"/>
        <van-dropdown-item title="到店日期" ref="item">
          <van-datetime-picker
              v-model="currentDate"
              type="year-month"
              :min-date="minDate"
              :max-date="maxDate"
              @confirm="appointDateOnConfirm"
              @cancel="closeItem"
          />
        </van-dropdown-item>
      </van-dropdown-menu>
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
      >
        <van-cell style="font-size: 12px" v-for="item in appointList" :key="item.id" @click="clickItem(item.id)">
          <van-row style="padding-bottom: 10px">
            <van-col span="12">姓名:{{ item.name }}</van-col>
            <van-col v-if="item.isValid === '1'" style="color: coral">状态 : 预约</van-col>
            <van-col v-if="item.isValid === '2'" style="color: #39a9ed">状态 : 到店</van-col>
            <van-col v-if="item.isValid ==='3'" style="color: red">状态 : 取消</van-col>
          </van-row>
          <van-row>
            <van-col span="12">预约日期:{{ item.createDate }}</van-col>
            <van-col span="12">到店日期:{{ item.appointDate }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">到店时间:{{ item.appointTime }}</van-col>
            <van-col span="12">店铺:{{ item.appointShop }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">预约项目:{{ item.appointName }}</van-col>
            <van-col span="12">城市:{{ item.appointCity }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">预约人:{{ item.inviter }}</van-col>
            <van-col span="12">化妆师:{{ item.appointCosmetics }}</van-col>
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
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "mScheduleList",
  data() {
    return{
      tenantCrop: localStorage.getItem("tenantCrop"),
      inviter:localStorage.getItem("empId"),
      appointList: [],
      titleText: "我的预约",
      createDateShow: true,
      searchValue: "",
      loading: false,
      finished: false,
      appointDateM:this.$dateUtils.vantDateToYM(new Date()),
      currentDate: new Date(),

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

      appointNameArray: [{text: "项目", value: ""}],

      appointName: "",
      appointDress: "",
    }
  },
  components: {
    baseNavBar
  },
  created() {
    this.queryAppList();
    this.queryAppointName();
  },
  methods: {
    appointDateOnConfirm: function (time) {
      this.appointDateM = this.$dateUtils.vantDateToYM(time);
      this.queryAppList();
      this.$refs.item.toggle();
    },
    closeItem: function () {
      this.$refs.item.toggle();
    },
    queryAppList: function () {
      this.$axios({
        method: "GET",
        url: "/appoint/mAppointList",
        params: {
          value: this.searchValue,
          appointDateM: this.appointDateM,
          appointName: this.appointName,
          tenantCrop: this.tenantCrop,
          appointDress: this.inviter,
        }
      }).then(response => {
        this.appointList = response.data.data.list;
        this.finished = true;
      })
    },
    appointNameChange: function (value) {
      this.appointName = value;
      this.queryAppList();
    },
    //查询预约项目
    queryAppointName: function () {
      this.$selectUtils.queryProjectsIds(this.$projectsType.appoint, this.$selectUtils.DropDownMenu).then(response => {
        this.appointNameArray.push(...JSON.parse(response.data.data));
      })
    },
    clickItem: function (id) {
      this.$router.push({name: "appDetails", query: {id: id,pageSource:'mScheduleList'}})
    },
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'appDetails') {
      this.$store.commit('setKeepAlive', ['mScheduleList'])
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  }
}
</script>

<style scoped>

</style>