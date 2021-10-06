<template>
  <div>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <van-tabbar route>
      <van-tabbar-item to="/" icon='wap-home-o'>工作台</van-tabbar-item>
      <van-tabbar-item to="/statistic" icon='bar-chart-o'>报表</van-tabbar-item>
      <van-tabbar-item to="/user" icon='user-o'>我</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "home",
  methods: {
    setLocalStorage: function (tenantCrop, empId,token) {
      localStorage.setItem("tenantCrop", tenantCrop);
      localStorage.setItem("empId", empId);
      localStorage.setItem("token", token);
    },
  },
  mounted() {
    window.setLocalStorage = this.setLocalStorage
  }
}
</script>

<style scoped>

</style>
