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
        @submit="edit()">
      <van-cell-group title="收押信息">
        <van-field
            v-model="item.depositAmount"
            name="押金数"
            label="押金数"
            placeholder="押金数"
            :rules="formRule.depositAmount"
        />
        <van-field
            readonly
            clickable
            name="picker"
            :value="item.shopName"
            label="所属店铺"
            placeholder="所属店铺"
            @click="showShopPicker = true"
        />
        <van-popup v-model="showShopPicker" position="bottom">
          <van-picker
              show-toolbar
              :columns="shopColumns"
              @cancel="showShopPicker = false"
              @confirm="shopOnConfirm"
          />
        </van-popup>
        <van-field
            readonly
            clickable
            name="picker"
            :value="item.payeeName"
            label="收款人"
            placeholder="点击选择收款人"
            @click="showDressPicker = true"
        />
        <van-popup v-model="showDressPicker" position="bottom">
          <van-picker
              show-toolbar
              :columns="dressColumns"
              @cancel="showDressPicker = false"
              @confirm="dressOnConfirm"
          />
        </van-popup>
        <van-field
            readonly
            clickable
            name="calendar"
            :value="item.proceedsDate"
            label="收押日期"
            placeholder="点击选择日期"
            @click="showCalendar = true"
        />
        <van-calendar v-model="showCalendar" @confirm="dateOnConfirm" :min-date="minDate" />
        <van-field name="uploader" label="收押图">
          <template #input>
            <van-uploader v-model="proceedsPic" max-count="1"/>
          </template>
        </van-field>
      </van-cell-group>


      <van-cell-group title="申请退押信息" v-if="item.type === 1">
        <van-field
            readonly
            clickable
            name="picker"
            :value="item.refundMethod"
            label="退款方式"
            placeholder="退款方式"
            @click="showPaymentPicker = true"
        />
        <van-popup v-model="showPaymentPicker" position="bottom">
          <van-picker
              show-toolbar
              :columns="paymentColumns"
              @cancel="showPaymentPicker = false"
              @confirm="refundMethodOnConfirm"
          />
        </van-popup>
        <van-field
            v-model="item.refundAmount"
            name="退款金额"
            label="退款金额"
            placeholder="退款金额"
            :rules="formRule.refundAmount"
        />
        <van-field
            v-model="item.refundTarget"
            name="退款目标账户名"
            label="退款目标账户名"
            placeholder="退款目标账户名"
            :rules="formRule.refundTarget"
        />
        <van-field
            v-model="item.targetAccount"
            name="退款目标账户"
            label="退款目标账户"
            placeholder="退款目标账户"
            :rules="formRule.targetAccount"
        />
        <van-field
            v-model="item.refundInfo"
            name="退款备注"
            label="退款备注"
            placeholder="退款备注"
        />
        <van-field
            readonly
            clickable
            name="calendar"
            :value="item.applyDate"
            label="申请日期"
            placeholder="点击选择日期"
            @click="showApplyCalendar = true"
        />
        <van-calendar v-model="showApplyCalendar" @confirm="applyDateOnConfirm" :min-date="minDate"/>
      </van-cell-group>


      <van-cell-group title="退押信息" v-if="item.type === 2">
        <van-field
            readonly
            clickable
            name="picker"
            :value="item.paymentName"
            label="退款方式"
            placeholder="退款方式"
            @click="showPaymentPicker = true"
        />
        <van-popup v-model="showPaymentPicker" position="bottom">
          <van-picker
              show-toolbar
              :columns="paymentColumns"
              @cancel="showPaymentPicker = false"
              @confirm="paymentOnConfirm"
          />
        </van-popup>
        <van-field
            v-model="item.refundAmount"
            name="退款金额"
            label="退款金额"
            placeholder="退款金额"
            :rules="formRule.applyRefund"
        />
        <van-field
            v-model="item.refundTarget"
            name="退款目标账户名"
            label="退款目标账户名"
            placeholder="退款目标账户名"
            :rules="formRule.refundTarget"
        />
        <van-field
            v-model="item.targetAccount"
            name="退款目标账户"
            label="退款目标账户"
            placeholder="退款目标账户"
            :rules="formRule.targetAccount"
        />
        <van-field
            readonly
            clickable
            name="calendar"
            :value="item.refundDate"
            label="退款日期"
            placeholder="点击选择日期"
            @click="showRefundCalendar = true"
        />
        <van-calendar v-model="showRefundCalendar" @confirm="refundDateOnConfirm" :min-date="minDate"/>
        <van-field name="uploader" label="退押图">
          <template #input>
            <van-uploader v-model="refundPic" max-count="1"/>
          </template>
        </van-field>
      </van-cell-group>

      <van-row style="margin: 30px auto">
        <van-col :span="12" style="text-align: center">
          <van-button type="info" native-type="submit">确认修改</van-button>
        </van-col>
        <van-col :span="12" style="text-align: center">
          <van-button type="primary" native-type="button" @click="onClickLeft()">取消修改</van-button>
        </van-col>
      </van-row>
    </van-form>
  </div>
</template>

<script>

import {Dialog} from "vant";
import { Toast } from 'vant';

export default {
  name: "deposit-edit",
  data() {
    return {
      titleText: '修改押金',
      oldData: { ...this.$route.params.item },
      item: this.$route.params.item,
      minDate: new Date(new Date().setFullYear(new Date().getFullYear()-1)),
      showDressPicker: false,
      showShopPicker: false,
      showCalendar: false,
      showPaymentPicker: false,
      showApplyCalendar: false,
      showRefundCalendar: false,
      dressColumns: [],
      shopColumns: [],
      paymentColumns: [],
      shopId: '',
      refundDate: '',
      paymentId: '',
      oldRefundPic: this.$route.params.item.refundPicture,
      oldProceedsPic: this.$route.params.item.proceedsPicture,
      refundPic: [
        {
          url: this.$route.params.item.refundPicture
        }
      ],
      proceedsPic: [
        {
          url: this.$route.params.item.proceedsPicture
        }
      ],
      formRule: {
        depositAmount: [
          { required: true, message: '请填写收押金额' },
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
        ]
      }
    }
  },
  created() {
    this.queryDressIds()
    this.queryShopIds()
    this.queryPaymentIds()
    console.log(this.item)
  },
  methods: {
    onClickLeft() {
      Dialog.confirm({
        message: '您还未保存，是否返回？',
      }).then(() => {
        this.$router.back()
      }).catch(() => {
        return false;
      });
    },
    dateOnConfirm(date) {
      this.proceedsDate = this.$dateUtils.vantDateToYMD(date)
      this.item.proceedsDate = this.proceedsDate
      this.showCalendar = false;
    },
    applyDateOnConfirm(date) {
      this.applyDate = this.$dateUtils.vantDateToYMD(date)
      this.item.applyDate = this.applyDate
      this.showApplyCalendar = false;
    },
    refundDateOnConfirm(date) {
      this.refundDate = this.$dateUtils.vantDateToYMD(date)
      this.item.refundDate = this.refundDate
      this.showRefundCalendar = false;
    },
    queryDressIds() {
      this.$selectUtils.queryDressIds(this.$selectUtils.Picker).then(response => {
        this.dressColumns = JSON.parse(response.data.data)
      })
    },
    dressOnConfirm(value) {
      this.item.payeeName = value.text
      this.item.payeeId = value.id
      this.showDressPicker = false;
    },
    queryShopIds() {
      this.$selectUtils.queryShopIds(this.$selectUtils.Picker).then(response => {
        this.shopColumns = JSON.parse(response.data.data)
      })
    },
    shopOnConfirm(value) {
      this.item.shopName = value.text
      this.item.shopId = value.id
      this.showShopPicker = false;
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
      if (value[1] === "") {
        this.item.paymentName = value[0];
        this.paymentId = this.paymentColumns.find(k => k.text === value[0]).id;
      } else {
        this.item.paymentName = value[1];
        this.paymentId = this.paymentColumns.find(k => k.text === value[0]).children.find(k => k.text === value[1]).id;
      }
      this.showPaymentPicker = false;
    },
    refundMethodOnConfirm(value) {
      if (value[1] === "") {
        this.item.refundMethod = value[0];
        this.paymentId = this.paymentColumns.find(k => k.text === value[0]).id;
      } else {
        this.item.refundMethod = value[1];
        this.paymentId = this.paymentColumns.find(k => k.text === value[0]).children.find(k => k.text === value[1]).id;
      }
      this.showPaymentPicker = false;
    },
    // 修改信息
    async edit() {
      // 表单上传对象
      const proceedsData = new FormData()
      const applyRefundData = new FormData()
      const refundData = new FormData()
      proceedsData.append("id", this.item.proceedsId)
      proceedsData.append('spareMoney', this.item.depositAmount)
      proceedsData.append('shopId', this.item.shopId)
      proceedsData.append('payee', this.item.payeeId)
      proceedsData.append('createDate', this.item.proceedsDate)
      proceedsData.append('operator', localStorage.getItem('empId'))
      proceedsData.append('tenantCrop', localStorage.getItem('tenantCrop'))

      applyRefundData.append('id', this.item.applyRefundId)
      if (this.paymentId !== '') {
        applyRefundData.append('refundMethod', this.paymentId)
      }
      applyRefundData.append('refundAmount', this.item.refundAmount)
      applyRefundData.append('refundTarget', this.item.refundTarget)
      applyRefundData.append('targetAccount', this.item.targetAccount)
      applyRefundData.append('refundInfo', this.item.refundInfo)
      applyRefundData.append('createDate', this.item.applyDate)
      applyRefundData.append('tenantCrop', localStorage.getItem('tenantCrop'))

      refundData.append('id', this.item.refundId)
      refundData.append('refundAmount', this.item.refundAmount)
      refundData.append('refundTarget', this.item.refundTarget)
      refundData.append('targetAccount', this.item.targetAccount)
      refundData.append('refundPayment', this.paymentId)
      refundData.append('createDate', this.item.refundDate)
      refundData.append('tenantCrop', localStorage.getItem('tenantCrop'))

      // 判断收押图是否修改
      if (this.proceedsPic.length === 0) {
        Dialog.alert({
          title: '未上传收押图片'
        }).then(() => {
          return false
        });
        return false;
      }
      if (!this.proceedsPic[0].url && this.proceedsPic[0].url !== this.oldProceedsPic) {
        // 收押图加入表单对象
        proceedsData.append('proceedsPicture', this.proceedsPic[0].file)
      }
      // 判断退押图是否修改
      if (this.refundPic.length === 0) {
        Dialog.alert({
          title: '未上传退押图片'
        }).then(() => {
          return false;
        });
        return false;
      }
      if (!this.refundPic[0].url && this.refundPic[0].url !== this.oldRefundPic) {
        // 修改退押图
        refundData.append('refundPicture', this.refundPic[0].file)
      }
      const toast = Toast.loading({
        duration: 0,
        message: '修改中...',
        forbidClick: true,
      });
      // 修改
      if (this.item.type === 0) {
        // 未申请
        this.editProceeds(proceedsData).then(response => {
          if (response.data.code === 200) {
            toast.clear()
            Toast.success('修改成功');
            this.$router.replace('/depositList')
          } else {
            toast.clear()
            Toast.fail(response.data.message);
          }
        }).catch(() => {
          toast.clear()
          Toast.fail("修改失败");
        })
      } else if (this.item.type === 1) {
        // 已申请
        await this.editProceeds(proceedsData)
        this.editApplyRefund(applyRefundData).then(response => {
          if (response.data.code === 200) {
            toast.clear()
            Toast.success('修改成功');
            this.$router.replace('/depositList')
          } else {
            toast.clear()
            Toast.fail(response.data.message);
          }
        }).catch(() => {
          toast.clear()
          Toast.fail("修改失败");
        })
      } else if (this.item.type === 2) {
        // 已退
        await this.editProceeds(proceedsData)
        this.editRefund(refundData).then(response => {
          if (response.data.code === 200) {
            toast.clear()
            Toast.success('修改成功');
            this.$router.replace('/depositList')
          } else {
            toast.clear()
            Toast.fail(response.data.message);
          }
        }).catch(() => {
          toast.clear()
          Toast.fail("修改失败");
        })
      } else {
        Toast.fail("未知错误");
      }
    },
    // 修改收押信息
    editProceeds(data) {
      return this.$axios({
        method: 'post',
        url: '/proceeds/editProceeds',
        data: data,
        headers: [

        ]
      })
    },
    // 修改申请退押信息
    editApplyRefund(data) {
      return this.$axios({
        method: 'post',
        url: '/applyRefund/editApplyRefund',
        data: data,
      })
    },
    // 修改退押信息
    editRefund(data) {
      return this.$axios({
        method: 'post',
        url: '/refund/editRefund',
        data: data,
      })
    }
  }
}
</script>

<style scoped>

</style>