<template>
  <div>
    <van-sticky>
      <switchNavBar title="款式订单分析表" :switchText="dateStringText" @flag="createDateShow=true"/>
      <form action="javascript:return true">
        <van-search
            @search="search"
            v-model="styleName"
            placeholder="请输入款式名称或编号"/>
      </form>
      <van-dropdown-menu>
        <van-dropdown-item :title="styleText" v-model="styleType" @change="styleTypeChange" :options="styleTypeArray"/>
        <van-dropdown-item title="标签" ref="labelRef">
          <van-row type="flex" style="padding: 10px">
            <van-col style="margin: 5px" v-for="item in styleLabelList" :key="item.value">
              <van-tag color="#B6B1BD" :class="{'bgcolor':styleLabels.indexOf(item.value)>-1}"
                       round plain size="large"
                       @click="pushStyleLabel(item.value)">{{ item.name }}
              </van-tag>
            </van-col>
          </van-row>
          <div style="padding: 100px 30px 30px 30px;">
            <van-button type="danger" block round @click="styleLabelConfirm">
              确认
            </van-button>
          </div>
        </van-dropdown-item>
        <van-dropdown-item :title="brandText" @change="brandChange" v-model="brand" :options="styleBrandArray"/>
        <van-dropdown-item v-model="shop" @change="shopChange" :options="shopArray"/>
        <van-dropdown-item :title="positionTitle" v-model="position" @change="positionChange" :options="positionArray"/>
      </van-dropdown-menu>
      <van-calendar safe-area-inset-bottom v-model="createDateShow" :min-date="minDate" :max-date="maxDate"
                    type="range" @confirm="createDateOnConfirm" allow-same-day/>
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad"
          finished-text="没有更多了">
        <van-cell style="font-size: 12px">
          <van-row gutter="5">
            <van-col span="12"  v-for="item in styleList" :key="item.id" @click="toStyleDetails(item)" style="text-align: center">
              <div class="card">
                <div class="imgFont">
                  <van-badge :content="item.brandName===''?'':item.brandName" color="#7ab4ee">
                    <img
                        :src="item.styleImage===''?'null'
                             :'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.styleImage+'?imageMogr2/rquality/60'"
                        alt="主图显示失败,请重新设置主图"/>
                  </van-badge>
                  <div class="styleInfo">
                    <van-row>
                      <van-col span="12">
                        <p class="pFont" style="text-align: left">{{ item.styleAllName }}</p>
                      </van-col>
                      <van-col span="12">
                        <p class="pFont" style="text-align: right">订单数:{{item.orderCount}}</p>
                      </van-col>
                    </van-row>
                    <van-row>
                      <van-col span="12">
                        <p class="pFont" style="text-align: left">相同数:{{item.sameCount}}</p>
                      </van-col>
                      <van-col span="12">
                        <p class="pFont" style="text-align: right">试纱数:{{item.yarnCount}}</p>
                      </van-col>
                    </van-row>
                  </div>
                </div>

              </div>
            </van-col>
          </van-row>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import baseNavBar from '@/components/nav-bar/base-nav-bar'
import switchNavBar from "@/components/nav-bar/switch-nav-bar.vue";

export default {
  name: "clothesOrderAnalysis",
  data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      styleName: "",
      styleText: "",
      styleType: "",
      styleTypeArray: [{text: "类型", value: ""}],
      loading: false,
      finished: false,
      styleList: [],
      styleLabelList: [],
      styleLabels: [],
      shopArray: [{text: "店铺", value: ""}],
      positionArray: [],

      brandText:"",
      brand:"",
      styleBrandArray: [{text: "品牌", value: ""}],
      page: 1,
      shop:"",
      position:"",
      positionTitle: "位置",
      createDateShow: false,
      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],
      dateString:"",
      dateStringText:"订单日期",
    }
  }
  , created() {
    this.queryStyleList()
    this.queryStyleType()
    this.queryStyleLabelList()
    this.queryClothesBrand()
    this.queryShopIds()
  }
  , components: {
    switchNavBar,
    baseNavBar
  }
  , methods: {
    queryStyleList: function () {
      this.loading = true
      this.$axios({
        method: "GET",
        url: "/clothesAnalysis/queryClothesOrder",
        params: {
          page: this.page,
          limit: 30,
          clothesName: "%"+this.styleName+"%",
          styleType:this.styleType,
          date: this.dateString,
          positionId: this.position,
          shopId: this.shop,
          tenantCrop: this.tenantCrop
        }
      }).then(response => {
        if (response.data.code === 200) {
          if (response.data.data.nextPage === 0) {
            this.finished = true
          } else {
            this.loading = false
            this.page = response.data.data.nextPage
          }
          this.styleList.push(...response.data.data.list)
        } else {
          this.finished = true
          this.$toast.fail(response.data.msg);
        }

      })
    },
    toStyleDetails(value) {
      // this.$router.push({name: "styleDetails", query: value})
    },
    queryStyleType: function () {
      this.$selectUtils.queryStyleIds(this.$selectUtils.DropDownMenu).then((response) => {
        this.styleTypeArray.push(...JSON.parse(response.data.data));
      })
    },
    queryStyleLabelList: function () {
      this.$selectUtils.queryStyleLabels().then((response) => {
        this.styleLabelList.push(...response.data.data);
      })
    },
    styleTypeChange: function (value) {
      this.styleType = value
      this.dataClear()
      this.queryStyleList();
    },
    styleLabelConfirm: function () {
      this.$refs.labelRef.toggle()
      this.dataClear()
      this.queryStyleList();
    },
    pushStyleLabel: function (value) {
      if (this.styleLabels.indexOf(value) > -1) {
        this.styleLabels.splice(this.styleLabels.indexOf(value, 0), 1)
      } else {
        this.styleLabels.push(value)
      }
    },
    brandChange: function () {
      this.dataClear()
      this.queryStyleList();
    },
    queryClothesBrand: function () {
      this.$selectUtils.queryMBrandIds().then((response) => {
        this.styleBrandArray.push(...JSON.parse(response.data.data))
      })
    },
    shopChange: function (shop) {
      this.shop = shop
      this.position = "";
      this.positionTitle = "位置";
      this.queryPositionIdsByShop(shop);
      this.dataClear()
      this.queryStyleList();
    },
    positionChange: function (position) {
      this.position = position
      this.positionTitle = this.positionArray.filter(item => item.value === this.position)[0].text
      this.dataClear()
      this.queryStyleList()
    },
    queryShopIds: function () {
      this.$selectUtils.queryShopIdsIsValid(this.$selectUtils.DropDownMenu).then(response => {
        this.shopArray.push(...JSON.parse(response.data.data))
        //如果只有一个店铺则默认选中
        if (this.shopArray.length===2){
          this.shop = this.shopArray[1].value
          this.queryPositionIdsByShop(this.shop);
        }
      })
    },
    queryPositionIdsByShop(shop) {
      this.$selectUtils.queryPositionIdsByShop(shop, this.$selectUtils.DropDownMenu).then(response => {
        this.positionArray = JSON.parse(response.data.data)
      })
    },
    //日历确认
    createDateOnConfirm: function (time) {

      this.dateString = this.$dateUtils.rangeVantDateToYMD(time);
      this.dateStringText = this.$dateUtils.rangeVantDateToMD(time);
      this.dataClear()
      this.queryStyleList()
      this.createDateShow = false;
    },
    onLoad() {
      this.queryStyleList()
    },
    search() {
      this.dataClear()
      this.queryStyleList()
    },
    dataClear() {
      this.page = 1
      this.styleList = []
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'styleDetails') {
      this.$store.commit('setKeepAlive', ['styleList'])
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  }
}
</script>

<style scoped>
.van-dropdown-menu >>> .van-dropdown-menu__title {
  font-size: 12px;
}
.tag-padding {
  margin-left: 5px;
  margin-right: 5px;
}

.bgcolor {
  border: 1px solid #de0d0d;
  color: rgb(182, 177, 189);
}

.styleInfo{
  margin-bottom: 5px;
}
img{
  height: 245px;
  min-height: 245px;
  width: 100%;
  border-radius: 7px;
}
.card{
  min-height: 290px;
  max-height: 290px;
  min-width: 160px;
  padding: 5px 5px 3px 5px ;
  background-color: white;
  border-radius: 10px;
  margin: 0 auto 3% auto;
}
.imgFont{
  margin: 0 auto;
  width: 100%;
  min-width: 45vw;
  max-width: 45vw;
}
.pFont{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0 !important;

  font-weight: bold;
  padding: 0 3px;
  font-size: 12px;
}
.van-list >>> .van-cell{
  padding: 10px 5px;
  background-color:#f7f8fa;
  line-height:17px;
  /*background-color: #1a2a4c;*/
}
.card >>> .van-badge--fixed{
  left: 0;
  right: auto;
  -webkit-transform: none;
}
</style>
