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
    <div style="padding-top: 10px">
      <van-divider content-position="left">行政执行分析</van-divider>
      <van-cell-group :border="false" inset>

        <van-cell :border="false" title="出样数" :value="saleExtractionAnalysisCount"
                  @click="dialogShow('出样详情','出样数','saleExtractionAnalysisTable')"></van-cell>
        <van-cell :border="false" title="盘库数" :value="invCount"
                  @click="dialogShow('盘库详情','盘库数','invTable')"></van-cell>
        <van-cell :border="false" title="纠错数" :value="invCount"
                  @click="dialogShow('纠错详情','纠错数','invCorTable')"></van-cell>
        <van-cell :border="false" title="消疑数" :value="clearDoubtCount"
                  @click="dialogShow('消疑详情','消疑数','clearDoubtTable')"></van-cell>
      </van-cell-group>

      <van-divider content-position="left"></van-divider>
    </div>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "performanceAnalysisReports",
  components: {
    baseNavBar
  },
  created() {
    this.queryShop();
    this.queryDress();
    // this.queryCustomerServiceMonthReport();
  },
  data() {
    return{
      titleText: "执行分析表",
      tenantCrop: localStorage.getItem("tenantCrop"),

      currentDate: new Date(),
      startDate:this.$dateUtils.vantDateToYM(new Date()) + "-01",
      endDate:this.$dateUtils.vantDateToYM(new Date()) + "-" + this.$dateUtils.getLastDayByYm(new Date()),

      shopId: "",
      shopArray:[{text:"店铺",value: ""}],

      localShopArray: localStorage.getItem("shopIds").split(",").map(Number),

      dressId: "",
      dressArray:[{text:"礼服师",value: ""}],

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],
      showDate: false,
      active: 0,
      DateStr: '',
      serviceReportData: [],
      titleStr: '',
      serviceName: '',
      orderList: [],

      appYarnTable: [],
      appYarnCount: '',

      addAppYarnTable: [],
      addAppYarnCount: '',

      invTable: [],
      invCount: '',

      invCorTable: [],
      invCorCount: '',

      transferTable: [],
      transferCount: '',

      reviewTable: [],
      reviewCount: '',

      sendTable: [],
      sendCount: '',

      singleSaleAppTable: [],
      singleSaleAppCount: '',

      singleSaleAppYarnTable: [],
      singleSaleAppYarnCount: '',

      clearDoubtTable: [],
      clearDoubtCount: '',

      appOrderOfferTable: [],
      appOrderOfferCount: '',

      tryDressTable: [],
      tryDressCount: '',

      singleSaleCompleteAppYarnTable: [],
      singleSaleCompleteAppYarnCount: '',

      saleExtractionAnalysisCount: [],
      saleExtractionAnalysisTable: '',

      showCity: true,
      citySelect: '',
      cityList: [{text: '所有店铺', value: ''}],

      dress: '',
      dressList: [{text: '选择行政/礼服师', value: ''}],
      showDress: true,

      administrative: '',
      administrativeList: [],
      showAdministrative: true,

      showDialog: false,
      dialogValue: '',
      dialogTitle: '',
      dialogTable: [],

      appTable: [],
      appShowDialog: false,
      appDialogTitle: '',

      loading: false,
      finished: false,

      showFlag:false,
      showTFlag:false,
      showTDFlag:false,
    }
  },
  methods: {
    dialogShow(title, value, tableName) {
      this.showDialog = true
      this.dialogTitle = title
      this.dialogValue = value
      if (tableName === 'addAppYarnTable') {
        this.dialogTable = this.addAppYarnTable
      }
      if (tableName === 'singleSaleCompleteAppYarnTable') {
        this.dialogTable = this.singleSaleCompleteAppYarnTable
      }
      if (tableName === 'invTable') {
        this.dialogTable = this.invTable
      }
      if (tableName === 'invCorTable') {
        this.dialogTable = this.invCorTable
      }
      if (tableName === 'transferTable') {
        this.dialogTable = this.transferTable
      }
      if (tableName === 'reviewTable') {
        this.dialogTable = this.reviewTable
      }
      if (tableName === 'sendTable') {
        this.dialogTable = this.sendTable
      }
      if (tableName === 'singleSaleAppTable') {
        this.dialogTable = this.singleSaleAppTable
      }
      if (tableName === 'singleSaleAppYarnTable') {
        this.dialogTable = this.singleSaleAppYarnTable
      }
      if (tableName === 'clearDoubtTable') {
        this.dialogTable = this.clearDoubtTable
      }
      if (tableName === 'saleExtractionAnalysisTable') {
        this.dialogTable = this.saleExtractionAnalysisTable
      }
    },

    queryCustomerServiceMonthReport() {
      this.overlayShow = true
      this.overlayShow = false
      this.$axios({
        method: "GET",
        url: "/clothesOperationAnalysis/saleExtractionAnalysis",
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          shopId: this.shopId,
          tenantCrop: this.tenantCrop,
          dressId: this.dressId
        }
      }).then(response => {
        this.saleExtractionAnalysisTable = []
        this.saleExtractionAnalysisTable.push(...response.data.data)
        this.saleExtractionAnalysisCount = this.saleExtractionAnalysisTable.reduce((sum, item) => sum + item.count, 0);
      })

      this.$axios({
        method: "get",
        url: '/clothesOperationAnalysis/saleInvAnalysis',
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          shopId: this.shopId,
          tenantCrop: this.tenantCrop,
          dressId: this.dressId
        }
      }).then(response => {
        this.invTable = []
        this.invTable.push(...response.data.data)
        this.invCount = this.invTable.reduce((sum, item) => sum + item.count, 0);
      })
      this.$axios({
        method: "get",
        url: '/clothesOperationAnalysis/saleClearDoubt',
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          shopId: this.shopId,
          tenantCrop: this.tenantCrop,
          dressId: this.dressId
        }
      }).then(response => {
        this.clearDoubtTable = []
        this.clearDoubtTable.push(...response.data.data)
        this.clearDoubtCount = this.clearDoubtTable.reduce((sum, item) => sum + item.count, 0);
      })
    },

    shopChange: function (value) {
      this.shopId = value;
      this.queryCustomerServiceMonthReport();
    },
    dressChange: function () {
      this.queryCustomerServiceMonthReport();
    },
    appointDateOnConfirm: function (time) {
      this.startDate = this.$dateUtils.vantDateToYMD(time);
      this.endDate = this.$dateUtils.vantDateToYM(time) + "-" + this.$dateUtils.getLastDayByYm(time);
      this.queryCustomerServiceMonthReport();
      this.$refs.item.toggle();
    },
    closeItem: function () {
      this.$refs.item.toggle();
    },
    queryShop: function () {
      this.$selectUtils.queryShopIdsIsValid(this.$selectUtils.DropDownMenu).then(response => {
        this.shopArray.push(...JSON.parse(response.data.data).filter(s => {
          return this.localShopArray.includes(s.value)
        }))
        this.shopChange(this.shopArray[1].value);
      })
    },
    queryDress: function () {
      this.$selectUtils.queryDressIds(this.$selectUtils.DropDownMenu).then(response => {
        this.dressArray.push(...JSON.parse(response.data.data));
      })
    },
  }
}
</script>


<style scoped>

</style>