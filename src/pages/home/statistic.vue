<template>
  <div>
    <van-cell-group v-if="modules.业绩报表 !=null" title="业绩报表">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in modules.业绩报表" @click="onClickItem(value.viewLink)" :key="value.id"
                       :icon="value.viewIcon"
                       :text="value.viewName"/>
      </van-grid>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: "statistic",
  data(){
    return{
      modules: {},
    }
  },
  created() {
    this.queryModules();
  },
  methods: {
    onClickItem: function (event,id) {
      this.$store.commit('setKeepAlive', [event])
      this.$router.push({name: event,query:{id: id}})
    },
    queryModules() {
      this.$axios({
        method: "GET",
        url: '/index/mobileManBar',
        params: {
          tenantCrop: localStorage.getItem("tenantCrop"),
          empId: localStorage.getItem("empId"),
        }
      }).then(response => {
        this.modules = response.data.data;
      })
    }
  },
}
</script>

<style scoped>

</style>
