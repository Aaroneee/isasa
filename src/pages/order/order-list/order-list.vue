<template>
  <div>
    <div>
      <van-sticky>
        <switchNavBar title="订单列表" switchText="婚期" @flag="createDateShow=true"/>
        <form action="javascript:return true">
          <van-search
              @search="queryOrderList"
              v-model="searchValue"
              placeholder="请输入搜索关键词"/>
        </form>
        <van-calendar safe-area-inset-bottom v-model="createDateShow" :min-date="minDate" :max-date="maxDate"
                      @confirm="createDateOnConfirm"/>
        <!--      <van-dropdown-menu>-->
        <!--        <van-dropdown-item :title="appointNameText" v-model="appointName" @change="appointNameChange"-->
        <!--                           :options="appointNameArray"/>-->
        <!--        <van-dropdown-item :title="inviterText" v-model="inviter" @change="inviterChange" :options="inviterArray"/>-->
        <!--        <van-dropdown-item :title="appointDressText" v-model="appointDress" @change="appointDressChange"-->
        <!--                           :options="appointDressArray"/>-->
        <!--        <van-dropdown-item :title="appointShopText" v-model="appointShop" @change="appointShopChange"-->
        <!--                           :options="appointShopArray"/>-->
        <!--      </van-dropdown-menu>-->
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
            <br>
            <van-row>
              <van-col span="8" style="text-align: center;color: #008000" @click="proceedsAdd(item)">添加收款</van-col>
              <van-col span="8" style="text-align: center;color: #39a9ed" @click="clothesAdd(item)">添加款式</van-col>
              <van-col span="8" style="text-align: center;color: coral" @click="imagesAdd(item)">订单图片</van-col>
            </van-row>
          </van-cell>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar"

export default {
  name: "orderList",
  components: {
    switchNavBar
  },
  data() {
    return {
      orderList: [],
      //打开时间
      createDateShow: false,
      searchValue: "",
      createDate: "",

      maxDate: this.$dateUtils.getMaxMinDate()[0],
      minDate: this.$dateUtils.getMaxMinDate()[1],

      loading: false,
      finished: false,
    }
  },
  created() {
    this.queryOrderList();
  },
  methods: {
    //时间确认
    createDateOnConfirm: function (time) {
      this.createDate = this.$dateUtils.vantDateToYMD(time);
      this.queryOrderList();
      this.createDateShow = false;
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
          tenantCrop: localStorage.getItem("tenantCrop"),
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

</style>
