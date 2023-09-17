<template>
  <div>
    <van-cell-group v-if="modules.业绩报表 !=null" title="业绩报表" class="gird_module">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in modules.业绩报表" @click="onClickItem(value.viewLink)" :key="value.id"
                       :icon="value.viewIcon"
                       :text="value.viewName"/>
      </van-grid>
    </van-cell-group>
    <van-cell-group v-if="modules.客服报表 !=null" title="客服报表" class="gird_module">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in modules.客服报表" @click="onClickItem(value.viewLink)" :key="value.id"
                       :icon="value.viewIcon"
                       :text="value.viewName"/>
      </van-grid>
    </van-cell-group>
    <van-cell-group v-if="modules.押金管理 !=null" title="押金管理" class="gird_module">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in modules.押金管理" @click="onClickItem(value.viewLink)" :key="value.id"
                       :icon="value.viewIcon"
                       :text="value.viewName"/>
      </van-grid>
    </van-cell-group>
    <van-cell-group v-if="modules.收款报表 !=null" title="收款报表" class="gird_module">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item v-for="value in modules.收款报表" @click="onClickItem(value.viewLink)" :key="value.id"
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
      modules: JSON.parse(localStorage.getItem("modules")),
    }
  },
  created() {
  },
  methods: {
    onClickItem: function (event,id) {
      this.$store.commit('setKeepAlive', [event])
      this.$router.push({name: event,query:{id: id}})
    },
  },
}
</script>

<style scoped>
.gird_module{
  background-color: #ffffff;
  margin: 0px 7px 7px 8px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding-bottom: 7px;
  border-color: #ffffff!important;
}
/deep/ .van-cell-group__title{
  margin: 8px 7px 0px 7px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #ffffff;
}
/deep/ [class*=van-hairline]::after {
  border: none;
}
</style>
