<template>
  <div>
    <baseNavBar title="客资详情"/>
    <div id="parent" v-cloak>
      <van-cell-group>
        <van-cell title="姓名:" :value="customer.name" />
        <van-cell title="手机号:" :value="customer.phone" />
        <van-cell title="微信号:" :value="customer.weChat" />
        <van-cell title="状态:" :value="customer.state"  />
        <van-cell title="来源:" :value="customer.source"  />
        <van-cell title="婚期:" :value="customer.weddingDay"/>
        <van-cell title="备注:" :label="customer.remark" />
      </van-cell-group>

    </div>


  </div>
</template>

<script>
import baseNavBar from '../../../components/nav-bar/base-nav-bar'

export default {
  name: "cus-details",
  data(){
    return{
      cusId:this.$route.params.cusId,
      customer: {}
    }
  },
  created() {
    this.queryCustomerById();
  },
  components:{
    baseNavBar:baseNavBar
  },
  methods:{
    queryCustomerById:function (){
      this.axios({
        method:"GET",
        url:"/customer/queryCustomerVoById",
        params:{
          id:this.cusId
        }
      }).then(response=>{
        this.customer=response.data.data;
      })
    }
  }
}
</script>

<style scoped>
[v-cloak]{
  display: none;
}
</style>