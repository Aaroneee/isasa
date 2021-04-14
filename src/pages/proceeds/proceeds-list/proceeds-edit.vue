<template>
  <div>
    <baseNavBar title="收款编辑"/>

    <van-cell-group title="客户信息">
      <van-cell>
        <van-col span="12">姓名:{{ proceedsVo.name }}</van-col>
        <van-col span="12">订单总价:{{ proceedsVo.orderPrice }}</van-col>
      </van-cell>
    </van-cell-group>
    <br>
    <br>
    <van-cell-group title="修改收款">
      <van-form @submit="editProceeds">
        <van-field
            name="proceedsId"
            v-model="proceedsId"
            style="display: none"
        />
        <van-field
            name="orderId"
            v-model="orderId"
            style="display: none"
        />
        <van-field
            readonly
            name="proceedsName"
            :value="proceedsVo.proceedsName"
            label="收款项目"
            placeholder="点击选择收款项目"
            @click="proceedsNamePicker = true"
            :rules="[{ required: true }]"
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
            name="spareMoney"
            v-model="proceedsVo.spareMoney"
            label="收款金额"
            type="digit"
            placeholder="请输入收款金额"
            :rules="[{ required: true }]"
        />

        <van-field
            readonly
            name="payee"
            :value="proceedsVo.payee"
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
            name="createDate"
            :value="proceedsVo.createDate"
            label="收款日期"
            placeholder="收款日期"
            :rules="[{ required: true }]"
            @click="createDatePicker=true"
        />
        <van-calendar v-model="createDatePicker" :min-date="new Date('2020/01/01')" :max-date="new Date('2022/01/01')"
                      @confirm="createDateConfirm"/>

        <van-field
            readonly
            name="payment"
            :value="proceedsVo.payment"
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
        <br>
        <br>
        <br>
        <br>
        <van-row>
          <van-col span="14" offset="5">
            <van-button round block type="primary" native-type="submit">提交</van-button>
          </van-col>
        </van-row>
      </van-form>
    </van-cell-group>

  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "proceeds-edit"
  , data() {
    return {
      proceedsVo: this.$route.query,


      orderPriceParent: this.$route.query.orderPrice,
      spareMoneyParent: this.$route.query.spareMoney,
      proceedsNamePicker: false,
      payeePicker: false,
      createDatePicker: false,
      paymentPicker: false,
      proceedsNameArray: [],
      payeeArray: [],
      paymentArray: [],
      proceedsRate: "",
      proceedsName: "",
      payee: "",
      payment: "",
      tenantCrop: localStorage.getItem("tenantCrop"),
      proceedsId: "",
      orderId:"",
    }
  }, components: {
    baseNavBar
  }
  , created() {
    this.getById(this.proceedsVo.id)
    this.queryProjectsIds();
    this.queryPayeeIds();
    this.queryPaymentIds();
  }
  , methods: {
    getById: function (value) {
      this.$axios({
        method: "get",
        url: "proceeds/getById",
        params: {
          id: value
        }
      }).then(response => {
        const data = response.data.data
        this.proceedsName = data.proceedsName
        this.payee = data.payee
        this.payment = data.payment
        this.proceedsId = data.id
        this.orderId = data.orderId
      })
    },
    editProceeds: function (value) {
      value.id
      value.tenantCrop = this.tenantCrop;
      value.payee = this.payee;
      value.payment = this.payment;
      value.proceedsName = this.proceedsName;
      console.log(value);
      this.$dialog.confirm({
        title: '修改收款',
        message: '确认修改这条收款?',
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/proceeds/updateProceeds",
          params: value
        }).then(response => {
          if (response.data.code !== 200) {
            this.$toast.fail(response.data.msg)
            return
          }
          let that = this;
          this.$toast.success("收款修改成功!")
          setTimeout(function () {
            that.$router.back()
          }, 1000)
        })
      })
    },
    //收款项目确认
    proceedsNameConfirm: function (value) {
      this.proceedsVo.proceedsName = value.text;
      this.proceedsName = value.id;
      this.proceedsNamePicker = false;
    },
    //收款人
    payeeConfirm: function (value) {
      this.proceedsVo.payee = value.text;
      this.payee = value.id;
      this.payeePicker = false;
    },
    //收款时间确认
    createDateConfirm: function (time) {
      this.createDate = this.$dateUtils.vantDateToYMD(time);
      this.createDatePicker = false;
    },
    //收款方式确认
    paymentConfirm: function (value) {
      if (value[1] === "") {
        this.proceedsVo.payment = value[0];
        this.payment = this.paymentArray.find(k => k.text === value[0]).id;
      } else {
        this.proceedsVo.payment = value[1];
        this.payment = this.paymentArray.find(k => k.text === value[0]).children.find(k => k.text === value[1]).id;
      }
      this.paymentPicker = false;
    },


    //查询收款项目
    queryProjectsIds: function () {
      this.$selectUtils.queryProjectsIds(
          this.$projectsType.proceeds,
          this.$selectUtils.Picker
      ).then(response => {
        this.proceedsNameArray = JSON.parse(response.data.data);
      })
    },
    //查询收款人
    queryPayeeIds: function () {
      this.$selectUtils.queryPayeeIds(this.$selectUtils.Picker).then(response => {
        this.payeeArray = JSON.parse(response.data.data)
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


  }
  , watch: {
    spareMoney: function () {
      let proportion = (Number(this.spareMoney) + Number(this.spareMoneyParent)) / Number(this.orderPriceParent);
      if (proportion >= 0 && proportion < 0.8) this.proceedsRate = "N->0-80%";
      else if (proportion < 1) this.proceedsRate = "D->80%-100%";
      else if (proportion === 1) this.proceedsRate = "W->100%";
      else this.proceedsRate = "X->小定"
    }
  },

}
</script>

<style scoped>

</style>
