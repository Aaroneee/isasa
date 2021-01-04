<template>
  <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
  />
</template>

<script>
export default {
  name: "base-nav-bar",
  props:{
    title:String
  },
  methods:{
    onClickLeft:function (){
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>

</style>