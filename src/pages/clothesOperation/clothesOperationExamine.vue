<template>
  <div>

    <van-sticky>
      <baseNavBar title="调货审核"/>

      <div>
        <van-dropdown-menu>
          <van-dropdown-item v-model="shopId" :options="shopIdList"
                             @change="shopIdChange"></van-dropdown-item>
          <van-dropdown-item v-model="operation" :options="operationList"
                             @change="operationChange"></van-dropdown-item>
          <van-dropdown-item v-model="targetShopId" :options="targetShopIdList"
                             @change="targetShopIdChange"></van-dropdown-item>
        </van-dropdown-menu>
      </div>

      <van-row style="display: flex;align-items: center;background-color: white" :offset="20">
        <van-col span="15">
          <van-search v-model="styleName" placeholder="请输入礼服型号 如 0001 0002"></van-search>
        </van-col>
        <van-col span="4">
          <van-button round type="info" size="small" @click="searchForClothes">搜索婚纱</van-button>
        </van-col>
      </van-row>
    </van-sticky>

    <div>
    <van-list>
      <van-cell style="font-size: 12px" v-for="item in operationApplicationTable" :key="item.id">
        <div>
          <van-row>
            <van-col span="12">申请人:{{ item.applicationEmpName }}</van-col>
            <van-col span="12" style="color: red;font-size: 18px">状态:{{ item.state }}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">目的:{{ item.purpose }}</van-col>
            <van-col span="12">申请时间:{{item.applicationDate.substr(0, 10)}}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">发出店铺:{{ item.shopName }}</van-col>
            <van-col span="12">收件店铺:{{item.targetShopName}}</van-col>
          </van-row>
          <van-row>
          </van-row>
          <van-row v-if="item.sendDate != null">
            <van-col span="24">寄出时间:{{ item.sendDate }}</van-col>
          </van-row>
          <van-row v-if="item.dateStart!=null && item.dateEnd!=null">
            <van-col span="24">使用日期:{{ item.dateStart + ' - ' + item.dateEnd}}
            </van-col>
          </van-row>
          <van-row>
            <van-col span="24">婚纱:{{ item.clothesName }}</van-col>
          </van-row>
          <van-row type="flex" justify="space-between">
            <van-col span="8" style="text-align: center">
              <van-button type="primary" size="small" @click="showClothesImage(item)">图片
              </van-button>
            </van-col>
            <van-col span="8" style="text-align: center">
              <van-button type="info" size="small" @click="accept(item)">通过</van-button>
            </van-col>
            <van-col span="8" style="text-align: center">
<!--              <van-button type="danger" size="small" @click="refuse(item)">拒绝</van-button>-->
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
              v-model="mergeClothesName"
              name="mergeClothesName"
              label="婚纱编号"
              placeholder="婚纱编号"></van-field>
          <van-field
              v-model="rejectRemark"
              name="content"
              label="拒绝原因"
              placeholder="拒绝原因"
              :rules="[{ required: true }]"
          ></van-field>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </van-popup>
    </div>
  </div>
</template>

<script>
import BaseNavBar from "@/components/nav-bar/base-nav-bar";
import {STATE} from "@/constant/ClothesOperationConst.js"

export default {
  name: "clothesOperationExamine",
  data() {
    return {
      ClothesOperationState:new STATE(),

      titleStr: '请选择调货档期',

      shopIdList:[
        {text: '发出店铺', value: ''}
      ],
      operationList:[
        {text: '调货目的', value: ''}
      ],
      operation:"",
      shopId:"",
      targetShopIdList:[
        {text: '目标店铺', value: ''}
      ],
      targetShopId:"",
      mergeClothesName:"",
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
          this.operation = data[0].value;
        }
      })
    },

    getOperationTextByValue(value) {
      const operation = this.operationList.find(option => option.value === value);
      return operation ? operation.text : '';
    },

    operationChange(value) {
      this.operation = value
      this.page = 1
      this.operationApplicationTable = []
      this.queryClothesOperationApplicationList()
    },
    shopIdChange(value) {
      this.shopId = value
      this.page = 1
      this.operationApplicationTable = []
      this.queryClothesOperationApplicationList()
    },
    targetShopIdChange(value) {
      this.targetShopId = value
      this.page = 1
      this.operationApplicationTable = []
      this.queryClothesOperationApplicationList()
    },

    queryClothesOperationApplicationList() {
      this.loading = true
      let purposeText = this.getOperationTextByValue(this.operation);
      if (purposeText === "调货目的"){
        purposeText = null;
      }
      this.$axios({
        method: "get",
        url: "/clothesOperationApplication/queryClothesOperationApplicationList",
        params: {
          page: this.page,
          limit: this.limit,
          state:this.ClothesOperationState.StateConst.COMMITTED_UN_REVIEWED,
          tenantCrop:this.tenantCrop,
          shopId: this.shopId,
          targetShopId: this.targetShopId,
          purpose: purposeText,
          styleName : this.styleName,
          clothesName: this.clothesId,
        }
      }).then(response => {
        this.operationApplicationTable=response.data.data.list
      })
    },

    searchForClothes(){
      this.queryClothesOperationApplicationList()
    },
    //通过
    accept(item) {
      this.$dialog.confirm({
        message: '是否审核通过 ' + item.clothesName + ' 自 ' + item.shopName + ' 到 ' + item.targetShopName + ' 的调货',
      }).then(() => {
        this.$axios({
          method: 'PUT',
          url: "/clothesOperationApplication/passExamination",
          params: {
            id: item.id,
            state:"已提交未审核",
            tenantCrop:this.tenantCrop,
            reviewerId: localStorage.getItem("empId")
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("审核完成待执行寄出！")
            this.queryClothesOperationApplicationList()
          } else {
            this.$toast.fail(response.data.msg)
          }
        })
      }).catch(() => {
        this.$toast.fail("取消操作");
      });
    },

    refuse(item) {
      this.mergeClothesName = item.clothesName
      this.showForm = true
      this.operationApplicationId = item.id
    },

    onSubmit() {
      this.$dialog.confirm({
        message: '确定要拒绝吗？',
      }).then(() => {
        this.$axios({
          method: 'delete',
          data: {
            id: this.operationApplicationId,
            state:"已提交未审核",
            rejectRemark:this.rejectRemark,
            tenantCrop:this.tenantCrop,
            reviewerId: localStorage.getItem("empId")
          },
         url: "/clothesOperationApplication/refuse",
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("拒绝成功！")
            this.showForm = false
            this.queryClothesOperationApplicationList()
          } else {
            this.$toast.fail(response.data.msg)
          }
        })
      }).catch(() => {
        this.$toast.fail("取消操作");
      });
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
