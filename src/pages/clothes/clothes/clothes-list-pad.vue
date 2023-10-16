<template>
  <div>
    <van-sticky>
      <switchNavBar title="婚纱列表(Pad)" :switchText="'常用条件'" @flag="recordsShow=true"/>
      <form action="javascript:return true">
        <van-search
            show-action
            @search="searchStyleName"
            v-model="styleName"
            placeholder="请输入婚纱礼服名称">
          <template #action>
            <div @click="codeScanShow=!codeScanShow">
              <van-icon name="scan"/>
            </div>
          </template>
        </van-search>
      </form>
      <van-calendar safe-area-inset-bottom v-model="dateShow" type="range" allow-same-day
                    :min-date="minDate" :max-date="maxDate" @confirm="dateOnConfirm"/>
      <van-dropdown-menu style="font-size: 10px">
        <van-dropdown-item v-model="isOrder" @change="isOrderChange" :options="isOrderArray">
          <van-cell center :title="dateText" @click="dateShow=true"/>
        </van-dropdown-item>
        <van-dropdown-item v-model="styleType" @change="styleTypeChange" :options="styleTypeArray"/>
<!--        <van-dropdown-item v-model="clothesSize" @change="clothesSizeChange" :options="clothesSizeArray"/>-->
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
        <van-dropdown-item @change="brandChange" v-model="brand" :options="styleBrandArray"/>

      </van-dropdown-menu>
      <van-dropdown-menu style="font-size: 10px">
        <van-dropdown-item v-model="shop" @change="shopChange" :options="shopArray"/>
        <van-dropdown-item :title="positionTitle" v-model="position" @change="positionChange" :options="positionArray"/>

      </van-dropdown-menu>

    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          :immediate-check="false"
          offset="20"
          @load="onLoad"
          finished-text="没有更多了"
      >
        <van-cell style="font-size: 12px">
          <van-row gutter="5">
            <van-col span="6" v-for="item in clothesList" :key="item.id" @click="clickItem(item)"
                     style="text-align: center">
              <div class="card">
                <div class="imgFont">
                  <van-image class="style-img" radius="7"
                             fit="contain"
                             :src="item.styleImage===''?'null'
                             :'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.styleImage+'?imageMogr2/rquality/60'">
                    <template v-slot:error>加载失败,请更换主图</template>
                  </van-image>
                  <div class="styleInfo">

                    <van-row>
                      <van-col span="14">
                        <p class="pFont" style="text-align: left">
                          {{ item.styleType + '-' + item.styleName + '-' + item.clothesSize + '-' + item.clothesNo }}</p>
                      </van-col>
                      <van-col span="10">
                        <p class="pFont" style="text-align: right">{{ item.styleAlias }}</p>
                      </van-col>
                    </van-row>
                    <van-row>
                      <van-col span="14">
                        <p class="pFont" style="text-align: left">{{ item.brand === '' ? '暂无品牌' : item.brand }}</p>
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
    <!--    recordsPopup-->


    <van-popup v-model="recordsShow" position="right" :style="{ width:'20%' }">
      <van-row style="text-align: center">
        <van-button style="width: 100%" plain type="primary" @click="saveRecord()">保存当前条件</van-button>
      </van-row>
      <div class="popup-card" v-for="(item,index) in recordsList" :key="index">
        <van-row class="popup-card-row">
          <van-col :span="10" :offset="1"><span style="text-align: left;font-size: 15px">款式类型</span></van-col>
          <van-col :span="12"><span style="text-align: right;font-size: 15px">{{ item.styleTypeString }}</span></van-col>
        </van-row>
        <van-row class="popup-card-row">
          <van-col :span="10" :offset="1"><span style="text-align: left;font-size: 15px">婚纱尺寸</span></van-col>
          <van-col :span="12"><span style="text-align: right;font-size: 15px">{{ item.clothesSize }}</span></van-col>
        </van-row>
        <van-row class="popup-card-row">
          <van-col :span="10" :offset="1"><span style="text-align: left;font-size: 15px">款式标签</span></van-col>
          <van-col :span="12"><span style="text-align: right;font-size: 15px">{{ item.styleLabelsString }}</span></van-col>
        </van-row>
        <van-row class="popup-card-row">
          <van-col :span="10" :offset="1"><span style="text-align: left;font-size: 15px">款式品牌</span></van-col>
          <van-col :span="12"><span style="text-align: right;font-size: 15px">{{ item.brandName }}</span></van-col>
        </van-row>
        <van-row class="popup-card-row">
          <van-col :span="10" :offset="1"><span style="text-align: left;font-size: 15px">店铺</span></van-col>
          <van-col :span="12"><span style="text-align: right;font-size: 15px">{{ item.shopName }}</span></van-col>
        </van-row>
        <van-row class="popup-card-row">
          <van-col :span="10" :offset="1"><span style="text-align: left;font-size: 15px">位置</span></van-col>
          <van-col :span="12"><span style="text-align: right;font-size: 15px">{{ item.positionName }}</span></van-col>
        </van-row>
        <van-row class="popup-card-row" style="text-align: center">
          <van-col :span="12">
            <van-button plain  type="info" @click="useRecord(item)">使用此条件</van-button>
          </van-col>
          <van-col :span="12">
            <van-button plain  type="danger" @click="delRecord(item.id)">删除此条件</van-button>
          </van-col>
        </van-row>

      </div>
    </van-popup>
  </div>
</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar"
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "clothesList",
  created() {
    this.queryStyleType()
    this.queryShopIds()
    this.queryStyleLabelList()
    this.queryClothesBrand()
    this.queryClothesSize()
    this.queryRecordList()
  },
  data() {
    return {
      codeScanShow: false,
      dateShow: false,
      dateText: "选择档期",
      scheduleDate: "",
      tenantCrop: localStorage.getItem("tenantCrop"),
      empId: localStorage.getItem("empId"),

      maxDate: this.$dateUtils.getMaxMinDate()[0],
      minDate: this.$dateUtils.getMaxMinDate()[1],

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
      isOrder: "",
      isOrderArray: [{text: "全部", value: ""}, {text: "有档期不可用", value: "isOrder"}, {text: "无档期可用", value: "notOrder"}],
      //搜索记录
      recordsShow: false,
      recordsList: [],

      isactive: false,
      page: 1,

      brandText: "",
      brand: "",
      styleBrandArray: [{text: "品牌", value: ""}],
    }
  },
  components: {
    switchNavBar, baseNavBar
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
      this.$router.push({name: "clothesDetailsPad", query: value})
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
          limit: 40,
          styleLabels: this.styleLabels.toString(),
          styleName: this.styleName,
          styleType: this.styleType,
          clothesSize: this.clothesSize,
          tenantCrop: this.tenantCrop,
          clothesShop: this.shop,
          clothesPosition: this.position,
          scheduleDate: this.scheduleDate,
          isOrder: this.isOrder,
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
        } else {
          this.finished = true
          this.$toast.fail(response.data.msg);
        }
      })
    },
    onLoad() {
      this.queryClothesList()
    },
    styleTypeChange: function (type) {
      this.flushClothesListArray()
      this.styleType = type
      this.queryClothesList()
    },
    shopChange: function (shop) {
      this.flushClothesListArray()
      this.shop = shop
      this.position = "";
      this.positionTitle = "位置";
      this.queryPositionIdsByShop()
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
    queryPositionIdsByShop() {
      this.$selectUtils.queryPositionIdsByShop(this.shop, this.$selectUtils.DropDownMenu).then(response => {
        this.positionArray = JSON.parse(response.data.data)
      })
    },
    flushClothesListArray: function () {
      this.clothesList = []
      this.page = 1
      this.finished = false
    },
    queryStyleLabelList: function () {
      this.$selectUtils.queryStyleLabels().then((response) => {
        this.styleLabelList.push(...response.data.data);
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
    dateOnConfirm: function (value) {
      this.isOrder = "notOrder";
      const s = this.$dateUtils.rangeVantDateToYMD(value);
      this.scheduleDate = s
      const temp = s.split('-')
      this.dateText = temp[1] + "-" + temp[2] + " - " + temp[4] + "-" + temp[5]
      this.dateShow = false
      if (this.isOrder === "") {
        this.isOrder = "isOrder"
      }
      this.flushClothesListArray()
      this.queryClothesList()
    },
    isOrderChange: function (val) {
      //如果选择的全部 则删除档期时间
      if (val === '') {
        this.scheduleDate = "";
        this.dateText = "选择档期";
      }
      if (this.scheduleDate === "") {
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
    //查询条件记录
    queryRecordList() {
      this.$axios({
        method: "GET",
        url: '/record/queryRecordList',
        params: {
          tenantCrop: this.tenantCrop,
          empId: this.empId,
          type: "婚纱列表",
        }
      }).then(response => {
        this.recordsList = response.data.data;
        if (this.recordsList.length>0){
          this.$toast('将使用已保存的条件筛选!');
          this.useRecord(this.recordsList[0])
        }else {
          this.queryClothesList()
        }
      })
    },
    //保存当前搜索条件
    saveRecord() {
      //查找款式类型String
      let styleTypeString = this.styleType === '' ? "" : this.styleTypeArray.filter(v => v.value === this.styleType)[0].text;

      //查找款式标签String
      let styleLabelsString = [];
      if (this.styleLabels.length !== 0) {
        let labelIds = this.styleLabels.toString().split(",");
        labelIds.forEach(la => {styleLabelsString.push(this.styleLabelList.filter(v => v.value === Number(la))[0].name)})
      }
      //查找店铺String
      let shopName = this.shop === ""?"":this.shopArray.filter(v => v.value === this.shop)[0].text;

      //查找位置String
      let positionName = this.position === ''?"":this.positionArray.filter(v => v.value === this.position)[0].text;

      this.$axios({
        method: "POST",
        url: '/record/addRecordOfCustomer',
        params: {
          styleType:this.styleType,
          styleTypeString:styleTypeString,
          styleLabels:this.styleLabels.toString(),
          styleLabelsString:styleLabelsString.toString(),
          shopId:this.shop,
          shopName:shopName,
          positionId:this.position,
          positionName:positionName,
          clothesSize:this.clothesSize,
          brandName:this.brand,
          tenantCrop:this.tenantCrop,
          empId:this.empId,
          recordType:"婚纱列表",
        }
      }).then(response => {
        response.data.code === 200?this.$toast.success("添加成功"):this.$toast.fail(response.data.msg)
        this.queryRecordList();
      })
    },
    useRecord(item){
      if (item.styleType!==""){this.styleType=item.styleType}
      if (item.clothesSize!==""){this.clothesSize=item.clothesSize}

      if (item.styleLabels!==""){
        let labelIds=item.styleLabels.split(",");
        labelIds.forEach(k=>this.pushStyleLabel(Number(k)))
      }
      if (item.brandName!==""){this.brand=item.brandName}

      if (item.shopId!==""){
        this.shop=item.shopId;
        this.queryPositionIdsByShop();
      }
      if (item.positionId!==""){
        this.position=item.positionId
        this.positionTitle=item.positionName;
      }
      this.flushClothesListArray();
      this.queryClothesList();
    },
    delRecord(id) {
      this.$dialog.confirm({
        title: "是否确认删除?",
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/record/deleteById",
          params: {
            id: id
          }
        }).then((response) => {
          response.data.code === 200 ? this.$toast.success("删除成功") : this.$toast.fail(response.data.msg)
          this.queryRecordList();
        })
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

/*.style-img {*/
/*  width: 100%;*/
/*}*/

.van-image {
  min-height: 220px;
  max-height: 220px;

  max-width: 165px;
  display: block;
}

/*p{*/
/*  overflow: hidden;*/
/*  white-space: nowrap;*/
/*  text-overflow: ellipsis;*/
/*  margin: 0 !important;*/
/*}*/
.style-img {
  margin: 0 auto;
  width: 100%;
}

.card {
  min-height: 265px;
  max-height: 265px;
  min-width: 160px;
  padding: 5px 10px 0 10px;
  background-color: white;
  border-radius: 10px;
  margin: 0 auto 3% auto;
}

.imgFont {
  margin: 0 auto;
  width: 100%;
  min-width: 165px;
  max-width: 165px;
}

.styleInfo {
  margin-top: 5px;
}

.pFont {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0;

  font-weight: bold;
  font-size: 11px;
  /*margin-block-start: 5px;*/
  /*margin-block-end: 5px;*/
}

.van-list >>> .van-cell {
  padding: 10px 5px;
  background-color: #f7f8fa;
  line-height: 17px;
  /*background-color: #1a2a4c;*/
}

.card >>> .van-badge--fixed {
  left: 0;
  right: auto;
  -webkit-transform: none;
}

.bgcolor {
  border: 1px solid #de0d0d;
  color: rgb(182, 177, 189);
}

.van-popup {
  background-color: unset;
}
.popup-card {
  margin-top: 15px;
  border-radius: 15px 15px;
  background-color: #e1e1e1;
}

.popup-card-row {
  padding: 10px 10px;
  color: black;
}
</style>
