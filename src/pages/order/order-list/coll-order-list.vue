<template>
  <div>
    <div>
      <van-sticky>
        <baseNavBar :title="titleText"/>
        <form action="javascript:return true">
          <van-search
              @search="queryOrderList"
              v-model="searchValue"
              placeholder="请输入搜索关键词"/>
        </form>
        <van-dropdown-menu>
          <van-dropdown-item title="下单时间" ref="item1">
            <van-datetime-picker
                v-model="currentDate1"
                type="year-month"
                :min-date="minDate"
                :max-date="maxDate"
                @confirm="createDateOnConfirm"
                @cancel="closeItem(1)"
            />
          </van-dropdown-item>
          <van-dropdown-item title="婚期" ref="item2">
            <van-datetime-picker
                v-model="currentDate2"
                type="year-month"
                :min-date="minDate"
                :max-date="maxDate"
                @confirm="weddingDayOnConfirm"
                @cancel="closeItem(2)"
            />
          </van-dropdown-item>
        </van-dropdown-menu>
      </van-sticky>
    </div>
    <div>
      <div>
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
        >
          <van-cell style="font-size: 12px" v-for="item in orderList" :key="item.id">
            <div @click="clickItem(item.id,item.cusId)">
              <p>姓名:{{ item.name }}</p>
              <van-row>
                <van-col span="12">订单编号:{{ item.orderNo }}</van-col>
                <van-col span="12" style="text-align: right">订单项目:{{ item.orderName }}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">下单时间:{{ item.createDate }}</van-col>
                <van-col span="12" style="text-align: right">婚期:{{ item.weddingDay }}</van-col>
              </van-row>
              <van-row>
                <van-col span="8">总价:{{ item.orderPrice }}</van-col>
                <van-col span="8" style="text-align: center">收款:{{ item.spareMoney }}</van-col>
                <van-col span="8" style="text-align: right">余款:{{ item.orderSpare }}</van-col>
              </van-row>
              <van-row>
                <van-col span="24">备注:{{ item.orderRemark }}</van-col>
              </van-row>
            </div>
            <van-row style="margin-top: 10px">
              <per-button round color="#07c160"
                          :span="6" size="mini"
                          plain per="order:add_proceeds"
                          @click="proceedsAdd(item)">添加收款</per-button>
              <per-button round color="#1989fa"
                          :span="6" size="mini"
                          plain per="order:add_clothes"
                          @click="clothesAdd(item)">添加婚纱</per-button>
              <per-button round color="#fd6020"
                          :span="6" size="mini"
                          plain per="order:add_image"
                          @click="imagesAdd(item)">订单图片</per-button>
            </van-row>
          </van-cell>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "collOrderList",
  components: {
    baseNavBar
  },
  data() {
    return {
      orderList: [],
      //打开时间
      searchValue: "",
      titleText:"已订单列表",

      createDateM:this.$dateUtils.vantDateToYM(new Date()),
      weddingDateM:"",

      currentDate1: new Date(),
      currentDate2: new Date(),

      empId:localStorage.getItem("empId"),
      tenantCrop:localStorage.getItem("tenantCrop"),
      mobileViewId: this.$route.query.id,

      maxDate: this.$dateUtils.getMaxMinDate()[0],
      minDate: this.$dateUtils.getMaxMinDate()[1],

      loading: false,
      finished: false,
      wDSort: 'desc'
    }
  },
  created() {
    this.queryOrderList();
  },
  methods: {
    //时间确认
    createDateOnConfirm: function (time) {
      this.createDateM = this.$dateUtils.vantDateToYM(time);
      this.weddingDateM = ""
      this.wDSort = 'desc'
      this.$refs.item1.toggle();
      this.queryOrderList();
    },
    weddingDayOnConfirm: function (time) {
      this.weddingDateM = this.$dateUtils.vantDateToYM(time);
      this.createDateM = ""
      this.wDSort = 'asc'
      this.$refs.item2.toggle()
      this.queryOrderList();
    },
    //点击每个item
    clickItem: function (id, cusId) {
      this.$router.push({name: "orderDetails", query: {id: id, cusId: cusId, mobileViewId: this.mobileViewId}})
    },
    closeItem: function (flag) {
      if (flag == 1) {
        this.$refs.item1.toggle();
      }
      if (flag == 2) {
        this.$refs.item2.toggle();
      }
    },
    //点击增加收款
    proceedsAdd: function (item) {
      this.$router.push({
        name: "proceedsAdd",
        query: {
          id: item.id,
          cusId: item.cusId,
          orderPrice: item.orderPrice,
          spareMoney: item.spareMoney
        }
      })
    },


    //查询订单列表
    queryOrderList: function () {
      console.log("刷新")
      this.$axios({
        method: "GET",
        url: "/order/mOrderList",
        params: {
          searchValue: this.searchValue,
          createDateM: this.createDateM,
          weddingDateM: this.weddingDateM,
          tenantCrop: this.tenantCrop,
          empId: this.empId,
          wDSort: this.wDSort
        }
      }).then(response => {
        this.orderList = response.data.data.list;
        this.finished = true;
      })
    },
    clothesAdd: function (value) {
      this.$router.push({name: "orderClothes", query: value})
    }
    , imagesAdd: function (value) {
      this.$router.push({name: "orderImages", query: value})
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'work') {
      this.$store.commit('setKeepAlive', ['collOrderList'])
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  },
}
</script>

<style scoped>
.col{
  margin-left: 6.25%!important;
}
</style>
