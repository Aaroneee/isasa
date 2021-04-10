<template>
  <div>
    <van-sticky>
      <switchNavBar title="婚纱列表" switchText="扫一扫" @flag="codeScanShow=!codeScanShow"/>
      <form action="javascript:return true">
        <van-search
            @search="searchStyleName"
            v-model="styleName"
            placeholder="请输入婚纱礼服名称"/>
      </form>
      <van-dropdown-menu style="font-size: 10px">
        <van-dropdown-item v-model="styleType" @change="styleTypeChange" :options="styleTypeArray"/>
        <van-dropdown-item v-model="clothesSize" @change="clothesSizeChange" :options="clothesSizeArray"/>
        <van-dropdown-item v-model="shop" @change="shopChange" :options="shopArray"/>
        <van-dropdown-item :title="positionTitle" v-model="position" @change="positionChange" :options="positionArray"/>

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
        <van-cell style="font-size: 12px" v-for="item in clothesList" :key="item.id">
          <van-grid :border="false" :column-num="2" :gutter="1">
            <van-grid-item v-if="item[0] != null">
              <div v-if="item[0].styleImage !== ''">
                <van-image class="style-img" radius="7" @click="clickItem(item[0])"
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
              <span v-text="item[0].shopName"></span><span v-text="item[0].positionName"></span>
              <span v-if="item[0].shopName === ''">店铺未选择</span> <span v-if="item[0].positionName === ''">位置未选择</span>
            </van-grid-item>

            <van-grid-item v-if="item[1] != null">
              <div v-if="item[1].styleImage !== ''">
                <van-image class="style-img" radius="7" @click="clickItem(item[1])"
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
              <span v-text="item[1].shopName"></span><span v-text="item[1].positionName"></span>
              <span v-if="item[1].shopName === ''">店铺未选择</span> <span v-if="item[1].positionName === ''">位置未选择</span>
            </van-grid-item>
          </van-grid>
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
  },
  data() {
    return {
      codeScanShow: false,
      tenantCrop: localStorage.getItem("tenantCrop"),
      styleName: "",
      styleType: "",
      styleTypeArray: [{text: "款式", value: ""}],
      loading: false,
      finished: false,
      clothesList: [],
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
      styleLabelList: [],
      styleLabels: [],
      isactive: false,
      page: 1,
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
        url: '/clothes/clothesList',
        params: {
          page: this.page,
          styleLabels: this.styleLabels.toString(),
          styleName: this.styleName,
          styleType: this.styleType,
          clothesSize: this.clothesSize,
          tenantCrop: this.tenantCrop,
          clothesShop: this.shop,
          clothesPosition: this.position
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.clothesList.push(...arrTrans(2, response.data.data.list))
          if (response.data.data.nextPage === 0) {
            this.finished = true
          } else {
            this.loading = false
            this.page = response.data.data.nextPage
          }
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
      }, 2000)
    }
    ,
    styleTypeChange: function (type) {
      this.flushClothesListArray()
      this.styleType = type
      this.queryClothesList()
    }
    , shopChange: function (shop) {
      this.flushClothesListArray()
      this.shop = shop
      this.queryPositionIdsByShop(shop)
      this.queryClothesList()
    },
    positionChange: function (position) {
      this.flushClothesListArray()

      this.position = position
      this.positionTitle = this.positionArray.filter(item => item.value === this.position)[0].text
      this.queryClothesList()
    }
    , clothesSizeChange: function (size) {
      this.flushClothesListArray()

      this.clothesSize = size
      this.queryClothesList()
    }
    , queryStyleType: function () {
      this.$selectUtils.queryStyleIds(this.$selectUtils.DropDownMenu).then((response) => {
        this.styleTypeArray.push(...JSON.parse(response.data.data));
      })
    }
    , queryShopIds: function () {
      this.$selectUtils.queryShopIds(this.$selectUtils.DropDownMenu).then(response => {
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
    }
    , flushClothesListArray: function () {
      this.clothesList = []
      this.page = 1
      this.finished = false
    }
    , toScan: function () {
      // TODO
      // 消息通知到 原生 原生隐藏vue页面   拉起扫码  扫码结束传递 值
    }, queryStyleLabelList: function () {
      this.$selectUtils.queryStyleLabels().then((response) => {
        this.styleLabelList.push(...response.data.data);
        console.log(response)
      })
    }, styleLabelConfirm: function () {
      this.flushClothesListArray()
      this.$refs.labelRef.toggle()
      this.queryClothesList();
    }, pushStyleLabel: function (value) {
      if (this.styleLabels.indexOf(value) > -1) {
        this.styleLabels.splice(this.styleLabels.indexOf(value, 0), 1)
      } else {
        this.styleLabels.push(value)
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    // 从列表页去到别的页面，如果不是判断页面，则不缓存列表页
    this.$route.meta.keepAlive = to.name === 'clothesDetails';
    next()
  },
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


<style>
* {
  -webkit-overflow-scrolling: touch;
}

body {
  overflow-x: hidden
}

.auto {
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

.van-dropdown-menu__title {
  font-size: 10px;
}

.van-image__img {
  min-height: 200px;
}

.style-img {
  width: 100%;
}
</style>
