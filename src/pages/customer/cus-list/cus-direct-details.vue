<template>
  <div>
    <baseNavBar title="直约客资详情"/>
    <div v-cloak>
      <van-cell-group>
        <van-cell title="姓名:" :value="customer.name" />
        <van-cell title="手机号:" :value="customer.phone" />
        <van-cell title="微信号:" :value="customer.weChat" />
        <van-cell title="对接日期:" :value="customer.createDate"  />
        <van-cell title="状态:" :value="customer.state"  />
        <van-cell title="来源:" :value="customer.source"  />
        <van-cell title="客服:" :value="customer.service"  />
        <van-cell title="意愿度:" :value="customer.grade"  />
        <van-cell title="所在城市:" :value="customer.city"  />
        <van-cell title="婚期:" :value="customer.weddingDay"/>
        <van-cell title="婚礼地点:" :value="customer.weddingVenue"/>
        <van-cell title="备注:" :label="customer.remark" />
      </van-cell-group>

    </div>
    <br>
    <van-row>

      <van-col span="6" offset="2">
        <van-button @click="openCusEdit" style="width: 100%" type="warning">客资编辑</van-button>
      </van-col>
      <van-col span="6" offset="1">
        <van-button @click="openAppAdd" type="primary" style="width: 100%">销售直约</van-button>
      </van-col>
      <van-col span="6" offset="1">
        <van-button @click="cusCommunicate" type="info" style="width: 100%">客资沟通</van-button>
      </van-col>

    </van-row>
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "cus-direct-details",
  data(){
    return{
      cusId:this.$route.query.cusId,
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
      this.$axios({
        method:"GET",
        url:"/customer/queryCustomerVoById",
        params:{
          id:this.cusId
        }
      }).then(response=>{
        this.customer=response.data.data;
      })
    },
    //打开修改客资界面
    openCusEdit:function (){
      this.$router.push({name:"cusEdit",query:{cusId:this.$route.query.cusId}});
    },
    //打开预约添加界面
    openAppAdd:function (){
      this.$router.push({name:"appAdd",query:this.customer});
    },
    //打开客资沟通界面
    cusCommunicate:function (){
      this.$router.push({name:"cusCommunicate",query:{cusId:this.$route.query.cusId}})
    }
  }
}
</script>

<style scoped>
[v-cloak]{
  display: none;
}
</style>
