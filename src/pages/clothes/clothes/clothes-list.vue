<template>
  <div>
    <baseNavBar title="改变颜色"/>
    <p v-text="dsadas" v-bind:style="{color:activeColor}"></p>
    <button @click="changeColor">改变颜色</button>
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "clothesList",
  data() {
    return {
      dsadas: "dsadsadqwewqewqeq",
      activeColor: "#ae20b8"
    }
  },
  components: {
    baseNavBar
  },
  methods:{
    changeColor:function (){
      this.activeColor = "#AEB820"
    }
  }
}
</script>

<style scoped>
  .colorHex{

  }
</style>
