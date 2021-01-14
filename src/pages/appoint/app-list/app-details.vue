<template>
  <div>
    <baseNavBar title="预约详情"/>
    <div v-cloak>
      <van-cell-group>
        <van-cell title="姓名:" :value="appointVo.name" />
        <van-cell title="手机号:" :value="appointVo.phone" />
        <van-cell title="微信号:" :value="appointVo.weChat" />
        <van-cell title="预约日期:" :value="appointVo.createDate"  />
        <van-cell title="到店日期:" v-cloak :value="appointVo.appointDate"  />
        <van-cell title="到店时间:" v-cloak :value="appointVo.appointTime"  />
        <van-cell title="预约项目:" :value="appointVo.appointName"  />
        <van-cell title="预约城市:" :value="appointVo.appointCity"/>
        <van-cell title="预约店铺:" :value="appointVo.appointShop"/>
        <van-cell title="预约人:" :value="appointVo.inviter"/>
        <van-cell title="分配房间:" :value="appointVo.room"/>
        <van-cell title="备注:" :label="appointVo.appointRemark" />
      </van-cell-group>
    </div>
    <br>
    <van-row>

      <van-col span="6" offset="2">
        <van-button @click="openAppEdit" type="warning" style="width: 100%" >预约编辑</van-button>
      </van-col>
      <van-col span="6"  offset="1">
        <van-button @click="openArrival" type="info" style="width: 100%">预约到店</van-button>
      </van-col>
      <van-col span="6"  offset="1">
        <van-button @click="openOrderAdd" type="primary" style="width: 100%">添加订单</van-button>
      </van-col>
    </van-row>
  </div>


</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"
export default {
  name: "app-details",
  components:{
    baseNavBar
  },
  data(){
    return{
      appId:this.$route.query.id,
      appointVo:{}
    }
  },
  created() {
    this.queryAppointVo();
  },
  methods:{
    queryAppointVo:function (){
      this.$axios({
        method:"GET",
        url:"/appoint/queryAppointVoById",
        params:{
          id:this.appId
        }
      }).then(response=>{
        if (response.data.code!==200){
          this.$toast.fail(response.data.msg); return;
        }
        this.appointVo=response.data.data;
      })
    },
    openAppEdit:function (){
      this.$router.push({name:"appEdit",query:{id:this.$route.query.id}})
    },
    openArrival:function (){

    },
    openOrderAdd:function (){

    },
  }
}
</script>

<style scoped>
  [v-cloak]{
    display: none;
  }
</style>