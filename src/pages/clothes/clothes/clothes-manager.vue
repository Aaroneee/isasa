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
            <van-col span="24" v-for="item in clothesList" :key="item.id">
              <div class="recommand-wrap">
                <div class="title">
                  <span style="font-size: 20px">{{ item[0].shopName }}婚纱礼服</span>
                </div>
                <div ref="wrapper">
                  <ul class="cont" ref="cont">
                    <li class="cont-item" v-for="it of item" :key="it.id">
                      <div @click="clickItem(it)">
                        <div class="cont-dest">{{ it.positionName }}</div>
                        <div class="cont-price" style="padding-top: 10px">
                          <span class="price">{{ it.count }}</span>
                        </div>
                      </div>
                    </li>
                  </ul>
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
import BScroll from 'better-scroll'

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
      styleLabels: [],
      isOrder: "",
      isOrderArray: [{text: "全部", value: ""}, {text: "有档期不可用", value: "isOrder"}, {
        text: "无档期可用",
        value: "notOrder"
      }],

      brandIds: [],
      brandKey:'',

      isactive: false,
      page: 1,

      brandText: "",
      brand: "",
      styleBrandArray: [{text: "品牌", value: ""}],
    }
  },
  components: {
    switchNavBar
  },
  mounted() {
    this.$nextTick(() => {
      let timer = setTimeout(() => {
        if (timer) {
          clearTimeout(timer)
          this.verScroll()
        }
      }, 0)
    })
  },
  methods: {
    verScroll() {
      let width = this.clothesList.length * 110
      this.$refs.cont.style.width = width + 'px'
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.wrapper, {
            startX: 0,
            click: true,
            scrollX: true,
            scrollY: false,
            eventPassthrough: 'vertical'
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    clickItem: function (value) {
      value['brandName'] = this.brand
      value['styleLabels'] = this.styleLabels
      this.$router.push({name: "clothesList", query: value})
    }
    ,
    queryClothesList: function () {
      this.clothesList = []
      this.loading = true
      this.$axios({
        method: "get",
        url: '/clothes/queryPositionClothesCount',
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
      console.log(value)
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


<style lang="css" scoped>
.recommand-wrap {
  height: 0;
  padding-bottom: 35%;
  margin-top: .2rem;
}

.cont {
  list-style: none;
  overflow-x: scroll;
  white-space: nowrap;
  font-size: 15px;
  text-align: center;
  padding-top: 15px;
}

.cont-item {
  position: relative;
  display: inline-block;
  padding-left: 20px;
}

.cont-img {
  overflow: hidden;
  width: 2rem;
  height: 0;
  padding-bottom: 100%;
}

.img {
  width: 100%;
}

.bgcolor {
  border: 1px solid #de0d0d;
  color: rgb(182, 177, 189);
}

</style>