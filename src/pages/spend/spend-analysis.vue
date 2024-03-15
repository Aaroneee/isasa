<template>
  <div>
    <van-sticky>
      <baseNavBar title="支出分析表"/>
      <van-cell title="结算日期:" :value="date" @click="createDateShow = true"/>
            <van-dropdown-menu>
              <van-dropdown-item v-model="shopId" @change="shopChange" :options="shopArray"/>
<!--              <van-dropdown-item v-model="sourceId" @change="sourceChange" :options="sourceArray"/>-->
<!--              <van-dropdown-item v-model="empId" @change="empChange" :options="empArray"/>-->
            </van-dropdown-menu>
      <van-calendar
          v-model="createDateShow"
          type="range"
          @confirm="dateOnConfirm"
          allow-same-day
          :min-date="minDate"
      />
    </van-sticky>

    <van-tabs v-model="active" animated swipeable :lazy-render="false" color="#409eff">
      <van-tab title="支出分析表">
        <van-row>
          <van-col span="24">
            <div v-show="sourceCusViewData.length !== 0"
                 style="background-color: white;margin-bottom: 20px;width: 100%">

              <!--表格-->
              <div>
                <van-collapse v-model="activeCus">
                  <van-field
                      readonly
                      label="支出项目"
                      :value="'合计金额'"
                      input-align="center"
                      style="background-color: #f5f7fa"
                  />
                  <van-collapse-item
                      :title="value.foldName"
                      v-for="(value,index) in sourceCusViewData"
                      :key="value.id"
                      :name="index">
                    <template #title>
                      <van-field
                          readonly
                          :label="value.foldName"
                          input-align="center"
                          v-model="value.litres"
                      />
                    </template>

                    <!--孩子展开-->
                    <template v-if="value.children !== undefined && value.children.length === 0">
                      <div style="text-align: center">无子渠道</div>
                    </template>

                    <template v-if="value.children !== undefined && value.children.length !== 0">
                      <van-field
                          readonly
                          v-for="item in value.children"
                          :label="item.foldName"
                          input-align="center"
                          v-model="item.litres"
                          :key="item.id"
                      />
                    </template>

                  </van-collapse-item>
                  <van-field
                      readonly
                      label="合计"
                      v-model="allAmount"
                      input-align="center"
                      style="font-weight: bold"
                  />
                </van-collapse>
              </div>

              <!--              <div>-->
              <!--                <van-field-->
              <!--                    readonly-->
              <!--                    label="支出项目"-->
              <!--                    :value="'合计金额'"-->
              <!--                    input-align="center"-->
              <!--                    style="background-color: #f5f7fa"-->
              <!--                />-->
              <!--                <van-field-->
              <!--                    readonly-->
              <!--                    v-for="(value,index) in sourceCusViewData"-->
              <!--                    :label="value.projectsName"-->
              <!--                    input-align="center"-->
              <!--                    v-model="value.sumAmount"-->
              <!--                    :key="value.projectsId"-->
              <!--                />-->
              <!--                <van-field-->
              <!--                    readonly-->
              <!--                    label="合计"-->
              <!--                    v-model="allAmount"-->
              <!--                    input-align="center"-->
              <!--                    style="font-weight: bold"-->
              <!--                />-->
              <!--              </div>-->


              <!--饼图-->
              <!--选项太多 导致饼图不好看，先隐藏饼图。-->
              <!--              <div v-show=false>-->
              <canvas id="sourceCusView"></canvas>
              <van-divider dashed :style="{borderColor: '#c6effc'}"></van-divider>
              <!--              </div>-->


              <!--原来的客资报表表格-->
              <!--              <div>-->
              <!--                <van-collapse v-model="activeCus">-->
              <!--                  <van-field-->
              <!--                      readonly-->
              <!--                      label="支出项目"-->
              <!--                      :value="'合计金额'"-->
              <!--                      input-align="center"-->
              <!--                      style="background-color: #f5f7fa"-->
              <!--                  />-->
              <!--                  <van-collapse-item-->
              <!--                      :title="value.sourceName"-->
              <!--                      v-for="(value,index) in sourceCusViewData"-->
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
              <!--                  </van-collapse-item>-->
              <!--                  <van-field-->
              <!--                      readonly-->
              <!--                      label="合计"-->
              <!--                      v-model="cusCount"-->
              <!--                      input-align="center"-->
              <!--                      style="font-weight: bold"-->
              <!--                  />-->
              <!--                </van-collapse>-->
              <!--              </div>-->

            </div>
            <div v-show="sourceCusViewData.length === 0" style="background-color: white;width: 100%;height: 100vh">
              <van-empty description="暂无支出"/>
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
import PieLabel from "@antv/f2/lib/plugin/pie-label";

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
      sourceCusViewData: [], //数据放这里。
      allAmount: 0,
      cusCount: 0,

      createDateShow: false,
      maxDate: this.$dateUtils.getMaxMinDate()[0],
      minDate: this.$dateUtils.getMaxMinDate()[1],
      date: this.$dateUtils.getMonthStartEndDayStr(),
      chooseDate: new Date(),
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
      shopId: 59, //先写死 华鑫店(590

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
      v.initSpendAnalysisView()
      // v.initSourceCusView()
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
      this.queryProSpendAnalysisInfo()
      // this.querySourceReportsCus()
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
    queryEmpIds() {
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

    async queryProSpendAnalysisInfo() {
      this.sourceCusViewData = []
      await this.$axios({
        method: 'get',
        // url: '/serviceReports/customerSourceReportsCus', //原来客资报表数据的请求。
        // url: '/spendAnalysis/queryProSpendAnalysisInfo',
        url: '/spendAnalysis/querySpendAnalysisHandle',
        params: {
          date: this.date,
          tenantCrop: this.tenantCrop,
          empId: this.empId,
          sourceId: this.sourceId,
          shopId: this.shopId,
        },
      }).then(response => {
        console.log("response noProjectLevelSpendAnalysis123")
        console.log(response)
        console.log(response.data.data)

        // let res = response.data.data;
        this.allAmount = response.data.data.pop().litres; //把最好一个数据取出来，然后把数值放到 allAmount

        this.sourceCusData = response.data.data;
        this.isService = true
        this.active = 0
        let data = this.handleData(this.sourceCusData)
        this.cusCount = data.count
        this.sourceCusViewData = data.data
        this.sourceCusView.changeData(data.data)
      });
    },

    //处理数据
    handleData(val) {
      let count = this.allAmount
      // let cusXXXData = []
      val.forEach(s => {
        s.pro = s.sumAmount / count * 100
        // console.log(s.sumAmount)
        // console.log(count)
        // console.log(s.pro)
      })

      // cusXXXData = val
      // const filteredData = cusXXXData.filter(item => item.sumAmount !== 0);
      // return {count: count, data: filteredData}
      console.log("val66666666666666666666")
      console.log(val)
      return {count: count, data: val}
    },

    //支出分析表饼图。
    initSpendAnalysisView() {
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
            text: data.projectsName,
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
          .position('1*pro')
          .color('projectsName', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#ffe2ca', '#299999', '#ff9d4e', '#9967bd'])
          .adjust('stack');
      this.sourceCusView.render();
    },


    // 渠道客资
    async querySourceReportsCus() {
      this.sourceCusViewData = []
      await this.$axios({
        method: 'get',
        url: '/serviceReports/customerSourceReportsCus', //查询请求。
        params: {
          date: this.date,
          tenantCrop: this.tenantCrop,
          empId: this.empId,
          sourceId: this.sourceId,
          shopId: this.shopId
        },
      }).then(response => {
        console.log("response1111111111111111")
        console.log(response)

        this.sourceCusData = response.data.data;
        this.isService = true
        this.active = 0
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
          .color('sourceName', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#ffe2ca', '#299999', '#ff9d4e', '#9967bd'])
          .adjust('stack');
      this.sourceCusView.render();
    },

    createDateOnConfirm(val) {
      this.date = this.$dateUtils.getMonthStartEndDayByDate(val)
      this.createDateShow = false
      this.querySourceReportsCus()
    },
    // 数据处理
    dataProcess(val) {
      var count = 0, cusXXXData = []
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
      const filteredData = cusXXXData.filter(item => item.litres !== 0);
      return {count: count, data: filteredData}
    },
    sourceChange() {
      this.querySourceReportsCus()
    },
    empChange() {
      this.querySourceReportsCus()
    },
    shopChange() {
      // if (this.empId !== "") {
      //   this.empId = ""
      // }
      // this.empArray = this.empArray.slice(0, 1)
      // this.queryEmpIds()
      this.queryProSpendAnalysisInfo()
    }
  },
}
</script>

<style scoped>
/deep/ .van-field__label {
  width: 12.2em !important;
  text-align: center;
}

.van_table_show {
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', miui, 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
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
