<template>
  <van-button :type="type" :size="size" v-if="hasPer()" @click="handleClick">
    <slot></slot>
  </van-button>
</template>

<script>
import hasPermission from "../../permission";
/**
 * 权限按钮
 */
export default {
  name: "per-button",
  props: {
    type: {
      type: String,
      default: "default"
    },
    size: {
      type: String,
      default: "normal"
    },
    color: {
      type: String,
      default: ""
    },
    per: {
      type: Number,
      required: true
    },
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
    hasPer() {
      return hasPermission(this.per)
    },
  },
}
</script>

<style scoped>

</style>