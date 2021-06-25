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
      <van-cell>
        <van-row>
          <van-col span="12">品牌：{{clothes.brand===""?"暂无品牌":clothes.brand}}</van-col>
          <van-col span="12" style="text-align: right">当前位置：{{clothes.positionName===""?"暂无位置":clothes.positionName}}</van-col>
        </van-row>
        <van-row style="padding-top: 5px">
          <van-col>标签：{{styleLabelList.length==0?"暂无标签":""}}
              <van-tag v-for="item in styleLabelList" :key="item.id" type="danger"
                          size="large" style="margin: 5px">
              {{ item.labelName }}
              </van-tag>
          </van-col>
        </van-row>
      </van-cell>
    </van-cell-group>

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
        <van-grid-item @click="addClothesYarn"
                       icon="add-o"
                       text="添加试纱"/>
      </van-grid>
      <van-grid :border="false" clickable :column-num="4">
        <van-grid-item @click="operationRecord"
                       icon="todo-list-o"
                       text="历史操作"/>
      </van-grid>
    </van-cell-group>



  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'
import {ImagePreview} from "vant";

export default {
  name: "clothesDetails",
  created() {
    this.clothes = this.$route.query
    this.queryStyleLabelList()
    this.queryStyleImageByClothesId(this.clothes.clothesId)
    this.queryClothesSchedules(this.clothes.clothesId)
  },
  data() {
    return {
      clothes: {},
      images: [],
      clothesScheduleList: [],
      styleLabelList: [],
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
    },
    //查询礼服标签
    queryStyleLabelList: function () {
      this.$axios({
        method: "GET",
        url: "/styleLabel/queryStyleLabelVoByClothesId",
        params: {
          clothesId: this.clothes.clothesId
        }
      }).then(response => {
        this.styleLabelList = response.data.data
        console.log(this.styleLabelList)
      })
    }
    //出样陈列
    , clothesOperation: function () {
      this.$router.push({name: "clothesOperation", query: this.clothes})
    }
    , clothesSchedules: function () {
      console.log(this.clothes)
      this.$router.push({name: "clothesSchedule", query: this.clothes})
    }
    , styleInfoView: function () {
      this.$router.push({name: "styleIntroduce", query: this.clothes})
    }
    , addClothesYarn: function () {
      this.$router.push({name: "dailyAppList", query: this.clothes})
    }
    , operationRecord: function () {
      this.$router.push({name: "clothesOperationRecord", query: this.clothes})
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
