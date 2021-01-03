<template>
  <div>
    <router-view/>

    <van-tabbar route active-color="#027AFF" inactive-color="#000">
      <van-tabbar-item to="/" icon="wap-home-o">标签</van-tabbar-item>
      <van-tabbar-item to="/statistic" icon="bar-chart-o">标签</van-tabbar-item>
      <van-tabbar-item to="/user" icon="contact">标签</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "home",



}
</script>

<style scoped>

</style>