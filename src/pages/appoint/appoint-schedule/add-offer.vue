<template>
  <div>
    <van-sticky>
      <base-nav-bar title="添加报价"/>
    </van-sticky>
    <van-form @submit="addOrderOffer">
      <van-field
          label="客户名"
          v-model="cusName"
          readonly
      />
      <van-field
          v-model="offerTypeText"
          label="报价方式"
          readonly
          @click="offerTypePopup = true"
      />
      <div v-if="singleClothes">
          <van-field
              v-for="(item, index) in clothesArray" :key="item.clothesId"
              :label="item.styleType+'-'+item.styleName+'-'+item.clothesSize+'-'+item.clothesNo"
              v-model="item.clothesPrice"
              @input="singleClothesInput(item, index)"
              @blur="singleClothesBlur(item)"
              type="number"
              required
              :rules="[{ required: true }]"
              placeholder="衣服价格"
          />
      </div>
<!--      <van-divider v-if="singleClothes" :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"></van-divider>-->
      <van-field
          v-model="createDate"
          label="报价日期"
          readonly
          @click="createDateShowPicker = true"
      />
      <van-field
          v-model="originalPrice"
          label="原价"
          type="number"
          :formatter="formatter"
          format-trigger="onBlur"
          @input="priceInput"
          placeholder="请填写原价"
          :readonly="singleClothes"
          required
          :rules="[{ required: true }]"
      />
      <van-field
          v-model="orderPrice"
          label="订单价格"
          readonly
          placeholder="订单价格"
      />
      <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">请给出原价和订单总价之间的计算过程</van-divider>
      <van-row>
        <van-col span="22" offset="1">
          <van-button icon="plus" class="offer_btn" style="width: 100%" native-type="button" @click="addProcess">
            添加计算过程
          </van-button>
        </van-col>
      </van-row>
      <div class="process_div" style="margin-top: 7%">
        <van-swipe-cell v-for="(item, index) in processArray" :key="index">
          <van-cell center :border="false" :title="item.stagePrice+ ' ' + item.sign+ ' ' + item.math + ' = ' + item.mathResult" :label="item.mathDescribe" />
          <template #right>
            <van-button square type="danger" text="删除" @click="mathDelete(index)"/>
          </template>
        </van-swipe-cell>
      </div>
      <van-row style="margin-top: 5%">
        <van-col span="22" offset="1">
          <van-button type="info" style="width: 100%" :loading ="submitLoading" loading-text="添加中...">确定添加报价</van-button>
        </van-col>
      </van-row>
    </van-form>
    <van-popup v-model="offerTypePopup" round position="bottom">
      <van-picker
          title="选择报价方式"
          show-toolbar
          :columns="offerTypeArray"
          @confirm="offerTypeConfirm"
          @cancel="offerTypeCancel"
      />
    </van-popup>
    <van-calendar v-model="createDateShowPicker" :min-date="minDate" :max-date="maxDate"
                  @confirm="createDateConfirm"/>
    <van-dialog v-model="dialogShow"
                title="添加计算过程"
                show-cancel-button
                :before-close="beforeClose"
                theme="round-button">
      <van-form style="margin-top: 10px" ref="form">
        <van-field
            label="阶段价格"
            v-model="stagePrice"
            readonly
        />
        <van-field
            label="计算符号"
            v-model="sign"
            readonly
            @click="signPopup = true"
            required
            placeholder="请选择计算符号"
            :rules="[{ required: true }]"
        />
        <van-field
            label="数学算式"
            v-model="math"
            type="number"
            @input="mathInput"
            required
            :rules="[{ required: true }]"
            placeholder="请输入计算符号"
        />
        <van-field
            label="计算结果"
            v-model="mathResult"
            placeholder="计算结果"
            readonly
        />
        <van-field
            label="描述信息"
            v-model="mathDescribe"
            :rules="[{ required: true }]"
            placeholder="请输入描述信息"
            required
        />
      </van-form>
    </van-dialog>
    <van-popup v-model="signPopup" round position="bottom">
      <van-picker
          title="选择计算符号"
          show-toolbar
          :columns="singArray"
          @confirm="singConfirm"
          @cancel="singCancel"
      />
    </van-popup>
  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"
export default {
  name: "add-offer",
  components: {
    baseNavBar
  },
  created() {
    this.queryOfferClothesByAppId()
  },
  data() {
    return {
      cusName: this.$route.params.cusName,
      appId: this.$route.params.appId,
      cusId: this.$route.params.cusId,
      offerType: 0,
      offerTypeText: "套餐报价",
      offerTypeArray: [
        {text: "套餐报价", value: 0},
        {text: "单件报价", value: 1}
      ],
      offerTypePopup: false,
      createDate: this.$dateUtils.vantDateToYMD(new Date()),
      createDateShowPicker: false,
      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],
      originalPrice: "",
      dialogShow: false,
      stagePrice: null,
      sign: "",
      singArray: ['×','－',"+"],
      math: null,
      mathResult: null,
      mathDescribe: "",
      signPopup: false,
      orderPrice: "",
      processArray: [],
      singleClothes: false,
      clothesArray: [],
      submitLoading: false,
    }
  },
  // watch: {
  //   originalPrice: function () {
  //     if (this.processArray.length !== 0) {
  //     }
  //   }
  // },
  methods: {
    queryOfferClothesByAppId() {
      this.$axios({
        method: "GET",
        url: "/orderOffer/queryOfferClothesByAppId",
        params: {
          appId: this.appId
        }
      }).then(response => {
        this.clothesArray = response.data.data
        this.clothesArray.forEach(s => {
          s.clothesPrice = ""
        })
      })
    },
    offerTypeConfirm(val) {
      this.offerType = val.value
      this.offerTypeText = val.text
      if (val.value === 1) {
        this.singleClothes = true
        this.originalPrice = ""
        this.orderPrice = ""
        this.processArray = []
      } else {
        this.singleClothes = false
      }
      this.offerTypeCancel()
    },
    offerTypeCancel() {
      this.offerTypePopup = false
    },
    createDateConfirm(val) {
      this.createDate = this.$dateUtils.vantDateToYMD(val)
      this.createDateShowPicker = false
    },
    beforeClose(action, done) {
      if (action === 'confirm') {
        this.$refs.form.validate().then(() => {
          this.processArray.push({
            stagePrice: this.stagePrice,
            sign: this.sign,
            math: this.math,
            mathResult: this.mathResult,
            mathDescribe: this.mathDescribe,
          })
          this.orderPrice = this.mathResult
          done()
          this.formReset()
        }).catch(() => {
          done(false)
        })
      } else {
        this.formReset()
        done()
      }
    },
    formReset() {
      this.stagePrice = this.orderPrice
      this.sign = ""
      this.math = ""
      this.mathResult = ""
      this.mathDescribe = ""
    },
    priceInput(value) {
      this.stagePrice = value
      this.orderPrice = value
    },
    singCancel() {
      this.signPopup = false
    },
    singConfirm(val) {
      this.sign = val
      this.singCancel()
      this.mathInput()
    },
    mathInput() {
      if (this.math !== "" && this.sign !== "") {
        this.mathResult = this.calculate(this.stagePrice, this.math, this.sign)
      }
    },
    calculate(val1 ,val2 ,sign) {
      let result
      switch (sign) {
        case "+":
          result = Number(Number(val1) + Number(val2)).toFixed(2)
          break
        case "－":
          result = Number(Number(val1) - Number(val2)).toFixed(2)
          break
        case "×":
          result = Number(Number(val1) * Number(val2)).toFixed(2)
          break
      }
      return result
    },
    addProcess() {
      if (this.orderPrice === "" || this.orderPrice === undefined) {
        this.$toast.fail("请先填写原价")
        return
      }
      this.stagePrice = this.orderPrice
      this.dialogShow = true
    },
    formatter(value) {
      if (value !== "") {
        return Number(value).toFixed(2)
      } else {
        return value
      }
    },
    mathDelete(val) {
      this.deleteDataProcess(val)
      this.processArray.splice(val, 1)
    },
    deleteDataProcess(val) {
      if (val == 0 && this.processArray.length == 1) {
        this.orderPrice = this.originalPrice
        return
      }
      if (val == this.processArray.length - 1) {
        this.orderPrice = this.processArray[val - 1].mathResult
        return
      }
      let statePrice = val == 0 ? this.originalPrice : this.processArray[val - 1].mathResult
      this.$set(this.processArray, val + 1, {
        stagePrice: statePrice,
        sign: this.processArray[val + 1].sign,
        math: this.processArray[val + 1].math,
        mathResult: this.calculate(statePrice, this.processArray[val + 1].math, this.processArray[val + 1].sign),
        mathDescribe: this.processArray[val + 1].mathDescribe,
      })
      for (let i = val + 2; i < this.processArray.length; i++) {
        this.$set(this.processArray, i, {
          stagePrice: this.processArray[i - 1].mathResult,
          sign: this.processArray[i].sign,
          math: this.processArray[i].math,
          mathResult: this.calculate(this.processArray[i - 1].mathResult, this.processArray[i].math, this.processArray[i].sign),
          mathDescribe: this.processArray[i].mathDescribe,
        })
      }
      this.orderPrice = this.processArray[this.processArray.length - 1].mathResult
    },
    singleClothesInput(val, index) {
      this.$set(this.clothesArray, index, {
        ...val
      })
    },
    singleClothesBlur(val) {
      this.originalPrice = Number(this.originalPrice) + Number(val.clothesPrice)
    },
    addOrderOffer() {
      this.submitLoading = true
      this.$axios({
        method: "POST",
        url: "/orderOffer/addOrderOffer",
        data: {
          orderOffer: {
            cusId: this.cusId,
            offerType: this.offerType,
            originalPrice: this.originalPrice,
            orderPrice: this.orderPrice,
            createDate: new Date(),
            tenantCrop: localStorage.getItem("tenantCrop")
          },
          offerMaths: this.processArray,
          offerClothes: this.clothesArray,
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.$toast.success("添加报价成功")
          setTimeout(() => {
            this.$router.back()
          }, 500)
        } else {
          this.$toast.fail(response.data.msg)
        }
        this.submitLoading = false
      })
    }
  }
}
</script>

<style scoped>
/deep/ .van-dialog__header {
  padding-top: 10px;
}
/deep/ .van-swipe-cell__right > button {
  height: 100%;
}
/deep/ .process_div > .van-swipe-cell:nth-child(n + 2) {
  border-top: 1px solid #ebedf0;
}
/deep/ .van-field__label {
  width: 7.2em;
}
</style>