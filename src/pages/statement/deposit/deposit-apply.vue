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
    <van-form @submit="submit" validate-trigger="onChange">
      <van-cell-group title="申请退押">
          <van-field
              readonly
              clickable
              name="picker"
              :value="paymentName"
              label="退款方式"
              placeholder="退款方式"
              @click="showPaymentPicker = true"
              :rules="applyRules.refundMethod"
          />
          <van-field
              v-model="refundAmount"
              name="退款金额"
              label="退款金额"
              placeholder="退款金额"
              :rules="applyRules.refundAmount"
          />
          <van-field
              v-model="refundTarget"
              name="退款目标账户名"
              label="退款目标账户名"
              placeholder="退款目标账户名"
              :rules="applyRules.refundTarget"
          />
          <van-field
              v-model="targetAccount"
              name="退款目标账户"
              label="退款目标账户"
              placeholder="退款目标账户"
              :rules="applyRules.targetAccount"
          />
          <van-field
              v-model="refundInfo"
              name="退款备注"
              label="退款备注"
              placeholder="退款备注"
          />
          <van-field
              readonly
              clickable
              name="calendar"
              :value="applyDate"
              label="申请日期"
              placeholder="点击选择日期"
              @click="showApplyCalendar = true"
              :rules="applyRules.applyDate"
          />
          <van-calendar v-model="showApplyCalendar" @confirm="applyDateOnConfirm" :min-date="minDate"/>

      </van-cell-group>
      <van-popup v-model="showPaymentPicker" position="bottom">
        <van-picker
            show-toolbar
            :columns="paymentColumns"
            @cancel="showPaymentPicker = false"
            @confirm="paymentOnConfirm"
        />
      </van-popup>

      <van-row style="margin: 30px auto">
        <van-col :span="12" style="text-align: center">
          <van-button type="info" native-type="submit">提交申请</van-button>
        </van-col>
        <van-col :span="12" style="text-align: center">
          <van-button type="primary" native-type="button" @click="onClickLeft()">取消提交</van-button>
        </van-col>
      </van-row>
    </van-form>
  </div>
</template>

<script>
import {Dialog} from "vant";
import { Toast } from 'vant';

export default {
  name: "deposit-apply",
  data() {
    return {
      titleText: '退押申请',
      item: this.$route.params.item,
      minDate: new Date(new Date().setFullYear(new Date().getFullYear()-1)),
      showPaymentPicker: false,
      showApplyCalendar: false,
      paymentColumns:[],
      paymentName: '',
      refundAmount: '',
      refundTarget: '',
      targetAccount: '',
      refundInfo: '',
      paymentId: '',
      empId: localStorage.getItem('empId'),
      applyDate: this.$dateUtils.vantDateToYMD(new Date()),
      tenantCrop: localStorage.getItem('tenantCrop'),
      applyRules: {
        refundMethod: [
          { required: true, message: '请填写退款方式' }
        ],
        refundAmount: [
          { required: true, message: '请填写退款金额' }
        ],
        refundTarget: [
          { required: true, message: '请填写退款目标账户名' }
        ],
        targetAccount: [
          { required: true, message: '请填写退款目标账户' }
        ],
        applyDate: [
          { required: true, message: '请填写申请日期' }
        ]
      }
    }
  },
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  created() {
    console.log(this.item);
    this.queryPaymentIds()
  },
  methods: {
    onClickLeft() {
      Dialog.confirm({
        title: '确认取消修改？'
      }).then(() => {
        // on confirm
        this.$router.push({
          name: 'depositDetail',
          params: {
            item: this.item
          }
        })
      }).catch(() => {
        // on cancel
        return false;
      });
    },
    queryPaymentIds() {
      this.$selectUtils.queryPaymentIds(this.$selectUtils.Picker).then(response => {
        this.paymentColumns = JSON.parse(JSON.parse(response.data.data))
        this.paymentColumns = this.paymentColumns.map(k => {
          if (k.children === null) {
            k.children = [{text: "", id: k.id}];
            return k;
          }
          return k;
        });
      })
    },
    paymentOnConfirm(value) {
      console.log(value)
      if (value[1] === "") {
        this.paymentName = value[0];
        this.paymentId = this.paymentColumns.find(k => k.text === value[0]).id;
      } else {
        this.paymentName = value[1];
        this.paymentId = this.paymentColumns.find(k => k.text === value[0]).children.find(k => k.text === value[1]).id;
      }
      this.showPaymentPicker = false;
      console.log(this.paymentId)
    },
    applyDateOnConfirm(date) {
      this.applyDate = this.$dateUtils.vantDateToYMD(date)
      this.showApplyCalendar = false;
    },
    submit() {
      this.$axios({
        method: 'POST',
        url: '/applyRefund/addApplyRefund',
        params: {
          cusId: this.item.customerId,
          proceedsId: this.item.proceedsId,
          orderId: this.item.orderId,
          refundMethod: this.paymentId,
          petitionerId: this.empId,
          refundAmount: this.refundAmount,
          refundTarget: this.refundTarget,
          targetAccount: this.targetAccount,
          refundInfo: this.refundInfo,
          createDate: this.applyDate,
          tenantCrop: this.tenantCrop
        }
      }).then(response => {
        if (response.data.code === 200) {
          Toast.success('申请退款添加成功!');
          this.$router.replace('depositList')
        } else {
          Toast.fail("添加失败!")
        }
      })
    }
  }
}
</script>

<style scoped>

</style>