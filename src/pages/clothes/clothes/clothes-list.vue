<template>
  <div>
    <van-sticky>
      <switchNavBar title="婚纱档期查询" :switchText="dateText" @flag="dateShow=true"/>
      <form action="javascript:return true">
          <van-search
              show-action
              @search="searchStyleName"
              v-model="styleName"
              placeholder="请输入婚纱礼服名称">
          <template #action>
            <div @click="codeScanShow=!codeScanShow"><van-icon name="scan" /></div>
          </template>
          </van-search>
      </form>
      <van-calendar safe-area-inset-bottom v-model="dateShow" type="range" allow-same-day
                    :min-date="minDate" :max-date="maxDate" @confirm="dateOnConfirm"/>
      <van-dropdown-menu style="font-size: 10px">
        <van-dropdown-item v-model="isOrder" @change="isOrderChange" :options="isOrderArray"/>
        <van-dropdown-item v-model="styleType" @change="styleTypeChange" :options="styleTypeArray"/>
<!--        <van-dropdown-item v-model="clothesSize" @change="clothesSizeChange" :options="clothesSizeArray"/>-->
        <van-dropdown-item v-model="shop" @change="shopChange" :options="shopArray"/>
        <van-dropdown-item :title="positionTitle" v-model="position" @change="positionChange" :options="positionArray"/>

        <van-dropdown-item title="标签" ref="labelRef">
          <van-row type="flex" style="padding: 10px">
            <van-col style="margin: 5px" v-for="item in styleLabelList" :key="item.value">
              <van-tag color="#B6B1BD" type="danger" :class="{'bgcolor':styleLabels.indexOf(item.value)>-1}"
                       round plain
                       size="large"
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
        <van-dropdown-item title="品牌" @change="brandChange" v-model="brand" :options="styleBrandArray"/>

      </van-dropdown-menu>
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          offset="20"
          @load="onLoad"
          finished-text="没有更多了"
      >
        <van-cell style="font-size: 12px">
          <van-row gutter="5">
            <van-col span="12"  v-for="item in clothesList" :key="item.id" @click="clickItem(item)" style="text-align: center">
              <div class="card">
                <div class="imgFont">
                  <img
                             :src="item.styleImage===''?'null'
                             :'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.styleImage+'?imageMogr2/rquality/60'"
                  alt="主图显示失败,请重新设置主图"/>
                  <div class="styleInfo">

                    <van-row>
                      <van-col span="14">
                        <p class="pFont" style="text-align: left">{{item.styleType+'-'+item.styleName+'-'+item.clothesSize+'-'+item.clothesNo}}</p>
                      </van-col>
                      <van-col span="10">
                        <p class="pFont" style="text-align: right">{{ item.styleAlias }}</p>
                      </van-col>
                    </van-row>
                    <van-row>
                      <van-col span="14">
                        <p class="pFont" style="text-align: left">{{item.brand===''?'暂无品牌':item.brand}}</p>
                      </van-col>
                      <van-col span="10">
                        <p class="pFont" style="text-align: right">{{ item.positionName }}</p>
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
import switchNavBar from "@/components/nav-bar/switch-nav-bar"

export default {
  name: "clothesList",
  created() {
    // this.queryClothesList()
    this.queryStyleType()
    this.queryShopIds()
    this.queryStyleLabelList()
    // this.queryPositionIdsByShop()
    this.queryClothesBrand()
    this.queryClothesSize()
  },
  data() {
    return {
      codeScanShow: false,
      dateShow:false,
      dateText:"选择档期",
      scheduleDate:"",
      tenantCrop: localStorage.getItem("tenantCrop"),

      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],

      styleName: "",
      styleType: "",
      styleTypeArray: [{text: "款式", value: ""}],
      loading: false,
      finished: false,
      clothesList: [],
      clothesSize: "",
      clothesSizeArray: [{text: "尺寸", value: ''}],
      shop: "",
      shopArray: [{text: "店铺", value: ""}],
      positionTitle: "位置",
      position: "",
      positionArray: [],
      styleLabelList: [],
      styleLabels: [],
      isOrder:"",
      isOrderArray:[{text: "全部", value: ""},{text: "有档期不可用", value: "isOrder"},{text: "无档期可用", value: "notOrder"}],

      isactive: false,
      page: 1,

      brandText:"",
      brand:"",
      styleBrandArray: [{text: "品牌", value: ""}],
    }
  },
  components: {
    switchNavBar
  },
  watch: {
    codeScanShow: function (newVal) {
      if (newVal) {
        window.webkit.messageHandlers.scaner.postMessage({"msg": "调用原生扫码界面"})
      }
    },
  },
  methods: {
    clickItem: function (value) {
      console.log(value)
      // TODO  婚纱详情待开发
      this.$router.push({name: "clothesDetails", query: value})
    }, searchStyleName: function (value) {
      this.page = 1
      this.styleName = value
      this.clothesList = []
      this.queryClothesList()
    }
    ,
    queryClothesList: function () {
      this.loading = true
      this.$axios({
        method: "get",
        url: '/clothes/mClothesList',
        params: {
          page: this.page,
          styleLabels: this.styleLabels.toString(),
          styleName: this.styleName,
          styleType: this.styleType,
          clothesSize: this.clothesSize,
          tenantCrop: this.tenantCrop,
          clothesShop: this.shop,
          clothesPosition: this.position,
          scheduleDate:this.scheduleDate,
          isOrder:this.isOrder,
          brandName: this.brand,
        }
      }).then(response => {
        if (response.data.code === 200) {
          if (response.data.data.nextPage === 0) {
            this.finished = true
          } else {
            this.loading = false
            this.page = response.data.data.nextPage
          }
          this.clothesList.push(...response.data.data.list)
          console.log(this.clothesList)
        } else {
          this.finished = true
          this.$toast.fail(response.data.msg);
        }
      })
    }
    , onLoad() {
      const that = this
      setTimeout(function () {
        that.queryClothesList()
      }, 1000)
    }
    ,
    styleTypeChange: function (type) {
      this.flushClothesListArray()
      this.styleType = type
      this.queryClothesList()
    },
    shopChange: function (shop) {
      this.flushClothesListArray()
      this.shop = shop
      this.position="";
      this.positionTitle="位置";
      this.queryPositionIdsByShop(shop);
      this.queryClothesList()
    },
    positionChange: function (position) {
      this.flushClothesListArray()
      this.position = position
      this.positionTitle = this.positionArray.filter(item => item.value === this.position)[0].text
      this.queryClothesList()
    },
    clothesSizeChange: function (size) {
      this.flushClothesListArray()

      this.clothesSize = size
      this.queryClothesList()
    },
    queryStyleType: function () {
      this.$selectUtils.queryStyleIds(this.$selectUtils.DropDownMenu).then((response) => {
        this.styleTypeArray.push(...JSON.parse(response.data.data));
      })
    },
    queryShopIds: function () {
      this.$selectUtils.queryShopIds(this.$selectUtils.DropDownMenu).then(response => {
        this.shopArray.push(...JSON.parse(response.data.data))
      })
    },
    queryPositionIdsByShop(shopId) {
      this.$selectUtils.queryPositionIdsByShop(shopId, this.$selectUtils.DropDownMenu).then(response => {
        console.log(response)
        this.positionArray=JSON.parse(response.data.data)
      })
    },
    flushClothesListArray: function () {
      this.clothesList = []
      this.page = 1
      this.finished = false
    },
    toScan: function () {
      // TODO
      // 消息通知到 原生 原生隐藏vue页面   拉起扫码  扫码结束传递 值
    },
    queryStyleLabelList: function () {
      this.$selectUtils.queryStyleLabels().then((response) => {
        this.styleLabelList.push(...response.data.data);
        console.log(response)
      })
    },
    styleLabelConfirm: function () {
      this.flushClothesListArray()
      this.$refs.labelRef.toggle()
      this.queryClothesList();
    },
    pushStyleLabel: function (value) {
      console.log(value)
      if (this.styleLabels.indexOf(value) > -1) {
        this.styleLabels.splice(this.styleLabels.indexOf(value, 0), 1)
      } else {
        this.styleLabels.push(value)
      }
    },
    dateOnConfirm:function (value){
      this.isOrder = "notOrder";
      const s = this.$dateUtils.rangeVantDateToYMD(value);
      this.scheduleDate = s
      const temp = s.split('-')
      this.dateText = temp[1] + "-" + temp[2] + " - " + temp[4] + "-" + temp[5]
      this.dateShow = false
      if (this.isOrder === ""){
        this.isOrder = "isOrder"
      }
      this.flushClothesListArray()
      this.queryClothesList()
    },isOrderChange:function (){
      if (this.scheduleDate === ""){
        this.$toast.fail("选择档期后该选项生效")
        return
      }
      this.flushClothesListArray()
      this.queryClothesList()
    },
    brandChange: function () {
      this.flushClothesListArray()
      this.queryClothesList();
    },
    queryClothesBrand: function () {
      this.$selectUtils.queryMBrandIds().then((response) => {
        this.styleBrandArray.push(...JSON.parse(response.data.data))
      })
    },
    queryClothesSize() {
      this.$selectUtils.queryClothesSize().then(response => {
        let data = JSON.parse(response.data.data).map(s => s['name'])
        for (let temp of data) {
          this.clothesSizeArray.push({text: temp, value: temp})
        }
      })
    },
  },
  beforeRouteLeave(to, from, next) {
    // 从列表页去到别的页面，如果不是判断页面，则不缓存列表页
    this.$route.meta.keepAlive = to.name === 'clothesDetails';
    next()
  },
}
</script>


<style scoped>
.van-dropdown-menu >>> .van-dropdown-menu__title {
  font-size: 12px;
}

/*.van-image__img {*/
/*  min-height: 200px;*/
/*}*/
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
  padding: 5px 5px 0 5px ;
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
.styleInfo{
  margin-top: 5px;
}
.pFont{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0;

  font-weight: bold;
  font-size: 11px;
  /*margin-block-start: 5px;*/
  /*margin-block-end: 5px;*/
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
.bgcolor {
  border: 1px solid #de0d0d;
  color: rgb(182, 177, 189);
}
</style>
