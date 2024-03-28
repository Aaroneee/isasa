<template>
  <div>
    <van-sticky>
      <baseNavBar title="添加订单"/>
    </van-sticky>
    <van-row style="margin-top: 2%">
      <van-col span="22" offset="1">
        <van-steps :active="active" active-color="#409eff">
          <van-step>客户信息</van-step>
          <van-step>订单信息</van-step>
          <van-step>订单确认</van-step>
          <van-step>完成</van-step>
        </van-steps>
      </van-col>
    </van-row>
    <div style="margin-top: 3%;margin-bottom: 7%">
      <van-form v-show="active === 0" @submit="cusConfirm">
        <van-field
            v-model="customer.name"
            name="name"
            label="用户名"
            placeholder="用户名"
            required
            :rules="[{ required: true}]"
        />
        <van-field
            v-model="customer.phone"
            type="number"
            name="phone"
            label="手机号"
            placeholder="手机号"
        />
        <van-field
            v-model="customer.weChat"
            type="string"
            name="weChat"
            label="微信号"
            placeholder="微信号"
        />
        <van-field
            v-model="customer.city"
            type="string"
            name="city"
            label="客户城市"
            placeholder="客户所在城市"
        />
        <van-field
            readonly
            name="source"
            :value="sourceText"
            label="客资来源"
            placeholder="点击选择来源渠道"
            @click="sourceShowPicker = true"
            required
            :rules="[{ required: true}]"
        />
        <van-popup v-model="sourceShowPicker" position="bottom">
          <van-picker
              getColumnValues
              show-toolbar
              :columns="sourceColumns"
              @confirm="sourceOnConfirm"
              @cancel="sourceShowPicker = false"
          />
        </van-popup>
        <van-field
            readonly
            clickable
            required
            name="createDate"
            :value="customer.createDate"
            label="对接日期"
            placeholder="点击选择对接日期"
            @click="cusCreateDateShowPicker = true"
            :rules="[{ required: true }]"
        />
        <van-calendar v-model="cusCreateDateShowPicker" :min-date="minDate" :max-date="maxDate"
                      @confirm="cusCreateDateOnConfirm"/>
        <van-field
            v-model="customer.weddingVenue"
            type="string"
            name="weddingVenue"
            label="婚礼地点"
            placeholder="婚礼地点"
        />
        <van-field
            readonly
            name="service"
            :value="serviceText"
            label="客服"
            placeholder="点击选择客服"
            required
            @click="serviceShowPicker = true"
            :rules="[{ required: true}]"
        />
        <van-popup v-model="serviceShowPicker" position="bottom">
          <van-picker
              getColumnValues
              show-toolbar
              :columns="serviceColumns"
              @confirm="serviceOnConfirm"
              @cancel="serviceShowPicker = false"
          />
        </van-popup>
        <van-field name="switch" label="添加预约">
          <template #input>
            <van-switch v-model="addAppointFlag" size="20" />
          </template>
        </van-field>
        <van-field
            class="msg"
            name="remark"
            v-model="customer.remark"
            type="textarea"
            label="备注"
            placeholder="备注"
            maxlength="40"
            show-word-limit
        />
        <van-row style="margin-top: 7%">
          <van-col span="22" offset="1">
            <van-button type="info" style="width: 100%" native-type="submit">下一步</van-button>
          </van-col>
        </van-row>
      </van-form>
      <van-form v-show="active === 1" @submit="orderConfirm">
        <van-field
            name="orderNo"
            v-model="order.orderNo"
            label="订单号"
            placeholder="订单号"
        />
        <van-field
            readonly
            name="createDate"
            :value="order.createDate"
            label="订单日期"
            required
            placeholder="订单日期"
            @click="orderCreateDateShowPicker=true"
        />
        <van-calendar v-model="orderCreateDateShowPicker" :min-date="minDate" :max-date="maxDate"
                      @confirm="orderCreateDateConfirm"/>
        <van-field
            readonly
            required
            :rules="[{required: true}]"
            label="订单店铺"
            v-model="shopText"
            placeholder="订单店铺"
            @click="shopShowPicker = true"
        />
        <van-popup v-model="shopShowPicker" position="bottom">
          <van-picker
              show-toolbar
              getColumnValues
              :columns="shopArray"
              @confirm="shopConfirm"
              @cancel="shopShowPicker = false"
          />
        </van-popup>
        <van-field
            readonly
            required
            label="订单项目"
            placeholder="订单项目"
            :rules="[{required: true}]"
            :value="orderNameText"
            @click="orderNamePicker = true"
        />
        <van-popup v-model="orderNamePicker" position="bottom">
          <van-picker
              getColumnValues
              show-toolbar
              :columns="orderNameArray"
              @confirm="orderNameConfirm"
              @cancel="orderNamePicker = false"
          />
        </van-popup>
        <van-field
            readonly
            :required="orderCosmeticsCheck"
            :rules="[{required: orderCosmeticsCheck}]"
            label="订单化妆师"
            v-model="cosmeticsText"
            placeholder="订单化妆师"
            @click="cosmeticsShowPicker = true"
        />
        <van-popup v-model="cosmeticsShowPicker" position="bottom">
          <van-picker
              show-toolbar
              getColumnValues
              :columns="cosmeticsArray"
              @confirm="cosmeticsConfirm"
              @cancel="cosmeticsShowPicker = false"
          />
        </van-popup>
        <van-field
            readonly
            label="精确婚期"
            required
            placeholder="精确婚期"
            :rules="[{required: true}]"
            @click="weddingDayPicker=true"
            :value="order.weddingDay"
        />
        <van-calendar v-model="weddingDayPicker" :min-date="minDate" :max-date="maxDate"
                      @confirm="weddingDayConfirm"/>
        <van-field
            label="收款项目"
            placeholder="收款项目"
            readonly
            required
            :rules="[{required: true}]"
            :value="proceedsNameText"
            @click="proceedsNamePicker=true"
        />
        <van-popup v-model="proceedsNamePicker" position="bottom">
          <van-picker
              getColumnValues
              show-toolbar
              :columns="proceedsNameArray"
              @confirm="proceedsNameConfirm"
              @cancel="proceedsNamePicker = false"
          />
        </van-popup>
        <van-field
            readonly
            required
            name="payment"
            :value="paymentText"
            label="收款方式"
            placeholder="收款方式"
            :rules="[{ required: true}]"
            @click="paymentPicker=true"
        />
        <van-popup v-model="paymentPicker" position="bottom">
          <van-picker
              getColumnValues
              show-toolbar
              :columns="paymentArray"
              @confirm="paymentConfirm"
              @cancel="paymentPicker = false"
          />
        </van-popup>
        <van-field label="订单总价">
          <template #input>
            <van-switch v-model="orderSum" size="20"/>
          </template>
        </van-field>
        <van-field
            label="订单总价"
            placeholder="订单总价"
            v-if="orderSum"
            v-model.number="order.orderPrice"
            type="digit"
            name="orderPrice"
        />
        <van-field
            label="收款金额"
            required
            placeholder="收款金额"
            v-model.number="process.spareMoney"
            type="digit"
            name="spareMoney"
            :rules="[{required: true}]"
        />
        <van-field
            v-if="orderSum"
            label="余额"
            placeholder="余额"
            type="number"
            v-model.number="process.orderSpare"
            name="orderSpare"
            readonly
        />
        <van-field
            readonly
            required
            name="payee"
            :value="payeeText"
            label="收款人"
            placeholder="收款人"
            :rules="[{required: true}]"
            @click="payeePicker=true"
        />
        <van-popup v-model="payeePicker" position="bottom">
          <van-picker
              getColumnValues
              show-toolbar
              :columns="payeeArray"
              @confirm="payeeConfirm"
              @cancel="payeePicker = false"
          />
        </van-popup>
        <van-row style="margin-top: 6%">
          <van-col span="11" offset="1">
            <van-button style="width: 100%" native-type="button" @click="previous">上一步</van-button>
          </van-col>
          <van-col span="11">
            <van-button type="info" style="width: 100%" native-type="submit">下一步</van-button>
          </van-col>
        </van-row>
      </van-form>
      <div v-show="active === 2" class="display">
        <van-field
            readonly
            label="客户名"
            v-model="customer.name"
        />
        <van-field
            readonly
            label="手机号"
            v-model="customer.phone"
        />
        <van-field
            readonly
            label="订单号"
            v-model="order.orderNo"
        />
        <van-field
          readonly
          label="订单日期"
          v-model="order.createDate"
        />
        <van-field
          readonly
          label="订单项目"
          v-model="orderNameText"
        />
        <van-field
            readonly
            label="订单化妆师"
            v-model="cosmeticsText"
        />
        <van-field
          readonly
          v-if="orderSum"
          label="订单总价"
          v-model="order.orderPrice"
        />
        <van-field
          readonly
          label="收款项目"
          v-model="proceedsNameText"
        />
        <van-field
            readonly
            label="收款方式"
            v-model="paymentText"
        />
        <van-field
            readonly
            label="收款金额"
            v-model="process.spareMoney"
        />
        <van-field
            readonly
            label="收款人"
            v-model="payeeText"
        />
        <van-row style="margin-top: 7%">
          <van-col span="11" offset="1">
            <van-button style="width: 100%" @click="previous">上一步</van-button>
          </van-col>
          <van-col span="11">
            <van-button type="info" style="width: 100%" @click="addConfirm" :loading="loading">确认添加</van-button>
          </van-col>
        </van-row>
      </div>
      <div v-show="active === 3" style="margin-top: 30%">
        <van-row>
          <van-col offset="10">
            <van-icon name="checked" size="60" color="#67c23a"/>
          </van-col>
        </van-row>
        <van-row style="margin-top: 5%">
          <van-col offset="8">
            <span style="color:#5e6d82;font-size: 20px">订单添加成功</span>
          </van-col>
        </van-row>
        <van-row style="margin-top: 7%">
          <van-col span="22" offset="1">
            <van-button type="info" style="width: 100%" @click="toWork">确定</van-button>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"
export default {
  name: "direct-order-add",
  components: {
    baseNavBar,
  },
  created() {
    this.pageInit()
  },
  watch: {
    'order.orderPrice'(valOne) {
      this.process.orderSpare = valOne - this.process.spareMoney;
    },
    'process.spareMoney'(valOne) {
      this.process.orderSpare = this.order.orderPrice - valOne;
    },
  },
  data() {
    return {
      active: 0,
      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],
      customer: {
        name: "",
        city: "",
        phone: "",
        weChat: "",
        createDate: this.$dateUtils.vantDateToYMD(new Date()),
        weddingDay: "",
        weddingVenue: "",
        source: "",
        service: "",
        remark: "",
        tenantCrop: localStorage.getItem("tenantCrop"),
      },
      sourceText: "",
      sourceShowPicker: false,
      sourceColumns: [],
      serviceText: "",
      serviceColumns: [],
      serviceShowPicker: false,
      cusCreateDateShowPicker: false,
      appoint:{
        createDate: this.$dateUtils.vantDateToYMD(new Date()),
        appointDate: this.$dateUtils.vantDateToYMD(new Date()),
        appointTime: "12:00",
        inviter: "",
        appointName: "",
        appointShop: "",
        appointDress: "",
        appointCosmetics: "",
        type: "售前预约",
        tenantCrop: localStorage.getItem("tenantCrop"),
      },
      appointNameArray:[],
      order: {
        createDate: this.$dateUtils.vantDateToYMD(new Date()),
        shopId: localStorage.getItem("shopIds").split(",").map(Number)[0],
        orderCosmetics: "",
        orderNo: "",
        orderName: "",
        weddingDay: "",
        orderRemark: "",
        tenantCrop: localStorage.getItem("tenantCrop"),
        orderPrice: "",
      },
      shopText: "",
      cosmeticsText: "",
      orderCreateDateShowPicker: false,
      cosmeticsShowPicker: false,
      cosmeticsArray:[],
      shopShowPicker: false,
      shopArray: [],
      weddingDayPicker: false,
      orderNameText: "",
      orderNameArray: [],
      orderNamePicker: false,
      //订单化妆师是否必填
      orderCosmeticsCheck:false,
      process: {
        proceedsName: "",
        payment: "",
        spareMoney: "",
        orderSpare: "",
        payee: "",
        tenantCrop: localStorage.getItem("tenantCrop"),
        createDate: new Date()
      },
      proceedsNameText: "",
      proceedsNamePicker: false,
      proceedsNameArray: [],
      paymentPicker: false,
      paymentArray: [],
      paymentText: "",
      orderSum: false,
      payeeText: "",
      payeePicker: false,
      payeeArray: [],
      loading: false,
      addAppointFlag:true,
    }
  },
  methods: {
    pageInit() {
      this.$selectUtils.querySourceIds(this.$selectUtils.Picker).then(response => {
        this.sourceColumns = JSON.parse(JSON.parse(response.data.data));
        this.sourceColumns = this.sourceColumns.map(k => {
          if (k.children === null) {
            k.children = [{text: "", id: k.id}];
            return k;
          }
          return k;
        });
      })
      this.$selectUtils.queryServiceIds(this.$selectUtils.Picker).then(response => {
        this.serviceColumns = JSON.parse(response.data.data);
      })
      this.$roleUtils.isService().then(response => {
        let flag = response.data.data
        if (flag) {
          this.serviceColumns.find(s => {
            if (s.id == localStorage.getItem("empId")){
              this.customer.service = s.id
              this.serviceText = s.text
            }
          })
        }
      })
      this.$selectUtils.queryShopIdsIsValid(this.$selectUtils.Picker).then(response => {
        this.shopArray = JSON.parse(response.data.data);
        this.shopText = this.shopArray.filter(s => s.id === this.order.shopId)[0].text
        this.appoint.appointShop = this.order.shopId;
      })
      this.$selectUtils.queryCosmeticsIds(this.$selectUtils.Picker).then(response => {
        this.cosmeticsArray = JSON.parse(response.data.data);
      })
      this.$selectUtils.queryProjectsIds(this.$projectsType.order, this.$selectUtils.Picker).then(response => {
        this.orderNameArray = JSON.parse(response.data.data);
      })
      this.$selectUtils.queryProjectsIds(this.$projectsType.proceeds ,this.$selectUtils.Picker).then(response => {
        this.proceedsNameArray = JSON.parse(response.data.data)
      })
      this.$selectUtils.queryPaymentIds(this.$selectUtils.Picker).then(response => {
        this.paymentArray = JSON.parse(JSON.parse(response.data.data));
        this.paymentArray = this.paymentArray.map(k => {
          if (k.children === null) {
            k.children = [{text: "", id: k.id}];
            return k;
          }
          return k;
        });
      })
      this.$selectUtils.queryPayeeIds(this.$selectUtils.Picker).then(response => {
        this.payeeArray = JSON.parse(response.data.data)
        this.payeeText = this.payeeArray.find(x => x.id == localStorage.getItem("empId")).text
        if (this.payeeText !== "") {
          this.payee = localStorage.getItem('empId')
        }
      })
      this.$selectUtils.queryAppProjectsIds(this.$selectUtils.Picker,this.$projectsType.appoint
          ,1).then(response => {
        this.appointNameArray = JSON.parse(response.data.data);
        let defChoose=this.appointNameArray.filter(item=>item.text==='试纱');
        this.appoint.appointName=defChoose[0].value;
      })
    },
    sourceOnConfirm(value) {
      if (value[1] === "") {
        this.sourceText = value[0];
        this.customer.source = this.sourceColumns.find(k => k.text === value[0]).id;
      } else {
        this.sourceText = value[1];
        let children = this.sourceColumns.find(k => k.text === value[0]).children;
        this.customer.source = children.find(k => k.text === value[1]).id;
      }
      this.sourceShowPicker = false;
    },
    serviceOnConfirm: function (value) {
      this.serviceText = value.text;
      this.customer.service = value.id;
      this.appoint.inviter= value.id;
      this.serviceShowPicker = false;
    },
    cusCreateDateOnConfirm: function (time) {
      let formatDate = this.$dateUtils.vantDateToYMD(time);
      this.customer.createDate = formatDate;
      this.cusCreateDateShowPicker = false;
      this.order.createDate = formatDate;
      this.appoint.createDate = formatDate;
      this.appoint.appointDate = formatDate;
    },
    next() {
      this.active++
    },
    previous() {
      this.active--
    },
    orderCreateDateConfirm(value) {
      this.order.createDate = this.$dateUtils.vantDateToYMD(value);
      this.orderCreateDateShowPicker = false
    },
    shopConfirm(val) {
      this.shopText = val.text
      this.customer.shopId = val.id
      this.appoint.appointShop= val.id;
      this.shopShowPicker = false
    },
    cosmeticsConfirm(val) {
      this.cosmeticsText = val.text
      this.order.orderCosmetics = val.id
      this.appoint.appointCosmetics = val.id
      this.cosmeticsShowPicker = false
    },
    weddingDayConfirm(value) {
      this.order.weddingDay = this.$dateUtils.vantDateToYMD(value);
      this.weddingDayPicker = false;
    },
    orderNameConfirm(value) {
      this.order.orderName = value.id
      this.orderNameText = value.text
      this.orderNamePicker = false

      if (value.text.includes("妆")){
        let defChoose=this.appointNameArray.filter(item=>item.text==='试妆');
        this.appoint.appointName=defChoose[0].value;
      }

      //如果订单项目是婚礼跟妆则化妆师必填
      this.orderCosmeticsCheck=value.text==='婚礼跟妆';

    },
    proceedsNameConfirm(val) {
      this.process.proceedsName = val.id;
      this.proceedsNameText = val.text;
      this.proceedsNamePicker = false;
    },
    paymentConfirm(value) {
      if (value[1] === "") {
        this.paymentText = value[0];
        this.process.payment = this.paymentArray.find(k => k.text === value[0]).id;
      } else {
        this.paymentText = value[1];
        let children = this.paymentArray.find(k => k.text === value[0]).children;
        this.process.payment = children.find(k => k.text === value[1]).id;
      }
      this.paymentPicker = false;
    },
    payeeConfirm: function (value) {
      this.process.payee = value.id;
      this.payeeText = value.text;
      this.payeePicker = false;
    },
    cusConfirm() {
      this.next()
    },
    orderConfirm() {
      this.next()
    },
    addConfirm() {
      this.loading = false
      this.$axios.post('/order/directAddOrder',
  {customer: this.customer,
        appoint: this.appoint,
        addAppointFlag:this.addAppointFlag,
        order: this.order,
        process: this.process}).then(response => {
        this.loading = false
        if (response.data.code === 200) {
          this.next()
        } else {
          this.$toast.fail(response.data.msg)
        }
      })
    },
    toWork() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
/deep/ .van-steps {
  background-color: #f6f7f9;
}
/deep/ .van-step--horizontal .van-step__circle-container {
  background-color: #f6f7f9;
}
/deep/ .display .van-cell::after {
  border-bottom: none;
}
/deep/ .van-picker__columns{
  margin: 0 20%;
}
</style>