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
      <van-calendar v-model="createDatePicker" :min-date="minDate" :max-date="maxDate"
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
      <van-calendar v-model="weddingDayPicker" :min-date="minDate" :max-date="maxDate"
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
      <van-field name="uploader" label="订单图片">
        <template #input>
          <van-uploader v-model="fileList" :after-read="afterRead" multiple :max-count="1"/>
        </template>
      </van-field>
      <!-- 裁剪页 -->
      <transition name="slim-fade">
        <div v-show="cropShow" class="crop-wrap">
          <SlimCropper ref="cropper" :src="inputImgUrl" :aspect-ratio="0.8"></SlimCropper>
          <div class="btn-box">
            <button type="button" class="crop-btn" @click="hideCrop">取消</button>
            <button type="button" class="crop-btn" @click="submitCrop">使用</button>
          </div>
        </div>
      </transition>
      <van-overlay :show="overlayShow"/>
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
//获取当前时间
const maxDate=new Date();
maxDate.setFullYear(maxDate.getFullYear()+3);
const minDate=new Date();
minDate.setFullYear(minDate.getFullYear()-3);
// 将 blob 对象转化为 url
const getObjectURL = (file) => {
  let url
  if (window.createObjectURL) { // basic
    url = window.createObjectURL(file)
  } else if (window.URL) { // mozilla(firefox)
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

function blobToFile(theBlob, fileName) {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  return new window.File([theBlob], fileName, {type: 'image/jpeg'})
}

export default {
  name: "order-add",
  inject: ['reload'],
  data() {
    return {
      appointVo: this.$route.query.appointVo,
      maxDate:maxDate,
      minDate:minDate,
      //对象
      orderNo: "",
      createDate: this.$dateUtils.vantDateToYMD(new Date()),
      weddingDay: "",
      orderName: "",
      orderDress: "",
      orderCosmetics: "",
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
      orderCosmeticsPicker: false,
      proceedsNamePicker: false,
      paymentPicker: false,
      payeePicker: false,

      //数据
      orderNameArray: [],
      orderDressArray: [],
      orderCosmeticsArray: [],
      proceedsNameArray: [],
      paymentArray: [],
      payeeArray: [],

      //显示文本
      orderNameText: "",
      orderDressText: "",
      orderCosmeticsText: "",
      proceedsNameText: "",
      paymentText: "",
      payeeText: "",


      //订单图片
      fileName: "",
      fileList: [],

      cropShow: false, // 裁剪弹窗显示
      inputImgUrl: '', // input 选中的图片 url
      getObjectURL,
      loading: false,
      overlayShow: false,


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
    this.queryAppointCosmetics();
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
    //化妆师确认
    orderCosmeticsOnConfirm: function (value) {
      this.orderCosmetics = value.id;
      this.orderCosmeticsText = value.text;
      this.orderCosmeticsPicker = false;
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
    addAppointSubmit: function (data) {
      data.cusId = this.appointVo.cusId;
      data.appId = this.appointVo.id;
      data.orderName = this.orderName;
      data.orderDress = this.orderDress;
      data.orderCosmetics = this.orderCosmetics;
      data.proceedsName = this.proceedsName;
      data.payment = this.payment;
      data.payee = this.payee;
      data.orderCity = this.appointVo.appointCity;
      data.tenantCrop = localStorage.getItem("tenantCrop");
      this.$dialog.confirm({
        title: '添加订单',
        message: '是否确认给 : ' + this.appointVo.name + ' 添加订单?',
      }).then(() => {
        if (this.fileList.length !== 0) {
          this.$toast.loading({
            message: '上传图片中...',
            forbidClick: true,
            duration: 3000
          })
        }
        this.uploadOrderImage().then(value => {
          if (!value) {
            this.$toast.fail("图片上传发生错误,请检查后进行上传")
            this.overlayShow = false
          } else {
            data.orderImage = this.fileName
            data.uploader = []
            this.$axios({
              method: "POST",
              url: "/order/saveOrder",
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
                console.log("取消按钮 刷新当前页面")
                this.reload()
              })
            })
          }
        })
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
//查询收款项目
    queryProceedsNameIds: function () {
      this.$selectUtils.queryProjectsIds(this.$projectsType.proceeds, this.$selectUtils.Picker).then(response => {
        this.proceedsNameArray = JSON.parse(response.data.data)
      })
    }
    ,
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
    }
    ,
//查询收款人
    queryPayeeIds: function () {
      this.$selectUtils.queryPayeeIds(this.$selectUtils.Picker).then(response => {
        this.payeeArray = JSON.parse(response.data.data)
      })
    }
    ,
    beforeClose: function (action, done) {
      if (action === 'confirm') {
        setTimeout(done, 1000);
      } else {
        done();
      }
    }
    ,
    afterRead(file) {
      console.log(file)
      this.fileName = file.file.name
      this.inputImgUrl = getObjectURL(file.file)
      this.showCrop()
      // this.fileList[0].status = "uploading"
      // this.fileList[0].message = "上传中..."
      // this.$upload.clothesImageUpload(file)
      // .then(response=>{
      //   let data = response.data
      //   if (data.code === 200){
      //     this.fileList[0].status = ""
      //   }
      // })
    }
    ,
    uploadOrderImage: function () {
      return new Promise((resolve, reject) => {
        if (this.fileList.length !== 0) {
          this.fileList[0].status = "uploading"
          this.fileList[0].message = "上传中..."
          this.$upload.orderImageUpload(this.fileList[0].file)
              .then(response => {
                let data = response.data
                if (data.code === 200) {
                  this.fileList[0].status = ""
                  this.fileName = data.data
                  resolve(true)
                } else {
                  reject(false)
                }
              })
        } else {
          resolve(true)
        }
      })
    }
    ,// 显示裁剪页
    showCrop() {
      this.cropShow = true
      console.log(this.fileList)
    }
    ,
// 隐藏裁剪页
    hideCrop: function () {
      this.cropShow = false
    }
    ,
// 裁剪页确认
    async submitCrop() {
      this.hideCrop()
      const img = await this.$refs.cropper.getCroppedBlob()
      console.log(img)
      this.fileList[0].file = blobToFile(img, this.fileName)
      console.log(this.fileList)
    }
    ,
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
