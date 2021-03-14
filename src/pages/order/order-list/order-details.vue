<template>
  <div>
    <switchNavBar title="订单详情" switchText="订单图片" @flag="orderImages=true"/>
    <van-popup v-model="orderImages" round position="bottom" :style="{ height: '60%' }">
      <van-collapse  v-model="activeNames"  style="padding:4% 4% 4% 4%">
        <van-collapse-item v-for="item in orderImageArray" :key="item.id"
                           :title="item.orderName"
                           :name="item.id">
          <van-cell-group style="text-align: center">
            <van-image radius="7"  :src="'\thttps://order-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.imageUrl"/>
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>









    </van-popup>
    <div v-cloak>
      <van-cell-group>
        <van-cell title="姓名:" :value="orderVo.name"/>
        <van-cell title="手机号:" :value="orderVo.phone"/>
        <van-cell title="微信:" :value="orderVo.weChat"/>
        <van-cell title="订单编号:" :value="orderVo.orderNo"/>
        <van-cell title="下单时间:" :value="orderVo.createDate"/>
        <van-cell title="婚期:" :value="orderVo.weddingDay"/>
        <van-cell title="客服:" :value="orderVo.service"/>
        <van-cell title="礼服师:" :value="orderVo.dress"/>
        <van-cell title="订单总价:" :value="orderVo.orderPrice"/>
        <van-cell title="已付金额:" :value="orderVo.spareMoney"/>
        <van-cell title="余款:" :value="orderVo.orderSpare"/>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar"

export default {
  name: "order-details",
  components: {
    switchNavBar
  },
  data() {
    return {
      id: this.$route.query.id,
      cusId: this.$route.query.cusId,
      orderVo: {},
      orderImages:false,
      tenantCrop: localStorage.getItem("tenantCrop"),


      activeNames: ['1'],
      orderImageArray: []
    }
  },
  created() {
    this.queryOrderVo();
    this.queryOrderImages();
  },
  methods: {
    queryOrderVo: function () {
      this.$axios({
        method: "GET",
        url: "/order/queryOrderVoById",
        params: {
          id: this.id
        }
      }).then(response => {
        this.orderVo = response.data.data;
      })
    },
    queryOrderImages: function () {
      this.$axios({
        method: 'GET',
        params: {
          cusId: this.cusId,
          tenantCrop:this.tenantCrop,
        },
        url: '/image/orderImagesByCus',
      }).then(response => {
        console.log(response)
        this.orderImageArray = response.data.data
      })
    }
  }

}
</script>

<style scoped>

</style>
