<template>
  <div>
    <router-view/>

    <van-tabbar route>
      <van-tabbar-item  to="/" icon='wap-home-o' ></van-tabbar-item>
      <van-tabbar-item  to="/statistic" icon='bar-chart-o' ></van-tabbar-item>
      <van-tabbar-item  to="/user" icon='user-o' ></van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "home"
}
</script>

<style scoped>

</style>
