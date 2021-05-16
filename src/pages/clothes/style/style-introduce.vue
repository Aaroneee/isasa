<template>
  <div>
    <baseNavBar title="款式介绍"/>
    <van-cell-group
        :title="clothes.styleType + '-' + clothes.styleName + '-' + clothes.clothesSize + '-' + clothes.clothesNo">
      <van-cell style="font-size: 12px">
        <van-row>
          <van-col span="24">款式介绍: {{style.styleInfo}}</van-col>
          <van-col span="24">适合情况: {{style.styleFit}}</van-col>
          <van-col span="24">不适合情况: {{style.styleNoFit}}</van-col>
        </van-row>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "styleIntroduce"
  , components: {
    baseNavBar
  },
  created() {
    this.clothes = this.$route.query
    this.queryStyleIntroduce(this.clothes.styleId)
  }
  , data() {
    return {
      clothes:{},
      style:{}
    }
  }
  , methods: {
      queryStyleIntroduce: function (styleId) {
        this.$axios({
          method: "GET",
          url: "/style/queryStyleInfo",
          params: {
            styleId: styleId,
          }
        }).then(response => {
          this.style = response.data.data
        })
      }
  }

}
</script>

<style scoped>


</style>