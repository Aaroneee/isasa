<template>
  <div>
    <baseNavBar title="线上订单添加"/>
    <van-field
        readonly
        v-model="this.costumer.name"
        label="客资名"
        :rules="[{required: true}]"
    />
    <van-form @submit="onlineOrderSubmit">
      <van-field
        name="orderNo"
        v-model="orderNo"
        label="订单编号"
        placeholder="订单编号"
      />
      <van-field
          readonly
          name="createDate"
          :value="createDate"
          label="订单日期"
          @click="createDatePicker=true"
      />
      <van-calendar v-model="createDatePicker" :min-date="minDate" :max-date="maxDate"
                    @confirm="createDateConfirm"/>
      <van-field
        readonly
        label="精确婚期"
        placeholder="精确婚期"
        @click="weddingDayPicker=true"
        :value="weddingDay"
      />
      <van-calendar v-model="weddingDayPicker" :min-date="minDate" :max-date="maxDate"
                    @confirm="weddingDayConfirm"/>
      <van-field
        readonly
        label="订单项目"
        placeholder="订单项目"
        :rules="[{required: true}]"
        :value="orderNameText"
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
        label="收款项目"
        placeholder="收款项目"
        readonly
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
          name="payment"
          :value="paymentText"
          label="收款方式"
          placeholder="收款方式"
          :rules="[{ required: true }]"
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
        v-model.number="orderPrice"
        type="digit"
        name="orderPrice"
      />
      <van-field
        label="收款金额"
        placeholder="收款金额"
        v-model.number="spareMoney"
        type="digit"
        name="spareMoney"
        :rules="[{required: true}]"
      />
      <van-field
        v-if="orderSum"
        label="余额"
        placeholder="余额"
        type="number"
        v-model.number="orderSpare"
        name="orderSpare"
        readonly
      />
      <van-field
        readonly
        name="payee"
        :value="payeeText"
        label="收款人"
        placeholder="收款人"
        @click="payeePicker=true"
        :default-index="payee"
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
      <br>
      <br>
      <van-row>
        <van-button
            color="linear-gradient(to right, #50E64D, #03B300)"
            class="bottom-button"
            round block
            type="primary"
            native-type="submit">提交
        </van-button>
      </van-row>
    </van-form>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "onlineOrderAdd",
  created() {
    this.queryProceedsNameIds()
    this.queryPaymentIds()
    this.queryPayeeIds()
    this.queryShopIds()
  },
  components: {
    baseNavBar
  },
  data() {
    return {
      costumer: this.$route.query,
      orderNo:  "",
      createDatePicker: false,
      createDate: this.$dateUtils.vantDateToYMD(new Date()),
      maxDate: this.$dateUtils.getMaxMinDate()[0],
      minDate: this.$dateUtils.getMaxMinDate()[1],
      weddingDay: "",
      weddingDayPicker: false,
      orderNameText: "线上订单",
      orderNamePicker: false,
      orderNameArray: [],
      proceedsNameArray: [],
      proceedsNameText: "",
      proceedsNamePicker: false,
      paymentText: "",
      paymentPicker: false,
      paymentArray: [],
      orderSum: false,
      orderPrice: null,
      spareMoney: null,
      orderSpare: null,
      payeeText: "",
      payeePicker: false,
      payeeArray: [],
      payee:localStorage.getItem('empId'),
      shopArray: [],
      shopId: localStorage.getItem("shopIds").split(",").map(Number)[0],
      shopShowPicker: false,
      shopText: ""
    }
  },
  watch: {
    orderPrice(valOne) {
      this.orderSpare = valOne - this.spareMoney;

    },
    spareMoney(valOne) {
      this.orderSpare = this.orderPrice - valOne;
    }
  },
  methods: {
    //提交线上订单
    onlineOrderSubmit: function (data) {
      data.cusId = this.costumer.id
      data.orderName = this.orderName;
      data.proceedsName = this.proceedsName;
      data.payment = this.payment;
      data.payee = this.payee;
      data.tenantCrop = localStorage.getItem("tenantCrop");
      data.orderCity = this.costumer.city;
      data.shopId = this.shopId
      this.$dialog.confirm({
        title: '添加订单',
        message: '是否确认给 : ' + this.costumer.name + ' 添加订单?',
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/order/saveOnlineOrder",
          params: data
        }).then(response => {
          console.log(response)
          if (response.data.code !== 200) {
            this.$toast.fail(response.data.msg)
            return
          }
          this.$toast.success("订单添加成功!")
          this.$dialog.confirm({
            message: '是否确认跳转到订单列表?',
          }).then(() => {
            this.$router.push({name: "orderList"})
          }).catch(() => {
            this.reload()
          })
        });
      })
    },
    createDateConfirm: function (value) {
      this.createDate = this.$dateUtils.vantDateToYMD(value);
      this.createDatePicker = false;
    },
    weddingDayConfirm: function (value) {
      this.weddingDay = this.$dateUtils.vantDateToYMD(value);
      this.weddingDayPicker = false;
    },
    orderNameConfirm: function (value) {
      this.orderName = value.id;
      this.orderNameText = value.text;
      this.orderNamePicker = false;
    },
    proceedsNameConfirm: function (value) {
      this.proceedsName = value.id;
      this.proceedsNameText = value.text;
      this.proceedsNamePicker = false;
    },
    paymentConfirm: function (value) {
      if (value[1] === "") {
        this.paymentText = value[0];
        this.payment = this.paymentArray.find(k => k.text === value[0]).id;
      } else {
        this.paymentText = value[1];
        let children = this.paymentArray.find(k => k.text === value[0]).children;
        this.payment = children.find(k => k.text === value[1]).id;
      }
      this.paymentPicker = false;
    },
    payeeConfirm: function (value) {
      this.payee = value.id;
      this.payeeText = value.text;
      this.payeePicker = false;
    },
    queryProceedsNameIds: function () {
      this.$selectUtils.queryOnlineOrder(this.$selectUtils.Picker).then(response => {
        this.proceedsNameArray = JSON.parse(response.data.data)
      })
    },
    queryOrderNameIds: function () {
      this.$selectUtils.queryProjectsIds(this.$projectsType.order, this.$selectUtils.Picker).then(response => {
        this.orderNameArray = JSON.parse(response.data.data);
      })
    },
    queryPaymentIds: function () {
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
    },
    queryPayeeIds: function () {
      this.$selectUtils.queryPayeeIds(this.$selectUtils.Picker).then(response => {
        this.payeeArray = JSON.parse(response.data.data)
        this.payeeText = this.payeeArray.find(x => x.id == localStorage.getItem("empId")).text
      })
    },
    queryShopIds: function () {
      this.$selectUtils.queryShopIdsIsValid(this.$selectUtils.Picker).then(response => {
        this.shopArray = JSON.parse(response.data.data);
        this.shopText = this.shopArray.filter(s => s.id === this.shopId)[0].text
      })
    },
    shopConfirm(val) {
      this.shopText = val.text
      this.shopId = val.id
      this.shopShowPicker = false
    }
  }
}
</script>

<style scoped>
.bottom-button {
  /*position: absolute;*/
  width: 90%;
  left: 5%;
  bottom: 20px;
}
</style>