<template>
  <div>
    <van-sticky>
      <BaseNavBar title="款式商城"/>
      <van-dropdown-menu>
        <van-dropdown-item :title="brandText" v-model="brand" @change="brandChange"  :options="styleBrandArray"/>
      </van-dropdown-menu>
    </van-sticky>
    <div>
      <van-collapse v-model="activeNames">
        <van-collapse-item :title="item.brandName" :name="index"  v-for="(item,index) in brandStyleList" :key="item.id">
          <van-row gutter="5">
            <van-col span="12" v-for="(chilItem,chilIndex) in item.storeSeriesVOS" :key="chilItem.id" style="text-align: center">
              <div class="card" @click="toStyleList(chilItem.id)">
                <div class="imgFont">
                  <van-badge :content="chilItem.brandName" color="#7ab4ee" style="right: revert;left: 0">
                    <div style="height: 220px;display: flex;align-items: center">
                      <img class="style-img"
                           :src="'https://brand-image-1304365928.cos.ap-shanghai.myqcloud.com/'+chilItem.seriesImg+'?imageMogr2/rquality/60'"
                      @error="($event)=>{
                        $event.target.src='https://isasaerp-img-1304365928.cos.ap-shanghai.myqcloud.com/logoFont.jpg?imageMogr2/rquality/2';
                      }">
                    </div>
                  </van-badge>
                  <div class="styleInfo">
                    <van-row>
                      <van-col span="24">
                        <p class="pFont">{{ chilItem.seriesName }}</p>
                      </van-col>

                    </van-row>
                    <van-row>
                      <van-col span="24">
                        <p class="pFont">{{ chilItem.seriesNum }}</p>
                      </van-col>
                    </van-row>

                  </div>
                </div>

              </div>
            </van-col>
          </van-row>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>

import BaseNavBar from "@/components/nav-bar/base-nav-bar.vue";

export default {
  name: "style-store-brand-manage",
  data() {
    return {
      activeNames: [0],
      brandStyleList: [],

      brand:"",
      brandText:"",
      styleBrandArray: [{text: "款式品牌", value: ""}],
      tenantCrop: localStorage.getItem("tenantCrop"),
    }
  },
  created() {
    this.queryStoreBrandList()
    this.queryStoreBrand()
  },
  components: {
    BaseNavBar
  },
  methods: {
    queryStoreBrandList: function () {
      this.$axios({
        method: "GET",
        url: "/storeBrand/queryAllList",
        params: {
          id:this.brand,
        }
      }).then(response => {
        this.brandStyleList = response.data.data;
      })
    },
    //查询品牌库
    queryStoreBrand: function () {
      this.$selectUtils.queryStoreBrandIds(this.$selectUtils.DropDownMenu).then((response) => {
        this.styleBrandArray.push(...JSON.parse(response.data.data))
      })
    },
    //切换品牌
    brandChange: function () {
      this.dataClear()
      this.queryStoreBrandList();
    },
    dataClear() {
      this.page = 1
      this.styleList = []
    },
    toStyleList(seriesId){
      this.$router.push({name: 'styleStoreStyleList', query: {id: seriesId}})
    },
  },
}
</script>


<style scoped>

.styleInfo {
  margin-bottom: 5px;
}

.style-img {
  max-height: 220px;
  max-width: 165px;
  display: block;
  margin: 0 auto;
  border-radius: 10px;
}

.card {
  min-height: 270px;
  max-height: 270px;
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

.pFont {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0 !important;

  font-weight: bold;
  padding: 0 3px;
  font-size: 12px;
  text-align: center;
  color: var(--my-text-color);
}
.imgFont >>>.van-badge--fixed{
  right: revert ;
  left: 0 ;
  -webkit-transform:translate(0);
  transform:translate(0);
}
</style>