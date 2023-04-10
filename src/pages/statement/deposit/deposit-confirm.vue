<template>
  <div>
    <van-sticky>
      <van-nav-bar
          :title="titleText"
          left-text="返回"
          left-arrow
          :fixed="false"
          :placeholder="true"
          @click-left="onClickLeft"
      />
    </van-sticky>

    <van-cell-group title="客户信息">
      <van-field input-align="right" label="客户名" :value="item.customerName" readonly />
      <van-field input-align="right" label="订单编号" :value="item.orderNo" readonly />
      <van-field input-align="right" label="退押状态" :value="item.type === 0 ? '未申请' : item.type === 1 ? '已申请' : '已退'" readonly />
    </van-cell-group>
    <van-form
        validate-first
        validate-trigger="onChange"
        @submit="submit">
      <van-cell-group title="确认退押信息">
        <van-field
            v-model="refundAmount"
            name="退款金额"
            label="退款金额"
            placeholder="退款金额"
            :rules="formRule.depositAmount"
        />
      </van-cell-group>
      <van-field
          readonly
          clickable
          name="picker"
          :value="paymentName"
          label="退款方式"
          placeholder="退款方式"
          :rules="formRule.payment"
          @click="showPaymentPicker = true"
      />
      <van-field
          v-model="refundTarget"
          name="退款目标账户名"
          label="退款目标账户名"
          placeholder="退款目标账户名"
          :rules="formRule.refundTarget"
      />
      <van-field
          v-model="targetAccount"
          name="退款目标账户"
          label="退款目标账户"
          placeholder="退款目标账户"
          :rules="formRule.targetAccount"
      />
      <van-popup v-model="showPaymentPicker" position="bottom">
        <van-picker
            show-toolbar
            :columns="paymentColumns"
            @cancel="showPaymentPicker = false"
            @confirm="paymentOnConfirm"
        />
      </van-popup>
      <van-field name="uploader" label="确认退押图">
        <template #input>
          <van-uploader v-model="refundPicture" :max-count="1"/>
        </template>
      </van-field>
      <van-row style="margin: 30px auto">
        <van-col :span="12" style="text-align: center">
          <van-button type="info" native-type="submit">提交</van-button>
        </van-col>
        <van-col :span="12" style="text-align: center">
          <van-button type="primary" native-type="button" @click="onClickLeft()">取消</van-button>
        </van-col>
      </van-row>
    </van-form>
  </div>
</template>

<script>
import {Dialog} from "vant";
import { Toast } from 'vant';

export default {
  name: "deposit-confirm",
  data() {
    return {
      titleText: '确认退押',
      item: this.$route.params.item,
      showPaymentPicker: false,
      paymentColumns: [],
      refundPicture: [],
      paymentName: '',
      refundAmount: this.$route.params.item.refundAmount,
      refundPayment: '',
      refundTarget: this.$route.params.item.refundTarget,
      targetAccount: this.$route.params.item.targetAccount,
      tenantCrop: localStorage.getItem('tenantCrop'),
      cusId: this.$route.params.item.customerId,
      orderId: this.$route.params.item.orderId,
      formRule: {
        depositAmount: [
          { required: true, message: '请填写金额' },
          { pattern: /^(([0-9]|([1-9][0-9]{0,9}))((\\.[0-9]{1,2})?))$/, message: '请填写正确的金额'}
        ],
        refundAmount: [
          { required: true, message: '请填写申请退押金额' },
          { pattern: /^([-+])?\d+(\.[0-9]{1,2})?$/, message: '请填写正确的金额'}
        ],
        applyRefund: [
          { required: true, message: '请填写退押金额' },
          { pattern: /^-[0-9]+(?:\.[0-9]+)?$/, message: '请填写负数的金额'}
        ],
        refundTarget: [
          { required: true, message: '请填写退款目标账户名' }
        ],
        targetAccount: [
          { required: true, message: '请填写退款目标账户' }
        ],
        payment: [
          { required: true, message: '请填写退款方式' }
        ]
      }
    }
  },
  created() {
    console.log(this.item);
    this.queryRefundPaymentIds()
  },
  methods: {
    onClickLeft() {
      Dialog.confirm({
        message: '您还未提交，是否返回？',
      }).then(() => {
        this.$router.back()
      }).catch(() => {
        return false;
      });
    },
    paymentOnConfirm(value) {
      this.refundPayment = value.id
      this.paymentName = value.text
      this.showPaymentPicker = false
    },
    queryRefundPaymentIds() {
      this.$selectUtils.queryRefundPaymentIds(this.$selectUtils.Picker).then(response => {
        console.log(JSON.parse(response.data.data))
        this.paymentColumns = JSON.parse(response.data.data)
      })
    },
    submit() {
      if (this.refundPicture.length === 0) {
        Dialog.alert({
          title: '未上传退押图片！'
        }).then(() => {
          return false
        });
        return false;
      }
      // 添加退押
      const formData = new FormData()
      formData.append('orderId', this.orderId)
      formData.append('cusId', this.cusId)
      formData.append('refundPeople', localStorage.getItem('empId'))
      formData.append('refundAmount', this.refundAmount)
      formData.append('refundPayment', this.refundPayment)
      formData.append('refundTarget', this.refundTarget)
      formData.append('targetAccount', this.targetAccount)
      formData.append('tenantCrop', this.tenantCrop)
      formData.append('refundPicture', this.refundPicture[0].file)

      const toast = Toast.loading({
        duration: 0,
        message: '提交中...',
        forbidClick: true,
      });
      this.$axios({
        method: 'POST',
        url: '/refund/addRefund',
        data: formData
      }).then(response => {
        if (response.data.code === 200) {
          toast.clear()
          Toast.success('确认退款成功');
          this.$router.replace('depositList')
        } else {
          toast.clear()
          Toast.fail('确认退款失败');
        }
      }).catch(error => {
        toast.clear()
        Toast.fail(error);
      })
    },
  }
}
</script>

<style scoped>

</style>