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
      <van-field input-align="right" label="客户名" :value="item.customerName" readonly/>
      <van-field input-align="right" label="订单编号" :value="item.orderNo" readonly/>
      <van-field input-align="right" label="退押状态"
                 :value="item.type === 0 ? '未申请' : item.type === 1 ? '已申请' : '已退'" readonly/>
    </van-cell-group>
    <van-cell-group v-if="type ==  0" title="收押信息">
      <van-field input-align="right" label="收款人" :value="item.payeeName" readonly/>
      <van-field input-align="right" label="押金数" :value="item.depositAmount" readonly/>
      <van-field input-align="right" label="所属店铺" :value="item.shopName" readonly/>
      <van-field input-align="right" label="收押日期" :value="item.proceedsDate" readonly/>
      <van-field input-align="right" label="收押图片" readonly @click="showProceedsPicture">
        <template #input>
          <van-image
              width="200"
              height="200"
              fit="contain"
              :src="item.proceedsPicture"
              alt="未上传收押图"
              v-if="item.proceedsPicture"
          />
          <span v-else>未设置收押图</span>
        </template>
      </van-field>
    </van-cell-group>

    <van-cell-group v-if="type ==  1 || type== 2" title="收押信息">
      <!--      <van-cell v-for="it in items" :key="it.id">-->
      <!--        <van-field input-align="right" label="收押日期" :value="it.proceedsDate" readonly/>-->
      <!--        <van-field input-align="right" label="收押金额" :value="it.depositAmount" readonly/>-->
      <!--        <van-field input-align="right" label="收款人" :value="it.payeeName" readonly/>-->
      <!--        <van-field input-align="right" label="所属店铺" :value="it.shopName" readonly/>-->
      <!--      </van-cell>-->

      <van-collapse v-model="activeNames" v-for="it in items" :key="it.id">
        <van-collapse-item :key="it.id">
          <template #title>
            <van-field input-align="right" label="收押日期" :value="it.proceedsDate" readonly/>
            <van-field input-align="right" label="收押金额" :value="it.depositAmount" readonly/>
          </template>
          <van-field input-align="right" label="实际到账" :value="it.receivedAmount" readonly/>
          <van-field input-align="right" label="收款人" :value="it.payeeName" readonly/>
          <van-field input-align="right" label="收款方式" :value="it.paymentName" readonly/>
          <van-field input-align="right" label="所属店铺" :value="it.shopName" readonly/>
        </van-collapse-item>
      </van-collapse>

      <van-cell>
        <van-field input-align="right" label="收押图片" readonly @click="showProceedsPicture">
          <template #input>
            <van-image
                width="200"
                height="200"
                fit="contain"
                :src="item.proceedsPicture"
                alt="未上传收押图"
                v-if="item.proceedsPicture"
            />
            <span v-else>未设置收押图</span>
          </template>
        </van-field>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="申请退押信息" v-if="item.type === 1">
      <van-field input-align="right" label="退款方式" :value="item.refundMethod" readonly/>
      <van-field input-align="right" label="退款金额" :value="item.refundAmount" readonly/>
      <van-field input-align="right" label="退款目标账户名" :value="item.refundTarget" readonly/>
      <van-field input-align="right" label="退款目标账户" :value="item.targetAccount" readonly/>
      <van-field input-align="right" label="退款备注" :value="item.refundInfo === '' ? '无' : item.refundInfo"
                 readonly/>
      <van-field input-align="right" label="申请日期" :value="item.applyDate" readonly/>
    </van-cell-group>
    <van-cell-group title="退押信息" v-if="item.type === 2">
      <van-field input-align="right" label="退款方式" :value="item.refundPayment" readonly/>
      <van-field input-align="right" label="退款金额" :value="item.refundAmount" readonly/>
      <van-field input-align="right" label="退款目标账户名" :value="item.refundTarget" readonly/>
      <van-field input-align="right" label="退款目标账户" :value="item.targetAccount" readonly/>
      <van-field input-align="right" label="退款备注" :value="item.refundInfo === '' ? '无' : item.refundInfo"
                 readonly/>
      <van-field input-align="right" label="退押日期" :value="item.createDate" readonly v-if="item.type"/>
      <van-field input-align="right" label="退押图片" readonly @click="showRefundPicture">
        <template #input>
          <van-image
              width="10rem"
              height="10rem"
              fit="contain"
              :src="item.refundPicture"
              v-if="item.refundPicture"
              alt="未上传退押图"
          />
          <span v-else>未设置退押图</span>
        </template>
      </van-field>
    </van-cell-group>
    <van-row style="margin: 30px auto">
      <van-col :span="item.type ===2 ? 24 : 12" style="text-align: center">
        <van-button type="info" @click="clickEditItem()">修改信息</van-button>
      </van-col>
      <van-col :span="12" style="text-align: center">
        <van-button type="primary" @click="clickApplyItem()" v-if="item.type === 0">申请退押</van-button>
      </van-col>
      <van-col :span="12" style="text-align: center">
        <van-button type="primary" @click="confirmRefund()" v-if="item.type === 1">确认退押</van-button>
      </van-col>
    </van-row>

  </div>
</template>

<script>
import {Dialog, ImagePreview} from 'vant';

export default {
  name: "deposit-detail",
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  data() {
    return {
      titleText: '押金详情',
      item: {},
      items: [],
      proceedsId: this.$route.params.id,
      type: this.$route.params.type,
      orderId: this.$route.params.orderId,
      proceedsPicture: [],
      refundPicture: '',
      tenantCrop: localStorage.getItem('tenantCrop'),
      fileList: [],
      activeNames: ['1']
    }
  },
  created() {
    console.log(this.type)
    this.queryDepositItemDetail()
    this.showDepositCollectionPictures(this.proceedsId)
    this.queryDepositItemDetails()
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
    clickApplyItem() {
      this.$router.push({
        name: 'depositApply',
        params: {
          item: this.item
        }
      })
    },
    clickEditItem() {
      this.$router.push({
        name: 'depositEdit',
        params: {
          item: this.item
        }
      })
    },
    showProceedsPicture() {
      ImagePreview(this.proceedsPicture);
    },
    showRefundPicture() {
      ImagePreview([this.item.refundPicture]);
    },
    showDepositCollectionPictures(proceedsId) {
      if (proceedsId === '' || proceedsId === undefined) {
        return false
      }
      this.$axios({
        method: "GET",
        url: "/shopReports/queryDepositCollectionPictures",
        params: {
          tenantCrop: this.tenantCrop,
          proceedsId: proceedsId
        }
      }).then(response => {
        if (response.data.data.length === 0) {
          return false
        }

        if (this.tenantCrop === "2a31c23a-c178-441614928053489") {
          let items =
              response.data.data.map(item => {
                return item.replace("https://deposit-image-1304365928.cos.ap-shanghai.myqcloud.com/", "https://www.ivorybai.com:443/order/")
              })
          this.item.proceedsPicture = items[0]
          console.log(items)
          this.proceedsPicture.push(...items)
        } else {
          this.item.proceedsPicture = response.data.data[0]
          this.proceedsPicture.push(...response.data.data)
        }
      })
    },
    showDepositBackPictures(refundId) {
      if (refundId === '' || refundId === undefined) {
        return false
      }
      this.$axios({
        method: "GET",
        url: "/shopReports/queryDepositBackPictures",
        params: {
          tenantCrop: this.tenantCrop,
          refundId: refundId
        }
      }).then(response => {
        if (response.data.data.length === 0) {
          return false
        }
        if (this.tenantCrop === "2a31c23a-c178-441614928053489") {
          let items =
              response.data.data.map(item => {
                return item.replace("https://deposit-image-1304365928.cos.ap-shanghai.myqcloud.com/", "https://www.ivorybai.com:443/order/")
              })
          this.item.proceedsPicture = items[0]
        } else {
          this.item.refundPicture = response.data.data[0]
        }
      })
    },
    // 确定退押
    confirmRefund() {
      this.$router.push({
        name: 'depositConfirm',
        params: {
          item: this.item
        }
      })
    },
    // 查询单条押金记录
    queryDepositItemDetail() {
      this.$axios({
        method: 'GET',
        url: '/proceeds/getItemDetail',
        params: {
          type: this.type,
          proceedsId: this.proceedsId
        }
      }).then(response => {
        this.item = response.data.data
      })
    },
    // 查询单条押金记录
    queryDepositItemDetails() {
      this.$axios({
        method: 'GET',
        url: '/proceeds/getItemDetails',
        params: {
          orderId: this.orderId,
          tenantCrop: this.tenantCrop
        }
      }).then(response => {
        this.items = response.data.data
      })
    },
  }
}
</script>

<style scoped>

</style>