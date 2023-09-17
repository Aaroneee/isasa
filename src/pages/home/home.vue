<template>
  <div>
    <UserHeadComponents/>

    <div style="height: 91vh;overflow:auto;margin-top: 30px;background-color: rgb(246,247,249)">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
    <van-tabbar route style="height: 6vh">
      <van-tabbar-item to="/" icon='wap-home-o'>工作台</van-tabbar-item>
      <van-tabbar-item to="/statistic" icon='bar-chart-o'>报表</van-tabbar-item>
      <van-tabbar-item to="/store" icon='shop-o'>商城</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import UserHeadComponents from "@/components/user-head-component.vue";
//
export default {
  name: "home",
  methods: {
    setLocalStorage: function (tenantCrop, empId,token) {
      localStorage.setItem("tenantCrop", tenantCrop);
      localStorage.setItem("empId", empId);
      localStorage.setItem("token", token);
    },
  },
  components: {UserHeadComponents},
  mounted() {
    window.setLocalStorage = this.setLocalStorage
  }
}
</script>

<style scoped>
/deep/ [class*=van-hairline]::after {
  border-bottom: none;
}
</style>
