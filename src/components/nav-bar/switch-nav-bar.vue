<template>
  <van-nav-bar
      :title="title"
      left-text="返回"
      :right-text="switchText"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
  />
</template>

<script>
/**
 * describe: 此组件用于打开父组件的开关
 * 如:点击right-text 会给父组件返回一个true
 * 父组件会根据true打开特定的东西
 */

export default {
  name: "range-date-nav-bar.vue",
  props: {
    title: String,
    switchText: {
      type: String,
      default: '开关'
    }
  },
  methods: {
    onClickLeft: function () {
      this.$router.go(-1);
    },
    onClickRight: function () {
      this.$emit("flag", true);
    },
  }
}
</script>

<style scoped>

</style>