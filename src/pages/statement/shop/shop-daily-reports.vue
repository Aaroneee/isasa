<template>
  <div>
    <van-sticky>
      <baseNavBar :title="titleText"/>
      <van-field
          readonly
          clickable
          label="日期："
          :value="date"
          placeholder="选择日期"
          @click="show = true"
      />
      <van-calendar
          v-model="show"
          type="range"
          @confirm="dateOnConfirm"
          allow-same-day
          :min-date="minDate"
      />

      <van-field
          readonly
          clickable
          label="店铺："
          :value="shopName"
          placeholder="选择店铺"
          @click="showShop = true"
      />
      <van-popup v-model="showShop" round position="bottom">
        <van-picker
            show-toolbar
            :columns="shopArray"
            @cancel="showShop = false"
            @confirm="shopOnConfirm"
            :loading="shopLoading"
        />
      </van-popup>

      <van-field
          readonly
          clickable
          label="礼服师："
          :value="dressName"
          placeholder="选择礼服师"
          @click="showDress = true"
      />
      <van-popup v-model="showDress" round position="bottom">
        <van-picker
            show-toolbar
            :columns="dressArray"
            @cancel="showDress = false"
            @confirm="dressOnConfirm"
            :loading="dressLoading"
        />
      </van-popup>
    </van-sticky>

    <div v-if="!loadingList">
      <br/><br/><br/>
      <van-loading color="#1989fa" vertical>加载中...</van-loading>
    </div>
    <van-collapse v-model="activeNames" v-else>

      <van-collapse-item title="店铺业绩" name="1" icon="shop-o">
        <van-grid :border="false" style="text-align: center">
            <van-grid-item @click="showSaleDetail('总业绩')">总业绩<br/>{{earning}}</van-grid-item>
            <van-grid-item @click="showSaleDetail('售前业绩')">售前业绩<br>{{saleEarning}}</van-grid-item>
            <van-grid-item @click="showSaleDetail('售后业绩')">售后业绩<br>{{afterSaleEarning}}</van-grid-item>
            <van-grid-item @click="showTotalEarningDetail()">总营收<br>{{proceedsSum}}</van-grid-item>
        </van-grid>
      </van-collapse-item>

      <van-collapse-item title="营收报告" name="2" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="4">
          <van-grid-item v-for="value in revenueReports" :key="value.projectName" v-if="value.sumMoney!= 0" @click="showProjectsDetails(value.projectName)">
            {{value.projectName}}<br>{{value.sumMoney}}
          </van-grid-item>
        </van-grid>
      </van-collapse-item>

      <van-collapse-item title="营收来源分析" name="3" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="4">
          <van-grid-item v-for="item in earningSource" :key="item.sourceName">
            {{item.sourceName}}<br>{{item.sourceCount}}
          </van-grid-item>
        </van-grid>
      </van-collapse-item>

      <van-collapse-item title="客资来源分析" name="4" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="4">
          <van-grid-item v-for="value in cusSource" :key="value.sourceName">
            {{value.sourceName}}<br>{{value.sourceCount}}
          </van-grid-item>
        </van-grid>
      </van-collapse-item>

      <van-collapse-item title="售前情况" name="5" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="3">
          <van-grid-item @click="showAppointSaleDetails('售前接待')">售前接待数<br>{{saleReception}}</van-grid-item>
<!--          <van-grid-item @click="showOrderDetails('一次订单')">一次订单数<br>{{onceTheOrder}}</van-grid-item>-->
          <van-grid-item>一次订单数<br>{{onceTheOrder}}</van-grid-item>
<!--          <van-grid-item @click="showOnceNotOrderDetails('一次未订单')">一次未订单数<br>{{onceNotOrder}}</van-grid-item>-->
          <van-grid-item>一次未订单数<br>{{onceNotOrder}}</van-grid-item>
<!--          <van-grid-item @click="showOrderDetails('二次订单')">二次订单数<br>{{twiceTheOrder}}</van-grid-item>-->
          <van-grid-item>二次订单数<br>{{twiceTheOrder}}</van-grid-item>
          <van-grid-item>一次转换率<br>{{onceProportion}}</van-grid-item>
          <van-grid-item>综合转换率<br>{{comprehensiveProportion}}</van-grid-item>
        </van-grid>
      </van-collapse-item>

      <van-collapse-item title="售后情况" name="6" icon="shop-o">
        <van-grid :border="false" style="text-align: center" :column-num="3">
<!--          <van-grid-item @click="showAppointSaleDetails('售后接待')">售后接待数<br>{{afterSaleReception}}</van-grid-item>-->
          <van-grid-item>售后接待数<br>{{afterSaleReception}}</van-grid-item>
<!--          <van-grid-item @click="showAppointSaleDetails('售后升级接待')">售后升级接待数<br>{{afterSaleUpGradeReception}}</van-grid-item>-->
          <van-grid-item>售后升级接待数<br>{{afterSaleUpGradeReception}}</van-grid-item>
<!--          <van-grid-item @click="showOrderDetails('售后订单')">售后订单数<br>{{afterSaleOrderNum}}</van-grid-item>-->
          <van-grid-item>售后订单数<br>{{afterSaleOrderNum}}</van-grid-item>
          <van-grid-item>售后转换率<br>{{afterSaleProportion}}</van-grid-item>
        </van-grid>
      </van-collapse-item>

    </van-collapse>

    <!-- 店铺业绩弹窗 -->
    <van-popup
        v-model="showDetail"
        closeable
        position="bottom"
        close-icon-position="top-right"
        style="height: 60%; background-color: rgba(255,255,255,0.9) "
        round>
          <van-row type="flex" justify="space-around" align="center" style="background-color: rgb(255,255,255); height: 50px">
            {{ detailName }}详情
          </van-row>
          <van-row type="flex" justify="center">
            <van-collapse v-model="activeEarningDetail" :border="false" style="width: 90%">
              <van-collapse-item v-for="(item,index) in saleDetail" :name="index" :key="index">
                <template #title>
                  <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
                    <van-grid-item>
                      客户名：{{ item.name }}<br>
                      业绩店铺：{{ item.city }}
                    </van-grid-item>
                    <van-grid-item>
                      业绩所属人：{{ item.orderDress }}<br>
                      <b>{{ item.type === "售前预约" ? "售前业绩" : "售后业绩" }}：{{ item.achievement }}</b>
                    </van-grid-item>
                  </van-grid>
                </template>
                <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
                  <van-grid-item>
                    收款金额：{{ item.spareMoney }}<br>
                    业绩日期：{{ item.createDate }}<br>
                    订单总价：{{ item.orderPrice }}<br>
                    订单店铺：{{ item.city }}<br>
                    收款日期：{{ item.createDate }}
                  </van-grid-item>
                  <van-grid-item>
                    收款人：{{ item.payee }}<br>
                    订单编号：{{ item.orderNo }}<br>
                    订单余款：{{ item.orderSpare }}<br>
                    收款项目：{{ item.proceedsName }}<br>
                    收款方式：{{ item.payment }}
                  </van-grid-item>
                </van-grid>
              </van-collapse-item>
            </van-collapse>
          </van-row>
    </van-popup>

    <!-- 营收报告弹窗 -->
    <van-popup
        v-model="showProjectsDetail"
        closeable
        position="bottom"
        close-icon-position="top-right"
        style="height: 60%; background-color: rgba(255,255,255,0.9) "
        round>
      <van-row type="flex" justify="space-around" align="center" style="background-color: rgb(255,255,255); height: 12%">
        {{ projectsDetailName }}详情
      </van-row>
      <br>
      <van-row type="flex" justify="center">
        <van-collapse v-model="activeProjectsDetail" :border="false" style="width: 90%">
          <van-collapse-item v-for="(item,index) in projectsDetail" :name="index" :key="index">
            <template #title>
              <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
                <van-grid-item>
                  客户名:{{ item.name }}<br>
                  所属店铺:{{ item.city }}
                </van-grid-item>
                <van-grid-item>
                  礼服师:{{ item.orderDress }}<br>
                  <b>收款金额：{{ item.spareMoney }}</b>
                </van-grid-item>
              </van-grid>
            </template>
            <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
              <van-grid-item>
                订单总价：{{ item.orderPrice }}<br>
                订单编号：{{ item.orderNo }}<br>
                订单余款：{{ item.orderSpare }}<br>
                订单店铺：{{ item.city }}
              </van-grid-item>
              <van-grid-item>
                收款人：{{ item.payee }}<br>
                收款日期：{{ item.createDate }}<br>
                收款项目：{{ item.proceedsName }}<br>
                收款方式：{{ item.payment }}
              </van-grid-item>
            </van-grid>
          </van-collapse-item>
        </van-collapse>
      </van-row>
    </van-popup>

    <!-- 售前接待、售后接待、售后升级接待弹窗 -->
    <van-popup
        v-model="showAppointSaleDetailsPopup"
        closeable
        position="bottom"
        close-icon-position="top-right"
        style="height: 60%; background-color: rgba(255,255,255,0.9) "
        round>
      <van-row type="flex" justify="space-around" align="center" style="background-color: rgb(255,255,255); height: 12%">
        {{ appointSaleDetailsName }}详情
      </van-row>
      <br>
      <van-row type="flex" justify="center">
        <van-collapse v-model="activeAppointSaleDetail" :border="false" style="width: 90%">
          <van-collapse-item v-for="(item,index) in appointSaleDetails" :name="index" :key="index">
            <template #title>
              <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
                <van-grid-item>
                  客户名：{{ item.cusName }}<br>
                  所属店铺：{{ item.shopName }}
                </van-grid-item>
                <van-grid-item>
                  项目：{{ item.appointName }}<br>
                  <b>当前状态：{{ item.state }}</b>
                </van-grid-item>
              </van-grid>
            </template>
            <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
              <van-grid-item>
                到店日期：{{ item.arriveDate }}<br>
                到店时间：{{ item.arriveTime }}<br>
                预约人：{{ item.inviterName }}<br>
                礼服师：{{ item.dressName }}<br>
                客服：{{ item.serviceName }}
              </van-grid-item>
              <van-grid-item>
                预约时状态：{{ item.appState }}<br>
                渠道：{{ item.source }}<br>
                结算方式：{{ item.settlementMethod }}<br>
                <!-- 暂时这个字段没有值 -->
                <!--渠道对接人：{{ item.channelOppositePerson }}<br>-->
                意愿程度：{{ item.grade }}<br>
                手机号：{{ item.phone }}
              </van-grid-item>
            </van-grid>
          </van-collapse-item>
        </van-collapse>
      </van-row>
    </van-popup>

    <!-- 一次订单、二次订单、售后订单弹窗 -->
    <van-popup
        v-model="showOrderDetail"
        closeable
        position="bottom"
        close-icon-position="top-right"
        style="height: 60%; background-color: rgba(255,255,255,0.9) "
        round>
      <van-row type="flex" justify="space-around" align="center" style="background-color: rgb(255,255,255); height: 50px">
        {{ orderDetailName }}详情
      </van-row>
      <van-row type="flex" justify="center">
        <van-collapse v-model="activeOrderDetail" :border="false" style="width: 90%">
          <van-collapse-item v-for="(item,index) in orderDetail" :name="index" :key="index">
            <template #title>
              <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
                <van-grid-item>
                  客户名：{{ item.cusName }}<br>
                  订单店铺：{{ item.shopName }}
                </van-grid-item>
                <van-grid-item>
                  礼服师：{{ item.orderDress }}<br>
                  <b>确认款式：{{ item.confirmClothes }}</b>
                </van-grid-item>
              </van-grid>
            </template>
            <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
              <van-grid-item>
                订单编号：{{ item.orderNo }}<br>
                订单总价：{{ item.orderPrice }}<br>
              </van-grid-item>
              <van-grid-item>
                订单余款：{{ item.orderSpare }}<br>
              </van-grid-item>
            </van-grid>
          </van-collapse-item>
        </van-collapse>
      </van-row>
    </van-popup>

    <!-- 一次未订单弹窗 -->
    <van-popup
        v-model="showOnceNotOrderDetail"
        closeable
        position="bottom"
        close-icon-position="top-right"
        style="height: 60%; background-color: rgba(255,255,255,0.9) "
        round>
      <van-row type="flex" justify="space-around" align="center" style="background-color: rgb(255,255,255); height: 50px">
        一次未订单详情
      </van-row>
      <van-row type="flex" justify="center">
        <van-collapse v-model="activeOnceNotOrderDetail" :border="false" style="width: 90%">
          <van-collapse-item v-for="(item,index) in onceNotOrderDetail" :name="index" :key="index">
            <template #title>
              <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
                <van-grid-item>
                  客户名：{{ item.cusName }}<br>
                  预约店铺：{{ item.shopName }}
                </van-grid-item>
                <van-grid-item>
                  预约人：{{ item.inviterName }}<br>
                  预约状态：{{ item.appState }}
                </van-grid-item>
              </van-grid>
            </template>
            <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
              <van-grid-item>
                预约项目：{{ item.appointName }}<br>
                预约类型：{{ item.type }}
              </van-grid-item>
              <van-grid-item>
                礼服师：{{ item.appointDress }}<br>
                预约日期：{{ item.appointDate }}<br>
                是否到店: {{ item.isValid  }}
              </van-grid-item>
            </van-grid>
          </van-collapse-item>
        </van-collapse>
      </van-row>
    </van-popup>

    <!-- 营收弹窗 -->
    <van-popup
        v-model="showTotalEarning"
        closeable
        position="bottom"
        close-icon-position="top-right"
        style="height: 60%; background-color: rgba(255,255,255,0.9) "
        round>
      <van-row type="flex" justify="space-around" align="center" style="background-color: rgb(255,255,255); height: 50px">
        总营收详情
      </van-row>
      <van-row type="flex" justify="center">
        <van-collapse v-model="activeTotalEarningDetail" :border="false" style="width: 90%">
          <van-collapse-item v-for="(item,index) in totalEarningDetail" :name="index" :key="index">
            <template #title>
              <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
                <van-grid-item>
                  收款项目：{{ item.projectsName }}<br>
                  收款金额：{{ item.spareMoney }}
                </van-grid-item>
                <van-grid-item>
                  收款方式：{{ item.paymentName }}<br>
                  所属店铺：{{ item.shopName }}
                </van-grid-item>
              </van-grid>
            </template>
            <van-grid :border="false" style="text-align: left; font-size: 12px" :column-num="2" :center="false">
              <van-grid-item>
                订单编号：{{ item.orderNo }}<br>
                订单总价: {{ item.orderPrice }}<br>
                余款：{{ item.orderSpare }}
              </van-grid-item>
              <van-grid-item>
                礼服师：{{ item.orderDress }}<br>
                收款人：{{ item.payee }}
              </van-grid-item>
            </van-grid>
          </van-collapse-item>
        </van-collapse>
      </van-row>
    </van-popup>

  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar";

export default {
  name: "shop-daily-reports",
  components: {
    baseNavBar
  },
  created() {
    this.shopName="所有店铺"
    this.dressName="所有礼服师"
    this.queryShop();
    this.queryDress();
    this.queryShopEarningReports();
    this.queryEarningSource();
  },
  data() {
    return {
      showTotalEarning: false,
      showOnceNotOrderDetail: false,
      showAppointSaleDetailsPopup: false,
      showDetail: false,
      showOrderDetail: false,
      titleText: "每日业绩分析",
      loadingList: true,
      tenantCrop: localStorage.getItem("tenantCrop"),
      // 起始日期(默认昨天)
      startDate: this.formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)),
      // 结束日期(默认今天)
      endDate: this.formatDate(new Date()),
      date: this.formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)) + ' - ' + this.formatDate(new Date()),
      // 是否显示日期弹窗
      show: false,
      // 可选择的最早日期
      minDate: new Date(2015, 0, 1),
      // 是否显示礼服师下拉列表
      showDress: false,
      // 选择的礼服师
      dressName: '',
      dressId: '',
      // 礼服师列表
      dressArray: [{text: "所有礼服师", id: ""}],
      // 是否正在加载礼服师
      dressLoading: false,
      // 是否显示店铺下拉列表
      showShop: false,
      // 选择的店铺
      shopName: '',
      shopId: '',
      // 是否正在加载店铺
      shopLoading: false,
      // 店铺列表
      shopArray: [{text: "所有店铺", id: ""}],
      localShopArray: localStorage.getItem("shopIds").split(",").map(Number),
      activeNames: ['1','2','3','4','5', '6'],
      activeEarningDetail: [],

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

      // 店铺业绩详情
      saleDetail: {},
      // 详情名称
      detailName: '',
      // 是否显示营收详情
      showProjectsDetail: false,
      // 营收详情项目名
      projectsDetailName: '',
      // 是否展开单个详情
      activeProjectsDetail: [],
      // 营收详情
      projectsDetail: [],
      // 售前/售后 接待详情
      appointSaleDetails: [],
      // 接待项目名
      appointSaleDetailsName: '',
      // 是否展开单个接待
      activeAppointSaleDetail: [],
      // 订单类  名称
      orderDetailName: '',
      // 是否展开单个订单
      activeOrderDetail: [],
      // 订单类详情
      orderDetail: [],
      // 是否展开单个一次未订单
      activeOnceNotOrderDetail: [],
      // 一次未订单详情
      onceNotOrderDetail: [],
      // 是否展开单个营收
      activeTotalEarningDetail: [],
      // 营收详情
      totalEarningDetail: [],
      // 营收来源分析
      earningSource: [],
    }
  },
  methods: {
    showTotalEarningDetail() {
      this.queryTotalEarningDetails();
      this.activeTotalEarningDetail = [];
      this.showTotalEarning = true;
    },
    showOnceNotOrderDetails() {
      this.queryOnceNotOrderDetails();
      this.activeOnceNotOrderDetail = [];
      this.showOnceNotOrderDetail = true;
    },
    showOrderDetails(orderType) {
      if (orderType === "一次订单") {
        this.queryOrderDetails("售前预约",6)
      } else if (orderType === "二次订单") {
        this.queryOrderDetails("售前预约",15)
      } else if (orderType === "售后订单") {
        this.queryOrderDetails("售后预约",null)
      }
      this.orderDetailName = orderType;
      this.activeOrderDetail = [];
      this.showOrderDetail = true;
    },
    showAppointSaleDetails(appointSaleType) {
      if (appointSaleType === "售前接待") {
        this.queryAppointSaleDetails("售前预约");
      } else if (appointSaleType === "售后接待") {
        this.queryAppointSaleDetails("售后预约");
      } else if (appointSaleType === "售后升级接待") {
        this.queryAppointSaleDetails("售后升级接待");
      }
      this.appointSaleDetailsName = appointSaleType;
      this.activeAppointSaleDetail = [];
      this.showAppointSaleDetailsPopup = true;
    },
    showProjectsDetails(projectName) {
      this.projectsDetail = {}
      this.queryProjectsDetails(projectName);
      this.projectsDetailName = projectName;
      this.activeProjectsDetail = [];
      this.showProjectsDetail = true;
    },
    showSaleDetail(type) {
      this.saleDetail = {}
      if (type === "总业绩") {
        this.querySaleDetails(null);
      } else if (type === "售前业绩") {
        this.querySaleDetails("售前预约");
      } else if (type === "售后业绩") {
        this.querySaleDetails("售后预约");
      }
      this.detailName = type
      this.activeEarningDetail = [];
      this.showDetail = true;
    },
    formatDate(date) {
      return `${date.getFullYear()}-${this.$dateUtils.dateIsSingle(date.getMonth() + 1)}-${this.$dateUtils.dateIsSingle(date.getDate())}`;
    },
    dateOnConfirm(date) {
      this.loadingList = false;
      const [start, end] = date;
      this.show = false;
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
      this.date = this.startDate + ' - ' + this.endDate;
      this.queryShopEarningReports();
      this.queryEarningSource();
    },
    dressOnConfirm(dress) {
      this.loadingList = false;
      this.dressName = dress.text;
      this.dressId = dress.id;
      this.showDress = false;
      this.queryShopEarningReports();
      this.queryEarningSource();
    },
    shopOnConfirm(shop) {
      this.loadingList = false;
      this.shopName = shop.text;
      this.shopId = shop.id;
      this.showShop = false;
      this.queryShopEarningReports();
      this.queryEarningSource();
    },
    queryShop: function () {
      this.$selectUtils.queryShopIdsIsValid(this.$selectUtils.Picker).then(response => {
        this.shopArray.push(...JSON.parse(response.data.data).filter(s => {
          return this.localShopArray.includes(s.id)
        }))
      })
    },
    queryDress: function () {
      this.$selectUtils.queryDressIds(this.$selectUtils.Picker).then(response => {
        this.dressArray.push(...JSON.parse(response.data.data));
      })
    },
    queryShopEarningReports() {
      this.$axios({
        method: "GET",
        url: "/shopReports/queryShopDailyReports",
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          tenantCrop: this.tenantCrop,
          shopId: this.shopId,
          dressId: this.dressId,
        }
      }).then(response => {
        this.processData(response.data.data);
        this.loadingList = true;
      })
    },
    processData(data) {
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
    querySaleDetails(type) {
      this.$axios({
        methods: 'GET',
        url: "/shopReports/querySaleDetails",
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          tenantCrop: this.tenantCrop,
          shopId: this.shopId,
          dressId: this.dressId,
          type: type,
        }
      }).then(response => {
        this.saleDetail = response.data.data;
      })
    },
    queryProjectsDetails(projectName) {
      this.$axios({
        method: "GET",
        url: "/shopReports/queryProjectsDetails",
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          tenantCrop: this.tenantCrop,
          shopId: this.shopId,
          dressId: this.dressId,
          projectName: projectName
        }
      }).then(response => {
        this.projectsDetail = response.data.data;
      })
    },
    queryAppointSaleDetails(appointSaleType) {
      this.$axios({
        method: "GET",
        url: "/shopReports/queryAppointSaleDetails",
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          tenantCrop: this.tenantCrop,
          shopId: this.shopId,
          dressId: this.dressId,
          appointSaleType: appointSaleType
        }
      }).then(response => {
        this.appointSaleDetails = response.data.data;
      })
    },
    queryOrderDetails(type, appState) {
      this.$axios({
        method: "GET",
        url: "/shopReports/queryOrderDetails",
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          tenantCrop: this.tenantCrop,
          shopId: this.shopId,
          dressId: this.dressId,
          type: type,
          appState: appState
        }
      }).then(response => {
        this.orderDetail = response.data.data;
      })
    },
    queryOnceNotOrderDetails() {
      this.$axios({
        method: 'GET',
        url: '/shopReports/queryOnceNotOrderDetails',
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          tenantCrop: this.tenantCrop,
          shopId: this.shopId,
          dressId: this.dressId
        }
      }).then(response => {
        this.onceNotOrderDetail = response.data.data
      })
    },
    queryTotalEarningDetails() {
      this.$axios({
        method: 'GET',
        url: '/shopReports/queryTotalEarningDetails',
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          tenantCrop: this.tenantCrop,
          shopId: this.shopId,
          dressId: this.dressId
        }
      }).then(response => {
        this.totalEarningDetail = response.data.data
      })
    },
    queryEarningSource() {
      this.$axios({
        method: 'GET',
        url: '/shopReports/queryEarningSource',
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          tenantCrop: this.tenantCrop,
          shopId: this.shopId,
          dressId: this.dressId
        }
      }).then(response => {
        this.earningSource = response.data.data
      })
    }
  },
  computed: {
    revenueReports: function () {
      return this.proceedsAnalysis.filter((item) => {
        return item.projectName !== '押金'
      })
    },
    // depositReports: function () {
    //   return this.proceedsAnalysis.filter((item) => {
    //     return item.projectName === '押金'
    //   })
    // }
  },
}
</script>

<style scoped>

</style>
