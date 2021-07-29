<template>
  <div>
    <van-cell-group v-if="modules.客资 !=null" title="客资">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in modules.客资" @click="onClickItem(value.viewLink)" :key="value.id"
                       :icon="value.viewIcon"
                       :text="value.viewName"/>
      </van-grid>
    </van-cell-group>
    <van-cell-group v-if="modules.预约 !=null" title="预约">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in modules.预约" @click="onClickItem(value.viewLink, value.id)" :key="value.id"
                       :icon="value.viewIcon"
                       :text="value.viewName"/>
      </van-grid>
    </van-cell-group>
    <van-cell-group v-if="modules.订单 !=null" title="订单">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in modules.订单" @click="onClickItem(value.viewLink, value.id)" :key="value.id"
                       :icon="value.viewIcon"
                       :text="value.viewName"/>
      </van-grid>
    </van-cell-group>
      <van-cell-group v-if="modules.婚纱 !=null" title="婚纱">
        <van-grid :border="false" clickable :column-num="4">
          <van-grid-item v-for="value in modules.婚纱" @click="onClickItem(value.viewLink)" :key="value.id"
                         :icon="value.viewIcon"
                         :text="value.viewName"/>
        </van-grid>
      </van-cell-group>
  </div>
</template>

<script>
export default {
  name: "work",
  created() {
    this.queryModules()
  },
  data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      empId: localStorage.getItem("empId"),
      modules: {},
    }
  },
  methods: {
    onClickItem: function (event,id) {
      this.$store.commit('setKeepAlive', [event])
      this.$router.push({name: event,query:{id: id}})
    },
    setLocalStorage: function (tenantCrop, empId) {
      localStorage.setItem("tenantCrop", tenantCrop);
      localStorage.setItem("empId", empId);
      this.queryModules()
    },
    queryModules() {
      this.$axios({
        method: "GET",
        url: '/index/mobileManBar',
        params: {
          tenantCrop: this.tenantCrop,
          empId: this.empId,
        }
      }).then(response => {
        this.modules = response.data.data
      })

    }
  },
  mounted() {
    window.setLocalStorage = this.setLocalStorage
  }
}
</script>

<style scoped>

</style>
