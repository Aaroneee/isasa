<template>
  <div>
    <switchNavBar title="添加收款" switchText="历史收款" @flag="proceedsHistoryShow=true"/>
    <van-popup v-model="proceedsHistoryShow" round position="bottom" :style="{ height: '30%' }" >
      <van-collapse v-model="activeNames">
        <van-collapse-item v-for="item in proceedsHistoryArray" :key="item.id"
                           :title="item.createDate+'\u3000\u3000'+item.proceedsName+'\u3000\u3000'+item.payee"
                           :name="item.id">
          <van-cell-group>
            <van-cell title="订单总价" :value="item.orderPrice" />
            <van-cell title="收款金额" :value="item.spareMoney" />
            <van-cell title="收款方式" :value="item.payment" />
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>


    </van-popup>
  </div>
</template>

<script>

import switchNavBar from "@/components/nav-bar/switch-nav-bar"

export default {
  name: "proceeds-add",
  data(){
    return{
      id:this.$route.query.id,
      tenantCrop:localStorage.getItem("tenantCrop"),
      proceedsHistoryShow:false,

      //收款历史记录
      proceedsHistoryArray:[],
      activeNames: ['1'],
    }
  },
  components:{
    switchNavBar
  },
  created() {
    this.queryProceedsList();
  },
  methods:{
    queryProceedsList:function (){
      this.$axios({
        method:"GET",
        url:"/proceeds/proceedsList",
        params:{
          orderId:this.id,
          tenantCrop:this.tenantCrop,
        }
      }).then(response=>{
        if (response.data.total===0){
          this.$toast.fail("此订单无收款历史记录")
          return;
        }
        console.log(response)
        this.proceedsHistoryArray=response.data.data.list;
        console.log(this.proceedsHistoryArray)
      })
    },
  }
}
</script>

<style scoped>

</style>