<template>
  <div>
    <van-sticky>
      <SwitchNavBar title="品牌系列管理" switchText="添加品牌" @flag="toBrandAdd()"/>
    </van-sticky>
    <div>
      <van-collapse v-model="activeNames">
        <van-collapse-item :title="item.brandName" :name="index"  v-for="(item,index) in brandList" :key="item.id">
          <van-row gutter="5">
            <van-col span="12" style="text-align: center">
              <div class="card" @click="toSeriesAdd(item)" >
                <div class="style-img" style="border:1px dashed  gray;display: flex;justify-content: center;align-items: center">
                  <van-icon name="plus" size="50" color="#000000" />
                </div>
                <div class="styleInfo">
                  <van-row>
                    <van-col span="24">
                      <p class="pFont">添加系列</p>
                    </van-col>
                  </van-row>
                </div>
              </div>
            </van-col>
            <van-col span="12" v-for="(chilItem,chilIndex) in item.storeSeriesVOS" :key="chilItem.id" style="text-align: center">
              <div class="card" @click="toEdit(chilItem.id)">
                <div class="imgFont">
                  <van-badge :content="chilItem.brandName" color="#7ab4ee" style="right: revert;left: 0">
                    <img class="style-img"
                         :src="chilItem.seriesImg===''?'https://isasaerp-img-1304365928.cos.ap-shanghai.myqcloud.com/logo.png'
                               :'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+chilItem.seriesImg+'?imageMogr2/rquality/60'">
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

import SwitchNavBar from "@/components/nav-bar/switch-nav-bar.vue";

export default {
  name: "style-store-brand-manage",
  data() {
    return {
      activeNames: [0],
      brandList: [],
      tenantCrop: localStorage.getItem("tenantCrop"),
    }
  },
  created() {
    this.queryStoreSeriesList()
  },
  components: {
    SwitchNavBar
  },
  methods: {
    queryStoreSeriesList: function () {
      this.$axios({
        method: "GET",
        url: "/storeBrand/queryList",
        params: {
          tenantCrop: this.tenantCrop,
        }
      }).then(response => {
        this.brandList = response.data.data;
      })
    },
    toEdit(id){
      this.$router.push({name: 'styleStoreBrandEdit', query: {id: id}})
    },
    toBrandAdd(){
      this.$router.push({name: 'styleStoreBrandAdd'})
    },
    toSeriesAdd(item){
      this.$router.push({name: 'styleStoreSeriesAdd', query: {storeBrand: item}})
    },
  },
}
</script>


<style scoped>

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
  color: var(--my-text-color);
}
.imgFont >>>.van-badge--fixed{
  right: revert ;
  left: 0 ;
  -webkit-transform:translate(0);
  transform:translate(0);
}
</style>