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


      <van-popup v-model="showPayee" round position="bottom">
        <van-picker
            show-toolbar
            :columns="payeeArray"
            @cancel="showPayee = false"
            @confirm="payeeOnConfirm"
            :loading="payeeLoading"
        />
      </van-popup>

      <van-field
          readonly
          clickable
          label="店铺："
          :value="shopName"
          placeholder="选择店铺"
          @click="showShop = true"
          class="exclude"
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
          label="收款人："
          :value="payeeName"
          placeholder="选择收款人"
          @click="showPayee = true"
      />
    </van-sticky>
    <van-empty description="暂无营收" v-if="false"/>


    <van-row>
      <van-col span="24">
        <div v-show="proceedsViewData.length !== 0" style="background-color: white;margin-bottom: 20px;width: 100%">
          <canvas id="myChart"></canvas>
          <div>
            <van-collapse v-model="activeProceeds">
              <van-field
                  readonly
                  label="项目"
                  v-model="proceedsTableHeader"
                  input-align="center"
                  style="background-color: #f5f7fa"
              />
              <van-collapse-item
                  :title="value.proceedsName"
                  v-for="(value,index) in proceedsViewData"
                  :key="index"
                  :name="index">
                <template #title>
                  <van-field
                      readonly
                      :label="value.proceedsName"
                      input-align="center"
                      v-model="value.proceedsCount"
                  />
                </template>

                <template v-if="value.children !== undefined && value.children.length === 0">
                  <div style="text-align: center">无子渠道</div>
                </template>

                <template v-if="value.children !== undefined && value.children.length !== 0">
                  <van-field
                      readonly
                      v-for="(item,index) in value.children"
                      :label="item.shopName"
                      input-align="center"
                      v-model="item.proceedsCount"
                      :key="index"
                  />
                </template>
              </van-collapse-item>
              <van-field
                  readonly
                  label="合计"
                  v-model="proceedsTotalCount"
                  input-align="center"
                  style="font-weight: bold"
              />
            </van-collapse>
          </div>
        </div>
        <div v-show="proceedsViewData.length === 0" style="background-color: white;width: 100%;height: 100vh">
          <van-empty description="暂无收款" />
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar";
import F2 from '@antv/f2';
export default {
  name: "proceeds-reports",
  components: {
    baseNavBar
  },
  data() {
    return {
      titleText: "收款分析",
      tenantCrop: localStorage.getItem("tenantCrop"),
      // 起始日期(默认月初)
      startDate: this.formatDate(this.$dateUtils.getCurrentMonthFirstDay()),
      // 结束日期(默认月末)
      endDate: this.formatDate(this.$dateUtils.getCurrentMonthLastDay()),
      date: this.$dateUtils.getMonthStartEndDayStr(),
      // 是否显示日期弹窗
      show: false,
      // 可选择的最早日期
      minDate: new Date(2015, 0, 1),
      // 是否显示礼服师下拉列表
      showPayee: false,
      // 选择的收款人
      payeeName: '',
      payeeId: '',
      // 收款人列表
      payeeArray: [{text: "全国收款人", id: ""}],
      // 是否正在加载礼服师
      payeeLoading: false,
      // 是否显示店铺下拉列表
      showShop: false,
      // 选择的店铺
      shopName: '',
      shopId: '',
      // 是否正在加载店铺
      shopLoading: false,
      // 店铺列表
      shopArray: [{text: "全国店铺", id: ""}],
      // 收款视图
      proceedsViewData: {},
      proceedsView: {},
      proceedsData: {},
      activeProceeds: [],
      proceedsTableHeader: '收款额',
      proceedsTotalCount: '',

    }
  },
  created() {
    this.shopName="全国店铺"
    this.queryPayeeArray()
    this.queryShopArray()
    this.queryProceedsTotalReports()
  },
  mounted() {
    var v = this;
    this.$nextTick(() => {
      v.initView()
    });
  },
  methods: {
    dateOnConfirm(date) {
      const [start, end] = date;
      this.show = false;
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
      this.date = this.startDate + ' - ' + this.endDate;
      this.queryProceedsTotalReports()
    },
    payeeOnConfirm(payee) {
      this.payeeName = payee.text;
      this.payeeId = payee.id;
      this.showPayee = false;
      this.queryProceedsTotalReports()
    },
    shopOnConfirm(shop) {
      this.shopName = shop.text;
      this.shopId = shop.id;
      this.showShop = false;
      this.queryProceedsTotalReports()
    },
    formatDate(date) {
      return `${date.getFullYear()}-${this.$dateUtils.dateIsSingle(date.getMonth() + 1)}-${this.$dateUtils.dateIsSingle(date.getDate())}`;
    },
    queryPayeeArray() {
      this.$selectUtils.queryDressIdsByShop(this.$selectUtils.Picker, this.shopId).then(response => {
        this.payeeArray.push(...JSON.parse(response.data.data))
      })
    },
    queryShopArray() {
      this.$selectUtils.queryShopIds(this.$selectUtils.Picker).then(response => {
        this.shopArray.push(...JSON.parse(response.data.data))
      })
    },
    // 初始化收款图
    initView() {
      const PieLabel = require('@antv/f2/lib/plugin/pie-label');
      // Step 1: 创建 Chart 对象
      this.proceedsView = new F2.Chart({
        id: 'myChart',
        pixelRatio: window.devicePixelRatio, // 指定分辨率
        plugins: PieLabel,
        padding: 'auto',
        width: document.body.clientWidth,
        height: 380,
        appendPadding: 30,
      });
      this.proceedsView.source(this.proceedsData);
      this.proceedsView.axis(false);
      this.proceedsView.tooltip(false);
      this.proceedsView.coord('polar', {
        transposed: true, // 坐标系翻转
        innerRadius: 0.5,
        radius: 0.9,
      });
      this.proceedsView.legend({
        position: 'bottom',
        align: 'center',
        clickable: false,
      });
      this.proceedsView.pieLabel({
        sidePadding: 50,
        inflectionOffset: 25,
        anchorOffset: -15,
        label1: function label1(data) {
          return {
            text: data.proceedsName,
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
      this.proceedsView.interval()
          .position('proceedsType*proceedsCount')
          .color('proceedsName', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864','#ffe2ca','#299999','#ff9d4e','#9967bd'])
          .adjust('stack');
      this.proceedsView.render();
    },
    // 查询收款
    queryProceedsTotalReports() {
      this.$axios({
        url: "/proceedsReports/proceedsTotalReports",
        method: "GET",
        params: {
          date: this.date,
          tenantCrop: this.tenantCrop,
          startDate: this.startDate,
          endDate: this.endDate,
          dressId: this.payeeId,
          shopId: this.shopId
        }
      }).then(response => {
        this.proceedsData = response.data.data;
        let data = this.dataProcess(this.proceedsData)
        this.proceedsTotalCount = data.count
        this.proceedsViewData = data.data
        this.proceedsView.changeData(data.data)
      })
    },
    // 数据处理
    dataProcess(val) {
      let count = 0, proceedsData = []
      if (val.length > 9) {
        val.forEach(s => {
          count += s.proceedsCount
        })
        val.sort((a, b) => {
          return b.proceedsCount - a.proceedsCount
        })
        let data = val.slice(0, 8);
        let otherCount = 0
        val.slice(8, val.length).forEach(s => {
          otherCount += s.proceedsCount
        })
        data.push({proceedsCount: otherCount, proceedsName: "其他", proceedsType: "1"})
        data.forEach(s => {
          s.pro = s.proceedsCount / count * 100
        })
        proceedsData = data
      } else if (val.length > 0) {
        val.forEach(s => {
          count += s.proceedsCount
        })
        val.forEach(s => {
          s.pro = s.proceedsCount / count * 100
        })
        val.sort((a, b) => {
          return b.proceedsCount - a.proceedsCount
        })
        proceedsData = val
      }
      return {count: count, data: proceedsData}
    },
  }
}
</script>

<style scoped>
.van_table_show {
  text-align: center;
  font-family: -apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Segoe UI,Arial,Roboto,'PingFang SC',miui,'Hiragino Sans GB','Microsoft Yahei',sans-serif;
  font-size: 14px;
  color: #646566;
}
</style>