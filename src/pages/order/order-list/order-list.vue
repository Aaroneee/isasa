<template>
  <div>
    <div>
      <van-sticky>
        <switchNavBar title="订单列表" switchText="日期" @flag="createDateOpen"/>
        <van-search
            @search="queryOrderList"
            v-model="searchValue"
            placeholder="请输入搜索关键词"/>
        <van-calendar safe-area-inset-bottom v-model="createDateShow" type="range" @confirm="createDateOnConfirm"/>
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
          <van-cell v-for="item in orderList" :key="item.id">
            <div  @click="clickItem(item.id)">
              <p>姓名:{{ item.name }}</p>
              <van-row>
                <van-col span="12">订单编号:{{ item.orderNo }}</van-col>
                <van-col span="12" style="text-align: right">订单项目:{{ item.orderName }}</van-col>
              </van-row>
              <van-row>
                <van-col span="12" >下单时间:{{ item.createDate }}</van-col>
                <van-col span="12" style="text-align: right">婚期:{{ item.weddingDay }}</van-col>
              </van-row>
              <van-row>
                <van-col span="8">订单总价:{{ item.orderPrice }}</van-col>
                <van-col span="8" style="text-align: center">收款:{{ item.spareMoney }}</van-col>
                <van-col span="8" style="text-align: right">余款:{{ item.orderSpare }}</van-col>
              </van-row>
            </div>
            <br>
            <van-row>
              <van-col span="8" offset="3" style="text-align: center;color: darkgreen" @click="proceedsAdd(item)">添加收款</van-col>
              <van-col span="8" offset="1" style="text-align: center">添加收款</van-col>
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
  name: "order-list",
  components:{
    switchNavBar
  },
  data(){
    return{
      orderList:[],
      //打开时间
      createDateShow:false,
      searchValue:"",
      createDate:"",

      loading: false,
      finished: false,
    }
  },
  created() {
    this.queryOrderList();
  },
  methods:{
    //打开日期选择
    createDateOpen:function (flag){
      this.createDateShow=flag;
    },
    //时间确认
    createDateOnConfirm:function (time){
      this.createDate = this.$dateUtils.rangeVantDateToYMD(time);
      this.queryOrderList();
      this.createDateShow=false;
    },
    //点击每个item
    clickItem:function (id){
      this.$router.push({name:"orderDetails",query:{id:id}})
    },
    //点击增加收款
    proceedsAdd:function (item){
      this.$router.push({
        name:"proceedsAdd",
        query:{
          id:item.id,
          cusId:item.cusId,
          orderPrice:item.orderPrice,
          spareMoney:item.spareMoney
        }
      })
    },



    //查询订单列表
    queryOrderList:function (){
      this.$axios({
        method:"GET",
        url:"/order/mOrderList",
        params:{
          searchValue:this.searchValue,
          createDate:this.createDate,
          tenantCrop:localStorage.getItem("tenantCrop"),
        }
      }).then(response=>{
        this.orderList=response.data.data.list;
        console.log(this.orderList)
        this.finished=true;
      })
    },
  }
}
</script>

<style scoped>

</style>