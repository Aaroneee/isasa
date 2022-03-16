<template>
  <div style="background-color: white"  v-cloak>
      <baseNavBar title="预约详情" :fixed="true"/>
<!--      <switchNavBar title="预约详情" switchText="操作" @flag="popupShow = true"/>-->
    <div>
        <van-cell style="font-size: 13px">
          <van-row style="font-size: 15px">
            <van-col span="12">{{appointVo.name}}</van-col>
            <van-col span="12" style="color: coral;" class="right">{{appointVo.appStateName}}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">手机号：{{appointVo.phone}}</van-col>
            <van-col span="12" class="right">微信号：{{appointVo.weChat}}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">预约店铺：{{appointVo.appointShop}}</van-col>
            <van-col span="12" class="right">预约人：{{appointVo.inviter}}</van-col>
          </van-row>
          <van-row>
            <van-col span="12">到店日期：{{appointVo.appointDate}}</van-col>
            <van-col span="12" class="right">到店时间：{{appointVo.appointTime}}</van-col>
          </van-row>
          <van-row>
            <van-col span="8">礼服师：{{appointVo.appointDress}}</van-col>
            <van-col span="8" style="text-align: center">化妆师：{{appointVo.appointCosmetics}}</van-col>
            <van-col span="8" class="right">分配房间：{{appointVo.room}}</van-col>
          </van-row>
          <van-row>
            <van-col>备注：{{appointVo.appointRemark}}</van-col>
          </van-row>
        </van-cell>
        <van-tabs color="#fdd640" swipeable animated>
          <van-tab title="已定婚纱" v-if="afterSaleFlag">
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
              <van-grid :border="false" :column-num="2" :gutter="1" style="font-size: 14px;">
                <van-grid-item v-for="item in yarnClothesList" :key="item.id" >
                  <div v-if="item.styleImage !== ''">
                    <van-image class="style-img" radius="7" @click="clickItem(item)"
                               style="height: 218px;width: 151px;margin-top: 10px"
                               :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.styleImage">
                    </van-image>
                  </div>
                  <div v-else>
                    <van-image class="style-img">
                      <template v-slot:error>未上传图片</template>
                    </van-image>
                  </div>
                  <span v-text="item.styleType+'-'+item.styleName+'-'+item.clothesSize+'-'+item.clothesNo"></span>
                  <van-row>
                    <van-popover
                        @select="onSelect"
                        theme="dark"
                        v-model="item.flag"
                        trigger="click"
                        :actions="actions"
                        placement="top"
                    >
                      <template #reference>
                        <van-col style="color: #42aef6;" @click="chooseItem = item">更多操作</van-col>
                      </template>
                    </van-popover>
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
        </van-tabs>
    </div>
    <van-popup
        v-model="popupShow"
        closeable
        round
        close-icon-position="bottom-left"
        position="bottom"
        :style="{ height: '20%' }"
    >
      <van-row style="padding-top: 30px">
        <per-button @click="openAppEdit" type="warning" :span="6" per="app_details:app_edit">预约编辑</per-button>
<!--        <per-button @click="openArrival" type="info" :span="6" per="app_details:arrival">预约到店</per-button>-->
        <per-button @click="openOrderAdd" type="primary" :span="6" per="app_details:add_order">添加订单</per-button>
        <per-button @click="openAddYarnClothes" color="#2f4056" :span="6" per="app_details:add_yarn_clothes">添加试纱</per-button>
<!--        <per-button @click="cancelApp" color="#EA3311" :span="6" per="app_details:cancel_app">取消预约</per-button>-->
      </van-row>
    </van-popup>
    <br>
      <br>
    </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"
import {ImagePreview} from "vant";

export default {
  name: "app-details",
  components: {
    baseNavBar,
  },
  data() {
    return {
      appId: this.$route.query.id,
      appointVo: {},
      pageSource: this.$route.query.pageSource,
      mobileViewId: this.$route.query.mobileViewId,
      isHide:"",
      yarnClothesList: "",
      popupShow: false,
      showPopover: false,
      actions: [{ text: '试纱图片' }, { text: '移除'}],
      orderList: [],
      chooseItem: {},
      clothesScheduleList: [],
      afterSaleFlag: false,
      loading: true,
    }
  },
  created() {
    this.$selectUtils.queryPhoneIsHide(this.mobileViewId).then(response => {
      this.isHide = response.data.data
    })
    this.queryAppointVo();
    this.queryYarnClothesList()
    this.queryOrderListByAppId()
  },
  methods: {
    queryAppointVo: function () {
      this.loading = true
      this.$axios({
        method: "GET",
        url: "/appoint/queryAppointVoById",
        params: {
          id: this.appId,
        }
      }).then(response => {
        if (response.data.code !== 200) {
          this.$toast.fail(response.data.msg);
          return;
        }
        this.appointVo = response.data.data;
        this.loading = false
        if (this.isHide === 1) {
          this.appointVo.phone = this.$stringUtils.phoneIsHide(this.appointVo.phone);
        }
        this.judgeSaleByCusId(this.appointVo.cusId)
        this.$axios({
          method: "GET",
          url: "/schedule/clothesAndScheduleByCusId",
          params: {
            cusId: this.appointVo.cusId,
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.clothesScheduleList.push(...arrTrans(2, response.data.data))
          }
        })
      })
    },
    openAppEdit: function () {
      this.$router.push({name: "appEdit", query: {id: this.$route.query.id}})
    },
    openArrival: function () {
      if (this.appointVo.isValid==="3"){
        this.$toast.fail("该条预约已取消,不可到店!");
        return false;
      }
      this.$router.push({name: "appArrival", query: {id: this.$route.query.id}})
    },
    openOrderAdd: function () {
      if (this.appointVo.isValid==="3"){
        this.$toast.fail("取消的预约不能添加订单");
        return false;
      }
      //如果还未到店应提示是否先选择到店
      if (this.appointVo.isValid==="1"){
        this.$dialog.confirm({
          title: '预约尚未到店',
          message: "预约尚未到店,是否先进行到店操作?",
        }).then(() => {
          this.$router.push({name: "appArrival", query: {id: this.$route.query.id}})
        })
        return false;
      }
      this.$router.push({name: "orderAdd", query: {appointVo: this.appointVo}});
    },
    openAddYarnClothes: function () {
      if (this.appointVo.isValid==="3"){
        this.$toast.fail("取消的预约不能添加试纱");
        return false;
      }
      //如果还未到店应提示是否先选择到店
      if (this.appointVo.isValid==="1"){
        this.$dialog.confirm({
          title: '预约尚未到店',
          message: "预约尚未到店,是否先进行到店操作?",
        }).then(() => {
          this.$router.push({name: "appArrival", query: {id: this.$route.query.id}})
        })
        return false;
      }
      this.$store.commit('setKeepAlive', ['addYarnClothes',this.pageSource])
      this.$router.push({name:"addYarnClothes", query: {appointVo: this.appointVo,pageSource: this.pageSource}})
    },
    //取消预约
    cancelApp:function (){
      if (this.appointVo.isValid === '2') {
        this.$toast.fail("当前预约已到店，不可进行取消")
        return false;
      }
      if (this.appointVo.isValid === '3') {
        this.$toast.fail("当前预约已取消，请勿重复操作")
        return false;
      }
      this.$dialog.confirm({
        title: '取消预约',
        message: '确定要取消 '+this.appointVo.name+" 的这条预约?",
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/appoint/cancelAppointById",
          params: {
            id: this.appId,
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("取消预约成功")
          } else {
            this.$toast.fail(response.data.msg);
          }
          this.queryAppointVo();
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
        response.data.data.forEach(s => s['flag'] = false)
        this.yarnClothesList = response.data.data
      })
    },
    clickItem: function (value) {
      ImagePreview(['\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+value.styleImage])
    },
    queryOrderListByAppId() {
      this.$axios({
        method: "get",
        url: "/order/queryOrderListByAppId",
        params: {
          appId: this.appId
        }
      }).then(response => {
        this.orderList = response.data.data
      })
    },
    onSelect(val) {
      switch (val.text) {
        case "试纱图片":
          this.$router.push({name: "yarnClothesImages", query: {appointVo: this.appointVo, item: this.chooseItem}})
          break
        case "移除":
          this.deleteClothesYarnConfirm(this.chooseItem)
          break
      }
    },
    deleteClothesYarnConfirm: function (item) {
      console.log(item)
      this.$dialog.confirm({
        message: "确认移除 "+item.styleType+'-'+item.styleName+'-'+item.clothesSize+'-'+item.clothesNo+" 的试纱记录？",
        theme: 'round-button',
      }).then(() => {
        this.deleteClothesYarn(item);
      },() =>{})
    },
    deleteClothesYarn: function (item) {
      this.$axios({
        method: "get",
        url: "/clothesYarn/deleteClothesYarn",
        params: {
          id: item.yarnId,
        },
      }).then(response => {
        const data = response.data;
        if (data.code === 200) {
          this.$toast.success(data.msg)
        } else {
          this.$toast.fail(data.msg);
        }
        this.yarnClothesList = [];
        this.queryYarnClothesList();
      })
    },
    judgeSaleByCusId(val) {
      this.$axios({
        method: "GET",
        url: "/customer/judgeSaleByCusId",
        params: {
          cusId: val
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.afterSaleFlag = !response.data.data
        }
      })
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
[v-cloak] {
  display: none;
}
.col{
  /*offset=1*/
  margin-left: 4.16666667%;
}
.col:first-child{
  /*offset=2*/
  margin-left: 8.33333333%;
}
.col:nth-child(3n+1){
  margin-left: 8.33333333%;
}
.col:nth-child(n+4){
  margin-top: 17px;
}
.right{
  text-align: right;
}
/deep/ .van-popup__close-icon--bottom-left{
  left: 47%
}
/deep/ .van-popup__close-icon{
  color: black;
}
/deep/ .van-cell {
  line-height: normal;
}
</style>
