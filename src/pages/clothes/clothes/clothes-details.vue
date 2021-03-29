<template>
  <div>
    <baseNavBar title="婚纱详情"/>

    <van-cell-group
        :title="clothes.styleType + '-' + clothes.styleName + '-' + clothes.clothesSize + '-' + clothes.clothesNo">
      <div style="padding-top: 5px">
        <van-swipe height="300" :autoplay="3000">
          <van-swipe-item v-for="(image, index) in images" :key="index">
            <div class="img-box">
              <van-image fit="scale-down" round radius="7" width="50%" height="90%" :src="image"
                         @click="clickItem(image)"/>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </van-cell-group>
    <!--    <van-cell-group title="婚纱操作记录" v-for="(item,index) in clothesScheduleList" :key="index">-->
    <!--      <van-cell :title="item.customerName" :label="'婚期: '+ item.weddingDay"-->
    <!--                :value="item.scheduleDate">-->
    <!--      </van-cell>-->
    <!--    </van-cell-group>-->
    <!--    <van-empty v-if="clothesScheduleList.length === 0" image="search" description="该婚纱下暂未查询到操作记录"/>-->
    <van-cell-group title="婚纱操作">
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item @click="clothesOperation"
                       icon="back-top"
                       text="出样陈列"/>
        <van-grid-item @click="clothesSchedules"
                       icon="chart-trending-o"
                       text="档期查看"/>
        <van-grid-item @click="styleInfoView"
                       icon="newspaper-o"
                       text="款式介绍"/>
      </van-grid>
    </van-cell-group>

    <!--    <H5 class="van-field van-col&#45;&#45;offset-1">婚纱操作</H5>-->
    <!--    <van-empty description="描述文字"/>-->


  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'
import {ImagePreview} from "vant";

export default {
  name: "clothesDetails",
  created() {
    this.clothes = this.$route.query
    this.queryStyleImageByClothesId(this.clothes.clothesId)
    this.queryClothesSchedules(this.clothes.clothesId)
  },
  data() {
    return {
      clothes: {},
      images: [],
      clothesScheduleList: [],


    }
  }
  , components: {
    baseNavBar
  }
  , methods: {
    clickItem: function (value) {
      ImagePreview([value])
    }
    , queryStyleImageByClothesId(clothesId) {
      console.log(clothesId)
      this.$axios({
        method: "GET",
        url: "/styleImage/queryStyleImageByClothesId",
        params: {
          clothesId: clothesId,
        }
      }).then(response => {
        const data = response.data.data;
        for (let index in data) {
          data[index] = "https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/" + data[index]
        }
        this.images = data
      })
    }
    , queryClothesSchedules: function (clothesId) {
      this.$axios({
        method: "GET",
        url: "/schedule/clothesSchedules",
        params: {
          clothesId: clothesId,
        }
      }).then(response => {
        this.clothesScheduleList = response.data.data
      })
    }
    //出样陈列
    , clothesOperation: function () {
      this.$toast.fail("正在开发中哦！")
      // this.$router.push({name: "clothesOperation", query: this.clothes})
    }
    , clothesSchedules: function () {
      console.log(this.clothes)
      this.$router.push({name: "clothesSchedule", query: this.clothes})
    }
    , styleInfoView: function () {
      this.$toast.fail("正在开发中哦！")
      // this.clothes.id = this.clothes.styleId
      // this.$router.push({name: "styleDetails", query: this.clothes})
    }
  }
}
</script>

<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}

.img-box {
  width: 100%;
  height: 100%;
  background: white;
  text-align: center
}
</style>
