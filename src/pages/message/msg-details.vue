
<template>
  <div>
    <baseNavBar title="消息详情"/>

    <div style="padding: 8px;">
      <p style="font-size: 18px;text-align: left;font-weight: bolder">{{ msgDetails.msgTitle }}</p>
      <van-divider />
      <p style="text-align: left;">{{ msgDetails.msgText }}</p>
      <br>
      <p>下单时间: {{orderDetails.createDate}}</p>
      <p>操作人员: {{orderDetails.empName}}</p>
      <p>订单金额: {{orderDetails.totalAmount}}</p>
      <div id="operationParent">
        <div class="operationBlock"  v-for="(item,index) in orderDetails.storeOrderStyleVOS" :key="index">
          <img class="style-img"
               :src="'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.mainImage+'?imageMogr2/rquality/60'"
               @error="($event)=>{
                        $event.target.src='https://isasaerp-img-1304365928.cos.ap-shanghai.myqcloud.com/logoFont.jpg?imageMogr2/rquality/2';
                      }">
          <p style="">{{`${item.storeBrandName}`}}</p>
          <p style="">{{`${item.storeSeriesName}`}}</p>
          <p style="">{{`${item.storeSeriesNum}`}}</p>
        </div>
      </div>

<!--      <van-row>-->
<!--        <van-col :span="12" v-for="(item,index) in orderDetails.storeOrderStyleVOS">-->
<!--          <img class="style-img"-->
<!--               :src="'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.mainImage+'?imageMogr2/rquality/60'"-->
<!--               @error="($event)=>{-->
<!--                        $event.target.src='https://isasaerp-img-1304365928.cos.ap-shanghai.myqcloud.com/logoFont.jpg?imageMogr2/rquality/2';-->
<!--                      }">-->
<!--        </van-col>-->
<!--      </van-row>-->
    </div>


  </div>

</template>

<script>
import BaseNavBar from "@/components/nav-bar/base-nav-bar.vue";
export default {
  name: "message",
  data() {
    return {
      msgDetails:{
        id:1,
        msgType:1,
        createDate:'2023-10-13 20:20:22',
        msgIcon:'fullDressLonguette',
        msgTitle:"贸易订单收货提示",
        msgText:"您收到了来自【GLACIAR】品牌的【6】件款式!",
      },

      orderDetails:{}
    }
  },
  components: {
    BaseNavBar,

  },
  created() {
    console.log(this.$route.query)
    this.queryStoreStyle();
  },
  methods: {
    queryStoreStyle(){
      this.$axios({
        method: "GET",
        url: "/storeOrder/queryInfoById",
        params: {
          id:229
        }
      }).then(response => {
        this.orderDetails=response.data.data;
        console.log(this.orderDetails);
      })
    }
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
.card{
  background: white;
  margin: 8px;
  border-radius: 10px;
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
  height: 250px;
}
.operationBlock {
  text-align: center;
  display: inline-block;
  margin: 0 2%
}
</style>