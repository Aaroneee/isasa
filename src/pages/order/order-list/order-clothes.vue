<template>
  <div>
    <van-sticky>
      <baseNavBar title="订单添加款式"/>
      <form action="javascript:return true">
        <van-search
            @search="searchStyleName"
            v-model="styleName"
            placeholder="请输入婚纱礼服名称来搜索款式"/>
      </form>
      <van-dropdown-menu style="font-size: 10px">
      <van-dropdown-item v-model="sortField" @change="sortFieldChange" :options="sortFieldArray"/>
      <van-dropdown-item v-model="styleType" @change="styleTypeChange" :options="styleTypeArray"/>
      <van-dropdown-item v-model="clothesSize" @change="clothesSizeChange" :options="clothesSizeArray"/>
      <van-dropdown-item v-model="shop" @change="shopChange" :options="shopArray"/>
      <van-dropdown-item :title="positionTitle" v-model="position" @change="positionChange" :options="positionArray"/>
      </van-dropdown-menu>
    </van-sticky>
    <van-list
        v-model="loading"
        :finished="finished"
        offset="20"
        @load="onLoad"
        finished-text="没有更多了"
    >
      <van-cell style="font-size: 12px" v-for="item in clothesList" :key="item.id">
        <van-grid :border="false" :column-num="2" :gutter="1">
          <van-grid-item v-if="item[0] != null">
            <div v-if="item[0].styleImage !== ''">
              <van-image class="style-img" radius="7"
                         :src="'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item[0].styleImage+'?imageSlim'">
              </van-image>
            </div>
            <div v-else>
              <van-image class="style-img">
                <template v-slot:error>未上传图片</template>
              </van-image>
            </div>
            <span
                v-text="item[0].styleType+'-'+item[0].styleName+'-'+item[0].clothesSize+'-'+item[0].clothesNo"></span>
            <span v-text="item[0].positionName"></span>
            <span v-if="item[0].positionName === ''">位置未选择</span>
            <span style="color: red" @click="clickItem(item[0])">选择此件</span>
          </van-grid-item>

          <van-grid-item v-if="item[1] != null">
            <div v-if="item[1].styleImage !== ''">
              <van-image class="style-img" radius="7"
                         :src="'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item[1].styleImage+'?imageSlim'">
              </van-image>
            </div>
            <div v-else>
              <van-image class="style-img">
                <template v-slot:error>未上传图片</template>
              </van-image>
            </div>
            <span
                v-text="item[1].styleType+'-'+item[1].styleName+'-'+item[1].clothesSize+'-'+item[1].clothesNo"></span>
            <span v-text="item[1].positionName"></span>
            <span v-if="item[1].positionName === ''">位置未选择</span>
            <span style="color: red" @click="clickItem(item[1])">选择此件</span>
          </van-grid-item>
        </van-grid>
      </van-cell>
    </van-list>


    <van-popup v-model="orderClothesPopup" round position="bottom" :style="{ height: '43%' }">
      <van-collapse v-model="activeNames" style="padding:4% 4% 4% 4%">
        <van-cell style="font-size: 14px">
          <van-col style="color: #39a9ed" span="12">客户名:{{ order.name }}</van-col>
          <van-col v-show="scheduleCount>0" style="color: var(--my-error-color)" span="12">已有档期数:{{ scheduleCount }}</van-col>
<!--          <van-col style="color: #39a9ed" span="12">婚期:{{ order.weddingDay }}</van-col>-->
        </van-cell>
        <van-form @submit="addScheduleRule">
          <van-field
              name="clothesNo"
              v-model="clothesNo"
              label="婚纱编号"
              placeholder="婚纱编号"
              readonly
              :rules="[{ required: true }]"
          />

          <van-field
              name="clothesId"
              v-model="clothesId"
              style="display: none"
          />
          <van-field
              name="orderId"
              v-model="order.id"
              style="display: none"
          />
          <van-field
              name="cusId"
              v-model="cusId"
              style="display: none"
          />

          <van-field
              name="tenantCrop"
              v-model="tenantCrop"
              style="display: none"
          />

          <van-field label="精确婚期" placeholder="请选择婚期"  readonly v-model="weddingDay" @click="weddingDaySelectShowPicker = true"/>
          <van-popup v-model="weddingDaySelectShowPicker" round position="bottom">
            <van-picker
                title="选择婚期"
                show-toolbar
                :columns="weddingDayArray"
                @confirm="weddingDayConfirm"
                @cancel="weddingDayCancel"
                @change="weddingDayChange"
            />
          </van-popup>
          <van-field
              name="dateAmong"
              v-model="dateAmong"
              label="选择档期"
              placeholder="选择档期"
              readonly
              @click="dateAmongClick"
              :rules="[{ required: true }]"
          />
          <br>
          <br>
          <br>
          <van-row style="margin-bottom: 20px">
            <van-col span="22" offset="1">
              <van-button round block type="primary" native-type="submit">提交</van-button>
            </van-col>
          </van-row>
          <van-overlay :show="overlayShow"/>
        </van-form>
      </van-collapse>
    </van-popup>
    <van-calendar ref="dateRef" safe-area-inset-bottom v-model="dateSectionShow" allow-same-day
                  :min-date="minDate" :max-date="maxDate" :default-date="defaultDate" type="range"
                  @confirm="dateSectionConfirm"/>

  </div>
</template>

<script>
import baseNavBar from "@/components/nav-bar/base-nav-bar"

export default {
  name: "orderClothes"
  , created() {
    this.queryStyleType()
    this.queryShopIds()
    this.queryScheduleRule()
    this.queryClothesList();
  }
  , data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      order: this.$route.query,
      orderClothesPopup: false,
      activeNames: ['1'],
      styleName: "",
      clothesList: [],
      maxDate:this.$dateUtils.getMaxMinDate()[0],
      minDate:this.$dateUtils.getMaxMinDate()[1],


      overlayShow: false,
      defaultDate: [],
      dateSectionShow: false,
      imageUrl: "",
      clothesNo: "",
      dateAmong: "",
      clothesId: "",
      cusId: "",

      sortField:"",
      sortFieldArray: [
        {text: "婚纱排序", value: ""},
        {text: "款式编号", value: "styleName"},
        {text: "添加日期", value: "purchaseDate"},
      ],
      styleType: "",
      styleTypeArray: [{text: "款式", value: ""}],
      clothesSize: "",
      clothesSizeArray: [{text: "尺寸", value: ''}
        , {text: "M", value: "M"}
        , {text: "S", value: "S"}
        , {text: "L", value: "L"}
        , {text: "XL", value: "XL"}
        , {text: "XXL", value: "XXL"}
        , {text: "F", value: "F"}
      ],
      shop: "",
      shopArray: [{text: "店铺", value: ""}],
      positionTitle: "位置",
      position: "",
      positionArray: [],


      rule:"",
      loading: false,
      finished: true,
      page: 1,
      weddingDayArray: [],
      weddingDaySelectShowPicker: false,
      weddingDay: "",
      weddingDayId: "",

      //当前日期和婚纱的档期数
      scheduleCount:0,
    }
  },
  components: {
    baseNavBar
  },
  methods: {
    clickItem: function (value) {
      this.clothesNo = value.styleType + '-' + value.styleName + '-' + value.clothesSize + '-' + value.clothesNo
      this.clothesId = value.clothesId
      this.cusId = this.order.cusId
      this.orderClothesPopup = true;
      this.queryScheduleCount();
    },
    dateSectionConfirm: function (value) {
      this.dateAmong = this.$dateUtils.rangeVantDateToYMD(value)
      this.dateSectionShow = false
      this.queryScheduleCount();
    },
    searchStyleName: function (value) {
      this.styleName = value
      this.clothesList = []
      this.page=1;
      this.queryClothesList()
    },
    addScheduleRule: function (data) {
      let strings = data.dateAmong.split(" - ");
      if (!this.$dateUtils.judgeDateStrIsRange(this.weddingDay,strings[0],this.rule)
          ||
          !this.$dateUtils.judgeDateStrIsRange(this.weddingDay,strings[1],this.rule)){
        this.$dialog.confirm({
          title: '档期与婚期相差较大请确认',
          message: `婚期：${this.weddingDay}<br/>档期开始：${strings[0]}<br/>档期结束：${strings[1]}`,
        }).then(() => {
          this.addSchedule(data);
        })
      }else {
        this.addSchedule(data);
      }
    },

    addSchedule:function (data){
      this.$dialog.confirm({
        title: '添加订单档期款式',
        message: '确定要添加该档期吗？',
      }).then(() => {
        data.weddingDayId = this.weddingDayId
        this.$axios({
          method: "post",
          url: '/schedule/addSchedule',
          params: data,
        }).then(response => {
          if (response.data.code === 200) {
            this.$toast.success("添加档期成功")
            this.weddingDaySelectShowPicker = false
          } else {
            this.$toast.fail(response.data.msg);
            this.overlayShow = false
          }
        })
      })
    }
    , queryClothesList: function () {
      this.loading = true
      this.finished = false
      this.$axios({
        method: "get",
        url: '/clothes/clothesList',
        params: {
          page: this.page,
          limit: 30,
          sortField: this.sortField,
          styleType: this.styleType,
          clothesSize: this.clothesSize,
          clothesShop: this.shop,
          clothesPosition: this.position,
          styleName: this.styleName,
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        if (response.data.code === 200) {
          if (response.data.data.nextPage === 0) {
            this.finished = true
          } else {
            this.loading = false
            this.page = response.data.data.nextPage
          }
          this.clothesList.push(...arrTrans(2, response.data.data.list))
        } else {
          this.finished = true
          this.$toast.fail(response.data.msg);
        }
      })
    }
    ,
    styleTypeChange: function (type) {
      this.clothesList = []
      this.page=1;
      this.styleType = type
      this.queryClothesList()
    },
    sortFieldChange:function(type){
      this.clothesList = []
      this.page=1;
      this.sortField=type;
      this.queryClothesList()
    }
    , shopChange: function (shop) {
      this.clothesList = []
      this.page=1;
      this.shop = shop
      this.queryPositionIdsByShop(shop)
      this.queryClothesList()
    },
    positionChange: function (position) {
      this.clothesList = []
      this.page=1;
      this.position = position
      this.positionTitle = this.positionArray.filter(item => item.value === this.position)[0].text
      this.queryClothesList()
    }
    , clothesSizeChange: function (size) {
      this.clothesList = []
      this.page=1;
      this.clothesSize = size
      this.queryClothesList()
    }
    , queryStyleType: function () {
      this.$selectUtils.queryStyleIds(this.$selectUtils.DropDownMenu).then((response) => {
        this.styleTypeArray.push(...JSON.parse(response.data.data));
      })
    }
    , queryShopIds: function () {
      this.$selectUtils.queryShopIdsIsValid(this.$selectUtils.DropDownMenu).then(response => {
        this.shopArray.push(...JSON.parse(response.data.data))
      })
    }
    , queryPositionIdsByShop(shop) {
      this.positionTitle = "位置"
      this.positionArray.length = 0
      this.position = ""
      this.$selectUtils.queryPositionIdsByShop(shop, this.$selectUtils.DropDownMenu).then(response => {
        this.positionArray.push(...JSON.parse(response.data.data))
      })
    },
    async queryScheduleRule(){
      const rule = await this.$axios({
        method:"get",
        url:"schedule/queryScheduleRule",
        params:{
          tenantCrop:this.tenantCrop
        }
      })
      this.rule = rule.data.data.rule
      const orderRule = await this.$axios({
        method: "get",
        url: "/order/queryOrderVoById",
        params: {
          id: this.order.id
        }
      })
      if (orderRule.data.data.scheduleRule !== "") {
        this.rule = orderRule.data.data.scheduleRule
      }
      this.queryWeddingDayByOrderId()
    },
    onLoad() {
      setTimeout(this.queryClothesList, 1000)
    },
    // 查询婚期
    queryWeddingDayByOrderId() {
      this.$axios({
        method: "get",
        url: "/weddingDate/queryWeddingDayByCusId",
        params: {
          cusId: this.order.cusId
        }
      }).then(response => {
        response.data.data.forEach(s => {
          this.weddingDayArray.push({text: s.weddingDay, value: s.id})
        })
        if (response.data.data.length == 1) {
          this.weddingDay = response.data.data[0].weddingDay
          this.weddingDayId = response.data.data[0].id
          this.defaultWeddingDay()
        }
      })
    },
    weddingDayConfirm(val) {
      this.weddingDay = val.text
      this.weddingDayId = val.value
      this.weddingDayCancel()
      this.defaultWeddingDay()
    },
    weddingDayCancel() {
      this.weddingDaySelectShowPicker = false
    },
    weddingDayChange() {

    },
    dateAmongClick() {
      if (this.weddingDay === "") {
        this.$toast.fail("请先选择婚期")
        return
      }
      this.dateSectionShow=true
    },
    defaultWeddingDay() {
      let dateRange=this.$dateUtils.getAroundDate(this.weddingDay,this.rule);

      this.dateAmong = this.$dateUtils.vantDateToYMD(dateRange[0])+" - "+this.$dateUtils.vantDateToYMD(dateRange[1])
      this.defaultDate = this.$dateUtils.getAroundDate(this.weddingDay,this.rule)

      //查询是否撞档
      this.queryScheduleCount();
    },
    //根据婚纱ID和档期时间查询 档期总数
    queryScheduleCount(){
      this.$axios({
        method: "get",
        url: "/schedule/checkSchedulesByClothesIdAndDate",
        params: {
          dateAmong: this.dateAmong,
          clothesId: this.clothesId,
          tenantCrop:this.tenantCrop,
        }
      }).then(response => {
        this.scheduleCount=response.data.data;
      })
    },
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

</style>
