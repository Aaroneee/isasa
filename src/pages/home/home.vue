<template>
  <div>
    <UserHeadComponents/>
    <van-overlay :show="overlay">
      <div class="wrapper">
        <van-loading type="spinner" vertical>{{loadText}}</van-loading>
      </div>
    </van-overlay>

    <div v-show="!overlay" style="height: 92vh;overflow:auto;margin-top: 30px;background-color: rgb(246,247,249)">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
    <van-tabbar v-show="!overlay" route style="height: 6vh">
      <van-tabbar-item to="/work" icon='wap-home-o'>工作台</van-tabbar-item>
      <van-tabbar-item to="/statistic" icon='bar-chart-o'>报表</van-tabbar-item>
      <van-tabbar-item to="/store" icon='shop-o'>商城</van-tabbar-item>
      <van-tabbar-item to="/message" icon='chat-o'>消息</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import UserHeadComponents from "@/components/user-head-component.vue";
//
export default {
  name: "home",
  data() {
    return {
      overlay:false,
      loadText:"",
      //判断三个方法是否执行完
      //为什么不用计数>=3?
      //因为有未知情况setLocalStorage进入多次,所以会导致有的单个方法执行了多次,所以计数不准确
      moduleFlag:false,
      buttonFlag:false,
      shopIdsFlag:false,
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 主要电脑调试用,手机不会进入此方法
      if (to.fullPath==="/"){
        vm.getData(localStorage.getItem("tenantCrop"),localStorage.getItem("empId"))
      }
    })
  },
  methods: {
     setLocalStorage: function (tenantCrop, empId, token) {
      this.overlay=true;
      localStorage.setItem("tenantCrop", tenantCrop);
      localStorage.setItem("empId", empId);
      localStorage.setItem("token", token);
      this.$axios.defaults.headers['empId'] = empId;
      this.$axios.defaults.headers['tenantCrop'] = tenantCrop;
      this.getData(tenantCrop,empId);
    },
    setIosVersion:function (version){
      localStorage.setItem("iosVersion", version);
    },
    getData(tenantCrop,empId){
      this.queryModules(tenantCrop, empId);
      this.queryButton(empId);
      this.queryShopIdsByEmpId(empId);
    },
    queryModules(tenantCrop, empId) {
      this.$axios({
        method: "GET",
        url: '/index/mobileManBar',
        params: {
          tenantCrop: tenantCrop,
          empId: empId,
        }
      }).then(response => {
        localStorage.setItem("modules", JSON.stringify(response.data.data));
        this.moduleFlag=true;
        this.loadingChange();
      })
    },
    queryButton(empId) {
      this.$axios({
        method: "GET",
        url: "/index/mobileButton",
        params: {
          empId: empId,
        }
      }).then(response => {
        this.$store.commit("setPermission", response.data.data)
        this.buttonFlag=true;
        this.loadingChange();
      })
    },
    queryShopIdsByEmpId(empId) {
      this.$axios({
        method: "GET",
        url: "/emp/queryEmpShopIdsByEmpId",
        params: {
          empId: empId
        }
      }).then(response => {
        localStorage.setItem("shopIds", response.data.data)
        this.shopIdsFlag=true;
        this.loadingChange();
      })
    },
    loadingChange(){
      let trueCount = [this.moduleFlag, this.buttonFlag, this.shopIdsFlag].filter(condition => condition === true).length;
      if (trueCount===1){
        this.loadText=(Math.floor(Math.random() * (60 - 20 + 1)) + 20)+"%";
      }else if (trueCount===2){
        this.loadText=(Math.floor(Math.random() * (99 - 61 + 1)) + 61)+"%";
      }else {
        this.overlay=false;
        this.$router.push({name: "work"})
      }
    }
  },
  components: {UserHeadComponents},
  mounted() {
    window.setLocalStorage = this.setLocalStorage
    window.setIosVersion = this.setIosVersion
  },
}
</script>

<style scoped>
/deep/ [class*=van-hairline]::after {
  border-bottom: none;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}

</style>
