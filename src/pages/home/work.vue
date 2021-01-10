<template>
  <div>
    <van-grid :border="false" clickable :column-num="3">
      <van-grid-item  v-for="value in modules" @click="onClickItem(value.link)" :key="value.id" :icon="value.icon" :text="value.name"/>
    </van-grid>
  </div>
</template>

<script>
export default {
  name: "work",
  data() {
    return {
      modules: [
        {id: 1, name: "客资列表", link: 'cusList',icon:"friends"},
        {id: 2, name: "添加客资", link: 'cusAdd',icon:"add"},
      ]
    }
  },
  methods:{
    onClickItem:function (event){
      this.$router.push({name:event})
    }
  }
}
</script>

<style scoped>

</style>