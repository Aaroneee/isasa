<template>
  <div>
      <van-sticky>
        <switchNavBar :title="titleText" switchText="到店日期" @flag="createDateShow=true"/>
        <div style="z-index: 999;position: absolute;width: 70%;
      left:0; right:0; top:12px;margin: auto">
          <div style="text-align: center;">
            <van-icon name="arrow-left" size="20" color="#1989fa" @click="dayBefore()"/>
            <div style="display: inline-block;width:60%"></div>
            <van-icon name="arrow" size="20" color="#1989fa" @click="nextDay()"/>
          </div>
        </div>
        <form action="javascript:return true">
          <van-search
              @search="queryAppList"
              v-model="searchValue"
              placeholder="请输入搜索关键词"/>
        </form>
        <van-calendar v-model="createDateShow" :min-date="minDate" :max-date="maxDate" @confirm="createDateOnConfirm"/>
        <van-dropdown-menu>
          <van-dropdown-item v-model="appointName" @change="appointNameChange"
                             :options="appointNameArray"/>
          <van-dropdown-item v-model="inviter" @change="inviterChange" :options="inviterArray"/>
          <van-dropdown-item v-model="appointDress" @change="appointDressChange"
                             :options="appointDressArray"/>
          <van-dropdown-item v-model="appointShop" @change="appointShopChange"
                             :options="appointShopArray"/>
        </van-dropdown-menu>
      </van-sticky>
      <div>
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            style="margin-bottom: 40px"
        >
          <van-cell style="font-size: 12px" v-for="item in appointList" :key="item.id" v-show="item.isValid !=='3'">
            <div @click="clickItem(item.id)">
              <van-row  style="padding-bottom: 5px">
                <van-col style="color: #39a9ed;font-size: 15px" span="12">预约档期:{{ item.appointTime }}</van-col>
                <van-col style="color: coral;font-size: 15px;" span="12">{{ item.appStateName }}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">姓名:{{ item.name }}</van-col>
                <van-col span="12">手机号:{{item.phone}}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">来源:{{ item.sourceName }}</van-col>
                <van-col span="12">预约项目:{{ item.appointName }}</van-col>
              </van-row>
<!--              <van-row>-->
<!--                <van-col span="12">城市:{{ item.appointCity }}</van-col>-->
<!--                <van-col span="12">店铺:{{ item.appointShop }}</van-col>-->
<!--              </van-row>-->
              <van-row>
                <van-col span="8">预约人:{{ item.inviter }}</van-col>
                <van-col span="8">礼服师:{{ item.appointDress }}</van-col>
                <van-col span="8">化妆师:{{ item.appointCosmetics }}</van-col>
              </van-row>
              <van-row>
                <van-col span="24">备注:{{ item.appointRemark }}</van-col>
              </van-row>
            </div>
            <van-row style="margin-top: 5px">
              <van-col span="5" style="padding-top: 6px">
                <van-popover
                    v-model="item.flag"
                    trigger="click"
                    :actions="actions"
                    placement="bottom-start"
                    @select="select"
                >
                  <template #reference>
                    <van-col v-if="actions.length !== 0" style="color: #969799;" @click="chooseApp(item)">更多</van-col>
                  </template>
                </van-popover>
              </van-col>
              <per-button size="small" round :span="6" per="app_details:arrival" @click="arrival(item)">预约到店</per-button>
              <per-button style="margin-left: 2%" size="small" round :span="6" per="app_details:add_yarn_clothes" @click="openAddYarnClothes(item)">添加试纱</per-button>
              <per-button style="margin-left: 2%" size="small" round :span="6" per="app_details:add_order" @click="openOrderAdd(item)">添加订单</per-button>
            </van-row>
          </van-cell>
        </van-list>
      </div>
    </div>
</template>

<script>
import switchNavBar from '@/components/nav-bar/switch-nav-bar'

export default {
  name: "appScheduleList",
  data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      appointList: [],
      searchValue: "",
      loading: false,
      finished: false,
      mobileViewId: this.$route.query.id,
      popupShow: false,
      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

      titleText: this.$dateUtils.vantDateToYMD(new Date()) +' ' + this.$dateUtils.getweekday(new Date()),
      createDateShow: false,
      appointNameArray: [{text: "项目", value: ""}],
      inviterArray: [{text: "预约人", value: ""}],
      appointDressArray: [{text: "礼服师", value: ""}],
      appointShopArray: [{text: "店铺", value: ""}],

      appointDate: this.$dateUtils.vantDateToYMD(new Date()),
      appointName: "",
      inviter: "",
      appointDress: "",
      appointShop: "",
      state: "",
      isHide: "",
      actions: [],
      moreActions: [],
    }
  },
  components: {
    switchNavBar: switchNavBar,
  },
  created() {
    this.$selectUtils.queryPhoneIsHide(this.mobileViewId).then(response => {
      this.isHide = response.data.data
    })
    this.queryAppList();
    this.queryAppointName();
    this.queryInviter();
    this.queryAppointDress();
    this.queryAppointShop();
    this.queryMorePermission()
  },
  methods: {
    // 查询更多里面的权限
    queryMorePermission() {
      for (let i = 0, len = this.$store.state.permission.length; i < len; i++) {
        if (this.$store.state.permission[i] === 'app_details:app_edit') {
          this.actions.push({text: '预约编辑'})
        } else if (this.$store.state.permission[i] === 'app_details:cancel_app') {
          this.actions.push({ text: '取消预约'})
        }
      }
    },
    //日历确认
    createDateOnConfirm: function (time) {
      this.appointDate = this.$dateUtils.vantDateToYMD(time);
      this.titleText = this.$dateUtils.vantDateToYMD(time)  +' ' + this.$dateUtils.getweekday(time);
      this.queryAppList();
      this.createDateShow = false;
    },
    inviterChange: function (value) {
      this.inviter = value;
      this.queryAppList();
    },
    appointNameChange: function (value) {
      this.appointName = value;
      this.queryAppList();
    },
    appointDressChange: function (value) {
      this.appointDress = value;
      this.queryAppList();
    },
    appointShopChange: function (value) {
      this.appointShop = value;
      this.queryAppList();
    },
    clickItem: function (id) {
      this.$router.push({name: "appDetails", query: {id: id,pageSource:'appScheduleList',mobileViewId:this.mobileViewId}})
    },
    //前一天
    dayBefore:function (){
      //获取顶部当前日期
      let date=new Date(this.appointDate);
      date.setDate(date.getDate()-1);
      //日期格式化后字符串
      let dateStr=this.$dateUtils.vantDateToYMD(date);
      this.appointDate=dateStr;
      this.titleText=dateStr+' '+this.$dateUtils.getweekday(date)
      this.queryAppList();
    },
    //后一天
    nextDay :function (){
      //获取顶部当前日期
      let date=new Date(this.appointDate);
      date.setDate(date.getDate()+1);
      //日期格式化后字符串
      let dateStr=this.$dateUtils.vantDateToYMD(date);
      this.appointDate=dateStr;
      this.titleText=dateStr+' '+this.$dateUtils.getweekday(date)
      this.queryAppList();
    },


    queryAppList: function () {
      this.$axios({
        method: "GET",
        url: "/appoint/mAppointList",
        params: {
          value: this.searchValue,
          appointDate: this.appointDate,
          appointName: this.appointName,
          inviter: this.inviter,
          appointDress: this.appointDress,
          appointShop: this.appointShop,
          tenantCrop: this.tenantCrop,
          mobileViewId: this.mobileViewId,
          shopIds: localStorage.getItem("shopIds"),
        }
      }).then(response => {
        response.data.data.list.forEach(s => s['flag'] = false)
        this.appointList = []
        this.appointList.push(...response.data.data.list)
        if (this.isHide === 1) {
          let stringUtils=this.$stringUtils;
          this.appointList.forEach(function (element) {
            element.phone = stringUtils.phoneIsHide(element.phone);
          })
        }
        this.finished = true;
      })
    },
    //查询预约项目
    queryAppointName: function () {
      this.$selectUtils.queryProjectsIds(this.$projectsType.appoint, this.$selectUtils.DropDownMenu).then(response => {
        this.appointNameArray.push(...JSON.parse(response.data.data));
      })
    },
    //查询预约人
    queryInviter: function () {
      this.$selectUtils.queryEmpIds(this.$selectUtils.DropDownMenu).then(response => {
        this.inviterArray.push(...JSON.parse(response.data.data));
      })
    },
    //查询礼服师
    queryAppointDress: function () {
      this.$selectUtils.queryDressIds(this.$selectUtils.DropDownMenu).then(response => {
        this.appointDressArray.push(...JSON.parse(response.data.data));
      })
    },
    //查询店铺
    queryAppointShop: function () {
      this.$selectUtils.queryShopIds(this.$selectUtils.DropDownMenu).then(response => {
        this.appointShopArray.push(...JSON.parse(response.data.data));
      })
    },
    arrival(val) {
      if (val.isValid==="3"){
        this.$toast.fail("该条预约已取消,不可到店!");
        return false;
      }
      this.$router.push({name: "appArrival", query: {id: val.id}})
    },
    openAppEdit(val) {
      this.$router.push({name: "appEdit", query: {id: val.id}})
    },
    cancelApp(item) {
      if (item.isValid === '2') {
        this.$toast.fail("当前预约已到店，不可进行取消")
        return false;
      }
      if (item.isValid === '3') {
        this.$toast.fail("当前预约已取消，请勿重复操作")
        return false;
      }
      this.$dialog.confirm({
        title: '取消预约',
        message: '确定要取消 '+item.name+" 的这条预约?",
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/appoint/cancelAppointById",
          params: {
            id: item.id,
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
    chooseApp(val) {
      this.moreActions = val
    },
    select(val) {
      switch (val.text) {
        case "预约编辑":
          this.openAppEdit(this.moreActions)
          break
        case "取消预约":
          this.cancelApp(this.moreActions)
          break
      }
    },
    openOrderAdd(val) {
      if (val.isValid==="3"){
        this.$toast.fail("取消的预约不能添加订单");
        return false;
      }
      //如果还未到店应提示是否先选择到店
      if (val.isValid==="1"){
        this.$dialog.confirm({
          title: '预约尚未到店',
          message: "预约尚未到店,是否先进行到店操作?",
        }).then(() => {
          this.$router.push({name: "appArrival", query: {id: val.id}})
        })
        return false;
      }
      this.$router.push({name: "orderAdd", query: {appointVo: val}});
    },
    openAddYarnClothes(val) {
      if (val.isValid==="3"){
        this.$toast.fail("取消的预约不能添加试纱");
        return false;
      }
      //如果还未到店应提示是否先选择到店
      if (val.isValid==="1"){
        this.$dialog.confirm({
          title: '预约尚未到店',
          message: "预约尚未到店,是否先进行到店操作?",
        }).then(() => {
          this.$router.push({name: "appArrival", query: {id: val.id}})
        })
        return false;
      }
      this.$router.push({name:"addYarnClothes", query: {appointVo: val, pageSource: 'appScheduleList'}})
    },
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'work') {
      this.$store.commit('setKeepAlive', [])
    } else {
      this.$store.commit('setKeepAlive', ['appScheduleList'])
    }
    next()
  },
  beforeRouteEnter(to, from, next) {
    if (from.name !== 'work') {
      next(vm => {
        vm.queryAppList()
      })
    }
    next()
  }
}
</script>

<style scoped>
.right{
  text-align: right;
}
</style>
