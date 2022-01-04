<template>
  <div id="parent">
    <baseNavBar title="婚纱详情"/>

    <div class="card">
      <p class="PTitle">{{clothes.styleType + '-' + clothes.styleName + '-' + clothes.clothesSize + '-' + clothes.clothesNo}}</p>
      <div style="padding-top: 5px">
        <van-swipe height="300" :autoplay="3000">
          <van-swipe-item v-for="(image, index) in images" :key="index">
            <div class="img-box">
              <van-image fit="scale-down" round radius="7" width="60%" height="100%" :src="image"
                         @click="clickItem(image)"/>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <van-cell>
        <van-row>
          <van-col span="24">品牌：{{ clothes.brand === "" ? "暂无品牌" : clothes.brand }}</van-col>
        </van-row>
        <van-row>
          <van-col span="24">位置：{{ clothes.positionName === "" ? "暂无位置" : clothes.positionName }}</van-col>
        </van-row>
        <van-row style="padding-top: 5px">
          <van-col>标签：{{ styleLabelList.length == 0 ? "暂无标签" : "" }}
            <van-tag v-for="item in styleLabelList" :key="item.id" type="danger"
                     size="large" style="margin: 5px">
              {{ item.labelName }}
            </van-tag>
          </van-col>
        </van-row>
      </van-cell>
    </div>
    <div class="card">
        <van-row><p class="PTitle">款式价格</p></van-row>
        <van-row v-if="stylePrice.length>0">
          <van-col :span="8" v-for="(item,index) in stylePrice" :key="index">
            <p style="text-align: center;margin: 10px 0">{{ item.priceType }}</p>
            <p style="text-align: center;margin: 10px 0">{{ item.price }}</p>
          </van-col>
        </van-row>
        <van-row v-else>
          <p style="text-align: center; margin: 3% 0">无</p>
        </van-row>
    </div>
    <div style="height: 130px"></div>
    <div id="operationDiv">
      <div id="operationCon">
        <p class="PTitle">操作菜单</p>
        <div id="operationParent">
          <div class="operationBlock" @click="clothesOperation">
            <van-icon name="back-top" size="30"/>
            <p>出样陈列</p>
          </div>
          <div class="operationBlock" @click="clothesSchedules">
            <van-icon name="chart-trending-o" size="30"/>
            <p>档期查看</p>
          </div>
          <div class="operationBlock" @click="styleInfoView">
            <van-icon name="newspaper-o" size="30"/>
            <p>款式介绍</p>
          </div>
          <div class="operationBlock" @click="addClothesYarn">
            <van-icon name="add-o" size="30"/>
            <p>添加试纱</p>
          </div>
          <div class="operationBlock" @click="toStyleImage">
            <van-icon name="photo-o" size="30"/>
            <p>查看图片</p>
          </div>
          <div class="operationBlock" @click="toStylePrice">
            <van-icon name="balance-o" size="30"/>
            <p>查看价格</p>
          </div>
          <div class="operationBlock" @click="operationRecord">
            <van-icon name="todo-list-o" size="30"/>
            <p>历史操作</p>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'
import {ImagePreview} from "vant";

export default {
  name: "clothesDetails",
  created() {
    this.clothes = this.$route.query
    console.log(this.clothes)
    this.queryStyleLabelList()
    this.queryStyleImageByClothesId(this.clothes.clothesId)
    this.queryClothesSchedules(this.clothes.clothesId)
    this.queryPrice()
  },
  data() {
    return {
      clothes: {},
      images: [],
      clothesScheduleList: [],
      styleLabelList: [],
      stylePrice: [],
      empId: localStorage.getItem("empId"),
    }
  },
  components: {
    baseNavBar
  },
  methods: {
    clickItem: function (value) {
      ImagePreview([value])
    },
    queryStyleImageByClothesId(clothesId) {
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
    },
    queryClothesSchedules: function (clothesId) {
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
    },
    //查询价格
    queryPrice() {
      this.$axios({
        method: "GET",
        url: "/stylePrice/queryStyleOneShopPriceByEmpId",
        params: {
          styleId: this.clothes.styleId,
          empId: this.empId
        }
      }).then(response => {
        console.log("价格")
        console.log(response)
        this.stylePrice = response.data.data;
      })
    },
    //出样陈列
    clothesOperation: function () {
      this.$router.push({name: "clothesOperation", query: this.clothes})
    },
    clothesSchedules: function () {
      this.$router.push({name: "clothesSchedule", query: this.clothes})
    },
    toStyleImage:function (){
      this.$router.push({name: "styleImage", query: this.clothes.styleId})
    },
    toStylePrice:function (){
      this.$router.push({name: "stylePrice", query: this.clothes.styleId})
    },
    styleInfoView: function () {
      this.$router.push({name: "styleIntroduce", query: this.clothes})
    },
    addClothesYarn: function () {
      this.$router.push({name: "dailyAppList", query: this.clothes})
    },
    operationRecord: function () {
      this.$router.push({name: "clothesOperationRecord", query: this.clothes})
    },
  }
}
</script>

<style scoped>
p{
  margin-block-start: 0;
  margin-block-end: 0;
}
.PTitle {
  font-size: 17px;
  font-weight: bold;
  text-align: center;
  padding-top: 3%;
}
.card {
  background: white;
  border-radius: 10px;
  width: 95%;
  margin: 10px auto 10px auto;
}

#operationDiv {
  position: fixed;
  bottom: 20px;
  width: 100%;
}

#operationCon {
  border-radius: 10px;
  margin: 0 auto;
  background: white;
  height: 110px;
  width: 95%;
}

#operationParent {
  padding: 10px 0;
  white-space: nowrap;
  /*文本不会换行，文本会在在同一行上继续*/
  overflow-y: auto;
}

#operationParent::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.operationBlock {
  width: 50px;
  height: 50px;
  text-align: center;
  display: inline-block;
  margin: 0 4%
}

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
