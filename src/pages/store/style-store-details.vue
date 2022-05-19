<template>
  <div>
    <van-sticky>
      <baseNavBar title="款式详情"/>
    </van-sticky>
    <!--    头部-->
    <div class="card">
      <van-row>
        <div class="scrollbarDiv">
          <div v-for="(image, index) in images" :key="index" style="display: inline;margin-right: 2%">
            <img :src="image" style="height: 300px"
                 @click="clickImageItem(index)" alt="图片已损坏"/>
          </div>
        </div>
      </van-row>
    </div>
<!--    信息-->
    <div class="card">
      <van-row><p class="cardTitle">款式信息</p></van-row>
      <van-row>
        <van-col :span="12">
          <p>款式类型 : {{ style.libTypeName }}</p>
        </van-col>
        <van-col :span="12">
          <p>款式售价 : {{ style.salePrice }}元</p>
        </van-col>
      </van-row>
      <van-row>
        <van-col :span="12">
          <p>系列名称 : {{ style.libSeriesName }}</p>
        </van-col>
        <van-col :span="12">
          <p>系列编号 : {{ style.libSeriesNumberName }}</p>
        </van-col>
      </van-row>
    </div>
    <!--    标签-->
    <div class="card">
      <van-row><p class="cardTitle">款式标签</p></van-row>
      <van-row v-if="labelNames.length>0" type="flex" justify="center">
        <van-col v-for="(item,index) in labelNames" :key="index" style="margin: 1% 1%">
          <van-tag size="large" v-once :color="labelColor[Math.floor(Math.random() * labelColor.length)]">{{ item }}</van-tag>
        </van-col>
      </van-row>
      <van-row v-else>
        <p style="text-align: center;">无</p>
      </van-row>
    </div>
    <!--    款式信息-->
    <div class="card">
      <van-row><p class="cardTitle">款式信息</p></van-row>
      <van-row>
        <van-col :span="24">
          <p>款式信息 : {{ style.styleInfo }}</p>
          <br/>
          <p>适合情况 : {{ style.styleFit }}</p>
          <br/>
          <p>不适合情况 : {{ style.styleNoFit }}</p>
        </van-col>
      </van-row>
    </div>
    <br><br><br><br><br><br>
    <p/>
    <van-goods-action>

      <van-goods-action-icon  />
      <van-goods-action-icon icon="chat-o" text="客服" @click="clickService" />
      <van-goods-action-icon />
      <van-goods-action-button
          type="danger"
          text="立即购买"
          @click="clickBuyButton"
      />
    </van-goods-action>
  </div>

</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"
import {ImagePreview} from "vant";

export default {
  name: "styleDetails",
  components: {
    baseNavBar,
  },
  created() {
    this.style = this.$route.query
    this.queryStyleDetails()
    this.queryLibStyleImage()
  },
  data() {
    return {
      style: {},

      labelNames:[],
      labelColor: ["#A52A2A", "#FF8C00", "#696969", "#FFA500", "#2F4F4F", "#6495ED", "#FF4500", "#40E0D0"],

      images:[],
    }
  },
  watch: {
    'style.labelNames':function (val){
      this.labelNames=val!==""?val.split(","):[];
    },
  },
  methods: {
    queryStyleDetails(){
      this.$axios({
        method: "GET",
        url: "/libraryStyle/queryById",
        params: {
          id: this.style.id,
        }
      }).then(response => {
        this.style=response.data.data
        console.log( this.style)
      })
    },
    queryLibStyleImage() {
      this.$axios({
        method: "GET",
        url: "/libraryStyleImage/queryByLibStyleId",
        params: {
          libStyleId: this.style.id,
        }
      }).then(response => {
        const data = response.data.data;
        console.log(data)
        for (let index in data) {
          data[index] = "https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/" + data[index].libStyleImage
        }
        this.images = data
      })
    },
    clickService:function (){

    },
    clickBuyButton:function (){
        this.$router.push({name: "styleStoreAddOrder", query: this.style})
    },
    clickImageItem: function (index) {
      ImagePreview(this.images,index)
    },
  },
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 7px;
  margin:  4% 3%;
  padding: 3% 3%;
  height: 100%;
  overflow: hidden;
}
.cardTitle{
  text-align: center;font-weight: bold
}
.card .imgParent {
  padding-left: 2%;
  height: 100%;
  width: 80px;
  display: inline-block;
  /*align-items: center;*/
}


.scrollbarDiv{

  white-space: nowrap;
  overflow-y: auto;
}
.scrollbarDiv::-webkit-scrollbar {
  width: 0;
}

p {
  font-size: 15px;
  margin: 2% 0;
}

</style>
