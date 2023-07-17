<template>
  <div>
    <van-sticky>
      <baseNavBar :title="titleText"/>
      <van-dropdown-menu>
        <van-dropdown-item v-model="shopId" @change="shopChange"
                           :options="shopArray"/>
        <van-dropdown-item v-model="dressId" @change="dressChange"
                           :options="dressArray"/>
        <van-dropdown-item title="日期" ref="item">
          <van-datetime-picker
              v-model="currentDate"
              type="year-month"
              :min-date="minDate"
              :max-date="maxDate"
              @confirm="appointDateOnConfirm"
              @cancel="closeItem"
          />
        </van-dropdown-item>
      </van-dropdown-menu>
    </van-sticky>
    <div>
      <van-collapse v-model="activeNames">
        <van-collapse-item title="店铺业绩" name="1">
          <van-grid :border="false" style="text-align: center">
            <van-grid-item>总业绩<br>{{earning}}</van-grid-item>
            <van-grid-item>售前业绩<br>{{saleEarning}}</van-grid-item>
            <van-grid-item>售后业绩<br>{{afterSaleEarning}}</van-grid-item>
            <van-grid-item>总营收<br>{{proceedsSum}}</van-grid-item>
          </van-grid>
        </van-collapse-item>
        <van-collapse-item title="营收报告" name="2">
          <van-grid :border="false" style="text-align: center" :column-num="4">
            <van-grid-item v-for="value in proceedsAnalysis" :key="value.projectName" v-if="value.sumMoney!= 0">
              {{value.projectName}}<br>{{value.sumMoney}}
            </van-grid-item>
          </van-grid>
        </van-collapse-item>
        <van-collapse-item title="售前情况" name="3">
          <van-grid :border="false" style="text-align: center" :column-num="3">
            <van-grid-item>售前接待数<br>{{saleReception}}</van-grid-item>
            <van-grid-item>一次订单数<br>{{onceTheOrder}}</van-grid-item>
            <van-grid-item>一次未订单数<br>{{onceNotOrder}}</van-grid-item>
            <van-grid-item>二次订单数<br>{{twiceTheOrder}}</van-grid-item>
            <van-grid-item>一次转换率<br>{{onceProportion}}</van-grid-item>
            <van-grid-item>综合转换率<br>{{comprehensiveProportion}}</van-grid-item>
          </van-grid>
        </van-collapse-item>
        <van-collapse-item title="售后情况" name="4">
          <van-grid :border="false" style="text-align: center" :column-num="3">
            <van-grid-item>售后接待数<br>{{afterSaleReception}}</van-grid-item>
            <van-grid-item>售后升级接待数<br>{{afterSaleUpGradeReception}}</van-grid-item>
            <van-grid-item>售后订单数<br>{{afterSaleOrderNum}}</van-grid-item>
            <van-grid-item>售后转换率<br>{{afterSaleProportion}}</van-grid-item>
          </van-grid>
        </van-collapse-item>
        <van-collapse-item title="客资来源分析" name="5">
          <van-grid :border="false" style="text-align: center" :column-num="4">
            <van-grid-item v-for="value in cusSource" :key="value.sourceName">
              {{value.sourceName}}<br>{{value.sourceCount}}
            </van-grid-item>
          </van-grid>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "shopEarningReports",
  components: {
    baseNavBar
  },
  created() {
    this.queryShop();
    this.queryDress();
    this.queryShopEarningReports();
  },
  data() {
    return{
      titleText: "店铺业绩分析",
      tenantCrop: localStorage.getItem("tenantCrop"),

      currentDate: new Date(),
      startDate:this.$dateUtils.vantDateToYM(new Date()) + "-01",
      endDate:this.$dateUtils.vantDateToYM(new Date()) + "-" + this.$dateUtils.getLastDayByYm(new Date()),

      shopId: "",
      shopArray:[{text:"店铺",value: ""}],

      dressId: "",
      dressArray:[{text:"礼服师",value: ""}],

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

      activeNames: ['1','2','3','4','5'],

      //售前业绩
      saleEarning: "0",
      //售后业绩
      afterSaleEarning: "0",
      //总业绩
      earning: "0",
      //总营收
      proceedsSum: "0",
      //售前接待数
      saleReception: "0",
      //售前订单数
      saleOrderNum: "0",
      //售前转化率
      saleProportion: "0",
      //售后接待数
      afterSaleReception: "0",
      //售后订单数
      afterSaleOrderNum: "0",
      //售后转化率
      afterSaleProportion: "0",
      //营收报告
      proceedsAnalysis:[],
      //客资来源
      cusSource:[],
      //一次订单数
      onceTheOrder: "0",
      //一次未订单数
      onceNotOrder: "0",
      //一次转化率
      onceProportion: "0",
      //二次订单数
      twiceTheOrder: "0",
      //综合转化率
      comprehensiveProportion: "0",
      //售后升级接待数
      afterSaleUpGradeReception: "0",
    }
  },
  methods: {
    queryShopEarningReports: function () {
      this.$axios({
        method: "GET",
        url: "/shopReports/queryShopEarningReports",
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          tenantCrop: this.tenantCrop,
          shopId: this.shopId,
          dressId: this.dressId,
        }
      }).then(response => {
        this.processData(response.data.data);
      });
    },
    shopChange: function () {
      this.queryShopEarningReports();
    },
    dressChange: function () {
      this.queryShopEarningReports();
    },
    appointDateOnConfirm: function (time) {
      this.startDate = this.$dateUtils.vantDateToYMD(time);
      this.endDate = this.$dateUtils.vantDateToYM(time) + "-" + this.$dateUtils.getLastDayByYm(time);
      this.queryShopEarningReports();
      this.$refs.item.toggle();
    },
    closeItem: function () {
      this.$refs.item.toggle();
    },
    queryShop: function () {
      this.$selectUtils.queryShopIds(this.$selectUtils.DropDownMenu).then(response => {
        this.shopArray.push(...JSON.parse(response.data.data));
      })
    },
    queryDress: function () {
      this.$selectUtils.queryDressIds(this.$selectUtils.DropDownMenu).then(response => {
        this.dressArray.push(...JSON.parse(response.data.data));
      })
    },
    processData: function (data) {
      const VO = data[0];
      this.saleEarning =Number(VO.saleEarning);
      this.afterSaleEarning = Number(VO.afterSaleEarning);
      this.earning = Number(VO.earning);
      this.proceedsSum=Number(VO.proceedsSum)
      this.saleReception = Number(VO.saleReception);
      this.saleOrderNum = Number(VO.saleOrderNum);
      this.afterSaleReception = Number(VO.afterSaleReception);
      this.afterSaleUpGradeReception = Number(VO.afterSaleUpGradeReception);
      this.afterSaleOrderNum = Number(VO.afterSaleOrderNum);
      this.onceTheOrder = Number(VO.onceTheOrder);
      this.onceNotOrder = this.saleReception - this.onceTheOrder;
      let temp3 = (this.onceTheOrder/this.saleReception*100).toFixed(2)
      this.onceProportion = temp3==='NaN'?"0":temp3+"%";
      this.twiceTheOrder = Number(VO.twiceTheOrder);
      let temp4 = ((this.twiceTheOrder+this.onceTheOrder)/this.saleReception*100).toFixed(2);
      this.comprehensiveProportion = temp4==="NaN"?"0":temp4+"%";
      let temp1 = (this.saleOrderNum/this.saleReception*100).toFixed(2);
      let temp2 = (this.afterSaleOrderNum/this.afterSaleReception*100).toFixed(2);
      this.saleProportion = temp1==='NaN'?"0":temp1+"%";
      this.afterSaleProportion = temp2==='NaN'?"0":temp2+"%";
      this.cusSource = [];
      this.proceedsAnalysis = [];
      this.cusSource.push(...data[1]);
      this.proceedsAnalysis.push(...data[2]);
    },
  }
}
</script>


<style scoped>

</style>