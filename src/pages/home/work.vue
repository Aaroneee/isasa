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
        <van-grid-item v-for="value in modules.预约" @click="onClickItem(value.viewLink)" :key="value.id"
                       :icon="value.viewIcon"
                       :text="value.viewName"/>
      </van-grid>
    </van-cell-group>
    <van-cell-group v-if="modules.订单 !=null" title="订单">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in modules.订单" @click="onClickItem(value.viewLink)" :key="value.id"
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
    <van-cell-group v-if="modules.报表 !=null" title="报表">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in modules.报表" @click="onClickItem(value.viewLink)" :key="value.id"
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
      modules: {
        cusModules: [
          {id: 1, name: "客资列表", link: 'cusList', icon: "manager"},
          {id: 2, name: "添加客资", link: 'cusAdd', icon: "add"},
        ], appModules: [
          // {id: 3, name: "预约列表", link: 'appList', icon: "friends"},
          {id: 3, name: "每日预约", link: 'appScheduleList', icon: "wap-nav"},
        ], orderModules: [
          {id: 4, name: "订单列表", link: 'orderList', icon: "orders-o"},
          {id: 5, name: "收款列表", link: 'proceedsList', icon: "balance-list"},
        ], clothesModules: [
          {id: 6, name: "款式添加", link: 'styleAdd', icon: "add"},
          {id: 7, name: "款式列表", link: 'styleList', icon: "bar-chart-o"},
          {id: 8, name: "婚纱列表", link: 'clothesList', icon: "bar-chart-o"},
          {id: 9, name: "档期查看", link: 'scheduleList', icon: "browsing-history"},
        ]
      },
    }
  },
  methods: {
    onClickItem: function (event) {
      this.$router.push({name: event})
    },
    setLocalStorage: function (tenantCrop, empId) {
      localStorage.setItem("tenantCrop", tenantCrop);
      localStorage.setItem("empId", empId);
      this.queryModules()
    }
    , queryModules() {
      this.$axios({
        method: "GET",
        url: '/index/mobileManBar',
        params: {
          tenantCrop: this.tenantCrop,
          empId: this.empId,
        }
      }).then(response => {
        console.log(response)
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
