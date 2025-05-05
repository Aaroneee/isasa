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
                  <div v-if="item[0].styleImage !== ''" @click="orderClothesImageClick(item[0])">
                    <div style="width: 40vw;height: 58vw">
                    <img style="width: 100%; height: 100%;cursor:zoom-in;border-radius: 5px"
                               :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item[0].styleImage"/>
                    </div>
                  </div>
                  <div v-else>
                    <van-image class="style-img">
                      <template v-slot:error>未上传图片</template>
                    </van-image>
                  </div>
                  <span
                      v-text="item[0].styleType+'-'+item[0].styleName+'-'+item[0].clothesSize+'-'+item[0].clothesNo"></span>
                  <van-row style="width: 40vw;">
                    <van-col :span="16">
                      <span
                          :class="{'color-red':item[0].scheduleState==='撞挡','color-blue':item[0].scheduleState==='可用'}">{{
                          '档期状态:' + item[0].scheduleState
                        }}</span>
                    </van-col>
                    <van-col :span="4">
                      <van-icon size="15" @click="deleteSchedule(item[0])" name="delete-o"/>
                    </van-col>
                    <van-col :span="4">
                      <van-icon size="15" @click="refreshClothesSchedule(item[0])" name="replay"/>
                    </van-col>
                  </van-row>
                  <span>{{ item[0].scheduleDate }}</span>

                </van-grid-item>

                <van-grid-item v-if="item[1] != null">
                  <div v-if="item[1].styleImage !== ''" @click="orderClothesImageClick(item[1])">
                    <div style="width: 40vw;height: 58vw">
                    <img style="width: 100%; height: 100%;cursor:zoom-in;border-radius: 5px"
                         :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item[1].styleImage"/>
                    </div>
                  </div>
                  <div v-else>
                    <van-image class="style-img">
                      <template v-slot:error>未上传图片</template>
                    </van-image>
                  </div>
                  <span
                      v-text="item[1].styleType+'-'+item[1].styleName+'-'+item[1].clothesSize+'-'+item[1].clothesNo"></span>
                  <van-row style="width: 40vw;">
                    <van-col :span="16">
                      <span
                          :class="{'color-red':item[1].scheduleState==='撞挡','color-blue':item[1].scheduleState==='可用'}">{{
                          '档期状态:' + item[1].scheduleState
                        }}</span>
                    </van-col>
                    <van-col :span="4">
                      <van-icon style="" size="15" @click="deleteSchedule(item[1])" name="delete-o"/>
                    </van-col>
                    <van-col :span="4">
                      <van-icon style="" size="15" @click="refreshClothesSchedule(item[1])"   name="replay"/>
                    </van-col>
                  </van-row>
                  <span>{{ item[1].scheduleDate }}</span>
                </van-grid-item>
              </van-grid>
            </van-cell>
          </van-cell-group>
        </van-tab>
        <van-tab title="试纱记录" style="font-size: 12px">
          <van-empty v-if="yarnClothesList.length == 0" description="暂无试纱记录"/>
          <div>
            <van-cell style="font-size: 12px">
              <div v-for="(group, key) in yarnClothesList" :key="key">
                <van-cell :title="key + '的试纱记录'" center :border="false"
                          style="padding-top: 0; padding-bottom: 0;text-align: center;font-size: 16px"></van-cell>
              <van-row gutter="5">
                <van-grid :column-num="2" :border="false">
                  <van-grid-item v-for="item in group" :key="item.id">
                    <van-image :src="item.styleImage==='' ? 'null' : item.styleImage" @click="clickItem2(item)"
                              alt="主图显示失败,请重新设置主图" radius="10px" height="58vw" width="40vw"/>
                    <span>{{ item.styleType+'-'+item.styleName+'-'+item.clothesSize+'-'+item.clothesNo }}</span>
                    <span>{{ item.empName === '' ? '暂无' : item.empName}}</span>
                  </van-grid-item>
                </van-grid>
              </van-row>
              </div>
            </van-cell>
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
        <van-tab title="款式报价">
          <van-empty v-if="orderOfferArray.length === 0" description="暂无款式报价"/>
          <div v-else>
            <van-cell style="font-size: 13px" v-for="item in orderOfferArray" :key="item.orderOffer.id">
              <van-row v-if="item.orderDetail != ''" style="color: red">
                已匹配到订单：{{item.orderDetail}}
              </van-row>
              <van-row>
                <van-col span="12">报价日期：{{item.orderOffer.createDate}}</van-col>
                <van-col span="12" class="right">{{item.orderOffer.offerType === 0 ? "套餐报价" : "单件报价"}}</van-col>
              </van-row>
              <van-row>
                <van-col span="12">原价：{{item.orderOffer.originalPrice}}</van-col>
                <van-col span="12" class="right">最终价格：{{item.orderOffer.orderPrice}}</van-col>
              </van-row>
              <van-steps direction="vertical" :active="item.mathList.length + 1" active-color="#969799">
                <van-step v-for="math in item.mathList" :key="math.id">
                  <h5>{{math.stagePrice+ ' ' + math.sign+ ' ' + math.math + ' = ' + math.mathResult}}</h5>
                  <p>{{math.mathDescribe}}</p>
                </van-step>
              </van-steps>
              <!--                <div style="margin-top: 7px;margin-bottom: 7px">-->
              <!--                  <van-row v-for="math in item.mathList" :key="math.id" style="margin-bottom: 3px">-->
              <!--                    <van-col span="24">计算公式：{{math.stagePrice+ ' ' + math.sign+ ' ' + math.math + ' = ' + math.mathResult}}</van-col>-->
              <!--                    <van-col span="24">描述：{{math.mathDescribe}}</van-col>-->
              <!--                  </van-row>-->
              <!--                </div>-->
              <van-row type="flex" justify="end" v-if="item.orderDetail == ''">
                <van-button  type="info" size="mini" round @click="matchOffer(item)">匹配报价</van-button>
              </van-row>
            </van-cell>
          </div>
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
      <van-action-sheet cancel-text="取消"
          v-model="orderClothesImage.orderClothesImageShow" :actions="orderClothesImage.orderClothesImageActions"
                        @select="orderClothesImageSelect" />
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
      orderOfferArray: [],
      //订单婚纱图片点击
      orderClothesImage:{
        orderClothesImageShow:false,
        orderClothesImageActions:[{ name: '查看大图',index:0 }, { name: '查看档期',index:1 }, { name: '添加造型',index:2 }],
        clothesScheduleVO:{},
      }
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
    this.queryOrderOffer()
  },
  methods: {
    queryOrderOffer() {
      this.$axios({
        method: "GET",
        url: "/orderOffer/queryOrderOfferByCusId",
        params: {
          cusId: this.cusId,
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.orderOfferArray = response.data.data
        }
      })
    },
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
      this.clothesScheduleList = []
      this.$axios({
        method: 'GET',
        params: {
          orderId: this.id,
        },
        url: '/schedule/clothesAndScheduleByOrderId',
      }).then(response => {
        if (response.data.code === 200) {
          this.clothesScheduleList.push(...arrTrans(2, response.data.data))
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
    //刷新档期
    refreshClothesSchedule(value){
      this.$dialog.confirm({
        title: '刷新档期',
        message: '是否刷新该礼服档期?(会重新计算是否撞档)',
      }).then(() => {
        this.$axios({
          method: 'POST',
          url: '/schedule/refreshClothesSchedule',
          data: {
            clothesId: value.clothesId,
          },
        }).then(response => {
          if (response.data.code == 200){
            this.reload()
          }else {
            this.$toast.fail(response.data.msg)
          }
        })
      })
    },
    queryYarnClothesList() {
      this.$axios({
        method: "get",
        url: '/clothesYarn/queryYarnClothesListByCusIdAndTenantCrop',
        params: {
          cusId: this.cusId,
          tenantCrop: this.tenantCrop
        }
      }).then(response => {
        if (response.data.data != "") {
          response.data.data.forEach(s => s['flag'] = false)
        }
        const groupedData = this.groupDataByYarnCreateDate(response.data.data);
        for (let key in groupedData) {
          groupedData[key] = this.sortDataByYarnCreateDate(groupedData[key]);
        }
        console.log(groupedData)
        this.yarnClothesList = groupedData
      })
    },
    sortDataByYarnCreateDate: function (arr) {
      return arr.sort((a, b) => new Date(b.yarnCreateDate) - new Date(a.yarnCreateDate));
    },
    groupDataByYarnCreateDate: function (arr) {
      return arr.reduce((result, current) => {
        const date = current.yarnCreateDate;
        if (!result[date]) {
          result[date] = [];
        }
        result[date].push(current);
        return result;
      }, {});
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
    clickItem2: function (value) {
      ImagePreview([value.styleImage])
    },
    queryWeddingDayByOrderId() {
      this.weddingDayArray = []
      this.$axios({
        method: "get",
        url: "/weddingDate/queryWeddingDayByCusId",
        params: {
          cusId: this.cusId
        }
      }).then(response => {
        this.weddingDayArray.push(...response.data.data)
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
      this.$dialog.confirm({
        title: '删除婚期',
        message: '确定删除该婚期?',
      })
          .then(() => {
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
          })
    },
    weddingDayUpdateOnConfirm(val) {
      this.$dialog.confirm({
        title: '修改婚期',
        message: '如果婚期下有档期则同步修改档期,是否确定修改?',
      })
          .then(() => {
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
                this.queryCusSchedules()
                this.queryOrderVo()
                setTimeout(()=> {
                  this.editWeddingDayShow = false
                }, 500)
              }
              if (!flag) {
                this.$toast.fail(response.data.msg)
              }
            })
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
    },
    matchOffer(val) {
      if (val.orderOffer.orderPrice != this.orderVo.orderPrice) {
        this.$toast.fail("该报价最终价格与订单总价不一致，无法匹配")
        return
      }
      this.$axios({
        method: "post",
        url: "/orderOffer/matchOrderOffer",
        data: {
          id: val.orderOffer.id,
          orderId: this.orderVo.id
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.$toast.success("报价匹配成功")
          this.queryOrderOffer()
        } else {
          this.$toast.fail(response.data.msg);
        }
      })
    },
    //已定婚纱图片点击
    orderClothesImageClick(item){
      console.log(item)
      this.orderClothesImage.clothesScheduleVO.clothesId=item.clothesId;
      this.orderClothesImage.clothesScheduleVO.styleImage=item.styleImage;
      this.orderVo.pushClothesId = item.clothesId
      this.orderVo.pushClothesName = item.styleType+'-'+item.styleName+'-'+item.clothesSize+'-'+item.clothesNo
      this.orderClothesImage.orderClothesImageShow=true;
    },
    //已定婚纱图片点击后选择框
    orderClothesImageSelect(data){
      this.orderClothesImage.orderClothesImageShow=false;
      console.log(data)
      if (data.index===0){
        ImagePreview([`https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/${this.orderClothesImage.clothesScheduleVO.styleImage}`])
        return;
      }
      if (data.index === 1 ){
        this.$router.push({name:"clothesSchedule",query:this.orderClothesImage.clothesScheduleVO})

      }
      if (data.index === 2 ){
        if (this.orderVo.cosmetics === ""){
          this.$dialog.confirm({
            message: "当前订单尚未选择化妆师,去选择化妆师",
          }).then(() => {
            this.$router.push({name: "orderEdit", query: this.orderVo})
          }, () => {
          })
        }else {
          this.$router.push({name: "makeupOrderClothes", query: this.orderVo})
        }
      }
    },
  },
  watch: {
    editFlag: function (value) {
      if (value) {
        this.$router.push({name: "orderEdit", query: this.orderVo})
      }
    }
  }

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
/deep/ .van-step__title h5 {
  margin: 0;
}
/deep/ .van-step__title p {
  margin: 0;
}
/deep/ .van-steps--vertical {
  padding: 0 0 0 20px
}
</style>
