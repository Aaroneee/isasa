<template>
  <div>

    <van-sticky>
      <baseNavBar title="调货执行"/>

      <div>
        <van-dropdown-menu>
          <van-dropdown-item v-model="operation" :options="operationList"
                             @change="operationChange"></van-dropdown-item>
          <van-dropdown-item v-model="targetShopId" :options="targetShopIdList"
                             @change="targetShopIdChange"></van-dropdown-item>
          <van-dropdown-item v-model="operationState" :options="operationStates"
                             @change="operationStateChange"></van-dropdown-item>
        </van-dropdown-menu>
      </div>
    </van-sticky>

    <div>
      <van-list>
        <van-cell style="font-size: 12px" v-for="item in operationApplicationTable" :key="item.id">
          <div>
            <van-row>
              <van-col span="12">申请时间:{{item.applicationDate.substr(0, 10)}}</van-col>
              <van-col v-if="item.state === '已寄出'" span="12" style="color: blue;font-size: 18px">状态:{{ item.state }}</van-col>
              <van-col v-else span="12" style="color: red;font-size: 18px">状态:{{ item.state }}</van-col>
            </van-row>
            <van-row>
              <van-col  span="12">婚纱编号:{{ item.clothesName }}</van-col>
              <van-col v-if="item.sender != null" span="12">寄出人:{{ item.senderName }}</van-col>
            </van-row>
            <van-row>
              <van-col span="12">行为:{{item.operationName}}</van-col>
              <van-col span="12">目的:{{ item.purpose }}</van-col>
            </van-row>
            <van-row>
              <van-col span="12">发出店铺:{{ item.shopName }}</van-col>
              <van-col span="12">收件店铺:{{item.targetShopName}}</van-col>
            </van-row>
            <van-row>
              <van-col span="12">申请人:{{ item.applicationEmpName }}</van-col>
              <van-col span="12">审核人:{{ item.reviewerName }}</van-col>
            </van-row>
            <van-row>
            </van-row>
            <van-row v-if="item.dateStart!=null && item.dateEnd!=null">
              <van-col span="24">使用日期:{{ item.dateStart + '-' + item.dateEnd}}</van-col>
            </van-row>
            <van-row>
              <van-col span="24">备注:{{ item.remark }}</van-col>
            </van-row>
            <van-row type="flex" justify="space-between">
              <van-col span="12" style="text-align: center">
                <van-button round size="small"  type="primary" @click="showClothesImage(item)">图片
                </van-button>
              </van-col>
              <van-col span="12" style="text-align: center">
                <van-button round  v-if="item.state !== '已寄出'" type="info"  size="small" @click="listClick(item)">寄出</van-button>
              </van-col>
            </van-row>
          </div>

        </van-cell>
      </van-list>
    </div>

    <div>
      <van-popup v-model="showImage">
        <van-col span="24" style="text-align: center">{{ clothesAllName }}</van-col>
        <van-image
            width="300"
            height="400"
            :src=clothesImage
        />
      </van-popup>
    </div>

    <div>
      <van-popup v-model="showForm" position="bottom" :style="{ height: '30%' , width: '100%'}">
        <van-form @submit="onSubmit">
          <van-field
              :disabled=true
              v-model="clothesName"
              name="clothesName"
              label="婚纱编号"
              placeholder="快递单号"></van-field>
          <van-field
              v-model="expressNumber"
              name="expressNumber"
              label="快递单号"
              placeholder="快递单号"
          ></van-field>
<!--          <van-field name="uploader" label="自行运输须上传图片">-->
<!--            <template #input>-->
<!--              <van-uploader v-model="fileList" :after-read="afterRead" multiple :max-count="1"/>-->
<!--            </template>-->
<!--          </van-field>-->
          <van-row>
            <van-col span="24">
              <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">提交</van-button>
              </div>
            </van-col>
          </van-row>
        </van-form>
      </van-popup>
    </div>
  </div>
</template>

<script>
import BaseNavBar from "@/components/nav-bar/base-nav-bar";
import {STATE} from "@/constant/ClothesOperationConst.js"

export default {
  name: "clothesOperationConfirm",
  data() {
    return {
      ClothesOperationState:new STATE(),

      titleStr: '请选择调货档期',

      shopIdList:[
        {text: '发出店铺', value: ''}
      ],
      operationList:[
        {text: '请选择调货目的', value: ''}
      ],
      operation:"",
      shopId:"",
      targetShopIdList:[
        {text: '收件店铺', value: ''}
      ],
      operationStates: [{text: '未完成', value: '19'},
        {text: '已完成', value: '20'}],
      operationState: '19',
      targetShopId:"",
      fileList: [],
      expressNumber: '',
      clothesImage:"",
      clothesAllName:"",
      styleName:"",
      showImage: false,
      clothesName:"",
      showForm: false,
      operationApplicationId:"",
      rejectRemark:"",
      operationApplicationTable:[],

      tenantCrop: localStorage.getItem("tenantCrop"),
      myShopIds: localStorage.getItem("shopIds"),
    }
  },
  components: {BaseNavBar},
  created() {
    this.queryShopIds();
    this.queryClothesOperationApplicationList();
    this.queryClothesOperations();
  },
  methods: {
    queryShopIds() {
      this.$selectUtils.queryShopIdsIsValid(this.$selectUtils.DropDownMenu).then(response => {
        this.shopIdList.push(...JSON.parse(response.data.data))
        this.targetShopIdList.push(...JSON.parse(response.data.data))
      })
    },

    queryClothesOperations: function () {
      this.$selectUtils.queryOperationIds(this.$selectUtils.DropDownMenu).then(response => {
        const data= JSON.parse(response.data.data)
        if (data.length > 0) {
          this.operationList.push(...data);
          this.operationText = data[0].text;
          this.operationId = data[0].id;
        }
      })
    },
    afterRead(file) {
      console.log(file);
      console.log(this.fileList)
    },

    operationChange(value) {
      this.operation = value
      this.queryClothesOperationApplicationList()
    },

    operationStateChange(value) {
      this.operationState = value
      this.queryClothesOperationApplicationList()
    },
    targetShopIdChange(value) {
      this.targetShopId = value
      this.page = 1
      this.operationApplicationTable = []
      this.queryClothesOperationApplicationList()
    },

    listClick(item) {
      this.clothesName = item.clothesName
      this.operationApplicationId = item.id
      if (this.operationState === '19') {
        this.showForm = true
      }
    },

    onSubmit(values) {
      if (values.expressNumber === '') {
        this.$toast.fail("请填写快递单号")
        return false
      }
        this.$axios({
          method: "delete",
          url: '/clothesOperationApplication/send',
          data: {
            id: this.operationApplicationId,
            expressNumber:this.expressNumber,
            tenantCrop:this.tenantCrop,
            reviewerId: localStorage.getItem("empId")
          },
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("寄出成功")
          } else {
            this.$toast.success("寄出失败")
          }
          this.showForm = false
          this.queryClothesOperationApplicationList()
        })
    },

    selfTransport() {
      if (this.fileList.length === 0) {
        this.$toast.success("请上传自行运输婚纱图片")
        return false
      }
      this.uploadSendImage().then(sendImage => {
        if (sendImage === '') {
          this.$toast.success("请等待婚纱上传完成")
          return false
        }
        this.$axios({
          method: "put",
          url: 'clothesOperationApplication/send',
          data: {
            id: this.operationApplicationId,
            tenantCrop:this.tenantCrop,
            reviewerId: localStorage.getItem("empId"),
            expressNumber: "自行运输",
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("寄出成功")
          } else {
            this.$toast.success("寄出失败")
          }
          this.showForm = false
          this.queryClothesOperationApplicationList()
        })
      })
    },
    async uploadSendImage() {
      let sendImage
      const file = this.fileList[0].file
      let formData = new FormData()
      formData.append('file', file)
      await this.$axios({
        url: 'https://www.ivorybai.com:8080/upload/uploadImage/send',
        method: 'POST',
        transformRequest: [function (data, headers) {
          // 去除post请求默认的Content-Type
          delete headers.post['Content-Type']
          return data
        }],
        data: formData
      }).then(response => {
        sendImage = response.data.result
      })
      return sendImage
    },

    getOperationTextByValue(value) {
      const operation = this.operationList.find(option => option.value === value);
      return operation ? operation.text : '';
    },

    queryClothesOperationApplicationList() {
      this.loading = true
      let state = '';

      if (this.operationState === '19') {
        state = '已审核未寄出';
      } else if (this.operationState === '20') {
        state = '已寄出';
      }
      let purposeText = this.getOperationTextByValue(this.operation);
      if (purposeText === "请选择调货目的"){
        purposeText = null;
      }
      this.$axios({
        method: "get",
        url: "/clothesOperationApplication/queryClothesOperationApplicationList",
        params: {
          page: this.page,
          limit: this.limit,
          state: state,
          tenantCrop:this.tenantCrop,
          targetShopId: this.targetShopId,
          purpose: purposeText
        }
      }).then(response => {
        this.operationApplicationTable=response.data.data.list
        console.log(this.operationApplicationTable)
      })
    },

    showClothesImage(item) {
      this.clothesImage = ''
      this.clothesAllName = item.clothesName
      this.clothesImage = 'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/' + item.clothesImage + '?imageMogr2/rquality/30'
      this.showImage = true
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setKeepAlive', [])
    next()
  },
}

</script>

<style scoped>
/deep/ .van-field__label {
  width: 12.2em !important;
  text-align: center;
}

.van_table_show {
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', miui, 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
  font-size: 14px;
  color: #646566;
}

.test {
  height: 24px;
  line-height: 24px;
  padding: 10px 16px;
  position: relative;
}

.test::after {
  position: absolute;
  box-sizing: border-box;
  content: ' ';
  pointer-events: none;
  right: 16px;
  bottom: 0;
  left: 16px;
  border-bottom: 1px solid #ebedf0;
  -webkit-transform: scaleY(.5);
  transform: scaleY(.5);
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
