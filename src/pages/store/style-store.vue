<template>
  <div>
    <van-sticky>
      <baseNavBar title="款式商城"/>
      <form action="javascript:return true">
        <van-search
            @search="search"
            v-model="searchValue"
            placeholder="请输入款式品牌或系列"/>
      </form>
      <van-dropdown-menu>
        <van-dropdown-item :title="styleTypeText" v-model="styleType" @change="styleTypeChange" :options="styleTypeArray"/>
        <van-dropdown-item :title="styleLabels.length>0?'款式标签 '+styleLabels.length:'款式标签'" ref="labelRef" title-class>
          <van-row type="flex" style="padding: 10px">
            <van-col style="margin: 5px" v-for="item in styleLabelList" :key="item.value">
              <van-tag color="#B6B1BD" :class="{'bgcolor':styleLabels.indexOf(item.value)>-1}"
                       round plain size="large"
                       @click="pushStyleLabel(item.value)">{{ item.name }}
              </van-tag>
            </van-col>
          </van-row>
          <div style="padding: 30px 30px 30px 30px;">
            <van-button type="danger" block round @click="styleLabelConfirm">
              确认
            </van-button>
          </div>
        </van-dropdown-item>
<!--        <van-dropdown-item :title="brandText" v-model="brand" @change="brandChange"  :options="styleBrandArray"/>-->
      </van-dropdown-menu>
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
              <div class="card">
                <div class="imgFont">
                  <van-badge :content="item.libBrandName===''?'':item.libBrandName" color="#7ab4ee">
                    <van-image class="style-img" radius="7"
                               fit="contain"
                               :src="item.styleImage===''?'null'
                               :'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.mainImage+'?imageMogr2/rquality/60'">
                      <template v-slot:error>加载失败,请更换主图</template>
                    </van-image>
                  </van-badge>
                  <div class="styleInfo">
                    <van-row>
                      <van-col span="10">
                        <p class="pFont" style="text-align: left">{{ item.libTypeName }}</p>
                      </van-col>
                      <van-col span="14">
                        <p class="pFont" style="text-align: right">{{ item.libSeriesName }}</p>
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
  name: "styleStore",
  data() {
    return {
      styleList: [],
      searchValue:"",
      styleType: "",
      styleTypeText: "",
      brand:"",
      brandText:"",
      styleLabels: [],
      styleTypeArray: [{text: "款式类型", value: ""}],
      styleBrandArray: [{text: "款式品牌", value: ""}],
      styleLabelList:[],

      loading: false,
      finished: false,

      page: 1,
      tenantCrop: localStorage.getItem("tenantCrop"),
    }
  },
  created() {
    this.queryStyleList()
    this.queryLibLabelIds();
    this.queryStyleType()
    this.queryLibBrand()
  },
  components: {
    baseNavBar
  },
  methods: {
    queryStyleList: function () {
      console.log(this.styleType)

      console.log(this.styleLabels)
      console.log(this.brand)
      this.loading = true
      this.$axios({
        method:"GET",
        url:"/libraryStyle/libStyleList",
        params:{
          searchValue:this.searchValue,
          libTypeId:this.styleType,
          libBrandId:this.brand,
          libLabelIds: this.styleLabels.toString(),
          page:this.page,
          limit:30,
          publishStatus:1,
        }
      }).then(response=>{
        console.log(response)
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
    //查询品牌库
    queryLibBrand: function () {
      this.$selectUtils.queryLibBrandIds(this.$selectUtils.DropDownMenu).then((response) => {
        this.styleBrandArray.push(...JSON.parse(response.data.data))
      })
    },
    //切换品牌
    brandChange: function () {
      this.dataClear()
      this.queryStyleList();
    },
    //查询款式类型
    queryStyleType: function () {
      this.$selectUtils.queryLibStyleTypeIds(this.$selectUtils.DropDownMenu).then((response) => {
        this.styleTypeArray.push(...JSON.parse(response.data.data));
      })
    },
    //切换款式类型
    styleTypeChange: function (value) {
      this.styleType = value
      this.dataClear()
      this.queryStyleList();
    },
    //查询标签库列表
    queryLibLabelIds:function (){
      this.$selectUtils.queryLibLabelIds().then(response=>{
        this.styleLabelList=JSON.parse(response.data.data)
      })
    },
    //标签确认
    styleLabelConfirm: function () {
      console.log(this.styleLabels)

      this.$refs.labelRef.toggle()
      this.dataClear()
      this.queryStyleList();
    },
    //点击标签
    pushStyleLabel: function (value) {
      if (this.styleLabels.indexOf(value) > -1) {
        this.styleLabels.splice(this.styleLabels.indexOf(value, 0), 1)
      } else {
        this.styleLabels.push(value)
      }
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
  min-height: 250px;
  max-height: 250px;
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