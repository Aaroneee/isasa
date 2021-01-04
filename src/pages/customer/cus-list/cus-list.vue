<template>
  <div>
    <baseNavBar title="客资列表"/>
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item.id" @click="clickItem(item.id)" >
        <p :style="{color:item.gradeColor}">姓名:{{item.name}}</p>
        <van-row>
          <van-col span="12">微信:{{item.weChat}}</van-col>
          <van-col span="12">手机:{{item.phone}}</van-col>
        </van-row>
        <van-row>
          <van-col span="12">来源:{{item.source}}</van-col>
          <van-col span="12">状态:{{item.state}}</van-col>
        </van-row>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import baseNavBar from '../../../components/nav-bar/base-nav-bar'

export default {
  name: "cus-list",
  data(){
    return {
      list: [],
      loading: false,
      finished: false,
    }
  },
  components: {
    baseNavBar
  },
  created() {
    this.queryCusList();
  },
  methods:{
    //查询客资列表
    queryCusList:function (){
      this.axios({
        method:"get",
        url:"/customer/customerList",
        params:{
          tenantCrop:1
        }
      }).then(response=>{
        if (response.data.code===200){
          this.list=response.data.data.list
          this.finished=true;
        }
      })
    },
    //点击每个item
    clickItem:function (id){
      this.$router.push({name:"cusDetails",params:{cusId:id}})
    },
    onLoad:function (){

    }
  }
}
</script>

<style scoped>

</style>