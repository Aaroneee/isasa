<template>
  <div>
    <van-sticky>
      <base-nav-bar title="收押金"/>
    </van-sticky>
    <van-form @submit="submit">
      <van-field
          v-model="cusName"
          name="name"
          readonly
          label="客户名"
          placeholder="客户名"
      />
      <van-field
          v-model="proceedsNameText"
          readonly
          label="收款项目"
      />
      <van-field
          v-model.number="spareMoney"
          label="收款金额"
          required
          placeholder="请填写收款金额"
          :rules="[{ required: true}]"
      />
      <van-field
          v-model="payee"
          label="收款人"
          readonly
      />
      <van-field
          v-model="createDate"
          label="收款日期"
          readonly
          required
          @click="createDateShowPicker = true"
      />
      <van-calendar v-model="createDateShowPicker" :min-date="minDate" :max-date="maxDate"
                    @confirm="createDateConfirm"/>
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
      <van-field
          v-if="weddingDayArray.length > 1"
          readonly
          required
          name="payment"
          :value="weddingDayText"
          label="收押婚期"
          placeholder="请选择收押婚期"
          :rules="[{ required: true}]"
          @click="weddingDaySelectShowPicker=true"
      />
      <van-popup v-if="weddingDayArray.length > 1" v-model="weddingDaySelectShowPicker" round position="bottom">
        <van-picker
            title="选择婚期"
            show-toolbar
            :columns="weddingDayArray"
            @confirm="weddingDayConfirm"
            @cancel="weddingDayCancel"
        />
      </van-popup>
      <van-row style="margin-top: 7%">
        <van-col span="22" offset="1">
          <van-button type="info" style="width: 100%" :loading="loading" loading-text="确认中...">确定</van-button>
        </van-col>
      </van-row>
    </van-form>

  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "add-deposit",
  created() {
    this.queryEmpName()
    this.queryProcessProject()
    this.$selectUtils.queryDepositPayment(this.$selectUtils.Picker).then(response => {
      console.log(response)
      this.paymentArray = JSON.parse(JSON.parse(response.data.data));
      this.paymentArray = this.paymentArray.map(k => {
        if (k.children === null) {
          k.children = [{text: "", id: k.id}];
          return k;
        }
        return k;
      });
    })
    this.queryWeddingDayByCusId()
  },
  components: {
    baseNavBar
  },
  data() {
    return {
      cusId: this.$route.query.cusId,
      cusName: this.$route.query.name,
      spareMoney: null,
      payee: null,
      createDate: this.$dateUtils.vantDateToYMD(new Date()),
      createDateShowPicker: false,
      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],
      paymentText: "",
      payment: null,
      paymentPicker: false,
      paymentArray: [],
      proceedsName: null,
      proceedsNameText: null,
      tenantCrop: localStorage.getItem("tenantCrop"),
      loading: false,
      weddingDayArray: [],
      weddingDayId: null,
      weddingDaySelectShowPicker: false,
      weddingDayText: "",
    }
  },
  methods: {
    queryEmpName() {
      this.$axios({
        method: "get",
        url: "/emp/queryEmpById",
        params: {
          empId: localStorage.getItem("empId")
        }
      }).then(response => {
        this.payee = response.data.data.empName
      })
    },
    createDateConfirm(val) {
      this.createDate = this.$dateUtils.vantDateToYMD(val)
      this.createDateShowPicker = false
    },
    paymentConfirm(value) {
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
    submit() {
      this.loading = true
      this.$axios({
        method: "post",
        url: "/proceeds/addDepositProcess",
        data: {
          tenantCrop: this.tenantCrop,
          cusId: this.cusId,
          proceedsName: this.proceedsName,
          payment: this.payment,
          payee: localStorage.getItem("empId"),
          spareMoney: this.spareMoney,
          weddingId: this.weddingDayId
        }
      }).then(response => {
        this.loading = false
        const flag = response.data.code === 200
        if (flag) {
          this.$toast.success("收押金成功！");
          setTimeout(this.back, 500);
        } else {
          this.$toast.fail(response.data.msg)
        }
      })
    },
    queryProcessProject() {
      this.$selectUtils.queryProjectsIds(this.$projectsType.proceeds).then(response => {
        const array = JSON.parse(response.data.data).filter(s => s.name == '押金')[0]
        this.proceedsName = array.value
        this.proceedsNameText = array.name
      })
    },
    back() {
      this.$router.back()
    },
    queryWeddingDayByCusId() {
      this.weddingDayArray = []
      this.$axios({
        method: "get",
        url: "/weddingDate/queryWeddingDayByCusId",
        params: {
          cusId: this.cusId,
        }
      }).then(response => {
        response.data.data.forEach(s => {
          this.weddingDayArray.push({text: s.weddingDay, value: s.id})
        })
        if (this.weddingDayArray.length == 1) {
          this.weddingDayId = this.weddingDayArray[0].value
        }
        console.log(this.weddingDayId)
      })
    },
    weddingDayConfirm(val) {
      this.weddingDayText = val.text
      this.weddingDayId = val.value
      this.weddingDayCancel()
    },
    weddingDayCancel() {
      this.weddingDaySelectShowPicker = false
    },
  }
}
</script>

<style scoped>

</style>