<template>
  <div>
    <van-sticky>
      <switchNavBar  title="婚纱列表" switchText="扫一扫" @flag="codeScanShow=!codeScanShow"/>
      <van-search
          @search="queryClothesList"
          v-model="clothesNo"
          placeholder="请输入婚纱礼服名称"/>
      <van-dropdown-menu style="font-size: 10px">
        <van-dropdown-item v-model="styleType" @change="styleTypeChange" :options="styleTypeArray"/>
        <van-dropdown-item v-model="clothesSize" @change="clothesSizeChange" :options="clothesSizeArray"/>
        <van-dropdown-item v-model="shop" @change="shopChange" :options="shopArray"/>
        <van-dropdown-item :title="positionTitle" v-model="position" @change="positionChange" :options="positionArray"/>
      </van-dropdown-menu>
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          :offset="10"
          @load="onLoad"
          class="auto"
          :immediate-check="false"
          finished-text="没有更多了"
      >
        <van-cell v-for="item in clothesList" :key="item.id">
          <van-grid :border="false" :column-num="2" :gutter="1">
            <van-grid-item v-if="item[0] != null">
              <div v-if="item[0].styleImage !== ''">

              <van-image  radius="7" @click="clickItem(item[0])"
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
            </van-grid-item>

            <van-grid-item v-if="item[1] != null">
              <div v-if="item[1].styleImage !== ''">
              <van-image radius="7" @click="clickItem(item[1])"
                         :src="'\thttps://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item[1].styleImage">
              </van-image>
              </div>
              <div v-else>
                <van-image class="style-img" >
                  <template v-slot:error>未上传图片</template>
                </van-image>
              </div>
              <span
                  v-text="item[1].styleType+'-'+item[1].styleName+'-'+item[1].clothesSize+'-'+item[1].clothesNo"></span>
              <span v-text="item[1].shopName"></span><span v-text="item[1].positionName"></span>
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
    this.queryClothesList()
    this.queryStyleType()
    this.queryShopIds()
  },
  data() {
    return {
      codeScanShow: false,
      tenantCrop: localStorage.getItem("tenantCrop"),
      clothesNo: "",
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
    }
  },
  methods: {
    clickItem: function (value) {
      console.log(value)
      // TODO  婚纱详情待开发
      // this.$router.push({name: "clothesDetails", query: value})
    }
    ,
    queryClothesList: function (value) {
      this.loading = true
      this.$axios({
        method: "get",
        url: '/clothes/clothesList',
        params: {
          page: this.page,
          clothesNo: value,
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
            this.finished = false
            this.page = response.data.data.nextPage
          }
        }
        this.loading = false
      })
    }
    , onLoad() {
      if (this.loading) {
        setTimeout(() => {
          this.queryClothesList()
        }, 2000);
      }
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
      this.page = 1
      this.clothesList = []
    }
    , toScan: function () {
      // TODO
      // 消息通知到 原生 原生隐藏vue页面   拉起扫码  扫码结束传递 值
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
  height: 200px;
}
</style>
