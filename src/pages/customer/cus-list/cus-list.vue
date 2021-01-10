<template>
  <div>
    <div>
      <baseNavBar title="客资列表"/>
      <van-search
          @search="queryCusList"
          v-model="searchValue"
          placeholder="请输入搜索关键词" />
      <van-dropdown-menu>
        <van-dropdown-item :title="sourceTitle" v-model="source" @change="sourceChange" :options="sourceArray" />
        <van-dropdown-item :title="gradeTitle" v-model="grade" @change="gradeChange" :options="gradeArray" />
        <van-dropdown-item :title="stateTitle" v-model="state" @change="stateChange" :options="stateArray" />
        <van-dropdown-item :title="serviceTitle" v-model="service" @change="serviceChange" :options="serviceArray" />
      </van-dropdown-menu>
    </div>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
      >
        <van-cell v-for="item in customerList" :key="item.id" @click="clickItem(item.id)" >
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
      customerList: [],
      loading: false,
      finished: false,
      //顶部搜索
      searchValue:"",
      //客资来源下拉
      sourceTitle:"客资渠道",
      source:"",
      sourceArray:[{text:"客资渠道",value: ""}],
      //意愿程度
      gradeTitle:"客资意愿",
      grade:"",
      gradeArray:[{text:"客资意愿",value: ""}],
      //客资状态
      stateTitle:"客资状态",
      state:"",
      stateArray:[{text:"客资状态",value: ""}],
      //客服
      serviceTitle:"选择客服",
      service:"",
      serviceArray:[{text:"选择客服",value: ""}]
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
          source:this.source,
          grade:this.grade,
          state:this.state,
          service:this.service,
          tenantCrop:1
        }
      }).then(response=>{
        if (response.data.code===200){
          this.customerList=response.data.data.list
          this.finished=true;
        }
      })
    },

    //查询渠道
    querySourceIds:function (){
      this.selectUtils.querySourceIds(2,1).then(response => {
        if (response.data.code === 200) {
          this.sourceArray.push(...response.data.data);
        } else {
          self.$toast.fail(response.data.msg);
        }
      })
    },
    //点击渠道
    sourceChange:function (val){
      this.source=val;
      this.queryCusList();
      this.sourceTitle= this.sourceArray.find(value => {
          return value.value===val;
      }).text;

    },

    //查询意愿
    queryGradeIds:function (){
      this.selectUtils.queryGradeIds(2,1).then(response => {
        if (response.data.code === 200) {
          this.gradeArray.push(...response.data.data);
        } else {
          self.$toast.fail(response.data.msg);
        }
      })
    },
    //点击意愿
    gradeChange:function (val){
      this.grade=val;
      this.queryCusList();
      this.gradeTitle= this.gradeArray.find(value => {
        return value.value===val;
      }).text;
    },

    //查询状态
    queryStateIds:function (){
      this.selectUtils.queryStateIds(2).then(response => {
        if (response.data.code === 200) {
          this.stateArray.push(...response.data.data);
        } else {
          self.$toast.fail(response.data.msg);
        }
      })
    },
    //点击状态
    stateChange:function (val){
      this.state=val;
      this.queryCusList();
      this.stateTitle= this.stateArray.find(value => {
        return value.value===val;
      }).text;
    },

    //查询客服
    queryServiceIds:function (){
      this.selectUtils.queryServiceIds(2,1).then(response => {
        if (response.data.code === 200) {
          this.serviceArray.push(...response.data.data);
        } else {
          self.$toast.fail(response.data.msg);
        }
      })
    },
    //点击客服
    serviceChange:function (val){
      this.service=val;
      this.queryCusList();
      this.serviceTitle= this.serviceArray.find(value => {
        return value.value===val;
      }).text;
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