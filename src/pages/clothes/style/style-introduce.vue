<template>
  <div>
    <baseNavBar title="款式介绍"/>
    <van-cell-group
        :title="clothes.styleType + '-' + clothes.styleName + '-' + clothes.clothesSize + '-' + clothes.clothesNo">
      <van-cell style="font-size: 12px">
        <van-row>
          <van-col span="7" ><p class="PTitle">款式介绍: </p></van-col>
          <van-col span="17" ><p class="PContent">{{style.styleInfo}}</p></van-col>
        </van-row>
        <van-row>
          <van-col span="7" ><p class="PTitle">适合情况: </p></van-col>
          <van-col span="17" ><p class="PContent">{{style.styleFit}}</p></van-col>
        </van-row>
        <van-row>
          <van-col span="7" ><p class="PTitle">不适合情况: </p></van-col>
          <van-col span="17" ><p class="PContent">{{style.styleNoFit}}</p></van-col>
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
.PTitle{
  font-weight: bold;
  font-size: 15px;
}
.PContent{
  font-size: 15px;
}

</style>