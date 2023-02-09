<template>
  <div>
    <baseNavBar title="客资详情" :fixed="true"/>
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
      <per-button @click="openCusEdit" type="warning" :span="6" per="cus_details:cus_edit">客资编辑</per-button>
      <per-button @click="openAppAdd" type="primary" :span="6" per="cus_details:add_appoint">添加预约</per-button>
      <per-button @click="onlineOrderAdd" type="info" :span="6" per="cus_details:online_order_add">线上订单</per-button>
      <per-button @click="cusCommunicate" type="info" :span="6" per="cus_details:add_comm">客资沟通</per-button>
      <per-button @click="delCustomer" type="warning" :span="6" per="cus_details:cus_delete">客资删除</per-button>
    </van-row>
    <br>
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "cus-details",
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
    //打开线上订单界面  
    onlineOrderAdd:function (){
      this.$router.push({name:"onlineOrderAdd",query:this.customer})
    },
    //打开客资沟通界面
    cusCommunicate:function (){
      this.$router.push({name:"cusCommunicate",query:{cusId:this.$route.query.cusId}})
    },
    //删除客资
    delCustomer:function (){
      this.$dialog.confirm({
        title: '删除客资',
        message: '是否确认删除客资?',
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/customer/deleteCustomerById",
          params: {
            id:this.cusId
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("删除成功");
            let self=this;
            setTimeout(function (){
              self.$router.replace({name: "cusList"})
            },800)
          } else {
            this.$toast.fail(response.data.msg);
          }
        })
      })
    },

  }
}
</script>

<style scoped>
[v-cloak]{
  display: none;
}
.col{
  /*offset=1*/
  margin-left: 4.16666667%;
}
.col:first-child{
  /*offset=2*/
  margin-left: 8.33333333%;
}
.col:nth-child(3n+1){
  margin-left: 8.33333333%;
}
.col:nth-child(n+4){
  margin-top: 17px;
}
</style>
