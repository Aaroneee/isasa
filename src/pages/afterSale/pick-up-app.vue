<template>
  <div>
    <van-sticky>
      <baseNavBar title="取件预约"/>
      <van-search
          @search="queryPickUpAppoint"
          v-model="searchValue"
          placeholder="请输入客户名或电话号码"/>
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
      >
        <van-cell v-for="item in appArray" :key="item.id">
          <van-row>
            <van-col span="12">姓名:{{ item.name }}</van-col>
            <van-col v-if="item.isValid === '1'" style="color: coral">{{ item.appStateName }}</van-col>
            <van-col v-if="item.isValid === '2'" style="color: #39a9ed">{{ item.appStateName }}</van-col>
            <van-col v-if="item.isValid === '3'" style="color: red">{{ item.appStateName }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">手机号:{{ item.phone }}</van-col>
            <van-col span="12">微信号:{{ item.weChat }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">到店日期:{{ item.appointDate }}</van-col>
            <van-col span="12">到店时间:{{ item.appointTime }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">预约人:{{ item.inviter }}</van-col>
            <van-col span="12">店铺:{{ item.appointShop }}</van-col>
          </van-row>
          <van-row>
            <van-col span="24">备注:{{ item.appointRemark }}</van-col>
          </van-row>
          <van-row type="flex" justify="end">
            <van-col :span="6">
              <van-button size="small" style="width: 100%;" round @click="adDeposit(item)">收押金</van-button>
            </van-col>
          </van-row>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "pickUpApp",
  components: {
    baseNavBar
  },
  created() {
    this.queryPickUpAppoint()
  },
  data() {
    return {
      searchValue: "",
      tenantCrop: localStorage.getItem("tenantCrop"),
      loading: false,
      finished: false,
      appArray: [],
    }
  },
  methods: {
    queryPickUpAppoint() {
      this.appArray = []
      this.$axios({
        method: "get",
        url: "/appoint/queryPickUpAppoint",
        params: {
          tenantCrop: this.tenantCrop,
          shopIds: localStorage.getItem("shopIds"),
          appointDate: this.$dateUtils.vantDateToYMD(new Date()),
          value: this.searchValue
        }
      }).then(response => {
        this.appArray.push(...response.data.data)
        this.finished = true
      })
    },
    async adDeposit(val) {
      const response =  await this.$axios({
        method: "get",
        url: "/order/queryOrderListByCusId",
        params: {
          cusId: val.cusId
        }
      })
      for (let item of response.data.data) {
        if (item.orderState === "未收满") {
          this.$toast.fail("钱未付完，请去收尾款")
          return
        }
      }
      this.$router.push({path: "addDeposit", query: {cusId: val.cusId,name: val.name}})
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'work') {
      this.$store.commit('setKeepAlive', ['pickUpApp'])
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  }
}
</script>

<style scoped>

</style>