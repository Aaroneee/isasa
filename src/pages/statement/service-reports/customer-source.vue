<template>
  <div>
    <van-sticky>
      <switchNavBar title="渠道分析表" switchText="日期" @flag="createDateShow=true"/>
      <van-dropdown-menu>
        <van-dropdown-item v-model="serviceId" @change="serviceChange" :options="serviceArray"/>
        <van-dropdown-item v-model="dress" @change="dressChange" :options="dressArray"/>
      </van-dropdown-menu>
    </van-sticky>
    <van-popup v-model="createDateShow" position="bottom">
      <van-datetime-picker
          v-model="chooseDate"
          type="year-month"
          title="选择年月"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="createDateShow = false"
          @confirm="createDateOnConfirm"
      />
    </van-popup>
    <van-tabs v-model="active" animated swipeable :lazy-render="false" color="#409eff">
      <van-tab title="渠道客资">
        <van-row>
          <van-col span="24">
            <div v-show="sourceCusViewData.length !== 0" style="background-color: white;margin-bottom: 20px;width: 100%">
              <canvas id="sourceCusView"></canvas>
              <van-divider dashed :style="{borderColor: '#c6effc'}"></van-divider>
              <div>
                <van-field
                    readonly
                    label="渠道"
                    v-model="cusTableHeader"
                    input-align="center"
                    style="background-color: #f5f7fa"
                />
                <van-field
                    v-for="value in sourceCusViewData" :key="value.id"
                    readonly
                    :label="value.sourceName"
                    input-align="center"
                    v-model="value.sourceCount"
                />
                <van-field
                    readonly
                    label="合计"
                    v-model="cusCount"
                    input-align="center"
                    style="font-weight: bold"
                />
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
                    <van-col span="8">渠道</van-col>
                    <van-col span="8">到店数</van-col>
                    <van-col span="8">客资到店转化率</van-col>
                  </van-row>
                </div>
                <div v-for="value in sourceCusArrivalViewData" :key="value.id" class="test">
                  <van-row>
                    <van-col span="8">{{value.sourceName}}</van-col>
                    <van-col span="8">{{value.sourceCount}}</van-col>
                    <van-col span="8" v-if="value.proportion == null">-</van-col>
                    <van-col span="8" v-else>{{(value.proportion * 100).toFixed(1)}}%</van-col>
                  </van-row>
                </div>
                <div class="test" style="color: #606266;font-weight:bold">
                  <van-row>
                    <van-col span="8">合计</van-col>
                    <van-col span="8">{{cusArrivalCount}}</van-col>
                    <van-col span="8">-</van-col>
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
                    <van-col span="8">到店数</van-col>
                    <van-col span="8">到店订单转化率</van-col>
                  </van-row>
                </div>
                <div v-for="value in sourceCusOrderViewData" :key="value.id" class="test">
                  <van-row>
                    <van-col span="8">{{value.sourceName}}</van-col>
                    <van-col span="8">{{value.sourceCount}}</van-col>
                    <van-col span="8" v-if="value.proportion == null">-</van-col>
                    <van-col span="8" v-else>{{(value.proportion * 100).toFixed(1)}}%</van-col>
                  </van-row>
                </div>
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
      <van-tab title="渠道收款">
        <van-row>
          <van-col span="24">
            <div v-show="sourceCusMoneyViewData.length !== 0" style="background-color: white;margin-bottom: 20px;width: 100%">
              <canvas id="sourceCusMoneyView"></canvas>
              <van-divider dashed :style="{borderColor: '#c6effc'}"></van-divider>
              <div>
                <van-field
                    readonly
                    label="渠道"
                    v-model="moneyTableHeader"
                    input-align="center"
                    style="background-color: #f5f7fa"
                />
                <van-field
                    v-for="value in sourceCusMoneyViewData" :key="value.id"
                    readonly
                    :label="value.sourceName"
                    input-align="center"
                    v-model="value.sourceCount"
                />
                <van-field
                    readonly
                    label="合计"
                    v-model="cusMoneyCount"
                    input-align="center"
                />
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
import switchNavBar from '@/components/nav-bar/switch-nav-bar'

export default {
  name: "customer-source",
  components: {
    switchNavBar
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
      dressArray: [{text: "选择礼服师", value: ""},],
      dress: "",
    }
  },
  created() {
    this.pageInit()
    this.queryServiceIds()
    this.queryDressArray()
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
  methods: {
    pageInit() {
      this.querySourceReportsCus()
      this.querySourceReportsArrival()
      this.querySourceReportsOrder()
      this.querySourceReportsMoney()
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
    queryDressArray() {
      this.$selectUtils.queryDressIdsByShop(this.$selectUtils.DropDownMenu, this.shop).then(response => {
        this.dressArray.push(...JSON.parse(response.data.data))
      })
    },
    // 渠道客资
    querySourceReportsCus() {
      this.sourceCusViewData = []
      this.$axios({
        method: 'get',
        url: '/serviceReports/customerSourceReportsCus',
        params: {
          date: this.date,
          tenantCrop: this.tenantCrop,
          serviceId: this.serviceId
        },
      }).then(response => {
        this.sourceCusData = response.data.data;
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
          serviceId: this.serviceId
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
          serviceId: this.serviceId
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
          serviceId: this.serviceId
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
      } else {
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
    serviceChange() {
      this.querySourceReportsCus()
      this.querySourceReportsArrival()
      this.querySourceReportsOrder()
      this.querySourceReportsMoney()
    },
    dressChange() {

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