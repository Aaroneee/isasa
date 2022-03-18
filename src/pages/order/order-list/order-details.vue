<template>
  <div style="background-color: white">
    <van-sticky>
      <switchNavBar title="订单详情" switchText="编辑" @flag="editFlag=!editFlag"/>
      <van-cell style="font-size: 12px">
        <van-row>
          <van-col span="16">姓名:{{ orderVo.name }} 手机号:{{ orderVo.phone }}</van-col>
          <van-col span="8">下单日:{{ orderVo.createDate }}</van-col>
        </van-row>
        <van-row>
          <van-col span="16">订单编号:{{ orderVo.orderNo }}</van-col>
          <van-col span="8">婚期:{{ orderVo.weddingDay }}</van-col>
        </van-row>
        <van-row>
          <van-col span="16">订单项目:{{ orderVo.orderName }}</van-col>
          <van-col span="8">客服:{{ orderVo.service }}</van-col>
        </van-row>
        <van-row>
          <van-col span="8">礼服师:{{ orderVo.dress }}</van-col>
          <van-col span="8">辅销:{{ orderVo.auxiliary }}</van-col>
          <van-col span="8">化妆师:{{ orderVo.cosmetics }}</van-col>
        </van-row>
        <van-row>
          <van-col span="8">订单总价:{{ orderVo.orderPrice }}</van-col>
          <van-col span="8">已付金额:{{ orderVo.spareMoney }}</van-col>
          <van-col span="8">余款:{{ orderVo.orderSpare }}</van-col>
        </van-row>
        <van-row>
          <van-col span="24">备注:{{ orderVo.orderRemark }}</van-col>
        </van-row>
      </van-cell>
    </van-sticky>
    <van-row>
      <van-tabs color="#fdd640" swipeable animated>
        <van-tab title="已定婚纱">
          <van-empty v-if="clothesScheduleList.length == 0" description="暂未选定婚纱"/>
          <van-cell-group>
            <van-cell style="font-size: 12px" v-for="item in clothesScheduleList" :key="item.id">
              <van-grid :border="false" :column-num="2" :gutter="1">
                <van-grid-item v-if="item[0] != null">
                  <div v-if="item[0].styleImage !== ''">
                    <van-image class="style-img" radius="7"
                               :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item[0].styleImage">
                    </van-image>
                  </div>
                  <div v-else>
                    <van-image class="style-img">
                      <template v-slot:error>未上传图片</template>
                    </van-image>
                  </div>
                  <span
                      v-text="item[0].styleType+'-'+item[0].styleName+'-'+item[0].clothesSize+'-'+item[0].clothesNo"></span>
                  <van-row>
                   <span
                       :class="{'color-red':item[0].scheduleState==='撞挡','color-blue':item[0].scheduleState==='可用'}">{{
                       '档期状态:' + item[0].scheduleState
                     }}</span>
                    <van-icon style="margin-left: 30px" size="15" @click="deleteSchedule(item[0])" name="delete-o"/>
                  </van-row>

                  <span>{{ item[0].scheduleDate }}</span>

                </van-grid-item>

                <van-grid-item v-if="item[1] != null">
                  <div v-if="item[1].styleImage !== ''">
                    <van-image class="style-img" radius="7"
                               :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item[1].styleImage">
                    </van-image>
                  </div>
                  <div v-else>
                    <van-image class="style-img">
                      <template v-slot:error>未上传图片</template>
                    </van-image>
                  </div>
                  <span
                      v-text="item[1].styleType+'-'+item[1].styleName+'-'+item[1].clothesSize+'-'+item[1].clothesNo"></span>
                  <van-row>
                   <span
                       :class="{'color-red':item[1].scheduleState==='撞挡','color-blue':item[1].scheduleState==='可用'}">{{
                       '档期状态:' + item[1].scheduleState
                     }}</span>
                    <van-icon style="margin-left: 30px" size="15" @click="deleteSchedule(item[1])" name="delete-o"/>
                  </van-row>
                  <span>{{ item[1].scheduleDate }}</span>
                </van-grid-item>
              </van-grid>
            </van-cell>
          </van-cell-group>
        </van-tab>
        <van-tab title="试纱记录">
          <van-empty v-if="yarnClothesList.length == 0" description="暂无试纱记录"/>
          <div v-else>
            <van-grid :border="false" :column-num="2" :gutter="1" style="font-size: 12px;">
              <van-grid-item v-for="item in yarnClothesList" :key="item.id" >
                <div v-if="item.styleImage !== ''">
                  <van-image class="style-img" radius="7" @click="clickItem(item)"
                             :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.styleImage">
                  </van-image>
                </div>
                <div v-else>
                  <van-image class="style-img">
                    <template v-slot:error>未上传图片</template>
                  </van-image>
                </div>
                <van-row justify="space-between" style="width: 100%;margin-top: 5px">
                  <van-col span="13">
                    <span v-text="item.styleType+'-'+item.styleName+'-'+item.clothesSize+'-'+item.clothesNo"></span>
                  </van-col>
                  <van-col span="11" style="text-align: right;color: #fdd640">
                    <span @click="addClothesSchedule(item)">
                     添加婚纱档期
                    </span>
                  </van-col>
                </van-row>
              </van-grid-item>
            </van-grid>
          </div>
        </van-tab>
        <van-tab title="所有订单">
          <van-empty v-if="orderList.length === 0" description="暂无订单记录"/>
          <div v-else>
            <van-cell style="font-size: 12px" v-for="item in orderList" :key="item.appId">
              <van-row>
                <van-col span="12">订单号：{{item.orderNo}}</van-col>
                <van-col span="12" class="right">订单日期：{{item.createDate}}</van-col>
              </van-row>
              <van-row>
                <van-col span="15">订单项目：{{item.orderName}}</van-col>
                <van-col span="8" class="right">收款进度：{{item.orderState}}</van-col>
              </van-row>
              <van-row>
                <van-col span="8">订单总价：{{item.orderPrice}}</van-col>
                <van-col span="8" class="right">收款金额：{{item.spareMoney}}</van-col>
                <van-col span="8" class="right">余额：{{item.orderSpare}}</van-col>
              </van-row>
              <van-row>
                <van-col span="24">备注：{{item.orderRemark}}</van-col>
              </van-row>
            </van-cell>
          </div>
        </van-tab>
        <van-tab title="精确婚期">
          <van-cell v-for="item in weddingDayArray" :key="item.id">
            <template #title>
              {{item.weddingDay}}
            </template>
            <template #right-icon>
              <van-button size="mini" type="primary" @click="weddingDayEdit(item)">编辑</van-button>
              <van-button size="mini" type="danger" @click="weddingDayRemove(item.id)">删除</van-button>
            </template>
          </van-cell>
          <van-row style="margin-top: 5vh;margin-bottom: 2vh">
            <van-col span="20" :offset="2">
              <van-button style="width: 100%" icon="plus" @click="addWeddingDay" round color="linear-gradient(to right, #ff6034, #ee0a24)">
                添加婚期
              </van-button>
            </van-col>
          </van-row>
<!--          <van-swipe-cell v-for="item in weddingDayArray" :keu="item.id">-->
<!--            <van-cell :border="false" :value="item.weddingDay"/>-->
<!--            <template #right>-->
<!--              <van-button square type="primary" text="编辑" />-->
<!--              <van-button square type="danger" text="删除" />-->
<!--            </template>-->
<!--          </van-swipe-cell>-->
        </van-tab>
      </van-tabs>
      <van-calendar :default-date="new Date()"
                    :min-date="minDate" :max-date="maxDate"
                    v-model="weddingDayChooseShow"
                    confirm-disabled-text="请选择婚期"
                    confirm-text="确认添加"
                    @confirm="weddingDayChooseOnConfirm"/>
      <van-calendar :default-date="weddingDay"
                    :min-date="editMinDate" :max-date="editMaxDate"
                    v-model="editWeddingDayShow"
                    confirm-disabled-text="请选择婚期"
                    confirm-text="确认修改"
                    @confirm="weddingDayUpdateOnConfirm"/>

      <van-dialog v-model="dialogShow"
                  title="添加婚纱档期"
                  show-cancel-button
                  :before-close="beforeClose"
                  theme="round-button">
       <van-form ref="form" style="margin-top: 10px">
         <van-field
             label="婚纱编号"
             name="clothesNo"
             v-model="clothesNo"
             readonly
             required
             :rules="[{ required: true }]"
         />
         <van-field
             label="精确婚期"
             v-model="weddingDayText"
             placeholder="请选择婚期"
             readonly
             name="weddingDay"
             @click="weddingDaySelectShowPicker = true"
             required
             :rules="[{ required: true }]"
         />
         <van-field
             label="使用档期"
             v-model="dateAmong"
             placeholder="请选择档期"
             readonly
             required
             @click="dateSectionShow = true"
             :rules="[{ required: true }]"
         />
       </van-form>
      </van-dialog>
      <van-popup v-model="weddingDaySelectShowPicker" round position="bottom">
        <van-picker
            title="选择婚期"
            show-toolbar
            :columns="weddingDayPickerArray"
            @confirm="weddingDayConfirm"
            @cancel="weddingDayCancel"
        />
      </van-popup>
      <van-calendar ref="dateRef" safe-area-inset-bottom v-model="dateSectionShow" allow-same-day
                    :min-date="limitMinDate" :max-date="limitMaxDate" :default-date="chooseDate" type="range"
                    @confirm="dateSectionConfirm"/>
    </van-row>
  </div>
</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar"
import {ImagePreview} from "vant";
export default {
  name: "order-details",
  inject: ['reload'],
  components: {
    switchNavBar
  },
  data() {
    return {
      editFlag: false,


      id: this.$route.query.id,
      cusId: this.$route.query.cusId,
      appId: this.$route.query.appId,
      mobileViewId: this.$route.query.mobileViewId,
      orderVo: {},
      tenantCrop: localStorage.getItem("tenantCrop"),
      clothesScheduleList: [],
      isHide: "",
      yarnClothesList: [],
      orderList: [],
      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],
      weddingDayArray: [],
      weddingDayChooseShow: false,
      editMaxDate:this.$dateUtils.getMaxMinDate()[0],
      editMinDate:this.$dateUtils.getMaxMinDate()[1],
      editWeddingDayShow: false,
      weddingDay: null,
      editWeddingDay: {},
      dialogShow: false,
      clothesNo: "",
      weddingDayText: "",
      clothesId: null,
      weddingDayId: null,
      dateAmong: "",
      rule: null,
      limitMinDate: this.$dateUtils.getMaxMinDate()[0],
      limitMaxDate: this.$dateUtils.getMaxMinDate()[1],
      chooseDate: [],
      weddingDaySelectShowPicker: false,
      dateSectionShow: false,
      weddingDayPickerArray: [],
    }
  },
  created() {
    this.$selectUtils.queryPhoneIsHide(this.mobileViewId).then(response => {
      this.isHide = response.data.data
    })
    this.queryOrderVo();
    this.queryCusSchedules(this.cusId)
    this.queryYarnClothesList()
    this.queryOrderListByAppId()
    this.queryWeddingDayByOrderId()
  },
  methods: {
    queryOrderVo: function () {
      this.$axios({
        method: "GET",
        url: "/order/queryOrderVoById",
        params: {
          id: this.id,
        }
      }).then(response => {
        this.orderVo = response.data.data;
        if (this.isHide === 1) {
          this.orderVo.phone = this.$stringUtils.phoneIsHide(this.orderVo.phone);
        }
      })
    },
    queryCusSchedules: function () {
      this.$axios({
        method: 'GET',
        params: {
          orderId: this.id,
        },
        url: '/schedule/clothesAndScheduleByOrderId',
      }).then(response => {
        if (response.data.code === 200) {
          this.clothesScheduleList = arrTrans(2, response.data.data)
        }
      })
    },
    deleteSchedule: function (value) {
      this.$dialog.confirm({
        title: '移除档期',
        message: '是否确认移除该婚纱礼服?',
      }).then(() => {
        this.$axios({
          method: 'delete',
          params: {
            clothesId: value.clothesId,
            orderId: this.id,
            weddingDayId: value.weddingDayId
          },
          url: '/schedule/removeClothesSchedule',
        }).then(response => {
          var code = response.data.code;
          if (code == 200) {
            this.$toast.success("移除档期成功")
            this.reload()
          } else {
            this.$toast.fail(response.data.msg)
          }
        })
      })
    },
    queryYarnClothesList() {
      this.$axios({
        method: "get",
        url: '/clothesYarn/queryYarnClothesList',
        params: {
          appId: this.appId
        }
      }).then(response => {
        if (response.data.data != "") {
          response.data.data.forEach(s => s['flag'] = false)
        }
        this.yarnClothesList = response.data.data
      })
    },
    queryOrderListByAppId() {
      this.$axios({
        method: "get",
        url: "/order/queryOrderListByCusId",
        params: {
          cusId: this.cusId
        }
      }).then(response => {
        this.orderList = response.data.data
      })
    },
    clickItem: function (value) {
      ImagePreview(['\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+value.styleImage])
    },
    async queryWeddingDayByOrderId() {
      this.weddingDayArray = []
      this.weddingDayPickerArray = []
      this.$axios({
        method: "get",
        url: "/weddingDate/queryWeddingDayByCusId",
        params: {
          cusId: this.cusId
        }
      }).then(response => {
        this.weddingDayArray.push(...response.data.data)
        response.data.data.forEach(s => {
          this.weddingDayPickerArray.push({text: s.weddingDay, value: s.id})
        })
        this.$axios({
          method:"get",
          url:"schedule/queryScheduleRule",
          params:{
            tenantCrop:this.tenantCrop
          }
        }).then(response => {
          this.rule = response.data.data.rule
          if (this.weddingDayArray.length == 1) {
            this.weddingDayText = this.weddingDayArray[0].weddingDay
            this.weddingDayId = this.weddingDayArray[0].id
            this.defaultSchedule()
          } else {
            this.weddingDayText = ""
            this.weddingDayId = null
          }
        })
      })
    },
    weddingDayChooseOnConfirm(val) {
      this.$axios.post('/weddingDate/addWeddingDay', {
        weddingDay: this.$dateUtils.vantDateToYMD(val),
        createDate: new Date(),
        orderId: this.id,
        cusId: this.cusId
      }).then(response => {
        let flag = response.data.code === 200
        if (flag) {
          this.$toast.success("添加成功")
          setTimeout(() => {
            this.weddingDayChooseShow = false
          }, 500)
          this.queryWeddingDayByOrderId()
        }
        if (!flag) {
          this.$toast.fail(response.data.msg)
        }
      })
    },
    addWeddingDay() {
      this.weddingDayChooseShow = true
    },
    weddingDayEdit(val) {
      this.editWeddingDay = val
      this.weddingDay = this.$dateUtils.convertDateFromString(val.weddingDay)
      this.editWeddingDayShow = true
    },
    weddingDayRemove(val) {
      this.$axios({
        method: "delete",
        url: "/weddingDate/removeWeddingDayById",
        params: {
          id: val
        }
      }).then(response => {
        let flag = response.data.code === 200
        if (flag) {
          this.$toast.success("删除成功")
          this.queryWeddingDayByOrderId()
        }
        if (!flag) {
          this.$toast.fail(response.data.msg)
        }
      })
    },
    weddingDayUpdateOnConfirm(val) {
      this.$axios({
        method: "post",
        url: "/weddingDate/updateWeddingDayById",
        data: {
          id: this.editWeddingDay.id,
          weddingDay: this.$dateUtils.vantDateToYMD(val),
          createDate: new Date(),
        }
      }).then(response => {
        let flag = response.data.code === 200
        if (flag) {
          this.$toast.success("修改成功！")
          this.queryWeddingDayByOrderId()
          this.queryOrderVo()
          setTimeout(()=> {
            this.editWeddingDayShow = false
          }, 500)
        }
        if (!flag) {
          this.$toast.fail(response.data.msg)
        }
      })
    },
    addClothesSchedule(item) {
      this.dialogShow = true
      this.clothesNo = item.styleType+'-'+item.styleName+'-'+item.clothesSize+'-'+item.clothesNo
      this.clothesId = item.clothesId
    },
    addSchedule() {

    },
    beforeClose(action, done) {
      if (action === 'confirm') {
        this.$refs.form.validate().then(val => {
          this.$axios({
            method: "post",
            url: "/schedule/addSchedule",
            params: {
              clothesId: this.clothesId,
              orderId: this.id,
              cusId: this.cusId,
              tenantCrop: localStorage.getItem("tenantCrop"),
              weddingDayId: this.weddingDayId,
              dateAmong: this.dateAmong
            }
          }).then(response => {
            if (response.data.code === 200) {
              this.$toast.success("添加档期成功")
              done()
              this.queryCusSchedules()
            } else {
              this.$toast.fail(response.data.msg);
              done(false)
            }
          })
        }).catch(() =>{
          done(false)
        })
      } else {
        this.$refs.form.resetValidation()
        done();
      }
    },
    defaultSchedule() {
      this.dateAmong = get_before_date(this.weddingDayText, this.rule, 0)
      const dateArray = this.$dateUtils.getAroundDate(this.weddingDayText,this.rule)
      this.limitMinDate = dateArray[0]
      this.limitMaxDate = dateArray[1]
      this.chooseDate = this.$dateUtils.dateSectionStrToDateArray(this.dateAmong)
    },
    dateSectionConfirm(value) {
      this.dateAmong = this.$dateUtils.rangeVantDateToYMD(value)
      this.dateSectionShow = false
    },
    weddingDayConfirm(val) {
      this.weddingDayText = val.text
      this.weddingDayId = val.value
      this.defaultSchedule()
      this.weddingDayCancel()
    },
    weddingDayCancel() {
      this.weddingDaySelectShowPicker = false
    }
  },
  watch: {
    editFlag: function (value) {
      if (value) {
        this.$router.push({name: "orderEdit", query: this.orderVo})
      }
    }
  }

}
function get_before_date(date, day, after) {
  let date1 = new Date(date);
  let time1 = date1.getFullYear() + "-" + (dateIsSingle(date1.getMonth() + 1)) + "-" + dateIsSingle(date1.getDate());//time1表示当前时间
  let date2 = new Date(date);
  date2.setDate(date1.getDate() - day);
  let time2 = date2.getFullYear() + "-" + (dateIsSingle(date2.getMonth() + 1)) + "-" + dateIsSingle(date2.getDate());
  let date3 = new Date(date);
  date3.setDate(date3.getDate() + (day + after));
  let time3 = date3.getFullYear() + "-" + (dateIsSingle(date3.getMonth() + 1)) + "-" + dateIsSingle(date3.getDate());
  return time2 + ' - ' + time3;
}
function dateIsSingle(date) {
  return date < 9 ? "0" + date : date;
}

function arrTrans(num, arr) {
  const iconsArr = [];
  arr.forEach((item, index) => {
    const page = Math.floor(index / num);
    if (!iconsArr[page]) {
      iconsArr[page] = [];
    }
    iconsArr[page].push(item);
  });
  return iconsArr;
}
</script>

<style scoped>
.color-red {
  color: red;
}

.color-blue {
  color: blue;
}
.right{
  text-align: right;
}
/deep/ .van-dialog__header {
  padding-top: 10px;
}
</style>
