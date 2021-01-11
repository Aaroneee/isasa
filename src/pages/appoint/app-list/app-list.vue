<template>
  <div>
    <van-sticky>
      <baseNavBar title="客资列表"/>
      <van-search
          @search="queryAppList"
          v-model="searchValue"
          placeholder="请输入搜索关键词" />
<!--      <van-dropdown-menu>-->
<!--        <van-dropdown-item :title="sourceTitle" v-model="source" @change="sourceChange" :options="sourceArray" />-->
<!--        <van-dropdown-item :title="gradeTitle" v-model="grade" @change="gradeChange" :options="gradeArray" />-->
<!--        <van-dropdown-item :title="stateTitle" v-model="state" @change="stateChange" :options="stateArray" />-->
<!--        <van-dropdown-item :title="serviceTitle" v-model="service" @change="serviceChange" :options="serviceArray" />-->
<!--      </van-dropdown-menu>-->
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
      >
        <van-cell v-for="item in appointList" :key="item.id" @click="clickItem(item.id)" >
          <p>姓名:{{item.name}}</p>
          <van-row>
            <van-col span="12">预约时间:{{item.createDate}}</van-col>
            <van-col span="12">到店时间:{{item.appointDate}}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">预约项目:{{item.source}}</van-col>
            <van-col span="12">预约店铺:{{item.state}}</van-col>
          </van-row>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "app-list",
  components:{
    baseNavBar
  },
  data(){
    return{
      appointList:[],
      searchValue:"",
      loading: false,
      finished: false,

      createDate:"",
      appointName:"",
      appointDress:"",
      appointShop:"",
      state:"",
      inviter:"",
      tenantCrop:"",

    }
  },
  created() {
    this.queryAppList();
  },
  methods:{
    queryAppList:function (){
      this.axios({
        method:"GET",
        url:"/appoint/mAppointList",
        params:{
          value:this.searchValue,
          createDate:this.createDate,
          appointName:this.appointName,
          appointDress:this.appointDress,
          appointShop:this.appointShop,
          state:this.state,
          inviter:this.inviter,
          tenantCrop:1
        }
      }).then(response=>{
        this.appointList=response.data.data.list
        console.log(response)
      })
    },
  }
}
</script>

<style scoped>

</style>