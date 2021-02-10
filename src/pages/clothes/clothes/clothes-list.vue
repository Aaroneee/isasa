<template>
  <div>
    <van-sticky>
      <baseNavBar title="婚纱列表"/>
      <van-search
          @search="queryClothesList"
          v-model="clothesNo"
          placeholder="请输入婚纱礼服名称"/>
      <van-dropdown-menu>
        <van-dropdown-item v-model="styleType" @change="styleTypeChange" :options="styleTypeArray"/>
        <van-dropdown-item v-model="clothesSize" @change="clothesSizeChange" :options="clothesSizeArray"/>
        <!--        <van-dropdown-item :title="stateText" v-model="state" @change="stateChange" :options="stateArray"/>-->
        <!--        <van-dropdown-item :title="serviceText" v-model="service" @change="serviceChange" :options="serviceArray" />-->
      </van-dropdown-menu>
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了">
        <van-cell v-for="item in clothesList" :key="item.id">
          <van-grid :border="false" :column-num="2" :gutter="1">
            <van-grid-item v-if="item[0] != null">
              <van-image src="https://www.ivorybai.com:443/clothes/a9b3603e5229241ce30ba8b545d3c325.jpg">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20"/>
                </template>
              </van-image>
              <span
                  v-text="item[0].styleType+'-'+item[0].styleName+'-'+item[0].clothesSize+'-'+item[0].clothesNo"></span>
              <span v-text="item[0].shopName"></span><span v-text="item[0].positionName"></span>
            </van-grid-item>

            <van-grid-item v-if="item[1] != null">
              <van-image src="https://www.ivorybai.com:443/clothes/a9b3603e5229241ce30ba8b545d3c325.jpg">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20"/>
                </template>
              </van-image>
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
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "clothesList",
  created() {
    this.queryClothesList()
    this.queryStyleType()
  },
  data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      clothesNo: "",
      styleType: "",
      styleTypeArray: [{text: "款式类型", value: ""}],
      loading: false,
      finished: false,
      clothesList: [],
      clothesSize: "",
      clothesSizeArray: [{text: "婚纱尺寸", value: ''}
        , {text: "M", value: "M"}
        , {text: "S", value: "S"}
        , {text: "L", value: "L"}
        , {text: "XL", value: "XL"}
        , {text: "XXL", value: "XXL"}
        , {text: "F", value: "F"}
      ],

    }
  },
  components: {
    baseNavBar
  },
  methods: {
    queryClothesList: function (value) {
      this.$axios({
        method: "get",
        url: '/clothes/clothesList',
        params: {
          clothesNo: value,
          styleType: this.styleType,
          clothesSize: this.clothesSize,
          tenantCrop: this.tenantCrop
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.clothesList = response.data.data.list
          this.clothesList = arrTrans(2, response.data.data.list)
          console.log(this.clothesList)
          this.finished = true;
        }
      })
    }
    ,
    styleTypeChange: function (type) {
      this.styleType = type
      this.queryClothesList()
    }
    , clothesSizeChange: function (size) {
      this.clothesSize = size
      this.queryClothesList()
    }
    , clickItem: function (id) {
      console.log(id)
    }
    , queryStyleType: function () {
      this.$selectUtils.queryStyleIds(this.$selectUtils.DropDownMenu).then((response) => {
        this.styleTypeArray.push(...JSON.parse(response.data.data));
        console.log(response)
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

</style>
