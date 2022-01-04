<template>
  <div id="app">
    <div v-if="isRouterAlive">
      <keep-alive :include="keepAlive">
        <router-view/>
      </keep-alive>
    </div>
  </div>
</template>
<script>

export default {
  name: 'App',
  computed: {
    keepAlive() {
      return this.$store.getters.keepAlive
    }
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  },
  components: {}
}
</script>

<style>
body{
  background-color: #f6f7f9;
}
</style>
