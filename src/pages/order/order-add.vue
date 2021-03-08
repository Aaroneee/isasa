<template>
  <div>
    <baseNavBar title="订单添加"/>
    <van-field
        readonly
        v-model="this.appointVo.name"
        label="客资名"
        placeholder="客资名"
        :rules="[{ required: true }]"
    />
    <van-form @submit="addAppointSubmit">
      <van-field
          name="orderNo"
          v-model="orderNo"
          label="订单编号"
          placeholder="订单号"
          :rules="[{ required: true }]"
      />

      <van-field
          readonly
          name="createDate"
          :value="createDate"
          label="订单日期"
          placeholder="订单日期"
          :rules="[{ required: true }]"
          @click="createDatePicker=true"
      />
      <van-calendar v-model="createDatePicker" @confirm="createDateConfirm"/>

      <van-field
          readonly
          name="weddingDay"
          :value="weddingDay"
          label="精确婚期"
          placeholder="精确婚期"
          :rules="[{ required: true }]"
          @click="weddingDayPicker=true"
      />
      <van-calendar v-model="weddingDayPicker" @confirm="weddingDayConfirm"/>

      <van-field
          readonly
          name="orderName"
          :value="orderNameText"
          label="订单项目"
          placeholder="订单项目"
          :rules="[{ required: true }]"
          @click="orderNamePicker=true"
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
          name="orderDress"
          :value="orderDressText"
          label="礼服师"
          placeholder="礼服师"
          :rules="[{ required: true }]"
          @click="orderDressPicker=true"
      />
      <van-popup v-model="orderDressPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="orderDressArray"
            @confirm="orderDressConfirm"
            @cancel="orderDressPicker = false"
        />
      </van-popup>

      <van-field
          readonly
          name="proceedsName"
          :value="proceedsNameText"
          label="收款项目"
          placeholder="收款项目"
          :rules="[{ required: true }]"
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

      <van-field
          name="orderPrice"
          v-model.number="orderPrice"
          label="订单总价"
          type="digit"
          placeholder="订单总价"
          :rules="[{ required: true }]"
      />

      <van-field
          name="spareMoney"
          v-model.number="spareMoney"
          label="收款金额"
          type="digit"
          placeholder="收款金额"
          :rules="[{ required: true }]"
      />

      <van-field
          readonly
          name="orderSpare"
          v-model.number="orderSpare"
          label="余款"
          type="number"
          placeholder="余款"
          :rules="[{ required: true }]"
      />

      <van-field
          readonly
          name="payee"
          :value="payeeText"
          label="收款人"
          placeholder="收款人"
          @click="payeePicker=true"
          :rules="[{ required: true }]"
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

      <van-field
          readonly
          name="proceedsRate"
          :value="proceedsRate"
          label="收款进度"
          placeholder="收款进度"
          :rules="[{ required: true }]"
      />
      <br>
      <br>
      <van-row>
        <van-col span="14" offset="5">
          <van-button round block type="primary" native-type="submit">提交</van-button>
        </van-col>
      </van-row>
    </van-form>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "order-add",
  data() {
    return {
      appointVo: this.$route.query.appointVo,

      //对象
      orderNo: "",
      createDate: "",
      weddingDay: "",
      orderName: "",
      orderDress: "",
      proceedsName: "",
      payment: "",
      orderPrice: null,
      spareMoney: null,
      orderSpare: null,
      payee: "",
      proceedsRate: "",
      //Picker
      createDatePicker: false,
      weddingDayPicker: false,
      orderNamePicker: false,
      orderDressPicker: false,
      proceedsNamePicker: false,
      paymentPicker: false,
      payeePicker: false,

      //数据
      orderNameArray: [],
      orderDressArray: [],
      proceedsNameArray: [],
      paymentArray: [],
      payeeArray: [],

      //显示文本
      orderNameText: "",
      orderDressText: "",
      proceedsNameText: "",
      paymentText: "",
      payeeText: "",


    }
  },
  components: {
    baseNavBar,
  },
  watch: {
    orderPrice(valOne) {
      this.orderSpare = valOne - this.spareMoney;
      this.selectProceedsRate();
      console.log(this.proceedsRate)

    },
    spareMoney(valOne) {
      this.orderSpare = this.orderPrice - valOne;
      this.selectProceedsRate();
      console.log(this.proceedsRate)
    }
  },
  created() {
    this.queryOrderNameIds();
    this.queryAppointDress();
    this.queryProceedsNameIds();
    this.queryPaymentIds();
    this.queryPayeeIds();
    console.log(this.appointVo);
  },
  methods: {
    //订单日期
    createDateConfirm: function (value) {
      this.createDate = this.$dateUtils.vantDateToYMD(value);
      this.createDatePicker = false;
    },
    //精确婚期确认
    weddingDayConfirm: function (value) {
      this.weddingDay = this.$dateUtils.vantDateToYMD(value);
      this.weddingDayPicker = false;
    },
    //订单项目确认
    orderNameConfirm: function (value) {
      this.orderName = value.id;
      this.orderNameText = value.text;
      this.orderNamePicker = false;
    },
    //礼服师确认
    orderDressConfirm: function (value) {
      this.orderDress = value.id;
      this.orderDressText = value.text;
      this.orderDressPicker = false;
    },
    //收款项目确认
    proceedsNameConfirm: function (value) {
      this.proceedsName = value.id;
      this.proceedsNameText = value.text;
      this.proceedsNamePicker = false;
    },
    //收款方式确认
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
    //收款人确认
    payeeConfirm: function (value) {
      this.payee = value.id;
      this.payeeText = value.text;
      this.payeePicker = false;
    },
    //选择收款进度
    selectProceedsRate: function () {
      let proportion = this.spareMoney / this.orderPrice;
      if (proportion >= 0 && proportion < 0.8) this.proceedsRate = "N->0-80%";
      else if (proportion < 1) this.proceedsRate = "D->80%-100%";
      else if (proportion === 1) this.proceedsRate = "W->100%";
      else this.proceedsRate = "X->小定"
    },

    //提交订单
    addAppointSubmit: function (value) {
      value.cusId = this.appointVo.cusId;
      value.appId = this.appointVo.id;
      value.orderName = this.orderName;
      value.orderDress = this.orderDress;
      value.proceedsName = this.proceedsName;
      value.payment = this.payment;
      value.payee = this.payee;
      value.orderCity = this.appointVo.appointCity;
      value.tenantCrop = localStorage.getItem("tenantCrop");
      this.$dialog.confirm({
        title: '添加订单',
        message: '是否确认给 : ' + this.appointVo.name + ' 添加订单?',
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/order/saveOrder",
          params: value
        }).then(response => {
          console.log(response)
          if (response.data.code !== 200) {
            this.$toast.fail(response.data.msg())
            return
          }
          this.$toast.success("订单添加成功!")
          this.$dialog.confirm({
            message: '是否确认跳转到订单列表?',
          }).then(() => {
            this.$router.push({name:"orderList"})
          })
        })
      })

    },

    //查询订单项目
    queryOrderNameIds: function () {
      this.$selectUtils.queryProjectsIds(this.$projectsType.order, this.$selectUtils.Picker).then(response => {
        this.orderNameArray = JSON.parse(response.data.data);
      })
    },
    //查询礼服师
    queryAppointDress: function () {
      this.$selectUtils.queryDressIds(
          this.$selectUtils.Picker
      ).then(response => {
        this.orderDressArray = JSON.parse(response.data.data);
      })
    },
    //查询收款项目
    queryProceedsNameIds: function () {
      this.$selectUtils.queryProjectsIds(this.$projectsType.proceeds, this.$selectUtils.Picker).then(response => {
        this.proceedsNameArray = JSON.parse(response.data.data)
      })
    },
    //查询收款方式
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
    //查询收款人
    queryPayeeIds: function () {
      this.$selectUtils.queryPayeeIds(this.$selectUtils.Picker).then(response => {
        this.payeeArray = JSON.parse(response.data.data)
      })
    },
  }

}
const citys = [
  {
    text: "支付宝",
    id: 1,
    children:
        [
          {
            text: "JUDY微信",
            id: 37,
            children: null
          }, {
          text: "213123",
          id: 44,
          children: null
        }, {
          text: "13412423",
          id: 45,
          children: null
        }
        ]
  },
  {
    text: "现金",
    id: 2,
    children: null
  },
  {
    text: "微信",
    id: 3,
    children: [
      {
        text: "JUDY微信",
        id: 37,
        children: null
      },
      {
        text: "213123",
        id: 44,
        children: null
      },
      {
        text: "13412423",
        id: 45,
        children: null
      }
    ]
  },
  {
    text: "本地POS机",
    id: 4,
    children: null
  }, {
    text: "异地POS机",
    id: 5,
    children: null
  }, {
    text: "银行卡转账",
    id: 6,
    children: [{
      text: "杭州民生银行",
      id: 32,
      children: null
    }, {
      text: "北京银行",
      id: 34,
      children: null
    }, {
      text: "上海招商银行",
      id: 35,
      children: null
    }]
  }, {
    text: "抵扣券",
    id: 39,
    children: null
  }, {
    text: "艺术中心结算",
    id: 41,
    children: null
  }, {
    text: "21312312",
    id: 43,
    children: null
  }]


</script>

<style scoped>

</style>
