<template>
  <div>
    <van-sticky >
      <switchNavBar  title="收款列表" switchText="日期" @flag="dateSectionShow=true"/>
      <form action="javascript:return true">
      <van-search
          @search="queryProceedsList"
          v-model="searchValue"
          placeholder="请输入搜索关键词"/>
      </form>
      <van-calendar safe-area-inset-bottom v-model="dateSectionShow" :min-date="minDate" :max-date="maxDate" type="range" @confirm="dateSectionConfirm"/>
      <van-dropdown-menu>
        <van-dropdown-item v-model="shop" @change="shopChange"
                           :options="shopArray"/>
        <van-dropdown-item v-model="dress" @change="dressChange"
                           :options="dressArray"/>
        <van-dropdown-item v-model="payee" @change="payeeChange"
                           :options="payeeArray"/>
        <van-dropdown-item v-model="proceedsName" @change="proceedsNameChange"
                           :options="proceedsNameArray"/>
      </van-dropdown-menu>
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
      >
        <van-cell style="font-size: 12px" v-for="item in proceedsList" :key="item.id" @click="clickItem(item.id)">
          <van-row style="margin-bottom: 2%">
            <van-col span="12">姓名:{{ item.name }}</van-col>
            <van-col span="12">订单编号:{{ item.orderNo }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">收款时间:{{ item.createDate }}</van-col>
            <van-col span="12">收款项目:{{ item.proceedsName }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">订单金额:{{ item.orderPrice }}</van-col>
            <van-col span="12">收款金额:{{ item.spareMoney }}</van-col>
          </van-row>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar"

export default {
  name: "proceedsList",
  components:{
    switchNavBar
  },
  data(){
    return{
      tenantCrop:localStorage.getItem("tenantCrop"),
      dateSectionShow:false,

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

      loading:false,
      finished:false,
      proceedsList:[],

      shopArray:[{text:"店铺名称",value:localStorage.getItem("shopIds")}],
      payeeArray:[{text:"收款人",value:""}],
      dressArray:[{text:"礼服师",value:""}],
      proceedsNameArray:[{text:"收款项目",value:""}],

      searchValue:"",
      createDate:"",
      shop:localStorage.getItem("shopIds"),
      dress:"",
      payee:"",
      proceedsName:""
    }
  },
  created() {
    this.loading=true;
    this.queryProceedsList();
    this.queryShopIds();
    this.queryDressIds();
    this.queryPayeeIds();
    this.queryProceedsNameIds();
  },
  methods:{
    //日期确认
    dateSectionConfirm:function (time){
      this.createDate=this.$dateUtils.rangeVantDateToYMD(time);
      this.queryProceedsList();
      this.dateSectionShow=false;
    },
    //店铺确认
    shopChange:function (value){
      this.shop=value;
      this.queryProceedsList();
    },
    //礼服师确认
    dressChange:function (value){
      this.dress=value;
      this.queryProceedsList();
    },
    //收款人确认
    payeeChange:function (value){
      this.payee=value;
      this.queryProceedsList();
    },
    //收款项目确认
    proceedsNameChange:function (value){
      this.proceedsName=value;
      this.queryProceedsList();
    },
    //点击每个Item
    clickItem:function (id){
      this.$router.push({name:"proceedsDetails",query:{id:id}})
    },

    //搜索收款
    queryProceedsList:function (){
      this.$axios({
        method:"GET",
        url:"/proceeds/mProceedsList",
        params:{
          tenantCrop:this.tenantCrop,
          searchValue:this.searchValue,
          createDate:this.createDate,
          payee:this.payee,
          dressId:this.dress,
          proceedsName:this.proceedsName,
          shopIds: this.shop,
        }
      }).then(response=>{
        this.proceedsList=response.data.data.list;
        this.proceedsList=this.proceedsList.filter(item => !(item.cusId === '' || item.proceedsName === '' || item.proceedsName.includes("利息","转账入")));
        this.loading=false;
        this.finished=true;
      })
    },

    //查询礼服师
    queryDressIds:function (){
      this.$selectUtils.queryDressIds(this.$selectUtils.DropDownMenu).then(response=>{
        this.dressArray.push(...JSON.parse(response.data.data));
      })
    },
    //查询店铺
    queryShopIds:function (){
      this.$selectUtils.queryShopIds(this.$selectUtils.DropDownMenu).then(response=>{
        this.shopArray.push(...JSON.parse(response.data.data));
      })
    },
    //查询收款人
    queryPayeeIds:function (){
      this.$selectUtils.queryPayeeIds(this.$selectUtils.DropDownMenu).then(response=>{
        this.payeeArray.push(...JSON.parse(response.data.data));
      })
    },
    //查询收款项目
    queryProceedsNameIds:function (){
      this.$selectUtils.queryProjectsIds(this.$projectsType.proceeds,this.$selectUtils.DropDownMenu).then(response=>{
        this.proceedsNameArray.push(...JSON.parse(response.data.data));
      })
    },
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'proceedsDetails') {
      this.$store.commit('setKeepAlive', ['proceedsList'])
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  }

}
</script>

<style scoped>

</style>
