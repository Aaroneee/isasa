<template>
  <div>
    <baseNavBar title="款式订单"/>
    <van-collapse v-model="activeNames">
      <van-collapse-item :name="index" :title="item.createDate" v-for="(item,index) in orderList" :key="index">
        <div class="cardParent">
          <p>订单编号: {{ item.orderNo }}</p>
          <p>下单日期: {{ item.createDate }}</p>
          <p>订单总价: {{ item.totalAmount }}</p>
          <div class="card" v-for="(childItem,childIndex) in item.storeOrderStyleVOS" :key="childIndex">
            <van-row>
              <van-col :span="10">
                <div>
                  <van-image class="style-img" radius="7"
                             @click="clickImageItem(childItem.mainImage)"
                             fit="contain"
                             :src="item.styleImage===''?'null'
                               :'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+childItem.mainImage+'?imageMogr2/rquality/60'">
                    <template v-slot:error>加载失败,请更换主图</template>
                  </van-image>
                </div>
              </van-col>
              <van-col :span="14" @click="toStyleDetails({id:childItem.storeStyleId})">
                <van-row><p>品牌 : {{ childItem.storeBrandName }}</p></van-row>
                <van-row><p>类型 : {{ childItem.storeTypeName }}</p></van-row>
                <van-row><p>系列 : {{ childItem.storeSeriesName }}</p></van-row>
                <van-row><p>系列编号 : {{ childItem.storeSeriesNum }}</p></van-row>
                <van-row><p>单价 : {{ childItem.unitPrice }}</p></van-row>
                <van-row><p>数量 : {{ childItem.styleNum }}</p></van-row>
                <van-row><p>总金额 : {{ childItem.amount }}</p></van-row>
              </van-col>
            </van-row>
          </div>
          <p v-if="item.payState===0" style="text-align: right">
            <van-button plain round type="danger" size="small" @click="goPay(item.id)">点击支付</van-button>
          </p>
          <p v-else :style="{color: item.payState===1?'green':'blue',fontWeight:'bold',textAlign:'right'}">
            {{ item.payState === 1 ? '已支付' : '已退款' }}
          </p>
        </div>

      </van-collapse-item>
    </van-collapse>
    <br><br><br>
    <van-submit-bar button-text="结算" @submit="onSubmit"/>
  </div>
</template>

<script>
import {ImagePreview} from "vant";
import baseNavBar from "@/components/nav-bar/base-nav-bar";

export default {
  name: "style-store-order-list",
  data() {
    return {
      orderList: [],
      activeNames: [0],

      priceCount: 0,

      labelColor: ["#A52A2A", "#FF8C00", "#696969", "#FFA500", "#2F4F4F", "#6495ED", "#FF4500", "#40E0D0"],

      loading: false,
      tenantCrop: localStorage.getItem("tenantCrop"),
    }
  },
  created() {
    this.queryShoppingCart()
  },
  mounted() {
    window.addEventListener('popstate', this.goBack, false)
    //防止页面后退
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL);
    });
  },
  components: {
    baseNavBar
  },
  methods: {
    goBack() {
      this.$router.replace({name: "work"})
    },
    //查询购物车列表
    queryShoppingCart() {
      this.loading = true;
      this.$axios({
        method: "GET",
        url: "/storeOrder/queryList",
        params: {
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        this.loading = false
        if (response.data.code !== 200) return false;
        this.orderList = response.data.data;
      })
    },
    //跳转到款式详情
    toStyleDetails(value) {
      this.$router.push({name: "styleStoreDetails", query: value})
    },
    //点击支付
    goPay(id) {
      if (/Linux/i.test(navigator.platform)) {
        androidMethod.getAliPayInfo(id);
        return;
      }
      //todo 调用苹果原生
      //window.webkit.messageHandlers.logout.postMessage("已退出")
    },
    //跳转到添加订单页面
    onSubmit() {
      this.$router.push({name: "styleStoreAddOrder", query: this.orderList})
    },
    clickImageItem: function (image) {
      ImagePreview([`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${image}`])
    },
  },
}
</script>

<style scoped>
.cardParent {
  background: white;
  border-radius: 7px;
  /*margin:  2% 3%;*/
  /*padding: 3% 3%;*/
  height: 100%;
  overflow: hidden;
}

.card {
  background: white;
  border-radius: 7px;
  margin: 2% 3%;
  /*padding: 3% 3%;*/
  height: 100%;
  overflow: hidden;
}

.cardTitle {
  text-align: center;
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 10px;
}

.card .imgParent {
  padding-left: 2%;
  height: 100%;
  width: 80px;
  display: inline-block;
  /*align-items: center;*/
}

p {
  font-size: 14px;
  margin: 0 0 2% 0;
  color: #000000;
}

.delete-button {
  height: 100%;
}
</style>