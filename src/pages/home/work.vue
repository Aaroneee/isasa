<template>
  <div class="box">
    <van-cell-group v-if="modules.客资 !=null" title="客资" class="gird_module">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in modules.客资" @click="onClickItem(value.viewLink)" :key="value.id"
                       :icon="value.viewIcon"
                       :text="value.viewName"/>
      </van-grid>
    </van-cell-group>
    <van-cell-group v-if="modules.预约 !=null" title="预约" class="gird_module">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in modules.预约" @click="onClickItem(value.viewLink, value.id)" :key="value.id"
                       :icon="value.viewIcon"
                       :text="value.viewName"/>
      </van-grid>
    </van-cell-group>
    <van-cell-group v-if="modules.订单 !=null" title="订单" class="gird_module">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in modules.订单" @click="onClickItem(value.viewLink, value.id)" :key="value.id"
                       :icon="value.viewIcon"
                       :text="value.viewName"/>
      </van-grid>
    </van-cell-group>
      <van-cell-group v-if="modules.婚纱 !=null" title="婚纱" class="gird_module">
        <van-grid :border="false" clickable :column-num="4">
          <van-grid-item v-for="value in modules.婚纱" @click="onClickItem(value.viewLink)" :key="value.id"
                         :icon="value.viewIcon"
                         :text="value.viewName"/>
        </van-grid>
      </van-cell-group>
  </div>
</template>

<script>
import StyleAdd from "../clothes/style/style-add";
export default {
  name: "work",
  components: {StyleAdd},
  created() {
    this.queryModules()
    this.queryButton()
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
    // setLocalStorage: function (tenantCrop, empId,token) {
    //   localStorage.setItem("tenantCrop", tenantCrop);
    //   localStorage.setItem("empId", empId);
    //   localStorage.setItem("token", token);
    //   this.queryModules()
    // },
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

    },
    queryButton() {
      this.$axios({
        method: "GET",
        url: "/index/mobileButton",
        params: {
          empId: this.empId,
        }
      }).then(response => {
        this.$store.commit("setPermission", response.data.data)
      })
    }
  },
  // mounted() {
  //   window.setLocalStorage = this.setLocalStorage
  // }
}
</script>

<style scoped>
.box{
  padding-top: 7px;
}
.gird_module{
  background-color: #ffffff;
  margin: 0px 8px 8px 8px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding-bottom: 7px;
  border-color: #ffffff!important;
}
/deep/ .van-cell-group__title{
  margin: 8px 8px 0px 8px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #ffffff;
}
/deep/ [class*=van-hairline]::after {
  border: none;
}
</style>
<style>
.box{
  padding-top: 7px;
}
</style>
