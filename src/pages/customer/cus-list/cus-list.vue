<template>
  <div>
    <div>
      <baseNavBar title="客资列表"/>
      <van-search
          @search="queryCusList"
          v-model="searchValue"
          placeholder="请输入搜索关键词" />
      <van-dropdown-menu>
        <van-dropdown-item title="客资渠道" @change="sourceChange" v-model="sourceValue" :options="sourceArray" />
        <van-dropdown-item title="客资意愿" @change="gradeChange" v-model="gradeValue" :options="gradeArray" />
        <van-dropdown-item title="客资状态" @change="stateChange" v-model="stateValue" :options="stateArray" />
        <van-dropdown-item title="选择客服" @change="serviceChange" v-model="serviceValue" :options="serviceArray" />
      </van-dropdown-menu>
    </div>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
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

  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "cus-list",
  data(){
    return {
      //List
      list: [],
      loading: false,
      finished: false,
      //顶部搜索
      searchValue:"",
      //客资来源下拉
      sourceValue:"",
      sourceArray:[],
      //意愿程度
      gradeValue:"",
      gradeArray:[],
      //客资状态
      stateValue:"",
      stateArray:[],
      //客服
      serviceValue:"",
      serviceArray:[]
    }
  },
  components: {
    baseNavBar
  },
  created() {
    this.queryCusList();

    this.querySourceIds();
    this.queryGradeIds();
    this.queryStateIds();
    this.queryServiceIds();
  },

  methods:{
    //查询客资列表
    queryCusList:function (val){
      this.axios({
        method:"get",
        url:"/customer/mCustomerList",
        params:{
          value:val,
          tenantCrop:1
        }
      }).then(response=>{
        if (response.data.code===200){
          this.list=response.data.data.list
          this.finished=true;
        }
      })
    },

    //查询渠道
    querySourceIds:function (){
      this.selectUtils.querySourceIds(2,1).then(response => {
        if (response.data.code === 200) {
          this.sourceArray=response.data.data
        } else {
          self.$toast.fail(response.data.msg);
        }
      })
    },
    //点击渠道
    sourceChange:function (val){
      console.log(val)
    },

    //查询意愿
    queryGradeIds:function (){
      this.selectUtils.queryGradeIds(2,1).then(response => {
        if (response.data.code === 200) {
          this.gradeArray=response.data.data
        } else {
          self.$toast.fail(response.data.msg);
        }
      })
    },
    //点击意愿
    gradeChange:function (val){
      console.log(val)
    },

    //查询状态
    queryStateIds:function (){
      this.selectUtils.queryStateIds(2).then(response => {
        if (response.data.code === 200) {
          this.stateArray=response.data.data
          console.log(this.stateArray)
        } else {
          self.$toast.fail(response.data.msg);
        }
      })
    },
    //点击状态
    stateChange:function (val){
      console.log(val)
    },

    //查询客服
    queryServiceIds:function (){
      this.selectUtils.queryServiceIds(2,1).then(response => {
        if (response.data.code === 200) {
          this.serviceArray=response.data.data
        } else {
          self.$toast.fail(response.data.msg);
        }
      })
    },
    //点击客服
    serviceChange:function (val){
      console.log(val)
    },

    //点击每个Listitem
    clickItem:function (id){
      this.$router.push({name:"cusDetails",query:{cusId:id}})
    },
  }
}
</script>

<style scoped>

</style>