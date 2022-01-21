<template>
  <div>
    <van-sticky>
      <baseNavBar title="款式列表"/>
      <form action="javascript:return true">
      <van-search
          @search="search"
          v-model="styleName"
          placeholder="请输入款式名称或编号"/>
      </form>
      <van-dropdown-menu>
        <van-dropdown-item :title="styleText" v-model="styleType" @change="styleTypeChange" :options="styleTypeArray"/>
        <!--        <van-dropdown-item :title="gradeText" v-model="grade" @change="gradeChange" :options="gradeArray"/>-->
        <!--        <van-dropdown-item :title="stateText" v-model="state" @change="stateChange" :options="stateArray"/>-->
        <van-dropdown-item title="款式标签" ref="labelRef">
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
        <van-dropdown-item :title="brandText" @change="brandChange" v-model="brand" :options="styleBrandArray"/>
        <!--        <van-dropdown-item :title="serviceText" v-model="service" @change="serviceChange" :options="serviceArray" />-->
      </van-dropdown-menu>

    </van-sticky>
    <div>
      <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad"
          finished-text="没有更多了">
        <van-cell style="font-size: 12px">
          <van-row gutter="20">
            <van-col span="12"  v-for="item in styleList" :key="item.id" @click="toStyleDetails(item)" style="text-align: center">
              <van-image class="style-img" radius="7"
                         :src="'https://clothes-image-1304365928.cos.ap-shanghai.myqcloud.com/'+item.styleImage"/>
              <div class="styleInfo">
                <p>{{ item.typeName + item.styleName }}</p>
                <p>{{ item.styleAlias }}</p>
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
  name: "styleList",
  data() {
    return {
      tenantCrop: localStorage.getItem("tenantCrop"),
      styleName: "",
      styleText: "",
      styleType: "",
      styleTypeArray: [{text: "款式类型", value: ""}],
      loading: false,
      finished: false,
      styleList: [],
      styleLabelList: [],
      styleLabels: [],
      isactive: false,
      brandText:"",
      brand:"",
      styleBrandArray: [{text: "款式品牌", value: ""}],
      page: 1,
    }
  }
  , created() {
    this.queryStyleList()
    this.queryStyleType()
    this.queryStyleLabelList()
    this.queryClothesBrand()
  }
  , components: {
    baseNavBar
  }
  , methods: {
    queryStyleList: function () {
      this.loading = true
      this.$axios({
        method: "get",
        url: '/style/mStyleList',
        params: {
          page: this.page,
          limit:20,
          styleName: this.styleName,
          styleType: this.styleType,
          tenantCrop: this.tenantCrop,
          styleLabels: this.styleLabels.toString(),
          brandName: this.brand,
        }
      }).then(response => {
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
      this.$router.push({name: "styleDetails", query: value})
    },
    queryStyleType: function () {
      this.$selectUtils.queryStyleIds(this.$selectUtils.DropDownMenu).then((response) => {
        this.styleTypeArray.push(...JSON.parse(response.data.data));
      })
    },
    queryStyleLabelList: function () {
      this.$selectUtils.queryStyleLabels().then((response) => {
        this.styleLabelList.push(...response.data.data);
      })
    },
    styleTypeChange: function (value) {
      this.styleType = value
      this.dataClear()
      this.queryStyleList();
    },
    styleLabelConfirm: function () {
      this.$refs.labelRef.toggle()
      this.dataClear()
      this.queryStyleList();
    },
    pushStyleLabel: function (value) {
      if (this.styleLabels.indexOf(value) > -1) {
        this.styleLabels.splice(this.styleLabels.indexOf(value, 0), 1)
      } else {
        this.styleLabels.push(value)
      }
    },
    brandChange: function () {
      this.dataClear()
      this.queryStyleList();
    },
    queryClothesBrand: function () {
      this.$selectUtils.queryMBrandIds().then((response) => {
        this.styleBrandArray.push(...JSON.parse(response.data.data))
      })
    },
    onLoad() {
      setTimeout(this.queryStyleList, 1000)
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
.tag-padding {
  margin-left: 5px;
  margin-right: 5px;
}

.bgcolor {
  border: 1px solid #de0d0d;
  color: rgb(182, 177, 189);
}
p{
  font-size: 15px;
  margin: 0 !important;
}
.styleInfo{
  margin-bottom: 10px;
}
.van-image {
  height: 240px;
}

.style-img {
  width: 100%;
}
</style>
