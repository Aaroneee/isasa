<template>
  <div>
    <van-sticky>
      <baseNavBar title="品牌系列管理"/>
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad"
          finished-text="没有更多了">
        <van-cell style="font-size: 12px">
          <van-row gutter="5">
            <van-col span="12" v-for="item in brandList" :key="item.id" style="text-align: center">
              <div class="card" @click="toEdit(item.id)">
                <div class="imgFont">
                  <van-badge :content="item.brandName" color="#7ab4ee">
                    <img class="style-img"
                         :src="item.seriesImg===''?'null'
                               :'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.seriesImg+'?imageMogr2/rquality/60'">
                  </van-badge>
                  <div class="styleInfo">
                    <van-row>
                      <van-col span="24">
                        <p class="pFont">{{ item.seriesName }}</p>
                      </van-col>

                    </van-row>
                    <van-row>
                      <van-col span="24">
                        <p class="pFont">{{ item.seriesNum }}</p>
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

import baseNavBar from "@/components/nav-bar/base-nav-bar.vue";

export default {
  name: "style-store-brand-manage",
  data() {
    return {
      brandList: [],
      tenantCrop: localStorage.getItem("tenantCrop"),

      loading: false,
      finished: false,
    }
  },
  created() {
    this.queryStoreSeriesList()
  },
  components: {
    baseNavBar
  },
  methods: {
    queryStoreSeriesList: function () {
      this.loading = true
      this.$axios({
        method: "GET",
        url: "/storeSeries/queryList",
        params: {
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        this.loading = false
        this.finished = true
        this.brandList = response.data.data;
        console.log(this.brandList)
      })
    },
    onLoad() {
      this.loading = true;
      this.queryStoreSeriesList()
    },
    toEdit(id){
      this.$router.push({name: 'styleStoreBrandEdit', query: {id: id}})
    }
  },
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

.styleInfo {
  margin-bottom: 5px;
}

.style-img {
  min-height: 220px;
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
</style>