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
              @search="search"
              v-model="searchValue"
              placeholder="请输入搜索关键词"/>
        </form>
        <van-calendar title="下单日期选择" v-model="orderDateShow" :min-date="minDate" :max-date="maxDate"
                      type="range" allow-same-day @confirm="orderDateConfirm"/>
        <van-calendar title="婚期选择" safe-area-inset-bottom v-model="createDateShow" :min-date="minDate" :max-date="maxDate"
                      type="range" @confirm="createDateOnConfirm" allow-same-day/>
        <van-dropdown-menu>
          <van-dropdown-item v-model="sort" @change="sortChange" :options="sortArrays"/>
          <van-dropdown-item v-model="shop" @change="shopChange" :options="shopArray"/>
          <van-dropdown-item v-model="dress" @change="dressChange" :options="dressArray"/>
        </van-dropdown-menu>
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
          <van-cell style="font-size: 12px" v-for="item in orderList" :key="item.id">
            <div @click="clickItem(item.id, item.cusId, item.appId)">
              <van-row style="">
                <van-col span="12">客户名:{{ item.name }}</van-col>
                <van-col span="12" style="text-align: right">{{item.state}}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">订单编号:{{ item.orderNo }}</van-col>
                <van-col span="12" style="text-align: right">订单项目:{{ item.orderName }}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">下单时间:{{ item.createDate }}</van-col>
                <van-col span="12" style="text-align: right">婚期:{{ item.weddingDay }}</van-col>
              </van-row>
              <van-row>
                <van-col>
                  礼服师:{{ item.dress }}
                </van-col>
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
            <van-row style="margin-top: 5px" type="flex" justify="center">
              <per-button round
                          :span="5" size="small"
                          plain per="order:after_sale_app_add"
                          @click="afterSaleAppAdd(item)">售后预约</per-button>
              <per-button round
                          :span="5" size="small"
                          plain per="order:add_proceeds"
                          @click="proceedsAdd(item)">添加收款</per-button>
              <per-button round
                          plain :span="5" size="small"
                          per="order:add_clothes"
                          @click="clothesAdd(item)">添加婚纱</per-button>
              <per-button round
                          plain :span="5" size="small"
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
      dressArray: [{text: "礼服师", value: null},],
      dress: null,
      page: 1,
      shopArray: [{text: "店铺", value: null}],
      shop: null,
      localShopArray: localStorage.getItem("shopIds").split(",").map(Number),
      shopIds: localStorage.getItem("shopIds"),
    }
  },
  created() {
    this.queryOrderList();
    this.queryDressArray()
    this.queryShopArray()
  },
  methods: {
    //时间确认
    createDateOnConfirm: function (time) {
      this.orderDate = "";
      this.createDate = this.$dateUtils.rangeVantDateToYMD(time);
      this.sort = "asc"
      this.pageInit()
      this.queryOrderList();
      this.createDateShow = false;
    },
    orderDateConfirm: function (time) {
      this.createDate = "";
      this.orderDate = this.$dateUtils.rangeVantDateToYMD(time);
      this.sort = "desc"
      this.pageInit()
      this.queryOrderList();
      this.orderDateShow = false;
    },
    //点击每个item
    clickItem: function (id, cusId, appId) {
      this.$router.push({name: "orderDetails", query: {id: id, cusId: cusId, appId: appId}})
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
      this.loading = true
      this.$axios({
        method: "GET",
        url: "/order/mOrderList",
        params: {
          page: this.page,
          searchValue: this.searchValue,
          createDate: this.createDate,
          orderDate: this.orderDate,
          tenantCrop: localStorage.getItem("tenantCrop"),
          wDSort: this.sort,
          shopIds: this.shopIds,
          dress: this.dress
        }
      }).then(response => {
        if (response.data.code === 200) {
          if (response.data.data.nextPage === 0) {
            this.finished = true
          } else {
            this.loading = false
            this.page = response.data.data.nextPage
          }
          this.orderList.push(...response.data.data.list)
        } else {
          this.finished = true;
          this.$toast.fail(response.data.msg);
        }
      })
    },
    clothesAdd: function (value) {
      this.$router.push({name: "orderClothes", query: value})
    }
    , imagesAdd: function (value) {
      this.$router.push({name: "orderImages", query: value})
    },
    sortChange: function () {
      this.pageInit()
      this.queryOrderList();
    },
    onClickLeft: function () {
      this.$router.back();
    },
    afterSaleAppAdd(val) {
      this.$router.push({name: "afterSaleAppAdd", query: val})
    },
    queryDressArray() {
      this.dressArray = [{text: "礼服师", value: null}]
      this.$selectUtils.queryDressIdsByShop(this.$selectUtils.DropDownMenu, this.shop).then(response => {
        this.dressArray.push(...JSON.parse(response.data.data))
      })
    },
    dressChange() {
      this.pageInit()
      this.queryOrderList()
    },
    onLoad() {
      this.queryOrderList()
    },
    pageInit() {
      this.orderList = []
      this.page = 1
      this.finished = false
    },
    search() {
      this.pageInit()
      this.queryOrderList()
    },
    queryShopArray() {
      this.$selectUtils.queryShopIds(this.$selectUtils.DropDownMenu).then(response => {
        this.shopArray.push(...JSON.parse(response.data.data).filter(s => {
          return this.localShopArray.includes(s.value)
        }))
      })
    },
    shopChange(val) {
      if (val === null) {
        this.shopIds = localStorage.getItem("shopIds")
      } else {
        this.shopIds = val
      }
      this.queryDressArray()
      this.pageInit()
      this.queryOrderList()
    },
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
    this.queryOrderList()
  }
}
</script>

<style scoped>
.col{
  margin-left: 3%!important;
}
</style>
