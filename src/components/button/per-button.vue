<template>
  <van-col :span="span" v-if="hasPer()" class="col">
    <van-button :type="type" :size="size" :color="color" :round="round" :plain="plain" @click="handleClick" style="width: 100%">
      <slot></slot>
    </van-button>
  </van-col>
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
      type: String,
      required: true
    },
    span: {
      type: Number,
    },
    plain: {
      type: Boolean,
      default: false,
    },
    round: {
      type: Boolean,
      default: false,
    }
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