<template>
  <div>
    <baseNavBar title="收款详情"/>
    <div v-cloak>
      <van-cell-group>
        <van-cell title="姓名:" :value="proceedsVo.name" />
        <van-cell title="手机号:" :value="proceedsVo.phone" />
        <van-cell title="订单编号:" :value="proceedsVo.orderNo"  />
        <van-cell title="收款日期:" :value="proceedsVo.createDate"  />
        <van-cell title="收款项目:" :value="proceedsVo.proceedsName"  />
        <van-cell title="收款方式:" :value="proceedsVo.payment"  />
        <van-cell title="收款人:"  :value="proceedsVo.payee"  />
        <van-cell title="订单总价:" :value="proceedsVo.orderPrice"  />
        <van-cell title="收款金额:" :value="proceedsVo.spareMoney"  />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "proceeds-details",
  data(){
    return{
      id:this.$route.query.id,
      proceedsVo:{},
    }
  },
  components:{
    baseNavBar
  },
  created() {
    this.queryProceedsVo();
  },
  methods:{
    //查询收款VO
    queryProceedsVo:function (){
      this.$axios({
        method:"GET",
        url:"/proceeds/queryProceedsVoById",
        params:{
          id:this.id
        }
      }).then(response=>{
        this.proceedsVo=response.data.data;
      })
    },
  }
}

</script>

<style scoped>

</style>