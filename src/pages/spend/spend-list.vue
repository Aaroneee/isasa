<template>
  <div>
    <div>
      <van-sticky>
        <van-nav-bar title="支出列表" left-text="返回" left-arrow @click-left="onClickLeft">
        </van-nav-bar>
      </van-sticky>
    </div>
    <div>
      <div>
        <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad"
            finished-text="没有更多了"
        >
          <van-cell style="font-size: 12px" v-for="item in spendList" :key="item.id">
            <van-row>
              <van-col style="font-size: 20px;color: red" span="24">{{ item.content }}</van-col>
            </van-row>
            <van-row>
              <van-col span="12">支出项目:{{ item.spendProjectsName }}</van-col>
              <van-col span="12">店铺:{{item.shopName}}</van-col>
            </van-row>
            <van-row>
              <van-col span="12">报销人:{{ item.spendPeopleName }}</van-col>
              <van-col span="12">支出金额:{{ item.spendAmount }}</van-col>
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
      spendList: [],
      orderList: [],
      createDate: "",

      loading: false,
      finished: false,
      page: 1,
      // shop: null,
      // localShopArray: localStorage.getItem("shopIds").split(",").map(Number),
      // shopIds: localStorage.getItem("shopIds"),

      form: {
        // 支出发生日期
        createDateArray: [],
        // 申报支付日期
        declarePaymentDateArray: [],
        // 申报日期
        declarationDateArray: [],
        // 公司结算日期
        settlementDateArray: [],
        // 内容
        content: '',
        // 报销人
        spendPeople: '',
        // 当前选中的状态
        settlement: '',
        // 支出项目
        spendProjectsIds: [],
        // 店铺
        shopIds: [],
        // 公司结算方式
        spendMethodIds: [],
        // 申报支付方式
        declareMethodIds: [],
      },
    }
  },
  created() {
    // this.queryOrderList()
    this.querySpendListByCondition()
  },
  methods: {
    // 通过条件查询列表
    querySpendListByCondition: function () {
      this.$axios({
        method: "GET",
        url: "/spend/listByCondition",
        params: {
          page: 1,
          limit: 100, //100还是20？
          tenantCrop: localStorage.getItem('tenantCrop'),
          ...this.form
        }
      }).then(response => {
        console.log("response111111111")
        console.log(response)
        this.spendList = response.data.data.list
        // this.table.total = response.data.data.total
        // this.table.tableData = response.data.data.list
      })
    },


    // //查询订单列表
    // queryOrderList: function () {
    //   this.loading = true
    //   this.$axios({
    //     method: "GET",
    //     url: "/order/mOrderList",
    //     params: {
    //       page: this.page,
    //       createDate: this.createDate,
    //       tenantCrop: localStorage.getItem("tenantCrop"),
    //       wDSort: "asc",
    //     }
    //   }).then(response => {
    //     console.log(response)
    //     if (response.data.code === 200) {
    //       if (response.data.data.nextPage === 0) {
    //         this.finished = true
    //       } else {
    //         this.loading = false
    //         this.page = response.data.data.nextPage
    //       }
    //       this.orderList.push(...response.data.data.list)
    //     } else {
    //       this.finished = true;
    //       this.$toast.fail(response.data.msg);
    //     }
    //   })
    // },

    onClickLeft: function () {
      this.$router.back();
    },
    onLoad() {
      // this.queryOrderList()
    },
    // pageInit() {
    //   this.orderList = []
    //   this.page = 1
    //   this.finished = false
    // },
    // search() {
    //   this.pageInit()
    //   this.queryOrderList()
    // },

  },
}
</script>

<style scoped>
.col {
  margin-left: 3% !important;
}
</style>
