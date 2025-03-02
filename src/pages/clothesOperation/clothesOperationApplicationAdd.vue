<template>
  <div>
    <van-sticky>
      <baseNavBar title="添加调货申请"/>
      <van-row style="display: flex;align-items: center;background-color: white" :offset="20">
        <van-col span="15">
          <van-search v-model="styleName" placeholder="请输入礼服型号 如 0001 0002"></van-search>
        </van-col>
        <van-col span="4">
          <van-button round type="info" size="small" @click="queryClothesList">搜索婚纱</van-button>
        </van-col>
        <van-col span="4">
          <van-button round type="primary" size="small" @click="batchClothesShow=true" native-type="submit">已选婚纱
          </van-button>
        </van-col>
      </van-row>
    </van-sticky>
    <div>
      <van-list>
        <van-cell style="font-size: 12px" v-for="item in clothesList" :key="item.id">
          <van-row style="display: flex;align-items: center">
            <van-col :span="22">
              <van-row>
                <van-col span="15">
                  婚纱编号:{{ `${item.styleType}-${item.styleName}-${item.clothesSize}-${item.clothesNo}` }}
                </van-col>
              </van-row>
              <van-row>
                <van-col span="15">店铺：{{ item.shopName }}</van-col>
              </van-row>
              <van-row>
                <van-col span="15">位置：{{ item.positionName }}</van-col>
              </van-row>
            </van-col>
            <van-col :span="2">
              <van-checkbox v-model="item.clothesCheck" @click="addBatchClothesList(item)"/>

              <!--                            <van-button block type="default" size="small" native-type="submit"-->
              <!--                                        @click="addBatchClothesList(item)">添加</van-button>-->
            </van-col>
          </van-row>
        </van-cell>
      </van-list>
    </div>
    <van-popup v-model="batchClothesShow" position="bottom" :style="{ height: '70%' , width: '100%' }">
      <div>
        <van-list style="height: 55vh;overflow-y: auto">
          <van-cell style="font-size: 12px" v-for="item in batchClothesList" :key="item.id">
            <van-row style="display: flex;align-items: center">
              <van-col :span="22">
                <van-row>
                  <van-col span="15">
                    婚纱编号:{{ `${item.styleType}-${item.styleName}-${item.clothesSize}-${item.clothesNo}` }}
                  </van-col>
                </van-row>
                <van-row>
                  <van-col span="15">店铺：{{ item.shopName }}</van-col>
                </van-row>
                <van-row>
                  <van-col span="15">位置：{{ item.positionName }}</van-col>
                </van-row>
              </van-col>
              <van-col :span="2">
                <van-button block type="default" size="small" native-type="submit"
                            @click="delBatchClothesList(item)">移出
                </van-button>
              </van-col>
            </van-row>
          </van-cell>
        </van-list>
      </div>
      <van-button v-show="batchClothesList.length>0" block type="info" size="small"
                  style="position: absolute;bottom:10px"
                  @click="clothesButton()">填写调货
      </van-button>
    </van-popup>
    <van-popup v-model="showForm" position="bottom" :style="{ height: '80%' , width: '100%' }">
      <van-row>
        <van-col :span="12" v-for="item in batchClothesList" style="margin-top: 2px" :key="item.id">
          <!--                        <div style="text-align: center;border: solid 1px #00a2d4;">-->
          <!--                            {{item.clothesId}}-->
          <!--                        </div>-->
          <div class="clothesNamesClass">
            {{ `${item.styleType}-${item.styleName}-${item.clothesSize}-${item.clothesNo}` }}
            <!--                            <p style="text-align: center;margin-block-start: 0;margin-block-end: 0;border: solid 1px #00a2d4;">{{item.clothesId}}</p>-->
          </div>

        </van-col>
      </van-row>
      <van-form @submit="onSubmit">
        <van-field
            disabled="disabled"
            v-model="operationTitle"
            name="operationTitle"
            label="行为"
            placeholder="行为"
        ></van-field>
        <van-field
            disabled="disabled"
            v-model="empName"
            name="empName"
            label="申请人"
            placeholder="申请人"
        ></van-field>
        <van-field
            readonly
            clickable
            name="clothesShopText"
            :value="clothesShopText"
            label="收件店铺"
            placeholder="点击选择收件店铺"
            @click="shopShowPicker = true"
            :rules="[{ required: true, message: '请选择收件店铺' }]"
        ></van-field>
        <van-popup v-model="shopShowPicker" position="bottom">
          <van-picker
              show-toolbar
              :columns="shopColumnsArray"
              @confirm="shopOnConfirm"
              @cancel="shopShowPicker = false"
          ></van-picker>
        </van-popup>
        <van-field
            name="applicationShopText"
            :value="applicationShopText"
            label="申请店铺"
            placeholder="点击选择申请店铺"
            @click="applicationShopPicker  = true"
            :rules="[{ required: true, message: '请选申请件店铺' }]"
        ></van-field>
        <van-popup v-model="applicationShopPicker" position="bottom">
          <van-picker
              show-toolbar
              :columns="applyShopArray"
              @confirm="applicationOnConfirm"
              @cancel="applicationShopPicker  = false"
          ></van-picker>
        </van-popup>
        <van-field
            readonly
            clickable
            v-model="purpose"
            name="purpose"
            label="调货目的"
            placeholder="调货目的"
            @click="transferPurposeFormPicker = true"
            :rules="[{ required: true, message: '请选择调货目的' }]"
        ></van-field>
        <van-popup v-model="transferPurposeFormPicker" position="bottom">
          <van-picker
              show-toolbar
              :columns="transferPurposeList"
              @confirm="transferPurposeChange"
              @cancel="transferPurposeFormPicker = false"
          />
        </van-popup>
        <van-field
            readonly
            clickable
            v-model="dateAmong"
            name="dateAmong"
            label="周期"
            placeholder="周期"
            @click="showDay = true"
            :rules="[{ required: true, message: '请选择调货周期' }]"
        ></van-field>
        <van-field
            v-model="expressNumber"
            name="expressNumber"
            label="快递单号"
            placeholder="快递单号"
        ></van-field>
        <van-field
            v-model="remark"
            name="remark"
            label="调货描述"
            placeholder="调货描述"
        ></van-field>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </van-popup>
    <van-calendar v-model="showDay" type="range" :min-date="minDate" :max-date="maxDate"
                  @confirm="dateAmongConfirm"/>
  </div>
</template>

<script>
import BaseNavBar from "@/components/nav-bar/base-nav-bar";

export default {
  name: "clothesOperationApplicationAdd",
  data() {
    return {
      styleName: "",

      //选中的列表ID
      batchClothesIdList: [],
      //选中的列表
      batchClothesList: [],
      //婚纱列表
      clothesList: [],

      //选中列表状态
      batchClothesShow: false,

      operationTitle: '调货',
      empName: "",

      clothesShop: "",
      clothesShopText: "",
      applicationShopText:"",
      shopColumnsArray: [],
      applyShopArray: [],
      shopShowPicker: false,
      applicationShopPicker : false,

      showForm: false,

      purpose: '',

      transferPurposeTitle: '选择调货目的',
      transferPurposeFormPicker: false,
      applicationShopId:"",
      transferPurposeList: [
        // {text: '售前预约锁定款式', value: '售前预约锁定款式'},
        // {text: '售后预约锁定款式', value: '售后预约锁定款式'},
        {text: '归还', value: '归还'},
        {text: '分店清货', value: '分店清货'},],

      isFastMsgShow: false,

      dateAmong: '',
      remark: '',
      expressNumber: '',
      showDay: false,

      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2026, 0, 1),

      tenantCrop: localStorage.getItem("tenantCrop"),
      myShopIds: localStorage.getItem("shopIds"),
    }
  },
  components: {BaseNavBar},
  created() {
    this.queryEmpName();
    this.queryShopIds();
    this.$selectUtils.applyShopIdsIsValid(this.$selectUtils.Picker).then(response => {
      this.applyShopArray = JSON.parse(response.data.data)
      this.applicationShopId=this.applyShopArray[0].id
      this.applicationShopText = this.applyShopArray[0].text
    })
  },
  methods: {
    queryClothesList: function () {
      this.clothesList = []
      if (this.styleName === '') {
        this.$toast('请输入婚纱编号');
        return
      }

      this.$axios({
        method: "get",
        url: '/clothes/mClothesList',
        params: {
          page: 1,
          limit: 100,
          styleName: this.styleName,
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.clothesList.push(...response.data.data.list)
        } else {
          this.$toast.fail(response.data.msg);
        }
      })
    },
    //添加婚纱
    addBatchClothesList(item) {
      if (item.clothesCheck) {
        this.batchClothesList.push(item);
        this.batchClothesIdList.push(item.id);
        this.$toast.success("已添加");
      } else {
        let indexO = this.batchClothesIdList.indexOf(item.id);
        if (indexO === -1) {
          this.$toast.success("移出失败,请刷新重试");

        } else {
          this.batchClothesList.splice(indexO, 1);
          this.batchClothesIdList.splice(indexO, 1);
          this.$toast.success("已移出");
        }
      }
    },
    // //删除已选婚纱
    delBatchClothesList(item){
      let indexO=this.batchClothesIdList.indexOf(item.id);
      this.batchClothesList.splice(indexO,1);
      this.batchClothesIdList.splice(indexO,1);

      this.clothesList.forEach(k=>{
        if(k.id===item.id){
          k.clothesCheck=false;
        }
      })
      this.$toast.success("已移出");
    },
    onSubmit() {
      if (this.dateAmong === "") {
        this.$toast.fail("调货周期不能为空");
        return;
      }
      if (this.clothesShop === "") {
        this.$toast.fail("目标店铺不能为空");
        return;
      }
      if (this.purpose == "") {
        this.$toast.fail("调货目的不能为空")
        return
      }
      if (this.applicationShopId == "") {
        this.$toast.fail("申请店铺不能为空")
        return
      }
      if (this.remark == "") {
        this.$toast.fail("调货描述不能为空")
        return
      }
      this.batchClothesList.forEach(s => {
        s.applicationEmpId = this.empId
        s.applicationDate = new Date()
      })

      let nowDate = new Date();
      let applicationData = [];

      this.batchClothesList.forEach(s => {
        applicationData.push({
          clothesId: s.clothesId,
          shopId: s.shopId,
          positionId: s.positionId,
          targetShopId: this.clothesShop,
          applicationEmpId: localStorage.getItem("empId"),
          applicationDate: nowDate,
          purpose: this.purpose,
          expressNumber: this.expressNumber,
          dateStart: this.dateAmong.split(' - ')[0],
          dateEnd: this.dateAmong.split(' - ')[0],
          remark: this.remark,
          tenantCrop: this.tenantCrop,
          applicationShopId: this.applicationShopId,
        })
      })

      this.$axios({
        method: 'post',
        url: "/clothesOperationApplication/batchAddClothesOperationApplicationOrPassExamination",
        data: applicationData
      }).then(response => {
        if (response.data.code === 200) {
          this.$toast.success("提交申请成功！")
          this.batchClothesList = []
        } else {
          this.$toast.fail(response.data.msg)
        }
        this.showForm = false
        this.queryClothesList()
      })
    },

    queryEmpName() {
      this.$axios({
        method: "get",
        url: "/emp/queryEmpById",
        params: {
          empId: localStorage.getItem("empId")
        }
      }).then(response => {
        this.empName = response.data.data.empName
      })
    },
    queryShopIds() {
      this.$selectUtils.queryShopIdsIsValid(this.$selectUtils.Picker).then(response => {
        let shopArray = JSON.parse(response.data.data);
        this.shopColumnsArray = shopArray;

        let localShopIds = this.myShopIds.split(",")
        let shopId = localShopIds.includes("59") ? 59 : Number(localShopIds[0]);
        let choose = shopArray.filter(k => {
          return k.id === shopId;
        })
        this.clothesShop = choose[0].id;
        this.clothesShopText = choose[0].text;
      })
    },
    shopOnConfirm: function (value) {
      this.clothesShopText = value.text
      this.clothesShop = value.id
      this.shopShowPicker = false
    },
    applicationOnConfirm: function (value) {
      this.applicationShopText = value.text
      this.applicationShopId = value.id
      this.applicationShopPicker = false
    },
    transferPurposeChange(value) {
      this.purpose = this.transferPurposeTitle = value instanceof Object ? value.value : value;
      this.transferPurposeFormPicker = false;
    },
    //点击调货选择衣服
    clothesButton(item) {
      this.batchClothesShow = false;
      this.showForm = true
    },
    getDay(val) {
      let year = val.getFullYear();
      let month = this.$dateUtils.dateIsSingle(val.getMonth() + 1);
      let day = this.$dateUtils.dateIsSingle(val.getDate());
      return year + "-" + month + "-" + day;
    },
    //日期选择
    dateAmongConfirm(date) {
      const [start, end] = date;
      this.showDay = false;
      var startDay = this.getDay(start)
      var endDay = this.getDay(end)
      this.dateAmong = startDay + " - " + endDay
      this.dateButtonStr = this.dateAmong
      this.dateStr = this.dateAmong
    },
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

.clothesNamesClass {
  /*width: 200px; !* 设置您想要的宽度 *!*/
  /*height: 100px; !* 设置您想要的高度 *!*/
  background-color: #fff; /* 设置背景颜色 */
  /*border: 2px solid #000; !* 添加边框 *!*/
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1); /* 添加阴影效果 */
  padding: 5px; /* 添加内边距以使内容与边框和阴影保持距离 */
  text-align: center; /* 居中内容 */
  /*font-size: 18px;*/
  line-height: 1.5;
  margin: 1px 10px;
}
</style>
