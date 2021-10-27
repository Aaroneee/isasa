<template>
  <div>
    <div>
      <van-sticky>
        <van-nav-bar title="订单列表" left-text="返回" left-arrow @click-left="onClickLeft">
          <template #right>
            <span style="color: #1989fb" @click="orderDateShow=true">订单</span>
            <span style="margin-left: 25px;color: #1989fb" @click="createDateShow=true">婚期</span>
          </template>
        </van-nav-bar>
        <form action="javascript:return true">
          <van-search
              @search="queryOrderList"
              v-model="searchValue"
              placeholder="请输入搜索关键词"/>
        </form>
        <van-calendar title="下单日期选择" v-model="orderDateShow" :min-date="minDate" :max-date="maxDate"
                      type="range" allow-same-day @confirm="orderDateConfirm"/>
        <van-calendar title="婚期选择" safe-area-inset-bottom v-model="createDateShow" :min-date="minDate" :max-date="maxDate"
                      type="range" @confirm="createDateOnConfirm" allow-same-day/>
        <van-dropdown-menu>
          <van-dropdown-item v-model="sort" @change="sortChange" :options="sortArrays"/>
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
                          plain :span="6" size="mini"
                          per="order:add_clothes"
                          @click="clothesAdd(item)">添加婚纱</per-button>
              <per-button round color="#fd6020"
                          plain :span="6" size="mini"
                          per="order:add_image"
                          @click="imagesAdd(item)">订单图片</per-button>
            </van-row>
          </van-cell>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "orderList",
  data() {
    return {
      orderList: [],
      //打开时间
      createDateShow: false,
      orderDateShow: false,
      searchValue: "",
      createDate: "",
      orderDate: "",

      maxDate: this.$dateUtils.getMaxMinDate()[0],
      minDate: this.$dateUtils.getMaxMinDate()[1],

      loading: false,
      finished: false,
      sort:"desc",
      sortArrays: [{text: "按订单降序", value: "desc"},{text: "按婚期升序",value: "asc"}],
    }
  },
  created() {
    this.queryOrderList();
  },
  methods: {
    //时间确认
    createDateOnConfirm: function (time) {
      this.orderDate = "";
      this.createDate = this.$dateUtils.rangeVantDateToYMD(time);
      this.sort = "asc"
      this.queryOrderList();
      this.createDateShow = false;
    },
    orderDateConfirm: function (time) {
      this.createDate = "";
      this.orderDate = this.$dateUtils.rangeVantDateToYMD(time);
      this.sort = "desc"
      this.queryOrderList();
      this.orderDateShow = false;
    },
    //点击每个item
    clickItem: function (id, cusId) {
      this.$router.push({name: "orderDetails", query: {id: id, cusId: cusId}})
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
          createDate: this.createDate,
          orderDate: this.orderDate,
          tenantCrop: localStorage.getItem("tenantCrop"),
          wDSort: this.sort,
          shopIds: localStorage.getItem("shopIds"),
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
    },
    sortChange: function () {
      this.queryOrderList();
    },
    onClickLeft: function () {
      this.$router.back();
    },
    test: function (value) {
      console.log(value)
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'work') {
      this.$store.commit('setKeepAlive', ['orderList'])
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  },
  activated() {
    console.log("回来了")
    this.queryOrderList()
  }
}
</script>

<style scoped>
.col{
  margin-left: 6.25%!important;
}
</style>
