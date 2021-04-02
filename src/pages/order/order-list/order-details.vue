<template>
  <div>
    <baseNavBar title="订单详情"/>
    <div v-cloak>
      <van-cell style="font-size: 12px">
        <van-row>
          <van-col span="16" >姓名:{{ orderVo.name }} 手机号:{{ orderVo.phone }}</van-col>
          <van-col span="8">下单日:{{ orderVo.createDate }}</van-col>
        </van-row>
        <van-row>
          <van-col span="12">订单编号:{{ orderVo.orderNo }}</van-col>
        </van-row>
        <van-row>
          <van-col span="8">婚期:{{ orderVo.weddingDay }}</van-col>
          <van-col span="8">客服:{{ orderVo.service }}</van-col>
          <van-col span="8">礼服师:{{ orderVo.dress }}</van-col>
        </van-row>
        <van-row>
          <van-col span="8">订单总价:{{ orderVo.orderPrice }}</van-col>
          <van-col span="8">已付金额:{{ orderVo.spareMoney }}</van-col>
          <van-col span="8">余款:{{ orderVo.orderSpare }}</van-col>
        </van-row>
        <van-row>
          <van-col span="24">备注:{{ orderVo.remark }}</van-col>
        </van-row>
      </van-cell>
    </div>
    <van-row>
      <van-cell-group title="订单款式">
          <van-cell style="font-size: 12px" v-for="item in clothesScheduleList" :key="item.id">
            <van-grid :border="false" :column-num="2" :gutter="1">
              <van-grid-item v-if="item[0] != null">
                <div v-if="item[0].styleImage !== ''">
                  <van-image class="style-img"  radius="7"
                             :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item[0].styleImage">
                  </van-image>
                </div>
                <div v-else>
                  <van-image class="style-img">
                    <template v-slot:error>未上传图片</template>
                  </van-image>
                </div>
                <span
                    v-text="item[0].styleType+'-'+item[0].styleName+'-'+item[0].clothesSize+'-'+item[0].clothesNo"></span>
                <span :class="{'color-red':item[0].scheduleState==='撞挡','color-blue':item[0].scheduleState==='可用'}">{{'档期状态:'+item[0].scheduleState}}</span>
                <span>{{item[0].scheduleDate}}</span>

              </van-grid-item>

              <van-grid-item v-if="item[1] != null">
                <div v-if="item[1].styleImage !== ''">
                  <van-image class="style-img" radius="7"
                             :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item[1].styleImage">
                  </van-image>
                </div>
                <div v-else>
                  <van-image class="style-img">
                    <template v-slot:error>未上传图片</template>
                  </van-image>
                </div>
                <span
                    v-text="item[1].styleType+'-'+item[1].styleName+'-'+item[1].clothesSize+'-'+item[1].clothesNo"></span>
                <span :class="{'color-red':item[1].scheduleState==='撞挡','color-blue':item[1].scheduleState==='可用'}">{{'档期状态:'+item[1].scheduleState}}</span>
                <span>{{item[1].scheduleDate}}</span>
              </van-grid-item>
            </van-grid>
          </van-cell>
      </van-cell-group>

    </van-row>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "order-details",
  components: {
    baseNavBar
  },
  data() {
    return {
      id: this.$route.query.id,
      cusId: this.$route.query.cusId,
      orderVo: {},
      tenantCrop: localStorage.getItem("tenantCrop"),


      clothesScheduleList:[],
    }
  },
  created() {
    this.queryOrderVo();
    this.queryCusSchedules(this.cusId)
  },
  methods: {
    queryOrderVo: function () {
      this.$axios({
        method: "GET",
        url: "/order/queryOrderVoById",
        params: {
          id: this.id
        }
      }).then(response => {
        this.orderVo = response.data.data;
      })
    }
    ,queryCusSchedules:function (){
      this.$axios({
        method: 'GET',
        params: {
          cusId: this.cusId,
        },
        url: '/schedule/clothesAndScheduleByCus',
      }).then(response => {
        console.log(response)
        if (response.data.code === 200){
          this.clothesScheduleList.push(...arrTrans(2, response.data.data))
        }
      })
    }
  }

}

function arrTrans(num, arr) {
  const iconsArr = [];
  arr.forEach((item, index) => {
    const page = Math.floor(index / num);
    if (!iconsArr[page]) {
      iconsArr[page] = [];
    }
    iconsArr[page].push(item);
  });
  return iconsArr;
}
</script>

<style scoped>
.color-red{
  color: red;
}
.color-blue{
  color: blue;
}
</style>
