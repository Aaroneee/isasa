<template>
  <div>
    <baseNavBar title="预约详情" :fixed="true"/>
    <div v-cloak>
      <van-cell-group>
        <van-cell title="姓名:" :value="appointVo.name"/>
        <van-cell title="手机号:" :value="appointVo.phone"/>
        <van-cell title="微信号:" :value="appointVo.weChat"/>
        <van-cell title="预约日期:" :value="appointVo.createDate"/>
        <van-cell title="到店日期:" v-cloak :value="appointVo.appointDate"/>
        <van-cell title="到店时间:" v-cloak :value="appointVo.appointTime"/>
        <van-cell title="预约项目:" :value="appointVo.appointName"/>
        <van-cell title="预约城市:" :value="appointVo.appointCity"/>
        <van-cell title="预约店铺:" :value="appointVo.appointShop"/>
        <van-cell title="预约人:" :value="appointVo.inviter"/>
        <van-cell title="礼服师:" :value="appointVo.appointDress"/>
        <van-cell title="化妆师:" :value="appointVo.appointCosmetics"/>
        <van-cell title="分配房间:" :value="appointVo.room"/>
        <van-cell title="备注:" :label="appointVo.appointRemark"/>
      </van-cell-group>
    </div>
    <br>
    <van-row>
      <per-button @click="openAppEdit" type="warning" :span="6" per="app_details:app_edit">预约编辑</per-button>
      <per-button @click="openArrival" type="info" :span="6" per="app_details:arrival">预约到店</per-button>
      <per-button @click="openOrderAdd" type="primary" :span="6" per="app_details:add_order">添加订单</per-button>
      <per-button @click="openAddYarnClothes" color="#2f4056" :span="6" per="app_details:add_yarn_clothes">添加试纱</per-button>
      <per-button @click="cancelApp" color="#EA3311" :span="6" per="app_details:cancel_app">取消预约</per-button>
    </van-row>
    <br>
  </div>


</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "app-details",
  components: {
    baseNavBar
  },
  data() {
    return {
      appId: this.$route.query.id,
      appointVo: {},
      pageSource: this.$route.query.pageSource,
      mobileViewId: this.$route.query.mobileViewId,
      isHide:"",
    }
  },
  created() {
    this.$selectUtils.queryPhoneIsHide(this.mobileViewId).then(response => {
      this.isHide = response.data.data
    })
    this.queryAppointVo();
  },
  methods: {
    queryAppointVo: function () {
      this.$axios({
        method: "GET",
        url: "/appoint/queryAppointVoById",
        params: {
          id: this.appId,
        }
      }).then(response => {
        if (response.data.code !== 200) {
          this.$toast.fail(response.data.msg);
          return;
        }
        this.appointVo = response.data.data;
        if (this.isHide === 1) {
          this.appointVo.phone = this.$stringUtils.phoneIsHide(this.appointVo.phone);
        }
      })
    },
    openAppEdit: function () {
      this.$router.push({name: "appEdit", query: {id: this.$route.query.id}})
    },
    openArrival: function () {
      if (this.appointVo.isValid==="3"){
        this.$toast.fail("该条预约已取消,不可到店!");
        return false;
      }
      this.$router.push({name: "appArrival", query: {id: this.$route.query.id}})
    },
    openOrderAdd: function () {
      if (this.appointVo.isValid==="3"){
        this.$toast.fail("取消的预约不能添加订单");
        return false;
      }
      //如果还未到店应提示是否先选择到店
      if (this.appointVo.isValid==="1"){
        this.$dialog.confirm({
          title: '预约尚未到店',
          message: "预约尚未到店,是否先进行到店操作?",
        }).then(() => {
          this.$router.push({name: "appArrival", query: {id: this.$route.query.id}})
        })
        return false;
      }
      this.$router.push({name: "orderAdd", query: {appointVo: this.appointVo}});
    },
    openAddYarnClothes: function () {
      if (this.appointVo.isValid==="3"){
        this.$toast.fail("取消的预约不能添加试纱");
        return false;
      }
      //如果还未到店应提示是否先选择到店
      if (this.appointVo.isValid==="1"){
        this.$dialog.confirm({
          title: '预约尚未到店',
          message: "预约尚未到店,是否先进行到店操作?",
        }).then(() => {
          this.$router.push({name: "appArrival", query: {id: this.$route.query.id}})
        })
        return false;
      }
      this.$store.commit('setKeepAlive', ['addYarnClothes',this.pageSource])
      this.$router.push({name:"addYarnClothes", query: {appointVo: this.appointVo,pageSource: this.pageSource}})
    },
    //取消预约
    cancelApp:function (){
      if (this.appointVo.isValid === '2') {
        this.$toast.fail("当前预约已到店，不可进行取消")
        return false;
      }
      if (this.appointVo.isValid === '3') {
        this.$toast.fail("当前预约已取消，请勿重复操作")
        return false;
      }
      this.$dialog.confirm({
        title: '取消预约',
        message: '确定要取消 '+this.appointVo.name+" 的这条预约?",
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/appoint/cancelAppointById",
          params: {
            id: this.appId,
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("取消预约成功")
          } else {
            this.$toast.fail(response.data.msg);
          }
          this.queryAppointVo();
        })
      })
    },
  }
}
</script>

<style scoped>
[v-cloak] {
  display: none;
}
.col{
  /*offset=1*/
  margin-left: 4.16666667%;
}
.col:first-child{
  /*offset=2*/
  margin-left: 8.33333333%;
}
.col:nth-child(3n+1){
  margin-left: 8.33333333%;
}
.col:nth-child(n+4){
  margin-top: 17px;
}
</style>
