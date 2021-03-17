<template>
  <div>
    <van-grid :border="false" clickable :column-num="4">
      <van-grid-item v-for="value in modules" @click="onClickItem(value.link)" :key="value.id" :icon="value.icon"
                     :text="value.name"/>
    </van-grid>
  </div>
</template>

<script>
export default {
  name: "work",
  data() {
    return {
      modules: [
        {id: 1, name: "客资列表", link: 'cusList', icon: "manager"},
        {id: 2, name: "添加客资", link: 'cusAdd', icon: "add"},
        {id: 3, name: "预约列表", link: 'appList', icon: "friends"},
        {id: 4, name: "订单列表", link: 'orderList', icon: "orders-o"},
        {id: 5, name: "收款列表", link: 'proceedsList', icon: "balance-list"},
        {id: 6, name: "款式添加", link: 'styleAdd', icon: "add"},
        {id: 7, name: "款式列表", link: 'styleList', icon: "bar-chart-o"},
        {id: 8, name: "婚纱列表", link: 'clothesList', icon: "bar-chart-o"},
      ]
    }
  },
  methods: {
    onClickItem: function (event) {
      this.$router.push({name: event})
    },
    setLocalStorage:function (tenantCrop,empId){
      localStorage.setItem("tenantCrop",tenantCrop);
      localStorage.setItem("empId",empId);
    }
  },
  mounted() {
    window.setLocalStorage=this.setLocalStorage
  }
}
</script>

<style scoped>

</style>
