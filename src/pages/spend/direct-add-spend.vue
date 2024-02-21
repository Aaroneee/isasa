<template>
  <div>
    <van-sticky>
      <baseNavBar title="直接加支出"/>
    </van-sticky>
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "directAddSpend",
  data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      loading: false,
      finished: false,
    }
  }, components: {
    baseNavBar
  },
  methods: {


  },
}
</script>


