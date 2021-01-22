<template>
  <div>
    <van-sticky >
      <switchNavBar title="收款列表" switchText="日期" @flag="dateSectionShow=true"/>
      <van-search
          @search="queryProceedsList"
          v-model="searchValue"
          placeholder="请输入搜索关键词"/>
      <van-calendar safe-area-inset-bottom v-model="dateSectionShow" type="range" @confirm="dateSectionConfirm"/>
      <van-dropdown-menu>
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
        <van-cell v-for="item in proceedsList" :key="item.id" @click="clickItem(item.id)">
          <van-row style="margin-bottom: 2%">
            <van-col span="12">姓名:{{ item.name }}</van-col>
            <van-col span="12">订单编号:{{ item.orderNo }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">下单时间:{{ item.createDate }}</van-col>
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
  name: "proceeds-list",
  components:{
    switchNavBar
  },
  data(){
    return{
      tenantCrop:localStorage.getItem("tenantCrop"),
      dateSectionShow:false,

      loading:"",
      finished:"",
      proceedsList:[],


      payeeArray:[{text:"收款人",value:""}],
      proceedsNameArray:[{text:"收款项目",value:""}],

      searchValue:"",
      createDate:"",
      payee:"",
      proceedsName:""
    }
  },
  created() {
    this.queryProceedsList();
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
          proceedsName:this.proceedsName
        }
      }).then(response=>{
        this.proceedsList=response.data.data.list;
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
  }

}
</script>

<style scoped>

</style>