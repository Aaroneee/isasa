
<template>
  <div>
    <van-sticky>
      <baseNavBar title="消息详情"/>
    </van-sticky>

    <div style="padding: 8px;">
      <p style="font-size: 18px;text-align: left;font-weight: bolder">{{ msgDetails.msgTitle }}</p>
      <van-divider />
      <div class="card">

        <p style="text-align: left;">{{ msgDetails.msgText }}</p>
        <br>
        <p>下单时间: {{orderDetails.createDate}}</p>
        <p>操作人员: {{orderDetails.empName}}</p>
        <p>订单金额: {{orderDetails.totalAmount}}</p>
      </div>

      <div class="card" v-for="(item,index) in orderDetails.storeOrderStyleVOS" :key="index">
        <van-row gutter="20">
          <van-col :span="11">
            <div>
                        <img class="style-img"
                             :src="'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.mainImage+'?imageMogr2/rquality/60'"
                             @error="($event)=>{
                                      $event.target.src='https://isasaerp-img-1304365928.cos.ap-shanghai.myqcloud.com/logoFont.jpg?imageMogr2/rquality/2';
                                    }">
            </div>
          </van-col>
          <van-col :span="13" >
            <van-row><p>款式品牌 : {{item.storeBrandName}}</p></van-row>
            <van-row><p>款式类型 : {{item.storeTypeName}}</p></van-row>
            <van-row><p>系列名称 : {{item.storeSeriesName}}</p></van-row>
            <van-row><p>系列编号 : {{item.storeSeriesNum}}</p></van-row>
            <van-row><p>款式名称 : {{ item.styleName }}</p></van-row>
            <van-row><p>款式编号 : {{ item.styleNumber }}</p></van-row>
            <van-row><p>选购尺寸 : {{ item.clothesSize }}</p></van-row>
            <van-button
                        style="border-radius: 10px;background-color: var(--my-base-color);border-color: var(--my-base-color);
                        width: 100%;height: 30px;font-size: 14px;color: var(--my-text-color)"
                        @click="(()=>{$router.push({name:'storeStyleAdd',query:{storeStyleId:item.storeStyleId,clothesSize:item.clothesSize}})})"
                        text="添加至款式"/>
          </van-col>
        </van-row>
      </div>
    </div>


  </div>

</template>

<script>
import BaseNavBar from "@/components/nav-bar/base-nav-bar.vue";
export default {
  name: "message",
  data() {
    return {
      msgDetails:{},

      orderDetails:{}
    }
  },
  components: {
    BaseNavBar,

  },
  created() {
    this.queryMsgById();
  },
  methods: {
    queryMsgById(){
      this.$axios({
        method: "GET",
        url: "/sysMsg/queryById",
        params: {
          id:this.$route.query
        }
      }).then(response => {
        this.msgDetails=response.data.data;
        this.queryStoreStyle(JSON.parse(this.msgDetails.msgJson).orderId)
      })
    },
    queryStoreStyle(orderId){
      this.$axios({
        method: "GET",
        url: "/storeOrder/queryInfoById",
        params: {
          id:orderId
        }
      }).then(response => {
        this.orderDetails=response.data.data;
      })
    },
  },
}
</script>

<style scoped>
p{
  margin-block-start:0;
  margin-block-end: 0;
  font-size: 14px;
  color: var(--my-text-color);
}
.card {
  background: white;
  border-radius: 7px;
  margin:  1% 3%;
  padding: 3% 3%;
  height: 100%;
  overflow: hidden;
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
.style-img{
  height: 200px;
  border-radius: 10px;
}
.operationBlock {
  text-align: center;
  display: inline-block;
  margin: 0 2%
}
</style>
