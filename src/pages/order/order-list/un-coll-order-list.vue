<template>
  <div>
    <div>
      <van-sticky>
        <baseNavBar :title="textTile"/>
        <form action="javascript:return true">
          <van-search
              @search="queryOrderList"
              v-model="searchValue"
              placeholder="请输入搜索关键词"/>
        </form>
        <van-dropdown-menu>
          <van-dropdown-item title="预约日期" ref="item">
            <van-datetime-picker
                v-model="currentDate"
                type="year-month"
                :min-date="minDate"
                :max-date="maxDate"
                @confirm="appointDateOnConfirm"
                @cancel="closeItem()"
            />
          </van-dropdown-item>
        </van-dropdown-menu>
      </van-sticky>
    </div>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
      >
        <van-cell style="font-size: 12px" v-for="item in orderList" :key="item.id">
          <div @click="clickItem(item.name,item.cusId,item.state,item.inviter)">
            <van-row>
              <van-col span="12" >客户名: {{ item.name}}</van-col>
              <van-col span="12" style="color: #FFC633;text-align: right">{{ item.state }}</van-col>
            </van-row>
            <van-row>
              <van-col span="12">手机号: {{ item.phone }}</van-col>
              <van-col span="12" style="text-align: right">微信号: {{ item.weChat }}</van-col>
            </van-row>
            <van-row>
              <van-col span="12">预约日期: {{ item.appDate }}</van-col>
              <van-col span="12" style="text-align: right">婚期: {{ item.weddingDay }}</van-col>
            </van-row>
            <van-row>
              <van-col span="24">预约人: {{ item.inviter }}</van-col>
            </van-row>
            <van-row>
              <van-col span="24">备注: {{ item.appRemark }}</van-col>
            </van-row>
          </div>
          <br>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "unCollOrderList",
  components: {
    baseNavBar
  },
  data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      empId: localStorage.getItem("empId"),
      orderList: [],

      appointDate:this.$dateUtils.vantDateToYM(new Date()),

      searchValue: "",
      textTile: "未订单列表",

      currentDate: new Date(),
      maxDate: this.$dateUtils.getMaxMinDate()[0],
      minDate: this.$dateUtils.getMaxMinDate()[1],

      loading: false,
      finished: false,

    }
  },
  created() {
    this.queryOrderList()
  },
  methods: {
    queryOrderList: function () {
      this.$axios({
        method: "GET",
        url: "/order/mNoOrderList",
        params: {
          searchValue: this.searchValue,
          tenantCrop: localStorage.getItem("tenantCrop"),
          appointDate: this.appointDate,
          empId: this.empId,
        }
      }).then(response => {
        this.orderList = response.data.data.list;
        this.finished = true;
      })
    },
    appointDateOnConfirm: function (time) {
      this.appointDate = this.$dateUtils.vantDateToYMD(time);
      this.$refs.item.toggle();
      this.queryOrderList();
    },
    closeItem: function () {
      this.$refs.item.toggle();
    },
    clickItem: function () {
    },
  },
}
</script>

<style scoped>

</style>