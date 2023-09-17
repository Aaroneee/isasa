<template>
  <div>
    <van-sticky>
      <baseNavBar title="渠道分析表"/>
      <van-dropdown-menu>
        <!--      <van-dropdown-item v-model="serviceId" @change="serviceChange" :options="serviceArray"/>
              <van-dropdown-item v-model="dressId" @change="dressChange" :options="dressArray"/>-->
        <van-dropdown-item v-model="shopId" @change="shopChange" :options="shopArray"/>
        <van-dropdown-item v-model="sourceId" @change="sourceChange" :options="sourceArray"/>
        <van-dropdown-item v-model="empId" @change="empChange" :options="empArray"/>
      </van-dropdown-menu>
      <van-cell title="选择日期:" :value="date" @click="createDateShow = true"/>
      <van-calendar
          v-model="createDateShow"
          type="range"
          @confirm="dateOnConfirm"
          allow-same-day
          :min-date="minDate"
      />
    </van-sticky>

    <van-tabs v-model="active" animated swipeable :lazy-render="false" color="#409eff">
      <van-tab title="渠道客资" :disabled="!isService">
        <van-row>
          <van-col span="24">
            <div v-show="sourceCusViewData.length !== 0" style="background-color: white;margin-bottom: 20px;width: 100%">
              <canvas id="sourceCusView"></canvas>
              <van-divider dashed :style="{borderColor: '#c6effc'}"></van-divider>
              <div>
                <van-collapse v-model="activeCus">
                  <van-field
                      readonly
                      label="渠道"
                      v-model="cusTableHeader"
                      input-align="center"
                      style="background-color: #f5f7fa"
                  />
                  <van-collapse-item
                      :title="value.sourceName"
                      v-for="(value,index) in sourceCusViewData"
                      :key="value.id"
                      :name="index">
                    <template #title>
                      <van-field
                          readonly
                          :label="value.sourceName"
                          input-align="center"
                          v-model="value.sourceCount"
                      />
                    </template>

                    <template v-if="value.children !== undefined && value.children.length === 0">
                      <div style="text-align: center">无子渠道</div>
                    </template>

                    <template v-if="value.children !== undefined && value.children.length !== 0">
                      <van-field
                          readonly
                          v-for="item in value.children"
                          :label="item.sourceName"
                          input-align="center"
                          v-model="item.sourceCount"
                          :key="item.id"
                      />
                    </template>
                  </van-collapse-item>
                  <van-field
                      readonly
                      label="合计"
                      v-model="cusCount"
                      input-align="center"
                      style="font-weight: bold"
                  />
                </van-collapse>
              </div>
            </div>
            <div v-show="sourceCusViewData.length === 0" style="background-color: white;width: 100%;height: 100vh">
              <van-empty description="暂无客资" />
            </div>
          </van-col>
        </van-row>
      </van-tab>
      <van-tab title="渠道到店">
        <van-row>
          <van-col span="24">
            <div v-show="sourceCusArrivalViewData.length !== 0" style="background-color: white;margin-bottom: 20px;width: 100%">
              <canvas id="sourceCusArrivalView"></canvas>
              <van-divider dashed :style="{borderColor: '#c6effc'}"></van-divider>
              <div class="van_table_show">
                <div class="test" style="color: #606266;background-color: #f5f7fa">
                  <van-row>
                    <van-col :span="span">渠道</van-col>
                    <van-col :span="span">到店数</van-col>
                    <van-col span="8" v-if="isService">客资到店转化率</van-col>
                  </van-row>
                </div>
                <van-collapse v-model="activeApp">
                  <van-collapse-item
                      :title="value.sourceName"
                      v-for="(value,index) in sourceCusArrivalViewData"
                      :key="value.id"
                      :name="index">
                    <template #title>
                      <van-row>
                        <van-col :span="span">{{value.sourceName}}</van-col>
                        <van-col :span="span">{{value.sourceCount}}</van-col>
                        <van-col span="8" v-if="value.proportion == null && isService">-</van-col>
                        <van-col span="8" v-if="value.proportion != null && isService">{{(value.proportion * 100).toFixed(1)}}%</van-col>
                      </van-row>
                    </template>

                    <template v-if="value.children !== undefined && value.children.length === 0">
                      <div style="text-align: center">无子渠道</div>
                    </template>

                    <template v-if="value.children !== undefined && value.children.length !== 0">
                      <van-row v-for="item in value.children" :key="item.id">
                        <van-col :span="span">{{item.sourceName}}</van-col>
                        <van-col :span="span">{{item.sourceCount}}</van-col>
                        <van-col span="8" v-if="item.proportion == null && isService">-</van-col>
                        <van-col span="8" v-if="item.proportion != null && isService">{{(item.proportion * 100).toFixed(1)}}%</van-col>
                      </van-row>
                    </template>
                  </van-collapse-item>
                </van-collapse>
                <div class="test" style="color: #606266;font-weight:bold">
                  <van-row>
                    <van-col :span="span">合计</van-col>
                    <van-col :span="span">{{cusArrivalCount}}</van-col>
                    <van-col span="8" v-if="isService">-</van-col>
                  </van-row>
                </div>
              </div>
            </div>
            <div v-show="sourceCusArrivalViewData.length === 0" style="background-color: white;width: 100%;height: 100vh">
              <van-empty description="暂无到店" />
            </div>
          </van-col>
        </van-row>
      </van-tab>
      <van-tab title="渠道订单">
        <van-row>
          <van-col span="24">
            <div v-show="sourceCusOrderViewData.length !== 0" style="background-color: white;margin-bottom: 20px;width: 100%" >
              <canvas id="sourceCusOrderView"></canvas>
              <van-divider dashed :style="{borderColor: '#c6effc'}"></van-divider>
              <div class="van_table_show">
                <div class="test" style="color: #606266;background-color: #f5f7fa">
                  <van-row>
                    <van-col span="8">渠道</van-col>
                    <van-col span="8">订单数</van-col>
                    <van-col span="8">到店订单转化率</van-col>
                  </van-row>
                </div>
                <van-collapse v-model="activeCus">
                  <van-collapse-item
                      :title="value.sourceName"
                      v-for="(value,index) in sourceCusOrderViewData"
                      :key="value.id"
                      :name="index">
                    <template #title>
                      <van-row>
                        <van-col :span="span">{{value.sourceName}}</van-col>
                        <van-col :span="span">{{value.sourceCount}}</van-col>
                        <van-col span="8" v-if="value.proportion == null">-</van-col>
                        <van-col span="8" v-if="value.proportion != null">{{(value.proportion * 100).toFixed(1)}}%</van-col>
                      </van-row>
                    </template>

                    <template v-if="value.children !== undefined && value.children.length === 0">
                      <div style="text-align: center">无子渠道</div>
                    </template>

                    <template v-if="value.children !== undefined && value.children.length !== 0">
                      <van-row v-for="item in value.children" :key="item.id">
                        <van-col :span="span">{{item.sourceName}}</van-col>
                        <van-col :span="span">{{item.sourceCount}}</van-col>
                        <van-col span="8" v-if="item.proportion == null && isService">-</van-col>
                        <van-col span="8" v-if="item.proportion != null && isService">{{(item.proportion * 100).toFixed(1)}}%</van-col>
                      </van-row>
                    </template>
                  </van-collapse-item>
                </van-collapse>
<!--                <div v-for="value in sourceCusOrderViewData" :key="value.id" class="test">-->
<!--                  <van-row>-->
<!--                    <van-col span="8">{{value.sourceName}}</van-col>-->
<!--                    <van-col span="8">{{value.sourceCount}}</van-col>-->
<!--                    <van-col span="8" v-if="value.proportion == null">-</van-col>-->
<!--                    <van-col span="8" v-else>{{(value.proportion * 100).toFixed(1)}}%</van-col>-->
<!--                  </van-row>-->
<!--                </div>-->
                <div class="test" style="color: #606266;font-weight:bold">
                  <van-row>
                    <van-col span="8">合计</van-col>
                    <van-col span="8">{{cusOrderCount}}</van-col>
                    <van-col span="8">-</van-col>
                  </van-row>
                </div>
              </div>
            </div>
            <div v-show="sourceCusOrderViewData.length === 0" style="background-color: white;width: 100%;height: 100vh">
              <van-empty description="暂无订单" />
            </div>
          </van-col>
        </van-row>
      </van-tab>
<!--      <van-tab title="渠道收款">-->
<!--        <van-row>-->
<!--          <van-col span="24">-->
<!--            <div v-show="sourceCusMoneyViewData.length !== 0" style="background-color: white;margin-bottom: 20px;width: 100%">-->
<!--              <canvas id="sourceCusMoneyView"></canvas>-->
<!--              <van-divider dashed :style="{borderColor: '#c6effc'}"></van-divider>-->
<!--              <div>-->
<!--&lt;!&ndash;                <van-field&ndash;&gt;-->
<!--&lt;!&ndash;                    readonly&ndash;&gt;-->
<!--&lt;!&ndash;                    label="渠道"&ndash;&gt;-->
<!--&lt;!&ndash;                    v-model="moneyTableHeader"&ndash;&gt;-->
<!--&lt;!&ndash;                    input-align="center"&ndash;&gt;-->
<!--&lt;!&ndash;                    style="background-color: #f5f7fa"&ndash;&gt;-->
<!--&lt;!&ndash;                />&ndash;&gt;-->
<!--&lt;!&ndash;                <van-field&ndash;&gt;-->
<!--&lt;!&ndash;                    v-for="value in sourceCusMoneyViewData" :key="value.id"&ndash;&gt;-->
<!--&lt;!&ndash;                    readonly&ndash;&gt;-->
<!--&lt;!&ndash;                    :label="value.sourceName"&ndash;&gt;-->
<!--&lt;!&ndash;                    input-align="center"&ndash;&gt;-->
<!--&lt;!&ndash;                    v-model="value.sourceCount"&ndash;&gt;-->
<!--&lt;!&ndash;                />&ndash;&gt;-->
<!--                <van-collapse v-model="activeMoney">-->
<!--                  <van-field-->
<!--                      readonly-->
<!--                      label="渠道"-->
<!--                      v-model="moneyTableHeader"-->
<!--                      input-align="center"-->
<!--                      style="background-color: #f5f7fa"-->
<!--                  />-->
<!--                  <van-collapse-item-->
<!--                      :title="value.sourceName"-->
<!--                      v-for="(value,index) in sourceCusMoneyViewData"-->
<!--                      :key="value.id"-->
<!--                      :name="index">-->
<!--                    <template #title>-->
<!--                      <van-field-->
<!--                          readonly-->
<!--                          :label="value.sourceName"-->
<!--                          input-align="center"-->
<!--                          v-model="value.sourceCount"-->
<!--                      />-->
<!--                    </template>-->

<!--                    <template v-if="value.children !== undefined && value.children.length === 0">-->
<!--                      <div style="text-align: center">无子渠道</div>-->
<!--                    </template>-->

<!--                    <template v-if="value.children !== undefined && value.children.length !== 0">-->
<!--                      <van-field-->
<!--                          readonly-->
<!--                          v-for="item in value.children"-->
<!--                          :label="item.sourceName"-->
<!--                          input-align="center"-->
<!--                          v-model="item.sourceCount"-->
<!--                          :key="item.id"-->
<!--                      />-->
<!--                    </template>-->
<!--                  </van-collapse-item>-->
<!--                <van-field-->
<!--                    readonly-->
<!--                    label="合计"-->
<!--                    v-model="cusMoneyCount"-->
<!--                    input-align="center"-->
<!--                />-->
<!--                </van-collapse>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div v-show="sourceCusMoneyViewData.length === 0" style="background-color: white;width: 100%;height: 100vh">-->
<!--              <van-empty description="暂无收款" />-->
<!--            </div>-->
<!--          </van-col>-->
<!--        </van-row>-->
<!--      </van-tab>-->
      <van-tab title="渠道业绩">
        <van-row>
          <van-col span="24">
            <div v-show="sourceCusMoneyViewData.length !== 0" style="background-color: white;margin-bottom: 20px;width: 100%">
              <canvas id="sourceCusMoneyView"></canvas>
              <van-divider dashed :style="{borderColor: '#c6effc'}"></van-divider>
              <div>
                <!--                <van-field-->
                <!--                    readonly-->
                <!--                    label="渠道"-->
                <!--                    v-model="moneyTableHeader"-->
                <!--                    input-align="center"-->
                <!--                    style="background-color: #f5f7fa"-->
                <!--                />-->
                <!--                <van-field-->
                <!--                    v-for="value in sourceCusMoneyViewData" :key="value.id"-->
                <!--                    readonly-->
                <!--                    :label="value.sourceName"-->
                <!--                    input-align="center"-->
                <!--                    v-model="value.sourceCount"-->
                <!--                />-->
                <van-collapse v-model="activeMoney">
                  <van-field
                      readonly
                      label="渠道"
                      v-model="moneyTableHeader"
                      input-align="center"
                      style="background-color: #f5f7fa"
                  />
                  <van-collapse-item
                      :title="value.sourceName"
                      v-for="(value,index) in sourceCusMoneyViewData"
                      :key="value.id"
                      :name="index">
                    <template #title>
                      <van-field
                          readonly
                          :label="value.sourceName"
                          input-align="center"
                          v-model="value.sourceCount"
                      />
                    </template>

                    <template v-if="value.children !== undefined && value.children.length === 0">
                      <div style="text-align: center">无子渠道</div>
                    </template>

                    <template v-if="value.children !== undefined && value.children.length !== 0">
                      <van-field
                          readonly
                          v-for="item in value.children"
                          :label="item.sourceName"
                          input-align="center"
                          v-model="item.sourceCount"
                          :key="item.id"
                      />
                    </template>
                  </van-collapse-item>
                  <van-field
                      readonly
                      label="合计"
                      v-model="cusMoneyCount"
                      input-align="center"
                  />
                </van-collapse>
              </div>
            </div>
            <div v-show="sourceCusMoneyViewData.length === 0" style="background-color: white;width: 100%;height: 100vh">
              <van-empty description="暂无收款" />
            </div>
          </van-col>
        </van-row>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import F2 from '@antv/f2';
import baseNavBar from "@/components/nav-bar/base-nav-bar";

export default {
  name: "customer-source",
  components: {
    baseNavBar
  },
  data() {
    return {
      active: 0,
      // 渠道客资
      sourceCusData: [],
      sourceCusView: {},
      sourceCusViewData: [],
      cusCount: 0,
      // 渠道到店
      sourceCusArrivalData: [],
      sourceCusArrivalView: {},
      sourceCusArrivalViewData: [],
      cusArrivalCount: 0,
      // 渠道订单
      sourceCusOrderData: [],
      sourceCusOrderView: {},
      sourceCusOrderViewData: [],
      cusOrderCount: 0,
      // 渠道收款
      sourceCusMoneyData: [],
      sourceCusMoneyView: {},
      sourceCusMoneyViewData: [],
      cusMoneyCount: 0,

      createDateShow: false,
      maxDate: this.$dateUtils.getMaxMinDate()[0],
      minDate: this.$dateUtils.getMaxMinDate()[1],
      date: this.$dateUtils.getMonthStartEndDayStr(),
      chooseDate: new Date(),
      cusTableHeader: "客资数",
      arrivalTableHeader: "到店数",
      orderTableHeader: "订单数",
      moneyTableHeader: "金额",
      tenantCrop: localStorage.getItem("tenantCrop"),
      serviceArray: [{text: "选择客服", value: ""}],
      serviceId: "",
      dressArray: [{text: "选择礼服师", value: ""}],
      dressId: "",
      isService: true,
      selectPopup: false,
      sourceId: "",
      sourceArray: [{text: "选择渠道", value: ""}],
      activeCus: [],
      empArray: [{text: "选择员工", value: ""}],
      empId: "",
      activeOrder: [],
      activeApp: [],
      activeMoney: [],
      shopArray: [{text: "选择店铺", value: ""}],
      shopId: "",

    }
  },
  created() {
    this.pageInit()
    this.querySourceIds()
    this.queryEmpIds()
    this.queryShopIds()
    this.date = this.formatDate(this.$dateUtils.getCurrentMonthFirstDay()) + " - " + this.formatDate(this.$dateUtils.getCurrentMonthLastDay())
  },
  mounted() {
    var v = this;
    this.$nextTick(() => {
      v.initSourceCusView()
      v.initSourceCusArrivalView()
      v.initSourceCusOrderView()
      v.initSourceCusMoneyView()
    });
  },
  computed: {
    span: function () {
      if (this.isService) {
        return 8
      }
      return 12
    }
  },
  methods: {
    pageInit() {
      this.querySourceReportsCus()
      this.querySourceReportsArrival()
      this.querySourceReportsOrder()
      this.querySourceReportsMoney()
    },
    formatDate(date) {
      return `${date.getFullYear()}-${this.$dateUtils.dateIsSingle(date.getMonth() + 1)}-${this.$dateUtils.dateIsSingle(date.getDate())}`;
    },
    dateOnConfirm(date) {
      const [start, end] = date;
      this.createDateShow = false;
      this.date = this.formatDate(start) + ' - ' + this.formatDate(end);
      this.pageInit()
    },
    queryServiceIds: function () {
      this.$selectUtils.queryServiceIds(this.$selectUtils.DropDownMenu).then(response => {
        if (response.data.code === 200) {
          this.serviceArray.push(...JSON.parse(response.data.data));
        } else {
          self.$toast.fail(response.data.msg);
        }
      })
    },
    queryEmpIds () {
      this.$selectUtils.queryServiceAndDress(this.$selectUtils.DropDownMenu, this.shopId).then(response => {
        if (response.data.code === 200) {
          this.empArray.push(...JSON.parse(response.data.data));
        }
      })
    },
    queryDressArray() {
      this.$selectUtils.queryDressIdsByShop(this.$selectUtils.DropDownMenu, this.shop).then(response => {
        this.dressArray.push(...JSON.parse(response.data.data))
      })
    },
    queryShopIds() {
      this.$selectUtils.queryShopIds(this.$selectUtils.DropDownMenu).then(response => {
        if (response.data.code === 200) {
          this.shopArray.push(...JSON.parse(response.data.data));
        }
      })
    },
    // 获取一级渠道
    querySourceIds() {
      this.$axios({
        method: 'get',
        url: '/select/sourceOneLevelIds',
        params: {
          tenantCrop: this.tenantCrop,
          type: this.$selectUtils.DropDownMenu
        }
      }).then(response => {
        this.sourceArray.push(...JSON.parse(response.data.data));
      })
    },
    // 渠道客资
    async querySourceReportsCus() {
      this.sourceCusViewData = []
      await this.$axios({
        method: 'get',
        url: '/serviceReports/customerSourceReportsCus',
        params: {
          date: this.date,
          tenantCrop: this.tenantCrop,
          empId: this.empId,
          sourceId: this.sourceId,
          shopId: this.shopId
        },
      }).then(response => {
        this.sourceCusData = response.data.data;
        this.isService=true
        this.active=0
        let data = this.dataProcess(this.sourceCusData)
        this.cusCount = data.count
        this.sourceCusViewData = data.data
        this.sourceCusView.changeData(data.data)
      });
    },
    initSourceCusView() {
      const PieLabel = require('@antv/f2/lib/plugin/pie-label');
      this.sourceCusView = new F2.Chart({
        id: 'sourceCusView',
        pixelRatio: window.devicePixelRatio,
        plugins: PieLabel,
        padding: 'auto',
        width: document.body.clientWidth,
        height: 380,
        appendPadding: 30,
      });
      this.sourceCusView.source(this.sourceCusData);
      // 不渲染坐标轴
      this.sourceCusView.axis(false);
      this.sourceCusView.tooltip(false);
      this.sourceCusView.coord('polar', {
        transposed: true, // 坐标系翻转
        innerRadius: 0.4, // 内环半径，数值为 0 - 1 范围
        radius: 0.9 // 半径，数值为 0 - 1 范围
      });
      this.sourceCusView.legend({
        position: 'bottom',
        align: 'center',
        clickable: false,
      });
      this.sourceCusView.pieLabel({
        sidePadding: 30,
        inflectionOffset: 15,
        label1: function label1(data) {
          return {
            text: data.sourceName,
            fill: '#808080',
            fontSize: 14,
          };
        },
        label2: function label2(data) {
          return {
            fill: '#000000',
            text: data.pro.toFixed(2) + '%',
            fontWeight: 500,
            fontSize: 13,
          };
        }
      })
      this.sourceCusView.interval()
          .position('sourceType*sourceCount')
          .color('sourceName', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864','#ffe2ca','#299999','#ff9d4e','#9967bd'])
          .adjust('stack');
      this.sourceCusView.render();
    },
    // 渠道到店
    querySourceReportsArrival() {
      this.$axios({
        method: 'get',
        url: '/serviceReports/customerSourceReportsYesApp',
        params: {
          date: this.date,
          tenantCrop: this.tenantCrop,
          empId: this.empId,
          sourceId: this.sourceId,
          shopId: this.shopId
        },
      }).then(response => {
        this.sourceCusArrivalData = response.data.data;
        let data = this.dataProcess(this.sourceCusArrivalData)
        this.cusArrivalCount = data.count
        this.sourceCusArrivalViewData = data.data
        this.sourceCusArrivalView.changeData(data.data)
      });
    },
    initSourceCusArrivalView() {
      const PieLabel = require('@antv/f2/lib/plugin/pie-label');
      this.sourceCusArrivalView = new F2.Chart({
        id: 'sourceCusArrivalView',
        pixelRatio: window.devicePixelRatio,
        plugins: PieLabel,
        padding: 'auto',
        width: document.body.clientWidth,
        height: 380,
        appendPadding: 30,
      });
      this.sourceCusArrivalView.source(this.sourceCusArrivalData);
      // 不渲染坐标轴
      this.sourceCusArrivalView.axis(false);
      this.sourceCusArrivalView.tooltip(false);
      this.sourceCusArrivalView.coord('polar', {
        transposed: true, // 坐标系翻转
        innerRadius: 0.4, // 内环半径，数值为 0 - 1 范围
        radius: 0.9 // 半径，数值为 0 - 1 范围
      });
      this.sourceCusArrivalView.legend({
        position: 'bottom',
        align: 'center',
        clickable: false,
      });
      this.sourceCusArrivalView.pieLabel({
        sidePadding: 30,
        inflectionOffset: 15,
        label1: function label1(data) {
          return {
            text: data.sourceName,
            fill: '#808080',
            fontSize: 14,
          };
        },
        label2: function label2(data) {
          return {
            fill: '#000000',
            text: data.pro.toFixed(2) + '%',
            fontWeight: 500,
            fontSize: 13,
          };
        }
      })
      this.sourceCusArrivalView.interval()
          .position('sourceType*sourceCount')
          .color('sourceName', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864','#ffe2ca','#299999','#ff9d4e','#9967bd'])
          .adjust('stack');
      this.sourceCusArrivalView.render();
    },
    // 渠道订单
    querySourceReportsOrder() {
      this.$axios({
        method: 'get',
        url: '/serviceReports/customerSourceReportsOrder',
        params: {
          date: this.date,
          tenantCrop: this.tenantCrop,
          empId: this.empId,
          sourceId: this.sourceId,
          shopId: this.shopId
        },
      }).then(response => {
        this.sourceCusOrderData = response.data.data
        let data = this.dataProcess(this.sourceCusOrderData)
        this.cusOrderCount = data.count
        this.sourceCusOrderViewData = data.data
        this.sourceCusOrderView.changeData(data.data);
      });
    },
    initSourceCusOrderView() {
      const PieLabel = require('@antv/f2/lib/plugin/pie-label');
      this.sourceCusOrderView = new F2.Chart({
        id: 'sourceCusOrderView',
        pixelRatio: window.devicePixelRatio,
        plugins: PieLabel,
        padding: 'auto',
        width: document.body.clientWidth,
        height: 380,
        appendPadding: 30,
      });
      this.sourceCusOrderView.source(this.sourceCusArrivalData);
      // 不渲染坐标轴
      this.sourceCusOrderView.axis(false);
      this.sourceCusOrderView.tooltip(false);
      this.sourceCusOrderView.coord('polar', {
        transposed: true, // 坐标系翻转
        innerRadius: 0.4, // 内环半径，数值为 0 - 1 范围
        radius: 0.9 // 半径，数值为 0 - 1 范围
      });
      this.sourceCusOrderView.legend({
        position: 'bottom',
        align: 'center',
        clickable: false,
      });
      this.sourceCusOrderView.pieLabel({
        sidePadding: 30,
        inflectionOffset: 15,
        label1: function label1(data) {
          return {
            text: data.sourceName,
            fill: '#808080',
            fontSize: 14,
          };
        },
        label2: function label2(data) {
          return {
            fill: '#000000',
            text: data.pro.toFixed(2) + '%',
            fontWeight: 500,
            fontSize: 13,
          };
        }
      })
      this.sourceCusOrderView.interval()
          .position('sourceType*sourceCount')
          .color('sourceName', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864','#ffe2ca','#299999','#ff9d4e','#9967bd'])
          .adjust('stack');
      this.sourceCusOrderView.render();
    },
    // 渠道收款
    querySourceReportsMoney() {
      this.$axios({
        method: 'get',
        url: '/serviceReports/customerSourceReportsMoney',
        params: {
          date: this.date,
          tenantCrop: this.tenantCrop,
          empId: this.empId,
          sourceId: this.sourceId,
          shopId: this.shopId
        },
      }).then(response => {
        this.sourceCusMoneyData = response.data.data;
        let data = this.dataProcess(this.sourceCusMoneyData)
        this.cusMoneyCount = data.count
        this.sourceCusMoneyViewData = data.data
        this.sourceCusMoneyView.changeData(data.data);
      });
    },
    initSourceCusMoneyView() {
      const PieLabel = require('@antv/f2/lib/plugin/pie-label');
      this.sourceCusMoneyView = new F2.Chart({
        id: 'sourceCusMoneyView',
        pixelRatio: window.devicePixelRatio,
        plugins: PieLabel,
        padding: 'auto',
        width: document.body.clientWidth,
        height: 380,
        appendPadding: 30,
      });
      this.sourceCusMoneyView.source(this.sourceCusArrivalData);
      // 不渲染坐标轴
      this.sourceCusMoneyView.axis(false);
      this.sourceCusMoneyView.tooltip(false);
      this.sourceCusMoneyView.coord('polar', {
        transposed: true, // 坐标系翻转
        innerRadius: 0.4, // 内环半径，数值为 0 - 1 范围
        radius: 0.9 // 半径，数值为 0 - 1 范围
      });
      this.sourceCusMoneyView.legend({
        position: 'bottom',
        align: 'center',
        clickable: false,
      });
      this.sourceCusMoneyView.pieLabel({
        sidePadding: 30,
        inflectionOffset: 15,
        label1: function label1(data) {
          return {
            text: data.sourceName,
            fill: '#808080',
            fontSize: 14,
          };
        },
        label2: function label2(data) {
          return {
            fill: '#000000',
            text: data.pro.toFixed(2) + '%',
            fontWeight: 500,
            fontSize: 13,
          };
        }
      })
      this.sourceCusMoneyView.interval()
          .position('sourceType*sourceCount')
          .color('sourceName', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864','#ffe2ca','#299999','#ff9d4e','#9967bd'])
          .adjust('stack');
      this.sourceCusMoneyView.render();
    },
    createDateOnConfirm(val) {
      this.date = this.$dateUtils.getMonthStartEndDayByDate(val)
      this.createDateShow = false
      this.querySourceReportsCus()
      this.querySourceReportsArrival()
      this.querySourceReportsOrder()
      this.querySourceReportsMoney()
    },
    // 数据处理
    dataProcess(val) {
      let count = 0, cusXXXData = []
      if (val.length > 9) {
        val.forEach(s => {
          count += s.sourceCount
        })
        val.sort((a, b) => {
          return b.sourceCount - a.sourceCount
        })
        let data = val.slice(0, 8);
        let otherCount = 0
        val.slice(8, val.length).forEach(s => {
          otherCount += s.sourceCount
        })
        data.push({sourceCount: otherCount, sourceName: "其他", sourceType: "1"})
        data.forEach(s => {
          s.pro = s.sourceCount / count * 100
        })
        cusXXXData = data
      } else if (val.length > 0) {
        val.forEach(s => {
          count += s.sourceCount
        })
        val.forEach(s => {
          s.pro = s.sourceCount / count * 100
        })
        val.sort((a, b) => {
          return b.sourceCount - a.sourceCount
        })
        cusXXXData = val
      }
      return {count: count, data: cusXXXData}
    },
    // serviceChange() {
    //   this.isService = true
    //   this.dressId = ""
    //   this.querySourceReportsCus()
    //   this.querySourceReportsArrival()
    //   this.querySourceReportsOrder()
    //   this.querySourceReportsMoney()
    // },
    // dressChange() {
    //   this.isService = false
    //   this.serviceId = ""
    //   if (this.dressId == "") {
    //     this.isService = true
    //     this.querySourceReportsCus()
    //   }
    //   if (this.active == 0) {
    //     this.active = 1
    //   }
    //   this.querySourceReportsArrival()
    //   this.querySourceReportsOrder()
    //   this.querySourceReportsMoney()
    // },
    sourceChange() {
      this.querySourceReportsCus()
      this.querySourceReportsArrival()
      this.querySourceReportsOrder()
      this.querySourceReportsMoney()
    },
    empChange() {
      this.querySourceReportsCus()
      this.querySourceReportsArrival()
      this.querySourceReportsOrder()
      this.querySourceReportsMoney()
    },
    shopChange() {
      if (this.empId !== "") {
        this.empId = ""
      }
      this.empArray = this.empArray.slice(0,1)
      this.queryEmpIds()
      this.querySourceReportsCus()
      this.querySourceReportsArrival()
      this.querySourceReportsOrder()
      this.querySourceReportsMoney()
    }
  },
}
</script>

<style scoped>
/deep/ .van-field__label{
  width: 12.2em !important;
  text-align: center;
}
.van_table_show {
  text-align: center;
  font-family: -apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Segoe UI,Arial,Roboto,'PingFang SC',miui,'Hiragino Sans GB','Microsoft Yahei',sans-serif;
  font-size: 14px;
  color: #646566;
}
.test {
  height: 24px;
  line-height: 24px;
  padding: 10px 16px;
  position: relative;
}
.test::after {
  position: absolute;
  box-sizing: border-box;
  content: ' ';
  pointer-events: none;
  right: 16px;
  bottom: 0;
  left: 16px;
  border-bottom: 1px solid #ebedf0;
  -webkit-transform: scaleY(.5);
  transform: scaleY(.5);
}
</style>
