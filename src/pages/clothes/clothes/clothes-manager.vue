<template>
  <div>
    <van-sticky>
      <switchNavBar title="婚纱管理" switchText=""/>
      <!--      <van-calendar safe-area-inset-bottom v-model="dateShow" type="range" allow-same-day-->
      <!--                    :min-date="minDate" :max-date="maxDate" @confirm="dateOnConfirm"/>-->
      <van-dropdown-menu style="font-size: 10px">
        <!--        <van-dropdown-item v-model="isOrder" @change="isOrderChange" :options="isOrderArray"/>-->
        <!--        <van-dropdown-item v-model="styleType" @change="styleTypeChange" :options="styleTypeArray"/>-->
        <!--        &lt;!&ndash;        <van-dropdown-item v-model="clothesSize" @change="clothesSizeChange" :options="clothesSizeArray"/>&ndash;&gt;-->
        <!--        <van-dropdown-item v-model="shop" @change="shopChange" :options="shopArray"/>-->
        <!--        <van-dropdown-item :title="positionTitle" v-model="position" @change="positionChange" :options="positionArray"/>-->

        <van-dropdown-item title="标签" ref="labelRef">
          <van-search v-model="searchText" placeholder="搜索标签" @input="filteredStyleLabelList"/>
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
        <van-dropdown-item title="品牌" ref="brandRef">
          <van-search v-model="searchBrand" placeholder="搜索品牌" @input="filteredBrandLabelList"/>
          <van-cell v-for="item in styleBrandArray" :key="item.id">
            <van-col span="12" @click="brandChange(item.value)">{{ item.text }}</van-col>
          </van-cell>
        </van-dropdown-item>
      </van-dropdown-menu>
    </van-sticky>

    <div>
      <div id="operationDiv" v-for="item in clothesList" :key="item.id">
        <div id="operationCon">
          <span style="font-size: 17px;text-align: center;color: #42aef6;">{{ item[0].shopName }}婚纱礼服</span>
          <div id="operationParent">
            <div class="operationBlock" v-for="it of item" v-if="![0,'0'].includes(it.count)" :key="it.id" @click="clickItem(it)">
              <p v-if="it.dummy === '0'" style="color: #1AA090" class="pfont">{{ it.positionName }}</p>
              <p v-if="it.dummy === '1'" class="pfont">{{ it.positionName }}</p>
              <p class="pfont">{{ it.count }}</p>
            </div>
            <div class="operationBlock">
              <p style="color: #1AA090" class="pfont">存疑数量</p>
              <p class="pfont">{{ item[0].doubtCount }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import switchNavBar from "@/components/nav-bar/switch-nav-bar"
import {re} from "mathjs";

export default {
  name: "clothesManager",
  created() {
    this.queryClothesList()
    this.queryStyleLabelList()
    // this.queryPositionIdsByShop()
    this.queryClothesBrand()
    this.queryClothesSize()
  },
  data() {
    return {
      codeScanShow: false,
      dateText: "选择档期",
      scheduleDate: "",
      tenantCrop: localStorage.getItem("tenantCrop"),

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
      styleFilterList: [],
      brandFilterList: [],
      styleLabels: [],
      isOrder: "",
      isOrderArray: [{text: "全部", value: ""}, {text: "有档期不可用", value: "isOrder"}, {
        text: "无档期可用",
        value: "notOrder"
      }],

      brandIds: [],
      brandKey: '',

      isactive: false,
      page: 1,
      searchText: '',
      searchBrand: '',

      brandText: "",
      brand: "",
      styleBrandArray: [{text: "全部", value: ""}],
    }
  },
  components: {
    switchNavBar
  },
  methods: {
    clickItem: function (value) {
      value['brandName'] = this.brand
      value['styleLabels'] = this.styleLabels
      this.$router.push({name: "clothesList", query: value})
    },
    filteredStyleLabelList() {
      console.log(this.searchText)
      if (this.searchText === '') {
        this.styleLabelList = this.styleFilterList
      } else {
        this.styleLabelList = this.styleLabelList.filter(item => {
          return item.name.toLowerCase().includes(this.searchText.toLowerCase())
        });
      }
    },
    filteredBrandLabelList() {
      console.log(this.searchBrand)
      if (this.searchBrand === '') {
        this.styleBrandArray = this.brandFilterList
      } else {
        this.styleBrandArray = this.styleBrandArray.filter(item => {
          return item.text.toLowerCase().includes(this.searchBrand.toLowerCase())
        });
      }
    },
    queryClothesList: function () {
      this.clothesList = []
      this.loading = true
      this.$axios({
        method: "get",
        url: '/clothes/mobileQueryPositionClothesCount',
        params: {
          tenantCrop: this.tenantCrop,
          styleLabels: this.styleLabels.toString(),
          brandId: this.brandKey
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.finished = true
          this.clothesList.push(...response.data.data)
        } else {
          this.loading = false
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
      this.position = "";
      this.positionTitle = "位置";
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
        this.positionArray = JSON.parse(response.data.data)
      })
    },
    toScan: function () {
      // TODO
      // 消息通知到 原生 原生隐藏vue页面   拉起扫码  扫码结束传递 值
    },
    queryStyleLabelList: function () {
      this.$selectUtils.queryStyleLabels().then((response) => {
        this.styleLabelList.push(...response.data.data);
        this.styleFilterList.push(...response.data.data);
        console.log(response)
      })
    },
    styleLabelConfirm: function (value) {
      this.$refs.labelRef.toggle()
      console.log(value)
      this.queryClothesList();
    },
    pushStyleLabel: function (value) {
      console.log(value)
      if (this.styleLabels.indexOf(value) > -1) {
        this.styleLabels.splice(this.styleLabels.indexOf(value, 0), 1)
      } else {
        this.styleLabels.push(value)
      }
    }, isOrderChange: function () {
      if (this.scheduleDate === "") {
        this.$toast.fail("选择档期后该选项生效")
        return
      }
      this.queryClothesList()
    },
    brandChange: function (value) {
      this.$refs.brandRef.toggle()
      console.log(value)
      if (value === '') {
        this.brandKey = ''
        this.queryClothesList()
        return
      }
      this.brand = value
      let id = this.brandIds.filter(item => item.name === value)[0].value
      this.brandKey = id
      this.queryClothesList()
    },
    queryClothesBrand: function () {
      this.$selectUtils.queryBrandIds().then((response) => {
        this.brandIds.push(...JSON.parse(response.data.data))
      })
      this.$selectUtils.queryMBrandIds().then((response) => {
        this.styleBrandArray.push(...JSON.parse(response.data.data))
        this.brandFilterList.push(...JSON.parse(response.data.data))
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

.bgcolor {
  border: 1px solid #de0d0d;
  color: rgb(182, 177, 189);
}

#operationDiv {
  bottom: 10px;
  width: 100%;
  text-align: center;
  margin-top: 10px;
}

#operationCon {
  border-radius: 10px;
  margin: 0 auto;
  background: white;
  height: 105px;
  width: 95%;
}

#operationParent {
  padding: 1px 0;
  white-space: nowrap;
  /*文本不会换行，文本会在在同一行上继续*/
  overflow-y: auto;
}

#operationParent::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.pfont {
  font-size: 13px;
}

.operationBlock {
  height: 50px;
  text-align: center;
  display: inline-block;
  margin: 0 4%
}
</style>