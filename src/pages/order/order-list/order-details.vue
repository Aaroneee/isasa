<template>
  <div>
    <baseNavBar title="订单详情"/>
    <div v-cloak>
      <van-cell-group>
        <van-cell title="姓名:" :value="orderVo.name" />
        <van-cell title="手机号:" :value="orderVo.phone" />
        <van-cell title="微信:" :value="orderVo.weChat" />
        <van-cell title="订单编号:" :value="orderVo.orderNo" />
        <van-cell title="下单时间:" :value="orderVo.createDate" />
        <van-cell title="婚期:" :value="orderVo.weddingDay" />
        <van-cell title="客服:" :value="orderVo.service" />
        <van-cell title="礼服师:" :value="orderVo.dress" />
        <van-cell title="订单总价:" :value="orderVo.orderPrice"  />
        <van-cell title="已付金额:" :value="orderVo.spareMoney"  />
        <van-cell title="余款:" :value="orderVo.orderSpare"  />
      </van-cell-group>

    </div>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "order-details",
  components:{
    baseNavBar
  },
  data(){
    return{
      id:this.$route.query.id,
      orderVo:{},
    }
  },
  created() {
    this.queryOrderVo();
  },
  methods:{
    queryOrderVo:function (){
      this.$axios({
        method:"GET",
        url:"/order/queryOrderVoById",
        params:{
          id:this.id
        }
      }).then(response=>{
        this.orderVo=response.data.data;
      })
    },
  }

}
</script>

<style scoped>

</style>