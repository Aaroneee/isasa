<template>
  <div>

    <van-cell-group title="客资">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in cusModules" @click="onClickItem(value.link)" :key="value.id" :icon="value.icon"
                       :text="value.name"/>
      </van-grid>
    </van-cell-group>

    <van-cell-group title="预约">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in appModules" @click="onClickItem(value.link)" :key="value.id" :icon="value.icon"
                       :text="value.name"/>
      </van-grid>
    </van-cell-group>
    <van-cell-group title="订单">

      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in orderModules" @click="onClickItem(value.link)" :key="value.id" :icon="value.icon"
                       :text="value.name"/>
      </van-grid>
    </van-cell-group>
    <van-cell-group title="婚纱">

      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in clothesModules" @click="onClickItem(value.link)" :key="value.id"
                       :icon="value.icon"
                       :text="value.name"/>
      </van-grid>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: "work",
  data() {
    return {
      cusModules: [
        {id: 1, name: "客资列表", link: 'cusList', icon: "manager"},
        {id: 2, name: "添加客资", link: 'cusAdd', icon: "add"},
      ]
      ,
      appModules: [
        // {id: 3, name: "预约列表", link: 'appList', icon: "friends"},
        {id: 3, name: "每日预约", link: 'appScheduleList', icon: "wap-nav"},
      ]
      , orderModules: [
        {id: 4, name: "订单列表", link: 'orderList', icon: "orders-o"},
        {id: 5, name: "收款列表", link: 'proceedsList', icon: "balance-list"},
      ]
      , clothesModules: [
        {id: 6, name: "款式添加", link: 'styleAdd', icon: "add"},
        {id: 7, name: "款式列表", link: 'styleList', icon: "bar-chart-o"},
        {id: 8, name: "婚纱列表", link: 'clothesList', icon: "bar-chart-o"},
        {id: 9, name: "档期查看", link: 'scheduleList', icon: "bar-chart-o"},
      ],
    }
  },
  methods: {
    onClickItem: function (event) {
      this.$router.push({name: event})
    },
    setLocalStorage: function (tenantCrop, empId) {
      localStorage.setItem("tenantCrop", tenantCrop);
      localStorage.setItem("empId", empId);
    }
  },
  mounted() {
    window.setLocalStorage = this.setLocalStorage
  }
}
</script>

<style scoped>

</style>
