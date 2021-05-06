<template>
  <div>
    <baseNavBar title="订单修改"/>

    <van-form @submit="addAppointSubmit">

      <van-field
          readonly
          v-model="this.orderVo.name"
          label="客资名"
          placeholder="客资名"
          :rules="[{ required: true }]"
      />

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
      <van-calendar v-model="createDatePicker" :min-date="minDate" :max-date="maxDate" :default-date="new Date(createDate)"
                    @confirm="createDateConfirm"/>

      <van-field
          readonly
          name="weddingDay"
          :value="weddingDay"
          label="精确婚期"
          placeholder="精确婚期"
          :rules="[{ required: true }]"
          @click="weddingDayPicker=true"
      />
      <van-calendar v-model="weddingDayPicker" :min-date="minDate" :max-date="maxDate" :default-date="new Date(weddingDay)"
                    @confirm="weddingDayConfirm"/>

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
      <van-field
          readonly
          name="orderAuxiliaryDress"
          :value="orderAuxiliaryDressText"
          label="辅销"
          placeholder="辅销"
          @click="auxiliaryDressPicker=true"
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
      <van-popup v-model="auxiliaryDressPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="orderDressArray"
            @confirm="auxiliaryDressConfirm"
            @cancel="auxiliaryDressPicker = false"
        />
      </van-popup>

      <van-field
          readonly
          clickable
          name="orderCosmetics"
          :value="orderCosmeticsText"
          label="化妆师"
          placeholder="点击选择化妆师"
          @click="orderCosmeticsPicker = true"
      />
      <van-popup v-model="orderCosmeticsPicker" position="bottom">
        <van-picker
            getColumnValues
            show-toolbar
            :columns="orderCosmeticsArray"
            @confirm="orderCosmeticsOnConfirm"
            @cancel="orderCosmeticsPicker = false"
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
          readonly
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
          name="proceedsRate"
          :value="proceedsRate"
          label="收款进度"
          placeholder="收款进度"
          :rules="[{ required: true }]"
      />
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
  name: "orderEdit",
  data() {
    return {
      cusId:"",
      orderId:"",
      orderVo: this.$route.query,
      //对象
      orderNo: "",
      createDate: "",
      weddingDay: "",
      orderName: "",
      orderDress: "",
      orderAuxiliaryDress:"",
      orderCosmetics: "",
      orderPrice: null,
      spareMoney: null,
      orderSpare: null,
      proceedsRate: "",

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],
      //Picker
      createDatePicker: false,
      weddingDayPicker: false,
      orderNamePicker: false,
      orderDressPicker: false,
      auxiliaryDressPicker:false,
      orderCosmeticsPicker: false,

      //数据
      orderNameArray: [],
      orderDressArray: [],
      orderCosmeticsArray: [],

      //显示文本
      orderNameText: "",
      orderDressText: "",
      orderAuxiliaryDressText:"",
      orderCosmeticsText: "",


      weddingDayDefault:"",
      createDateDefault:"",
    }
  },
  components: {
    baseNavBar,
  },
  watch: {
    orderPrice(valOne) {
      this.orderSpare = valOne - this.spareMoney;
      this.selectProceedsRate();

    },
    spareMoney(valOne) {
      this.orderSpare = this.orderPrice - valOne;
      this.selectProceedsRate();
    }
  },
  mounted() {
    this.orderNo = this.orderVo.orderNo
    this.createDate = this.orderVo.createDate
    this.weddingDay = this.orderVo.weddingDay
    this.orderNameText = this.orderVo.orderName
    this.orderDressText = this.orderVo.dress
    this.orderAuxiliaryDressText = this.orderVo.auxiliary
    this.orderCosmeticsText = this.orderVo.cosmetics
    this.orderPrice = this.orderVo.orderPrice
    this.spareMoney = this.orderVo.spareMoney
    this.orderSpare = this.orderVo.orderSpare
    this.cusId = this.orderVo.cusId
  },
  created() {
    this.queryOrderNameIds();
    this.queryAppointDress();
    this.queryAppointCosmetics();
    this.queryOrderById();
    console.log(this.orderVo);
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
    //辅助销售确认
    auxiliaryDressConfirm:function (value){
      this.orderAuxiliaryDress = value.id
      this.orderAuxiliaryDressText = value.text;
      this.auxiliaryDressPicker = false
    },
    //化妆师确认
    orderCosmeticsOnConfirm: function (value) {
      this.orderCosmetics = value.id;
      this.orderCosmeticsText = value.text;
      this.orderCosmeticsPicker = false;
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
    addAppointSubmit: function (data) {
      data.orderName = this.orderName;
      data.orderDress = this.orderDress;
      data.orderAuxiliaryDress = this.orderAuxiliaryDress;
      data.orderCosmetics = this.orderCosmetics;
      data.weddingDay = this.weddingDay
      data.tenantCrop = localStorage.getItem("tenantCrop");
      data.cusId = this.cusId
      data.id = this.orderId
      console.log(data)
      console.log(data)
      this.$dialog.confirm({
        title: '修改订单',
        message: '是否确认修改 《 ' + this.orderVo.name + ' 》的这条订单订单?',
      }).then(() => {
        this.$axios({
          method: "PUT",
          url: "/order/updateOrderById",
          params: data
        }).then(response => {
          if (response.data.code !== 200) {
            this.$toast.fail(response.data.msg)
            return
          }
          let that = this;
          this.$toast.success("订单修改成功!")
          setTimeout(function () {
            that.$router.back()
          }, 1000)
        })
      })
    },
    queryOrderById: function () {
      this.$axios({
        method: "GET",
        url: "/order/getById",
        params: {
          id: this.orderVo.id
        }
      }).then(response => {
        const data = response.data.data
        this.orderDress = data.orderDress
        this.orderAuxiliaryDress = data.orderAuxiliaryDress
        this.orderName = data.orderName
        this.orderCosmetics = data.orderCosmetics
        this.orderId = data.id
        console.log(data)
      })
    },
    //查询订单项目
    queryOrderNameIds: function () {
      this.$selectUtils.queryProjectsIds(this.$projectsType.order, this.$selectUtils.Picker).then(response => {
        this.orderNameArray = JSON.parse(response.data.data);
      })
    }
    ,
//查询礼服师
    queryAppointDress: function () {
      this.$selectUtils.queryDressIds(
          this.$selectUtils.Picker
      ).then(response => {
        this.orderDressArray = JSON.parse(response.data.data);
      })
    }
    ,
    //查询化妆师
    queryAppointCosmetics: function () {
      this.$selectUtils.queryCosmeticsIds(
          this.$selectUtils.Picker
      ).then(response => {
        this.orderCosmeticsArray = JSON.parse(response.data.data);
      })
    },
  },

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
.msg {
  height: 100px;
}

* {
  /*padding: 0;*/
  margin: 0;
  border: none;
  outline: none;
  box-sizing: border-box;
  /*background: transparent;*/
}

.bottom-button {
  /*position: absolute;*/
  width: 90%;
  left: 5%;
  bottom: 20px;
}

.crop-wrap {
  z-index: 1;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #000;
}

.btn-box {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
}

.crop-btn {
  width: 60px;
  height: 100%;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  background: transparent;

}

.slim-fade-enter-active, .slim-fade-leave-active {
  transition: all 0.4s ease;
}

.slim-fade-enter, .slim-fade-leave-to {
  opacity: 0;
  transform-origin: top;
  transform: translateY(100%);
}
</style>
