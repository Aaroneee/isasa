<template>
  <div>
    <van-sticky>
      <baseNavBar title="款式商城"/>
    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad"
          finished-text="没有更多了">
        <van-cell style="font-size: 12px">
          <van-row gutter="5">
            <van-col span="12"  v-for="item in styleList" :key="item.id" style="text-align: center">
              <div class="card"  @click="toStyleDetails(item)">
                <div class="imgFont">
                  <van-badge :content="item.storeBrandName===''?'':item.storeBrandName" color="#7ab4ee">
                    <van-image class="style-img" radius="7"
                               fit="contain"
                               :src="item.styleImage===''?'null'
                               :'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.mainImage+'?imageMogr2/rquality/60'">
                      <template v-slot:error>加载失败,请更换主图</template>
                    </van-image>
                  </van-badge>
                  <div class="styleInfo">
                    <van-row>
                      <van-col span="12">
                        <p class="pFont" style="text-align: left">{{ item.storeTypeName }}</p>
                      </van-col>
                      <van-col span="12">
                        <p class="pFont" style="text-align: right">￥{{ item.salePrice===''?'未标价':item.salePrice }}</p>
                      </van-col>
                    </van-row>
                    <van-row>
                      <van-col span="12">
                        <p class="pFont" style="text-align: left">{{ item.storeSeriesName===''?'无系列':item.storeSeriesName }}</p>
                      </van-col>
                      <van-col span="12">
                        <p class="pFont" style="text-align: right">{{ item.storeSeriesNum===''?"无编号":item.storeSeriesNum }}</p>
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
import baseNavBar from '@/components/nav-bar/base-nav-bar'

export default {
  name: "styleStoreStyleList",
  data() {
    return {
      styleList: [],

      loading: false,
      finished: false,

      page: 1,
      tenantCrop: localStorage.getItem("tenantCrop"),
    }
  },
  created() {
    this.queryStyleList()
  },
  components: {
    baseNavBar
  },
  methods: {
    queryStyleList: function () {
      this.loading = true
      this.$axios({
        method:"GET",
        url:"/storeStyle/queryList",
        params:{
          storeSeriesId:this.$route.query.id,
          page:this.page,
          limit:30,
          publishStatus:1,
        }
      }).then(response=>{
        if (response.data.code === 200) {
          if (response.data.data.nextPage === 0) {
            this.finished = true
          } else {
            this.loading = false
            this.page = response.data.data.nextPage
          }
          this.styleList.push(...response.data.data.list)
        } else {
          this.finished = true
          this.$toast.fail(response.data.msg);
        }
      })
    },
    toStyleDetails(value) {
      this.$router.push({name: "styleStoreDetails", query: value})
    },
    onLoad() {
      this.loading=true;
      this.queryStyleList()
    },
    search() {
      this.dataClear()
      this.queryStyleList()
    },
    dataClear() {
      this.page = 1
      this.styleList = []
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'styleDetails') {
      this.$store.commit('setKeepAlive', ['styleList'])
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  }
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

.styleInfo{
  margin-bottom: 5px;
}
.van-image {
  min-height: 220px;
  max-height: 220px;

  max-width: 165px;
  display: block;
}

.style-img {
  margin: 0 auto;
  width: 100%;
}
.card{
  min-height: 270px;
  max-height: 270px;
  min-width: 160px;
  padding: 5px 10px 0 10px ;
  background-color: white;
  border-radius: 10px;
  margin: 0 auto 3% auto;
}
.imgFont{
  margin: 0 auto;
  width: 100%;
  min-width: 165px;
  max-width: 165px;
}
.pFont{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0 !important;

  font-weight: bold;
  padding: 0 3px;
  font-size: 12px;
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
</style>